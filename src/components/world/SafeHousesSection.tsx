import React, { useState } from 'react';
import { NIGHT_CITY_DISTRICTS } from '../../data/mapData';
import { districtLabel } from '../../data/districtRegistry';
import {
  Home,
  Shield,
  Coins,
  AlertTriangle,
  Dices,
  Bot,
  Search,
  Filter,
  Users,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MapPin,
  Lock,
} from 'lucide-react';
import {
  SafeHouseItem,
  SAFE_HOUSES_LIST,
  rollSafeHouse,
} from '../../data/chanceOfLifetimeData';
import { getEffectiveApiKey, callGeminiJSON } from '../../services/aiService';

export const SafeHousesSection: React.FC = () => {
  const [selectedHouse, setSelectedHouse] = useState<SafeHouseItem>(SAFE_HOUSES_LIST[0]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [securityFilter, setSecurityFilter] = useState<'all' | 'Baixa' | 'Média' | 'Alta'>('all');
  const [bookedHouseToast, setBookedHouseToast] = useState<string | null>(null);

  // AI Safe House Generator State
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [showAiOptions, setShowAiOptions] = useState<boolean>(false);
  const [aiDistrict, setAiDistrict] = useState<string>(districtLabel(NIGHT_CITY_DISTRICTS[1]));
  const [aiSecurity, setAiSecurity] = useState<string>('Média');
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiSafeHouse, setAiSafeHouse] = useState<SafeHouseItem | null>(null);

  // Filtered List
  const filteredHouses = SAFE_HOUSES_LIST.filter(h => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSec = securityFilter === 'all' || h.security === securityFilter;
    return matchesSearch && matchesSec;
  });

  const handleRollRandom = () => {
    const rolled = rollSafeHouse();
    setSelectedHouse(rolled);
  };

  const handleBookHouse = (house: SafeHouseItem) => {
    setBookedHouseToast(`Esconderijo reservado: ${house.name} (${house.costDailyEb ? `${house.costDailyEb}eb/dia` : house.costNotes}). Anotado no diário da campanha!`);
    setTimeout(() => setBookedHouseToast(null), 4000);
  };

  // AI Generator Function
  const handleGenerateAISafeHouse = async () => {
    setIsAiLoading(true);
    const activeKey = getEffectiveApiKey();

    const prompt = `Você é o Co-Mestre de Cyberpunk RED especialista no suplemento "Chance of a Lifetime" (Safe Houses & Esconderijos Seguros).
Crie um esconderijo clandestino seguro (Safe House) inédito e atmosférico para mercenários de Night City com base em: Distrito: ${aiDistrict} | Segurança: ${aiSecurity} | Notas: ${aiPrompt || 'Esconderijo secreto de mercenários em fuga'}.

Retorne EXCLUSIVAMENTE um objeto JSON válido:
{
  "id": 999,
  "name": "Nome evocativo do esconderijo (ex: Porão Frigorífico da Meat-Corp, Antigo Bunker de Telecom da NetWatch)",
  "district": "${aiDistrict}",
  "costDailyEb": 30,
  "costNotes": "Diária ou condição de pagamento / suborno",
  "capacity": "Capacidade em pessoas",
  "security": "${aiSecurity}",
  "amenities": ["Comodidade 1", "Comodidade 2", "Comodidade 3"],
  "drawbacks": ["Desvantagem ou incômodo 1", "Desvantagem 2"],
  "description": "Descrição rica sensorial e visual do esconderijo",
  "rulesHook": "Regra mecânica / teste com DV para o Mestre resolver complicações"
}`;

    const parsed = await callGeminiJSON<SafeHouseItem>(prompt);
    if (parsed) {
      setAiSafeHouse(parsed);
      setSelectedHouse(parsed);
      setIsAiLoading(false);
      return;
    }

    // Fallback
    const fallback: SafeHouseItem = {
      id: 999,
      name: `Bunker Desativado da Estação de Bombas #${Math.floor(Math.random() * 80 + 10)}`,
      district: aiDistrict,
      costDailyEb: 40,
      costNotes: '40eb pagos ao operador da válvula hidráulica dos esgotos.',
      capacity: 'Até 5 pessoas com equipamentos pesados',
      security: aiSecurity as any,
      amenities: ['Eletricidade puxada de gerador a vapor', 'Água encanada filtrada por carvão ativado', 'Blindagem de concreto militar SP 20'],
      drawbacks: ['Umidade alta e goteiras constantes', 'Eco metálico alto ao falar'],
      description: 'Câmara subterrânea de concreto armado abaixo do sistema de drenagem da cidade. As comportas pesadas selam a sala hermeticamente contra gases e invasões.',
      rulesHook: 'Vedações pneumáticas concedem imunidade total a granadas de gás ou varreduras térmicas de superfície.',
    };
    setAiSafeHouse(fallback);
    setSelectedHouse(fallback);
    setIsAiLoading(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {bookedHouseToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-zinc-900 border border-emerald-500/60 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-mono font-medium">{bookedHouseToast}</span>
        </div>
      )}

      {/* Header and Explanation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#27272a] pb-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Home className="w-5 h-5 text-amber-500" />
            <span>Esconderijos Seguros & Safe Houses (Chance of a Lifetime)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            20 esconderijos oficiais com valores de diária e aluguel em eddies (€/eb), capacidade, segurança, regras e desvantagens para equipes foragidas.
          </p>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="space-y-3">
        {/* 1. Standard Button: Procedural Roll */}
        <button
          onClick={handleRollRandom}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
        >
          <Dices className="w-4 h-4" />
          <span>Sortear Esconderijo de Emergência (Tabela Oficial D20)</span>
        </button>

        {/* 2. Extra Option: AI Safe House Generator */}
        <div className="rounded-xl border border-amber-900/40 bg-amber-950/15 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-zinc-200">Opção Extra: Gerar Esconderijo com IA (Gemini)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAiOptions(!showAiOptions)}
              className="text-[11px] font-mono text-amber-400 hover:text-amber-300 transition flex items-center gap-1"
            >
              <span>{showAiOptions ? 'Ocultar Opções' : 'Personalizar Esconderijo com IA'}</span>
              {showAiOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showAiOptions && (
            <div className="space-y-3 pt-2 border-t border-amber-950/50 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">Distrito:</label>
                  <select
                    value={aiDistrict}
                    onChange={e => setAiDistrict(e.target.value)}
                    className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  >
                    {NIGHT_CITY_DISTRICTS.map(d => (<option key={d.id} value={districtLabel(d)}>{districtLabel(d)}</option>))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1">Nível de Segurança Desejado:</label>
                  <select
                    value={aiSecurity}
                    onChange={e => setAiSecurity(e.target.value)}
                    className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Baixa">Baixa (Discreta, sem armas pesadas)</option>
                    <option value="Média">Média (Portas trancadas, vigias locais)</option>
                    <option value="Alta">Alta (Paredes blindadas, sentinelas armados)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Instruções Adicionais (Opcional):</label>
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder="Ex: Esconderijo subterrâneo próximo ao mar, antigo laboratório farmacêutico..."
                  className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleGenerateAISafeHouse}
            disabled={isAiLoading}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow"
          >
            <Bot className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
            <span>{isAiLoading ? 'IA Projetando Esconderijo...' : 'Gerar Esconderijo com IA'}</span>
          </button>
        </div>
      </div>

      {/* Main Split View: Master-Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: List of 20 Safe Houses (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search and Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, distrito ou comodidade..."
                className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-1.5 text-xs font-mono">
              {(['all', 'Baixa', 'Média', 'Alta'] as const).map(sec => (
                <button
                  key={sec}
                  onClick={() => setSecurityFilter(sec)}
                  className={`px-2.5 py-1 rounded-lg border transition ${
                    securityFilter === sec
                      ? 'bg-amber-950/80 border-amber-600 text-amber-200 font-bold'
                      : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {sec === 'all' ? 'Todas' : `Seg. ${sec}`}
                </button>
              ))}
            </div>
          </div>

          {/* List Items */}
          <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
            {filteredHouses.map(h => {
              const isSelected = selectedHouse?.name === h.name;
              return (
                <div
                  key={h.id}
                  onClick={() => setSelectedHouse(h)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-zinc-800/80 border-amber-500/70 shadow-lg'
                      : 'bg-[#121217] border-[#27272a] hover:bg-zinc-800/40 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono text-amber-400 font-bold">#{h.id}</span>
                      <span className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${
                        h.security === 'Alta'
                          ? 'bg-red-950 text-red-300 border border-red-800/40'
                          : h.security === 'Média'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}>
                        Segurança {h.security}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 truncate">📍 {h.district}</span>
                    </div>

                    <h4 className="text-xs font-bold text-zinc-100 truncate">{h.name}</h4>

                    <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                      <span className="text-emerald-400 font-bold">
                        {h.costDailyEb ? `${h.costDailyEb}eb/dia` : 'Sob Demanda'}
                      </span>
                      <span>•</span>
                      <span>Capacidade: {h.capacity}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Safe House Card (7 cols) */}
        <div className="lg:col-span-7">
          {selectedHouse && (
            <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-5 animate-in fade-in duration-200 shadow-2xl">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold bg-amber-950/70 text-amber-300 border border-amber-800/40">
                      Safe House #{selectedHouse.id}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      📍 {selectedHouse.district}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      selectedHouse.security === 'Alta'
                        ? 'bg-red-950 text-red-300 border border-red-800/40'
                        : selectedHouse.security === 'Média'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                        : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                    }`}>
                      🛡️ Segurança: {selectedHouse.security}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-100">{selectedHouse.name}</h3>
                  <div className="flex items-center gap-3 text-xs font-mono text-zinc-400 mt-1">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Coins className="w-3.5 h-3.5" />
                      {selectedHouse.costDailyEb ? `${selectedHouse.costDailyEb}eb por dia` : selectedHouse.costNotes}
                    </span>
                    {selectedHouse.costMonthlyEb && (
                      <span className="text-zinc-500">({selectedHouse.costMonthlyEb}eb/mês)</span>
                    )}
                    <span>•</span>
                    <span className="flex items-center gap-1 text-zinc-300">
                      <Users className="w-3.5 h-3.5 text-zinc-400" />
                      {selectedHouse.capacity}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleBookHouse(selectedHouse)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition shadow flex items-center gap-1.5 shrink-0"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Reservar Esconderijo</span>
                </button>
              </div>

              {/* Description */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">
                  Descrição & Ambiente do Local:
                </span>
                <p className="text-zinc-300 leading-relaxed italic">{selectedHouse.description}</p>
              </div>

              {/* Cost & Conditions */}
              <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 text-xs space-y-1">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                  Condições de Aluguel / Suborno:
                </span>
                <p className="text-zinc-300">{selectedHouse.costNotes}</p>
              </div>

              {/* Amenities & Drawbacks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Amenities */}
                <div className="p-3.5 rounded-xl bg-emerald-950/15 border border-emerald-900/30 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    Comodidades & Vantagens:
                  </span>
                  <ul className="space-y-1 text-zinc-300 list-disc list-inside">
                    {selectedHouse.amenities.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>

                {/* Drawbacks */}
                <div className="p-3.5 rounded-xl bg-red-950/15 border border-red-900/30 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-red-400 font-bold block flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Desvantagens & Incômodos:
                  </span>
                  <ul className="space-y-1 text-zinc-300 list-disc list-inside">
                    {selectedHouse.drawbacks.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Rules Hook for GM */}
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs space-y-1 font-mono">
                <strong className="text-amber-400 block mb-0.5 text-[11px] uppercase">
                  Regra Mecânica para o Mestre:
                </strong>
                <p className="text-amber-200 text-xs font-sans leading-relaxed">{selectedHouse.rulesHook}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
