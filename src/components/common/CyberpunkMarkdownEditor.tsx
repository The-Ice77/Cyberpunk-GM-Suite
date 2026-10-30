import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Table,
  Minus,
  Dices,
  Maximize2,
  Minimize2,
  Eye,
  Edit3,
  Columns,
  Copy,
  Check,
  Link as LinkIcon,
  Image as ImageIcon,
} from 'lucide-react';
import { CyberpunkMarkdown } from './CyberpunkMarkdown';

export interface CyberpunkMarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minRows?: number;
  label?: string;
  badge?: string;
  className?: string;
  allowSplitView?: boolean;
}

export const CyberpunkMarkdownEditor: React.FC<CyberpunkMarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = 'Escreva suas anotações em Markdown aqui...',
  minRows = 6,
  label,
  badge = 'GFM Ativo',
  className = '',
  allowSplitView = true,
}) => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keyboard shortcut listener
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+B: Bold
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      insertFormatting('**', '**');
    }
    // Ctrl+I: Italic
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      insertFormatting('*', '*');
    }
    // Tab key: Indent
    else if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Helper to wrap selected text with markdown prefixes/suffixes
  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = 'texto') => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end);
    const contentToInsert = selected.length > 0 ? selected : defaultText;

    const replacement = `${prefix}${contentToInsert}${suffix}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      ta.focus();
      const newCursorStart = start + prefix.length;
      const newCursorEnd = newCursorStart + contentToInsert.length;
      ta.setSelectionRange(newCursorStart, newCursorEnd);
    }, 10);
  };

  // Insert template text at current cursor or newline
  const insertBlock = (template: string) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const isAtLineStart = start === 0 || value[start - 1] === '\n';
    const prefix = isAtLineStart ? '' : '\n';

    const newValue = value.substring(0, start) + prefix + template + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      ta.focus();
      const newCursor = start + prefix.length + template.length;
      ta.setSelectionRange(newCursor, newCursor);
    }, 10);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Statistics
  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const lineCount = value.split('\n').length;

  const contentContainer = (
    <div className={`flex flex-col bg-[#0c0c11] border border-[#27272a] rounded-2xl overflow-hidden shadow-xl transition-all ${className} ${
      isFullscreen ? 'fixed inset-4 z-50 rounded-2xl border-red-500/80 shadow-2xl bg-[#09090d]' : ''
    }`}>
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-3.5 py-2.5 bg-[#121218] border-b border-[#27272a] gap-2">
        {/* Label & Active Badge */}
        <div className="flex items-center gap-2">
          {label && (
            <span className="text-xs font-mono font-bold text-zinc-200 tracking-wider uppercase flex items-center gap-1.5">
              <span>{label}</span>
            </span>
          )}
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/50 text-red-400 border border-red-800/50">
            {badge}
          </span>
        </div>

        {/* View Mode Buttons & Actions */}
        <div className="flex items-center gap-1.5 ml-auto">
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition ${
                viewMode === 'edit'
                  ? 'bg-zinc-800 text-white font-bold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Modo de Edição"
            >
              <Edit3 className="w-3.5 h-3.5 text-red-400" />
              <span>Escrever</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition ${
                viewMode === 'preview'
                  ? 'bg-zinc-800 text-white font-bold shadow-xs'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Pré-visualizar Markdown Formatado"
            >
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Visualizar</span>
            </button>
            {allowSplitView && (
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`hidden md:flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition ${
                  viewMode === 'split'
                    ? 'bg-zinc-800 text-white font-bold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Lado a Lado (Editor e Pré-visualização simultâneos)"
              >
                <Columns className="w-3.5 h-3.5 text-amber-400" />
                <span>Split</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopyAll}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition"
            title="Copiar texto Markdown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition"
            title={isFullscreen ? 'Sair da Tela Cheia' : 'Expandir para Tela Cheia'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-amber-400" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Formatting Toolbar (Visible in edit or split mode) */}
      {(viewMode === 'edit' || viewMode === 'split') && (
        <div className="flex flex-wrap items-center gap-1 px-3 py-1.5 bg-[#0e0e14] border-b border-[#27272a] text-zinc-400">
          {/* Headings */}
          <div className="flex items-center gap-0.5 pr-1.5 border-r border-zinc-800">
            <button
              type="button"
              onClick={() => insertFormatting('# ', '', 'Título 1')}
              className="p-1 rounded hover:bg-zinc-800 hover:text-white transition"
              title="Título H1"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('## ', '', 'Título 2')}
              className="p-1 rounded hover:bg-zinc-800 hover:text-white transition"
              title="Título H2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('### ', '', 'Título 3')}
              className="p-1 rounded hover:bg-zinc-800 hover:text-white transition"
              title="Título H3"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Text Styles */}
          <div className="flex items-center gap-0.5 px-1.5 border-r border-zinc-800">
            <button
              type="button"
              onClick={() => insertFormatting('**', '**', 'negrito')}
              className="p-1 rounded hover:bg-zinc-800 hover:text-white transition"
              title="Negrito (Ctrl+B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('*', '*', 'itálico')}
              className="p-1 rounded hover:bg-zinc-800 hover:text-white transition"
              title="Itálico (Ctrl+I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('~~', '~~', 'tachado')}
              className="p-1 rounded hover:bg-zinc-800 hover:text-white transition"
              title="Tachado"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('`', '`', 'código')}
              className="p-1 rounded hover:bg-zinc-800 hover:text-cyan-400 transition"
              title="Código em linha"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Lists and Tasks */}
          <div className="flex items-center gap-0.5 px-1.5 border-r border-zinc-800">
            <button
              type="button"
              onClick={() => insertBlock('- Item de lista')}
              className="p-1 rounded hover:bg-zinc-800 hover:text-white transition"
              title="Lista com marcadores"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertBlock('1. Primeiro item')}
              className="p-1 rounded hover:bg-zinc-800 hover:text-white transition"
              title="Lista numerada"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertBlock('- [ ] Tarefa a realizar\n- [x] Tarefa concluída')}
              className="p-1 rounded hover:bg-zinc-800 hover:text-emerald-400 transition"
              title="Checklist / Lista de Tarefas"
            >
              <CheckSquare className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cyberpunk Callouts & Quote */}
          <div className="flex items-center gap-0.5 px-1.5 border-r border-zinc-800">
            <button
              type="button"
              onClick={() => insertFormatting('> ', '', 'Citação simples')}
              className="p-1 rounded hover:bg-zinc-800 hover:text-white transition"
              title="Citação"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertBlock('> [!AVISO]\n> Cuidado com as patrulhas da Arasaka na área.')}
              className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-950/40 text-amber-300 hover:bg-amber-900/60 border border-amber-800/40 transition"
              title="Alerta de Perigo"
            >
              ⚠️ Aviso
            </button>
            <button
              type="button"
              onClick={() => insertBlock('> [!DICA]\n> Use portas de ventilação para contornar câmeras.')}
              className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800/40 transition"
              title="Dica de Mestre"
            >
              💡 Dica
            </button>
            <button
              type="button"
              onClick={() => insertBlock('> [!DANGER]\n> Alerta Trauma Team! Zona sob fogo pesado.')}
              className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-800/40 transition"
              title="Alerta Crítico"
            >
              💀 Crítico
            </button>
          </div>

          {/* Templates & Utilities */}
          <div className="flex items-center gap-0.5 px-1.5">
            <button
              type="button"
              onClick={() =>
                insertBlock(
                  '| Item / Equipamento | Qtd | Custo (eb) |\n| :--- | :---: | :--- |\n| Heavy Pistol (3d6) | 1 | 100eb |\n| Cinto de Munição | 2 | 20eb |'
                )
              }
              className="p-1 rounded hover:bg-zinc-800 hover:text-cyan-400 transition"
              title="Inserir Tabela Modelo"
            >
              <Table className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => insertBlock('```netrun\n// Protocolo de Invasão\nICE_BREAKER.exec();\n```')}
              className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 border border-cyan-800/40 transition"
              title="Bloco de Código Netrun"
            >
              {`{ }`} Bloco
            </button>

            <button
              type="button"
              onClick={() => insertFormatting('[', '](https://url)', 'texto do link')}
              className="p-1 rounded hover:bg-zinc-800 hover:text-cyan-400 transition"
              title="Inserir Link"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting('![', '](https://imagem.jpg)', 'descrição da imagem')}
              className="p-1 rounded hover:bg-zinc-800 hover:text-cyan-400 transition"
              title="Inserir Imagem"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertBlock('---')}
              className="p-1 rounded hover:bg-zinc-800 hover:text-white transition"
              title="Linha Divisória"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => insertFormatting('[Rolar: ', ']', '3d6')}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-800/60 transition"
              title="Inserir Botão de Rolagem de Dados Interativo"
            >
              <Dices className="w-3 h-3 text-red-400" />
              <span>Dado RED</span>
            </button>
          </div>
        </div>
      )}

      {/* Editor & Preview Area */}
      <div className={`flex-1 overflow-hidden ${isFullscreen ? 'min-h-[500px]' : ''}`}>
        {viewMode === 'edit' && (
          <textarea
            ref={textareaRef}
            rows={isFullscreen ? 24 : minRows}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full h-full p-4 bg-[#0a0a0f] text-zinc-100 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-y selection:bg-red-950 selection:text-red-200"
          />
        )}

        {viewMode === 'preview' && (
          <div className={`p-4 bg-[#09090e] overflow-y-auto ${isFullscreen ? 'h-[75vh]' : 'min-h-[160px]'}`}>
            {value.trim() ? (
              <CyberpunkMarkdown content={value} />
            ) : (
              <div className="text-zinc-600 font-mono text-xs italic py-8 text-center">
                (Nenhum conteúdo para visualizar. Escreva algo na aba "Escrever")
              </div>
            )}
          </div>
        )}

        {viewMode === 'split' && (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#27272a] h-full">
            <textarea
              ref={textareaRef}
              rows={isFullscreen ? 24 : minRows}
              value={value}
              onChange={e => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full h-full p-4 bg-[#0a0a0f] text-zinc-100 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none resize-none selection:bg-red-950 selection:text-red-200"
            />
            <div className={`p-4 bg-[#09090e] overflow-y-auto ${isFullscreen ? 'h-[75vh]' : 'max-h-[500px]'}`}>
              {value.trim() ? (
                <CyberpunkMarkdown content={value} />
              ) : (
                <div className="text-zinc-600 font-mono text-xs italic py-8 text-center">
                  (Pré-visualização em tempo real...)
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#0e0e14] border-t border-[#27272a] text-[10px] font-mono text-zinc-500">
        <div className="flex items-center gap-3">
          <span>{charCount} caracteres</span>
          <span>•</span>
          <span>{wordCount} palavras</span>
          <span>•</span>
          <span>{lineCount} linhas</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Pronto
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isFullscreen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          onClick={() => setIsFullscreen(false)}
        />
      )}
      {contentContainer}
    </>
  );
};
