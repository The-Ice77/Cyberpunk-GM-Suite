import React, { useState } from 'react';
import {
  ShoppingBag,
  Store,
  Dices,
  Bot,
  Shield,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Coins,
  Wrench,
  Tag,
  Check,
  Package,
  Crosshair,
  User,
  Sparkles,
} from 'lucide-react';
import {
  NightMarket,
  generateProceduralNightMarket,
  NIGHT_MARKET_LOCATIONS,
} from '../../data/nightMarketData';
import { generateAINightMarket } from '../../services/aiService';
import { NIGHT_CITY_DISTRICTS } from '../../data/mapData';

interface NightMarketSectionProps {
  initialDistrict?: string;
}

export const NightMarketSection: React.FC<NightMarketSectionProps> = ({ initialDistrict }) => {
  const [currentMarket, setCurrentMarket] = useState<NightMarket | null>(() =>
    generateProceduralNightMarket(initialDistrict)
  );

  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [showAiOptions, setShowAiOptions] = useState<boolean>(false);
  const [aiDistrict, setAiDistrict] = useState<string>(initialDistrict || 'Qualquer');
  const [aiFocus, setAiFocus] = useState<string>('Armas & Cromo de Combate');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [purchasedItems, setPurchasedItems] = useState<{ [key: string]: boolean }>({});
  const [purchaseToast, setPurchaseToast] = useState<string | null>(null);

  // Procedural Roll
  const handleRollProcedural = () => {
    const market = generateProceduralNightMarket(aiDistrict === 'Qualquer' ? undefined : aiDistrict);
    setCurrentMarket(market);
    setPurchasedItems({});
  };

  // AI Generation
  const handleGenerateAI = async () => {
    setIsAiLoading(true);
    try {
      const res = await generateAINightMarket({
        district: aiDistrict === 'Qualquer' ? undefined : aiDistrict,
        focusCategory: aiFocus,
        prompt: aiPrompt.trim() || undefined,
      });
      setCurrentMarket(res);
      setPurchasedItems({});
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleBuyItem = (itemKey: string, itemName: string, priceEb: number) => {
    setPurchasedItems(prev => ({ ...prev, [itemKey]: true }));
    setPurchaseToast(`Item adquirido: ${itemName} por ${priceEb}eb. Adicione ao inventário da ficha!`);
    setTimeout(() => setPurchaseToast(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {purchaseToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-zinc-900 border border-emerald-500/60 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-mono font-medium">{purchaseToast}</span>
        </div>
      )}

      {/* Header and Explanation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#27272a] pb-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-500" />
            <span>Mercado Negro Clandestino (Night Market)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Regras oficiais de Mercados Noturnos (CP:R pp. 336-342): onde mercenários encontram armas restritas, cromo militar e contrabando.
          </p>
        </div>
      </div>

      {/* Generator Controls */}
      <div className="space-y-3">
        {/* 1. Standard Button: Procedural Generation */}
        <button
          onClick={handleRollProcedural}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-500 hover:via-orange-500 hover:to-red-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
        >
          <Dices className="w-4 h-4" />
          <span>Sortear Novo Mercado Negro (Regras Oficiais CP:R)</span>
        </button>

        {/* 2. Extra Option: AI Generator */}
        <div className="rounded-xl border border-amber-900/40 bg-amber-950/15 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-zinc-200">Opção Extra: Gerar Mercado Negro com IA (Gemini)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAiOptions(!showAiOptions)}
              className="text-[11px] font-mono text-amber-400 hover:text-amber-300 transition flex items-center gap-1"
            >
              <span>{showAiOptions ? 'Ocultar Parâmetros' : 'Personalizar Mercado com IA'}</span>
              {showAiOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showAiOptions && (
            <div className="space-y-3 pt-2 border-t border-amber-950/50 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">Distrito do Mercado:</label>
                  <select
                    value={aiDistrict}
                    onChange={e => setAiDistrict(e.target.value)}
                    className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Qualquer">Qualquer Distrito (Aleatório)</option>
                    {NIGHT_CITY_DISTRICTS.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">Especialidade / Foco:</label>
                  <select
                    value={aiFocus}
                    onChange={e => setAiFocus(e.target.value)}
                    className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Armas & Cromo de Combate">Armas Pesadas & Cromo de Combate</option>
                    <option value="Cyberdecks & Black ICE">Cyberdecks & Softwares Hackers</option>
                    <option value="Drogas & Químicos de Rua">Drogas de Rua & Estimulantes Médicos</option>
                    <option value="Contrabando de Luxo & Iguarias">Contrabando Corporativo & Iguarias Reais</option>
                    <option value="Feira Clandestina dos Scavs">Feira Clandestina dos Scavs (Órgãos & Peças)</option>
                    <option value="Mercado Nômade de Veículos & Armaduras">Bazar Nômade (Peças de Carro & Blindagens)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">
                  Instruções Específicas / Vibe Adicional (Opcional):
                </label>
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder="Ex: Mercado secreto nos esgotos de Kabuki protegido pela Maelstrom com leilão de protótipo..."
                  className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleGenerateAI}
            disabled={isAiLoading}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow"
          >
            <Bot className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'IA Construindo Mercado Noturno...' : 'Gerar Mercado Negro com IA'}</span>
          </button>
        </div>
      </div>

      {/* Market Display */}
      {currentMarket && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Market Overview Card */}
          <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    currentMarket.isAi
                      ? 'bg-purple-950 text-purple-300 border border-purple-800/50'
                      : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                  }`}>
                    {currentMarket.isAi ? '🤖 Gerado com IA (Gemini)' : '🎲 Sorteado (Regras Oficiais CP:R)'}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    📍 {currentMarket.district}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-900/40">
                    🛡️ {currentMarket.operatorFixer.securityLevel}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-zinc-100">{currentMarket.name}</h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  <strong>Local Secreto:</strong> {currentMarket.exactLocation}
                </p>
              </div>

              {/* Fixer Operator Info */}
              <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 text-xs min-w-[220px] shrink-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-zinc-500">Fixer Organizador:</span>
                  <span className="text-amber-400 font-bold font-mono">Reputação #{currentMarket.operatorFixer.reputation}</span>
                </div>
                <div className="font-bold text-zinc-200">{currentMarket.operatorFixer.name}</div>
                <p className="text-[11px] text-zinc-400 italic">"{currentMarket.operatorFixer.quirk}"</p>
              </div>
            </div>

            {/* Atmosphere & Entrance Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">
                  Atmosfera & Cenário:
                </span>
                <p className="text-zinc-300 leading-relaxed italic">{currentMarket.atmosphere}</p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-1">
                <span className="text-[10px] font-mono uppercase text-amber-500 font-bold block">
                  Condição de Entrada / Acesso:
                </span>
                <p className="text-zinc-300 leading-relaxed">{currentMarket.operatorFixer.entryCondition}</p>
              </div>
            </div>
          </div>

          {/* Stalls & Vendors Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
              <span>Bancas & Vendedores Clandestinos ({currentMarket.stalls.length})</span>
              <span>Clique em "Comprar" para adquirir</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentMarket.stalls.map((stall, stallIdx) => (
                <div
                  key={stallIdx}
                  className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] hover:border-zinc-700 transition space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Stall Vendor Header */}
                    <div className="border-b border-zinc-800 pb-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                          {stall.category}
                        </span>
                        {stall.specialService && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                            Serviço Clandestino
                          </span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-zinc-100 mt-0.5">{stall.vendorName}</h4>
                      <p className="text-xs text-zinc-400 font-mono">{stall.vendorTitle}</p>
                    </div>

                    {/* Vendor Personality & Style */}
                    <div className="text-xs space-y-1">
                      <p className="text-zinc-300 italic">{stall.vendorStyle}</p>
                      <p className="text-[11px] text-zinc-400">
                        <strong className="text-zinc-300">Negociação:</strong> {stall.vendorPersonality}
                      </p>
                    </div>

                    {/* Special Service (if any) */}
                    {stall.specialService && (
                      <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-900/30 text-[11px] font-mono text-cyan-200 flex items-center gap-2">
                        <Wrench className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{stall.specialService}</span>
                      </div>
                    )}

                    {/* Items for Sale */}
                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] font-mono uppercase text-zinc-500 block">
                        Mercadorias na Bancada:
                      </span>
                      {stall.items.map((item, itemIdx) => {
                        const itemKey = `${stallIdx}-${itemIdx}-${item.name}`;
                        const isBought = purchasedItems[itemKey];

                        return (
                          <div
                            key={itemIdx}
                            className={`p-3 rounded-xl border transition ${
                              isBought
                                ? 'bg-zinc-900/30 border-zinc-800/40 opacity-60'
                                : 'bg-[#0a0a0d] border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 space-y-0.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-bold text-zinc-200">{item.name}</span>
                                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                                    item.condition === 'Militar Restrito'
                                      ? 'bg-red-950 text-red-300 border border-red-800/40'
                                      : item.condition === 'Pirateado / Modificado'
                                      ? 'bg-purple-950 text-purple-300 border border-purple-800/40'
                                      : item.condition === 'Usado em Combate'
                                      ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                                  }`}>
                                    {item.condition}
                                  </span>
                                </div>
                                <p className="text-[11px] text-zinc-400 leading-relaxed">{item.description}</p>
                                {item.mechanicalEffect && (
                                  <div className="text-[10px] font-mono text-cyan-300 pt-0.5">
                                    ⚙️ {item.mechanicalEffect}
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col items-end gap-1.5 shrink-0">
                                <span className="text-xs font-mono font-bold text-emerald-400">
                                  {item.priceLabel || `${item.priceEb}eb`}
                                </span>
                                <span className="text-[10px] font-mono text-zinc-500">
                                  Estoque: {item.stock}
                                </span>
                                <button
                                  onClick={() => handleBuyItem(itemKey, item.name, item.priceEb)}
                                  disabled={isBought}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition flex items-center gap-1 ${
                                    isBought
                                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                      : 'bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/50 text-emerald-300'
                                  }`}
                                >
                                  <ShoppingBag className="w-3 h-3" />
                                  <span>{isBought ? 'Adquirido' : 'Comprar'}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Complication & Bargaining Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Complication Alert */}
            <div className="p-4 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-red-400 font-bold font-mono uppercase">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Complicação no Mercado: {currentMarket.complication.title}</span>
              </div>
              <p className="text-zinc-300 leading-relaxed">{currentMarket.complication.description}</p>
              <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-900/50 text-[11px] font-mono text-amber-300">
                <strong className="text-amber-400 block mb-0.5">Regra Mecânica para o Mestre:</strong>
                <span>{currentMarket.complication.mechanicalHook}</span>
              </div>
            </div>

            {/* Haggling / Bargain Tips */}
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-bold font-mono uppercase">
                <Coins className="w-4 h-4 shrink-0" />
                <span>Dica Oficial de Pechincha & Fixers (CP:R p. 338)</span>
              </div>
              <p className="text-zinc-300 leading-relaxed">{currentMarket.bargainTip}</p>
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-900/50 text-[11px] font-mono text-amber-200">
                <strong>Dica do Mestre:</strong> Peças de cibernéticos recolhidos com a ferramenta de Saque (Loot) podem ser vendidas diretamente aos Ripperdocs deste mercado por 50% do valor!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
