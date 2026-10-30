import { NIGHT_CITY_DISTRICTS, DISTRICT_LEGACY_ALIASES, MapDistrict } from './mapData';

/**
 * Registro central dos distritos oficiais do mapa 2045 (mapData.ts).
 * Todo sistema que precise de "distrito" (clima, civis, mercados, esconderijos,
 * estruturas, bares, encontros, namoro, aventuras…) deve usar estas funções
 * em vez de strings soltas como "Watson" ou "Centro Corporativo".
 */

/** Bairro-mãe (borough) de cada distrito, para exibição e agrupamento. */
export const DISTRICT_BOROUGH: Record<string, string> = {
  'watson-development': 'Watson',
  kabuki: 'Watson',
  'little-china': 'Watson',
  'new-westbrook': 'Westbrook',
  'charter-hill': 'Westbrook',
  'old-japantown': 'Westbrook',
  downtown: 'City Center',
  'exec-zone': 'City Center',
  'the-glen': 'Heywood',
  'north-heywood': 'Heywood',
  'heywood-docks': 'Heywood',
  'heywood-industrial': 'Heywood',
  'santo-domingo': 'Santo Domingo',
  'rancho-coronado': 'Santo Domingo',
  'pacifica-playground': 'Pacifica',
  'old-combat-zone': 'Pacifica',
};

export const DEFAULT_DISTRICT_ID = 'watson-development';

const norm = (s: string) =>
  (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

/** Remove a parte parentética do nome: "Kabuki (X)" → "Kabuki". */
export const districtBaseName = (d: MapDistrict) => d.name.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();

export const getDistrictById = (id?: string): MapDistrict | undefined => {
  if (!id) return undefined;
  const direct = NIGHT_CITY_DISTRICTS.find(d => d.id === id);
  if (direct) return direct;
  const legacy = DISTRICT_LEGACY_ALIASES[id] || LEGACY_EXTRA[id];
  return legacy ? NIGHT_CITY_DISTRICTS.find(d => d.id === legacy) : undefined;
};

/** Ids antigos adicionais usados por geradores (civis, clima…). */
const LEGACY_EXTRA: Record<string, string> = {
  watson: 'watson-development',
  westbrook: 'new-westbrook',
  heywood: 'the-glen',
  pacifica: 'pacifica-playground',
  city_center: 'downtown',
  santo_domingo: 'santo-domingo',
  badlands: 'badlands',
  'combat-zones': 'old-combat-zone',
  'corporate-center': 'downtown',
};

/** Nome curto legível para botões e rótulos. */
export const districtShortLabel = (d: MapDistrict) => {
  const base = districtBaseName(d);
  return base.length > 22 ? d.shortName.replace(/\b(\w)(\w*)/g, (_m, a: string, b: string) => a + b.toLowerCase()) : base;
};

/** Rótulo canônico: "Kabuki · Watson". */
export const districtLabel = (d: MapDistrict) => {
  const base = districtBaseName(d);
  const borough = DISTRICT_BOROUGH[d.id];
  return borough && !norm(base).includes(norm(borough)) ? `${base} · ${borough}` : base;
};

interface Rule {
  re: RegExp;
  id: string;
}
// Ordem importa: mais específico primeiro.
const RULES: Rule[] = [
  { re: /hot zone|marco zero|ground zero|ruinas arasaka/, id: 'the-hot-zone' },
  { re: /norcal|base militar|perimetro militar/, id: 'norcal-military' },
  { re: /morro rock|porto espacial/, id: 'morro-rock' },
  { re: /kabuki/, id: 'kabuki' },
  { re: /little china|chinatown/, id: 'little-china' },
  { re: /japantown/, id: 'old-japantown' },
  { re: /charter hill/, id: 'charter-hill' },
  { re: /north oak|westbrook/, id: 'new-westbrook' },
  { re: /pacifica|coastview|west wind/, id: 'pacifica-playground' },
  { re: /old combat|zona de combate|combat zone|zona de guerra|blighted/, id: 'old-combat-zone' },
  { re: /rancho coronado/, id: 'rancho-coronado' },
  { re: /santo domingo|arroyo/, id: 'santo-domingo' },
  { re: /heywood docks|docas de heywood|doca.*heywood/, id: 'heywood-docks' },
  { re: /industrial.*heywood|heywood.*industrial|perimetro.*heywood/, id: 'heywood-industrial' },
  { re: /north heywood|wellsprings/, id: 'north-heywood' },
  { re: /the glen|vista del rey|heywood/, id: 'the-glen' },
  { re: /northside|\bnid\b|watson development|desenvolvimento de watson|watson/, id: 'watson-development' },
  { re: /exec zone|zona executiva/, id: 'exec-zone' },
  { re: /corporate plaza|city center|centro corporativo|downtown|corredores expressos do centro|distrito corporativo|centro comercial/, id: 'downtown' },
  { re: /universit/, id: 'university-district' },
  { re: /little europe|pequena europa/, id: 'little-europe' },
  { re: /upper marina/, id: 'upper-marina' },
  { re: /south night city/, id: 'south-night-city' },
  { re: /reclamation|reclamacao/, id: 'reclamation-zone' },
  { re: /porto de night city|port of night city|marina derelicta|portuaria|marina|porto/, id: 'port-of-night-city' },
  { re: /badlands|rodovia 101/, id: 'badlands' },
];

const BOROUGH_WORDS = ['watson', 'westbrook', 'heywood', 'pacifica', 'santo domingo', 'city center'];

/**
 * Resolve texto livre (id novo, id legado, nome antigo ou nome novo) para um distrito do mapa.
 * Retorna undefined se o texto for ambíguo (cita vários bairros) ou desconhecido.
 */
export function resolveDistrict(text?: string): MapDistrict | undefined {
  if (!text) return undefined;
  const byId = getDistrictById(text.trim());
  if (byId) return byId;
  const n = norm(text);
  // nome canônico exato
  const exact = NIGHT_CITY_DISTRICTS.find(d => norm(d.name) === n || norm(districtLabel(d)) === n || norm(districtBaseName(d)) === n);
  if (exact) return exact;
  const boroughsMentioned = BOROUGH_WORDS.filter(b => n.includes(b)).length;
  if (boroughsMentioned > 1) return undefined;
  const rule = RULES.find(r => r.re.test(n));
  return rule ? NIGHT_CITY_DISTRICTS.find(d => d.id === rule.id) : undefined;
}

/**
 * Normaliza um rótulo de distrito legado para o novo padrão. Mantém o detalhe após " - "
 * (ex.: "Watson (Little China - Antigo necrotério)" → "Little China · Watson — Antigo necrotério").
 * Se não for possível resolver, devolve o texto original.
 */
export function normalizeDistrictLabel(text: string): string {
  const d = resolveDistrict(text);
  if (!d) return text;
  const detail = text.match(/\([^)]*?\s-\s([^)]+)\)/);
  return detail ? `${districtLabel(d)} — ${detail[1].trim()}` : districtLabel(d);
}

export const DISTRICT_OPTIONS = NIGHT_CITY_DISTRICTS.map(d => ({
  id: d.id,
  label: districtLabel(d),
  shortLabel: districtShortLabel(d),
  zoneType: d.zoneType,
  threat: d.threatLevel,
}));

export function districtsByBorough() {
  const groups: Record<string, MapDistrict[]> = {};
  NIGHT_CITY_DISTRICTS.forEach(d => {
    const b = DISTRICT_BOROUGH[d.id] || 'Outros / Periferia';
    (groups[b] = groups[b] || []).push(d);
  });
  return groups;
}
