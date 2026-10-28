import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Key, Sparkles, Terminal, Shield, RefreshCw } from 'lucide-react';
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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: '🤖 **Neural Co-GM Online.**\nSou seu copiloto tático e narrativo em Night City. Conheço todas as regras oficiais de Cyberpunk RED e 2020. Pergunte sobre regras, estatísticas de gangues, clima, ou peça ideias imediatas para a cena!',
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
        text: `Erro de conexão: ${err.message}`,
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
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-[#0c0c10] border-l border-[#27272a] shadow-2xl flex flex-col">
      {/* Top Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272a] bg-[#121217]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-950/60 border border-red-800/40">
            <Bot className="w-4 h-4 text-red-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-zinc-100 font-mono tracking-wider uppercase">
              Neural Co-GM // IA Assistente
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">
              {apiKey ? 'Modo Gemini 1.5 Flash' : 'Modo Cyberpunk Oracle (Offline Nativo)'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowKeyModal(true)}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
            title="Configurar Chave da API Gemini"
          >
            <Key className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed space-y-1.5 shadow-sm ${
                m.sender === 'user'
                  ? 'bg-red-600 text-white rounded-br-none'
                  : m.sender === 'system'
                  ? 'bg-amber-950/40 border border-amber-800/60 text-amber-300'
                  : 'bg-[#14141a] border border-[#27272a] text-zinc-200 rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>
              <div className={`text-[9px] font-mono ${m.sender === 'user' ? 'text-red-200' : 'text-zinc-500'} text-right`}>
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono p-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-red-500" />
            <span>Processando no córtex cibernético...</span>
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
          placeholder="Pergunte uma regra, gere um encontro ou dê um comando..."
          value={inputPrompt}
          onChange={e => setInputPrompt(e.target.value)}
          className="flex-1 bg-[#09090c] border border-[#27272a] rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
        />
        <button
          type="submit"
          disabled={loading || !inputPrompt.trim()}
          className="p-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-[#27272a] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
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

            <p className="text-xs text-zinc-400 leading-relaxed">
              Insira sua chave gratuita da API do Gemini para respostas gerativas com o modelo <strong>Gemini 1.5 Flash</strong>. Se preferir não usar chave, o sistema opera automaticamente no modo <strong>Cyberpunk Oracle Offline</strong>.
            </p>

            <input
              type="password"
              placeholder="AIzaSy..."
              defaultValue={apiKey}
              id="gemini-key-input"
              className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-2.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-red-500"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => handleSaveKey('')}
                className="px-3 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-zinc-200"
              >
                Remover Chave
              </button>
              <button
                onClick={() => {
                  const val = (document.getElementById('gemini-key-input') as HTMLInputElement)?.value;
                  handleSaveKey(val);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-medium"
              >
                Salvar Chave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
