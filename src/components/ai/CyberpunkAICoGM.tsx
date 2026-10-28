import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Key, Sparkles, Terminal, Shield, RefreshCw, Copy, Check, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { askCyberpunkAI, ChatMessage } from '../../services/aiService';
import { useCampaign } from '../../context/CampaignContext';

interface AICoGMDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CyberpunkAICoGM: React.FC<AICoGMDrawerProps> = ({ isOpen, onClose }) => {
  const { notes } = useCampaign();
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('cyberpunk_gemini_api_key') || '';
  });
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: `🤖 **Neural Co-GM Online.**

Sou seu copiloto tático e narrativo em Night City. Conheço todas as regras oficiais de **Cyberpunk RED** e **Cyberpunk 2020**.

### 🎯 Como Posso Ajudar na Mesa:
- **Resolução de Regras:** Cálculos exatos de *DVs*, Fogo Automático, Evasão e Blindagem (*SP*).
- **Improviso de Cenas:** Ganchos de missões clandestinas, encontros de rua e complicações táticas.
- **Dossiês de Facções:** Estatísticas, armas de assinatura e comportamento de combate das 43 gangues.
- **Clima Extremo:** Condições atmosféricas tóxicas do *Night City Weather DLC*.

> *"Em Night City, um segundo de hesitação é a diferença entre virar lenda no Afterlife ou cadáver na sarjeta."*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('cyberpunk_gemini_api_key', key);
    setShowKeyModal(false);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    if (window.confirm('Deseja limpar todo o histórico de mensagens do Co-GM?')) {
      setMessages([
        {
          id: 'msg-' + Date.now(),
          sender: 'assistant',
          text: '🔄 **Córtex Neural Reinicializado.**\nPronto para novas consultas táticas e regras de Night City.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputPrompt('');
    setLoading(true);

    try {
      const response = await askCyberpunkAI(query.trim(), apiKey, notes);
      const aiMsg: ChatMessage = {
        id: 'ai-' + Date.now(),
        sender: 'assistant',
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: 'err-' + Date.now(),
        sender: 'system',
        text: `⚠️ **Erro de Conexão Neural:** ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_PROMPT_CHIPS = [
    'Regra de Fogo Automático vs Esquiva',
    'Gerar Gancho de Missão Imediato',
    'Dossiê e Táticas da Maelstrom',
    'Interpretar Ferimento Crítico no Corpo',
    'Boletim de Clima Tóxico Agora',
    'Tabela de Alcance e DVs de Armas',
  ];

  return (
    <>
      {/* Mobile & Desktop Dimmer Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-[#0c0c10] border-l border-[#27272a] shadow-2xl flex flex-col font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272a] bg-[#121217]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-950/60 border border-red-800/40">
            <Bot className="w-4 h-4 text-red-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-100 font-mono tracking-wider uppercase flex items-center gap-2">
              <span>Neural Co-GM</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-950/80 border border-red-800 text-red-300 font-mono">
                IA 1.5
              </span>
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              {apiKey ? 'Conexão Ativa: Google Gemini Flash' : 'Modo Oracle Offline Ativo'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800/80 transition"
            title="Limpar Histórico de Mensagens"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowKeyModal(true)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/80 transition"
            title="Configurar Chave da API Gemini"
          >
            <Key className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(m => {
          const isUser = m.sender === 'user';
          const isSystem = m.sender === 'system';

          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
            >
              <div
                className={`max-w-[92%] p-4 rounded-2xl text-xs leading-relaxed space-y-2 shadow-md relative ${
                  isUser
                    ? 'bg-red-600 text-white rounded-br-none font-sans font-medium'
                    : isSystem
                    ? 'bg-amber-950/40 border border-amber-800/60 text-amber-200 rounded-bl-none'
                    : 'bg-[#14141a] border border-[#27272a] text-zinc-200 rounded-bl-none'
                }`}
              >
                {/* User Message Rendering */}
                {isUser ? (
                  <div className="whitespace-pre-line text-white">
                    {m.text}
                  </div>
                ) : (
                  /* Assistant / System Rich Markdown Rendering */
                  <div className="space-y-2 text-zinc-200">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Headings
                        h1: ({ children }) => (
                          <h1 className="text-sm font-bold text-red-400 font-mono uppercase tracking-wider mt-2.5 mb-1 pb-1 border-b border-red-900/40 flex items-center gap-1.5">
                            <span>#</span> {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-xs font-bold text-amber-400 font-mono uppercase tracking-wide mt-2 mb-1 flex items-center gap-1">
                            <span>##</span> {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-xs font-bold text-cyan-400 font-mono mt-1.5 mb-0.5">
                            {children}
                          </h3>
                        ),
                        h4: ({ children }) => (
                          <h4 className="text-[11px] font-bold text-purple-400 font-mono uppercase mt-1 mb-0.5">
                            {children}
                          </h4>
                        ),
                        // Text Stylings
                        p: ({ children }) => (
                          <p className="mb-1.5 last:mb-0 leading-relaxed text-zinc-300">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold text-zinc-100 bg-zinc-800/60 px-1 py-0.2 rounded font-sans">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-zinc-300 font-serif">
                            {children}
                          </em>
                        ),
                        // Lists
                        ul: ({ children }) => (
                          <ul className="space-y-1 my-2 pl-1 list-none">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="space-y-1 my-2 pl-4 list-decimal text-zinc-300 font-sans">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="flex items-start gap-2 text-zinc-300 text-xs">
                            <span className="text-red-500 font-bold select-none text-[13px] leading-tight">&bull;</span>
                            <span className="flex-1">{children}</span>
                          </li>
                        ),
                        // Quotes & Callouts
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-red-500 bg-red-950/20 px-3 py-2 my-2 rounded-r-xl text-zinc-300 italic text-[11px] space-y-1">
                            {children}
                          </blockquote>
                        ),
                        // Inline & Block Codes
                        code: ({ node, inline, className, children, ...props }: any) => {
                          if (inline) {
                            return (
                              <code className="px-1.5 py-0.5 rounded bg-[#09090d] border border-zinc-800 text-cyan-300 font-mono text-[11px] font-bold" {...props}>
                                {children}
                              </code>
                            );
                          }
                          return (
                            <div className="my-2 rounded-xl bg-[#08080b] border border-zinc-800/90 p-3 overflow-x-auto font-mono text-[11px] text-zinc-300">
                              <code {...props}>{children}</code>
                            </div>
                          );
                        },
                        // Tables
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-2.5 rounded-xl border border-zinc-800 bg-[#0a0a0d]">
                            <table className="w-full border-collapse text-[11px] font-mono">{children}</table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-200">{children}</thead>
                        ),
                        th: ({ children }) => (
                          <th className="p-2 text-left font-bold text-cyan-300 border-r border-zinc-800/80 last:border-r-0 text-[10px] uppercase tracking-wider">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="p-2 border-t border-zinc-800/60 border-r border-zinc-800/60 last:border-r-0 text-zinc-300">
                            {children}
                          </td>
                        ),
                        // Links & Horizontal Lines
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 font-mono"
                          >
                            {children}
                          </a>
                        ),
                        hr: () => <hr className="border-zinc-800 my-3" />,
                      }}
                    >
                      {m.text}
                    </ReactMarkdown>
                  </div>
                )}

                {/* Footer Bar: Timestamp & Copy Button */}
                <div className="flex items-center justify-between pt-1 border-t border-zinc-800/40 text-[9px] font-mono">
                  {!isUser && (
                    <button
                      onClick={() => handleCopyMessage(m.id, m.text)}
                      className="text-zinc-500 hover:text-cyan-400 flex items-center gap-1 transition"
                      title="Copiar mensagem formatada"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  )}
                  <span className={`${isUser ? 'text-red-200' : 'text-zinc-500'} ml-auto`}>
                    {m.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono p-3 rounded-2xl bg-[#14141a] border border-[#27272a] max-w-[80%] animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-red-500" />
            <span>Consultando banco neural de regras & dados...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-3 py-2 border-t border-[#1f1f26] bg-[#0f0f14] overflow-x-auto flex gap-1.5 no-scrollbar">
        {QUICK_PROMPT_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-2.5 py-1 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-[10px] font-mono whitespace-nowrap border border-zinc-700 transition"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-[#27272a] bg-[#121217] flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Pergunte uma regra, gere um encontro ou dê um comando (ex: Dossiê Tyger Claws, DV 15...)"
          value={inputPrompt}
          onChange={e => setInputPrompt(e.target.value)}
          className="flex-1 bg-[#09090c] border border-[#27272a] rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-red-500 font-sans"
        />
        <button
          type="submit"
          disabled={loading || !inputPrompt.trim()}
          className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white transition flex-shrink-0 shadow"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#121217] border border-[#27272a] rounded-2xl max-w-md w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2 font-mono">
                <Key className="w-4 h-4 text-red-500" />
                Configurar Google Gemini API Key
              </h4>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Insira sua chave gratuita da API do Gemini para respostas gerativas com o modelo <strong>Gemini 1.5 Flash</strong>. A chave é armazenada de forma privada no seu navegador (<code className="text-cyan-400 font-mono">localStorage</code>) ou no seu arquivo local <code className="text-amber-400 font-mono">.env.local</code>. Se não configurar nenhuma chave, o sistema opera no modo nativo <strong>Cyberpunk Oracle Offline</strong>.
            </p>

            <input
              type="password"
              placeholder="Chave da API Gemini (AIzaSy...)"
              defaultValue={apiKey}
              id="gemini-key-input"
              className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-2.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-red-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleSaveKey('')}
                className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 font-mono"
              >
                Remover Chave
              </button>
              <button
                onClick={() => {
                  const val = (document.getElementById('gemini-key-input') as HTMLInputElement)?.value;
                  handleSaveKey(val);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold shadow"
              >
                Salvar Chave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </>
  );
};
