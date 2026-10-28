export interface DateKeyword {
  roll: number;
  word: string;
  translation: string;
}

export const DATING_KEYWORDS: { min: number; max: number; en: string; pt: string }[] = [
  { min: 1, max: 2, en: 'Adorable', pt: 'Adorável' },
  { min: 3, max: 4, en: 'Adventurous', pt: 'Aventureiro(a)' },
  { min: 5, max: 6, en: 'Affectionate', pt: 'Afetuoso(a)' },
  { min: 7, max: 8, en: 'Ambitious', pt: 'Ambicioso(a)' },
  { min: 9, max: 10, en: 'Athlete', pt: 'Atleta' },
  { min: 11, max: 12, en: 'Baking', pt: 'Confeiteiro(a) Amador(a)' },
  { min: 13, max: 14, en: 'Brave', pt: 'Corajoso(a)' },
  { min: 15, max: 16, en: 'Caring', pt: 'Carinhoso(a)' },
  { min: 17, max: 18, en: 'Charming', pt: 'Charmoso(a)' },
  { min: 19, max: 20, en: 'Cooking', pt: 'Mestre Cuca / Cozinheiro(a)' },
  { min: 21, max: 22, en: 'Courageous', pt: 'Audacioso(a)' },
  { min: 23, max: 24, en: 'Creative', pt: 'Criativo(a)' },
  { min: 25, max: 26, en: 'Drinking', pt: 'Apreciador(a) de Drinks' },
  { min: 27, max: 28, en: 'Elflines Online', pt: 'Viciado(a) em Elflines Online (MMO)' },
  { min: 29, max: 30, en: 'Exec', pt: 'Espírito Corporativo / Executivo' },
  { min: 31, max: 32, en: 'Fishing', pt: 'Pescaria Sintética nos Docks' },
  { min: 33, max: 34, en: 'Fixer', pt: 'Conectado(a) no Submundo / Fixer' },
  { min: 35, max: 36, en: 'Foodie', pt: 'Apaixonado(a) por Comida Real' },
  { min: 37, max: 38, en: 'Funny', pt: 'Engraçado(a) / Piadista' },
  { min: 39, max: 40, en: 'Gardening', pt: 'Cultivador(a) de Plantas Hidropônicas' },
  { min: 41, max: 42, en: 'Hard Working', pt: 'Trabalhador(a) Incansável' },
  { min: 43, max: 44, en: 'Hiking', pt: 'Trilheiro(a) nos Badlands' },
  { min: 45, max: 46, en: 'Hopeful', pt: 'Esperançoso(a) no Futuro' },
  { min: 47, max: 48, en: 'Hunting', pt: 'Caçador(a) Urbano(a)' },
  { min: 49, max: 50, en: 'Independent', pt: 'Totalmente Independente' },
  { min: 51, max: 52, en: 'Insightful', pt: 'Perspicaz / Observador(a)' },
  { min: 53, max: 54, en: 'Intelligent', pt: 'Intelectual / Raciocínio Rápido' },
  { min: 55, max: 56, en: 'Lawman', pt: 'Respeitador(a) da Lei / Policial' },
  { min: 57, max: 58, en: 'Loving', pt: 'Amoroso(a) / Apaixonado(a)' },
  { min: 59, max: 60, en: 'Loyal', pt: 'Leal até o fim' },
  { min: 61, max: 62, en: 'Media', pt: 'Jornalista / Criador(a) de Conteúdo' },
  { min: 63, max: 64, en: 'Medtech', pt: 'Médico(a) / Fascínio por Anatomia' },
  { min: 65, max: 66, en: 'Modest', pt: 'Humilde / Sem Frescuras' },
  { min: 67, max: 68, en: 'Netrunner', pt: 'Navegador(a) da Rede / Hacker' },
  { min: 69, max: 70, en: 'Nomad', pt: 'Alma Livre de Estradas / Nômade' },
  { min: 71, max: 72, en: 'Optimistic', pt: 'Otimista Inabalável' },
  { min: 73, max: 74, en: 'Passionate', pt: 'Intenso(a) e Fervoroso(a)' },
  { min: 75, max: 76, en: 'Patient', pt: 'Paciente e Zen' },
  { min: 77, max: 78, en: 'Physically Fit', pt: 'Físico Esculpido / Academia' },
  { min: 79, max: 80, en: 'Quiet', pt: 'Silencioso(a) e Discreto(a)' },
  { min: 81, max: 82, en: 'Rational', pt: 'Frio(a) e Racional' },
  { min: 83, max: 84, en: 'Respectful', pt: 'Educado(a) e Cortês' },
  { min: 85, max: 86, en: 'Rockerboy', pt: 'Rebelde do Rock / Músico(a)' },
  { min: 87, max: 88, en: 'Running', pt: 'Corredor(a) de Parkour Urbano' },
  { min: 89, max: 90, en: 'Solo', pt: 'Guerreiro(a) / Solo de Aluguel' },
  { min: 91, max: 92, en: 'Spontaneous', pt: 'Espontâneo(a) e Imprevisível' },
  { min: 93, max: 94, en: 'Sports', pt: 'Fanático(a) por Combat Zone Smash' },
  { min: 95, max: 96, en: 'Tabletop RPGs', pt: 'Jogador(a) de RPG de Mesa Arcaico' },
  { min: 97, max: 98, en: 'Tech', pt: 'Engenhoso(a) / Fissurado(a) por Peças' },
  { min: 99, max: 100, en: 'Virtuous', pt: 'Dono(a) de Padrões Morais Raros' },
];

export interface DatingLocationActivity {
  locationName: string;
  district: string;
  activities: string[];
}

export const DATING_LOCATIONS: DatingLocationActivity[] = [
  {
    locationName: 'Base Militar da NorCal (NorCal Military Base)',
    district: 'Perímetro Militar / Badlands Norte',
    activities: [
      'Aliviar a tensão do primeiro encontro em um estande de tiro automatizado de precisão.',
      'Encarar um circuito de tirolesa e obstáculos de treino tático nas alturas.',
      'Jantar no refeitório exclusivo de oficiais da base com rações gourmet.',
      'Assistir juntos a um exercício de tiro real com tanques teleguiados ao pôr do sol.',
      'Sessão privada de cinema tático no auditório subterrâneo da base.',
      'Partida caótica de paintball de alta intensidade em um cenário de ruínas artificiais.',
    ],
  },
  {
    locationName: 'Watson Development',
    district: 'Watson',
    activities: [
      'Festa secreta no saguão de obras inacabado de um megabuilding abandonado.',
      'Passeio no Museu do Petróleo e CHOOH2 patrocinado pela SovOil.',
      'Piquenique corporativo sintético em uma praça perto dos hotéis-cápsula de Watson.',
      'Jantar íntimo em um tradicional Izakaya escondido nos becos de Kabuki.',
      'Encontro surpresa na plataforma de alta segurança do monotrilho aéreo.',
      'Comício e protesto organizado pelo Rockerboy Lucius Rhyne com música ao vivo.',
    ],
  },
  {
    locationName: 'New Westbrook (Japantown / Charter Hill)',
    district: 'Westbrook',
    activities: [
      'Participar da plateia ao vivo de um game-show barulhento da Network News 54.',
      'Assistir a uma corrida clandestina de patins a jato perto do Corpo de Bombeiros #1.',
      'Entrar de penetra em uma gala chique da Rocklin Augmentics cheia de champanhe falso.',
      'Escalada esportiva no paredão de concreto abaixo dos escritórios da WorldSat.',
      'Caçar um food truck lendário que muda de esquina a cada hora servindo baozi sintético.',
      'Tomar um coquetel sofisticado em um lounge executivo com vista panorâmica.',
    ],
  },
  {
    locationName: 'Morro Rock (Plataforma de Lançamento)',
    district: 'Porto Espacial / Costa',
    activities: [
      'Observar o teste dos portões de aço blindados do Acelerador de Massa Orbital.',
      'Assistir à queima de fogos de artifício químicos sobre a baía de Night City.',
      'Almoçar na cafeteria de funcionários do Massdriver com vista para cargueiros espaciais.',
      'Passeio em um barco a motor ancorado na marina dos nômades marítimos.',
      'Luta clandestina na arena subterrânea da base de lançamento de foguetes.',
      'Passeio na balsa de travessia noturna com cerveja gelada e brisa marítima.',
    ],
  },
  {
    locationName: 'Zona Executiva (Executive Zone)',
    district: 'Centro Corporativo',
    activities: [
      'Partida de minigolfe em um gramado sintético impecável no topo de um arranha-céu.',
      'Partida de tênis em uma quadra rara de grama orgânica regada com água destilada.',
      'Brunch requintado em um bistrô de alta gastronomia que serve carne bovina de verdade.',
      'Festa privativa na cobertura com piscina de borda infinita aquecida.',
      'Degustação de vinhos sintéticos franceses pré-guerra em adega climatizada.',
      'Visita guiada a uma galeria de arte contemporânea com esculturas holográficas.',
    ],
  },
  {
    locationName: 'Antiga Zona de Combate (Old Combat Zone)',
    district: 'Zona de Guerra',
    activities: [
      'Explorar as ruínas grafitadas de um antigo shopping center armado até os dentes.',
      'Comer espetinho de carne de procedência duvidosa no mercado negro da Meia-Noite.',
      'Apostar em uma rinha clandestina de cães cibernéticos em um galpão abandonado.',
      'Subir no teto de um hospital desativado para ver as luzes da cidade de longe.',
      'Fugir juntos de uma patrulha de Bozos rindo feito loucos nos becos.',
      'Ouvir uma banda de punk-rock que toca com instrumentos soldados a sucata.',
    ],
  },
];

export interface DatingComplication {
  d10: number;
  title: string;
  description: string;
  mechanicalHook: string;
}

export const DATING_COMPLICATIONS: DatingComplication[] = [
  {
    d10: 1,
    title: 'Ex-Namorado(a) Ciberpsicopata Aparece',
    description: 'Um(a) ex carregado(a) de cromo militar e com ciúmes doentios invade o local chutando a porta.',
    mechanicalHook: 'Teste de COOL + Persuasion DV15 para acalmar os ânimos ou iniciativa de combate imediata!',
  },
  {
    d10: 2,
    title: 'Emboscada de Gangue no Caminho',
    description: 'Dois capangas da gangue local encurralam vocês exigindo pedágio para "usar a calçada".',
    mechanicalHook: 'Pagamento de 100eb ou teste de Intimidação / Brawling DV13.',
  },
  {
    d10: 3,
    title: 'Identidade Falsa / Espionagem Corporativa',
    description: 'O parceiro(a) não é quem dizia ser no perfil do Garden Dating: na verdade é um investigador contratado para vigiar os passos do Edgerunner.',
    mechanicalHook: 'Teste de Human Perception DV14 para notar que suas perguntas sobre missões passadas são ensaiadas.',
  },
  {
    d10: 4,
    title: 'Conta Astronômica no Final',
    description: 'O garçom traz a comanda: o parceiro(a) pediu as bebidas mais raras do cardápio e não tem um tostão na conta.',
    mechanicalHook: 'Dívida súbita de 300eb ou teste de Furtividade DV15 para sair sem pagar.',
  },
  {
    d10: 5,
    title: 'Falha Crítica de Ciberware',
    description: 'No meio de uma conversa romântica, um dos implantes de um dos dois dá curto-circuito, gerando espasmos hilários ou soltando faíscas.',
    mechanicalHook: 'Teste de Cybertech DV13 para consertar antes de passar vergonha.',
  },
  {
    d10: 6,
    title: 'Chuva Ácida Repentina',
    description: 'O alarme meteorológico soa e o céu desaba em ácido; o teto retrátil do restaurante enguiça e o pânico se instala.',
    mechanicalHook: 'Ablação de armadura (-1 SP) a menos que usem um casaco ou encontrem abrigo imediato.',
  },
  {
    d10: 7,
    title: 'Química Instantânea e Faíscas',
    description: 'A sintonia é tão perfeita que ambos esquecem os perigos de Night City e a noite se prolonga até o amanhecer.',
    mechanicalHook: 'Recupera 5 pontos de Humanidade perdida e ganha um contato leal de nível 1.',
  },
  {
    d10: 8,
    title: 'Tiroteio de Carro em Movimento (Drive-by)',
    description: 'Uma van com vidros fumê passa disparando rajadas contra a vitrine da boate.',
    mechanicalHook: 'Teste de DEX + Evasion DV13 para se jogar embaixo da mesa sem sofrer dano de estilhaços.',
  },
  {
    d10: 9,
    title: 'Cobrança do Banco de Corpos / Ripperdoc',
    description: 'Cobradores de empréstimo chegam com um bisturi procurando o parceiro(a) para retirar um rim biológico atrasado.',
    mechanicalHook: 'Decisão moral: pagar os 500eb do encontro ou deixar os capangas levarem o parceiro(a).',
  },
  {
    d10: 10,
    title: 'Festa no Topo do Mundo',
    description: 'O parceiro(a) tem a chave mestra do heliporto abandonado com uma das vistas mais deslumbrantes da metrópole.',
    mechanicalHook: 'Ganha +1 de bônus de Sorte (LUCK) renovado para o próximo dia.',
  },
];
