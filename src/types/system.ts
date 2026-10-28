export type GameSystem = 'RED' | '2020';

export interface StatBlockRED {
  INT: number;
  REF: number;
  DEX: number;
  TECH: number;
  COOL: number;
  WILL: number;
  LUCK: number;
  MOVE: number;
  BODY: number;
  EMP: number;
  HP: number;
  seriouslyWounded: number;
  deathSave: number;
  combatNumber?: number; // for Mooks
  headSP: number;
  bodySP: number;
}

export interface StatBlock2020 {
  INT: number;
  REF: number;
  TEC: number;
  COOL: number;
  ATR: number;
  LUCK: number;
  MA: number;
  BODY: number;
  EMP: number;
  BTM: number; // -0 to -5
  headSP: number;
  torsoSP: number;
  rArmSP: number;
  lArmSP: number;
  rLegSP: number;
  lLegSP: number;
}

export type NPCTier = 'mook' | 'lieutenant' | 'miniboss' | 'boss' | 'civilian' | 'pet';

export interface WeaponItem {
  name: string;
  category: string;
  damage: string;
  rof?: number;
  cost?: string;
  rangeDVs?: number[];
  system: 'RED' | '2020' | 'BOTH';
  // 2020 specific:
  wa?: number;
  concealment?: string;
  availability?: string;
  shots?: number;
  reliability?: string;
  notes?: string;
}

export interface CyberwareItem {
  name: string;
  type: string;
  humanityLoss: string;
  cost: string;
  install: string;
  description: string;
  system: 'RED' | '2020' | 'BOTH';
}

export interface ArmorItem {
  id: string;
  name: string;
  sp: number;
  penalty: number;
  cost: string;
  covers: string;
  description: string;
  system: 'RED' | '2020' | 'BOTH';
  notes?: string;
}

export interface AttachmentItem {
  id: string;
  name: string;
  compatibleCategory: string;
  cost: string;
  effect: string;
  slotsUsed: number;
  system: 'RED' | '2020' | 'BOTH';
  notes?: string;
}

export interface AmmunitionItem {
  id: string;
  name: string;
  type: string;
  costPer10: string;
  effect: string;
  damageModifier?: string;
  spAblationBonus?: number;
  system: 'RED' | '2020' | 'BOTH';
}

export interface GearItem {
  id: string;
  name: string;
  category: 'Comunicação & IA' | 'Ferramentas & Invasão' | 'Medicina & Ripperdoc' | 'Sobrevivência & Rua' | 'Estilo & Vida Noturna';
  cost: string;
  description: string;
  system: 'RED' | '2020' | 'BOTH';
}

export interface StreetDrugItem {
  id: string;
  name: string;
  slang: string;
  costPerDose: string;
  deliveryMethod: string;
  primaryEffect: string;
  secondaryOrCrashEffect: string;
  addictionDV: number;
  duration: string;
  citation: string;
}

export interface NPCSheet {
  id: string;
  name: string;
  faction: string;
  subfaction?: string;
  tier: NPCTier;
  system: GameSystem;
  role: string;
  description: string;
  notes?: string;
  statsRED?: StatBlockRED;
  stats2020?: StatBlock2020;
  skills: { [skillName: string]: number };
  weapons: WeaponItem[];
  cyberware: string[];
  gear: string[];
  tactics?: string;
  reputation?: number;
  // Narrative & Danger Gal Dossier fields:
  archetype?: string;
  appearance?: string;
  quirks?: string;
  motivation?: string;
  weaknessOrSecret?: string;
  surrenderTrigger?: string;
  dialogueHook?: string;
  pocketLoot?: string[];
  // Pet & Biopet specific fields:
  isPet?: boolean;
  petNature?: string;
  petSize?: 'Pequeno' | 'Médio' | 'Grande / Pesado';
  petTraining?: string;
  petInstinct?: string;
  petBiteDamage?: string;
  petSpecialActions?: string[];
  petMonthlyCostEb?: number;
}

export interface DistrictInfo {
  id: string;
  name: string;
  zoneType: 'Corporate' | 'Moderate' | 'Combat Zone' | 'Outskirts' | 'Industrial';
  threatLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  threatRatingNumber: number; // 1-10
  ncpdResponseTime: string;
  traumaTeamResponse: string;
  dominantFactions: string[];
  description: string;
  pointsOfInterest: {
    name: string;
    type: string;
    description: string;
    dangerLevel: string;
  }[];
}

export interface WeatherCondition {
  id: string;
  name: string;
  namePt: string;
  temperature: string;
  description: string;
  mechanicalPenalty: string;
  ablationRate?: string;
  skillPenalties?: string;
  citation: string;
  gearRecommendation: string;
}

export interface RuleEntry {
  id: string;
  title: string;
  category: 'Combate' | 'Netrunning' | 'Cibernéticos' | 'Sobrevivência' | 'Sociais' | 'Economia';
  system: 'RED' | '2020' | 'BOTH';
  summary: string;
  mechanics: string;
  formulaOrTable?: string;
  bookCitation: string;
  tags: string[];
}
