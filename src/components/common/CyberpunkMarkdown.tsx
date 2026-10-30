import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Copy,
  Check,
  ExternalLink,
  Info,
  Lightbulb,
  AlertTriangle,
  Skull,
  Terminal,
  Dices,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';
import { parseAndRollDice, DiceRollResult } from '../../utils/diceRoller';

export interface CyberpunkMarkdownProps {
  content: string;
  className?: string;
  allowDiceRolls?: boolean;
}

// Helper to extract text from React children
function extractText(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node.props && node.props.children) return extractText(node.props.children);
  return '';
}

// Interactive Code Block with copy button and language badge
const CodeBlock: React.FC<{ language?: string; codeString: string }> = ({ language, codeString }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langDisplay = (language || 'NETRUN').toUpperCase();

  return (
    <div className="my-3 rounded-xl border border-zinc-800 bg-[#07070b] overflow-hidden shadow-lg group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#0e0e15] border-b border-zinc-800/80 font-mono text-[10px]">
        <div className="flex items-center gap-2 text-zinc-400">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500/80" />
            <span className="w-2 h-2 rounded-full bg-amber-500/80" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-zinc-500">|</span>
          <span className="text-cyan-400 font-bold tracking-wider">{langDisplay}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition font-mono text-[10px]"
          title="Copiar código"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-zinc-400" />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-3.5 overflow-x-auto text-xs font-mono text-zinc-200 leading-relaxed selection:bg-red-950 selection:text-red-200">
        <pre className="m-0 p-0 font-mono">
          <code>{codeString}</code>
        </pre>
      </div>
    </div>
  );
};

export const CyberpunkMarkdown: React.FC<CyberpunkMarkdownProps> = ({
  content,
  className = '',
  allowDiceRolls = true,
}) => {
  const [activeRoll, setActiveRoll] = useState<DiceRollResult | null>(null);

  const handleRollDice = (formula: string) => {
    const res = parseAndRollDice(formula);
    if (res) {
      setActiveRoll(res);
      setTimeout(() => setActiveRoll(null), 5000);
    }
  };

  // Pre-process content for explicit [Rolar: 3d6] or [roll: 3d6]
  const processedContent = content;

  return (
    <div className={`cyberpunk-markdown text-zinc-200 leading-relaxed select-text ${className}`}>
      {/* Toast Notification when a dice is rolled from Markdown */}
      {activeRoll && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div className="bg-[#121217] border-2 border-red-500/80 rounded-2xl p-4 shadow-2xl max-w-sm font-mono text-xs space-y-1.5 backdrop-blur-md">
            <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-800 pb-1">
              <span className="flex items-center gap-1.5 font-bold text-red-400 uppercase tracking-wider">
                <Dices className="w-4 h-4 text-red-500 animate-spin" />
                <span>Rolagem de Dados RED</span>
              </span>
              <span className="text-[10px] text-zinc-500">{activeRoll.formula}</span>
            </div>
            <div className="text-zinc-200 font-bold text-base flex items-baseline justify-between pt-1">
              <span>Resultado:</span>
              <span className="text-2xl text-amber-400 font-black">{activeRoll.total}</span>
            </div>
            <div className="text-[11px] text-zinc-400 break-words">{activeRoll.breakdown}</div>
            {activeRoll.isCritInjury && (
              <div className="mt-1 text-[10px] font-bold text-red-400 bg-red-950/60 border border-red-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                <Skull className="w-3 h-3 text-red-400" />
                <span>FERIMENTO CRÍTICO! (2+ Seis no Dano)</span>
              </div>
            )}
            {activeRoll.isExploded && (
              <div className="mt-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>D10 EXPLODIU! (+10 e rola novamente)</span>
              </div>
            )}
            {activeRoll.isFumbled && (
              <div className="mt-1 text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2 py-0.5 rounded flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>FALHA CRÍTICA NO D10! (-1 e subtrai extra)</span>
              </div>
            )}
          </div>
        </div>
      )}

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // ==============================
          // HEADINGS (Cyberpunk Hierarchy)
          // ==============================
          h1: ({ children }) => (
            <h1 className="text-lg sm:text-xl font-bold font-mono uppercase tracking-wider text-red-400 mt-4 mb-2 pb-1 border-b border-red-900/40 flex items-center gap-2">
              <span className="text-red-500 select-none">#</span>
              <span>{children}</span>
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base sm:text-lg font-bold font-mono uppercase tracking-wide text-amber-400 mt-3.5 mb-2 flex items-center gap-1.5">
              <span className="text-amber-500 select-none">##</span>
              <span>{children}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm sm:text-base font-bold font-mono text-cyan-400 mt-3 mb-1.5 flex items-center gap-1">
              <span className="text-cyan-500 select-none">###</span>
              <span>{children}</span>
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs sm:text-sm font-bold font-mono uppercase text-purple-300 mt-2.5 mb-1 tracking-wide">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-xs font-bold font-mono text-zinc-300 mt-2 mb-1 uppercase">{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-[11px] font-bold font-mono text-zinc-400 mt-1 mb-0.5 uppercase">{children}</h6>
          ),

          // ==============================
          // PARAGRAPHS & EMPHASIS
          // ==============================
          p: ({ children }) => (
            <p className="mb-2 last:mb-0 leading-relaxed text-zinc-300 text-xs sm:text-sm">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-white font-sans">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-zinc-200 font-serif">{children}</em>
          ),
          del: ({ children }) => (
            <del className="line-through text-zinc-500 decoration-red-500/70">{children}</del>
          ),

          // ==============================
          // LISTS (Ordered, Unordered, Tasks)
          // ==============================
          ul: ({ children }) => (
            <ul className="my-2.5 space-y-1.5 pl-2 list-none">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2.5 space-y-1.5 pl-6 list-decimal text-zinc-300 font-sans text-xs sm:text-sm">
              {children}
            </ol>
          ),
          li: ({ children, checked }: any) => {
            // Task list item with checkbox (GFM)
            if (typeof checked === 'boolean') {
              return (
                <li className="flex items-start gap-2 my-1 text-xs sm:text-sm text-zinc-300">
                  <span className="mt-0.5 flex-shrink-0">
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 fill-emerald-950/60" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-600 hover:text-zinc-400" />
                    )}
                  </span>
                  <span className={`flex-1 ${checked ? 'line-through text-zinc-500' : ''}`}>
                    {children}
                  </span>
                </li>
              );
            }

            // Normal unordered or ordered item
            return (
              <li className="flex items-start gap-2 text-zinc-300 text-xs sm:text-sm">
                <span className="text-red-500 font-bold select-none text-[12px] mt-0.5">&bull;</span>
                <span className="flex-1">{children}</span>
              </li>
            );
          },

          // ==============================
          // BLOCKQUOTES & CYBERPUNK CALLOUTS
          // ==============================
          blockquote: ({ children }) => {
            const rawText = extractText(children).trim();

            // Detect GitHub and Cyberpunk Alerts:
            // > [!NOTE] or > [!INFO]
            if (rawText.startsWith('[!NOTE]') || rawText.startsWith('[!INFO]') || rawText.startsWith('[DADOS]')) {
              return (
                <div className="my-3 rounded-xl border border-cyan-800/60 bg-cyan-950/20 p-3.5 text-xs text-cyan-200 space-y-1 shadow-sm">
                  <div className="flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider text-cyan-400 text-[11px]">
                    <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span>Transmissão Netwatch / Informação de Rede</span>
                  </div>
                  <div className="text-zinc-300 text-xs pl-5 leading-relaxed">
                    {children}
                  </div>
                </div>
              );
            }

            // > [!TIP] or > [!DICA]
            if (rawText.startsWith('[!TIP]') || rawText.startsWith('[!DICA]') || rawText.startsWith('[DICA DE MESTRE]')) {
              return (
                <div className="my-3 rounded-xl border border-emerald-800/60 bg-emerald-950/20 p-3.5 text-xs text-emerald-200 space-y-1 shadow-sm">
                  <div className="flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider text-emerald-400 text-[11px]">
                    <Lightbulb className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Dica Tática das Ruas / Edgerunner Tip</span>
                  </div>
                  <div className="text-zinc-300 text-xs pl-5 leading-relaxed">
                    {children}
                  </div>
                </div>
              );
            }

            // > [!WARNING] or > [!AVISO] or > [ALERTA]
            if (rawText.startsWith('[!WARNING]') || rawText.startsWith('[!AVISO]') || rawText.startsWith('[ALERTA]')) {
              return (
                <div className="my-3 rounded-xl border border-amber-800/60 bg-amber-950/20 p-3.5 text-xs text-amber-200 space-y-1 shadow-sm">
                  <div className="flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider text-amber-400 text-[11px]">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Aviso de Perigo / Alerta NCPD</span>
                  </div>
                  <div className="text-zinc-300 text-xs pl-5 leading-relaxed">
                    {children}
                  </div>
                </div>
              );
            }

            // > [!CAUTION] or > [!DANGER] or > [!CRITICAL] or > [!PERIGO] or > [TRAUMA TEAM]
            if (
              rawText.startsWith('[!CAUTION]') ||
              rawText.startsWith('[!DANGER]') ||
              rawText.startsWith('[!CRITICAL]') ||
              rawText.startsWith('[!PERIGO]') ||
              rawText.startsWith('[TRAUMA TEAM]')
            ) {
              return (
                <div className="my-3 rounded-xl border border-rose-800/80 bg-rose-950/30 p-3.5 text-xs text-rose-200 space-y-1 shadow-md">
                  <div className="flex items-center gap-1.5 font-mono font-bold uppercase tracking-wider text-rose-400 text-[11px]">
                    <Skull className="w-4 h-4 text-rose-400 flex-shrink-0 animate-pulse" />
                    <span>Protocolo de Risco Letal / Trauma Team Alerta Vermelho</span>
                  </div>
                  <div className="text-zinc-200 text-xs pl-5 leading-relaxed">
                    {children}
                  </div>
                </div>
              );
            }

            // Standard Cyberpunk Quote
            return (
              <blockquote className="my-2.5 pl-4 py-1.5 border-l-2 border-red-500 bg-[#121217]/50 rounded-r-xl text-zinc-300 italic text-xs leading-relaxed space-y-1">
                {children}
              </blockquote>
            );
          },

          // ==============================
          // INLINE & BLOCK CODE
          // ==============================
          code: ({ node, className, children, ...props }: any) => {
            const rawContent = String(children).replace(/\n$/, '');
            const match = /language-(\w+)/.exec(className || '');
            const hasMultipleLines = rawContent.includes('\n');

            // Check if this looks like a dice roll code: `3d6`, `1d10+4`
            const diceResult = allowDiceRolls ? parseAndRollDice(rawContent) : null;
            if (diceResult && !hasMultipleLines && !className) {
              return (
                <button
                  type="button"
                  onClick={() => handleRollDice(rawContent)}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 mx-0.5 rounded bg-red-950/80 hover:bg-red-900 border border-red-700/70 text-red-300 hover:text-white font-mono text-[11px] font-bold transition shadow-xs group"
                  title={`Clique para rolar ${rawContent} agora!`}
                >
                  <Dices className="w-3 h-3 text-red-400 group-hover:rotate-45 transition-transform" />
                  <span>{rawContent}</span>
                </button>
              );
            }

            // If it is block code (has language class or multiple lines)
            if (match || hasMultipleLines) {
              return <CodeBlock language={match ? match[1] : undefined} codeString={rawContent} />;
            }

            // Standard inline code
            return (
              <code
                className="px-1.5 py-0.5 mx-0.5 rounded bg-[#09090f] border border-zinc-800 text-cyan-300 font-mono text-[11px] font-semibold"
                {...props}
              >
                {children}
              </code>
            );
          },

          // ==============================
          // TABLES
          // ==============================
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-xl border border-zinc-800 bg-[#08080c] shadow-md">
              <table className="w-full border-collapse text-left text-xs font-mono">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#121218] border-b border-zinc-800 text-zinc-300 font-bold uppercase text-[10px] tracking-wider">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-zinc-800/60 font-sans text-xs">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-zinc-800/30 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="py-2.5 px-3 text-left font-bold text-cyan-300 border-r border-zinc-800/80 last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="py-2 px-3 border-r border-zinc-800/60 last:border-r-0 text-zinc-300">
              {children}
            </td>
          ),

          // ==============================
          // LINKS
          // ==============================
          a: ({ href, children }) => {
            const isExternal = href?.startsWith('http') || href?.startsWith('//');
            return (
              <a
                href={href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-0.5 text-cyan-400 hover:text-cyan-300 underline underline-offset-2 decoration-cyan-500/40 hover:decoration-cyan-400 font-medium transition"
              >
                <span>{children}</span>
                {isExternal && <ExternalLink className="w-2.5 h-2.5 inline-block opacity-75" />}
              </a>
            );
          },

          // ==============================
          // HORIZONTAL DIVIDERS
          // ==============================
          hr: () => (
            <hr className="my-4 border-0 h-[1px] bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />
          ),

          // ==============================
          // IMAGES
          // ==============================
          img: ({ src, alt }) => (
            <span className="block my-3">
              <img
                src={src}
                alt={alt}
                className="max-h-96 rounded-xl border border-zinc-800 object-cover shadow-lg mx-auto"
                loading="lazy"
              />
              {alt && (
                <span className="block text-center text-[10px] text-zinc-500 font-mono mt-1 italic">
                  {alt}
                </span>
              )}
            </span>
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};
