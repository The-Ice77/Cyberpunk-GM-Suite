import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Check,
  Trash2,
  Sparkles,
  Camera,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { CYBERPUNK_IMAGE_PRESETS, PresetImageItem } from '../../utils/itemIcons';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl?: string;
  onSave: (url: string) => void;
  title?: string;
  presetCategory?: 'all' | 'personagem' | 'inimigo' | 'pet' | 'veiculo' | 'arma' | 'cromo';
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  currentImageUrl = '',
  onSave,
  title = 'Configurar Imagem / Foto',
  presetCategory = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [selectedUrl, setSelectedUrl] = useState<string>(currentImageUrl || '');
  const [urlInput, setUrlInput] = useState<string>(currentImageUrl || '');
  const [previewError, setPreviewError] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>(
    presetCategory === 'all' ? 'todos' : presetCategory
  );

  useEffect(() => {
    setSelectedUrl(currentImageUrl || '');
    setUrlInput(currentImageUrl || '');
    setPreviewError(false);
  }, [currentImageUrl, isOpen]);

  if (!isOpen) return null;

  // Handle local file upload via FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione um arquivo de imagem válido (PNG, JPG, WEBP, GIF).');
      return;
    }

    // Limit size if too huge (e.g. max 5MB for base64)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem é muito grande. Escolha uma imagem com menos de 5MB para melhor desempenho.');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      const result = event.target?.result as string;
      if (result) {
        setSelectedUrl(result);
        setUrlInput(result);
        setPreviewError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      setSelectedUrl(trimmed);
      setPreviewError(false);
    }
  };

  const handleSave = () => {
    onSave(selectedUrl);
    onClose();
  };

  const handleClear = () => {
    setSelectedUrl('');
    setUrlInput('');
    setPreviewError(false);
  };

  const filteredPresets = CYBERPUNK_IMAGE_PRESETS.filter(item => {
    if (selectedCategoryFilter === 'todos') return true;
    return item.category === selectedCategoryFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111116] border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-[#161620]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-950/60 border border-purple-600/40 text-purple-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>{title}</span>
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono">
                Upload local do seu PC, URL da internet ou galeria cyberpunk
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Top Live Preview Banner */}
          <div className="p-3.5 rounded-xl bg-[#0b0b0e] border border-zinc-800 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700/60 shrink-0 flex items-center justify-center group shadow-inner">
              {selectedUrl && !previewError ? (
                <img
                  src={selectedUrl}
                  alt="Prévia"
                  onError={() => setPreviewError(true)}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                />
              ) : (
                <div className="text-center p-2 text-zinc-500 flex flex-col items-center">
                  <ImageIcon className="w-8 h-8 text-zinc-600 mb-1" />
                  <span className="text-[10px] font-mono">Sem imagem</span>
                </div>
              )}

              {previewError && (
                <div className="absolute inset-0 bg-red-950/80 flex flex-col items-center justify-center text-red-300 p-2 text-center text-[10px] font-mono">
                  <AlertCircle className="w-5 h-5 text-red-400 mb-1" />
                  Erro ao carregar URL
                </div>
              )}
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div>
                <span className="text-[11px] font-mono font-bold text-zinc-300 block">
                  Status da Imagem Selecionada:
                </span>
                <span className="text-xs text-zinc-400 font-mono break-all line-clamp-2">
                  {selectedUrl ? (
                    selectedUrl.startsWith('data:image') ? (
                      <span className="text-emerald-400">✓ Imagem carregada do arquivo local (Base64)</span>
                    ) : (
                      <span className="text-cyan-400">{selectedUrl}</span>
                    )
                  ) : (
                    'Nenhuma imagem definida (será usado o ícone padrão do sistema)'
                  )}
                </span>
              </div>

              {selectedUrl && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 text-xs font-mono flex items-center gap-1.5 transition inline-flex"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remover Imagem Atual</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'presets'
                  ? 'bg-purple-600 text-white font-bold shadow'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Galeria Pronta</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-purple-600 text-white font-bold shadow'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload do Computador</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'url'
                  ? 'bg-purple-600 text-white font-bold shadow'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>URL Externa</span>
            </button>
          </div>

          {/* TAB 1: PRESET GALLERY */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'personagem', label: 'Personagens' },
                  { id: 'inimigo', label: 'Inimigos / Gangues' },
                  { id: 'pet', label: 'Pets & Biopets' },
                  { id: 'veiculo', label: 'Veículos' },
                  { id: 'arma', label: 'Armas' },
                  { id: 'cromo', label: 'Cromos / Ciberware' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] transition ${
                      selectedCategoryFilter === cat.id
                        ? 'bg-purple-950/60 border-purple-500 text-purple-300 font-bold'
                        : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Grid of presets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {filteredPresets.map(preset => {
                  const isSelected = selectedUrl === preset.url;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setSelectedUrl(preset.url);
                        setUrlInput(preset.url);
                        setPreviewError(false);
                      }}
                      className={`group relative rounded-xl overflow-hidden border p-1 text-left transition ${
                        isSelected
                          ? 'border-purple-500 bg-purple-950/40 ring-2 ring-purple-500/50'
                          : 'border-zinc-800 bg-[#0a0a0d] hover:border-zinc-600'
                      }`}
                    >
                      <div className="w-full h-24 rounded-lg overflow-hidden bg-zinc-900 relative">
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 p-1 rounded-full bg-purple-600 text-white shadow">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="p-1">
                        <div className="text-[11px] font-bold text-zinc-200 truncate">{preset.name}</div>
                        <div className="text-[9px] font-mono text-zinc-500 uppercase">{preset.category}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD FROM LOCAL PC */}
          {activeTab === 'upload' && (
            <div className="p-6 rounded-2xl bg-[#0a0a0d] border border-dashed border-zinc-700 hover:border-purple-500 transition text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-950/40 border border-purple-800/40 text-purple-400 flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-zinc-100">
                  Selecione uma imagem do seu computador
                </div>
                <p className="text-xs text-zinc-400">
                  Arquivos suportados: PNG, JPG, JPEG, WEBP, GIF (máximo 5MB).
                </p>
                <p className="text-[11px] font-mono text-emerald-400">
                  A imagem é salva diretamente no navegador e funciona offline!
                </p>
              </div>

              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-mono text-xs font-bold transition cursor-pointer shadow-lg shadow-purple-950/40">
                <Camera className="w-4 h-4" />
                <span>Escolher Arquivo no Disco...</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* TAB 3: EXTERNAL URL */}
          {activeTab === 'url' && (
            <div className="space-y-4 p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono text-zinc-300">
                  Cole o endereço direto da imagem (URL com https://):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    placeholder="https://exemplo.com/minha-imagem.jpg"
                    className="flex-1 bg-[#121217] border border-zinc-700 rounded-xl p-2.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-medium transition shrink-0"
                  >
                    Testar / Carregar
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                Você pode utilizar qualquer link público de imagem do Discord, Pinterest, Unsplash, Imgur ou do seu servidor pessoal.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-t border-zinc-800 bg-[#161620]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs font-medium transition"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-mono text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-950/50"
          >
            <Check className="w-4 h-4" />
            <span>Confirmar e Salvar Imagem</span>
          </button>
        </div>
      </div>
    </div>
  );
};
