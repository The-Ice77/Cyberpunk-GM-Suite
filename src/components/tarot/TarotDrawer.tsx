import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Eye,
  RotateCcw,
  Copy,
  Check,
  BookOpen,
  ShieldAlert,
  Zap,
  Bot,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  ZoomIn,
  Maximize2,
} from 'lucide-react';
import { TAROT_CARD_BACK_URL } from '../../data/tarotData';
import {
  NIGHT_CITY_TAROT_DECK,
  TAROT_SPREAD_CONFIGS,
  TarotCard,
  TarotSpreadType,
  DrawnCard,
  drawRandomTarotCard,
} from '../../data/tarotData';
import { generateAITarotReading } from '../../services/aiService';
import { useUserRole } from '../../context/UserRoleContext';

interface TarotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TarotDrawer: React.FC<TarotDrawerProps> = ({ isOpen, onClose }) => {
  const { playerCharacters } = useUserRole();

  const [spreadType, setSpreadType] = useState<TarotSpreadType>('streets_three');
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>(() => {
    const config = TAROT_SPREAD_CONFIGS.streets_three;
    const drawn: DrawnCard[] = [];
    const usedIds: string[] = [];
    for (let i = 0; i < config.cardCount; i++) {
      const { card, isReversed } = drawRandomTarotCard(usedIds);
      usedIds.push(card.id);
      drawn.push({
        card,
        isReversed,
        positionLabel: config.positions[i]?.label || `Posição ${i + 1}`,
        positionDescription: config.positions[i]?.description || '',
        revealed: true,
      });
    }
    return drawn;
  });

  const [selectedCharacterId, setSelectedCharacterId] = useState<string>(playerCharacters[0]?.id || '');
  const [campaignContextInput, setCampaignContextInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'reading' | 'compendium'>('reading');
  const [compendiumSearch, setCompendiumSearch] = useState<string>('');
  const [selectedCompendiumCard, setSelectedCompendiumCard] = useState<TarotCard | null>(NIGHT_CITY_TAROT_DECK[0]);
  const [zoomedCard, setZoomedCard] = useState<TarotCard | null>(null);

  // AI Interpretation State
  const [isAiInterpreting, setIsAiInterpreting] = useState<boolean>(false);
  const [aiReadingResult, setAiReadingResult] = useState<{
    cardsNarrative: { position: string; cardName: string; interpretation: string }[];
    overallInterpretation: string;
    coGMPlotTwist: string;
    mistyClosingWords: string;
  } | null>(null);

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Draw / Shuffle
  const handleDrawCards = (type: TarotSpreadType = spreadType) => {
    setSpreadType(type);
    const config = TAROT_SPREAD_CONFIGS[type];
    const drawn: DrawnCard[] = [];
    const usedIds: string[] = [];

    for (let i = 0; i < config.cardCount; i++) {
      const { card, isReversed } = drawRandomTarotCard(usedIds);
      usedIds.push(card.id);
      drawn.push({
        card,
        isReversed,
        positionLabel: config.positions[i]?.label || `Posição ${i + 1}`,
        positionDescription: config.positions[i]?.description || '',
        revealed: false, // Inicia virada para baixo para efeito dramático
      });
    }

    setDrawnCards(drawn);
    setAiReadingResult(null);
    setToastMsg(`Baralho de Night City embaralhado! Clique nas cartas para revelá-las.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Flip single card
  const handleRevealCard = (idx: number) => {
    setDrawnCards(prev => {
      const copy = [...prev];
      if (copy[idx]) {
        copy[idx] = { ...copy[idx], revealed: !copy[idx].revealed };
      }
      return copy;
    });
  };

  // Reveal all
  const handleRevealAll = () => {
    setDrawnCards(prev => prev.map(c => ({ ...c, revealed: true })));
  };

  // AI Reading
  const handleInterpretWithAI = async () => {
    setIsAiInterpreting(true);
    const selectedChar = playerCharacters.find(p => p.id === selectedCharacterId);
    try {
      const res = await generateAITarotReading({
        spreadTitle: TAROT_SPREAD_CONFIGS[spreadType].title,
        cards: drawnCards.map(d => ({
          name: d.card.namePt,
          number: d.card.number,
          position: d.positionLabel,
          isReversed: d.isReversed,
          upright: d.card.uprightMeaning,
          reversed: d.card.reversedMeaning,
        })),
        campaignContext: campaignContextInput || 'Sessão no submundo de Night City',
        characterName: selectedChar?.name,
      });
      setAiReadingResult(res);
      handleRevealAll();
      setToastMsg('Misty concluiu a interpretação das cartas!');
      setTimeout(() => setToastMsg(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiInterpreting(false);
    }
  };

  // Copy report for Discord / WhatsApp
  const handleCopyReading = () => {
    const spreadInfo = TAROT_SPREAD_CONFIGS[spreadType];
    const cardsText = drawnCards
      .map(
        d =>
          `🎴 **${d.positionLabel}**: [${d.card.number}] ${d.card.namePt} (${d.card.nameEn}) - *${
            d.isReversed ? 'INVERTIDA / Sombra' : 'DIRETA / Luz'
          }*\n   💬 *Significado:* ${d.isReversed ? d.card.reversedMeaning : d.card.uprightMeaning}\n   ⚔️ *Efeito RED:* ${d.card.officialRedEffect.summary}`
      )
      .join('\n\n');

    const fullText = `🔮 **TAROT DE NIGHT CITY // ${spreadInfo.title.toUpperCase()}** 🔮
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${cardsText}
${
  aiReadingResult
    ? `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🕯️ **Leitura de Misty:**\n"${aiReadingResult.overallInterpretation}"\n\n⚡ **Reviravolta do Co-GM:** ${aiReadingResult.coGMPlotTwist}\n${aiReadingResult.mistyClosingWords}`
    : ''
}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    navigator.clipboard.writeText(fullText);
    setToastMsg('Leitura copiada para a área de transferência!');
    setTimeout(() => setToastMsg(null), 2500);
  };

  const filteredCompendium = NIGHT_CITY_TAROT_DECK.filter(
    c =>
      c.namePt.toLowerCase().includes(compendiumSearch.toLowerCase()) ||
      c.nameEn.toLowerCase().includes(compendiumSearch.toLowerCase()) ||
      c.archetype.toLowerCase().includes(compendiumSearch.toLowerCase()) ||
      c.graffitiLocation.toLowerCase().includes(compendiumSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl bg-[#0d0d12] border-l border-[#27272a] h-full flex flex-col shadow-2xl relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Bar */}
        <div className="p-4 border-b border-[#27272a] bg-[#121217]/90 flex items-center justify-between shrink-0 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-md shadow-purple-950/50">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/40 font-bold">
                  Misty's Esoterica & Night City Tarot v1.2
                </span>
              </div>
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>Oráculo & Tarot de Night City</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switch: Reading vs Compendium */}
            <div className="flex items-center bg-[#1a1a24] p-0.5 rounded-lg border border-zinc-800 text-xs font-mono">
              <button
                onClick={() => setActiveTab('reading')}
                className={`px-3 py-1.5 rounded-md transition ${
                  activeTab === 'reading'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Mesa de Tiragem
              </button>
              <button
                onClick={() => setActiveTab('compendium')}
                className={`px-3 py-1.5 rounded-md transition ${
                  activeTab === 'compendium'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Compêndio ({NIGHT_CITY_TAROT_DECK.length})
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
              title="Fechar Tarot"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMsg && (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-purple-950/90 border border-purple-500/60 text-purple-200 font-mono text-xs flex items-center justify-between shadow-lg relative z-20 animate-pulse">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              {toastMsg}
            </span>
            <button onClick={() => setToastMsg(null)} className="text-zinc-400 hover:text-zinc-100">&times;</button>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 relative z-10">
          {activeTab === 'reading' ? (
            <>
              {/* SPREAD SELECTOR TOOLBAR */}
              <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-purple-400" /> Escolha o Tipo de Tiragem
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    Regra oficial: 3 D6 com 6 ativa o efeito em combate
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {[
                    { id: 'omen', label: '1. Omen do Dia', sub: '1 Carta' },
                    { id: 'streets_three', label: '2. As Três Cartas', sub: 'Passado, Presente, Futuro' },
                    { id: 'night_city_cross', label: '3. Cruz de Night City', sub: '5 Cartas (Completa)' },
                    { id: 'edgerunner_destiny', label: '4. Destino Edgerunner', sub: 'Lifepath & Conflito' },
                    { id: 'combat_critical', label: '5. Disparo Crítico', sub: 'Night City Tarot v1.2' },
                  ].map(tab => {
                    const isSelected = spreadType === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleDrawCards(tab.id as TarotSpreadType)}
                        className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-purple-950/50 border-purple-500 text-purple-200 font-bold shadow-md shadow-purple-950/50'
                            : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        <span className="truncate block">{tab.label}</span>
                        <span className="text-[10px] text-zinc-500 font-mono mt-1 block truncate">{tab.sub}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Optional Edgerunner / Context selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-zinc-800/80">
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Personagem da Mesa (Para leitura pessoal):</label>
                    <select
                      value={selectedCharacterId}
                      onChange={e => setSelectedCharacterId(e.target.value)}
                      className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-purple-500"
                    >
                      {playerCharacters.map(pc => (
                        <option key={pc.id} value={pc.id}>
                          {pc.name} ({pc.role} &bull; "{pc.handle}")
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Contexto da Situação (Para Misty & Co-GM):</label>
                    <input
                      type="text"
                      value={campaignContextInput}
                      onChange={e => setCampaignContextInput(e.target.value)}
                      placeholder="Ex: Prestes a invadir a torre da Militech..."
                      className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDrawCards(spreadType)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-medium flex items-center gap-1.5 transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
                      <span>Embaralhar & Nova Tiragem</span>
                    </button>
                    <button
                      onClick={handleRevealAll}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-medium flex items-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Virar Todas</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyReading}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-medium flex items-center gap-1.5 transition"
                      title="Copiar relatório formatado para o Discord"
                    >
                      <Copy className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copiar (Discord)</span>
                    </button>
                    <button
                      onClick={handleInterpretWithAI}
                      disabled={isAiInterpreting}
                      className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-mono font-bold flex items-center gap-2 transition shadow-md shadow-purple-950/40"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      <span>{isAiInterpreting ? 'Misty Lendo as Cartas...' : 'Interpretar com IA (Misty)'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* DRAWN CARDS GRID (THE TAROT TABLE) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-2">
                    <span>Mesa de Leitura:</span>
                    <strong className="text-purple-300">{TAROT_SPREAD_CONFIGS[spreadType].title}</strong>
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500">
                    Clique em cada carta para virar
                  </span>
                </div>

                <div className={`grid gap-4 ${
                  drawnCards.length === 1
                    ? 'grid-cols-1 max-w-sm mx-auto'
                    : drawnCards.length === 3
                    ? 'grid-cols-1 md:grid-cols-3'
                    : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
                }`}>
                  {drawnCards.map((drawn, idx) => {
                    const { card, isReversed, positionLabel, positionDescription, revealed } = drawn;
                    return (
                      <div
                        key={idx}
                        className="flex flex-col space-y-2 group cursor-pointer"
                        onClick={() => handleRevealCard(idx)}
                      >
                        {/* Position Pill */}
                        <div className="text-center font-mono text-[10px] uppercase text-zinc-400 truncate bg-zinc-900/80 p-1 rounded-lg border border-zinc-800">
                          {positionLabel}
                        </div>

                        {/* Card Rectangle with Authentic Artwork / Card Back */}
                        <div
                          className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden flex flex-col justify-between shadow-2xl group/card ${
                            revealed
                              ? `bg-[#0f0f15] ${card.accentBorder} shadow-purple-950/40`
                              : 'bg-[#0f0f15] border-purple-900/50 hover:border-purple-500 shadow-lg'
                          }`}
                        >
                          {revealed ? (
                            <>
                              {/* Header Card Bar */}
                              <div className="flex items-center justify-between p-2.5 bg-[#14141d] border-b border-zinc-800/80 z-10">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="font-mono text-xs font-black text-purple-400 shrink-0">
                                    [{card.number}]
                                  </span>
                                  <span className="font-mono text-xs font-bold text-zinc-100 truncate" title={card.namePt}>
                                    {card.namePt}
                                  </span>
                                </div>
                                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                                  isReversed
                                    ? 'bg-rose-950/90 text-rose-300 border border-rose-700/60'
                                    : 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/60'
                                }`}>
                                  {isReversed ? 'Invertida' : 'Direta'}
                                </span>
                              </div>

                              {/* Official Artwork Photo */}
                              <div className="relative aspect-[756/1449] w-full overflow-hidden bg-black flex items-center justify-center group/img">
                                <img
                                  src={card.imageUrl}
                                  alt={card.namePt}
                                  className={`w-full h-full object-cover transition-transform duration-500 ${
                                    isReversed ? 'rotate-180 group-hover/img:scale-105' : 'group-hover/img:scale-105'
                                  }`}
                                  loading="lazy"
                                />

                                {/* Subtle Inverted Indicator Overlay */}
                                {isReversed && (
                                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono text-rose-400 border border-rose-500/40">
                                    🔄 Invertida
                                  </div>
                                )}

                                {/* Hover Zoom Action Button */}
                                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center p-2">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setZoomedCard(card);
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-purple-600/95 hover:bg-purple-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-xl transition transform scale-95 group-hover/img:scale-100"
                                  >
                                    <ZoomIn className="w-3.5 h-3.5" />
                                    <span>Ver Carta HD</span>
                                  </button>
                                </div>
                              </div>

                              {/* Bottom Meaning & Hook */}
                              <div className="p-3 bg-[#111118] border-t border-zinc-800/80 space-y-1.5 text-[11px]">
                                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                                  <span className="truncate italic">"{card.archetype}"</span>
                                  <span className="text-zinc-500 shrink-0 ml-1">{card.nameEn}</span>
                                </div>
                                <p className="text-zinc-300 leading-tight line-clamp-3">
                                  {isReversed ? card.reversedMeaning : card.uprightMeaning}
                                </p>
                                <div className="text-[10px] font-mono text-red-400 pt-1 border-t border-zinc-800/60 line-clamp-1 flex items-center gap-1">
                                  <Zap className="w-3 h-3 text-red-400 shrink-0" />
                                  <span>RED: {card.officialRedEffect.summary}</span>
                                </div>
                              </div>
                            </>
                          ) : (
                            /* Card Back Cover (Official Night City Tarot Card Back Artwork) */
                            <div className="relative aspect-[756/1449] w-full overflow-hidden bg-black flex flex-col justify-end">
                              <img
                                src={TAROT_CARD_BACK_URL}
                                alt="Verso Oficial do Baralho"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/20" />
                              <div className="relative z-10 p-4 text-center space-y-1">
                                <span className="font-mono text-xs text-zinc-200 uppercase tracking-widest block font-bold drop-shadow-md">
                                  Night City Tarot
                                </span>
                                <span className="text-[10px] font-mono text-purple-400 flex items-center justify-center gap-1 drop-shadow-md animate-pulse">
                                  <Sparkles className="w-3 h-3" />
                                  Clique para Revelar
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Position Description Hint */}
                        <span className="text-[10px] text-zinc-500 font-mono text-center line-clamp-2 px-1">
                          {positionDescription}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CARD DETAILS ACCORDION (OFFICIAL RED EFFECTS & HOOKS) */}
              <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" /> Efeitos Oficiais do Livro & Detalhes das Cartas
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-500">DLC Night City Tarot v1.2</span>
                </div>

                <div className="space-y-3">
                  {drawnCards.filter(d => d.revealed).map((d, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{d.card.iconSymbol}</span>
                          <strong className="text-xs text-zinc-100 font-mono">
                            [{d.card.number}] {d.card.namePt} ({d.card.nameEn})
                          </strong>
                          <span className="text-[10px] font-mono text-purple-400">&bull; {d.positionLabel}</span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500">{d.card.graffitiLocation}</span>
                      </div>

                      {/* Official Cyberpunk RED Effect */}
                      <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/40 text-xs font-mono space-y-1">
                        <span className="text-[10px] uppercase font-bold text-red-400 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Efeito Mecânico Oficial de Cyberpunk RED:
                        </span>
                        <p className="text-zinc-200 leading-relaxed font-sans text-xs">
                          {d.card.officialRedEffect.fullText}
                        </p>
                      </div>

                      {/* GM Narrative Hook */}
                      <div className="text-xs text-zinc-400 space-y-0.5">
                        <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                          Gancho Dramático para a Sessão:
                        </span>
                        <p className="text-zinc-300 leading-relaxed">{d.card.narrativeHook}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MISTY'S AI ORACULAR READING VERDICT */}
              {aiReadingResult && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#14121d] to-pink-950/30 border border-purple-500/50 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-400" />
                      <h4 className="text-sm font-bold text-purple-200 font-mono">
                        A Interpretação Espiritual de Misty Ollaszewski
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800">
                      Misty's Esoterica (Watson)
                    </span>
                  </div>

                  <p className="text-xs text-zinc-200 leading-relaxed font-sans italic border-l-2 border-purple-500 pl-3">
                    "{aiReadingResult.overallInterpretation}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1 text-xs">
                      <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                        ⚡ Reviravolta do Co-GM para a Aventura:
                      </span>
                      <p className="text-zinc-300 leading-relaxed">{aiReadingResult.coGMPlotTwist}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1 text-xs">
                      <span className="text-[10px] font-mono uppercase text-pink-400 font-bold block">
                        🕯️ Palavras de Despedida de Misty:
                      </span>
                      <p className="text-zinc-300 leading-relaxed italic">{aiReadingResult.mistyClosingWords}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* COMPENDIUM OF ALL 26 CARDS */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-purple-400" /> Compêndio Completo dos 26 Arcanos de Night City
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Inclui os 22 Arcanos Maiores de Cyberpunk 2077 e os 4 Reis da corte de Phantom Liberty (Dogtown).
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={compendiumSearch}
                    onChange={e => setCompendiumSearch(e.target.value)}
                    placeholder="Buscar carta, número ou efeito..."
                    className="w-full bg-[#121217] border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredCompendium.map(card => (
                  <button
                    key={card.id}
                    onClick={() => setSelectedCompendiumCard(card)}
                    className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                      selectedCompendiumCard?.id === card.id
                        ? 'bg-purple-950/40 border-purple-500 shadow-md shadow-purple-950/40'
                        : 'bg-[#121217] border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    {/* Authentic Card Thumbnail */}
                    <div className="relative w-12 sm:w-14 aspect-[756/1449] rounded-lg overflow-hidden border border-zinc-700/80 shrink-0 bg-black shadow group-hover:border-purple-400">
                      <img
                        src={card.imageUrl}
                        alt={card.namePt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-extrabold text-zinc-100 truncate">
                          [{card.number}] {card.namePt}
                        </span>
                        <span className="text-xs shrink-0 ml-1">{card.iconSymbol}</span>
                      </div>

                      <span className="text-[10px] font-mono text-purple-400 block line-clamp-1 italic">
                        "{card.archetype}"
                      </span>

                      <p className="text-[10px] text-zinc-400 line-clamp-2 leading-relaxed">
                        {card.uprightMeaning}
                      </p>

                      <div className="text-[9px] font-mono text-red-400 border-t border-zinc-800/80 pt-1 line-clamp-1">
                        RED: {card.officialRedEffect.summary}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Card Deep Inspector with Authentic High-Res Artwork */}
              {selectedCompendiumCard && (
                <div className="p-6 rounded-2xl bg-[#121217] border border-purple-500/60 space-y-6 mt-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Authentic Card Art Full Display */}
                    <div
                      className="relative w-48 sm:w-56 aspect-[756/1449] rounded-2xl overflow-hidden border-2 border-purple-500 shadow-2xl shrink-0 mx-auto md:mx-0 group cursor-pointer bg-black"
                      onClick={() => setZoomedCard(selectedCompendiumCard)}
                      title="Clique para ver imagem ampliada em tela cheia"
                    >
                      <img
                        src={selectedCompendiumCard.imageUrl}
                        alt={selectedCompendiumCard.namePt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-xl bg-purple-600/90 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow-xl">
                          <ZoomIn className="w-3.5 h-3.5" /> Ampliar HD
                        </span>
                      </div>
                    </div>

                    {/* Detailed System Rules, Lore & Divination */}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-800">
                              Arcano {selectedCompendiumCard.number}
                            </span>
                            <span className="text-xs text-zinc-400 font-mono">
                              {selectedCompendiumCard.nameEn}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-zinc-100 font-mono mt-1 flex items-center gap-2">
                            <span>{selectedCompendiumCard.namePt}</span>
                            <span className="text-base">{selectedCompendiumCard.iconSymbol}</span>
                          </h3>
                          <span className="text-xs text-purple-400 font-mono block italic mt-0.5">
                            "{selectedCompendiumCard.archetype}"
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800 self-start sm:self-auto">
                          📍 {selectedCompendiumCard.graffitiLocation}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1">
                          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                            Significado Direto (Luz):
                          </span>
                          <p className="text-zinc-300 leading-relaxed">{selectedCompendiumCard.uprightMeaning}</p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1">
                          <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block">
                            Significado Invertido (Sombra):
                          </span>
                          <p className="text-zinc-300 leading-relaxed">{selectedCompendiumCard.reversedMeaning}</p>
                        </div>
                      </div>

                      {/* Official RED Combat Effect */}
                      <div className="p-4 rounded-xl bg-red-950/20 border border-red-900/50 space-y-1.5 text-xs">
                        <span className="text-[10px] font-mono uppercase text-red-400 font-bold flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" /> Efeito Oficial em Combate (Regra Triplo 6 no Dano):
                        </span>
                        <p className="text-zinc-200 leading-relaxed font-mono">{selectedCompendiumCard.officialRedEffect.fullText}</p>
                        <span className="text-[10px] font-mono text-zinc-500 block">
                          Ativação: Quando o atacante rola 3 ou mais dados '6' em um ataque bem-sucedido, puxe uma carta do baralho!
                        </span>
                      </div>

                      {/* Narrative Hook */}
                      <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1 text-xs">
                        <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                          Gancho Dramático para a Mesa de RPG:
                        </span>
                        <p className="text-zinc-300 leading-relaxed">{selectedCompendiumCard.narrativeHook}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* LIGHTBOX MODAL: FULL HIGH-RES CARD VIEWER */}
      {zoomedCard && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setZoomedCard(null)}
        >
          <div
            className="relative max-w-lg w-full bg-[#121218] border-2 border-purple-500/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-[#161622]">
              <div>
                <span className="text-xs font-mono uppercase text-purple-400 font-bold block">
                  Arcano {zoomedCard.number} &bull; {zoomedCard.nameEn}
                </span>
                <h3 className="text-base font-bold text-zinc-100 font-mono flex items-center gap-2">
                  <span>{zoomedCard.namePt}</span>
                  <span className="text-sm">{zoomedCard.iconSymbol}</span>
                </h3>
              </div>
              <button
                onClick={() => setZoomedCard(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
                aria-label="Fechar visualizador"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal High-Res Card Image */}
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center bg-black/80">
              <img
                src={zoomedCard.imageUrl}
                alt={zoomedCard.namePt}
                className="max-h-[62vh] object-contain rounded-xl shadow-2xl border border-zinc-800"
              />
            </div>

            {/* Modal Footer Info */}
            <div className="p-4 bg-[#0e0e14] border-t border-zinc-800 space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-zinc-400 font-mono text-[11px]">
                <span>📍 {zoomedCard.graffitiLocation}</span>
                <span className="text-purple-400 italic">"{zoomedCard.archetype}"</span>
              </div>
              <div className="text-[11px] font-mono text-red-300 bg-red-950/40 p-2.5 rounded-xl border border-red-900/50">
                <strong>Regra RED (Triplo 6):</strong> {zoomedCard.officialRedEffect.fullText}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
