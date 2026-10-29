import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  Download,
  Search,
  FileText,
  Filter,
  CheckCircle,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  Database,
  Upload,
  HardDrive,
  Cloud,
  Check,
  AlertCircle,
  Trash2,
  FolderOpen,
} from 'lucide-react';
import { PDF_ARCHIVE_CATALOG, PDFDocEntry } from '../data/pdfArchiveData';
import { cyberpunkDB } from '../services/db';

export const DigitalArchivePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>('Todas');
  const [selectedSys, setSelectedSys] = useState<string>('Todos');

  // IndexedDB Vault state
  const [vaultDocs, setVaultDocs] = useState<Record<string, boolean>>({});
  const [isUploadingToVault, setIsUploadingToVault] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cloud Mirror Settings
  const [customCloudUrl, setCustomCloudUrl] = useState<string>(() => {
    return localStorage.getItem('cyberpunk_custom_cloud_pdf_url') || '';
  });
  const [showCloudSettings, setShowCloudSettings] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadDocId, setActiveUploadDocId] = useState<string | null>(null);

  const CATEGORIES = ['Todas', 'Livro Básico', 'Suplemento', 'DLC / Expansão Gratuita', 'Fichas Oficiais'];
  const SYSTEMS = ['Todos', 'RED', '2020'];

  // Load vault status on mount
  useEffect(() => {
    loadVaultStatus();
  }, []);

  const loadVaultStatus = async () => {
    try {
      const stored = await cyberpunkDB.getAllVaultPdfs();
      const map: Record<string, boolean> = {};
      stored.forEach(d => {
        map[d.id] = true;
      });
      setVaultDocs(map);
    } catch (e) {
      console.warn('Erro ao carregar cofre IndexedDB:', e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Smart Download Handler
  const handleSmartDownload = async (doc: PDFDocEntry) => {
    // 1. Check if stored in IndexedDB Vault
    if (vaultDocs[doc.id]) {
      try {
        const vaultDoc = await cyberpunkDB.getPdfFromVault(doc.id);
        if (vaultDoc && vaultDoc.data) {
          const blob = vaultDoc.data instanceof Blob ? vaultDoc.data : new Blob([vaultDoc.data], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = doc.name;
          link.click();
          URL.revokeObjectURL(url);
          showToast(`✓ Baixando "${doc.name}" diretamente do Banco Local IndexedDB (100% Offline)!`);
          return;
        }
      } catch (err) {
        console.warn('Erro ao carregar do cofre:', err);
      }
    }

    // 2. Check if official character sheet (served directly from /sheets/ on Vercel)
    if (doc.downloadUrl.startsWith('/sheets/')) {
      const link = document.createElement('a');
      link.href = doc.downloadUrl;
      link.download = doc.name;
      link.click();
      showToast(`✓ Baixando ficha oficial "${doc.name}" do servidor!`);
      return;
    }

    // 3. Try local fetch; if 404 (happens on Vercel for uncommitted large PDFs), fallback to mirror/cloud
    try {
      const res = await fetch(doc.downloadUrl, { method: 'HEAD' });
      if (res.ok) {
        const link = document.createElement('a');
        link.href = doc.downloadUrl;
        link.download = doc.name;
        link.click();
        showToast(`✓ Baixando "${doc.name}" do servidor local!`);
        return;
      }
    } catch {}

    // 4. Fallback: Custom Cloud URL or Official RTG Mirror
    if (customCloudUrl.trim()) {
      const trimmed = customCloudUrl.trim().replace(/\/$/, '');
      const cloudLink = `${trimmed}/${doc.name}`;
      window.open(cloudLink, '_blank');
      showToast(`↗ Abrindo "${doc.name}" na sua Nuvem configurada!`);
      return;
    }

    // 5. Official R. Talsorian Games download portal fallback
    if (doc.mirrorUrl) {
      window.open(doc.mirrorUrl, '_blank');
      showToast(`↗ Abrindo mirror oficial da R. Talsorian Games!`);
      return;
    }

    // Default: Open R. Talsorian Games DLC page
    window.open('https://rtalsoriangames.com/downloadable-content/', '_blank');
    showToast(`ℹ️ Arquivo não empacotado no build leve do Vercel. Redirecionando para o portal oficial da R. Talsorian!`);
  };

  // Upload Local PDF File into Persistent IndexedDB
  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingToVault(true);
    try {
      const targetId = activeUploadDocId || `custom-pdf-${Date.now()}`;
      const docName = file.name;
      const arrayBuffer = await file.arrayBuffer();

      await cyberpunkDB.savePdfToVault({
        id: targetId,
        name: docName,
        title: file.name.replace(/\.pdf$/i, ''),
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        category: 'Manual do Usuário',
        data: arrayBuffer,
      });

      await loadVaultStatus();
      showToast(`✓ PDF "${file.name}" salvo com sucesso no Banco de Dados IndexedDB do seu navegador!`);
    } catch (err: any) {
      showToast(`Erro ao salvar no banco local: ${err?.message || 'Arquivo muito grande'}`);
    } finally {
      setIsUploadingToVault(false);
      setActiveUploadDocId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleTriggerUpload = (docId?: string) => {
    setActiveUploadDocId(docId || null);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteFromVault = async (docId: string, docName: string) => {
    if (!confirm(`Remover "${docName}" do Banco Local IndexedDB?`)) return;
    try {
      await cyberpunkDB.deletePdfFromVault(docId);
      await loadVaultStatus();
      showToast(`Documento removido do Banco Local.`);
    } catch (e) {
      console.warn(e);
    }
  };

  const filteredPdfs = PDF_ARCHIVE_CATALOG.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'Todas' || doc.category === selectedCat;
    const matchesSys = selectedSys === 'Todos' || doc.system === selectedSys;
    return matchesSearch && matchesCat && matchesSys;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-zinc-900 border border-red-500/80 text-zinc-100 font-mono text-xs shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-zinc-500 hover:text-zinc-300 ml-2">✕</button>
        </div>
      )}

      {/* Hidden File Input for IndexedDB PDF Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/40 font-bold">
              Base de Dados Persistente // IndexedDB & Vercel
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <Database className="w-3 h-3 text-emerald-400" /> {Object.keys(vaultDocs).length} PDFs no Banco Local
            </span>
          </div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2 mt-1">
            <BookOpen className="w-5 h-5 text-red-500" />
            <span>Biblioteca Digital de Manuais, Fichas & Expansões</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Download direto de fichas oficiais preenchíveis hospedadas no Vercel, espelhos oficiais da R. Talsorian Games e cofre persistente no IndexedDB.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => handleTriggerUpload()}
            className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1.5 transition"
            title="Importar qualquer arquivo PDF do seu computador para o Banco Local IndexedDB"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Guardar PDF no Banco Local</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCloudSettings(!showCloudSettings)}
            className="px-3 py-1.5 rounded-xl bg-[#14141a] hover:bg-zinc-800 border border-[#27272a] text-zinc-300 flex items-center gap-1.5 transition"
            title="Configurar pasta de PDFs no Google Drive ou Nuvem"
          >
            <Cloud className="w-3.5 h-3.5 text-amber-400" />
            <span>Nuvem Própria</span>
          </button>
        </div>
      </div>

      {/* Cloud Mirror Settings Drawer */}
      {showCloudSettings && (
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-amber-900/40 space-y-3 animate-in fade-in duration-150 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-amber-300 font-bold flex items-center gap-2">
              <Cloud className="w-4 h-4 text-amber-400" />
              <span>Configuração de Nuvem Própria (Google Drive, OneDrive ou Servidor)</span>
            </span>
            <button onClick={() => setShowCloudSettings(false)} className="text-zinc-500 hover:text-zinc-300">✕</button>
          </div>
          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
            Se você possui seus manuais em uma pasta pública do Google Drive, Dropbox ou servidor pessoal, cole a URL base aqui. Quando você estiver no Vercel, qualquer livro solicitado abrirá diretamente da sua nuvem.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={customCloudUrl}
              onChange={e => {
                setCustomCloudUrl(e.target.value);
                localStorage.setItem('cyberpunk_custom_cloud_pdf_url', e.target.value);
              }}
              placeholder="Ex: https://meu-servidor.com/cyberpunk-pdfs/ ou link da pasta compartilhada"
              className="flex-1 bg-[#0a0a0d] border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 text-xs focus:outline-none focus:border-amber-500"
            />
            <button
              onClick={() => {
                localStorage.setItem('cyberpunk_custom_cloud_pdf_url', customCloudUrl);
                showToast('URL da nuvem salva com sucesso!');
                setShowCloudSettings(false);
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition"
            >
              Salvar
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por título ou conteúdo (ex: Ficha, Easy Mode, Black Chrome, Weather, Gang Guide, 2020...)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-red-500 font-sans"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Sistema:</span>
            <div className="flex bg-[#0a0a0d] border border-[#27272a] rounded-lg p-0.5">
              {SYSTEMS.map(sys => (
                <button
                  key={sys}
                  onClick={() => setSelectedSys(sys)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition ${
                    selectedSys === sys
                      ? 'bg-zinc-800 text-zinc-100 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {sys}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-mono text-zinc-500 uppercase mr-1">Categoria:</span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                selectedCat === cat
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-[#0a0a0d] text-zinc-400 border border-[#27272a] hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-[11px] font-mono text-zinc-500 ml-auto">
            Exibindo {filteredPdfs.length} de {PDF_ARCHIVE_CATALOG.length}
          </span>
        </div>
      </div>

      {/* PDF Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPdfs.map(doc => {
          const isStoredInVault = !!vaultDocs[doc.id];
          const isOfficialSheet = doc.category === 'Fichas Oficiais' || doc.downloadUrl.startsWith('/sheets/');

          return (
            <div
              key={doc.id}
              className={`p-5 rounded-2xl bg-[#121217] border transition flex flex-col justify-between space-y-3 text-xs shadow-sm hover:border-zinc-700 ${
                isStoredInVault ? 'border-emerald-800/60 ring-1 ring-emerald-500/20' : 'border-[#27272a]'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                    isOfficialSheet
                      ? 'bg-red-950/80 text-red-300 border-red-800/40 font-bold'
                      : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                  }`}>
                    {doc.category}
                  </span>

                  <span className="text-[10px] font-mono text-zinc-400 bg-[#0a0a0d] px-2 py-0.5 rounded border border-zinc-800">
                    {doc.size}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-100 leading-snug line-clamp-2" title={doc.title}>
                    {doc.title}
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-500 truncate mt-0.5">{doc.name}</p>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                  <span className={`px-1.5 py-0.5 rounded ${doc.system === '2020' ? 'bg-amber-950/80 text-amber-300' : 'bg-red-950/80 text-red-300'}`}>
                    {doc.system}
                  </span>
                  <span>~{doc.pagesEstimate} páginas est.</span>
                </div>

                {doc.description && (
                  <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                )}
              </div>

              {/* Status and Action Buttons */}
              <div className="pt-3 border-t border-[#1f1f26] space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  {isStoredInVault ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <HardDrive className="w-3 h-3 text-emerald-400" /> Banco Local (IndexedDB)
                    </span>
                  ) : isOfficialSheet ? (
                    <span className="text-cyan-400 flex items-center gap-1 font-bold">
                      <CheckCircle className="w-3 h-3 text-cyan-400" /> Servido pelo Vercel
                    </span>
                  ) : (
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Cloud className="w-3 h-3 text-zinc-500" /> Mirror Oficial RTG
                    </span>
                  )}

                  {isStoredInVault && (
                    <button
                      type="button"
                      onClick={() => handleDeleteFromVault(doc.id, doc.name)}
                      className="text-zinc-500 hover:text-red-400 transition"
                      title="Remover arquivo do Banco Local IndexedDB"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSmartDownload(doc)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar PDF</span>
                  </button>

                  {!isStoredInVault && (
                    <button
                      type="button"
                      onClick={() => handleTriggerUpload(doc.id)}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
                      title="Salvar este arquivo PDF no Banco Local IndexedDB para nunca depender da internet"
                    >
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
