import {
  WEAPONS_DATABASE,
  CYBERWARE_DATABASE,
  ARMOR_DATABASE,
  ATTACHMENTS_DATABASE,
  AMMUNITION_DATABASE,
  STREET_GEAR_DATABASE,
  STREET_DRUGS_DATABASE,
} from '../data/arsenalData';
import { NPCSheet, WeaponItem } from '../types/system';

/**
 * Catálogo central do Códice.
 * Todas as partes do jogo que precisam "puxar" ou "sortear" itens (inimigos, NPCs, tropas,
 * civis, bolsos, mercados, recompensas) devem usar este serviço em vez de strings soltas.
 * Inclui o conteúdo oficial (arsenalData) + o Homebrew persistido (IndexedDB espelhado no localStorage).
 */

export type CodexKind = 'weapon' | 'cyberware' | 'armor' | 'gear' | 'ammo' | 'attachment' | 'drug';

export interface CodexEntry {
  kind: CodexKind;
  name: string;
  category: string;
  costEb: number;
  costLabel: string;
  description: string;
  homebrew?: boolean;
  raw: any;
}

export const parseCostEb = (c?: string | number): number => {
  if (typeof c === 'number') return c;
  if (!c) return 0;
  const m = String(c).replace(/\./g, '').match(/(\d+)/);
  return m ? parseInt(m[1], 10) : 0;
};

let cache: CodexEntry[] | null = null;
let lastSignature = '';
let homebrewMemory: any = null; // atualizado por refreshCodexCatalog (IndexedDB)

const readHomebrew = (): any => {
  if (homebrewMemory) return homebrewMemory;
  try {
    const raw = localStorage.getItem('cyberpunk_homebrew_library');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

function buildCatalog(): CodexEntry[] {
  const list: CodexEntry[] = [];
  WEAPONS_DATABASE.forEach(w =>
    list.push({ kind: 'weapon', name: w.name, category: w.category, costEb: parseCostEb(w.cost), costLabel: w.cost || '', description: w.notes || '', raw: w })
  );
  CYBERWARE_DATABASE.forEach(c =>
    list.push({ kind: 'cyberware', name: c.name, category: c.type, costEb: parseCostEb(c.cost), costLabel: c.cost, description: c.description, raw: c })
  );
  ARMOR_DATABASE.forEach(a =>
    list.push({ kind: 'armor', name: a.name, category: a.covers, costEb: parseCostEb(a.cost), costLabel: a.cost, description: a.description, raw: a })
  );
  ATTACHMENTS_DATABASE.forEach(a =>
    list.push({ kind: 'attachment', name: a.name, category: a.compatibleCategory, costEb: parseCostEb(a.cost), costLabel: a.cost, description: a.effect, raw: a })
  );
  AMMUNITION_DATABASE.forEach(a =>
    list.push({ kind: 'ammo', name: a.name, category: a.type, costEb: parseCostEb(a.costPer10), costLabel: a.costPer10, description: a.effect, raw: a })
  );
  STREET_GEAR_DATABASE.forEach(g =>
    list.push({ kind: 'gear', name: g.name, category: g.category, costEb: parseCostEb(g.cost), costLabel: g.cost, description: g.description, raw: g })
  );
  STREET_DRUGS_DATABASE.forEach(d =>
    list.push({ kind: 'drug', name: d.name, category: 'Droga', costEb: parseCostEb(d.costPerDose), costLabel: d.costPerDose, description: d.primaryEffect, raw: d })
  );

  const hb = readHomebrew();
  (hb.weapons || []).forEach((w: any) =>
    list.push({
      kind: 'weapon',
      name: w.name,
      category: w.category || 'Homebrew',
      costEb: parseCostEb(w.cost),
      costLabel: `${w.cost || 100} eb`,
      description: w.description || 'Arma homebrew.',
      homebrew: true,
      raw: { system: 'BOTH', rof: 1, ...w, notes: w.description || w.notes },
    })
  );
  (hb.cyberware || []).forEach((c: any) =>
    list.push({
      kind: 'cyberware',
      name: c.name,
      category: c.type || 'Homebrew',
      costEb: parseCostEb(c.cost),
      costLabel: `${c.cost || 500} eb`,
      description: c.description || 'Ciberware homebrew.',
      homebrew: true,
      raw: c,
    })
  );
  return list;
}

export function getCodexCatalog(): CodexEntry[] {
  let sig = '';
  try {
    sig = localStorage.getItem('cyberpunk_homebrew_library') || '';
  } catch {}
  if (!cache || sig !== lastSignature) {
    lastSignature = sig;
    cache = buildCatalog();
  }
  return cache;
}

/** Recarrega do IndexedDB (persistente) e invalida o cache. Chamar no boot e após salvar homebrew. */
export async function refreshCodexCatalog(): Promise<void> {
  try {
    const { cyberpunkDB } = await import('./db');
    const hb = await cyberpunkDB.loadHomebrew();
    if (hb) homebrewMemory = hb;
  } catch {
    /* mantém localStorage */
  }
  cache = null;
}

export function invalidateCodexCatalog() {
  homebrewMemory = null;
  cache = null;
}

// ---------- Normalização e busca ----------
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\[homebrew\]/g, '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\b\d+\s*d\s*\d+(\s*[+-]\s*\d+)?\b/g, ' ')
    .replace(/\bsp\s*\d+\b/g, ' ')
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const STOP = new Set(['de', 'da', 'do', 'com', 'e', 'a', 'o', 'para', 'em', 'um', 'uma', 'dos', 'das', 'padrao', 'tatico', 'tatica', 'extra', 'extras']);
const tokens = (s: string) => norm(s).split(' ').filter(t => t.length > 2 && !STOP.has(t));

function similarity(a: string, b: string): number {
  const na = norm(a);
  const nb = norm(b);
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  const ta = tokens(a);
  const tb = tokens(b);
  if (!ta.length || !tb.length) return 0;
  const setB = new Set(tb);
  const inter = ta.filter(t => setB.has(t)).length;
  if (!inter) return 0;
  const containment = inter / Math.min(ta.length, tb.length);
  const jacc = inter / new Set([...ta, ...tb]).size;
  return Math.max(jacc, containment * 0.85);
}

export function searchCodex(query: string, kinds?: CodexKind[], limit = 10): CodexEntry[] {
  return getCodexCatalog()
    .filter(e => !kinds || kinds.includes(e.kind))
    .map(e => ({ e, s: similarity(query, e.name) }))
    .filter(x => x.s > 0.3)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(x => x.e);
}

const rnd = <T,>(arr: T[]): T | undefined => (arr.length ? arr[Math.floor(Math.random() * arr.length)] : undefined);

export interface PickFilter {
  kind: CodexKind;
  category?: string | string[]; // substring(s) (sem acento)
  minCost?: number;
  maxCost?: number;
  includeHomebrew?: boolean;
  exclude?: string[];
}

export function codexPool(f: PickFilter): CodexEntry[] {
  const cats = f.category ? (Array.isArray(f.category) ? f.category : [f.category]).map(norm) : null;
  return getCodexCatalog().filter(
    e =>
      e.kind === f.kind &&
      (f.includeHomebrew !== false || !e.homebrew) &&
      (!cats || cats.some(c => norm(e.category).includes(c))) &&
      (f.minCost === undefined || e.costEb >= f.minCost) &&
      (f.maxCost === undefined || e.costEb <= f.maxCost) &&
      !(f.exclude || []).includes(e.name)
  );
}

export function pickFromCodex(f: PickFilter, count = 1): CodexEntry[] {
  const pool = [...codexPool(f)];
  const out: CodexEntry[] = [];
  while (out.length < count && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  return out;
}

// ---------- Armas ----------
interface WeaponAlias {
  re: RegExp;
  categories: string[];
}
const WEAPON_ALIASES: WeaponAlias[] = [
  { re: /muito pesada|magnum|\.50|hand cannon/, categories: ['Pistola Muito Pesada'] },
  { re: /pistola pesada|revolver|heavy pistol/, categories: ['Pistola Pesada'] },
  { re: /pistola leve|compacta|oculta|derringer/, categories: ['Pistola Leve'] },
  { re: /pistola/, categories: ['Pistola Media', 'Pistola Pesada'] },
  { re: /submetralhadora pesada|smg pesad/, categories: ['Submetralhadora Pesada'] },
  { re: /submetralhadora|smg/, categories: ['Submetralhadora'] },
  { re: /espingarda|escopeta|shotgun|cano serrado/, categories: ['Espingarda'] },
  { re: /precisao|sniper|cacador|caca/, categories: ['Fuzil de Precisao'] },
  { re: /fuzil|carabina|rifle|assalto/, categories: ['Fuzil de Assalto'] },
  { re: /metralhadora|missil|lanca|lancador|gatling|minigun/, categories: ['Arma Pesada'] },
  { re: /katana|monofilamento|monomolecular|mono blade|naginata|machado de guerra/, categories: ['Arma Branca Muito Pesada'] },
  { re: /machete|machado|facao/, categories: ['Arma Branca Pesada'] },
  { re: /faca|cassetete|bastao|soco|chave inglesa|bisturi|canivete|lamina|baton|taco/, categories: ['Arma Branca Media'] },
  { re: /arco|besta|dardo|taser|needler|microwaver|stun/, categories: ['Arma Exotica'] },
];

function diceCountFrom(text: string): number | null {
  const m = text.match(/(\d+)\s*d\s*6/i);
  return m ? parseInt(m[1], 10) : null;
}

/** Converte uma entrada de arma do códice em WeaponItem para fichas. */
export function codexEntryToWeapon(e: CodexEntry, fallbackCategory?: string): WeaponItem {
  const w = e.raw as WeaponItem;
  return {
    ...w,
    name: e.homebrew ? `${w.name} [Homebrew]` : w.name,
    category: w.category || fallbackCategory || 'Arma',
    damage: w.damage,
    rof: w.rof ?? 1,
    system: w.system || 'BOTH',
    notes: [w.notes, w.shots ? `Pente: ${w.shots}` : '', '📖 Códice'].filter(Boolean).join(' · '),
  };
}

/** Resolve uma descrição livre ("Pistola Pesada 3d6", "Fuzil Militech 5d6") para uma arma real do Códice. */
export function findCodexWeapon(text: string): WeaponItem | null {
  const weapons = getCodexCatalog().filter(e => e.kind === 'weapon');
  // 1. Nome exato / muito similar
  let best: { e: CodexEntry; s: number } | null = null;
  for (const e of weapons) {
    const s = similarity(text, e.name);
    if (!best || s > best.s) best = { e, s };
  }
  if (best && best.s >= 0.6) return codexEntryToWeapon(best.e);

  // 2. Por tipo genérico (alias) – prefere marca citada e dados compatíveis
  const n = norm(text);
  const alias = WEAPON_ALIASES.find(a => a.re.test(n));
  if (alias) {
    const cats = alias.categories.map(norm);
    const pool = weapons.filter(e => cats.some(c => norm(e.category).includes(c)));
    if (pool.length) {
      const wantedDice = diceCountFrom(text);
      const scored = pool.map(e => ({
        e,
        s: similarity(text, e.name) * 2 + (wantedDice !== null && diceCountFrom(e.raw.damage || '') === wantedDice ? 0.5 : 0),
      }));
      const top = Math.max(...scored.map(x => x.s));
      const bestPool = scored.filter(x => x.s >= top - 0.01).map(x => x.e);
      const chosen = rnd(bestPool);
      if (chosen) return codexEntryToWeapon(chosen);
    }
  }
  return null;
}

const NON_CODEX_WEAPON = /ciber|cyber|mandibula|mordida|escudo|injetor|hipoderm|ataque de|derrubar|\bice\b|deck|mantis|embutid|gorilla|dardos medicos|cao /;

export function resolveWeaponList(weapons: WeaponItem[]): WeaponItem[] {
  const used = new Set<string>();
  return (weapons || []).map(w => {
    // já é do Códice
    if (w.notes?.includes('📖 Códice')) return w;
    if (NON_CODEX_WEAPON.test(norm(w.name))) return w;
    const found = findCodexWeapon(`${w.name} ${w.damage || ''}`);
    if (!found || used.has(found.name)) return w;
    used.add(found.name);
    return { ...found, category: w.category && /prim|secund/i.test(w.category) ? `${w.category} · ${found.category}` : found.category };
  });
}

// ---------- Ciberware / Equipamento ----------
function bestMatch(text: string, kinds: CodexKind[], threshold: number): CodexEntry | null {
  let best: { e: CodexEntry; s: number } | null = null;
  for (const e of getCodexCatalog()) {
    if (!kinds.includes(e.kind)) continue;
    const s = similarity(text, e.name);
    if (!best || s > best.s) best = { e, s };
  }
  return best && best.s >= threshold ? best.e : null;
}

const parentheses = (s: string) => {
  const m = s.match(/\(([^)]*)\)/);
  return m ? ` (${m[1]})` : '';
};

export function resolveCyberwareList(list: string[]): string[] {
  return Array.from(
    new Set(
      (list || []).map(c => {
        if (c.includes('📖')) return c;
        const e = bestMatch(c, ['cyberware'], 0.55);
        return e ? `${e.name}${parentheses(c)}` : c;
      })
    )
  );
}

export function resolveGearList(list: string[]): string[] {
  return Array.from(
    new Set(
      (list || []).map(g => {
        if (g.includes('📖')) return g;
        // preserva SP citado em armaduras e escolhe armadura do códice mais próxima
        const sp = g.match(/SP\s*(\d+)/i);
        if (sp) {
          const target = parseInt(sp[1], 10);
          const arm = getCodexCatalog()
            .filter(e => e.kind === 'armor' && e.raw.sp)
            .map(e => ({ e, s: similarity(g, e.name) - Math.abs(e.raw.sp - target) * 0.05 }))
            .sort((a, b) => b.s - a.s)[0];
          if (arm && arm.s > 0.25) return `${arm.e.name} (SP ${arm.e.raw.sp})`;
          return g;
        }
        const e = bestMatch(g, ['gear', 'ammo', 'attachment', 'drug', 'armor'], 0.6);
        return e ? `${e.name}${parentheses(g)}` : g;
      })
    )
  );
}

/** Enriquece uma ficha gerada: armas, ciberware e equipamento passam a vir do Códice. */
export function enrichNPCFromCodex(npc: NPCSheet): NPCSheet {
  if (npc.isPet || npc.tier === 'pet') {
    return { ...npc, cyberware: resolveCyberwareList(npc.cyberware), gear: resolveGearList(npc.gear) };
  }
  return {
    ...npc,
    weapons: resolveWeaponList(npc.weapons),
    cyberware: resolveCyberwareList(npc.cyberware),
    gear: resolveGearList(npc.gear),
  };
}

// ---------- Itens aleatórios para bolsos, mercados e recompensas ----------
export function randomCodexPocketItems(count: number, maxCostEb = 150): string[] {
  const kinds: CodexKind[] = ['gear', 'drug', 'ammo', 'attachment'];
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const kind = rnd(kinds)!;
    const e = rnd(codexPool({ kind, maxCost: maxCostEb }));
    if (e && !out.some(o => o.startsWith(e.name))) out.push(`${e.name}${e.costLabel ? ` (${e.costLabel})` : ''} 📖`);
  }
  return out;
}

export function codexMarketItemsFor(stallCategory: string, count = 2) {
  const c = norm(stallCategory);
  let filters: PickFilter[];
  if (/arma|muni/.test(c)) filters = [{ kind: 'weapon' }, { kind: 'ammo' }, { kind: 'attachment' }];
  else if (/cromo|implante|ripper|cibern/.test(c)) filters = [{ kind: 'cyberware' }];
  else if (/droga|quimic|farmac/.test(c)) filters = [{ kind: 'drug' }];
  else if (/cyberdeck|hacker|software|gadget/.test(c)) filters = [{ kind: 'gear', category: 'Ferramentas' }, { kind: 'gear', category: 'Comunicacao' }];
  else filters = [{ kind: 'armor' }, { kind: 'gear' }];

  const items: any[] = [];
  for (let i = 0; i < count; i++) {
    const e = rnd(codexPool(rnd(filters)!));
    if (!e || items.some(x => x.name === e.name)) continue;
    const effect =
      e.kind === 'weapon'
        ? `Dano ${e.raw.damage}, ROF ${e.raw.rof ?? 1}${e.raw.shots ? `, Pente ${e.raw.shots}` : ''}`
        : e.kind === 'armor'
        ? `SP ${e.raw.sp}${e.raw.penalty ? `, penalidade ${e.raw.penalty}` : ''}`
        : e.kind === 'cyberware'
        ? `Perda de Humanidade ${e.raw.humanityLoss}`
        : undefined;
    items.push({
      name: e.name,
      category: e.category,
      priceEb: e.costEb || 50,
      priceLabel: e.costLabel || `${e.costEb} eb`,
      condition: rnd(['Novo Lacrado', 'Usado em Combate', 'Pirateado / Modificado']),
      stock: 1 + Math.floor(Math.random() * 3),
      description: `${e.description || 'Item oficial do Códice.'} 📖 Códice`,
      mechanicalEffect: effect,
    });
  }
  return items;
}
