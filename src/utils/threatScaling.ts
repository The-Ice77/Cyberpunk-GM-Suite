import { NPCSheet, WeaponItem } from '../types/system';

/**
 * Calibragem de Poder: permite escalar qualquer NPC/Inimigo/Tropa gerado
 * desde adversários quase inofensivos (-5) até ameaças lendárias (+5).
 */

export type ArmorBias = 'light' | 'standard' | 'heavy' | 'hardened';
export type WeaponBias = 'scrap' | 'standard' | 'military' | 'prototype';
export type CyberLevel = 'none' | 'standard' | 'heavy' | 'psycho';
export type ThreatTrait =
  | 'ap_ammo'
  | 'combat_drugs'
  | 'never_surrender'
  | 'wounded'
  | 'ambush_ready'
  | 'body_armor_plus'
  | 'veteran_tactics'
  | 'smart_weapons';

export interface ThreatCalibration {
  /** -5 (inofensivo) a +5 (lendário). 0 = valores padrão do gerador. */
  powerOffset: number;
  armorBias: ArmorBias;
  weaponBias: WeaponBias;
  cyberLevel: CyberLevel;
  traits: ThreatTrait[];
  /** Variação individual aleatória (apenas tropas): 0 a 3 níveis para cima/baixo. */
  spread: number;
}

export const DEFAULT_CALIBRATION: ThreatCalibration = {
  powerOffset: 0,
  armorBias: 'standard',
  weaponBias: 'standard',
  cyberLevel: 'standard',
  traits: [],
  spread: 0,
};

export const POWER_LEVEL_LABELS: Record<number, { label: string; desc: string; color: string }> = {
  [-5]: { label: 'Inofensivo', desc: 'Civil armado, desesperado ou drogado. Foge no primeiro tiro.', color: 'text-emerald-300' },
  [-4]: { label: 'Novato', desc: 'Primeira briga de rua. Mais barulho que perigo.', color: 'text-emerald-400' },
  [-3]: { label: 'Fraco', desc: 'Gangster de esquina com pistola barata.', color: 'text-lime-400' },
  [-2]: { label: 'Abaixo da Média', desc: 'Pouco treino, equipamento de segunda mão.', color: 'text-lime-300' },
  [-1]: { label: 'Cru', desc: 'Um pouco abaixo do padrão de combate de rua.', color: 'text-yellow-300' },
  [0]: { label: 'Padrão', desc: 'Valores oficiais do Corebook / Danger Gal Dossier.', color: 'text-zinc-200' },
  [1]: { label: 'Veterano', desc: 'Sobreviveu a muitos tiroteios. Mira firme.', color: 'text-amber-300' },
  [2]: { label: 'Elite', desc: 'Treinamento corporativo ou militar de alto nível.', color: 'text-orange-400' },
  [3]: { label: 'Letal', desc: 'Mata edgerunners novatos sem esforço.', color: 'text-red-400' },
  [4]: { label: 'Monstruoso', desc: 'Ciberpsicopata ou supersoldado experimental.', color: 'text-fuchsia-400' },
  [5]: { label: 'Lendário', desc: 'Lenda de Night City. Só mesmo uma equipe completa derruba.', color: 'text-purple-400' },
};

export const ARMOR_BIAS_OPTIONS: { id: ArmorBias; label: string; delta: number }[] = [
  { id: 'light', label: 'Leve / Sem colete', delta: -3 },
  { id: 'standard', label: 'Padrão', delta: 0 },
  { id: 'heavy', label: 'Pesada', delta: 3 },
  { id: 'hardened', label: 'Blindagem Militar', delta: 6 },
];

export const WEAPON_BIAS_OPTIONS: { id: WeaponBias; label: string; dice: number }[] = [
  { id: 'scrap', label: 'Sucata / Improvisada', dice: -1 },
  { id: 'standard', label: 'Padrão', dice: 0 },
  { id: 'military', label: 'Grau Militar', dice: 1 },
  { id: 'prototype', label: 'Protótipo Experimental', dice: 2 },
];

export const CYBER_LEVEL_OPTIONS: { id: CyberLevel; label: string }[] = [
  { id: 'none', label: 'Orgânico' },
  { id: 'standard', label: 'Padrão' },
  { id: 'heavy', label: 'Pesado' },
  { id: 'psycho', label: 'Beira da Ciberpsicose' },
];

export const TRAIT_OPTIONS: { id: ThreatTrait; label: string; desc: string }[] = [
  { id: 'ap_ammo', label: 'Munição Perfurante (AP)', desc: 'Armas ablatam 2 SP do alvo em vez de 1.' },
  { id: 'combat_drugs', label: 'Coquetel de Combate', desc: 'Black Lace / Speedheal: ignora penalidade de Ferimento Grave por 1 turno.' },
  { id: 'smart_weapons', label: 'Armas Inteligentes', desc: 'Smartgun Link: +1 para atingir com armas compatíveis.' },
  { id: 'body_armor_plus', label: 'Escudo Balístico', desc: 'Cobertura móvel: +2 SP corpo e 10 HP extra de escudo.' },
  { id: 'ambush_ready', label: 'Emboscada Preparada', desc: 'Age primeiro no 1º turno (+3 iniciativa) se não for detectado.' },
  { id: 'veteran_tactics', label: 'Táticas de Veterano', desc: 'Flanqueia, usa cobertura e foco de fogo. +1 Combate.' },
  { id: 'never_surrender', label: 'Fanático (Nunca se Rende)', desc: 'Luta até a morte. Ignora gatilhos de rendição.' },
  { id: 'wounded', label: 'Já Ferido', desc: 'Começa com ~30% menos HP. Mais desesperado.' },
];

const CYBER_POOLS: Record<Exclude<CyberLevel, 'none'>, string[]> = {
  standard: ['Interface Neural', 'Ciberolho com Mira Térmica', 'Subdermal Pocket'],
  heavy: [
    'Processador Kerenzikov (+2 Iniciativa)',
    'Smartgun Link',
    'Armadura Subdérmica (SP extra)',
    'Editor de Dor (Pain Editor)',
    'Ciberbraço Reforçado (Gorilla Arms)',
    'Mantis Blades (2d6 / 3d6 em Ferimento)',
  ],
  psycho: [
    'Sandevistan (Iniciativa extra e +2 REF por 1 min)',
    'Mantis Blades (3d6 cada)',
    'Gorilla Arms (+BODY; 3d6 dano de punho)',
    'Skinweave Subdérmico (SP 11 todo o corpo)',
    'Ciberlegs com Impulsor (Saltos +50%)',
    'Editor de Dor + Injetor de Combate',
    'Processador Neural Danificado (CIBERPSICOSE: vê alvos como ameaça)',
  ],
};

const DICE_RE = /(\d+)\s*d\s*(\d+)/i;

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function shiftDice(text: string, delta: number): string {
  if (!delta) return text;
  return text.replace(DICE_RE, (_m, n: string, sides: string) => {
    const count = clamp(parseInt(n, 10) + delta, 1, 12);
    return `${count}d${sides}`;
  });
}

function pick<T>(arr: T[], count: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  while (out.length < count && pool.length) {
    out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return out;
}

export function getPowerLabel(offset: number) {
  return POWER_LEVEL_LABELS[clamp(Math.round(offset), -5, 5)];
}

/** Resumo legível dos efeitos esperados da calibração. */
export function describeCalibration(cal: ThreatCalibration): string[] {
  const o = cal.powerOffset;
  const hpMul = o >= 0 ? 1 + 0.3 * o : 1 + 0.14 * o;
  const armor = ARMOR_BIAS_OPTIONS.find(a => a.id === cal.armorBias)?.delta || 0;
  const wBias = WEAPON_BIAS_OPTIONS.find(w => w.id === cal.weaponBias)?.dice || 0;
  const sp = Math.round(o * 1.2) + armor;
  const dice = Math.trunc(o / 2) + wBias;
  const stat = Math.round(o * 0.6);
  const sign = (n: number) => (n > 0 ? `+${n}` : `${n}`);
  return [
    `HP ×${hpMul.toFixed(2)}`,
    `SP ${sign(sp)}`,
    `Combate ${sign(Math.round(o * 1.2) + (cal.traits.includes('veteran_tactics') ? 1 : 0))}`,
    `Atributos ${sign(stat)}`,
    `Dano ${sign(dice)} dados`,
  ];
}

export function isDefaultCalibration(cal: ThreatCalibration): boolean {
  return (
    cal.powerOffset === 0 &&
    cal.armorBias === 'standard' &&
    cal.weaponBias === 'standard' &&
    cal.cyberLevel === 'standard' &&
    cal.traits.length === 0 &&
    cal.spread === 0
  );
}

/**
 * Aplica a calibração a uma ficha de NPC e devolve uma nova ficha (não muta a original).
 * `offsetOverride` permite à tropa dar um nível individual a cada membro.
 */
export function applyThreatCalibration(
  npc: NPCSheet,
  cal: ThreatCalibration,
  offsetOverride?: number
): NPCSheet {
  const o = clamp(offsetOverride ?? cal.powerOffset, -8, 8);
  if (isDefaultCalibration(cal) && offsetOverride === undefined) return npc;

  const armorDelta = ARMOR_BIAS_OPTIONS.find(a => a.id === cal.armorBias)?.delta || 0;
  const weaponBiasDice = WEAPON_BIAS_OPTIONS.find(w => w.id === cal.weaponBias)?.dice || 0;
  const has = (t: ThreatTrait) => cal.traits.includes(t);

  const spDelta = Math.round(o * 1.2) + armorDelta;
  const statDelta = Math.round(o * 0.6);
  const cnDelta = Math.round(o * 1.2) + (has('veteran_tactics') ? 1 : 0) + (has('smart_weapons') ? 1 : 0);
  const diceDelta = Math.trunc(o / 2) + weaponBiasDice;
  let hpMul = o >= 0 ? 1 + 0.3 * o : 1 + 0.14 * o;
  if (has('wounded')) hpMul *= 0.7;

  const next: NPCSheet = JSON.parse(JSON.stringify(npc));
  const label = getPowerLabel(o).label;

  if (next.statsRED) {
    const s = next.statsRED;
    const hp = Math.max(8, Math.round(s.HP * hpMul) + (has('body_armor_plus') ? 10 : 0));
    s.REF = clamp(s.REF + statDelta, 2, 13);
    s.DEX = clamp(s.DEX + statDelta, 2, 13);
    s.BODY = clamp(s.BODY + statDelta, 2, 13);
    s.WILL = clamp(s.WILL + statDelta, 2, 13);
    s.HP = hp;
    s.seriouslyWounded = Math.ceil(hp / 2);
    s.deathSave = s.BODY;
    s.combatNumber = clamp((s.combatNumber ?? 10) + cnDelta, 4, 26);
    s.headSP = clamp(s.headSP + spDelta, 0, 22);
    s.bodySP = clamp(s.bodySP + spDelta + (has('body_armor_plus') ? 2 : 0), 0, 22);
  }

  if (next.stats2020) {
    const s = next.stats2020;
    s.REF = clamp(s.REF + statDelta, 2, 13);
    s.BODY = clamp(s.BODY + statDelta, 2, 13);
    s.COOL = clamp(s.COOL + statDelta, 2, 13);
    s.BTM = clamp(s.BTM - Math.trunc(o / 3), 0, 6);
    (['headSP', 'torsoSP', 'rArmSP', 'lArmSP', 'rLegSP', 'lLegSP'] as const).forEach(k => {
      s[k] = clamp(s[k] + spDelta, 0, 40);
    });
  }

  if (next.skills) {
    Object.keys(next.skills).forEach(k => {
      next.skills[k] = clamp(next.skills[k] + cnDelta, 2, 28);
    });
  }

  next.weapons = (next.weapons || []).map((w: WeaponItem) => {
    const hasDice = DICE_RE.test(w.damage || '');
    const shiftedName = hasDice && DICE_RE.test(w.name) ? shiftDice(w.name, diceDelta) : w.name;
    const noteBits: string[] = [];
    if (w.notes) noteBits.push(w.notes);
    if (has('ap_ammo') && hasDice) noteBits.push('Munição AP: ablata 2 SP');
    if (has('smart_weapons') && hasDice) noteBits.push('Smartlink (+1 ataque)');
    if (weaponBiasDice !== 0 && hasDice) {
      noteBits.push(
        cal.weaponBias === 'scrap' ? 'Arma de baixa qualidade' : cal.weaponBias === 'military' ? 'Grau militar' : 'Protótipo experimental'
      );
    }
    return {
      ...w,
      name: shiftedName,
      damage: hasDice ? shiftDice(w.damage, diceDelta) : w.damage,
      notes: noteBits.length ? Array.from(new Set(noteBits)).join(' · ') : w.notes,
    };
  });

  // Cyberware
  if (cal.cyberLevel === 'none') {
    next.cyberware = [];
  } else if (cal.cyberLevel === 'heavy') {
    next.cyberware = Array.from(new Set([...(next.cyberware || []), ...pick(CYBER_POOLS.heavy, 3)]));
  } else if (cal.cyberLevel === 'psycho') {
    next.cyberware = Array.from(new Set([...(next.cyberware || []), ...pick(CYBER_POOLS.psycho, 4), CYBER_POOLS.psycho[6]]));
  } else if (o >= 3) {
    next.cyberware = Array.from(new Set([...(next.cyberware || []), ...pick(CYBER_POOLS.heavy, 1)]));
  }

  // Gear
  const gear = [...(next.gear || [])];
  if (has('ap_ammo')) gear.push('Munição Perfurante (AP) — 3 carregadores');
  if (has('combat_drugs')) gear.push('Coquetel de Combate (Black Lace + Speedheal)');
  if (has('body_armor_plus')) gear.push('Escudo Balístico Móvel');
  if (has('smart_weapons')) gear.push('Smartlink + Óculos de Mira');
  next.gear = Array.from(new Set(gear));

  // Táticas e rendição
  const tacticBits: string[] = [];
  if (next.tactics) tacticBits.push(next.tactics);
  if (has('ambush_ready')) tacticBits.push('Emboscada: +3 iniciativa no 1º turno se não detectado.');
  if (has('veteran_tactics')) tacticBits.push('Veterano: flanqueia, usa cobertura e foca o alvo mais perigoso.');
  if (has('combat_drugs')) tacticBits.push('Coquetel de Combate: ignora penalidade de Ferimento Grave por 1 turno.');
  if (cal.cyberLevel === 'psycho') tacticBits.push('Ciberpsicose: ataca o alvo mais próximo, ignora rendição e não recua.');
  if (tacticBits.length) next.tactics = tacticBits.join(' ');

  if (has('never_surrender') || cal.cyberLevel === 'psycho') {
    next.surrenderTrigger = 'Nunca se rende — luta até a morte.';
  } else if (o <= -3) {
    next.surrenderTrigger = 'Foge ou se rende ao primeiro ferimento ou à queda de qualquer aliado.';
  } else if (o >= 4 && !next.surrenderTrigger) {
    next.surrenderTrigger = 'Só recua com uma rota de fuga calculada; dificilmente se rende.';
  }

  // Identificação
  if (o !== 0) {
    next.role = `${next.role} · ${label}`;
    next.notes = `${next.notes ? next.notes + '\n' : ''}⚡ Calibração de Poder: ${label} (${o > 0 ? '+' : ''}${o}).`;
    if (next.reputation !== undefined) next.reputation = clamp(next.reputation + Math.trunc(o / 2), 0, 10);
  }

  // Tier sugerido para a calibração extrema
  if (o >= 4 && (next.tier === 'mook' || next.tier === 'lieutenant')) next.tier = 'miniboss';
  if (o >= 5 && next.tier === 'miniboss') next.tier = 'boss';
  if (o <= -3 && (next.tier === 'miniboss' || next.tier === 'boss')) next.tier = 'lieutenant';
  if (o <= -4 && next.tier === 'lieutenant') next.tier = 'mook';

  return next;
}
