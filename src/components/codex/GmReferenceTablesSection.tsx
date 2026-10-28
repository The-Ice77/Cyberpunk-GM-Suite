import React, { useState } from 'react';
import {
  Crosshair,
  Skull,
  Shield,
  Zap,
  Target,
  Activity,
  Cpu,
  Car,
  Flame,
  Swords,
  HeartPulse,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  HelpCircle,
  Dices,
  RotateCcw,
  AlertTriangle,
  Award,
  Layers,
  Terminal,
  Gauge,
  Eye,
  Bandage,
} from 'lucide-react';

// ==========================================
// DATA DEFINITIONS FOR TABLES
// ==========================================

export interface WeaponRangeRow {
  weapon: string;
  category: string;
  damage: string;
  rof: number;
  r0_6: number | string;
  r7_12: number | string;
  r13_25: number | string;
  r26_50: number | string;
  r51_100: number | string;
  r101_200: number | string;
  r201_400: number | string;
  r401_800: number | string;
  notes?: string;
}

export const WEAPON_RANGE_DATA: WeaponRangeRow[] = [
  {
    weapon: 'Pistola Média',
    category: 'Pistola',
    damage: '2d6',
    rof: 2,
    r0_6: 13,
    r7_12: 15,
    r13_25: 20,
    r26_50: 25,
    r51_100: 30,
    r101_200: 'N/A',
    r201_400: 'N/A',
    r401_800: 'N/A',
    notes: 'Ocultável. Carregador padrão de 12 ou 18 tiros.',
  },
  {
    weapon: 'Pistola Pesada',
    category: 'Pistola',
    damage: '3d6',
    rof: 2,
    r0_6: 13,
    r7_12: 15,
    r13_25: 20,
    r26_50: 25,
    r51_100: 30,
    r101_200: 'N/A',
    r201_400: 'N/A',
    r401_800: 'N/A',
    notes: 'A arma de serviço padrão de Night City. Ocultável.',
  },
  {
    weapon: 'Pistola Muito Pesada',
    category: 'Pistola',
    damage: '4d6',
    rof: 1,
    r0_6: 13,
    r7_12: 15,
    r13_25: 20,
    r26_50: 25,
    r51_100: 30,
    r101_200: 'N/A',
    r201_400: 'N/A',
    r401_800: 'N/A',
    notes: 'Estilo canhão de mão (Malorian / Borg). Não ocultável.',
  },
  {
    weapon: 'Submetralhadora (SMG)',
    category: 'SMG',
    damage: '2d6',
    rof: 1,
    r0_6: 15,
    r7_12: 13,
    r13_25: 15,
    r26_50: 20,
    r51_100: 25,
    r101_200: 30,
    r201_400: 'N/A',
    r401_800: 'N/A',
    notes: 'Capaz de Autofire (Mult. Máx x3) e Fogo Supressivo. Ocultável.',
  },
  {
    weapon: 'SMG Pesada',
    category: 'SMG',
    damage: '3d6',
    rof: 1,
    r0_6: 15,
    r7_12: 13,
    r13_25: 17,
    r26_50: 20,
    r51_100: 25,
    r101_200: 'N/A',
    r201_400: 'N/A',
    r401_800: 'N/A',
    notes: 'Capaz de Autofire (Mult. Máx x3). Maior poder de parada.',
  },
  {
    weapon: 'Espingarda (Projétil Único - Slug)',
    category: 'Espingarda',
    damage: '5d6',
    rof: 1,
    r0_6: 13,
    r7_12: 15,
    r13_25: 20,
    r26_50: 25,
    r51_100: 30,
    r101_200: 'N/A',
    r201_400: 'N/A',
    r401_800: 'N/A',
    notes: 'Tiro maciço contra um único alvo. Destrói portas e armaduras.',
  },
  {
    weapon: 'Espingarda (Chumbo / Cone 3x3m)',
    category: 'Espingarda',
    damage: '3d6',
    rof: 1,
    r0_6: 13,
    r7_12: 'Área',
    r13_25: 'N/A',
    r26_50: 'N/A',
    r51_100: 'N/A',
    r101_200: 'N/A',
    r201_400: 'N/A',
    r401_800: 'N/A',
    notes: 'Dispara em cone de 3x3m até 6m. Todos na área sofrem 3d6 (Evasão vs DV 13).',
  },
  {
    weapon: 'Fuzil de Assalto',
    category: 'Fuzil',
    damage: '5d6',
    rof: 1,
    r0_6: 17,
    r7_12: 16,
    r13_25: 15,
    r26_50: 13,
    r51_100: 15,
    r101_200: 20,
    r201_400: 25,
    r401_800: 30,
    notes: 'A rainha do combate em campo aberto. Autofire (Mult. Máx x4).',
  },
  {
    weapon: 'Fuzil de Precisão (Sniper)',
    category: 'Fuzil',
    damage: '5d6',
    rof: 1,
    r0_6: 30,
    r7_12: 25,
    r13_25: 20,
    r26_50: 15,
    r51_100: 13,
    r101_200: 15,
    r201_400: 17,
    r401_800: 20,
    notes: 'Excelente à longa distância (51-100m). Péssimo à queima-roupa (DV 30).',
  },
  {
    weapon: 'Arco & Besta',
    category: 'Silenciosa',
    damage: '4d6',
    rof: 1,
    r0_6: 15,
    r7_12: 13,
    r13_25: 15,
    r26_50: 17,
    r51_100: 20,
    r101_200: 22,
    r201_400: 25,
    r401_800: 'N/A',
    notes: 'Disparo silencioso. Pode usar dardos com biotoxina ou pontas explosivas.',
  },
  {
    weapon: 'Lança-Granadas & Foguetes',
    category: 'Pesada',
    damage: '6d6 / 8d6',
    rof: 1,
    r0_6: 16,
    r7_12: 15,
    r13_25: 15,
    r26_50: 17,
    r51_100: 20,
    r101_200: 22,
    r201_400: 25,
    r401_800: 'N/A',
    notes: 'Dano de explosão em raio de 10x10m. Se errar, rola tabela de desvio.',
  },
];

export interface CriticalInjury {
  roll: number;
  name: string;
  effect: string;
  bonusDamage: string;
  firstAidDV: number;
  surgeryDV: number;
  severity: 'Grave' | 'Crítica' | 'Mutiladora';
}

export const BODY_CRITICAL_INJURIES: CriticalInjury[] = [
  {
    roll: 2,
    name: 'Membro Desmembrado (Dismembered Arm)',
    effect: 'Braço amputado. Solta item imediatamente e não pode usar duas mãos. Hemorragia contínua de 5 PV no fim de cada turno até estabilização.',
    bonusDamage: '+5 PV direto',
    firstAidDV: 15,
    surgeryDV: 17,
    severity: 'Mutiladora',
  },
  {
    roll: 3,
    name: 'Mão Desmembrada (Dismembered Hand)',
    effect: 'Mão decepada na altura do pulso. Derruba o item empunhado. Braço não pode mais segurar objetos nem operar armas.',
    bonusDamage: '+5 PV direto',
    firstAidDV: 13,
    surgeryDV: 15,
    severity: 'Mutiladora',
  },
  {
    roll: 4,
    name: 'Colapso Pulmonar (Collapsed Lung)',
    effect: 'Pulmão perfurado. -2 em MOVE (mínimo 1) e o personagem não pode realizar a ação de Corrida (Run). Respiração ofegante.',
    bonusDamage: '+5 PV direto',
    firstAidDV: 13,
    surgeryDV: 15,
    severity: 'Grave',
  },
  {
    roll: 5,
    name: 'Costelas Fraturadas (Broken Ribs)',
    effect: 'No final de qualquer turno em que o personagem se mover mais de 4 metros (2 hexes), sofre 2 PV de dano direto pela fratura.',
    bonusDamage: '+5 PV direto',
    firstAidDV: 13,
    surgeryDV: 13,
    severity: 'Grave',
  },
  {
    roll: 6,
    name: 'Braço Quebrado (Broken Arm)',
    effect: 'Braço fraturado e inutilizado. Não pode segurar armas de duas mãos nem realizar testes de duas mãos com esse membro.',
    bonusDamage: '+5 PV direto',
    firstAidDV: 13,
    surgeryDV: 13,
    severity: 'Grave',
  },
  {
    roll: 7,
    name: 'Corpo Estranho / Estilhaço (Foreign Object)',
    effect: 'Projétil ou estilhaço de metal cravado na carne. -2 em todas as ações físicas de combate até que alguém gaste 1 Ação para puxar.',
    bonusDamage: '+5 PV direto',
    firstAidDV: 13,
    surgeryDV: 13,
    severity: 'Grave',
  },
  {
    roll: 8,
    name: 'Perna Quebrada (Broken Leg)',
    effect: 'Fratura óssea na perna. -4 em MOVE (mínimo 1). O personagem perde totalmente a capacidade de Esquivar de projéteis (mesmo com REF 8+).',
    bonusDamage: '+5 PV direto',
    firstAidDV: 13,
    surgeryDV: 13,
    severity: 'Crítica',
  },
  {
    roll: 9,
    name: 'Músculo / Ligamento Rompido (Torn Muscle)',
    effect: 'Ruptura severa de tendão. Penalidade de -2 em todos os testes e ataques baseados em DESTREZA (DEX) e FORÇA (STR).',
    bonusDamage: '+5 PV direto',
    firstAidDV: 13,
    surgeryDV: 13,
    severity: 'Grave',
  },
  {
    roll: 10,
    name: 'Lesão na Coluna (Spinal Injury)',
    effect: 'Impacto vertebral traumático. No próximo turno imediato, o personagem fica paralisado e não pode realizar Ações ou Movimento.',
    bonusDamage: '+5 PV direto',
    firstAidDV: 15,
    surgeryDV: 17,
    severity: 'Crítica',
  },
  {
    roll: 11,
    name: 'Pé Desmembrado (Dismembered Foot)',
    effect: 'Pé amputado. -6 em MOVE (mínimo 1). O personagem não pode correr nem tentar esquivar de tiros balísticos.',
    bonusDamage: '+5 PV direto',
    firstAidDV: 13,
    surgeryDV: 15,
    severity: 'Mutiladora',
  },
  {
    roll: 12,
    name: 'Perna Desmembrada (Dismembered Leg)',
    effect: 'Perna decepada. Cai no chão (Prone), -6 em MOVE (mínimo 1). Hemorragia arterial grave de 5 PV por turno até estancar o sangramento.',
    bonusDamage: '+5 PV direto',
    firstAidDV: 15,
    surgeryDV: 17,
    severity: 'Mutiladora',
  },
];

export const HEAD_CRITICAL_INJURIES: CriticalInjury[] = [
  {
    roll: 2,
    name: 'Olho Perdido (Lost Eye)',
    effect: 'Globo ocular destruído. -2 permanente em todos os ataques à distância e testes de Percepção visual até instalação de Ciberolho.',
    bonusDamage: '+5 PV direto',
    firstAidDV: 15,
    surgeryDV: 17,
    severity: 'Mutiladora',
  },
  {
    roll: 3,
    name: 'Dano Cerebral (Brain Damage)',
    effect: 'Contusão encefálica severa. -2 permanente em todas as ações e perícias que utilizem INTEL (INT), FORÇA DE VONTADE (WILL) ou TÉCNICA (TECH).',
    bonusDamage: '+5 PV direto',
    firstAidDV: 15,
    surgeryDV: 17,
    severity: 'Crítica',
  },
  {
    roll: 4,
    name: 'Crânio Fraturado (Cracked Skull)',
    effect: 'Fissura craniana grave. TODO dano subsequente sofrido na Cabeça tem seu multiplicador aumentado para x3 em vez de x2!',
    bonusDamage: '+5 PV direto',
    firstAidDV: 15,
    surgeryDV: 15,
    severity: 'Crítica',
  },
  {
    roll: 5,
    name: 'Dentes Quebrados / Trauma Facial (Lost Teeth)',
    effect: 'Dentes arrancados e fratura maxilar leve. Fala comprometida (-2 em testes sociais falados) e sangue na boca.',
    bonusDamage: '+5 PV direto',
    firstAidDV: 13,
    surgeryDV: 13,
    severity: 'Grave',
  },
  {
    roll: 6,
    name: 'Tímpano Estourado (Damaged Ear)',
    effect: 'Ruptura timpânica. Zumbido ensurdecedor: -2 em testes de Percepção auditiva e -2 em testes de equilíbrio e acrobacias.',
    bonusDamage: '+5 PV direto',
    firstAidDV: 13,
    surgeryDV: 13,
    severity: 'Grave',
  },
  {
    roll: 7,
    name: 'Olho Danificado (Damaged Eye)',
    effect: 'Córnea lacerada ou sangramento ocular interno. -1 em todos os ataques à distância e testes de visão.',
    bonusDamage: '+5 PV direto',
    firstAidDV: 13,
    surgeryDV: 13,
    severity: 'Grave',
  },
  {
    roll: 8,
    name: 'Concussão (Concussion)',
    effect: 'Labirinto abalado e confusão mental aguda. -2 em TODAS as ações e rolagens até receber estabilização médica.',
    bonusDamage: '+5 PV direto',
    firstAidDV: 13,
    surgeryDV: 13,
    severity: 'Grave',
  },
  {
    roll: 9,
    name: 'Nariz Quebrado (Broken Nose)',
    effect: 'Hemorragia nasal e dor aguda. -2 em testes de percepção olfativa e atordoamento visual momentâneo.',
    bonusDamage: '+5 PV direto',
    firstAidDV: 13,
    surgeryDV: 13,
    severity: 'Grave',
  },
  {
    roll: 10,
    name: 'Efeito Chicote / Traqueia Esmagada (Whiplash)',
    effect: 'Tensão cervical violenta. Sofre -2 em todas as ações físicas no próximo turno devido ao espasmo muscular do pescoço.',
    bonusDamage: '+5 PV direto',
    firstAidDV: 13,
    surgeryDV: 13,
    severity: 'Grave',
  },
  {
    roll: 11,
    name: 'Orelha Decepada (Lost Ear)',
    effect: 'Pavilhão auditivo arrancado. -4 em testes de percepção auditiva no lado afetado até reconstrução estética.',
    bonusDamage: '+5 PV direto',
    firstAidDV: 13,
    surgeryDV: 15,
    severity: 'Mutiladora',
  },
  {
    roll: 12,
    name: 'Crânio Esmagado (Crushed Skull)',
    effect: 'Trauma cranioencefálico maciço! Se o personagem sobreviver ao dano, cai inconsciente imediatamente por 1d6 horas. Cirurgia urgente.',
    bonusDamage: '+5 PV direto',
    firstAidDV: 15,
    surgeryDV: 17,
    severity: 'Mutiladora',
  },
];

export const GmReferenceTablesSection: React.FC = () => {
  // Navigation inside GM tables
  const [activeScreenTab, setActiveScreenTab] = useState<
    'range' | 'crits' | 'dvs' | 'cover' | 'wounds' | 'netrunning' | 'armor' | 'facedown' | 'vehicles'
  >('range');

  // Range Table interactive filters
  const [selectedRangeDist, setSelectedRangeDist] = useState<string>('all');
  const [selectedWeaponCat, setSelectedWeaponCat] = useState<string>('all');

  // Critical Injury roller state
  const [critLocation, setCritLocation] = useState<'body' | 'head'>('body');
  const [lastRolledCrit, setLastRolledCrit] = useState<CriticalInjury | null>(null);
  const [diceRollResult, setDiceRollResult] = useState<{ d1: number; d2: number; total: number } | null>(null);
  const [isRollingDice, setIsRollingDice] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Wound calculator state
  const [calcMaxHp, setCalcMaxHp] = useState<number>(40);
  const [calcCurrentHp, setCalcCurrentHp] = useState<number>(40);
  const [calcBody, setCalcBody] = useState<number>(6);
  const [deathSaveTurns, setDeathSaveTurns] = useState<number>(0);
  const [lastDeathRoll, setLastDeathRoll] = useState<{ roll: number; success: boolean } | null>(null);

  // Netrunning rank state
  const [netRank, setNetRank] = useState<number>(4);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Roll Critical Injury
  const handleRollCritical = () => {
    setIsRollingDice(true);
    setDiceRollResult(null);

    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const total = d1 + d2;
      setDiceRollResult({ d1, d2, total });

      const list = critLocation === 'body' ? BODY_CRITICAL_INJURIES : HEAD_CRITICAL_INJURIES;
      const found = list.find(c => c.roll === total) || list[0];
      setLastRolledCrit(found);
      setIsRollingDice(false);
    }, 350);
  };

  // Roll Death Save
  const handleRollDeathSave = () => {
    const roll = Math.floor(Math.random() * 10) + 1;
    const target = Math.max(1, calcBody - deathSaveTurns);
    const success = roll <= target && roll !== 10;
    setLastDeathRoll({ roll, success });
    if (success) {
      setDeathSaveTurns(prev => prev + 1);
    }
  };

  // Filter weapons by category
  const filteredWeapons = WEAPON_RANGE_DATA.filter(w => {
    if (selectedWeaponCat === 'all') return true;
    return w.category === selectedWeaponCat;
  });

  // Calculate wound state
  const seriouslyThreshold = Math.floor(calcMaxHp / 2);
  let woundStateName = 'Ileso';
  let woundStateColor = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40';
  let woundPenalty = 'Nenhuma penalidade mecânica.';

  if (calcCurrentHp <= 0) {
    woundStateName = 'Mortalmente Ferido';
    woundStateColor = 'text-red-500 bg-red-950/60 border-red-700 animate-pulse';
    woundPenalty = 'Incapacitado. Não age. Rola Salvaguarda da Morte (Death Save) todo turno!';
  } else if (calcCurrentHp <= seriouslyThreshold) {
    woundStateName = 'Seriamente Ferido';
    woundStateColor = 'text-amber-400 bg-amber-950/50 border-amber-800/50';
    woundPenalty = '-2 em TODAS as ações (Ataques, Esquivas, Perícias, Iniciativa).';
  }

  // Helper to color DV cells
  const getDvBadge = (dv: number | string, isHighlighted: boolean) => {
    if (dv === 'N/A') {
      return (
        <span className={`text-[11px] font-mono text-zinc-600 ${isHighlighted ? 'font-bold underline' : ''}`}>
          —
        </span>
      );
    }
    if (dv === 'Área') {
      return (
        <span className="px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/50 text-[10px] font-mono font-bold">
          3×3m
        </span>
      );
    }
    const num = Number(dv);
    let color = 'bg-zinc-900 text-zinc-300 border-zinc-800';

    if (num <= 13) {
      color = 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50 font-bold';
    } else if (num <= 17) {
      color = 'bg-cyan-950/50 text-cyan-300 border-cyan-800/40';
    } else if (num <= 22) {
      color = 'bg-amber-950/40 text-amber-300 border-amber-800/40';
    } else {
      color = 'bg-red-950/50 text-red-400 border-red-800/40';
    }

    return (
      <span
        className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono border transition ${color} ${
          isHighlighted ? 'ring-2 ring-cyan-400 scale-105 shadow-md shadow-cyan-950/50' : ''
        }`}
      >
        DV {num}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER DO ESCUDO DO MESTRE */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-red-950/20 via-[#121217] to-zinc-900 border border-red-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-red-600 text-white">
              HUD Oficial GM Screen
            </span>
            <span className="text-[11px] font-mono text-zinc-400">Cyberpunk RED Corebook & DLCs</span>
          </div>
          <h2 className="text-xl font-black text-zinc-100 flex items-center gap-2 tracking-tight">
            <Shield className="w-5 h-5 text-red-500" />
            Escudo do Mestre: Tabelas Rápidas de Referência
          </h2>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Painel tático de consulta instantânea durante o combate e cenas de ação. Selecione uma tabela para visualizar regras estruturadas, matrizes de DV, roladores automáticos e calculadoras de sobrevivência.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto font-mono text-xs text-zinc-400 bg-[#0a0a0d] px-3 py-2 rounded-xl border border-zinc-800">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Fórmulas Oficiais em 1 Clique</span>
        </div>
      </div>

      {/* SUB-MENU TABS DAS TABELAS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800">
        {[
          { id: 'range', label: 'Matriz de DVs das Armas', icon: Crosshair, color: 'text-cyan-400' },
          { id: 'crits', label: 'Ferimentos Críticos (2d6)', icon: Skull, color: 'text-red-400' },
          { id: 'dvs', label: 'DVs Universais & Tiros Mirados', icon: Target, color: 'text-purple-400' },
          { id: 'armor', label: 'Blindagens & Ablação', icon: Shield, color: 'text-amber-400' },
          { id: 'cover', label: 'Coberturas & Ambientes', icon: Layers, color: 'text-emerald-400' },
          { id: 'wounds', label: 'Ferimentos & Teste de Morte', icon: HeartPulse, color: 'text-rose-400' },
          { id: 'netrunning', label: 'Netrunning & Interface', icon: Cpu, color: 'text-blue-400' },
          { id: 'facedown', label: 'Encarada & Reputação', icon: Award, color: 'text-yellow-400' },
          { id: 'vehicles', label: 'Veículos & Perseguição', icon: Car, color: 'text-orange-400' },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeScreenTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveScreenTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                isActive
                  ? 'bg-zinc-800 text-zinc-100 border-zinc-600 shadow-md'
                  : 'bg-[#121217] text-zinc-400 hover:text-zinc-200 border-[#27272a] hover:bg-zinc-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================== */}
      {/* TABELA 1: MATRIZ DE DVS DE ALCANCE DAS ARMAS               */}
      {/* ========================================================== */}
      {activeScreenTab === 'range' && (
        <div className="space-y-4">
          {/* Controls & Filter Banner */}
          <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-cyan-400" />
                  DVs de Ataque por Distância (Cyberpunk RED Corebook p. 173)
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Clique numa distância para destacar a coluna e comparar qual arma tem o melhor DV!
                </p>
              </div>

              {/* Weapon category filter */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-500">Filtrar:</span>
                <select
                  value={selectedWeaponCat}
                  onChange={e => setSelectedWeaponCat(e.target.value)}
                  className="bg-[#0a0a0d] border border-zinc-800 text-zinc-200 text-xs rounded-xl px-2.5 py-1.5 font-mono focus:outline-none"
                >
                  <option value="all">Todas as Armas</option>
                  <option value="Pistola">Pistolas</option>
                  <option value="SMG">Submetralhadoras (SMG)</option>
                  <option value="Espingarda">Espingardas</option>
                  <option value="Fuzil">Fuzis de Assalto e Precisão</option>
                  <option value="Silenciosa">Silenciosas (Arco/Besta)</option>
                  <option value="Pesada">Armas Pesadas</option>
                </select>
              </div>
            </div>

            {/* Quick Distance Selector Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-800/80">
              <span className="text-[11px] font-mono text-zinc-500 mr-1">Destacar Alcance:</span>
              {[
                { id: 'all', label: 'Todas as Colunas' },
                { id: '0-6m', label: '0 - 6 metros' },
                { id: '7-12m', label: '7 - 12 metros' },
                { id: '13-25m', label: '13 - 25 metros' },
                { id: '26-50m', label: '26 - 50 metros' },
                { id: '51-100m', label: '51 - 100 metros' },
                { id: '101-200m', label: '101 - 200m' },
                { id: '201-400m', label: '201 - 400m' },
                { id: '401-800m', label: '401 - 800m' },
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setSelectedRangeDist(d.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition border ${
                    selectedRangeDist === d.id
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold shadow-sm'
                      : 'bg-[#0a0a0d] text-zinc-400 hover:text-zinc-200 border-zinc-800'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Range Legend */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-[10px] font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <strong>DV 13 (Sweet Spot Ideal)</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block"></span>
                <strong>DV 15-17 (Alcance Efetivo)</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                <strong>DV 20-22 (Desafiador)</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                <strong>DV 25+ (Extremo / Improvável)</strong>
              </span>
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-2xl bg-[#121217] border border-[#27272a] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0a0a0d] text-zinc-400 font-mono text-[11px] border-b border-zinc-800">
                    <th className="py-3 px-3 sticky left-0 bg-[#0a0a0d] z-10 min-w-[150px]">Arma & Dano</th>
                    <th className="py-3 px-2 text-center">ROF</th>
                    <th
                      className={`py-3 px-2 text-center transition ${
                        selectedRangeDist === '0-6m' ? 'bg-cyan-950/40 text-cyan-300 font-bold border-x border-cyan-700/50' : ''
                      }`}
                    >
                      0 - 6m
                    </th>
                    <th
                      className={`py-3 px-2 text-center transition ${
                        selectedRangeDist === '7-12m' ? 'bg-cyan-950/40 text-cyan-300 font-bold border-x border-cyan-700/50' : ''
                      }`}
                    >
                      7 - 12m
                    </th>
                    <th
                      className={`py-3 px-2 text-center transition ${
                        selectedRangeDist === '13-25m' ? 'bg-cyan-950/40 text-cyan-300 font-bold border-x border-cyan-700/50' : ''
                      }`}
                    >
                      13 - 25m
                    </th>
                    <th
                      className={`py-3 px-2 text-center transition ${
                        selectedRangeDist === '26-50m' ? 'bg-cyan-950/40 text-cyan-300 font-bold border-x border-cyan-700/50' : ''
                      }`}
                    >
                      26 - 50m
                    </th>
                    <th
                      className={`py-3 px-2 text-center transition ${
                        selectedRangeDist === '51-100m' ? 'bg-cyan-950/40 text-cyan-300 font-bold border-x border-cyan-700/50' : ''
                      }`}
                    >
                      51 - 100m
                    </th>
                    <th
                      className={`py-3 px-2 text-center transition ${
                        selectedRangeDist === '101-200m' ? 'bg-cyan-950/40 text-cyan-300 font-bold border-x border-cyan-700/50' : ''
                      }`}
                    >
                      101 - 200m
                    </th>
                    <th
                      className={`py-3 px-2 text-center transition ${
                        selectedRangeDist === '201-400m' ? 'bg-cyan-950/40 text-cyan-300 font-bold border-x border-cyan-700/50' : ''
                      }`}
                    >
                      201 - 400m
                    </th>
                    <th
                      className={`py-3 px-2 text-center transition ${
                        selectedRangeDist === '401-800m' ? 'bg-cyan-950/40 text-cyan-300 font-bold border-x border-cyan-700/50' : ''
                      }`}
                    >
                      401 - 800m
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-sans">
                  {filteredWeapons.map((row, idx) => (
                    <tr key={idx} className="hover:bg-zinc-800/30 transition">
                      <td className="py-2.5 px-3 sticky left-0 bg-[#121217] z-10 font-medium text-zinc-200 border-r border-zinc-800/60">
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-100">{row.weapon}</span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            Dano: <strong className="text-red-400">{row.damage}</strong> • Cat: {row.category}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-zinc-300 text-xs">
                        {row.rof}
                      </td>
                      <td
                        className={`py-2.5 px-2 text-center ${
                          selectedRangeDist === '0-6m' ? 'bg-cyan-950/20 border-x border-cyan-800/40' : ''
                        }`}
                      >
                        {getDvBadge(row.r0_6, selectedRangeDist === '0-6m')}
                      </td>
                      <td
                        className={`py-2.5 px-2 text-center ${
                          selectedRangeDist === '7-12m' ? 'bg-cyan-950/20 border-x border-cyan-800/40' : ''
                        }`}
                      >
                        {getDvBadge(row.r7_12, selectedRangeDist === '7-12m')}
                      </td>
                      <td
                        className={`py-2.5 px-2 text-center ${
                          selectedRangeDist === '13-25m' ? 'bg-cyan-950/20 border-x border-cyan-800/40' : ''
                        }`}
                      >
                        {getDvBadge(row.r13_25, selectedRangeDist === '13-25m')}
                      </td>
                      <td
                        className={`py-2.5 px-2 text-center ${
                          selectedRangeDist === '26-50m' ? 'bg-cyan-950/20 border-x border-cyan-800/40' : ''
                        }`}
                      >
                        {getDvBadge(row.r26_50, selectedRangeDist === '26-50m')}
                      </td>
                      <td
                        className={`py-2.5 px-2 text-center ${
                          selectedRangeDist === '51-100m' ? 'bg-cyan-950/20 border-x border-cyan-800/40' : ''
                        }`}
                      >
                        {getDvBadge(row.r51_100, selectedRangeDist === '51-100m')}
                      </td>
                      <td
                        className={`py-2.5 px-2 text-center ${
                          selectedRangeDist === '101-200m' ? 'bg-cyan-950/20 border-x border-cyan-800/40' : ''
                        }`}
                      >
                        {getDvBadge(row.r101_200, selectedRangeDist === '101-200m')}
                      </td>
                      <td
                        className={`py-2.5 px-2 text-center ${
                          selectedRangeDist === '201-400m' ? 'bg-cyan-950/20 border-x border-cyan-800/40' : ''
                        }`}
                      >
                        {getDvBadge(row.r201_400, selectedRangeDist === '201-400m')}
                      </td>
                      <td
                        className={`py-2.5 px-2 text-center ${
                          selectedRangeDist === '401-800m' ? 'bg-cyan-950/20 border-x border-cyan-800/40' : ''
                        }`}
                      >
                        {getDvBadge(row.r401_800, selectedRangeDist === '401-800m')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TABELA 2: FERIMENTOS CRÍTICOS & ROLADOR 2d6               */}
      {/* ========================================================== */}
      {activeScreenTab === 'crits' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Skull className="w-4 h-4 text-red-500" />
                Ferimentos Críticos (Ativado com dois ou mais dados '6' no dano)
              </h3>
              <p className="text-xs text-zinc-400">
                Aplica imediatamente <strong className="text-red-400 font-mono">+5 PV de dano direto</strong> (não reduzido por armadura) e sorteia 2d6 na tabela correspondente.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Location Switcher */}
              <div className="flex bg-[#0a0a0d] p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => setCritLocation('body')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    critLocation === 'body'
                      ? 'bg-red-600 text-white font-bold shadow'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Tronco & Membros (Corpo)
                </button>
                <button
                  onClick={() => setCritLocation('head')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    critLocation === 'head'
                      ? 'bg-red-600 text-white font-bold shadow'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Cabeça (Headshot)
                </button>
              </div>

              {/* Roll 2d6 Button */}
              <button
                onClick={handleRollCritical}
                disabled={isRollingDice}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-mono text-xs font-bold transition shadow-lg shadow-red-950/40 disabled:opacity-50"
              >
                <Dices className={`w-4 h-4 ${isRollingDice ? 'animate-spin' : ''}`} />
                <span>Rolar 2d6</span>
              </button>
            </div>
          </div>

          {/* Rolled Highlight Result */}
          {lastRolledCrit && diceRollResult && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#181216] to-[#121217] border-2 border-red-600 shadow-xl space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-red-600 text-white font-mono font-black text-sm">
                    {diceRollResult.d1} + {diceRollResult.d2} = {diceRollResult.total}
                  </span>
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                    {critLocation === 'body' ? 'Corpo' : 'Cabeça'}
                  </span>
                  <h4 className="text-base font-black text-zinc-100">{lastRolledCrit.name}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-red-400 bg-red-950/80 px-2.5 py-1 rounded-lg border border-red-700/60">
                    {lastRolledCrit.bonusDamage}
                  </span>
                  <button
                    onClick={() => {
                      const txt = `[FERIMENTO CRÍTICO: ${lastRolledCrit.name}]\nLocal: ${critLocation === 'body' ? 'Corpo' : 'Cabeça'} | Rolagem: 2d6 = ${diceRollResult.total}\nDano Extra: ${lastRolledCrit.bonusDamage}\nEfeito: ${lastRolledCrit.effect}\n1º Socorros: DV ${lastRolledCrit.firstAidDV} | Cirurgia: DV ${lastRolledCrit.surgeryDV}`;
                      handleCopy(txt, 'crit-rolled');
                    }}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition"
                    title="Copiar Ficha do Ferimento"
                  >
                    {copiedText === 'crit-rolled' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <p className="text-xs text-zinc-200 leading-relaxed font-sans">{lastRolledCrit.effect}</p>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-zinc-400">
                <span>
                  Primeiros Socorros / Paramédico: <strong className="text-amber-300">DV {lastRolledCrit.firstAidDV}</strong>
                </span>
                <span>•</span>
                <span>
                  Cirurgia / Tratamento Definitivo: <strong className="text-cyan-300">DV {lastRolledCrit.surgeryDV}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Table List of Crits */}
          <div className="rounded-2xl bg-[#121217] border border-[#27272a] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0a0a0d] text-zinc-400 font-mono text-[11px] border-b border-zinc-800">
                    <th className="py-3 px-3 text-center w-14">2d6</th>
                    <th className="py-3 px-3 min-w-[200px]">Nome do Ferimento</th>
                    <th className="py-3 px-3 min-w-[320px]">Efeito Mecânico & Penalidade</th>
                    <th className="py-3 px-2 text-center">Bônus</th>
                    <th className="py-3 px-2 text-center">1º Socorros</th>
                    <th className="py-3 px-2 text-center">Cirurgia</th>
                    <th className="py-3 px-2 text-center">Copiar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {(critLocation === 'body' ? BODY_CRITICAL_INJURIES : HEAD_CRITICAL_INJURIES).map(item => {
                    const isSelected = lastRolledCrit?.name === item.name;
                    return (
                      <tr
                        key={item.roll}
                        className={`transition ${
                          isSelected
                            ? 'bg-red-950/30 border-l-4 border-l-red-500 font-medium'
                            : 'hover:bg-zinc-800/20'
                        }`}
                      >
                        <td className="py-3 px-3 text-center font-mono font-bold text-red-400 text-sm">
                          {item.roll}
                        </td>
                        <td className="py-3 px-3 font-bold text-zinc-200">
                          <div className="flex items-center gap-2">
                            <span>{item.name}</span>
                            {item.severity === 'Mutiladora' && (
                              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-red-950 text-red-400 border border-red-800/40">
                                Mutilação
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-zinc-300 leading-relaxed text-xs">
                          {item.effect}
                        </td>
                        <td className="py-3 px-2 text-center font-mono font-bold text-red-400 text-[11px]">
                          +5 PV
                        </td>
                        <td className="py-3 px-2 text-center font-mono text-amber-300 text-[11px]">
                          DV {item.firstAidDV}
                        </td>
                        <td className="py-3 px-2 text-center font-mono text-cyan-300 text-[11px]">
                          DV {item.surgeryDV}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <button
                            onClick={() => {
                              const txt = `[CRÍTICO: ${item.name}]\nEfeito: ${item.effect}\n1º Socorros: DV ${item.firstAidDV} | Cirurgia: DV ${item.surgeryDV}`;
                              handleCopy(txt, `crit-${item.roll}`);
                            }}
                            className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition"
                            title="Copiar"
                          >
                            {copiedText === `crit-${item.roll}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TABELA 3: DVS UNIVERSAIS & TIROS MIRADOS                   */}
      {/* ========================================================== */}
      {activeScreenTab === 'dvs' && (
        <div className="space-y-6">
          {/* Universal DV Ladder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                Escala Universal de Dificuldades (DVs) de Cyberpunk RED
              </h3>
              <span className="text-[11px] font-mono text-zinc-400">Fórmula: STAT + Perícia + 1d10 vs DV</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
              {[
                {
                  dv: 9,
                  name: 'Simples',
                  desc: 'Qualquer pessoa com treinamento básico realiza sem esforço sob condições calmas.',
                  examples: 'Dirigir em pista vazia, primeiros socorros em arranhão, troca de bateria.',
                  color: 'border-emerald-600/50 bg-emerald-950/20 text-emerald-300',
                },
                {
                  dv: 13,
                  name: 'Cotidiano',
                  desc: 'Uma tarefa normal do dia a dia de um profissional habilitado.',
                  examples: 'Trânsito moderado, tiro à queima-roupa com pistola, reparo de rádio.',
                  color: 'border-cyan-600/50 bg-cyan-950/20 text-cyan-300',
                },
                {
                  dv: 15,
                  name: 'Desafiador / Difícil',
                  desc: 'Exige competência real e concentração sob pressão moderada.',
                  examples: 'Tiro em alvo a 25m, curar fratura no campo, hackear terminal de condomínio.',
                  color: 'border-blue-600/50 bg-blue-950/20 text-blue-300',
                },
                {
                  dv: 17,
                  name: 'Profissional',
                  desc: 'Apenas especialistas treinados conseguem com frequência e consistência.',
                  examples: 'Disparo de fuzil a 50m, invadir banco de dados da Trauma Team, acrobacia.',
                  color: 'border-purple-600/50 bg-purple-950/20 text-purple-300',
                },
                {
                  dv: 21,
                  name: 'Heroico',
                  desc: 'Feito extraordinário que chama atenção de espectadores e imprensa.',
                  examples: 'Desarmar bomba militar com segundos restantes, esquivar de explosão à queima-roupa.',
                  color: 'border-amber-600/50 bg-amber-950/20 text-amber-300',
                },
                {
                  dv: 24,
                  name: 'Incrível',
                  desc: 'Quase além dos limites humanos normais; nível de lendas de Night City.',
                  examples: 'Hackear o mainframe das Torres Arasaka sem ICEbreakers de ponta, salto entre prédios.',
                  color: 'border-rose-600/50 bg-rose-950/20 text-rose-300',
                },
                {
                  dv: 29,
                  name: 'Lendário',
                  desc: 'Praticamente impossível. Entra para as lendas contadas no Afterlife.',
                  examples: 'Sobreviver a queda livre guiando destroços, feito que muda o rumo da história.',
                  color: 'border-red-600/50 bg-red-950/30 text-red-400',
                },
              ].map(item => (
                <div key={item.dv} className={`p-4 rounded-2xl border ${item.color} space-y-2`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black">DV {item.dv}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-900/80 border border-zinc-800">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-sans leading-relaxed">{item.desc}</p>
                  <p className="text-[10px] text-zinc-400 font-sans italic border-t border-zinc-800/60 pt-1.5">
                    <strong>Exemplos:</strong> {item.examples}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Aimed Shots and Combat Modifiers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Aimed Shots Box */}
            <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
              <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-red-400" />
                Tiros Mirados (Aimed Shots - Penalidade Fixa de -8)
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                O atirador gasta 1 Ação e declara o local do tiro antes de rolar os dados. Sofre -8 no ataque contra o DV ou contra Evasão.
              </p>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 flex items-center justify-between">
                  <span className="text-red-400 font-bold">Cabeça (Headshot)</span>
                  <span className="text-zinc-300">Dano pós-SP é dobrado (×2)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 flex items-center justify-between">
                  <span className="text-amber-400 font-bold">Braço / Membro</span>
                  <span className="text-zinc-300">Aplica Crítico 'Braço Quebrado' direto</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 flex items-center justify-between">
                  <span className="text-amber-400 font-bold">Perna / Membro</span>
                  <span className="text-zinc-300">Aplica Crítico 'Perna Quebrada' (-4 MOVE)</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 flex items-center justify-between">
                  <span className="text-cyan-400 font-bold">Objeto na Mão</span>
                  <span className="text-zinc-300">Destrói ou força desarmamento</span>
                </div>
              </div>
            </div>

            {/* Combat Modifiers Checklist */}
            <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
              <h4 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-amber-400" />
                Modificadores Situacionais Mais Usados
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Penalidades e bônus aplicados ao teste de ataque ou rolagem de perícia.
              </p>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-300">Alvo Surpreendido / Emboscada</span>
                  <span className="text-emerald-400 font-bold">+4 no Ataque</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-300">Alvo Caído no Chão (Prone)</span>
                  <span className="text-amber-300">+2 Corpo a Corpo / -2 Distância</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-300">Escuridão Total ou Fumaça Densa</span>
                  <span className="text-red-400 font-bold">-4 em Ataques e Percepção</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 flex items-center justify-between">
                  <span className="text-zinc-300">Sacar Arma e Atirar no Mesmo Turno</span>
                  <span className="text-amber-400">-3 (Saque Rápido)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TABELA 4: BLINDAGENS & ABLAÇÃO                            */}
      {/* ========================================================== */}
      {activeScreenTab === 'armor' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-2">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              Blindagens Balísticas Oficiais & Regra de Ablação
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              <strong>Regra de Ablação:</strong> Se o dano da arma superar o valor de Pontos de Parada (SP) da armadura, mesmo que por 1 ponto, o alvo sofre o dano excedente nos seus PVs e a armadura sofre <strong>-1 SP permanente</strong> até reparo (Techfix). Munições Armor-Piercing (AP) causam <strong>-2 SP</strong> de ablação!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono">
            {[
              {
                name: 'Couro (Leather)',
                sp: 4,
                penalty: 'Nenhuma',
                cost: '20eb',
                repair: 'DV 9',
                desc: 'Estilo clássico de motoqueiro. Protege contra navalhas e socos leves.',
              },
              {
                name: 'Kevlar®',
                sp: 7,
                penalty: 'Nenhuma',
                cost: '50eb',
                repair: 'DV 13',
                desc: 'Colete leve disfarçável sob camisas sociais ou jaquetas finas.',
              },
              {
                name: 'Jaqueta Leve (Light Armorjack)',
                sp: 11,
                penalty: 'Nenhuma',
                cost: '100eb',
                repair: 'DV 13',
                desc: 'A armadura mais popular de Night City! Excelente proteção sem nenhuma perda de agilidade.',
              },
              {
                name: 'Jaqueta Média (Medium Armorjack)',
                sp: 12,
                penalty: '-2 REF, DEX, MOVE',
                cost: '100eb',
                repair: 'DV 15',
                desc: 'Placas reforçadas. Diminui reflexos e velocidade de corrida.',
              },
              {
                name: 'Jaqueta Pesada (Heavy Armorjack)',
                sp: 13,
                penalty: '-2 REF, DEX, MOVE',
                cost: '500eb',
                repair: 'DV 15',
                desc: 'Padrão da NCPD e seguranças de corporação de médio escalão.',
              },
              {
                name: 'Flak Jacket',
                sp: 15,
                penalty: '-4 REF, DEX, MOVE',
                cost: '500eb',
                repair: 'DV 17',
                desc: 'Colete militar pesado de estilhaços. Mobilidade severamente comprometida.',
              },
              {
                name: 'MetalGear™ Exosuit',
                sp: 18,
                penalty: '-4 REF, DEX, MOVE',
                cost: '1.000eb',
                repair: 'DV 21',
                desc: 'Traje blindado militar ambulante. Transforma o usuário em um tanque.',
              },
              {
                name: 'Escudo Balístico Padrão',
                sp: 'HP 10',
                penalty: 'Ocupa 1 mão',
                cost: '100eb',
                repair: 'Descartável',
                desc: 'Absorve disparos frontais até estourar seus 10 Pontos de Vida.',
              },
              {
                name: 'Escudo Tático de Choque',
                sp: 'HP 25',
                penalty: 'Ocupa 1 mão',
                cost: '500eb',
                repair: 'Descartável',
                desc: 'Escudo pesado de policarbonato reforçado usado pela MaxTac e choque.',
              },
            ].map(armor => (
              <div key={armor.name} className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-zinc-100 text-xs">{armor.name}</h4>
                  <span className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40 text-xs font-bold">
                    {typeof armor.sp === 'number' ? `SP ${armor.sp}` : armor.sp}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{armor.desc}</p>
                <div className="border-t border-zinc-800/80 pt-2 flex flex-col gap-1 text-[10px] text-zinc-500">
                  <div className="flex justify-between">
                    <span>Penalidade:</span>
                    <strong className={armor.penalty.includes('-') ? 'text-red-400' : 'text-emerald-400'}>
                      {armor.penalty}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Preço / Reparo:</span>
                    <span className="text-zinc-300">
                      {armor.cost} • Tech {armor.repair}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TABELA 5: COBERTURAS & AMBIENTES                           */}
      {/* ========================================================== */}
      {activeScreenTab === 'cover' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-2">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Pontos de Estrutura de Cobertura (Cover HP) & Ambientes
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              <strong>Como a cobertura funciona:</strong> O obstáculo absorve todo o dano do disparo até que seu HP chegue a 0. O excesso de dano <strong>NÃO passa para o personagem</strong> naquele mesmo disparo! Porém, com a cobertura destruída, o personagem ficará totalmente exposto para o próximo tiro.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
            {[
              {
                name: 'Parede de Drywall / Gesso',
                hp: '5 HP',
                desc: 'Paredes internas de escritórios e blocos residenciais baratos.',
                durability: 'Destruída por 1 tiro de qualquer pistola.',
                bar: 'w-[10%] bg-red-500',
              },
              {
                name: 'Porta de Madeira Residencial',
                hp: '15 HP',
                desc: 'Portas de quartos, mesas de mogno executivas, caixotes de feira.',
                durability: 'Aguenta 1 tiro de pistola pesada; fuzil atravessa no primeiro disparo.',
                bar: 'w-[30%] bg-amber-500',
              },
              {
                name: 'Lataria de Carro Comum (Sedan)',
                hp: '20 HP',
                desc: 'Portas e capô de veículos civis de passeio.',
                durability: 'Oferece proteção razoável contra pistolas e SMGs.',
                bar: 'w-[40%] bg-blue-500',
              },
              {
                name: 'Muro de Tijolo / Bloco de Concreto',
                hp: '25 HP',
                desc: 'Muretas de viadutos, pilares residenciais, paredes externas.',
                durability: 'Excelente cobertura; suporta múltiplos tiros antes de ruir.',
                bar: 'w-[50%] bg-emerald-500',
              },
              {
                name: 'Poste de Ferro Fundido / Hidrante',
                hp: '30 HP',
                desc: 'Mobiliário urbano resistente das avenidas centrais.',
                durability: 'Proteção sólida; fuzis precisam de 2 tiros concentrados.',
                bar: 'w-[60%] bg-cyan-500',
              },
              {
                name: 'Concreto Armado Militar (Bunker)',
                hp: '35 HP',
                desc: 'Guaritas blindadas da Arasaka, Militech e Trauma Team.',
                durability: 'Resiste a disparos de fuzis de precisão e escopetas.',
                bar: 'w-[70%] bg-purple-500',
              },
              {
                name: 'Porta Blindada de Cofre / Sala NET',
                hp: '50 HP',
                desc: 'Aço temperado militar de cofres corporativos e data-centers.',
                durability: 'Exige explosivos de demolição (C4) para ser aberta.',
                bar: 'w-[100%] bg-yellow-400',
              },
            ].map(cover => (
              <div key={cover.name} className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-100">{cover.name}</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-emerald-400 font-bold">
                    {cover.hp}
                  </span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${cover.bar}`}></div>
                </div>
                <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">{cover.desc}</p>
                <p className="text-[10px] text-zinc-400 font-sans italic border-t border-zinc-800/60 pt-1.5">
                  {cover.durability}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TABELA 6: FERIMENTOS & SALVAGUARDA DA MORTE (CALCULADORA) */}
      {/* ========================================================== */}
      {activeScreenTab === 'wounds' && (
        <div className="space-y-6">
          {/* Interactive Calculator Panel */}
          <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                Calculadora de Estado de Saúde & Salvaguarda da Morte
              </h3>
              <span className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border ${woundStateColor}`}>
                {woundStateName}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase block">Pontos de Vida Máximos</label>
                <input
                  type="number"
                  value={calcMaxHp}
                  onChange={e => setCalcMaxHp(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-zinc-100 font-bold"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase block">Pontos de Vida Atuais</label>
                <input
                  type="number"
                  value={calcCurrentHp}
                  onChange={e => setCalcCurrentHp(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-zinc-100 font-bold"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase block">Atributo BODY (Tipo Corporal)</label>
                <input
                  type="number"
                  value={calcBody}
                  onChange={e => setCalcBody(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-zinc-100 font-bold"
                />
              </div>
            </div>

            {/* Health Bar Visual */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                <span>
                  PV: {calcCurrentHp} / {calcMaxHp} (Limiar de Ferimento Grave: {seriouslyThreshold} PV)
                </span>
                <span>{Math.round((calcCurrentHp / Math.max(1, calcMaxHp)) * 100)}%</span>
              </div>
              <div className="w-full bg-zinc-900 h-3 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className={`h-full transition-all duration-300 ${
                    calcCurrentHp <= 0
                      ? 'bg-red-600'
                      : calcCurrentHp <= seriouslyThreshold
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, (calcCurrentHp / Math.max(1, calcMaxHp)) * 100))}%` }}
                ></div>
              </div>
            </div>

            {/* Penalties Summary */}
            <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Consequência no Combate:</span>
                <p className="text-xs text-zinc-200 font-medium">{woundPenalty}</p>
              </div>

              {calcCurrentHp <= 0 && (
                <div className="flex items-center gap-2">
                  <div className="text-right font-mono text-[10px] text-zinc-400">
                    <span>Turnos Sobrevividos: {deathSaveTurns}</span>
                    <p className="text-red-400 font-bold">Meta: 1d10 ≤ {Math.max(1, calcBody - deathSaveTurns)}</p>
                  </div>
                  <button
                    onClick={handleRollDeathSave}
                    className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold transition shadow-lg shadow-red-950/40"
                  >
                    Rolar Death Save
                  </button>
                </div>
              )}
            </div>

            {lastDeathRoll && (
              <div
                className={`p-3 rounded-xl font-mono text-xs flex items-center justify-between border ${
                  lastDeathRoll.success
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800'
                    : 'bg-red-950/60 text-red-300 border-red-700 animate-bounce'
                }`}
              >
                <span>
                  Rolagem de Salvaguarda: <strong>1d10 = {lastDeathRoll.roll}</strong> (Meta era ≤{' '}
                  {Math.max(1, calcBody - (deathSaveTurns - (lastDeathRoll.success ? 1 : 0)))})
                </span>
                <strong className="text-sm">
                  {lastDeathRoll.success ? 'SOBREVIVEU MAIS UMA RODADA!' : 'FALHA: O PERSONAGEM MORREU!'}
                </strong>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TABELA 7: NETRUNNING & INTERFACE NO TURNO                  */}
      {/* ========================================================== */}
      {activeScreenTab === 'netrunning' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                Netrunning no Turno: Ações de Interface & Black ICE
              </h3>
              <p className="text-xs text-zinc-400">
                O Netrunner precisa estar a até 6 metros do Ponto de Acesso (Access Point). Conectar (Jack In) custa 0 ações.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-zinc-500">Seu Rank de Interface:</span>
              <div className="flex gap-1 bg-[#0a0a0d] p-1 rounded-xl border border-zinc-800">
                {[1, 3, 7, 10].map(rank => (
                  <button
                    key={rank}
                    onClick={() => setNetRank(rank)}
                    className={`px-2.5 py-1 rounded-lg transition ${
                      (rank === 1 && netRank <= 2) ||
                      (rank === 3 && netRank >= 3 && netRank <= 6) ||
                      (rank === 7 && netRank >= 7 && netRank <= 9) ||
                      (rank === 10 && netRank === 10)
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Rank {rank}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* NET Actions Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
            {[
              {
                action: 'Pathfinder (Mapear)',
                dv: 'DV Variável (Andar)',
                desc: 'Gasta 1 Ação NET para escanear a arquitetura e revelar nós ocultos e armadilhas nos andares adjacentes.',
                icon: Eye,
                color: 'text-cyan-400',
              },
              {
                action: 'Backdoor (Quebrar Senha)',
                dv: 'DV vs Senha do Nó',
                desc: 'Gasta 1 Ação NET para quebrar a tranca de dados e liberar acesso ao próximo nível da rede.',
                icon: Terminal,
                color: 'text-emerald-400',
              },
              {
                action: 'Control (Controlar Nó)',
                dv: 'DV vs Nó de Controle',
                desc: 'Gasta 1 Ação NET para operar torretas, trancar portas automáticas, acionar alarmes ou chamar elevadores.',
                icon: Zap,
                color: 'text-amber-400',
              },
              {
                action: 'Decrypt (Descriptografar)',
                dv: 'DV vs Criptografia',
                desc: 'Gasta 1 Ação NET para quebrar o código de arquivos confidenciais e baixar os dados para o cyberdeck.',
                icon: Layers,
                color: 'text-purple-400',
              },
              {
                action: 'Slide (Desconectar em Fuga)',
                dv: 'DV vs PER do Black ICE',
                desc: 'Gasta 1 Ação NET para romper a conexão com segurança e escapar de combate virtual contra programas hostis.',
                icon: RotateCcw,
                color: 'text-rose-400',
              },
              {
                action: 'Virus (Criar Vírus Permanente)',
                dv: 'DV Arbitrado pelo Mestre',
                desc: 'Gasta 2 Ações NET para deixar um vírus permanente na rede (ex: apagar gravações das câmeras ao sair).',
                icon: Skull,
                color: 'text-red-400',
              },
            ].map(cmd => {
              const Icon = cmd.icon;
              return (
                <div key={cmd.action} className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-100 flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${cmd.color}`} />
                      {cmd.action}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                      {cmd.dv}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{cmd.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TABELA 8: ENCARADA & REPUTAÇÃO                             */}
      {/* ========================================================== */}
      {activeScreenTab === 'facedown' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-2">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" />
              Duelo de Olhares (Facedown) & Níveis de Reputação
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Antes de sacar as armas, os combatentes podem tentar intimidar o adversário. Ambos rolam{' '}
              <strong className="text-yellow-400 font-mono">COOL + Reputação + 1d10</strong>. O perdedor pode recuar ou desviar o olhar; se optar por lutar mesmo assim, sofre <strong>-2 em TODAS as suas ações</strong> contra o vencedor durante todo o encontro!
            </p>
          </div>

          <div className="rounded-2xl bg-[#121217] border border-[#27272a] overflow-hidden">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-[#0a0a0d] text-zinc-400 font-mono text-[11px] border-b border-zinc-800">
                  <th className="py-3 px-3 w-28">Nível de Rep.</th>
                  <th className="py-3 px-3 min-w-[160px]">Status Social</th>
                  <th className="py-3 px-3">Quem conhece seu nome?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {[
                  {
                    lvl: '1 - 2',
                    status: 'Zé Ninguém / Rato de Beco',
                    desc: 'Apenas os moradores da sua rua, cortiço ou bloco residencial sabem quem você é.',
                  },
                  {
                    lvl: '3 - 4',
                    status: 'Conhecido no Bairro',
                    desc: 'Fixers locais e bartenders do distrito já ouviram seu apelido nas mesas de apostas.',
                  },
                  {
                    lvl: '5 - 6',
                    status: 'Notório em Night City',
                    desc: 'Gangues de rua respeitam seu grupo; corporações mantêm um dossiê preliminar sobre você.',
                  },
                  {
                    lvl: '7 - 8',
                    status: 'Lenda da Zona de Combate',
                    desc: 'Veteranos de guerra e Solos de elite sabem do que você é capaz de fazer sob fogo.',
                  },
                  {
                    lvl: '9 - 10',
                    status: 'Lenda Viva de Night City',
                    desc: 'Seu nome é citado em canções e murais ao lado de Morgan Blackhand e Johnny Silverhand.',
                  },
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-zinc-800/20">
                    <td className="py-3 px-3 font-mono font-bold text-yellow-400">Rep {r.lvl}</td>
                    <td className="py-3 px-3 font-bold text-zinc-200">{r.status}</td>
                    <td className="py-3 px-3 text-zinc-300 leading-relaxed">{r.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* TABELA 9: VEÍCULOS & PERSEGUIÇÃO                           */}
      {/* ========================================================== */}
      {activeScreenTab === 'vehicles' && (
        <div className="space-y-5">
          <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-2">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Car className="w-4 h-4 text-orange-400" />
              Perseguições Veiculares & DVs de Manobra
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              O piloto gasta sua Ação para manobrar o veículo. Rolagem: <strong className="text-orange-400 font-mono">REF + Perícia de Condução + 1d10</strong> vs DV do Terreno. Se falhar, sofre perda de controle ou colisão.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
            {[
              {
                terreno: 'Asfalto Limpo / Rodovia Aberta',
                dv: 'DV 13',
                falha: 'Perde 2 metros de MOVE e balança a carroceria.',
              },
              {
                terreno: 'Tráfego Intenso / Pista Molhada por Chuva Ácida',
                dv: 'DV 15',
                falha: 'Derrapagem lateral. Passageiros sofrem -2 em tiros.',
              },
              {
                terreno: 'Beco Estreito / Estrada de Terra Esburacada',
                dv: 'DV 17',
                falha: 'Colisão lateral de raspão. Veículo perde 10 SDP.',
              },
              {
                terreno: 'Cavalo de Pau / Evasão sob Fogo Cerrado',
                dv: 'DV 21',
                falha: 'Rodopio descontrolado; o carro para atravessado na pista.',
              },
              {
                terreno: 'Salto de Ponte / Pista Destruída por Míssil',
                dv: 'DV 25',
                falha: 'Capotamento grave! Ocupantes sofrem 4d6 de dano direto.',
              },
            ].map(m => (
              <div key={m.terreno} className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-100">{m.terreno}</span>
                  <span className="px-2 py-0.5 rounded bg-orange-950/60 text-orange-300 border border-orange-800/40 font-bold">
                    {m.dv}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 font-sans">
                  <strong>Consequência de Falha:</strong> {m.falha}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
