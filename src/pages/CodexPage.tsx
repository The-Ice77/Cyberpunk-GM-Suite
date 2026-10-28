import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Tag,
  Copy,
  Check,
  Filter,
  Shield,
  Swords,
  Wrench,
  User,
  Trash2,
  Download,
  Upload,
  Plus,
  Crosshair,
  Cpu,
  Sparkles,
  AlertCircle,
  Skull,
  Layers,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { useCombat, Combatant } from '../context/CombatContext';
import { useCampaign } from '../context/CampaignContext';
import { RULES_CODEX_DATABASE } from '../data/rulesCodexData';
import { OFFICIAL_BESTIARY, BestiaryEnemy } from '../data/bestiaryData';
import {
  DEFAULT_HOMEBREW_DATA,
  HomebrewDatabase,
  HomebrewWeapon,
  HomebrewCyberware,
  HomebrewEnemy,
} from '../data/homebrewData';
import { RuleEntry } from '../types/system';
import { generateProceduralWeapon, generateProceduralCyberware } from '../data/customForgeData';
import { generateAICustomWeaponDetailed, generateAICustomCyberwareDetailed } from '../services/aiService';

type MainTab = 'official' | 'campaign' | 'homebrew';
type OfficialSubTab = 'bestiary' | 'rules';
type HomebrewSubTab = 'weapons' | 'cyberware' | 'enemies';

export const CodexPage: React.FC = () => {
  const { system, isRed } = useSystem();
  const { addCombatant } = useCombat();
  const { savedNPCs, deleteNPC, notes, setNotes, exportNPCsJSON, importNPCsJSON } = useCampaign();

  // Navigation State
  const [activeTab, setActiveTab] = useState<MainTab>('official');
  const [officialSubTab, setOfficialSubTab] = useState<OfficialSubTab>('bestiary');
  const [homebrewSubTab, setHomebrewSubTab] = useState<HomebrewSubTab>('weapons');

  // Search and Filters for Official Rules
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedSystem, setSelectedSystem] = useState<'BOTH' | 'RED' | '2020'>('BOTH');

  // Bestiary Filters
  const [bestiarySearch, setBestiarySearch] = useState<string>('');
  const [bestiaryTier, setBestiaryTier] = useState<string>('Todos');
  const [bestiaryFaction, setBestiaryFaction] = useState<string>('Todas');

  // UI feedback states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedCombatId, setAddedCombatId] = useState<string | null>(null);

  // Homebrew State
  const [homebrewData, setHomebrewData] = useState<HomebrewDatabase>(() => {
    try {
      const saved = localStorage.getItem('cyberpunk_homebrew_library');
      return saved ? JSON.parse(saved) : DEFAULT_HOMEBREW_DATA;
    } catch {
      return DEFAULT_HOMEBREW_DATA;
    }
  });

  // Homebrew Creation Forms State
  const [isCreatingWeapon, setIsCreatingWeapon] = useState<boolean>(false);
  const [isCreatingCyberware, setIsCreatingCyberware] = useState<boolean>(false);
  const [isCreatingEnemy, setIsCreatingEnemy] = useState<boolean>(false);

  // Form states
  const [newWeapon, setNewWeapon] = useState<Partial<HomebrewWeapon>>({
    name: '',
    category: 'Pistola',
    damage: '3d6',
    rof: 2,
    cost: '100eb',
    shots: 8,
    specialEffect: '',
    notes: '',
  });

  const [newCyberware, setNewCyberware] = useState<Partial<HomebrewCyberware>>({
    name: '',
    type: 'Neural',
    humanityLoss: '2d6 (7)',
    cost: '500eb',
    install: 'Clínica',
    description: '',
    mechanicalBonus: '',
  });

  const [newEnemy, setNewEnemy] = useState<Partial<HomebrewEnemy>>({
    name: '',
    faction: 'Edgerunners Independentes',
    tier: 'mook',
    system: 'BOTH',
    role: 'Atirador de Rua',
    hp: 35,
    headSP: 11,
    bodySP: 11,
    combatNumber: 11,
    move: 6,
    ref: 7,
    dex: 6,
    body: 6,
    will: 6,
    weapons: ['Pistola Pesada 3d6 (ROF 2)'],
    cyberware: ['Ciberolho com Mira Laser'],
    equipment: ['Colete Kevlar Leve (SP 11)', 'Munição extra'],
    tactics: 'Atira de cobertura mantendo distância média.',
    specialAbility: '',
  });

  const [importHbText, setImportHbText] = useState<string>('');
  const [showHbModal, setShowHbModal] = useState<boolean>(false);
  const [hbFeedback, setHbFeedback] = useState<string>('');

  // Campaign Backup modal state
  const [showCampaignModal, setShowCampaignModal] = useState<boolean>(false);
  const [importCampText, setImportCampText] = useState<string>('');
  const [campFeedback, setCampFeedback] = useState<string>('');

  // Persist Homebrew
  useEffect(() => {
    localStorage.setItem('cyberpunk_homebrew_library', JSON.stringify(homebrewData));
  }, [homebrewData]);

  // Categories for Rules
  const RULES_CATEGORIES = ['Todas', 'Combate', 'Netrunning', 'Cibernéticos', 'Sobrevivência', 'Sociais', 'Economia'];

  // Filter Rules
  const filteredRules = RULES_CODEX_DATABASE.filter(r => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = selectedCategory === 'Todas' || r.category === selectedCategory;
    const matchesSys = selectedSystem === 'BOTH' || r.system === 'BOTH' || r.system === selectedSystem;

    return matchesSearch && matchesCat && matchesSys;
  });

  // Filter Bestiary
  const filteredBestiary = OFFICIAL_BESTIARY.filter(b => {
    const matchesSearch =
      b.name.toLowerCase().includes(bestiarySearch.toLowerCase()) ||
      b.role.toLowerCase().includes(bestiarySearch.toLowerCase()) ||
      b.description.toLowerCase().includes(bestiarySearch.toLowerCase()) ||
      b.weapons.some(w => w.name.toLowerCase().includes(bestiarySearch.toLowerCase()));

    const matchesTier = bestiaryTier === 'Todos' || b.tier === bestiaryTier;
    const matchesFaction = bestiaryFaction === 'Todas' || b.faction === bestiaryFaction;

    return matchesSearch && matchesTier && matchesFaction;
  });

  // Factions for Bestiary
  const BESTIARY_FACTIONS = [
    'Todas',
    'Maelstrom',
    'Tyger Claws',
    'Trauma Team™ Internacional',
    'Arasaka',
    'Militech',
    'Polícia & Governo (DPNC)',
    'Polícia & Governo (MaxTac)',
    'Nômades e Civis (Aldecaldos)',
    'Bozos',
    'Ciberpsicopatas Independentes',
  ];

  // Copy rule
  const handleCopyRule = (r: RuleEntry) => {
    const txt = `[REGRA: ${r.title}] (${r.bookCitation})\n${r.summary}\n\nMecânica:\n${r.mechanics}\n\n${r.formulaOrTable || ''}`;
    navigator.clipboard.writeText(txt);
    setCopiedId(r.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Copy bestiary block
  const handleCopyEnemy = (e: BestiaryEnemy) => {
    const weaponsStr = e.weapons.map(w => `- ${w.name} (Dano: ${w.damage}, CdT: ${w.rof})`).join('\n');
    const txt = `[INIMIGO: ${e.name.toUpperCase()}] (${e.tier.toUpperCase()}) - ${e.faction}\nHP: ${e.hp} | SP Cabeça: ${e.headSP} | SP Corpo: ${e.bodySP} | Combat Number: ${e.combatNumber || 10}\nArmas:\n${weaponsStr}\nCiberware: ${e.cyberware.join(', ')}\nTáticas: ${e.tactics}\nCitação: ${e.citation}`;
    navigator.clipboard.writeText(txt);
    setCopiedId(e.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Add enemy to combat
  const handleAddBestiaryToCombat = (e: BestiaryEnemy) => {
    const initRoll = Math.floor(Math.random() * 10) + 1 + (e.ref || 6);
    const newCombatant: Combatant = {
      id: `combat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: e.name,
      system: isRed ? 'RED' : '2020',
      initiative: initRoll,
      currentHP: e.hp,
      maxHP: e.hp,
      headSP: e.headSP,
      bodySP: e.bodySP,
      torsoSP: e.torsoSP,
      rArmSP: e.rArmSP,
      lArmSP: e.lArmSP,
      rLegSP: e.rLegSP,
      lLegSP: e.lLegSP,
      btm: e.btm,
      conditions: [],
      criticalInjuries: [],
      deathSavePenalty: 0,
      notes: `${e.role} (${e.tier}). Armas: ${e.weapons.map(w => w.name).join(', ')}`,
      faction: e.faction,
    };

    addCombatant(newCombatant);
    setAddedCombatId(e.id);
    setTimeout(() => setAddedCombatId(null), 2000);
  };

  // Add saved NPC from Campaign to combat
  const handleAddNPCToCombat = (npc: any) => {
    const initRoll = Math.floor(Math.random() * 10) + 1 + (npc.statsRED?.REF || npc.stats2020?.REF || 6);
    const hp = npc.statsRED?.HP || (npc.stats2020 ? npc.stats2020.BODY * 4 : 35);
    const headSP = npc.statsRED?.headSP || npc.stats2020?.headSP || 11;
    const bodySP = npc.statsRED?.bodySP || npc.stats2020?.torsoSP || 11;

    const newCombatant: Combatant = {
      id: `npc-combat-${Date.now()}`,
      name: npc.name,
      system: npc.system || (isRed ? 'RED' : '2020'),
      initiative: initRoll,
      currentHP: hp,
      maxHP: hp,
      headSP: headSP,
      bodySP: bodySP,
      torsoSP: npc.stats2020?.torsoSP,
      rArmSP: npc.stats2020?.rArmSP,
      lArmSP: npc.stats2020?.lArmSP,
      rLegSP: npc.stats2020?.rLegSP,
      lLegSP: npc.stats2020?.lLegSP,
      btm: npc.stats2020?.BTM,
      conditions: [],
      criticalInjuries: [],
      deathSavePenalty: 0,
      notes: `NPC da Campanha (${npc.role}). Facção: ${npc.faction}`,
      faction: npc.faction,
    };

    addCombatant(newCombatant);
    setAddedCombatId(npc.id);
    setTimeout(() => setAddedCombatId(null), 2000);
  };

  // Add Homebrew enemy to combat
  const handleAddHomebrewEnemyToCombat = (e: HomebrewEnemy) => {
    const initRoll = Math.floor(Math.random() * 10) + 1 + (e.ref || 7);
    const newCombatant: Combatant = {
      id: `hb-combat-${Date.now()}`,
      name: e.name,
      system: isRed ? 'RED' : '2020',
      initiative: initRoll,
      currentHP: e.hp,
      maxHP: e.hp,
      headSP: e.headSP,
      bodySP: e.bodySP,
      conditions: [],
      criticalInjuries: [],
      deathSavePenalty: 0,
      notes: `Homebrew (${e.tier}): ${e.role}. Armas: ${e.weapons.join(', ')}`,
      faction: e.faction,
    };

    addCombatant(newCombatant);
    setAddedCombatId(e.id);
    setTimeout(() => setAddedCombatId(null), 2000);
  };

  // Save New Homebrew Weapon
  const handleSaveWeapon = () => {
    if (!newWeapon.name?.trim()) return;
    const created: HomebrewWeapon = {
      id: `hb-w-${Date.now()}`,
      name: newWeapon.name,
      category: newWeapon.category || 'Pistola',
      damage: newWeapon.damage || '3d6',
      rof: Number(newWeapon.rof) || 1,
      cost: newWeapon.cost || '100eb',
      shots: Number(newWeapon.shots) || 8,
      specialEffect: newWeapon.specialEffect || '',
      notes: newWeapon.notes || '',
      author: 'Mestre da Mesa',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setHomebrewData(prev => ({
      ...prev,
      weapons: [created, ...prev.weapons],
    }));
    setIsCreatingWeapon(false);
    setNewWeapon({ name: '', category: 'Pistola', damage: '3d6', rof: 2, cost: '100eb', shots: 8, specialEffect: '', notes: '' });
  };

  // Save New Homebrew Cyberware
  const handleSaveCyberware = () => {
    if (!newCyberware.name?.trim()) return;
    const created: HomebrewCyberware = {
      id: `hb-c-${Date.now()}`,
      name: newCyberware.name,
      type: newCyberware.type || 'Neural',
      humanityLoss: newCyberware.humanityLoss || '2d6 (7)',
      cost: newCyberware.cost || '500eb',
      install: newCyberware.install || 'Clínica',
      description: newCyberware.description || '',
      mechanicalBonus: newCyberware.mechanicalBonus || '',
      author: 'Mestre da Mesa',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setHomebrewData(prev => ({
      ...prev,
      cyberware: [created, ...prev.cyberware],
    }));
    setIsCreatingCyberware(false);
    setNewCyberware({ name: '', type: 'Neural', humanityLoss: '2d6 (7)', cost: '500eb', install: 'Clínica', description: '', mechanicalBonus: '' });
  };

  // Save New Homebrew Enemy
  const handleSaveEnemy = () => {
    if (!newEnemy.name?.trim()) return;
    const created: HomebrewEnemy = {
      id: `hb-e-${Date.now()}`,
      name: newEnemy.name,
      faction: newEnemy.faction || 'Independente',
      tier: newEnemy.tier || 'mook',
      system: newEnemy.system || 'BOTH',
      role: newEnemy.role || 'Ganger',
      hp: Number(newEnemy.hp) || 35,
      headSP: Number(newEnemy.headSP) || 11,
      bodySP: Number(newEnemy.bodySP) || 11,
      combatNumber: Number(newEnemy.combatNumber) || 12,
      move: Number(newEnemy.move) || 6,
      ref: Number(newEnemy.ref) || 7,
      dex: Number(newEnemy.dex) || 6,
      body: Number(newEnemy.body) || 6,
      will: Number(newEnemy.will) || 6,
      weapons: typeof newEnemy.weapons === 'string' ? (newEnemy.weapons as string).split(',').map((s: string) => s.trim()) : newEnemy.weapons || [],
      cyberware: typeof newEnemy.cyberware === 'string' ? (newEnemy.cyberware as string).split(',').map((s: string) => s.trim()) : newEnemy.cyberware || [],
      equipment: ['Colete Balístico', 'Rádio Clandestino'],
      tactics: newEnemy.tactics || 'Ataque agressivo e cobertura moderada.',
      specialAbility: newEnemy.specialAbility || '',
      author: 'Mestre da Mesa',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setHomebrewData(prev => ({
      ...prev,
      enemies: [created, ...prev.enemies],
    }));
    setIsCreatingEnemy(false);
  };

  // Export Homebrew
  const handleExportHomebrew = () => {
    const dataStr = JSON.stringify(homebrewData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cyberpunk_homebrew_forge_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import Homebrew
  const handleImportHomebrew = () => {
    try {
      const parsed = JSON.parse(importHbText);
      if (parsed.weapons && parsed.cyberware && parsed.enemies) {
        setHomebrewData(parsed);
        setHbFeedback('Biblioteca Homebrew importada com sucesso!');
        setTimeout(() => {
          setHbFeedback('');
          setShowHbModal(false);
        }, 1200);
      } else {
        setHbFeedback('Estrutura de dados inválida. Certifique-se de importar o arquivo JSON correto.');
      }
    } catch {
      setHbFeedback('Erro ao processar JSON. Verifique o formato.');
    }
  };

  // Badge tier color helper
  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'mook':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">Mook / Capanga</span>;
      case 'lieutenant':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/60 font-semibold">Tenente</span>;
      case 'miniboss':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60 font-semibold">Mini-Chefe</span>;
      case 'boss':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-700 font-bold flex items-center gap-1"><Skull className="w-3 h-3 text-red-400" /> Chefe / Ciberpsico</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-500" />
            <span>Biblioteca & Códice Triplo</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Repositório integrado: Sistema Oficial (Bestiário & Regras), Banco da Campanha do Mestre e Forja Homebrew da Comunidade.
          </p>
        </div>

        {/* Global Summary Stats */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#14141a] border border-[#27272a] text-zinc-300">
            {OFFICIAL_BESTIARY.length} Inimigos Oficiais
          </span>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#14141a] border border-[#27272a] text-zinc-300">
            {RULES_CODEX_DATABASE.length} Regras
          </span>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-[#14141a] border border-[#27272a] text-zinc-300">
            {savedNPCs.length} NPCs Campanha
          </span>
        </div>
      </div>

      {/* Main 3-Way Tab Selector */}
      <div className="flex items-center gap-2 border-b border-[#27272a] pb-2 overflow-x-auto no-scrollbar whitespace-nowrap max-w-full">
        <button
          onClick={() => setActiveTab('official')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
            activeTab === 'official'
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14141a]'
          }`}
        >
          <Shield className="w-4 h-4 text-rose-500" />
          <span>Sistema Oficial (Bestiário & Regras)</span>
        </button>

        <button
          onClick={() => setActiveTab('campaign')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
            activeTab === 'campaign'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14141a]'
          }`}
        >
          <User className="w-4 h-4 text-amber-400" />
          <span>Biblioteca do Mestre (Campanha)</span>
          {savedNPCs.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono">
              {savedNPCs.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('homebrew')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
            activeTab === 'homebrew'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14141a]'
          }`}
        >
          <Wrench className="w-4 h-4 text-cyan-400" />
          <span>Forja Homebrew (Armas, Cromo, Inimigos)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* ABA 1: SISTEMA OFICIAL (BESTIÁRIO & REGRAS)              */}
      {/* ======================================================== */}
      {activeTab === 'official' && (
        <div className="space-y-6">
          {/* Sub-selector: Bestiário vs Regras */}
          <div className="flex items-center justify-between bg-[#121217] p-2 rounded-2xl border border-[#27272a]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOfficialSubTab('bestiary')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  officialSubTab === 'bestiary'
                    ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Swords className="w-3.5 h-3.5 text-red-400" />
                <span>Bestiário de Inimigos Prontos ({OFFICIAL_BESTIARY.length})</span>
              </button>

              <button
                onClick={() => setOfficialSubTab('rules')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  officialSubTab === 'rules'
                    ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-rose-400" />
                <span>Códice de Regras & Tabelas ({RULES_CODEX_DATABASE.length})</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
              Fórmulas oficiais do Corebook e Data Pack
            </span>
          </div>

          {/* SUB-VIEW 1.1: BESTIÁRIO OFICIAL */}
          {officialSubTab === 'bestiary' && (
            <div className="space-y-4">
              {/* Search & Filters for Bestiary */}
              <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Pesquisar inimigos por nome, arma, tática ou facção (ex: Maelstrom, Arasaka, MaxTac, Sniper...)"
                      value={bestiarySearch}
                      onChange={e => setBestiarySearch(e.target.value)}
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {/* Tier filter */}
                  <select
                    value={bestiaryTier}
                    onChange={e => setBestiaryTier(e.target.value)}
                    className="w-full sm:w-auto bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none"
                  >
                    <option value="Todos">Todos os Escalões (Tiers)</option>
                    <option value="mook">Mooks / Capangas</option>
                    <option value="lieutenant">Tenentes</option>
                    <option value="miniboss">Mini-Chefes</option>
                    <option value="boss">Chefes / Ciberpsicopatas</option>
                  </select>

                  {/* Faction filter */}
                  <select
                    value={bestiaryFaction}
                    onChange={e => setBestiaryFaction(e.target.value)}
                    className="w-full sm:w-auto bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none"
                  >
                    {BESTIARY_FACTIONS.map(f => (
                      <option key={f} value={f}>
                        {f === 'Todas' ? 'Todas as Facções' : f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Bestiary Cards Grid */}
              {filteredBestiary.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredBestiary.map(enemy => (
                    <div
                      key={enemy.id}
                      className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4 hover:border-zinc-700 transition flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Header: Tier, Faction, Title */}
                        <div className="flex items-start justify-between gap-2 border-b border-[#27272a] pb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {getTierBadge(enemy.tier)}
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
                                {enemy.faction}
                              </span>
                            </div>
                            <h3 className="text-sm font-bold text-zinc-100">{enemy.name}</h3>
                            <p className="text-[11px] text-zinc-400">{enemy.role}</p>
                          </div>

                          <span className="text-[10px] font-mono text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/40 shrink-0">
                            {enemy.citation}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                          {enemy.description}
                        </p>

                        {/* Stats Bar */}
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-2.5 rounded-xl bg-[#0a0a0d] border border-[#27272a] text-center font-mono">
                          <div>
                            <span className="text-[9px] text-zinc-500 uppercase block">HP</span>
                            <span className="text-xs font-bold text-emerald-400">{enemy.hp}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-500 uppercase block">SP Cab.</span>
                            <span className="text-xs font-bold text-blue-400">{enemy.headSP}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-500 uppercase block">SP Corp.</span>
                            <span className="text-xs font-bold text-blue-400">{enemy.bodySP}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-500 uppercase block">Combat Nº</span>
                            <span className="text-xs font-bold text-amber-400">{enemy.combatNumber || 11}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-500 uppercase block">MOVE</span>
                            <span className="text-xs font-bold text-zinc-300">{enemy.move}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-500 uppercase block">REF / DEX</span>
                            <span className="text-xs font-bold text-zinc-300">{enemy.ref}/{enemy.dex}</span>
                          </div>
                        </div>

                        {/* Weapons */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">
                            Arsenal & Dano:
                          </span>
                          <div className="space-y-1">
                            {enemy.weapons.map((w, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-xs px-2.5 py-1 rounded bg-[#0e0e14] border border-zinc-800/70"
                              >
                                <span className="font-semibold text-zinc-200">{w.name}</span>
                                <div className="flex items-center gap-2 font-mono">
                                  <span className="text-red-400 font-bold">{w.damage}</span>
                                  <span className="text-zinc-500 text-[10px]">CdT {w.rof}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Cyberware Pills */}
                        {enemy.cyberware.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">
                              Ciberware Instalado:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {enemy.cyberware.map((c, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tactics & Special Ability */}
                        <div className="p-2.5 rounded-xl bg-[#09090c] border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1">
                          <p><strong className="text-zinc-300 font-mono">Táticas:</strong> {enemy.tactics}</p>
                          {enemy.specialAbility && (
                            <p className="text-amber-300/90 font-medium">
                              <strong className="text-amber-400 font-mono">Habilidade Especial:</strong> {enemy.specialAbility}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-[#27272a] flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleCopyEnemy(enemy)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono border border-zinc-800 transition"
                        >
                          {copiedId === enemy.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copiar Bloco</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleAddBestiaryToCombat(enemy)}
                          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition shadow-sm ${
                            addedCombatId === enemy.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-red-600 hover:bg-red-500 text-white'
                          }`}
                        >
                          {addedCombatId === enemy.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Adicionado ao Combate!</span>
                            </>
                          ) : (
                            <>
                              <Swords className="w-3.5 h-3.5" />
                              <span>Enviar para Combate</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 rounded-2xl bg-[#121217] border border-dashed border-[#27272a] text-center space-y-2">
                  <Skull className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-xs text-zinc-400">Nenhum inimigo encontrado com esses filtros.</p>
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW 1.2: CÓDICE DE REGRAS OFICIAIS */}
          {officialSubTab === 'rules' && (
            <div className="space-y-4">
              {/* Search and Category Filters */}
              <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Pesquisar por regra (ex: Autofire, Ciberpsicose, Ferimento Crítico, Ablação, BTM...)"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {/* System filter */}
                  <select
                    value={selectedSystem}
                    onChange={e => setSelectedSystem(e.target.value as any)}
                    className="w-full sm:w-auto bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none"
                  >
                    <option value="BOTH">Ambos os Sistemas</option>
                    <option value="RED">Apenas RED (2045)</option>
                    <option value="2020">Apenas 2020</option>
                  </select>
                </div>

                {/* Categories Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {RULES_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                        selectedCategory === cat
                          ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-600'
                          : 'bg-[#0a0a0d] text-zinc-400 hover:text-zinc-200 border border-[#27272a]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rules Cards Grid */}
              {filteredRules.length > 0 ? (
                <div className="space-y-4">
                  {filteredRules.map(rule => (
                    <div
                      key={rule.id}
                      className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4 shadow-sm hover:border-zinc-700 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#27272a] gap-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {rule.category}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
                            {rule.system}
                          </span>
                          <h2 className="text-base font-bold text-zinc-100">{rule.title}</h2>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-red-400 bg-red-950/40 px-2 py-0.5 rounded border border-red-800/40">
                            {rule.bookCitation}
                          </span>
                          <button
                            onClick={() => handleCopyRule(rule)}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700 transition"
                            title="Copiar Resumo da Regra"
                          >
                            {copiedId === rule.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {/* Summary */}
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans font-medium">
                        {rule.summary}
                      </p>

                      {/* Mechanics Detail */}
                      <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-[#27272a] text-xs text-zinc-300 leading-relaxed space-y-1">
                        <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">
                          Resolução Mecânica Completa:
                        </span>
                        <p>{rule.mechanics}</p>
                      </div>

                      {/* Formula or Table Breakdown */}
                      {rule.formulaOrTable && (
                        <div className="p-3.5 rounded-xl bg-[#0e0e14] border border-zinc-800/80 font-mono text-[11px] text-zinc-300 whitespace-pre-line leading-relaxed">
                          {rule.formulaOrTable}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono text-zinc-500">
                        <Tag className="w-3 h-3 text-zinc-600" />
                        {rule.tags.map((t, idx) => (
                          <span key={idx} className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 rounded-2xl bg-[#121217] border border-dashed border-[#27272a] text-center space-y-2">
                  <BookOpen className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-xs text-zinc-400">Nenhuma regra encontrada para os termos digitados.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 2: BIBLIOTECA DO MESTRE (CAMPANHA)                   */}
      {/* ======================================================== */}
      {activeTab === 'campaign' && (
        <div className="space-y-6">
          {/* Action Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#121217] border border-[#27272a]">
            <div>
              <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                <span>Acervo de NPCs e Caderno da Campanha</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Todos os NPCs salvos no gerador ou criados manualmente ficam armazenados aqui e podem ser enviados ao combate com 1 clique.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const dataStr = exportNPCsJSON();
                  const blob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `cyberpunk_campanha_backup_${new Date().toISOString().slice(0, 10)}.json`;
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0a0a0d] border border-[#27272a] hover:border-zinc-700 text-xs text-zinc-300 font-mono transition"
              >
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span>Exportar JSON</span>
              </button>

              <button
                onClick={() => setShowCampaignModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0a0a0d] border border-[#27272a] hover:border-zinc-700 text-xs text-zinc-300 font-mono transition"
              >
                <Upload className="w-3.5 h-3.5 text-zinc-400" />
                <span>Importar JSON</span>
              </button>
            </div>
          </div>

          {/* Saved NPCs Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider font-bold">
              Fichas de NPCs Salvos na Campanha ({savedNPCs.length})
            </h3>

            {savedNPCs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedNPCs.map(npc => (
                  <div
                    key={npc.id}
                    className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3 flex flex-col justify-between hover:border-zinc-700 transition"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getTierBadge(npc.tier)}
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
                              {npc.faction}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-zinc-100">{npc.name}</h4>
                          <p className="text-xs text-zinc-400">{npc.role}</p>
                        </div>

                        <button
                          onClick={() => deleteNPC(npc.id)}
                          className="p-1 rounded text-zinc-500 hover:text-red-400 transition"
                          title="Excluir NPC da Campanha"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-zinc-300 line-clamp-2">
                        {npc.description || 'Sem descrição cadastrada.'}
                      </p>

                      {/* Quick Stats */}
                      <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-[#0a0a0d] border border-[#27272a] text-center font-mono text-xs">
                        <div>
                          <span className="text-[9px] text-zinc-500 block">HP</span>
                          <span className="font-bold text-emerald-400">
                            {npc.statsRED?.HP || (npc.stats2020 ? npc.stats2020.BODY * 4 : 35)}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 block">SP Cab.</span>
                          <span className="font-bold text-blue-400">
                            {npc.statsRED?.headSP || npc.stats2020?.headSP || 11}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 block">SP Corp.</span>
                          <span className="font-bold text-blue-400">
                            {npc.statsRED?.bodySP || npc.stats2020?.torsoSP || 11}
                          </span>
                        </div>
                      </div>

                      {/* Weapons */}
                      {npc.weapons && npc.weapons.length > 0 && (
                        <div className="text-[11px] text-zinc-400 space-y-0.5">
                          <span className="font-mono text-zinc-500 block text-[9px] uppercase font-bold">Armas:</span>
                          <p className="font-mono text-zinc-300 truncate">
                            {npc.weapons.map(w => `${w.name} (${w.damage})`).join(' • ')}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#27272a] flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-500">
                        Sistema: {npc.system || 'RED'}
                      </span>

                      <button
                        onClick={() => handleAddNPCToCombat(npc)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold transition ${
                          addedCombatId === npc.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-600 hover:bg-red-500 text-white'
                        }`}
                      >
                        {addedCombatId === npc.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Adicionado!</span>
                          </>
                        ) : (
                          <>
                            <Swords className="w-3.5 h-3.5" />
                            <span>Enviar ao Combate</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-[#121217] border border-dashed border-[#27272a] text-center space-y-3">
                <User className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-300 font-semibold">Nenhum NPC salvo na campanha ainda.</p>
                <p className="text-[11px] text-zinc-500 max-w-md mx-auto">
                  Você pode gerar NPCs customizados com equipamentos oficiais na página <strong>Pessoas & Facções</strong> e salvá-los com 1 clique para que apareçam aqui.
                </p>
              </div>
            )}
          </div>

          {/* Campaign Secret Notes & Master Journal */}
          <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase text-zinc-300 tracking-wider font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <span>Diário Secreto & Anotações de Sessão do Mestre</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                Salvo Automaticamente
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Registre pontas soltas, traições corporativas agendadas, dívidas com Fixers, senhas de redes e acontecimentos da sua mesa:
            </p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: - Fixer Vee está devendo 2.000eb para a Arasaka.&#10;- Sargento Diego Ramos vai pedir propina no porto de Kabuki na sexta-feira.&#10;- A senha da fortaleza de dados do armazém da Biotechnica é 'CYBER-GEN-2045'."
              rows={6}
              className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-3.5 text-xs text-zinc-200 font-mono leading-relaxed focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 3: FORJA HOMEBREW (CRIAÇÕES CUSTOMIZADAS)            */}
      {/* ======================================================== */}
      {activeTab === 'homebrew' && (
        <div className="space-y-6">
          {/* Sub-tabs and Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#121217] p-3 rounded-2xl border border-[#27272a]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHomebrewSubTab('weapons')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  homebrewSubTab === 'weapons'
                    ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                <span>Armas Customizadas ({homebrewData.weapons.length})</span>
              </button>

              <button
                onClick={() => setHomebrewSubTab('cyberware')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  homebrewSubTab === 'cyberware'
                    ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ciberware Customizado ({homebrewData.cyberware.length})</span>
              </button>

              <button
                onClick={() => setHomebrewSubTab('enemies')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  homebrewSubTab === 'enemies'
                    ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Skull className="w-3.5 h-3.5 text-red-400" />
                <span>Inimigos & Chefes Customizados ({homebrewData.enemies.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportHomebrew}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0a0a0d] border border-[#27272a] hover:border-zinc-700 text-xs text-zinc-300 font-mono transition"
              >
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span>Exportar Homebrew</span>
              </button>

              <button
                onClick={() => setShowHbModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0a0a0d] border border-[#27272a] hover:border-zinc-700 text-xs text-zinc-300 font-mono transition"
              >
                <Upload className="w-3.5 h-3.5 text-zinc-400" />
                <span>Importar Homebrew</span>
              </button>
            </div>
          </div>

          {/* SUB-VIEW 3.1: ARMAS HOMEBREW */}
          {homebrewSubTab === 'weapons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  Armas caseiras, protótipos corporativos e relíquias modificadas das ruas.
                </span>
                <button
                  onClick={() => setIsCreatingWeapon(prev => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isCreatingWeapon ? 'Fechar Forja' : 'Forjar Nova Arma'}</span>
                </button>
              </div>

              {/* Creator Form */}
              {isCreatingWeapon && (
                <div className="p-5 rounded-2xl bg-[#121217] border border-cyan-500/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27272a] pb-2">
                    <h3 className="text-xs font-bold text-cyan-400 font-mono uppercase flex items-center gap-2">
                      <Crosshair className="w-4 h-4" />
                      <span>Forja de Nova Arma Personalizada</span>
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const w = generateProceduralWeapon();
                          setNewWeapon({
                            name: w.name,
                            category: w.category,
                            damage: w.damage,
                            rof: w.rof,
                            cost: w.cost,
                            shots: w.shots,
                            concealment: w.concealment,
                            reliability: w.reliability,
                            specialEffect: w.specialEffect,
                            notes: w.notes,
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[10px] flex items-center gap-1 transition"
                        title="Preencher com rolagem procedural rápida"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>🎲 Preencher Rápido</span>
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const w = await generateAICustomWeaponDetailed();
                          setNewWeapon({
                            name: w.name,
                            category: w.category,
                            damage: w.damage,
                            rof: w.rof,
                            cost: w.cost,
                            shots: w.shots,
                            concealment: w.concealment,
                            reliability: w.reliability,
                            specialEffect: w.specialEffect,
                            notes: w.notes,
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-mono text-[10px] flex items-center gap-1 transition"
                        title="Preencher usando a IA do Gemini"
                      >
                        <Zap className="w-3 h-3 text-cyan-200" />
                        <span>⚡ Preencher com IA</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Nome da Arma</label>
                      <input
                        type="text"
                        placeholder="Ex: Espingarda Elétrica 'Voltaic'"
                        value={newWeapon.name || ''}
                        onChange={e => setNewWeapon(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Categoria</label>
                      <input
                        type="text"
                        placeholder="Ex: Espingarda / Fuzil / Arma Branca"
                        value={newWeapon.category || ''}
                        onChange={e => setNewWeapon(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Dano</label>
                      <input
                        type="text"
                        placeholder="Ex: 5d6 / 4d6+2"
                        value={newWeapon.damage || ''}
                        onChange={e => setNewWeapon(prev => ({ ...prev, damage: e.target.value }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">CdT / ROF</label>
                      <input
                        type="number"
                        min={1}
                        max={3}
                        value={newWeapon.rof || 1}
                        onChange={e => setNewWeapon(prev => ({ ...prev, rof: Number(e.target.value) }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Pente / Tiros</label>
                      <input
                        type="number"
                        value={newWeapon.shots || 8}
                        onChange={e => setNewWeapon(prev => ({ ...prev, shots: Number(e.target.value) }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Custo Médio</label>
                      <input
                        type="text"
                        placeholder="Ex: 500eb (Expensive)"
                        value={newWeapon.cost || ''}
                        onChange={e => setNewWeapon(prev => ({ ...prev, cost: e.target.value }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1">Efeito Especial / Mecânica Única</label>
                    <input
                      type="text"
                      placeholder="Ex: Causa ablação de 2 SP por acerto ou aplica pulso EMP contra ciberware em acerto crítico."
                      value={newWeapon.specialEffect || ''}
                      onChange={e => setNewWeapon(prev => ({ ...prev, specialEffect: e.target.value }))}
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1">História / Notas de Origem</label>
                    <input
                      type="text"
                      placeholder="Ex: Roubada de um protótipo experimental de armazém de Heywood."
                      value={newWeapon.notes || ''}
                      onChange={e => setNewWeapon(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsCreatingWeapon(false)}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-400 hover:text-zinc-200"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveWeapon}
                      className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold"
                    >
                      Salvar na Forja
                    </button>
                  </div>
                </div>
              )}

              {/* Weapons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {homebrewData.weapons.map(w => (
                  <div
                    key={w.id}
                    className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3 flex flex-col justify-between hover:border-zinc-700 transition"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-cyan-400 border border-zinc-800">
                            {w.category}
                          </span>
                          <h4 className="text-sm font-bold text-zinc-100 mt-1">{w.name}</h4>
                        </div>
                        <button
                          onClick={() =>
                            setHomebrewData(prev => ({
                              ...prev,
                              weapons: prev.weapons.filter(x => x.id !== w.id),
                            }))
                          }
                          className="p-1 text-zinc-500 hover:text-red-400 transition"
                          title="Excluir Arma"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-[#0a0a0d] border border-[#27272a] text-center font-mono text-xs">
                        <div>
                          <span className="text-[9px] text-zinc-500 block">DANO</span>
                          <span className="font-bold text-red-400">{w.damage}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 block">ROF</span>
                          <span className="font-bold text-zinc-200">{w.rof}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 block">TIROS</span>
                          <span className="font-bold text-zinc-200">{w.shots || '—'}</span>
                        </div>
                      </div>

                      {w.specialEffect && (
                        <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-[11px] text-cyan-200 leading-relaxed">
                          <strong className="text-cyan-400 font-mono">Efeito Especial:</strong> {w.specialEffect}
                        </div>
                      )}

                      {w.notes && (
                        <p className="text-[11px] text-zinc-400 italic">"{w.notes}"</p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <span>Custo: {w.cost}</span>
                      <span>Autor: {w.author || 'Mestre'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW 3.2: CIBERWARE HOMEBREW */}
          {homebrewSubTab === 'cyberware' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  Implantes experimentais, overclocking neural e modificações cirúrgicas de garagem.
                </span>
                <button
                  onClick={() => setIsCreatingCyberware(prev => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isCreatingCyberware ? 'Fechar' : 'Forjar Novo Cromo'}</span>
                </button>
              </div>

              {/* Creator Form */}
              {isCreatingCyberware && (
                <div className="p-5 rounded-2xl bg-[#121217] border border-cyan-500/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27272a] pb-2">
                    <h3 className="text-xs font-bold text-cyan-400 font-mono uppercase flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      <span>Forja de Novo Ciberware</span>
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const c = generateProceduralCyberware();
                          setNewCyberware({
                            name: c.name,
                            type: c.type,
                            humanityLoss: c.humanityLoss,
                            cost: c.cost,
                            install: c.install,
                            description: c.description,
                            mechanicalBonus: c.mechanicalBonus,
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-[10px] flex items-center gap-1 transition"
                        title="Preencher com rolagem procedural rápida"
                      >
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>🎲 Preencher Rápido</span>
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const c = await generateAICustomCyberwareDetailed();
                          setNewCyberware({
                            name: c.name,
                            type: c.type,
                            humanityLoss: c.humanityLoss,
                            cost: c.cost,
                            install: c.install,
                            description: c.description,
                            mechanicalBonus: c.mechanicalBonus,
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-mono text-[10px] flex items-center gap-1 transition"
                        title="Preencher usando a IA do Gemini"
                      >
                        <Zap className="w-3 h-3 text-cyan-200" />
                        <span>⚡ Preencher com IA</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Nome do Implante</label>
                      <input
                        type="text"
                        placeholder="Ex: Pulmões Sintéticos de Alta Pressão"
                        value={newCyberware.name || ''}
                        onChange={e => setNewCyberware(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Tipo de Instalação</label>
                      <select
                        value={newCyberware.type || 'Neural'}
                        onChange={e => setNewCyberware(prev => ({ ...prev, type: e.target.value }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      >
                        <option value="Neural">Neural</option>
                        <option value="Óptico">Óptico</option>
                        <option value="Auditivo">Auditivo</option>
                        <option value="Membros">Membros</option>
                        <option value="Corporal">Corporal</option>
                        <option value="Borgware">Borgware</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Perda de Humanidade</label>
                      <input
                        type="text"
                        placeholder="Ex: 2d6 (7) ou 4d6 (14)"
                        value={newCyberware.humanityLoss || ''}
                        onChange={e => setNewCyberware(prev => ({ ...prev, humanityLoss: e.target.value }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Custo Médio</label>
                      <input
                        type="text"
                        placeholder="Ex: 1.000eb (Very Expensive)"
                        value={newCyberware.cost || ''}
                        onChange={e => setNewCyberware(prev => ({ ...prev, cost: e.target.value }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Local de Cirurgia</label>
                      <select
                        value={newCyberware.install || 'Clínica'}
                        onChange={e => setNewCyberware(prev => ({ ...prev, install: e.target.value }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      >
                        <option value="Mall / Loja">Mall / Loja Comum</option>
                        <option value="Clínica">Clínica de Ripperdoc</option>
                        <option value="Hospital">Hospital Completo</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1">Bônus Mecânico Exato</label>
                    <input
                      type="text"
                      placeholder="Ex: Imunidade a gases tóxicos e +2 em Atletismo para corrida prolongada."
                      value={newCyberware.mechanicalBonus || ''}
                      onChange={e => setNewCyberware(prev => ({ ...prev, mechanicalBonus: e.target.value }))}
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1">Descrição Narrativa</label>
                    <input
                      type="text"
                      placeholder="Ex: Filtros alveolares de cerâmica com dutos de titânio na garganta."
                      value={newCyberware.description || ''}
                      onChange={e => setNewCyberware(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsCreatingCyberware(false)}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-400 hover:text-zinc-200"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveCyberware}
                      className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold"
                    >
                      Salvar Cromo
                    </button>
                  </div>
                </div>
              )}

              {/* Cyberware Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {homebrewData.cyberware.map(c => (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3 flex flex-col justify-between hover:border-zinc-700 transition"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-purple-400 border border-zinc-800">
                            {c.type}
                          </span>
                          <h4 className="text-sm font-bold text-zinc-100 mt-1">{c.name}</h4>
                        </div>
                        <button
                          onClick={() =>
                            setHomebrewData(prev => ({
                              ...prev,
                              cyberware: prev.cyberware.filter(x => x.id !== c.id),
                            }))
                          }
                          className="p-1 text-zinc-500 hover:text-red-400 transition"
                          title="Excluir Implante"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                        {c.description}
                      </p>

                      <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-800/30 text-[11px] text-purple-200 leading-relaxed">
                        <strong className="text-purple-400 font-mono">Bônus de Regra:</strong> {c.mechanicalBonus}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400 pt-1">
                        <div>Perda Hum.: <span className="text-red-400 font-bold">{c.humanityLoss}</span></div>
                        <div>Cirurgia: <span className="text-zinc-200">{c.install}</span></div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                      <span>Custo: {c.cost}</span>
                      <span>Autor: {c.author || 'Mestre'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW 3.3: INIMIGOS E CHEFES HOMEBREW */}
          {homebrewSubTab === 'enemies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  Crie antagonistas customizados, ciberpsicopatas e chefes de arco de história com envio direto ao combate.
                </span>
                <button
                  onClick={() => setIsCreatingEnemy(prev => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isCreatingEnemy ? 'Fechar' : 'Criar Novo Inimigo'}</span>
                </button>
              </div>

              {/* Creator Form */}
              {isCreatingEnemy && (
                <div className="p-5 rounded-2xl bg-[#121217] border border-red-500/40 space-y-4">
                  <h3 className="text-xs font-bold text-red-400 font-mono uppercase flex items-center gap-2">
                    <Skull className="w-4 h-4" />
                    <span>Criador de Inimigo / Chefe Customizado</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Nome do Inimigo</label>
                      <input
                        type="text"
                        placeholder="Ex: Ciberpsicopata 'Sombra'"
                        value={newEnemy.name || ''}
                        onChange={e => setNewEnemy(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Facção / Gangue</label>
                      <input
                        type="text"
                        placeholder="Ex: Maelstrom / Militech / Solo"
                        value={newEnemy.faction || ''}
                        onChange={e => setNewEnemy(prev => ({ ...prev, faction: e.target.value }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Escalão (Tier)</label>
                      <select
                        value={newEnemy.tier || 'mook'}
                        onChange={e => setNewEnemy(prev => ({ ...prev, tier: e.target.value as any }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      >
                        <option value="mook">Mook / Capanga</option>
                        <option value="lieutenant">Tenente</option>
                        <option value="miniboss">Mini-Chefe</option>
                        <option value="boss">Chefe / Ciberpsicopata</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Papel / Arquétipo</label>
                      <input
                        type="text"
                        placeholder="Ex: Atirador Pesado"
                        value={newEnemy.role || ''}
                        onChange={e => setNewEnemy(prev => ({ ...prev, role: e.target.value }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Pontos de Vida (HP)</label>
                      <input
                        type="number"
                        value={newEnemy.hp || 35}
                        onChange={e => setNewEnemy(prev => ({ ...prev, hp: Number(e.target.value) }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">SP Cabeça</label>
                      <input
                        type="number"
                        value={newEnemy.headSP || 11}
                        onChange={e => setNewEnemy(prev => ({ ...prev, headSP: Number(e.target.value) }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">SP Corpo</label>
                      <input
                        type="number"
                        value={newEnemy.bodySP || 11}
                        onChange={e => setNewEnemy(prev => ({ ...prev, bodySP: Number(e.target.value) }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Combat Number (RED)</label>
                      <input
                        type="number"
                        value={newEnemy.combatNumber || 12}
                        onChange={e => setNewEnemy(prev => ({ ...prev, combatNumber: Number(e.target.value) }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Armas (separadas por vírgula)</label>
                      <input
                        type="text"
                        placeholder="Ex: Fuzil de Assalto 5d6, Faca Monomolecular 2d6"
                        value={Array.isArray(newEnemy.weapons) ? newEnemy.weapons.join(', ') : newEnemy.weapons || ''}
                        onChange={e => setNewEnemy(prev => ({ ...prev, weapons: e.target.value as any }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">Ciberware (separado por vírgula)</label>
                      <input
                        type="text"
                        placeholder="Ex: Sandevistan, Ciberolho Térmico, Braço Hidráulico"
                        value={Array.isArray(newEnemy.cyberware) ? newEnemy.cyberware.join(', ') : newEnemy.cyberware || ''}
                        onChange={e => setNewEnemy(prev => ({ ...prev, cyberware: e.target.value as any }))}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1">Habilidade Especial Narrativa / Mecânica</label>
                    <input
                      type="text"
                      placeholder="Ex: Sobrecarga Neural: ao atingir 0 HP, explode liberando pulso elétrico em 6m."
                      value={newEnemy.specialAbility || ''}
                      onChange={e => setNewEnemy(prev => ({ ...prev, specialAbility: e.target.value }))}
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3 py-1.5 text-xs text-zinc-200"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setIsCreatingEnemy(false)}
                      className="px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-400 hover:text-zinc-200"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveEnemy}
                      className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold"
                    >
                      Salvar Inimigo
                    </button>
                  </div>
                </div>
              )}

              {/* Enemies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {homebrewData.enemies.map(e => (
                  <div
                    key={e.id}
                    className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4 flex flex-col justify-between hover:border-zinc-700 transition"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getTierBadge(e.tier)}
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">
                              {e.faction}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-zinc-100">{e.name}</h4>
                          <p className="text-xs text-zinc-400">{e.role}</p>
                        </div>
                        <button
                          onClick={() =>
                            setHomebrewData(prev => ({
                              ...prev,
                              enemies: prev.enemies.filter(x => x.id !== e.id),
                            }))
                          }
                          className="p-1 text-zinc-500 hover:text-red-400 transition"
                          title="Excluir Inimigo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-4 gap-2 p-2.5 rounded-xl bg-[#0a0a0d] border border-[#27272a] text-center font-mono text-xs">
                        <div>
                          <span className="text-[9px] text-zinc-500 block">HP</span>
                          <span className="font-bold text-emerald-400">{e.hp}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 block">SP Cab.</span>
                          <span className="font-bold text-blue-400">{e.headSP}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 block">SP Corp.</span>
                          <span className="font-bold text-blue-400">{e.bodySP}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-zinc-500 block">Combat Nº</span>
                          <span className="font-bold text-amber-400">{e.combatNumber}</span>
                        </div>
                      </div>

                      {/* Weapons */}
                      <div className="text-xs space-y-1">
                        <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">Armas:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {e.weapons.map((w, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 font-mono text-[11px] border border-zinc-800">
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Cyberware */}
                      {e.cyberware.length > 0 && (
                        <div className="text-xs space-y-1">
                          <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">Ciberware:</span>
                          <div className="flex flex-wrap gap-1">
                            {e.cyberware.map((c, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-[#0e0e14] text-zinc-400 text-[10px] font-mono border border-zinc-800">
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Special */}
                      {e.specialAbility && (
                        <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-800/30 text-[11px] text-amber-200 leading-relaxed">
                          <strong className="text-amber-400 font-mono">Habilidade Especial:</strong> {e.specialAbility}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#27272a] flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-500">
                        Criado por: {e.author || 'Mestre'}
                      </span>

                      <button
                        onClick={() => handleAddHomebrewEnemyToCombat(e)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition shadow-sm ${
                          addedCombatId === e.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-red-600 hover:bg-red-500 text-white'
                        }`}
                      >
                        {addedCombatId === e.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Adicionado ao Combate!</span>
                          </>
                        ) : (
                          <>
                            <Swords className="w-3.5 h-3.5" />
                            <span>Enviar para Combate</span>
                          </>
                        )}
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
      {/* MODAL DE IMPORTAÇÃO DE HOMEBREW                         */}
      {/* ======================================================== */}
      {showHbModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-[#27272a] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Importar Biblioteca Homebrew (JSON)</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cole o conteúdo JSON exportado para sincronizar armas, cromo e inimigos criados por outros mestres:
            </p>

            <textarea
              value={importHbText}
              onChange={e => setImportHbText(e.target.value)}
              placeholder='{"weapons": [...], "cyberware": [...], "enemies": [...]}'
              rows={8}
              className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-3 font-mono text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
            />

            {hbFeedback && (
              <p className={`text-xs font-mono ${hbFeedback.includes('sucesso') ? 'text-emerald-400' : 'text-red-400'}`}>
                {hbFeedback}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#27272a]">
              <button
                onClick={() => {
                  setShowHbModal(false);
                  setHbFeedback('');
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono text-zinc-400 hover:text-zinc-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleImportHomebrew}
                className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold"
              >
                Carregar Dados
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL DE IMPORTAÇÃO DE CAMPANHA                          */}
      {/* ======================================================== */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-[#27272a] rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Importar Banco da Campanha (JSON)</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cole o backup de NPCs e anotações para restaurar o estado da campanha:
            </p>

            <textarea
              value={importCampText}
              onChange={e => setImportCampText(e.target.value)}
              placeholder='{"npcs": [...], "notes": "..."}'
              rows={8}
              className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-3 font-mono text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
            />

            {campFeedback && (
              <p className={`text-xs font-mono ${campFeedback.includes('sucesso') ? 'text-emerald-400' : 'text-red-400'}`}>
                {campFeedback}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#27272a]">
              <button
                onClick={() => {
                  setShowCampaignModal(false);
                  setCampFeedback('');
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-mono text-zinc-400 hover:text-zinc-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!importCampText.trim()) return;
                  const ok = importNPCsJSON(importCampText);
                  if (ok) {
                    setCampFeedback('Campanha importada com sucesso!');
                    setTimeout(() => {
                      setCampFeedback('');
                      setShowCampaignModal(false);
                    }, 1200);
                  } else {
                    setCampFeedback('Erro ao importar JSON. Verifique a sintaxe.');
                  }
                }}
                className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold"
              >
                Restaurar Campanha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
