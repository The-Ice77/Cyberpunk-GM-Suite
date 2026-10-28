export interface PlayerCharacter {
  id: string;
  name: string;
  handle: string;
  role: string;
  roleAbility: { name: string; rank: number; description: string };
  system: 'RED' | '2020';
  statsRED: {
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
  };
  currentHP: number;
  maxHP: number;
  humanity: number;
  maxHumanity: number;
  headSP: number;
  bodySP: number;
  shieldHP?: number;
  skills: { [skillName: string]: number };
  weapons: {
    name: string;
    damage: string;
    rof: number;
    ammoType: string;
    magCapacity: number;
    magCurrent: number;
    notes?: string;
  }[];
  armor: {
    head: { name: string; sp: number; maxSP: number };
    body: { name: string; sp: number; maxSP: number; penalty: number };
  };
  cyberware: { name: string; type: string; humanityCost: number; description: string }[];
  gear: string[];
  cashEb: number;
  lifepath: {
    culturalOrigin: string;
    personality: string;
    clothingStyle: string;
    hairstyle: string;
    valueMost: string;
    feelingsAboutPeople: string;
    valuedPerson: string;
    valuedPossession: string;
    familyBackground: string;
    childhoodEnvironment: string;
    familyCrisis: string;
    lifeGoals: string;
    tragicLoveAffair: string;
    nemesis: string;
  };
  notes: string;
}

export const PREMADE_ARCHETYPES: PlayerCharacter[] = [
  {
    id: 'premade-solo',
    name: 'Leon "Forty-Five" Vance',
    handle: 'Forty-Five',
    role: 'Solo',
    roleAbility: { name: 'Consciência de Combate (Combat Awareness)', rank: 4, description: 'Distribui 4 pontos entre: Dano (+1), Iniciativa (+2), Esquiva de Reflexo (+1).' },
    system: 'RED',
    statsRED: { INT: 5, REF: 8, DEX: 8, TECH: 4, COOL: 6, WILL: 7, LUCK: 5, MOVE: 6, BODY: 8, EMP: 4 },
    currentHP: 50,
    maxHP: 50,
    humanity: 38,
    maxHumanity: 40,
    headSP: 11,
    bodySP: 11,
    skills: {
      'Percepção (Awareness)': 6,
      'Esquiva (Evasion)': 8,
      'Armas Curtas (Handgun)': 7,
      'Armas de Ombro (Shoulder Arms)': 8,
      'Briga (Brawling)': 6,
      'Armas Brancas (Melee Weapon)': 6,
      'Furtividade (Stealth)': 5,
      'Primeiros Socorros (First Aid)': 5,
      'Atletismo (Athletics)': 6,
      'Resistir à Tortura/Drogas': 7,
    },
    weapons: [
      { name: 'Fuzil de Assalto Militech Ronin', damage: '5d6', rof: 1, ammoType: '5.56mm', magCapacity: 25, magCurrent: 25, notes: 'Fogo Automático (Autofire 4)' },
      { name: 'Pistola Muito Pesada Dai Lung', damage: '4d6', rof: 1, ammoType: 'Heavy', magCapacity: 8, magCurrent: 8 },
      { name: 'Faca de Combate de Monocarbono', damage: '2d6', rof: 2, ammoType: 'Melee', magCapacity: 1, magCurrent: 1, notes: 'Ignora metade do SP' },
    ],
    armor: {
      head: { name: 'Light Armorjack Helmet', sp: 11, maxSP: 11 },
      body: { name: 'Light Armorjack Vest', sp: 11, maxSP: 11, penalty: 0 },
    },
    cyberware: [
      { name: 'Ciberolho com Mira Telescópica', type: 'Óptico', humanityCost: 2, description: 'Visão de zoom e retículo de alcance sem penalidade a longa distância.' },
      { name: 'Fiação Neural Sandevistan', type: 'Neural', humanityCost: 7, description: 'Ativação de combate: +3 em Iniciativa por 1 minuto.' },
    ],
    gear: ['Agente Pessoal', '50 balas de Fuzil', '30 balas Pesadas', 'Bolsa de Primeiros Socorros', 'Óculos escuros espelhados'],
    cashEb: 350,
    lifepath: {
      culturalOrigin: 'Norte-Americano (Costa Oeste)',
      personality: 'Estóico, quieto, focado na missão e frio sob fogo cerrado.',
      clothingStyle: 'Militar Urbano (Camuflagem cinza com botas de couro com biqueira de aço).',
      hairstyle: 'Militar raspado nas laterais.',
      valueMost: 'Sua palavra e honra profissional.',
      feelingsAboutPeople: 'Pessoas são recursos; poucas são dignas de confiança.',
      valuedPerson: 'Seu antigo sargento da Militech que o ensinou a sobreviver.',
      valuedPossession: 'A insígnia da sua antiga unidade militar defunta.',
      familyBackground: 'Família corporativa que perdeu tudo na 4ª Guerra.',
      childhoodEnvironment: 'Zona de Combate em ruínas entre patrulhas de gangues.',
      familyCrisis: 'Irmão mais novo desaparecido após assalto da Maelstrom.',
      lifeGoals: 'Juntar dinheiro suficiente para comprar um refúgio seguro fora da cidade.',
      tragicLoveAffair: 'A pessoa amada foi assassinada em um fogo cruzado corporativo.',
      nemesis: 'Um Tenente da Arasaka que o jurou de morte.',
    },
    notes: 'Ex-soldado da Militech dispensado honrosamente após o colapso da frente de guerra. Hoje opera no Afterlife.',
  },
  {
    id: 'premade-netrunner',
    name: 'Kira "Wraith" Chen',
    handle: 'Wraith',
    role: 'Netrunner',
    roleAbility: { name: 'Interface (Ações na Rede)', rank: 4, description: '3 Ações NET por turno: Pathfinder, Backdoor, Cloak, Control, Eye on the Net, Slide, Virus, Zap.' },
    system: 'RED',
    statsRED: { INT: 8, REF: 6, DEX: 6, TECH: 7, COOL: 6, WILL: 7, LUCK: 6, MOVE: 5, BODY: 5, EMP: 6 },
    currentHP: 35,
    maxHP: 35,
    humanity: 48,
    maxHumanity: 60,
    headSP: 7,
    bodySP: 11,
    skills: {
      'Interface (Hacking)': 8,
      'Cibertecnologia (Cybertech)': 7,
      'Eletrônica/Segurança (Electronics/Sec)': 8,
      'Biblioteca/Pesquisa (Library Search)': 8,
      'Armas Curtas (Handgun)': 6,
      'Esquiva (Evasion)': 6,
      'Furtividade (Stealth)': 7,
      'Criptografia (Cryptanalysis)': 7,
    },
    weapons: [
      { name: 'Pistola Inteligente Kang Tao Smart', damage: '3d6', rof: 2, ammoType: 'Heavy', magCapacity: 12, magCurrent: 12, notes: 'Mira auxiliada por Smartlink (+1 teste)' },
    ],
    armor: {
      head: { name: 'Boné com Placa Kevlar', sp: 7, maxSP: 7 },
      body: { name: 'Bodyweight Suit (Traje de Mergulho)', sp: 11, maxSP: 11, penalty: 0 },
    },
    cyberware: [
      { name: 'Interface Plugs (Plugues Neurais)', type: 'Neural', humanityCost: 5, description: 'Conexão direta a decks e veículos nos punhos.' },
      { name: 'Neural Link Processador', type: 'Neural', humanityCost: 7, description: 'Base para controle de dados em Realidade Virtual.' },
    ],
    gear: ['Cyberdeck Cybermatrix com 7 Slots', 'Programas: Sword, Armor, Eraser, Worm', 'Cabos de fibra ótica de reserva', 'Agente com criptografia Ziggurat'],
    cashEb: 600,
    lifepath: {
      culturalOrigin: 'Ásia Oriental (Little China)',
      personality: 'Curiosa, hiperativa, viciada em cafeína e informações proibidas.',
      clothingStyle: 'Baggy High-Tech com jaqueta fosforescente e capuz largo.',
      hairstyle: 'Cabelos assimétricos tingidos de roxo neon.',
      valueMost: 'Conhecimento e liberdade irrestrita de dados.',
      feelingsAboutPeople: 'Pessoas são fáceis de prever; códigos são honestos.',
      valuedPerson: 'Uma IA livre desconhecida que a salvou da Blackwall.',
      valuedPossession: 'Seu primeiro chip de memória de 1TB com diários de infância.',
      familyBackground: 'Família de imigrantes comerciantes em Kabuki.',
      childhoodEnvironment: 'Labirinto de barracas e antenas piratas em terraços.',
      familyCrisis: 'Pais foram expulsos pelo aluguel abusivo dos Tyger Claws.',
      lifeGoals: 'Derrubar o firewall central de uma das divisões da Arasaka.',
      tragicLoveAffair: 'O parceiro(a) foi frito(a) por um Hellhound em uma invasão conjunta.',
      nemesis: 'Um agente de segurança da Ziggurat que a rastreia no CitiNet.',
    },
    notes: 'Invasora de dados de alto calibre. Especialista em quebrar nós de controle e abrir portas para Solos.',
  },
  {
    id: 'premade-tech',
    name: 'Milo "Torch" Santos',
    handle: 'Torch',
    role: 'Tech',
    roleAbility: { name: 'Gambiarras & Fabricação (Jury Rig & Maker)', rank: 4, description: 'Pode consertar e aprimorar armas, armaduras e cibernéticos.' },
    system: 'RED',
    statsRED: { INT: 7, REF: 6, DEX: 7, TECH: 8, COOL: 5, WILL: 6, LUCK: 5, MOVE: 6, BODY: 7, EMP: 5 },
    currentHP: 40,
    maxHP: 40,
    humanity: 45,
    maxHumanity: 50,
    headSP: 11,
    bodySP: 11,
    skills: {
      'Engenharia de Armas (Weapontech)': 8,
      'Cibertecnologia (Cybertech)': 8,
      'Mecânica Básica (Basic Tech)': 8,
      'Eletrônica (Electronics)': 7,
      'Espingardas (Shoulder Arms)': 7,
      'Briga (Brawling)': 6,
    },
    weapons: [
      { name: 'Espingarda Rostović Customizada', damage: '5d6', rof: 1, ammoType: 'Slug/Shell', magCapacity: 6, magCurrent: 6, notes: 'Cano polido e mira holográfica' },
      { name: 'Maçarico Industrial / Heavy Melee', damage: '3d6', rof: 2, ammoType: 'Melee', magCapacity: 1, magCurrent: 1 },
    ],
    armor: {
      head: { name: 'Capacete de Solda Blindado', sp: 11, maxSP: 11 },
      body: { name: 'Macacão Reforçado Kevlar/Armorjack', sp: 11, maxSP: 11, penalty: 0 },
    },
    cyberware: [
      { name: 'Ferramenta Multi-Uso no Ciberbraço', type: 'Membros', humanityCost: 7, description: 'Chaves de fenda, soldador e multímetro embutidos nos dedos.' },
    ],
    gear: ['Maleta de ferramentas pesadas', 'Peças sobressalentes', '20 cartuchos de calibre 12'],
    cashEb: 450,
    lifepath: {
      culturalOrigin: 'Latino-Americano (Heywood)',
      personality: 'Pragmático, engenhoso, sempre com as mãos sujas de graxa.',
      clothingStyle: 'Roupas de operário industrial com remendos de Kevlar.',
      hairstyle: 'Topete curto oleoso.',
      valueMost: 'Ferramentas de precisão e engenhosidade.',
      feelingsAboutPeople: 'Quase todo mundo precisa de um conserto.',
      valuedPerson: 'Sua avó que costurava os uniformes da família.',
      valuedPossession: 'Seu maçarico de corte de plasma herdado.',
      familyBackground: 'Família de metalúrgicos de Rancho Coronado.',
      childhoodEnvironment: 'Vila operária com barulho de prensas hidráulicas 24h.',
      familyCrisis: 'Fábrica da família foi demolida pela Petrochem.',
      lifeGoals: 'Montar a melhor oficina independente de Night City.',
      tragicLoveAffair: 'O parceiro(a) fugiu com um nômade para o leste.',
      nemesis: 'Um agiota da 6th Street cobrando juros de ferramentas roubadas.',
    },
    notes: 'Capaz de fazer qualquer máquina destruída voltar a funcionar em rodadas de combate.',
  },
];

export const LIFEPATH_TABLES = {
  culturalOrigins: [
    'Norte-Americano (Costa Oeste / Night City)',
    'Norte-Americano (Badlands / Clãs Nômades)',
    'Latino-Americano (México / América Central)',
    'Sul-Americano (Brasil / Colômbia)',
    'Ásia Oriental (Japão / Arasaka Ward)',
    'Ásia Oriental (China / Taiwan / Kang Tao)',
    'Europa Ocidental (Neo-Londres / Berlim)',
    'Europa Oriental (SovOil / Federação)',
    'Africano (Nairobi / Confederação Supranacional)',
  ],
  personalities: [
    'Frio, calculista e metódico.',
    'Rebelde, impulsivo e com raiva do sistema.',
    'Arrogante, confiante e chamativo.',
    'Cínico, sarcástico e observador.',
    'Amigável, leal e emotivo.',
    'Tímido, reservado e misterioso.',
  ],
  clothingStyles: [
    'Estilo de Rua (Streetwear, moletons rasgados e bonés)',
    'Cibermilitar (Camuflagem cinza, coldres táticos e coturnos)',
    'Glamour Corporativo (Ternos de seda sintética e jóias de ouro)',
    'Neo-Kitsch (Cores berrantes, pelos sintéticos e lentes de contato neon)',
    'Gótico Noturno (Couro preto, espinhos, maquiagem pesada e correntes)',
    'Nômade das Estradas (Jeans batido, botas de poeira e bandanas)',
  ],
};
