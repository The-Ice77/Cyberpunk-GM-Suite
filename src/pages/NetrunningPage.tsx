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
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
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
  cleared?: boolean;
}

type NetDifficultyTier = 'basic' | 'standard' | 'advanced' | 'fortress' | 'custom';

export const NetrunningPage: React.FC = () => {
  const { system, isRed } = useSystem();
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
  const [netActionsLeft, setNetActionsLeft] = useState<number>(3);
  const [maxNetActions, setMaxNetActions] = useState<number>(3);
  const [runLog, setRunLog] = useState<string[]>([]);
  const [netrunnerBrainHP, setNetrunnerBrainHP] = useState<number>(35);
  const [collectedEddiesLoot, setCollectedEddiesLoot] = useState<number>(0);

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
  const [interfaceSkill, setInterfaceSkill] = useState<number>(6);
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

      floors.push({ floorNumber: f, type, title, dv, description: desc, blackIce, cleared: false });
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
    setNetActionsLeft(maxNetActions);
    setNetrunnerBrainHP(35);
    setCollectedEddiesLoot(0);
    setRunLog([
      `[JACK IN REALIZADO] Cabo de interface conectado ao ponto de acesso físico de ${networkName}.`,
      `Você entra no Andar 1: ${generatedFloors[0].title}.`,
    ]);
  };

  const handleJackOut = (emergency: boolean = false) => {
    if (emergency) {
      const dmg = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1; // 2d6
      setNetrunnerBrainHP(prev => Math.max(0, prev - dmg));
      setRunLog(prev => [
        ...prev,
        `[DESCONEXÃO DE EMERGÊNCIA!] O Netrunner arrancou os cabos! Sofreu ${dmg} de dano cerebral direto e fica Desorientado!`,
      ]);
    } else {
      setRunLog(prev => [
        ...prev,
        `[JACK OUT SEGURO] Sessão de invasão encerrada. Total de Eddies e dados salvos no Cyberdeck!`,
      ]);
    }
    setIsJackedIn(false);
  };

  const executeNetAction = (actionType: 'pathfinder' | 'backdoor' | 'control' | 'eye' | 'slide' | 'sword' | 'virus') => {
    if (netActionsLeft <= 0) {
      alert('Você gastou todas as suas Ações de Interface desta rodada! Clique em "Finalizar Turno / Próxima Rodada".');
      return;
    }

    const currentFloor = generatedFloors[currentFloorIndex];
    if (!currentFloor) return;

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

    const rollTotal = d10 + bonus + interfaceSkill;
    const dv = currentFloor.dv || 13;
    const success = rollTotal >= dv;

    setNetActionsLeft(prev => prev - 1);

    if (actionType === 'pathfinder') {
      const nextFloor = generatedFloors[currentFloorIndex + 1];
      if (nextFloor) {
        setRunLog(prev => [
          ...prev,
          `[PATHFINDER - Total ${rollTotal} vs DV ${dv}]${critText}: O sensor óptico do deck revela o Andar ${nextFloor.floorNumber}: ${nextFloor.title} [Tipo: ${nextFloor.type.toUpperCase()}]`,
        ]);
      } else {
        setRunLog(prev => [
          ...prev,
          `[PATHFINDER - Total ${rollTotal}]: Você já está no andar mais profundo desta arquitetura!`,
        ]);
      }
    } else if (actionType === 'backdoor') {
      if (success) {
        setRunLog(prev => [
          ...prev,
          `[BACKDOOR SUCESSO! Total ${rollTotal} vs DV ${dv}]${critText}: Criptografia quebrada! Acesso liberado ao próximo nível.`,
        ]);
        const updated = [...generatedFloors];
        updated[currentFloorIndex].cleared = true;
        setGeneratedFloors(updated);
        if (currentFloorIndex < generatedFloors.length - 1) {
          setCurrentFloorIndex(prev => prev + 1);
        }
      } else {
        setRunLog(prev => [
          ...prev,
          `[BACKDOOR FALHA! Total ${rollTotal} vs DV ${dv}]${critText}: Firewall resistiu e disparou contra-medidas!`,
        ]);
      }
    } else if (actionType === 'control') {
      if (success) {
        setRunLog(prev => [
          ...prev,
          `[CONTROL SUCESSO! Total ${rollTotal} vs DV ${dv}]${critText}: Dispositivo assumido! As câmeras/torretas agora obedecem ao seu cyberdeck.`,
        ]);
        const updated = [...generatedFloors];
        updated[currentFloorIndex].cleared = true;
        setGeneratedFloors(updated);
      } else {
        setRunLog(prev => [
          ...prev,
          `[CONTROL FALHA! Total ${rollTotal} vs DV ${dv}]${critText}: O controlador físico recusou a injeção do comando.`,
        ]);
      }
    } else if (actionType === 'eye') {
      if (success) {
        const reward = Math.floor(Math.random() * 5 + 1) * 200; // 200-1000eb
        setCollectedEddiesLoot(prev => prev + reward);
        setRunLog(prev => [
          ...prev,
          `[EYE ON THE NET SUCESSO! Total ${rollTotal} vs DV ${dv}]${critText}: Arquivo sigiloso baixado! (+${reward} eb de dados comerciais salvos no deck)`,
        ]);
        const updated = [...generatedFloors];
        updated[currentFloorIndex].cleared = true;
        setGeneratedFloors(updated);
      } else {
        setRunLog(prev => [
          ...prev,
          `[EYE ON THE NET FALHA! Total ${rollTotal} vs DV ${dv}]${critText}: Arquivo protegido por chaves criptográficas assimétricas.`,
        ]);
      }
    } else if (actionType === 'sword') {
      if (currentFloor.blackIce) {
        const iceDef = currentFloor.blackIce.def;
        const hit = rollTotal >= iceDef;
        if (hit) {
          const dmg = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1; // 3d6
          setRunLog(prev => [
            ...prev,
            `[COMBATE - PROGRAMA SWORD SUCESSO! Total ${rollTotal} vs DEF ${iceDef}]${critText}: Ataque desferido! Causou ${dmg} de dano direto ao ${currentFloor.blackIce?.name}!`,
          ]);
          const updated = [...generatedFloors];
          updated[currentFloorIndex].cleared = true;
          setGeneratedFloors(updated);
        } else {
          setRunLog(prev => [
            ...prev,
            `[COMBATE - PROGRAMA SWORD ERROU! Total ${rollTotal} vs DEF ${iceDef}]${critText}: O Black ICE desviou pelo buffer de memória!`,
          ]);
        }
      } else {
        setRunLog(prev => [...prev, `[SWORD]: Não há Black ICE hostil ativo neste nó.`]);
      }
    } else if (actionType === 'slide') {
      if (success) {
        setRunLog(prev => [
          ...prev,
          `[SLIDE BEM SUCEDIDO! Total ${rollTotal} vs DV ${dv}]${critText}: Manobra evasiva executada! Você deslizou para fora do alcance do guardião.`,
        ]);
        if (currentFloorIndex > 0) {
          setCurrentFloorIndex(prev => prev - 1);
        }
      } else {
        setRunLog(prev => [
          ...prev,
          `[SLIDE FALHOU! Total ${rollTotal} vs DV ${dv}]${critText}: Você não conseguiu quebrar o engajamento com o Black ICE!`,
        ]);
      }
    } else if (actionType === 'virus') {
      if (success) {
        setRunLog(prev => [
          ...prev,
          `[VIRUS INJETADO NO NÚCLEO! Total ${rollTotal} vs DV ${dv}]${critText}: O código malicioso se espalhou por toda a arquitetura! O sistema agora está permanentemente comprometido!`,
        ]);
      } else {
        setRunLog(prev => [
          ...prev,
          `[VIRUS RECUSADO! Total ${rollTotal} vs DV ${dv}]${critText}: O compilador do nó rejeitou o payload do vírus.`,
        ]);
      }
    }
  };

  const handleNextNetRound = () => {
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
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Target Org Selection */}
                  <div className="space-y-1 w-full lg:w-1/3">
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
                  <div className="space-y-1 w-full lg:w-auto">
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
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0">
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
                      onChange={e => setInterfaceSkill(parseInt(e.target.value))}
                      className="bg-[#0a0a0d] border border-zinc-800 rounded px-2 py-1 text-zinc-200"
                    >
                      {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <option key={n} value={n}>
                          Rank {n} (+{n})
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
                              <div className="p-3 rounded-lg bg-black/50 border border-red-900/50 space-y-2 mt-2 font-mono text-xs">
                                <div className="flex items-center justify-between text-red-400 font-bold">
                                  <span className="flex items-center gap-1.5">
                                    <Skull className="w-3.5 h-3.5" />
                                    {fl.blackIce.name} [{fl.blackIce.classType}]
                                  </span>
                                  <span className="text-[10px] text-zinc-500">{fl.blackIce.citation}</span>
                                </div>

                                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                                  <div className="bg-zinc-900 p-1 rounded">SPD: <strong className="text-zinc-100">{fl.blackIce.spd}</strong></div>
                                  <div className="bg-zinc-900 p-1 rounded">HP: <strong className="text-zinc-100">{fl.blackIce.hp}</strong></div>
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
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                            ONLINE
                          </span>
                        </div>

                        {/* Status bar: HP, Actions left, Eddies looted */}
                        <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                          <div className="p-2 rounded-lg bg-[#0a0a0d] border border-zinc-800">
                            <span className="text-[9px] text-zinc-500 block uppercase">Dano Neural</span>
                            <span className="text-sm font-bold text-emerald-400">{netrunnerBrainHP} HP</span>
                          </div>
                          <div className="p-2 rounded-lg bg-[#0a0a0d] border border-purple-900/60">
                            <span className="text-[9px] text-purple-400 block uppercase">Ações Restantes</span>
                            <span className="text-sm font-bold text-purple-300">{netActionsLeft} / {maxNetActions}</span>
                          </div>
                          <div className="p-2 rounded-lg bg-[#0a0a0d] border border-zinc-800">
                            <span className="text-[9px] text-zinc-500 block uppercase">Eddies em Dados</span>
                            <span className="text-sm font-bold text-amber-400">+{collectedEddiesLoot} eb</span>
                          </div>
                        </div>

                        {/* Netrunner Action Buttons */}
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
                            Ações de Interface Rápidas:
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
                                <span className="text-[9px] text-zinc-400">Escanear adiante</span>
                              </div>
                            </button>

                            <button
                              onClick={() => executeNetAction('sword')}
                              className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-200 text-left transition flex items-center gap-1.5"
                            >
                              <Crosshair className="w-3.5 h-3.5 text-red-400" />
                              <div>
                                <strong className="block text-[11px]">Sword</strong>
                                <span className="text-[9px] text-red-300">Atacar Black ICE</span>
                              </div>
                            </button>

                            <button
                              onClick={() => executeNetAction('slide')}
                              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-left transition flex items-center gap-1.5"
                            >
                              <LogOut className="w-3.5 h-3.5 text-yellow-400" />
                              <div>
                                <strong className="block text-[11px]">Slide</strong>
                                <span className="text-[9px] text-zinc-400">Fuga de combate</span>
                              </div>
                            </button>
                          </div>

                          <button
                            onClick={handleNextNetRound}
                            className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-mono font-bold uppercase transition flex items-center justify-center gap-2 mt-2"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Encerrar Turno (Recarregar Ações)</span>
                          </button>
                        </div>

                        {/* Terminal Run Log */}
                        <div className="space-y-1 pt-2 border-t border-zinc-800">
                          <span className="text-[10px] font-mono text-zinc-500 uppercase block">Log do Cyberdeck:</span>
                          <div className="p-3 rounded-lg bg-black/70 border border-zinc-800 text-[11px] font-mono text-zinc-300 max-h-48 overflow-y-auto space-y-1">
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