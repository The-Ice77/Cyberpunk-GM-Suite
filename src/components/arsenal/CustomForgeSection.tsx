import React, { useState, useEffect } from 'react';
import {
  Car,
  Crosshair,
  Cpu,
  Pill,
  Sparkles,
  Dices,
  Copy,
  Check,
  BookmarkPlus,
  Trash2,
  Shield,
  Zap,
  Gauge,
  Flame,
  Wrench,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
} from 'lucide-react';
import {
  HomebrewVehicle,
  HomebrewWeapon,
  HomebrewCyberware,
  HomebrewGearOrDrug,
} from '../../data/homebrewData';
import {
  generateProceduralVehicle,
  generateProceduralWeapon,
  generateProceduralCyberware,
  generateProceduralGearOrDrug,
  VEHICLE_MANUFACTURERS,
  WEAPON_MANUFACTURERS,
  CYBERWARE_MANUFACTURERS,
  VEHICLE_TYPES,
  WEAPON_CATEGORIES_DATA,
  CYBERWARE_CATEGORIES_DATA,
} from '../../data/customForgeData';
import {
  generateAICustomVehicleDetailed,
  generateAICustomWeaponDetailed,
  generateAICustomCyberwareDetailed,
  generateAICustomGearOrDrugDetailed,
} from '../../services/aiService';

type ForgeCategory = 'vehicles' | 'weapons' | 'cyberware' | 'gear';

export const CustomForgeSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ForgeCategory>('vehicles');

  // Loading states
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Common Prompt / Instructions
  const [customPrompt, setCustomPrompt] = useState<string>('');

  // 1. Vehicle State
  const [vehType, setVehType] = useState<string>('Picape / Van');
  const [vehClan, setVehClan] = useState<string>('Nômades Aldecaldos');
  const [currentVehicle, setCurrentVehicle] = useState<HomebrewVehicle | null>(() =>
    generateProceduralVehicle({ type: 'Picape / Van', clanOrVibe: 'Nômades Aldecaldos' })
  );

  // 2. Weapon State
  const [wpnCategory, setWpnCategory] = useState<string>('Fuzil de Assalto');
  const [wpnMfg, setWpnMfg] = useState<string>('Militech');
  const [wpnQuality, setWpnQuality] = useState<string>('Excelente');
  const [currentWeapon, setCurrentWeapon] = useState<HomebrewWeapon | null>(() =>
    generateProceduralWeapon({ category: 'Fuzil de Assalto', manufacturer: 'Militech', quality: 'Excelente' })
  );

  // 3. Cyberware State
  const [cybType, setCybType] = useState<string>('Neural');
  const [cybMfg, setCybMfg] = useState<string>('Zetatech');
  const [currentCyberware, setCurrentCyberware] = useState<HomebrewCyberware | null>(() =>
    generateProceduralCyberware({ type: 'Neural', manufacturer: 'Zetatech' })
  );

  // 4. Gear / Drug State
  const [gearCategory, setGearCategory] = useState<string>('Droga de Rua / Químico de Combate');
  const [currentGear, setCurrentGear] = useState<HomebrewGearOrDrug | null>(() =>
    generateProceduralGearOrDrug({ category: 'Droga de Rua / Químico de Combate' })
  );

  // Saved Vault in localStorage
  const [savedVehicles, setSavedVehicles] = useState<HomebrewVehicle[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpunk_custom_vehicles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedWeapons, setSavedWeapons] = useState<HomebrewWeapon[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpunk_custom_weapons_forge');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedCyberware, setSavedCyberware] = useState<HomebrewCyberware[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpunk_custom_cyberware_forge');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [savedGear, setSavedGear] = useState<HomebrewGearOrDrug[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpunk_custom_gear_forge');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // GENERATION HANDLERS
  const handleRollProcedural = () => {
    if (activeCategory === 'vehicles') {
      setCurrentVehicle(generateProceduralVehicle({ type: vehType, clanOrVibe: vehClan }));
    } else if (activeCategory === 'weapons') {
      setCurrentWeapon(generateProceduralWeapon({ category: wpnCategory, manufacturer: wpnMfg, quality: wpnQuality }));
    } else if (activeCategory === 'cyberware') {
      setCurrentCyberware(generateProceduralCyberware({ type: cybType, manufacturer: cybMfg }));
    } else {
      setCurrentGear(generateProceduralGearOrDrug({ category: gearCategory }));
    }
  };

  const handleGenerateAI = async () => {
    setIsLoadingAI(true);
    try {
      if (activeCategory === 'vehicles') {
        const res = await generateAICustomVehicleDetailed({
          type: vehType,
          clanOrVibe: vehClan,
          prompt: customPrompt,
        });
        setCurrentVehicle(res);
      } else if (activeCategory === 'weapons') {
        const res = await generateAICustomWeaponDetailed({
          category: wpnCategory,
          manufacturer: wpnMfg,
          quality: wpnQuality,
          prompt: customPrompt,
        });
        setCurrentWeapon(res);
      } else if (activeCategory === 'cyberware') {
        const res = await generateAICustomCyberwareDetailed({
          type: cybType,
          manufacturer: cybMfg,
          prompt: customPrompt,
        });
        setCurrentCyberware(res);
      } else {
        const res = await generateAICustomGearOrDrugDetailed({
          category: gearCategory,
          prompt: customPrompt,
        });
        setCurrentGear(res);
      }
    } catch (e) {
      console.error('Forge AI error:', e);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // SAVE HANDLERS
  const handleSaveCurrent = () => {
    if (activeCategory === 'vehicles' && currentVehicle) {
      const updated = [currentVehicle, ...savedVehicles.filter(v => v.id !== currentVehicle.id)];
      setSavedVehicles(updated);
      localStorage.setItem('cyberpunk_custom_vehicles', JSON.stringify(updated));
    } else if (activeCategory === 'weapons' && currentWeapon) {
      const updated = [currentWeapon, ...savedWeapons.filter(w => w.id !== currentWeapon.id)];
      setSavedWeapons(updated);
      localStorage.setItem('cyberpunk_custom_weapons_forge', JSON.stringify(updated));
    } else if (activeCategory === 'cyberware' && currentCyberware) {
      const updated = [currentCyberware, ...savedCyberware.filter(c => c.id !== currentCyberware.id)];
      setSavedCyberware(updated);
      localStorage.setItem('cyberpunk_custom_cyberware_forge', JSON.stringify(updated));
    } else if (activeCategory === 'gear' && currentGear) {
      const updated = [currentGear, ...savedGear.filter(g => g.id !== currentGear.id)];
      setSavedGear(updated);
      localStorage.setItem('cyberpunk_custom_gear_forge', JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#16121f] via-[#151520] to-[#121217] border border-amber-500/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-700/50 text-[10px] font-mono text-amber-300">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Forja Própria & Gerador Customizado (RED & 2020)</span>
          </div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <span>Forjador de Equipamentos: Veículos, Armas, Cromo & Químicos</span>
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Crie peças únicas personalizadas com estatísticas de regras oficiais completas. Gere instantaneamente em 1 clique pelas tabelas do sistema ou utilize a inteligência artificial do Gemini para designs revolucionários.
          </p>
        </div>

        {/* Category Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#0a0a0d] border border-[#27272a] rounded-xl p-1 text-xs font-mono">
          <button
            onClick={() => setActiveCategory('vehicles')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeCategory === 'vehicles' ? 'bg-amber-600 text-white font-bold shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Veículos</span>
          </button>
          <button
            onClick={() => setActiveCategory('weapons')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeCategory === 'weapons' ? 'bg-red-600 text-white font-bold shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Armas</span>
          </button>
          <button
            onClick={() => setActiveCategory('cyberware')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeCategory === 'cyberware' ? 'bg-cyan-600 text-white font-bold shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Cromo/Implantes</span>
          </button>
          <button
            onClick={() => setActiveCategory('gear')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition ${
              activeCategory === 'gear' ? 'bg-emerald-600 text-white font-bold shadow' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Drogas & Gears</span>
          </button>
        </div>
      </div>

      {/* Control Panel: Parameters & Triggers */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
          <span className="font-mono text-zinc-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
            <Wrench className="w-4 h-4 text-amber-400" />
            <span>Parâmetros de Customização da Forja</span>
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">Modo Dual: Procedural Oficial ou Síntese IA</span>
        </div>

        {/* Category specific selectors */}
        {activeCategory === 'vehicles' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 font-mono">
            <div>
              <label className="text-zinc-400 block text-[10px] mb-1">Chassi / Categoria:</label>
              <select
                value={vehType}
                onChange={e => setVehType(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                {VEHICLE_TYPES.map(vt => (
                  <option key={vt.type} value={vt.type}>{vt.type} (SDP {vt.baseSDP}, SP {vt.baseSP})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-zinc-400 block text-[10px] mb-1">Clã Nômade / Origem:</label>
              <select
                value={vehClan}
                onChange={e => setVehClan(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Nômades Aldecaldos">Aldecaldos (Off-Road / Sucata Militar Reforçada)</option>
                <option value="Wraiths Badlands Marauders">Wraiths (Espinhos / Canibais / Lança-Chamas)</option>
                <option value="Bakkers Nomads">Bakkers (Sobrevivência nas Dunas e Blindagem)</option>
                <option value="Corredores Tyger Claws">Tyger Claws (Neon Underglow & Nitro Urbano)</option>
                <option value="Segurança Tática Militech">Militech (Preto Fosco / Canhões Automáticos)</option>
                <option value="Guerra de Gangue Maelstrom">Maelstrom (Aço Corrugado & Tanques Pesados)</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-400 block text-[10px] mb-1">Instruções Opcionais para IA:</label>
              <input
                type="text"
                placeholder="Ex: Carro com rádio pirata, pintura camuflada..."
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500 font-sans"
              />
            </div>
          </div>
        )}

        {activeCategory === 'weapons' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-mono">
            <div>
              <label className="text-zinc-400 block text-[10px] mb-1">Categoria de Arma:</label>
              <select
                value={wpnCategory}
                onChange={e => setWpnCategory(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-red-500"
              >
                {WEAPON_CATEGORIES_DATA.map(wc => (
                  <option key={wc.category} value={wc.category}>{wc.category} ({wc.damage})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-zinc-400 block text-[10px] mb-1">Fabricante Oficial:</label>
              <select
                value={wpnMfg}
                onChange={e => setWpnMfg(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-red-500"
              >
                {WEAPON_MANUFACTURERS.map(m => (
                  <option key={m.name} value={m.name}>{m.name} ({m.origin})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-zinc-400 block text-[10px] mb-1">Qualidade Oficial:</label>
              <select
                value={wpnQuality}
                onChange={e => setWpnQuality(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-red-500"
              >
                <option value="Padrão">Padrão (Confiável)</option>
                <option value="Excelente">Excelente (+1 no Ataque)</option>
                <option value="Lendária">Lendária (Protótipo Militar)</option>
                <option value="Pobre">Pobre (Engasga com 1 no d10)</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-400 block text-[10px] mb-1">Instruções Opcionais IA:</label>
              <input
                type="text"
                placeholder="Ex: Fuzil com mira termográfica e cano em chamas..."
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-red-500 font-sans"
              />
            </div>
          </div>
        )}

        {activeCategory === 'cyberware' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div>
              <label className="text-zinc-400 block text-[10px] mb-1">Tipo de Ciberware:</label>
              <select
                value={cybType}
                onChange={e => setCybType(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-cyan-500"
              >
                {CYBERWARE_CATEGORIES_DATA.map(cc => (
                  <option key={cc.type} value={cc.type}>{cc.type} (Perda de HL: {cc.baseHL})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-zinc-400 block text-[10px] mb-1">Fabricante Tecnológico:</label>
              <select
                value={cybMfg}
                onChange={e => setCybMfg(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-cyan-500"
              >
                {CYBERWARE_MANUFACTURERS.map(m => (
                  <option key={m.name} value={m.name}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-zinc-400 block text-[10px] mb-1">Instruções Opcionais IA:</label>
              <input
                type="text"
                placeholder="Ex: Implante subdérmico de camuflagem holográfica..."
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
          </div>
        )}

        {activeCategory === 'gear' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
            <div>
              <label className="text-zinc-400 block text-[10px] mb-1">Categoria de Químico ou Equipamento:</label>
              <select
                value={gearCategory}
                onChange={e => setGearCategory(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="Droga de Rua / Químico de Combate">Droga de Rua / Químico de Combate</option>
                <option value="Cyberdeck Customizado">Cyberdeck Customizado</option>
                <option value="Blindagem / Traje Tático">Blindagem / Traje Tático</option>
                <option value="Equipamento Especial">Equipamento Especial de Sobrevivência</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-400 block text-[10px] mb-1">Instruções Opcionais IA:</label>
              <input
                type="text"
                placeholder="Ex: Estimulante para Netrunners com efeito de foco..."
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={handleRollProcedural}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 font-mono text-xs font-semibold transition border border-zinc-700 flex items-center justify-center gap-2 shadow-sm"
          >
            <Dices className="w-4 h-4 text-amber-400" />
            <span>🎲 Forjar Rápido (Tabelas de Regras)</span>
          </button>

          <button
            onClick={handleGenerateAI}
            disabled={isLoadingAI}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-red-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 active:scale-95 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 text-yellow-200 ${isLoadingAI ? 'animate-spin' : ''}`} />
            <span>{isLoadingAI ? 'Sintetizando com IA...' : '⚡ Opção Extra: Forjar com IA (Gemini)'}</span>
          </button>
        </div>
      </div>

      {/* RESULT SHOWCASE CARD */}
      {activeCategory === 'vehicles' && currentVehicle && (
        <div className="p-6 rounded-2xl bg-[#131218] border border-amber-500/50 space-y-4 shadow-xl animate-fade-in text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-700/60 text-amber-400">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-zinc-100">{currentVehicle.name}</h3>
                  <span className={`text-[10px] font-mono px-2 py-0.2 rounded border ${
                    currentVehicle.isAiGenerated
                      ? 'bg-purple-950/80 border-purple-700 text-purple-300'
                      : 'bg-amber-950/80 border-amber-800 text-amber-300'
                  }`}>
                    {currentVehicle.isAiGenerated ? '⚡ IA Gemini' : '🎲 Regras Oficiais'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 mt-0.5">
                  <span className="text-amber-400 font-bold">{currentVehicle.manufacturer}</span>
                  <span>&bull;</span>
                  <span>{currentVehicle.type}</span>
                  <span>&bull;</span>
                  <span className="text-zinc-500">{currentVehicle.clanOrOrigin}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-emerald-400 font-mono font-bold text-sm bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-lg">
                {currentVehicle.costEb}
              </span>
              <button
                onClick={handleSaveCurrent}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono text-xs flex items-center gap-1.5 transition active:scale-95"
                title="Salvar na Garagem da Campanha"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                <span>Salvar</span>
              </button>
              <button
                onClick={() => {
                  const txt = `[VEÍCULO: ${currentVehicle.name}]\nModelo: ${currentVehicle.model} (${currentVehicle.type})\nSDP: ${currentVehicle.sdp} | SP Chassi: ${currentVehicle.armorBodySP} | SP Vidros: ${currentVehicle.armorGlassSP}\nVelocidade: ${currentVehicle.speedMph} mph (${currentVehicle.combatMove}m/turno) | Manejo DV: ${currentVehicle.handlingDV}\nMotor: ${currentVehicle.engineAndFuel}\nAssentos: ${currentVehicle.seats} | Carga: ${currentVehicle.cargoCapacityKg}kg\nUpgrades: ${currentVehicle.installedNomadMods.join(', ')}\nArmas: ${currentVehicle.weaponsMounted.map(w => `${w.name} (${w.damage})`).join(', ') || 'Nenhuma'}\nVisual: ${currentVehicle.visualAesthetic}\nPeculiaridade: ${currentVehicle.quirk}`;
                  handleCopy(txt, currentVehicle.id);
                }}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
                title="Copiar Ficha do Veículo"
              >
                {copiedId === currentVehicle.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 font-mono text-[11px]">
            <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">SDP Estrutural</span>
              <strong className="text-red-400 text-sm block">{currentVehicle.sdp} SDP</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Blindagem SP</span>
              <strong className="text-amber-300 text-sm block">SP {currentVehicle.armorBodySP} / {currentVehicle.armorGlassSP}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Velocidade Máx</span>
              <strong className="text-zinc-100 text-sm block">{currentVehicle.speedMph} mph</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Combate (MOVE)</span>
              <strong className="text-cyan-400 text-sm block">{currentVehicle.combatMove}m / turno</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Manejo (DV Piloto)</span>
              <strong className="text-purple-300 text-sm block">DV {currentVehicle.handlingDV}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Lotação & Carga</span>
              <strong className="text-zinc-200 text-sm block">{currentVehicle.seats} pax / {currentVehicle.cargoCapacityKg}kg</strong>
            </div>
          </div>

          {/* Engine & Weapons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800/80 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Motor & Combustível:</span>
              <p className="text-zinc-200 font-mono text-xs">{currentVehicle.engineAndFuel}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800/80 space-y-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block">Armamento Embarcado:</span>
              {currentVehicle.weaponsMounted.length > 0 ? (
                <div className="space-y-1 text-xs font-mono">
                  {currentVehicle.weaponsMounted.map((w, i) => (
                    <div key={i} className="text-red-400 flex items-center justify-between">
                      <span>&bull; {w.name} ({w.damage}, ROF {w.rof})</span>
                      <span className="text-[10px] text-zinc-500">{w.mountType}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-zinc-500 italic text-xs">Sem armas instaladas de fábrica.</span>
              )}
            </div>
          </div>

          {/* Nomad Mods */}
          {currentVehicle.installedNomadMods.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-1.5">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">
                Upgrades & Modificações Nômades Instaladas:
              </span>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {currentVehicle.installedNomadMods.map((mod, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-[#0a0a0d] border border-amber-900/60 text-zinc-300">
                    &bull; {mod}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sensory Visuals & Quirk */}
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5">Estética Visual & Carroceria:</span>
              <p className="text-zinc-300 bg-[#0a0a0d] p-3 rounded-xl border border-zinc-800/80 leading-relaxed">
                {currentVehicle.visualAesthetic}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">Peculiaridade de Direção / Mecânica:</span>
                <p className="text-zinc-300 leading-relaxed text-xs">{currentVehicle.quirk}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESULT SHOWCASE CARD: WEAPON */}
      {activeCategory === 'weapons' && currentWeapon && (
        <div className="p-6 rounded-2xl bg-[#171214] border border-red-500/50 space-y-4 shadow-xl animate-fade-in text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-700/60 text-red-400">
                <Crosshair className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-zinc-100">{currentWeapon.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded border bg-red-950/80 border-red-800 text-red-300">
                    {currentWeapon.category}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                  <span>Confiabilidade: {currentWeapon.reliability}</span> &bull; <span>Ocultabilidade: {currentWeapon.concealment}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-emerald-400 font-mono font-bold text-sm bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-lg">
                {currentWeapon.cost}
              </span>
              <button
                onClick={handleSaveCurrent}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono text-xs flex items-center gap-1.5 transition active:scale-95"
                title="Salvar no Arsenal da Campanha"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-red-400" />
                <span>Salvar</span>
              </button>
              <button
                onClick={() => {
                  const txt = `[ARMA: ${currentWeapon.name}]\nCategoria: ${currentWeapon.category} | Dano: ${currentWeapon.damage} (ROF ${currentWeapon.rof})\nCarregador: ${currentWeapon.shots ?? 'N/A'} disparos | Confiabilidade: ${currentWeapon.reliability || 'Padrão'}\nEfeito Especial: ${currentWeapon.specialEffect}\nNotas: ${currentWeapon.notes || ''}`;
                  handleCopy(txt, currentWeapon.id);
                }}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
                title="Copiar Ficha da Arma"
              >
                {copiedId === currentWeapon.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Dano Oficial</span>
              <strong className="text-red-400 text-base">{currentWeapon.damage}</strong>
            </div>
            <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Cadência (ROF)</span>
              <strong className="text-amber-300 text-base">ROF {currentWeapon.rof}</strong>
            </div>
            <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Carregador (Shots)</span>
              <strong className="text-zinc-200 text-base">{(currentWeapon.shots ?? 0) > 0 ? `${currentWeapon.shots} balas` : 'Corpo a Corpo'}</strong>
            </div>
            <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Ocultabilidade</span>
              <strong className="text-purple-300 text-xs">{currentWeapon.concealment}</strong>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-800/40 space-y-1">
            <span className="text-[10px] font-mono uppercase text-red-400 font-bold block">
              Efeito Mecânico & Regra Especial no Combate:
            </span>
            <p className="text-red-200 leading-relaxed font-mono text-xs">{currentWeapon.specialEffect}</p>
          </div>

          <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800/80 space-y-1 text-xs">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Dossiê de Customização, Acessórios & Estética:</span>
            <p className="text-zinc-300 leading-relaxed">{currentWeapon.notes}</p>
          </div>
        </div>
      )}

      {/* RESULT SHOWCASE CARD: CYBERWARE */}
      {activeCategory === 'cyberware' && currentCyberware && (
        <div className="p-6 rounded-2xl bg-[#12161b] border border-cyan-500/50 space-y-4 shadow-xl animate-fade-in text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-400">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-zinc-100">{currentCyberware.name}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded border bg-cyan-950/80 border-cyan-800 text-cyan-300">
                    Tipo: {currentCyberware.type}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                  <span>Perda de Humanidade: <strong className="text-red-400">{currentCyberware.humanityLoss}</strong></span> &bull; <span>Instalação: {currentCyberware.install}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-emerald-400 font-mono font-bold text-sm bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-lg">
                {currentCyberware.cost}
              </span>
              <button
                onClick={handleSaveCurrent}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono text-xs flex items-center gap-1.5 transition active:scale-95"
                title="Salvar na Biblioteca de Cromo"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-cyan-400" />
                <span>Salvar</span>
              </button>
              <button
                onClick={() => {
                  const txt = `[CROMO: ${currentCyberware.name}]\nTipo: ${currentCyberware.type} | Perda de Humanidade: ${currentCyberware.humanityLoss}\nInstalação: ${currentCyberware.install} | Preço: ${currentCyberware.cost}\nBônus Mecânico: ${currentCyberware.mechanicalBonus}\nDescrição: ${currentCyberware.description}`;
                  handleCopy(txt, currentCyberware.id);
                }}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
                title="Copiar Ficha do Cromo"
              >
                {copiedId === currentCyberware.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Perda de Humanidade (HL)</span>
              <strong className="text-red-400 text-sm">{currentCyberware.humanityLoss}</strong>
            </div>
            <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Local de Instalação</span>
              <strong className="text-zinc-200 text-sm">{currentCyberware.install}</strong>
            </div>
            <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
              <span className="text-[10px] text-zinc-500 uppercase block">Custo em Eddies</span>
              <strong className="text-emerald-400 text-sm">{currentCyberware.cost}</strong>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 space-y-1">
            <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
              Bônus Mecânico & Efeito na Ficha:
            </span>
            <p className="text-cyan-200 leading-relaxed font-mono text-xs">{currentCyberware.mechanicalBonus}</p>
          </div>

          <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800/80 space-y-1 text-xs">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Dossiê do Implante, Acabamento & Peculiaridade:</span>
            <p className="text-zinc-300 leading-relaxed">{currentCyberware.description}</p>
          </div>
        </div>
      )}

      {/* RESULT SHOWCASE CARD: GEAR / DRUG */}
      {activeCategory === 'gear' && currentGear && (
        <div className="p-6 rounded-2xl bg-[#121815] border border-emerald-500/50 space-y-4 shadow-xl animate-fade-in text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-400">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-zinc-100">{currentGear.name}</h3>
                  <span className="text-[10px] font-mono text-emerald-400 italic">"{currentGear.slang}"</span>
                </div>
                <div className="text-[11px] font-mono text-zinc-400 mt-0.5">
                  <span>Categoria: {currentGear.category}</span> &bull; <span>Método: {currentGear.deliveryMethodOrInterface}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-emerald-400 font-mono font-bold text-sm bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1 rounded-lg">
                {currentGear.costEb}
              </span>
              <button
                onClick={handleSaveCurrent}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono text-xs flex items-center gap-1.5 transition active:scale-95"
                title="Salvar no Inventário da Campanha"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Salvar</span>
              </button>
              <button
                onClick={() => {
                  const txt = `[ITEM: ${currentGear.name} ("${currentGear.slang}")]\nCategoria: ${currentGear.category} | Preço: ${currentGear.costEb}\nEfeito: ${currentGear.primaryEffect}\nEfeito Secundário/Crash: ${currentGear.secondaryOrCrashEffect}\nDuração: ${currentGear.duration || 'N/A'}\nNotas: ${currentGear.notes}`;
                  handleCopy(txt, currentGear.id);
                }}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
                title="Copiar Ficha do Item"
              >
                {copiedId === currentGear.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 space-y-1">
              <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                Efeito Primário de Combate:
              </span>
              <p className="text-emerald-200 leading-relaxed font-mono">{currentGear.primaryEffect}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-800/40 space-y-1">
              <span className="text-[10px] font-mono uppercase text-red-400 font-bold block">
                Efeito Secundário / Crash / Vício:
              </span>
              <p className="text-red-300 leading-relaxed font-mono">{currentGear.secondaryOrCrashEffect} {currentGear.addictionDV ? `(DV de Vício: ${currentGear.addictionDV})` : ''}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800/80 space-y-1 text-xs">
            <span className="text-[10px] font-mono uppercase text-zinc-500 block">Estética Visual & Dossiê:</span>
            <p className="text-zinc-300 leading-relaxed">{currentGear.visualAesthetic} {currentGear.notes}</p>
          </div>
        </div>
      )}

      {/* SAVED ITEMS VAULT (LOCALSTORAGE PERSISTENCE) */}
      <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
        <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
          <div className="flex items-center gap-2">
            <BookmarkPlus className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold text-zinc-100">
              Acervo de Criações Salvas ({activeCategory === 'vehicles' ? savedVehicles.length : activeCategory === 'weapons' ? savedWeapons.length : activeCategory === 'cyberware' ? savedCyberware.length : savedGear.length})
            </h4>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Persistido no navegador</span>
        </div>

        {activeCategory === 'vehicles' && (
          savedVehicles.length === 0 ? (
            <p className="text-xs text-zinc-500 italic">Nenhum veículo forjado salvo ainda. Clique em "Salvar" após forjar.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {savedVehicles.map(veh => (
                <div key={veh.id} className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2 hover:border-zinc-600 transition flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <strong className="text-zinc-100 font-bold">{veh.name}</strong>
                      <span className="text-emerald-400 font-mono font-bold text-[11px]">{veh.costEb}</span>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400">
                      <span>{veh.type}</span> &bull; <span>{veh.sdp} SDP</span> &bull; <span>SP {veh.armorBodySP}</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] line-clamp-2">{veh.visualAesthetic}</p>
                  </div>
                  <div className="pt-2 border-t border-zinc-850 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentVehicle(veh)}
                      className="text-amber-400 hover:text-amber-300 font-mono text-[11px] underline"
                    >
                      Carregar Ficha
                    </button>
                    <button
                      onClick={() => {
                        const updated = savedVehicles.filter(v => v.id !== veh.id);
                        setSavedVehicles(updated);
                        localStorage.setItem('cyberpunk_custom_vehicles', JSON.stringify(updated));
                      }}
                      className="p-1 rounded text-zinc-500 hover:text-red-400 transition"
                      title="Excluir Veículo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeCategory === 'weapons' && (
          savedWeapons.length === 0 ? (
            <p className="text-xs text-zinc-500 italic">Nenhuma arma forjada salva ainda.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {savedWeapons.map(wpn => (
                <div key={wpn.id} className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2 hover:border-zinc-600 transition flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <strong className="text-zinc-100 font-bold">{wpn.name}</strong>
                      <span className="text-emerald-400 font-mono font-bold text-[11px]">{wpn.cost}</span>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400">
                      <span>{wpn.category}</span> &bull; <span className="text-red-400 font-bold">{wpn.damage}</span> &bull; <span>ROF {wpn.rof}</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] line-clamp-2">{wpn.specialEffect}</p>
                  </div>
                  <div className="pt-2 border-t border-zinc-850 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentWeapon(wpn)}
                      className="text-red-400 hover:text-red-300 font-mono text-[11px] underline"
                    >
                      Carregar Ficha
                    </button>
                    <button
                      onClick={() => {
                        const updated = savedWeapons.filter(w => w.id !== wpn.id);
                        setSavedWeapons(updated);
                        localStorage.setItem('cyberpunk_custom_weapons_forge', JSON.stringify(updated));
                      }}
                      className="p-1 rounded text-zinc-500 hover:text-red-400 transition"
                      title="Excluir Arma"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeCategory === 'cyberware' && (
          savedCyberware.length === 0 ? (
            <p className="text-xs text-zinc-500 italic">Nenhum cromo forjado salvo ainda.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {savedCyberware.map(cyb => (
                <div key={cyb.id} className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2 hover:border-zinc-600 transition flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <strong className="text-zinc-100 font-bold">{cyb.name}</strong>
                      <span className="text-emerald-400 font-mono font-bold text-[11px]">{cyb.cost}</span>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400">
                      <span>Tipo: {cyb.type}</span> &bull; <span className="text-red-400">HL: {cyb.humanityLoss}</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] line-clamp-2">{cyb.mechanicalBonus}</p>
                  </div>
                  <div className="pt-2 border-t border-zinc-850 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentCyberware(cyb)}
                      className="text-cyan-400 hover:text-cyan-300 font-mono text-[11px] underline"
                    >
                      Carregar Ficha
                    </button>
                    <button
                      onClick={() => {
                        const updated = savedCyberware.filter(c => c.id !== cyb.id);
                        setSavedCyberware(updated);
                        localStorage.setItem('cyberpunk_custom_cyberware_forge', JSON.stringify(updated));
                      }}
                      className="p-1 rounded text-zinc-500 hover:text-red-400 transition"
                      title="Excluir Cromo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {activeCategory === 'gear' && (
          savedGear.length === 0 ? (
            <p className="text-xs text-zinc-500 italic">Nenhum item ou droga salva ainda.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {savedGear.map(g => (
                <div key={g.id} className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2 hover:border-zinc-600 transition flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <strong className="text-zinc-100 font-bold">{g.name}</strong>
                        <span className="text-emerald-400 italic text-[10px] block">"{g.slang}"</span>
                      </div>
                      <span className="text-emerald-400 font-mono font-bold text-[11px]">{g.costEb}</span>
                    </div>
                    <p className="text-zinc-400 text-[11px] line-clamp-2">{g.primaryEffect}</p>
                  </div>
                  <div className="pt-2 border-t border-zinc-850 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentGear(g)}
                      className="text-emerald-400 hover:text-emerald-300 font-mono text-[11px] underline"
                    >
                      Carregar Ficha
                    </button>
                    <button
                      onClick={() => {
                        const updated = savedGear.filter(item => item.id !== g.id);
                        setSavedGear(updated);
                        localStorage.setItem('cyberpunk_custom_gear_forge', JSON.stringify(updated));
                      }}
                      className="p-1 rounded text-zinc-500 hover:text-red-400 transition"
                      title="Excluir Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};
