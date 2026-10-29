import React, { useState } from 'react';
import {
  Swords,
  Shield,
  Heart,
  Skull,
  Crosshair,
  Flame,
  Eye,
  AlertCircle,
  Dice5,
  Check,
  Play,
  SkipForward,
  SkipBack,
  Trash2,
  Plus,
  Sparkles,
  User,
  Users,
  RefreshCw,
  Footprints,
  Key,
  Hammer,
  Zap,
  Terminal,
  Network,
  Layers,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Target,
  Bot,
  RotateCcw,
} from 'lucide-react';
import { useCombat, Combatant, CombatantWeapon } from '../context/CombatContext';
import { useUserRole } from '../context/UserRoleContext';
import { useCampaign } from '../context/CampaignContext';
import { useSystem } from '../context/SystemContext';
import { PlayerCharacter } from '../data/playerArchetypes';
import { RED_BLACK_ICE_ROSTER } from '../data/netrunningData';
import { drawRandomTarotCard } from '../data/tarotData';

const CONDITIONS_LIST = [
  { id: 'Em Chamas', icon: '🔥', desc: 'Sofre 2 de dano direto no início de cada turno até gastar Ação para apagar' },
  { id: 'Atordoado', icon: '⚡', desc: '-2 em todas as Ações e Testes de Perícia' },
  { id: 'Cego', icon: '👁️', desc: '-4 em Ataques e Testes de Percepção / Visão' },
  { id: 'Caído', icon: '⬇️', desc: 'No chão. Custa 2m de movimento para se levantar' },
  { id: 'Envenenado', icon: '🧪', desc: 'Biotoxina no sangue: sofre dano de veneno por rodada' },
  { id: 'Gravemente Ferido (-2)', icon: '🩹', desc: 'HP <= 50%: -2 em todas as Ações e Testes' },
  { id: 'Ferido Mortalmente (Death Save!)', icon: '💀', desc: 'HP = 0: Rola Death Save no início do turno' },
];

const ENEMY_PRESETS = [
  {
    name: 'Boosterganger da Maelstrom',
    hp: 30,
    headSP: 7,
    bodySP: 7,
    ref: 6,
    dex: 6,
    weapons: [
      { name: 'Pistola Pesada 9mm', damage: '3d6', rof: 2, ammoType: 'Heavy' },
      { name: 'Faca de Combate / Garras', damage: '2d6', rof: 2, ammoType: 'Melee' },
    ],
  },
  {
    name: 'Operador de Choque da Arasaka',
    hp: 45,
    headSP: 13,
    bodySP: 13,
    ref: 8,
    dex: 8,
    weapons: [
      { name: 'Fuzil de Assalto Militech', damage: '5d6', rof: 1, ammoType: '5.56mm', notes: 'Autofire 4' },
      { name: 'Pistola Muito Pesada (.45)', damage: '4d6', rof: 1, ammoType: 'V.Heavy' },
    ],
  },
  {
    name: 'Ganger Tyger Claw com Cromo',
    hp: 35,
    headSP: 7,
    bodySP: 11,
    ref: 7,
    dex: 8,
    weapons: [
      { name: 'Katana de Monocarbono', damage: '3d6', rof: 2, ammoType: 'Melee', notes: 'Ignora metade do SP' },
      { name: 'Submetralhadora SMG', damage: '2d6', rof: 1, ammoType: 'Medium', notes: 'Autofire 3' },
    ],
  },
  {
    name: 'Cyberpsycho com Mantis Blades',
    hp: 60,
    headSP: 15,
    bodySP: 15,
    ref: 9,
    dex: 9,
    weapons: [
      { name: 'Mantis Blades Reforçadas', damage: '3d6', rof: 2, ammoType: 'Melee', notes: 'Ignora metade do SP' },
      { name: 'Escopeta Calibre 12', damage: '5d6', rof: 1, ammoType: 'Shell' },
    ],
  },
];

export const CombatPage: React.FC<{ onOpenTarot?: () => void; onNavigate?: (page: string) => void }> = ({
  onOpenTarot,
  onNavigate,
}) => {
  const { system } = useSystem();
  const {
    combatants,
    activeTurnIndex,
    roundNumber,
    updateHP,
    ablateSP,
    removeCombatant,
    addCriticalInjury,
    removeCriticalInjury,
    sortInitiative,
    nextTurn,
    prevTurn,
    clearCombat,
    addCombatant,
    toggleCondition,
    updateCombatant,
    importFromPlayerCharacter,
  } = useCombat();

  const { playerCharacters, savePlayerCharacter } = useUserRole();
  const { savedNPCs } = useCampaign();

  // MODAL STATES
  const [showImportPlayerModal, setShowImportPlayerModal] = useState<boolean>(false);
  const [showImportNPCModal, setShowImportNPCModal] = useState<boolean>(false);
  const [showManualAddModal, setShowManualAddModal] = useState<boolean>(false);
  const [showEnemyPresetModal, setShowEnemyPresetModal] = useState<boolean>(false);

  // MANUAL COMBATANT FORM STATE
  const [manualName, setManualName] = useState<string>('');
  const [manualHP, setManualHP] = useState<number>(35);
  const [manualSP, setManualSP] = useState<number>(11);
  const [manualRef, setManualRef] = useState<number>(7);

  // ATTACK ROLLER MODAL STATE
  const [attackingCombatant, setAttackingCombatant] = useState<Combatant | null>(null);
  const [attackTargetId, setAttackTargetId] = useState<string>('');
  const [selectedWeaponIdx, setSelectedWeaponIdx] = useState<number>(0);
  const [attackBonus, setAttackBonus] = useState<number>(14);
  const [targetRangeDV, setTargetRangeDV] = useState<number>(13);
  const [isAimedHeadShot, setIsAimedHeadShot] = useState<boolean>(false);
  const [isTargetEvading, setIsTargetEvading] = useState<boolean>(false);
  const [targetEvasionBonus, setTargetEvasionBonus] = useState<number>(14);
  const [attackResult, setAttackResult] = useState<{
    hit: boolean;
    attackRollText: string;
    defenseText: string;
    damageRollText: string;
    damageTotal: number;
    spAblated: boolean;
    hpDeducted: number;
    critInjuryTriggered?: string;
    tarotTriggered?: boolean;
  } | null>(null);

  // NETRUNNING COMBAT MODAL STATE
  const [netrunningCombatant, setNetrunningCombatant] = useState<Combatant | null>(null);
  const [netrunInterfaceRank, setNetrunInterfaceRank] = useState<number>(6);
  const [netrunActionsLeft, setNetrunActionsLeft] = useState<number>(3);
  const [selectedIceIdx, setSelectedIceIdx] = useState<number>(0);
  const [currentIceHp, setCurrentIceHp] = useState<number>(20);
  const [netrunLog, setNetrunLog] = useState<string[]>([]);

  // NOTIFICATION BANNER
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Roll Initiative for All Combatants
  const handleRollAllInitiative = () => {
    combatants.forEach(c => {
      const ref = c.stats?.REF || c.combatNumber ? Math.min(10, Math.max(4, (c.combatNumber || 14) - 6)) : 6;
      const d10 = Math.floor(Math.random() * 10) + 1;
      updateCombatant(c.id, { initiative: d10 + ref });
    });
    setTimeout(() => sortInitiative(), 50);
    showToast('Iniciativa rolada para todos os combatentes (1d10 + REF)!');
  };

  // Sync Combat Damage back to Character Sheet
  const handleSyncToSheet = (combatant: Combatant) => {
    if (!combatant.characterSheetId) {
      alert('Este combatente não está vinculado a uma ficha de personagem.');
      return;
    }
    const pc = playerCharacters.find(p => p.id === combatant.characterSheetId);
    if (!pc) return;

    savePlayerCharacter({
      ...pc,
      currentHP: combatant.currentHP,
      headSP: combatant.headSP,
      bodySP: combatant.bodySP,
    });
    showToast(`Ficha de ${pc.name} sincronizada com sucesso! (HP: ${combatant.currentHP}, SP: ${combatant.bodySP})`);
  };

  // Death Save Roller
  const handleRollDeathSave = (c: Combatant) => {
    const d10 = Math.floor(Math.random() * 10) + 1;
    const penalty = c.deathSavePenalty || 0;
    const total = d10 + penalty;
    const bodyStat = c.stats?.BODY || 6;

    if (total >= bodyStat) {
      showToast(`☠️ MORTE! Rolagem ${total} (d10 ${d10} + penalidade ${penalty}) >= BODY ${bodyStat}. ${c.name} MORREU!`);
    } else {
      updateCombatant(c.id, { deathSavePenalty: penalty + 1 });
      showToast(`❤️ SOBREVIVEU! Rolagem ${total} < BODY ${bodyStat}. Penalidade de Death Save aumentada para +${penalty + 1}.`);
    }
  };

  // Execute Weapon Attack
  const handleExecuteAttack = () => {
    if (!attackingCombatant) return;
    const target = combatants.find(c => c.id === attackTargetId);
    if (!target) {
      alert('Selecione um alvo válido para o ataque!');
      return;
    }

    const attackerWeapons = attackingCombatant.weapons || [];
    const selectedWeapon = attackerWeapons[selectedWeaponIdx] || {
      name: 'Ataque Desarmado',
      damage: '1d6',
      rof: 2,
    };

    // Attack Roll (1d10 + Bonus)
    const d10Attack = Math.floor(Math.random() * 10) + 1;
    let attackExplosion = 0;
    let attackText = `1d10 [${d10Attack}]`;

    if (d10Attack === 10) {
      const exp = Math.floor(Math.random() * 10) + 1;
      attackExplosion += exp;
      attackText += ` + CRÍTICO [${exp}]`;
    } else if (d10Attack === 1) {
      const fumble = Math.floor(Math.random() * 10) + 1;
      attackExplosion -= fumble;
      attackText += ` - DESASTRE [${fumble}]`;
    }

    let finalAttackBonus = attackBonus;
    if (isAimedHeadShot) {
      finalAttackBonus -= 8;
    }

    const totalAttackRoll = d10Attack + attackExplosion + finalAttackBonus;
    attackText += ` + Bônus [${finalAttackBonus}] = ${totalAttackRoll}`;

    // Target Defense / DV
    let targetDV = targetRangeDV;
    let defenseText = `DV de Alcance: ${targetRangeDV}`;

    if (isTargetEvading) {
      const d10Def = Math.floor(Math.random() * 10) + 1;
      let defExp = 0;
      let defDetail = `1d10 [${d10Def}]`;
      if (d10Def === 10) {
        const exp = Math.floor(Math.random() * 10) + 1;
        defExp += exp;
        defDetail += ` + Crítico [${exp}]`;
      } else if (d10Def === 1) {
        const fumble = Math.floor(Math.random() * 10) + 1;
        defExp -= fumble;
        defDetail += ` - Desastre [${fumble}]`;
      }
      targetDV = d10Def + defExp + targetEvasionBonus;
      defenseText = `Esquiva: ${defDetail} + Bônus [${targetEvasionBonus}] = ${targetDV}`;
    }

    const isHit = totalAttackRoll > targetDV;

    if (!isHit) {
      setAttackResult({
        hit: false,
        attackRollText: attackText,
        defenseText,
        damageRollText: 'O disparo/golpe errou o alvo!',
        damageTotal: 0,
        spAblated: false,
        hpDeducted: 0,
      });
      return;
    }

    // Parse and Roll Damage Dice (e.g. "3d6", "5d6+2")
    const dmgStr = selectedWeapon.damage || '3d6';
    const match = dmgStr.match(/(\d+)d6(?:\+(\d+))?/i);
    const numDice = match ? parseInt(match[1]) : 3;
    const addConst = match && match[2] ? parseInt(match[2]) : 0;

    const diceResults: number[] = [];
    let damageSum = addConst;
    let countSixes = 0;

    for (let i = 0; i < numDice; i++) {
      const val = Math.floor(Math.random() * 6) + 1;
      diceResults.push(val);
      damageSum += val;
      if (val === 6) countSixes++;
    }

    let damageRollText = `Dano [${diceResults.join(', ')}]${addConst > 0 ? ` + ${addConst}` : ''} = ${damageSum} dano bruto`;

    // Compare with Target Armor SP
    const targetSP = isAimedHeadShot ? target.headSP : target.bodySP;
    let hpDeducted = 0;
    let spAblated = false;

    if (damageSum > targetSP) {
      let penetratingDmg = damageSum - targetSP;
      if (isAimedHeadShot) {
        penetratingDmg *= 2;
        damageRollText += ` (Tiro na Cabeça! Dano penetrante x2!)`;
      }
      hpDeducted = penetratingDmg;
      spAblated = true;

      // Deduct HP & ablate SP
      updateHP(target.id, -hpDeducted);
      ablateSP(target.id, isAimedHeadShot ? 'head' : 'body', -1);
    } else {
      damageRollText += ` (Armadura repeliu o ataque: SP ${targetSP} >= Dano ${damageSum})`;
    }

    // Critical Injuries Check (2+ sixes on damage dice in RED)
    let critInjuryTriggered: string | undefined = undefined;
    if (countSixes >= 2) {
      const CRIT_TABLE = [
        'Corpo Estranho (Foreign Object - 5 de dano ao se mover)',
        'Músculo Dilacerado (Torn Muscle - -2 em testes)',
        'Membro Quebrado (Broken Arm/Leg - -4 na ação)',
        'Dano Cerebral Leve (Brain Damage - -2 INT/WILL)',
        'Concussão Grave (Concussion - desorientado)',
        'Fratura Craniana (Cracked Skull - 5 dano contínuo)',
        'Olho Perfurado (Lost Eye - -4 em pontaria)',
        'Pulmão Perfurado (Collapsed Lung - ação rápida perdida)',
      ];
      critInjuryTriggered = CRIT_TABLE[Math.floor(Math.random() * CRIT_TABLE.length)];
      addCriticalInjury(target.id, critInjuryTriggered);
    }

    // Night City Tarot Trigger (3+ sixes on damage dice!)
    const tarotTriggered = countSixes >= 3;

    setAttackResult({
      hit: true,
      attackRollText: attackText,
      defenseText,
      damageRollText,
      damageTotal: damageSum,
      spAblated,
      hpDeducted,
      critInjuryTriggered,
      tarotTriggered,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 p-3 rounded-xl bg-purple-950/95 border border-purple-500 text-purple-200 text-xs font-mono shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Top Header & Turn Control Bar */}
      <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-100 flex items-center gap-2.5">
              <Swords className="w-6 h-6 text-red-500" />
              <span>Arena de Combate // Tactical Initiative & Weapons</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Rastreador de iniciativa integrado com armas reais das fichas, ablação de blindagem, ferimentos críticos e Night City Tarot.
            </p>
          </div>

          {/* Quick Add Combatant Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              onClick={() => setShowImportPlayerModal(true)}
              className="px-3.5 py-2 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-200 text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
              title="Importar personagens com armas e atributos reais das fichas"
            >
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>📥 Importar da Ficha</span>
            </button>

            <button
              onClick={() => setShowEnemyPresetModal(true)}
              className="px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
            >
              <Skull className="w-3.5 h-3.5 text-red-400" />
              <span>☠️ Inimigos Prontos</span>
            </button>

            <button
              onClick={() => setShowManualAddModal(true)}
              className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-mono transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Manual</span>
            </button>

            {onOpenTarot && (
              <button
                onClick={onOpenTarot}
                className="px-3 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-purple-200 text-xs font-mono font-bold flex items-center gap-1.5 transition shadow"
                title="Puxar Arcano de Night City"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Tarot</span>
              </button>
            )}
          </div>
        </div>

        {/* Turn & Round Navigation Bar */}
        <div className="pt-3 border-t border-[#27272a] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300 font-bold">
              RODADA {roundNumber}
            </span>
            <span className="text-zinc-400">
              Total de Combatentes: <strong className="text-zinc-100">{combatants.length}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={prevTurn}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1 transition"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>

            <button
              onClick={nextTurn}
              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-1.5 transition shadow"
            >
              <span>Próximo Turno</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={sortInitiative}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
              title="Ordenar combatentes da maior para a menor iniciativa"
            >
              Ordenar Init
            </button>

            <button
              onClick={handleRollAllInitiative}
              className="px-3 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-800/60 text-amber-300 transition"
              title="Rolar 1d10 + REF para todos os combatentes"
            >
              <Dice5 className="w-3.5 h-3.5 inline mr-1" />
              Rolar Todos
            </button>

            {combatants.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Tem certeza que deseja limpar todos os combatentes desta batalha?')) {
                    clearCombat();
                  }
                }}
                className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-red-950 text-zinc-500 hover:text-red-400 transition"
                title="Limpar Arena de Combate"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* COMBATANTS LIST & INITIATIVE QUEUE */}
      {combatants.length > 0 ? (
        <div className="space-y-3">
          {combatants.map((c, index) => {
            const isTurn = index === activeTurnIndex;
            const hpRatio = c.maxHP > 0 ? c.currentHP / c.maxHP : 0;
            const isSeriouslyWounded = hpRatio <= 0.5 && c.currentHP > 0;
            const isMortallyWounded = c.currentHP === 0;

            return (
              <div
                key={c.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 space-y-3.5 relative ${
                  isTurn
                    ? 'bg-[#18121f] border-red-500 shadow-xl ring-2 ring-red-500/30'
                    : isMortallyWounded
                    ? 'bg-red-950/20 border-red-900/40 opacity-70'
                    : 'bg-[#121217] border-[#27272a] hover:border-zinc-700'
                }`}
              >
                {/* Header Row: Turn status, Init, Avatar, Name & Quick Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Initiative badge */}
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-black/60 border border-zinc-700 font-mono text-center">
                      <span className="text-[9px] text-zinc-500 uppercase leading-none">Init</span>
                      <span className="text-base font-bold text-amber-300 leading-tight">
                        {c.initiative}
                      </span>
                    </div>

                    {/* Avatar if exists */}
                    {c.imageUrl && (
                      <img
                        src={c.imageUrl}
                        alt={c.name}
                        className="w-11 h-11 rounded-xl object-cover border border-zinc-700 shadow shrink-0"
                      />
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        {isTurn && (
                          <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono text-[10px] font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                            <Play className="w-2.5 h-2.5 fill-white" /> TURNO ATIVO
                          </span>
                        )}
                        <h3 className="font-bold text-sm text-zinc-100">{c.name}</h3>
                        {c.role && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                            {c.role}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {c.faction || 'Neutro'} • REF {c.stats?.REF || 8} • DEX {c.stats?.DEX || 7} • MOVE {c.stats?.MOVE || 6} ({(c.stats?.MOVE || 6) * 2}m de corrida)
                      </span>
                    </div>
                  </div>

                  {/* Main Action Buttons for this Combatant */}
                  <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                    {/* Attack Button */}
                    <button
                      onClick={() => {
                        setAttackingCombatant(c);
                        setSelectedWeaponIdx(0);
                        setAttackBonus(c.combatNumber || (c.stats?.REF || 8) + 6);
                        const otherCombatant = combatants.find(o => o.id !== c.id);
                        setAttackTargetId(otherCombatant ? otherCombatant.id : '');
                        setAttackResult(null);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition shadow"
                    >
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>Atacar</span>
                    </button>

                    {/* Netrun Button */}
                    <button
                      onClick={() => {
                        setNetrunningCombatant(c);
                        const defaultIce = RED_BLACK_ICE_ROSTER[0];
                        setSelectedIceIdx(0);
                        setCurrentIceHp(defaultIce.hp);
                        setNetrunInterfaceRank(6);
                        setNetrunActionsLeft(3);
                        setNetrunLog([
                          `[JACK IN COMBATE] ${c.name} conectou seu cyberdeck em pleno tiroteio!`,
                          `Engajado contra Black ICE: ${defaultIce.name} [HP: ${defaultIce.hp}, DEF: ${defaultIce.def}, ATK: ${defaultIce.atk}].`,
                        ]);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700 text-purple-200 font-mono text-xs flex items-center gap-1 transition"
                      title="Realizar Ações de Netrunning no Turno"
                    >
                      <Network className="w-3.5 h-3.5 text-purple-400" />
                      <span className="hidden sm:inline">Netrun</span>
                    </button>

                    {/* Sync to Sheet Button if linked */}
                    {c.characterSheetId && (
                      <button
                        onClick={() => handleSyncToSheet(c)}
                        className="px-2.5 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 font-mono text-xs flex items-center gap-1 transition"
                        title="Sincronizar dano de volta para a ficha do jogador"
                      >
                        <Check className="w-3 h-3 text-cyan-400" />
                        <span className="hidden sm:inline">Salvar Ficha</span>
                      </button>
                    )}

                    {/* Death Save button if 0 HP */}
                    {c.currentHP === 0 && (
                      <button
                        onClick={() => handleRollDeathSave(c)}
                        className="px-2.5 py-1.5 rounded-xl bg-red-950 hover:bg-red-900 border border-red-700 text-red-200 font-mono font-bold text-xs flex items-center gap-1 animate-pulse"
                        title="Rolar Death Save (1d10 <= BODY)"
                      >
                        <Skull className="w-3 h-3" />
                        <span>Death Save</span>
                      </button>
                    )}

                    <button
                      onClick={() => removeCombatant(c.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 transition"
                      title="Remover do Combate"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* HP & Armor Tracker Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs font-mono">
                  {/* HP Bar & Buttons (6 cols) */}
                  <div className="md:col-span-6 p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-semibold">
                        <Heart className="w-3.5 h-3.5 text-red-500" /> Pontos de Vida (HP):
                      </span>
                      <span className={`font-bold ${isMortallyWounded ? 'text-red-500' : isSeriouslyWounded ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {c.currentHP} / {c.maxHP} HP
                      </span>
                    </div>

                    <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                      <div
                        className={`h-full transition-all duration-300 ${
                          isMortallyWounded
                            ? 'bg-red-700'
                            : isSeriouslyWounded
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.max(0, Math.min(100, hpRatio * 100))}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1 gap-1">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateHP(c.id, -10)}
                          className="px-2 py-0.5 rounded bg-red-950 hover:bg-red-900 border border-red-800/60 text-red-300 text-[10px]"
                        >
                          -10
                        </button>
                        <button
                          onClick={() => updateHP(c.id, -5)}
                          className="px-2 py-0.5 rounded bg-red-950 hover:bg-red-900 border border-red-800/60 text-red-300 text-[10px]"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => updateHP(c.id, -1)}
                          className="px-2 py-0.5 rounded bg-red-950 hover:bg-red-900 border border-red-800/60 text-red-300 text-[10px]"
                        >
                          -1
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateHP(c.id, 1)}
                          className="px-2 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-[10px]"
                        >
                          +1
                        </button>
                        <button
                          onClick={() => updateHP(c.id, 5)}
                          className="px-2 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-[10px]"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Armor Head & Body SP Tracker (6 cols) */}
                  <div className="md:col-span-6 p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                    <span className="text-[11px] text-zinc-400 flex items-center gap-1 font-semibold">
                      <Shield className="w-3.5 h-3.5 text-cyan-400" /> Blindagem / SP (Head & Body):
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded-lg bg-black/60 border border-zinc-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-zinc-500 block uppercase">Cabeça (Head)</span>
                          <span className="text-sm font-bold text-zinc-100">{c.headSP} SP</span>
                        </div>
                        <button
                          onClick={() => ablateSP(c.id, 'head', -1)}
                          className="px-2 py-0.5 rounded bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 text-[10px]"
                          title="Ablatar 1 SP da Cabeça"
                        >
                          -1 SP
                        </button>
                      </div>

                      <div className="p-2 rounded-lg bg-black/60 border border-zinc-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-zinc-500 block uppercase">Corpo (Body)</span>
                          <span className="text-sm font-bold text-zinc-100">{c.bodySP} SP</span>
                        </div>
                        <button
                          onClick={() => ablateSP(c.id, 'body', -1)}
                          className="px-2 py-0.5 rounded bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 text-[10px]"
                          title="Ablatar 1 SP do Corpo"
                        >
                          -1 SP
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weapons & Attacks Chips Pulled Directly from Sheet */}
                {c.weapons && c.weapons.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-zinc-800/80">
                    <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
                      Armas & Ataques Disponíveis:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                      {c.weapons.map((w, wIdx) => (
                        <div
                          key={wIdx}
                          className="px-2.5 py-1 rounded-lg bg-black/60 border border-zinc-700 text-zinc-200 text-[11px] flex items-center gap-1.5"
                        >
                          <Crosshair className="w-3 h-3 text-red-400 shrink-0" />
                          <strong className="text-zinc-100">{w.name}</strong>
                          <span className="text-red-400 font-bold">{w.damage}</span>
                          <span className="text-zinc-500 text-[10px]">ROF {w.rof}</span>
                          {w.notes && (
                            <span className="text-[10px] text-amber-300/80 italic">({w.notes})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Conditions & Critical Injuries Bar */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono">
                  {CONDITIONS_LIST.map(cond => {
                    const isActive = c.conditions.includes(cond.id);
                    return (
                      <button
                        key={cond.id}
                        onClick={() => toggleCondition(c.id, cond.id)}
                        className={`px-2 py-0.5 rounded-md border transition text-[10px] flex items-center gap-1 ${
                          isActive
                            ? 'bg-red-950 text-red-200 border-red-700 font-bold'
                            : 'bg-zinc-900/60 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                        }`}
                        title={cond.desc}
                      >
                        <span>{cond.icon}</span>
                        <span>{cond.id}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Critical Injuries Badges if any */}
                {c.criticalInjuries && c.criticalInjuries.length > 0 && (
                  <div className="p-2 rounded-xl bg-red-950/40 border border-red-800/60 space-y-1 text-xs font-mono">
                    <span className="text-[10px] text-red-400 uppercase font-bold block flex items-center gap-1">
                      <Skull className="w-3 h-3" /> Ferimentos Críticos:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {c.criticalInjuries.map((inj, iIdx) => (
                        <span
                          key={iIdx}
                          className="px-2 py-0.5 rounded bg-red-900/80 text-red-100 border border-red-700 text-[10px] flex items-center gap-1"
                        >
                          <span>{inj}</span>
                          <button
                            onClick={() => removeCriticalInjury(c.id, inj)}
                            className="hover:text-red-300 text-red-400 font-bold ml-1"
                            title="Remover Ferimento"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 rounded-2xl bg-[#121217] border border-[#27272a] text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-800/50 flex items-center justify-center mx-auto text-red-400">
            <Swords className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-200 font-mono uppercase">
              Nenhum Combatente na Arena
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
              Importe seus <strong>personagens das fichas de jogador</strong>, traga NPCs da campanha ou adicione inimigos prontos com um clique acima para iniciar a batalha.
            </p>
          </div>
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => setShowImportPlayerModal(true)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition shadow"
            >
              <User className="w-4 h-4" />
              <span>Importar Ficha de Jogador</span>
            </button>
            <button
              onClick={() => setShowEnemyPresetModal(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs flex items-center gap-1.5 transition shadow"
            >
              <Skull className="w-4 h-4" />
              <span>Adicionar Inimigos</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: IMPORT PLAYER CHARACTER */}
      {showImportPlayerModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#121217] border border-cyan-600/70 rounded-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-zinc-100 uppercase font-mono">
                  Importar Personagem da Ficha para o Combate
                </h3>
              </div>
              <button
                onClick={() => setShowImportPlayerModal(false)}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs"
              >
                ✕ Fechar
              </button>
            </div>

            <p className="text-zinc-400 text-xs">
              Selecione um personagem para adicionar à iniciativa. Todos os seus atributos (REF, DEX, MOVE, BODY), blindagem (Head & Body SP), e <strong>todas as armas e implantes de combate equipados na ficha</strong> serão importados automaticamente!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {playerCharacters.map(pc => (
                <div
                  key={pc.id}
                  className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 hover:border-cyan-500/80 transition space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      {pc.imageUrl ? (
                        <img
                          src={pc.imageUrl}
                          alt={pc.name}
                          className="w-10 h-10 rounded-lg object-cover border border-zinc-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-400 font-bold">
                          {pc.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-zinc-100 text-xs">{pc.name}</h4>
                        <span className="text-[10px] text-cyan-400 font-mono">
                          {pc.role} • {pc.handle ? `"${pc.handle}"` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px] text-zinc-400 pt-1">
                      <div className="bg-zinc-900 p-1 rounded">HP: <strong className="text-emerald-400">{pc.currentHP}/{pc.maxHP}</strong></div>
                      <div className="bg-zinc-900 p-1 rounded">SP: <strong className="text-cyan-400">{pc.bodySP || 11}</strong></div>
                      <div className="bg-zinc-900 p-1 rounded">REF: <strong className="text-zinc-200">{pc.statsRED?.REF || 8}</strong></div>
                    </div>

                    {/* Weapons list preview */}
                    <div className="space-y-0.5 pt-1">
                      <span className="text-[9px] font-mono uppercase text-zinc-500 block">Armas na Ficha:</span>
                      <div className="text-[10px] text-zinc-300 font-mono space-y-0.5">
                        {(pc.weapons || []).slice(0, 3).map((w, idx) => (
                          <div key={idx} className="truncate">
                            • {w.name} ({w.damage})
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      importFromPlayerCharacter(pc);
                      setShowImportPlayerModal(false);
                      showToast(`${pc.name} importado para o combate com armas equipadas!`);
                    }}
                    className="w-full mt-2 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-mono font-bold text-xs uppercase transition shadow flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar à Batalha</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ENEMY PRESETS */}
      {showEnemyPresetModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#121217] border border-red-600/70 rounded-2xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <Skull className="w-5 h-5 text-red-500" />
                <h3 className="text-sm font-bold text-zinc-100 uppercase font-mono">
                  Adicionar Inimigos & Ameaças Prontas
                </h3>
              </div>
              <button
                onClick={() => setShowEnemyPresetModal(false)}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs"
              >
                ✕ Fechar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ENEMY_PRESETS.map((enemy, eIdx) => (
                <div
                  key={eIdx}
                  className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-red-400 text-xs">{enemy.name}</h4>
                    <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px] text-zinc-400">
                      <div className="bg-zinc-900 p-1 rounded">HP: <strong className="text-zinc-100">{enemy.hp}</strong></div>
                      <div className="bg-zinc-900 p-1 rounded">SP: <strong className="text-zinc-100">{enemy.bodySP}</strong></div>
                      <div className="bg-zinc-900 p-1 rounded">REF: <strong className="text-zinc-100">{enemy.ref}</strong></div>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400 pt-1 space-y-0.5">
                      {enemy.weapons.map((w, wIdx) => (
                        <div key={wIdx}>• {w.name} ({w.damage})</div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const initRoll = Math.floor(Math.random() * 10) + 1 + enemy.ref;
                      addCombatant({
                        id: `enemy-${Date.now()}-${eIdx}`,
                        name: enemy.name,
                        system: 'RED',
                        initiative: initRoll,
                        currentHP: enemy.hp,
                        maxHP: enemy.hp,
                        headSP: enemy.headSP,
                        bodySP: enemy.bodySP,
                        maxHeadSP: enemy.headSP,
                        maxBodySP: enemy.bodySP,
                        conditions: [],
                        criticalInjuries: [],
                        deathSavePenalty: 0,
                        faction: 'Hostil',
                        stats: { REF: enemy.ref, DEX: enemy.dex, BODY: 8, MOVE: 6 },
                        weapons: enemy.weapons.map(w => ({ ...w, rof: w.rof || 1 })),
                        combatNumber: enemy.ref + 6,
                      });
                      setShowEnemyPresetModal(false);
                      showToast(`${enemy.name} entrou na arena!`);
                    }}
                    className="w-full mt-2 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs uppercase transition shadow flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Inimigo</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: MANUAL COMBATANT CREATION */}
      {showManualAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#121217] border border-zinc-700 rounded-2xl max-w-md w-full p-5 sm:p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <h3 className="text-sm font-bold text-zinc-100 uppercase font-mono">
                Adicionar Combatente Manual
              </h3>
              <button
                onClick={() => setShowManualAddModal(false)}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs"
              >
                ✕ Fechar
              </button>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                if (!manualName.trim()) return;
                const initRoll = Math.floor(Math.random() * 10) + 1 + manualRef;
                addCombatant({
                  id: `manual-${Date.now()}`,
                  name: manualName.trim(),
                  system: 'RED',
                  initiative: initRoll,
                  currentHP: manualHP,
                  maxHP: manualHP,
                  headSP: manualSP,
                  bodySP: manualSP,
                  maxHeadSP: manualSP,
                  maxBodySP: manualSP,
                  conditions: [],
                  criticalInjuries: [],
                  deathSavePenalty: 0,
                  stats: { REF: manualRef, DEX: 7, BODY: 7, MOVE: 6 },
                  weapons: [{ name: 'Pistola Pesada 9mm', damage: '3d6', rof: 2, ammoType: 'Heavy' }],
                  combatNumber: manualRef + 6,
                });
                setManualName('');
                setShowManualAddModal(false);
                showToast('Combatente adicionado!');
              }}
              className="space-y-3 font-mono"
            >
              <div>
                <label className="block text-zinc-400 mb-1">Nome / Código do Combatente:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Guarda Corporativo 01"
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  className="w-full bg-[#0a0a0d] border border-zinc-700 rounded-lg p-2 text-zinc-100 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-zinc-400 mb-1">HP Máx:</label>
                  <input
                    type="number"
                    value={manualHP}
                    onChange={e => setManualHP(parseInt(e.target.value) || 30)}
                    className="w-full bg-[#0a0a0d] border border-zinc-700 rounded-lg p-2 text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Blindagem SP:</label>
                  <input
                    type="number"
                    value={manualSP}
                    onChange={e => setManualSP(parseInt(e.target.value) || 11)}
                    className="w-full bg-[#0a0a0d] border border-zinc-700 rounded-lg p-2 text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">REF (Inic):</label>
                  <input
                    type="number"
                    value={manualRef}
                    onChange={e => setManualRef(parseInt(e.target.value) || 6)}
                    className="w-full bg-[#0a0a0d] border border-zinc-700 rounded-lg p-2 text-zinc-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold uppercase transition"
              >
                Adicionar à Arena
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: COMPREHENSIVE WEAPONS ATTACK ENGINE */}
      {attackingCombatant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#121217] border border-red-600/70 rounded-2xl max-w-xl w-full p-5 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto text-xs font-sans">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 uppercase font-mono">
                    Disparar Ataque // {attackingCombatant.name}
                  </h3>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Selecione a arma real da ficha, o alvo e a distância tática.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAttackingCombatant(null)}
                className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs"
              >
                ✕ Fechar
              </button>
            </div>

            {/* Target & Weapon Selectors */}
            <div className="space-y-3 font-mono">
              {/* Target Selector */}
              <div>
                <label className="text-[11px] uppercase text-zinc-400 font-bold block mb-1">
                  Alvo do Ataque:
                </label>
                <select
                  value={attackTargetId}
                  onChange={e => setAttackTargetId(e.target.value)}
                  className="w-full bg-[#0a0a0d] border border-zinc-700 rounded-xl p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-red-500"
                >
                  <option value="">Selecione o alvo na arena...</option>
                  {combatants
                    .filter(c => c.id !== attackingCombatant.id)
                    .map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} (HP: {c.currentHP}/{c.maxHP} • SP: {c.bodySP})
                      </option>
                    ))}
                </select>
              </div>

              {/* Weapon Pulled From Sheet */}
              <div>
                <label className="text-[11px] uppercase text-zinc-400 font-bold block mb-1">
                  Arma / Ataque da Ficha:
                </label>
                <select
                  value={selectedWeaponIdx}
                  onChange={e => setSelectedWeaponIdx(parseInt(e.target.value))}
                  className="w-full bg-[#0a0a0d] border border-zinc-700 rounded-xl p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-red-500"
                >
                  {(attackingCombatant.weapons || [
                    { name: 'Ataque Desarmado', damage: '1d6', rof: 2 },
                  ]).map((w, wIdx) => (
                    <option key={wIdx} value={wIdx}>
                      {w.name} • Dano: {w.damage} • ROF {w.rof} {w.notes ? `(${w.notes})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Attack Bonus & Range DVs */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">
                    Bônus de Ataque (REF + Perícia):
                  </label>
                  <input
                    type="number"
                    value={attackBonus}
                    onChange={e => setAttackBonus(parseInt(e.target.value) || 10)}
                    className="w-full bg-[#0a0a0d] border border-zinc-700 rounded-lg p-2 text-zinc-100"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-zinc-400 block mb-1">
                    DV por Distância (Cyberpunk RED):
                  </label>
                  <select
                    value={targetRangeDV}
                    onChange={e => setTargetRangeDV(parseInt(e.target.value))}
                    className="w-full bg-[#0a0a0d] border border-zinc-700 rounded-lg p-2 text-zinc-100"
                  >
                    <option value={13}>Curto Alcance: 0–6 metros (DV 13)</option>
                    <option value={15}>Médio Alcance: 7–12 metros (DV 15)</option>
                    <option value={17}>Longo Alcance: 13–25 metros (DV 17)</option>
                    <option value={20}>Extremo: 26–50 metros (DV 20)</option>
                    <option value={25}>Sniper: 51+ metros (DV 25)</option>
                  </select>
                </div>
              </div>

              {/* Tactical Modifiers */}
              <div className="space-y-1.5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-amber-300">
                  <input
                    type="checkbox"
                    checked={isAimedHeadShot}
                    onChange={e => setIsAimedHeadShot(e.target.checked)}
                    className="rounded accent-amber-500"
                  />
                  <span>Disparo Mirado na Cabeça (-8 no Ataque, Dano que passar é x2!)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-cyan-300">
                  <input
                    type="checkbox"
                    checked={isTargetEvading}
                    onChange={e => setIsTargetEvading(e.target.checked)}
                    className="rounded accent-cyan-500"
                  />
                  <span>Alvo está se Esquivando ativamente (Rola DEX + Evasion)</span>
                </label>
              </div>

              {isTargetEvading && (
                <div>
                  <label className="text-[10px] text-cyan-400 block mb-1">
                    Bônus de Esquiva do Alvo (DEX + Evasion):
                  </label>
                  <input
                    type="number"
                    value={targetEvasionBonus}
                    onChange={e => setTargetEvasionBonus(parseInt(e.target.value) || 12)}
                    className="w-full bg-[#0a0a0d] border border-cyan-800 rounded-lg p-2 text-zinc-100"
                  />
                </div>
              )}
            </div>

            {/* Execute Attack Button */}
            <button
              onClick={handleExecuteAttack}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
            >
              <Dice5 className="w-4 h-4" />
              <span>Rolar Ataque e Aplicar Dano / Ablação</span>
            </button>

            {/* Attack Results Box */}
            {attackResult && (
              <div
                className={`p-4 rounded-xl border space-y-2 font-mono text-xs ${
                  attackResult.hit ? 'bg-red-950/20 border-red-700/60' : 'bg-zinc-900/40 border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className={attackResult.hit ? 'text-emerald-400' : 'text-zinc-400'}>
                    {attackResult.hit ? '✓ TIRO ACERTOU O ALVO!' : '✗ TIRO ERROU!'}
                  </span>
                  <span className="text-zinc-400 text-[11px]">{attackResult.defenseText}</span>
                </div>

                <div className="text-[11px] text-zinc-300">{attackResult.attackRollText}</div>
                <div className="text-[11px] text-amber-300">{attackResult.damageRollText}</div>

                {attackResult.hit && (
                  <div className="pt-1.5 text-[11px] border-t border-zinc-800 text-zinc-200 flex flex-wrap gap-3">
                    <span>
                      Dano deduzido do HP: <strong className="text-red-400 font-bold">-{attackResult.hpDeducted} HP</strong>
                    </span>
                    {attackResult.spAblated && (
                      <span className="text-amber-400 font-bold">Blindagem Ablatada (-1 SP)</span>
                    )}
                  </div>
                )}

                {/* Critical Injury Trigger */}
                {attackResult.critInjuryTriggered && (
                  <div className="p-2.5 rounded-lg bg-red-950 border border-red-700 text-red-200 font-bold text-[11px] flex items-center gap-1.5 mt-1">
                    <Skull className="w-4 h-4 text-red-400 shrink-0" />
                    <span>FERIMENTO CRÍTICO REGISTRADO: {attackResult.critInjuryTriggered}!</span>
                  </div>
                )}

                {/* Night City Tarot Trigger */}
                {attackResult.tarotTriggered && (
                  <div className="p-3 rounded-xl bg-purple-950/80 border border-purple-600 text-purple-200 font-bold text-[11px] flex items-center justify-between gap-2 mt-1.5 shadow-lg">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400 shrink-0 animate-pulse" />
                      <div>
                        <div>NIGHT CITY TAROT: 3+ Seis no Dano!</div>
                        <div className="text-[10px] font-normal text-purple-300">
                          Regra Oficial RED v1.2: O atacante deve puxar uma Carta de Arcano Maior.
                        </div>
                      </div>
                    </div>
                    {onOpenTarot && (
                      <button
                        onClick={() => {
                          onOpenTarot();
                          setAttackingCombatant(null);
                        }}
                        className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono whitespace-nowrap shadow transition"
                      >
                        Puxar Arcano
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 5: FAST NETRUNNING IN COMBAT */}
      {netrunningCombatant && (() => {
        const ice = RED_BLACK_ICE_ROSTER[selectedIceIdx] || RED_BLACK_ICE_ROSTER[0];
        const isIceDead = currentIceHp <= 0;

        const handleSwordAttack = () => {
          if (netrunActionsLeft <= 0) {
            alert('Ações de Interface esgotadas nesta rodada!');
            return;
          }
          const d10 = Math.floor(Math.random() * 10) + 1;
          const total = d10 + netrunInterfaceRank;
          const hit = total >= ice.def;
          setNetrunActionsLeft(prev => prev - 1);

          if (hit) {
            const dmg = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1);
            const newHp = Math.max(0, currentIceHp - dmg);
            setCurrentIceHp(newHp);
            setNetrunLog(prev => [
              ...prev,
              newHp === 0
                ? `⚔️ [SWORD DE-REZ! Total ${total} vs DEF ${ice.def}]: ${ice.name} FOI DESTRUÍDO!`
                : `⚔️ [SWORD ACERTOU! Total ${total} vs DEF ${ice.def}]: Causou ${dmg} dano ao ${ice.name}! HP: ${newHp}/${ice.hp}.`,
            ]);
          } else {
            setNetrunLog(prev => [
              ...prev,
              `❌ [SWORD ERROU! Total ${total} vs DEF ${ice.def}]: O Black ICE desviou!`,
            ]);
          }
        };

        const handleBanhammerAttack = () => {
          if (netrunActionsLeft <= 0) return;
          const d10 = Math.floor(Math.random() * 10) + 1;
          const total = d10 + netrunInterfaceRank;
          const hit = total >= ice.def;
          setNetrunActionsLeft(prev => prev - 1);

          if (hit) {
            const dmg = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1) + 2;
            const newHp = Math.max(0, currentIceHp - dmg);
            setCurrentIceHp(newHp);
            setNetrunLog(prev => [
              ...prev,
              newHp === 0
                ? `🔨 [BANHAMMER ESMAGOU! Total ${total} vs DEF ${ice.def}]: ${ice.name} FOI DELETADO!`
                : `🔨 [BANHAMMER ACERTOU! Total ${total} vs DEF ${ice.def}]: Causou ${dmg} dano pesado! HP: ${newHp}/${ice.hp}.`,
            ]);
          } else {
            setNetrunLog(prev => [
              ...prev,
              `❌ [BANHAMMER ERROU! Total ${total} vs DEF ${ice.def}]: O golpe passou raspando!`,
            ]);
          }
        };

        const handleBlackIceAttack = () => {
          const d10Atk = Math.floor(Math.random() * 10) + 1 + ice.atk;
          const d10Def = Math.floor(Math.random() * 10) + 1 + netrunInterfaceRank;

          if (d10Atk > d10Def) {
            const dmg = (Math.floor(Math.random() * 6) + 1) + (Math.floor(Math.random() * 6) + 1); // 2d6
            updateHP(netrunningCombatant.id, -dmg);
            setNetrunLog(prev => [
              ...prev,
              `💥 [CONTRA-ATAQUE ${ice.name}]: ACERTOU! (ATK ${d10Atk} vs DEF ${d10Def}). Causou ${dmg} de dano cerebral direto a ${netrunningCombatant.name}!`,
            ]);
          } else {
            setNetrunLog(prev => [
              ...prev,
              `🛡️ [ESQUIVA NEURAL]: ${netrunningCombatant.name} defendeu o golpe de ${ice.name}!`,
            ]);
          }
        };

        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-[#121217] border border-purple-600/70 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl text-xs font-sans">
              <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-zinc-100 uppercase font-mono">
                    Netrun no Turno de Combate // {netrunningCombatant.name}
                  </h3>
                </div>
                <button
                  onClick={() => setNetrunningCombatant(null)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs"
                >
                  ✕ Fechar
                </button>
              </div>

              {/* Status bar */}
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-zinc-800">
                  <span className="text-[9px] text-zinc-400 block uppercase">HP da Carne</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {netrunningCombatant.currentHP} / {netrunningCombatant.maxHP} HP
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0a0a0d] border border-purple-900/60">
                  <span className="text-[9px] text-purple-400 block uppercase">Ações Restantes</span>
                  <span className="text-sm font-bold text-purple-300">{netrunActionsLeft} / 3</span>
                </div>
              </div>

              {/* Black ICE Selector */}
              <div className="p-3.5 rounded-xl bg-black/60 border border-red-900/50 space-y-2 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-red-400">Alvo Black ICE:</span>
                  <select
                    value={selectedIceIdx}
                    onChange={e => {
                      const idx = parseInt(e.target.value);
                      setSelectedIceIdx(idx);
                      const nIce = RED_BLACK_ICE_ROSTER[idx] || RED_BLACK_ICE_ROSTER[0];
                      setCurrentIceHp(nIce.hp);
                    }}
                    className="bg-[#0a0a0d] border border-zinc-700 rounded px-2 py-1 text-zinc-200 text-xs"
                  >
                    {RED_BLACK_ICE_ROSTER.map((b, idx) => (
                      <option key={b.name} value={idx}>
                        {b.name} ({b.hp} HP)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between text-[11px]">
                  <span>HP do Guardião:</span>
                  <span className="text-red-400 font-bold">{currentIceHp} / {ice.hp} HP</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleSwordAttack}
                  disabled={isIceDead}
                  className="p-2 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 font-mono text-xs font-bold disabled:opacity-40"
                >
                  Sword (3d6)
                </button>
                <button
                  onClick={handleBanhammerAttack}
                  disabled={isIceDead}
                  className="p-2 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 text-amber-200 font-mono text-xs font-bold disabled:opacity-40"
                >
                  Banhammer
                </button>
                <button
                  onClick={handleBlackIceAttack}
                  disabled={isIceDead}
                  className="p-2 rounded-lg bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 font-mono text-xs font-bold disabled:opacity-40"
                >
                  Contra-Ataque
                </button>
              </div>

              {/* Run Log */}
              <div className="p-3 rounded-lg bg-black/80 border border-zinc-800 text-[11px] font-mono text-zinc-300 max-h-36 overflow-y-auto space-y-1">
                {netrunLog.map((log, lIdx) => (
                  <div key={lIdx}>{log}</div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
