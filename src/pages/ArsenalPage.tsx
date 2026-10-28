import React, { useState } from 'react';
import {
  Crosshair,
  Package,
  Cpu,
  Car,
  Coins,
  Shield,
  Search,
  Filter,
  Sparkles,
  Zap,
  Wrench,
  Pill,
  Bomb,
  Radio,
  Copy,
  Check,
  ChevronRight,
  SlidersHorizontal,
  Skull,
  Dices,
  Eye,
  Lock,
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import {
  WEAPONS_DATABASE,
  CYBERWARE_DATABASE,
  ARMOR_DATABASE,
  ATTACHMENTS_DATABASE,
  AMMUNITION_DATABASE,
  STREET_GEAR_DATABASE,
  STREET_DRUGS_DATABASE,
} from '../data/arsenalData';
import { POCKET_PERSONAL_ITEMS, BODY_BANK_HARVEST_TABLE } from '../data/lootData';
import {
  CORPSE_LOOT_TABLE,
  HIDDEN_STASH_TABLE,
  CorpseLootItem,
  HiddenStashItem,
  rollCorpseLoot,
  rollHiddenStash,
} from '../data/chanceOfLifetimeData';
import { VEHICLES_LIST, NOMAD_UPGRADES_TABLE, VehicleModel, VehicleCategory } from '../data/vehiclesData';
import { NPCTier, WeaponItem, CyberwareItem, ArmorItem, AttachmentItem, AmmunitionItem, GearItem, StreetDrugItem } from '../types/system';
import { generateAICustomVehicle } from '../services/aiService';
import { NightMarketSection } from '../components/world/NightMarketSection';

type CatalogCategory =
  | 'all'
  | 'weapons'
  | 'cyberware'
  | 'armor'
  | 'attachments'
  | 'ammo'
  | 'gear'
  | 'drugs';

export const ArsenalPage: React.FC = () => {
  const { system, isRed } = useSystem();
  const [activeTab, setActiveTab] = useState<'catalog' | 'market' | 'loot' | 'garage'>('catalog');

  // LOOT STATE
  const [lootSubTab, setLootSubTab] = useState<'harvest' | 'corpse' | 'stash'>('harvest');
  const [lootTier, setLootTier] = useState<NPCTier>('mook');
  const [generatedLoot, setGeneratedLoot] = useState<{
    cash: number;
    ammo: string;
    weaponDropped: { name: string; damage: string; quality: string; cost: string };
    gearDropped: string;
    drugDropped?: string;
    pocketItems: string[];
    harvestables: { name: string; value: number; dv: number; desc: string }[];
  } | null>(null);
  const [rolledCorpse, setRolledCorpse] = useState<CorpseLootItem | null>(null);
  const [rolledStash, setRolledStash] = useState<HiddenStashItem | null>(null);
  const [corpseSearch, setCorpseSearch] = useState<string>('');
  const [stashSearch, setStashSearch] = useState<string>('');

  // CATALOG STATE
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [catalogCategory, setCatalogCategory] = useState<CatalogCategory>('all');
  const [catalogSystemFilter, setCatalogSystemFilter] = useState<'ALL' | 'RED' | '2020'>('ALL');
  const [weaponSubFilter, setWeaponSubFilter] = useState<string>('Todas');
  const [cyberSubFilter, setCyberSubFilter] = useState<string>('Todos');

  // GARAGE STATE
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel>(VEHICLES_LIST[1]);
  const [installedUpgrades, setInstalledUpgrades] = useState<string[]>([]);
  const [vehicleCategoryFilter, setVehicleCategoryFilter] = useState<VehicleCategory>('Todas');
  const [vehicleClanVibe, setVehicleClanVibe] = useState<string>('Badlands Aldecaldos Off-Road');
  const [isGeneratingVehicleAI, setIsGeneratingVehicleAI] = useState<boolean>(false);
  const [generatedAIVehicle, setGeneratedAIVehicle] = useState<any | null>(null);
  const [customVehicles, setCustomVehicles] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpunk_custom_vehicles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleGenerateAIVehicle = async () => {
    setIsGeneratingVehicleAI(true);
    try {
      const res = await generateAICustomVehicle(selectedVehicle.type, vehicleClanVibe);
      setGeneratedAIVehicle(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingVehicleAI(false);
    }
  };

  const handleSaveCustomVehicle = () => {
    if (!generatedAIVehicle) return;
    const newEntry = {
      ...generatedAIVehicle,
      id: 'custom-veh-' + Date.now(),
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };
    const updated = [newEntry, ...customVehicles];
    setCustomVehicles(updated);
    localStorage.setItem('cyberpunk_custom_vehicles', JSON.stringify(updated));
    alert(`Veículo "${generatedAIVehicle.name}" salvo na garagem permanente da campanha!`);
  };

  // UI state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Generate Loot
  const handleGenerateLoot = () => {
    let cash = 0;
    let ammoCount = 0;
    let ammoType = 'Pistola 9mm / 11mm';
    let quality = 'Padrão';

    // Pick weapon pool according to tier
    let eligibleWeapons = WEAPONS_DATABASE;
    if (lootTier === 'mook') {
      cash = Math.floor(Math.random() * 6 + 1) * 10; // 1d6*10eb
      ammoCount = Math.floor(Math.random() * 12) + 4;
      quality = Math.random() > 0.4 ? 'Qualidade Pobre (Suja/Enferrujada - Engasga com 1 no d10)' : 'Qualidade Padrão';
      eligibleWeapons = WEAPONS_DATABASE.filter(w => w.category.includes('Pistola') || w.category.includes('Branca'));
    } else if (lootTier === 'lieutenant') {
      cash = (Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1)) * 50; // 2d6*50eb
      ammoCount = Math.floor(Math.random() * 25) + 15;
      ammoType = Math.random() > 0.5 ? 'Fuzil 5.56mm (AP Perfurante)' : 'Cartuchos 12GA Slug';
      quality = 'Qualidade Padrão Militar com Mira Holográfica';
      eligibleWeapons = WEAPONS_DATABASE.filter(w => w.category.includes('Submetralhadora') || w.category.includes('Fuzil de Assalto') || w.category.includes('Espingarda'));
    } else if (lootTier === 'miniboss') {
      cash = (Math.floor(Math.random() * 10 + 1)) * 100;
      ammoCount = Math.floor(Math.random() * 40) + 20;
      ammoType = 'Munição Incendiária / Elétrica EMP';
      quality = 'Excelente (+1 no Ataque) com Conectores Smartlink';
      eligibleWeapons = WEAPONS_DATABASE.filter(w => w.category.includes('Fuzil') || w.category.includes('Pesada') || w.name.includes('Monokatana'));
    } else {
      cash = (Math.floor(Math.random() * 10 + 1) + Math.floor(Math.random() * 10 + 1)) * 200;
      ammoCount = Math.floor(Math.random() * 60) + 30;
      ammoType = 'Munição Militar Pesada / Foguetes / Smart';
      quality = 'Lendária / Protótipo Militar (+1 Ataque, Confiabilidade MB)';
      eligibleWeapons = WEAPONS_DATABASE.filter(w => w.category.includes('Pesada') || w.name.includes('Malorian') || w.name.includes('Barrett') || w.name.includes('Kendachi'));
    }

    const randomWeapon = eligibleWeapons[Math.floor(Math.random() * eligibleWeapons.length)] || WEAPONS_DATABASE[0];
    const randomGear = STREET_GEAR_DATABASE[Math.floor(Math.random() * STREET_GEAR_DATABASE.length)];

    let drugFound: string | undefined = undefined;
    if (Math.random() > 0.4) {
      const d = STREET_DRUGS_DATABASE[Math.floor(Math.random() * STREET_DRUGS_DATABASE.length)];
      drugFound = `${d.name} (${d.slang}) - 1 dose em ampola`;
    }

    // Pick 2 random pocket items
    const item1 = POCKET_PERSONAL_ITEMS[Math.floor(Math.random() * POCKET_PERSONAL_ITEMS.length)];
    const item2 = POCKET_PERSONAL_ITEMS[Math.floor(Math.random() * POCKET_PERSONAL_ITEMS.length)];

    // Pick 1-2 harvestables from Body Bank
    const h1 = BODY_BANK_HARVEST_TABLE[Math.floor(Math.random() * BODY_BANK_HARVEST_TABLE.length)];
    const h2 = BODY_BANK_HARVEST_TABLE[Math.floor(Math.random() * BODY_BANK_HARVEST_TABLE.length)];
    const harvestList = [
      { name: h1.name, value: h1.baseResaleEb, dv: h1.harvestDV, desc: h1.description },
    ];
    if (lootTier !== 'mook' && h1.name !== h2.name) {
      harvestList.push({ name: h2.name, value: h2.baseResaleEb, dv: h2.harvestDV, desc: h2.description });
    }

    setGeneratedLoot({
      cash,
      ammo: `${ammoCount} cartuchos (${ammoType})`,
      weaponDropped: {
        name: randomWeapon.name,
        damage: randomWeapon.damage,
        quality,
        cost: randomWeapon.cost || '100eb',
      },
      gearDropped: `${randomGear.name} (${randomGear.category})`,
      drugDropped: drugFound,
      pocketItems: [item1, item2],
      harvestables: harvestList,
    });
  };

  // Toggle Nomad Upgrade
  const toggleUpgrade = (upName: string) => {
    setInstalledUpgrades(prev =>
      prev.includes(upName) ? prev.filter(u => u !== upName) : [...prev, upName]
    );
  };

  // Calculate Vehicle Bonus SDP
  const bonusSDP = installedUpgrades.reduce((sum, upName) => {
    const up = NOMAD_UPGRADES_TABLE.find(u => u.name === upName);
    return sum + (up?.sdpBonus || 0);
  }, 0);

  // Filter Items
  const filteredWeapons = WEAPONS_DATABASE.filter(w => {
    const matchSearch =
      w.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      w.category.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      (w.notes && w.notes.toLowerCase().includes(catalogSearch.toLowerCase()));
    const matchSys = catalogSystemFilter === 'ALL' || w.system === 'BOTH' || w.system === catalogSystemFilter;
    const matchSub = weaponSubFilter === 'Todas' || w.category.toLowerCase().includes(weaponSubFilter.toLowerCase());
    return matchSearch && matchSys && matchSub;
  });

  const filteredCyber = CYBERWARE_DATABASE.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      c.type.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchSys = catalogSystemFilter === 'ALL' || c.system === 'BOTH' || c.system === catalogSystemFilter;
    const matchSub = cyberSubFilter === 'Todos' || c.type.toLowerCase() === cyberSubFilter.toLowerCase();
    return matchSearch && matchSys && matchSub;
  });

  const filteredArmor = ARMOR_DATABASE.filter(a => {
    const matchSearch =
      a.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      a.description.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      a.covers.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchSys = catalogSystemFilter === 'ALL' || a.system === 'BOTH' || a.system === catalogSystemFilter;
    return matchSearch && matchSys;
  });

  const filteredAttachments = ATTACHMENTS_DATABASE.filter(att => {
    const matchSearch =
      att.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      att.effect.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      att.compatibleCategory.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchSys = catalogSystemFilter === 'ALL' || att.system === 'BOTH' || att.system === catalogSystemFilter;
    return matchSearch && matchSys;
  });

  const filteredAmmo = AMMUNITION_DATABASE.filter(ammo => {
    const matchSearch =
      ammo.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      ammo.type.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      ammo.effect.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchSys = catalogSystemFilter === 'ALL' || ammo.system === 'BOTH' || ammo.system === catalogSystemFilter;
    return matchSearch && matchSys;
  });

  const filteredGear = STREET_GEAR_DATABASE.filter(g => {
    const matchSearch =
      g.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      g.category.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      g.description.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchSys = catalogSystemFilter === 'ALL' || g.system === 'BOTH' || g.system === catalogSystemFilter;
    return matchSearch && matchSys;
  });

  const filteredDrugs = STREET_DRUGS_DATABASE.filter(d => {
    const matchSearch =
      d.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      d.slang.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      d.primaryEffect.toLowerCase().includes(catalogSearch.toLowerCase());
    return matchSearch;
  });

  const totalCatalogCount =
    WEAPONS_DATABASE.length +
    CYBERWARE_DATABASE.length +
    ARMOR_DATABASE.length +
    ATTACHMENTS_DATABASE.length +
    AMMUNITION_DATABASE.length +
    STREET_GEAR_DATABASE.length +
    STREET_DRUGS_DATABASE.length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header and Sub-tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-emerald-500" />
            <span>Arsenal, Cromo, Armaduras & Loot</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Catálogo completo dos livros oficiais ({totalCatalogCount} itens indexados), saques detalhados de combate e garagem nômade.
          </p>
        </div>

        {/* Sub-tabs pills */}
        <div className="flex items-center bg-[#14141a] border border-[#27272a] rounded-xl p-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'catalog'
                ? 'bg-zinc-800 text-zinc-100 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Catálogo Geral de Equipamentos
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'market'
                ? 'bg-zinc-800 text-zinc-100 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Mercado Negro (Night Market)
          </button>
          <button
            onClick={() => setActiveTab('loot')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'loot'
                ? 'bg-zinc-800 text-zinc-100 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Saque de Abate (Loot)
          </button>
          <button
            onClick={() => setActiveTab('garage')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'garage'
                ? 'bg-zinc-800 text-zinc-100 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Garagem Nômade
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ABA 1: CATÁLOGO EXPANDIDO DE EQUIPAMENTOS               */}
      {/* ======================================================== */}
      {activeTab === 'catalog' && (
        <div className="space-y-5">
          {/* Top Filter Bar */}
          <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Pesquisar por nome, dano, tipo ou efeito (ex: Malorian, Katana, Smartlink, Kevlar, Black Lace...)"
                  value={catalogSearch}
                  onChange={e => setCatalogSearch(e.target.value)}
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* System selector */}
              <select
                value={catalogSystemFilter}
                onChange={e => setCatalogSystemFilter(e.target.value as any)}
                className="w-full sm:w-auto bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-2 text-zinc-300 font-mono text-xs focus:outline-none"
              >
                <option value="ALL">Todos os Sistemas</option>
                <option value="RED">Apenas RED (2045)</option>
                <option value="2020">Apenas 2020</option>
              </select>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { id: 'all', label: `Todos (${totalCatalogCount})`, icon: <SlidersHorizontal className="w-3 h-3" /> },
                { id: 'weapons', label: `Armas (${WEAPONS_DATABASE.length})`, icon: <Crosshair className="w-3 h-3 text-red-400" /> },
                { id: 'cyberware', label: `Ciberware (${CYBERWARE_DATABASE.length})`, icon: <Cpu className="w-3 h-3 text-cyan-400" /> },
                { id: 'armor', label: `Armaduras (${ARMOR_DATABASE.length})`, icon: <Shield className="w-3 h-3 text-blue-400" /> },
                { id: 'attachments', label: `Acessórios (${ATTACHMENTS_DATABASE.length})`, icon: <Wrench className="w-3 h-3 text-amber-400" /> },
                { id: 'ammo', label: `Munições & Granadas (${AMMUNITION_DATABASE.length})`, icon: <Bomb className="w-3 h-3 text-orange-400" /> },
                { id: 'gear', label: `Equipamentos (${STREET_GEAR_DATABASE.length})`, icon: <Radio className="w-3 h-3 text-purple-400" /> },
                { id: 'drugs', label: `Drogas & Remédios (${STREET_DRUGS_DATABASE.length})`, icon: <Pill className="w-3 h-3 text-emerald-400" /> },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCatalogCategory(cat.id as CatalogCategory)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    catalogCategory === cat.id
                      ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-600'
                      : 'bg-[#0a0a0d] text-zinc-400 hover:text-zinc-200 border border-[#27272a]'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Sub-filters for Weapons */}
            {catalogCategory === 'weapons' && (
              <div className="flex flex-wrap gap-1 pt-2 border-t border-[#27272a] text-[11px] font-mono">
                <span className="text-zinc-500 py-0.5 mr-1">Filtrar Categoria:</span>
                {['Todas', 'Pistola', 'Submetralhadora', 'Espingarda', 'Fuzil', 'Pesada', 'Branca', 'Exótica'].map(sub => (
                  <button
                    key={sub}
                    onClick={() => setWeaponSubFilter(sub)}
                    className={`px-2 py-0.5 rounded-lg border ${
                      weaponSubFilter === sub
                        ? 'bg-red-950/60 text-red-300 border-red-800/80 font-bold'
                        : 'bg-[#0e0e14] text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}

            {/* Sub-filters for Cyberware */}
            {catalogCategory === 'cyberware' && (
              <div className="flex flex-wrap gap-1 pt-2 border-t border-[#27272a] text-[11px] font-mono">
                <span className="text-zinc-500 py-0.5 mr-1">Filtrar Tipo:</span>
                {['Todos', 'Neural', 'Óptico', 'Auditivo', 'Membros', 'Corporal', 'Fashionware', 'Borgware'].map(sub => (
                  <button
                    key={sub}
                    onClick={() => setCyberSubFilter(sub)}
                    className={`px-2 py-0.5 rounded-lg border ${
                      cyberSubFilter === sub
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800/80 font-bold'
                        : 'bg-[#0e0e14] text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 1. SEÇÃO DE ARMAS */}
          {(catalogCategory === 'all' || catalogCategory === 'weapons') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-red-500" />
                  <span>Arsenal Bélico ({filteredWeapons.length} Armas)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredWeapons.map((w, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-2 text-xs flex flex-col justify-between hover:border-zinc-700 transition"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <strong className="text-zinc-100 text-sm block">{w.name}</strong>
                          <span className="text-[10px] font-mono text-zinc-500">{w.category}</span>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
                          {w.system}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px] bg-[#0a0a0d] p-2 rounded-xl border border-[#27272a] text-center">
                        <div>
                          <span className="text-[9px] text-zinc-500 block uppercase">Dano</span>
                          <span className="text-red-400 font-bold">{w.damage}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 block uppercase">CdT / ROF</span>
                          <span className="text-zinc-200">{w.rof || 1}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 block uppercase">Tiros</span>
                          <span className="text-zinc-200">{w.shots || '—'}</span>
                        </div>
                      </div>

                      {w.notes && (
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans pt-1">
                          {w.notes}
                        </p>
                      )}

                      {(w.wa !== undefined || w.concealment || w.reliability) && (
                        <div className="flex flex-wrap gap-2 text-[10px] font-mono text-zinc-500 pt-0.5">
                          {w.wa !== undefined && <span>WA: <strong className="text-zinc-300">{w.wa >= 0 ? `+${w.wa}` : w.wa}</strong></span>}
                          {w.concealment && <span>Ocult.: <strong className="text-zinc-300">{w.concealment}</strong></span>}
                          {w.reliability && <span>Confiab.: <strong className="text-zinc-300">{w.reliability}</strong></span>}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#27272a] flex items-center justify-between">
                      <span className="text-emerald-400 font-mono font-bold text-xs">{w.cost}</span>
                      <button
                        onClick={() => handleCopy(`${w.name} (${w.category}) - Dano: ${w.damage} | CdT: ${w.rof || 1} | Custo: ${w.cost}`, `w-${idx}`)}
                        className="p-1 rounded text-zinc-500 hover:text-zinc-200 transition"
                        title="Copiar Arma"
                      >
                        {copiedId === `w-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. SEÇÃO DE CIBERWARE */}
          {(catalogCategory === 'all' || catalogCategory === 'cyberware') && (
            <div className="space-y-3 pt-4 border-t border-[#27272a]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-500" />
                  <span>Ciberware, Implantes & Borgware ({filteredCyber.length} Implantes)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCyber.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-2 text-xs flex flex-col justify-between hover:border-zinc-700 transition"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <strong className="text-zinc-100 text-sm block">{c.name}</strong>
                          <span className="text-[10px] font-mono text-cyan-400">{c.type}</span>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
                          {c.install}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                        {c.description}
                      </p>

                      <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 pt-1">
                        <span className="text-red-400 font-semibold">Perda Hum.: {c.humanityLoss}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#27272a] flex items-center justify-between">
                      <span className="text-emerald-400 font-mono font-bold text-xs">{c.cost}</span>
                      <button
                        onClick={() => handleCopy(`${c.name} [${c.type}] - Perda: ${c.humanityLoss} | Custo: ${c.cost}\n${c.description}`, `c-${idx}`)}
                        className="p-1 rounded text-zinc-500 hover:text-zinc-200 transition"
                        title="Copiar Ciberware"
                      >
                        {copiedId === `c-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. SEÇÃO DE ARMADURAS */}
          {(catalogCategory === 'all' || catalogCategory === 'armor') && (
            <div className="space-y-3 pt-4 border-t border-[#27272a]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>Armaduras, Coletes & Proteção Balística ({filteredArmor.length} Modelos)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredArmor.map((a, idx) => (
                  <div
                    key={a.id}
                    className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-2 text-xs flex flex-col justify-between hover:border-zinc-700 transition"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <strong className="text-zinc-100 text-sm block">{a.name}</strong>
                          <span className="text-[10px] font-mono text-blue-400">{a.covers}</span>
                        </div>
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/40 text-blue-300">
                          SP {a.sp}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                        {a.description}
                      </p>

                      <div className="p-2 rounded-xl bg-[#0a0a0d] border border-[#27272a] text-[10px] font-mono text-zinc-400 space-y-0.5">
                        <div>Penalidade de Mobilidade: <strong className={a.penalty < 0 ? 'text-red-400' : 'text-emerald-400'}>{a.penalty === 0 ? 'Nenhuma (0)' : `${a.penalty} em REF/DEX/MOVE`}</strong></div>
                        {a.notes && <div className="text-zinc-500 italic">{a.notes}</div>}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#27272a] flex items-center justify-between">
                      <span className="text-emerald-400 font-mono font-bold text-xs">{a.cost}</span>
                      <button
                        onClick={() => handleCopy(`${a.name} - SP: ${a.sp} | Penalidade: ${a.penalty} | Custo: ${a.cost}`, `a-${idx}`)}
                        className="p-1 rounded text-zinc-500 hover:text-zinc-200 transition"
                        title="Copiar Armadura"
                      >
                        {copiedId === `a-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SEÇÃO DE ACESSÓRIOS DE ARMAS */}
          {(catalogCategory === 'all' || catalogCategory === 'attachments') && (
            <div className="space-y-3 pt-4 border-t border-[#27272a]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-500" />
                  <span>Acessórios & Modificações de Armas ({filteredAttachments.length} Itens)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredAttachments.map((att, idx) => (
                  <div
                    key={att.id}
                    className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-2 text-xs flex flex-col justify-between hover:border-zinc-700 transition"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <strong className="text-zinc-100 text-sm block">{att.name}</strong>
                          <span className="text-[10px] font-mono text-amber-400">{att.compatibleCategory}</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                          {att.slotsUsed} Slot{att.slotsUsed > 1 ? 's' : ''}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-900/40 text-[11px] text-amber-200 leading-relaxed font-sans">
                        <strong className="text-amber-400 font-mono block mb-0.5">Efeito Mecânico:</strong>
                        {att.effect}
                      </div>

                      {att.notes && (
                        <p className="text-[10px] text-zinc-500 font-mono italic">
                          *{att.notes}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#27272a] flex items-center justify-between">
                      <span className="text-emerald-400 font-mono font-bold text-xs">{att.cost}</span>
                      <button
                        onClick={() => handleCopy(`${att.name} - ${att.effect} | Custo: ${att.cost}`, `att-${idx}`)}
                        className="p-1 rounded text-zinc-500 hover:text-zinc-200 transition"
                        title="Copiar Acessório"
                      >
                        {copiedId === `att-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. SEÇÃO DE MUNIÇÕES ESPECIAIS & GRANADAS */}
          {(catalogCategory === 'all' || catalogCategory === 'ammo') && (
            <div className="space-y-3 pt-4 border-t border-[#27272a]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                  <Bomb className="w-4 h-4 text-orange-500" />
                  <span>Munições Especiais, Cartuchos & Granadas ({filteredAmmo.length} Tipos)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredAmmo.map((ammo, idx) => (
                  <div
                    key={ammo.id}
                    className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-2 text-xs flex flex-col justify-between hover:border-zinc-700 transition"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <strong className="text-zinc-100 text-sm block">{ammo.name}</strong>
                          <span className="text-[10px] font-mono text-orange-400">{ammo.type}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-orange-950/20 border border-orange-900/40 text-[11px] text-orange-200 leading-relaxed font-sans">
                        <strong className="text-orange-400 font-mono block mb-0.5">Propriedade:</strong>
                        {ammo.effect}
                      </div>

                      {ammo.spAblationBonus && (
                        <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-red-400 border border-zinc-800">
                          Ablação de SP: +{ammo.spAblationBonus}
                        </span>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#27272a] flex items-center justify-between">
                      <span className="text-emerald-400 font-mono font-bold text-xs">{ammo.costPer10}</span>
                      <button
                        onClick={() => handleCopy(`${ammo.name} - ${ammo.effect} | Preço: ${ammo.costPer10}`, `ammo-${idx}`)}
                        className="p-1 rounded text-zinc-500 hover:text-zinc-200 transition"
                        title="Copiar Munição"
                      >
                        {copiedId === `ammo-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. SEÇÃO DE EQUIPAMENTOS DE RUA & FERRAMENTAS */}
          {(catalogCategory === 'all' || catalogCategory === 'gear') && (
            <div className="space-y-3 pt-4 border-t border-[#27272a]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                  <Radio className="w-4 h-4 text-purple-500" />
                  <span>Equipamentos de Rua, Ferramentas & Medicina ({filteredGear.length} Itens)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredGear.map((g, idx) => (
                  <div
                    key={g.id}
                    className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-2 text-xs flex flex-col justify-between hover:border-zinc-700 transition"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <strong className="text-zinc-100 text-sm block">{g.name}</strong>
                          <span className="text-[10px] font-mono text-purple-400">{g.category}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                        {g.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#27272a] flex items-center justify-between">
                      <span className="text-emerald-400 font-mono font-bold text-xs">{g.cost}</span>
                      <button
                        onClick={() => handleCopy(`${g.name} [${g.category}] - ${g.description} | Custo: ${g.cost}`, `g-${idx}`)}
                        className="p-1 rounded text-zinc-500 hover:text-zinc-200 transition"
                        title="Copiar Equipamento"
                      >
                        {copiedId === `g-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. SEÇÃO DE DROGAS DE RUA & FARMACÊUTICOS */}
          {(catalogCategory === 'all' || catalogCategory === 'drugs') && (
            <div className="space-y-3 pt-4 border-t border-[#27272a]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                  <Pill className="w-4 h-4 text-emerald-500" />
                  <span>Drogas de Rua & Farmacêuticos Oficiais ({filteredDrugs.length} Substâncias)</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredDrugs.map((d, idx) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-2 text-xs flex flex-col justify-between hover:border-zinc-700 transition"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <strong className="text-zinc-100 text-sm block">{d.name}</strong>
                          <span className="text-[10px] font-mono text-emerald-400 italic">"{d.slang}"</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                          {d.duration}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-1 text-[11px]">
                        <div>
                          <strong className="text-emerald-400 font-mono block">Efeito Primário:</strong>
                          <span className="text-zinc-300">{d.primaryEffect}</span>
                        </div>
                        <div>
                          <strong className="text-red-400 font-mono block">Efeito Secundário / Crash:</strong>
                          <span className="text-zinc-400">{d.secondaryOrCrashEffect}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-0.5">
                        <span>Método: {d.deliveryMethod}</span>
                        <span>Vício: {d.addictionDV > 0 ? `DV ${d.addictionDV}` : 'Nenhum'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#27272a] flex items-center justify-between">
                      <span className="text-emerald-400 font-mono font-bold text-xs">{d.costPerDose}</span>
                      <button
                        onClick={() => handleCopy(`${d.name} ("${d.slang}") - Efeito: ${d.primaryEffect} | Preço: ${d.costPerDose}`, `d-${idx}`)}
                        className="p-1 rounded text-zinc-500 hover:text-zinc-200 transition"
                        title="Copiar Droga"
                      >
                        {copiedId === `d-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 2: MERCADO NEGRO (NIGHT MARKET)                      */}
      {/* ======================================================== */}
      {activeTab === 'market' && (
        <NightMarketSection />
      )}

      {/* ======================================================== */}
      {/* ABA 3: SAQUE DE ABATE & TABELAS DO CHANCE OF A LIFETIME  */}
      {/* ======================================================== */}
      {activeTab === 'loot' && (
        <div className="space-y-6">
          {/* Sub-Tabs Selector */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 border-b border-[#27272a] pb-3 text-xs font-medium">
            <button
              onClick={() => setLootSubTab('harvest')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                lootSubTab === 'harvest'
                  ? 'bg-zinc-800 text-emerald-400 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>1. Necrópsia de Inimigo Abatido</span>
            </button>
            <button
              onClick={() => setLootSubTab('corpse')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                lootSubTab === 'corpse'
                  ? 'bg-zinc-800 text-amber-400 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Skull className="w-3.5 h-3.5" />
              <span>2. Revista Rápida de Cadáver (Stuff on a Corpse - D20)</span>
            </button>
            <button
              onClick={() => setLootSubTab('stash')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                lootSubTab === 'stash'
                  ? 'bg-zinc-800 text-cyan-400 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>3. Esconderijo Secreto Oculto (Hidden Stashes - D20)</span>
            </button>
          </div>

          {/* SUB-TAB 1: ORIGINAL HARVEST GENERATOR */}
          {lootSubTab === 'harvest' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Controls (4 cols) */}
              <div className="lg:col-span-4 p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block font-mono">
                  Inimigo Abatido:
                </span>

                <div className="space-y-2">
                  {[
                    { id: 'mook', label: 'Capanga / Mook Comum', desc: 'Troco de bolso, armas de rua e drogas leves' },
                    { id: 'lieutenant', label: 'Tenente Tático', desc: 'Mais eddies, armas boas e granadas' },
                    { id: 'miniboss', label: 'Mini-Chefe Blindado', desc: 'Cromo valioso, armas excelentes e Speedheal' },
                    { id: 'boss', label: 'Chefe / Ciberpsicopata', desc: 'Grande soma em eddies, armas raras e cromo pesado' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setLootTier(t.id as NPCTier)}
                      className={`w-full p-2.5 rounded-xl border text-left transition ${
                        lootTier === t.id
                          ? 'bg-emerald-950/40 border-emerald-600/60 text-zinc-100 shadow-sm'
                          : 'bg-[#0a0a0d] border-[#27272a] text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      <div className="text-xs font-semibold">{t.label}</div>
                      <div className="text-[10px] text-zinc-500">{t.desc}</div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleGenerateLoot}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Gerar Saque Real do Cadáver</span>
                </button>
              </div>

              {/* Loot Result Display (8 cols) */}
              <div className="lg:col-span-8">
                {generatedLoot ? (
                  <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-5 shadow-lg">
                    <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40">
                          Saque Concluído // {lootTier.toUpperCase()}
                        </span>
                        <h2 className="text-base font-bold text-zinc-100 mt-1">Espólio e Recompensas Recuperadas</h2>
                      </div>

                      <button
                        onClick={() => {
                          const text = `[SAQUE DE ABATE - ${lootTier.toUpperCase()}]\nDinheiro: ${generatedLoot.cash}eb\nMunição: ${generatedLoot.ammo}\nArma: ${generatedLoot.weaponDropped.name} (${generatedLoot.weaponDropped.damage}) [${generatedLoot.weaponDropped.quality}]\nEquipamento: ${generatedLoot.gearDropped}\n${generatedLoot.drugDropped ? `Droga: ${generatedLoot.drugDropped}\n` : ''}Bolsos: ${generatedLoot.pocketItems.join(', ')}\nColheita Ripperdoc: ${generatedLoot.harvestables.map(h => `${h.name} (+${h.value}eb)`).join(', ')}`;
                          handleCopy(text, 'loot-summary');
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs text-zinc-300 font-mono border border-zinc-800 transition"
                      >
                        {copiedId === 'loot-summary' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId === 'loot-summary' ? 'Copiado!' : 'Copiar Saque'}</span>
                      </button>
                    </div>

                    {/* Cash and Ammo Highlights */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-1">
                        <span className="text-[10px] text-zinc-500 uppercase block flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-amber-400" /> Dinheiro em Espécie (Eddies)
                        </span>
                        <span className="text-2xl font-bold text-emerald-400">{generatedLoot.cash} eb</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-1">
                        <span className="text-[10px] text-zinc-500 uppercase block flex items-center gap-1">
                          <Package className="w-3.5 h-3.5 text-zinc-400" /> Munição Aproveitável
                        </span>
                        <span className="text-sm font-semibold text-zinc-200">{generatedLoot.ammo}</span>
                      </div>
                    </div>

                    {/* Real Weapon & Gear Dropped */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-red-950/40 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-red-400 font-bold flex items-center gap-1">
                          <Crosshair className="w-3.5 h-3.5" /> Arma Recuperada
                        </span>
                        <strong className="text-zinc-100 text-sm block">{generatedLoot.weaponDropped.name}</strong>
                        <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                          <span>Dano: <strong className="text-red-400">{generatedLoot.weaponDropped.damage}</strong></span>
                          <span className="text-emerald-400">{generatedLoot.weaponDropped.cost}</span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-400/90 block pt-0.5">
                          Condição: {generatedLoot.weaponDropped.quality}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-purple-950/40 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-purple-400 font-bold flex items-center gap-1">
                          <Radio className="w-3.5 h-3.5" /> Equipamento Encontrado
                        </span>
                        <strong className="text-zinc-100 text-sm block">{generatedLoot.gearDropped}</strong>
                        {generatedLoot.drugDropped && (
                          <div className="text-[11px] text-emerald-400 font-mono pt-1 flex items-center gap-1">
                            <Pill className="w-3 h-3" />
                            <span>{generatedLoot.drugDropped}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pocket and Personal Items */}
                    <div className="p-4 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-2 text-xs">
                      <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                        Itens Pessoais dos Bolsos (Tabelas Oficiais do Data Pack)
                      </span>
                      <ul className="space-y-1 text-zinc-300">
                        {generatedLoot.pocketItems.map((item, idx) => (
                          <li key={idx} className="bg-zinc-900/60 p-2 rounded-lg border border-zinc-800 text-[11px]">
                            &bull; {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Body Bank Harvest Value Table */}
                    <div className="p-4 rounded-xl bg-[#0a0a0d] border border-red-950/40 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono uppercase text-red-400 font-bold flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5" /> Colheita de Órgãos / Cromo (Banco de Corpos & Ripperdoc)
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">Exige Cirurgia / First Aid</span>
                      </div>

                      <div className="space-y-2">
                        {generatedLoot.harvestables.map((h, i) => (
                          <div key={i} className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                            <div>
                              <strong className="text-zinc-100 block">{h.name}</strong>
                              <span className="text-[10px] text-zinc-400 font-mono">Dificuldade de Extração: DV {h.dv}</span>
                            </div>
                            <div className="text-right font-mono">
                              <span className="text-xs font-bold text-emerald-400">+{h.value} eb</span>
                              <span className="text-[9px] text-zinc-500 block">Revenda na Rua</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 rounded-2xl bg-[#121217] border border-dashed border-[#27272a] text-center space-y-2">
                    <Crosshair className="w-8 h-8 text-zinc-600 mx-auto" />
                    <p className="text-xs text-zinc-400">Nenhum saque gerado no momento.</p>
                    <p className="text-[11px] text-zinc-500">Selecione o nível do inimigo à esquerda e gere o espólio.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-TAB 2: STUFF ON A CORPSE (D20) */}
          {lootSubTab === 'corpse' && (
            <div className="space-y-6">
              {/* Header and Quick Roll Toolbar */}
              <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                    <Skull className="w-5 h-5 text-amber-500" />
                    <span>Revista Rápida de Cadáver (Stuff You Find on a Corpse - D20)</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Tabela suplementar oficial de <em>Chance of a Lifetime</em>. Itens encontrados em bolsos e cadáveres com valor de revenda imediata em eurodólares (€/eb) e ganchos narrativos.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => setRolledCorpse(rollCorpseLoot())}
                    className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-sm font-mono"
                  >
                    <Dices className="w-4 h-4" />
                    <span>Rolar d20 no Cadáver</span>
                  </button>
                </div>
              </div>

              {/* Rolled Result Highlight */}
              {rolledCorpse && (
                <div className="p-6 rounded-2xl bg-[#121217] border border-amber-900/40 space-y-4 shadow-lg animate-in fade-in duration-150">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27272a] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/40 font-bold">
                        d20: #{rolledCorpse.roll}
                      </span>
                      <h4 className="text-base font-bold text-zinc-100">{rolledCorpse.item}</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">Valor Estimado de Revenda</span>
                        <span className="text-sm font-bold font-mono text-emerald-400">
                          {rolledCorpse.resaleEb !== undefined ? `${rolledCorpse.resaleEb} eb` : rolledCorpse.valueFormula || 'Especial'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const text = `[REVISTA DE CADÁVER - d20 #${rolledCorpse.roll}]\nItem: ${rolledCorpse.item}\nValor: ${rolledCorpse.resaleEb ?? rolledCorpse.valueFormula} eb\nDescrição: ${rolledCorpse.description}\nGancho de Mestre: ${rolledCorpse.storyHook}`;
                          handleCopy(text, `corpse-${rolledCorpse.roll}`);
                        }}
                        className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
                        title="Copiar Item"
                      >
                        {copiedId === `corpse-${rolledCorpse.roll}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5">Descrição do Item Encontrado:</span>
                      <p className="text-zinc-300 bg-[#0a0a0d] p-3 rounded-xl border border-zinc-800/80 leading-relaxed">{rolledCorpse.description}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40">
                      <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-1">Gancho de Investigação & Mestre (GM Hook):</span>
                      <p className="text-amber-200 text-xs leading-relaxed">{rolledCorpse.storyHook}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Complete Table Browser */}
              <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-200">Catálogo Completo da Tabela D20 (20 Itens de Bolso)</h4>
                    <p className="text-[11px] text-zinc-400">Clique em qualquer item para inspecioná-lo ou selecionar para a cena.</p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Filtrar itens ou ganchos..."
                      value={corpseSearch}
                      onChange={e => setCorpseSearch(e.target.value)}
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {CORPSE_LOOT_TABLE.filter(item =>
                    item.item.toLowerCase().includes(corpseSearch.toLowerCase()) ||
                    item.description.toLowerCase().includes(corpseSearch.toLowerCase()) ||
                    item.storyHook.toLowerCase().includes(corpseSearch.toLowerCase())
                  ).map(item => (
                    <div
                      key={item.roll}
                      onClick={() => setRolledCorpse(item)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition ${
                        rolledCorpse?.roll === item.roll
                          ? 'bg-amber-950/20 border-amber-600/60 shadow-sm'
                          : 'bg-[#0a0a0d] border-[#27272a] hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-xs mb-1">
                        <span className="text-amber-400 font-bold">d20 #{item.roll}</span>
                        <span className="text-emerald-400 font-bold">
                          {item.resaleEb !== undefined ? `${item.resaleEb} eb` : item.valueFormula}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-zinc-100">{item.item}</h5>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 3: HIDDEN STASHES (D20) */}
          {lootSubTab === 'stash' && (
            <div className="space-y-6">
              {/* Header and Quick Roll Toolbar */}
              <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                    <Package className="w-5 h-5 text-cyan-500" />
                    <span>Esconderijos Secretos Ocultos (Hidden Stash Loot - D20)</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Tabela suplementar de <em>Chance of a Lifetime</em>. Esconderijos com Dificuldade de Detecção (DV de Percepção), tipo de recipiente, valores calculados em eb e ganchos táticos.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={() => setRolledStash(rollHiddenStash())}
                    className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-sm font-mono"
                  >
                    <Dices className="w-4 h-4" />
                    <span>Rolar d20 no Esconderijo</span>
                  </button>
                </div>
              </div>

              {/* Rolled Result Highlight */}
              {rolledStash && (
                <div className="p-6 rounded-2xl bg-[#121217] border border-cyan-900/40 space-y-4 shadow-lg animate-in fade-in duration-150">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27272a] pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40 font-bold">
                        d20: #{rolledStash.roll}
                      </span>
                      <h4 className="text-base font-bold text-zinc-100">{rolledStash.title}</h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">Valor Total do Saque</span>
                        <span className="text-sm font-bold font-mono text-emerald-400">
                          {rolledStash.valueEb !== undefined ? `${rolledStash.valueEb} eb` : rolledStash.valueFormula || 'Variável'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          const text = `[ESCONDERIJO OCULTO - d20 #${rolledStash.roll}]\nTítulo: ${rolledStash.title}\nRecipiente: ${rolledStash.container}\nDetecção: ${rolledStash.detectionDV}\nValor: ${rolledStash.valueEb ?? rolledStash.valueFormula} eb\nConteúdo: ${rolledStash.lootContents}\nDescrição: ${rolledStash.description}\nGancho: ${rolledStash.plotHook}`;
                          handleCopy(text, `stash-${rolledStash.roll}`);
                        }}
                        className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition"
                        title="Copiar Esconderijo"
                      >
                        {copiedId === `stash-${rolledStash.roll}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
                      <span className="text-[10px] text-zinc-500 uppercase block">Tipo de Recipiente / Compartimento</span>
                      <strong className="text-zinc-200">{rolledStash.container}</strong>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0a0a0d] border border-cyan-900/40 space-y-0.5">
                      <span className="text-[10px] text-cyan-400 uppercase block font-bold">Teste de Percepção / Busca</span>
                      <strong className="text-cyan-200">{rolledStash.detectionDV}</strong>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5">Conteúdo do Saque (Loot Contents):</span>
                      <p className="text-zinc-200 bg-[#0a0a0d] p-3 rounded-xl border border-zinc-800/80 font-mono text-[11px] leading-relaxed">
                        {rolledStash.lootContents}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5">Descrição do Local & Contexto:</span>
                      <p className="text-zinc-300 bg-[#0a0a0d] p-3 rounded-xl border border-zinc-800/80 leading-relaxed">
                        {rolledStash.description}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40">
                      <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">Complicação / Gancho de Campanha (Plot Hook):</span>
                      <p className="text-cyan-200 text-xs leading-relaxed">{rolledStash.plotHook}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Complete Table Browser */}
              <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-200">Catálogo Completo da Tabela D20 (20 Esconderijos Secretos)</h4>
                    <p className="text-[11px] text-zinc-400">Clique em qualquer esconderijo para visualizar detalhes e estatísticas completas.</p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Filtrar por nome, container ou DV..."
                      value={stashSearch}
                      onChange={e => setStashSearch(e.target.value)}
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {HIDDEN_STASH_TABLE.filter(stash =>
                    stash.title.toLowerCase().includes(stashSearch.toLowerCase()) ||
                    stash.container.toLowerCase().includes(stashSearch.toLowerCase()) ||
                    stash.description.toLowerCase().includes(stashSearch.toLowerCase()) ||
                    stash.plotHook.toLowerCase().includes(stashSearch.toLowerCase())
                  ).map(stash => (
                    <div
                      key={stash.roll}
                      onClick={() => setRolledStash(stash)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition ${
                        rolledStash?.roll === stash.roll
                          ? 'bg-cyan-950/20 border-cyan-600/60 shadow-sm'
                          : 'bg-[#0a0a0d] border-[#27272a] hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-xs mb-1">
                        <span className="text-cyan-400 font-bold">d20 #{stash.roll}</span>
                        <span className="text-emerald-400 font-bold">
                          {stash.valueEb !== undefined ? `${stash.valueEb} eb` : stash.valueFormula}
                        </span>
                      </div>
                      <h5 className="text-xs font-bold text-zinc-100">{stash.title}</h5>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400 mt-1">
                        <span>{stash.container}</span>
                        <span>&bull;</span>
                        <span className="text-cyan-300">{stash.detectionDV}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 3: GARAGEM & VEÍCULOS NÔMADES                        */}
      {/* ======================================================== */}
      {activeTab === 'garage' && (
        <div className="space-y-6">
          {/* Top Bar: Category Filters & AI Vehicle Forger */}
          <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="space-y-1.5 w-full lg:w-auto">
                <span className="text-xs font-mono uppercase text-zinc-400 font-semibold block">
                  Filtrar por Categoria de Veículo:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                  {[
                    'Todas',
                    'Motocicleta',
                    'Carro Compacto',
                    'Carro Esportivo de Luxo',
                    'Picape / Van',
                    'Caminhão Pesado / Blindado',
                    'Aerodino AV / Aeronave',
                    'Barco / Aquático',
                  ].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setVehicleCategoryFilter(cat as VehicleCategory)}
                      className={`px-3 py-1.5 rounded-lg border transition ${
                        vehicleCategoryFilter === cat
                          ? 'bg-amber-600 border-amber-500 text-white font-bold shadow-sm'
                          : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Vehicle Generator Trigger */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0">
                <select
                  value={vehicleClanVibe}
                  onChange={e => setVehicleClanVibe(e.target.value)}
                  className="bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-300 font-mono w-full sm:w-auto"
                >
                  <option value="Badlands Aldecaldos Off-Road">Clã Aldecaldos (Off-Road / Sucata Militar)</option>
                  <option value="Wraiths Badlands Marauder">Wraiths (Canibais / Espinhos / Lança-Chamas)</option>
                  <option value="Corredor Urbano de Japantown">Corredor Urbano Tyger Claws (Neon & Nitro)</option>
                  <option value="Blindado Brutalista Maelstrom">Maelstrom (Chapas de Aço / Blindado Tóxico)</option>
                  <option value="Intercepação Corporativa Militech">Militech (Preto Fosco / Smartlink Militar)</option>
                </select>

                <button
                  onClick={handleGenerateAIVehicle}
                  disabled={isGeneratingVehicleAI}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-semibold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Sparkles className={`w-4 h-4 ${isGeneratingVehicleAI ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingVehicleAI ? 'Forjando...' : '⚡ Forjar com IA'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* AI Generated Vehicle Showcase Modal/Card if exists */}
          {generatedAIVehicle && (
            <div className="p-6 rounded-2xl bg-[#141219] border border-amber-500/60 space-y-4 shadow-xl animate-fade-in text-xs">
              <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-700/60 text-amber-400">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                      VEÍCULO CUSTOMIZADO FORJADO POR IA // {generatedAIVehicle.baseModel}
                    </span>
                    <h3 className="text-base font-bold text-zinc-100">{generatedAIVehicle.name}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveCustomVehicle}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Salvar na Garagem</span>
                  </button>
                  <button
                    onClick={() => setGeneratedAIVehicle(null)}
                    className="p-1 rounded text-zinc-400 hover:text-zinc-200"
                  >
                    &times;
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 leading-relaxed">
                <div className="space-y-2">
                  <div>
                    <strong className="text-zinc-200 block font-mono text-[11px]">Estilo Visual & Peculiaridades (Quirks):</strong>
                    <p className="text-zinc-300 italic bg-[#0a0a0d] p-2.5 rounded-lg border border-zinc-800">{generatedAIVehicle.quirks}</p>
                  </div>
                  <div>
                    <strong className="text-red-400 block font-mono text-[11px]">Armamento Acoplado:</strong>
                    <p className="text-zinc-200 bg-[#0a0a0d] p-2.5 rounded-lg border border-red-950/50 font-mono">{generatedAIVehicle.mountedWeapons}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <strong className="text-amber-400 block font-mono text-[11px]">Upgrades & Modificações Instaladas:</strong>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {generatedAIVehicle.specialMods?.map((m: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-zinc-900 border border-amber-800/40 text-amber-300 text-[11px] font-mono">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong className="text-zinc-400 block font-mono text-[11px]">Lenda do Veículo / Piloto:</strong>
                    <p className="text-zinc-300 bg-[#0a0a0d] p-2.5 rounded-lg border border-zinc-800">{generatedAIVehicle.lore}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Grid: Vehicle Selector (4 cols) + Details (8 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Vehicle Selector (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block font-mono">
                  Modelos do Catálogo ({VEHICLES_LIST.filter(v => vehicleCategoryFilter === 'Todas' || v.type === vehicleCategoryFilter).length})
                </span>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {VEHICLES_LIST.filter(v => vehicleCategoryFilter === 'Todas' || v.type === vehicleCategoryFilter).map(v => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVehicle(v);
                      setInstalledUpgrades([]);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left transition ${
                      selectedVehicle.id === v.id
                        ? 'bg-amber-950/40 border-amber-600/60 text-zinc-100 shadow-sm'
                        : 'bg-[#0a0a0d] border-[#27272a] text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="text-xs font-semibold flex items-center justify-between">
                      <span className="truncate max-w-[170px]">{v.name}</span>
                      <span className="text-[10px] font-mono text-zinc-500 shrink-0">{v.type}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                      SDP {v.sdp} • Lugares: {v.seats} • {v.costEb}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Detail & Nomad Upgrades (8 cols) */}
            <div className="lg:col-span-8 p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-6">
              <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                    {selectedVehicle.type}
                  </span>
                  <h2 className="text-lg font-bold text-zinc-100 mt-1">{selectedVehicle.name}</h2>
                </div>
                <div className="text-right font-mono">
                  <span className="text-xs text-zinc-500 block">Preço de Mercado</span>
                  <span className="text-sm font-bold text-emerald-400">{selectedVehicle.costEb}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                {selectedVehicle.description}
              </p>

              {/* Standard Equipment */}
              <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 text-xs">
                <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block mb-1">
                  Equipamentos Padrão de Fábrica:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVehicle.standardEquipment.map((eq, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 text-[11px] font-mono">
                      ✓ {eq}
                    </span>
                  ))}
                </div>
              </div>

              {/* Vehicle Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-center">
                <div className="p-3 rounded-xl bg-[#0a0a0d] border border-[#27272a]">
                  <span className="text-[9px] text-zinc-500 block uppercase">SDP (Pontos Estruturais)</span>
                  <span className="text-lg font-bold text-amber-400">
                    {selectedVehicle.sdp + bonusSDP}
                    {bonusSDP > 0 && <span className="text-xs text-emerald-400 font-normal"> (+{bonusSDP})</span>}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#0a0a0d] border border-[#27272a]">
                  <span className="text-[9px] text-zinc-500 block uppercase">Velocidade Máxima</span>
                  <span className="text-lg font-bold text-zinc-200">{selectedVehicle.speedMph} mph</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0a0a0d] border border-[#27272a]">
                  <span className="text-[9px] text-zinc-500 block uppercase">Capacidade de Lugares</span>
                  <span className="text-lg font-bold text-zinc-200">{selectedVehicle.seats} passageiros</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0a0a0d] border border-[#27272a]">
                  <span className="text-[9px] text-zinc-500 block uppercase">Movimento Combate</span>
                  <span className="text-lg font-bold text-zinc-200">{selectedVehicle.moveCombat}m</span>
                </div>
              </div>

              {/* Upgrades Checklist (Nomad Moto Perk) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upgrades Nômades da Habilidade 'Moto' (Interface RED / Corebook)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {installedUpgrades.length} instalados
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {NOMAD_UPGRADES_TABLE.map((up, idx) => {
                    const isChecked = installedUpgrades.includes(up.name);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleUpgrade(up.name)}
                        className={`p-3 rounded-xl border text-left transition flex items-start justify-between gap-2 ${
                          isChecked
                            ? 'bg-amber-950/30 border-amber-600/70 text-zinc-100'
                            : 'bg-[#0a0a0d] border-[#27272a] text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <div>
                          <strong className="block text-zinc-200">{up.name}</strong>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{up.effect}</p>
                          <span className="text-[10px] font-mono text-amber-400 block mt-1">{up.costEb}</span>
                        </div>
                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 ${isChecked ? 'bg-amber-500 border-amber-500 text-black' : 'border-zinc-700'}`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
