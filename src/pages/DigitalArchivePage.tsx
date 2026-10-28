import React, { useState } from 'react';
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
} from 'lucide-react';
import { PDF_ARCHIVE_CATALOG, PDFDocEntry } from '../data/pdfArchiveData';

export const DigitalArchivePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>('Todas');
  const [selectedSys, setSelectedSys] = useState<string>('Todos');

  const CATEGORIES = ['Todas', 'Livro Básico', 'Suplemento', 'DLC / Expansão Gratuita', 'Fichas Oficiais'];
  const SYSTEMS = ['Todos', 'RED', '2020'];

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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-red-500" />
            <span>Biblioteca Digital de Manuais, DLCs & Fichas</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Total de {PDF_ARCHIVE_CATALOG.length} manuais e expansões digitais indexados no workspace. Todos os arquivos estão disponíveis para download direto.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-[#14141a] border border-[#27272a] text-zinc-300">
            Total: <strong className="text-red-400">{PDF_ARCHIVE_CATALOG.length} PDFs</strong> (999.8 MB)
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por nome ou conteúdo (ex: Easy Mode, Black Chrome, Weather, Gang Guide, Ficha, 2020...)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
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
        {filteredPdfs.map(doc => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] hover:border-zinc-700 transition flex flex-col justify-between space-y-3 text-xs shadow-sm"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {doc.category}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-[#0a0a0d] px-2 py-0.5 rounded border border-zinc-800">
                  {doc.size}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-zinc-100 leading-snug" title={doc.title}>
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
            </div>

            <div className="pt-3 border-t border-[#1f1f26] flex items-center justify-between">
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-500" /> Pronto no Host
              </span>

              <a
                href={doc.downloadUrl}
                download={doc.name}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-xs transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Baixar PDF</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
