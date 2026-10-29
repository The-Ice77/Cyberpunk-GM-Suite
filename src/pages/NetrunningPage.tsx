import React, { useState } from 'react';
import {
  Network,
  Cpu,
  Shield,
  Lock,
  FileCode,
  Sliders,
  Flame,
  AlertTriangle,
  Zap,
  RotateCcw,
  Radio,
  Terminal,
  Crosshair,
  CheckCircle2,
  XCircle,
  Search,
  BookOpen,
  Sparkles,
  Bot,
  Layers,
  ChevronRight,
  Eye,
  Key,
  Skull,
  Coins,
  Play,
  LogOut,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Hammer,
  Sword as SwordIcon,
  Heart,
  ShieldAlert,
  Footprints,
  User,
  Activity,
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { useCombat } from '../context/CombatContext';
import { RED_BLACK_ICE_ROSTER, CP2020_PROGRAMS_ROSTER, DATA_FORTRESS_THEMES_2020, BlackIceStatBlock } from '../data/netrunningData';
import { MICRO_NET_SYSTEMS, MicroNetSystem } from '../data/microNetrunningData';
import { generateAINetArchitecture } from '../services/aiService';

interface FloorItem {
  floorNumber: number;
  type: 'password' | 'file' | 'control' | 'black-ice';
  title: string;
  dv?: number;
  description: string;
  blackIce?: BlackIceStatBlock;
  blackIceCurrentHp?: number;
  blackIceMaxHp?: number;
  blackIceDefeated?: boolean;
  blackIceSlid?: boolean;
  cleared?: boolean;
}

interface NetrunnerPrograms {
  sword: boolean;
  banhammer: boolean;
  zap: boolean;
  armor: boolean;
  shield: boolean;
  worm: boolean;
  speedbrute: boolean;
}

export const getMaxNetActionsForRank = (rank: number): number => {
  if (rank <= 3) return 2;
  if (rank <= 6) return 3;
  if (rank <= 9) return 4;
  return 5;
};

type NetDifficultyTier = 'basic' | 'standard' | 'advanced' | 'fortress' | 'custom';

export const NetrunningPage: React.FC = () => {
  const { system, isRed } = useSystem();
  const { combatants, updateHP } = useCombat();
  const [activeSubTab, setActiveSubTab] = useState<'architecture' | 'micro-net' | 'catalog'>('architecture');

  // RED Elevator Architecture Generator State
  const [difficultyTier, setDifficultyTier] = useState<NetDifficultyTier>('standard');
  const [numFloors, setNumFloors] = useState<number>(7);
  const [networkTargetOrg, setNetworkTargetOrg] = useState<string>('Arasaka Security Sub-Net');
  const [networkName, setNetworkName] = useState<string>('Arquitetura NET Padrão');
  const [secretDataLoot, setSecretDataLoot] = useState<string>('');
  const [generatedFloors, setGeneratedFloors] = useState<FloorItem[]>([]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // INTERACTIVE RUN STATE (JACK IN)
  const [isJackedIn, setIsJackedIn] = useState<boolean>(false);
  const [currentFloorIndex, setCurrentFloorIndex] = useState<number>(0);
  const [interfaceSkill, setInterfaceSkill] = useState<number>(6);
  const [maxNetActions, setMaxNetActions] = useState<number>(3);
  const [netActionsLeft, setNetActionsLeft] = useState<number>(3);
  const [runLog, setRunLog] = useState<string[]>([]);
  const [netrunnerBrainHP, setNetrunnerBrainHP] = useState<number>(35);
  const [netrunnerBrainMaxHP, setNetrunnerBrainMaxHP] = useState<number>(35);
  const [collectedEddiesLoot, setCollectedEddiesLoot] = useState<number>(0);
  const [selectedCombatantId, setSelectedCombatantId] = useState<string>('');

  // Cyberdeck Programs Loaded
  const [loadedPrograms, setLoadedPrograms] = useState<NetrunnerPrograms>({
    sword: true,
    banhammer: true,
    zap: true,
    armor: true,
    shield: true,
    worm: false,
    speedbrute: false,
  });

  // 2020 Datafortress Generator State
  const [datafortress, setDatafortress] = useState<{
    cpus: number;
    dataWallStrength: number;
    codeGateStrength: number;
    memoryMUs: number;
    theme: { name: string; description: string };
    installedPrograms: any[];
    remotes: string[];
  } | null>(null);

  // MICRO-NETRUNNING STATE
  const [microCategory, setMicroCategory] = useState<string>('Todos');
  const [selectedMicroSystem, setSelectedMicroSystem] = useState<MicroNetSystem>(MICRO_NET_SYSTEMS[0]);
  const [hackResults, setHackResults] = useState<{
    [level: number]: { roll: number; total: number; success: boolean; text: string };
  }>({});

  // CATALOG STATE
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [catalogFilter, setCatalogFilter] = useState<string>('Todos');

  // Difficulty Tier Floor Ranges & DVs (Cyberpunk RED Corebook p. 207-219)
  const handleDifficultyChange = (tier: NetDifficultyTier) => {
    setDifficultyTier(tier);
    if (tier === 'basic') {
      setNumFloors(Math.floor(Math.random() * 4) + 3); // 3 to 6
    } else if (tier === 'standard') {
      setNumFloors(Math.floor(Math.random() * 4) + 6); // 6 to 9
    } else if (tier === 'advanced') {
      setNumFloors(Math.floor(Math.random() * 5) + 10); // 10 to 14
    } else if (tier === 'fortress') {
      setNumFloors(Math.floor(Math.random() * 6) + 15); // 15 to 20
    }
  };

  // Generate RED Architecture Procedural following Official Sourcebook Rules
  const handleGenerateREDArchitecture = () => {
    setIsJackedIn(false);
    const floors: FloorItem[] = [];

    // DV ranges per difficulty
    let minDV = 10;
    let maxDV = 12;
    if (difficultyTier === 'standard') {
      minDV = 13;
      maxDV = 15;
    } else if (difficultyTier === 'advanced') {
      minDV = 16;
      maxDV = 17;
    } else if (difficultyTier === 'fortress') {
      minDV = 18;
      maxDV = 21;
    }

    const controlOptions = [
      'Nó de Controle: Torres Automáticas de Teto (Calibre 9mm / 5.56mm)',
      'Nó de Controle: Câmeras de Vigilância 360 com Reconhecimento Facial e Loop',
      'Nó de Controle: Trava Magnética das Portas Corta-Fogo Blindadas',
      'Nó de Controle: Sistema de Sprinklers com Gás Soporífero Halon',
      'Nó de Controle: Bloqueio do Elevador de Carga Principal e Guindastes',
      'Nó de Controle: Iluminação de Emergência e Sirenes de Alarme',
    ];

    const fileOptions = [
      'Arquivo Confidencial: Contabilidade Oculta e Registro de Subornos de Executivos',
      'Arquivo Confidencial: Senhas de Criptografia do Pessoal de Segurança Noturna',
      'Arquivo Confidencial: Projetos de Engenharia Reversa de Protótipo Militar',
      'Arquivo Confidencial: Contrato Sigiloso com Mercenários e Fixers de Watson',
      'Arquivo Confidencial: Código Fonte de Ciberware Não Registrado no Governo',
    ];

    // Filter eligible Black ICE based on tier
    let eligibleBlackIce = RED_BLACK_ICE_ROSTER;
    if (difficultyTier === 'basic') {
      eligibleBlackIce = RED_BLACK_ICE_ROSTER.filter(b => ['Raven', 'Asp', 'Wisp', 'Hellhound'].includes(b.name));
    } else if (difficultyTier === 'standard') {
      eligibleBlackIce = RED_BLACK_ICE_ROSTER.filter(b => ['Hellhound', 'Killer', 'Skunk', 'Scorpion', 'Wisp'].includes(b.name));
    } else if (difficultyTier === 'advanced') {
      eligibleBlackIce = RED_BLACK_ICE_ROSTER.filter(b => ['Giant', 'Dragon', 'Hellhound', 'Killer'].includes(b.name));
    }

    const totalF = numFloors;
    for (let f = 1; f <= totalF; f++) {
      let type: 'password' | 'file' | 'control' | 'black-ice';
      let title = '';
      const dv = minDV + Math.floor(Math.random() * (maxDV - minDV + 1));
      let desc = '';
      let blackIce: BlackIceStatBlock | undefined = undefined;

      if (f === 1) {
        type = 'password';
        title = `Firewall de Entrada Externa (DV ${dv})`;
        desc = 'Exige Ação de Interface: Backdoor para quebrar a criptografia de entrada.';
      } else if (f === totalF) {
        type = Math.random() > 0.4 ? 'file' : 'black-ice';
        if (type === 'file') {
          title = fileOptions[Math.floor(Math.random() * fileOptions.length)];
          desc = `Núcleo de Dados Raiz. Exige Ação de Interface: Eye on the Net para descriptografar (DV ${dv}).`;
        } else {
          blackIce = eligibleBlackIce[Math.floor(Math.random() * eligibleBlackIce.length)] || RED_BLACK_ICE_ROSTER[0];
          title = `Guardião do Núcleo: ${blackIce.name}`;
          desc = blackIce.effect;
        }
      } else {
        const roll = Math.random();
        if (roll < 0.30) {
          type = 'control';
          title = controlOptions[Math.floor(Math.random() * controlOptions.length)];
          desc = `Exige Ação de Interface: Control (DV ${dv}) para assumir o dispositivo no mundo real.`;
        } else if (roll < 0.65) {
          type = 'black-ice';
          blackIce = eligibleBlackIce[Math.floor(Math.random() * eligibleBlackIce.length)] || RED_BLACK_ICE_ROSTER[0];
          title = `Patrulha Black ICE: ${blackIce.name}`;
          desc = blackIce.effect;
        } else if (roll < 0.85) {
          type = 'password';
          title = `Porta de Criptografia Interna (DV ${dv})`;
          desc = 'Sub-rede criptografada bloqueando o avanço vertical para os andares superiores.';
        } else {
          type = 'file';
          title = fileOptions[Math.floor(Math.random() * fileOptions.length)];
          desc = `Servidor de Armazenamento Local. Exige Eye on the Net (DV ${dv}).`;
        }
      }

      floors.push({
        floorNumber: f,
        type,
        title,
        dv,
        description: desc,
        blackIce,
        blackIceCurrentHp: blackIce ? blackIce.hp : undefined,
        blackIceMaxHp: blackIce ? blackIce.hp : undefined,
        blackIceDefeated: false,
        blackIceSlid: false,
        cleared: false,
      });
    }

    setNetworkName(`Arquitetura ${networkTargetOrg} [${difficultyTier.toUpperCase()}]`);
    setSecretDataLoot(`Planilhas financeiras confidenciais e credenciais de acesso corporativo.`);
    setGeneratedFloors(floors);
  };

  // Generate RED Architecture using Gemini AI
  const handleGenerateAIRedArchitecture = async () => {
    setIsAiLoading(true);
    setIsJackedIn(false);
    try {
      const tierParam = difficultyTier === 'custom' ? 'standard' : difficultyTier;
      const res = await generateAINetArchitecture(networkTargetOrg, tierParam);

      setNetworkName(res.name || `Rede Corporativa ${networkTargetOrg}`);
      setSecretDataLoot(res.secretDataLoot || 'Projetos militares confidenciais.');

      const floors: FloorItem[] = res.floors.map(f => {
        let type: 'password' | 'file' | 'control' | 'black-ice' = 'password';
        const tLower = f.type.toLowerCase();
        if (tLower.includes('ice') || tLower.includes('black')) type = 'black-ice';
        else if (tLower.includes('control') || tLower.includes('controle')) type = 'control';
        else if (tLower.includes('file') || tLower.includes('arquivo')) type = 'file';

        // Check if there's Black ICE matching
        let blackIce: BlackIceStatBlock | undefined = undefined;
        if (type === 'black-ice') {
          const foundAIICE = res.blackICEList?.find(bi => bi.floor === f.floor);
          const nameToMatch = foundAIICE?.name || f.content;
          blackIce = RED_BLACK_ICE_ROSTER.find(bi => nameToMatch.toLowerCase().includes(bi.name.toLowerCase())) || {
            name: foundAIICE?.name || 'Hellhound',
            classType: 'Anti-Personnel',
            spd: foundAIICE?.spd || 6,
            atk: 6,
            def: 4,
            hp: foundAIICE?.hp || 25,
            effect: foundAIICE?.effect || 'Causa dano direto ao cérebro do Netrunner',
            citation: 'Cyberpunk RED Corebook p. 206',
          };
        }

        return {
          floorNumber: f.floor,
          type,
          title: f.content || `${f.type} (Andar ${f.floor})`,
          dv: f.dv || 13,
          description: f.notes ? `${f.notes}` : `Exige Ação de Interface (DV ${f.dv || 13})`,
          blackIce,
          blackIceCurrentHp: blackIce ? blackIce.hp : undefined,
          blackIceMaxHp: blackIce ? blackIce.hp : undefined,
          blackIceDefeated: false,
          blackIceSlid: false,
          cleared: false,
        };
      });

      setGeneratedFloors(floors);
      setNumFloors(floors.length);
    } catch (e) {
      console.error(e);
      handleGenerateREDArchitecture();
    } finally {
      setIsAiLoading(false);
    }
  };

  // Interactive Infiltration (Jack In)
  const handleStartJackIn = () => {
    if (generatedFloors.length === 0) return;
    setIsJackedIn(true);
    setCurrentFloorIndex(0);

    const calculatedActions = getMaxNetActionsForRank(interfaceSkill);
    setMaxNetActions(calculatedActions);
    setNetActionsLeft(calculatedActions);

    // If combatant is linked from CombatTracker, sync their HP
    const linked = combatants.find(c => c.id === selectedCombatantId);
    const initialHP = linked ? linked.currentHP : 35;
    const initialMaxHP = linked ? linked.maxHP : 35;
    setNetrunnerBrainHP(initialHP);
    setNetrunnerBrainMaxHP(initialMaxHP);
    setCollectedEddiesLoot(0);

    // Reset floor statuses and initialize Black ICE HP
    const freshFloors: FloorItem[] = generatedFloors.map(f => ({
      ...f,
      blackIceCurrentHp: f.blackIce ? (f.blackIceCurrentHp ?? f.blackIce.hp) : undefined,
      blackIceMaxHp: f.blackIce ? (f.blackIceMaxHp ?? f.blackIce.hp) : undefined,
      blackIceDefeated: false,
      blackIceSlid: false,
      cleared: false,
    }));
    setGeneratedFloors(freshFloors);

    // Reset cyberdeck programs
    setLoadedPrograms({
      sword: true,
      banhammer: true,
      zap: true,
      armor: true,
      shield: true,
      worm: true,
      speedbrute: false,
    });

    setRunLog([
      `[JACK IN REALIZADO] Cabo de interface conectado ao ponto de acesso físico de ${networkName}.`,
      `Você entra no Andar 1: ${freshFloors[0].title}.`,
      `Ações de Interface por rodada: ${calculatedActions} (Rank de Interface ${interfaceSkill}).`,
      linked ? `Netrunner vinculado ao combatente: ${linked.name} (HP: ${linked.currentHP}/${linked.maxHP}).` : `Modo Autônomo (HP Neural Base: ${initialHP}).`,
    ]);
  };

  const handleJackOut = (emergency: boolean = false) => {
    if (emergency) {
      const dmg = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1; // 2d6
      setNetrunnerBrainHP(prev => {
        const newHP = Math.max(0, prev - dmg);
        return newHP;
      });
      if (selectedCombatantId) {
        updateHP(selectedCombatantId, -dmg);
      }
      setRunLog(prev => [
        ...prev,
        `⚡ [DESCONEXÃO DE EMERGÊNCIA!] O Netrunner arrancou os cabos bruscamente! Sofreu ${dmg} de dano cerebral direto e fica Desorientado no mundo real!`,
      ]);
    } else {
      setRunLog(prev => [
        ...prev,
        `🔌 [JACK OUT SEGURO] Sessão de invasão encerrada. Total de Eddies e dados salvos no Cyberdeck (+${collectedEddiesLoot} eb)!`,
      ]);
    }
    setIsJackedIn(false);
  };

  // Black ICE Counter-Attack Logic (Official Cyberpunk RED rules)
  const triggerBlackIceCounterAttack = (
    ice: BlackIceStatBlock,
    floorIdx: number,
    isOpportunity: boolean = false
  ) => {
    const d10Atk = Math.floor(Math.random() * 10) + 1;
    let atkBonus = 0;
    let atkCrit = '';
    if (d10Atk === 10) {
      const exp = Math.floor(Math.random() * 10) + 1;
      atkBonus += exp;
      atkCrit = ` (Crítico +${exp}!)`;
    } else if (d10Atk === 1) {
      const f = Math.floor(Math.random() * 10) + 1;
      atkBonus -= f;
      atkCrit = ` (Falha -${f}!)`;
    }
    const atkTotal = d10Atk + atkBonus + ice.atk;

    // Netrunner Defense Roll
    const d10Def = Math.floor(Math.random() * 10) + 1;
    let defBonus = 0;
    let defCrit = '';
    if (d10Def === 10) {
      const exp = Math.floor(Math.random() * 10) + 1;
      defBonus += exp;
      defCrit = ` (Defesa Crítica +${exp}!)`;
    } else if (d10Def === 1) {
      const f = Math.floor(Math.random() * 10) + 1;
      defBonus -= f;
      defCrit = ` (Falha Defesa -${f}!)`;
    }
    const defTotal = d10Def + defBonus + interfaceSkill;

    const opPrefix = isOpportunity ? '⚠️ [ATAQUE DE OPORTUNIDADE] ' : '💥 [CONTRA-ATAQUE DO BLACK ICE] ';

    if (atkTotal > defTotal) {
      // Black ICE HIT! Calculate brain damage & special effects
      let rawDmg = 0;
      let extraEffect = '';

      if (ice.name.includes('Hellhound')) {
        rawDmg = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1; // 2d6
        extraEffect = ' Cérebro em Chamas! Sofre 2 de dano cerebral no início de cada turno.';
      } else if (ice.name.includes('Giant') || ice.name.includes('Asp') || ice.name.includes('Dragon')) {
        rawDmg = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1; // 3d6
      } else if (ice.name.includes('Liche')) {
        rawDmg = Math.floor(Math.random() * 6) + 1; // 1d6
        extraEffect = ' Carga neurotóxica: -1 de INT temporário!';
      } else {
        rawDmg = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1; // 2d6
      }

      // Check Program De-rez (Killer, Raven, Dragon)
      if (ice.name.includes('Killer') || ice.name.includes('Dragon')) {
        if (loadedPrograms.sword) {
          setLoadedPrograms(p => ({ ...p, sword: false }));
          extraEffect += ' Programa SWORD foi destruído (De-rez)!';
        } else if (loadedPrograms.banhammer) {
          setLoadedPrograms(p => ({ ...p, banhammer: false }));
          extraEffect += ' Programa BANHAMMER foi destruído (De-rez)!';
        }
      } else if (ice.name.includes('Raven')) {
        if (loadedPrograms.shield) {
          setLoadedPrograms(p => ({ ...p, shield: false }));
          extraEffect += ' Programa defensivo SHIELD foi desinstalado pelo Corvo!';
        }
      }

      // Defense Program Absorption (Shield & Armor)
      let appliedDmg = rawDmg;
      let defMsg = '';

      if (loadedPrograms.shield) {
        defMsg = ` [SHIELD ABSORVEU!] O programa Shield bloqueou todos os ${rawDmg} de dano cerebral e foi de-rezzado!`;
        appliedDmg = 0;
        setLoadedPrograms(p => ({ ...p, shield: false }));
      } else if (loadedPrograms.armor) {
        const absorbed = Math.min(4, appliedDmg);
        appliedDmg = Math.max(0, appliedDmg - 4);
        defMsg = ` [ARMOR ABSORVEU!] O programa Armor reduziu ${absorbed} de dano cerebral (${rawDmg} -> ${appliedDmg})!`;
      }

      setNetrunnerBrainHP(prev => {
        const newHP = Math.max(0, prev - appliedDmg);
        return newHP;
      });

      if (selectedCombatantId && appliedDmg > 0) {
        updateHP(selectedCombatantId, -appliedDmg);
      }

      setRunLog(prev => [
        ...prev,
        `${opPrefix}${ice.name} ACERTOU! (ATK ${atkTotal}${atkCrit} vs DEF ${defTotal}${defCrit}). Causou ${rawDmg} de dano cerebral.${defMsg}${extraEffect}`,
      ]);

      if (netrunnerBrainHP - appliedDmg <= 0) {
        setRunLog(prev => [
          ...prev,
          `☠️ [COLAPSO NEURAL / COMA!] O cérebro do Netrunner fritou sob os pulsos do ${ice.name}! Desconexão forçada!`,
        ]);
        setIsJackedIn(false);
      }
    } else {
      // Netrunner Dodged!
      setRunLog(prev => [
        ...prev,
        `🛡️ [ESQUIVA NEURAL] Netrunner defendeu o ataque do ${ice.name}! (DEF ${defTotal}${defCrit} vs ATK ${atkTotal}${atkCrit})`,
      ]);
    }
  };

  const executeNetAction = (
    actionType:
      | 'pathfinder'
      | 'backdoor'
      | 'control'
      | 'eye'
      | 'slide'
      | 'sword'
      | 'banhammer'
      | 'zap'
      | 'move_down'
      | 'move_up'
      | 'rerez_program'
      | 'virus'
  ) => {
    if (netActionsLeft <= 0) {
      alert('Você gastou todas as suas Ações de Interface desta rodada! Clique em "Encerrar Turno (Recarregar Ações)".');
      return;
    }

    const currentFloor = generatedFloors[currentFloorIndex];
    if (!currentFloor) return;

    // ELEVATOR NAVIGATION: MOVE DOWN
    if (actionType === 'move_down') {
      if (currentFloorIndex >= generatedFloors.length - 1) {
        setRunLog(prev => [...prev, `⛔ [ELEVADOR] Você já está no andar mais profundo (${currentFloor.floorNumber}). Não há andares abaixo.`]);
        return;
      }

      // Check blockers on current floor
      if (currentFloor.type === 'password' && !currentFloor.cleared) {
        setRunLog(prev => [
          ...prev,
          `⛔ [PASSAGEM BLOQUEADA] Firewall de Criptografia ativo no Andar ${currentFloor.floorNumber}! Use a Ação Backdoor para liberar a passagem.`,
        ]);
        return;
      }

      if (currentFloor.type === 'black-ice' && !currentFloor.blackIceDefeated && !currentFloor.blackIceSlid) {
        setRunLog(prev => [
          ...prev,
          `⛔ [PASSAGEM BLOQUEADA] O Black ICE ${currentFloor.blackIce?.name} bloqueia a descida! Destrua-o com Sword/Banhammer ou execute Slide para escapar.`,
        ]);
        return;
      }

      setNetActionsLeft(prev => prev - 1);
      const nextIdx = currentFloorIndex + 1;
      setCurrentFloorIndex(nextIdx);
      const nextFl = generatedFloors[nextIdx];

      setRunLog(prev => [
        ...prev,
        `⬇️ [ELEVADOR] Netrunner desceu para o Andar ${nextFl.floorNumber}: ${nextFl.title} [Tipo: ${nextFl.type.toUpperCase()}].`,
      ]);

      if (nextFl.type === 'black-ice' && !nextFl.blackIceDefeated) {
        setRunLog(prev => [
          ...prev,
          `🚨 [ALERTA DE COMBATE] O Black ICE ${nextFl.blackIce?.name} ativou sensores de intrusão e engajou seu Cyberdeck! (SPD: ${nextFl.blackIce?.spd}, HP: ${nextFl.blackIceCurrentHp || nextFl.blackIce?.hp}, ATK: ${nextFl.blackIce?.atk}, DEF: ${nextFl.blackIce?.def})`,
        ]);
      }
      return;
    }

    // ELEVATOR NAVIGATION: MOVE UP
    if (actionType === 'move_up') {
      if (currentFloorIndex <= 0) {
        setRunLog(prev => [...prev, `⛔ [ELEVADOR] Você já está no Andar 1 (Ponto de Acesso). Para sair, utilize Jack Out.`]);
        return;
      }

      // If engaged with undefeated & un-slid Black ICE, moving up triggers Opportunity Attack!
      if (currentFloor.type === 'black-ice' && !currentFloor.blackIceDefeated && !currentFloor.blackIceSlid && currentFloor.blackIce) {
        setRunLog(prev => [
          ...prev,
          `⚠️ [FUGA ABRUPTA] O Netrunner recua pelo elevador enquanto engajado! ${currentFloor.blackIce?.name} desfere um Ataque de Oportunidade!`,
        ]);
        triggerBlackIceCounterAttack(currentFloor.blackIce, currentFloorIndex, true);
      }

      setNetActionsLeft(prev => prev - 1);
      const prevIdx = currentFloorIndex - 1;
      setCurrentFloorIndex(prevIdx);
      const prevFl = generatedFloors[prevIdx];

      setRunLog(prev => [
        ...prev,
        `⬆️ [ELEVADOR] Netrunner subiu para o Andar ${prevFl.floorNumber}: ${prevFl.title}.`,
      ]);
      return;
    }

    // RE-REZ PROGRAM (Restore de-rezzed program)
    if (actionType === 'rerez_program') {
      setNetActionsLeft(prev => prev - 1);
      setLoadedPrograms({
        sword: true,
        banhammer: true,
        zap: true,
        armor: true,
        shield: true,
        worm: true,
        speedbrute: false,
      });
      setRunLog(prev => [
        ...prev,
        `🔄 [RE-REZ DE PROGRAMAS] Compilação executada! Todos os programas (Sword, Banhammer, Shield, Armor) foram restabelecidos no Cyberdeck!`,
      ]);
      return;
    }

    // STANDARD D10 SKILL ROLL FOR ACTIONS
    const d10 = Math.floor(Math.random() * 10) + 1;
    let bonus = 0;
    let critText = '';
    if (d10 === 10) {
      const exp = Math.floor(Math.random() * 10) + 1;
      bonus += exp;
      critText = ` (Sucesso Crítico +${exp}!)`;
    } else if (d10 === 1) {
      const fail = Math.floor(Math.random() * 10) + 1;
      bonus -= fail;
      critText = ` (Falha Crítica -${fail}!)`;
    }

    let programBonus = 0;
    if (actionType === 'backdoor' && loadedPrograms.worm) programBonus += 2;
    if (actionType === 'backdoor' && loadedPrograms.speedbrute) programBonus += 2;

    const rollTotal = d10 + bonus + interfaceSkill + programBonus;
    const dv = currentFloor.dv || 13;
    const success = rollTotal >= dv;

    setNetActionsLeft(prev => prev - 1);

    if (actionType === 'pathfinder') {
      const nextFloor = generatedFloors[currentFloorIndex + 1];
      const afterNextFloor = generatedFloors[currentFloorIndex + 2];
      if (nextFloor) {
        let pathMsg = `[PATHFINDER - Total ${rollTotal} vs DV ${dv}]${critText}: Sensor óptico revela o Andar ${nextFloor.floorNumber}: ${nextFloor.title} [Tipo: ${nextFloor.type.toUpperCase()}]`;
        if (afterNextFloor && rollTotal >= dv + 3) {
          pathMsg += ` | Andar ${afterNextFloor.floorNumber}: ${afterNextFloor.title} [Tipo: ${afterNextFloor.type.toUpperCase()}]`;
        }
        setRunLog(prev => [...prev, pathMsg]);
      } else {
        setRunLog(prev => [
          ...prev,
          `[PATHFINDER - Total ${rollTotal}]: Você já está no nó mais profundo desta arquitetura!`,
        ]);
      }
    } else if (actionType === 'backdoor') {
      if (success) {
        setRunLog(prev => [
          ...prev,
          `🔑 [BACKDOOR SUCESSO! Total ${rollTotal} vs DV ${dv}]${critText}: Criptografia do Firewall QUEBRADA! O elevador agora está liberado para avançar.`,
        ]);
        const updated = [...generatedFloors];
        updated[currentFloorIndex].cleared = true;
        setGeneratedFloors(updated);
      } else {
        setRunLog(prev => [
          ...prev,
          `❌ [BACKDOOR FALHA! Total ${rollTotal} vs DV ${dv}]${critText}: O firewall criptográfico resistiu à injeção de senhas!`,
        ]);
      }
    } else if (actionType === 'control') {
      if (success) {
        setRunLog(prev => [
          ...prev,
          `🎮 [CONTROL SUCESSO! Total ${rollTotal} vs DV ${dv}]${critText}: Dispositivo assumido! As câmeras/torretas/portas agora obedecem ao seu cyberdeck no mundo real!`,
        ]);
        const updated = [...generatedFloors];
        updated[currentFloorIndex].cleared = true;
        setGeneratedFloors(updated);
      } else {
        setRunLog(prev => [
          ...prev,
          `❌ [CONTROL FALHA! Total ${rollTotal} vs DV ${dv}]${critText}: O controlador físico recusou a injeção do comando.`,
        ]);
      }
    } else if (actionType === 'eye') {
      if (success) {
        const reward = Math.floor(Math.random() * 5 + 1) * 200; // 200-1000eb
        setCollectedEddiesLoot(prev => prev + reward);
        setRunLog(prev => [
          ...prev,
          `💾 [EYE ON THE NET SUCESSO! Total ${rollTotal} vs DV ${dv}]${critText}: Arquivo sigiloso baixado com sucesso! (+${reward} eb de dados confidenciais salvos no deck)`,
        ]);
        const updated = [...generatedFloors];
        updated[currentFloorIndex].cleared = true;
        setGeneratedFloors(updated);
      } else {
        setRunLog(prev => [
          ...prev,
          `❌ [EYE ON THE NET FALHA! Total ${rollTotal} vs DV ${dv}]${critText}: Arquivo protegido por chaves criptográficas assimétricas.`,
        ]);
      }
    } else if (actionType === 'sword') {
      if (!loadedPrograms.sword) {
        setRunLog(prev => [...prev, `❌ [SWORD] Programa SWORD está desinstalado ou foi destruído! Use Re-rez para recompilar.`]);
        return;
      }
      if (currentFloor.blackIce && !currentFloor.blackIceDefeated) {
        const iceDef = currentFloor.blackIce.def;
        const hit = rollTotal >= iceDef;
        if (hit) {
          const dmg = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1); // 3d6
          const currentHp = currentFloor.blackIceCurrentHp ?? currentFloor.blackIce.hp;
          const newHp = Math.max(0, currentHp - dmg);

          const updated = [...generatedFloors];
          updated[currentFloorIndex].blackIceCurrentHp = newHp;

          if (newHp <= 0) {
            updated[currentFloorIndex].blackIceDefeated = true;
            updated[currentFloorIndex].cleared = true;
            setRunLog(prev => [
              ...prev,
              `⚔️ [SWORD CRÍTICO! Total ${rollTotal} vs DEF ${iceDef}]${critText}: Lâmina de código desferida! Causou ${dmg} de dano direto! O Black ICE ${currentFloor.blackIce?.name} FOI COMPLETAMENTE DESTRUÍDO (DE-REZ)!`,
            ]);
          } else {
            setRunLog(prev => [
              ...prev,
              `⚔️ [SWORD ACERTOU! Total ${rollTotal} vs DEF ${iceDef}]${critText}: Ataque causou ${dmg} de dano ao ${currentFloor.blackIce?.name}! HP restante do Black ICE: ${newHp}/${currentFloor.blackIceMaxHp || currentFloor.blackIce?.hp}.`,
            ]);
          }
          setGeneratedFloors(updated);
        } else {
          setRunLog(prev => [
            ...prev,
            `❌ [SWORD ERROU! Total ${rollTotal} vs DEF ${iceDef}]${critText}: O Black ICE desviou pelo buffer de memória!`,
          ]);
        }
      } else {
        setRunLog(prev => [...prev, `[SWORD]: Não há Black ICE hostil ativo neste andar.`]);
      }
    } else if (actionType === 'banhammer') {
      if (!loadedPrograms.banhammer) {
        setRunLog(prev => [...prev, `❌ [BANHAMMER] Programa BANHAMMER está desinstalado ou foi destruído!`]);
        return;
      }
      if (currentFloor.blackIce && !currentFloor.blackIceDefeated) {
        const iceDef = currentFloor.blackIce.def;
        const hit = rollTotal >= iceDef;
        if (hit) {
          const dmg = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1) + 2; // 3d6 + 2
          const currentHp = currentFloor.blackIceCurrentHp ?? currentFloor.blackIce.hp;
          const newHp = Math.max(0, currentHp - dmg);

          const updated = [...generatedFloors];
          updated[currentFloorIndex].blackIceCurrentHp = newHp;

          if (newHp <= 0) {
            updated[currentFloorIndex].blackIceDefeated = true;
            updated[currentFloorIndex].cleared = true;
            setRunLog(prev => [
              ...prev,
              `🔨 [BANHAMMER ESMAGOU! Total ${rollTotal} vs DEF ${iceDef}]${critText}: O martelo anti-programa causou ${dmg} de dano massivo! O Black ICE ${currentFloor.blackIce?.name} FOI DELETADO DA MEMÓRIA!`,
            ]);
          } else {
            setRunLog(prev => [
              ...prev,
              `🔨 [BANHAMMER ACERTOU! Total ${rollTotal} vs DEF ${iceDef}]${critText}: Causou ${dmg} de dano pesado ao ${currentFloor.blackIce?.name}! HP restante: ${newHp}/${currentFloor.blackIceMaxHp || currentFloor.blackIce?.hp}.`,
            ]);
          }
          setGeneratedFloors(updated);
        } else {
          setRunLog(prev => [
            ...prev,
            `❌ [BANHAMMER ERROU! Total ${rollTotal} vs DEF ${iceDef}]${critText}: O golpe pesado errou a matriz do Black ICE.`,
          ]);
        }
      } else {
        setRunLog(prev => [...prev, `[BANHAMMER]: Não há Black ICE hostil ativo neste andar.`]);
      }
    } else if (actionType === 'zap') {
      if (!loadedPrograms.zap) {
        setRunLog(prev => [...prev, `❌ [ZAP] Programa ZAP não está carregado!`]);
        return;
      }
      if (currentFloor.blackIce && !currentFloor.blackIceDefeated) {
        const iceDef = currentFloor.blackIce.def;
        const hit = rollTotal >= iceDef;
        if (hit) {
          const dmg = Math.floor(Math.random() * 6) + 1; // 1d6
          const currentHp = currentFloor.blackIceCurrentHp ?? currentFloor.blackIce.hp;
          const newHp = Math.max(0, currentHp - dmg);

          const updated = [...generatedFloors];
          updated[currentFloorIndex].blackIceCurrentHp = newHp;

          if (newHp <= 0) {
            updated[currentFloorIndex].blackIceDefeated = true;
            updated[currentFloorIndex].cleared = true;
            setRunLog(prev => [
              ...prev,
              `⚡ [ZAP CRÍTICO! Total ${rollTotal} vs DEF ${iceDef}]: O choque de código causou ${dmg} de dano e finalizou o ${currentFloor.blackIce?.name}!`,
            ]);
          } else {
            setRunLog(prev => [
              ...prev,
              `⚡ [ZAP ACERTOU! Total ${rollTotal} vs DEF ${iceDef}]: Causou ${dmg} de dano elétrico ao ${currentFloor.blackIce?.name}! HP restante: ${newHp}/${currentFloor.blackIceMaxHp || currentFloor.blackIce?.hp}.`,
            ]);
          }
          setGeneratedFloors(updated);
        } else {
          setRunLog(prev => [
            ...prev,
            `❌ [ZAP ERROU! Total ${rollTotal} vs DEF ${iceDef}]: O arco voltaico passou longe do Black ICE.`,
          ]);
        }
      } else {
        setRunLog(prev => [...prev, `[ZAP]: Não há Black ICE hostil ativo neste andar.`]);
      }
    } else if (actionType === 'slide') {
      if (currentFloor.blackIce && !currentFloor.blackIceDefeated) {
        const slideDv = 13 + (currentFloor.blackIce.spd || 4);
        const slideSuccess = rollTotal >= slideDv;
        if (slideSuccess) {
          const updated = [...generatedFloors];
          updated[currentFloorIndex].blackIceSlid = true;
          setGeneratedFloors(updated);
          setRunLog(prev => [
            ...prev,
            `💨 [SLIDE BEM SUCEDIDO! Total ${rollTotal} vs DV ${slideDv}]${critText}: Manobra evasiva executada com perfeição! Você quebrou a trava de mira do ${currentFloor.blackIce?.name}! O elevador está livre para você se mover nesta rodada sem sofrer ataque!`,
          ]);
        } else {
          setRunLog(prev => [
            ...prev,
            `❌ [SLIDE FALHOU! Total ${rollTotal} vs DV ${slideDv}]${critText}: Você não conseguiu quebrar o engajamento com o ${currentFloor.blackIce?.name}!`,
          ]);
        }
      } else {
        setRunLog(prev => [...prev, `[SLIDE]: Não há Black ICE ativo impedindo você neste andar.`]);
      }
    } else if (actionType === 'virus') {
      if (success) {
        setRunLog(prev => [
          ...prev,
          `🦠 [VIRUS INJETADO NO NÚCLEO! Total ${rollTotal} vs DV ${dv}]${critText}: O payload malicioso se espalhou por toda a arquitetura! O sistema agora está permanentemente comprometido!`,
        ]);
        const updated = [...generatedFloors];
        updated[currentFloorIndex].cleared = true;
        setGeneratedFloors(updated);
      } else {
        setRunLog(prev => [
          ...prev,
          `❌ [VIRUS RECUSADO! Total ${rollTotal} vs DV ${dv}]${critText}: O compilador do nó rejeitou o payload do vírus.`,
        ]);
      }
    }
  };

  const handleNextNetRound = () => {
    const currentFloor = generatedFloors[currentFloorIndex];

    // If active undefeated Black ICE is present and not slid, it attacks at the end of Netrunner's turn!
    if (currentFloor?.blackIce && !currentFloor.blackIceDefeated && !currentFloor.blackIceSlid) {
      setRunLog(prev => [
        ...prev,
        `⚠️ [FIM DO TURNO DO NETRUNNER] O Black ICE ${currentFloor.blackIce?.name} aproveita a brecha e contra-ataca!`,
      ]);
      triggerBlackIceCounterAttack(currentFloor.blackIce, currentFloorIndex);
    }

    // Reset slid state on all floors for the new round
    setGeneratedFloors(prev => prev.map(f => ({ ...f, blackIceSlid: false })));

    setNetActionsLeft(maxNetActions);
    setRunLog(prev => [
      ...prev,
      `--- Nova Rodada de Netrunning iniciada (${maxNetActions} Ações de Interface recarregadas) ---`,
    ]);
  };

  // Generate 2020 Datafortress
  const handleGenerate2020Fortress = () => {
    const cpus = Math.floor(Math.random() * 4) + 2;
    const dataWallStrength = Math.floor(Math.random() * 5) + 4;
    const codeGateStrength = Math.floor(Math.random() * 5) + 4;
    const memoryMUs = cpus * 10;
    const theme = DATA_FORTRESS_THEMES_2020[Math.floor(Math.random() * DATA_FORTRESS_THEMES_2020.length)];

    const shuffled = [...CP2020_PROGRAMS_ROSTER].sort(() => 0.5 - Math.random());
    const installed = shuffled.slice(0, 4);

    const remotes = [
      'Terminal de Câmeras de Vigilância da Recepção',
      'Trava Eletromagnética dos Portões de Acesso ao Cofre',
      'Alarme de Intrusão Acoplado ao DPNC',
      'Canhão Automatizado de Parede com Mira Laser',
    ];

    setDatafortress({
      cpus,
      dataWallStrength,
      codeGateStrength,
      memoryMUs,
      theme,
      installedPrograms: installed,
      remotes,
    });
  };

  // Micro Hack Handler
  const handleRollMicroHack = (level: number, dv: number, hackEffect: string) => {
    let d10 = Math.floor(Math.random() * 10) + 1;
    let bonus = 0;
    let extraText = '';

    if (d10 === 10) {
      const explode = Math.floor(Math.random() * 10) + 1;
      bonus += explode;
      extraText = ` (Sucesso Crítico! +${explode})`;
    } else if (d10 === 1) {
      const blunder = Math.floor(Math.random() * 10) + 1;
      bonus -= blunder;
      extraText = ` (Falha Crítica! -${blunder})`;
    }

    const total = d10 + bonus + interfaceSkill;
    const success = total >= dv;

    setHackResults(prev => ({
      ...prev,
      [level]: {
        roll: d10,
        total,
        success,
        text: success
          ? `SUCESSO! [Total: ${total} vs DV ${dv}]${extraText} → ${hackEffect}`
          : `FALHA! [Total: ${total} vs DV ${dv}]${extraText} → O firewall resistiu! O sistema disparou um sinal de intrusão silencioso.`,
      },
    }));
  };

  const filteredMicroSystems = MICRO_NET_SYSTEMS.filter(s => {
    return microCategory === 'Todos' || s.category === microCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header & Sub-Tabs */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-500" />
            <span>Netrunning, Micro-Sistemas & IoT</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Arquiteturas NET verticais, simulação de invasão (Jack In), micro-sistemas urbanos e arsenal de Black ICE.
          </p>
        </div>

        {/* Sub-tab Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#14141a] border border-[#27272a] rounded-xl p-1.5 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('architecture')}
            className={`px-3 py-1.5 rounded-md transition ${
              activeSubTab === 'architecture' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {isRed ? 'Arquitetura NET (Elevador)' : 'Fortaleza 2020'}
          </button>
          <button
            onClick={() => setActiveSubTab('micro-net')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
              activeSubTab === 'micro-net' ? 'bg-zinc-800 text-purple-300 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-purple-400" />
            <span>Micro-Sistemas & IoT</span>
          </button>
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
              activeSubTab === 'catalog' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-red-400" />
            <span>Catálogo Black ICE</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: NET ARCHITECTURE (RED & 2020) */}
      {activeSubTab === 'architecture' && (
        <>
          {isRed ? (
            <div className="space-y-6">
              {/* Controls Bar: Target Org, Difficulty Preset & Buttons */}
              <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
                <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
                  {/* Target Org Selection */}
                  <div className="space-y-1 w-full xl:w-1/3">
                    <label className="text-xs font-mono uppercase text-zinc-400 font-semibold block">
                      Organização / Alvo da Invasão:
                    </label>
                    <select
                      value={networkTargetOrg}
                      onChange={e => setNetworkTargetOrg(e.target.value)}
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-xs text-zinc-200 font-medium focus:outline-none focus:border-purple-500"
                    >
                      <option value="Arasaka Security Sub-Net">Arasaka Security Sub-Net (Torre Central)</option>
                      <option value="Militech Defense Grid">Militech Defense Grid (Quartel Regional)</option>
                      <option value="Kang Tao Smart-Weapons Lab">Kang Tao Smart-Weapons Lab (Pesquisa)</option>
                      <option value="Ziggurat CitiNet Hub">Ziggurat CitiNet Hub (Data Pool)</option>
                      <option value="Petrochem Refinery Control">Petrochem Refinery Control (CHOOH2)</option>
                      <option value="Trauma Team Central Dispatch">Trauma Team Central Dispatch (Médico)</option>
                      <option value="DPNC Sub-Station 4">DPNC Sub-Station (Heywood)</option>
                      <option value="Maelstrom Totentanz Crypt">Maelstrom Totentanz Crypt (Subsolo Watson)</option>
                      <option value="Tyger Claws Casino Network">Tyger Claws Casino Network (Japantown)</option>
                      <option value="Clínica Ripperdoc Clandestina">Clínica Ripperdoc Clandestina</option>
                    </select>
                  </div>

                  {/* Difficulty Presets (Cyberpunk RED Official Rules) */}
                  <div className="space-y-1 w-full xl:w-auto">
                    <label className="text-xs font-mono uppercase text-zinc-400 font-semibold block">
                      Dificuldade Oficial (Regras Corebook):
                    </label>
                    <div className="flex flex-wrap items-center bg-[#0a0a0d] border border-[#27272a] rounded-lg p-1 text-xs font-mono">
                      {[
                        { id: 'basic', label: 'Básica (3-6F)', desc: 'DV 10-12' },
                        { id: 'standard', label: 'Padrão (6-9F)', desc: 'DV 13-15' },
                        { id: 'advanced', label: 'Avançada (10-14F)', desc: 'DV 16-17' },
                        { id: 'fortress', label: 'Fortaleza (15-20F)', desc: 'DV 18-21+' },
                      ].map(d => (
                        <button
                          key={d.id}
                          onClick={() => handleDifficultyChange(d.id as NetDifficultyTier)}
                          className={`px-3 py-1.5 rounded-md transition text-left ${
                            difficultyTier === d.id
                              ? 'bg-purple-600 text-white font-bold shadow'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <div>{d.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Generation Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto pt-2 xl:pt-0">
                    <button
                      onClick={handleGenerateREDArchitecture}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs uppercase tracking-wider transition border border-zinc-700 flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-4 h-4 text-purple-400" />
                      <span>Gerar Tabela</span>
                    </button>

                    <button
                      onClick={handleGenerateAIRedArchitecture}
                      disabled={isAiLoading}
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      <Sparkles className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
                      <span>{isAiLoading ? 'IA Construindo...' : '⚡ Gerar com IA'}</span>
                    </button>
                  </div>
                </div>

                {/* Sub-bar with Floor count slider & Interface Skill selector */}
                <div className="pt-3 border-t border-[#27272a] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span>Andares Específicos:</span>
                    <input
                      type="range"
                      min={3}
                      max={20}
                      value={numFloors}
                      onChange={e => {
                        setNumFloors(parseInt(e.target.value));
                        setDifficultyTier('custom');
                      }}
                      className="accent-purple-500 w-32 cursor-pointer"
                    />
                    <strong className="text-purple-400 font-bold">{numFloors} Andares</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>Habilidade Interface do Netrunner:</span>
                    <select
                      value={interfaceSkill}
                      onChange={e => {
                        const rank = parseInt(e.target.value);
                        setInterfaceSkill(rank);
                        const actions = getMaxNetActionsForRank(rank);
                        setMaxNetActions(actions);
                        if (!isJackedIn) setNetActionsLeft(actions);
                      }}
                      className="bg-[#0a0a0d] border border-zinc-800 rounded px-2 py-1 text-zinc-200"
                    >
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <option key={n} value={n}>
                          Rank {n} (+{n}) • {getMaxNetActionsForRank(n)} Ações/Rodada
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Elevator Architecture Visualization */}
              {generatedFloors.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left Column: Floors Stack (7 cols) */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-mono uppercase text-purple-400 block font-semibold">
                          {networkName}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {generatedFloors.length} Andares • Dificuldade {difficultyTier.toUpperCase()}
                        </span>
                      </div>

                      {!isJackedIn ? (
                        <button
                          onClick={handleStartJackIn}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs tracking-wider uppercase transition shadow flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Jack In (Iniciar Invasão)</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleJackOut(false)}
                            className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-emerald-900/40 text-xs font-mono"
                          >
                            Jack Out Seguro
                          </button>
                          <button
                            onClick={() => handleJackOut(true)}
                            className="px-3 py-1 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800/50 text-xs font-mono"
                            title="Desconexão de Emergência (2d6 dano cerebral)"
                          >
                            Jack Out Emergência
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Interactive Floor Stack */}
                    <div className="space-y-2.5">
                      {generatedFloors.map((fl, fIdx) => {
                        const isCurrent = isJackedIn && fIdx === currentFloorIndex;
                        const isPassed = isJackedIn && fIdx < currentFloorIndex;

                        return (
                          <div
                            key={fl.floorNumber}
                            className={`p-4 rounded-xl border transition space-y-2 relative ${
                              isCurrent
                                ? 'ring-2 ring-purple-500 bg-purple-950/30 border-purple-500 shadow-lg'
                                : fl.cleared || isPassed
                                ? 'bg-emerald-950/15 border-emerald-800/40 opacity-80'
                                : fl.type === 'black-ice'
                                ? 'bg-red-950/20 border-red-700/60'
                                : fl.type === 'control'
                                ? 'bg-amber-950/20 border-amber-700/60'
                                : fl.type === 'file'
                                ? 'bg-cyan-950/20 border-cyan-700/60'
                                : 'bg-[#121217] border-[#27272a]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                                  isCurrent
                                    ? 'bg-purple-600 border-purple-400 text-white'
                                    : 'bg-black/40 border-zinc-700 text-zinc-200'
                                }`}>
                                  Andar {fl.floorNumber}
                                </span>
                                {isCurrent && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-700 animate-pulse">
                                    ★ SEU DECK AQUI
                                  </span>
                                )}
                                <span className="text-xs font-bold text-zinc-100">{fl.title}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                {fl.dv && (
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-amber-300 font-bold">
                                    DV {fl.dv}
                                  </span>
                                )}
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-zinc-400 uppercase">
                                  {fl.type}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                              {fl.description}
                            </p>

                            {/* Black ICE Stat Block if present */}
                            {fl.blackIce && (
                              <div className={`p-3 rounded-lg border space-y-2 mt-2 font-mono text-xs transition ${
                                fl.blackIceDefeated
                                  ? 'bg-zinc-900/60 border-zinc-800 opacity-60'
                                  : 'bg-black/60 border-red-900/60'
                              }`}>
                                <div className="flex items-center justify-between text-red-400 font-bold">
                                  <span className={`flex items-center gap-1.5 ${fl.blackIceDefeated ? 'line-through text-zinc-500' : ''}`}>
                                    <Skull className="w-3.5 h-3.5" />
                                    {fl.blackIce.name} [{fl.blackIce.classType}]
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    {fl.blackIceDefeated ? (
                                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                                        ✓ DE-REZZADO
                                      </span>
                                    ) : (
                                      <>
                                        {fl.blackIceSlid && (
                                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-yellow-950 text-yellow-300 border border-yellow-800">
                                            💨 SLID
                                          </span>
                                        )}
                                        <span className="text-[10px] text-zinc-500">{fl.blackIce.citation}</span>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* HP Progress bar if not defeated */}
                                {!fl.blackIceDefeated && (
                                  <div className="space-y-1 pt-1">
                                    <div className="flex justify-between text-[10px] text-zinc-400">
                                      <span>HP do Guardião:</span>
                                      <span className="font-bold text-red-400">
                                        {fl.blackIceCurrentHp ?? fl.blackIce.hp} / {fl.blackIceMaxHp ?? fl.blackIce.hp} HP
                                      </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                                      <div
                                        className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300"
                                        style={{
                                          width: `${Math.max(
                                            0,
                                            Math.min(
                                              100,
                                              (((fl.blackIceCurrentHp ?? fl.blackIce.hp)) / (fl.blackIceMaxHp ?? fl.blackIce.hp)) * 100
                                            )
                                          )}%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}

                                <div className="grid grid-cols-4 gap-2 text-center text-[11px] pt-1">
                                  <div className="bg-zinc-900 p-1 rounded">SPD: <strong className="text-zinc-100">{fl.blackIce.spd}</strong></div>
                                  <div className="bg-zinc-900 p-1 rounded">HP: <strong className="text-zinc-100">{fl.blackIceDefeated ? 0 : (fl.blackIceCurrentHp ?? fl.blackIce.hp)}</strong></div>
                                  <div className="bg-zinc-900 p-1 rounded">ATK: <strong className="text-red-400">{fl.blackIce.atk}</strong></div>
                                  <div className="bg-zinc-900 p-1 rounded">DEF: <strong className="text-cyan-400">{fl.blackIce.def}</strong></div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Infiltration Console / Rules (5 cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    {/* Active Jack In Action Pad */}
                    {isJackedIn ? (
                      <div className="p-5 rounded-2xl bg-[#121217] border border-purple-600/60 space-y-4 shadow-xl">
                        <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                          <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-purple-400" />
                            <h3 className="text-xs font-mono uppercase font-bold text-zinc-100">
                              Console de Invasão Neural
                            </h3>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 animate-pulse">
                            ONLINE • CONECTADO
                          </span>
                        </div>

                        {/* Link to Real-World Combatant */}
                        <div className="flex items-center justify-between bg-[#0a0a0d] p-2 rounded-xl border border-zinc-800 text-xs">
                          <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-purple-400" />
                            <span>Vincular Combatente (Mundo Real):</span>
                          </span>
                          <select
                            value={selectedCombatantId}
                            onChange={e => {
                              const cid = e.target.value;
                              setSelectedCombatantId(cid);
                              const found = combatants.find(c => c.id === cid);
                              if (found) {
                                setNetrunnerBrainHP(found.currentHP);
                                setNetrunnerBrainMaxHP(found.maxHP);
                              }
                            }}
                            className="bg-black border border-zinc-700 rounded-lg px-2 py-1 text-zinc-200 text-xs max-w-[170px]"
                          >
                            <option value="">Nenhum (Autônomo)</option>
                            {combatants.map(c => (
                              <option key={c.id} value={c.id}>
                                {c.name} ({c.currentHP}/{c.maxHP} HP)
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Status bar: HP, Actions left, Eddies looted */}
                        <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                          <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1">
                            <span className="text-[9px] text-zinc-400 block uppercase font-semibold">Dano Neural / HP</span>
                            <span className={`text-sm font-bold block ${
                              netrunnerBrainHP <= 10 ? 'text-red-400 animate-pulse' : 'text-emerald-400'
                            }`}>
                              {netrunnerBrainHP} / {netrunnerBrainMaxHP} HP
                            </span>
                            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  netrunnerBrainHP <= 10 ? 'bg-red-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.max(0, Math.min(100, (netrunnerBrainHP / netrunnerBrainMaxHP) * 100))}%` }}
                              />
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-purple-900/60 space-y-1">
                            <span className="text-[9px] text-purple-400 block uppercase font-semibold">Ações Restantes</span>
                            <span className="text-sm font-bold text-purple-300 block">
                              {netActionsLeft} / {maxNetActions}
                            </span>
                            <span className="text-[9px] text-zinc-500 block">Rank {interfaceSkill}</span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1">
                            <span className="text-[9px] text-amber-400 block uppercase font-semibold">Eddies em Dados</span>
                            <span className="text-sm font-bold text-amber-300 block">
                              +{collectedEddiesLoot} eb
                            </span>
                            <span className="text-[9px] text-zinc-500 block">Loot Salvo</span>
                          </div>
                        </div>

                        {/* Cyberdeck Loaded Programs Row */}
                        <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1">
                              <Cpu className="w-3 h-3 text-cyan-400" /> Programas Instalados no Deck:
                            </span>
                            {(!loadedPrograms.shield || !loadedPrograms.sword || !loadedPrograms.banhammer) && (
                              <button
                                onClick={() => executeNetAction('rerez_program')}
                                className="px-2 py-0.5 rounded bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-700 text-[10px] font-mono transition"
                                title="Gasta 1 Ação de Interface para reinstalar programas destruídos"
                              >
                                🔄 Re-rez (1 Ação)
                              </button>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                            <span className={`px-2 py-0.5 rounded border ${
                              loadedPrograms.sword
                                ? 'bg-red-950/60 border-red-800 text-red-300'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-600 line-through'
                            }`}>
                              🗡️ Sword (3d6)
                            </span>
                            <span className={`px-2 py-0.5 rounded border ${
                              loadedPrograms.banhammer
                                ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-600 line-through'
                            }`}>
                              🔨 Banhammer (3d6+2)
                            </span>
                            <span className={`px-2 py-0.5 rounded border ${
                              loadedPrograms.shield
                                ? 'bg-cyan-950/60 border-cyan-800 text-cyan-300'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-600 line-through'
                            }`}>
                              🛡️ Shield (100% Absorção)
                            </span>
                            <span className={`px-2 py-0.5 rounded border ${
                              loadedPrograms.armor
                                ? 'bg-blue-950/60 border-blue-800 text-blue-300'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                            }`}>
                              🦺 Armor (-4 Dano)
                            </span>
                            <span className={`px-2 py-0.5 rounded border ${
                              loadedPrograms.worm
                                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                            }`}>
                              🪱 Worm (+2 DV)
                            </span>
                          </div>
                        </div>

                        {/* ELEVATOR NAVIGATION: Move Up & Move Down */}
                        <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase text-purple-300 font-bold flex items-center gap-1">
                              <Layers className="w-3.5 h-3.5" /> Movimentação no Elevador NET:
                            </span>
                            <span className="text-[11px] font-mono text-zinc-300 font-bold">
                              Andar {generatedFloors[currentFloorIndex]?.floorNumber} de {generatedFloors.length}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                            <button
                              onClick={() => executeNetAction('move_up')}
                              disabled={currentFloorIndex <= 0}
                              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 transition flex items-center justify-center gap-1.5 disabled:opacity-40"
                              title="Subir 1 Andar (Custa 1 Ação de Interface)"
                            >
                              <ArrowUp className="w-3.5 h-3.5 text-purple-400" />
                              <span>Subir Andar (1 Ação)</span>
                            </button>

                            <button
                              onClick={() => executeNetAction('move_down')}
                              disabled={currentFloorIndex >= generatedFloors.length - 1}
                              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 transition flex items-center justify-center gap-1.5 disabled:opacity-40"
                              title="Descer 1 Andar (Custa 1 Ação de Interface)"
                            >
                              <ArrowDown className="w-3.5 h-3.5 text-purple-400" />
                              <span>Descer Andar (1 Ação)</span>
                            </button>
                          </div>

                          {/* Blocked warning banner if elevator is blocked */}
                          {generatedFloors[currentFloorIndex]?.type === 'password' && !generatedFloors[currentFloorIndex]?.cleared && (
                            <p className="text-[10px] text-amber-300 font-mono bg-amber-950/40 p-1.5 rounded border border-amber-900/60 flex items-center gap-1">
                              <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>Firewall ativo bloqueia a descida! Use a ação <strong>Backdoor</strong> para abrir.</span>
                            </p>
                          )}
                          {generatedFloors[currentFloorIndex]?.type === 'black-ice' && !generatedFloors[currentFloorIndex]?.blackIceDefeated && !generatedFloors[currentFloorIndex]?.blackIceSlid && (
                            <p className="text-[10px] text-red-300 font-mono bg-red-950/40 p-1.5 rounded border border-red-900/60 flex items-center gap-1">
                              <Skull className="w-3 h-3 text-red-400 shrink-0" />
                              <span>Black ICE ativo bloqueia a descida! Destrua-o ou use <strong>Slide</strong> para passar.</span>
                            </p>
                          )}
                        </div>

                        {/* ACTIVE FLOOR CONTEXTUAL COMBAT & ACTIONS */}
                        <div className="space-y-2 pt-1">
                          {/* If on Black ICE Floor with Active Black ICE */}
                          {generatedFloors[currentFloorIndex]?.blackIce && !generatedFloors[currentFloorIndex]?.blackIceDefeated ? (
                            <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/60 space-y-2">
                              <div className="flex items-center justify-between text-xs font-mono font-bold text-red-300">
                                <span className="flex items-center gap-1.5">
                                  <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />
                                  <span>Combate: {generatedFloors[currentFloorIndex]?.blackIce?.name}</span>
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-red-900 text-red-100">
                                  DEF {generatedFloors[currentFloorIndex]?.blackIce?.def} • ATK {generatedFloors[currentFloorIndex]?.blackIce?.atk}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <button
                                  onClick={() => executeNetAction('sword')}
                                  disabled={!loadedPrograms.sword}
                                  className="p-2 rounded-lg bg-red-900/80 hover:bg-red-800 text-white font-mono font-bold transition flex items-center gap-1.5 disabled:opacity-40"
                                >
                                  <Crosshair className="w-3.5 h-3.5 text-red-200" />
                                  <div className="text-left">
                                    <strong className="block text-[11px]">Sword</strong>
                                    <span className="text-[9px] text-red-200">3d6 Dano Anti-ICE</span>
                                  </div>
                                </button>

                                <button
                                  onClick={() => executeNetAction('banhammer')}
                                  disabled={!loadedPrograms.banhammer}
                                  className="p-2 rounded-lg bg-amber-900/80 hover:bg-amber-800 text-white font-mono font-bold transition flex items-center gap-1.5 disabled:opacity-40"
                                >
                                  <Hammer className="w-3.5 h-3.5 text-amber-200" />
                                  <div className="text-left">
                                    <strong className="block text-[11px]">Banhammer</strong>
                                    <span className="text-[9px] text-amber-200">3d6+2 Dano Pesado</span>
                                  </div>
                                </button>

                                <button
                                  onClick={() => executeNetAction('zap')}
                                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-left transition flex items-center gap-1.5 font-mono"
                                >
                                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                                  <div>
                                    <strong className="block text-[11px]">Zap</strong>
                                    <span className="text-[9px] text-zinc-400">1d6 Dano Rápido</span>
                                  </div>
                                </button>

                                <button
                                  onClick={() => executeNetAction('slide')}
                                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-left transition flex items-center gap-1.5 font-mono"
                                >
                                  <Footprints className="w-3.5 h-3.5 text-cyan-400" />
                                  <div>
                                    <strong className="block text-[11px]">Slide (Evasão)</strong>
                                    <span className="text-[9px] text-zinc-400">DV {13 + (generatedFloors[currentFloorIndex]?.blackIce?.spd || 4)}</span>
                                  </div>
                                </button>
                              </div>

                              {/* Manual Trigger for GM or Testing */}
                              <button
                                onClick={() => {
                                  const ice = generatedFloors[currentFloorIndex]?.blackIce;
                                  if (ice) triggerBlackIceCounterAttack(ice, currentFloorIndex);
                                }}
                                className="w-full py-1.5 rounded-lg bg-red-950 hover:bg-red-900 border border-red-800/60 text-red-300 text-[10px] font-mono transition flex items-center justify-center gap-1.5"
                                title="Gira o contra-ataque do Black ICE imediatamente contra o Netrunner"
                              >
                                <Skull className="w-3 h-3 text-red-400" />
                                <span>Disparar Contra-Ataque do Black ICE Agora</span>
                              </button>
                            </div>
                          ) : null}

                          {/* General Net Actions Grid */}
                          <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block pt-1">
                            Ações de Interface Gerais:
                          </span>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <button
                              onClick={() => executeNetAction('backdoor')}
                              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-left transition flex items-center gap-1.5"
                            >
                              <Key className="w-3.5 h-3.5 text-amber-400" />
                              <div>
                                <strong className="block text-[11px]">Backdoor</strong>
                                <span className="text-[9px] text-zinc-400">Quebrar senha</span>
                              </div>
                            </button>

                            <button
                              onClick={() => executeNetAction('control')}
                              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-left transition flex items-center gap-1.5"
                            >
                              <Shield className="w-3.5 h-3.5 text-cyan-400" />
                              <div>
                                <strong className="block text-[11px]">Control</strong>
                                <span className="text-[9px] text-zinc-400">Controlar nó</span>
                              </div>
                            </button>

                            <button
                              onClick={() => executeNetAction('eye')}
                              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-left transition flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5 text-emerald-400" />
                              <div>
                                <strong className="block text-[11px]">Eye on Net</strong>
                                <span className="text-[9px] text-zinc-400">Baixar arquivos</span>
                              </div>
                            </button>

                            <button
                              onClick={() => executeNetAction('pathfinder')}
                              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-left transition flex items-center gap-1.5"
                            >
                              <Search className="w-3.5 h-3.5 text-purple-400" />
                              <div>
                                <strong className="block text-[11px]">Pathfinder</strong>
                                <span className="text-[9px] text-zinc-400">Escanear nós</span>
                              </div>
                            </button>
                          </div>

                          {/* Next Net Round / End Turn */}
                          <button
                            onClick={handleNextNetRound}
                            className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-mono font-bold uppercase transition flex items-center justify-center gap-2 mt-2 shadow-lg"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Encerrar Turno (Recarregar {maxNetActions} Ações)</span>
                          </button>
                          <span className="text-[10px] text-zinc-500 font-mono text-center block">
                            * Se houver Black ICE ativo no andar, ele contra-atacará antes da recarga.
                          </span>
                        </div>

                        {/* Terminal Run Log */}
                        <div className="space-y-1 pt-2 border-t border-zinc-800">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase block">Log do Cyberdeck:</span>
                          <div className="p-3 rounded-lg bg-black/80 border border-zinc-800 text-[11px] font-mono text-zinc-300 max-h-52 overflow-y-auto space-y-1">
                            {runLog.map((logLine, lIdx) => (
                              <div key={lIdx} className="leading-snug">
                                {logLine}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Secret Loot Brief & Rules Cheat Sheet */
                      <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4 text-xs">
                        {secretDataLoot && (
                          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 space-y-1">
                            <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block flex items-center gap-1">
                              <Coins className="w-3 h-3" /> Recompensa de Dados (Loot)
                            </span>
                            <p className="text-zinc-300 text-xs">{secretDataLoot}</p>
                          </div>
                        )}

                        <span className="font-mono text-xs uppercase text-zinc-300 font-semibold block border-b border-[#27272a] pb-2">
                          Regras de Netrunning & Ações de Interface
                        </span>

                        <div className="space-y-2.5 text-zinc-400 leading-relaxed">
                          <div>
                            <strong className="text-zinc-200 block font-mono text-[11px]">Jack In (Conexão Física):</strong>
                            Exige estar a no máximo 6 metros ou 8 metros (com cabos) do ponto de acesso físico no mundo real.
                          </div>
                          <div>
                            <strong className="text-zinc-200 block font-mono text-[11px]">Ações por Turno:</strong>
                            Rank 1-3 = 2 ações; Rank 4-6 = 3 ações; Rank 7-9 = 4 ações; Rank 10 = 5 ações de Interface por turno.
                          </div>
                          <div>
                            <strong className="text-zinc-200 block font-mono text-[11px]">Backdoor & Control:</strong>
                            Quebram senhas de nós e assumem controle de dispositivos de segurança conectados.
                          </div>
                          <div>
                            <strong className="text-zinc-200 block font-mono text-[11px]">Combate de Black ICE:</strong>
                            O Black ICE rola Iniciativa usando SPD. Se acertar o Netrunner com ATK vs DEF, causa dano cerebral ou queima memória do deck.
                          </div>
                          <div>
                            <strong className="text-zinc-200 block font-mono text-[11px]">Slide:</strong>
                            Fuga emergencial de um combate contra Black ICE para o andar superior ou inferior.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-12 rounded-2xl bg-[#121217] border border-dashed border-[#27272a] text-center space-y-2">
                  <Network className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-xs text-zinc-400">Nenhuma arquitetura gerada ainda.</p>
                  <p className="text-[11px] text-zinc-500">Escolha a organização e a dificuldade e clique em "Gerar Tabela" ou "Gerar com IA".</p>
                </div>
              )}
            </div>
          ) : (
            /* CP 2020 Classic Datafortress View */
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">Fortaleza de Dados Clássica (Cyberpunk 2020)</h3>
                  <p className="text-xs text-zinc-400">Calcula CPUs, Data Walls, Code Gates e programas de defesa da Série Demônio.</p>
                </div>
                <button
                  onClick={handleGenerate2020Fortress}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Gerar Fortaleza</span>
                </button>
              </div>

              {datafortress ? (
                <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60">
                        {datafortress.theme.name}
                      </span>
                      <h3 className="text-base font-bold text-zinc-100 mt-1">Fortaleza Matricial Corporativa</h3>
                    </div>
                    <span className="text-xs font-mono text-zinc-400">{datafortress.memoryMUs} MUs Totais</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center font-mono text-xs">
                    <div className="bg-[#0a0a0d] p-3 rounded-xl border border-[#27272a]">
                      <span className="text-[10px] text-zinc-500 block">CPUs</span>
                      <strong className="text-base text-zinc-100">{datafortress.cpus}</strong>
                    </div>
                    <div className="bg-[#0a0a0d] p-3 rounded-xl border border-[#27272a]">
                      <span className="text-[10px] text-zinc-500 block">Data Wall (Força)</span>
                      <strong className="text-base text-cyan-400">{datafortress.dataWallStrength}</strong>
                    </div>
                    <div className="bg-[#0a0a0d] p-3 rounded-xl border border-[#27272a]">
                      <span className="text-[10px] text-zinc-500 block">Code Gate (Força)</span>
                      <strong className="text-base text-purple-400">{datafortress.codeGateStrength}</strong>
                    </div>
                  </div>

                  {/* Installed Programs */}
                  <div className="space-y-2 pt-2 border-t border-[#27272a]">
                    <span className="text-xs font-mono uppercase text-zinc-400 font-semibold block">
                      Programas Ativos de Defesa (ICE)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {datafortress.installedPrograms.map((p, i) => (
                        <div key={i} className="p-3 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-1 font-mono">
                          <div className="flex items-center justify-between text-zinc-100">
                            <strong className="text-amber-400">{p.name}</strong>
                            <span className="text-[10px] text-zinc-500">{p.cost}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                            <span>Força: {p.strength}</span>
                            <span>MUs: {p.mu}</span>
                            <span className="text-zinc-500">{p.category}</span>
                          </div>
                          <p className="text-[11px] text-zinc-300 font-sans pt-1">{p.effect}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 rounded-2xl bg-[#121217] border border-dashed border-[#27272a] text-center space-y-2">
                  <Cpu className="w-8 h-8 text-zinc-600 mx-auto" />
                  <p className="text-xs text-zinc-400">Nenhuma fortaleza de dados gerada ainda.</p>
                  <p className="text-[11px] text-zinc-500">Clique em "Gerar Fortaleza de Dados" para calcular CPUs e defesas.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* SUB-TAB 2: MICRO-NETRUNNING & IOT */}
      {activeSubTab === 'micro-net' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Micro-devices selector & simulator (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#121217] border border-[#27272a]">
              {['Todos', 'Terminal Urbano', 'Dispositivo Móvel', 'Segurança Local', 'Veicular', 'Médico & Infraestrutura'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setMicroCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition ${
                    microCategory === cat
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-[#0a0a0d] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* List of Micro Devices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredMicroSystems.map(sys => {
                const isSelected = selectedMicroSystem.id === sys.id;
                return (
                  <div
                    key={sys.id}
                    onClick={() => {
                      setSelectedMicroSystem(sys);
                      setHackResults({});
                    }}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition space-y-2 ${
                      isSelected
                        ? 'bg-[#181822] border-purple-500 ring-1 ring-purple-500/50 shadow-md'
                        : 'bg-[#121217] border-[#27272a] hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        {sys.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-purple-400">
                        {sys.floorsCount} Níveis • DV {sys.entryDV}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-zinc-100">{sys.name}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{sys.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Selected Micro-System Interactive Hack Terminal */}
            <div className="p-6 rounded-2xl bg-[#0e0e13] border border-purple-900/40 space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-wider block">
                    TERMINAL DE INVASÃO // LINK DIRETO DE CABO VIRTUAL
                  </span>
                  <h2 className="text-base font-bold text-zinc-100 mt-0.5">
                    {selectedMicroSystem.name}
                  </h2>
                </div>

                {/* Netrunner Skill Input */}
                <div className="flex items-center gap-2 bg-[#09090c] border border-zinc-800 rounded-lg p-1.5 px-3">
                  <span className="text-xs font-mono text-zinc-400">Seu Bônus de Interface:</span>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={interfaceSkill}
                    onChange={e => setInterfaceSkill(Number(e.target.value))}
                    className="w-12 bg-zinc-900 border border-zinc-700 rounded px-1.5 py-0.5 text-xs font-mono text-center text-purple-300 focus:outline-none"
                  />
                </div>
              </div>

              {/* Levels of the Micro System */}
              <div className="space-y-3">
                {selectedMicroSystem.floors.map(floor => {
                  const res = hackResults[floor.level];
                  return (
                    <div
                      key={floor.level}
                      className="p-4 rounded-xl bg-[#09090c] border border-[#27272a] space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-bold">
                            Nível {floor.level}
                          </span>
                          <strong className="text-xs text-zinc-100">{floor.name}</strong>
                        </div>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/40">
                          DV {floor.dv} [{floor.type.toUpperCase()}]
                        </span>
                      </div>

                      <div className="text-xs text-zinc-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span>Efeito ao quebrar: <strong className="text-zinc-200">{floor.hackEffect}</strong></span>
                        <button
                          onClick={() => handleRollMicroHack(floor.level, floor.dv, floor.hackEffect)}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow"
                        >
                          <Terminal className="w-3.5 h-3.5" />
                          <span>Rolar Hack (1d10+{interfaceSkill})</span>
                        </button>
                      </div>

                      {/* Hack Result Log */}
                      {res && (
                        <div
                          className={`p-3 rounded-lg border text-xs font-mono leading-relaxed transition ${
                            res.success
                              ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                              : 'bg-red-950/40 border-red-700/60 text-red-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-bold mb-1">
                            {res.success ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            <span>{res.text}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Micro-Netrunning Rules Panel (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4 text-xs">
            <span className="font-mono text-xs uppercase text-purple-400 font-semibold block border-b border-[#27272a] pb-2">
              Regras Rápidas: Micro-Invasão Urbana
            </span>

            <p className="text-zinc-400 leading-relaxed">
              Diferente de mega-arquiteturas corporativas que exigem cyberdecks pesados e imersão neural completa, <strong>Micro-Sistemas</strong> são dispositivos autônomos de rua com chips de controle local.
            </p>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-lg bg-[#0a0a0d] border border-zinc-800">
                <strong className="text-zinc-200 font-mono block text-[11px] mb-0.5">Alcance de Conexão:</strong>
                <p className="text-zinc-400">Exige contato físico com a porta de manutenção ou estar a até 6 metros via link sem fio de curto alcance.</p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0a0a0d] border border-zinc-800">
                <strong className="text-zinc-200 font-mono block text-[11px] mb-0.5">Tempo de Ação:</strong>
                <p className="text-zinc-400">Cada tentativa de quebra consome 1 Ação de Combate do Netrunner.</p>
              </div>

              <div className="p-2.5 rounded-lg bg-[#0a0a0d] border border-zinc-800">
                <strong className="text-zinc-200 font-mono block text-[11px] mb-0.5">Falha Crítica (Roll 1):</strong>
                <p className="text-zinc-400">O dispositivo aciona alarme sonoro, queima o chip de dados ou trava permanentemente até ser reiniciado fisicamente.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: BLACK ICE & PROGRAMS CATALOG */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar programa ou Black ICE (ex: Hellhound, Asp, Killer, Balron...)"
                value={catalogSearch}
                onChange={e => setCatalogSearch(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-2">
              {['Todos', 'Antipessoal', 'Antiprograma'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCatalogFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
                    catalogFilter === cat
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-[#0a0a0d] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RED_BLACK_ICE_ROSTER.filter(ice => {
              const match = ice.name.toLowerCase().includes(catalogSearch.toLowerCase()) || ice.effect.toLowerCase().includes(catalogSearch.toLowerCase());
              const catMatch = catalogFilter === 'Todos' || (catalogFilter === 'Antipessoal' && ice.classType.includes('Antipessoal')) || (catalogFilter === 'Antiprograma' && ice.classType.includes('Antiprograma'));
              return match && catMatch;
            }).map((ice, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3 font-mono">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-red-400">{ice.name}</h3>
                    <span className="text-[10px] text-zinc-500 uppercase">{ice.classType}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">RED Core</span>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-[#0a0a0d] p-1.5 rounded border border-zinc-800">
                    <span className="text-[9px] text-zinc-500 block">SPD</span>
                    <strong className="text-zinc-200">{ice.spd}</strong>
                  </div>
                  <div className="bg-[#0a0a0d] p-1.5 rounded border border-zinc-800">
                    <span className="text-[9px] text-zinc-500 block">HP</span>
                    <strong className="text-zinc-200">{ice.hp}</strong>
                  </div>
                  <div className="bg-[#0a0a0d] p-1.5 rounded border border-zinc-800">
                    <span className="text-[9px] text-zinc-500 block">ATK</span>
                    <strong className="text-red-400">{ice.atk}</strong>
                  </div>
                  <div className="bg-[#0a0a0d] p-1.5 rounded border border-zinc-800">
                    <span className="text-[9px] text-zinc-500 block">DEF</span>
                    <strong className="text-cyan-400">{ice.def}</strong>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 font-sans leading-relaxed pt-1">
                  {ice.effect}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};