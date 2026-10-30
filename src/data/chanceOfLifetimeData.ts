export interface SafeHouseItem {
  id: number;
  name: string;
  district: string;
  costDailyEb?: number;
  costMonthlyEb?: number;
  costNotes: string;
  capacity: string;
  security: 'Baixa' | 'Média' | 'Alta';
  amenities: string[];
  drawbacks: string[];
  description: string;
  rulesHook: string;
}

export interface HiddenStashItem {
  roll: number;
  title: string;
  container: string;
  detectionDV: string;
  valueEb?: number;
  valueFormula?: string;
  description: string;
  lootContents: string;
  plotHook: string;
}

export interface VenditGoodieItem {
  roll: number;
  name: string;
  costEb: number;
  category: string;
  description: string;
  gameEffect?: string;
}

export interface CorpseLootItem {
  roll: number;
  item: string;
  resaleEb?: number;
  valueFormula?: string;
  description: string;
  storyHook: string;
}

export interface StreetFoodItem {
  roll: number;
  name: string;
  costEb: number;
  originCulture: string;
  servingStyle: string;
  description: string;
  flavorNotes: string;
}

export interface StreetDrinkItem {
  roll: number;
  name: string;
  costEb: number;
  originCulture: string;
  drinkType: string;
  description: string;
  flavorNotes?: string;
  effectsOrHangover: string;
}

export interface SubwayStrangerItem {
  roll: number;
  title: string;
  visual: string;
  quirkOrItem: string;
  gmEncounterHook: string;
}

export interface HouseOfWorshipItem {
  id: number;
  name: string;
  deityOrCreed: string;
  district: string;
  architecture: string;
  community: string;
  sanctuaryRule: string;
}

// ========================================================
// 1. SAFE HOUSES & ESCONDERIJOS SEGUROS (20 LOCAIS)
// ========================================================
export const SAFE_HOUSES_LIST: SafeHouseItem[] = [
  {
    id: 1,
    name: 'Fábrica Clandestina de Roupas (Sweatshop)',
    district: 'Rancho Coronado · Santo Domingo',
    costDailyEb: 20,
    costNotes: 'Suborno de 20eb por dia ao gerente para esconder o grupo embaixo das mesas de corte.',
    capacity: 'Até 4 pessoas',
    security: 'Baixa',
    amenities: ['Máquinas Vendit de comida na entrada', 'Banheiros dos operários', 'Eletricidade'],
    drawbacks: ['Barulho ensurdecedor de máquinas de costura 24 horas', 'Trabalhadores entrando e saindo em turnos contínuos'],
    description: 'Fábrica clandestina produzindo cópias piratas de ternos corporativos. O gerente aceita um cala-boca para deixar o grupo dormir de 1d6 dias empurrando rolos de tecido para o lado.',
    rulesHook: 'Exige teste de Furtividade DV 13 caso capangas da seguradora façam inspeção surpresa de trabalho.',
  },
  {
    id: 2,
    name: 'Quarto dos Fundos da Mercearia & Gato Hubert',
    district: 'Little China · Watson',
    costDailyEb: 30,
    costNotes: '30eb por dia mais compras de comida na loja.',
    capacity: '2 pessoas no máximo',
    security: 'Média',
    amenities: ['Comida fresca e água potável', 'Energia elétrica', 'Pacotes de papel higiênico servem de colchão improvisado'],
    drawbacks: ['Espaço minúsculo e apertado', 'O gato laranja Hubert (pesado e folgado) vai deitar em cima de você'],
    description: 'A dona é uma senhora de meia-idade que mora no andar superior e tem um fraco por Edgerunners feridos. O gato Hubert caça ratos e usa mercenários escondidos como aquecedores biológicos.',
    rulesHook: 'Garante cura tranquila de ferimentos (+2 de HP recuperado por descanso completo sob os cuidados da dona).',
  },
  {
    id: 3,
    name: 'Almoxarifado de Figurinos da Universidade de Night City (NCU)',
    district: 'Charter Hill · Westbrook',
    costDailyEb: 50,
    costNotes: 'Suborno de 50eb para os seguranças e 10 a 20eb de gorjeta aos estudantes de teatro.',
    capacity: 'Equipe de até 5 pessoas',
    security: 'Média',
    amenities: ['Chuveiros nos camarins dos bastidores', 'Milhares de roupas de época para disfarces imediatos', 'Máquinas Vendit'],
    drawbacks: ['Cheiro de mofo e naftalina', 'Estudantes entrando para pegar peças de teatro durante ensaios'],
    description: 'Gaiola gradeada de 12x8m sob o palco menor do departamento de artes dramáticas. Fileiras duplas de cabides abarrotadas de figurinos de 1940 até os dias atuais, perucas e chapéus.',
    rulesHook: 'Qualquer teste de Disfarce preparado com roupas deste almoxarifado recebe bônus de +2.',
  },
  {
    id: 4,
    name: 'Cortiço Evergreen Apartments (Ex-Atacadão)',
    district: 'The Glen · Heywood',
    costDailyEb: 15,
    costNotes: '15eb a diária paga ao senhorio que despeja famílias pobres para liberar o cubículo.',
    capacity: 'Até 4 pessoas',
    security: 'Baixa',
    amenities: ['Banheiros e cozinhas comunitárias', 'Paredes grossas na antiga câmara frigorífica'],
    drawbacks: ['Ambiente violento de cortiço', 'Gritos de vizinhos e risco constante de tiroteio no corredor'],
    description: 'Um antigo hipermercado de 13.000m² desativado após a 4ª Guerra. O senhorio dividiu o salão com drywall fino e escadas de metal precárias em centenas de cubículos.',
    rulesHook: 'Role 1d6 para determinar quantas pessoas foram despejadas pelo senhorio para ceder o quarto à sua equipe.',
  },
  {
    id: 5,
    name: 'Princessland! (Parque Temático Desativado)',
    district: 'Pacifica Playground',
    costDailyEb: 0,
    costNotes: 'Sem custo em dinheiro: exige prestar favores e justiça comunitária para a gangue.',
    capacity: 'Equipe inteira com veículos',
    security: 'Alta',
    amenities: ['Parque aquático desativado virou fazenda de peixes', 'Jardins de guerrilha com vegetais reais', 'Defesa armada de posergangers'],
    drawbacks: ['Você precisa jurar respeitar a conduta das Princesas da Justiça', 'Alvo de retaliações de maridos agressores e gangues'],
    description: 'Antigo parque de diversões temático infantil com castelos em miniatura de fibra de vidro, agora fortificado pela gangue Princesses of Justice liderada por Adora.',
    rulesHook: 'Para obter abrigo, a equipe deve caçar ou punir um agressor doméstico na Zona de Combate.',
  },
  {
    id: 6,
    name: 'Estações Fantasmas de Metrô Abandonado',
    district: 'Linha Subterrânea Norte (Watson / Westbrook)',
    costDailyEb: 40,
    costNotes: '40eb pagos aos técnicos de manutenção dos trilhos para abrir a eclusa.',
    capacity: 'Equipe completa com equipamentos pesados',
    security: 'Alta',
    amenities: ['Banheiros públicos antigos com água corrente', 'Totalmente à prova de sensores corporativos de superfície'],
    drawbacks: ['Comida deve ser trazida de fora', 'Vagões fantasmas passam a 100km/h sem parar'],
    description: 'Estações subterrâneas construídas antes do colapso econômico que nunca foram inauguradas na malha ativa. Acesso exclusivo através de dutos de serviço e túneis de alta tensão.',
    rulesHook: 'Impossível ser detectado por satélites corporativos ou drones de reconhecimento aéreo.',
  },
  {
    id: 7,
    name: 'L’Ermitage Conapts de Luxo (Unidades Ausentes)',
    district: 'Downtown · City Center',
    costDailyEb: 200,
    costMonthlyEb: 3000,
    costNotes: 'Depósito caução de 2.000eb no check-in; diária de 200eb deduzida da conta.',
    capacity: 'Até 6 pessoas em alto luxo',
    security: 'Alta',
    amenities: ['Móveis assinados e ar condicionado estéril', 'Canal privado de compras por holovídeo', 'Segurança privada na portaria'],
    drawbacks: ['Custo altíssimo', 'Qualquer dano ao apartamento gera processo e cobrança imediata'],
    description: 'Prédio discreto de conapts pertencentes a executivos que viajam a maior parte do ano. A gerência aluga as unidades vazias como safehouses discretas para operadores que pagam em dinheiro.',
    rulesHook: 'Concede +1 em todos os testes de Humanidade e recuperação de estresse mental após descanso de 24 horas.',
  },
  {
    id: 8,
    name: 'The Garden of Earthly Delights (Bordel & Casa de Banhos)',
    district: 'Old Japantown · Westbrook',
    costDailyEb: 80,
    costNotes: '80eb por noite em quarto privativo sem joytoys.',
    capacity: 'Até 4 pessoas',
    security: 'Média',
    amenities: ['Extensa casa de banhos térmicos e sauna', 'Garçons trazem refeições de restaurantes vizinhos'],
    drawbacks: ['Barulho contínuo de clientes e festas nos corredores', 'Presença de seguranças armados da máfia'],
    description: 'Bordel de alto padrão com trabalhadores meat-puppets com chips de corte neural. O serviço mais caro e procurado do local é justamente o aluguel de quartos isolados para mercenários em fuga.',
    rulesHook: 'O uso da sauna e das águas termais remove qualquer condição de exaustão física.',
  },
  {
    id: 9,
    name: 'Rede de Acolhimento das Street Queens',
    district: 'Vários bairros de Night City',
    costDailyEb: 0,
    costNotes: 'Sem custo financeiro: você deve cumprir um marcador de dívida (favor de combate) quando for chamado.',
    capacity: '1 a 3 pessoas distribuídas em sofás de apoiadores',
    security: 'Média',
    amenities: ['Café da manhã comunitário', 'Solidariedade de rua', 'Acolhimento caloroso'],
    drawbacks: ['Espaço em sofás e colchões no chão', 'As Street Queens chamam seu favor em missões arriscadas'],
    description: 'Rede clandestina de moradias e sofás operada pela gangue de travestis e drag queens Street Queens para proteger jovens expulsos de casa e Edgerunners leais.',
    rulesHook: 'Se a equipe for atacada por extremistas ou preconceituosos, 1d6 Street Queens armadas chegam para apoiar.',
  },
  {
    id: 10,
    name: 'Pátio de Trailers Usados do Honest Hiro',
    district: 'Santo Domingo',
    costDailyEb: 25,
    costNotes: '25eb a diária para ligar mangueira de água e cabo de força em um motorhome usado.',
    capacity: 'Até 5 pessoas por trailer',
    security: 'Média',
    amenities: ['Trailer fechado com cama e fogão', 'Água e eletricidade do pátio', 'Peças mecânicas à mão'],
    drawbacks: ['Trailers velhos com cheiro de mofo', 'Steve (marido musculoso do Hiro) expulsa quem arrumar confusão'],
    description: 'Hiro é um ex-Solo aposentado que agora vende trailers e picapes para Nômades. Ele mantém 1d6 motorhomes prontos em seu pátio de terra batida para alugar a mercenários discretos.',
    rulesHook: 'Permite reparos em veículos na oficina do pátio com bônus de +1 em testes de Técnica Básica.',
  },
  {
    id: 11,
    name: 'Ateliê Loft da Lola Lola',
    district: 'Novo Westbrook',
    costDailyEb: 0,
    costNotes: 'Gratuito, desde que os mercenários posem como modelos nus ou armados para os quadros da artista.',
    capacity: 'Equipe de até 6 pessoas',
    security: 'Média',
    amenities: ['Bebida importada e caviar sintético liberados', 'Camas de veludo', 'Espaço amplo de galeria'],
    drawbacks: ['Lola Lola é excêntrica, invasiva e tenta levar todo mundo para a cama', 'Dura apenas 2d10 dias até ela enjoar'],
    description: 'Loft luxuoso de pé direito alto ocupado pela famosa pintora excêntrica Lola Lola. Ela adora a estética crua dos mercenários e os trata como musas vivas em troca de abrigo de luxo.',
    rulesHook: 'Role 2d10: esse é o número exato de dias até Lola se cansar da equipe e expulsá-los com elegância.',
  },
  {
    id: 12,
    name: 'Dilly’s Pleasure Palace (Love Hotel & Máquinas Vendit)',
    district: 'Kabuki · Watson',
    costDailyEb: 150,
    costNotes: '25eb por 1 hora, 40eb por 2 horas, ou 150eb pela diária de 24h na máquina automática.',
    capacity: '2 pessoas por cápsula (paredes dobráveis para unir quartos)',
    security: 'Alta',
    amenities: ['Quartos 100% à prova de som', 'Máquinas de comida, lingerie e camisetas dentro do quarto', 'Check-in anônimo'],
    drawbacks: ['Mascote animatrônico Dilly the Pickle repetindo frases constrangedoras', 'Quarto compacto'],
    description: 'Hotel cápsula totalmente automatizado com o perturbador picles animatrônico verde Dilly na recepção ("Wrap It Before You Tap It!"). O local mais discreto e privado de Night City.',
    rulesHook: 'Paredes blindadas acusticamente impedem qualquer escuta direcional ou grampo de áudio externo.',
  },
  {
    id: 13,
    name: 'Greenbox Storage Units (Cubículos 2x2x2m)',
    district: 'Zona Industrial de Heywood',
    costDailyEb: 10,
    costMonthlyEb: 200,
    costNotes: '200eb mensais ou suborno de 10eb por dia ao guarda noturno mal pago.',
    capacity: '2 pessoas apertadas por boxe',
    security: 'Média',
    amenities: ['Portão de aço com cadeado pesado', 'Banheiro e máquina Vendit na guarita da entrada'],
    drawbacks: ['Sem janelas, encanamento ou ventilação natural', 'Calor escaldante no verão'],
    description: 'Complexo de galpões com centenas de contêineres e cubos de zinco climatizados de 2 metros. O esconderijo clássico de hackers foragidos de Night City retratado em todas as séries de TV.',
    rulesHook: 'Excelente isolamento para quem precisa plugar um cyberdeck e rodar Netrunning sem emitir sinal de rádio.',
  },
  {
    id: 14,
    name: 'Crematório & Funerária do Herschel',
    district: 'Rancho Coronado · Santo Domingo',
    costDailyEb: 30,
    costNotes: 'Doação de 30eb por dia para o fundo de sepultamento beneficente da família.',
    capacity: 'Até 4 pessoas',
    security: 'Alta',
    amenities: ['Comida vegetariana budista caseira', 'Crematório ilegal para sumir com corpos de inimigos (100eb)'],
    drawbacks: ['Dormir em macas refrigeradas ao lado de cadáveres', 'Cheiro de incenso forte e formaldeído'],
    description: 'Herschel é um agente funerário budista e sua família trata da preparação de corpos. Ele aluga salas do necrotério para mercenários e oferece cremação sem registro de camaradas mortos.',
    rulesHook: 'Herschel nunca entrega ninguém para a polícia ou corporações, exigindo apenas respeito aos mortos.',
  },
  {
    id: 15,
    name: 'Antigo Canil & Abrigo Municipal de Animais (Ripperdoc Bingo)',
    district: 'Pacifica Playground',
    costDailyEb: 20,
    costNotes: '20eb por dia nas baias reformadas, ou de graça se o grupo fez implantes com o Bingo.',
    capacity: 'Até 6 pessoas',
    security: 'Média',
    amenities: ['Baias fechadas com isolamento de espuma térmica', 'Serviços médicos clandestinos na clínica do canil'],
    drawbacks: ['Comida apenas ração kibble de saco', 'Água vem direto de uma mangueira de jardim'],
    description: 'Prédio abandonado do abrigo municipal de animais onde o Ripperdoc Bingo (biosculptado como um cachorro bípede) instalou sua clínica clandestina de extração de balas.',
    rulesHook: 'Bingo cobra metade do preço de tabela para remover balas e estabilizar Ferimentos Críticos.',
  },
  {
    id: 16,
    name: 'Comuna Hidropônica dos Dirty Hippies',
    district: 'Old Combat Zone · Pacifica',
    costDailyEb: 0,
    costNotes: 'Sem custo: troca por proteção armada ou trabalho braçal na estufa.',
    capacity: 'Equipe completa',
    security: 'Média',
    amenities: ['Comida fresca hidropônica de verdade', 'Cigarros de maconha e bhang à vontade', 'Painéis solares ativos'],
    drawbacks: ['Comportamento de seita hippie e cheiro penetrante de fumaça', 'Atrito constante com a Continental Brands'],
    description: 'Comunidade de ativistas urbanos que recuperaram quarteirões arruinados com painéis solares e fazendas aquapônicas no telhado. Odeiam a Continental Brands e acolhem mercenários que oferecem proteção.',
    rulesHook: 'Oferece abrigo prolongado sem cobrar nenhum eurodólar enquanto a equipe agir como sentinela armada.',
  },
  {
    id: 17,
    name: 'The Flotsam (Flotilha Flutuante das Docas)',
    district: 'Porto de Night City',
    costDailyEb: 25,
    costNotes: '25eb a diária para atracar ou dormir em um barco pesqueiro reformado.',
    capacity: 'Até 4 pessoas por barco',
    security: 'Alta',
    amenities: ['Acesso a rotas marítimas de fuga sem bloqueios terrestres', 'Alimentação farta à base de peixes frescos e algas'],
    drawbacks: ['Balanço contínuo das ondas e cheiro forte de maré baixa', 'Fácil de ser encurralado na água se não tiver barco motorizado'],
    description: 'Cidade paralela de barcos pequenos, iates enferrujados e balsas amarradas além do porto de contêineres de Night City. Habitada por Nômades Marítimos especialistas em contrabando marítimo.',
    rulesHook: 'Permite rota de fuga marítima imediata ignorando bloqueios rodoviários do DPNC nas pontes.',
  },
  {
    id: 18,
    name: 'The Boneyard (Cemitério Ocupado dos Buzzards)',
    district: 'Zona Industrial de Heywood',
    costDailyEb: 15,
    costNotes: '15eb pagos à guarita da gangue gótica The Buzzards.',
    capacity: 'Até 6 pessoas em mausoléus de mármore',
    security: 'Média',
    amenities: ['Mausoléus familiares de granito à prova de balas', 'Terra fértil para hortas comunitárias', 'Vizinhança calma'],
    drawbacks: ['Dormir em cima de lápides e catacumbas', 'Os Buzzards não toleram desrespeito aos túmulos'],
    description: 'Antigo jardim memorial transformado em uma favela calma e arborizada durante o Tempo do Vermelho. Protegida pelos neo-góticos Buzzards que defendem a santidade das sepulturas.',
    rulesHook: 'As paredes dos mausoléus de mármore possuem SP 25 contra tiroteios externos.',
  },
  {
    id: 19,
    name: 'O Interior Oco dos Outdoors Holográficos (The Signboards)',
    district: 'Old Japantown · Westbrook',
    costDailyEb: 0,
    costNotes: 'Gratuito: exige subir por escadas de serviço de 20 metros de altura.',
    capacity: '4 pessoas com equipamento leve',
    security: 'Alta',
    amenities: ['Visão panorâmica da cidade', 'Inacessível para viaturas terrestres', 'Energia desviada do letreiro'],
    drawbacks: ['Sem água ou saneamento (necessário balde químico)', 'Luz pulsante neon e calor dos transformadores'],
    description: 'O espaço oco e fechado atrás das telas holográficas gigantescas de publicidade da Militech e Petrochem que margeiam as autoestradas elevadas.',
    rulesHook: 'Excelente posto de observação de franco-atiradores (+2 em tiros de precisão de longa distância).',
  },
  {
    id: 20,
    name: 'QTown (Comunidade Fortificada de Sobrevivência)',
    district: 'Badlands',
    costDailyEb: 35,
    costNotes: '35eb a diária ou troca por baterias e munição de fuzil.',
    capacity: 'Equipe completa com vans blindadas',
    security: 'Alta',
    amenities: ['Oficina mecânica completa', 'Posto de guarda armada e fogueira comunitária', 'Rádio de longo alcance'],
    drawbacks: ['Tempestades de poeira e areia ácida constantes', 'Distante do centro urbano (40 minutos de estrada)'],
    description: 'Assentamento autônomo fortificado erguido com chapas de aço, contêineres e carcaças de ônibus blindados. Mantém vigilância contínua contra invasores e quadrilhas de Scavengers.',
    rulesHook: 'Fornece combustível sintético CHOOH2 a preço de custo (15eb o galão).',
  },
];

// ========================================================
// 2. HIDDEN STASH LOOT (20 SAQUES SECRETOS - D20)
// ========================================================
export const HIDDEN_STASH_TABLE: HiddenStashItem[] = [
  {
    roll: 1,
    title: 'Foto Rara Autografada de Johnny Silverhand',
    container: 'Caixa de metal enferrujada atrás da grade de ventilação',
    detectionDV: 'Percepção DV 13',
    valueEb: 250,
    valueFormula: '1d6 x 50eb (média 250eb)',
    description: 'Pilha de cartões promocionais com autógrafos pré-impressos sem valor, com exceção de uma foto autêntica à mão guardada no escuro sem amarelar.',
    lootContents: 'Foto original autografada por Johnny Silverhand em 2020.',
    plotHook: 'Um fã fanático do Rockerboy ou o barman do Afterlife pagará até 400eb por essa relíquia.',
  },
  {
    roll: 2,
    title: 'Cavalo de Madeira Entalhado à Mão',
    container: 'Envolto em pano encardido debaixo de uma tábua solta',
    detectionDV: 'Investigação DV 14',
    valueEb: 300,
    description: 'Uma escultura artesanal em madeira maciça de pinho real — madeira orgânica verdadeira, raríssima no Tempo do Vermelho.',
    lootContents: 'Cavalo de madeira genuína pré-guerra em perfeito estado de conservação.',
    plotHook: 'Colecionadores corporativos pagam pequenas fortunas por objetos de madeira natural.',
  },
  {
    roll: 3,
    title: 'Fichas Amareladas de Receitas de Ação de Graças',
    container: 'Lata de biscoito oxidada sob o piso da pia',
    detectionDV: 'Percepção DV 12',
    valueEb: 80,
    description: 'Fichas presas por argola de metal com receitas de família do século XX. O "Croquete de Kibble de Peru" surpreendentemente é comestível.',
    lootContents: 'Coleção de 14 receitas gastronômicas artesanais com instruções de preparo.',
    plotHook: 'Um chef de restaurante de luxo pagará 80eb para adaptar os temperos para clientes VIP.',
  },
  {
    roll: 4,
    title: 'Reserva Doce de Sobremesas & Leite de Soja UHT',
    container: 'Compartimento secreto no fundo de um armário falso',
    detectionDV: 'Percepção DV 11',
    valueEb: 40,
    description: 'Pacotes lacrados de doces açucarados com sabor de morango sintético e garrafa lacrada de leite de soja esterilizado.',
    lootContents: '4 barras de chocolate sintético crocante e 1L de leite de soja UHT.',
    plotHook: 'Consumir os doces restaura 1 ponto de sorte (LUCK) temporário em momentos de cansaço extremo.',
  },
  {
    roll: 5,
    title: 'Ursinho de Pelúcia com Fita Vermelha e Olho Faltando',
    container: 'Mochila infantil escondida dentro de duto de ar',
    detectionDV: 'Percepção DV 12',
    valueEb: 15,
    description: 'Um urso de pelúcia surrado e muito abraçado, com uma orelha pendurada e fita desfiada no pescoço.',
    lootContents: 'Brinquedo vintage pré-guerra carregado de valor emocional.',
    plotHook: 'O urso pertencia à filha desaparecida de um Fixer influente de Heywood.',
  },
  {
    roll: 6,
    title: 'Carta Lacrada: "No Caso da Minha Morte"',
    container: 'Fita adesiva colada atrás da gaveta de cabeceira',
    detectionDV: 'Investigação DV 14',
    valueEb: 500,
    description: 'Envelope grosso com selo de cera contendo instruções para contatar um advogado corporativo e dados de uma conta offshore.',
    lootContents: 'Testamento com código de transferência bancária e dossiê de corrupção.',
    plotHook: 'Chantagem corporativa de alto escalão contra um vice-presidente da Petrochem.',
  },
  {
    roll: 7,
    title: 'Bíblia Antiga de Couro Oca com Frasco de Rum',
    container: 'Prateleira falsa camuflada entre livros mofados',
    detectionDV: 'Percepção DV 13',
    valueEb: 150,
    description: 'Bíblia de capa dura de couro verdadeiro esculpida por dentro, guardando um frasco metálico de rum caribenho envelhecido.',
    lootContents: 'Frasco de rum 70% autêntico e bíblia oca de couro legítimo.',
    plotHook: 'A garrafa de rum abre portas para conversas com veteranos de guerra e contrabandistas marítimos.',
  },
  {
    roll: 8,
    title: 'Lote de Chips de Música Pirata Subterrânea',
    container: 'Estojo de couro preso sob uma poltrona rasgada',
    detectionDV: 'Percepção DV 12',
    valueEb: 120,
    description: 'Vários chips de dados sem aprovação de corporações, contendo faixas de punk rock com batidas pesadas e letras incendiárias.',
    lootContents: '6 chips de áudio de alta fidelidade com gravações master originais.',
    plotHook: 'Um DJ de boate de Watson pagará 120eb para tocar as faixas exclusivas na pista.',
  },
  {
    roll: 9,
    title: 'Diagnóstico Médico Terminal Recente',
    container: 'Enfiado dentro do forro de um casaco de inverno',
    detectionDV: 'Investigação DV 13',
    valueEb: 50,
    description: 'Carta dobrada e relida inúmeras vezes de uma clínica com exames atestando desordem de atenuação nervosa incurável com 6 meses de vida.',
    lootContents: 'Prontuário médico detalhado datado de duas semanas atrás.',
    plotHook: 'O falecido estava em uma missão suicida para deixar dinheiro para sua família antes de morrer.',
  },
  {
    roll: 10,
    title: 'Fórmula Secreta do Triti-Kibble da Continental Brands',
    container: 'Pequeno cofre corta-fogo embutido no chão sob o tapete',
    detectionDV: 'Eletrônica/Segurança DV 16',
    valueEb: 1500,
    description: 'Folha plastificada com a lista química exata de aromatizantes industriais, conservantes e ligantes do kibble mais vendido do país.',
    lootContents: 'Fórmula industrial confidencial da Continental Brands.',
    plotHook: 'Fixers de alimentos clandestinos pagarão até 1.500eb por essa fórmula patenteada.',
  },
  {
    roll: 11,
    title: 'Unidades de Armazenamento Militar Blindadas Pré-Red',
    container: 'Caixa de chumbo lacrada entre as vigas do teto',
    detectionDV: 'Engenharia ou Percepção DV 15',
    valueEb: 1200,
    description: 'HDs industriais militares resistentes a pulsos eletromagnéticos, gravados durante a 4ª Guerra Corporativa.',
    lootContents: '3 drives magnéticos militares com mapas de fortificações subterrâneas.',
    plotHook: 'Contém a localização exata de um depósito de munição esquecido da Militech nos Badlands.',
  },
  {
    roll: 12,
    title: 'Fragmento de Rocha Lunar Autêntica da Missão Apollo',
    container: 'Caixa de mogno com veludo azul dentro de uma tubulação',
    detectionDV: 'Percepção DV 16',
    valueEb: 2500,
    description: 'A exata rocha lunar presenteada ao jornalista Walter Cronkite por sua cobertura da corrida espacial americana nos anos 60.',
    lootContents: 'Fragmento de rocha basáltica da Lua com certificado histórico preservado.',
    plotHook: 'Um colecionador de artefatos espaciais de Night City pagará 2.500eb sem fazer perguntas.',
  },
  {
    roll: 13,
    title: 'Pistola Pesada Artesanal com Empunhadura de Marfim',
    container: 'Fundo falso de uma gaveta de ferramentas pesadas',
    detectionDV: 'Percepção DV 15',
    valueEb: 1800,
    description: 'Arma customizada feita à mão com cabo de marfim real, gravações em filigrana de ouro, link smartgun e miras de trítio.',
    lootContents: 'Pistola Pesada de Excelente Qualidade (+1 no ataque, dano 3d6, Smartlink integrado).',
    plotHook: 'Arma de honra de um antigo tenente da máfia Valentinos com brasão de família gravado.',
  },
  {
    roll: 14,
    title: 'Kit de Primeiros Socorros de Campo Esterilizado',
    container: 'Caixa de primeiros socorros fixada atrás do espelho do banheiro',
    detectionDV: 'Percepção DV 12',
    valueEb: 100,
    description: 'Estojo militar compacto com ataduras, spray antisséptico, creme antibiótico, alfinetes e pó hemostático quik-clot.',
    lootContents: 'Kit completo capaz de estancar 3 hemorragias críticas imediatamente.',
    plotHook: 'Salva vidas sem exigir ferramentas hospitalares caras em meio a um tiroteio.',
  },
  {
    roll: 15,
    title: 'Dedo Mindinho Humano Mumificado em Seda (Yubitsume)',
    container: 'Caixinha de porcelana enfiada no fundo de uma bota velha',
    detectionDV: 'Percepção DV 14',
    valueEb: 50,
    description: 'Um dedo mindinho cortado, desidratado e preservado em seda manchada — o ritual tradicional japonês de desculpas da Yakuza.',
    lootContents: 'Relíquia macabra de lealdade criminal com anel de jade no osso.',
    plotHook: 'Pode ser apresentado a um chefe dos Tyger Claws como prova de que uma dívida antiga foi quitada.',
  },
  {
    roll: 16,
    title: 'Estoque de Vitaminas, Nootrópicos e Chicletes',
    container: 'Pote hermético camuflado dentro de um pote de farinha',
    detectionDV: 'Percepção DV 13',
    valueEb: 90,
    description: 'Frascos lacrados de suplementos cerebrais de colina, complexo B e duas cartelas de chiclete de canela com cafeína.',
    lootContents: '12 doses de nootrópicos que concedem +1 em testes de Concentração por 2 horas.',
    plotHook: 'Mercadoria valiosa para Netrunners que precisam manter a mente afiada durante invasões.',
  },
  {
    roll: 17,
    title: 'O Pequeno Livro Preto de Contatos VIP (Little Black Book)',
    container: 'Compartimento oco em uma Bíblia oca ou tijolo solto',
    detectionDV: 'Investigação DV 15',
    valueEb: 800,
    description: 'Caderno eletrônico encadernado em couro com detalhes e números criptografados de dezenas de personalidades influentes da cidade.',
    lootContents: 'Contatos diretos de 8 Fixers, 3 médicos clandestinos e 2 executivos da Trauma Team.',
    plotHook: 'Permite acionar contatos de emergência como se você tivesse Reputação 7 com o submundo.',
  },
  {
    roll: 18,
    title: 'Chave Numerada de Caixa de Depósito Bancário',
    container: 'Costurada por dentro da barra de uma cortina pesada',
    detectionDV: 'Percepção DV 15',
    valueEb: 1000,
    description: 'Chave de alta segurança com código gravado a laser "#B-404" sem indicar a agência bancária ou instituição.',
    lootContents: 'Chave mestra de cofre de segurança particular.',
    plotHook: 'Uma investigação com Fixers locais (DV 14) revelará qual banco em Little China guarda o cofre.',
  },
  {
    roll: 19,
    title: 'Tubo de PVC com Maço de Eurodólares Antigos',
    container: 'Enterrado dentro de um cano de esgoto desativado',
    detectionDV: 'Percepção DV 14',
    valueEb: 900,
    valueFormula: '3d6 x 100eb (média 900eb)',
    description: 'Tubo de plástico lacrado com fita prateada contendo notas físicas de eurodólares de circulação legal enroladas e secas.',
    lootContents: 'Dinheiro vivo em notas de 50eb e 100eb totalizando 3d6 x 100eb.',
    plotHook: 'Dinheiro limpo sem rastreamento digital, pronto para gastar no Mercado Negro.',
  },
  {
    roll: 20,
    title: 'Chip de Identidade Clonada com Cartão Platinum',
    container: 'Camuflado dentro do conector de uma tomada de parede',
    detectionDV: 'Eletrônica/Segurança DV 15',
    valueEb: 1500,
    description: 'Chip neural com identidade completa forjada de um executivo recém-falecido da SovOil, com credenciais funcionais.',
    lootContents: 'Chip de identidade falsa com biometria reprogramada e 1.500eb em créditos corporativos.',
    plotHook: 'Permite acesso a áreas corporativas restritas por 48 horas antes da empresa bloquear a conta.',
  },
];

// ========================================================
// 3. VENDIT MACHINE GOODIES (20 ITENS DE CONVENIÊNCIA 24H)
// ========================================================
export const VENDIT_MACHINE_TABLE: VenditGoodieItem[] = [
  {
    roll: 1,
    name: 'Banheiro Portátil Descartável (Sanitary Bag)',
    costEb: 5,
    category: 'Higiene & Sobrevivência',
    description: 'Saco plástico com aro rígido contendo resina química que gelifica resíduos corporais instantaneamente. Inclui lenço higiênico.',
    gameEffect: 'Permite necessidades fisiológicas em acampamentos e cubículos sem banheiro por 24 horas.',
  },
  {
    roll: 2,
    name: 'Comprimidos de Iodeto de Potássio (Anti-Radiação)',
    costEb: 10,
    category: 'Médico',
    description: 'Cartela com 4 pastilhas que protegem a tireóide contra contaminação radioativa de baixo nível.',
    gameEffect: 'Concede imunidade temporária a radiação leve em zonas de impacto por 6 horas.',
  },
  {
    roll: 3,
    name: 'Pastilhas Efervescentes Purificadoras de Água com Sabor',
    costEb: 5,
    category: 'Sobrevivência',
    description: 'Tubo com 10 pastilhas efervescentes sabor cereja negra ou limão. Esteriliza água de chuva e mata micróbios de cólera e disenteria.',
    gameEffect: 'Transforma água contaminada de rua em água potável em 5 minutos.',
  },
  {
    roll: 4,
    name: 'Remendos Adesivos Inteligentes de Tecido (Smart Patches)',
    costEb: 5,
    category: 'Vestuário & Reparo',
    description: 'Adesivo térmico de polímero flexível que repara rasgos em casacos e mochilas sem precisar de agulha e linha por 24 horas.',
    gameEffect: 'Repara temporariamente armaduras de tecido rasgadas, impedindo penalidade estética.',
  },
  {
    roll: 5,
    name: 'Kit Mini-Horta Caseira Instantânea (Add Water)',
    costEb: 15,
    category: 'Botânica Doméstica',
    description: 'Caixa de papelão com terra estéril inoculada e sementes modificadas que brotam pequenos brotos de hortelã ou tomate cereja.',
    gameEffect: 'Fornece um tomate real comestível após 7 dias de irrigação.',
  },
  {
    roll: 6,
    name: 'Kit de Sea-Monkeys (Camarões Pré-Históricos Instantâneos)',
    costEb: 8,
    category: 'Entretenimento & Pet',
    description: 'Envelope com ovos desidratados de crustáceos que eclodem em um aquário de bolso plástico em 24 horas.',
    gameEffect: 'Pequeno pet de bolso que entretém crianças e reduz o estresse da equipe em +1 de Humanidade.',
  },
  {
    roll: 7,
    name: 'Espelho de Bolso Balístico Anti-Estilhaço',
    costEb: 5,
    category: 'Tático & Equipamento',
    description: 'Pequena placa reflexiva de policarbonato inquebrável, perfeita para olhar esquinas sem expor a cabeça aos tiros.',
    gameEffect: 'Permite espiar ao redor de esquinas sem conceder bônus de tiro ao inimigo.',
  },
  {
    roll: 8,
    name: 'Pacote de Preservativos Reforçados Variados (6 un)',
    costEb: 4,
    category: 'Higiene & Tático',
    description: 'Camisinhas ultra-resistentes sem lubrificante. Excelente para vedar canos de armas contra poeira e areia nos Badlands.',
    gameEffect: 'Protege canos de armas contra travamento por poeira ou areia (+1 em Confiabilidade).',
  },
  {
    roll: 9,
    name: 'Balas de Goma e Substituto de Sal (Componentes Químicos)',
    costEb: 5,
    category: 'Química Improvisada',
    description: 'Ursos de goma de gelatina verdadeira e cloreto de potássio. Em mãos experientes, geram um propelente explosivo.',
    gameEffect: 'Teste de Ciência (Química) DV 18 e Demolições DV 18 para fabricar um explosivo leve improvisado (3d6 de dano).',
  },
  {
    roll: 10,
    name: 'Kit "Faça Seu Próprio Bicho de Pelúcia" (Crochê Rápido)',
    costEb: 10,
    category: 'Artesanato',
    description: 'Agulha plástica, novelo de lã sintética azul, enchimento de fibra e dois olhos de botão com folheto explicativo.',
    gameEffect: 'Passar uma hora fazendo crochê acalma a mente (+1 em testes de Resistência à Tortura/Drogas).',
  },
  {
    roll: 11,
    name: 'Baterias Universais de Emergência (3 Cargas)',
    costEb: 10,
    category: 'Eletrônicos',
    description: 'Células planas de íon-lítio com plugues universais adaptáveis para agentes, lanternas e rádios.',
    gameEffect: 'Recarrega qualquer gadget eletrônico descarregado instantaneamente.',
  },
  {
    roll: 12,
    name: 'Rolo de Fita Adesiva Militar Cinza (Duct Tape)',
    costEb: 10,
    category: 'Ferramenta Essencial',
    description: 'A ferramenta mais universal do universo. Cola armaduras quebradas, amordaça prisioneiros e prende cabos soltos.',
    gameEffect: 'Concede +1 em testes improvisados de Técnica Básica para reparos rápidos.',
  },
  {
    roll: 13,
    name: 'Cortador de Unhas de Titânio Compacto',
    costEb: 3,
    category: 'Higiene Pessoal',
    description: 'Lâminas afiadas de precisão que cortam cabos de cobre finos tão bem quanto unhas.',
    gameEffect: 'Pode ser usado como alicate desencapador de fios de emergência.',
  },
  {
    roll: 14,
    name: 'Caixa de Tampões e Absorventes Descartáveis',
    costEb: 4,
    category: 'Higiene & Curativos',
    description: 'Material absorvente estéril descartável embalado individualmente.',
    gameEffect: 'Higiene pessoal essencial de rua; pode improvisar curativo de pressão leve.',
  },
  {
    roll: 15,
    name: 'Tubos de Condimentos de Bolso (Furikake, Pimenta e Melaço)',
    costEb: 3,
    category: 'Gastronomia de Rua',
    description: 'Frascos minúsculos com molho apimentado e raspas de alga desidratada projetados para fazer ração kibble ter sabor.',
    gameEffect: 'Remove a penalidade moral de consumir ração de sobrevivência sem gosto.',
  },
  {
    roll: 16,
    name: 'Lata de Silly String (Espuma em Spray Inflamável)',
    costEb: 5,
    category: 'Detector de Armadilhas',
    description: 'Spray que dispara fios pegajosos e levíssimos de plástico colorido a até 5 metros de distância.',
    gameEffect: 'Excelente para revelar fios de armadilhas invisíveis (tripwires) sem detoná-los.',
  },
  {
    roll: 17,
    name: 'Pacote de Miçangas Plásticas de Cabelo (200 un)',
    costEb: 3,
    category: 'Acessório & Tático',
    description: 'Pequenas contas plásticas brilhantes e escorregadias usadas para tranças.',
    gameEffect: 'Espalhar no chão força quem correr sobre a área a passar em teste de Destreza DV 13 ou cair no chão.',
  },
  {
    roll: 18,
    name: 'Envelope com Figurinhas "Heartthrobs of Arasaka High"',
    costEb: 5,
    category: 'Colecionável & Propaganda',
    description: 'Pacote com 6 cromos holográficos de personagens de um simulador de namoro corporativo da Arasaka.',
    gameEffect: 'Troca imediata com crianças de rua para obter informações sobre movimentação de gangues.',
  },
  {
    roll: 19,
    name: 'Alho-Poró Plástico Musical com Luzes LED (Neopop Leek)',
    costEb: 10,
    category: 'Brinquedo Sonoro',
    description: 'Um legume de plástico gigante com alto-falante que toca uma canção neopop estridente ao ser girado.',
    gameEffect: 'Teste de COOL DV 12 para quem ouvir ou perderá 1 ponto de Humanidade temporário com a música grudada na cabeça!',
  },
  {
    roll: 20,
    name: 'Saco para Cadáver Reforçado com Zíper Duplo (Body Bag)',
    costEb: 15,
    category: 'Serviço Funerário / Saco de Dormir',
    description: 'Bolsa de vinil impermeável com zíper hermético, alças de transporte e forro anti-vazamento de fluidos.',
    gameEffect: 'Transporte limpo de corpos para o necrotério; pode ser usado com cobertor como saco de dormir térmico impermeável.',
  },
];

// ========================================================
// 4. STUFF YOU FIND ON A CORPSE (20 ITENS DE REVISTA RÁPIDA)
// ========================================================
export const CORPSE_LOOT_TABLE: CorpseLootItem[] = [
  {
    roll: 1,
    item: 'Bilhete Premiado da Loteria de Corpos do Dia',
    resaleEb: 450,
    description: 'O bilhete teria pago 450eb se o portador estivesse vivo para resgatá-lo nas máquinas da prefeitura.',
    storyHook: 'Você pode tentar resgatar o prêmio com um Fixer desonesto mediante comissão de 20%.',
  },
  {
    roll: 2,
    item: 'Fotos Ensanguentadas de Famílias Desconhecidas',
    resaleEb: 0,
    description: 'Quatro fotos de famílias diferentes com crianças sorrindo, manchadas de sangue seco nas bordas. Nenhuma é parente dele.',
    storyHook: 'O falecido era um caçador de recompensas serial que guardava fotos das casas que invadia.',
  },
  {
    roll: 3,
    item: 'Sachês de Lubrificante Térmico e Preservativos Coloridos',
    resaleEb: 10,
    description: 'Três preservativos fosforescentes e dois sachês de gel lubrificante com sabor de mentol radioativo.',
    storyHook: 'Ele estava a caminho de um encontro romântico no Dilly’s antes de cruzar seu caminho.',
  },
  {
    roll: 4,
    item: 'Caixa Criogênica com Abelha Rainha Bioengenheirada da Biotechnica',
    resaleEb: 800,
    description: 'Caixa térmica do tamanho de um maço de cigarros com bateria ativa mantendo viva uma abelha rainha modificada.',
    storyHook: 'A Biotechnica pagará 800eb por ela, ou um cultivador dos Badlands pagará o dobro em armas.',
  },
  {
    roll: 5,
    item: 'Fio Dental Dental-Wire de Tungstênio com Cortador',
    resaleEb: 25,
    description: 'Fio finíssimo de liga metálica ultra-cortante disfarçado em um estojo higiênico comum.',
    storyHook: 'Pode ser usado como garrote assassino silencioso em testes de Furtividade.',
  },
  {
    roll: 6,
    item: 'Dedo Mecânico Sobressalente com Conector USB-C',
    resaleEb: 75,
    description: 'Uma falange robótica de cromo com tampa removível que esconde um pendrive de 64 Terabytes.',
    storyHook: 'Contém uma pasta com fotos de vigilância dos fundos de um banco em Japantown.',
  },
  {
    roll: 7,
    item: 'Caixa de Fósforos de Hotel de Luxo com Código de Cofre Anotado',
    resaleEb: 300,
    description: 'Fósforos com logo do hotel L’Ermitage e uma anotação manuscrita: "Quarto 1402 // Senha 8941".',
    storyHook: 'Gancho imediato para invadir o quarto e saquear o cofre antes que a gerência descubra a morte.',
  },
  {
    roll: 8,
    item: 'Dente Fossilizado de Tubarão Pré-Guerra',
    resaleEb: 40,
    description: 'Fóssil pontiagudo e polido com furo para cordão de couro. Um amuleto de boa sorte de marinheiro.',
    storyHook: 'Identifica o portador como alguém que já prestou serviços para os Nômades Flotsam do porto.',
  },
  {
    roll: 9,
    item: 'Pastilhas de Menta Derretidas e Coladas no Papel',
    resaleEb: 2,
    description: 'Balas de hortelã coladas pela quentura do corpo. Ainda cheiram bem.',
    storyHook: 'Remove mau hálito imediatamente em testes sociais de sedução.',
  },
  {
    roll: 10,
    item: 'Seixo Cinza Bruto que é uma Gema Preciosa Não Lapidada',
    resaleEb: 600,
    valueFormula: '3d10 x 20eb (média 600eb)',
    description: 'Uma pedra comum à primeira vista, mas que ao ser avaliada em joalheria revela ser uma safira bruta pura.',
    storyHook: 'Exige teste de Avaliação DV 13 para perceber seu valor real antes de jogá-la fora.',
  },
  {
    roll: 11,
    item: 'Batom de Grife Chanel Rouge Noire Quase Cheio',
    resaleEb: 38,
    description: 'Tubo de batom importado de luxo em liga de latão pesado. Cor vinho escuro clássico.',
    storyHook: 'Pode ser vendido no mercado de luxo ou dado como presente em um encontro de Digital Dating.',
  },
  {
    roll: 12,
    item: 'Micro-Kit de Sobrevivência em Lata de Balas',
    resaleEb: 50,
    description: 'Lata com fósforos impermeáveis, cobertor térmico mylar, linha de pesca com anzol, bisturi e micro-bússola.',
    storyHook: 'Concede +1 em qualquer teste de sobrevivência ao ar livre nos Badlands.',
  },
  {
    roll: 13,
    item: 'Garrote com Corda de Piano e Hashis Descartáveis',
    resaleEb: 30,
    description: 'Arame fino trançado com as pontas enroladas em pauzinhos de comida chinesa. Manchas escuras suspeitas no metal.',
    storyHook: 'Arma de estrangulamento silenciosa usada por assassinos contratados da Maelstrom.',
  },
  {
    roll: 14,
    item: 'Identidades e Passaportes Falsos com Nomes Diferentes',
    resaleEb: 200,
    description: 'Três identidades falsas de alta qualidade com fotos do falecido sob nomes e profissões distintas.',
    storyHook: 'Um Fixer de documentos falsos pagará 200eb para raspar os dados e reutilizar as bases magnéticas.',
  },
  {
    roll: 15,
    item: 'Carta Manuscrita Dobrada Dezenas de Vezes',
    resaleEb: 0,
    description: 'Papel amarelado com texto frágil de uma pessoa querida implorando para que ele largasse a vida de mercenário.',
    storyHook: 'Um gancho dramático de arrependimento e consequências humanas da violência urbana.',
  },
  {
    roll: 16,
    item: 'Lata de Alumínio com Perfume Sólido Importado',
    resaleEb: 35,
    description: 'Bálsamo aromático concentrado com fragrância picante de especiarias e flores raras.',
    storyHook: 'Concede +1 em testes sociais com a alta sociedade corporativa.',
  },
  {
    roll: 17,
    item: 'Brinco Único de Plástico Fluo em Formato de Crânio',
    resaleEb: 10,
    description: 'Brinco chamativo dos anos 2000 que brilha em verde sob luz negra. O par provavelmente foi perdido em combate.',
    storyHook: 'Pode ser reconhecido por gangers da mesma facção como marca de um parceiro abatido.',
  },
  {
    roll: 18,
    item: 'Ampola de Vidro com Cianeto de Ação Imediata',
    resaleEb: 150,
    description: 'Cápsula dental com borracha preta projetada para morder e ingerir em caso de captura e tortura.',
    storyHook: 'Veneno letal concentrado: ingerir causa 8d6 de dano mortal sem direito a teste de resistência.',
  },
  {
    roll: 19,
    item: 'Caixa de Porcelana com Réplica de Cera de um Dedo Decepado',
    resaleEb: 80,
    description: 'Caixa delicada vermelha com a réplica exata em cera do dedo de alguém com anel dourado moldado.',
    storyHook: 'Um aviso sinistro ou recordação macabra deixada por um agiota de Heywood.',
  },
  {
    roll: 20,
    item: 'Recibo de Casa de Penhores de Heywood',
    resaleEb: 400,
    valueFormula: '2d10 x 20eb (média 400eb)',
    description: 'Comprovante numerado da casa de penhores "O Penhor de Ouro" em Heywood com resgate válido por mais 5 dias.',
    storyHook: 'Indo até a loja com o recibo e pagando a taxa de 50eb, a equipe resgata um item valioso penhorado!',
  },
];

// ========================================================
// 5. STREET FOOD OF NIGHT CITY (20 COMIDAS DE RUA)
// ========================================================
export const STREET_FOOD_TABLE: StreetFoodItem[] = [
  {
    roll: 1,
    name: 'Batata-Doce Assada no Tambor de Óleo (Roasted Sweet Potato)',
    costEb: 2,
    originCulture: 'Japonesa / Coreana / Chinesa',
    servingStyle: 'Servida pelando em papel de jornal sintético',
    description: 'Batata assada inteira em tambor de metal aquecido com carvão vegetal sintético. Casca tostada e polpa macia e fumegante.',
    flavorNotes: 'Doce, reconfortante e quente; excelente para noites frias de chuva ácida.',
  },
  {
    roll: 2,
    name: 'Bubur Pulot Hitam (Mingau de Arroz Negro com Creme de Coco)',
    costEb: 5,
    originCulture: 'Malaia / Sudeste Asiático',
    servingStyle: 'Tigela térmica descartável',
    description: 'Grãos de arroz negro impressos em 3D cozidos com açúcar de palma e regados com creme de coco sintético aveludado.',
    flavorNotes: 'Doce e aveludado com notas terrosas de nozes.',
  },
  {
    roll: 3,
    name: 'Snail Noodles (Macarrão com Caramujos em Caldo Picante)',
    costEb: 7,
    originCulture: 'Chinesa do Sul',
    servingStyle: 'Tigela grande fumegante com palitos descartáveis',
    description: 'Macarrão elástico de amido cozido rapidamente em caldo espesso e salgado, coberto com carne temperada de caramujo de fazenda de algas.',
    flavorNotes: 'Sabor terroso, salgado, picante e rico em proteínas baratas.',
  },
  {
    roll: 4,
    name: 'Street Tamales no Vapor em Folha de Milho Sintética',
    costEb: 3,
    originCulture: 'Mexicana / Heywood',
    servingStyle: 'Enrolado quente em embalagem plástica térmica',
    description: 'Massa de milho nixtamalizada no vapor recheada com carne falsa temperada, queijo sintético derretido e pimentas jalapeño.',
    flavorNotes: 'Massa macia e aromática que derrete na boca com queimação picante.',
  },
  {
    roll: 5,
    name: 'Water Cakes de Tapioca com Nabo em Conserva (Chwee Kueh)',
    costEb: 5,
    originCulture: 'Singapurense / Tailandesa',
    servingStyle: 'Prato com 3 bolinhos em formato de OVNI',
    description: 'Bolinhos translúcidos de fécula de tapioca cozidos no vapor, cobertos com nabo salgado picado e pasta ardida de pimenta vermelha.',
    flavorNotes: 'Textura gelatinosa suave que contrasta com a crocância salgada do nabo.',
  },
  {
    roll: 6,
    name: 'Acarajé Crocante de Feijão-Fradinho com Vatapá (Akara)',
    costEb: 2,
    originCulture: 'Brasileira / Nigeriana',
    servingStyle: 'Frito na hora e servido em guardanapo oleoso',
    description: 'Bolinho de massa de feijão-fradinho batido e frito em azeite de dendê fervente, aberto ao meio e recheado com pasta de camarão sintético e pimenta.',
    flavorNotes: 'Crocante por fora, macio por dentro com aroma intenso de dendê.',
  },
  {
    roll: 7,
    name: 'Ovos Cozidos no Chá Preto com Especiarias (Tea Eggs)',
    costEb: 2,
    originCulture: 'Japonesa / Chinesa / Kabuki',
    servingStyle: 'Dois ovos com casca rachada em saquinho de papel',
    description: 'Ovos cozidos (ou esferas moldadas de tofu firme) imersos por horas em infusão de chá preto, canela, anis estrelado e molho de soja.',
    flavorNotes: 'Padrão marmorizado na clara com gosto salgado, aromático e defumado.',
  },
  {
    roll: 8,
    name: 'Espetinho de Carne Misteriosa Grelhada no Carvão (Mystery Skewer)',
    costEb: 3,
    originCulture: 'Rua de Night City / Zona de Combate',
    servingStyle: 'Espeto de bambu queimado com molho barbecue neon',
    description: 'Pedaços de carne fibrosa marinados em vinagre e pimenta, tostados na grelha de latão. O vendedor jura que é porco sintético.',
    flavorNotes: 'Muito tostado, defumado e bem temperado para mascarar a procedência duvidosa.',
  },
  {
    roll: 9,
    name: 'Baozi Recheado no Vapor (Steamed Pork Bao)',
    costEb: 4,
    originCulture: 'Chinesa / Kabuki',
    servingStyle: 'Dois pães redondos fofos em caixa de bambu',
    description: 'Pães brancos macios cozidos no vapor com recheio suculento de carne de porco clonada, cebolinha fresca e óleo de gergelim.',
    flavorNotes: 'Massa leve como nuvem com explosão de caldo quente e saboroso por dentro.',
  },
  {
    roll: 10,
    name: 'Cachorro-Quente de Kibble Frito com Mostarda Neon',
    costEb: 3,
    originCulture: 'Americana / Continental Brands',
    servingStyle: 'Pão d’água longo com salsicha empanada',
    description: 'Salsicha de extrato proteico empanada em farelo de kibble frito, coberta com relish fluorescente e mostarda picante.',
    flavorNotes: 'Crocante, ultra-salgado e gorduroso; a clássica comida de mercenário sem dinheiro.',
  },
  {
    roll: 11,
    name: 'Pastel Frito de Queijo Sintético e Palmito Hidropônico',
    costEb: 3,
    originCulture: 'Brasileira / Little China',
    servingStyle: 'Envelope retangular dourado e borbulhante',
    description: 'Massa fina e crocante estufada de ar, recheada com queijo derretido de soja e pedaços de palmito cultivado em estufas verticais.',
    flavorNotes: 'Crocante que estala a cada mordida com queijo puxando fios quentes.',
  },
  {
    roll: 12,
    name: 'Takoyaki de Polvo de Algas com Molho Tarê e Flocos',
    costEb: 5,
    originCulture: 'Japonesa / Japantown',
    servingStyle: 'Bandeja com 6 esferas e palito duplo',
    description: 'Bolinhos redondos de massa de farinha com pedaços de tentáculo de polvo clone, cobertos com molho agridoce tarê e maionese.',
    flavorNotes: 'Massa cremosa e quente por dentro com contraste da alga tostada.',
  },
  {
    roll: 13,
    name: 'Wrap de Falafel com Molho Tahine e Pão Sírio',
    costEb: 4,
    originCulture: 'Oriente Médio / Vista del Rey',
    servingStyle: 'Enrolado em papel alumínio lacrado',
    description: 'Bolinhos fritos de grão-de-bico com cominho e salsa, envolvidos em pão sírio fino com pasta cremosa de gergelim e picles.',
    flavorNotes: 'Seco e crocante com acidez equilibrada do picles e molho tahine.',
  },
  {
    roll: 14,
    name: 'Bolinhos de Peixe no Vapor com Molho Doce de Pimenta',
    costEb: 6,
    originCulture: 'Vietnamita / Docas do Porto',
    servingStyle: 'Pacote de papel alumínio do tamanho de um punho',
    description: 'Pasta prensada de peixe de cativeiro e amido moldada em esferas elásticas cozidas no vapor e regadas com molho de peixe.',
    flavorNotes: 'Textura borrachosa típica e sabor marinho intenso com fundo de alho.',
  },
  {
    roll: 15,
    name: 'Samosas Crocantes de Batata com Curry Picante',
    costEb: 3,
    originCulture: 'Indiana / Central Asiática',
    servingStyle: 'Duas unidades triangulares fritas',
    description: 'Massa folhada fina e crocante recheada com purê de batatas condimentado com sementes de mostarda, ervilhas e curry.',
    flavorNotes: 'Aroma rico de especiarias que aquece a garganta.',
  },
  {
    roll: 16,
    name: 'Shaved Ice com Xaropes Fluorescentes (Kakigori)',
    costEb: 6,
    originCulture: 'Japonesa / Havaiana',
    servingStyle: 'Copo descartável de 350ml com colherinha de plástico',
    description: 'Gelo ralado finamente em máquina manual até virar neve, regado com xaropes de groselha azul, melão neon e leite condensado falso.',
    flavorNotes: 'Refrescante e doce; congela o cérebro em dias de calor escaldante.',
  },
  {
    roll: 17,
    name: 'Chips de Algas Marinhas Crocantes com Sal Marinho',
    costEb: 4,
    originCulture: 'Japonesa / Nômades Flotsam',
    servingStyle: 'Saco de papel pardo cheio',
    description: 'Folhas de alga cultivada na baía, secas ao sol, polvilhadas com sal grosso e fritas rapidamente em óleo vegetal.',
    flavorNotes: 'Crocante, leve, salgado e rico em iodo natural e vitaminas do complexo B.',
  },
  {
    roll: 18,
    name: 'Ful Medames (Fava Cozida Cremosa com Azeite e Limão)',
    costEb: 4,
    originCulture: 'Egípcia / Oriente Médio',
    servingStyle: 'Copo térmico de 350ml com pão achatado',
    description: 'Favas cozidas lentamente por horas até desmancharem em pasta aveludada, temperadas com sal, alho amassado e suco de limão.',
    flavorNotes: 'Alimento extremamente substancioso que sustenta um trabalhador por 10 horas.',
  },
  {
    roll: 19,
    name: 'Gimbap de Rua (Rolinhos de Arroz e Alga com Rabanete)',
    costEb: 3,
    originCulture: 'Coreana / Little China',
    servingStyle: 'Rolo fatiado em 8 pedaços enrolado em filme plástico',
    description: 'Rolos de alga nori prensada recheados com arroz temperado com óleo de gergelim, tiras de ovo mexido e rabanete em conserva agridoce.',
    flavorNotes: 'Excelente para comer andando entre tiroteios sem sujar as mãos.',
  },
  {
    roll: 20,
    name: 'Barra de Chocolate Empanada e Frita no Óleo Quente',
    costEb: 3,
    originCulture: 'Britânica / Americana de Feira',
    servingStyle: 'Servida em espeto de madeira pingando óleo',
    description: 'Uma barra inteira de chocolate sintético com caramelo mergulhada em massa doce de panqueca e frita em óleo fervente.',
    flavorNotes: 'Pecado gastronômico puro: casca crocante com interior de chocolate derretido e fumegante.',
  },
];

// ========================================================
// 6. STREET DRINKS OF NIGHT CITY (20 BEBIDAS DE RUA)
// ========================================================
export const STREET_DRINKS_TABLE: StreetDrinkItem[] = [
  {
    roll: 1,
    name: 'Chá Gelado de Cevada com Limão (Lemon Barley Water)',
    costEb: 5,
    originCulture: 'Inglesa',
    drinkType: 'Refresco Gelado Não-Alcoólico',
    description: 'Água cozida com grãos de cevada adoçada com açúcar sintético e essência de limão siciliano servida com pedras de gelo.',
    effectsOrHangover: 'Alivia o calor e a garganta ressecada por fumaça de incêndios urbanos.',
  },
  {
    roll: 2,
    name: 'Air Bandung (Leite de Soja Gelado com Xarope de Rosas)',
    costEb: 6,
    originCulture: 'Malaia',
    drinkType: 'Bebida Doce Refrescante',
    description: 'Leite vegetal de soja emulsionado tingido de rosa vivo com essência doce de pétalas de rosas e gelo moído.',
    effectsOrHangover: 'Muito aromático e relaxante; acalma os nervos após uma perseguição a pé.',
  },
  {
    roll: 3,
    name: 'The Monowhip (Coquetel Explosivo de Vodka e Habanero)',
    costEb: 20,
    originCulture: 'Bares Corporativos de Night City',
    drinkType: 'Coquetel Alcoólico Forte',
    description: '60ml de vodka pura, 60ml de xarope de abacaxi, infusão de hibisco e gotas de molho de pimenta habanero batidos na coqueteleira.',
    effectsOrHangover: '+1 em Iniciativa pela queimação imediata, mas exige teste de Físico DV 12 para não ter azia ácida.',
  },
  {
    roll: 4,
    name: 'Caldo Restaurador de Noodles em Copo Térmico',
    costEb: 5,
    originCulture: 'Japonesa / Chinesa de Beco',
    drinkType: 'Caldo Nutritivo Salgado',
    description: 'Copo térmico com caldo salgado fumegante enriquecido com colágeno e cebolinha. Pode levar uma dose de aguardente por +2eb.',
    effectsOrHangover: 'Cura ressacas pesadas em 15 minutos e recupera o ânimo após combates exaustivos.',
  },
  {
    roll: 5,
    name: 'Garapa Sintética de Cana com Limão Cravo',
    costEb: 5,
    originCulture: 'Brasileira / Tropical',
    drinkType: 'Energético Natural de Rua',
    description: 'Extrato doce de cana prensada em moenda mecânica servida com limão espremido na hora e gelo.',
    effectsOrHangover: 'Disparo imediato de glicose: recupera 1 ponto temporário de LUCK por 1 hora.',
  },
  {
    roll: 6,
    name: 'Glögg Quente com Especiarias e Aguardente',
    costEb: 10,
    originCulture: 'Nórdica / Escandinava',
    drinkType: 'Bebida Quente Alcoólica',
    description: 'Vinho tinto sintético aquecido em caldeirão com canela, cravo, raspas de casca de laranja e finalizado com dose de cachaça de rua.',
    effectsOrHangover: 'Excelente aquecedor corporal em noites de chuva ácida gelada; concede imunidade a tremedeira de frio.',
  },
  {
    roll: 7,
    name: 'Champurrado Espesso de Chocolate e Milho',
    costEb: 5,
    originCulture: 'Mexicana / Heywood',
    drinkType: 'Bebida Quente Cremosa',
    description: 'Bebida grossa à base de farinha de milho cozida com leite de soja, raspas de chocolate escuro e canela em pó.',
    effectsOrHangover: 'Enche o estômago e substitui uma refeição completa de café da manhã.',
  },
  {
    roll: 8,
    name: 'Bhang Tradicional de Cannabis em Leite de Soja',
    costEb: 10,
    originCulture: 'Indiana / Comuna Hippie',
    drinkType: 'Infusão Fitoterápica com Canabinóides',
    description: 'Folhas e flores trituradas de cannabis cultivada no telhado infusionadas em leite de soja morno com noz-moscada e mel de glicose.',
    effectsOrHangover: 'Alivia dores crônicas (+2 em resistência à dor por 3 horas), mas reduz Reflexos em -1.',
  },
  {
    roll: 9,
    name: 'Smash Gelado em Lata Amassada',
    costEb: 4,
    originCulture: 'Continental Brands / Comercial',
    drinkType: 'Bebida Alcoólica Fermentada Barata',
    description: 'A bebida alcoólica mais onipresente de Night City: líquido amarelo efervescente e muito doce com 8% de teor alcoólico.',
    effectsOrHangover: 'Deixa alegre e descontraído, mas a ressaca da manhã seguinte causa -1 em Percepção.',
  },
  {
    roll: 10,
    name: 'Café Preto de Chicória com Dose Dupla de Cafeína Pura',
    costEb: 4,
    originCulture: 'Rua de Night City',
    drinkType: 'Estimulante Pesado',
    description: 'Infusão escura e amarga feita de raiz de chicória torrada, fortificada com cristais químicos de cafeína anidra 200mg.',
    effectsOrHangover: 'Mantém o personagem acordado em vigília a noite inteira sem sofrer penalidades de sono.',
  },
  {
    roll: 11,
    name: 'Refrigerante Choc-Cola Efervescente',
    costEb: 3,
    originCulture: 'Continental Brands',
    drinkType: 'Refrigerante Gaseificado',
    description: 'Refrigerante com sabor artificial híbrido de cola tradicional e chocolate amargo com gás borbulhante.',
    effectsOrHangover: 'Bebida comum de rua apreciada por gangers e adolescentes.',
  },
  {
    roll: 12,
    name: 'Cerveja de Arroz Puro Fermentada em Tambor de Plástico',
    costEb: 5,
    originCulture: 'Japonesa / Kabuki',
    drinkType: 'Cerveja Artesanal de Beco',
    description: 'Cerveja turva de cor palha fermentada por contrabandistas de Kabuki com arroz quebrado e leveduras ativas.',
    flavorNotes: 'Frutada, seca e surpreendentemente refrescante.',
    effectsOrHangover: 'Leve tontura relaxante; ajuda a quebrar o gelo em negociações com comerciantes locais.',
  },
  {
    roll: 13,
    name: 'Kombucha de Chá Verde com Gengibre e Raízes',
    costEb: 6,
    originCulture: 'Mercados Alternativos',
    drinkType: 'Bebida Fermentada Probiótica',
    description: 'Chá fermentado por cultura de bactérias benéficas com sabor ácido efervescente e picância de gengibre fresco.',
    effectsOrHangover: 'Auxilia na recuperação biológica (+1 em testes de Cura Natural).',
  },
  {
    roll: 14,
    name: 'Hidromel Sintético com Mel de Algas e Cravo',
    costEb: 7,
    originCulture: 'Escandinava / Nômade',
    drinkType: 'Fermentado Alcoólico Doce',
    description: 'Bebida fermentada à base de néctar sintético de flores hidropônicas e mel de algas com teor alcoólico de 12%.',
    effectsOrHangover: 'Sabor rico que aquece o peito e induz sono profundo e reparador.',
  },
  {
    roll: 15,
    name: 'Vodka Clandestina Destilada em Radiador (Moonshine de Arroyo)',
    costEb: 6,
    originCulture: 'Zona de Combate',
    drinkType: 'Destilado Alcoólico Potente (60%)',
    description: 'Líquido límpido e brutal destilado a partir de restos de kibble e cascas de batata em tubulações industriais.',
    effectsOrHangover: 'Desinfeta ferimentos de emergência; beber exige teste de Físico DV 13 ou fica enjoado.',
  },
  {
    roll: 16,
    name: 'Batida de Coco com Cachaça Sintética e Leite Condensado',
    costEb: 6,
    originCulture: 'Brasileira / Vista del Rey',
    drinkType: 'Coquetel Cremoso Doce',
    description: 'Mistura cremosa de cachaça de cana sintética com leite de coco e leite condensado batida com bastante gelo picado.',
    effectsOrHangover: 'Bebida doce e perigosa: quase não se sente o gosto do álcool até tentar levantar da cadeira.',
  },
  {
    roll: 17,
    name: 'Bebida Eletrolítica Neon com Guaraná e Taurina (Cyber-Drop)',
    costEb: 5,
    originCulture: 'Japantown / Arcades',
    drinkType: 'Energético Isotônico',
    description: 'Garrafa plástica com bico esportivo cheia de líquido azul brilhante sob luz negra com eletrólitos e vitaminas.',
    effectsOrHangover: 'Restaura a hidratação e elimina fadiga muscular após fugas em alta velocidade.',
  },
  {
    roll: 18,
    name: 'Mate Gelado com Limão em Copo Térmico Longo',
    costEb: 4,
    originCulture: 'Sul-Americana',
    drinkType: 'Chá Gelado Estimulante',
    description: 'Infusão tostada de erva-mate servida com suco de limão e bastante gelo em copo de policarbonato fosco.',
    effectsOrHangover: 'Foco mental prolongado sem a tremedeira causada por energéticos sintéticos.',
  },
  {
    roll: 19,
    name: 'Tequila Prata Clandestina com Sal e Fatias de Limão',
    costEb: 8,
    originCulture: 'Mexicana / Heywood',
    drinkType: 'Dose de Destilado com Ritual',
    description: 'Dose servida no balcão de madeira com uma pitada de sal na dobra da mão e fatia suculenta de limão sintético.',
    effectsOrHangover: '+1 em testes de Coragem e Intimidação por 30 minutos após o shot.',
  },
  {
    roll: 20,
    name: 'Elixir dos Monges de Watson (Infusão Amarga de Meditação)',
    costEb: 7,
    originCulture: 'Templo Budista de Kabuki',
    drinkType: 'Infusão de Raízes e Flores de Lótus',
    description: 'Bebida morna e muito amarga preparada pelos monges com raízes desidratadas e essências sedativas de lótus.',
    effectsOrHangover: 'Reduz temporariamente a perda de Humanidade e afasta pensamentos homicidas da ciberpsicose.',
  },
];

// ========================================================
// 7. STRANGERS ON THE SUBWAY (20 ENCONTROS NO METRÔ)
// ========================================================
export const SUBWAY_ENCOUNTERS_TABLE: SubwayStrangerItem[] = [
  {
    roll: 1,
    title: 'Veterano Patriota Desabrigado da 4ª Guerra',
    visual: 'Homem magro usando jaqueta militar esfarrapada, boné "Make America United Again" e pin desbotado de campanha presidencial.',
    quirkOrItem: 'Pede moedas em troca de contar histórias das batalhas navais do Panamá.',
    gmEncounterHook: 'Se tratado com respeito e alimentado, revela a localização de uma escotilha secreta de esgoto com munição guardada.',
  },
  {
    roll: 2,
    title: 'A Mulher Discreta com Agulhas de Tricô de Aço',
    visual: 'Mulher vestindo sobretudo cinza despretensioso tricotando meias de lã vermelha viva sem levantar a cabeça.',
    quirkOrItem: 'As agulhas de aço são compridas, pontiagudas como adagas de assassino e muito rápidas.',
    gmEncounterHook: 'Ela na verdade é uma Solo aposentada de plantão protegendo uma criança no vagão adjacente.',
  },
  {
    roll: 3,
    title: 'Duas Posergangers com Biosculpt de Dating Sim dos Anos 2000',
    visual: 'Duas garotas com cabelos azul-turquesa e rosa chiclete em maria-chiquinhas e olhos de anime com pupilas dilatadas.',
    quirkOrItem: 'Falam exclusivamente com frases clichês de colegiais de desenhos animados japoneses arcaicos.',
    gmEncounterHook: 'Se alguém caçoar delas, revelam lâminas de monofilamento ocultas sob as mangas de marinheiro.',
  },
  {
    roll: 4,
    title: 'O Homem do Sobretudo com Maleta Algemada',
    visual: 'Cidadão de meia-idade transpirando baldes com terno amarrotado e maleta de alumínio presa ao pulso por corrente de titânio.',
    quirkOrItem: 'Fica conferindo o relógio a cada dez segundos e olhando em pânico para as portas a cada estação.',
    gmEncounterHook: 'Está fugindo da Militech com uma amostra biológica e implora ajuda aos mercenários na próxima estação.',
  },
  {
    roll: 5,
    title: 'Pregador de Rua do Apocalipse da Rede',
    visual: 'Túnica feita de retalhos de cabos de fibra óptica e um monitor CRT antigo preso no peito exibindo ruído branco estático.',
    quirkOrItem: 'Proclama aos gritos profecias sobre a quebra da Blackwall e a descida das IAs selvagens sobre a humanidade.',
    gmEncounterHook: 'Algumas das frases que ele grita são códigos de firewall reais que quebram senhas de nós da Ziggurat.',
  },
  {
    roll: 6,
    title: 'Casal de Gangers Apaixonados com Armas Pesadas',
    visual: 'Dois jovens da gangue 6th Street cobertos de cromo de combate se beijando calorosamente com fuzis apoiados nas pernas.',
    quirkOrItem: 'Tatuagens combinadas de corações perfurados por cartuchos de calibre .50.',
    gmEncounterHook: 'Eles oferecem dicas de trânsito sobre bloqueios de gangues rivais se os personagens forem educados.',
  },
  {
    roll: 7,
    title: 'Criança Vendedora de Chips de Música e Doces',
    visual: 'Menina de 9 anos com mochila de rodinhas abarrotada de sachês de doces e cabos auriculares para teste de som.',
    quirkOrItem: 'Aborda os passageiros com um sorriso carismático e lábia impressionante de Fixer nata.',
    gmEncounterHook: 'Ela sabe exatamente quais patrulhas do DPNC estão revistando a saída da estação atual.',
  },
  {
    roll: 8,
    title: 'O Indivíduo Educado em Macacão de Látex Integral (Gimp)',
    visual: 'Pessoa vestindo terno completo de borracha sintética com máscara de zíperes nos olhos e boca.',
    quirkOrItem: 'Cede educadamente o assento para idosos ou gestantes e tenta pedir direções de forma tímida.',
    gmEncounterHook: 'Esqueceu de abrir o zíper da boca na primeira tentativa; é inofensivo e está apenas perdido a caminho de uma convenção.',
  },
  {
    roll: 9,
    title: 'Agente Disfarçado da NetWatch com Scanner Óptico',
    visual: 'Passageiro lendo um jornal digital com óculos escuros de onde escapa um brilho ciano intermitente.',
    quirkOrItem: 'Está escaneando passivamente a rede de todos os cyberdecks conectados no vagão do trem.',
    gmEncounterHook: 'Qualquer Netrunner no grupo nota a varredura se passar em teste de Interface DV 13.',
  },
  {
    roll: 10,
    title: 'Executivo Bêbado Chorando com Crachá Rasgado',
    visual: 'Terno executivo caríssimo desalinhado, garrafa de whisky quase vazia e gravata desfeita no chão do trem.',
    quirkOrItem: 'Repete que sua divisão de pesquisa inteira foi demitida sumariamente hoje de manhã pela diretoria.',
    gmEncounterHook: 'Se os PJs pagarem um táxi ou conversarem com ele, ele entrega o cartão de acesso da sede corporativa.',
  },
  {
    roll: 11,
    title: 'Músico de Rua com Shamisen Cibernético Amplificado',
    visual: 'Jovem com próteses auditivas douradas tocando um instrumento tradicional japonês conectado a uma caixa de som portátil.',
    quirkOrItem: 'As melodias criam um ambiente cinematográfico melancólico dentro do vagão em movimento.',
    gmEncounterHook: 'Passar uma gorjeta de 10eb rende um contato valioso com a cena underground de Japantown.',
  },
  {
    roll: 12,
    title: 'Técnico de Manutenção dos Trilhos Cheio de Graxa',
    visual: 'Macacão laranja fluorescente do consórcio metroviário, cinto pesado de chaves e capacete com lanterna desligada.',
    quirkOrItem: 'Dorme profundamente em pé segurando o corrimão com força inacreditável.',
    gmEncounterHook: 'Possui o molho de chaves magnéticas que abre as portas de serviço e estações fantasmas.',
  },
  {
    roll: 13,
    title: 'Refugiado dos Badlands com Gaiola de Pássaro Sintético',
    visual: 'Roupas empoeiradas de lona, botas de deserto e uma gaiola dourada com um canário mecânico que pia mecanicamente.',
    quirkOrItem: 'Olha fascinado para as luzes dos arranha-céus através da janela do trem.',
    gmEncounterHook: 'O canário mecânico contém um sensor de gases tóxicos que apita caso haja vazamento no túnel.',
  },
  {
    roll: 14,
    title: 'Vendedor Ilegal de Comida Quente em Caixa de Isopor',
    visual: 'Senhora empurrando carrinho com espetinhos fumegantes e baozi envolto em panos térmicos.',
    quirkOrItem: 'Olha desconfiada para as câmeras de vigilância do teto a cada curva do trem.',
    gmEncounterHook: 'Vende comida deliciosa por 2eb a unidade que restaura a energia dos personagens na hora.',
  },
  {
    roll: 15,
    title: 'Adolescente Hacker Tentando Alterar os Letreiros do Trem',
    visual: 'Garoto encostado na porta com cyberdeck portátil na cintura e mãos digitando freneticamente no ar com luvas virtuais.',
    quirkOrItem: 'O visor do vagão começa a exibir mensagens hilárias de provocação à polícia.',
    gmEncounterHook: 'Se o grupo ajudá-lo a escapar dos guardas da estação, ganham um aliado talentoso na rede.',
  },
  {
    roll: 16,
    title: 'Mercenária Ciborgue com Braço Hidráulico Desligado',
    visual: 'Mulher musculosa com braço mecânico industrial inerte pendurado em uma tipoia e fita isolante no ombro.',
    quirkOrItem: 'Segura um alicate de pressão com a mão biológica tentando religar um cabo desencapado.',
    gmEncounterHook: 'Um teste de Técnica Básica DV 13 por um PJ do grupo conserta o braço dela na hora, gerando gratidão eterna.',
  },
  {
    roll: 17,
    title: 'Estudante de Medicina Exausta Dormindo sobre Livros Grossos',
    visual: 'Jovem com jaleco branco sujo de café, bolsa pesada cheia de seringas e manuais anatômicos no colo.',
    quirkOrItem: 'Quase deixa cair uma pasta de exames clínicos a cada freada do monotrilho.',
    gmEncounterHook: 'Ela trabalha no hospital público e pode conseguir bolsas de sangue e remédios no hospital com desconto.',
  },
  {
    roll: 18,
    title: 'Dois Seguranças Privados da Arasaka em Traje de Passeio',
    visual: 'Dois homens de corte militar impecável, ternos pretos ajustados e postura atenta que não relaxa um segundo.',
    quirkOrItem: 'Estão voltando do turno de guarda e observam discretamente cada um que entra no vagão.',
    gmEncounterHook: 'Se os personagens tiverem itens ilegais à mostra, os seguranças colocam a mão no coldre por precaução.',
  },
  {
    roll: 19,
    title: 'Artista Urbano Pichador de Neon com Mochila de Tintas',
    visual: 'Jaqueta com capuz manchada de tinta aerossol fluorescente e máscara respiratória pendurada no pescoço.',
    quirkOrItem: 'Desenha esboços de grafite em um caderno de papel com traços rápidos e talentosos.',
    gmEncounterHook: 'Ele conhece todos os becos sem câmeras do distrito onde o trem vai parar.',
  },
  {
    roll: 20,
    title: 'Idoso Silencioso com Cão-Guia Cibernético Fiel',
    visual: 'Senhor com óculos escuros de lentes grossas e um pastor alemão cibernético com patas de titânio deitado aos seus pés.',
    quirkOrItem: 'O cão ergue as orelhas e rosna baixo se qualquer pessoa armada com intenção hostil se aproximar.',
    gmEncounterHook: 'O idoso é um ex-juiz lendário de Night City que vive sob anonimato no subúrbio.',
  },
];

// ========================================================
// 8. HOUSES OF WORSHIP (10 TEMPLOS & CULTOS DE NIGHT CITY)
// ========================================================
export const HOUSES_OF_WORSHIP_TABLE: HouseOfWorshipItem[] = [
  {
    id: 1,
    name: 'Templo Budista Guanyin Miao (Templo da Misericórdia)',
    deityOrCreed: 'Budismo Mahayana / Deusa da Compaixão Guanyin',
    district: 'Little China · Watson',
    architecture: 'Telhado curvado tradicional com lanternas vermelhas e incensários de bronze sob vigas de concreto reforçado.',
    community: 'Idosos, imigrantes asiáticos e famílias de refugiados que buscam paz espiritual e refeições gratuitas de arroz.',
    sanctuaryRule: 'É proibido entrar com armas destravadas no salão principal; brigas no recinto resultam em expulsão sumária.',
  },
  {
    id: 2,
    name: 'Gurdwara Sahib Sikh de Night City',
    deityOrCreed: 'Sikhismo / Igualdade Universal e Serviço',
    district: 'Rancho Coronado · Santo Domingo',
    architecture: 'Templo de mármore branco com cúpula dourada cercado por portões de ferro forjado e bandeiras açafrão.',
    community: 'Adherentes que mantêm a tradição do Langar: uma cozinha comunitária que serve comida quente gratuita a qualquer um que chegue, 24h por dia.',
    sanctuaryRule: 'Todos são bem-vindos, contanto que cubram a cabeça com um lenço e retirem os sapatos antes de entrar.',
  },
  {
    id: 3,
    name: 'Capela Clandestina de Santa Muerte (A Senhora das Sombras)',
    deityOrCreed: 'Culto Folclórico à Santa Muerte',
    district: 'The Glen · Heywood',
    architecture: 'Altar de azulejos coloridos com estátua de esqueleto em manto negro cercado por centenas de velas, charutos, tequila e flores de plástico.',
    community: 'Gangers dos Valentinos, profissionais do sexo, contrabandistas e pessoas à margem que pedem proteção contra mortes violentas.',
    sanctuaryRule: 'Promessas feitas à Santa Muerte nunca podem ser quebradas, sob pena de retaliação cármica imediata.',
  },
  {
    id: 4,
    name: 'Templo de Sri Ganesha (O Removedor de Obstáculos)',
    deityOrCreed: 'Hinduísmo / Lorde Ganesha',
    district: 'Novo Westbrook',
    architecture: 'Pórtico talhado em pedra artificial com flores de calêndula frescas e estátua do deus com cabeça de elefante segurando um machado e doces.',
    community: 'Engenheiros, estudantes e comerciantes que oram por sucesso antes de novos contratos ou expedições perigosas.',
    sanctuaryRule: 'Deixar uma moeda ou doce nos pés do altar concede uma bênção que remove a primeira falha crítica da sessão.',
  },
  {
    id: 5,
    name: 'A Primeira Igreja do SubGenius & Cibernética Transcendente',
    deityOrCreed: 'Ciber-Culto Transumanista / Transcendência Digital',
    district: 'Kabuki · Watson',
    architecture: 'Galpão industrial com telas piscando código binário verde, bobinas de Tesla e um altar feito de placas-mãe de servidores antigos.',
    community: 'Netrunners, técnicos e fiéis que acreditam que a alma humana é apenas um software esperando para ser carregado na Grande Rede.',
    sanctuaryRule: 'O batismo envolve sincronizar a interface neural com o servidor da igreja para receber uma bênção de dados.',
  },
  {
    id: 6,
    name: 'Santuário dos Mártires das Guerras (Mictlán de Heywood)',
    deityOrCreed: 'Sincrético / Culto aos Mortos da 4ª Guerra Corporativa',
    district: 'The Glen · Heywood',
    architecture: 'Muro memorial de 100 metros com milhares de nomes entalhados e nichos com cinzas funerárias iluminadas por velas eletrônicas.',
    community: 'Famílias de mercenários que perderam parentes nas guerras e oferecem orações e oferendas aos espíritos guardiões.',
    sanctuaryRule: 'Qualquer violência física dentro do santuário enfurece a comunidade inteira do bairro.',
  },
  {
    id: 7,
    name: 'Templo Pagão & Wicca Compartilhado dos Telhados',
    deityOrCreed: 'Neopaganismo / Culto à Mãe Natureza e Elementos',
    district: 'Charter Hill · Westbrook',
    architecture: 'Jardim suspenso no terraço de um prédio de 30 andares com círculo de pedras, plantas medicinais e fogueira ceremonial.',
    community: 'Curandeiras urbanas, bruxas modernas e ativistas ambientais que observam as fases da lua e solstícios.',
    sanctuaryRule: 'Concede acesso a ervas medicinais frescas que curam envenenamentos com teste de Primeiros Socorros DV 12.',
  },
  {
    id: 8,
    name: 'Terreiro de Ilé Ifá & Guardiões dos Orixás da Costa',
    deityOrCreed: 'Tradição Iorubá / Orixás e Ancestralidade',
    district: 'Pacifica Playground',
    architecture: 'Barracão de chão de terra batida perto da praia com atabaques rituais, cortinas brancas de algodão e altares para Ogum e Iemanjá.',
    community: 'Praticantes que realizam leituras de búzios sagrados e oferecem banhos de ervas para descarrego espiritual de combatentes.',
    sanctuaryRule: 'Consultar os búzios de Ifá com a mãe de santo revela uma pista essencial sobre o mistério ou vilão da missão atual.',
  },
  {
    id: 9,
    name: 'Catedral de Todos os Mártires de Santo Domingo',
    deityOrCreed: 'Catolicismo Romano Pós-Guerra',
    district: 'Santo Domingo',
    architecture: 'Catedral gótica de tijolos com vitrais blindados reforçados contra estilhaços de bomba e altares de santos com coletes de kevlar.',
    community: 'Trabalhadores fabris, veteranos e moradores locais que buscam confissão e assistência caritativa.',
    sanctuaryRule: 'Direito tradicional de santuário: policiais e forças de segurança não podem prender ninguém dentro da igreja.',
  },
  {
    id: 10,
    name: 'O Domo do Silêncio Zen (Zen Sanctuary & Anti-Noise)',
    deityOrCreed: 'Zen Laico / Silêncio Absoluto e Meditação',
    district: 'Downtown · City Center',
    architecture: 'Esfera geodésica com isolamento acústico militar avançado, jardim de pedras rasteladas e névoa aromática de cedro.',
    community: 'Executivos estressados, Solos com estresse pós-traumático e mercenários que precisam de silêncio absoluto longe da metrópole.',
    sanctuaryRule: 'É terminantemente proibido falar em voz alta ou usar armas; o silêncio total restaura a estabilidade psicológica.',
  },
];

// ========================================================
// HELPER ROLL FUNCTIONS
// ========================================================
export function rollSafeHouse(): SafeHouseItem {
  return SAFE_HOUSES_LIST[Math.floor(Math.random() * SAFE_HOUSES_LIST.length)];
}

export function rollHiddenStash(): HiddenStashItem {
  return HIDDEN_STASH_TABLE[Math.floor(Math.random() * HIDDEN_STASH_TABLE.length)];
}

export function rollVenditGoodie(): VenditGoodieItem {
  return VENDIT_MACHINE_TABLE[Math.floor(Math.random() * VENDIT_MACHINE_TABLE.length)];
}

export function rollCorpseLoot(): CorpseLootItem {
  return CORPSE_LOOT_TABLE[Math.floor(Math.random() * CORPSE_LOOT_TABLE.length)];
}

export function rollStreetFood(): StreetFoodItem {
  return STREET_FOOD_TABLE[Math.floor(Math.random() * STREET_FOOD_TABLE.length)];
}

export function rollStreetDrink(): StreetDrinkItem {
  return STREET_DRINKS_TABLE[Math.floor(Math.random() * STREET_DRINKS_TABLE.length)];
}

export function rollSubwayEncounter(): SubwayStrangerItem {
  return SUBWAY_ENCOUNTERS_TABLE[Math.floor(Math.random() * SUBWAY_ENCOUNTERS_TABLE.length)];
}

export function rollHouseOfWorship(): HouseOfWorshipItem {
  return HOUSES_OF_WORSHIP_TABLE[Math.floor(Math.random() * HOUSES_OF_WORSHIP_TABLE.length)];
}
