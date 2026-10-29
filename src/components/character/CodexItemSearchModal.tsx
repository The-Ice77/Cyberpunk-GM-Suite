import React, { useState, useMemo } from 'react';
import {
  Search,
  Crosshair,
  Cpu,
  Shield,
  Wrench,
  Bomb,
  Radio,
  Pill,
  Sparkles,
  Plus,
  Check,
  X,
  DollarSign,
  Package,
  Layers,
  ChevronRight,
  Info,
  Flame,
  Zap,
} from 'lucide-react';
import {
  WEAPONS_DATABASE,
  CYBERWARE_DATABASE,
  ARMOR_DATABASE,
  ATTACHMENTS_DATABASE,
  AMMUNITION_DATABASE,
  STREET_GEAR_DATABASE,
  STREET_DRUGS_DATABASE,
} from '../../data/arsenalData';
import {
  WeaponItem,
  CyberwareItem,
  ArmorItem,
  AttachmentItem,
  AmmunitionItem,
  GearItem,
  StreetDrugItem,
} from '../../types/system';
import { OFFICIAL_HEAD_ARMORS, OFFICIAL_BODY_ARMORS } from '../../pages/PlayerSheetPage';
import { PlayerCharacter } from '../../data/playerArchetypes';
import { getWeaponIcon, getCyberwareIcon, getGearIcon } from '../../utils/itemIcons';

export type CodexCategory =
  | 'all'
  | 'weapons'
  | 'attachments'
  | 'ammo'
  | 'gear'
  | 'cyberware'
  | 'armor'
  | 'drugs'
  | 'homebrew';

interface UnifiedCodexItem {
  id: string;
  name: string;
  category: CodexCategory;
  categoryLabel: string;
  costEb: number;
  costString: string;
  description: string;
  iconType: 'weapon' | 'cyber' | 'gear' | 'armor';
  raw: any;
  // Specific properties
  damage?: string;
  rof?: number;
  mag?: number;
  ammoType?: string;
  humanityLoss?: string;
  sp?: number;
  penalty?: number;
  covers?: string;
  effect?: string;
  isHomebrew?: boolean;
}

interface CodexItemSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  character: PlayerCharacter;
  onEquipWeapon: (weapon: {
    name: string;
    damage: string;
    rof: number;
    ammoType: string;
    magCapacity: number;
    magCurrent: number;
    notes?: string;
  }) => void;
  onInstallCyberware: (cyber: {
    name: string;
    type: string;
    humanityCost: number;
    description: string;
  }, deductHumanity: boolean) => void;
  onEquipArmor: (armor: {
    type: 'head' | 'body';
    name: string;
    sp: number;
    penalty?: number;
  }) => void;
  onAddGearItem: (itemString: string) => void;
  onAttachToWeapon?: (weaponIdx: number, attachmentName: string, benefitText: string) => void;
  onDeductCash?: (amount: number) => void;
  initialCategory?: CodexCategory;
}

export const CodexItemSearchModal: React.FC<CodexItemSearchModalProps> = ({
  isOpen,
  onClose,
  character,
  onEquipWeapon,
  onInstallCyberware,
  onEquipArmor,
  onAddGearItem,
  onAttachToWeapon,
  onDeductCash,
  initialCategory = 'all',
}) => {
  const [activeCategory, setActiveCategory] = useState<CodexCategory>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<UnifiedCodexItem | null>(null);
  
  // Equip options state
  const [deductMoney, setDeductMoney] = useState<boolean>(true);
  const [deductHumanity, setDeductHumanity] = useState<boolean>(true);
  const [gearQuantity, setGearQuantity] = useState<number>(1);
  const [targetWeaponIndex, setTargetWeaponIndex] = useState<number>(0);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Helper to parse cost
  const parseCost = (costStr: string | number | undefined): number => {
    if (typeof costStr === 'number') return costStr;
    if (!costStr) return 0;
    const match = costStr.replace(/[^0-9]/g, '');
    return match ? parseInt(match, 10) : 0;
  };

  // Compile Unified Codex Database
  const unifiedDatabase = useMemo<UnifiedCodexItem[]>(() => {
    const list: UnifiedCodexItem[] = [];

    // 1. Weapons
    WEAPONS_DATABASE.forEach((w, idx) => {
      const cost = parseCost(w.cost);
      list.push({
        id: `w-${idx}-${w.name}`,
        name: w.name,
        category: 'weapons',
        categoryLabel: 'Arma / Lâmina',
        costEb: cost,
        costString: w.cost || `${cost} eb`,
        description: w.notes || 'Arma oficial do livro de regras.',
        damage: w.damage,
        rof: w.rof || 1,
        mag: w.shots || 8,
        ammoType: w.category || 'Munição Padrão',
        iconType: 'weapon',
        raw: w,
      });
    });

    // 2. Attachments & Accessories
    ATTACHMENTS_DATABASE.forEach((a, idx) => {
      const cost = parseCost(a.cost);
      list.push({
        id: `att-${idx}-${a.name}`,
        name: a.name,
        category: 'attachments',
        categoryLabel: 'Acessório de Arma',
        costEb: cost,
        costString: a.cost || `${cost} eb`,
        description: `${a.effect} (Slots: ${a.slotsUsed}) ${a.notes || ''}`.trim(),
        effect: a.compatibleCategory,
        iconType: 'gear',
        raw: a,
      });
    });

    // 3. Ammunition & Grenades
    AMMUNITION_DATABASE.forEach((ammo, idx) => {
      const cost = parseCost(ammo.costPer10);
      list.push({
        id: `ammo-${idx}-${ammo.name}`,
        name: ammo.name,
        category: 'ammo',
        categoryLabel: 'Munição / Granada',
        costEb: cost,
        costString: ammo.costPer10 || `${cost} eb (x10)`,
        description: `${ammo.effect} ${ammo.damageModifier ? `[Dano: ${ammo.damageModifier}]` : ''}`.trim(),
        effect: ammo.effect,
        ammoType: ammo.type,
        iconType: 'gear',
        raw: ammo,
      });
    });

    // 4. Street Gear & Survival
    STREET_GEAR_DATABASE.forEach((g, idx) => {
      const cost = parseCost(g.cost);
      list.push({
        id: `gear-${idx}-${g.name}`,
        name: g.name,
        category: 'gear',
        categoryLabel: 'Equipamento de Campo',
        costEb: cost,
        costString: g.cost || `${cost} eb`,
        description: g.description,
        iconType: 'gear',
        raw: g,
      });
    });

    // 5. Cyberware & Implants
    CYBERWARE_DATABASE.forEach((c, idx) => {
      const cost = parseCost(c.cost);
      list.push({
        id: `cyber-${idx}-${c.name}`,
        name: c.name,
        category: 'cyberware',
        categoryLabel: `Ciberware [${c.type}]`,
        costEb: cost,
        costString: c.cost || `${cost} eb`,
        description: c.description,
        humanityLoss: c.humanityLoss,
        iconType: 'cyber',
        raw: c,
      });
    });

    // 6. Armor
    ARMOR_DATABASE.forEach((arm, idx) => {
      const cost = parseCost(arm.cost);
      list.push({
        id: `arm-${idx}-${arm.name}`,
        name: arm.name,
        category: 'armor',
        categoryLabel: 'Armadura / Blindagem',
        costEb: cost,
        costString: arm.cost || `${cost} eb`,
        description: arm.description,
        sp: arm.sp,
        penalty: arm.penalty,
        covers: arm.covers,
        iconType: 'armor',
        raw: arm,
      });
    });

    // Official Head Armors
    OFFICIAL_HEAD_ARMORS.filter(h => h.sp > 0).forEach((h, idx) => {
      list.push({
        id: `head-arm-${idx}-${h.name}`,
        name: h.name,
        category: 'armor',
        categoryLabel: 'Armadura de Cabeça (Capacete)',
        costEb: h.cost,
        costString: `${h.cost} eb`,
        description: h.desc,
        sp: h.sp,
        penalty: h.penalty,
        covers: 'Cabeça',
        iconType: 'armor',
        raw: h,
      });
    });

    // Official Body Armors
    OFFICIAL_BODY_ARMORS.filter(b => b.sp > 0).forEach((b, idx) => {
      list.push({
        id: `body-arm-${idx}-${b.name}`,
        name: b.name,
        category: 'armor',
        categoryLabel: 'Armadura Corporal (Tronco & Membros)',
        costEb: b.cost,
        costString: `${b.cost} eb`,
        description: b.desc,
        sp: b.sp,
        penalty: b.penalty,
        covers: 'Corpo',
        iconType: 'armor',
        raw: b,
      });
    });

    // 7. Street Drugs
    STREET_DRUGS_DATABASE.forEach((d, idx) => {
      const cost = parseCost(d.costPerDose);
      list.push({
        id: `drug-${idx}-${d.name}`,
        name: `${d.name} (${d.slang})`,
        category: 'drugs',
        categoryLabel: 'Droga & Farmacologia',
        costEb: cost,
        costString: d.costPerDose || `${cost} eb`,
        description: `Efeito Primário: ${d.primaryEffect} | Queda: ${d.secondaryOrCrashEffect} (Duração: ${d.duration}, DV Vício: ${d.addictionDV})`,
        iconType: 'gear',
        raw: d,
      });
    });

    // 8. Custom Homebrew from LocalStorage / DB
    try {
      const savedHomebrew = localStorage.getItem('cyberpunk_homebrew_library');
      if (savedHomebrew) {
        const hb = JSON.parse(savedHomebrew);
        (hb.weapons || []).forEach((hw: any, idx: number) => {
          list.push({
            id: `hb-w-${idx}-${hw.name}`,
            name: `${hw.name} [Homebrew]`,
            category: 'homebrew',
            categoryLabel: 'Homebrew (Arma)',
            costEb: parseCost(hw.cost),
            costString: `${hw.cost || 100} eb`,
            description: hw.description || 'Arma customizada forjada pelo usuário.',
            damage: hw.damage || '3d6',
            rof: hw.rof || 1,
            mag: hw.shots || 8,
            ammoType: hw.category || 'Custom',
            iconType: 'weapon',
            isHomebrew: true,
            raw: hw,
          });
        });

        (hb.cyberware || []).forEach((hc: any, idx: number) => {
          list.push({
            id: `hb-c-${idx}-${hc.name}`,
            name: `${hc.name} [Homebrew]`,
            category: 'homebrew',
            categoryLabel: 'Homebrew (Ciberware)',
            costEb: parseCost(hc.cost),
            costString: `${hc.cost || 500} eb`,
            description: hc.description || 'Ciberware customizado forjado pelo usuário.',
            humanityLoss: hc.humanityLoss || '2d6',
            iconType: 'cyber',
            isHomebrew: true,
            raw: hc,
          });
        });
      }
    } catch {}

    return list;
  }, []);

  // Filtered List
  const filteredItems = useMemo(() => {
    return unifiedDatabase.filter(item => {
      const matchesCategory =
        activeCategory === 'all' ||
        (activeCategory === 'homebrew' ? item.isHomebrew : item.category === activeCategory);

      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.damage && item.damage.toLowerCase().includes(q)) ||
        (item.ammoType && item.ammoType.toLowerCase().includes(q)) ||
        (item.categoryLabel && item.categoryLabel.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [unifiedDatabase, activeCategory, searchTerm]);

  // Handle Action Trigger
  const handleEquipSelectedItem = () => {
    if (!selectedItem) return;

    // Deduct money if selected
    if (deductMoney && selectedItem.costEb > 0 && onDeductCash) {
      const totalCost = selectedItem.category === 'ammo' || selectedItem.category === 'gear' 
        ? selectedItem.costEb * gearQuantity 
        : selectedItem.costEb;
      onDeductCash(totalCost);
    }

    if (selectedItem.category === 'weapons' || (selectedItem.isHomebrew && selectedItem.iconType === 'weapon')) {
      onEquipWeapon({
        name: selectedItem.name.replace(' [Homebrew]', ''),
        damage: selectedItem.damage || '3d6',
        rof: selectedItem.rof || 1,
        ammoType: selectedItem.ammoType || 'Padrão',
        magCapacity: selectedItem.mag || 8,
        magCurrent: selectedItem.mag || 8,
        notes: selectedItem.description,
      });
      showToastSuccess(`Arma "${selectedItem.name}" equipada na ficha!`);
    } else if (selectedItem.category === 'cyberware' || (selectedItem.isHomebrew && selectedItem.iconType === 'cyber')) {
      const humanityCostNum = parseInt((selectedItem.humanityLoss || '4').replace(/[^0-9]/g, '')) || 4;
      onInstallCyberware(
        {
          name: selectedItem.name.replace(' [Homebrew]', ''),
          type: selectedItem.categoryLabel,
          humanityCost: humanityCostNum,
          description: selectedItem.description,
        },
        deductHumanity
      );
      showToastSuccess(`Ciberware "${selectedItem.name}" instalado na clínica!`);
    } else if (selectedItem.category === 'armor') {
      const isHead = selectedItem.covers?.toLowerCase().includes('cabeça') || selectedItem.name.toLowerCase().includes('helmet') || selectedItem.name.toLowerCase().includes('capacete');
      onEquipArmor({
        type: isHead ? 'head' : 'body',
        name: selectedItem.name,
        sp: selectedItem.sp || 11,
        penalty: selectedItem.penalty || 0,
      });
      showToastSuccess(`Armadura "${selectedItem.name}" equipada no ${isHead ? 'Crânio' : 'Corpo'}!`);
    } else if (selectedItem.category === 'attachments') {
      // If user has weapons and chose to attach
      if (character.weapons && character.weapons.length > 0 && onAttachToWeapon) {
        onAttachToWeapon(
          targetWeaponIndex,
          selectedItem.name,
          selectedItem.description
        );
        showToastSuccess(`Acessório "${selectedItem.name}" instalado em ${character.weapons[targetWeaponIndex]?.name || 'Arma'}!`);
      } else {
        onAddGearItem(`${selectedItem.name} (${selectedItem.description})`);
        showToastSuccess(`Acessório "${selectedItem.name}" guardado na mochila de campo!`);
      }
    } else {
      // Ammunition, Gear, Drugs
      const qtyPrefix = gearQuantity > 1 ? `${gearQuantity}x ` : '';
      onAddGearItem(`${qtyPrefix}${selectedItem.name} [${selectedItem.categoryLabel}] - ${selectedItem.description}`);
      showToastSuccess(`${qtyPrefix}"${selectedItem.name}" adicionado à mochila!`);
    }
  };

  const showToastSuccess = (msg: string) => {
    setAddedToast(msg);
    setTimeout(() => {
      setAddedToast(null);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-[#101015] border border-[#27272a] rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#27272a] bg-[#14141c] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-600 flex items-center justify-center text-white shadow-md">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/40 font-bold">
                  Buscador do Códice & Catálogo Oficial
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  Ficha: <strong className="text-zinc-200">{character.name}</strong> ({character.cashEb} eb)
                </span>
              </div>
              <h2 className="text-base font-bold text-zinc-100 mt-0.5">
                Pesquisa & Adição de Equipamentos, Armas e Ciberware
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Tabs */}
        <div className="p-4 border-b border-[#27272a] bg-[#121218] space-y-3 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Digite o nome, calibre, dano, ciberware ou benefício tático (ex: Smartlink, Katana, 4d6, Sandevistan, Kevlar, Black Lace...)"
              className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-red-500 shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-zinc-500 hover:text-zinc-300 font-mono"
              >
                ✕ Limpar
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {[
              { id: 'all', label: 'Todos os Itens', count: unifiedDatabase.length, icon: <Layers className="w-3.5 h-3.5" /> },
              { id: 'weapons', label: 'Armas & Lâminas', count: WEAPONS_DATABASE.length, icon: <Crosshair className="w-3.5 h-3.5 text-red-400" /> },
              { id: 'attachments', label: 'Acessórios de Armas', count: ATTACHMENTS_DATABASE.length, icon: <Wrench className="w-3.5 h-3.5 text-amber-400" /> },
              { id: 'ammo', label: 'Munições & Granadas', count: AMMUNITION_DATABASE.length, icon: <Bomb className="w-3.5 h-3.5 text-orange-400" /> },
              { id: 'gear', label: 'Equipamentos de Campo', count: STREET_GEAR_DATABASE.length, icon: <Package className="w-3.5 h-3.5 text-cyan-400" /> },
              { id: 'cyberware', label: 'Ciberware & Implantes', count: CYBERWARE_DATABASE.length, icon: <Cpu className="w-3.5 h-3.5 text-purple-400" /> },
              { id: 'armor', label: 'Armaduras & Capacetes', count: ARMOR_DATABASE.length + OFFICIAL_HEAD_ARMORS.length + OFFICIAL_BODY_ARMORS.length - 2, icon: <Shield className="w-3.5 h-3.5 text-blue-400" /> },
              { id: 'drugs', label: 'Drogas & Farmacologia', count: STREET_DRUGS_DATABASE.length, icon: <Pill className="w-3.5 h-3.5 text-emerald-400" /> },
              { id: 'homebrew', label: 'Homebrew Forjados', icon: <Sparkles className="w-3.5 h-3.5 text-yellow-400" /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCategory(tab.id as CodexCategory);
                  setSelectedItem(null);
                }}
                className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 shrink-0 ${
                  activeCategory === tab.id
                    ? 'bg-red-600 text-white font-bold shadow-sm'
                    : 'bg-[#181820] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[10px] opacity-75 font-mono">({tab.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main 2-Column Split: List on Left, Item Inspector & Action on Right */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          {/* Left Column: Filtered List (7 cols) */}
          <div className="lg:col-span-7 overflow-y-auto p-4 space-y-2 border-r border-[#27272a] bg-[#0c0c10]">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pb-1">
              <span>{filteredItems.length} itens encontrados</span>
              <span>Clique para inspecionar & equipar</span>
            </div>

            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 font-mono text-xs space-y-2">
                <Info className="w-6 h-6 mx-auto text-zinc-600" />
                <p>Nenhum item correspondente à busca "{searchTerm}".</p>
                <p className="text-[11px] text-zinc-600">Verifique a ortografia ou selecione outra categoria.</p>
              </div>
            ) : (
              filteredItems.map(item => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#1c1c24] border-red-500/80 shadow-md ring-1 ring-red-500/30'
                        : 'bg-[#131318] hover:bg-[#181820] border-zinc-800/80 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 mt-0.5 shrink-0">
                        {item.iconType === 'weapon' && getWeaponIcon(item.name, "w-4 h-4 text-red-400")}
                        {item.iconType === 'cyber' && getCyberwareIcon(item.name, "w-4 h-4 text-purple-400")}
                        {item.iconType === 'gear' && getGearIcon(item.name, "w-4 h-4 text-cyan-400")}
                        {item.iconType === 'armor' && <Shield className="w-4 h-4 text-blue-400" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <strong className="text-zinc-100 text-xs truncate">{item.name}</strong>
                          {item.isHomebrew && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-yellow-950/60 text-yellow-300 border border-yellow-800/40 font-bold">
                              HB
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-zinc-400 mt-0.5">
                          <span className="text-zinc-500">{item.categoryLabel}</span>
                          {item.damage && (
                            <span className="text-red-400 font-bold">&bull; {item.damage}</span>
                          )}
                          {item.sp !== undefined && item.sp > 0 && (
                            <span className="text-blue-400 font-bold">&bull; SP {item.sp}</span>
                          )}
                          {item.humanityLoss && (
                            <span className="text-rose-400 font-bold">&bull; Perda: {item.humanityLoss}</span>
                          )}
                        </div>

                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5 font-sans leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs font-bold text-emerald-400 block">
                        {item.costString}
                      </span>
                      <ChevronRight className={`w-4 h-4 ml-auto mt-1 ${isSelected ? 'text-red-400' : 'text-zinc-600'}`} />
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Item Inspector & Equip Controls (5 cols) */}
          <div className="lg:col-span-5 p-5 bg-[#121217] flex flex-col justify-between overflow-y-auto space-y-4">
            {selectedItem ? (
              <div className="space-y-4 animate-in fade-in duration-100">
                {/* Item Details Header */}
                <div className="space-y-2 border-b border-[#27272a] pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {selectedItem.categoryLabel}
                    </span>
                    <span className="text-sm font-mono font-bold text-emerald-400">
                      {selectedItem.costString}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                    <span>{selectedItem.name}</span>
                  </h3>
                </div>

                {/* Tactical Stats Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {selectedItem.damage && (
                    <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
                      <span className="text-[10px] text-zinc-500 uppercase block">Dano por Disparo</span>
                      <strong className="text-red-400 text-sm font-bold">{selectedItem.damage}</strong>
                    </div>
                  )}

                  {selectedItem.rof !== undefined && (
                    <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
                      <span className="text-[10px] text-zinc-500 uppercase block">Cadência (CdT)</span>
                      <strong className="text-zinc-200 text-sm font-bold">{selectedItem.rof} por Turno</strong>
                    </div>
                  )}

                  {selectedItem.mag !== undefined && (
                    <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
                      <span className="text-[10px] text-zinc-500 uppercase block">Capacidade do Pente</span>
                      <strong className="text-zinc-200 text-sm font-bold">{selectedItem.mag} tiros</strong>
                    </div>
                  )}

                  {selectedItem.sp !== undefined && selectedItem.sp > 0 && (
                    <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
                      <span className="text-[10px] text-zinc-500 uppercase block">Pontos de Parada (SP)</span>
                      <strong className="text-blue-400 text-sm font-bold">SP {selectedItem.sp}</strong>
                    </div>
                  )}

                  {selectedItem.humanityLoss && (
                    <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
                      <span className="text-[10px] text-zinc-500 uppercase block">Custo de Humanidade</span>
                      <strong className="text-rose-400 text-sm font-bold">{selectedItem.humanityLoss}</strong>
                    </div>
                  )}

                  {selectedItem.penalty !== undefined && (
                    <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-0.5">
                      <span className="text-[10px] text-zinc-500 uppercase block">Penalidade REF/DEX/MOVE</span>
                      <strong className={selectedItem.penalty === 0 ? 'text-emerald-400' : 'text-red-400'}>
                        {selectedItem.penalty === 0 ? 'Nenhuma (0)' : `-${selectedItem.penalty}`}
                      </strong>
                    </div>
                  )}
                </div>

                {/* Description and Rules */}
                <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 text-xs text-zinc-300 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block font-bold">
                    Descrição & Regras Oficiais:
                  </span>
                  <p className="leading-relaxed font-sans text-zinc-300">{selectedItem.description}</p>
                  {selectedItem.effect && (
                    <div className="pt-2 border-t border-zinc-800 text-amber-300 font-mono text-[11px]">
                      ⚡ Efeito Especial: {selectedItem.effect}
                    </div>
                  )}
                </div>

                {/* Equip Customization Form */}
                <div className="p-3.5 rounded-xl bg-[#14141c] border border-zinc-800 space-y-3 text-xs font-mono">
                  <span className="text-[10px] uppercase text-zinc-400 block font-bold">
                    Opções de Integração na Ficha:
                  </span>

                  {/* Attachment Target Weapon Selector */}
                  {selectedItem.category === 'attachments' && character.weapons.length > 0 && (
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">
                        Anexar a qual arma equipada?
                      </label>
                      <select
                        value={targetWeaponIndex}
                        onChange={e => setTargetWeaponIndex(parseInt(e.target.value))}
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200 text-xs"
                      >
                        {character.weapons.map((w, idx) => (
                          <option key={idx} value={idx}>
                            {w.name} ({w.damage})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Quantity selector for Gear & Ammo */}
                  {(selectedItem.category === 'ammo' || selectedItem.category === 'gear' || selectedItem.category === 'drugs') && (
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Quantidade a Adicionar:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setGearQuantity(Math.max(1, gearQuantity - 1))}
                          className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-zinc-100 font-bold">{gearQuantity}</span>
                        <button
                          type="button"
                          onClick={() => setGearQuantity(gearQuantity + 1)}
                          className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Deduct money checkbox */}
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300 pt-1">
                    <input
                      type="checkbox"
                      checked={deductMoney}
                      onChange={e => setDeductMoney(e.target.checked)}
                      className="rounded bg-zinc-900 border-zinc-700 text-red-500 focus:ring-0"
                    />
                    <span>
                      Debitar do saldo do personagem ({selectedItem.costEb * gearQuantity} eb de {character.cashEb} eb)
                    </span>
                  </label>

                  {/* Humanity Loss Checkbox for Cyberware */}
                  {selectedItem.category === 'cyberware' && (
                    <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                      <input
                        type="checkbox"
                        checked={deductHumanity}
                        onChange={e => setDeductHumanity(e.target.checked)}
                        className="rounded bg-zinc-900 border-zinc-700 text-purple-500 focus:ring-0"
                      />
                      <span>Deduzir Perda de Humanidade ({selectedItem.humanityLoss || 4} pts)</span>
                    </label>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 font-mono text-xs space-y-2 p-8">
                <Search className="w-8 h-8 text-zinc-700" />
                <p>Selecione qualquer item da lista à esquerda para inspecionar os detalhes e adicioná-lo à ficha.</p>
              </div>
            )}

            {/* Bottom Confirm Action */}
            <div className="pt-3 border-t border-[#27272a] space-y-2">
              {addedToast && (
                <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-mono text-xs flex items-center gap-2 animate-in fade-in">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{addedToast}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs transition"
                >
                  Concluir / Fechar
                </button>

                <button
                  type="button"
                  disabled={!selectedItem}
                  onClick={handleEquipSelectedItem}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-bold transition shadow-lg disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Equipar / Adicionar à Ficha</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
