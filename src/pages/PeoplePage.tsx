import React, { useState } from 'react';
import {
  Users,
  Shield,
  Heart,
  Sword,
  Cpu,
  Bookmark,
  Share2,
  Trash2,
  Edit3,
  Plus,
  Copy,
  Check,
  ShieldAlert,
  Zap,
  Crosshair,
  Dice5,
  X,
  BookOpen,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Sparkles,
  Eye,
  UserCheck,
  Skull,
  MessageSquare,
  Compass,
  Radio,
  Wand2,
  Target,
  Flame,
  CheckCircle2,
  Layers,
  Bot,
  Sliders,
  Dices,
  Car,
  Camera,
  PawPrint,
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { useCampaign } from '../context/CampaignContext';
import { useCombat } from '../context/CombatContext';
import { GANGS_LIST } from '../data/gangsData';
import { FACTIONS_LIST } from '../data/factionsData';
import { NPCSheet, NPCTier } from '../types/system';
import { getWeaponIcon, getCyberwareIcon, getGearIcon, getVehicleIcon } from '../utils/itemIcons';
import { ImageUploadModal } from '../components/common/ImageUploadModal';
import {
  OFFICIAL_BESTIARY,
  SYSTEM_CREATION_GUIDELINES,
  BestiaryEnemy,
  SystemCreationGuideline,
} from '../data/bestiaryData';
import {
  NARRATIVE_ARCHETYPES,
  NarrativeArchetypeId,
  generateNarrativeNPCOffline,
} from '../data/npcNarrativeGeneratorData';
import {
  PET_NATURES,
  PET_SIZES,
  PET_TRAININGS,
  PetNatureId,
  PetSizeId,
  PetTrainingId,
  generatePetOffline,
} from '../data/petGeneratorData';
import {
  generateAINarrativeNPC,
  generateAIEnemyCombatant,
  generateAICivilian,
  generateAIPet,
  generateAIEnemySquad,
} from '../services/aiService';
import {
  CIVILIAN_OCCUPATIONS,
  CIVILIAN_DISTRICTS,
  CivilianOccupationId,
  CivilianDistrictOrigin,
  generateCivilianOffline,
} from '../data/civilianGeneratorData';
import {
  SquadPresetId,
  SquadThreatLevel,
  SquadTacticalRole,
  SquadMember,
  EnemySquad,
  SQUAD_PRESET_DEFINITIONS,
  generateEnemySquadOffline,
} from '../data/squadGeneratorData';

const FIRST_NAMES = ['Kael', 'Jax', 'Raven', 'Vektor', 'Rocco', 'Slick', 'Nyx', 'Brick', 'T-Bug', 'Zero', 'Crash', 'Elena', 'Malik', 'Hana', 'Dante', 'Blaze', 'Cipher', 'Viper', 'Spike', 'Ghost'];
const LAST_NAMES = ['Vance', 'Kowalski', 'Silver', 'Cross', 'Tanaka', 'Mendez', 'Steel', 'Frost', 'Mercer', 'Chen', 'Black', 'Reyes', 'Novak', 'Winter', 'Kane', 'Wolf', 'Stone', 'Sato'];

export const PeoplePage: React.FC = () => {
  const { system, isRed } = useSystem();
  const { savedNPCs, saveNPC, deleteNPC, updateNPC } = useCampaign();
  const { addCombatant, addMultipleCombatants, combatants, updateHP, ablateSP, addCriticalInjury } = useCombat();

  const [activeTab, setActiveTab] = useState<'enemies' | 'civilians' | 'squads' | 'pets' | 'dossier' | 'builder' | 'library'>('enemies');

  // Dedicated Squad / Troop Generator State
  const [squadPresetId, setSquadPresetId] = useState<SquadPresetId>('ncpd');
  const [squadCustomFaction, setSquadCustomFaction] = useState<string>('');
  const [squadThreatLevel, setSquadThreatLevel] = useState<SquadThreatLevel>('Médio');
  const [squadSize, setSquadSize] = useState<number>(4);
  const [squadIncludeNetrunner, setSquadIncludeNetrunner] = useState<boolean>(true);
  const [squadIncludeHeavy, setSquadIncludeHeavy] = useState<boolean>(true);
  const [squadIncludeSniper, setSquadIncludeSniper] = useState<boolean>(false);
  const [squadMissionContext, setSquadMissionContext] = useState<string>('');
  const [isGeneratingSquadAI, setIsGeneratingSquadAI] = useState<boolean>(false);
  const [generatedSquad, setGeneratedSquad] = useState<EnemySquad | null>(() => {
    return generateEnemySquadOffline({
      presetId: 'ncpd',
      threatLevel: 'Médio',
      squadSize: 4,
      system: 'RED',
    });
  });
  const [squadCopied, setSquadCopied] = useState<boolean>(false);
  const [squadSendSuccess, setSquadSendSuccess] = useState<boolean>(false);
  const [squadToast, setSquadToast] = useState<string | null>(null);
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<NPCTier>('mook');
  const [selectedCategory, setSelectedCategory] = useState<'gangs' | 'corps' | 'police' | 'trauma' | 'nomads' | 'independent'>('gangs');
  const [selectedSubfaction, setSelectedSubfaction] = useState<string>('maelstrom');
  const [narrativeArchetype, setNarrativeArchetype] = useState<NarrativeArchetypeId>('combatant');
  const [extraNpcContext, setExtraNpcContext] = useState<string>('');
  const [isGeneratingNarrativeAI, setIsGeneratingNarrativeAI] = useState<boolean>(false);
  const [generatedNPC, setGeneratedNPC] = useState<NPCSheet | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);
  const [npcToast, setNpcToast] = useState<string | null>(null);
  const [showEnemyAiOptions, setShowEnemyAiOptions] = useState<boolean>(false);

  // Image Upload Modal State
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
    category: 'all',
    onSave: () => {},
  });

  const openImageModal = (
    title: string,
    currentUrl: string | undefined,
    category: 'all' | 'personagem' | 'inimigo' | 'pet' | 'veiculo' | 'arma' | 'cromo',
    onSave: (url: string) => void
  ) => {
    setImageModalConfig({
      isOpen: true,
      title,
      currentUrl: currentUrl || '',
      category,
      onSave,
    });
  };

  // Unified Edit & Manual Creation Modal State
  const [editingNPC, setEditingNPC] = useState<NPCSheet | null>(null);
  const [editSource, setEditSource] = useState<'enemy' | 'civilian' | 'pet' | 'library' | 'squad'>('enemy');
  const [editingSquadMemberId, setEditingSquadMemberId] = useState<string | null>(null);
  const [editTab, setEditTab] = useState<'identity' | 'stats' | 'weapons' | 'cyberware' | 'narrative' | 'pet'>('identity');
  const [editWeaponsInput, setEditWeaponsInput] = useState<string>('');
  const [editCyberwareInput, setEditCyberwareInput] = useState<string>('');
  const [editPocketLootInput, setEditPocketLootInput] = useState<string>('');
  const [editGearInput, setEditGearInput] = useState<string>('');

  // Dedicated Civilian (Everyday People) State
  const [civilianOccupationId, setCivilianOccupationId] = useState<CivilianOccupationId>('street_vendor');
  const [civilianDistrictId, setCivilianDistrictId] = useState<CivilianDistrictOrigin>('watson');
  const [extraCivilianContext, setExtraCivilianContext] = useState<string>('');
  const [showCivilianAiOptions, setShowCivilianAiOptions] = useState<boolean>(false);
  const [isGeneratingCivilianAI, setIsGeneratingCivilianAI] = useState<boolean>(false);
  const [generatedCivilian, setGeneratedCivilian] = useState<NPCSheet | null>(() => {
    return generateCivilianOffline({
      occupationId: 'street_vendor',
      districtId: 'watson',
      system: 'RED',
    });
  });
  const [civilianToast, setCivilianToast] = useState<string | null>(null);
  const [civilianCopied, setCivilianCopied] = useState<boolean>(false);

  // Dedicated Pet Generator State
  const [petNatureId, setPetNatureId] = useState<PetNatureId>('cyber_k9');
  const [petSizeId, setPetSizeId] = useState<PetSizeId>('medium');
  const [petTrainingId, setPetTrainingId] = useState<PetTrainingId>('military');
  const [petOwnerFaction, setPetOwnerFaction] = useState<string>('NCPD // Unidade K-9');
  const [extraPetContext, setExtraPetContext] = useState<string>('');
  const [isGeneratingPetAI, setIsGeneratingPetAI] = useState<boolean>(false);
  const [generatedPet, setGeneratedPet] = useState<NPCSheet | null>(null);
  const [petCopied, setPetCopied] = useState<boolean>(false);
  const [petSendSuccess, setPetSendSuccess] = useState<boolean>(false);
  const [petToast, setPetToast] = useState<string | null>(null);
  const [showPetAiOptions, setShowPetAiOptions] = useState<boolean>(false);

  // Dossier & Bestiary State
  const [dossierTierFilter, setDossierTierFilter] = useState<'all' | NPCTier>('all');
  const [dossierFactionFilter, setDossierFactionFilter] = useState<string>('all');
  const [dossierSystemFilter, setDossierSystemFilter] = useState<'all' | 'RED' | '2020'>('all');
  const [dossierSearch, setDossierSearch] = useState<string>('');
  const [selectedBestiaryEnemy, setSelectedBestiaryEnemy] = useState<BestiaryEnemy>(OFFICIAL_BESTIARY[0]);
  const [showCreationGuide, setShowCreationGuide] = useState<boolean>(false);
  const [dossierCopied, setDossierCopied] = useState<boolean>(false);
  const [dossierActionMsg, setDossierActionMsg] = useState<string | null>(null);

  // NPC Attack Modal State
  const [npcAttackModal, setNpcAttackModal] = useState<{
    isOpen: boolean;
    npc: NPCSheet;
    weapon: { name: string; damage: string };
    combatNumber: number;
    aimMode: 'normal' | 'head';
    targetId: string;
    distanceDV: number;
    isEvading: boolean;
    evasionBonus: number;
  } | null>(null);

  const [npcAttackResult, setNpcAttackResult] = useState<{
    hit: boolean;
    attackRollText: string;
    defenseText: string;
    damageRollText: string;
    damageTotal: number;
    spAblated: boolean;
    hpDeducted: number;
    critTriggered?: string;
    targetName?: string;
  } | null>(null);

  // Manual Builder Form State
  const [manualType, setManualType] = useState<'enemy' | 'civilian' | 'pet'>('enemy');
  const [manualImageUrl, setManualImageUrl] = useState<string>('');
  const [manualName, setManualName] = useState<string>('Novo Inimigo Tático');
  const [manualFaction, setManualFaction] = useState<string>('Maelstrom / Gangue Local');
  const [manualRole, setManualRole] = useState<string>('Solo / Combatente');
  const [manualTier, setManualTier] = useState<NPCTier>('mook');
  const [manualHP, setManualHP] = useState<number>(35);
  const [manualSPHead, setManualSPHead] = useState<number>(11);
  const [manualSPBody, setManualSPBody] = useState<number>(11);
  const [manualCombatNumber, setManualCombatNumber] = useState<number>(12);
  const [manualWeapons, setManualWeapons] = useState<string>('Pistola Pesada (3d6), Faca de Combate (1d6)');
  const [manualCyberware, setManualCyberware] = useState<string>('Ciberolho com Mira Térmica, Placas Subcutâneas');
  const [manualTactics, setManualTactics] = useState<string>('Mantém cobertura média e atira com precisão.');
  const [manualPetNature, setManualPetNature] = useState<string>('Drone K-9 Militar');
  const [manualPetSize, setManualPetSize] = useState<'Pequeno' | 'Médio' | 'Grande / Pesado'>('Médio');
  const [manualPetBiteDamage, setManualPetBiteDamage] = useState<string>('2d6');
  const [manualPetMonthlyCostEb, setManualPetMonthlyCostEb] = useState<number>(50);
  const [manualPetTraining, setManualPetTraining] = useState<string>('Ataque & Guarda de Perímetro');

  // SQUAD MEMBER TO NPC SHEET CONVERTER
  const squadMemberToNPCSheet = (member: SquadMember, squad: EnemySquad): NPCSheet => ({
    id: member.id,
    name: member.name,
    faction: squad.factionName,
    tier: member.tier,
    system: 'RED',
    role: `${member.roleTitle} [${member.callsign}]`,
    description: member.tacticalOrder,
    tactics: member.tacticalOrder,
    reputation: member.isLeader ? 5 : 2,
    statsRED: {
      INT: 6, REF: member.ref, DEX: member.dex, TECH: 6, COOL: 6, WILL: 6, LUCK: 2, MOVE: 6, BODY: member.body, EMP: 5,
      HP: member.hp,
      seriouslyWounded: Math.ceil(member.hp / 2),
      deathSave: member.body,
      combatNumber: member.combatNumber,
      headSP: member.headSP,
      bodySP: member.bodySP,
    },
    skills: { 'Combate Tático': member.combatNumber },
    weapons: member.weapons.map(w => ({ name: w.name, category: 'Arma', damage: w.damage, rof: w.rof, system: 'BOTH' })),
    cyberware: member.cyberware,
    gear: member.gear,
  });

  // OPEN EDIT MODAL
  const handleOpenEdit = (
    npc: NPCSheet,
    source: 'enemy' | 'civilian' | 'pet' | 'library' | 'squad',
    squadMemberId?: string
  ) => {
    setEditingNPC({
      ...npc,
      statsRED: npc.statsRED ? { ...npc.statsRED } : undefined,
      weapons: [...npc.weapons],
      cyberware: [...npc.cyberware],
      gear: [...(npc.gear || [])],
      pocketLoot: [...(npc.pocketLoot || [])],
    });
    setEditSource(source);
    setEditingSquadMemberId(squadMemberId || null);
    setEditTab(npc.isPet || npc.tier === 'pet' ? 'pet' : 'identity');
    setEditWeaponsInput(npc.weapons.map(w => `${w.name} (${w.damage})`).join(', '));
    setEditCyberwareInput(npc.cyberware.join(', '));
    setEditPocketLootInput((npc.pocketLoot || []).join(', '));
    setEditGearInput((npc.gear || []).join(', '));
  };

  // SAVE EDIT MODAL
  const handleSaveEdit = () => {
    if (!editingNPC || !editingNPC.name.trim()) return;

    // Parse weapons
    const parsedWeapons = editWeaponsInput
      .split(',')
      .map(item => {
        const trimmed = item.trim();
        const match = trimmed.match(/^(.+?)\s*\(([^)]+)\)$/);
        if (match) {
          return { name: match[1].trim(), damage: match[2].trim(), category: 'Arma', system: 'BOTH' as const };
        }
        return { name: trimmed, damage: '2d6', category: 'Arma', system: 'BOTH' as const };
      })
      .filter(w => w.name.length > 0);

    const parsedCyberware = editCyberwareInput.split(',').map(s => s.trim()).filter(Boolean);
    const parsedLoot = editPocketLootInput.split(',').map(s => s.trim()).filter(Boolean);
    const parsedGear = editGearInput.split(',').map(s => s.trim()).filter(Boolean);

    const updated: NPCSheet = {
      ...editingNPC,
      weapons: parsedWeapons.length > 0 ? parsedWeapons : editingNPC.weapons,
      cyberware: parsedCyberware,
      pocketLoot: parsedLoot,
      gear: parsedGear,
      statsRED: editingNPC.statsRED ? {
        ...editingNPC.statsRED,
        seriouslyWounded: Math.ceil(editingNPC.statsRED.HP / 2),
      } : undefined,
    };

    if (editSource === 'enemy') {
      setGeneratedNPC(updated);
      setNpcToast(`Ficha de "${updated.name}" atualizada com sucesso!`);
      setTimeout(() => setNpcToast(null), 3000);
    } else if (editSource === 'civilian') {
      setGeneratedCivilian(updated);
      setCivilianToast(`Ficha de "${updated.name}" atualizada com sucesso!`);
      setTimeout(() => setCivilianToast(null), 3000);
    } else if (editSource === 'pet') {
      setGeneratedPet(updated);
      setPetToast(`Ficha de "${updated.name}" atualizada com sucesso!`);
      setTimeout(() => setPetToast(null), 3000);
    } else if (editSource === 'squad' && editingSquadMemberId) {
      setGeneratedSquad(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          members: prev.members.map(m => {
            if (m.id === editingSquadMemberId) {
              return {
                ...m,
                name: updated.name,
                hp: updated.statsRED?.HP ?? m.hp,
                maxHP: updated.statsRED?.HP ?? m.maxHP,
                headSP: updated.statsRED?.headSP ?? m.headSP,
                bodySP: updated.statsRED?.bodySP ?? m.bodySP,
                combatNumber: updated.statsRED?.combatNumber ?? m.combatNumber,
                weapons: updated.weapons.map(w => ({ name: w.name, damage: w.damage, rof: w.rof || 1 })),
                cyberware: updated.cyberware,
                gear: updated.gear || [],
                tacticalOrder: updated.tactics || m.tacticalOrder,
              };
            }
            return m;
          }),
        };
      });
      setSquadToast(`Membro "${updated.name}" atualizado na tropa!`);
      setTimeout(() => setSquadToast(null), 3000);
    }

    if (savedNPCs.some(x => x.id === updated.id)) {
      saveNPC(updated);
    }

    setEditingNPC(null);
  };

  // MANUAL CREATION HANDLERS
  const handleCreateManualEnemy = () => {
    const newEnemy: NPCSheet = {
      id: 'enemy-manual-' + Date.now(),
      name: 'Novo Combatente Hostil',
      faction: selectedSubfaction || 'Maelstrom',
      tier: selectedTier || 'mook',
      system,
      role: 'Ganger de Ataque',
      archetype: 'Combatente Urbano',
      description: 'Inimigo criado e customizado manualmente pelo Mestre.',
      appearance: 'Couro reforçado, implantes cromados e olhar impiedoso.',
      quirks: 'Fuma nervosamente e verifica o carregador da arma a cada minuto.',
      tactics: 'Avança com disparos de supressão buscando cobertura rápida em flanco.',
      surrenderTrigger: 'Foge ou se rende se o líder tombar ou se o HP cair abaixo de 50%.',
      dialogueHook: '"Você entrou no beco errado, choom. Larga a pasta e talvez você viva!"',
      reputation: 2,
      statsRED: {
        INT: 6, REF: 7, DEX: 7, TECH: 6, COOL: 6, WILL: 6, LUCK: 2, MOVE: 6, BODY: 7, EMP: 4,
        HP: 35,
        seriouslyWounded: 18,
        deathSave: 7,
        combatNumber: 12,
        headSP: 7,
        bodySP: 7,
      },
      skills: { 'Combate Geral': 12, 'Percepção': 10, 'Furtividade': 9 },
      weapons: [
        { name: 'Pistola Pesada', category: 'Pistola', damage: '3d6', rof: 2, system: 'BOTH' },
        { name: 'Faca de Combate', category: 'Lâmina', damage: '1d6', rof: 2, system: 'BOTH' },
      ],
      cyberware: ['Ciberolho com Mira Térmica', 'Interface Neural'],
      gear: ['Agente Descartável', '3x Bandagens Rápidas'],
      pocketLoot: ['40 eb em cédulas', 'Cartela de Estimulante Sintético'],
    };
    handleOpenEdit(newEnemy, 'enemy');
  };

  const handleCreateManualCivilian = () => {
    const newCiv: NPCSheet = {
      id: 'civ-manual-' + Date.now(),
      name: 'Cidadão de Night City',
      faction: civilianDistrictId || 'watson',
      tier: 'civilian',
      system,
      role: 'Comerciante de Rua / Ambulante',
      archetype: 'Trabalhador Informal',
      description: 'Cidadão comum tentando sobreviver ao dia a dia da cidade.',
      appearance: 'Roupas surradas, olhar desconfiado e mãos calejadas.',
      quirks: 'Fala rápido oferecendo produtos enquanto olha ao redor atento à polícia.',
      motivation: 'Pagar a taxa de proteção da gangue local e alimentar a família.',
      weaknessOrSecret: 'Guarda armas e chips ilegais debaixo do balcão de comida sintética.',
      surrenderTrigger: 'Se joga no chão de joelhos suplicando por sua vida ao primeiro tiro.',
      dialogueHook: '"Ei choombatta! Não quero problema com ninguém, só tô ganhando meu pão!"',
      reputation: 1,
      statsRED: {
        INT: 6, REF: 5, DEX: 5, TECH: 6, COOL: 5, WILL: 5, LUCK: 2, MOVE: 5, BODY: 5, EMP: 6,
        HP: 25,
        seriouslyWounded: 13,
        deathSave: 5,
        combatNumber: 8,
        headSP: 0,
        bodySP: 4,
      },
      skills: { 'Negociação': 11, 'Manha': 10, 'Percepção': 8 },
      weapons: [
        { name: 'Canivete Oculto', category: 'Lâmina Leve', damage: '1d6', rof: 2, system: 'BOTH' },
      ],
      cyberware: [],
      gear: ['Agente Pessoal Barato', 'Chaves do quiosque'],
      pocketLoot: ['55 eb em notas velhas', 'Isqueiro holográfico', 'Comida sintética embalada'],
    };
    handleOpenEdit(newCiv, 'civilian');
  };

  const handleCreateManualPet = () => {
    const newPet: NPCSheet = {
      id: 'pet-manual-' + Date.now(),
      name: 'Bolt (Drone K-9)',
      faction: petOwnerFaction || 'NCPD // Unidade K-9',
      tier: 'pet',
      system,
      role: 'Cão Rastreador & Defesa Cibernética',
      isPet: true,
      petNature: 'Drone Quadrúpede / Cão Biocibernético',
      petSize: 'Médio',
      petTraining: 'Guarda Tática & Faro de Narcóticos / Explosivos',
      petInstinct: 'Defende o parceiro com ferocidade mecânica e alerta contra emboscadas.',
      petBiteDamage: '2d6',
      petMonthlyCostEb: 50,
      description: 'Companheiro canino blindado com subchassi de titânio e sensores acústicos.',
      appearance: 'Pelagem sintética preta sobre chassi metálico fosco com ópticos azuis pulsantes.',
      quirks: 'Late com frequência modulada e inclina a cabeça quando detecta Wi-Fi não seguro.',
      reputation: 1,
      statsRED: {
        INT: 3, REF: 7, DEX: 7, TECH: 2, COOL: 6, WILL: 7, LUCK: 0, MOVE: 8, BODY: 6, EMP: 3,
        HP: 30,
        seriouslyWounded: 15,
        deathSave: 6,
        combatNumber: 13,
        headSP: 7,
        bodySP: 7,
      },
      skills: { 'Faro / Percepção': 14, 'Mordida / Combate': 13, 'Atletismo': 14 },
      weapons: [
        { name: 'Mandíbula de Titânio Reforçada', category: 'Ataque Natural', damage: '2d6', rof: 2, system: 'BOTH' },
      ],
      cyberware: ['Olhos Biônicos com Visão Térmica', 'Placas Blindadas Subcutâneas'],
      gear: ['Coleira Tática com Rádio Integrado'],
      pocketLoot: ['Tag de identificação RFID'],
    };
    handleOpenEdit(newPet, 'pet');
  };

  // 1. Generate Narrative NPC Offline
  const handleGenerateNarrativeOffline = () => {
    const npc = generateNarrativeNPCOffline({
      tier: selectedTier,
      archetypeId: narrativeArchetype,
      factionCategory: selectedCategory,
      subfactionId: selectedSubfaction,
      system,
    });
    setGeneratedNPC(npc);
    setNpcToast(`NPC gerado pelas tabelas oficiais do Corebook & Dossier!`);
    setTimeout(() => setNpcToast(null), 3000);
  };

  // 2. Generate Narrative NPC with AI Co-GM
  const handleGenerateNarrativeAI = async () => {
    setIsGeneratingNarrativeAI(true);
    try {
      const npc = await generateAINarrativeNPC({
        tier: selectedTier,
        archetypeId: narrativeArchetype,
        factionCategory: selectedCategory,
        subfactionId: selectedSubfaction,
        system,
        extraContext: extraNpcContext,
      });
      setGeneratedNPC(npc);
      setNpcToast(`NPC aprofundado com inteligência artificial pelo Co-GM!`);
      setTimeout(() => setNpcToast(null), 3500);
    } catch (err) {
      console.error(err);
      handleGenerateNarrativeOffline();
    } finally {
      setIsGeneratingNarrativeAI(false);
    }
  };

  // Generate Civilian Offline
  const handleGenerateCivilianOffline = () => {
    const civ = generateCivilianOffline({
      occupationId: civilianOccupationId,
      districtId: civilianDistrictId,
      system,
    });
    setGeneratedCivilian(civ);
    setCivilianToast(`Cidadão gerado pelas regras de Everyday People!`);
    setTimeout(() => setCivilianToast(null), 3000);
  };

  // Generate Civilian with AI Co-GM
  const handleGenerateCivilianAI = async () => {
    setIsGeneratingCivilianAI(true);
    try {
      const civ = await generateAICivilian({
        occupationId: civilianOccupationId,
        districtId: civilianDistrictId,
        system,
        extraContext: extraCivilianContext,
      });
      setGeneratedCivilian(civ);
      setCivilianToast(`Cidadão único aprofundado com IA Co-GM!`);
      setTimeout(() => setCivilianToast(null), 3500);
    } catch (err) {
      console.error(err);
      handleGenerateCivilianOffline();
    } finally {
      setIsGeneratingCivilianAI(false);
    }
  };

  const handleCopyCivilian = () => {
    if (!generatedCivilian) return;
    const text = `--- CIDADÃO CIVIL: ${generatedCivilian.name} ---
Papel: ${generatedCivilian.role}
Distrito: ${generatedCivilian.faction}
Aparência: ${generatedCivilian.appearance}
Maneirismo: ${generatedCivilian.quirks}
Drama Pessoal / Gancho: ${generatedCivilian.motivation}
Segredo / Rumor: ${generatedCivilian.weaknessOrSecret}
Reação sob Fogo: ${generatedCivilian.surrenderTrigger}
Fala Típica: ${generatedCivilian.dialogueHook}
Saque dos Bolsos: ${(generatedCivilian.pocketLoot || []).join(', ')}
Stats: HP ${generatedCivilian.statsRED?.HP || 25} | SP ${generatedCivilian.statsRED?.bodySP || 0} | Combat Number #${generatedCivilian.statsRED?.combatNumber || 7}`;
    navigator.clipboard.writeText(text);
    setCivilianCopied(true);
    setCivilianToast('Ficha civil copiada para a área de transferência!');
    setTimeout(() => {
      setCivilianCopied(false);
      setCivilianToast(null);
    }, 2500);
  };

  // 3. Generate Dedicated Pet Offline
  const handleGeneratePetOffline = () => {
    const pet = generatePetOffline({
      natureId: petNatureId,
      sizeId: petSizeId,
      trainingId: petTrainingId,
      ownerFaction: petOwnerFaction,
      system,
    });
    setGeneratedPet(pet);
    setPetToast(`Pet gerado com regras canônicas de animais (Interface RED)!`);
    setTimeout(() => setPetToast(null), 3000);
  };

  // 4. Generate Dedicated Pet with AI Co-GM
  const handleGeneratePetAI = async () => {
    setIsGeneratingPetAI(true);
    try {
      const pet = await generateAIPet({
        natureId: petNatureId,
        sizeId: petSizeId,
        trainingId: petTrainingId,
        ownerFaction: petOwnerFaction,
        system,
        extraContext: extraPetContext,
      });
      setGeneratedPet(pet);
      setPetToast(`Pet gerado com IA e peculiaridades do universo Cyberpunk!`);
      setTimeout(() => setPetToast(null), 3500);
    } catch (err) {
      console.error(err);
      handleGeneratePetOffline();
    } finally {
      setIsGeneratingPetAI(false);
    }
  };

  // 5. Generate Squad Offline
  const handleGenerateSquadOffline = () => {
    const squad = generateEnemySquadOffline({
      presetId: squadPresetId,
      customFactionName: squadCustomFaction,
      threatLevel: squadThreatLevel,
      squadSize,
      includeNetrunner: squadIncludeNetrunner,
      includeHeavy: squadIncludeHeavy,
      includeSniper: squadIncludeSniper,
      missionContext: squadMissionContext,
      system,
    });
    setGeneratedSquad(squad);
    setSquadToast(`Tropa "${squad.squadName}" gerada com sucesso (${squad.members.length} membros)!`);
    setTimeout(() => setSquadToast(null), 3500);
  };

  // 6. Generate Squad with AI Co-GM
  const handleGenerateSquadAI = async () => {
    setIsGeneratingSquadAI(true);
    try {
      const squad = await generateAIEnemySquad({
        presetId: squadPresetId,
        customFactionName: squadCustomFaction,
        threatLevel: squadThreatLevel,
        squadSize,
        includeNetrunner: squadIncludeNetrunner,
        includeHeavy: squadIncludeHeavy,
        includeSniper: squadIncludeSniper,
        missionContext: squadMissionContext,
        system,
      });
      setGeneratedSquad(squad);
      setSquadToast(`Tropa gerada e aprofundada com IA Co-GM com táticas únicas!`);
      setTimeout(() => setSquadToast(null), 4000);
    } catch (err) {
      console.error(err);
      handleGenerateSquadOffline();
    } finally {
      setIsGeneratingSquadAI(false);
    }
  };

  // 7. Send Entire Squad to Combat Tracker
  const handleSendSquadToCombat = () => {
    if (!generatedSquad || generatedSquad.members.length === 0) return;
    const combatantsToAdd = generatedSquad.members.map(m => ({
      id: 'combat-' + m.sheet.id + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      name: `${m.name} [${m.callsign}]`,
      system: m.sheet.system,
      initiative: Math.floor(Math.random() * 10) + 1 + m.ref,
      currentHP: m.hp,
      maxHP: m.maxHP,
      headSP: m.headSP,
      bodySP: m.bodySP,
      conditions: [],
      criticalInjuries: [],
      deathSavePenalty: 0,
      faction: generatedSquad.factionName,
      weapons: m.weapons.map(w => ({
        name: w.name,
        damage: w.damage,
        rof: w.rof || 1,
      })),
      combatNumber: m.combatNumber,
      notes: `${m.roleTitle} • Ordem: ${m.tacticalOrder}`,
      appearance: m.sheet.appearance || '',
    }));

    addMultipleCombatants(combatantsToAdd);
    setSquadSendSuccess(true);
    setSquadToast(`⚔️ ${combatantsToAdd.length} combatentes da tropa foram enviados ao Rastreador de Combate!`);
    setTimeout(() => {
      setSquadSendSuccess(false);
      setSquadToast(null);
    }, 3500);
  };

  // 8. Save Squad to Campaign
  const handleSaveSquadToCampaign = () => {
    if (!generatedSquad) return;
    generatedSquad.members.forEach(m => {
      saveNPC(m.sheet);
    });
    setSquadToast(`💾 ${generatedSquad.members.length} membros da tropa foram salvos na Biblioteca da Campanha!`);
    setTimeout(() => setSquadToast(null), 3500);
  };

  // 9. Copy Squad Tactical Report
  const handleCopySquadSummary = () => {
    if (!generatedSquad) return;
    const lines = [
      `🚨 ESQUADRÃO DE COMBATE: ${generatedSquad.squadName}`,
      `Facção: ${generatedSquad.factionName} | Indicativo: ${generatedSquad.radioCallsign} | Ameaça: ${generatedSquad.threatLevel}`,
      `Doutrina: ${generatedSquad.doctrine}`,
      `Diretrizes Táticas:`,
      ...generatedSquad.tacticalDirectives.map(d => ` - ${d}`),
      `Equipamentos Especiais: ${generatedSquad.specialAssets.join(', ')}`,
      `Gatilho de Rendição: ${generatedSquad.surrenderThreshold}`,
      ``,
      `MEMBROS DA TROPA (${generatedSquad.members.length}):`,
      ...generatedSquad.members.map(m => 
        `• [${m.callsign}] ${m.name} (${m.roleTitle}) - HP: ${m.hp}/${m.maxHP} | SP Cabeça: ${m.headSP} | SP Corpo: ${m.bodySP} | CN: ${m.combatNumber}\n  Armas: ${m.weapons.map(w => `${w.name} [${w.damage}]`).join(', ')}\n  Ordem: ${m.tacticalOrder}\n  Grito: ${m.quoteOrBanter}`
      ),
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setSquadCopied(true);
    setSquadToast('📋 Resumo tático completo copiado para a área de transferência!');
    setTimeout(() => {
      setSquadCopied(false);
      setSquadToast(null);
    }, 3000);
  };

  // 10. Remove Member from Squad
  const handleRemoveSquadMember = (memberId: string) => {
    if (!generatedSquad) return;
    const remaining = generatedSquad.members.filter(m => m.id !== memberId);
    setGeneratedSquad({
      ...generatedSquad,
      totalMembers: remaining.length,
      members: remaining,
    });
    setSquadToast('Membro removido da formação.');
    setTimeout(() => setSquadToast(null), 2000);
  };

  // Send Pet to combat tracker
  const handleSendPetToCombat = (pet: NPCSheet) => {
    addCombatant({
      id: 'combat-' + pet.id + '-' + Date.now(),
      name: pet.name,
      system: pet.system,
      initiative: Math.floor(Math.random() * 10) + 1 + (pet.statsRED?.REF || 7),
      currentHP: pet.statsRED?.HP || 25,
      maxHP: pet.statsRED?.HP || 25,
      headSP: pet.statsRED?.headSP || 7,
      bodySP: pet.statsRED?.bodySP || 7,
      conditions: [],
      criticalInjuries: [],
      deathSavePenalty: 0,
      faction: pet.faction,
      weapons: pet.weapons.map(w => ({
        name: w.name,
        damage: w.damage,
        rof: w.rof || 1,
      })),
      combatNumber: pet.statsRED?.combatNumber || 12,
      appearance: pet.appearance || pet.description || '',
    });
    setPetSendSuccess(true);
    setTimeout(() => setPetSendSuccess(false), 2000);
  };

  // Copy Pet
  const handleCopyPet = () => {
    if (!generatedPet) return;
    const txt = `🐾 ${generatedPet.name} [${generatedPet.role}]
HP: ${generatedPet.statsRED?.HP || 25} | SP: ${generatedPet.statsRED?.bodySP || 7} | Combat Number: ${generatedPet.statsRED?.combatNumber || 12}
Instinto: ${generatedPet.petInstinct || generatedPet.tactics}
Peculiaridade: ${generatedPet.quirks || 'Nenhuma'}
Ataques: ${generatedPet.weapons.map(w => `${w.name} (${w.damage})`).join(' | ')}
Implantes: ${generatedPet.cyberware.join(', ')}`;
    navigator.clipboard.writeText(txt);
    setPetCopied(true);
    setTimeout(() => setPetCopied(false), 2000);
  };

  // Generate NPC logic (Legacy fallback)
  const handleGenerate = () => {
    const randomFirst = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const randomLast = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const fullName = `${randomFirst} "${randomFirst.slice(0, 3).toUpperCase()}" ${randomLast}`;

    if (selectedCategory === 'gangs') {
      const gang = GANGS_LIST.find(g => g.id === selectedSubfaction) || GANGS_LIST[0];
      const tierStats = gang.statsTemplate.RED;
      const cp2020Template = gang.statsTemplate.CP2020;

      // RED Calculations
      const hp = (tierStats.hp as any)[selectedTier] || (selectedTier === 'civilian' ? 25 : selectedTier === 'pet' ? 20 : 35);
      const cn = (tierStats.combatNumber as any)[selectedTier] || (selectedTier === 'civilian' ? 8 : selectedTier === 'pet' ? 10 : 10);
      const bodyStat = selectedTier === 'boss' ? 10 : selectedTier === 'miniboss' ? 8 : selectedTier === 'civilian' ? 4 : selectedTier === 'pet' ? 5 : 7;
      const willStat = selectedTier === 'boss' ? 9 : selectedTier === 'miniboss' ? 8 : selectedTier === 'civilian' ? 5 : selectedTier === 'pet' ? 6 : 6;
      const refStat = selectedTier === 'boss' ? 9 : selectedTier === 'miniboss' ? 8 : selectedTier === 'civilian' ? 5 : selectedTier === 'pet' ? 7 : 7;
      const dexStat = refStat;

      // 2020 Calculations
      const btm = cp2020Template.btm;
      const body2020 = Math.floor(Math.random() * (cp2020Template.bodyRange[1] - cp2020Template.bodyRange[0] + 1)) + cp2020Template.bodyRange[0];
      const ref2020 = Math.floor(Math.random() * (cp2020Template.refRange[1] - cp2020Template.refRange[0] + 1)) + cp2020Template.refRange[0];

      const newNPC: NPCSheet = {
        id: 'npc-' + Date.now(),
        name: `${fullName} (${gang.name})`,
        faction: gang.name,
        subfaction: gang.id,
        tier: selectedTier,
        system,
        role: `${selectedTier.toUpperCase()} // ${gang.category}`,
        description: gang.description,
        notes: `Identificadores: ${gang.identifiers}\nFilosofia: ${gang.philosophy}`,
        tactics: gang.tactics,
        reputation: selectedTier === 'boss' ? 7 : selectedTier === 'miniboss' ? 5 : selectedTier === 'lieutenant' ? 3 : selectedTier === 'civilian' ? 0 : 1,
        statsRED: {
          INT: 6,
          REF: refStat,
          DEX: dexStat,
          TECH: 5,
          COOL: 7,
          WILL: willStat,
          LUCK: selectedTier === 'boss' ? 6 : 2,
          MOVE: 6,
          BODY: bodyStat,
          EMP: selectedTier === 'boss' ? 2 : 4,
          HP: hp,
          seriouslyWounded: Math.ceil(hp / 2),
          deathSave: bodyStat,
          combatNumber: cn,
          headSP: selectedTier === 'civilian' ? 0 : tierStats.spHead,
          bodySP: selectedTier === 'civilian' ? 4 : tierStats.spBody,
        },
        stats2020: {
          INT: 6,
          REF: ref2020,
          TEC: 5,
          COOL: 7,
          ATR: 5,
          LUCK: selectedTier === 'boss' ? 6 : 3,
          MA: 6,
          BODY: body2020,
          EMP: 4,
          BTM: btm,
          headSP: cp2020Template.spHead,
          torsoSP: cp2020Template.spTorso,
          rArmSP: cp2020Template.spLimbs,
          lArmSP: cp2020Template.spLimbs,
          rLegSP: cp2020Template.spLimbs,
          lLegSP: cp2020Template.spLimbs,
        },
        skills: {
          'Combate Geral (Combat Number)': cn,
          'Percepção (Perception)': cn - 2,
          'Esquiva (Evasion)': cn,
          'Manha de Rua (Streetwise)': cn - 1,
        },
        weapons: gang.signatureWeapons.map(w => ({
          name: w,
          category: 'Assinatura',
          damage: w.includes('5d6') ? '5d6' : w.includes('4d6') ? '4d6' : w.includes('3d6') ? '3d6' : '2d6',
          system: 'BOTH',
        })),
        cyberware: gang.typicalGear,
        gear: ['Agente Descartável', '1d6x10eb em credstick', 'Munição extra (20 tiros)'],
      };

      setGeneratedNPC(newNPC);
    } else {
      // Corporation, Trauma, Police, Nomads
      const factionKey = selectedCategory === 'trauma' ? 'trauma-team' : selectedCategory === 'police' ? 'ncpd' : selectedCategory === 'nomads' ? 'nomads-civilians' : selectedSubfaction;
      const faction = FACTIONS_LIST.find(f => f.id === factionKey) || FACTIONS_LIST[0];
      const unit = faction.unitTypes.find(u => u.tier === selectedTier) || faction.unitTypes[0];

      const newNPC: NPCSheet = {
        id: 'npc-' + Date.now(),
        name: `${fullName} - ${unit.roleName}`,
        faction: faction.name,
        tier: selectedTier,
        system,
        role: unit.roleName,
        description: faction.description,
        notes: unit.notes,
        tactics: unit.tactics,
        reputation: selectedTier === 'boss' ? 8 : selectedTier === 'miniboss' ? 5 : 2,
        statsRED: {
          INT: 7,
          REF: unit.statsRED.ref,
          DEX: unit.statsRED.dex,
          TECH: 6,
          COOL: 8,
          WILL: unit.statsRED.will,
          LUCK: selectedTier === 'boss' ? 6 : 2,
          MOVE: unit.statsRED.move,
          BODY: unit.statsRED.body,
          EMP: 5,
          HP: unit.statsRED.hp,
          seriouslyWounded: Math.ceil(unit.statsRED.hp / 2),
          deathSave: unit.statsRED.body,
          combatNumber: unit.statsRED.combatNumber || 13,
          headSP: unit.statsRED.spHead,
          bodySP: unit.statsRED.spBody,
        },
        stats2020: {
          INT: 7,
          REF: unit.stats2020.ref,
          TEC: unit.stats2020.tech,
          COOL: unit.stats2020.cool,
          ATR: 5,
          LUCK: 4,
          MA: 6,
          BODY: unit.stats2020.body,
          EMP: 5,
          BTM: unit.stats2020.btm,
          headSP: unit.stats2020.spHead,
          torsoSP: unit.stats2020.spTorso,
          rArmSP: unit.stats2020.spLimbs,
          lArmSP: unit.stats2020.spLimbs,
          rLegSP: unit.stats2020.spLimbs,
          lLegSP: unit.stats2020.spLimbs,
        },
        skills: {
          'Perícia de Combate Base': unit.statsRED.combatNumber || 13,
          'Percepção Tática': (unit.statsRED.combatNumber || 13) - 1,
          'Táticas Militares': 13,
        },
        weapons: (isRed ? unit.weaponsRED : unit.weapons2020).map(w => ({
          name: w,
          category: 'Militar',
          damage: w.includes('5d6') ? '5d6' : w.includes('4d6') ? '4d6' : '3d6',
          system: 'BOTH',
        })),
        cyberware: unit.equipment,
        gear: ['Rádio Criptografado', 'Credstick Corporativo', 'Kit Médico Rápido'],
      };

      setGeneratedNPC(newNPC);
    }
  };

  // Send to combat tracker
  const handleSendToCombat = (npc: NPCSheet) => {
    addCombatant({
      id: 'combat-' + npc.id + '-' + Date.now(),
      name: npc.name,
      system: npc.system,
      initiative: Math.floor(Math.random() * 10) + 1 + (npc.statsRED?.REF || 7),
      currentHP: npc.statsRED?.HP || 35,
      maxHP: npc.statsRED?.HP || 35,
      headSP: npc.statsRED?.headSP || 11,
      bodySP: npc.statsRED?.bodySP || 11,
      torsoSP: npc.stats2020?.torsoSP,
      rArmSP: npc.stats2020?.rArmSP,
      lArmSP: npc.stats2020?.lArmSP,
      rLegSP: npc.stats2020?.rLegSP,
      lLegSP: npc.stats2020?.lLegSP,
      btm: npc.stats2020?.BTM,
      conditions: [],
      criticalInjuries: [],
      deathSavePenalty: 0,
      faction: npc.faction,
      weapons: npc.weapons.map(w => ({
        name: w.name,
        damage: w.damage,
        rof: (w as any).rof || (w.damage.includes('5d6') || w.damage.includes('4d6') ? 1 : 2),
      })),
      combatNumber: npc.statsRED?.combatNumber || (npc.system === '2020' ? (npc.stats2020?.REF || 8) + 6 : 14),
      appearance: npc.notes || '',
    });
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 2000);
  };

  // Send Bestiary Enemy to Combat Tracker
  const handleSendBestiaryToCombat = (enemy: BestiaryEnemy) => {
    addCombatant({
      id: 'combat-' + enemy.id + '-' + Date.now(),
      name: enemy.name,
      system: enemy.system === 'BOTH' ? (isRed ? 'RED' : '2020') : enemy.system,
      initiative: Math.floor(Math.random() * 10) + 1 + (enemy.ref || 7),
      currentHP: enemy.hp,
      maxHP: enemy.hp,
      headSP: enemy.headSP,
      bodySP: enemy.bodySP,
      torsoSP: enemy.torsoSP,
      rArmSP: enemy.rArmSP,
      lArmSP: enemy.lArmSP,
      rLegSP: enemy.rLegSP,
      lLegSP: enemy.lLegSP,
      btm: enemy.btm,
      conditions: [],
      criticalInjuries: [],
      deathSavePenalty: 0,
      faction: enemy.faction,
      weapons: enemy.weapons.map(w => ({
        name: w.name,
        damage: w.damage,
        rof: w.rof,
      })),
      combatNumber: enemy.combatNumber || (enemy.ref + 6),
      appearance: enemy.appearance || enemy.description,
    });
    setDossierActionMsg(`"${enemy.name}" enviado com sucesso ao Rastreador de Combate!`);
    setTimeout(() => setDossierActionMsg(null), 2500);
  };

  // Save Bestiary Enemy to Campaign Library
  const handleSaveBestiaryToLibrary = (enemy: BestiaryEnemy) => {
    const sheet: NPCSheet = {
      id: 'npc-' + enemy.id + '-' + Date.now(),
      name: enemy.name,
      faction: enemy.faction,
      tier: enemy.tier,
      system: enemy.system === 'BOTH' ? (isRed ? 'RED' : '2020') : enemy.system,
      role: enemy.role,
      description: enemy.description,
      notes: `${enemy.appearance ? `Aparência: ${enemy.appearance}\n` : ''}${enemy.quirks ? `Maneirismos: ${enemy.quirks}\n` : ''}${enemy.motivation ? `Motivação: ${enemy.motivation}\n` : ''}${enemy.citation ? `Fonte: ${enemy.citation}` : ''}`,
      tactics: `${enemy.tactics}${enemy.surrenderTrigger ? `\nGatilho de Rendição: ${enemy.surrenderTrigger}` : ''}`,
      reputation: enemy.tier === 'boss' ? 7 : enemy.tier === 'miniboss' ? 5 : enemy.tier === 'lieutenant' ? 3 : enemy.tier === 'mook' ? 1 : 0,
      statsRED: {
        INT: 6,
        REF: enemy.ref,
        DEX: enemy.dex,
        TECH: 5,
        COOL: 7,
        WILL: enemy.will,
        LUCK: enemy.tier === 'boss' ? 6 : 2,
        MOVE: enemy.move,
        BODY: enemy.body,
        EMP: 4,
        HP: enemy.hp,
        seriouslyWounded: Math.ceil(enemy.hp / 2),
        deathSave: enemy.body,
        combatNumber: enemy.combatNumber || (enemy.ref + 6),
        headSP: enemy.headSP,
        bodySP: enemy.bodySP,
      },
      stats2020: {
        INT: 6,
        REF: enemy.ref,
        TEC: 5,
        COOL: 7,
        ATR: 5,
        LUCK: enemy.tier === 'boss' ? 6 : 2,
        MA: enemy.move,
        BODY: enemy.body,
        EMP: 4,
        BTM: enemy.btm || -2,
        headSP: enemy.headSP,
        torsoSP: enemy.torsoSP || enemy.bodySP,
        rArmSP: enemy.rArmSP || enemy.bodySP,
        lArmSP: enemy.lArmSP || enemy.bodySP,
        rLegSP: enemy.rLegSP || enemy.bodySP,
        lLegSP: enemy.lLegSP || enemy.bodySP,
      },
      skills: {
        'Combate Geral': enemy.combatNumber || (enemy.ref + 6),
        'Percepção': (enemy.combatNumber || (enemy.ref + 6)) - 2,
        'Esquiva (Evasion)': enemy.combatNumber || (enemy.ref + 6),
      },
      weapons: enemy.weapons.map(w => ({
        name: w.name,
        category: 'Arma',
        damage: w.damage,
        rof: w.rof,
        system: 'BOTH',
      })),
      cyberware: enemy.cyberware,
      gear: enemy.equipment,
    };
    saveNPC(sheet);
    setDossierActionMsg(`"${enemy.name}" salvo com sucesso na sua Biblioteca de NPCs!`);
    setTimeout(() => setDossierActionMsg(null), 2500);
  };

  // Open Attack modal for Bestiary Enemy
  const handleOpenBestiaryAttack = (enemy: BestiaryEnemy, weapon: { name: string; damage: string }) => {
    const cNum = enemy.combatNumber || (enemy.ref + 6);
    const fakeSheet: NPCSheet = {
      id: enemy.id,
      name: enemy.name,
      faction: enemy.faction,
      tier: enemy.tier,
      system: enemy.system === 'BOTH' ? (isRed ? 'RED' : '2020') : enemy.system,
      role: enemy.role,
      description: enemy.description,
      reputation: 3,
      skills: { 'Combate Geral': cNum },
      weapons: enemy.weapons.map(w => ({ name: w.name, category: 'Arma', damage: w.damage, system: 'BOTH' })),
      cyberware: enemy.cyberware,
      gear: enemy.equipment,
    };
    setNpcAttackModal({
      isOpen: true,
      npc: fakeSheet,
      weapon,
      combatNumber: cNum,
      aimMode: 'normal',
      targetId: combatants[0]?.id || '',
      distanceDV: 15,
      isEvading: false,
      evasionBonus: 14,
    });
    setNpcAttackResult(null);
  };

  // Copy Bestiary Dossier
  const handleCopyBestiary = (enemy: BestiaryEnemy) => {
    const text = `[DOSSIÊ DE NPC // ${enemy.name.toUpperCase()}]
Escalão: ${enemy.tier.toUpperCase()} | Sistema: ${enemy.system}
Facção: ${enemy.faction} | Papel: ${enemy.role}
Fonte: ${enemy.citation}

DESCRIÇÃO VISUAL & ESTÉTICA:
${enemy.appearance || enemy.description}

PERSONALIDADE & MANEIRISMOS:
${enemy.quirks || 'Profissional e pragmático nas ruas.'}

MOTIVAÇÃO & AGENDA OCULTA:
${enemy.motivation || 'Sobreviver e cumprir a missão.'}

DIRETRIZES TÁTICAS:
${enemy.tactics}
Gatilho de Rendição: ${enemy.surrenderTrigger || 'Recua se sofrer Gravemente Ferido.'}

ESTATÍSTICAS VITAIS:
HP: ${enemy.hp} (Gravemente Ferido: ${Math.ceil(enemy.hp / 2)}, Salva da Morte: ${enemy.body})
SP: Cabeça ${enemy.headSP} | Corpo ${enemy.bodySP}
Combat Number: ${enemy.combatNumber || (enemy.ref + 6)}
MOVE ${enemy.move} | REF ${enemy.ref} | DEX ${enemy.dex} | BODY ${enemy.body} | WILL ${enemy.will}

ARMAS:
${enemy.weapons.map(w => `- ${w.name}: Dano ${w.damage} (ROF ${w.rof})${w.notes ? ` [${w.notes}]` : ''}`).join('\n')}

CIBERWARE & EQUIPAMENTO:
- Implantes: ${enemy.cyberware.join(', ')}
- Equipamento: ${enemy.equipment.join(', ')}
${enemy.specialAbility ? `\nHABILIDADE ESPECIAL:\n${enemy.specialAbility}` : ''}`;

    navigator.clipboard.writeText(text);
    setDossierCopied(true);
    setTimeout(() => setDossierCopied(false), 2000);
  };

  const handleOpenNpcAttack = (npc: NPCSheet, weapon: { name: string; damage: string }) => {
    const cNum = npc.statsRED?.combatNumber || (npc.system === '2020' ? (npc.stats2020?.REF || 8) + 6 : 14);
    setNpcAttackModal({
      isOpen: true,
      npc,
      weapon,
      combatNumber: cNum,
      aimMode: 'normal',
      targetId: combatants[0]?.id || '',
      distanceDV: 15,
      isEvading: false,
      evasionBonus: 14,
    });
    setNpcAttackResult(null);
  };

  const handleExecuteNpcAttack = () => {
    if (!npcAttackModal) return;
    const { weapon, combatNumber, aimMode, targetId, distanceDV, isEvading, evasionBonus, npc } = npcAttackModal;
    
    // 1. Attack roll (1d10 with exploding 10 / fumble 1)
    const d10 = Math.floor(Math.random() * 10) + 1;
    let rollBonus = 0;
    if (d10 === 10) rollBonus += Math.floor(Math.random() * 10) + 1;
    if (d10 === 1) rollBonus -= Math.floor(Math.random() * 10) + 1;

    const penalty = aimMode === 'head' ? -8 : 0;
    const totalAttack = d10 + rollBonus + combatNumber + penalty;

    // 2. Defense
    let defenseVal = distanceDV;
    let defenseTxt = `DV Distância: ${distanceDV}`;
    if (isEvading) {
      const evadeD10 = Math.floor(Math.random() * 10) + 1;
      let evadeBonusD10 = 0;
      if (evadeD10 === 10) evadeBonusD10 += Math.floor(Math.random() * 10) + 1;
      if (evadeD10 === 1) evadeBonusD10 -= Math.floor(Math.random() * 10) + 1;
      defenseVal = evadeD10 + evadeBonusD10 + evasionBonus;
      defenseTxt = `Esquiva do Alvo: ${defenseVal} (d10:${evadeD10} + Bônus:${evasionBonus})`;
    }

    const hit = totalAttack >= defenseVal;

    if (!hit) {
      setNpcAttackResult({
        hit: false,
        attackRollText: `Total Ataque: ${totalAttack} (d10:${d10} + Combat Number:${combatNumber}${aimMode === 'head' ? ' -8 Mira Cabeça' : ''})`,
        defenseText: defenseTxt,
        damageRollText: 'Disparo errou o alvo!',
        damageTotal: 0,
        spAblated: false,
        hpDeducted: 0,
      });
      return;
    }

    // 3. Roll Damage
    const match = weapon.damage.match(/(\d+)d6/);
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

    // 4. Target Application if in combat list
    const target = combatants.find(c => c.id === targetId);
    let spAblated = false;
    let hpDeducted = 0;
    let critName: string | undefined = undefined;

    if (target) {
      const armor = aimMode === 'head' ? target.headSP : target.bodySP;
      const armorLoc = aimMode === 'head' ? 'head' : 'body';
      if (dmgTotal > armor) {
        spAblated = true;
        ablateSP(target.id, armorLoc, -1);
        const penetrating = dmgTotal - armor;
        hpDeducted = aimMode === 'head' ? penetrating * 2 : penetrating;
        updateHP(target.id, -hpDeducted);
      }
      if (isCrit) {
        critName = 'Ferimento Crítico (Ataque de ' + npc.name + ')';
        addCriticalInjury(target.id, critName);
      }
    }

    setNpcAttackResult({
      hit: true,
      attackRollText: `Total Ataque: ${totalAttack} (d10:${d10} + Bônus:${combatNumber}${aimMode === 'head' ? ' -8 Mira Cabeça' : ''})`,
      defenseText: defenseTxt,
      damageRollText: `Rolagem [${rolls.join(', ')}] = ${dmgTotal} de dano${isCrit ? ' 💥 CRÍTICO (+5 HP)!' : ''}`,
      damageTotal: dmgTotal,
      spAblated,
      hpDeducted,
      critTriggered: critName,
      targetName: target?.name,
    });
  };

  // Copy text sheet
  const handleCopy = () => {
    if (!generatedNPC) return;
    const txt = `FICHA DE NPC: ${generatedNPC.name} [${generatedNPC.system}]
Escalão: ${generatedNPC.tier.toUpperCase()} | Facção: ${generatedNPC.faction}
HP: ${generatedNPC.statsRED?.HP} (Gravemente Ferido: ${generatedNPC.statsRED?.seriouslyWounded}) | Salvaguarda Morte: ${generatedNPC.statsRED?.deathSave}
Blindagem SP: Cabeça ${generatedNPC.statsRED?.headSP} / Corpo ${generatedNPC.statsRED?.bodySP}
Combat Number: ${generatedNPC.statsRED?.combatNumber}
Armas: ${generatedNPC.weapons.map(w => w.name).join(', ')}
Ciberware: ${generatedNPC.cyberware.join(', ')}
Táticas: ${generatedNPC.tactics}`;
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Filtered Bestiary Calculation
  const filteredBestiary = OFFICIAL_BESTIARY.filter(enemy => {
    // 1. Tier filter
    if (dossierTierFilter !== 'all' && enemy.tier !== dossierTierFilter) {
      return false;
    }
    // 2. Faction filter
    if (dossierFactionFilter !== 'all') {
      if (dossierFactionFilter === 'gangs') {
        const isGang = ['Maelstrom', 'Tyger Claws', 'Valentinos', 'Voodoo Boys', 'Bozos', '6th Street'].some(g => enemy.faction.includes(g));
        if (!isGang) return false;
      } else if (dossierFactionFilter === 'corps') {
        const isCorp = ['Arasaka', 'Militech', 'Petrochem'].some(c => enemy.faction.includes(c));
        if (!isCorp) return false;
      } else if (dossierFactionFilter === 'police') {
        const isPolice = enemy.faction.includes('DPNC') || enemy.faction.includes('MaxTac') || enemy.faction.includes('Polícia');
        if (!isPolice) return false;
      } else if (dossierFactionFilter === 'trauma') {
        if (!enemy.faction.includes('Trauma')) return false;
      } else if (dossierFactionFilter === 'nomads') {
        const isNomadOrCivilian = enemy.faction.includes('Nômade') || enemy.faction.includes('Civil') || enemy.faction.includes('Civis') || enemy.faction.includes('Aldecaldo');
        if (!isNomadOrCivilian) return false;
      } else if (dossierFactionFilter === 'cyberpsycho') {
        if (!enemy.faction.includes('Ciberpsicopata')) return false;
      } else if (!['gangs', 'corps', 'police', 'trauma', 'nomads', 'cyberpsycho'].includes(dossierFactionFilter) && enemy.faction !== dossierFactionFilter) {
        return false;
      }
    }
    // 3. System filter
    if (dossierSystemFilter !== 'all') {
      if (enemy.system !== 'BOTH' && enemy.system !== dossierSystemFilter) {
        return false;
      }
    }
    // 4. Text search
    if (dossierSearch.trim()) {
      const q = dossierSearch.toLowerCase();
      const matchName = enemy.name.toLowerCase().includes(q);
      const matchRole = enemy.role.toLowerCase().includes(q);
      const matchFaction = enemy.faction.toLowerCase().includes(q);
      const matchDesc = enemy.description.toLowerCase().includes(q);
      const matchTactics = enemy.tactics.toLowerCase().includes(q);
      const matchWeapons = enemy.weapons.some(w => w.name.toLowerCase().includes(q));
      const matchCyber = enemy.cyberware.some(c => c.toLowerCase().includes(q));
      const matchQuote = enemy.dialogueHook?.toLowerCase().includes(q);
      const matchAppearance = enemy.appearance?.toLowerCase().includes(q);
      return matchName || matchRole || matchFaction || matchDesc || matchTactics || matchWeapons || matchCyber || matchQuote || matchAppearance;
    }
    return true;
  });

  // Tier Counts
  const civilianCount = OFFICIAL_BESTIARY.filter(e => e.tier === 'civilian').length;
  const petCount = OFFICIAL_BESTIARY.filter(e => e.tier === 'pet').length;
  const mookCount = OFFICIAL_BESTIARY.filter(e => e.tier === 'mook').length;
  const lieutenantCount = OFFICIAL_BESTIARY.filter(e => e.tier === 'lieutenant').length;
  const minibossCount = OFFICIAL_BESTIARY.filter(e => e.tier === 'miniboss').length;
  const bossCount = OFFICIAL_BESTIARY.filter(e => e.tier === 'boss').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ACTION TOAST / NOTIFICATION */}
      {dossierActionMsg && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-zinc-900 border border-red-500/50 text-white shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-5 h-5 text-green-400 shrink-0" />
          <span className="text-xs font-mono font-medium">{dossierActionMsg}</span>
        </div>
      )}

      {/* Header and Sub-tabs */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-red-500" />
            <span>Pessoas & Facções (Inimigos & NPCs)</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Dossiê oficial do sistema com guia de criação, parâmetros de escalão, ficha de combate e gerador de NPCs.
          </p>
        </div>

        {/* Sub-tabs pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#14141a] border border-[#27272a] rounded-xl p-1.5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('enemies')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
              activeTab === 'enemies'
                ? 'bg-red-600 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sword className="w-3.5 h-3.5 text-white" />
            <span>Inimigos de Combate</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono border ${
              activeTab === 'enemies'
                ? 'bg-red-950/80 text-white border-red-400/40'
                : 'bg-zinc-800 text-zinc-300 border-zinc-700'
            }`}>
              Ameaças
            </span>
          </button>
          <button
            onClick={() => setActiveTab('civilians')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
              activeTab === 'civilians'
                ? 'bg-cyan-600 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-white" />
            <span>Civis & Cotidiano</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono border ${
              activeTab === 'civilians'
                ? 'bg-cyan-950/80 text-white border-cyan-400/40'
                : 'bg-zinc-800 text-cyan-400 border-zinc-700'
            }`}>
              Everyday People
            </span>
          </button>
          <button
            onClick={() => setActiveTab('squads')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
              activeTab === 'squads'
                ? 'bg-amber-600 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-white" />
            <span>Tropas & Quadrilhas</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono border ${
              activeTab === 'squads'
                ? 'bg-amber-950/80 text-white border-amber-400/40'
                : 'bg-zinc-800 text-amber-400 border-zinc-700'
            }`}>
              Esquadrões
            </span>
          </button>
          <button
            onClick={() => setActiveTab('pets')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
              activeTab === 'pets'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="text-xs">🐕</span>
            <span>Pets & Biopets</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono border ${
              activeTab === 'pets'
                ? 'bg-emerald-950/80 text-white border-emerald-400/40'
                : 'bg-zinc-800 text-emerald-400 border-zinc-700'
            }`}>
              K-9 • Drones
            </span>
          </button>
          <button
            onClick={() => setActiveTab('dossier')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
              activeTab === 'dossier'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            <span>Dossiê Oficial</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800">
              {OFFICIAL_BESTIARY.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('builder')}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === 'builder'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Construtor Manual
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Biblioteca</span>
            {savedNPCs.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-950 text-[10px] font-mono text-red-300 border border-red-800/40">
                {savedNPCs.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 0: DOSSIÊ & BESTIÁRIO OFICIAL DE NPCS */}
      {activeTab === 'dossier' && (
        <div className="space-y-6">
          {/* 1. GUIA OFICIAL DE CRIAÇÃO DO SISTEMA (ACCORDION) */}
          <div className="rounded-2xl bg-[#121217] border border-[#27272a] overflow-hidden">
            <button
              onClick={() => setShowCreationGuide(!showCreationGuide)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-800/40 transition"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-950/60 border border-red-800/40 text-red-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-zinc-100">
                      Guia Oficial de Criação de Ameaças & NPCs
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                      Cyberpunk RED p. 224-227 & DLCs
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Parâmetros mecânicos oficiais de Combat Number, HP, Blindagem SP e Diretrizes Psicológicas de cada escalão.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                <span>{showCreationGuide ? 'Ocultar Parâmetros' : 'Ver Parâmetros do Sistema'}</span>
                {showCreationGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {showCreationGuide && (
              <div className="p-5 border-t border-[#27272a] bg-[#0c0c10] space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                  {SYSTEM_CREATION_GUIDELINES.map(g => (
                    <div
                      key={g.tier}
                      className="p-3.5 rounded-xl bg-[#14141a] border border-zinc-800 hover:border-zinc-700 flex flex-col justify-between space-y-3 transition"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            g.tier === 'civilian'
                              ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/40'
                              : g.tier === 'pet'
                              ? 'bg-amber-950/70 text-amber-300 border border-amber-800/40'
                              : g.tier === 'mook'
                              ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                              : g.tier === 'lieutenant'
                              ? 'bg-blue-950/70 text-blue-300 border border-blue-800/40'
                              : g.tier === 'miniboss'
                              ? 'bg-purple-950/70 text-purple-300 border border-purple-800/40'
                              : 'bg-red-950/80 text-red-300 border border-red-700/60'
                          }`}>
                            {g.tier === 'pet' ? '🐾 PET' : g.tier.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-200">{g.name}</h4>
                        <div className="text-[11px] font-mono text-amber-400 mt-1">{g.combatNumberRange}</div>
                        <div className="text-[10px] font-mono text-zinc-400">{g.hpRange} • {g.spRange}</div>
                        <p className="text-[11px] text-zinc-300 mt-2 leading-relaxed">{g.tacticalDirective}</p>
                      </div>

                      <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
                        <div className="text-[9px] font-mono text-zinc-500 italic">{g.systemCitation}</div>
                        <button
                          onClick={() => {
                            setDossierTierFilter(g.tier);
                            setShowCreationGuide(false);
                          }}
                          className="w-full py-1 text-[10px] font-mono text-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
                        >
                          Filtrar por este Tier
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2. FILTROS E BUSCA */}
          <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
            {/* Search Input and Tier Pills */}
            <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
              {/* Text Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={dossierSearch}
                  onChange={e => setDossierSearch(e.target.value)}
                  placeholder="Pesquisar NPC por nome, facção, arma, implante, citação ou tática..."
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl pl-9 pr-8 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500 transition"
                />
                {dossierSearch && (
                  <button
                    onClick={() => setDossierSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Faction & System Selectors */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-[#0a0a0d] border border-[#27272a] rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 font-mono">
                  <Filter className="w-3.5 h-3.5 text-zinc-500" />
                  <select
                    value={dossierFactionFilter}
                    onChange={e => setDossierFactionFilter(e.target.value)}
                    className="bg-transparent text-xs text-zinc-200 focus:outline-none"
                  >
                    <option value="all">Todas as Facções ({OFFICIAL_BESTIARY.length})</option>
                    <option value="gangs">Gangues de Rua (Watson, Heywood, Pacifica...)</option>
                    <option value="corps">Corporações (Arasaka, Militech, Petrochem)</option>
                    <option value="police">Polícia DPNC & MaxTac</option>
                    <option value="trauma">Trauma Team™ Internacional</option>
                    <option value="nomads">Nômades & Civis / Everyday</option>
                    <option value="cyberpsycho">Ciberpsicopatas Independentes</option>
                  </select>
                </div>

                <div className="flex items-center gap-1 bg-[#0a0a0d] border border-[#27272a] rounded-xl p-1 text-[11px] font-mono">
                  {(['all', 'RED', '2020'] as const).map(sys => (
                    <button
                      key={sys}
                      onClick={() => setDossierSystemFilter(sys)}
                      className={`px-2 py-0.5 rounded-lg transition ${
                        dossierSystemFilter === sys
                          ? 'bg-zinc-800 text-zinc-100 font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {sys === 'all' ? 'Todos' : sys}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tier Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-zinc-800/60 text-xs font-mono">
              <span className="text-[11px] text-zinc-500 uppercase mr-1">Filtrar Escalão:</span>
              <button
                onClick={() => setDossierTierFilter('all')}
                className={`px-2.5 py-1 rounded-lg border transition ${
                  dossierTierFilter === 'all'
                    ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-bold'
                    : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Todos ({OFFICIAL_BESTIARY.length})
              </button>
              <button
                onClick={() => setDossierTierFilter('civilian')}
                className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                  dossierTierFilter === 'civilian'
                    ? 'bg-emerald-950/80 border-emerald-600 text-emerald-200 font-bold'
                    : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Civis / Everyday ({civilianCount})</span>
              </button>
              <button
                onClick={() => setDossierTierFilter('pet')}
                className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                  dossierTierFilter === 'pet'
                    ? 'bg-amber-950/80 border-amber-600 text-amber-200 font-bold'
                    : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>🐾 Pets & Biopets ({petCount})</span>
              </button>
              <button
                onClick={() => setDossierTierFilter('mook')}
                className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                  dossierTierFilter === 'mook'
                    ? 'bg-zinc-800 border-zinc-500 text-zinc-100 font-bold'
                    : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-zinc-400" />
                <span>Capangas / Mooks ({mookCount})</span>
              </button>
              <button
                onClick={() => setDossierTierFilter('lieutenant')}
                className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                  dossierTierFilter === 'lieutenant'
                    ? 'bg-blue-950/80 border-blue-600 text-blue-200 font-bold'
                    : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Tenentes ({lieutenantCount})</span>
              </button>
              <button
                onClick={() => setDossierTierFilter('miniboss')}
                className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                  dossierTierFilter === 'miniboss'
                    ? 'bg-purple-950/80 border-purple-600 text-purple-200 font-bold'
                    : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span>Mini-Chefes ({minibossCount})</span>
              </button>
              <button
                onClick={() => setDossierTierFilter('boss')}
                className={`px-2.5 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                  dossierTierFilter === 'boss'
                    ? 'bg-red-950/90 border-red-600 text-red-200 font-bold'
                    : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Skull className="w-3.5 h-3.5 text-red-500" />
                <span>Chefes / Ciberpsicos ({bossCount})</span>
              </button>
            </div>
          </div>

          {/* 3. MASTER-DETAIL SPLIT VIEW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: LIST OF NPCS */}
            <div className="lg:col-span-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1 pb-1">
                <span>Catálogo de NPCs ({filteredBestiary.length})</span>
                <span>Clique para abrir o dossiê</span>
              </div>

              {filteredBestiary.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#121217] border border-[#27272a] text-center space-y-2">
                  <AlertCircle className="w-6 h-6 text-zinc-500 mx-auto" />
                  <p className="text-xs text-zinc-300">Nenhum combatente encontrado com os filtros atuais.</p>
                  <button
                    onClick={() => {
                      setDossierSearch('');
                      setDossierTierFilter('all');
                      setDossierFactionFilter('all');
                      setDossierSystemFilter('all');
                    }}
                    className="text-xs text-red-400 underline font-mono"
                  >
                    Limpar todos os filtros
                  </button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
                  {filteredBestiary.map(enemy => {
                    const isSelected = selectedBestiaryEnemy?.id === enemy.id;
                    return (
                      <div
                        key={enemy.id}
                        onClick={() => setSelectedBestiaryEnemy(enemy)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-zinc-800/80 border-red-500/70 shadow-lg'
                            : 'bg-[#121217] border-[#27272a] hover:bg-zinc-800/40 hover:border-zinc-700'
                        }`}
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold ${
                              enemy.tier === 'civilian'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                                : enemy.tier === 'pet'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                                : enemy.tier === 'mook'
                                ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                                : enemy.tier === 'lieutenant'
                                ? 'bg-blue-950 text-blue-300 border border-blue-800/40'
                                : enemy.tier === 'miniboss'
                                ? 'bg-purple-950 text-purple-300 border border-purple-800/40'
                                : 'bg-red-950 text-red-300 border border-red-800/40'
                            }`}>
                              {enemy.tier === 'pet' ? '🐾 Pet' : enemy.tier === 'civilian' ? 'Civil' : enemy.tier.toUpperCase()}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500">
                              {enemy.system}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-400 truncate">
                              • {enemy.faction}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-zinc-100 truncate">{enemy.name}</h4>
                          <p className="text-[11px] text-zinc-400 truncate">{enemy.role}</p>

                          <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-zinc-400">
                            <span className="text-red-400 font-bold">HP {enemy.hp}</span>
                            <span>•</span>
                            <span>SP {enemy.bodySP}</span>
                            <span>•</span>
                            <span className="text-amber-400">Combate #{enemy.combatNumber || (enemy.ref + 6)}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 shrink-0 pt-0.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenBestiaryAttack(enemy, enemy.weapons[0]);
                            }}
                            className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-[10px] transition"
                            title="Rolar ataque com arma primária"
                          >
                            <Sword className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendBestiaryToCombat(enemy);
                            }}
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] transition"
                            title="Enviar ao combate ativo"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: DETAILED DOSSIER CARD */}
            <div className="lg:col-span-7">
              {selectedBestiaryEnemy ? (
                <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-5 animate-in fade-in duration-200 shadow-2xl">
                  {/* Header with Title and Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          selectedBestiaryEnemy.tier === 'civilian'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                            : selectedBestiaryEnemy.tier === 'pet'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800/50'
                            : selectedBestiaryEnemy.tier === 'mook'
                            ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                            : selectedBestiaryEnemy.tier === 'lieutenant'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800/50'
                            : selectedBestiaryEnemy.tier === 'miniboss'
                            ? 'bg-purple-950 text-purple-300 border border-purple-800/50'
                            : 'bg-red-950 text-red-300 border border-red-700/60'
                        }`}>
                          {selectedBestiaryEnemy.tier === 'pet' ? '🐾 Pet / Animal Cibernético' : selectedBestiaryEnemy.tier === 'civilian' ? 'Civil / Everyday People' : selectedBestiaryEnemy.tier.toUpperCase()}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/60 text-zinc-400 border border-zinc-700/60">
                          {selectedBestiaryEnemy.system}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {selectedBestiaryEnemy.citation}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-zinc-100">{selectedBestiaryEnemy.name}</h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        <strong className="text-zinc-200">{selectedBestiaryEnemy.role}</strong> • {selectedBestiaryEnemy.faction}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleSendBestiaryToCombat(selectedBestiaryEnemy)}
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs tracking-wider uppercase transition shadow flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Enviar ao Combate</span>
                      </button>
                      <button
                        onClick={() => handleSaveBestiaryToLibrary(selectedBestiaryEnemy)}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition flex items-center gap-1.5"
                        title="Salvar na Biblioteca da Campanha"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                        <span>Salvar</span>
                      </button>
                      <button
                        onClick={() => handleCopyBestiary(selectedBestiaryEnemy)}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                        title="Copiar Ficha do Dossiê"
                      >
                        {dossierCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Atmospheric Quote / Dialogue Hook */}
                  {selectedBestiaryEnemy.dialogueHook && (
                    <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 text-xs text-red-200 italic font-mono flex items-start gap-2.5">
                      <MessageSquare className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{selectedBestiaryEnemy.dialogueHook}</span>
                    </div>
                  )}

                  {/* Sensory Visual Appearance & Aesthetic Box */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Aparência Visual & Estética das Ruas:</span>
                    </span>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {selectedBestiaryEnemy.appearance || selectedBestiaryEnemy.description}
                    </p>
                  </div>

                  {/* Contextual Narrative: Personality, Quirks, Motivation & Secret */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">
                        Maneirismos & Personalidade:
                      </span>
                      <p className="text-zinc-300 text-xs leading-relaxed">
                        {selectedBestiaryEnemy.quirks || 'Comportamento profissional e focado nas ruas de Night City.'}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">
                        Motivação & Segredo Imediato:
                      </span>
                      <p className="text-zinc-300 text-xs leading-relaxed">
                        {selectedBestiaryEnemy.motivation || 'Cumprir as ordens da facção e sobreviver aos perigos da cidade.'}
                      </p>
                    </div>
                  </div>

                  {/* Tactical Directives & Surrender Protocol */}
                  <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold">
                      <ShieldAlert className="w-4 h-4" />
                      <span>Comportamento Tático & Gatilho de Rendição / Fuga</span>
                    </div>
                    <p className="text-amber-200/90 leading-relaxed">{selectedBestiaryEnemy.tactics}</p>
                    {selectedBestiaryEnemy.surrenderTrigger && (
                      <div className="text-[11px] font-mono text-zinc-400 bg-black/40 p-2 rounded-lg border border-amber-900/30">
                        <strong className="text-amber-300">Gatilho de Rendição:</strong> {selectedBestiaryEnemy.surrenderTrigger}
                      </div>
                    )}
                  </div>

                  {/* Special Ability if Present */}
                  {selectedBestiaryEnemy.specialAbility && (
                    <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-purple-300 font-mono font-bold">
                        <Sparkles className="w-4 h-4" />
                        <span>Habilidade Especial / Regra Única</span>
                      </div>
                      <p className="text-purple-200/90">{selectedBestiaryEnemy.specialAbility}</p>
                    </div>
                  )}

                  {/* Vitals HUD & Stats */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-3">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">
                      Estatísticas de Combate & Vitalidade:
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                      <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-900/40">
                        <span className="text-[10px] text-zinc-400 block">Pontos de Vida (HP)</span>
                        <strong className="text-base text-red-400">{selectedBestiaryEnemy.hp}</strong>
                        <span className="text-[9px] text-zinc-500 block">Grave: {Math.ceil(selectedBestiaryEnemy.hp / 2)}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-900/40">
                        <span className="text-[10px] text-zinc-400 block">Blindagem Cabeça</span>
                        <strong className="text-base text-blue-300">SP {selectedBestiaryEnemy.headSP}</strong>
                        <span className="text-[9px] text-zinc-500 block">Capacete / Implante</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-blue-950/30 border border-blue-900/40">
                        <span className="text-[10px] text-zinc-400 block">Blindagem Corpo</span>
                        <strong className="text-base text-blue-300">SP {selectedBestiaryEnemy.bodySP}</strong>
                        <span className="text-[9px] text-zinc-500 block">Colete / Subdermal</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-900/40">
                        <span className="text-[10px] text-zinc-400 block">Combat Number</span>
                        <strong className="text-base text-amber-400">
                          #{selectedBestiaryEnemy.combatNumber || (selectedBestiaryEnemy.ref + 6)}
                        </strong>
                        <span className="text-[9px] text-zinc-500 block">Perícias Base 1d10</span>
                      </div>
                    </div>

                    {/* Attributes Bar */}
                    <div className="grid grid-cols-6 gap-1 text-center font-mono text-xs pt-1 border-t border-zinc-800">
                      <div className="p-1 rounded bg-zinc-900/60">
                        <span className="text-[9px] text-zinc-500 block">MOVE</span>
                        <span className="text-zinc-200 font-bold">{selectedBestiaryEnemy.move}</span>
                      </div>
                      <div className="p-1 rounded bg-zinc-900/60">
                        <span className="text-[9px] text-zinc-500 block">REF</span>
                        <span className="text-zinc-200 font-bold">{selectedBestiaryEnemy.ref}</span>
                      </div>
                      <div className="p-1 rounded bg-zinc-900/60">
                        <span className="text-[9px] text-zinc-500 block">DEX</span>
                        <span className="text-zinc-200 font-bold">{selectedBestiaryEnemy.dex}</span>
                      </div>
                      <div className="p-1 rounded bg-zinc-900/60">
                        <span className="text-[9px] text-zinc-500 block">BODY</span>
                        <span className="text-zinc-200 font-bold">{selectedBestiaryEnemy.body}</span>
                      </div>
                      <div className="p-1 rounded bg-zinc-900/60">
                        <span className="text-[9px] text-zinc-500 block">WILL</span>
                        <span className="text-zinc-200 font-bold">{selectedBestiaryEnemy.will}</span>
                      </div>
                      <div className="p-1 rounded bg-zinc-900/60">
                        <span className="text-[9px] text-zinc-500 block">SAVE</span>
                        <span className="text-zinc-200 font-bold">DV {selectedBestiaryEnemy.body}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arsenal & Weapons Matrix with Live Attack Rolls */}
                  <div className="space-y-2">
                    <span className="text-xs font-mono uppercase text-zinc-400 font-semibold block flex items-center justify-between">
                      <span>Armamento & Ataques Oficiais ({selectedBestiaryEnemy.weapons.length}):</span>
                      <span className="text-[10px] text-red-400 lowercase font-normal">clique em 'rolar ataque' para testar</span>
                    </span>

                    <div className="space-y-2">
                      {selectedBestiaryEnemy.weapons.map((w, wIdx) => (
                        <div
                          key={wIdx}
                          className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <Sword className="w-3.5 h-3.5 text-red-500" />
                              <strong className="text-zinc-200">{w.name}</strong>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-red-300 font-bold">
                                {w.damage}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-500">
                                ROF {w.rof}
                              </span>
                            </div>
                            {w.notes && (
                              <p className="text-[11px] text-zinc-400 mt-0.5 ml-5">{w.notes}</p>
                            )}
                          </div>

                          <button
                            onClick={() => handleOpenBestiaryAttack(selectedBestiaryEnemy, w)}
                            className="px-3 py-1.5 rounded-lg bg-red-600/90 hover:bg-red-600 text-white font-semibold text-xs transition shadow flex items-center gap-1.5 shrink-0"
                          >
                            <Crosshair className="w-3.5 h-3.5" />
                            <span>Rolar Ataque</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cyberware & Gear */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Ciberware Instalado:</span>
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {selectedBestiaryEnemy.cyberware.map((c, cIdx) => (
                          <span key={cIdx} className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px] font-mono">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1.5">
                      <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        <span>Equipamento & Pertences:</span>
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {selectedBestiaryEnemy.equipment.map((eq, eqIdx) => (
                          <span key={eqIdx} className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px]">
                            {eq}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 rounded-2xl bg-[#121217] border border-[#27272a] text-center text-zinc-500 text-xs">
                  Selecione um NPC da lista à esquerda para carregar seu dossiê completo.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: GERADOR DE INIMIGOS & AMEAÇAS HOSTIS DE COMBATE */}
      {activeTab === 'enemies' && (
        <div className="space-y-6">
          {/* Toast Notification */}
          {npcToast && (
            <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/60 text-red-300 font-mono text-xs flex items-center justify-between shadow-lg animate-pulse">
              <span className="flex items-center gap-2">
                <Sword className="w-4 h-4 text-red-400" />
                {npcToast}
              </span>
              <button onClick={() => setNpcToast(null)} className="text-zinc-400 hover:text-zinc-100">&times;</button>
            </div>
          )}

          {/* Banner Top Info */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#171212] via-[#201515] to-[#171212] border border-red-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
                  Cyberpunk RED Corebook & Danger Gal Dossier
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Módulo Exclusivo de Inimigos & Combate</span>
              </div>
              <h2 className="text-base font-bold text-zinc-100 mt-1 flex items-center gap-2">
                <Sword className="w-4 h-4 text-red-500" />
                <span>Gerador de Inimigos, Ameaças & Ciberpsicopatas</span>
              </h2>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
              {system === 'RED' ? 'Regras Cyberpunk RED' : 'Regras Cyberpunk 2020'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls Column (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* 1. Threat Tier Selection (No Pets - Pets have their own tab) */}
              <div className="p-4 rounded-xl bg-[#121217] border border-[#27272a] space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block font-mono flex items-center justify-between">
                  <span>1. Escalão de Ameaça (Tier)</span>
                  <span className="text-[10px] font-normal text-zinc-500">Regras Oficiais</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'mook', label: 'Capanga / Mook', hp: '30 HP', sub: 'Combate Comum de Rua', border: 'border-zinc-700' },
                    { id: 'lieutenant', label: 'Tenente / LT', hp: '40 HP', sub: 'Especialista & Tático', border: 'border-cyan-800/60' },
                    { id: 'miniboss', label: 'Mini-Chefe', hp: '50 HP', sub: 'Comandante Blindado', border: 'border-amber-800/60' },
                    { id: 'boss', label: 'Chefe / Ciberpsico', hp: '65 HP', sub: 'Ameaça Mortal de Elite', border: 'border-red-800/60' },
                  ].map(t => {
                    const isSelected = selectedTier === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTier(t.id as NPCTier)}
                        className={`p-2.5 rounded-lg border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-500 text-zinc-100 shadow-sm'
                            : 'bg-[#0a0a0d] border-[#27272a] text-zinc-400 hover:bg-zinc-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-zinc-200">{t.label}</span>
                          <span className="text-[10px] font-mono text-cyan-400 font-bold">{t.hp}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 mt-0.5">{t.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Narrative Archetype Selection (Danger Gal Dossier) */}
              <div className="p-4 rounded-xl bg-[#121217] border border-[#27272a] space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block font-mono">
                  2. Arquétipo & Propósito Narrativo
                </span>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 no-scrollbar">
                  {NARRATIVE_ARCHETYPES.filter(a => a.id !== 'civilian_witness').map(arch => {
                    const isSelected = narrativeArchetype === arch.id;
                    return (
                      <button
                        key={arch.id}
                        type="button"
                        onClick={() => setNarrativeArchetype(arch.id)}
                        className={`w-full p-2.5 rounded-lg border text-left transition flex items-center justify-between text-xs ${
                          isSelected
                            ? 'bg-zinc-800 border-cyan-500/80 text-zinc-100 shadow-sm'
                            : 'bg-[#0a0a0d] border-[#27272a] text-zinc-400 hover:bg-zinc-800/80'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-zinc-200 block">{arch.name}</strong>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-cyan-400 border border-zinc-800">
                              {arch.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{arch.description}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Faction Category Selection */}
              <div className="p-4 rounded-xl bg-[#121217] border border-[#27272a] space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block font-mono">
                  3. Facção & Afiliação
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'gangs', label: 'Gangues de Rua' },
                    { id: 'corps', label: 'Corporações' },
                    { id: 'police', label: 'NCPD / MaxTac' },
                    { id: 'trauma', label: 'Trauma Team™' },
                    { id: 'nomads', label: 'Nômades (Badlands)' },
                    { id: 'independent', label: 'Submundo Livre' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.id as any);
                        if (cat.id === 'corps') setSelectedSubfaction('arasaka');
                        else if (cat.id === 'gangs') setSelectedSubfaction('maelstrom');
                        else if (cat.id === 'police') setSelectedSubfaction('ncpd_patrol');
                        else if (cat.id === 'trauma') setSelectedSubfaction('trauma_standard');
                        else if (cat.id === 'nomads') setSelectedSubfaction('aldecaldos');
                        else if (cat.id === 'independent') setSelectedSubfaction('solo_merc');
                      }}
                      className={`p-2 rounded-lg border text-center transition ${
                        selectedCategory === cat.id
                          ? 'bg-zinc-800 border-cyan-500 text-zinc-100 font-medium shadow-sm'
                          : 'bg-[#0a0a0d] border-[#27272a] text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {selectedCategory === 'gangs' && (
                  <div className="pt-2">
                    <label className="block text-[11px] text-zinc-400 mb-1.5 font-mono">
                      Escolha a Gangue Específica:
                    </label>
                    <select
                      value={selectedSubfaction}
                      onChange={e => setSelectedSubfaction(e.target.value)}
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                    >
                      {GANGS_LIST.map(g => (
                        <option key={g.id} value={g.id}>
                          {g.name} ({g.category}) - Ameaça: {g.threatLevel}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedCategory === 'corps' && (
                  <div className="pt-2">
                    <label className="block text-[11px] text-zinc-400 mb-1.5 font-mono">
                      Escolha a Mega-Corporação:
                    </label>
                    <select
                      value={selectedSubfaction}
                      onChange={e => setSelectedSubfaction(e.target.value)}
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="arasaka">Arasaka Corporation (Segurança Privada & Assassinos)</option>
                      <option value="militech">Militech Arms (Tropa Tática & Blindados)</option>
                      <option value="biotechnica">Biotechnica (Genética & Contenção Biológica)</option>
                      <option value="kang-tao">Kang Tao (Smartguns & Especialistas Chineses)</option>
                      <option value="petrochem">Petrochem (Segurança Industrial de CHOOH2)</option>
                    </select>
                  </div>
                )}

                {selectedCategory === 'police' && (
                  <div className="pt-2">
                    <label className="block text-[11px] text-zinc-400 mb-1.5 font-mono">
                      Escolha o Destacamento Policial:
                    </label>
                    <select
                      value={selectedSubfaction}
                      onChange={e => setSelectedSubfaction(e.target.value)}
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="ncpd_patrol">NCPD - Patrulha de Bairro (Viatura Metropolitana)</option>
                      <option value="ncpd_swat">NCPD - Tropa de Choque (SWAT Operações Táticas)</option>
                      <option value="maxtac">Max-Tac (Psycho Squad - Supressão Ciberpsicótica)</option>
                      <option value="ncpd_detective">NCPD - Divisão de Homicídios & Investigação</option>
                      <option value="k9_division">NCPD - Divisão Tática K-9 & Adestrador Canino</option>
                    </select>
                  </div>
                )}

                {selectedCategory === 'trauma' && (
                  <div className="pt-2">
                    <label className="block text-[11px] text-zinc-400 mb-1.5 font-mono">
                      Escolha o Nível de Resgate Trauma Team:
                    </label>
                    <select
                      value={selectedSubfaction}
                      onChange={e => setSelectedSubfaction(e.target.value)}
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="trauma_standard">Trauma Team Internacional - Resgate Padrão</option>
                      <option value="trauma_platinum">Trauma Team - Platinum Executive VIP Unit</option>
                      <option value="trauma_tactical">Trauma Team - Unidade Tática de Zona Quente</option>
                      <option value="trauma_medevac">Trauma Team - Piloto & Médico de Voo AV-4</option>
                    </select>
                  </div>
                )}

                {selectedCategory === 'nomads' && (
                  <div className="pt-2">
                    <label className="block text-[11px] text-zinc-400 mb-1.5 font-mono">
                      Escolha o Clã / Família Nômade:
                    </label>
                    <select
                      value={selectedSubfaction}
                      onChange={e => setSelectedSubfaction(e.target.value)}
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="aldecaldos">Família Nômade Aldecaldos (Badlands & Tradição)</option>
                      <option value="wraiths">Wraiths (Raffen Shiv - Carniceiros das Rodovias)</option>
                      <option value="jodes">Família Nômade Jodes (Mestres dos Comboios)</option>
                      <option value="snake_nation">Snake Nation (Grande Federação do Deserto)</option>
                      <option value="bakers">Família Nômade The Bakers (Cargas e Oficinas)</option>
                    </select>
                  </div>
                )}

                {selectedCategory === 'independent' && (
                  <div className="pt-2">
                    <label className="block text-[11px] text-zinc-400 mb-1.5 font-mono">
                      Escolha o Papel no Submundo Livre:
                    </label>
                    <select
                      value={selectedSubfaction}
                      onChange={e => setSelectedSubfaction(e.target.value)}
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="solo_merc">Solo Mercenário Autônomo (Afterlife)</option>
                      <option value="fixer_contact">Fixer & Agiota de Beco (Submundo Livre)</option>
                      <option value="netrunner_freelance">Netrunner Freelancer Clandestino</option>
                      <option value="ripperdoc">Ripperdoc de Clínica Clandestina</option>
                      <option value="techie_mechanic">Techie & Armeiro Autônomo</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Opção Extra: Configurar Inimigo com IA (Gemini Co-GM) */}
              <div className="rounded-xl border border-red-900/40 bg-red-950/15 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-red-400" />
                    <span className="text-xs font-bold text-zinc-200">Opção Extra: Configurar Inimigo com IA (Gemini Co-GM)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowEnemyAiOptions(!showEnemyAiOptions)}
                    className="text-[11px] font-mono text-red-400 hover:text-red-300 transition flex items-center gap-1"
                  >
                    <span>{showEnemyAiOptions ? 'Ocultar Opções' : 'Configurar com IA'}</span>
                    {showEnemyAiOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {showEnemyAiOptions && (
                  <div className="space-y-3 pt-2 border-t border-red-950/50 animate-in fade-in duration-150">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">
                        Instruções Táticas / Surpresas para a IA:
                      </label>
                      <input
                        type="text"
                        value={extraNpcContext}
                        onChange={e => setExtraNpcContext(e.target.value)}
                        placeholder="Ex: Emboscada em telhado sob chuva ácida, arma experimental Militech, surto de ciberpsicose..."
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-zinc-400">
                      <span className="text-zinc-500">Sugestões rápidas:</span>
                      {[
                        'Emboscada em telhado sob chuva ácida',
                        'Atirador com rifle smart modificado',
                        'Solo com lâminas mantis e Sandevistan',
                        'Guarda com escudo e armadura cerâmica',
                        'Ciberpsicopata descontrolado e imprevisível',
                      ].map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => setExtraNpcContext(sug)}
                          className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 hover:border-red-500 hover:text-red-300 transition"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleGenerateNarrativeOffline}
                    disabled={isGeneratingNarrativeAI}
                    className="py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Zap className="w-4 h-4 text-red-400" />
                    <span>Gerar Inimigo por Tabelas (Offline)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateNarrativeAI}
                    disabled={isGeneratingNarrativeAI}
                    className="py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition shadow-md shadow-red-950/40"
                  >
                    {isGeneratingNarrativeAI ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-white" />
                        <span>Gerando Inimigo com IA...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Gerar Inimigo com IA Co-GM</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Option to Create Manually from Scratch */}
                <button
                  type="button"
                  onClick={handleCreateManualEnemy}
                  className="w-full py-2.5 rounded-xl bg-[#14141d] hover:bg-[#191924] text-zinc-300 hover:text-white border border-zinc-700/80 hover:border-red-500 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Plus className="w-4 h-4 text-red-400" />
                  <span>+ Criar Novo Inimigo Manualmente</span>
                </button>
              </div>
            </div>

            {/* Sheet Preview Column (7 cols) */}
            <div className="lg:col-span-7">
              {generatedNPC ? (
                <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-5 shadow-lg">
                  {/* Top Sheet Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#27272a] gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative group shrink-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-700/80 shadow-md flex items-center justify-center">
                          {generatedNPC.imageUrl ? (
                            <img
                              src={generatedNPC.imageUrl}
                              alt={generatedNPC.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                            />
                          ) : (
                            <div className="text-zinc-600 flex flex-col items-center">
                              <Skull className="w-7 h-7 text-red-500/70" />
                              <span className="text-[9px] font-mono text-zinc-500 mt-0.5">Sem Foto</span>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => openImageModal(`Foto de ${generatedNPC.name}`, generatedNPC.imageUrl, 'inimigo', url => {
                            setGeneratedNPC(prev => prev ? { ...prev, imageUrl: url } : prev);
                          })}
                          className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-red-400 border border-red-500/40 shadow transition hover:scale-110"
                          title="Alterar Foto do Inimigo (Upload ou Galeria)"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 font-bold">
                            {generatedNPC.tier.toUpperCase()}
                          </span>
                          {generatedNPC.archetype && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/40">
                              {generatedNPC.archetype}
                            </span>
                          )}
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            {generatedNPC.faction}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-zinc-100 mt-1">
                          {generatedNPC.name}
                        </h2>
                        <p className="text-xs text-zinc-400">{generatedNPC.role} &bull; Reputação {generatedNPC.reputation ?? 2}</p>
                      </div>
                    </div>

                    {/* Actions: Edit, Save, Send to Combat, Copy */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(generatedNPC, 'enemy')}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 hover:text-amber-200 border border-amber-600/50 text-xs font-medium flex items-center gap-1.5 transition shadow"
                        title="Editar Estatísticas, Armas e Ficha Completa"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleSendToCombat(generatedNPC)}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium flex items-center gap-1.5 transition"
                        title="Enviar Combatente para o Rastreador Lateral"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                        <span>{sendSuccess ? 'Enviado!' : 'Combate'}</span>
                      </button>
                      <button
                        onClick={() => {
                          saveNPC(generatedNPC);
                          setNpcToast(`Ficha de ${generatedNPC.name} salva na Biblioteca!`);
                          setTimeout(() => setNpcToast(null), 2500);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-medium flex items-center gap-1.5 transition"
                        title="Salvar na Biblioteca da Campanha"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Salvar</span>
                      </button>
                      <button
                        onClick={handleCopy}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700 transition"
                        title="Copiar Ficha em Texto"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* NARRATIVE HIGHLIGHT BOX (DANGER GAL DOSSIER) */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-cyan-950/60 space-y-3">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Dossiê Narrativo & Interpretação de Cena
                    </span>

                    {/* Appearance & Quirks */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase text-zinc-500 block">Aparência & Estilo:</span>
                        <p className="text-zinc-300 leading-relaxed">{generatedNPC.appearance || generatedNPC.description}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase text-zinc-500 block">Maneirismos & Gírias:</span>
                        <p className="text-zinc-300 leading-relaxed">{generatedNPC.quirks || 'Fala pausada e desconfiada.'}</p>
                      </div>
                    </div>

                    {/* Motivation & Secret */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-zinc-800/80 pt-2.5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase text-amber-400 block font-semibold">Motivação Imediata:</span>
                        <p className="text-zinc-300 leading-relaxed">{generatedNPC.motivation || 'Conseguir dinheiro rápido para sobreviver à noite.'}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase text-red-400 block font-semibold">Segredo / Fraqueza:</span>
                        <p className="text-zinc-300 leading-relaxed">{generatedNPC.weaknessOrSecret || 'Deve dinheiro a um agiota violento.'}</p>
                      </div>
                    </div>

                    {/* Dialogue Hook Quote Block */}
                    {generatedNPC.dialogueHook && (
                      <div className="p-3 rounded-lg bg-zinc-900/90 border-l-4 border-cyan-500 flex items-start justify-between gap-2 text-xs">
                        <div className="italic text-cyan-200 font-sans">
                          {generatedNPC.dialogueHook}
                        </div>
                        <button
                          onClick={() => {
                            if (generatedNPC.dialogueHook) {
                              navigator.clipboard.writeText(generatedNPC.dialogueHook);
                              setNpcToast('Fala copiada!');
                              setTimeout(() => setNpcToast(null), 2000);
                            }
                          }}
                          className="text-[10px] font-mono text-zinc-500 hover:text-cyan-300 shrink-0"
                          title="Copiar Fala de Diálogo"
                        >
                          Copiar
                        </button>
                      </div>
                    )}

                    {/* Tactical Morale & Retreat */}
                    <div className="text-xs pt-1 border-t border-zinc-800/60">
                      <span className="text-[10px] font-mono uppercase text-zinc-500 block">Moral Tático & Rendição:</span>
                      <p className="text-zinc-300">{generatedNPC.surrenderTrigger || 'Foge se o HP cair para menos de 50%.'}</p>
                    </div>

                    {/* Pocket Loot */}
                    {generatedNPC.pocketLoot && generatedNPC.pocketLoot.length > 0 && (
                      <div className="text-xs pt-2 border-t border-zinc-800/60">
                        <span className="text-[10px] font-mono uppercase text-emerald-400 block font-semibold mb-1">
                          Saque Narrativo dos Bolsos (Pocket Loot):
                        </span>
                        <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                          {generatedNPC.pocketLoot.map((item, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                              &bull; {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Vital Combat Statistics Display */}
                  {isRed ? (
                    <div className="space-y-4">
                      {/* Key Combat Numbers */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                        <div className="p-2.5 rounded-lg bg-[#0a0a0d] border border-[#27272a]">
                          <span className="text-[10px] text-zinc-500 uppercase block">Combat Number</span>
                          <span className="text-lg font-bold text-red-400">{generatedNPC.statsRED?.combatNumber}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#0a0a0d] border border-[#27272a]">
                          <span className="text-[10px] text-zinc-500 uppercase block">Pontos Vida (HP)</span>
                          <span className="text-lg font-bold text-zinc-100">{generatedNPC.statsRED?.HP}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#0a0a0d] border border-[#27272a]">
                          <span className="text-[10px] text-zinc-500 uppercase block">SP Cabeça</span>
                          <span className="text-lg font-bold text-zinc-200">{generatedNPC.statsRED?.headSP}</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-[#0a0a0d] border border-[#27272a]">
                          <span className="text-[10px] text-zinc-500 uppercase block">SP Corpo</span>
                          <span className="text-lg font-bold text-zinc-200">{generatedNPC.statsRED?.bodySP}</span>
                        </div>
                      </div>

                      {/* 10 RED Attributes Row */}
                      <div className="p-3 rounded-lg bg-[#0a0a0d] border border-[#27272a]">
                        <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1.5">
                          Atributos RED (10 Stats)
                        </span>
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 text-center font-mono text-xs">
                          {['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'].map(stat => (
                            <div key={stat} className="bg-zinc-900/80 p-1.5 rounded border border-zinc-800">
                              <span className="text-[9px] text-zinc-500 block">{stat}</span>
                              <span className="font-bold text-zinc-200">
                                {(generatedNPC.statsRED as any)?.[stat] ?? 6}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2 text-center font-mono">
                        <div className="p-2 rounded bg-[#0a0a0d] border border-[#27272a]">
                          <span className="text-[10px] text-zinc-500 block">BTM</span>
                          <span className="text-base font-bold text-amber-400">{generatedNPC.stats2020?.BTM}</span>
                        </div>
                        <div className="p-2 rounded bg-[#0a0a0d] border border-[#27272a]">
                          <span className="text-[10px] text-zinc-500 block">SP Cabeça</span>
                          <span className="text-base font-bold text-zinc-200">{generatedNPC.stats2020?.headSP}</span>
                        </div>
                        <div className="p-2 rounded bg-[#0a0a0d] border border-[#27272a]">
                          <span className="text-[10px] text-zinc-500 block">SP Tronco</span>
                          <span className="text-base font-bold text-zinc-200">{generatedNPC.stats2020?.torsoSP}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Weapons & Cyberware */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-[#0a0a0d] border border-[#27272a] space-y-2">
                      <span className="text-[11px] font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
                        <Sword className="w-3.5 h-3.5 text-red-500" /> Armamento
                      </span>
                      <ul className="space-y-1.5 text-zinc-300">
                        {generatedNPC.weapons.map((w, idx) => (
                          <li key={idx} className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-2 bg-zinc-900/80 px-2.5 py-1.5 rounded border border-zinc-800">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {getWeaponIcon(w.name, "w-4 h-4 text-red-400 shrink-0")}
                              <span className="text-zinc-200 font-medium truncate">{w.name}</span>
                              <span className="font-mono text-amber-400 font-bold text-[11px] shrink-0">({w.damage})</span>
                            </div>
                            <button
                              onClick={() => handleOpenNpcAttack(generatedNPC, w)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-mono text-[10px] font-bold transition shadow-sm shrink-0"
                              title="Rolar teste de ataque e dano com esta arma"
                            >
                              <Crosshair className="w-3 h-3 text-red-400" />
                              <span>Rolar Ataque</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#0a0a0d] border border-[#27272a] space-y-2">
                      <span className="text-[11px] font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-cyan-500" /> Ciberware & Implantes
                      </span>
                      <ul className="space-y-1 text-zinc-300">
                        {generatedNPC.cyberware.map((c, idx) => (
                          <li key={idx} className="bg-zinc-900/60 px-2.5 py-1.5 rounded flex items-center gap-2 border border-zinc-800/60">
                            {getCyberwareIcon(c, "w-3.5 h-3.5 text-cyan-400 shrink-0")}
                            <span className="text-zinc-200 truncate">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 rounded-2xl bg-[#121217] border border-dashed border-[#27272a] text-center space-y-3">
                  <Users className="w-10 h-10 text-zinc-600 mx-auto" />
                  <h3 className="text-sm font-semibold text-zinc-300">Nenhum combatente gerado ainda</h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Selecione o escalão de ameaça, o arquétipo e a facção ao lado e clique em <strong>"Gerar por Tabelas"</strong> ou <strong>"Gerar com IA Co-GM"</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: GERADOR DEDICADO DE CIVIS & CIDADÃOS COMUNS       */}
      {/* ======================================================== */}
      {activeTab === 'civilians' && (
        <div className="space-y-6">
          {/* Toast Notification */}
          {civilianToast && (
            <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 font-mono text-xs flex items-center justify-between shadow-lg animate-in fade-in zoom-in-95 duration-150">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                {civilianToast}
              </span>
              <button onClick={() => setCivilianToast(null)} className="text-zinc-400 hover:text-zinc-100">&times;</button>
            </div>
          )}

          {/* Banner Top Info */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#101717] via-[#121c1c] to-[#101717] border border-cyan-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold">
                  Cyberpunk RED Everyday People DLC & Night City Lore
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Módulo de Cidadãos, Não-Combatentes & Testemunhas</span>
              </div>
              <h2 className="text-base font-bold text-zinc-100 mt-1 flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Gerador Dedicado de Civis & Cidadãos de Night City</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Cidadãos desarmados, operários, comerciantes, vítimas de gangues e testemunhas oculares com dramas pessoais, segredos e reações de pânico.
              </p>
            </div>
            <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
              {system === 'RED' ? 'Regras Everyday People' : 'Regras Cyberpunk 2020'}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls Column (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* 1. Ocupação Civil */}
              <div className="p-4 rounded-xl bg-[#121217] border border-[#27272a] space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block font-mono flex items-center justify-between">
                  <span>1. Ocupação Civil (Everyday People)</span>
                  <span className="text-[10px] font-normal text-zinc-500">{CIVILIAN_OCCUPATIONS.length} Profissões</span>
                </span>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 no-scrollbar">
                  {CIVILIAN_OCCUPATIONS.map(occ => {
                    const isSelected = civilianOccupationId === occ.id;
                    return (
                      <button
                        key={occ.id}
                        type="button"
                        onClick={() => setCivilianOccupationId(occ.id)}
                        className={`w-full p-2.5 rounded-lg border text-left transition flex items-center justify-between text-xs ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-500 text-zinc-100 shadow-sm'
                            : 'bg-[#0a0a0d] border-[#27272a] text-zinc-400 hover:bg-zinc-800/80'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-zinc-200 block">{occ.name}</strong>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-cyan-400 border border-zinc-800">
                              {occ.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{occ.description}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Distrito de Origem */}
              <div className="p-4 rounded-xl bg-[#121217] border border-[#27272a] space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block font-mono">
                  2. Bairro / Distrito de Origem
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {CIVILIAN_DISTRICTS.map(dist => {
                    const isSelected = civilianDistrictId === dist.id;
                    return (
                      <button
                        key={dist.id}
                        type="button"
                        onClick={() => setCivilianDistrictId(dist.id)}
                        className={`p-2 rounded-lg border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-500 text-zinc-100 font-medium shadow-sm'
                            : 'bg-[#0a0a0d] border-[#27272a] text-zinc-400 hover:bg-zinc-800'
                        }`}
                      >
                        <span className="font-semibold text-zinc-200">{dist.name.split(' ')[0]}</span>
                        <span className="text-[9px] text-zinc-500 truncate">{dist.socialClass}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Opção Extra com IA */}
              <div className="rounded-xl border border-cyan-900/40 bg-cyan-950/15 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-zinc-200">Opção Extra: Configurar Civil com IA (Gemini Co-GM)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCivilianAiOptions(!showCivilianAiOptions)}
                    className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition flex items-center gap-1"
                  >
                    <span>{showCivilianAiOptions ? 'Ocultar Opções' : 'Configurar com IA'}</span>
                    {showCivilianAiOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {showCivilianAiOptions && (
                  <div className="space-y-3 pt-2 border-t border-cyan-950/50 animate-in fade-in duration-150">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">
                        Contexto do Encontro / História Pessoal para a IA:
                      </label>
                      <input
                        type="text"
                        value={extraCivilianContext}
                        onChange={e => setExtraCivilianContext(e.target.value)}
                        placeholder="Ex: Dono de mercearia que viu assassinato da Arasaka, precisa de resgate para a filha..."
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-zinc-400">
                      <span className="text-zinc-500">Sugestões rápidas:</span>
                      {[
                        'Viu a van preta da Arasaka descarregando refém',
                        'Dívida de extorsão com gangue de Watson',
                        'Enfermeiro clandestino que tratou um Edgerunner',
                        'Garçom que ouviu segredo no banheiro do Afterlife',
                        'Testemunha amedrontada querendo fugir da cidade',
                      ].map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => setExtraCivilianContext(sug)}
                          className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 hover:border-cyan-500 hover:text-cyan-300 transition"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleGenerateCivilianOffline}
                    disabled={isGeneratingCivilianAI}
                    className="py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>Gerar Civil por Tabelas (Offline)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateCivilianAI}
                    disabled={isGeneratingCivilianAI}
                    className="py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition shadow-md shadow-cyan-950/40"
                  >
                    {isGeneratingCivilianAI ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-white" />
                        <span>IA Criando Civil...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Gerar Civil com IA Co-GM</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Option to Create Civilian Manually */}
                <button
                  type="button"
                  onClick={handleCreateManualCivilian}
                  className="w-full py-2.5 rounded-xl bg-[#14141d] hover:bg-[#191924] text-zinc-300 hover:text-white border border-zinc-700/80 hover:border-cyan-500 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>+ Criar Cidadão Civil Manualmente</span>
                </button>
              </div>
            </div>

            {/* Civilian Sheet Preview Column (7 cols) */}
            <div className="lg:col-span-7">
              {generatedCivilian ? (
                <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-5 shadow-lg">
                  {/* Top Sheet Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#27272a] gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative group shrink-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-700/80 shadow-md flex items-center justify-center">
                          {generatedCivilian.imageUrl ? (
                            <img
                              src={generatedCivilian.imageUrl}
                              alt={generatedCivilian.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                            />
                          ) : (
                            <div className="text-zinc-600 flex flex-col items-center">
                              <UserCheck className="w-7 h-7 text-cyan-400/80" />
                              <span className="text-[9px] font-mono text-zinc-500 mt-0.5">Sem Foto</span>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => openImageModal(`Foto de ${generatedCivilian.name}`, generatedCivilian.imageUrl, 'personagem', url => {
                            setGeneratedCivilian(prev => prev ? { ...prev, imageUrl: url } : prev);
                          })}
                          className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-cyan-500/40 shadow transition hover:scale-110"
                          title="Alterar Foto do Cidadão (Upload ou Galeria)"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 font-bold">
                            CIVIL (EVERYDAY PEOPLE)
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                            {generatedCivilian.archetype}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            {generatedCivilian.faction}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-zinc-100 mt-1">
                          {generatedCivilian.name}
                        </h2>
                        <p className="text-xs text-zinc-400">{generatedCivilian.role} &bull; Não-Combatente</p>
                      </div>
                    </div>

                    {/* Actions: Edit, Save, Copy */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(generatedCivilian, 'civilian')}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 hover:text-amber-200 border border-amber-600/50 text-xs font-medium flex items-center gap-1.5 transition shadow"
                        title="Editar Dados e Ficha Civil"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => {
                          saveNPC(generatedCivilian);
                          setCivilianToast(`Ficha de ${generatedCivilian.name} salva na Biblioteca!`);
                          setTimeout(() => setCivilianToast(null), 2500);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center gap-1.5 transition shadow"
                        title="Salvar na Biblioteca da Campanha"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Salvar</span>
                      </button>
                      <button
                        onClick={handleCopyCivilian}
                        className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700 transition"
                        title="Copiar Ficha Civil"
                      >
                        {civilianCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Narrative Dossier */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-cyan-950/60 space-y-3">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Dossiê Humano & Interpretação de Cena
                    </span>

                    {/* Appearance & Quirks */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase text-zinc-500 block">Roupas do Dia a Dia & Aparência:</span>
                        <p className="text-zinc-300 leading-relaxed">{generatedCivilian.appearance || generatedCivilian.description}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase text-zinc-500 block">Maneirismos & Cotidiano:</span>
                        <p className="text-zinc-300 leading-relaxed">{generatedCivilian.quirks}</p>
                      </div>
                    </div>

                    {/* Motivation & Secret */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-zinc-800/80 pt-2.5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase text-amber-400 block font-semibold">Drama Pessoal / O Que Precisa:</span>
                        <p className="text-zinc-300 leading-relaxed">{generatedCivilian.motivation}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase text-cyan-400 block font-semibold">Segredo ou Rumor que Sabe:</span>
                        <p className="text-zinc-300 leading-relaxed">{generatedCivilian.weaknessOrSecret}</p>
                      </div>
                    </div>

                    {/* Dialogue Quote */}
                    {generatedCivilian.dialogueHook && (
                      <div className="p-3 rounded-lg bg-zinc-900/90 border-l-4 border-cyan-500 flex items-start justify-between gap-2 text-xs">
                        <div className="italic text-cyan-200 font-sans">
                          {generatedCivilian.dialogueHook}
                        </div>
                        <button
                          onClick={() => {
                            if (generatedCivilian.dialogueHook) {
                              navigator.clipboard.writeText(generatedCivilian.dialogueHook);
                              setCivilianToast('Fala copiada!');
                              setTimeout(() => setCivilianToast(null), 2000);
                            }
                          }}
                          className="text-[10px] font-mono text-zinc-500 hover:text-cyan-300 shrink-0"
                          title="Copiar Fala de Diálogo"
                        >
                          Copiar
                        </button>
                      </div>
                    )}

                    {/* Panic Protocol */}
                    <div className="text-xs pt-2 border-t border-zinc-800/60 bg-red-950/20 p-3 rounded-lg border border-red-900/30">
                      <span className="text-[10px] font-mono uppercase text-red-400 block font-bold flex items-center gap-1.5 mb-1">
                        <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                        <span>Reação sob Tiroteio / Protocolo de Pânico:</span>
                      </span>
                      <p className="text-red-200/90">{generatedCivilian.surrenderTrigger}</p>
                    </div>

                    {/* Everyday Pocket Loot */}
                    {generatedCivilian.pocketLoot && generatedCivilian.pocketLoot.length > 0 && (
                      <div className="text-xs pt-2 border-t border-zinc-800/60">
                        <span className="text-[10px] font-mono uppercase text-emerald-400 block font-semibold mb-1">
                          Saque dos Bolsos Civis (Everyday Pocket Loot):
                        </span>
                        <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                          {generatedCivilian.pocketLoot.map((item, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                              &bull; {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Vitals Stats Display */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-3">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">
                      Estatísticas de Cidadão Comum (Everyday People):
                    </span>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 uppercase block">Combat Number</span>
                        <span className="text-base font-bold text-zinc-400">#7 (Básico)</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/30">
                        <span className="text-[10px] text-zinc-500 uppercase block">Pontos Vida (HP)</span>
                        <span className="text-base font-bold text-red-400">{generatedCivilian.statsRED?.HP || 25}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 uppercase block">Blindagem Cabeça</span>
                        <span className="text-base font-bold text-zinc-400">SP 0 (Civil)</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800">
                        <span className="text-[10px] text-zinc-500 uppercase block">Blindagem Corpo</span>
                        <span className="text-base font-bold text-zinc-300">SP {generatedCivilian.statsRED?.bodySP || 0}</span>
                      </div>
                    </div>

                    {/* Self Defense Gear */}
                    <div className="pt-2 border-t border-zinc-800 text-xs">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">
                        Autodefesa Improvisada & Ferramentas de Trabalho:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {generatedCivilian.weapons.map((w, wIdx) => (
                          <span key={wIdx} className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-xs flex items-center gap-1.5">
                            <span className="text-amber-400">&bull;</span>
                            <span>{w.name}</span>
                            <span className="text-zinc-500">({w.damage})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 rounded-2xl bg-[#121217] border border-dashed border-[#27272a] text-center space-y-3">
                  <Users className="w-10 h-10 text-zinc-600 mx-auto" />
                  <h3 className="text-sm font-semibold text-zinc-300">Nenhum cidadão civil gerado ainda</h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Selecione a ocupação e o distrito ao lado e clique em <strong>"Gerar Civil por Tabelas"</strong> ou <strong>"Gerar Civil com IA Co-GM"</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB NOVO: GERADOR DE TROPAS & QUADRILHAS DE INIMIGOS     */}
      {/* ======================================================== */}
      {activeTab === 'squads' && (
        <div className="space-y-6">
          {/* Toast Notification */}
          {squadToast && (
            <div className="p-3.5 rounded-xl bg-amber-950/80 border border-amber-500/60 text-amber-300 font-mono text-xs flex items-center justify-between shadow-lg animate-in fade-in zoom-in-95 duration-150">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
                {squadToast}
              </span>
              <button onClick={() => setSquadToast(null)} className="text-zinc-400 hover:text-zinc-100">&times;</button>
            </div>
          )}

          {/* SQUAD PRESET SELECTOR STRIP */}
          <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>Tipo de Tropa / Esquadrão Especializado</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Selecione uma força canônica ou monte uma quadrilha customizada para gerar a tropa inteira pronta para o combate.
                </p>
              </div>
              <span className="text-[11px] font-mono text-zinc-500 self-start sm:self-auto">
                13 Presets Oficiais & Personalizável
              </span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {Object.values(SQUAD_PRESET_DEFINITIONS).map(preset => {
                const isSelected = squadPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSquadPresetId(preset.id);
                      setSquadThreatLevel(preset.defaultThreat);
                      setSquadSize(preset.defaultSize);
                      if (preset.id !== 'custom') {
                        setSquadCustomFaction('');
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                      isSelected
                        ? `${preset.colorTheme.badgeBg} ${preset.colorTheme.badgeBorder} ring-2 ring-amber-500/50 shadow-md`
                        : 'bg-[#0a0a0d] border-zinc-800 hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <div>
                      <span className={`text-[9px] font-mono uppercase tracking-wider block font-bold mb-1 ${
                        isSelected ? preset.colorTheme.badgeText : 'text-zinc-500'
                      }`}>
                        {preset.badge}
                      </span>
                      <h4 className="text-xs font-bold text-zinc-100 leading-tight">
                        {preset.name.split(' (')[0]}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-800/60 text-[10px] font-mono text-zinc-400">
                      <span>{preset.defaultThreat}</span>
                      <span>{preset.defaultSize} membros</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN SQUAD GENERATOR GRID (CONTROLS + DISPLAY) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: CONFIGURATION PANEL */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
              <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                <h3 className="text-xs font-mono uppercase font-bold text-zinc-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-500" />
                  <span>Parâmetros da Tropa</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  {SQUAD_PRESET_DEFINITIONS[squadPresetId].category.toUpperCase()}
                </span>
              </div>

              {/* Faction Field */}
              <div>
                <label className="block text-zinc-400 font-mono text-xs mb-1">Facção / Organização:</label>
                {squadPresetId === 'custom' ? (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={squadCustomFaction}
                      onChange={e => setSquadCustomFaction(e.target.value)}
                      placeholder="ex: Mercenários da Zona de Combate, Segurança de Cassino..."
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 font-mono"
                    />
                    <select
                      onChange={e => setSquadCustomFaction(e.target.value)}
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-xs text-zinc-400 focus:outline-none focus:border-amber-500"
                    >
                      <option value="">Ou selecione uma facção do sistema...</option>
                      {GANGS_LIST.map(g => (
                        <option key={g.id} value={g.name}>{g.name} ({g.category})</option>
                      ))}
                      {FACTIONS_LIST.map(f => (
                        <option key={f.id} value={f.name}>{f.name} ({f.category})</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-[#0a0a0d] border border-zinc-800 text-xs font-mono text-amber-300 flex items-center justify-between">
                    <span>{SQUAD_PRESET_DEFINITIONS[squadPresetId].defaultFaction}</span>
                    <button
                      type="button"
                      onClick={() => setSquadPresetId('custom')}
                      className="text-[10px] text-zinc-500 hover:text-amber-400 underline"
                    >
                      Mudar
                    </button>
                  </div>
                )}
              </div>

              {/* Threat Level */}
              <div>
                <label className="block text-zinc-400 font-mono text-xs mb-1.5">Nível de Ameaça do Esquadrão:</label>
                <div className="grid grid-cols-5 gap-1 text-[11px] font-mono">
                  {(['Baixo', 'Médio', 'Alto', 'Extremo', 'Pesadelo'] as SquadThreatLevel[]).map(t => {
                    const isSelected = squadThreatLevel === t;
                    const color =
                      t === 'Pesadelo' ? 'text-purple-400 border-purple-600 bg-purple-950/60' :
                      t === 'Extremo' ? 'text-red-400 border-red-600 bg-red-950/60' :
                      t === 'Alto' ? 'text-orange-400 border-orange-600 bg-orange-950/60' :
                      t === 'Médio' ? 'text-amber-400 border-amber-600 bg-amber-950/60' :
                      'text-emerald-400 border-emerald-600 bg-emerald-950/60';
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setSquadThreatLevel(t)}
                        className={`py-1.5 px-1 rounded-lg border text-center transition font-bold ${
                          isSelected ? `${color} ring-1 ring-white/20` : 'bg-[#0a0a0d] border-zinc-800 text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Squad Size Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Tamanho do Esquadrão:</span>
                  <span className="text-amber-300 font-bold text-sm">{squadSize} combatentes</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={squadSize}
                  onChange={e => setSquadSize(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mt-1">
                  <button type="button" onClick={() => setSquadSize(3)} className="hover:text-amber-400">Patrulha (3)</button>
                  <button type="button" onClick={() => setSquadSize(4)} className="hover:text-amber-400">Padrão (4)</button>
                  <button type="button" onClick={() => setSquadSize(6)} className="hover:text-amber-400">Choque (6)</button>
                  <button type="button" onClick={() => setSquadSize(8)} className="hover:text-amber-400">Bando (8)</button>
                </div>
              </div>

              {/* Composition Toggles */}
              <div className="space-y-2 pt-1 border-t border-zinc-800/80">
                <span className="block text-[11px] font-mono text-zinc-400 font-bold">Composição Tática Especial:</span>
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={squadIncludeHeavy}
                    onChange={e => setSquadIncludeHeavy(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-0"
                  />
                  <span>Incluir Operador Pesado / Escudeiro</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={squadIncludeNetrunner}
                    onChange={e => setSquadIncludeNetrunner(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-0"
                  />
                  <span>Incluir Netrunner Especialista (Black ICE)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={squadIncludeSniper}
                    onChange={e => setSquadIncludeSniper(e.target.checked)}
                    className="rounded border-zinc-700 bg-zinc-900 text-amber-500 focus:ring-0"
                  />
                  <span>Incluir Franco-Atirador / Sniper</span>
                </label>
              </div>

              {/* Mission Context */}
              <div>
                <label className="block text-zinc-400 font-mono text-xs mb-1">Contexto da Cena / Missão (Opcional):</label>
                <textarea
                  rows={2}
                  value={squadMissionContext}
                  onChange={e => setSquadMissionContext(e.target.value)}
                  placeholder="ex: Mandado de prisão em hotel barato; Emboscada no beco do Totentanz; Resgate de VIP em AV-4 caído..."
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500 placeholder:text-zinc-600"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-[#27272a]">
                <button
                  type="button"
                  onClick={handleGenerateSquadAI}
                  disabled={isGeneratingSquadAI}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-red-600 to-purple-600 hover:from-amber-500 hover:via-red-500 hover:to-purple-500 text-white font-mono font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition"
                >
                  <Wand2 className={`w-4 h-4 text-amber-200 ${isGeneratingSquadAI ? 'animate-spin' : ''}`} />
                  <span>{isGeneratingSquadAI ? 'Gerando com IA Co-GM...' : '⚡ Criar Tropa com IA Co-GM'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleGenerateSquadOffline}
                  className="w-full py-2 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs flex items-center justify-center gap-2 transition border border-zinc-700"
                >
                  <Dices className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Gerar Procedural (Offline Rápido)</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: SQUAD DISPLAY & COMBAT COMMAND HUD */}
            <div className="lg:col-span-8 space-y-4">
              {generatedSquad ? (
                <>
                  {/* SQUAD HEADER HUD */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-[#16161f] to-[#0f0f14] border border-[#27272a] shadow-xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-zinc-800/80 pb-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-amber-950/90 text-amber-400 border border-amber-600/60 flex items-center gap-1.5">
                            <Radio className="w-3 h-3 text-amber-500 animate-pulse" />
                            <span>{generatedSquad.radioCallsign}</span>
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                            generatedSquad.threatLevel === 'Pesadelo' ? 'bg-purple-950/80 text-purple-300 border-purple-600/70' :
                            generatedSquad.threatLevel === 'Extremo' ? 'bg-red-950/80 text-red-300 border-red-600/70' :
                            generatedSquad.threatLevel === 'Alto' ? 'bg-orange-950/80 text-orange-300 border-orange-600/70' :
                            generatedSquad.threatLevel === 'Médio' ? 'bg-amber-950/80 text-amber-300 border-amber-600/70' :
                            'bg-emerald-950/80 text-emerald-300 border-emerald-600/70'
                          }`}>
                            Ameaça: {generatedSquad.threatLevel}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            • {generatedSquad.members.length} Combatentes
                          </span>
                          {generatedSquad.aiGenerated && (
                            <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>IA Enriquecida</span>
                            </span>
                          )}
                        </div>
                        <h2 className="text-lg font-black text-zinc-100 tracking-tight">
                          {generatedSquad.squadName}
                        </h2>
                        <span className="text-xs font-mono text-zinc-400">
                          Facção: <strong className="text-zinc-200">{generatedSquad.factionName}</strong>
                        </span>
                      </div>

                      {/* Immediate Master Action: Send to Combat Tracker */}
                      <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                        <button
                          type="button"
                          onClick={handleSendSquadToCombat}
                          className="py-2 px-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs shadow-lg shadow-red-950/50 flex items-center gap-1.5 transition active:scale-95"
                          title="Adiciona todos os membros desta tropa diretamente na fila de iniciativa do combate"
                        >
                          <Sword className="w-4 h-4" />
                          <span>{squadSendSuccess ? '✓ Enviados ao Combate!' : `⚔️ Enviar Tropa ao Combate (${generatedSquad.members.length})`}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSaveSquadToCampaign}
                          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition"
                          title="Salvar todos os membros na Biblioteca de NPCs da Campanha"
                        >
                          <Bookmark className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={handleCopySquadSummary}
                          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition"
                          title="Copiar relatório tático completo"
                        >
                          {squadCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* TACTICAL DOCTRINE & DIRECTIVES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800/80 space-y-1.5">
                        <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1">
                          <Target className="w-3 h-3 text-amber-500" />
                          <span>Doutrina Operacional Coletiva</span>
                        </span>
                        <p className="text-zinc-300 leading-relaxed text-[11px]">
                          {generatedSquad.doctrine}
                        </p>
                        <div className="pt-1.5 border-t border-zinc-800 text-[10px] font-mono text-rose-300">
                          <strong className="text-zinc-400">Limite de Rendição / Fuga: </strong>
                          {generatedSquad.surrenderThreshold}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800/80 space-y-1.5">
                        <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold flex items-center gap-1">
                          <Layers className="w-3 h-3 text-cyan-500" />
                          <span>Ativos & Equipamentos Especiais</span>
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {generatedSquad.specialAssets.map((asset, i) => (
                            <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                              {asset}
                            </span>
                          ))}
                        </div>
                        {generatedSquad.tacticalDirectives.length > 0 && (
                          <div className="pt-1.5 border-t border-zinc-800 text-[10px] text-zinc-400 space-y-0.5">
                            {generatedSquad.tacticalDirectives.map((d, i) => (
                              <p key={i} className="truncate">• {d}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* SQUAD MEMBERS ROSTER (TACTICAL CARDS) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-mono uppercase font-bold text-zinc-300 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-amber-500" />
                        <span>Formação Tática do Esquadrão ({generatedSquad.members.length} Combatentes)</span>
                      </h3>
                      <button
                        type="button"
                        onClick={handleSendSquadToCombat}
                        className="text-[11px] font-mono text-red-400 hover:text-red-300 hover:underline flex items-center gap-1"
                      >
                        <Sword className="w-3 h-3" />
                        <span>Rolar Iniciativas & Lutar</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {generatedSquad.members.map((member, idx) => {
                        const isExpanded = expandedMemberId === member.id;
                        const roleColor =
                          member.isLeader ? 'bg-amber-950/80 text-amber-300 border-amber-600/70' :
                          member.tacticalRole === 'heavy' ? 'bg-purple-950/80 text-purple-300 border-purple-600/70' :
                          member.tacticalRole === 'specialist' ? 'bg-cyan-950/80 text-cyan-300 border-cyan-600/70' :
                          member.tacticalRole === 'support' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/70' :
                          member.tacticalRole === 'sniper' ? 'bg-rose-950/80 text-rose-300 border-rose-600/70' :
                          'bg-zinc-800 text-zinc-300 border-zinc-700';

                        return (
                          <div
                            key={member.id}
                            className={`p-3.5 rounded-xl border transition space-y-2.5 ${
                              member.isLeader
                                ? 'bg-[#15151e] border-amber-500/40 shadow-md'
                                : 'bg-[#0e0e13] border-zinc-800 hover:border-zinc-700'
                            }`}
                          >
                            {/* Member Card Header */}
                            <div className="flex items-start justify-between gap-2 border-b border-zinc-800/60 pb-2">
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold ${roleColor}`}>
                                    {member.isLeader ? '★ LÍDER' : member.roleTitle.split(' / ')[0]}
                                  </span>
                                  <span className="text-[10px] font-mono text-zinc-400 font-bold">
                                    [{member.callsign}]
                                  </span>
                                </div>
                                <h4 className="text-xs font-bold text-zinc-100 mt-1">
                                  {member.name}
                                </h4>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEdit(squadMemberToNPCSheet(member, generatedSquad), 'squad', member.id)}
                                  className="p-1 rounded text-zinc-400 hover:text-amber-400 transition"
                                  title="Editar estatísticas deste membro da tropa"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSquadMember(member.id)}
                                  className="p-1 rounded text-zinc-600 hover:text-red-400 transition"
                                  title="Remover este membro da formação"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Combat Stats Line (HP, SP, CN) */}
                            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-mono">
                              <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                                <span className="text-zinc-500 block text-[9px]">HP</span>
                                <span className="text-emerald-400 font-bold text-xs">{member.hp}</span>
                              </div>
                              <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                                <span className="text-zinc-500 block text-[9px]">SP Cab.</span>
                                <span className="text-cyan-300 font-bold text-xs">{member.headSP}</span>
                              </div>
                              <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                                <span className="text-zinc-500 block text-[9px]">SP Corp.</span>
                                <span className="text-cyan-300 font-bold text-xs">{member.bodySP}</span>
                              </div>
                              <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800">
                                <span className="text-zinc-500 block text-[9px]">Comb. Nº</span>
                                <span className="text-amber-300 font-bold text-xs">{member.combatNumber}</span>
                              </div>
                            </div>

                            {/* Weapons list */}
                            <div className="space-y-1">
                              <span className="text-[9px] font-mono text-zinc-500 block uppercase">Armas Prontas:</span>
                              <div className="space-y-1 text-[11px] font-sans">
                                {member.weapons.map((w, wIdx) => (
                                  <div key={wIdx} className="flex items-center justify-between p-1.5 rounded-lg bg-[#08080b] border border-zinc-900 text-zinc-200">
                                    <span className="font-semibold truncate">{w.name}</span>
                                    <div className="flex items-center gap-1.5 flex-shrink-0 font-mono text-[10px]">
                                      <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-900">
                                        {w.damage}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setNpcAttackModal({
                                            isOpen: true,
                                            npc: member.sheet,
                                            weapon: { name: w.name, damage: w.damage },
                                            combatNumber: member.combatNumber,
                                            aimMode: 'normal',
                                            targetId: combatants[0]?.id || '',
                                            distanceDV: 15,
                                            isEvading: false,
                                            evasionBonus: 14,
                                          });
                                          setNpcAttackResult(null);
                                        }}
                                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
                                        title="Rolar teste de ataque para esta arma"
                                      >
                                        <Crosshair className="w-3 h-3 text-red-400" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Tactical Order & Quote */}
                            <div className="p-2 rounded-lg bg-[#08080b] border border-zinc-900 text-[10px] space-y-1">
                              <p className="text-zinc-300">
                                <strong className="text-amber-400 font-mono">Ordem: </strong>
                                {member.tacticalOrder}
                              </p>
                              <p className="text-zinc-500 italic">
                                "{member.quoteOrBanter}"
                              </p>
                            </div>

                            {/* Expand toggle */}
                            <button
                              type="button"
                              onClick={() => setExpandedMemberId(isExpanded ? null : member.id)}
                              className="w-full text-center text-[10px] font-mono text-zinc-500 hover:text-zinc-300 pt-1 flex items-center justify-center gap-1"
                            >
                              <span>{isExpanded ? 'Menos Detalhes ▲' : 'Ciberware & Detalhes ▼'}</span>
                            </button>

                            {isExpanded && (
                              <div className="p-2.5 rounded-lg bg-[#060608] border border-zinc-900 text-[10px] font-mono text-zinc-400 space-y-1.5 animate-in fade-in duration-100">
                                <div>
                                  <strong className="text-cyan-400 block mb-0.5">Ciberimplantes:</strong>
                                  <span>{member.cyberware.join(', ') || 'Nenhum visível'}</span>
                                </div>
                                <div>
                                  <strong className="text-zinc-300 block mb-0.5">Equipamento:</strong>
                                  <span>{member.gear.join(', ')}</span>
                                </div>
                                <div className="pt-1 text-[9px] text-zinc-500">
                                  REF: {member.ref} | DEX: {member.dex} | BODY: {member.body}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
                  <ShieldAlert className="w-12 h-12 text-zinc-600 mx-auto" />
                  <h3 className="text-sm font-semibold text-zinc-300">Nenhuma tropa gerada ainda</h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Selecione um preset (NCPD, Max-Tac, Trauma Team ou Gangue) ao lado e clique em <strong>"Criar Tropa com IA Co-GM"</strong> ou <strong>"Gerar Procedural"</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB NOVO: GERADOR DEDICADO DE PETS & BIOCRIATURAS        */}
      {/* ======================================================== */}
      {activeTab === 'pets' && (
        <div className="space-y-6">
          {/* Toast Notification */}
          {petToast && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-mono text-xs flex items-center justify-between shadow-lg animate-pulse">
              <span className="flex items-center gap-2">
                <span>🐕</span>
                {petToast}
              </span>
              <button onClick={() => setPetToast(null)} className="text-zinc-400 hover:text-zinc-100">&times;</button>
            </div>
          )}

          {/* Top Info Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#121217] via-[#141b18] to-[#121217] border border-[#27272a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  Interface RED Vol. 2 & Corebook p. 317 (Animals & Biopets)
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Módulo de Criaturas Cibernéticas</span>
              </div>
              <h2 className="text-base font-bold text-zinc-100 mt-1 flex items-center gap-2">
                <span className="text-base">🐕</span>
                <span>Gerador Canônico de Pets, Cães K-9 & Drones Quadrúpedes</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Animais operam com regras de adestramento, porte físico, mandíbulas de titânio perfurantes e manobras de bote distintas de humanoides.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls Column (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* 1. Pet Nature Selection */}
              <div className="p-4 rounded-xl bg-[#121217] border border-[#27272a] space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block font-mono">
                  1. Natureza do Animal / Biopet
                </span>
                <div className="space-y-2">
                  {PET_NATURES.map(nature => {
                    const isSelected = petNatureId === nature.id;
                    return (
                      <button
                        key={nature.id}
                        type="button"
                        onClick={() => setPetNatureId(nature.id)}
                        className={`w-full p-2.5 rounded-lg border text-left transition flex items-center justify-between text-xs ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500 text-zinc-100 shadow-sm'
                            : 'bg-[#0a0a0d] border-[#27272a] text-zinc-400 hover:bg-zinc-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-zinc-200 block">{nature.name}</strong>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-emerald-400 border border-zinc-800">
                              {nature.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-500 mt-0.5 line-clamp-1">{nature.description}</p>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Pet Size Selection */}
              <div className="p-4 rounded-xl bg-[#121217] border border-[#27272a] space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block font-mono">
                  2. Porte Físico & Estatísticas Básicas
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  {(['small', 'medium', 'large'] as PetSizeId[]).map(sId => {
                    const s = PET_SIZES[sId];
                    const isSelected = petSizeId === sId;
                    return (
                      <button
                        key={sId}
                        type="button"
                        onClick={() => setPetSizeId(sId)}
                        className={`p-2.5 rounded-lg border text-center transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold'
                            : 'bg-[#0a0a0d] border-[#27272a] text-zinc-400 hover:bg-zinc-800'
                        }`}
                      >
                        <span className="text-xs text-zinc-200 block">{s.name.split('(')[0]}</span>
                        <div className="text-[10px] text-zinc-500 mt-1">
                          <div>{s.hp} HP</div>
                          <div className="text-amber-400 font-bold">{s.biteDamage}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Training Level Selection */}
              <div className="p-4 rounded-xl bg-[#121217] border border-[#27272a] space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block font-mono">
                  3. Nível de Adestramento & Instinto
                </span>
                <div className="space-y-2">
                  {(['military', 'domestic', 'feral', 'ai_program'] as PetTrainingId[]).map(tId => {
                    const t = PET_TRAININGS[tId];
                    const isSelected = petTrainingId === tId;
                    return (
                      <button
                        key={tId}
                        type="button"
                        onClick={() => setPetTrainingId(tId)}
                        className={`w-full p-2.5 rounded-lg border text-left transition flex items-center justify-between text-xs ${
                          isSelected
                            ? 'bg-zinc-800 border-emerald-500/80 text-zinc-100 font-medium'
                            : 'bg-[#0a0a0d] border-[#27272a] text-zinc-400 hover:bg-zinc-800'
                        }`}
                      >
                        <div>
                          <strong className="text-zinc-200 block">{t.name}</strong>
                          <span className="text-[10px] text-zinc-500 block line-clamp-1">{t.behaviorSummary}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Owner / Faction Input */}
              <div className="p-4 rounded-xl bg-[#121217] border border-[#27272a] space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block font-mono">
                  4. Dono / Organização Guardiã
                </span>
                <input
                  type="text"
                  value={petOwnerFaction}
                  onChange={e => setPetOwnerFaction(e.target.value)}
                  placeholder="Ex: NCPD K-9, Arasaka Security, Solo Mercenário..."
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Opção Extra: Configurar Pet com IA (Gemini Co-GM) */}
              <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/15 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-zinc-200">Opção Extra: Configurar Pet com IA (Gemini Co-GM)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPetAiOptions(!showPetAiOptions)}
                    className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
                  >
                    <span>{showPetAiOptions ? 'Ocultar Opções' : 'Configurar com IA'}</span>
                    {showPetAiOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {showPetAiOptions && (
                  <div className="space-y-3 pt-2 border-t border-emerald-950/50 animate-in fade-in duration-150">
                    <div>
                      <label className="text-[10px] font-mono text-zinc-400 block mb-1">
                        Instruções Especiais / Peculiaridades para a IA:
                      </label>
                      <input
                        type="text"
                        value={extraPetContext}
                        onChange={e => setExtraPetContext(e.target.value)}
                        placeholder="Ex: Cão K-9 com visão térmica e mandíbula de titânio, drone gato com glitch de afeto..."
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 text-[10px] font-mono text-zinc-400">
                      <span className="text-zinc-500">Sugestões rápidas:</span>
                      {[
                        'K-9 policial com mandíbula de titânio e blindagem',
                        'Drone-gato espião que grava áudio secreto',
                        'Clone exótico da Biotechnica que brilha no escuro',
                        'Cão selvagem dos Badlands treinado por Nômades',
                        'Mascote com glitch cômico e medo de buzinas',
                      ].map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => setExtraPetContext(sug)}
                          className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 hover:border-emerald-500 hover:text-emerald-300 transition"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleGeneratePetOffline}
                    disabled={isGeneratingPetAI}
                    className="py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span>Gerar Pet por Tabelas (Offline)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleGeneratePetAI}
                    disabled={isGeneratingPetAI}
                    className="py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-950/40"
                  >
                    {isGeneratingPetAI ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin text-white" />
                        <span>IA Criando Pet...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Gerar Pet com IA Co-GM</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Option to Create Pet Manually */}
                <button
                  type="button"
                  onClick={handleCreateManualPet}
                  className="w-full py-2.5 rounded-xl bg-[#14141d] hover:bg-[#191924] text-zinc-300 hover:text-white border border-zinc-700/80 hover:border-emerald-500 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>+ Criar Pet / Biopet Manualmente</span>
                </button>
              </div>
            </div>

            {/* Pet Sheet Preview Column (7 cols) */}
            <div className="lg:col-span-7">
              {generatedPet ? (
                <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-5 shadow-lg">
                  {/* Top Pet Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#27272a] gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative group shrink-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-700/80 shadow-md flex items-center justify-center">
                          {generatedPet.imageUrl ? (
                            <img
                              src={generatedPet.imageUrl}
                              alt={generatedPet.name}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                            />
                          ) : (
                            <div className="text-zinc-600 flex flex-col items-center">
                              <PawPrint className="w-7 h-7 text-emerald-400/80" />
                              <span className="text-[9px] font-mono text-zinc-500 mt-0.5">Sem Foto</span>
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => openImageModal(`Foto de ${generatedPet.name}`, generatedPet.imageUrl, 'pet', url => {
                            setGeneratedPet(prev => prev ? { ...prev, imageUrl: url } : prev);
                          })}
                          className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/40 shadow transition hover:scale-110"
                          title="Alterar Foto do Pet (Upload ou Galeria)"
                        >
                          <Camera className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/40 font-bold flex items-center gap-1">
                            <span>🐾</span> Pet / Animal
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                            Porte {generatedPet.petSize}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            {generatedPet.faction}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-zinc-100 mt-1 flex items-center gap-2">
                          <span>{generatedPet.name}</span>
                        </h2>
                        <p className="text-xs text-zinc-400">{generatedPet.role}</p>
                      </div>
                    </div>

                    {/* Actions: Edit, Combat, Save, Copy */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(generatedPet, 'pet')}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 hover:text-amber-200 border border-amber-600/50 text-xs font-medium flex items-center gap-1.5 transition shadow"
                        title="Editar Estatísticas e Ficha do Pet"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleSendPetToCombat(generatedPet)}
                        className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium flex items-center gap-1.5 transition"
                        title="Enviar Pet para o Rastreador Lateral"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{petSendSuccess ? 'Enviado!' : 'Combate'}</span>
                      </button>
                      <button
                        onClick={() => {
                          saveNPC(generatedPet);
                          setPetToast(`Pet ${generatedPet.name} salvo na Biblioteca!`);
                          setTimeout(() => setPetToast(null), 2500);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1.5 transition"
                        title="Salvar Pet na Biblioteca da Campanha"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Salvar</span>
                      </button>
                      <button
                        onClick={handleCopyPet}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 border border-zinc-700 transition"
                        title="Copiar Ficha do Pet"
                      >
                        {petCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Pet Narrative & Instinct Box */}
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-emerald-950/60 space-y-3">
                    <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block flex items-center gap-1.5">
                      <span>🐕</span> Perfil Canônico de Comportamento & Adestramento
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-zinc-500 block">Instinto & Adestramento:</span>
                        <p className="text-zinc-300 leading-relaxed">{generatedPet.petInstinct || generatedPet.tactics}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-zinc-500 block">Peculiaridade Animal:</span>
                        <p className="text-zinc-300 leading-relaxed">{generatedPet.quirks || 'Alerta constante contra cromo.'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-zinc-800/80 pt-2.5">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-zinc-500 block">Descrição & Pelagem:</span>
                        <p className="text-zinc-300 leading-relaxed">{generatedPet.appearance || generatedPet.description}</p>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono uppercase text-amber-400 block font-semibold">Economia & Manutenção:</span>
                        <p className="text-zinc-300 font-mono text-[11px]">
                          Ração / Carga: <strong className="text-amber-400">{generatedPet.petMonthlyCostEb || 50} eb/mês</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Animal Combat Stats */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-2 text-center font-mono">
                      <div className="p-2.5 rounded-lg bg-[#0a0a0d] border border-[#27272a]">
                        <span className="text-[10px] text-zinc-500 uppercase block">Combat Number</span>
                        <span className="text-lg font-bold text-emerald-400">{generatedPet.statsRED?.combatNumber}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#0a0a0d] border border-[#27272a]">
                        <span className="text-[10px] text-zinc-500 uppercase block">Pontos Vida (HP)</span>
                        <span className="text-lg font-bold text-zinc-100">{generatedPet.statsRED?.HP}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#0a0a0d] border border-[#27272a]">
                        <span className="text-[10px] text-zinc-500 uppercase block">SP Blindagem</span>
                        <span className="text-lg font-bold text-zinc-200">{generatedPet.statsRED?.bodySP}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#0a0a0d] border border-[#27272a]">
                        <span className="text-[10px] text-zinc-500 uppercase block">Deslocamento (MOVE)</span>
                        <span className="text-lg font-bold text-cyan-400">{generatedPet.statsRED?.MOVE}</span>
                      </div>
                    </div>

                    {/* Animal Attributes */}
                    <div className="p-3 rounded-lg bg-[#0a0a0d] border border-[#27272a]">
                      <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1.5">
                        Atributos do Animal (Cyberpunk RED)
                      </span>
                      <div className="grid grid-cols-5 gap-2 text-center font-mono text-xs">
                        <div className="bg-zinc-900/80 p-1.5 rounded border border-zinc-800">
                          <span className="text-[9px] text-zinc-500 block">INT</span>
                          <span className="font-bold text-zinc-200">{generatedPet.statsRED?.INT}</span>
                        </div>
                        <div className="bg-zinc-900/80 p-1.5 rounded border border-zinc-800">
                          <span className="text-[9px] text-zinc-500 block">REF</span>
                          <span className="font-bold text-zinc-200">{generatedPet.statsRED?.REF}</span>
                        </div>
                        <div className="bg-zinc-900/80 p-1.5 rounded border border-zinc-800">
                          <span className="text-[9px] text-zinc-500 block">DEX</span>
                          <span className="font-bold text-zinc-200">{generatedPet.statsRED?.DEX}</span>
                        </div>
                        <div className="bg-zinc-900/80 p-1.5 rounded border border-zinc-800">
                          <span className="text-[9px] text-zinc-500 block">BODY</span>
                          <span className="font-bold text-zinc-200">{generatedPet.statsRED?.BODY}</span>
                        </div>
                        <div className="bg-zinc-900/80 p-1.5 rounded border border-zinc-800">
                          <span className="text-[9px] text-zinc-500 block">EMP</span>
                          <span className="font-bold text-zinc-200">{generatedPet.statsRED?.EMP}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Animal Attacks & Implants */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-lg bg-[#0a0a0d] border border-[#27272a] space-y-2">
                      <span className="text-[11px] font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
                        <Sword className="w-3.5 h-3.5 text-emerald-500" /> Armas Naturais & Manobras
                      </span>
                      <ul className="space-y-1.5 text-zinc-300">
                        {generatedPet.weapons.map((w, idx) => (
                          <li key={idx} className="flex justify-between items-center bg-zinc-900/80 px-2.5 py-1.5 rounded border border-zinc-800">
                            <div>
                              <span className="text-zinc-200 font-medium block">{w.name}</span>
                              {w.notes && <span className="text-[10px] text-zinc-500 block">{w.notes}</span>}
                            </div>
                            <button
                              onClick={() => handleOpenNpcAttack(generatedPet, w)}
                              className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-mono text-[10px] font-bold transition shadow-sm"
                              title="Rolar ataque com este animal"
                            >
                              <Crosshair className="w-3 h-3 text-emerald-400" />
                              <span>Rolar</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-lg bg-[#0a0a0d] border border-[#27272a] space-y-2">
                      <span className="text-[11px] font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-cyan-500" /> Ciberware Canino & Acessórios
                      </span>
                      <ul className="space-y-1 text-zinc-300">
                        {generatedPet.cyberware.map((c, idx) => (
                          <li key={idx} className="bg-zinc-900/60 px-2 py-1 rounded">
                            &bull; {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 rounded-2xl bg-[#121217] border border-dashed border-[#27272a] text-center space-y-3">
                  <span className="text-3xl block">🐕</span>
                  <h3 className="text-sm font-semibold text-zinc-300">Nenhum animal ou pet gerado ainda</h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Selecione a natureza (K-9, Robodog, Clone ou Mutante), o porte e o adestramento ao lado e clique em <strong>"Gerar Pet Canônico"</strong> ou <strong>"Gerar Pet com IA"</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MANUAL BUILDER */}
      {activeTab === 'builder' && (
        <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] max-w-3xl mx-auto space-y-6 max-h-[92vh] overflow-y-auto">
          <div className="border-b border-[#27272a] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-500" />
                Construtor Manual de Ficha
              </h2>
              <p className="text-xs text-zinc-400">Crie ou personalize Inimigos, Civis ou Pets com controle total de atributos.</p>
            </div>

            <button
              type="button"
              onClick={() => {
                const isPet = manualType === 'pet';
                const draft: NPCSheet = {
                  id: (isPet ? 'pet-manual-' : manualType === 'civilian' ? 'civ-manual-' : 'enemy-manual-') + Date.now(),
                  name: manualName.trim() || 'Novo Personagem Manual',
                  faction: manualFaction.trim() || 'Independente',
                  tier: isPet ? 'pet' : manualTier,
                  system: 'RED',
                  role: manualRole || 'Solo',
                  description: isPet ? `Pet (${manualPetNature}) criado manualmente.` : 'Criado no construtor manual.',
                  tactics: manualTactics,
                  reputation: manualType === 'enemy' ? 2 : 1,
                  isPet,
                  petNature: isPet ? manualPetNature : undefined,
                  petSize: isPet ? manualPetSize : undefined,
                  petBiteDamage: isPet ? manualPetBiteDamage : undefined,
                  petMonthlyCostEb: isPet ? manualPetMonthlyCostEb : undefined,
                  petTraining: isPet ? manualPetTraining : undefined,
                  statsRED: {
                    INT: 6, REF: 7, DEX: 7, TECH: 6, COOL: 6, WILL: 6, LUCK: 2, MOVE: 6, BODY: 7, EMP: 5,
                    HP: manualHP,
                    seriouslyWounded: Math.ceil(manualHP / 2),
                    deathSave: 7,
                    combatNumber: manualCombatNumber,
                    headSP: manualSPHead,
                    bodySP: manualSPBody,
                  },
                  skills: { 'Combate Geral': manualCombatNumber },
                  weapons: manualWeapons.split(',').map(w => ({ name: w.trim(), category: 'Arma', damage: '3d6', system: 'BOTH' })),
                  cyberware: manualCyberware.split(',').map(c => c.trim()).filter(Boolean),
                  gear: ['Agente pessoal', '50eb'],
                };
                handleOpenEdit(draft, manualType === 'pet' ? 'pet' : manualType === 'civilian' ? 'civilian' : 'enemy');
              }}
              className="px-3.5 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-medium flex items-center gap-2 transition"
            >
              <Edit3 className="w-4 h-4" />
              <span>Abrir no Editor Completo (6 Abas)</span>
            </button>
          </div>

          {/* Seletor de Categoria / Molde */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-red-400" />
              <span>1. Escolha a Categoria ou Carregue um Molde Base:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setManualType('enemy');
                  setManualName('Novo Inimigo Tático');
                  setManualFaction('Maelstrom / Gangue Local');
                  setManualRole('Solo / Combatente');
                  setManualTier('mook');
                  setManualHP(35);
                  setManualSPHead(11);
                  setManualSPBody(11);
                  setManualCombatNumber(12);
                  setManualWeapons('Pistola Pesada (3d6), Faca de Combate (1d6)');
                  setManualCyberware('Ciberolho com Mira Térmica, Placas Subcutâneas');
                  setManualTactics('Mantém cobertura média e atira com precisão.');
                }}
                className={`p-3 rounded-xl border text-left transition text-xs ${
                  manualType === 'enemy'
                    ? 'bg-red-950/40 border-red-500 shadow-md shadow-red-950/50 ring-1 ring-red-500/50'
                    : 'bg-red-950/10 border-zinc-800 hover:border-red-900/60'
                }`}
              >
                <div className="font-bold text-red-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  Inimigo de Combate
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Armado, blindagem SP 11, Combat 12</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setManualType('civilian');
                  setManualName('Novo Contato Civil');
                  setManualFaction('Habitantes de Night City');
                  setManualRole('Comerciante / Técnico');
                  setManualTier('mook');
                  setManualHP(25);
                  setManualSPHead(4);
                  setManualSPBody(4);
                  setManualCombatNumber(8);
                  setManualWeapons('Pistola Leve Oculta (2d6), Canivete (1d6)');
                  setManualCyberware('Chip de Interface, Agente Interno');
                  setManualTactics('Evita tiroteios. Procura se abrigar ou negociar.');
                }}
                className={`p-3 rounded-xl border text-left transition text-xs ${
                  manualType === 'civilian'
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-500/50'
                    : 'bg-cyan-950/10 border-zinc-800 hover:border-cyan-900/60'
                }`}
              >
                <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  Cidadão / Contato Civil
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Perfis sociais, conexões, baixa blindagem</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setManualType('pet');
                  setManualName('Drone K-9 / Cão Biológico');
                  setManualFaction('Guarda Particular / Pet');
                  setManualRole('Pet / Rastreador');
                  setManualTier('pet');
                  setManualHP(20);
                  setManualSPHead(7);
                  setManualSPBody(7);
                  setManualCombatNumber(11);
                  setManualWeapons('Mordida Reforçada (2d6), Garras de Titânio (2d6)');
                  setManualCyberware('Sensor Olfativo Cibernético, Audição Amplificada');
                  setManualTactics('Ataca ao comando do dono ou derruba oponentes.');
                  setManualPetNature('Drone K-9 Militar');
                  setManualPetSize('Médio');
                  setManualPetBiteDamage('2d6');
                  setManualPetMonthlyCostEb(50);
                  setManualPetTraining('Ataque & Guarda de Perímetro');
                }}
                className={`p-3 rounded-xl border text-left transition text-xs ${
                  manualType === 'pet'
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-950/50 ring-1 ring-emerald-500/50'
                    : 'bg-emerald-950/10 border-zinc-800 hover:border-emerald-900/60'
                }`}
              >
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <PawPrint className="w-4 h-4" />
                  Pet / Drone Animal
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Ataque de mordida, faro e adestramento</div>
              </button>
            </div>
          </div>

          {/* Dados Principais */}
          <div className="space-y-4">
            <div className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-red-400" />
              <span>2. Identidade & Afiliação:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Nome do {manualType === 'pet' ? 'Animal / Drone' : 'Personagem'}</label>
                <input
                  type="text"
                  placeholder="Ex: Marcus 'Ghost' Santos"
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-red-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Facção / Dono / Afiliação</label>
                <input
                  type="text"
                  placeholder="Ex: Aldecaldos / Militech / Independente"
                  value={manualFaction}
                  onChange={e => setManualFaction(e.target.value)}
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Papel / Função</label>
                <input
                  type="text"
                  placeholder="Ex: Solo / Netrunner / Guarda"
                  value={manualRole}
                  onChange={e => setManualRole(e.target.value)}
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Escalão (Tier)</label>
                <select
                  value={manualTier}
                  onChange={e => setManualTier(e.target.value as NPCTier)}
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-red-500 font-mono"
                >
                  <option value="mook">Capanga (Mook)</option>
                  <option value="lieutenant">Tenente (Lieutenant)</option>
                  <option value="miniboss">Mini-Chefe</option>
                  <option value="boss">Chefe / Ciberpsicopata</option>
                  <option value="pet">Pet / Guarda</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dados Específicos se for Pet */}
          {manualType === 'pet' && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-3">
              <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <PawPrint className="w-4 h-4" />
                <span>Atributos de Pet & Custo de Manutenção:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Espécie / Natureza</label>
                  <input
                    type="text"
                    value={manualPetNature}
                    onChange={e => setManualPetNature(e.target.value)}
                    placeholder="Ex: Drone K-9 / Cão Biológico"
                    className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Porte</label>
                  <select
                    value={manualPetSize}
                    onChange={e => setManualPetSize(e.target.value as any)}
                    className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-zinc-200 focus:border-emerald-500 font-mono"
                  >
                    <option value="Pequeno">Pequeno</option>
                    <option value="Médio">Médio</option>
                    <option value="Grande / Pesado">Grande / Pesado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono">Custo Mensal (eb)</label>
                  <input
                    type="number"
                    value={manualPetMonthlyCostEb}
                    onChange={e => setManualPetMonthlyCostEb(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-amber-400 font-bold font-mono focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Atributos de Combate */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-red-400" />
              <span>3. Atributos de Combate & Proteção:</span>
            </div>
            <div className="grid grid-cols-4 gap-3 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 mb-1 text-[11px]">HP Total</label>
                <input
                  type="number"
                  value={manualHP}
                  onChange={e => setManualHP(parseInt(e.target.value) || 10)}
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded p-2 text-zinc-200"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 text-[11px]">SP Cabeça</label>
                <input
                  type="number"
                  value={manualSPHead}
                  onChange={e => setManualSPHead(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded p-2 text-zinc-200"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 text-[11px]">SP Corpo</label>
                <input
                  type="number"
                  value={manualSPBody}
                  onChange={e => setManualSPBody(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded p-2 text-zinc-200"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1 text-[11px]">Combat Number</label>
                <input
                  type="number"
                  value={manualCombatNumber}
                  onChange={e => setManualCombatNumber(parseInt(e.target.value) || 10)}
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded p-2 text-zinc-200 font-bold text-red-400"
                />
              </div>
            </div>
          </div>

          {/* Equipamento & Táticas */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 font-mono">{manualType === 'pet' ? 'Ataques Naturais / Garras / Mordida' : 'Armas (separadas por vírgula)'}</label>
              <input
                type="text"
                value={manualWeapons}
                onChange={e => setManualWeapons(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-mono">{manualType === 'pet' ? 'Aprimoramentos Biônicos / Módulos' : 'Ciberware & Implantes (separados por vírgula)'}</label>
              <input
                type="text"
                value={manualCyberware}
                onChange={e => setManualCyberware(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-mono">{manualType === 'pet' ? 'Instinto / Reação sob Ameaça' : 'Táticas & Comportamento'}</label>
              <textarea
                rows={2}
                value={manualTactics}
                onChange={e => setManualTactics(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Salvar na Campanha */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                if (!manualName.trim()) return;
                const isPet = manualType === 'pet';
                const npc: NPCSheet = {
                  id: (isPet ? 'pet-manual-' : manualType === 'civilian' ? 'civ-manual-' : 'enemy-manual-') + Date.now(),
                  name: manualName.trim(),
                  faction: manualFaction.trim(),
                  tier: isPet ? 'pet' : manualTier,
                  system,
                  role: manualRole,
                  description: isPet ? `Pet (${manualPetNature}) criado manualmente.` : 'NPC criado manualmente no formulário.',
                  tactics: manualTactics,
                  reputation: manualType === 'enemy' ? 2 : 1,
                  isPet,
                  petNature: isPet ? manualPetNature : undefined,
                  petSize: isPet ? manualPetSize : undefined,
                  petBiteDamage: isPet ? manualPetBiteDamage : undefined,
                  petMonthlyCostEb: isPet ? manualPetMonthlyCostEb : undefined,
                  petTraining: isPet ? manualPetTraining : undefined,
                  statsRED: {
                    INT: 6, REF: 7, DEX: 7, TECH: 6, COOL: 6, WILL: 6, LUCK: 2, MOVE: 6, BODY: 7, EMP: 5,
                    HP: manualHP,
                    seriouslyWounded: Math.ceil(manualHP / 2),
                    deathSave: 7,
                    combatNumber: manualCombatNumber,
                    headSP: manualSPHead,
                    bodySP: manualSPBody,
                  },
                  skills: { 'Combate Geral': manualCombatNumber },
                  weapons: manualWeapons.split(',').map(w => ({ name: w.trim(), category: 'Arma', damage: '3d6', system: 'BOTH' })),
                  cyberware: manualCyberware.split(',').map(c => c.trim()).filter(Boolean),
                  gear: isPet ? ['Coleira GPS', 'Ração Sintética'] : ['Agente pessoal', '50eb'],
                };
                saveNPC(npc);
                setManualName('');
                setActiveTab('library');
              }}
              className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-red-950/40"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Ficha na Biblioteca da Campanha</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: CAMPAIGN LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400">
              Fichas Salvas na Campanha ({savedNPCs.length})
            </span>
          </div>

          {savedNPCs.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#121217] border border-dashed border-[#27272a] text-center space-y-2">
              <Bookmark className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">Nenhum NPC salvo na biblioteca ainda.</p>
              <p className="text-[11px] text-zinc-500">
                Gere ou crie um NPC e clique em "Salvar" para armazená-lo localmente no seu navegador.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedNPCs.map(npc => (
                <div
                  key={npc.id}
                  className="p-4 rounded-xl bg-[#121217] border border-[#27272a] space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800/40 uppercase">
                        {npc.tier}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">{npc.system}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative group shrink-0">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700 flex items-center justify-center">
                          {npc.imageUrl ? (
                            <img src={npc.imageUrl} alt={npc.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-lg">{npc.isPet ? '🐾' : '👤'}</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => openImageModal(`Foto de ${npc.name}`, npc.imageUrl, npc.isPet ? 'pet' : 'personagem', url => {
                            updateNPC(npc.id, { imageUrl: url });
                          })}
                          className="absolute -bottom-1 -right-1 p-1 rounded bg-zinc-900 hover:bg-zinc-800 text-purple-400 border border-purple-500/40 shadow transition hover:scale-110"
                          title="Alterar Imagem"
                        >
                          <Camera className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-zinc-100 truncate">{npc.name}</h3>
                        <div className="text-xs text-zinc-400 truncate">{npc.faction} • {npc.role}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs pt-1">
                      <span className="text-zinc-300">HP: <strong className="text-zinc-100">{npc.statsRED?.HP}</strong></span>
                      <span className="text-zinc-300">SP: <strong className="text-zinc-100">{npc.statsRED?.headSP}/{npc.statsRED?.bodySP}</strong></span>
                      {npc.statsRED?.combatNumber && (
                        <span className="text-red-400">CN: <strong>{npc.statsRED.combatNumber}</strong></span>
                      )}
                    </div>

                    {npc.weapons && npc.weapons.length > 0 && (
                      <div className="pt-2 space-y-1">
                        <span className="text-[10px] uppercase font-mono text-zinc-500 font-semibold block">Armas:</span>
                        <div className="flex flex-wrap gap-1">
                          {npc.weapons.map((w, wIdx) => (
                            <button
                              key={wIdx}
                              onClick={() => handleOpenNpcAttack(npc, w)}
                              className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-red-950 border border-zinc-800 hover:border-red-800 text-zinc-300 hover:text-red-300 font-mono text-[10px] flex items-center gap-1 transition"
                            >
                              <Crosshair className="w-2.5 h-2.5 text-red-500" />
                              <span>{w.name}</span>
                              <span className="text-amber-400">({w.damage})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#1f1f26]">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleSendToCombat(npc)}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5"
                      >
                        <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                        <span>Para Combate</span>
                      </button>
                      <button
                        onClick={() => handleOpenEdit(npc, 'library')}
                        className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-amber-300 hover:text-amber-200 text-xs font-medium flex items-center gap-1 border border-amber-600/40"
                        title="Editar e modificar dados salvos deste NPC"
                      >
                        <Edit3 className="w-3 h-3 text-amber-400" />
                        <span>Editar</span>
                      </button>
                    </div>
                    <button
                      onClick={() => deleteNPC(npc.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 transition"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* UNIFIED NPC / CIVILIAN / PET / SQUAD EDIT MODAL */}
      {editingNPC && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setEditingNPC(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-[#121218] border-2 border-purple-500/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-zinc-800 bg-[#161622]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-950/80 border border-purple-700/60 text-purple-300">
                  <Edit3 className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 font-bold border border-purple-700/50">
                      {editSource === 'enemy' ? 'Inimigo Hostil' : editSource === 'civilian' ? 'Cidadão Civil' : editSource === 'pet' ? 'Pet / Biopet' : editSource === 'squad' ? 'Membro de Tropa' : 'Biblioteca da Campanha'}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase">
                      {editingNPC.tier}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-100 font-mono mt-0.5">
                    Editar Ficha: <span className="text-purple-300">{editingNPC.name}</span>
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setEditingNPC(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
                aria-label="Fechar editor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editor Subtab Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 px-4 sm:px-5 py-2.5 bg-[#0e0e14] border-b border-zinc-800 text-xs font-mono">
              <button
                onClick={() => setEditTab('identity')}
                className={`px-3 py-1.5 rounded-lg transition ${editTab === 'identity' ? 'bg-purple-900/60 text-purple-200 border border-purple-600 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                1. Identidade & Papel
              </button>
              <button
                onClick={() => setEditTab('stats')}
                className={`px-3 py-1.5 rounded-lg transition ${editTab === 'stats' ? 'bg-purple-900/60 text-purple-200 border border-purple-600 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                2. HP & Blindagem
              </button>
              <button
                onClick={() => setEditTab('weapons')}
                className={`px-3 py-1.5 rounded-lg transition ${editTab === 'weapons' ? 'bg-purple-900/60 text-purple-200 border border-purple-600 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                3. Armas & Ataques
              </button>
              <button
                onClick={() => setEditTab('cyberware')}
                className={`px-3 py-1.5 rounded-lg transition ${editTab === 'cyberware' ? 'bg-purple-900/60 text-purple-200 border border-purple-600 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                4. Ciberware & Implantes
              </button>
              <button
                onClick={() => setEditTab('narrative')}
                className={`px-3 py-1.5 rounded-lg transition ${editTab === 'narrative' ? 'bg-purple-900/60 text-purple-200 border border-purple-600 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
              >
                5. Narrativa & Táticas
              </button>
              {(editingNPC.isPet || editingNPC.tier === 'pet') && (
                <button
                  onClick={() => setEditTab('pet')}
                  className={`px-3 py-1.5 rounded-lg transition ${editTab === 'pet' ? 'bg-emerald-900/60 text-emerald-200 border border-emerald-600 font-bold' : 'text-emerald-400 hover:text-emerald-200'}`}
                >
                  🐾 6. Dados do Pet
                </button>
              )}
            </div>

            {/* Editor Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs font-sans">
              {/* TAB 1: IDENTIDADE */}
              {editTab === 'identity' && (
                <div className="space-y-4">
                  {/* Photo / Avatar Selector */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-[#0b0b0e] border border-zinc-800">
                    <div className="relative group shrink-0">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-700 flex items-center justify-center shadow-inner">
                        {editingNPC.imageUrl ? (
                          <img src={editingNPC.imageUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">{editingNPC.isPet ? '🐾' : '👤'}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <label className="block text-zinc-300 font-mono text-xs font-bold">Foto / Retrato da Ficha</label>
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <input
                          type="text"
                          value={editingNPC.imageUrl || ''}
                          onChange={e => setEditingNPC({ ...editingNPC, imageUrl: e.target.value })}
                          placeholder="Cole uma URL da foto ou clique no botão para upload/galeria"
                          className="w-full bg-[#121217] border border-zinc-700 rounded-lg p-2 text-xs text-zinc-100 font-mono focus:border-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => openImageModal(
                            `Escolher Foto para ${editingNPC.name}`,
                            editingNPC.imageUrl,
                            editingNPC.isPet || editingNPC.tier === 'pet' ? 'pet' : editSource === 'enemy' ? 'inimigo' : 'personagem',
                            url => setEditingNPC({ ...editingNPC, imageUrl: url })
                          )}
                          className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500 text-purple-200 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition shrink-0"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>Galeria / Upload</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1 font-mono">Nome Completo / Vulgo</label>
                      <input
                        type="text"
                        value={editingNPC.name}
                        onChange={e => setEditingNPC({ ...editingNPC, name: e.target.value })}
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-bold focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1 font-mono">Facção / Gangue / Corporação</label>
                      <input
                        type="text"
                        value={editingNPC.faction}
                        onChange={e => setEditingNPC({ ...editingNPC, faction: e.target.value })}
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1 font-mono">Papel / Função (Role)</label>
                      <input
                        type="text"
                        value={editingNPC.role}
                        onChange={e => setEditingNPC({ ...editingNPC, role: e.target.value })}
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1 font-mono">Escalão de Ameaça (Tier)</label>
                      <select
                        value={editingNPC.tier}
                        onChange={e => setEditingNPC({ ...editingNPC, tier: e.target.value as NPCTier })}
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-purple-500 font-mono"
                      >
                        <option value="mook">Capanga (Mook)</option>
                        <option value="lieutenant">Tenente (Lieutenant)</option>
                        <option value="miniboss">Mini-Chefe</option>
                        <option value="boss">Chefe / Ciberpsicopata</option>
                        <option value="civilian">Civil / Cotidiano</option>
                        <option value="pet">Pet / Biopet / Drone K-9</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1 font-mono">Arquétipo Narrativo</label>
                      <input
                        type="text"
                        value={editingNPC.archetype || ''}
                        onChange={e => setEditingNPC({ ...editingNPC, archetype: e.target.value })}
                        placeholder="Ex: Soldado Veterano / Ambulante"
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">Descrição Geral / Histórico Breve</label>
                    <textarea
                      rows={2}
                      value={editingNPC.description || ''}
                      onChange={e => setEditingNPC({ ...editingNPC, description: e.target.value })}
                      className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: HP, SP & STATS */}
              {editTab === 'stats' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                    <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800">
                      <label className="block text-zinc-500 text-[10px] uppercase mb-1">HP Máximo</label>
                      <input
                        type="number"
                        value={editingNPC.statsRED?.HP ?? 30}
                        onChange={e => {
                          const hp = parseInt(e.target.value) || 10;
                          setEditingNPC({
                            ...editingNPC,
                            statsRED: {
                              ...editingNPC.statsRED!,
                              HP: hp,
                              seriouslyWounded: Math.ceil(hp / 2),
                            },
                          });
                        }}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-emerald-400 font-bold text-sm"
                      />
                      <span className="text-[9px] text-zinc-500 mt-0.5 block">
                        Ferido: {Math.ceil((editingNPC.statsRED?.HP ?? 30) / 2)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800">
                      <label className="block text-zinc-500 text-[10px] uppercase mb-1">Blindagem Cabeça (SP)</label>
                      <input
                        type="number"
                        value={editingNPC.statsRED?.headSP ?? 7}
                        onChange={e => setEditingNPC({
                          ...editingNPC,
                          statsRED: { ...editingNPC.statsRED!, headSP: parseInt(e.target.value) || 0 },
                        })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-cyan-400 font-bold text-sm"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800">
                      <label className="block text-zinc-500 text-[10px] uppercase mb-1">Blindagem Corpo (SP)</label>
                      <input
                        type="number"
                        value={editingNPC.statsRED?.bodySP ?? 7}
                        onChange={e => setEditingNPC({
                          ...editingNPC,
                          statsRED: { ...editingNPC.statsRED!, bodySP: parseInt(e.target.value) || 0 },
                        })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-cyan-400 font-bold text-sm"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800">
                      <label className="block text-zinc-500 text-[10px] uppercase mb-1">Combat Number (Base)</label>
                      <input
                        type="number"
                        value={editingNPC.statsRED?.combatNumber ?? 12}
                        onChange={e => setEditingNPC({
                          ...editingNPC,
                          statsRED: { ...editingNPC.statsRED!, combatNumber: parseInt(e.target.value) || 8 },
                        })}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-amber-400 font-bold text-sm"
                      />
                    </div>
                  </div>

                  {/* Core Stats Row */}
                  {editingNPC.statsRED && (
                    <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                      <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                        Atributos Primários (1 a 10)
                      </span>
                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 font-mono text-center">
                        {(['INT', 'REF', 'DEX', 'TECH', 'COOL', 'WILL', 'LUCK', 'MOVE', 'BODY', 'EMP'] as const).map(stat => (
                          <div key={stat} className="space-y-1">
                            <label className="text-[9px] text-zinc-500 block">{stat}</label>
                            <input
                              type="number"
                              value={editingNPC.statsRED?.[stat] ?? 5}
                              onChange={e => setEditingNPC({
                                ...editingNPC,
                                statsRED: { ...editingNPC.statsRED!, [stat]: parseInt(e.target.value) || 1 },
                              })}
                              className="w-full bg-zinc-900 border border-zinc-800 rounded p-1 text-center text-zinc-200 text-xs font-bold"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: ARMAS */}
              {editTab === 'weapons' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">
                      Armas e Ataques (formato: <span className="text-amber-400">Nome (Dano)</span>, separados por vírgula)
                    </label>
                    <textarea
                      rows={3}
                      value={editWeaponsInput}
                      onChange={e => setEditWeaponsInput(e.target.value)}
                      placeholder="Ex: Fuzil de Assalto (5d6), Pistola Pesada (3d6), Lâmina Oculta (2d6)"
                      className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-3 text-zinc-100 font-mono focus:outline-none focus:border-purple-500 leading-relaxed"
                    />
                    <span className="text-[10px] text-zinc-500 block mt-1">
                      Dica: O dano entre parênteses é usado automaticamente nas rolagens rápidas de combate.
                    </span>
                  </div>

                  {/* Quick Weapon Adder presets */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-zinc-500">Adicionar Arma Sugerida:</span>
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                      {[
                        'Pistola Pesada (3d6)',
                        'Fuzil de Assalto (5d6)',
                        'Espingarda Calibre 12 (5d6)',
                        'SMG / Submetralhadora (2d6)',
                        'Faca de Combate (1d6)',
                        'Espada Katana (3d6)',
                        'Mandíbula Reforçada (2d6)',
                        'Lança-Foguetes RPG (8d6)',
                      ].map(weaponPreset => (
                        <button
                          key={weaponPreset}
                          type="button"
                          onClick={() => {
                            const trimmed = editWeaponsInput.trim();
                            setEditWeaponsInput(trimmed ? `${trimmed}, ${weaponPreset}` : weaponPreset);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-amber-500 text-zinc-300 hover:text-amber-300 transition"
                        >
                          + {weaponPreset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CIBERWARE */}
              {editTab === 'cyberware' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">
                      Ciberware e Implantes (separados por vírgula)
                    </label>
                    <textarea
                      rows={3}
                      value={editCyberwareInput}
                      onChange={e => setEditCyberwareInput(e.target.value)}
                      placeholder="Ex: Interface Neural, Ciberolho com Mira Térmica, Lâminas Mantis, Placas Subcutâneas"
                      className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-3 text-zinc-100 font-mono focus:outline-none focus:border-purple-500 leading-relaxed"
                    />
                  </div>

                  {/* Cyberware Presets */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-zinc-500">Adicionar Implante Sugerido:</span>
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                      {[
                        'Interface Neural',
                        'Sandevistan Booster',
                        'Lâminas Mantis',
                        'Braço Cibernético Reforçado',
                        'Ciberolho com Visão Noturna',
                        'Placas Subcutâneas (SP 7)',
                        'Garras de Titânio',
                        'Reflexos Acelerados Kerenzikov',
                      ].map(cyberPreset => (
                        <button
                          key={cyberPreset}
                          type="button"
                          onClick={() => {
                            const trimmed = editCyberwareInput.trim();
                            setEditCyberwareInput(trimmed ? `${trimmed}, ${cyberPreset}` : cyberPreset);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-cyan-500 text-zinc-300 hover:text-cyan-300 transition"
                        >
                          + {cyberPreset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: NARRATIVA & INTERPRETAÇÃO */}
              {editTab === 'narrative' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1 font-mono">Aparência & Visual</label>
                      <textarea
                        rows={2}
                        value={editingNPC.appearance || ''}
                        onChange={e => setEditingNPC({ ...editingNPC, appearance: e.target.value })}
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1 font-mono">Maneirismos & Tiques</label>
                      <textarea
                        rows={2}
                        value={editingNPC.quirks || ''}
                        onChange={e => setEditingNPC({ ...editingNPC, quirks: e.target.value })}
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1 font-mono">Motivação / Drama Pessoal</label>
                      <textarea
                        rows={2}
                        value={editingNPC.motivation || ''}
                        onChange={e => setEditingNPC({ ...editingNPC, motivation: e.target.value })}
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1 font-mono">Fraqueza, Dívida ou Segredo</label>
                      <textarea
                        rows={2}
                        value={editingNPC.weaknessOrSecret || ''}
                        onChange={e => setEditingNPC({ ...editingNPC, weaknessOrSecret: e.target.value })}
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1 font-mono">Táticas de Combate / Instinto</label>
                      <textarea
                        rows={2}
                        value={editingNPC.tactics || ''}
                        onChange={e => setEditingNPC({ ...editingNPC, tactics: e.target.value })}
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1 font-mono">Gatilho de Rendição / Reação sob Fogo</label>
                      <textarea
                        rows={2}
                        value={editingNPC.surrenderTrigger || ''}
                        onChange={e => setEditingNPC({ ...editingNPC, surrenderTrigger: e.target.value })}
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">Pocket Loot (Itens nos bolsos, separados por vírgula)</label>
                    <input
                      type="text"
                      value={editPocketLootInput}
                      onChange={e => setEditPocketLootInput(e.target.value)}
                      placeholder="Ex: 50 eb, Cartela de cigarros, Chave eletrônica, Chip de dados encriptado"
                      className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 6: DADOS ESPECÍFICOS DE PET / BIOPET */}
              {editTab === 'pet' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1 font-mono">Natureza / Espécie do Pet</label>
                      <input
                        type="text"
                        value={editingNPC.petNature || ''}
                        onChange={e => setEditingNPC({ ...editingNPC, petNature: e.target.value, isPet: true })}
                        placeholder="Ex: Drone K-9 Militar / Chinchila Cibernética / Cão Biológico"
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1 font-mono">Porte do Animal</label>
                      <select
                        value={editingNPC.petSize || 'Médio'}
                        onChange={e => setEditingNPC({ ...editingNPC, petSize: e.target.value as any, isPet: true })}
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500 font-mono"
                      >
                        <option value="Pequeno">Pequeno (Gatos, Aves, Roedores)</option>
                        <option value="Médio">Médio (Cães de Guarda, Drones K-9)</option>
                        <option value="Grande / Pesado">Grande / Pesado (Mastins, Felinos Grandes)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1 font-mono">Treinamento / Adestramento</label>
                      <input
                        type="text"
                        value={editingNPC.petTraining || ''}
                        onChange={e => setEditingNPC({ ...editingNPC, petTraining: e.target.value })}
                        placeholder="Ex: Ataque & Defesa / Faro"
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1 font-mono">Dano do Ataque / Mordida</label>
                      <input
                        type="text"
                        value={editingNPC.petBiteDamage || '2d6'}
                        onChange={e => setEditingNPC({ ...editingNPC, petBiteDamage: e.target.value })}
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1 font-mono">Custo Mensal (eb / mês)</label>
                      <input
                        type="number"
                        value={editingNPC.petMonthlyCostEb ?? 50}
                        onChange={e => setEditingNPC({ ...editingNPC, petMonthlyCostEb: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 font-mono text-amber-400 font-bold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1 font-mono">Instinto de Sobrevivência & Comportamento</label>
                    <textarea
                      rows={2}
                      value={editingNPC.petInstinct || editingNPC.tactics || ''}
                      onChange={e => setEditingNPC({ ...editingNPC, petInstinct: e.target.value, tactics: e.target.value })}
                      className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-t border-zinc-800 bg-[#161622]">
              <button
                type="button"
                onClick={() => setEditingNPC(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs font-medium transition"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-mono text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-purple-950/50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </button>
            </div>
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

      {/* MODAL: INTERACTIVE NPC WEAPON ATTACK ROLLER */}
      {npcAttackModal?.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-[#27272a] rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl text-xs max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">Rolar Ataque do Inimigo</h3>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {npcAttackModal.npc.name} com <strong className="text-amber-400">{npcAttackModal.weapon.name}</strong> ({npcAttackModal.weapon.damage})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setNpcAttackModal(null)}
                className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target & Options */}
            <div className="space-y-3">
              {/* Target in Combat Tracker */}
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Combatente Alvo no Rastreador (Opcional):</label>
                <select
                  value={npcAttackModal.targetId}
                  onChange={e => setNpcAttackModal({ ...npcAttackModal, targetId: e.target.value })}
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none"
                >
                  <option value="">Nenhum alvo específico (Rolagem Livre de Teste)</option>
                  {combatants.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} (HP: {c.currentHP}/{c.maxHP} | SP Corpo: {c.bodySP} / Cabeça: {c.headSP})
                    </option>
                  ))}
                </select>
              </div>

              {/* Aim Mode & Bonus */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono mb-1">Combat Number / Bônus:</label>
                  <input
                    type="number"
                    value={npcAttackModal.combatNumber}
                    onChange={e => setNpcAttackModal({ ...npcAttackModal, combatNumber: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-mono mb-1">Modo de Disparo:</label>
                  <select
                    value={npcAttackModal.aimMode}
                    onChange={e => setNpcAttackModal({ ...npcAttackModal, aimMode: e.target.value as any })}
                    className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 font-mono focus:outline-none"
                  >
                    <option value="normal">Normal (Corpo)</option>
                    <option value="head">Mirado na Cabeça (-8 Ataque, Dano x2)</option>
                  </select>
                </div>
              </div>

              {/* Target Defense */}
              <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-mono text-[11px]">Defesa do Alvo:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-zinc-300 font-mono">
                    <input
                      type="checkbox"
                      checked={npcAttackModal.isEvading}
                      onChange={e => setNpcAttackModal({ ...npcAttackModal, isEvading: e.target.checked })}
                      className="rounded accent-red-600"
                    />
                    <span>Alvo Esquivando (REF &ge; 8)</span>
                  </label>
                </div>

                {!npcAttackModal.isEvading ? (
                  <div>
                    <label className="block text-zinc-500 font-mono text-[10px] mb-1">DV Oficial pela Distância:</label>
                    <select
                      value={npcAttackModal.distanceDV}
                      onChange={e => setNpcAttackModal({ ...npcAttackModal, distanceDV: parseInt(e.target.value) })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded p-1.5 text-zinc-200 text-xs font-mono"
                    >
                      <option value={13}>0 a 6 metros (DV 13)</option>
                      <option value={15}>7 a 12 metros (DV 15)</option>
                      <option value={20}>13 a 25 metros (DV 20)</option>
                      <option value={25}>26 a 50 metros (DV 25)</option>
                      <option value={30}>51 a 100 metros (DV 30)</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-zinc-500 font-mono text-[10px] mb-1">Bônus de Esquiva do Alvo (DEX + Esquiva):</label>
                    <input
                      type="number"
                      value={npcAttackModal.evasionBonus}
                      onChange={e => setNpcAttackModal({ ...npcAttackModal, evasionBonus: parseInt(e.target.value) || 0 })}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded p-1.5 text-zinc-200 font-mono text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Roll Button */}
              <button
                onClick={handleExecuteNpcAttack}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5"
              >
                <Dice5 className="w-4 h-4" />
                <span>Rolar Ataque do Inimigo ({npcAttackModal.weapon.name})</span>
              </button>

              {/* Result display */}
              {npcAttackResult && (
                <div
                  className={`p-3.5 rounded-xl border space-y-1.5 font-mono text-xs ${
                    npcAttackResult.hit ? 'bg-red-950/20 border-red-700/60' : 'bg-zinc-900/40 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className={npcAttackResult.hit ? 'text-emerald-400' : 'text-zinc-400'}>
                      {npcAttackResult.hit ? '✓ TIRO ACERTOU O ALVO!' : '✗ TIRO ERROU!'}
                    </span>
                    <span className="text-zinc-400 text-[11px]">{npcAttackResult.defenseText}</span>
                  </div>
                  <div className="text-[11px] text-zinc-300">{npcAttackResult.attackRollText}</div>
                  <div className="text-[11px] text-amber-300">{npcAttackResult.damageRollText}</div>

                  {npcAttackResult.targetName && npcAttackResult.hit && (
                    <div className="pt-1.5 border-t border-zinc-800 text-[11px] text-emerald-300 space-y-0.5">
                      <div>Alvo Afetado: <strong>{npcAttackResult.targetName}</strong></div>
                      <div>
                        Dano no HP: <strong>-{npcAttackResult.hpDeducted}</strong> | Blindagem Ablatada: <strong>{npcAttackResult.spAblated ? '-1 SP' : '0 (não penetrou)'}</strong>
                      </div>
                      {npcAttackResult.critTriggered && (
                        <div className="text-amber-400 font-bold">⚠️ {npcAttackResult.critTriggered}</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
