export interface HomebrewWeapon {
  id: string;
  name: string;
  category: string;
  damage: string;
  rof: number;
  cost: string;
  shots?: number;
  concealment?: string;
  reliability?: string;
  specialEffect: string;
  notes?: string;
  author?: string;
  createdAt: string;
}

export interface HomebrewCyberware {
  id: string;
  name: string;
  type: string; // 'Neural' | 'Óptico' | 'Auditivo' | 'Membros' | 'Corporal' | 'Borgware'
  humanityLoss: string;
  cost: string;
  install: string; // 'Clínica' | 'Hospital' | 'Mall'
  description: string;
  mechanicalBonus: string;
  author?: string;
  createdAt: string;
}

export interface HomebrewEnemy {
  id: string;
  name: string;
  faction: string;
  tier: 'mook' | 'lieutenant' | 'miniboss' | 'boss';
  system: 'RED' | '2020' | 'BOTH';
  role: string;
  hp: number;
  headSP: number;
  bodySP: number;
  combatNumber: number;
  move: number;
  ref: number;
  dex: number;
  body: number;
  will: number;
  weapons: string[];
  cyberware: string[];
  equipment: string[];
  tactics: string;
  specialAbility?: string;
  author?: string;
  createdAt: string;
}

export interface HomebrewDatabase {
  weapons: HomebrewWeapon[];
  cyberware: HomebrewCyberware[];
  enemies: HomebrewEnemy[];
}

export const DEFAULT_HOMEBREW_DATA: HomebrewDatabase = {
  weapons: [
    {
      id: 'hb-w-01',
      name: "Tech-Shotgun 'Thunderclap' (Militech T-12 Custom)",
      category: 'Espingarda Tech',
      damage: '5d6',
      rof: 1,
      cost: '1.500eb (Very Expensive)',
      shots: 6,
      concealment: 'Não Ocultável',
      reliability: 'Muito Boa (MB)',
      specialEffect: 'Dispara um projétil slug eletrificado de alta densidade. Se causar dano à armadura, desativa ciberware óptico/auditivo do alvo por 1 rodada (DV 15 Resistência).',
      notes: 'Customizada pelo mercado clandestino de Kabuki com capacitores Militech roubados.',
      author: 'Comunidade Edgerunner',
      createdAt: '2045-11-01',
    },
    {
      id: 'hb-w-02',
      name: "Katana Monomolecular 'Kusanagi Black'",
      category: 'Arma Branca Muito Pesada',
      damage: '4d6',
      rof: 1,
      cost: '2.200eb (Luxury)',
      shots: 0,
      concealment: 'Sob Sobretudo (L)',
      reliability: 'Excelente (EX)',
      specialEffect: 'Fio de laser de carbono negro. Ignora metade do SP do alvo. Qualquer resultado de 5 ou 6 em pelo menos dois dados aciona um Ferimento Crítico (sem precisar de dois 6s).',
      notes: 'Lâmina forjada pelas oficinas secretas da Kendachi em Neo-Tóquio.',
      author: 'Solo Ronin',
      createdAt: '2045-10-15',
    },
    {
      id: 'hb-w-03',
      name: "Submetralhadora Dupla 'Dual-Reaper' (Tandem SMG)",
      category: 'Submetralhadora Pesada',
      damage: '3d6',
      rof: 2,
      cost: '950eb (Premium)',
      shots: 40,
      concealment: 'Jaqueta Longa',
      reliability: 'Padrão (ST)',
      specialEffect: 'Dispara canos alternados. Permite Fogo Automático (Autofire x4) consumindo apenas 15 tiros por rajada.',
      notes: 'Arma favorita dos pistoleiros de Heywood para emboscadas em becos estreitos.',
      author: 'Fixer Vee',
      createdAt: '2045-10-20',
    },
  ],
  cyberware: [
    {
      id: 'hb-c-01',
      name: 'Sandevistan Overclock MK.IV',
      type: 'Neural',
      humanityLoss: '4d6 (14)',
      cost: '2.500eb (Luxury)',
      install: 'Hospital / Ripperdoc Cirurgião',
      description: 'Acelerador de sinapses espinhais com refrigeração líquida forçada na coluna vertebral.',
      mechanicalBonus: 'Ativação como Ação Livre no início do combate. Concede +4 em Iniciativa, esquiva de projéteis (mesmo com REF < 8) e +2m de MOVE durante 3 rodadas.',
      author: 'Dr. Chrome',
      createdAt: '2045-09-12',
    },
    {
      id: 'hb-c-02',
      name: "Ciberolho 'Spectre Ghost' Multiespectral",
      type: 'Óptico',
      humanityLoss: '2d6 (7)',
      cost: '1.200eb (Very Expensive)',
      install: 'Clínica',
      description: 'Globo ocular de quartzo sintético escurecido com múltiplos filtros de frequência eletromagnética.',
      mechanicalBonus: 'Integra Visão Térmica, Visão Noturna e HUD Reticular de Balística (+1 em testes de Ataque à Distância mirando pontos vitais). Grava 48h de Braindance criptografado.',
      author: 'Cyber-Optics Lab',
      createdAt: '2045-08-30',
    },
  ],
  enemies: [
    {
      id: 'hb-e-01',
      name: "Ciberpsicopata 'Vetor-7' (Ex-Piloto Trauma Team)",
      faction: 'Ciberpsicopatas Independentes',
      tier: 'boss',
      system: 'BOTH',
      role: 'Piloto Enlouquecido por Estimulantes',
      hp: 85,
      headSP: 13,
      bodySP: 15,
      combatNumber: 17,
      move: 8,
      ref: 9,
      dex: 8,
      body: 10,
      will: 8,
      weapons: ['Submetralhadora Pesada Militech 3d6 (Autofire 4)', 'Canhão Taser Químico 4d6', 'Lâmina de Hélice Retrátil 3d6'],
      cyberware: ['Sandevistan Militar (+3 Init)', 'Interface Veicular de AV', 'Injetores Subcutâneos de Criotoxina', 'Armadura Subdérmica SP 13'],
      equipment: ['Macacão de Voo Blindado (SP 15)', 'Cilindros de Nitrogênio Líquido', 'Rádio Militar Transmitindo S.O.S. em Loop'],
      tactics: 'Lança nuvens de nitrogênio líquido para congelar e retardar alvos enquanto dispara rajadas de SMG em círculos rápidos.',
      specialAbility: 'Névoa Criogênica: Libera vapor a -50°C que reduz o MOVE de todos num raio de 4m pela metade e impõe -2 em testes físicos.',
      author: 'Mestre da Campanha',
      createdAt: '2045-11-05',
    },
  ],
};
