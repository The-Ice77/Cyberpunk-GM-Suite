import React, { useState } from 'react';
import {
  User,
  Shield,
  Heart,
  Crosshair,
  Dices,
  Cpu,
  BookOpen,
  DollarSign,
  Plus,
  Trash2,
  Copy,
  Edit3,
  Check,
  RotateCcw,
  Sparkles,
  Users,
  Eye,
  Zap,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Skull,
  Activity,
  Flame,
  CheckCircle,
  XCircle,
  Sliders,
  Wrench,
  HelpCircle,
  Award,
  Layers,
  Package,
  ShoppingBag,
  Backpack,
  ArrowRight,
  ArrowLeft,
  CheckSquare,
  RefreshCw,
  Globe,
  Shirt,
  Scissors,
  Smile,
  Home,
  Target,
  Bot,
  MapPin,
  Camera,
  Download,
  Search,
} from 'lucide-react';
import { useUserRole } from '../context/UserRoleContext';
import { getWeaponIcon, getCyberwareIcon, getGearIcon, getVehicleIcon } from '../utils/itemIcons';
import { ImageUploadModal } from '../components/common/ImageUploadModal';
import { useSystem } from '../context/SystemContext';
import { useCombat } from '../context/CombatContext';
import {
  PlayerCharacter,
  PREMADE_ARCHETYPES,
  LIFEPATH_TABLES,
  generateRandomLifepath,
  rollLifepathField,
} from '../data/playerArchetypes';
import { generateAILifepathBackstory } from '../services/aiService';
import {
  WEAPONS_DATABASE,
  STREET_GEAR_DATABASE,
  AMMUNITION_DATABASE,
  CYBERWARE_DATABASE,
} from '../data/arsenalData';
import { CodexItemSearchModal, CodexCategory } from '../components/character/CodexItemSearchModal';
import { exportCharacterSheetToPrintPDF } from '../utils/sheetPdfExport';

type CreationMethod = 'streetrat' | 'edgerunner' | 'pointbuy';

// ========================================================
// OFICIAL ARMORED CATALOG (CYBERPUNK RED & 2020)
// ========================================================
export interface OfficialArmorOption {
  id: string;
  name: string;
  sp: number;
  penalty: number; // 0, 2, 4
  cost: number;
  desc: string;
}

export const OFFICIAL_HEAD_ARMORS: OfficialArmorOption[] = [
  { id: 'h-none', name: 'Nenhum / Sem Capacete', sp: 0, penalty: 0, cost: 0, desc: 'Sem proteção craniana. Vulnerável a disparos letais na cabeça.' },
  { id: 'h-leather', name: 'Couro Reforçado (Touca/Bandana)', sp: 4, penalty: 0, cost: 20, desc: 'Touca ou bandana de couro balístico leve. SP 4.' },
  { id: 'h-kevlar', name: 'Kevlar® Helmet / Touca Balística', sp: 7, penalty: 0, cost: 50, desc: 'Proteção discreta de kevlar para o crânio. SP 7.' },
  { id: 'h-light', name: 'Light Armorjack Helmet', sp: 11, penalty: 0, cost: 100, desc: 'Capacete tático de policarbonato leve. O padrão de Night City. SP 11.' },
  { id: 'h-med', name: 'Medium Armorjack Helmet', sp: 12, penalty: 0, cost: 100, desc: 'Capacete balístico com reforço frontal reforçado. SP 12.' },
  { id: 'h-heavy', name: 'Heavy Armorjack Helmet (Riot)', sp: 13, penalty: 0, cost: 500, desc: 'Capacete anti-motim com viseira reforçada de policarbonato. SP 13.' },
  { id: 'h-flak', name: 'Flak Helmet Militar', sp: 15, penalty: 0, cost: 500, desc: 'Capacete pesado militar com placas de aço temperado. SP 15.' },
  { id: 'h-metal', name: 'Metalgear™ Helmet Hermético', sp: 18, penalty: 0, cost: 1000, desc: 'Capacete pressurizado blindado completo com visor HUD de dados. SP 18.' },
];

export const OFFICIAL_BODY_ARMORS: OfficialArmorOption[] = [
  { id: 'b-none', name: 'Nenhum / Roupas Comuns', sp: 0, penalty: 0, cost: 0, desc: 'Roupas normais sem proteção balística.' },
  { id: 'b-styled', name: 'Roupas com Kevlar Leve Estilizadas', sp: 4, penalty: 0, cost: 50, desc: 'Ternos ou vestidos finos costurados com fios balísticos. Zero penalidade. SP 4.' },
  { id: 'b-leathers', name: 'Couro Reforçado de Rua (Leathers)', sp: 7, penalty: 0, cost: 50, desc: 'Jaqueta e calça de couro pesado clássico de motoqueiro. Zero penalidade. SP 7.' },
  { id: 'b-kevlar', name: 'Kevlar® Vest Leve', sp: 7, penalty: 0, cost: 50, desc: 'Colete de Kevlar leve que pode ser usado sob camisetas com discrição. SP 7.' },
  { id: 'b-light', name: 'Light Armorjack Vest (Jaqueta Blindada Leve)', sp: 11, penalty: 0, cost: 100, desc: 'A armadura mais popular de Night City. Policarbonato e Kevlar. Zero penalidade. SP 11.' },
  { id: 'b-bodyweight', name: 'Bodyweight Suit (Traje Colado Netrunner)', sp: 11, penalty: 0, cost: 1000, desc: 'Macacão hermético de nanofibras com tubos de resfriamento para interface. Zero penalidade. SP 11.' },
  { id: 'b-med', name: 'Medium Armorjack Vest (Jaqueta Média)', sp: 12, penalty: 2, cost: 100, desc: 'Placas balísticas rígidas no peito. Penalidade de -2 em REF, DEX e MOVE. SP 12.' },
  { id: 'b-heavy', name: 'Heavy Armorjack Vest (Jaqueta Pesada)', sp: 13, penalty: 2, cost: 500, desc: 'Armadura pesada de infantaria urbana SWAT / MaxTac. Penalidade de -2 em REF, DEX e MOVE. SP 13.' },
  { id: 'b-flak', name: 'Flak Armor Militar', sp: 15, penalty: 4, cost: 500, desc: 'Placas grossas de aço e cerâmica militar. Penalidade de -4 em REF, DEX e MOVE. SP 15.' },
  { id: 'b-metal', name: 'Metalgear™ Corporal Completo', sp: 18, penalty: 4, cost: 5000, desc: 'Armadura completa pressurizada de placas sobrepostas de titânio. Penalidade de -4 em REF, DEX e MOVE. SP 18.' },
];

// ========================================================
// STARTING PACKAGES BY OFFICIAL ROLE (CANONICAL PACKS)
// ========================================================
export const ROLE_STARTING_PACKAGES: Record<string, {
  armor: {
    head: { name: string; sp: number; maxSP: number };
    body: { name: string; sp: number; maxSP: number; penalty: number };
  };
  weapons: {
    name: string;
    damage: string;
    rof: number;
    ammoType: string;
    magCapacity: number;
    magCurrent: number;
    notes?: string;
  }[];
  gear: string[];
  cashEb: number;
}> = {
  Solo: {
    armor: {
      head: { name: 'Light Armorjack Helmet', sp: 11, maxSP: 11 },
      body: { name: 'Light Armorjack Vest (Jaqueta Blindada Leve)', sp: 11, maxSP: 11, penalty: 0 },
    },
    weapons: [
      { name: 'Pistola Pesada 9mm', damage: '3d6', rof: 2, ammoType: 'Heavy', magCapacity: 8, magCurrent: 8 },
      { name: 'Fuzil de Assalto Militech', damage: '5d6', rof: 1, ammoType: '5.56mm', magCapacity: 25, magCurrent: 25, notes: 'Fogo Automático (Autofire 4)' },
      { name: 'Faca de Combate de Monocarbono', damage: '2d6', rof: 2, ammoType: 'Melee', magCapacity: 1, magCurrent: 1, notes: 'Ignora metade do SP' },
    ],
    gear: [
      'Agente Pessoal Holográfico com IA',
      'Mochila Tática Reforçada',
      '50 munições de Fuzil (5.56mm)',
      '30 munições Pesadas de Pistola',
      'Kit Médico Rápido de Emergência',
      'Óculos Escuros Espelhados com HUD',
    ],
    cashEb: 500,
  },
  Netrunner: {
    armor: {
      head: { name: 'Kevlar® Helmet / Touca Balística', sp: 7, maxSP: 7 },
      body: { name: 'Bodyweight Suit (Traje Colado Netrunner)', sp: 11, maxSP: 11, penalty: 0 },
    },
    weapons: [
      { name: 'Pistola Média Dai Lung', damage: '2d6', rof: 2, ammoType: 'Medium', magCapacity: 12, magCurrent: 12 },
      { name: 'Submetralhadora Compacta (SMG)', damage: '2d6', rof: 1, ammoType: 'Medium', magCapacity: 30, magCurrent: 30, notes: 'Autofire 3' },
    ],
    gear: [
      'Cyberdeck Raven Microcyber (7 slots)',
      'Cabos de Interface Neural Trançados',
      'Agente Pessoal Holográfico com IA',
      'Kit de Arrombamento Eletrônico / Lockpick Digital',
      '60 munições Médias (Pistola/SMG)',
      'Pen-Drive Criptografado com Backdoor ICE',
    ],
    cashEb: 1000,
  },
  Tech: {
    armor: {
      head: { name: 'Couro Reforçado (Touca/Bandana)', sp: 4, maxSP: 4 },
      body: { name: 'Light Armorjack Vest (Jaqueta Blindada Leve)', sp: 11, maxSP: 11, penalty: 0 },
    },
    weapons: [
      { name: 'Pistola Pesada 9mm', damage: '3d6', rof: 2, ammoType: 'Heavy', magCapacity: 8, magCurrent: 8 },
      { name: 'Espingarda Padrão (Shotgun)', damage: '5d6', rof: 1, ammoType: 'Shell', magCapacity: 8, magCurrent: 8, notes: 'Disparo sólido 5d6 ou cone 3d6' },
    ],
    gear: [
      'Kit de Ferramentas Técnicas de Alta Precisão',
      'Maçarico / Soldador Portátil de Alta Temperatura',
      'Agente Pessoal Holográfico com IA',
      'Lanterna Tática UV de Longo Alcance',
      '30 cartuchos de Espingarda (Calibre 12)',
      'Maleta com Fitas Térmicas e Peças de Reposição',
    ],
    cashEb: 800,
  },
  Medtech: {
    armor: {
      head: { name: 'Kevlar® Helmet / Touca Balística', sp: 7, maxSP: 7 },
      body: { name: 'Kevlar® Vest Leve', sp: 7, maxSP: 7, penalty: 0 },
    },
    weapons: [
      { name: 'Pistola Pesada 9mm', damage: '3d6', rof: 2, ammoType: 'Heavy', magCapacity: 8, magCurrent: 8 },
      { name: 'Needler / Lança-Dardos Agulheiro', damage: '1d6', rof: 2, ammoType: 'Needle', magCapacity: 10, magCurrent: 10, notes: 'Injeta sedativos ou toxinas' },
    ],
    gear: [
      'Maleta Médica Cirúrgica Trauma Team',
      '5 Doses de Speedheal (Estimulante de Cura)',
      '3 Doses de Sedativo Biológico Concentrado',
      'Agente Pessoal Holográfico com IA',
      'Desfibrilador Cardíaco Portátil',
      'Bolsa de Sangue Sintético Universal',
    ],
    cashEb: 600,
  },
  Fixer: {
    armor: {
      head: { name: 'Nenhum / Sem Capacete', sp: 0, maxSP: 0 },
      body: { name: 'Roupas com Kevlar Leve Estilizadas', sp: 4, maxSP: 4, penalty: 0 },
    },
    weapons: [
      { name: 'Pistola Muito Pesada Nova 338', damage: '4d6', rof: 1, ammoType: 'Very Heavy', magCapacity: 8, magCurrent: 8 },
      { name: 'Garrote Monofilamentar', damage: '3d6', rof: 1, ammoType: 'Melee', magCapacity: 1, magCurrent: 1, notes: 'Silencioso, ignora SP' },
    ],
    gear: [
      'Agente Pessoal Holográfico Top de Linha (IA Executiva)',
      'Rádio Criptografado com Frequência de Negociação',
      'Maleta Executiva Blindada (SP 15)',
      'Óculos Escuros de Designer com Gravador Secreto',
      '30 munições Muito Pesadas',
      'Cartões de Visita VIP com Cripto-Assinatura',
    ],
    cashEb: 1200,
  },
  Nomad: {
    armor: {
      head: { name: 'Couro Reforçado (Touca/Bandana)', sp: 4, maxSP: 4 },
      body: { name: 'Couro Reforçado de Rua (Leathers)', sp: 7, maxSP: 7, penalty: 0 },
    },
    weapons: [
      { name: 'Espingarda Padrão (Shotgun)', damage: '5d6', rof: 1, ammoType: 'Shell', magCapacity: 2, magCurrent: 2 },
      { name: 'Pistola Pesada 9mm', damage: '3d6', rof: 2, ammoType: 'Heavy', magCapacity: 6, magCurrent: 6 },
      { name: 'Machete / Facão de Selva', damage: '3d6', rof: 2, ammoType: 'Melee', magCapacity: 1, magCurrent: 1 },
    ],
    gear: [
      'Kit de Ferramentas Automotivas de Estrada',
      'Galão de Combustível Sintético CHOOH2 (10L)',
      'Cabo de Aço Reforçado com Guincho e Gancho',
      'Agente Pessoal Resistente a Choque e Areia',
      'Binóculos com Visão Térmica para Badlands',
      '40 cartuchos Calibre 12 de Espingarda',
    ],
    cashEb: 600,
  },
  Rockerboy: {
    armor: {
      head: { name: 'Nenhum / Sem Capacete', sp: 0, maxSP: 0 },
      body: { name: 'Couro Reforçado de Rua (Leathers)', sp: 7, maxSP: 7, penalty: 0 },
    },
    weapons: [
      { name: 'Pistola Pesada 9mm', damage: '3d6', rof: 2, ammoType: 'Heavy', magCapacity: 8, magCurrent: 8 },
      { name: 'Faca de Combate / Punhal', damage: '2d6', rof: 2, ammoType: 'Melee', magCapacity: 1, magCurrent: 1 },
    ],
    gear: [
      'Guitarra Elétrica Customizada com Compartimento Secreto',
      'Micro-Amplificador Portátil de Cintura',
      'Agente Pessoal Holográfico com Interface Musical Ziggurat',
      'Óculos Espelhados com Letreiro de LED Programável',
      '30 munições Pesadas de Pistola',
      'Palhetas Monomoleculares Autografadas',
    ],
    cashEb: 800,
  },
  Exec: {
    armor: {
      head: { name: 'Nenhum / Sem Capacete', sp: 0, maxSP: 0 },
      body: { name: 'Roupas com Kevlar Leve Estilizadas', sp: 4, maxSP: 4, penalty: 0 },
    },
    weapons: [
      { name: 'Federated Arms X-9m', damage: '1d6+2', rof: 2, ammoType: 'Light', magCapacity: 10, magCurrent: 10, notes: 'Smartlink integrado' },
    ],
    gear: [
      'Agente Pessoal Corporativo com Acesso VIP',
      'Terno de Fibra Sintética Sob Medida Resistente a Manchas',
      'Relógio Holográfico de Luxo com Detector de Biossinais',
      'Caneta com Gravador Criptografado e Laser',
      'Chaveiro Digital de Veículo Corporativo',
    ],
    cashEb: 1500,
  },
  Lawman: {
    armor: {
      head: { name: 'Heavy Armorjack Helmet (Riot)', sp: 13, maxSP: 13 },
      body: { name: 'Heavy Armorjack Vest (Jaqueta Pesada)', sp: 13, maxSP: 13, penalty: 2 },
    },
    weapons: [
      { name: 'Pistola Pesada 9mm', damage: '3d6', rof: 2, ammoType: 'Heavy', magCapacity: 8, magCurrent: 8 },
      { name: 'Espingarda Padrão (Shotgun)', damage: '5d6', rof: 1, ammoType: 'Shell', magCapacity: 8, magCurrent: 8 },
      { name: 'Cassetete Tático / Bastão Retrátil', damage: '2d6', rof: 2, ammoType: 'Melee', magCapacity: 1, magCurrent: 1, notes: 'Dano atordoante' },
    ],
    gear: [
      'Distintivo Oficial do Departamento de Polícia de Night City',
      'Algemas de Aço de Alta Resistência com Chave Magnética (x3)',
      'Rádio Militar com Canal Direto de Despacho e Reforços',
      'Lanterna Tática Estroboscópica de 2.000 Lúmens',
      '40 munições Pesadas de Pistola',
      '20 cartuchos de Espingarda Calibre 12',
    ],
    cashEb: 500,
  },
};

export const PlayerSheetPage: React.FC = () => {
  const { system } = useSystem();
  const {
    playerCharacters,
    activeCharacter,
    setActiveCharacterId,
    savePlayerCharacter,
    deletePlayerCharacter,
  } = useUserRole();
  const { combatants, updateHP: updateCombatHP, ablateSP: ablateCombatSP, addCriticalInjury, addCombatant, importFromPlayerCharacter } = useCombat();

  const [viewMode, setViewMode] = useState<'gallery' | 'sheet'>('sheet');
  const [activeSheetTab, setActiveSheetTab] = useState<'stats' | 'inventory' | 'skills' | 'cyber' | 'lifepath'>('stats');

  // Roll result notification banner
  const [lastRoll, setLastRoll] = useState<{
    title: string;
    d10: number;
    bonus: number;
    total: number;
    isCrit: boolean;
    isFumble: boolean;
    extraMessage?: string;
  } | null>(null);

  // Attack Roller Modal State
  const [attackModal, setAttackModal] = useState<{
    isOpen: boolean;
    weaponName: string;
    damageDice: string;
    rof: number;
    ammoType: string;
    distanceCategory: string; // '0-6m' | '7-12m' | '13-25m' | '26-50m' | '51-100m'
    aimMode: 'normal' | 'head';
    customDV: number;
    targetEvasion: number;
    useEvasion: boolean;
    targetCombatantId?: string;
  } | null>(null);

  // Image Modal State
  const [imageModalConfig, setImageModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    currentUrl?: string;
    category?: 'all' | 'personagem' | 'inimigo' | 'pet' | 'veiculo' | 'arma' | 'cromo';
    onSave: (url: string) => void;
  }>({
    isOpen: false,
    title: 'Imagem / Avatar',
    currentUrl: '',
    category: 'personagem',
    onSave: () => {},
  });

  const [attackResult, setAttackResult] = useState<{
    roll: number;
    base: number;
    total: number;
    targetDV: number;
    hit: boolean;
    margin: number;
    damageRolled?: { total: number; dice: number[]; isCrit: boolean };
    description: string;
  } | null>(null);

  // Edit Character Modal State
  const [isEditingChar, setIsEditingChar] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<PlayerCharacter | null>(null);

  // Active Sheet Modals
  const [showArmorModal, setShowArmorModal] = useState<boolean>(false);
  const [showAddWeaponModal, setShowAddWeaponModal] = useState<boolean>(false);
  const [showAddCyberModal, setShowAddCyberModal] = useState<boolean>(false);
  const [showCodexSearchModal, setShowCodexSearchModal] = useState<boolean>(false);
  const [codexInitialCategory, setCodexInitialCategory] = useState<CodexCategory>('all');
  const [newGearInput, setNewGearInput] = useState<string>('');

  // Creation Wizard State (7 Comprehensive Steps)
  const [showWizard, setShowWizard] = useState<boolean>(false);
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [creationMethod, setCreationMethod] = useState<CreationMethod>('edgerunner');
  const [pointBuyTier, setPointBuyTier] = useState<number>(72); // 62, 72, 80

  // Creation Wizard Temporary Weapon & Gear Inputs
  const [customWeaponInput, setCustomWeaponInput] = useState({
    name: '',
    damage: '3d6',
    rof: 1,
    ammoType: 'Heavy',
    magCapacity: 8,
    notes: '',
  });
  const [customGearInput, setCustomGearInput] = useState('');

  // Lifepath State & Actions
  const [isGeneratingBio, setIsGeneratingBio] = useState<boolean>(false);
  const [bioToast, setBioToast] = useState<string | null>(null);

  const handleUpdateLifepathField = (field: keyof PlayerCharacter['lifepath'], value: string) => {
    if (!char) return;
    const currentLifepath = char.lifepath || {
      culturalOrigin: '',
      personality: '',
      clothingStyle: '',
      hairstyle: '',
      valueMost: '',
      feelingsAboutPeople: '',
      valuedPerson: '',
      valuedPossession: '',
      familyBackground: '',
      childhoodEnvironment: '',
      familyCrisis: '',
      lifeGoals: '',
      tragicLoveAffair: '',
      nemesis: '',
    };
    const updatedLifepath = {
      ...currentLifepath,
      [field]: value,
    };
    savePlayerCharacter({
      ...char,
      lifepath: updatedLifepath,
    });
  };

  const handleRollSingleField = (field: keyof PlayerCharacter['lifepath'], tableKey: keyof typeof LIFEPATH_TABLES) => {
    const table = LIFEPATH_TABLES[tableKey];
    if (!table) return;
    const rolled = rollLifepathField(table);
    handleUpdateLifepathField(field, rolled);
    setBioToast(`Rolado: ${rolled.slice(0, 32)}...`);
    setTimeout(() => setBioToast(null), 2000);
  };

  const handleRollAllLifepath = () => {
    if (!char) return;
    const newLifepath = generateRandomLifepath();
    savePlayerCharacter({
      ...char,
      lifepath: newLifepath,
    });
    setBioToast('Lifepath completo sorteado nas 14 tabelas oficiais!');
    setTimeout(() => setBioToast(null), 2500);
  };

  const handleGenerateBio = async () => {
    if (!char) return;
    setIsGeneratingBio(true);
    try {
      const bio = await generateAILifepathBackstory(
        char.name,
        char.role,
        char.lifepath as unknown as Record<string, string>
      );
      const currentNotes = char.notes ? `${char.notes}\n\n` : '';
      const updatedNotes = `${currentNotes}### 📖 Crônica do Edgerunner (Lifepath)\n${bio}`;
      savePlayerCharacter({
        ...char,
        notes: updatedNotes,
      });
      setBioToast('Crônica gerada com IA e salva nas Anotações da ficha!');
      setTimeout(() => setBioToast(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const [wizardChar, setWizardChar] = useState<Partial<PlayerCharacter>>({
    name: 'Novo Cyberpunk',
    handle: 'Viper',
    role: 'Solo',
    system: 'RED',
    roleAbility: { name: 'Consciência de Combate', rank: 4, description: 'Distribui pontos entre Iniciativa, Dano e Evasão.' },
    statsRED: { INT: 6, REF: 7, DEX: 7, TECH: 5, COOL: 6, WILL: 6, LUCK: 5, MOVE: 6, BODY: 7, EMP: 5 },
    currentHP: 45,
    maxHP: 45,
    humanity: 50,
    maxHumanity: 50,
    headSP: 11,
    bodySP: 11,
    cashEb: 1000,
    skills: {
      'Percepção (Awareness)': 6,
      'Esquiva (Evasion)': 6,
      'Armas Curtas (Handgun)': 6,
      'Armas de Ombro (Shoulder Arms)': 6,
      'Furtividade (Stealth)': 5,
      'Primeiros Socorros': 5,
      'Atletismo (Athletics)': 6,
      'Briga (Brawling)': 6,
    },
    weapons: [
      { name: 'Pistola Pesada 9mm', damage: '3d6', rof: 2, ammoType: 'Heavy', magCapacity: 8, magCurrent: 8 },
      { name: 'Fuzil de Assalto Militech', damage: '5d6', rof: 1, ammoType: '5.56mm', magCapacity: 25, magCurrent: 25, notes: 'Fogo Automático' },
    ],
    armor: {
      head: { name: 'Light Armorjack Helmet', sp: 11, maxSP: 11 },
      body: { name: 'Light Armorjack Vest (Jaqueta Blindada Leve)', sp: 11, maxSP: 11, penalty: 0 },
    },
    cyberware: [
      { name: 'Ciberolho com HUD Smartlink', type: 'Óptico', humanityCost: 3, description: '+1 no ataque e contagem de munição' },
    ],
    gear: [
      'Agente Pessoal Holográfico com IA',
      'Mochila Tática Reforçada',
      '50 munições de Fuzil (5.56mm)',
      '30 munições Pesadas de Pistola',
      'Kit Médico Rápido de Emergência',
    ],
    lifepath: {
      culturalOrigin: 'Norte-Americano (Night City)',
      personality: 'Cínico, observador e leal à equipe.',
      clothingStyle: 'Streetwear Militar',
      hairstyle: 'Raspado nas laterais com trança',
      valueMost: 'Lealdade e sobrevivência',
      feelingsAboutPeople: 'Pessoas são ferramentas ou alvos',
      valuedPerson: 'Antigo mentor Solo veterano',
      valuedPossession: 'Pistola pesada herdada',
      familyBackground: 'Família dispersa no colapso',
      childhoodEnvironment: 'Ruas industriais de Watson',
      familyCrisis: 'Família perdeu tudo em guerra de gangues',
      lifeGoals: 'Conquistar respeito e um nome no Afterlife',
      tragicLoveAffair: 'Parceiro morreu em tiroteio de extração',
      nemesis: 'Tenente de segurança da Arasaka',
    },
    notes: 'Criado no modo rápido de Edgerunner.',
  });

  if (!activeCharacter && playerCharacters.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center bg-[#121217] border border-[#27272a] rounded-2xl space-y-4">
        <User className="w-10 h-10 text-zinc-600 mx-auto" />
        <h2 className="text-base font-bold text-zinc-200">Nenhum personagem encontrado</h2>
        <p className="text-xs text-zinc-400">Comece carregando o arquétipo lendário de Forty-Five ou crie uma ficha do zero.</p>
        <button
          onClick={() => savePlayerCharacter(PREMADE_ARCHETYPES[0])}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-medium"
        >
          Carregar Arquétipo Forty-Five (Solo)
        </button>
      </div>
    );
  }

  const char = activeCharacter || playerCharacters[0];

  // ========================================================
  // OFFICIAL ARMOR PENALTY CALCULATIONS (REF, DEX, MOVE)
  // ========================================================
  const headDef = OFFICIAL_HEAD_ARMORS.find(a => a.name === char.armor?.head?.name);
  const bodyDef = OFFICIAL_BODY_ARMORS.find(a => a.name === char.armor?.body?.name);
  const headPenalty = headDef ? headDef.penalty : 0;
  const bodyPenalty = bodyDef ? bodyDef.penalty : Math.abs(char.armor?.body?.penalty || 0);
  const activeArmorPenalty = Math.max(headPenalty, bodyPenalty);

  const effectiveREF = Math.max(1, (char.statsRED?.REF || 0) - activeArmorPenalty);
  const effectiveDEX = Math.max(1, (char.statsRED?.DEX || 0) - activeArmorPenalty);
  const effectiveMOVE = Math.max(1, (char.statsRED?.MOVE || 0) - activeArmorPenalty);

  // Helper for 1d10 exploding roll
  const performD10Roll = (label: string, bonus: number) => {
    const d10 = Math.floor(Math.random() * 10) + 1;
    let total = d10 + bonus;
    let isCrit = false;
    let isFumble = false;
    let extraMessage = '';

    if (d10 === 10) {
      isCrit = true;
      const explode = Math.floor(Math.random() * 10) + 1;
      total += explode;
      extraMessage = `Explosão Crítica (+${explode})!`;
    } else if (d10 === 1) {
      isFumble = true;
      const blunder = Math.floor(Math.random() * 10) + 1;
      total -= blunder;
      extraMessage = `Falha Crítica (-${blunder})!`;
    }

    setLastRoll({
      title: label,
      d10,
      bonus,
      total,
      isCrit,
      isFumble,
      extraMessage,
    });
  };

  // Open Attack Modal
  const handleOpenAttackModal = (weapon: any) => {
    setAttackModal({
      isOpen: true,
      weaponName: weapon.name,
      damageDice: weapon.damage,
      rof: weapon.rof || 1,
      ammoType: weapon.ammoType,
      distanceCategory: '7-12m',
      aimMode: 'normal',
      customDV: 15,
      targetEvasion: 14,
      useEvasion: false,
      targetCombatantId: combatants[0]?.id || '',
    });
    setAttackResult(null);
  };

  const handleSendPlayerToCombat = () => {
    importFromPlayerCharacter(char);
    alert(`Personagem ${char.name} adicionado à Arena de Combate com sucesso! Armas, munição e implantes foram sincronizados.`);
  };

  const executeAttackRoll = () => {
    if (!attackModal) return;
    const ref = effectiveREF;
    const isShoulder = attackModal.weaponName.toLowerCase().includes('fuzil') || attackModal.weaponName.toLowerCase().includes('espingarda');
    const isMelee = attackModal.weaponName.toLowerCase().includes('faca') || attackModal.weaponName.toLowerCase().includes('katana') || attackModal.weaponName.toLowerCase().includes('machado');

    let skillKey = 'Armas Curtas (Handgun)';
    if (isShoulder) skillKey = 'Armas de Ombro (Shoulder Arms)';
    if (isMelee) skillKey = 'Armas Brancas (Melee Weapon)';

    const skillLevel = char.skills[skillKey] || char.skills['Armas Curtas (Handgun)'] || 6;
    let base = ref + skillLevel;

    if (attackModal.aimMode === 'head') {
      base -= 8;
    }

    let targetDV = attackModal.customDV;
    if (attackModal.useEvasion) {
      targetDV = attackModal.targetEvasion;
    } else {
      switch (attackModal.distanceCategory) {
        case '0-6m': targetDV = 13; break;
        case '7-12m': targetDV = 15; break;
        case '13-25m': targetDV = 20; break;
        case '26-50m': targetDV = 25; break;
        case '51-100m': targetDV = 30; break;
      }
    }

    const d10 = Math.floor(Math.random() * 10) + 1;
    let rollBonus = 0;
    if (d10 === 10) rollBonus += Math.floor(Math.random() * 10) + 1;
    if (d10 === 1) rollBonus -= Math.floor(Math.random() * 10) + 1;

    const total = d10 + rollBonus + base;
    const hit = total >= targetDV;
    const margin = total - targetDV;

    const match = attackModal.damageDice.match(/(\d+)d6/);
    const count = match ? parseInt(match[1]) : 3;
    const rolls: number[] = [];
    let sum = 0;
    let sixes = 0;
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 6) + 1;
      rolls.push(r);
      sum += r;
      if (r === 6) sixes++;
    }

    const isCrit = sixes >= 2;
    let dmgTotal = sum;
    if (isCrit) dmgTotal += 5;

    let desc = hit
      ? `ACERTOU! (Total ${total} vs DV ${targetDV}). Margem: +${margin}. Dano gerado: ${dmgTotal} HP [${rolls.join(', ')}] ${isCrit ? '💥 FERIMENTO CRÍTICO (+5 HP Bônus)!' : ''}`
      : `ERROU! (Total ${total} vs DV ${targetDV}). Disparo atingiu cobertura ou foi desviado.`;

    if (attackModal.aimMode === 'head' && hit) {
      desc += ' 🎯 TIRO NA CABEÇA! Dano que passar da armadura de cabeça é multiplicado por 2!';
    }

    if (attackModal.targetCombatantId && hit) {
      const target = combatants.find(c => c.id === attackModal.targetCombatantId);
      if (target) {
        const armor = attackModal.aimMode === 'head' ? target.headSP : target.bodySP;
        const armorLoc = attackModal.aimMode === 'head' ? 'head' : 'body';
        if (dmgTotal > armor) {
          ablateCombatSP(target.id, armorLoc, -1);
          const penetrating = dmgTotal - armor;
          const finalHpDamage = attackModal.aimMode === 'head' ? penetrating * 2 : penetrating;
          updateCombatHP(target.id, -finalHpDamage);
          desc += ` | ⚔️ DANO APLICADO NO ALVO ${target.name}: -${finalHpDamage} HP (Ablação: -1 SP em ${armorLoc === 'head' ? 'Cabeça' : 'Corpo'}).`;
        } else {
          desc += ` | 🛡️ Disparo atingiu a blindagem de ${target.name} (SP ${armor}), mas o dano (${dmgTotal}) não penetrou a armadura.`;
        }
        if (isCrit) {
          addCriticalInjury(target.id, 'Ferimento Crítico (Tiro de ' + char.name + ')');
          desc += ' ⚠️ Ferimento Crítico adicionado ao alvo!';
        }
      }
    }

    setAttackResult({
      roll: d10,
      base,
      total,
      targetDV,
      hit,
      margin,
      damageRolled: { total: dmgTotal, dice: rolls, isCrit },
      description: desc,
    });
  };

  const rollWeaponDamage = (weaponName: string, damageDice: string) => {
    const match = damageDice.match(/(\d+)d6/);
    const count = match ? parseInt(match[1]) : 3;

    const rolls: number[] = [];
    let sum = 0;
    let sixes = 0;
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 6) + 1;
      rolls.push(r);
      sum += r;
      if (r === 6) sixes++;
    }

    const hasCritInjury = sixes >= 2;
    let total = sum;
    if (hasCritInjury) total += 5;

    setLastRoll({
      title: `Dano de ${weaponName} (${count}d6)`,
      d10: 0,
      bonus: 0,
      total,
      isCrit: hasCritInjury,
      isFumble: false,
      extraMessage: `Dados: [${rolls.join(', ')}] ${hasCritInjury ? '💥 FERIMENTO CRÍTICO (+5 HP Bônus)!' : ''}`,
    });
  };

  const rollDeathSave = () => {
    const d10 = Math.floor(Math.random() * 10) + 1;
    const bodyStat = char.statsRED.BODY;
    const survived = d10 <= bodyStat;

    setLastRoll({
      title: `Teste de Salvaguarda de Morte (1d10 vs BODY ${bodyStat})`,
      d10,
      bonus: 0,
      total: d10,
      isCrit: survived,
      isFumble: !survived,
      extraMessage: survived
        ? `SOBREVIVEU! Rolou ${d10} (Menor ou igual ao BODY ${bodyStat}). O personagem resiste mais uma rodada!`
        : `FALHA LETAL! Rolou ${d10} (Maior que o BODY ${bodyStat}). O personagem entra em Parada Cardíaca se não for estabilizado imediatamente!`,
    });
  };

  const updateHP = (delta: number) => {
    const updated = {
      ...char,
      currentHP: Math.max(0, Math.min(char.maxHP, char.currentHP + delta)),
    };
    savePlayerCharacter(updated);
  };

  const ablateSP = (part: 'head' | 'body', delta: number) => {
    const updated = {
      ...char,
      armor: {
        ...char.armor,
        [part]: {
          ...char.armor[part],
          sp: Math.max(0, char.armor[part].sp + delta),
        },
      },
      headSP: part === 'head' ? Math.max(0, (char.armor?.head?.sp || char.headSP) + delta) : char.headSP,
      bodySP: part === 'body' ? Math.max(0, (char.armor?.body?.sp || char.bodySP) + delta) : char.bodySP,
    };
    savePlayerCharacter(updated);
  };

  // Armor Repair Helper
  const handleRepairArmor = (location: 'head' | 'body' | 'both') => {
    const updated = { ...char };
    if (location === 'head' || location === 'both') {
      const maxHead = updated.armor?.head?.maxSP || 11;
      if (!updated.armor) updated.armor = { head: { name: 'Capacete', sp: maxHead, maxSP: maxHead }, body: { name: 'Colete', sp: 11, maxSP: 11, penalty: 0 } };
      updated.armor.head.sp = maxHead;
      updated.headSP = maxHead;
    }
    if (location === 'body' || location === 'both') {
      const maxBody = updated.armor?.body?.maxSP || 11;
      if (!updated.armor) updated.armor = { head: { name: 'Capacete', sp: 11, maxSP: 11 }, body: { name: 'Colete', sp: maxBody, maxSP: maxBody, penalty: 0 } };
      updated.armor.body.sp = maxBody;
      updated.bodySP = maxBody;
    }
    savePlayerCharacter(updated);
  };

  // Swap / Equip Armor Helper
  const handleEquipArmor = (location: 'head' | 'body', armorOption: OfficialArmorOption) => {
    const updated = { ...char };
    if (!updated.armor) {
      updated.armor = {
        head: { name: 'Light Armorjack Helmet', sp: 11, maxSP: 11 },
        body: { name: 'Light Armorjack Vest', sp: 11, maxSP: 11, penalty: 0 },
      };
    }
    if (location === 'head') {
      updated.armor.head = {
        name: armorOption.name,
        sp: armorOption.sp,
        maxSP: armorOption.sp,
      };
      updated.headSP = armorOption.sp;
    } else {
      updated.armor.body = {
        name: armorOption.name,
        sp: armorOption.sp,
        maxSP: armorOption.sp,
        penalty: armorOption.penalty,
      };
      updated.bodySP = armorOption.sp;
    }
    savePlayerCharacter(updated);
  };

  // Cash adjustment helper
  const handleAdjustCash = (delta: number) => {
    const newCash = Math.max(0, (char.cashEb || 0) + delta);
    savePlayerCharacter({ ...char, cashEb: newCash });
  };

  // Inventory Gear helpers
  const handleAddGearItem = (itemName: string) => {
    if (!itemName.trim()) return;
    const currentGear = Array.isArray(char.gear) ? [...char.gear] : [];
    currentGear.push(itemName.trim());
    savePlayerCharacter({ ...char, gear: currentGear });
  };

  const handleRemoveGearItem = (index: number) => {
    const currentGear = Array.isArray(char.gear) ? [...char.gear] : [];
    currentGear.splice(index, 1);
    savePlayerCharacter({ ...char, gear: currentGear });
  };

  // Weapon helpers
  const shootWeapon = (idx: number) => {
    const weapons = [...char.weapons];
    if (weapons[idx].magCurrent > 0) {
      weapons[idx].magCurrent -= 1;
      savePlayerCharacter({ ...char, weapons });
    }
  };

  const reloadWeapon = (idx: number) => {
    const weapons = [...char.weapons];
    weapons[idx].magCurrent = weapons[idx].magCapacity;
    savePlayerCharacter({ ...char, weapons });
  };

  const handleRemoveWeapon = (idx: number) => {
    const weapons = [...char.weapons];
    weapons.splice(idx, 1);
    savePlayerCharacter({ ...char, weapons });
  };

  const handleAddWeapon = (w: {
    name: string;
    damage: string;
    rof: number;
    ammoType: string;
    magCapacity: number;
    magCurrent: number;
    notes?: string;
  }) => {
    const weapons = [...char.weapons, w];
    savePlayerCharacter({ ...char, weapons });
    setShowAddWeaponModal(false);
  };

  // Handlers for Codex Item Search Modal
  const handleEquipWeaponFromCodex = (w: {
    name: string;
    damage: string;
    rof: number;
    ammoType: string;
    magCapacity: number;
    magCurrent: number;
    notes?: string;
  }) => {
    if (!char) return;
    const weapons = [...char.weapons, w];
    savePlayerCharacter({ ...char, weapons });
  };

  const handleInstallCyberwareFromCodex = (
    c: {
      name: string;
      type: string;
      humanityCost: number;
      description: string;
    },
    deductHumanity: boolean
  ) => {
    if (!char) return;
    const cyberware = [...char.cyberware, c];
    const updatedHumanity = deductHumanity ? Math.max(0, char.humanity - c.humanityCost) : char.humanity;
    savePlayerCharacter({ ...char, cyberware, humanity: updatedHumanity });
  };

  const handleEquipArmorFromCodex = (a: {
    type: 'head' | 'body';
    name: string;
    sp: number;
    penalty?: number;
  }) => {
    if (!char) return;
    const armor = { ...char.armor };
    if (a.type === 'head') {
      armor.head = { name: a.name, sp: a.sp, maxSP: a.sp };
      savePlayerCharacter({ ...char, armor, headSP: a.sp });
    } else {
      armor.body = { name: a.name, sp: a.sp, maxSP: a.sp, penalty: a.penalty || 0 };
      savePlayerCharacter({ ...char, armor, bodySP: a.sp });
    }
  };

  const handleAddGearItemFromCodex = (itemString: string) => {
    if (!char) return;
    const currentGear = Array.isArray(char.gear) ? [...char.gear, itemString] : [itemString];
    savePlayerCharacter({ ...char, gear: currentGear });
  };

  const handleAttachToWeaponFromCodex = (weaponIdx: number, attachmentName: string, benefitText: string) => {
    if (!char) return;
    const weapons = [...char.weapons];
    if (weapons[weaponIdx]) {
      const existingNotes = weapons[weaponIdx].notes ? `${weapons[weaponIdx].notes} | ` : '';
      weapons[weaponIdx] = {
        ...weapons[weaponIdx],
        notes: `${existingNotes}+ ${attachmentName} (${benefitText})`,
      };
      savePlayerCharacter({ ...char, weapons });
    }
  };

  const handleDeductCashFromCodex = (amount: number) => {
    if (!char) return;
    const currentCash = char.cashEb || 0;
    const updatedCash = Math.max(0, currentCash - amount);
    savePlayerCharacter({ ...char, cashEb: updatedCash });
  };

  // Wizard Point Buy Total
  const getPointBuyTotal = () => {
    if (!wizardChar.statsRED) return 0;
    return Object.values(wizardChar.statsRED).reduce((a, b) => a + b, 0);
  };

  // Wizard Package Loader Helper
  const loadRoleDefaultsInWizard = (roleName: string) => {
    const pack = ROLE_STARTING_PACKAGES[roleName] || ROLE_STARTING_PACKAGES['Solo'];
    setWizardChar(prev => ({
      ...prev,
      role: roleName,
      armor: JSON.parse(JSON.stringify(pack.armor)),
      headSP: pack.armor.head.sp,
      bodySP: pack.armor.body.sp,
      weapons: JSON.parse(JSON.stringify(pack.weapons)),
      gear: [...pack.gear],
      cashEb: pack.cashEb,
    }));
  };

  // Wizard Armor Penalty Preview
  const wizardHeadDef = OFFICIAL_HEAD_ARMORS.find(a => a.name === wizardChar.armor?.head?.name);
  const wizardBodyDef = OFFICIAL_BODY_ARMORS.find(a => a.name === wizardChar.armor?.body?.name);
  const wizardPenalty = Math.max(wizardHeadDef?.penalty || 0, wizardBodyDef?.penalty || Math.abs(wizardChar.armor?.body?.penalty || 0));

  const isSeriouslyWounded = char.currentHP <= Math.ceil(char.maxHP / 2) && char.currentHP > 0;
  const isMortallyWounded = char.currentHP === 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Bar: View Mode Switcher + Character Switcher + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#27272a] gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#14141a] border border-[#27272a] rounded-xl p-0.5">
            <button
              onClick={() => setViewMode('gallery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                viewMode === 'gallery'
                  ? 'bg-zinc-800 text-cyan-400 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Galeria de Fichas ({playerCharacters.length})</span>
            </button>
            <button
              onClick={() => setViewMode('sheet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                viewMode === 'sheet'
                  ? 'bg-zinc-800 text-zinc-100 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <User className="w-3.5 h-3.5 text-red-500" />
              <span>Ficha: {char.handle}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'sheet' && (
            <button
              onClick={() => {
                setEditFormData(JSON.parse(JSON.stringify(char)));
                setIsEditingChar(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs flex items-center gap-1.5 transition border border-zinc-700"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>Editar Ficha</span>
            </button>
          )}

          <button
            onClick={() => {
              setWizardStep(1);
              loadRoleDefaultsInWizard('Solo');
              setShowWizard(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-xs flex items-center gap-1.5 transition shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Criador Oficial de Personagem</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: CHARACTER ROSTER GALLERY */}
      {viewMode === 'gallery' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>Roster de Personagens da Campanha</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Selecione uma ficha para abrir, gerenciar estatísticas, inventário, armaduras e combates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {playerCharacters.map(pc => {
              const isSelected = pc.id === char.id;
              const pcSerious = pc.currentHP <= Math.ceil(pc.maxHP / 2) && pc.currentHP > 0;
              const pcMortal = pc.currentHP === 0;

              return (
                <div
                  key={pc.id}
                  className={`p-5 rounded-2xl bg-[#121217] border transition flex flex-col justify-between space-y-4 shadow-sm relative ${
                    isSelected
                      ? 'border-cyan-500/80 ring-1 ring-cyan-500/40 shadow-cyan-950/20'
                      : 'border-[#27272a] hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative group shrink-0">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                            {pc.imageUrl ? (
                              <img src={pc.imageUrl} alt={pc.name} className="w-full h-full object-cover" />
                            ) : (
                              <User className="w-6 h-6 text-cyan-400/80" />
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setImageModalConfig({
                              isOpen: true,
                              title: `Foto de ${pc.name}`,
                              currentUrl: pc.imageUrl,
                              category: 'personagem',
                              onSave: url => {
                                savePlayerCharacter({ ...pc, imageUrl: url });
                              },
                            })}
                            className="absolute -bottom-1 -right-1 p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-cyan-500/40 shadow transition hover:scale-110"
                            title="Alterar Retrato"
                          >
                            <Camera className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800/40 font-bold uppercase">
                              {pc.role}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500">
                              {pc.system}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-zinc-100">{pc.name}</h3>
                          <p className="text-xs text-cyan-400 font-mono">"{pc.handle}"</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const clone: PlayerCharacter = {
                              ...pc,
                              id: 'pc-' + Date.now(),
                              name: `${pc.name} (Cópia)`,
                              handle: `${pc.handle}_Clone`,
                            };
                            savePlayerCharacter(clone);
                          }}
                          className="p-1 rounded text-zinc-400 hover:text-zinc-200"
                          title="Duplicar Personagem"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {playerCharacters.length > 1 && (
                          <button
                            onClick={() => deletePlayerCharacter(pc.id)}
                            className="p-1 rounded text-zinc-500 hover:text-red-400"
                            title="Excluir Personagem"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Vitals Bar */}
                    <div className="space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-500" /> HP:
                        </span>
                        <span className={`font-bold ${pcMortal ? 'text-red-500 animate-pulse' : pcSerious ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {pc.currentHP} / {pc.maxHP}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${pcMortal ? 'bg-red-600' : pcSerious ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${(pc.currentHP / pc.maxHP) * 100}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] pt-1">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <Shield className="w-3 h-3 text-blue-400" /> Blindagem (SP):
                        </span>
                        <span className="text-blue-300 font-bold">
                          Cab: {pc.armor?.head?.sp ?? pc.headSP} | Corp: {pc.armor?.body?.sp ?? pc.bodySP}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-zinc-400 flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-amber-400" /> Eddies:
                        </span>
                        <span className="text-amber-400 font-bold">
                          {pc.cashEb ?? 0} eb
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#27272a] flex items-center justify-between">
                    <button
                      onClick={() => {
                        setActiveCharacterId(pc.id);
                        setViewMode('sheet');
                      }}
                      className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isSelected ? 'Ficha Aberta' : 'Abrir Ficha'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: INTERACTIVE CHARACTER SHEET */}
      {viewMode === 'sheet' && (
        <div className="space-y-6">
          {/* Active Roll Notification Card */}
          {lastRoll && (
            <div className="p-4 rounded-2xl bg-[#14141a] border border-cyan-500/40 shadow-lg flex items-center justify-between gap-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${lastRoll.isCrit ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60' : lastRoll.isFumble ? 'bg-red-950/60 text-red-400 border border-red-800/60' : 'bg-zinc-800 text-zinc-300'}`}>
                  <Dices className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase">{lastRoll.title}</h4>
                  <p className="text-sm font-mono font-bold text-cyan-300">
                    Resultado Final: <span className="text-lg text-white">{lastRoll.total}</span>
                    {lastRoll.extraMessage && <span className="text-xs text-amber-400 ml-2 font-normal font-sans">({lastRoll.extraMessage})</span>}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setLastRoll(null)}
                className="text-xs text-zinc-500 hover:text-zinc-300 font-mono"
              >
                Dispensar
              </button>
            </div>
          )}

          {/* Character Header Banner */}
          <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-700/80 shadow-md flex items-center justify-center">
                  {char.imageUrl ? (
                    <img src={char.imageUrl} alt={char.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300" />
                  ) : (
                    <div className="text-zinc-600 flex flex-col items-center">
                      <User className="w-8 h-8 text-cyan-400/80" />
                      <span className="text-[9px] font-mono text-zinc-500 mt-0.5">Sem Foto</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setImageModalConfig({
                    isOpen: true,
                    title: `Retrato de ${char.name}`,
                    currentUrl: char.imageUrl,
                    category: 'personagem',
                    onSave: url => {
                      savePlayerCharacter({ ...char, imageUrl: url });
                    },
                  })}
                  className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-cyan-500/40 shadow transition hover:scale-110"
                  title="Alterar Retrato / Avatar do Personagem"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800/40 font-bold uppercase">
                    {char.role}
                  </span>
                <span className="text-xs font-mono text-zinc-400">
                  {char.system} // {char.lifepath?.culturalOrigin || 'Night City'}
                </span>
                {activeArmorPenalty > 0 && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/50 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Armadura: -{activeArmorPenalty} REF/DEX/MOVE
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-zinc-100">{char.name}</h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-cyan-400">
                <span>Alcunha: "{char.handle}"</span>
                <span>&bull;</span>
                <span className="text-amber-400 flex items-center gap-1 font-semibold">
                  <DollarSign className="w-3.5 h-3.5" /> {char.cashEb ?? 0} eb
                </span>
                <span>&bull;</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <Award className="w-3.5 h-3.5" /> {char.improvementPoints ?? 0} IP
                </span>
                <span>&bull;</span>
                <span className="text-purple-400 flex items-center gap-1 font-bold">
                  <Sparkles className="w-3.5 h-3.5" /> Rep {char.reputation ?? 0}
                </span>
              </div>
            </div>
          </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setCodexInitialCategory('all');
                  setShowCodexSearchModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs flex items-center gap-1.5 transition shadow-sm font-bold"
                title="Pesquisar e equipar armas, ciberware, armaduras e equipamentos do Códice Oficial"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Buscar no Códice</span>
              </button>

              <button
                onClick={() => exportCharacterSheetToPrintPDF(char)}
                className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono text-xs flex items-center gap-1.5 transition"
                title="Exportar ou Imprimir Ficha Completa em PDF Oficial (Vetor)"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Baixar Ficha em PDF</span>
              </button>

              <button
                onClick={handleSendPlayerToCombat}
                className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono text-xs flex items-center gap-1.5 transition shadow-sm font-semibold"
                title="Enviar este personagem com armas e atributos para o Rastreador de Combate"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Enviar para Rastreador de Combate</span>
              </button>
              <button
                onClick={rollDeathSave}
                className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 font-mono text-xs flex items-center gap-1.5 transition"
                title="Rolar Salvaguarda contra a Morte"
              >
                <Skull className="w-3.5 h-3.5 text-red-400" />
                <span>Salvação da Morte (BODY {char.statsRED.BODY})</span>
              </button>
            </div>
          </div>

          {/* Sheet Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 border-b border-[#27272a] pb-2 text-xs font-medium">
            <button
              onClick={() => setActiveSheetTab('stats')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shrink-0 ${
                activeSheetTab === 'stats'
                  ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Combate & Atributos
            </button>
            <button
              onClick={() => setActiveSheetTab('inventory')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shrink-0 ${
                activeSheetTab === 'inventory'
                  ? 'bg-zinc-800 text-amber-400 font-bold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Backpack className="w-3.5 h-3.5 text-amber-400" />
              <span>Inventário & Arsenal ({char.weapons.length + (char.gear?.length || 0)})</span>
            </button>
            <button
              onClick={() => setActiveSheetTab('skills')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shrink-0 ${
                activeSheetTab === 'skills'
                  ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Perícias ({Object.keys(char.skills).length})
            </button>
            <button
              onClick={() => setActiveSheetTab('cyber')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shrink-0 ${
                activeSheetTab === 'cyber'
                  ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Ciberware ({char.cyberware.length})
            </button>
            <button
              onClick={() => setActiveSheetTab('lifepath')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 shrink-0 ${
                activeSheetTab === 'lifepath'
                  ? 'bg-zinc-800 text-zinc-100 font-bold border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Lifepath
            </button>
          </div>

          {/* ======================================================== */}
          {/* TAB 1: COMBAT, VITALS & STATS                            */}
          {/* ======================================================== */}
          {activeSheetTab === 'stats' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (5 cols): Vitals, Armor, Stats */}
              <div className="lg:col-span-5 space-y-5">
                {/* HP Card */}
                <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-red-500" /> Pontos de Vida (HP)
                    </span>
                    <span className="text-sm font-mono font-bold text-zinc-100">
                      {char.currentHP} / {char.maxHP}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isMortallyWounded
                          ? 'bg-red-700'
                          : isSeriouslyWounded
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(char.currentHP / char.maxHP) * 100}%` }}
                    />
                  </div>

                  {/* HP Adjust Controls */}
                  <div className="flex items-center gap-2 pt-1 font-mono text-xs">
                    <button
                      onClick={() => updateHP(-5)}
                      className="flex-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-red-400 font-bold"
                    >
                      -5 HP
                    </button>
                    <button
                      onClick={() => updateHP(-1)}
                      className="flex-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-red-400 font-bold"
                    >
                      -1 HP
                    </button>
                    <button
                      onClick={() => updateHP(1)}
                      className="flex-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-bold"
                    >
                      +1 HP
                    </button>
                    <button
                      onClick={() => updateHP(5)}
                      className="flex-1 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-bold"
                    >
                      +5 HP
                    </button>
                  </div>
                </div>

                {/* Armor SP Card with Instant Repair & Swap */}
                <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-amber-500" /> Blindagem Corporal (SP) & Ablação
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRepairArmor('both')}
                        className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-[10px] font-mono flex items-center gap-1"
                        title="Restaurar Cabeça e Tronco para o SP Máximo"
                      >
                        <RefreshCw className="w-3 h-3" /> Reparar Tudo
                      </button>
                      <button
                        onClick={() => setShowArmorModal(true)}
                        className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-cyan-400 text-[10px] font-mono flex items-center gap-1"
                      >
                        <Shield className="w-3 h-3" /> Trocar Armadura
                      </button>
                    </div>
                  </div>

                  {activeArmorPenalty > 0 && (
                    <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] font-mono text-amber-300 flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      <span>Penalidade de Armadura: -{activeArmorPenalty} em REF, DEX e MOVE!</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400 text-[11px] truncate max-w-[120px]" title={char.armor?.head?.name || 'Cabeça'}>
                          {char.armor?.head?.name || 'Cabeça'}:
                        </span>
                        <strong className="text-sm text-zinc-100">
                          {char.armor?.head?.sp ?? char.headSP} / {char.armor?.head?.maxSP ?? 11} SP
                        </strong>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => ablateSP('head', -1)}
                          className="flex-1 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-red-400 text-[11px]"
                        >
                          Ablação (-1)
                        </button>
                        <button
                          onClick={() => handleRepairArmor('head')}
                          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px]"
                          title="Restaurar SP da Cabeça"
                        >
                          Reparar
                        </button>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-400 text-[11px] truncate max-w-[120px]" title={char.armor?.body?.name || 'Tronco'}>
                          {char.armor?.body?.name || 'Tronco'}:
                        </span>
                        <strong className="text-sm text-zinc-100">
                          {char.armor?.body?.sp ?? char.bodySP} / {char.armor?.body?.maxSP ?? 11} SP
                        </strong>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => ablateSP('body', -1)}
                          className="flex-1 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-red-400 text-[11px]"
                        >
                          Ablação (-1)
                        </button>
                        <button
                          onClick={() => handleRepairArmor('body')}
                          className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px]"
                          title="Restaurar SP do Tronco"
                        >
                          Reparar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 10 Stats with Armor Penalty Reflection */}
                <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-zinc-400 font-semibold block">
                      Atributos Oficiais (Clique para Rolar 1d10 + Stat)
                    </span>
                    {activeArmorPenalty > 0 && (
                      <span className="text-[10px] font-mono text-amber-400">
                        REF/DEX/MOVE penalizados (-{activeArmorPenalty})
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-5 gap-1.5 sm:gap-2 text-center font-mono">
                    {Object.entries(char.statsRED).map(([stat, val]) => {
                      const isPenalized = activeArmorPenalty > 0 && (stat === 'REF' || stat === 'DEX' || stat === 'MOVE');
                      const effectiveVal = isPenalized ? Math.max(1, val - activeArmorPenalty) : val;

                      return (
                        <button
                          key={stat}
                          onClick={() => performD10Roll(`Teste de Atributo: ${stat}`, effectiveVal)}
                          className={`p-1.5 sm:p-2.5 rounded-xl border transition group text-center ${
                            isPenalized
                              ? 'bg-amber-950/20 border-amber-800/40 hover:border-amber-500'
                              : 'bg-[#0a0a0d] hover:bg-zinc-800 border-zinc-800 hover:border-red-500/60'
                          }`}
                          title={`Rolar 1d10 + ${stat} (${effectiveVal}${isPenalized ? ` [Base ${val} - ${activeArmorPenalty} Armadura]` : ''})`}
                        >
                          <span className={`text-[10px] uppercase block ${isPenalized ? 'text-amber-400 font-bold' : 'text-zinc-500 group-hover:text-red-400'}`}>
                            {stat}
                          </span>
                          <strong className="text-sm text-zinc-100 group-hover:text-white">
                            {effectiveVal}
                          </strong>
                          {isPenalized && (
                            <span className="text-[9px] text-zinc-500 block">({val})</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column (7 cols): Weapons Arsenal & Attack Roller */}
              <div className="lg:col-span-7 space-y-5">
                <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                    <span className="text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
                      <Crosshair className="w-4 h-4 text-red-500" /> Armas Equipadas ({char.weapons.length})
                    </span>
                    <button
                      onClick={() => {
                        setCodexInitialCategory('weapons');
                        setShowCodexSearchModal(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono flex items-center gap-1 border border-zinc-700"
                    >
                      <Plus className="w-3.5 h-3.5 text-cyan-400" /> Buscar Arma / Acessório no Códice
                    </button>
                  </div>

                  <div className="space-y-3">
                    {char.weapons.map((w, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg bg-red-950/40 border border-red-900/40 text-red-400 shrink-0">
                              {getWeaponIcon(w.name, "w-4 h-4 text-red-400")}
                            </div>
                            <div>
                              <strong className="text-zinc-100 text-sm">{w.name}</strong>
                              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 mt-0.5">
                                <span>Munição: {w.ammoType}</span>
                                <span>&bull;</span>
                                <span>CdT: {w.rof}</span>
                                <span>&bull;</span>
                                <span>Pente: <strong className="text-zinc-200">{w.magCurrent}/{w.magCapacity}</strong></span>
                              </div>
                            </div>
                          </div>
                          <span className="font-mono text-red-400 font-bold text-base">{w.damage}</span>
                        </div>

                        {w.notes && (
                          <p className="text-[11px] text-zinc-500 italic">{w.notes}</p>
                        )}

                        {/* Interactive Combat Actions Bar */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-zinc-800">
                          <button
                            onClick={() => handleOpenAttackModal(w)}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono text-[11px] font-bold flex items-center gap-1 transition shadow"
                          >
                            <Crosshair className="w-3.5 h-3.5" />
                            <span>Rolar Ataque vs DV</span>
                          </button>

                          <button
                            onClick={() => rollWeaponDamage(w.name, w.damage)}
                            className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 text-red-300 font-mono text-[11px] flex items-center gap-1 transition font-bold"
                          >
                            <Flame className="w-3.5 h-3.5 text-amber-500" />
                            <span>Dano ({w.damage})</span>
                          </button>

                          <button
                            onClick={() => shootWeapon(idx)}
                            disabled={w.magCurrent <= 0}
                            className="px-2.5 py-1.5 rounded-lg bg-[#14141a] hover:bg-zinc-800 text-zinc-300 font-mono text-[11px] border border-zinc-800 disabled:opacity-40"
                          >
                            Disparar (-1)
                          </button>

                          <button
                            onClick={() => reloadWeapon(idx)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#14141a] hover:bg-zinc-800 text-zinc-300 font-mono text-[11px] border border-zinc-800"
                          >
                            Recarregar
                          </button>

                          <button
                            onClick={() => handleRemoveWeapon(idx)}
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 transition ml-auto"
                            title="Remover Arma"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: INVENTORY, ARMOR & ARSENAL MANAGEMENT             */}
          {/* ======================================================== */}
          {activeSheetTab === 'inventory' && (
            <div className="space-y-6">
              {/* Top Banner: Eurodollar Wallet (eb) */}
              <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] flex flex-col md:flex-row md:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-700/50 text-amber-400">
                    <DollarSign className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold">Carteira Criptográfica Oficial</span>
                    <h2 className="text-2xl font-bold font-mono text-zinc-100 flex items-center gap-2">
                      <span>{char.cashEb ?? 0}</span>
                      <span className="text-sm text-amber-400 font-sans font-medium">Eurodollars (eb / Eddies)</span>
                    </h2>
                  </div>
                </div>

                {/* Cash Quick Adjustment Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                  <button
                    onClick={() => handleAdjustCash(-100)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-red-400 border border-zinc-700 font-bold"
                  >
                    -100 eb
                  </button>
                  <button
                    onClick={() => handleAdjustCash(-50)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-red-400 border border-zinc-700 font-bold"
                  >
                    -50 eb
                  </button>
                  <button
                    onClick={() => handleAdjustCash(100)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 font-bold"
                  >
                    +100 eb
                  </button>
                  <button
                    onClick={() => handleAdjustCash(500)}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 font-bold"
                  >
                    +500 eb
                  </button>
                  <button
                    onClick={() => handleAdjustCash(1000)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-bold"
                  >
                    +1000 eb (Gig)
                  </button>
                </div>
              </div>

              {/* Section 1: Armor Management Cards */}
              <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Gerenciamento de Blindagens & Coletes (Armor Management)</span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Troque suas peças de armadura, consulte valores de SP e restaure a blindagem com reparos.
                    </p>
                  </div>
                  <button
                    onClick={() => handleRepairArmor('both')}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reparar Toda a Armadura</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Head Armor Card */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">Armadura de Cabeça (Head)</span>
                        <h4 className="text-sm font-bold text-zinc-200 mt-0.5">{char.armor?.head?.name || 'Nenhum'}</h4>
                      </div>
                      <span className="text-lg font-mono font-bold text-cyan-400">
                        {char.armor?.head?.sp ?? char.headSP} / {char.armor?.head?.maxSP ?? 11} SP
                      </span>
                    </div>

                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-500 transition-all"
                        style={{ width: `${((char.armor?.head?.sp ?? char.headSP) / (char.armor?.head?.maxSP || 11)) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleRepairArmor('head')}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono"
                      >
                        Reparar SP Máx
                      </button>
                      <button
                        onClick={() => setShowArmorModal(true)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-mono"
                      >
                        Trocar Peça
                      </button>
                    </div>
                  </div>

                  {/* Body Armor Card */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase block">Armadura de Tronco (Body)</span>
                        <h4 className="text-sm font-bold text-zinc-200 mt-0.5">{char.armor?.body?.name || 'Nenhum'}</h4>
                        {activeArmorPenalty > 0 && (
                          <span className="text-[10px] font-mono text-amber-400 font-bold block mt-0.5">
                            ⚠️ Penalidade Ativa: -{activeArmorPenalty} REF/DEX/MOVE
                          </span>
                        )}
                      </div>
                      <span className="text-lg font-mono font-bold text-amber-400">
                        {char.armor?.body?.sp ?? char.bodySP} / {char.armor?.body?.maxSP ?? 11} SP
                      </span>
                    </div>

                    <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all"
                        style={{ width: `${((char.armor?.body?.sp ?? char.bodySP) / (char.armor?.body?.maxSP || 11)) * 100}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => handleRepairArmor('body')}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono"
                      >
                        Reparar SP Máx
                      </button>
                      <button
                        onClick={() => setShowArmorModal(true)}
                        className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-800 text-amber-300 text-xs font-mono"
                      >
                        Trocar Peça
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Backpack & Field Gear */}
              <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                      <Backpack className="w-4 h-4 text-cyan-400" />
                      <span>Mochila de Equipamentos de Campo & Suprimentos ({char.gear?.length || 0} Itens)</span>
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Ferramentas, kits de primeiros socorros, lockpicks eletrônicos e suprimentos de missão.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setCodexInitialCategory('gear');
                      setShowCodexSearchModal(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-cyan-300 font-mono text-xs flex items-center gap-1.5 border border-zinc-700 transition shrink-0"
                  >
                    <Search className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Buscar no Códice</span>
                  </button>
                </div>

                {/* Add Custom Item Form */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGearInput}
                    onChange={e => setNewGearInput(e.target.value)}
                    placeholder="Adicionar novo item à mochila (ex: 2x Granadas Flashbang, Cabo de Aço 10m...)"
                    className="flex-1 bg-[#0a0a0d] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <button
                    onClick={() => {
                      if (newGearInput.trim()) {
                        handleAddGearItem(newGearInput.trim());
                        setNewGearInput('');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center gap-1 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar
                  </button>
                </div>

                {/* Quick Add Catalog Buttons */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block font-semibold">
                    + Adição Rápida do Catálogo Oficial de Itens:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Agente Pessoal Holográfico com IA',
                      'Kit de Primeiros Socorros Rápido',
                      'Kit de Arrombamento Eletrônico / Lockpick Digital',
                      'Rádio Criptografado de Equipe',
                      'Binóculos com Visão Térmica',
                      'Lanterna Tática UV',
                      'Mochila Tática Reforçada',
                      'Algemas de Zíper Reforçadas (x5)',
                      '50 munições Pesadas de Pistola',
                      '50 munições de Fuzil (5.56mm)',
                      '30 cartuchos de Espingarda (Cal. 12)',
                      '2x Granadas de Fumaça Espessa',
                      '2x Granadas Flashbang',
                    ].map(item => (
                      <button
                        key={item}
                        onClick={() => handleAddGearItem(item)}
                        className="px-2.5 py-1 rounded-lg bg-[#0a0a0d] hover:bg-zinc-800 border border-zinc-800 text-[11px] text-zinc-400 hover:text-zinc-200 transition font-mono flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3 text-cyan-400" /> {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Item List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
                  {(char.gear || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 flex items-center justify-between text-xs text-zinc-300"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <Package className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveGearItem(idx)}
                        className="p-1 rounded text-zinc-500 hover:text-red-400 transition"
                        title="Remover Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: SKILLS                                            */}
          {/* ======================================================== */}
          {activeSheetTab === 'skills' && (
            <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
              {/* Barra de Pontos de Investimento (IP) & Progressão */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 via-zinc-900 to-zinc-900 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Pontos de Investimento (IP)</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">Progresso</span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                      Gaste IP para evoluir perícias (Novo Nível x 10) ou sua Habilidade de Papel (Novo Nível x 60).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <div className="text-right mr-1">
                    <span className="text-xl font-bold text-emerald-400">{char.improvementPoints ?? 0}</span>
                    <span className="text-[10px] text-zinc-500 block">IP Disponível</span>
                  </div>
                  <button
                    onClick={() => {
                      const newIP = Math.max(0, (char.improvementPoints ?? 0) - 10);
                      savePlayerCharacter({ ...char, improvementPoints: newIP });
                    }}
                    className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-red-400 text-xs font-bold"
                    title="Gastar -10 IP"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => {
                      const newIP = (char.improvementPoints ?? 0) + 10;
                      savePlayerCharacter({ ...char, improvementPoints: newIP });
                    }}
                    className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-xs font-bold"
                    title="Adicionar +10 IP"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => {
                      const newIP = (char.improvementPoints ?? 0) + 50;
                      savePlayerCharacter({ ...char, improvementPoints: newIP });
                    }}
                    className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-xs font-bold"
                    title="Adicionar +50 IP"
                  >
                    +50
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                <span className="text-xs font-mono uppercase text-zinc-400 font-semibold">
                  Perícias do Personagem (Clique para Rolar 1d10 + Stat + Nível)
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  Total de Perícias Ativas: {Object.keys(char.skills).length}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(char.skills).map(([skillName, level]) => (
                  <button
                    key={skillName}
                    onClick={() => {
                      const statBonus = effectiveREF;
                      const base = level + statBonus;
                      performD10Roll(`Perícia: ${skillName} (Nível ${level} + Base ${statBonus} = ${base})`, base);
                    }}
                    className="p-3 rounded-xl bg-[#0a0a0d] hover:bg-zinc-800/80 border border-zinc-800/80 hover:border-cyan-500/50 flex items-center justify-between text-xs transition text-left group"
                  >
                    <div>
                      <strong className="text-zinc-200 group-hover:text-white block">{skillName}</strong>
                      <span className="text-[10px] font-mono text-zinc-500">Base sugerida: REF/DEX/INT</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-sm font-bold text-cyan-400 group-hover:text-cyan-300">+{level}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: CYBERWARE & IMPLANTS                              */}
          {/* ======================================================== */}
          {activeSheetTab === 'cyber' && (
            <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
              <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                <h3 className="text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" /> Ciberware Instalado ({char.cyberware.length})
                </h3>
                <button
                  onClick={() => {
                    setCodexInitialCategory('cyberware');
                    setShowCodexSearchModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-purple-300 text-xs font-mono flex items-center gap-1.5 border border-zinc-700 transition"
                >
                  <Plus className="w-3.5 h-3.5 text-purple-400" /> Buscar Implante no Códice
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {char.cyberware.map((c, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-900/40 text-cyan-400 shrink-0">
                          {getCyberwareIcon(c.type || c.name, "w-4 h-4 text-cyan-400")}
                        </div>
                        <strong className="text-zinc-100 text-sm">{c.name}</strong>
                      </div>
                      <span className="text-[10px] font-mono text-purple-400 px-2 py-0.5 bg-zinc-900 rounded border border-purple-900/40">
                        {c.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">{c.description}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-zinc-800 text-[10px] font-mono">
                      <span className="text-red-400">Perda de Humanidade: {c.humanityCost}</span>
                      <button
                        onClick={() => {
                          const updated = [...char.cyberware];
                          updated.splice(idx, 1);
                          savePlayerCharacter({ ...char, cyberware: updated });
                        }}
                        className="text-zinc-500 hover:text-red-400"
                      >
                        Desinstalar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: LIFEPATH (INTERATIVO, ESCOLHÍVEL & EDITÁVEL)       */}
          {/* ======================================================== */}
          {activeSheetTab === 'lifepath' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Lifepath Toolbar Banner */}
              <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-rose-950/60 border border-rose-800/50 text-rose-400">
                      <BookOpen className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                        <span>Caminho de Vida & Narrativa (Lifepath)</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800/40">
                          Cyberpunk RED Oficial
                        </span>
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Escolha opções oficiais das tabelas d10 com um clique, role dados individualmente ou digite livremente sua história.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={handleRollAllLifepath}
                    className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-rose-300 border border-zinc-700 text-xs font-mono font-bold transition flex items-center justify-center gap-2 shadow-sm"
                    title="Rolar aleatoriamente em todas as 14 tabelas oficiais"
                  >
                    <Dices className="w-4 h-4 text-rose-400" />
                    <span>Sortear Tudo (14 d10)</span>
                  </button>

                  <button
                    onClick={handleGenerateBio}
                    disabled={isGeneratingBio}
                    className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                    title="Gera uma biografia rica em primeira pessoa com a IA e adiciona às Anotações"
                  >
                    {isGeneratingBio ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                    <span>{isGeneratingBio ? 'Criando História...' : 'Gerar Crônica IA'}</span>
                  </button>
                </div>
              </div>

              {/* Feedback Toast */}
              {bioToast && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-md animate-in fade-in duration-150">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{bioToast}</span>
                </div>
              )}

              {/* ======================================================== */}
              {/* SEÇÃO 1: ORIGEM, ESTILO & ATITUDE                        */}
              {/* ======================================================== */}
              <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>1. Origem, Estilo & Atitude Visual (Style & Heritage)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-500">Tabelas 1 a 4</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Field 1: Cultural Origin */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-rose-400" />
                        <span>Origem Cultural & Idioma</span>
                      </span>
                      <button
                        onClick={() => handleRollSingleField('culturalOrigin', 'culturalOrigins')}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-rose-400 border border-zinc-800 transition"
                        title="Rolar 1d10 na tabela de Origem Cultural"
                      >
                        <Dices className="w-3 h-3" />
                        <span>1d10</span>
                      </button>
                    </div>

                    <select
                      value={LIFEPATH_TABLES.culturalOrigins.includes(char.lifepath?.culturalOrigin || '') ? char.lifepath.culturalOrigin : ''}
                      onChange={e => {
                        if (e.target.value) handleUpdateLifepathField('culturalOrigin', e.target.value);
                      }}
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
                    >
                      <option value="">-- Escolher da Tabela Oficial (10 Regiões) --</option>
                      {LIFEPATH_TABLES.culturalOrigins.map((opt, i) => (
                        <option key={i} value={opt}>{i + 1}. {opt}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={char.lifepath?.culturalOrigin || ''}
                      onChange={e => handleUpdateLifepathField('culturalOrigin', e.target.value)}
                      placeholder="Personalize a origem cultural e idioma nativo..."
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-rose-500 font-sans"
                    />
                  </div>

                  {/* Field 2: Clothing Style */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                        <Shirt className="w-3.5 h-3.5 text-rose-400" />
                        <span>Estilo de Roupa & Visual</span>
                      </span>
                      <button
                        onClick={() => handleRollSingleField('clothingStyle', 'clothingStyles')}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-rose-400 border border-zinc-800 transition"
                        title="Rolar 1d10 na tabela de Estilo de Roupa"
                      >
                        <Dices className="w-3 h-3" />
                        <span>1d10</span>
                      </button>
                    </div>

                    <select
                      value={LIFEPATH_TABLES.clothingStyles.includes(char.lifepath?.clothingStyle || '') ? char.lifepath.clothingStyle : ''}
                      onChange={e => {
                        if (e.target.value) handleUpdateLifepathField('clothingStyle', e.target.value);
                      }}
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
                    >
                      <option value="">-- Escolher da Tabela Oficial (10 Estilos) --</option>
                      {LIFEPATH_TABLES.clothingStyles.map((opt, i) => (
                        <option key={i} value={opt}>{i + 1}. {opt}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={char.lifepath?.clothingStyle || ''}
                      onChange={e => handleUpdateLifepathField('clothingStyle', e.target.value)}
                      placeholder="Personalize seu estilo de vestimenta..."
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-rose-500 font-sans"
                    />
                  </div>

                  {/* Field 3: Hairstyle */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 text-rose-400" />
                        <span>Penteado & Cabelo</span>
                      </span>
                      <button
                        onClick={() => handleRollSingleField('hairstyle', 'hairstyles')}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-rose-400 border border-zinc-800 transition"
                        title="Rolar 1d10 na tabela de Penteado"
                      >
                        <Dices className="w-3 h-3" />
                        <span>1d10</span>
                      </button>
                    </div>

                    <select
                      value={LIFEPATH_TABLES.hairstyles.includes(char.lifepath?.hairstyle || '') ? char.lifepath.hairstyle : ''}
                      onChange={e => {
                        if (e.target.value) handleUpdateLifepathField('hairstyle', e.target.value);
                      }}
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
                    >
                      <option value="">-- Escolher da Tabela Oficial (10 Cortes) --</option>
                      {LIFEPATH_TABLES.hairstyles.map((opt, i) => (
                        <option key={i} value={opt}>{i + 1}. {opt}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={char.lifepath?.hairstyle || ''}
                      onChange={e => handleUpdateLifepathField('hairstyle', e.target.value)}
                      placeholder="Personalize seu corte ou cabelo neon..."
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-rose-500 font-sans"
                    />
                  </div>

                  {/* Field 4: Personality */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                        <Smile className="w-3.5 h-3.5 text-rose-400" />
                        <span>Personalidade & Postura</span>
                      </span>
                      <button
                        onClick={() => handleRollSingleField('personality', 'personalities')}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-rose-400 border border-zinc-800 transition"
                        title="Rolar 1d10 na tabela de Personalidade"
                      >
                        <Dices className="w-3 h-3" />
                        <span>1d10</span>
                      </button>
                    </div>

                    <select
                      value={LIFEPATH_TABLES.personalities.includes(char.lifepath?.personality || '') ? char.lifepath.personality : ''}
                      onChange={e => {
                        if (e.target.value) handleUpdateLifepathField('personality', e.target.value);
                      }}
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
                    >
                      <option value="">-- Escolher da Tabela Oficial (10 Traços) --</option>
                      {LIFEPATH_TABLES.personalities.map((opt, i) => (
                        <option key={i} value={opt}>{i + 1}. {opt}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={char.lifepath?.personality || ''}
                      onChange={e => handleUpdateLifepathField('personality', e.target.value)}
                      placeholder="Personalize a atitude e temperamento..."
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-rose-500 font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* SEÇÃO 2: CÓDIGO MORAL & VÍNCULOS                         */}
              {/* ======================================================== */}
              <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>2. Código Moral, Vínculos & Valores (Core Values & People)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-500">Tabelas 5 a 8</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Field 5: Value Most */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-amber-400" />
                        <span>O Que Mais Valoriza?</span>
                      </span>
                      <button
                        onClick={() => handleRollSingleField('valueMost', 'valueMost')}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-amber-400 border border-zinc-800 transition"
                        title="Rolar 1d10 na tabela de Valores"
                      >
                        <Dices className="w-3 h-3" />
                        <span>1d10</span>
                      </button>
                    </div>

                    <select
                      value={LIFEPATH_TABLES.valueMost.includes(char.lifepath?.valueMost || '') ? char.lifepath.valueMost : ''}
                      onChange={e => {
                        if (e.target.value) handleUpdateLifepathField('valueMost', e.target.value);
                      }}
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="">-- Escolher da Tabela Oficial (10 Valores) --</option>
                      {LIFEPATH_TABLES.valueMost.map((opt, i) => (
                        <option key={i} value={opt}>{i + 1}. {opt}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={char.lifepath?.valueMost || ''}
                      onChange={e => handleUpdateLifepathField('valueMost', e.target.value)}
                      placeholder="O que move seu personagem..."
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  {/* Field 6: Feelings About People */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        <span>Sentimento Sobre as Pessoas</span>
                      </span>
                      <button
                        onClick={() => handleRollSingleField('feelingsAboutPeople', 'feelingsAboutPeople')}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-amber-400 border border-zinc-800 transition"
                        title="Rolar 1d10 na tabela de Sentimentos"
                      >
                        <Dices className="w-3 h-3" />
                        <span>1d10</span>
                      </button>
                    </div>

                    <select
                      value={LIFEPATH_TABLES.feelingsAboutPeople.includes(char.lifepath?.feelingsAboutPeople || '') ? char.lifepath.feelingsAboutPeople : ''}
                      onChange={e => {
                        if (e.target.value) handleUpdateLifepathField('feelingsAboutPeople', e.target.value);
                      }}
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="">-- Escolher da Tabela Oficial (10 Posturas) --</option>
                      {LIFEPATH_TABLES.feelingsAboutPeople.map((opt, i) => (
                        <option key={i} value={opt}>{i + 1}. {opt}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={char.lifepath?.feelingsAboutPeople || ''}
                      onChange={e => handleUpdateLifepathField('feelingsAboutPeople', e.target.value)}
                      placeholder="Como você enxerga a humanidade ao redor..."
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  {/* Field 7: Valued Person */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-amber-400" />
                        <span>Pessoa Mais Valorizada</span>
                      </span>
                      <button
                        onClick={() => handleRollSingleField('valuedPerson', 'valuedPersons')}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-amber-400 border border-zinc-800 transition"
                        title="Rolar 1d10 na tabela de Pessoa Valorizada"
                      >
                        <Dices className="w-3 h-3" />
                        <span>1d10</span>
                      </button>
                    </div>

                    <select
                      value={LIFEPATH_TABLES.valuedPersons.includes(char.lifepath?.valuedPerson || '') ? char.lifepath.valuedPerson : ''}
                      onChange={e => {
                        if (e.target.value) handleUpdateLifepathField('valuedPerson', e.target.value);
                      }}
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="">-- Escolher da Tabela Oficial (10 Figuras) --</option>
                      {LIFEPATH_TABLES.valuedPersons.map((opt, i) => (
                        <option key={i} value={opt}>{i + 1}. {opt}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={char.lifepath?.valuedPerson || ''}
                      onChange={e => handleUpdateLifepathField('valuedPerson', e.target.value)}
                      placeholder="Nome ou papel da pessoa que mais importa..."
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>

                  {/* Field 8: Valued Possession */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-amber-400" />
                        <span>Posse Mais Estimada (Relíquia)</span>
                      </span>
                      <button
                        onClick={() => handleRollSingleField('valuedPossession', 'valuedPossessions')}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-amber-400 border border-zinc-800 transition"
                        title="Rolar 1d10 na tabela de Posse Estimada"
                      >
                        <Dices className="w-3 h-3" />
                        <span>1d10</span>
                      </button>
                    </div>

                    <select
                      value={LIFEPATH_TABLES.valuedPossessions.includes(char.lifepath?.valuedPossession || '') ? char.lifepath.valuedPossession : ''}
                      onChange={e => {
                        if (e.target.value) handleUpdateLifepathField('valuedPossession', e.target.value);
                      }}
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="">-- Escolher da Tabela Oficial (10 Itens) --</option>
                      {LIFEPATH_TABLES.valuedPossessions.map((opt, i) => (
                        <option key={i} value={opt}>{i + 1}. {opt}</option>
                      ))}
                    </select>

                    <input
                      type="text"
                      value={char.lifepath?.valuedPossession || ''}
                      onChange={e => handleUpdateLifepathField('valuedPossession', e.target.value)}
                      placeholder="O item físico que você jamais venderia..."
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-sans"
                    />
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* SEÇÃO 3: ORIGEM FAMILIAR & INFÂNCIA                      */}
              {/* ======================================================== */}
              <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>3. Origem Familiar, Infância & Crises (Family & Upbringing)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-500">Tabelas 9 a 11</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Field 9: Family Background */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-purple-400" />
                        <span>Origem Familiar</span>
                      </span>
                      <button
                        onClick={() => handleRollSingleField('familyBackground', 'familyBackgrounds')}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-purple-400 border border-zinc-800 transition"
                        title="Rolar 1d10 na tabela de Origem Familiar"
                      >
                        <Dices className="w-3 h-3" />
                        <span>1d10</span>
                      </button>
                    </div>

                    <select
                      value={LIFEPATH_TABLES.familyBackgrounds.includes(char.lifepath?.familyBackground || '') ? char.lifepath.familyBackground : ''}
                      onChange={e => {
                        if (e.target.value) handleUpdateLifepathField('familyBackground', e.target.value);
                      }}
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                    >
                      <option value="">-- Escolher da Tabela Oficial --</option>
                      {LIFEPATH_TABLES.familyBackgrounds.map((opt, i) => (
                        <option key={i} value={opt}>{i + 1}. {opt}</option>
                      ))}
                    </select>

                    <textarea
                      rows={2}
                      value={char.lifepath?.familyBackground || ''}
                      onChange={e => handleUpdateLifepathField('familyBackground', e.target.value)}
                      placeholder="De onde veio sua família..."
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-purple-500 font-sans leading-relaxed"
                    />
                  </div>

                  {/* Field 10: Childhood Environment */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-400" />
                        <span>Ambiente de Infância</span>
                      </span>
                      <button
                        onClick={() => handleRollSingleField('childhoodEnvironment', 'childhoodEnvironments')}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-purple-400 border border-zinc-800 transition"
                        title="Rolar 1d10 na tabela de Ambiente"
                      >
                        <Dices className="w-3 h-3" />
                        <span>1d10</span>
                      </button>
                    </div>

                    <select
                      value={LIFEPATH_TABLES.childhoodEnvironments.includes(char.lifepath?.childhoodEnvironment || '') ? char.lifepath.childhoodEnvironment : ''}
                      onChange={e => {
                        if (e.target.value) handleUpdateLifepathField('childhoodEnvironment', e.target.value);
                      }}
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                    >
                      <option value="">-- Escolher da Tabela Oficial --</option>
                      {LIFEPATH_TABLES.childhoodEnvironments.map((opt, i) => (
                        <option key={i} value={opt}>{i + 1}. {opt}</option>
                      ))}
                    </select>

                    <textarea
                      rows={2}
                      value={char.lifepath?.childhoodEnvironment || ''}
                      onChange={e => handleUpdateLifepathField('childhoodEnvironment', e.target.value)}
                      placeholder="Onde você cresceu e aprendeu a sobreviver..."
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-purple-500 font-sans leading-relaxed"
                    />
                  </div>

                  {/* Field 11: Family Crisis */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-purple-400" />
                        <span>Crise & Tragédia Familiar</span>
                      </span>
                      <button
                        onClick={() => handleRollSingleField('familyCrisis', 'familyCrises')}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-purple-400 border border-zinc-800 transition"
                        title="Rolar 1d10 na tabela de Crise Familiar"
                      >
                        <Dices className="w-3 h-3" />
                        <span>1d10</span>
                      </button>
                    </div>

                    <select
                      value={LIFEPATH_TABLES.familyCrises.includes(char.lifepath?.familyCrisis || '') ? char.lifepath.familyCrisis : ''}
                      onChange={e => {
                        if (e.target.value) handleUpdateLifepathField('familyCrisis', e.target.value);
                      }}
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
                    >
                      <option value="">-- Escolher da Tabela Oficial --</option>
                      {LIFEPATH_TABLES.familyCrises.map((opt, i) => (
                        <option key={i} value={opt}>{i + 1}. {opt}</option>
                      ))}
                    </select>

                    <textarea
                      rows={2}
                      value={char.lifepath?.familyCrisis || ''}
                      onChange={e => handleUpdateLifepathField('familyCrisis', e.target.value)}
                      placeholder="O trauma que separou ou abalou sua família..."
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-purple-500 font-sans leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* SEÇÃO 4: DESTINO SUPREMO, AMORES & NÊMESIS              */}
              {/* ======================================================== */}
              <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span>4. Destino Supremo, Amores & Conflitos (Life Goals & Enemies)</span>
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-500">Tabelas 12 a 14</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Field 12: Life Goals */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Objetivo de Vida Supremo</span>
                      </span>
                      <button
                        onClick={() => handleRollSingleField('lifeGoals', 'lifeGoals')}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-cyan-400 border border-zinc-800 transition"
                        title="Rolar 1d10 na tabela de Objetivos de Vida"
                      >
                        <Dices className="w-3 h-3" />
                        <span>1d10</span>
                      </button>
                    </div>

                    <select
                      value={LIFEPATH_TABLES.lifeGoals.includes(char.lifepath?.lifeGoals || '') ? char.lifepath.lifeGoals : ''}
                      onChange={e => {
                        if (e.target.value) handleUpdateLifepathField('lifeGoals', e.target.value);
                      }}
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="">-- Escolher da Tabela Oficial --</option>
                      {LIFEPATH_TABLES.lifeGoals.map((opt, i) => (
                        <option key={i} value={opt}>{i + 1}. {opt}</option>
                      ))}
                    </select>

                    <textarea
                      rows={2}
                      value={char.lifepath?.lifeGoals || ''}
                      onChange={e => handleUpdateLifepathField('lifeGoals', e.target.value)}
                      placeholder="O que fará você se sentir realizado..."
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
                    />
                  </div>

                  {/* Field 13: Tragic Love Affair */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-rose-400" />
                        <span>Caso de Amor Trágico</span>
                      </span>
                      <button
                        onClick={() => handleRollSingleField('tragicLoveAffair', 'tragicLoveAffairs')}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-rose-400 border border-zinc-800 transition"
                        title="Rolar 1d10 na tabela de Amor Trágico"
                      >
                        <Dices className="w-3 h-3" />
                        <span>1d10</span>
                      </button>
                    </div>

                    <select
                      value={LIFEPATH_TABLES.tragicLoveAffairs.includes(char.lifepath?.tragicLoveAffair || '') ? char.lifepath.tragicLoveAffair : ''}
                      onChange={e => {
                        if (e.target.value) handleUpdateLifepathField('tragicLoveAffair', e.target.value);
                      }}
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
                    >
                      <option value="">-- Escolher da Tabela Oficial --</option>
                      {LIFEPATH_TABLES.tragicLoveAffairs.map((opt, i) => (
                        <option key={i} value={opt}>{i + 1}. {opt}</option>
                      ))}
                    </select>

                    <textarea
                      rows={2}
                      value={char.lifepath?.tragicLoveAffair || ''}
                      onChange={e => handleUpdateLifepathField('tragicLoveAffair', e.target.value)}
                      placeholder="A cicatriz deixada por um amor do passado..."
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-100 focus:outline-none focus:border-rose-500 font-sans leading-relaxed"
                    />
                  </div>

                  {/* Field 14: Nemesis */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-red-950/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-red-400 font-bold flex items-center gap-1.5">
                        <Skull className="w-3.5 h-3.5" />
                        <span>Arqui-Inimigo (Nemesis Mortal)</span>
                      </span>
                      <button
                        onClick={() => handleRollSingleField('nemesis', 'nemeses')}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-[10px] font-mono text-red-400 border border-zinc-800 transition"
                        title="Rolar 1d10 na tabela de Inimigos"
                      >
                        <Dices className="w-3 h-3" />
                        <span>1d10</span>
                      </button>
                    </div>

                    <select
                      value={LIFEPATH_TABLES.nemeses.includes(char.lifepath?.nemesis || '') ? char.lifepath.nemesis : ''}
                      onChange={e => {
                        if (e.target.value) handleUpdateLifepathField('nemesis', e.target.value);
                      }}
                      className="w-full bg-[#121217] border border-zinc-800 rounded-lg p-2 text-xs text-red-200 focus:outline-none focus:border-red-500"
                    >
                      <option value="">-- Escolher da Tabela Oficial --</option>
                      {LIFEPATH_TABLES.nemeses.map((opt, i) => (
                        <option key={i} value={opt}>{i + 1}. {opt}</option>
                      ))}
                    </select>

                    <textarea
                      rows={2}
                      value={char.lifepath?.nemesis || ''}
                      onChange={e => handleUpdateLifepathField('nemesis', e.target.value)}
                      placeholder="Quem jurou matar você ou arruinar sua vida..."
                      className="w-full bg-[#121217] border border-red-950/60 rounded-lg p-2 text-xs text-red-200 focus:outline-none focus:border-red-500 font-sans leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* ======================================================== */}
              {/* CRÔNICA NARRATIVA & BIOGRAFIA DO PERSONAGEM              */}
              {/* ======================================================== */}
              <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                  <h4 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-rose-500" />
                    <span>Crônica Pessoal & Anotações Livres do Personagem</span>
                  </h4>

                  <button
                    onClick={() => {
                      if (char.notes) {
                        navigator.clipboard.writeText(char.notes);
                        setBioToast('Histórico copiado para a área de transferência!');
                        setTimeout(() => setBioToast(null), 2000);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition"
                  >
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copiar Histórico</span>
                  </button>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Este espaço armazena a história compilada do seu Edgerunner, contatos, dívidas e a crônica gerada por IA. Qualquer alteração aqui é sincronizada em tempo real com a ficha.
                </p>

                <textarea
                  rows={6}
                  value={char.notes || ''}
                  onChange={e => savePlayerCharacter({ ...char, notes: e.target.value })}
                  placeholder="Escreva livremente o histórico do seu personagem ou clique em 'Gerar Crônica IA' acima..."
                  className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-rose-500 leading-relaxed font-sans"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: SWAP / EQUIP ARMOR (ACTIVE SHEET)                 */}
      {/* ======================================================== */}
      {showArmorModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121217] border border-[#27272a] rounded-2xl w-full max-w-2xl p-6 space-y-5 my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">Catálogo Oficial de Proteção Balística</span>
                <h3 className="text-base font-bold text-zinc-100 mt-0.5">Equipar / Trocar Peças de Armadura</h3>
              </div>
              <button onClick={() => setShowArmorModal(false)} className="text-zinc-400 hover:text-zinc-200">✕</button>
            </div>

            {/* Head Armor Options */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase block">1. Armaduras de Cabeça (Head Armor):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {OFFICIAL_HEAD_ARMORS.map(arm => {
                  const isEquipped = char.armor?.head?.name === arm.name;
                  return (
                    <button
                      key={arm.id}
                      onClick={() => handleEquipArmor('head', arm)}
                      className={`p-3 rounded-xl border text-left transition ${
                        isEquipped
                          ? 'bg-cyan-950/60 border-cyan-600 ring-1 ring-cyan-500'
                          : 'bg-[#0a0a0d] border-zinc-800 hover:border-zinc-700 text-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-zinc-200">{arm.name}</strong>
                        <span className="font-mono text-cyan-400 font-bold">{arm.sp} SP</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-1">{arm.desc}</p>
                      <div className="text-[10px] font-mono text-amber-400 mt-1">Custo: {arm.cost} eb</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Body Armor Options */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase block">2. Armaduras de Tronco (Body Armor):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {OFFICIAL_BODY_ARMORS.map(arm => {
                  const isEquipped = char.armor?.body?.name === arm.name;
                  return (
                    <button
                      key={arm.id}
                      onClick={() => handleEquipArmor('body', arm)}
                      className={`p-3 rounded-xl border text-left transition ${
                        isEquipped
                          ? 'bg-amber-950/60 border-amber-600 ring-1 ring-amber-500'
                          : 'bg-[#0a0a0d] border-zinc-800 hover:border-zinc-700 text-zinc-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-zinc-200">{arm.name}</strong>
                        <span className="font-mono text-amber-400 font-bold">{arm.sp} SP</span>
                      </div>
                      {arm.penalty > 0 && (
                        <span className="text-[10px] font-mono text-red-400 font-bold block mt-0.5">
                          Penalidade: -{arm.penalty} REF, DEX, MOVE
                        </span>
                      )}
                      <p className="text-[10px] text-zinc-500 mt-1">{arm.desc}</p>
                      <div className="text-[10px] font-mono text-amber-400 mt-1">Custo: {arm.cost} eb</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#27272a]">
              <button
                onClick={() => setShowArmorModal(false)}
                className="px-5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-bold"
              >
                Concluir Troca
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD WEAPON (ACTIVE SHEET)                         */}
      {/* ======================================================== */}
      {showAddWeaponModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121217] border border-[#27272a] rounded-2xl w-full max-w-2xl p-6 space-y-5 my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div>
                <span className="text-[10px] font-mono text-red-500 uppercase font-bold">Arsenal de Night City</span>
                <h3 className="text-base font-bold text-zinc-100 mt-0.5">Adicionar Arma à Ficha</h3>
              </div>
              <button onClick={() => setShowAddWeaponModal(false)} className="text-zinc-400 hover:text-zinc-200">✕</button>
            </div>

            {/* Quick Pick From Weapons Database */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-zinc-300 font-bold block uppercase">
                Escolha do Catálogo Oficial de Armas:
              </span>
              <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                {WEAPONS_DATABASE.map((w, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleAddWeapon({
                        name: w.name,
                        damage: w.damage,
                        rof: w.rof || 1,
                        ammoType: w.category || 'Standard',
                        magCapacity: w.shots || 8,
                        magCurrent: w.shots || 8,
                        notes: w.notes,
                      });
                    }}
                    className="w-full p-2.5 rounded-xl bg-[#0a0a0d] hover:bg-zinc-800 border border-zinc-800 flex items-center justify-between text-left text-xs transition"
                  >
                    <div>
                      <strong className="text-zinc-200 block">{w.name}</strong>
                      <span className="text-[10px] font-mono text-zinc-500">{w.category} &bull; CdT {w.rof || 1} &bull; {w.cost}</span>
                    </div>
                    <span className="font-mono text-red-400 font-bold">{w.damage}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-[#27272a]">
              <button
                onClick={() => setShowAddWeaponModal(false)}
                className="px-4 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 text-xs font-mono"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD CYBERWARE (ACTIVE SHEET)                      */}
      {/* ======================================================== */}
      {showAddCyberModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121217] border border-[#27272a] rounded-2xl w-full max-w-2xl p-6 space-y-5 my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div>
                <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">Clínica de Ciberware</span>
                <h3 className="text-base font-bold text-zinc-100 mt-0.5">Instalar Ciberware & Implantes</h3>
              </div>
              <button onClick={() => setShowAddCyberModal(false)} className="text-zinc-400 hover:text-zinc-200">✕</button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {CYBERWARE_DATABASE.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const humanityCostNum = parseInt(c.humanityLoss?.replace(/[^0-9]/g, '') || '4') || 4;
                    const updatedCyber = [
                      ...char.cyberware,
                      {
                        name: c.name,
                        type: c.type,
                        humanityCost: humanityCostNum,
                        description: c.description,
                      },
                    ];
                    const updatedHumanity = Math.max(0, char.humanity - humanityCostNum);
                    savePlayerCharacter({
                      ...char,
                      cyberware: updatedCyber,
                      humanity: updatedHumanity,
                    });
                    setShowAddCyberModal(false);
                  }}
                  className="w-full p-3 rounded-xl bg-[#0a0a0d] hover:bg-zinc-800 border border-zinc-800 flex items-center justify-between text-left text-xs transition"
                >
                  <div className="space-y-0.5">
                    <strong className="text-zinc-200 block">{c.name}</strong>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">{c.description}</p>
                    <span className="text-[10px] font-mono text-purple-400">{c.type} &bull; Custo: {c.cost}</span>
                  </div>
                  <span className="font-mono text-red-400 text-xs whitespace-nowrap ml-3">
                    Perda: {c.humanityLoss}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#27272a]">
              <button
                onClick={() => setShowAddCyberModal(false)}
                className="px-4 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 text-xs font-mono"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: UNIVERSAL CODEX ITEM & ACCESSORY SEARCH           */}
      {/* ======================================================== */}
      {char && (
        <CodexItemSearchModal
          isOpen={showCodexSearchModal}
          onClose={() => setShowCodexSearchModal(false)}
          character={char}
          initialCategory={codexInitialCategory}
          onEquipWeapon={handleEquipWeaponFromCodex}
          onInstallCyberware={handleInstallCyberwareFromCodex}
          onEquipArmor={handleEquipArmorFromCodex}
          onAddGearItem={handleAddGearItemFromCodex}
          onAttachToWeapon={handleAttachToWeaponFromCodex}
          onDeductCash={handleDeductCashFromCodex}
        />
      )}

      {/* ======================================================== */}
      {/* MODAL: ATACAR VS DV (ADVANCED ATTACK ROLLER)             */}
      {/* ======================================================== */}
      {attackModal?.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-[#27272a] rounded-2xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div>
                <span className="text-[10px] font-mono text-red-400 uppercase font-bold">Resolução Balística Oficial</span>
                <h3 className="text-base font-bold text-zinc-100 mt-0.5">Disparo com {attackModal.weaponName}</h3>
              </div>
              <button onClick={() => setAttackModal(null)} className="text-zinc-400 hover:text-zinc-200">✕</button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Target Combatant Selector */}
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1 font-bold">
                  Combatente Alvo no Rastreador (Opcional):
                </label>
                <select
                  value={attackModal.targetCombatantId || ''}
                  onChange={e => {
                    const selId = e.target.value;
                    const tgt = combatants.find(c => c.id === selId);
                    setAttackModal(prev => prev ? ({
                      ...prev,
                      targetCombatantId: selId,
                      targetEvasion: tgt?.system === '2020' ? 15 : 14,
                    }) : null);
                  }}
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none font-mono text-xs"
                >
                  <option value="">Nenhum alvo específico (Rolagem Livre de Teste)</option>
                  {combatants.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} (HP: {c.currentHP}/{c.maxHP} | SP Corpo: {c.bodySP} / Cabeça: {c.headSP})
                    </option>
                  ))}
                </select>
              </div>

              {/* Distance Selection */}
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1.5 font-bold">
                  Distância do Alvo (Tabela Oficial de Alcance RED):
                </label>
                <div className="grid grid-cols-5 gap-1.5 font-mono text-[11px] text-center">
                  {[
                    { label: '0-6m', dv: 13 },
                    { label: '7-12m', dv: 15 },
                    { label: '13-25m', dv: 20 },
                    { label: '26-50m', dv: 25 },
                    { label: '51-100m', dv: 30 },
                  ].map(dist => (
                    <button
                      key={dist.label}
                      onClick={() => setAttackModal(prev => prev ? ({ ...prev, distanceCategory: dist.label, customDV: dist.dv, useEvasion: false }) : null)}
                      className={`p-2 rounded-xl border transition ${
                        attackModal.distanceCategory === dist.label && !attackModal.useEvasion
                          ? 'bg-red-950/60 border-red-700 text-red-200 font-bold'
                          : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="block text-[10px] text-zinc-500">{dist.label}</span>
                      <span>DV {dist.dv}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Evasion Checkbox */}
              <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 flex items-center justify-between">
                <div>
                  <strong className="text-zinc-200 block text-xs">Alvo com REF 8+ Esquivando?</strong>
                  <span className="text-[10px] text-zinc-500">Usa o teste de Esquiva (DEX + Evasion) do alvo como DV</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={attackModal.useEvasion}
                    onChange={e => setAttackModal(prev => prev ? ({ ...prev, useEvasion: e.target.checked }) : null)}
                    className="w-4 h-4 rounded text-red-600 bg-zinc-900 border-zinc-700"
                  />
                  {attackModal.useEvasion && (
                    <input
                      type="number"
                      value={attackModal.targetEvasion}
                      onChange={e => setAttackModal(prev => prev ? ({ ...prev, targetEvasion: Number(e.target.value) }) : null)}
                      className="w-14 bg-zinc-900 border border-zinc-700 rounded p-1 text-center font-mono text-zinc-200"
                    />
                  )}
                </div>
              </div>

              {/* Aim Mode */}
              <div className="grid grid-cols-2 gap-2 font-mono">
                <button
                  onClick={() => setAttackModal(prev => prev ? ({ ...prev, aimMode: 'normal' }) : null)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    attackModal.aimMode === 'normal'
                      ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-bold'
                      : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400'
                  }`}
                >
                  Tiro no Centro (Normal)
                </button>
                <button
                  onClick={() => setAttackModal(prev => prev ? ({ ...prev, aimMode: 'head' }) : null)}
                  className={`p-2.5 rounded-xl border text-center transition ${
                    attackModal.aimMode === 'head'
                      ? 'bg-red-950/80 border-red-700 text-red-200 font-bold'
                      : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400'
                  }`}
                >
                  🎯 Tiro na Cabeça (-8 Ataque, Dano x2)
                </button>
              </div>

              <button
                onClick={executeAttackRoll}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition shadow-md"
              >
                Rolar Ataque (1d10 + REF {effectiveREF} + Perícia)
              </button>

              {attackResult && (
                <div className={`p-4 rounded-xl border space-y-2 font-mono text-xs ${
                  attackResult.hit
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                    : 'bg-red-950/30 border-red-800/60 text-red-300'
                }`}>
                  <div className="flex items-center justify-between font-bold text-sm">
                    <span>{attackResult.hit ? '🎯 DISPARO CONFIRMADO!' : '❌ DISPARO ERROU!'}</span>
                    <span>Total: {attackResult.total} vs DV {attackResult.targetDV}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-zinc-300 font-sans">
                    {attackResult.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: EDIT FULL CHARACTER                             */}
      {/* ======================================================== */}
      {isEditingChar && editFormData && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121217] border border-[#27272a] rounded-2xl w-full max-w-2xl p-6 space-y-5 my-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>Editar Ficha Completa do Personagem</span>
              </h3>
              <button onClick={() => setIsEditingChar(false)} className="text-zinc-400 hover:text-zinc-200">✕</button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Alcunha / Handle</label>
                  <input
                    type="text"
                    value={editFormData.handle}
                    onChange={e => setEditFormData({ ...editFormData, handle: e.target.value })}
                    className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">Papel / Role</label>
                  <select
                    value={editFormData.role}
                    onChange={e => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200"
                  >
                    {['Solo', 'Netrunner', 'Tech', 'Medtech', 'Rockerboy', 'Fixer', 'Nomad', 'Exec', 'Lawman', 'Media'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Vitals */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-[#0a0a0d] rounded-xl border border-zinc-800 text-center">
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">HP Atual</span>
                  <input
                    type="number"
                    value={editFormData.currentHP}
                    onChange={e => setEditFormData({ ...editFormData, currentHP: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-1 text-center font-bold text-emerald-400"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">HP Máximo</span>
                  <input
                    type="number"
                    value={editFormData.maxHP}
                    onChange={e => setEditFormData({ ...editFormData, maxHP: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-1 text-center font-bold text-zinc-200"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">SP Cabeça</span>
                  <input
                    type="number"
                    value={editFormData.armor?.head?.sp ?? editFormData.headSP}
                    onChange={e => setEditFormData({
                      ...editFormData,
                      headSP: Number(e.target.value),
                      armor: { ...editFormData.armor, head: { ...editFormData.armor.head, sp: Number(e.target.value) } },
                    })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-1 text-center font-bold text-blue-400"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">SP Tronco</span>
                  <input
                    type="number"
                    value={editFormData.armor?.body?.sp ?? editFormData.bodySP}
                    onChange={e => setEditFormData({
                      ...editFormData,
                      bodySP: Number(e.target.value),
                      armor: { ...editFormData.armor, body: { ...editFormData.armor.body, sp: Number(e.target.value) } },
                    })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-1 text-center font-bold text-blue-400"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">Eddies (eb)</span>
                  <input
                    type="number"
                    value={editFormData.cashEb ?? 0}
                    onChange={e => setEditFormData({ ...editFormData, cashEb: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-1 text-center font-bold text-amber-400"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">Pontos IP</span>
                  <input
                    type="number"
                    value={editFormData.improvementPoints ?? 0}
                    onChange={e => setEditFormData({ ...editFormData, improvementPoints: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-1 text-center font-bold text-emerald-400"
                  />
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">Reputação</span>
                  <input
                    type="number"
                    value={editFormData.reputation ?? 0}
                    onChange={e => setEditFormData({ ...editFormData, reputation: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-1 text-center font-bold text-purple-400"
                  />
                </div>
              </div>

              {/* 10 Stats */}
              <div>
                <span className="text-[10px] text-zinc-400 block mb-1">10 Atributos Principais (2 a 8)</span>
                <div className="grid grid-cols-5 gap-2 text-center">
                  {Object.entries(editFormData.statsRED).map(([st, val]) => (
                    <div key={st} className="p-2 bg-[#0a0a0d] border border-zinc-800 rounded-lg">
                      <span className="text-[9px] text-zinc-500 uppercase block">{st}</span>
                      <input
                        type="number"
                        min={2}
                        max={10}
                        value={val}
                        onChange={e => setEditFormData({
                          ...editFormData,
                          statsRED: { ...editFormData.statsRED, [st]: Number(e.target.value) },
                        })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded p-1 text-center font-bold text-zinc-200 mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#27272a]">
                <button
                  onClick={() => setIsEditingChar(false)}
                  className="px-4 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 text-xs font-mono"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    savePlayerCharacter(editFormData);
                    setIsEditingChar(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs font-mono"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: WIZARD DE CRIAÇÃO (7 PASSOS OFICIAIS)           */}
      {/* ======================================================== */}
      {showWizard && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#121217] border border-[#27272a] rounded-2xl w-full max-w-3xl p-6 space-y-5 my-8 shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Wizard Header with Progress */}
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-red-500 uppercase font-bold">Processo Oficial de Criação de Personagem</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    Passo {wizardStep} de 7
                  </span>
                </div>
                <h3 className="text-base font-bold text-zinc-100 mt-0.5">
                  {wizardStep === 1 && '1. Método de Criação & Conceito'}
                  {wizardStep === 2 && '2. Identidade & Papel (Role)'}
                  {wizardStep === 3 && '3. Atributos Oficiais & Vitas'}
                  {wizardStep === 4 && '4. Armaduras & Proteção Balística'}
                  {wizardStep === 5 && '5. Arsenal & Armas Iniciais'}
                  {wizardStep === 6 && '6. Inventário, Equipamentos & Eddies (eb)'}
                  {wizardStep === 7 && '7. Revisão Geral & Confirmação'}
                </h3>
              </div>
              <button onClick={() => setShowWizard(false)} className="text-zinc-400 hover:text-zinc-200">✕</button>
            </div>

            {/* STEP 1: METHOD SELECTION */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <span className="text-xs text-zinc-300 font-semibold block">Escolha o Método Oficial do Livro de Regras:</span>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setCreationMethod('streetrat')}
                    className={`p-4 rounded-xl border text-left transition ${
                      creationMethod === 'streetrat'
                        ? 'bg-red-950/40 border-red-600 text-zinc-100 ring-1 ring-red-500'
                        : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-zinc-100">1. Streetrat (Rato de Rua / Templates Prontos)</strong>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">Mais Rápido</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Escolha seu Papel e receba imediatamente atributos balanceados, perícias pré-configuradas e equipamentos oficiais para começar a jogar em 2 minutos.
                    </p>
                  </button>

                  <button
                    onClick={() => setCreationMethod('edgerunner')}
                    className={`p-4 rounded-xl border text-left transition ${
                      creationMethod === 'edgerunner'
                        ? 'bg-red-950/40 border-red-600 text-zinc-100 ring-1 ring-red-500'
                        : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-zinc-100">2. Edgerunner (Fast & Dirty / Rolagem Rápida)</strong>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-amber-400">Padrão Recomendado</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Rola na tabela de atributos oficial do seu papel com pacote de perícias de especialidade e orçamento inicial da classe.
                    </p>
                  </button>

                  <button
                    onClick={() => setCreationMethod('pointbuy')}
                    className={`p-4 rounded-xl border text-left transition ${
                      creationMethod === 'pointbuy'
                        ? 'bg-red-950/40 border-red-600 text-zinc-100 ring-1 ring-red-500'
                        : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-zinc-100">3. Complete Package (Point Buy / Criação Livre)</strong>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-cyan-400">Controle Total</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Compre cada atributo com uma reserva de 62, 72 ou 80 pontos, distribua perícias e gerencie um orçamento de 2.550eb em compras livres.
                    </p>
                  </button>
                </div>

                <div className="flex justify-end pt-3">
                  <button
                    onClick={() => setWizardStep(2)}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>Avançar para Identidade & Papel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ROLE & IDENTITY */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <span className="text-xs text-zinc-300 font-semibold block">Identidade & Papel (Role):</span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1">Nome do Personagem</label>
                    <input
                      type="text"
                      value={wizardChar.name || ''}
                      onChange={e => setWizardChar({ ...wizardChar, name: e.target.value })}
                      className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-zinc-400 block mb-1">Alcunha de Rua (Handle)</label>
                    <input
                      type="text"
                      value={wizardChar.handle || ''}
                      onChange={e => setWizardChar({ ...wizardChar, handle: e.target.value })}
                      className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-zinc-400 block mb-1.5">Selecione o Papel:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { role: 'Solo', desc: 'Mercenário de combate e mestre das armas' },
                      { role: 'Netrunner', desc: 'Invasor do ciberespaço e sabotador de redes' },
                      { role: 'Tech', desc: 'Engenheiro de garagem e inventor de armas' },
                      { role: 'Medtech', desc: 'Médico de campo e cirurgião de rua' },
                      { role: 'Fixer', desc: 'Corretor de negócios e mestre de contratos' },
                      { role: 'Nomad', desc: 'Guerreiro das estradas e mestre veicular' },
                      { role: 'Rockerboy', desc: 'Líder rebelde carismático das massas' },
                      { role: 'Exec', desc: 'Corporativo com recursos e equipe pessoal' },
                      { role: 'Lawman', desc: 'Agente da lei com chamada de reforços' },
                    ].map(r => (
                      <button
                        key={r.role}
                        onClick={() => {
                          loadRoleDefaultsInWizard(r.role);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          wizardChar.role === r.role
                            ? 'bg-red-950/60 border-red-600 text-zinc-100 ring-1 ring-red-500'
                            : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        <strong className="block text-xs text-zinc-200">{r.role}</strong>
                        <span className="text-[10px] text-zinc-500 leading-tight block mt-0.5">{r.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-3 border-t border-[#27272a]">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="px-4 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 text-xs font-mono flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                  </button>
                  <button
                    onClick={() => setWizardStep(3)}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>Avançar para Atributos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: STATS & VITALS */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-300 font-semibold block">
                    {creationMethod === 'pointbuy'
                      ? `Distribuição de Pontos (Total Usado: ${getPointBuyTotal()} / ${pointBuyTier})`
                      : 'Atributos Oficiais:'}
                  </span>
                  {creationMethod === 'pointbuy' && (
                    <div className="flex gap-1 text-[10px] font-mono">
                      {[62, 72, 80].map(tier => (
                        <button
                          key={tier}
                          onClick={() => setPointBuyTier(tier)}
                          className={`px-2 py-0.5 rounded ${pointBuyTier === tier ? 'bg-red-600 text-white font-bold' : 'bg-zinc-800 text-zinc-400'}`}
                        >
                          {tier} pts
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-5 gap-2 text-center font-mono">
                  {wizardChar.statsRED && Object.entries(wizardChar.statsRED).map(([st, val]) => (
                    <div key={st} className="p-2.5 bg-[#0a0a0d] border border-zinc-800 rounded-xl">
                      <span className="text-[10px] text-zinc-500 uppercase block">{st}</span>
                      {creationMethod === 'pointbuy' ? (
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <button
                            onClick={() => setWizardChar({
                              ...wizardChar,
                              statsRED: { ...wizardChar.statsRED!, [st]: Math.max(2, val - 1) },
                            })}
                            className="w-5 h-5 rounded bg-zinc-800 text-zinc-300 text-xs flex items-center justify-center"
                          >
                            -
                          </button>
                          <strong className="text-sm text-zinc-100">{val}</strong>
                          <button
                            onClick={() => setWizardChar({
                              ...wizardChar,
                              statsRED: { ...wizardChar.statsRED!, [st]: Math.min(8, val + 1) },
                            })}
                            className="w-5 h-5 rounded bg-zinc-800 text-zinc-300 text-xs flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <strong className="text-base text-zinc-100 block mt-1">{val}</strong>
                      )}
                    </div>
                  ))}
                </div>

                {/* HP & Humanity Preview */}
                <div className="p-3 bg-[#0a0a0d] rounded-xl border border-zinc-800 grid grid-cols-2 text-center text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-zinc-500 block">HP Calculado Oficial</span>
                    <strong className="text-emerald-400 text-sm">
                      {10 + 5 * Math.ceil(((wizardChar.statsRED?.BODY || 6) + (wizardChar.statsRED?.WILL || 6)) / 2)} HP
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 block">Humanidade Inicial</span>
                    <strong className="text-purple-400 text-sm">
                      {(wizardChar.statsRED?.EMP || 5) * 10} / {(wizardChar.statsRED?.EMP || 5) * 10}
                    </strong>
                  </div>
                </div>

                <div className="flex justify-between pt-3 border-t border-[#27272a]">
                  <button
                    onClick={() => setWizardStep(2)}
                    className="px-4 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 text-xs font-mono flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                  </button>
                  <button
                    onClick={() => setWizardStep(4)}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>Avançar para Armaduras</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: ARMOR & PROTECTION MANAGEMENT */}
            {wizardStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-300 font-semibold block">Gerenciamento de Armadura & Proteção:</span>
                    <p className="text-[11px] text-zinc-400">
                      Escolha a blindagem de cabeça e tronco. Armaduras pesadas aplicam penalidade de -2 ou -4 em REF, DEX e MOVE.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const pack = ROLE_STARTING_PACKAGES[wizardChar.role || 'Solo'] || ROLE_STARTING_PACKAGES['Solo'];
                      setWizardChar(prev => ({
                        ...prev,
                        armor: JSON.parse(JSON.stringify(pack.armor)),
                        headSP: pack.armor.head.sp,
                        bodySP: pack.armor.body.sp,
                      }));
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-mono flex items-center gap-1"
                  >
                    <Zap className="w-3.5 h-3.5" /> Armadura do {wizardChar.role}
                  </button>
                </div>

                {/* Live Penalty Warning */}
                {wizardPenalty > 0 ? (
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-xs font-mono text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>
                      ⚠️ Armadura Pesada Equipada! Penalidade de -{wizardPenalty} em REF (Efetivo: {Math.max(1, (wizardChar.statsRED?.REF || 0) - wizardPenalty)}), DEX ({Math.max(1, (wizardChar.statsRED?.DEX || 0) - wizardPenalty)}) e MOVE ({Math.max(1, (wizardChar.statsRED?.MOVE || 0) - wizardPenalty)}).
                    </span>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs font-mono text-emerald-300 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>✓ Mobilidade Total: Zero penalidade de movimento (REF, DEX e MOVE intactos).</span>
                  </div>
                )}

                {/* Head Armor Selector */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1 font-bold">
                    Armadura de Cabeça (Head Armor):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {OFFICIAL_HEAD_ARMORS.map(arm => {
                      const isSelected = wizardChar.armor?.head?.name === arm.name;
                      return (
                        <button
                          key={arm.id}
                          onClick={() => setWizardChar({
                            ...wizardChar,
                            armor: {
                              ...wizardChar.armor!,
                              head: { name: arm.name, sp: arm.sp, maxSP: arm.sp },
                            },
                            headSP: arm.sp,
                          })}
                          className={`p-2.5 rounded-xl border text-left transition ${
                            isSelected
                              ? 'bg-cyan-950/60 border-cyan-600 text-zinc-100 ring-1 ring-cyan-500'
                              : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <strong className="block text-zinc-200 text-xs truncate">{arm.name}</strong>
                          <span className="font-mono text-cyan-400 text-[11px] block mt-0.5">{arm.sp} SP</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Body Armor Selector */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 block mb-1 font-bold">
                    Armadura de Tronco (Body Armor):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    {OFFICIAL_BODY_ARMORS.map(arm => {
                      const isSelected = wizardChar.armor?.body?.name === arm.name;
                      return (
                        <button
                          key={arm.id}
                          onClick={() => setWizardChar({
                            ...wizardChar,
                            armor: {
                              ...wizardChar.armor!,
                              body: { name: arm.name, sp: arm.sp, maxSP: arm.sp, penalty: arm.penalty },
                            },
                            bodySP: arm.sp,
                          })}
                          className={`p-2.5 rounded-xl border text-left transition ${
                            isSelected
                              ? 'bg-amber-950/60 border-amber-600 text-zinc-100 ring-1 ring-amber-500'
                              : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-zinc-200 text-xs truncate">{arm.name}</strong>
                            <span className="font-mono text-amber-400 font-bold ml-1">{arm.sp} SP</span>
                          </div>
                          {arm.penalty > 0 && (
                            <span className="text-[10px] font-mono text-red-400 block mt-0.5">
                              Penalidade: -{arm.penalty}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between pt-3 border-t border-[#27272a]">
                  <button
                    onClick={() => setWizardStep(3)}
                    className="px-4 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 text-xs font-mono flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                  </button>
                  <button
                    onClick={() => setWizardStep(5)}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>Avançar para Armas & Arsenal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: WEAPONS ARSENAL SELECTION */}
            {wizardStep === 5 && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-zinc-300 font-semibold block">Seleção de Armas & Arsenal Inicial:</span>
                    <p className="text-[11px] text-zinc-400">Adicione armas de fogo ou brancas para o seu personagem.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCodexInitialCategory('weapons');
                        setShowCodexSearchModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-mono font-bold flex items-center gap-1 shadow-sm"
                    >
                      <Search className="w-3.5 h-3.5" /> Buscar no Códice
                    </button>
                    <button
                      onClick={() => {
                        const pack = ROLE_STARTING_PACKAGES[wizardChar.role || 'Solo'] || ROLE_STARTING_PACKAGES['Solo'];
                        setWizardChar(prev => ({
                          ...prev,
                          weapons: JSON.parse(JSON.stringify(pack.weapons)),
                        }));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-mono flex items-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5" /> Arsenal do {wizardChar.role}
                    </button>
                  </div>
                </div>

                {/* Weapons in Current Loadout */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block font-bold">Armas Atuais no Coldre:</span>
                  <div className="space-y-1.5">
                    {(wizardChar.weapons || []).map((w, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 flex items-center justify-between text-xs"
                      >
                        <div>
                          <strong className="text-zinc-200">{w.name}</strong>
                          <span className="text-[11px] font-mono text-zinc-500 ml-2">
                            {w.damage} &bull; CdT {w.rof} &bull; {w.ammoType} &bull; {w.magCapacity} tiros
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const updated = [...(wizardChar.weapons || [])];
                            updated.splice(idx, 1);
                            setWizardChar({ ...wizardChar, weapons: updated });
                          }}
                          className="p-1 rounded text-zinc-500 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Add From Weapon Catalog */}
                <div className="pt-2 border-t border-zinc-800 space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block font-bold">Adicionar do Catálogo Oficial:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-44 overflow-y-auto pr-1">
                    {WEAPONS_DATABASE.slice(0, 18).map((w, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const updated = [
                            ...(wizardChar.weapons || []),
                            {
                              name: w.name,
                              damage: w.damage,
                              rof: w.rof || 1,
                              ammoType: w.category || 'Standard',
                              magCapacity: w.shots || 8,
                              magCurrent: w.shots || 8,
                              notes: w.notes,
                            },
                          ];
                          setWizardChar({ ...wizardChar, weapons: updated });
                        }}
                        className="p-2 rounded-xl bg-[#0a0a0d] hover:bg-zinc-800 border border-zinc-800 text-left text-xs transition flex items-center justify-between"
                      >
                        <div className="truncate pr-1">
                          <strong className="text-zinc-300 block truncate text-[11px]">{w.name}</strong>
                          <span className="text-[10px] font-mono text-zinc-500">{w.damage}</span>
                        </div>
                        <Plus className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-3 border-t border-[#27272a]">
                  <button
                    onClick={() => setWizardStep(4)}
                    className="px-4 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 text-xs font-mono flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                  </button>
                  <button
                    onClick={() => setWizardStep(6)}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>Avançar para Inventário & Eddies</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: INVENTORY, GEAR & EURODOLLARS */}
            {wizardStep === 6 && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-zinc-300 font-semibold block">Inventário, Equipamentos & Eddies (eb):</span>
                    <p className="text-[11px] text-zinc-400">Configure sua mochila e seus fundos iniciais.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCodexInitialCategory('gear');
                        setShowCodexSearchModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-bold flex items-center gap-1 shadow-sm"
                    >
                      <Search className="w-3.5 h-3.5" /> Buscar no Códice
                    </button>
                    <button
                      onClick={() => {
                        const pack = ROLE_STARTING_PACKAGES[wizardChar.role || 'Solo'] || ROLE_STARTING_PACKAGES['Solo'];
                        setWizardChar(prev => ({
                          ...prev,
                          gear: [...pack.gear],
                          cashEb: pack.cashEb,
                        }));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-mono flex items-center gap-1"
                    >
                      <Zap className="w-3.5 h-3.5" /> Pacote do {wizardChar.role}
                    </button>
                  </div>
                </div>

                {/* Cash Eurodollars Wallet Input */}
                <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block">Saldo Inicial em Carteira (eb)</span>
                      <span className="text-xs text-zinc-500">Padrão: 2.550eb (Point Buy) ou 500-1000eb (Edgerunner)</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={wizardChar.cashEb ?? 1000}
                      onChange={e => setWizardChar({ ...wizardChar, cashEb: Number(e.target.value) })}
                      className="w-28 bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-right font-mono font-bold text-amber-400 text-sm"
                    />
                    <span className="font-mono text-zinc-400 text-xs">eb</span>
                  </div>
                </div>

                {/* Add Custom Gear Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customGearInput}
                    onChange={e => setCustomGearInput(e.target.value)}
                    placeholder="Adicionar item customizado à mochila (ex: Binóculos Térmicos, Kit de Primeiros Socorros...)"
                    className="flex-1 bg-[#0a0a0d] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <button
                    onClick={() => {
                      if (customGearInput.trim()) {
                        setWizardChar({
                          ...wizardChar,
                          gear: [...(wizardChar.gear || []), customGearInput.trim()],
                        });
                        setCustomGearInput('');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold"
                  >
                    + Adicionar
                  </button>
                </div>

                {/* Quick Add Common Gear Chips */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-zinc-500 block font-semibold">+ Adição Rápida de Itens Populares:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Agente Pessoal Holográfico com IA',
                      'Mochila Tática Reforçada',
                      'Kit de Primeiros Socorros Rápido',
                      'Kit de Arrombamento Digital',
                      'Rádio Criptografado de Equipe',
                      '50 munições de Fuzil (5.56mm)',
                      '30 munições Pesadas de Pistola',
                      '2x Granadas Flashbang',
                    ].map(g => (
                      <button
                        key={g}
                        onClick={() => {
                          setWizardChar({
                            ...wizardChar,
                            gear: [...(wizardChar.gear || []), g],
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#0a0a0d] hover:bg-zinc-800 border border-zinc-800 text-[10px] text-zinc-400 hover:text-zinc-200 font-mono flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3 text-cyan-400" /> {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current Gear List */}
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {(wizardChar.gear || []).map((g, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#0a0a0d] border border-zinc-800 flex items-center justify-between text-xs text-zinc-300"
                    >
                      <span className="truncate pr-2">&bull; {g}</span>
                      <button
                        onClick={() => {
                          const updated = [...(wizardChar.gear || [])];
                          updated.splice(idx, 1);
                          setWizardChar({ ...wizardChar, gear: updated });
                        }}
                        className="p-1 rounded text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-3 border-t border-[#27272a]">
                  <button
                    onClick={() => setWizardStep(5)}
                    className="px-4 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 text-xs font-mono flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                  </button>
                  <button
                    onClick={() => setWizardStep(7)}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>Avançar para Revisão Final</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 7: REVIEW & CONFIRMATION */}
            {wizardStep === 7 && (
              <div className="space-y-4">
                <span className="text-xs text-zinc-300 font-semibold block">Resumo do Novo Personagem:</span>

                <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div>
                      <span className="text-[10px] font-mono text-red-400 uppercase font-bold">{wizardChar.role}</span>
                      <h4 className="text-base font-bold text-zinc-100">{wizardChar.name} ("{wizardChar.handle}")</h4>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-amber-400 font-bold">{wizardChar.cashEb} eb</span>
                      <span className="text-[10px] text-zinc-500 block">Saldo Inicial</span>
                    </div>
                  </div>

                  {/* Vitals & Armor Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono text-[11px]">
                    <div className="p-2 rounded bg-zinc-900">
                      <span className="text-zinc-500 block">HP Máximo</span>
                      <strong className="text-emerald-400">
                        {10 + 5 * Math.ceil(((wizardChar.statsRED?.BODY || 6) + (wizardChar.statsRED?.WILL || 6)) / 2)} HP
                      </strong>
                    </div>
                    <div className="p-2 rounded bg-zinc-900">
                      <span className="text-zinc-500 block">Humanidade</span>
                      <strong className="text-purple-400">{(wizardChar.statsRED?.EMP || 5) * 10} pts</strong>
                    </div>
                    <div className="p-2 rounded bg-zinc-900">
                      <span className="text-zinc-500 block">SP Cabeça</span>
                      <strong className="text-cyan-400">{wizardChar.armor?.head?.sp ?? 11} SP</strong>
                    </div>
                    <div className="p-2 rounded bg-zinc-900">
                      <span className="text-zinc-500 block">SP Tronco</span>
                      <strong className="text-amber-400">{wizardChar.armor?.body?.sp ?? 11} SP</strong>
                    </div>
                  </div>

                  {/* Weapons & Gear Count */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block font-bold">Armas Equipadas:</span>
                      <ul className="text-[11px] text-zinc-300 list-disc list-inside mt-0.5 space-y-0.5">
                        {(wizardChar.weapons || []).map((w, i) => (
                          <li key={i} className="truncate">{w.name} ({w.damage})</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-zinc-400 uppercase block font-bold">Mochila / Itens:</span>
                      <span className="text-[11px] text-zinc-400 block mt-0.5">
                        {wizardChar.gear?.length || 0} itens no inventário de campo.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-3 border-t border-[#27272a]">
                  <button
                    onClick={() => setWizardStep(6)}
                    className="px-4 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 text-xs font-mono flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar
                  </button>
                  <button
                    onClick={() => {
                      const body = wizardChar.statsRED?.BODY || 6;
                      const will = wizardChar.statsRED?.WILL || 6;
                      const emp = wizardChar.statsRED?.EMP || 5;
                      const calculatedHP = 10 + 5 * Math.ceil((body + will) / 2);
                      const finalChar: PlayerCharacter = {
                        ...wizardChar as PlayerCharacter,
                        id: 'pc-' + Date.now(),
                        currentHP: calculatedHP,
                        maxHP: calculatedHP,
                        humanity: emp * 10,
                        maxHumanity: emp * 10,
                        headSP: wizardChar.armor?.head?.sp ?? 11,
                        bodySP: wizardChar.armor?.body?.sp ?? 11,
                      };
                      savePlayerCharacter(finalChar);
                      setActiveCharacterId(finalChar.id);
                      setShowWizard(false);
                      setViewMode('sheet');
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shadow flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Concluir e Criar Personagem ✔</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* MODAL: IMAGE UPLOADER / CYBERPUNK GALLERY */}
      <ImageUploadModal
        isOpen={imageModalConfig.isOpen}
        onClose={() => setImageModalConfig(prev => ({ ...prev, isOpen: false }))}
        currentImageUrl={imageModalConfig.currentUrl}
        title={imageModalConfig.title}
        presetCategory={imageModalConfig.category}
        onSave={imageModalConfig.onSave}
      />
    </div>
  );
};
