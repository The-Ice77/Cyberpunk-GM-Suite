// ========================================================
// GERADOR DEDICADO DE PETS & BIOCRIATURAS (CYBERPUNK RED)
// Baseado no Core Rulebook (p. 317 Animals), Interface RED Vol 2 (Pet Shop) & Police Dogs DLC
// ========================================================

import { GameSystem, NPCSheet, WeaponItem } from '../types/system';

export type PetNatureId = 'cyber_k9' | 'robo_drone' | 'biopet_clone' | 'mutant_wild';
export type PetSizeId = 'small' | 'medium' | 'large';
export type PetTrainingId = 'domestic' | 'military' | 'feral' | 'ai_program';

export interface PetNatureOption {
  id: PetNatureId;
  name: string;
  badge: string;
  description: string;
  typicalBreeds: string[];
  baseCostEb: number;
  monthlyCostEb: number;
}

export const PET_NATURES: PetNatureOption[] = [
  {
    id: 'cyber_k9',
    name: 'Cibercão de Combate K-9 (Policial / Militar)',
    badge: 'Cromo & Ataque',
    description: 'Cães selecionados com mandíbulas de titânio, blindagem subdérmica canina e fiação neural para obedecer comandos táticos sob fogo cruzado.',
    typicalBreeds: ['Pastor Belga Malinois K-9', 'Doberman Tático Militech', 'Mastiff Blindado Arasaka', 'Rottweiler de Perímetro'],
    baseCostEb: 2000,
    monthlyCostEb: 150,
  },
  {
    id: 'robo_drone',
    name: 'Pet Robótico / Drone Espião Quadrúpede',
    badge: '100% Mecânico',
    description: 'Drones autônomos com carcaça de polímero fosco imitando animais, microcâmeras de transmissão direta e sem necessidade de comida biológica.',
    typicalBreeds: ['Cyber-Cat Infiltrador', 'Drone Cão de Reconhecimento', 'Corvo Mecânico de Vigilância', 'Rato Cibernético de Espionagem'],
    baseCostEb: 1200,
    monthlyCostEb: 40,
  },
  {
    id: 'biopet_clone',
    name: 'Clone Genético de Alto Luxo (Biotechnica)',
    badge: 'Exótico & Status',
    description: 'Clones biológicos de animais extintos desenvolvidos nos laboratórios da Biotechnica. Símbolo supremo de ostentação e riqueza executiva.',
    typicalBreeds: ['Gato Esfinge com Pelagem Luminescente', 'Cão de Raça Pura Clonado', 'Raposa Prateada Exótica', 'Serpente Biocromada'],
    baseCostEb: 8000,
    monthlyCostEb: 500,
  },
  {
    id: 'mutant_wild',
    name: 'Criatura Feral / Mutante dos Badlands & Esgotos',
    badge: 'Feral & Resistente',
    description: 'Animais que sobreviveram às chuvas ácidas, lixões tóxicos e radiação. Caracterizam-se por mordidas infectadas e extrema ferocidade.',
    typicalBreeds: ['Cão Selvagem dos Badlands (Nômade)', 'Rato Tóxico de Esgoto de Watson', 'Cão Boiadeiro de Rancho Coronado'],
    baseCostEb: 400,
    monthlyCostEb: 50,
  },
];

export const PET_SIZES: Record<PetSizeId, { name: string; hpRange: string; hp: number; move: number; ref: number; body: number; biteDamage: string; sp: number }> = {
  small: {
    name: 'Pequeno (Gato / Corvo / Rato)',
    hpRange: '15 - 20 HP',
    hp: 18,
    move: 8,
    ref: 8,
    body: 3,
    biteDamage: '2d6',
    sp: 4,
  },
  medium: {
    name: 'Médio (Cão K-9 / Doberman / Lince)',
    hpRange: '25 - 35 HP',
    hp: 30,
    move: 7,
    ref: 7,
    body: 6,
    biteDamage: '3d6',
    sp: 7,
  },
  large: {
    name: 'Grande / Pesado (Mastiff / Lobo / Urso)',
    hpRange: '40 - 55 HP',
    hp: 45,
    move: 6,
    ref: 7,
    body: 9,
    biteDamage: '4d6',
    sp: 11,
  },
};

export const PET_TRAININGS: Record<PetTrainingId, { name: string; description: string; combatBonus: number; behaviorSummary: string }> = {
  domestic: {
    name: 'Companheiro Doméstico / Leal',
    description: 'Apegado ao dono, dócil fora de perigo, late ou rosna para alertar, mas não tem treinamento agressivo militar.',
    combatBonus: 0,
    behaviorSummary: 'Defende o dono se ele for atacado; recua e se esconde se sofrer mais de 10 de dano.',
  },
  military: {
    name: 'Condicionamento Militar Tático',
    description: 'Treinado para responder a comandos de voz, assobios e gestos táteis: Atacar, Imobilizar, Proteger e Rastrear.',
    combatBonus: 3,
    behaviorSummary: 'Ignora medo, morde e derruba alvos em fuga; só recua se o condutor emitir ordem de retorno.',
  },
  feral: {
    name: 'Feral / Instintivo de Sobrevivência',
    description: 'Movido a instintos de matilha, caça e território. Luta com ferocidade primal para proteger seus filhotes ou alimento.',
    combatBonus: 1,
    behaviorSummary: 'Ataca alvos isolados pelas costas; foge imediatamente se sofrer ferimento crítico.',
  },
  ai_program: {
    name: 'IA Programada / Algoritmo de Patrulha',
    description: 'Rotina de software com protocolos pré-gravados: ronda de perímetro, reconhecimento silencioso e alarme sonoro.',
    combatBonus: 2,
    behaviorSummary: 'Comportamento mecânico previsível e destemido; transmite coordenadas do alvo para a rede do dono.',
  },
};

export const PET_NAMES = [
  'Cerberus', 'Kuro', 'Titan', 'Byte', 'Fang', 'Ghost', 'Spike', 'Nova', 'Rex', 'Shadow',
  'Baron', 'Viper', 'Blitz', 'Chrome', 'Diesel', 'Echo', 'Nyx', 'Rusty', 'Sarge', 'Thor',
];

export const PET_QUIRKS = [
  'Dorme sobre o capô quente de viaturas ou em cima do cyberdeck ligado para se aquecer.',
  'Rosna baixinho e fica em postura de alerta sempre que alguém com mais de 50% de cromo se aproxima.',
  'Late ou emite sinal sonoro apenas quando detecta armas de fogo desembainhadas no raio de 10 metros.',
  'Adora mastigar pedaços de borracha sintética e cabos de fibra ótica descartados.',
  'Emite um zumbido característico de ventoinha interna quando recebe petiscos sintéticos sabor bacon.',
  'Inclina a cabeça de lado e foca as lentes ópticas Kiroshi com som de foco mecânico ("bzz-clic").',
  'Segue o dono passo a passo sem fazer qualquer barulho nas patas emborrachadas.',
  'Reconhece o dono mesmo disfarçado através do biomonitor de batimentos cardíacos codificado.',
];

export const PET_IMPLANTS_POOL = [
  'Blindagem Subdérmica Canina (Subdermal Armor SP +4)',
  'Mandíbulas de Titânio Reforçadas (Ignora metade do SP mole)',
  'Faro Cibernético Kiroshi (+4 em Percepção Olfativa e Rastreamento)',
  'Microcâmera Ocular com Transmissão de Vídeo HD para o Dono',
  'Músculos Caninos Enxertados (+2 MOVE e +2 em Atletismo para saltos)',
  'Revestimento Térmico Anti-Infravermelho nas Patas',
  'Colete Tático K-9 com Bolsos para Granadas e Munição do Dono',
  'Descarga Taser de Contenção acoplada na Coleira (3d6 Stun)',
];

// Gerador Algorítmico Canônico de Pets
export function generatePetOffline(options: {
  natureId: PetNatureId;
  sizeId: PetSizeId;
  trainingId: PetTrainingId;
  ownerFaction?: string;
  system: GameSystem;
}): NPCSheet {
  const nature = PET_NATURES.find(n => n.id === options.natureId) || PET_NATURES[0];
  const size = PET_SIZES[options.sizeId] || PET_SIZES.medium;
  const training = PET_TRAININGS[options.trainingId] || PET_TRAININGS.military;

  const randomName = PET_NAMES[Math.floor(Math.random() * PET_NAMES.length)];
  const randomBreed = nature.typicalBreeds[Math.floor(Math.random() * nature.typicalBreeds.length)];
  const quirk = PET_QUIRKS[Math.floor(Math.random() * PET_QUIRKS.length)];

  const fullName = `${randomName} (${randomBreed})`;

  // Sorteia 2 implantes/habilidades
  const shuffledImplants = [...PET_IMPLANTS_POOL].sort(() => 0.5 - Math.random());
  const petImplants = shuffledImplants.slice(0, 2);

  // Armamento natural do pet
  const weapons: WeaponItem[] = [
    {
      name: `Mordida Rasgante (${size.biteDamage})`,
      category: 'Arma Natural',
      damage: size.biteDamage,
      rof: 1,
      notes: nature.id === 'cyber_k9' ? 'Mandíbula de titânio (ignora metade do SP mole)' : 'Dano perfurante',
      system: 'BOTH',
    },
    {
      name: 'Bote com Derrubada (Takedown & Pin)',
      category: 'Manobra Especial',
      damage: 'Especial',
      rof: 1,
      notes: 'Teste resistido de Atletismo/Esquiva para derrubar o alvo no chão',
      system: 'BOTH',
    },
  ];

  if (petImplants.some(i => i.includes('Taser'))) {
    weapons.push({
      name: 'Coleira de Descarga Taser',
      category: 'Arma Secundária',
      damage: '3d6',
      rof: 1,
      notes: 'Dano de atordoamento elétrico (não-letal)',
      system: 'BOTH',
    });
  }

  const combatNumber = 10 + training.combatBonus;
  const headSP = size.sp;
  const bodySP = size.sp;
  const owner = options.ownerFaction || 'NCPD / Força Tática';

  return {
    id: 'pet-' + Date.now(),
    name: fullName,
    faction: owner,
    subfaction: nature.id,
    tier: 'pet',
    system: options.system,
    role: `Pet / Biopet // ${nature.name.split('(')[0].trim()}`,
    description: `Animal da raça ${randomBreed}, porte ${size.name.split('(')[0].trim()}. Pertencente a ${owner}.`,
    notes: `Peculiaridade: ${quirk}\nCusto de Mercado: ${nature.baseCostEb}eb\nManutenção Mensal: ${nature.monthlyCostEb}eb/mês`,
    tactics: `${training.behaviorSummary} Utiliza bote e mordida com o objetivo de imobilizar o oponente.`,
    reputation: 1,
    // Narrative & Pet Fields
    isPet: true,
    petNature: nature.name,
    petSize: options.sizeId === 'small' ? 'Pequeno' : options.sizeId === 'medium' ? 'Médio' : 'Grande / Pesado',
    petTraining: training.name,
    petInstinct: training.behaviorSummary,
    petBiteDamage: size.biteDamage,
    petSpecialActions: [
      `Ataque de Mordida (${size.biteDamage})`,
      'Bote com Derrubada (Joga alvo no chão)',
      'Faro & Rastreamento (+4 em testes de Olfato)',
    ],
    petMonthlyCostEb: nature.monthlyCostEb,
    quirks: quirk,
    appearance: `Animal da linhagem ${randomBreed}. Carcaça ou pelagem adaptada com sensores Kiroshi e implantes caninos.`,
    surrenderTrigger: training.behaviorSummary,
    pocketLoot: [
      'Coleira com chip de registro e GPS corporativo',
      `Ração sintética Kibble-Pet de emergência (${nature.monthlyCostEb}eb/mês)`,
      'Transmissor de áudio e dados ligado ao dono',
    ],
    // Cyberpunk RED Stats
    statsRED: {
      INT: 2,
      REF: size.ref,
      DEX: size.ref,
      TECH: 1,
      COOL: 5,
      WILL: 6,
      LUCK: 0,
      MOVE: size.move,
      BODY: size.body,
      EMP: 6,
      HP: size.hp,
      seriouslyWounded: Math.ceil(size.hp / 2),
      deathSave: size.body,
      combatNumber,
      headSP,
      bodySP,
    },
    // Cyberpunk 2020 Stats
    stats2020: {
      INT: 2,
      REF: size.ref,
      TEC: 1,
      COOL: 5,
      ATR: 4,
      LUCK: 0,
      MA: size.move,
      BODY: size.body,
      EMP: 6,
      BTM: size.body >= 8 ? -3 : -2,
      headSP,
      torsoSP: bodySP,
      rArmSP: bodySP,
      lArmSP: bodySP,
      rLegSP: bodySP,
      lLegSP: bodySP,
    },
    skills: {
      'Combate Animal (Combat Number)': combatNumber,
      'Faro & Percepção Olfativa': combatNumber + 3,
      'Esquiva (Evasion)': combatNumber,
      'Furtividade & Bote': combatNumber + 1,
      'Atletismo (Salto & Corrida)': combatNumber + 2,
    },
    weapons,
    cyberware: petImplants,
    gear: [
      'Coleira com transmissor de rádio e GPS',
      'Etiqueta de registro municipal de animais',
    ],
  };
}
