import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RotateCcw,
  BookOpen,
  Layers,
  Eye,
  Bot,
  Skull,
  Crosshair,
  Flame,
  Zap,
  MapPin,
  HelpCircle,
  Search,
  ExternalLink,
  ChevronRight,
  Shield,
  Heart,
  History,
  Check,
} from 'lucide-react';
import {
  NIGHT_CITY_TAROT_DECK,
  TAROT_CARD_BACK_URL,
  TAROT_SPREAD_CONFIGS,
  TarotCard,
  TarotSpreadType,
  DrawnCard,
  TarotReadingResult,
  drawRandomTarotCard,
} from '../data/tarotData';
import { askCyberpunkAI } from '../services/aiService';
import { CyberpunkMarkdown } from '../components/common/CyberpunkMarkdown';

interface SavedReading {
  id: string;
  date: string;
  spreadType: TarotSpreadType;
  title: string;
  cards: { namePt: string; number: string; isReversed: boolean; positionLabel: string }[];
  summary?: string;
}

export const TarotPage: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'spreads' | 'gallery' | 'combat' | 'history'>('spreads');

  // SPREAD READING STATE
  const [selectedSpread, setSelectedSpread] = useState<TarotSpreadType>('streets_three');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [selectedCardDetail, setSelectedCardDetail] = useState<TarotCard | null>(null);

  // AI INTERPRETATION STATE
  const [aiInterpretation, setAiInterpretation] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // GALLERY FILTER STATE
  const [gallerySearch, setGallerySearch] = useState<string>('');
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'major' | 'phantom'>('all');

  // COMBAT TAROT TRIGGER STATE
  const [combatDrawnCard, setCombatDrawnCard] = useState<{ card: TarotCard; isReversed: boolean } | null>(null);

  // HISTORY STATE
  const [readingHistory, setReadingHistory] = useState<SavedReading[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpunk_tarot_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cyberpunk_tarot_history', JSON.stringify(readingHistory));
    } catch (e) {
      console.error('Failed to save tarot history', e);
    }
  }, [readingHistory]);

  // Execute Draw
  const handlePerformDraw = () => {
    setIsDrawing(true);
    setAiInterpretation('');
    const config = TAROT_SPREAD_CONFIGS[selectedSpread];
    const excludedIds: string[] = [];
    const newCards: DrawnCard[] = [];

    for (let i = 0; i < config.cardCount; i++) {
      const draw = drawRandomTarotCard(excludedIds);
      excludedIds.push(draw.card.id);
      const position = config.positions[i] || {
        label: `Carta ${i + 1}`,
        description: 'Influência das ruas de Night City.',
      };

      newCards.push({
        card: draw.card,
        isReversed: draw.isReversed,
        positionLabel: position.label,
        positionDescription: position.description,
        revealed: false,
      });
    }

    setDrawnCards(newCards);
    setIsDrawing(false);

    // Save to history
    const historyEntry: SavedReading = {
      id: `read-${Date.now()}`,
      date: new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      spreadType: selectedSpread,
      title: config.title,
      cards: newCards.map(nc => ({
        namePt: nc.card.namePt,
        number: nc.card.number,
        isReversed: nc.isReversed,
        positionLabel: nc.positionLabel,
      })),
    };

    setReadingHistory(prev => [historyEntry, ...prev.slice(0, 24)]);
  };

  const handleRevealAll = () => {
    setDrawnCards(prev => prev.map(c => ({ ...c, revealed: true })));
  };

  const handleToggleCardReveal = (index: number) => {
    setDrawnCards(prev =>
      prev.map((c, i) => (i === index ? { ...c, revealed: !c.revealed } : c))
    );
  };

  // Ask AI for Misty's Interpretation
  const handleRequestAiInterpretation = async () => {
    if (drawnCards.length === 0) return;
    setIsAiLoading(true);
    try {
      const cardSummaries = drawnCards
        .map(
          (c, idx) =>
            `${idx + 1}. [${c.positionLabel}]: ${c.card.namePt} (${c.card.nameEn}) - ${
              c.isReversed ? 'INVERTIDA' : 'NORMAL'
            } (Arquétipo: ${c.card.archetype})`
        )
        .join('\n');

      const prompt = `Você é Misty Olszewski, a sábia e mística esotérica de Night City (Cyberpunk 2077 & RED), dona do 'Misty's Esoterica' em Watson.
Os Edgerunners sentaram-se em frente à sua mesa de feltro sob as luzes neon de Night City para uma leitura do Tarot de Night City:
Tiragem: ${TAROT_SPREAD_CONFIGS[selectedSpread].title}

Cartas reveladas:
${cardSummaries}

Dê uma interpretação mística, sombria e imersiva das ruas de Night City em 2 a 3 parágrafos curtos. Fale com o tom autêntico da Misty: mencione o destino sangrento das ruas, o cromo, a perda de humanidade, os contratos perigosos e dê um aviso direto aos mercenários.`;

      const storedKey = typeof window !== 'undefined' ? localStorage.getItem('cyberpunk_gemini_api_key') : null;
      const aiText = await askCyberpunkAI(prompt, storedKey, 'Tiragem de Tarot de Night City');
      setAiInterpretation(aiText);
    } catch (e: any) {
      setAiInterpretation('Misty embaralha o maço e murmura: "A estática da rede está muito forte hoje... as ruas estão silenciosas demais para decifrar os sussurros agora."');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filtered gallery cards
  const filteredGallery = NIGHT_CITY_TAROT_DECK.filter(card => {
    const matchesSearch =
      card.namePt.toLowerCase().includes(gallerySearch.toLowerCase()) ||
      card.nameEn.toLowerCase().includes(gallerySearch.toLowerCase()) ||
      card.archetype.toLowerCase().includes(gallerySearch.toLowerCase()) ||
      card.number.toLowerCase().includes(gallerySearch.toLowerCase());

    if (!matchesSearch) return false;
    if (galleryFilter === 'major') return card.numberInt <= 21;
    if (galleryFilter === 'phantom') return card.numberInt >= 22;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            <span>Tarot de Night City // Arcanos & Destino</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            DLC Oficial Night City Tarot v1.2 (R. Talsorian Games & CD PROJEKT RED) • As 22 profecias de Misty e os grafites de V.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#14141a] border border-[#27272a] rounded-xl p-1.5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('spreads')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'spreads'
                ? 'bg-purple-900/60 text-purple-200 border border-purple-700 font-semibold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Leituras & Tiragens</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'gallery'
                ? 'bg-purple-900/60 text-purple-200 border border-purple-700 font-semibold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Compêndio dos 26 Arcanos</span>
          </button>

          <button
            onClick={() => setActiveTab('combat')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'combat'
                ? 'bg-red-950/60 text-red-200 border border-red-700 font-semibold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5 text-red-400" />
            <span>Regra Oficial em Combate</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-zinc-800 text-zinc-200 font-semibold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>Histórico ({readingHistory.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SPREAD READINGS */}
      {activeTab === 'spreads' && (
        <div className="space-y-6">
          {/* Controls Bar: Spread Selector & Action Buttons */}
          <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4 shadow-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* Spread selector */}
              <div className="space-y-1 w-full lg:w-1/2">
                <label className="text-xs font-mono uppercase text-purple-300 font-semibold block flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" /> Escolha o Método de Leitura (Spread):
                </label>
                <select
                  value={selectedSpread}
                  onChange={e => {
                    setSelectedSpread(e.target.value as TarotSpreadType);
                    setDrawnCards([]);
                    setAiInterpretation('');
                  }}
                  className="w-full bg-[#0a0a0d] border border-zinc-700 rounded-xl p-2.5 text-xs text-zinc-100 font-medium focus:outline-none focus:border-purple-500"
                >
                  <option value="omen">Presságio do Dia // Omen Rápido (1 Carta)</option>
                  <option value="streets_three">As Três Cartas das Ruas // Passado, Presente e Futuro (3 Cartas)</option>
                  <option value="edgerunner_destiny">Destino do Edgerunner // Alma & Cromo, Nêmesis, Objetivo (3 Cartas)</option>
                  <option value="night_city_cross">A Cruz de Night City // Conspiração Urbana Completa (5 Cartas)</option>
                  <option value="combat_critical">Disparo Crítico de Combate // 3+ Seis no Dano (1 Carta)</option>
                </select>
                <p className="text-[11px] text-zinc-400 pt-1">
                  {TAROT_SPREAD_CONFIGS[selectedSpread].description}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                <button
                  onClick={handlePerformDraw}
                  disabled={isDrawing}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  <RotateCcw className={`w-4 h-4 ${isDrawing ? 'animate-spin' : ''}`} />
                  <span>Embaralhar & Tirar Cartas</span>
                </button>

                {drawnCards.length > 0 && (
                  <button
                    onClick={handleRevealAll}
                    className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold uppercase tracking-wider transition border border-zinc-700 flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span>Revelar Todas</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Virtual Felt Reading Table */}
          {drawnCards.length > 0 ? (
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#14121e] to-[#0a0a0d] border border-purple-900/50 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  <span>{TAROT_SPREAD_CONFIGS[selectedSpread].title}</span>
                </span>
                <span className="text-[11px] text-zinc-400 font-mono">
                  Toque na carta para desvirar ou ver detalhes
                </span>
              </div>

              {/* Cards Row / Grid */}
              <div className={`grid gap-4 sm:gap-6 ${
                drawnCards.length === 1
                  ? 'grid-cols-1 max-w-xs mx-auto'
                  : drawnCards.length === 3
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
              }`}>
                {drawnCards.map((drawn, idx) => {
                  const card = drawn.card;
                  const isRev = drawn.isReversed;

                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center space-y-2.5 group"
                    >
                      {/* Position Label */}
                      <div className="text-center font-mono space-y-0.5">
                        <span className="text-[11px] font-bold text-purple-300 block">
                          {drawn.positionLabel}
                        </span>
                        <span className="text-[9px] text-zinc-500 block line-clamp-1">
                          {drawn.positionDescription}
                        </span>
                      </div>

                      {/* Card Flip Frame */}
                      <div
                        onClick={() => {
                          if (!drawn.revealed) {
                            handleToggleCardReveal(idx);
                          } else {
                            setSelectedCardDetail(card);
                          }
                        }}
                        className={`relative w-44 sm:w-full aspect-[9/16] rounded-2xl cursor-pointer transition-all duration-500 transform hover:scale-105 shadow-xl border overflow-hidden select-none ${
                          drawn.revealed
                            ? 'border-purple-500/80 ring-2 ring-purple-500/40'
                            : 'border-zinc-700 hover:border-purple-400 ring-1 ring-zinc-800'
                        }`}
                      >
                        {drawn.revealed ? (
                          <div className={`w-full h-full relative flex flex-col justify-between p-3 bg-black/80 ${isRev ? 'rotate-180' : ''}`}>
                            {/* Card Real Artwork Background */}
                            <img
                              src={card.imageUrl}
                              alt={card.namePt}
                              className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-300 group-hover:scale-105"
                              onError={e => {
                                (e.target as HTMLImageElement).src = TAROT_CARD_BACK_URL;
                              }}
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 pointer-events-none" />

                            {/* Top Card Info */}
                            <div className="relative z-10 flex items-center justify-between">
                              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/80 text-amber-300 border border-amber-500/40">
                                {card.number}
                              </span>
                              <span className="text-lg">{card.iconSymbol}</span>
                            </div>

                            {/* Bottom Card Info */}
                            <div className="relative z-10 space-y-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-xs text-white leading-tight drop-shadow">
                                  {card.namePt}
                                </h4>
                              </div>
                              <span className="text-[10px] text-cyan-300 font-mono block italic">
                                {card.nameEn}
                              </span>
                              {isRev && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 inline-block font-bold">
                                  INVERTIDA
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* Card Back (Holographic Design) */
                          <div className="w-full h-full relative flex flex-col items-center justify-center p-4 bg-[#101018] group-hover:bg-[#151224] transition">
                            <img
                              src={TAROT_CARD_BACK_URL}
                              alt="Verso do Tarot"
                              className="absolute inset-0 w-full h-full object-cover opacity-75"
                            />
                            <div className="relative z-10 text-center space-y-2">
                              <Sparkles className="w-6 h-6 text-purple-400 mx-auto animate-pulse" />
                              <span className="text-[10px] font-mono text-purple-200 uppercase tracking-widest block font-bold">
                                Revelar
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quick Inspect Button if revealed */}
                      {drawn.revealed && (
                        <button
                          onClick={() => setSelectedCardDetail(card)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-[11px] text-zinc-300 font-mono flex items-center gap-1 transition"
                        >
                          <BookOpen className="w-3 h-3 text-purple-400" />
                          <span>Ver Profecia & Efeito</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* AI Oracle & Misty's Interpretation Box */}
              <div className="pt-4 border-t border-purple-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-400" />
                    <h3 className="text-xs font-mono uppercase font-bold text-purple-200">
                      Oráculo de Misty // Interpretação Neural IA
                    </h3>
                  </div>

                  <button
                    onClick={handleRequestAiInterpretation}
                    disabled={isAiLoading}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-mono font-bold transition flex items-center gap-1.5 shadow disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                    <span>{isAiLoading ? 'Consultando Misty...' : 'Interpretar com IA'}</span>
                  </button>
                </div>

                {aiInterpretation ? (
                  <div className="p-4 rounded-xl bg-black/70 border border-purple-800/60 text-xs text-zinc-200 font-sans leading-relaxed space-y-3">
                    <div className="border-l-2 border-purple-500 pl-3">
                      <CyberpunkMarkdown content={aiInterpretation} />
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono block text-right pt-2 border-t border-purple-950/40">
                      — Misty Olszewski, Misty’s Esoterica, Watson
                    </span>
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-500 font-mono italic">
                    Clique em "Interpretar com IA" para que o Co-GM conecte as profecias das cartas ao enredo da sua campanha.
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 rounded-2xl bg-[#121217] border border-[#27272a] text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-950/40 border border-purple-800/50 flex items-center justify-center mx-auto text-purple-400">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-zinc-200 font-mono uppercase">
                  O Baralho Está Embaralhado e Pronto
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Escolha um método de leitura acima e clique em <strong>"Embaralhar & Tirar Cartas"</strong> para abrir a mesa de profecias de Night City.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FULL COMPENDIUM / GALLERY (26 CARDS) */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por carta, arquétipo ou número..."
                value={gallerySearch}
                onChange={e => setGallerySearch(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <button
                onClick={() => setGalleryFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  galleryFilter === 'all' ? 'bg-purple-700 text-white font-bold' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Todas (26)
              </button>
              <button
                onClick={() => setGalleryFilter('major')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  galleryFilter === 'major' ? 'bg-purple-700 text-white font-bold' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                22 Canônicas
              </button>
              <button
                onClick={() => setGalleryFilter('phantom')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  galleryFilter === 'phantom' ? 'bg-purple-700 text-white font-bold' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Phantom Liberty (4 Reis)
              </button>
            </div>
          </div>

          {/* Cards Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredGallery.map(card => (
              <div
                key={card.id}
                onClick={() => setSelectedCardDetail(card)}
                className="group relative aspect-[9/16] rounded-2xl border border-zinc-800 hover:border-purple-500 bg-black/60 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 shadow-lg flex flex-col justify-between p-3"
              >
                <img
                  src={card.imageUrl}
                  alt={card.namePt}
                  className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-100 transition duration-300 group-hover:scale-110"
                  onError={e => {
                    (e.target as HTMLImageElement).src = TAROT_CARD_BACK_URL;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/70" />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/80 text-amber-300 border border-amber-500/40">
                    {card.number}
                  </span>
                  <span className="text-base">{card.iconSymbol}</span>
                </div>

                <div className="relative z-10 space-y-0.5">
                  <h4 className="font-bold text-xs text-white leading-tight drop-shadow truncate">
                    {card.namePt}
                  </h4>
                  <span className="text-[10px] text-cyan-300 font-mono block italic truncate">
                    {card.nameEn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OFFICIAL COMBAT RULE (RED v1.2) */}
      {activeTab === 'combat' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#121217] border border-red-900/50 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <Crosshair className="w-6 h-6 text-red-500" />
              <div>
                <h2 className="text-base font-bold text-zinc-100 uppercase font-mono">
                  Regra Oficial do DLC Night City Tarot v1.2 em Combate
                </h2>
                <span className="text-xs text-zinc-400">
                  Regra canônica da R. Talsorian Games para Cyberpunk RED.
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-red-950/20 border border-red-800/40 text-xs text-zinc-300 space-y-2 leading-relaxed">
              <p>
                <strong>Gatilho do Tarot no Combate:</strong> Quando um atacante rola o dano de qualquer ataque (com armas de fogo, armas brancas ou ciberware) e <strong>3 ou mais dados resultam na face 6</strong> (Dano Crítico Triplo):
              </p>
              <ul className="list-disc pl-5 space-y-1 text-zinc-300">
                <li>O dano não só inflige o ferimento crítico padrão de +5 pontos, como também <strong>obriga o atacante a puxar uma Carta de Tarot</strong>.</li>
                <li>O <strong>Efeito Oficial do Arcano</strong> substitui ou é somado ao ataque, alterando drasticamente o rumo da batalha com efeitos espetaculares (desativar todo o cromo, queimar cérebro, incendiar o alvo, destruir a arma ou dobrar o loot).</li>
              </ul>
            </div>

            {/* Quick Draw Combat Card Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  const draw = drawRandomTarotCard();
                  setCombatDrawnCard(draw);
                }}
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-2"
              >
                <Crosshair className="w-4 h-4" />
                <span>Puxar Carta de Combate Imediata (3+ Seis no Dano)</span>
              </button>
            </div>

            {/* Result of Combat Card */}
            {combatDrawnCard && (
              <div className="p-5 rounded-2xl bg-black/80 border border-red-700/80 space-y-4 mt-4 shadow-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img
                    src={combatDrawnCard.card.imageUrl}
                    alt={combatDrawnCard.card.namePt}
                    className="w-24 aspect-[9/16] rounded-xl object-cover border border-red-500 shadow-md"
                  />
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                        Arcano {combatDrawnCard.card.number}
                      </span>
                      <h3 className="text-base font-bold text-zinc-100">
                        {combatDrawnCard.card.namePt} ({combatDrawnCard.card.nameEn})
                      </h3>
                    </div>

                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-red-400 font-bold block">
                        EFEITO OFICIAL RED: {combatDrawnCard.card.officialRedEffect.summary}
                      </span>
                      <p className="text-xs text-zinc-200 leading-relaxed font-mono">
                        {combatDrawnCard.card.officialRedEffect.fullText}
                      </p>
                    </div>

                    {onNavigate && (
                      <button
                        onClick={() => onNavigate('combat')}
                        className="mt-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1.5 transition"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-red-400" />
                        <span>Voltar para a Arena de Combate</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: READING HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <span className="text-xs font-mono uppercase text-zinc-400 font-bold">
              Registro de Leituras & Presságios Recentes
            </span>
            {readingHistory.length > 0 && (
              <button
                onClick={() => setReadingHistory([])}
                className="text-xs text-red-400 hover:text-red-300 font-mono transition"
              >
                Limpar Histórico
              </button>
            )}
          </div>

          {readingHistory.length > 0 ? (
            <div className="space-y-3">
              {readingHistory.map(entry => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl bg-[#121217] border border-[#27272a] space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="font-bold text-purple-300 font-mono">{entry.title}</span>
                    <span className="text-[11px] text-zinc-500 font-mono">{entry.date}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {entry.cards.map((c, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 font-mono text-[11px] flex items-center gap-1"
                      >
                        <strong className="text-purple-400">{c.positionLabel}:</strong>
                        <span>{c.namePt} ({c.number})</span>
                        {c.isReversed && (
                          <span className="text-[9px] text-red-400 font-bold">[REV]</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-zinc-500 font-mono text-xs">
              Nenhuma leitura salva ainda. Faça uma tiragem na aba "Leituras & Tiragens"!
            </div>
          )}
        </div>
      )}

      {/* MODAL: DETAILED CARD INSPECTOR */}
      {selectedCardDetail && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#121217] border border-purple-600/70 rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto text-xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedCardDetail.iconSymbol}</span>
                <div>
                  <h3 className="text-base font-bold text-zinc-100 font-mono">
                    Arcano {selectedCardDetail.number}: {selectedCardDetail.namePt}
                  </h3>
                  <span className="text-xs text-purple-400 font-mono italic">
                    {selectedCardDetail.nameEn} • {selectedCardDetail.archetype}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCardDetail(null)}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs"
              >
                ✕ Fechar
              </button>
            </div>

            {/* Body: Artwork + Detailed Texts */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
              {/* Card Image (4 cols) */}
              <div className="sm:col-span-4 aspect-[9/16] rounded-xl overflow-hidden border border-purple-500/60 shadow-xl relative">
                <img
                  src={selectedCardDetail.imageUrl}
                  alt={selectedCardDetail.namePt}
                  className="w-full h-full object-cover"
                  onError={e => {
                    (e.target as HTMLImageElement).src = TAROT_CARD_BACK_URL;
                  }}
                />
              </div>

              {/* Card Lore & Effects (8 cols) */}
              <div className="sm:col-span-8 space-y-3.5">
                {/* Official RED Effect */}
                <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/60 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-red-400 font-bold block flex items-center gap-1">
                    <Crosshair className="w-3 h-3" /> Efeito Oficial em Combate (RED v1.2)
                  </span>
                  <p className="text-zinc-200 text-xs font-mono leading-relaxed">
                    {selectedCardDetail.officialRedEffect.fullText}
                  </p>
                </div>

                {/* Meanings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#0a0a0d] border border-emerald-900/40 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                      Significado Normal
                    </span>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      {selectedCardDetail.uprightMeaning}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#0a0a0d] border border-amber-900/40 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                      Significado Invertido
                    </span>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      {selectedCardDetail.reversedMeaning}
                    </p>
                  </div>
                </div>

                {/* Narrative Hook for GM */}
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-purple-300 font-bold block">
                    Gancho Narrativo para o Mestre
                  </span>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {selectedCardDetail.narrativeHook}
                  </p>
                </div>

                {/* Graffiti Location */}
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Grafite em Night City: {selectedCardDetail.graffitiLocation}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
