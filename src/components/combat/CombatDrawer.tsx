import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Heart,
  Skull,
  Play,
  SkipForward,
  SkipBack,
  Trash2,
  Plus,
  Sparkles,
  Shield,
  Crosshair,
  Flame,
  Eye,
  AlertCircle,
  Swords,
  Dice5,
  Check,
} from 'lucide-react';
import { useCombat, Combatant } from '../../context/CombatContext';

interface CombatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CONDITIONS_LIST = [
  { id: 'Em Chamas', icon: '🔥', desc: 'Sofre 2 de dano direto no início de cada turno até gastar Ação para apagar' },
  { id: 'Atordoado', icon: '⚡', desc: '-2 em todas as Ações e Testes de Perícia' },
  { id: 'Cego', icon: '👁️', desc: '-4 em Ataques e Testes de Percepção / Visão' },
  { id: 'Caído', icon: '⬇️', desc: 'No chão. Custa 2m de movimento para se levantar' },
  { id: 'Envenenado', icon: '🧪', desc: 'Biotoxina no sangue: sofre dano de veneno por rodada' },
];

const PRESET_WEAPONS = [
  { name: 'Pistola Pesada 9mm / 11mm', damage: '3d6', rof: 2 },
  { name: 'Pistola Muito Pesada (.45 / .50)', damage: '4d6', rof: 1 },
  { name: 'Submetralhadora 9mm (SMG)', damage: '2d6', rof: 1 },
  { name: 'Fuzil de Assalto 5.56mm', damage: '5d6', rof: 1 },
  { name: 'Espingarda 12GA (Chumbo/Slug)', damage: '5d6', rof: 1 },
  { name: 'Arma Branca Muito Pesada (Katana/Machado)', damage: '3d6', rof: 2 },
  { name: 'Ataque Desarmado (Soco/Chute)', damage: '1d6', rof: 2 },
];

export const CombatDrawer: React.FC<CombatDrawerProps> = ({ isOpen, onClose }) => {
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
  } = useCombat();

  const [selectedInjury, setSelectedInjury] = useState<string>('Corpo Estranho (Foreign Object)');
  const [newCombatantName, setNewCombatantName] = useState<string>('');
  const [newCombatantHP, setNewCombatantHP] = useState<number>(35);
  const [newCombatantSP, setNewCombatantSP] = useState<number>(11);

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
  } | null>(null);

  // VISUAL APPEARANCE MODAL STATE
  const [editingAppearanceCombatant, setEditingAppearanceCombatant] = useState<Combatant | null>(null);
  const [tempAppearance, setTempAppearance] = useState<string>('');

  if (!isOpen) return null;

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCombatantName.trim()) return;
    const newEntry: Combatant = {
      id: 'manual-' + Date.now(),
      name: newCombatantName.trim(),
      system: 'RED',
      initiative: Math.floor(Math.random() * 10) + 1 + 6,
      currentHP: newCombatantHP,
      maxHP: newCombatantHP,
      headSP: newCombatantSP,
      bodySP: newCombatantSP,
      conditions: [],
      criticalInjuries: [],
      deathSavePenalty: 0,
    };
    addCombatant(newEntry);
    setNewCombatantName('');
  };

  const CRITICAL_INJURIES_QUICK_LIST = [
    'Corpo Estranho (Foreign Object - 5 dano ao mover)',
    'Braço Quebrado (Inutilizado)',
    'Perna Quebrada (-4 MOVE)',
    'Costelas Quebradas (5 dano ao mover)',
    'Concussão (-2 em todas as ações)',
    'Lesão Cerebral (-2 em todas as ações)',
    'Olho Danificado (-2 tiros e visão)',
    'Crânio Rachado (Tiros na cabeça dão x3)',
    'Braço Decepado (Morte +1)',
    'Perna Decepada (-6 MOVE, não esquiva)',
  ];

  // Execute Interactive Combat Attack
  const handleExecuteAttack = () => {
    if (!attackingCombatant) return;
    const target = combatants.find(c => c.id === attackTargetId);
    if (!target) {
      alert('Selecione um alvo válido para o ataque!');
      return;
    }

    const activeWeapons = attackingCombatant.weapons && attackingCombatant.weapons.length > 0
      ? attackingCombatant.weapons
      : PRESET_WEAPONS;
    const weapon = activeWeapons[selectedWeaponIdx] || activeWeapons[0];

    // 1. Attack roll: 1d10 + attackBonus (-8 if aimed shot)
    let attackD10 = Math.floor(Math.random() * 10) + 1;
    let attackExplode = 0;
    if (attackD10 === 10) attackExplode = Math.floor(Math.random() * 10) + 1;
    else if (attackD10 === 1) attackExplode = -1 * (Math.floor(Math.random() * 10) + 1);

    const aimedPenalty = isAimedHeadShot ? -8 : 0;
    const totalAttack = attackD10 + attackExplode + attackBonus + aimedPenalty;

    // 2. Defense DV / Evasion
    let defenseValue = targetRangeDV;
    let defenseText = `DV de Distância: ${targetRangeDV}`;
    if (isTargetEvading) {
      let evadeD10 = Math.floor(Math.random() * 10) + 1;
      let evadeExplode = 0;
      if (evadeD10 === 10) evadeExplode = Math.floor(Math.random() * 10) + 1;
      else if (evadeD10 === 1) evadeExplode = -1 * (Math.floor(Math.random() * 10) + 1);
      const totalEvade = evadeD10 + evadeExplode + targetEvasionBonus;
      defenseValue = totalEvade;
      defenseText = `Esquiva do Alvo: ${totalEvade} (d10:${evadeD10} + ${targetEvasionBonus})`;
    }

    const hit = totalAttack >= defenseValue;

    if (!hit) {
      setAttackResult({
        hit: false,
        attackRollText: `Total Ataque: ${totalAttack} (d10:${attackD10} + Bônus:${attackBonus}${isAimedHeadShot ? ' -8 Mira' : ''})`,
        defenseText,
        damageRollText: 'Disparo errou o alvo!',
        damageTotal: 0,
        spAblated: false,
        hpDeducted: 0,
      });
      return;
    }

    // 3. Roll Damage
    const diceCount = parseInt(weapon.damage.split('d6')[0]) || 3;
    const diceResults: number[] = [];
    let damageSum = 0;
    for (let i = 0; i < diceCount; i++) {
      const roll = Math.floor(Math.random() * 6) + 1;
      diceResults.push(roll);
      damageSum += roll;
    }

    // Check for critical injury: two 6s
    const sixCount = diceResults.filter(r => r === 6).length;
    let critInjury: string | undefined = undefined;
    if (sixCount >= 2) {
      critInjury = CRITICAL_INJURIES_QUICK_LIST[Math.floor(Math.random() * CRITICAL_INJURIES_QUICK_LIST.length)];
      addCriticalInjury(target.id, critInjury);
    }

    // 4. Armor & Ablation calculation
    const armorSP = isAimedHeadShot ? target.headSP : target.bodySP;
    const armorLocation = isAimedHeadShot ? 'head' : 'body';
    let spAblated = false;
    let hpDeducted = 0;

    if (damageSum > armorSP) {
      spAblated = true;
      ablateSP(target.id, armorLocation, -1);
      const penetratingDamage = damageSum - armorSP;
      hpDeducted = isAimedHeadShot ? penetratingDamage * 2 : penetratingDamage;
      updateHP(target.id, -hpDeducted);
    }

    setAttackResult({
      hit: true,
      attackRollText: `Total Ataque: ${totalAttack} (d10:${attackD10} + Bônus:${attackBonus}${isAimedHeadShot ? ' -8 Mira' : ''})`,
      defenseText,
      damageRollText: `Dados [${diceResults.join(', ')}] = ${damageSum} de dano contra SP ${armorSP}`,
      damageTotal: damageSum,
      spAblated,
      hpDeducted,
      critInjuryTriggered: critInjury,
    });
  };

  const handleGenerateAppearanceText = () => {
    const archetypes = [
      'Jaqueta pesada de couro sintético rasgada, moicano estilizado com luzes de fibra óptica azul e tatuagens faciais de circuitos eletrônicos.',
      'Terno corporativo reforçado em Kevlar preto fosco, óculos escuros com HUD holográfico e coldre tático oculto sob o paletó.',
      'Cromado pesado nos braços com juntas metálicas expostas, respirador artificial no pescoço e cicatrizes profundas de estilhaços.',
      'Bandana vermelha, colete blindado com insígnias da gangue, botinas de combate com biqueira de aço e cheiro forte de pólvora.',
      'Casaco longo camuflado, implante cibernético Kiroshi com lente vermelha pulsante e coldre de saque rápido na coxa direita.',
    ];
    const picked = archetypes[Math.floor(Math.random() * archetypes.length)];
    setTempAppearance(picked);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-[#0e0e12] border-l border-[#27272a] shadow-2xl flex flex-col transition-transform">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#27272a] bg-[#121217]">
        <div className="flex items-center gap-2 text-zinc-100 font-semibold">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          <span>Rastreador de Combate, Ataques & Ferimentos</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
          aria-label="Fechar gaveta"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Control Bar: Round, Next, Sort */}
      <div className="px-5 py-3 border-b border-[#27272a] bg-[#14141a] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-zinc-400 uppercase text-[11px]">Rodada</span>
          <span className="px-2 py-0.5 rounded bg-red-950/40 border border-red-800/50 text-red-300 font-mono font-bold">
            {roundNumber}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={prevTurn}
            disabled={combatants.length === 0}
            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300"
            title="Turno Anterior"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={nextTurn}
            disabled={combatants.length === 0}
            className="px-2.5 py-1.5 rounded bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-medium flex items-center gap-1"
            title="Próximo Turno"
          >
            <span>Próximo</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={sortInitiative}
            disabled={combatants.length === 0}
            className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 font-mono text-[11px]"
            title="Ordenar Iniciativa Decrescente"
          >
            Ordenar
          </button>
          {combatants.length > 0 && (
            <button
              onClick={clearCombat}
              className="p-1.5 rounded bg-zinc-800 hover:bg-red-950 hover:text-red-400 text-zinc-500 transition"
              title="Limpar Combate"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Combatants List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {combatants.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-[#27272a] rounded-lg space-y-3">
            <ShieldAlert className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400">
              Nenhum combatente na arena no momento.
            </p>
            <p className="text-[11px] text-zinc-500">
              Gere NPCs na aba <strong className="text-zinc-300">Pessoas & Facções</strong> e clique em <em>"Adicionar ao Combate"</em>, ou use o formulário rápido abaixo.
            </p>
          </div>
        ) : (
          combatants.map((c, idx) => {
            const isTurn = idx === activeTurnIndex;
            const hpRatio = c.maxHP > 0 ? c.currentHP / c.maxHP : 0;
            const isSeriouslyWounded = c.currentHP <= Math.ceil(c.maxHP / 2) && c.currentHP > 0;
            const isMortallyWounded = c.currentHP === 0;

            return (
              <div
                key={c.id}
                className={`p-3.5 rounded-xl border transition space-y-3 ${
                  isTurn
                    ? 'bg-[#181820] border-red-500 shadow-md ring-1 ring-red-500/30'
                    : 'bg-[#121217] border-[#27272a]'
                }`}
              >
                {/* Row 1: Turn indicator, Initiative, Name, Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isTurn && (
                      <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-red-400 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800/40">
                        <Play className="w-2.5 h-2.5 fill-red-400" /> Ativo
                      </span>
                    )}
                    <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-zinc-800 text-zinc-200 rounded border border-zinc-700">
                      Init: {c.initiative}
                    </span>
                    <span className="text-xs font-bold text-zinc-100 truncate max-w-[150px]">
                      {c.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Attack Roller Button */}
                    <button
                      onClick={() => {
                        setAttackingCombatant(c);
                        setSelectedWeaponIdx(0);
                        setAttackBonus(c.combatNumber || 14);
                        const otherCombatant = combatants.find(o => o.id !== c.id);
                        setAttackTargetId(otherCombatant ? otherCombatant.id : '');
                        setAttackResult(null);
                      }}
                      className="px-2 py-1 rounded bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-300 text-[10px] font-mono font-bold flex items-center gap-1 transition"
                      title="Disparar Ataque"
                    >
                      <Crosshair className="w-3 h-3" />
                      <span>Atacar</span>
                    </button>

                    {/* Appearance Button */}
                    <button
                      onClick={() => {
                        setEditingAppearanceCombatant(c);
                        setTempAppearance(c.appearance || '');
                      }}
                      className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-[10px] transition"
                      title="Visual Físico & Estilo"
                    >
                      <Eye className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => removeCombatant(c.id)}
                      className="p-1 text-zinc-500 hover:text-red-400 transition"
                      title="Remover"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Appearance preview if exists */}
                {c.appearance && (
                  <p className="text-[11px] text-zinc-400 italic bg-[#0a0a0d] p-2 rounded-lg border border-zinc-800 line-clamp-2">
                    "{c.appearance}"
                  </p>
                )}

                {/* HP Tracker Bar & Adjustment */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-500" /> HP:
                    </span>
                    <span className="font-mono font-bold text-zinc-200">
                      {c.currentHP} / {c.maxHP}
                    </span>
                  </div>

                  {/* HP bar */}
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
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

                  {/* HP quick delta buttons */}
                  <div className="flex items-center justify-between gap-1 pt-1">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateHP(c.id, -5)}
                        className="px-2 py-0.5 bg-red-950 hover:bg-red-900 border border-red-800/40 text-red-300 rounded text-[11px] font-mono font-bold"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => updateHP(c.id, -1)}
                        className="px-2 py-0.5 bg-red-950/60 hover:bg-red-900/60 border border-red-800/30 text-red-300 rounded text-[11px] font-mono"
                      >
                        -1
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateHP(c.id, 1)}
                        className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 rounded text-[11px] font-mono"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => updateHP(c.id, 5)}
                        className="px-2 py-0.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-800/40 text-emerald-300 rounded text-[11px] font-mono font-bold"
                      >
                        +5
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status alerts */}
                {isSeriouslyWounded && (
                  <div className="text-[11px] font-mono text-amber-400 bg-amber-950/30 border border-amber-800/40 px-2 py-1 rounded flex items-center justify-between">
                    <span>Gravemente Ferido (&le; 50% HP)</span>
                    <span className="font-bold">-2 em todas ações</span>
                  </div>
                )}
                {isMortallyWounded && (
                  <div className="text-[11px] font-mono text-red-400 bg-red-950/40 border border-red-700 px-2 py-1 rounded flex items-center justify-between">
                    <span className="flex items-center gap-1 font-bold">
                      <Skull className="w-3.5 h-3.5" /> MORTALMENTE FERIDO
                    </span>
                    <span>Salvaguarda Morte (Pen: +{c.deathSavePenalty})</span>
                  </div>
                )}

                {/* 1-Click Status Condition Toggles */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 font-semibold block">
                    Condições & Penalidades:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {CONDITIONS_LIST.map(cond => {
                      const isActive = c.conditions?.includes(cond.id);
                      return (
                        <button
                          key={cond.id}
                          onClick={() => toggleCondition(c.id, cond.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition border ${
                            isActive
                              ? 'bg-red-950 border-red-600 text-red-200 font-bold shadow-sm'
                              : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          }`}
                          title={cond.desc}
                        >
                          {cond.icon} {cond.id}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Armor & 1-Click Ablation */}
                <div className="p-2.5 rounded bg-[#0a0a0d] border border-[#27272a] space-y-2">
                  <div className="text-[10px] font-mono uppercase text-zinc-400 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-zinc-400" />
                    <span>Blindagem (SP) & Ablação (-1 ao penetrar)</span>
                  </div>

                  {c.system === 'RED' ? (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center justify-between bg-zinc-900 px-2 py-1.5 rounded border border-zinc-800">
                        <span className="text-zinc-400 text-[11px]">Cabeça SP: <strong className="text-zinc-100 font-mono">{c.headSP}</strong></span>
                        <button
                          onClick={() => ablateSP(c.id, 'head', -1)}
                          disabled={c.headSP <= 0}
                          className="px-1.5 py-0.5 rounded bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-[10px] font-mono disabled:opacity-40"
                          title="Ablação (-1 SP)"
                        >
                          -1 SP
                        </button>
                      </div>
                      <div className="flex items-center justify-between bg-zinc-900 px-2 py-1.5 rounded border border-zinc-800">
                        <span className="text-zinc-400 text-[11px]">Corpo SP: <strong className="text-zinc-100 font-mono">{c.bodySP}</strong></span>
                        <button
                          onClick={() => ablateSP(c.id, 'body', -1)}
                          disabled={c.bodySP <= 0}
                          className="px-1.5 py-0.5 rounded bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 text-[10px] font-mono disabled:opacity-40"
                          title="Ablação (-1 SP)"
                        >
                          -1 SP
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                      {[
                        { loc: 'head', label: 'Cabeça', val: c.headSP },
                        { loc: 'torso', label: 'Tronco', val: c.torsoSP ?? 14 },
                        { loc: 'rArm', label: 'Braço D', val: c.rArmSP ?? 12 },
                        { loc: 'lArm', label: 'Braço E', val: c.lArmSP ?? 12 },
                        { loc: 'rLeg', label: 'Perna D', val: c.rLegSP ?? 12 },
                        { loc: 'lLeg', label: 'Perna E', val: c.lLegSP ?? 12 },
                      ].map(part => (
                        <div key={part.loc} className="flex items-center justify-between bg-zinc-900 px-1.5 py-1 rounded border border-zinc-800 text-[10px]">
                          <span className="text-zinc-400">{part.label}: <strong className="text-zinc-100 font-mono">{part.val}</strong></span>
                          <button
                            onClick={() => ablateSP(c.id, part.loc as any, -1)}
                            disabled={part.val <= 0}
                            className="px-1 bg-red-950 hover:bg-red-900 text-red-300 rounded text-[9px] font-mono"
                          >
                            -1
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Equipped Weapons Direct Attack Buttons */}
                {c.weapons && c.weapons.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-zinc-800/60">
                    <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block">
                      Armas Equipadas (Clique para Disparar):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {c.weapons.map((w, wIdx) => (
                        <button
                          key={wIdx}
                          onClick={() => {
                            setAttackingCombatant(c);
                            setSelectedWeaponIdx(wIdx);
                            setAttackBonus(c.combatNumber || 14);
                            const other = combatants.find(o => o.id !== c.id);
                            setAttackTargetId(other ? other.id : '');
                            setAttackResult(null);
                          }}
                          className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-red-950 border border-zinc-800 hover:border-red-800 text-zinc-300 hover:text-red-300 font-mono text-[10px] flex items-center gap-1 transition shadow-sm"
                          title={`Disparar com ${w.name}`}
                        >
                          <Crosshair className="w-2.5 h-2.5 text-red-500" />
                          <span>{w.name}</span>
                          <span className="text-amber-400 font-bold">({w.damage})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Critical Injuries Section */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-zinc-400">Ferimentos Críticos Ativos ({c.criticalInjuries.length})</span>
                  </div>

                  {c.criticalInjuries.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {c.criticalInjuries.map((inj, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800/40 text-[10px] font-mono text-amber-300"
                        >
                          <span>{inj}</span>
                          <button
                            onClick={() => removeCriticalInjury(c.id, inj)}
                            className="hover:text-red-400 ml-0.5"
                            title="Remover / Curado"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 pt-1">
                    <select
                      value={selectedInjury}
                      onChange={e => setSelectedInjury(e.target.value)}
                      className="flex-1 bg-[#0a0a0d] border border-[#27272a] rounded px-2 py-1 text-[11px] text-zinc-300 focus:outline-none"
                    >
                      {CRITICAL_INJURIES_QUICK_LIST.map((inj, idx) => (
                        <option key={idx} value={inj}>{inj}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => addCriticalInjury(c.id, selectedInjury)}
                      className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded text-[11px] flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Adicionar
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Quick Add Form */}
        <form onSubmit={handleManualAdd} className="p-3.5 rounded-xl bg-[#14141a] border border-[#27272a] space-y-3">
          <span className="text-[11px] font-semibold uppercase text-zinc-400 block font-mono">
            Adicionar Combatente Rápido
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="col-span-3">
              <input
                type="text"
                placeholder="Nome / Tipo (ex: Guarda Arasaka, Solo Solo...)"
                value={newCombatantName}
                onChange={e => setNewCombatantName(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded px-2.5 py-1.5 text-zinc-200 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-400 mb-0.5">HP Max</label>
              <input
                type="number"
                value={newCombatantHP}
                onChange={e => setNewCombatantHP(parseInt(e.target.value) || 10)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded px-2 py-1 text-zinc-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-400 mb-0.5">SP Armadura</label>
              <input
                type="number"
                value={newCombatantSP}
                onChange={e => setNewCombatantSP(parseInt(e.target.value) || 0)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded px-2 py-1 text-zinc-200 font-mono"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white py-1.5 rounded text-xs font-semibold transition"
              >
                + Adicionar
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* MODAL: INTERACTIVE ATTACK ROLLER */}
      {attackingCombatant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-[#27272a] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">Rolar Ataque em Combate</h3>
                  <span className="text-[11px] text-zinc-400 font-mono">Atacante: {attackingCombatant.name}</span>
                </div>
              </div>
              <button onClick={() => setAttackingCombatant(null)} className="p-1 rounded text-zinc-400 hover:text-zinc-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Target Selector */}
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Combatente Alvo:</label>
                <select
                  value={attackTargetId}
                  onChange={e => setAttackTargetId(e.target.value)}
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 font-medium focus:outline-none"
                >
                  <option value="">Selecione um alvo na arena...</option>
                  {combatants.filter(c => c.id !== attackingCombatant.id).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} (HP: {c.currentHP}/{c.maxHP} | SP: {c.bodySP})
                    </option>
                  ))}
                </select>
              </div>

              {/* Weapon Selector */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-mono mb-1">Arma Empregada:</label>
                  <select
                    value={selectedWeaponIdx}
                    onChange={e => setSelectedWeaponIdx(parseInt(e.target.value))}
                    className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none"
                  >
                    {(attackingCombatant.weapons && attackingCombatant.weapons.length > 0
                      ? attackingCombatant.weapons
                      : PRESET_WEAPONS
                    ).map((w, i) => (
                      <option key={i} value={i}>
                        {w.name} ({w.damage})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-mono mb-1">Bônus de Ataque (REF + Perícia):</label>
                  <input
                    type="number"
                    value={attackBonus}
                    onChange={e => setAttackBonus(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Target Range & Defense Mode */}
              <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-400 font-mono text-[11px]">Tipo de Defesa:</label>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-zinc-300 font-mono">
                      <input
                        type="checkbox"
                        checked={isTargetEvading}
                        onChange={e => setIsTargetEvading(e.target.checked)}
                        className="rounded accent-red-600"
                      />
                      <span>Alvo Esquivando (REF &ge; 8)</span>
                    </label>
                  </div>
                </div>

                {!isTargetEvading ? (
                  <div>
                    <label className="block text-zinc-500 font-mono text-[10px] mb-1">DV pela Distância Oficial:</label>
                    <select
                      value={targetRangeDV}
                      onChange={e => setTargetRangeDV(parseInt(e.target.value))}
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
                      value={targetEvasionBonus}
                      onChange={e => setTargetEvasionBonus(parseInt(e.target.value) || 10)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded p-1.5 text-zinc-200 font-mono text-xs"
                    />
                  </div>
                )}

                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-amber-300 font-mono">
                    <input
                      type="checkbox"
                      checked={isAimedHeadShot}
                      onChange={e => setIsAimedHeadShot(e.target.checked)}
                      className="rounded accent-amber-500"
                    />
                    <span>Disparo Mirado na Cabeça (-8 no Ataque, Dano que passar é x2!)</span>
                  </label>
                </div>
              </div>

              {/* Execute Roll Button */}
              <button
                onClick={handleExecuteAttack}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-1.5"
              >
                <Dice5 className="w-4 h-4" />
                <span>Rolar Ataque e Aplicar Danos Automaticamente</span>
              </button>

              {/* Roll Result Box */}
              {attackResult && (
                <div className={`p-3.5 rounded-xl border space-y-1.5 font-mono text-xs ${
                  attackResult.hit ? 'bg-red-950/20 border-red-700/60' : 'bg-zinc-900/40 border-zinc-800'
                }`}>
                  <div className="flex items-center justify-between font-bold">
                    <span className={attackResult.hit ? 'text-emerald-400' : 'text-zinc-400'}>
                      {attackResult.hit ? '✓ TIRO ACERTOU O ALVO!' : '✗ TIRO ERROU!'}
                    </span>
                    <span className="text-zinc-400 text-[11px]">{attackResult.defenseText}</span>
                  </div>
                  <div className="text-[11px] text-zinc-300">{attackResult.attackRollText}</div>
                  <div className="text-[11px] text-amber-300">{attackResult.damageRollText}</div>

                  {attackResult.hit && (
                    <div className="pt-1 text-[11px] border-t border-zinc-800 text-zinc-200 flex flex-wrap gap-3">
                      <span>Dano aplicado ao HP: <strong className="text-red-400 font-bold">-{attackResult.hpDeducted} HP</strong></span>
                      {attackResult.spAblated && (
                        <span className="text-amber-400 font-bold">SP Ablatado (-1 SP na Armadura)</span>
                      )}
                    </div>
                  )}

                  {attackResult.critInjuryTriggered && (
                    <div className="p-2 rounded bg-red-950 border border-red-700 text-red-200 font-bold text-[11px] flex items-center gap-1.5 mt-1">
                      <Skull className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      <span>FERIMENTO CRÍTICO DETECTADO: {attackResult.critInjuryTriggered}!</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-[#27272a] flex justify-end">
              <button
                onClick={() => setAttackingCombatant(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VISUAL DESCRIPTION EDITOR */}
      {editingAppearanceCombatant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-[#27272a] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-zinc-100">Descrição Visual de {editingAppearanceCombatant.name}</h3>
              </div>
              <button onClick={() => setEditingAppearanceCombatant(null)} className="p-1 rounded text-zinc-400 hover:text-zinc-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-zinc-400 font-mono text-[11px]">Detalhes Físicos & Estética:</label>
                <button
                  type="button"
                  onClick={handleGenerateAppearanceText}
                  className="text-amber-400 hover:text-amber-300 font-mono text-[10px] flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> Gerar Visual Rápido
                </button>
              </div>
              <textarea
                rows={4}
                value={tempAppearance}
                onChange={e => setTempAppearance(e.target.value)}
                placeholder="Roupas, tatuagens, cromo visível, cicatrizes, armas na cintura..."
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-red-500 text-xs leading-relaxed"
              />
            </div>

            <div className="pt-2 border-t border-[#27272a] flex items-center justify-end gap-2">
              <button
                onClick={() => setEditingAppearanceCombatant(null)}
                className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  updateCombatant(editingAppearanceCombatant.id, { appearance: tempAppearance.trim() });
                  setEditingAppearanceCombatant(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
              >
                Salvar Visual
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
