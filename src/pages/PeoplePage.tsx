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
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { useCampaign } from '../context/CampaignContext';
import { useCombat } from '../context/CombatContext';
import { GANGS_LIST } from '../data/gangsData';
import { FACTIONS_LIST } from '../data/factionsData';
import { NPCSheet, NPCTier } from '../types/system';

const FIRST_NAMES = ['Kael', 'Jax', 'Raven', 'Vektor', 'Rocco', 'Slick', 'Nyx', 'Brick', 'T-Bug', 'Zero', 'Crash', 'Elena', 'Malik', 'Hana', 'Dante', 'Blaze', 'Cipher', 'Viper', 'Spike', 'Ghost'];
const LAST_NAMES = ['Vance', 'Kowalski', 'Silver', 'Cross', 'Tanaka', 'Mendez', 'Steel', 'Frost', 'Mercer', 'Chen', 'Black', 'Reyes', 'Novak', 'Winter', 'Kane', 'Wolf', 'Stone', 'Sato'];

export const PeoplePage: React.FC = () => {
  const { system, isRed } = useSystem();
  const { savedNPCs, saveNPC, deleteNPC } = useCampaign();
  const { addCombatant, combatants, updateHP, ablateSP, addCriticalInjury } = useCombat();

  const [activeTab, setActiveTab] = useState<'generator' | 'builder' | 'library'>('generator');
  const [selectedTier, setSelectedTier] = useState<NPCTier>('mook');
  const [selectedCategory, setSelectedCategory] = useState<'gangs' | 'trauma' | 'corps' | 'police' | 'nomads'>('gangs');
  const [selectedSubfaction, setSelectedSubfaction] = useState<string>('maelstrom');
  const [generatedNPC, setGeneratedNPC] = useState<NPCSheet | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<boolean>(false);

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
  const [manualName, setManualName] = useState<string>('');
  const [manualFaction, setManualFaction] = useState<string>('Mercenário Independente');
  const [manualRole, setManualRole] = useState<string>('Solo');
  const [manualTier, setManualTier] = useState<NPCTier>('mook');
  const [manualHP, setManualHP] = useState<number>(35);
  const [manualSPHead, setManualSPHead] = useState<number>(11);
  const [manualSPBody, setManualSPBody] = useState<number>(11);
  const [manualCombatNumber, setManualCombatNumber] = useState<number>(12);
  const [manualWeapons, setManualWeapons] = useState<string>('Pistola Pesada 3d6 (ROF 2), Faca de Combate 2d6');
  const [manualCyberware, setManualCyberware] = useState<string>('Ciberolho com Visão Noturna, Interface Neural');
  const [manualTactics, setManualTactics] = useState<string>('Mantém cobertura média e atira com precisão.');

  // Generate NPC logic
  const handleGenerate = () => {
    const randomFirst = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const randomLast = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const fullName = `${randomFirst} "${randomFirst.slice(0, 3).toUpperCase()}" ${randomLast}`;

    if (selectedCategory === 'gangs') {
      const gang = GANGS_LIST.find(g => g.id === selectedSubfaction) || GANGS_LIST[0];
      const tierStats = gang.statsTemplate.RED;
      const cp2020Template = gang.statsTemplate.CP2020;

      // RED Calculations
      const hp = tierStats.hp[selectedTier];
      const cn = tierStats.combatNumber[selectedTier];
      const bodyStat = selectedTier === 'boss' ? 10 : selectedTier === 'miniboss' ? 8 : 7;
      const willStat = selectedTier === 'boss' ? 9 : selectedTier === 'miniboss' ? 8 : 6;
      const refStat = selectedTier === 'boss' ? 9 : selectedTier === 'miniboss' ? 8 : 7;
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
        reputation: selectedTier === 'boss' ? 7 : selectedTier === 'miniboss' ? 5 : selectedTier === 'lieutenant' ? 3 : 1,
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
          headSP: tierStats.spHead,
          bodySP: tierStats.spBody,
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

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header and Sub-tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-red-500" />
            <span>Pessoas & Facções (Inimigos & NPCs)</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Gere, personalize e organize combatentes e contatos para sessões em Cyberpunk RED ou 2020.
          </p>
        </div>

        {/* Sub-tabs pills */}
        <div className="flex items-center bg-[#14141a] border border-[#27272a] rounded-lg p-0.5 text-xs font-medium">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === 'generator'
                ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Gerador Automático
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

      {/* TAB 1: AUTOMATIC GENERATOR */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Tier Selection */}
            <div className="p-4 rounded-xl bg-[#121217] border border-[#27272a] space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block font-mono">
                1. Escalão de Ameaça (Tier)
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'mook', label: 'Capanga / Mook', sub: 'Combate Comum' },
                  { id: 'lieutenant', label: 'Tenente / LT', sub: 'Especialista Tático' },
                  { id: 'miniboss', label: 'Mini-Chefe', sub: 'Blindado / Perigoso' },
                  { id: 'boss', label: 'Chefe / Ciberpsico', sub: 'Ameaça Mortal' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTier(t.id as NPCTier)}
                    className={`p-2.5 rounded-lg border text-left transition ${
                      selectedTier === t.id
                        ? 'bg-red-950/40 border-red-600/60 text-zinc-100 shadow-sm'
                        : 'bg-[#0a0a0d] border-[#27272a] text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="font-semibold">{t.label}</div>
                    <div className="text-[10px] text-zinc-500">{t.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Faction Category Selection */}
            <div className="p-4 rounded-xl bg-[#121217] border border-[#27272a] space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 block font-mono">
                2. Categoria da Facção
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { id: 'gangs', label: 'Gangues de Rua' },
                  { id: 'trauma', label: 'Trauma Team™' },
                  { id: 'corps', label: 'Corporações' },
                  { id: 'police', label: 'Polícia / MaxTac' },
                  { id: 'nomads', label: 'Nômades & Civis' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id as any);
                      if (cat.id === 'corps') setSelectedSubfaction('arasaka');
                    }}
                    className={`p-2 rounded-lg border text-center transition ${
                      selectedCategory === cat.id
                        ? 'bg-zinc-800 border-zinc-500 text-zinc-100 font-medium'
                        : 'bg-[#0a0a0d] border-[#27272a] text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Subfaction selection if Gangs or Corps */}
              {selectedCategory === 'gangs' && (
                <div className="pt-2">
                  <label className="block text-[11px] text-zinc-400 mb-1.5 font-mono">
                    Escolha a Gangue Específica:
                  </label>
                  <select
                    value={selectedSubfaction}
                    onChange={e => setSelectedSubfaction(e.target.value)}
                    className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
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
                    className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-red-500"
                  >
                    <option value="arasaka">Arasaka Corporation (Segurança & Ninjas)</option>
                    <option value="militech">Militech Arms (Infantaria & Blindados)</option>
                    <option value="biotechnica">Biotechnica (Genética & Contenção)</option>
                    <option value="kang-tao">Kang Tao (Smartguns & Alta Tecnologia)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-semibold text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Gerar Ficha Completa ({system})</span>
            </button>
          </div>

          {/* Sheet Preview Column (7 cols) */}
          <div className="lg:col-span-7">
            {generatedNPC ? (
              <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-5 shadow-lg">
                {/* Top Sheet Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#27272a] gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-800/40">
                        {generatedNPC.tier.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        Sistema: {generatedNPC.system}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-zinc-100 mt-1">
                      {generatedNPC.name}
                    </h2>
                    <p className="text-xs text-zinc-400">{generatedNPC.role} • Reputação {generatedNPC.reputation}</p>
                  </div>

                  {/* Actions: Save, Send to Combat, Copy */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSendToCombat(generatedNPC)}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-medium flex items-center gap-1.5 transition"
                      title="Enviar Combatente para o Rastreador Lateral"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                      <span>{sendSuccess ? 'Enviado!' : 'Combate'}</span>
                    </button>
                    <button
                      onClick={() => saveNPC(generatedNPC)}
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

                {/* Vital Statistics Display */}
                {isRed ? (
                  // CYBERPUNK RED STATBLOCK
                  <div className="space-y-4">
                    {/* Key Combat Numbers */}
                    <div className="grid grid-cols-4 gap-2 text-center font-mono">
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
                  // CYBERPUNK 2020 STATBLOCK
                  <div className="space-y-4">
                    {/* BTM & 6 Parts */}
                    <div className="grid grid-cols-3 gap-2 text-center font-mono">
                      <div className="p-2 rounded bg-[#0a0a0d] border border-[#27272a]">
                        <span className="text-[10px] text-zinc-500 block">BTM (Mod. Tipo Corp.)</span>
                        <span className="text-base font-bold text-amber-400">{generatedNPC.stats2020?.BTM}</span>
                      </div>
                      <div className="p-2 rounded bg-[#0a0a0d] border border-[#27272a]">
                        <span className="text-[10px] text-zinc-500 block">SP Cabeça (Loc 1)</span>
                        <span className="text-base font-bold text-zinc-200">{generatedNPC.stats2020?.headSP}</span>
                      </div>
                      <div className="p-2 rounded bg-[#0a0a0d] border border-[#27272a]">
                        <span className="text-[10px] text-zinc-500 block">SP Tronco (Loc 2-4)</span>
                        <span className="text-base font-bold text-zinc-200">{generatedNPC.stats2020?.torsoSP}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-[#0a0a0d] border border-[#27272a] text-center font-mono">
                      <span className="text-[10px] text-zinc-500 block mb-1">SP Membros (Braços e Pernas)</span>
                      <div className="grid grid-cols-4 gap-1 text-xs">
                        <div className="bg-zinc-900 p-1 rounded">Braço D: {generatedNPC.stats2020?.rArmSP}</div>
                        <div className="bg-zinc-900 p-1 rounded">Braço E: {generatedNPC.stats2020?.lArmSP}</div>
                        <div className="bg-zinc-900 p-1 rounded">Perna D: {generatedNPC.stats2020?.rLegSP}</div>
                        <div className="bg-zinc-900 p-1 rounded">Perna E: {generatedNPC.stats2020?.lLegSP}</div>
                      </div>
                    </div>

                    {/* 2020 Stats */}
                    <div className="grid grid-cols-9 gap-1 text-center font-mono text-xs">
                      {['INT', 'REF', 'TEC', 'COOL', 'ATR', 'LUCK', 'MA', 'BODY', 'EMP'].map(stat => (
                        <div key={stat} className="bg-zinc-900 p-1 rounded border border-zinc-800">
                          <span className="text-[9px] text-zinc-500 block">{stat}</span>
                          <span className="font-bold text-zinc-200">
                            {(generatedNPC.stats2020 as any)?.[stat] ?? 7}
                          </span>
                        </div>
                      ))}
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
                        <li key={idx} className="flex justify-between items-center bg-zinc-900/80 px-2.5 py-1.5 rounded border border-zinc-800">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-200 font-medium">{w.name}</span>
                            <span className="font-mono text-amber-400 font-bold text-[11px]">({w.damage})</span>
                          </div>
                          <button
                            onClick={() => handleOpenNpcAttack(generatedNPC, w)}
                            className="flex items-center gap-1 px-2 py-1 rounded bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-mono text-[10px] font-bold transition shadow-sm"
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
                        <li key={idx} className="bg-zinc-900/60 px-2 py-1 rounded">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tactics & Lore notes */}
                <div className="p-3.5 rounded-lg bg-[#0a0a0d] border border-[#27272a] space-y-1.5 text-xs">
                  <span className="text-[11px] font-mono uppercase text-zinc-400 font-semibold block">
                    Diretrizes Táticas de Combate
                  </span>
                  <p className="text-zinc-300 leading-relaxed">
                    {generatedNPC.tactics}
                  </p>
                  {generatedNPC.notes && (
                    <div className="pt-2 text-[11px] text-zinc-500 font-mono whitespace-pre-line border-t border-zinc-800 mt-2">
                      {generatedNPC.notes}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-[#121217] border border-dashed border-[#27272a] text-center space-y-3">
                <Users className="w-10 h-10 text-zinc-600 mx-auto" />
                <h3 className="text-sm font-semibold text-zinc-300">Nenhum combatente gerado ainda</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Selecione o escalão de ameaça e a facção ao lado e clique em "Gerar Ficha Completa".
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MANUAL BUILDER */}
      {activeTab === 'builder' && (
        <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] max-w-3xl mx-auto space-y-6">
          <div className="border-b border-[#27272a] pb-3">
            <h2 className="text-base font-bold text-zinc-100">Construtor Manual de Ficha</h2>
            <p className="text-xs text-zinc-400">Crie ou customize um NPC com atributos e equipamentos livres.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Nome do Personagem</label>
              <input
                type="text"
                placeholder="Ex: Marcus 'Ghost' Santos"
                value={manualName}
                onChange={e => setManualName(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-red-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Facção / Afiliação</label>
              <input
                type="text"
                placeholder="Ex: Aldecaldos / Militech / Independente"
                value={manualFaction}
                onChange={e => setManualFaction(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Papel (Role)</label>
              <input
                type="text"
                placeholder="Ex: Solo / Netrunner / Fixer"
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
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 focus:outline-none focus:border-red-500"
              >
                <option value="mook">Capanga (Mook)</option>
                <option value="lieutenant">Tenente (Lieutenant)</option>
                <option value="miniboss">Mini-Chefe</option>
                <option value="boss">Chefe / Ciberpsicopata</option>
              </select>
            </div>
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

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1">Armas (separadas por vírgula)</label>
              <input
                type="text"
                value={manualWeapons}
                onChange={e => setManualWeapons(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Ciberware & Implantes (separados por vírgula)</label>
              <input
                type="text"
                value={manualCyberware}
                onChange={e => setManualCyberware(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Táticas & Comportamento</label>
              <textarea
                rows={2}
                value={manualTactics}
                onChange={e => setManualTactics(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2.5 text-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (!manualName.trim()) return;
              const npc: NPCSheet = {
                id: 'manual-' + Date.now(),
                name: manualName.trim(),
                faction: manualFaction.trim(),
                tier: manualTier,
                system,
                role: manualRole,
                description: 'NPC criado manualmente no formulário.',
                tactics: manualTactics,
                reputation: 2,
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
                cyberware: manualCyberware.split(',').map(c => c.trim()),
                gear: ['Agente pessoal', '50eb'],
              };
              saveNPC(npc);
              setManualName('');
              setActiveTab('library');
            }}
            className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-xs transition"
          >
            Salvar NPC na Biblioteca da Campanha
          </button>
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

                    <h3 className="text-sm font-bold text-zinc-100">{npc.name}</h3>
                    <div className="text-xs text-zinc-400">{npc.faction} • {npc.role}</div>

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
                    <button
                      onClick={() => handleSendToCombat(npc)}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium flex items-center gap-1.5"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                      <span>Para Combate</span>
                    </button>
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

      {/* MODAL: INTERACTIVE NPC WEAPON ATTACK ROLLER */}
      {npcAttackModal?.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-[#27272a] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-xs">
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
