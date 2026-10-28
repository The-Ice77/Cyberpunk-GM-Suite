export interface PlayerCharacter {
  id: string;
  name: string;
  handle: string;
  role: string;
  imageUrl?: string;
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
  improvementPoints?: number;
  reputation?: number;
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
    improvementPoints: 80,
    reputation: 2,
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
    improvementPoints: 60,
    reputation: 1,
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
    improvementPoints: 50,
    reputation: 1,
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
    'Norte-Americano (Costa Oeste / Night City - Inglês/Gírias)',
    'Norte-Americano (Badlands / Clãs Nômades Aldecaldos)',
    'Latino-Americano (México / América Central - Espanhol)',
    'Sul-Americano (Brasil / Colômbia - Português/Espanhol)',
    'Ásia Oriental (Japão / Arasaka Ward - Japonês)',
    'Ásia Oriental (China / Taiwan / Kang Tao - Mandarim/Cantonês)',
    'Europa Ocidental (Neo-Londres / Berlim / França - Inglês/Alemão/Francês)',
    'Europa Oriental (SovOil / Federação - Russo/Ucraniano)',
    'Africano (Nairobi / Confederação Supranacional - Suaíli/Inglês)',
    'Oceania & Pacífico (Austrália / Polinésia / Ilhas Flutuantes)',
  ],
  personalities: [
    'Frio, calculista, metódico e impassível sob pressão.',
    'Rebelde, impulsivo, sarcástico e com raiva contra megacorporações.',
    'Arrogante, confiante, vaidoso e chamativo em qualquer situação.',
    'Cínico, pessimista, observador e com humor ácido.',
    'Amigável, leal à equipe, protetor e caloroso com aliados.',
    'Tímido, reservado, misterioso e fala apenas quando necessário.',
    'Pragmático, direto ao ponto e focado apenas no pagamento em eddies.',
    'Instável, elétrico, viciado em adrenalina e em quebrar regras.',
    'Filosófico, estoico, reflexivo e em busca de significado na distopia.',
    'Implacável, implosivo, profissional rigoroso e sem meias-medidas.',
  ],
  clothingStyles: [
    'Estilo de Rua (Streetwear clássico, moletons rasgados, tênis e bonés)',
    'Cibermilitar Tático (Camuflagem urbana, coletes balísticos e coturnos pesados)',
    'Glamour Corporativo (Ternos sob medida de seda sintética e óculos finos)',
    'Neo-Kitsch Exagerado (Cores fluorescentes, pelos sintéticos e lentes neon)',
    'Gótico Noturno (Couro preto, espinhos de aço, maquiagem pesada e correntes)',
    'Nômade das Estradas (Jeans batido, botas de poeira do deserto e bandanas)',
    'Retro-Tech Anos 2020 (Jaquetas de vinil brilhante, fivelas e cabos visíveis)',
    'Alta Moda Asiática (Quimonos estilizados, cortes geométricos e seda preta)',
    'Boostergang Selvagem (Couro com tachas, máscaras de gás e cortes irregulares)',
    'Casual Despojado (Roupas funcionais, macacão de mecânico e bolsos utilitários)',
  ],
  hairstyles: [
    'Moicano neon pontiagudo com laterais raspadas.',
    'Dreadlocks sintéticos longos com filamentos ópticos coloridos.',
    'Careca reluzente com tatuagens cibernéticas no couro cabeludo.',
    'Cabelo comprido desalinhado caindo sobre os ombros e olhos.',
    'Corte militar clássico raspado rente à pele.',
    'Tranças boxeadoras ou tranças nagô com anéis metálicos.',
    'Topete volumoso estilo rockabilly retrô cromado.',
    'Corte assimétrico curto com mechas em tons de azul e roxo.',
    'Afro volumoso estilizado com pontas douradas.',
    'Coque samurai alto com corte degradê impecável nas têmporas.',
  ],
  valueMost: [
    'Dinheiro em espécie (Eddies) e independência financeira total.',
    'Honra, palavra dada e reputação inquestionável nas ruas.',
    'Lealdade incondicional à minha equipe e aos meus irmãos de sangue.',
    'Liberdade absoluta para viver sem dever nada a corporação alguma.',
    'Poder bélico, autoridade e a capacidade de não ser controlado por ninguém.',
    'Conhecimento, dados confidenciais e dominar segredos perigosos.',
    'Sobrevivência crua e continuar respirando dia após dia na metrópole.',
    'Vingança implacável contra quem destruiu meu passado.',
    'Minha própria família e garantir que meus entes queridos fiquem seguros.',
    'Amizade verdadeira e laços humanos reais em um mundo de plástico.',
  ],
  feelingsAboutPeople: [
    'As pessoas são apenas recursos descartáveis e peças no meu tabuleiro.',
    'Confio apenas naqueles que já sangraram ao meu lado em um tiroteio.',
    'Todo mundo tem um preço; basta descobrir quanto custa sua lealdade.',
    'A maioria das pessoas é fraca e precisa de alguém forte para liderá-las.',
    'Neutro: se você não mexer com os meus, eu não aperto o gatilho contra os seus.',
    'As pessoas são naturalmente cruéis e egoístas; esperar o pior evita surpresas.',
    'O mundo é solitário e brutal; temos o dever moral de proteger quem não pode.',
    'Mantenho todos a uma distância segura; ninguém chega perto o bastante para me esfaquear.',
    'Sou leal até o fim dos tempos àqueles poucos que provarem seu valor.',
    'Todos nós somos apenas ratos correndo no labirinto das corporações.',
  ],
  valuedPersons: [
    'Meu pai ou mãe, que me ensinou as regras brutais de sobrevivência na rua.',
    'Meu irmão ou irmã mais novo(a), pelo qual eu daria minha própria vida sem hesitar.',
    'Um(a) amante do passado que nunca consegui esquecer de verdade.',
    'Meu melhor amigo de infância com quem dividi o primeiro bico perigoso.',
    'Um mentor experiente (Solo, Tech ou Fixer) que me ensinou meu ofício.',
    'Um animal de estimação biológico ou cibernético leal que nunca me traiu.',
    'Um antigo chefe de gangue ou líder nômade que me acolheu quando eu não era nada.',
    'Absolutamente ninguém; confio única e exclusivamente em mim mesmo.',
    'Um filho ou dependente que mantenho escondido em segredo absoluto.',
    'Uma IA dissidente ou um contato anônimo na rede que já salvou minha vida.',
  ],
  valuedPossessions: [
    'Uma arma de fogo customizada deixada por um parente antes de morrer.',
    'Um cyberdeck vintage modificado manualmente com chips overclockados.',
    'Um holograma familiar desgastado da minha infância antes da tragédia.',
    'Um medalhão ou amuleto que acredito piamente me proteger de tiros letais.',
    'Um instrumento musical antigo ou gravador de fita cassete analógico.',
    'Uma jaqueta de couro pesada e surrada com marcas de estilhaço de combate.',
    'Um shard de dados criptografado que contém um segredo corporativo perigoso.',
    'A chave codificada de uma garagem ou cofre secreto cujo dono desapareceu.',
    'Uma condecoração ou patch militar de uma das Guerras Corporativas passadas.',
    'Um veículo velho ou motocicleta que consertei parafuso por parafuso com as mãos.',
  ],
  familyBackgrounds: [
    'Família corporativa de prestígio que caiu em desgraça e perdeu tudo.',
    'Clã de nômades das estradas que cruzam as Badlands em comboios blindados.',
    'Família operária que viveu em cortiços superlotados no coração de Heywood.',
    'Clã de contrabandistas e pescadores clandestinos na Baía de Morro Rock.',
    'Órfão de sarjeta criado sozinho nos becos mais escuros de Little China.',
    'Família de médicos ou bioengenheiros dissidentes perseguidos por corporações.',
    'Dinastia tradicional e violenta de membros de uma gangue de rua local.',
    'Refugiados miseráveis de uma Zona de Combate pós-4ª Guerra Corporativa.',
    'Família de mecânicos e desmanchadores de cromo em oficinas subterrâneas.',
    'Filho renegado de um alto executivo corporativo que fugiu de casa por rebeldia.',
  ],
  childhoodEnvironments: [
    'Ruas violentas dominadas por gangues booster armadas e tiroteios diários.',
    'Acampamento improvisado de comboio nômade sob poeira e tempestades ácidas.',
    'Cortiço sufocante com falta crônica de energia elétrica e comida limpa.',
    'Condomínio fechado e protegido por seguranças particulares armados.',
    'Complexo industrial abandonado ocupado por desabrigados e sem-teto.',
    'Doca portuária fétida cercada de navios enferrujados e fumaça tóxica.',
    'Arcades subterrâneos barulhentos iluminados por holofotes neon quebrados.',
    'Clínica clandestina de ripperdoc entre cheiro de anestésico e sangue.',
    'Subúrbio esquecido com casas destruídas e terrenos baldios em Rancho Coronado.',
    'Túneis de esgoto e galerias de serviço sob o asfalto de Night City.',
  ],
  familyCrises: [
    'Minha família inteira foi executada por um esquadrão corporativo da morte.',
    'Meus pais morreram tragicamente infectados por uma toxina ou praga química.',
    'Perderam todas as economias em uma aposta ilegal com agiotas perigosos.',
    'Um dos meus pais foi absorvido e preso por forças corporativas de segurança.',
    'A família foi traída por um amigo próximo de confiança e se dispersou.',
    'Fomos vendidos como cobaias para experimentos em um laboratório clandestino.',
    'Nosso comboio ou casa foi aniquilado por um bombardeio de drones autônomos.',
    'Um irmão ou pai entrou em colapso mental e sucumbiu à ciberpsicose violenta.',
    'Nossa residência foi demolida e queimada durante uma guerra de território entre gangues.',
    'Minha família sobreviveu, mas contraiu uma dívida impagável que recaiu sobre mim.',
  ],
  lifeGoals: [
    'Ficar podre de rico e comprar uma cobertura blindada no Centro Corporativo.',
    'Vingar de forma sangrenta e implacável a tragédia que destruiu minha família.',
    'Alcançar o status lendário supremo e ter um drinque com meu nome no Bar Afterlife.',
    'Derrubar uma megacorporação corrupta específica de dentro para fora.',
    'Resgatar ou libertar uma pessoa querida que continua presa ou refém.',
    'Descobrir a verdade oculta sobre minha verdadeira origem e linhagem familiar.',
    'Limpar o meu bairro natal da escória criminosa que aterroriza os inocentes.',
    'Abandonar Night City para sempre e viver como um espírito livre pelas estradas.',
    'Provar para o mundo inteiro que sou o profissional mais letal do meu ramo.',
    'Conquistar o controle do submundo e me tornar o Fixer mais temido de Night City.',
  ],
  tragicLoveAffairs: [
    'O amor da minha vida morreu em meus braços durante um tiroteio cruzado.',
    'Meu parceiro(a) foi sequestrado(a) por agentes corporativos e sumiu do mapa.',
    'Descobri que a pessoa que eu amava era um espião infiltrado para me vigiar.',
    'Fui traído(a) friamente por ganância e entregue para a polícia NCPD.',
    'Meu amor sucumbiu à ciberpsicose galopante e fui forçado a puxar o gatilho.',
    'Precisou fugir da cidade às pressas sem mim para não ser assassinado(a).',
    'Foi seduzido(a) por um culto religioso fanático e abandonou todo o passado.',
    'Foi forçado(a) a aceitar um casamento de conveniência corporativa no exterior.',
    'Éramos rivais em lados opostos de um contrato e tivemos que duelar até o fim.',
    'A pessoa ainda está viva em Night City, mas hoje é meu arqui-inimigo jurado.',
  ],
  nemeses: [
    'Um oficial tático experiente da NCPD que jurou colocar meu rosto num aviso de procurado.',
    'Um psicopata veterano da gangue Maelstrom que teve o olho arrancado por mim.',
    'Um executivo implacável da Arasaka ou Militech caçando vingança por um roubo.',
    'Um ex-parceiro de equipe mercenária que me abandonou para morrer numa emboscada.',
    'Um agiota sanguinário que triplica os juros a cada dia que passa.',
    'Um ripperdoc clandestino desonesto que implantou um código malicioso no meu cromo.',
    'Um netrunner fantasma na rede que vende meus passos e localização para inimigos.',
    'Um caçador de recompensas implacável com implantes de rastreamento militar.',
    'Um tenente vingativo dos Tyger Claws que perdeu homens num trabalho meu.',
    'Um mercenário rival arrogante determinado a provar que é mais rápido no gatilho.',
  ],
};

export function rollLifepathField(table: string[]): string {
  return table[Math.floor(Math.random() * table.length)];
}

export function generateRandomLifepath(): PlayerCharacter['lifepath'] {
  return {
    culturalOrigin: rollLifepathField(LIFEPATH_TABLES.culturalOrigins),
    personality: rollLifepathField(LIFEPATH_TABLES.personalities),
    clothingStyle: rollLifepathField(LIFEPATH_TABLES.clothingStyles),
    hairstyle: rollLifepathField(LIFEPATH_TABLES.hairstyles),
    valueMost: rollLifepathField(LIFEPATH_TABLES.valueMost),
    feelingsAboutPeople: rollLifepathField(LIFEPATH_TABLES.feelingsAboutPeople),
    valuedPerson: rollLifepathField(LIFEPATH_TABLES.valuedPersons),
    valuedPossession: rollLifepathField(LIFEPATH_TABLES.valuedPossessions),
    familyBackground: rollLifepathField(LIFEPATH_TABLES.familyBackgrounds),
    childhoodEnvironment: rollLifepathField(LIFEPATH_TABLES.childhoodEnvironments),
    familyCrisis: rollLifepathField(LIFEPATH_TABLES.familyCrises),
    lifeGoals: rollLifepathField(LIFEPATH_TABLES.lifeGoals),
    tragicLoveAffair: rollLifepathField(LIFEPATH_TABLES.tragicLoveAffairs),
    nemesis: rollLifepathField(LIFEPATH_TABLES.nemeses),
  };
}
