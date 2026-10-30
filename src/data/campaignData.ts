// ============================================================================
// CYBERPUNK RED: SISTEMA DE CAMPANHA, BEAT CHART, IMPROVISOS & TIMESKIP
// Conteúdo expandido com base no Livro de Regras Oficial, Tales of the RED,
// Black Chrome e Interface RED.
// ============================================================================

// ----------------------------------------------------------------------------
// 1. BEAT CHART (ESTRUTURA DE AVENTURAS OFICIAL DO CYBERPUNK RED)
// ----------------------------------------------------------------------------

export interface BeatTemplate {
  beatType: 'Hook' | 'Development' | 'Cliffhanger' | 'Twist' | 'Climax' | 'Resolution';
  titlePt: string;
  objective: string;
  tips: string;
  prompts: string[];
}

export const BEAT_CHART_STRUCTURE: BeatTemplate[] = [
  {
    beatType: 'Hook',
    titlePt: '1. O Gancho (The Hook)',
    objective: 'Apresentar a proposta de trabalho ou incidente perturbador que arrasta os personagens para a trama.',
    tips: 'Faça a oferta ter um elemento de urgência e envolva um contato pessoal, uma dívida do passado ou um pagamento tentador.',
    prompts: [
      'Um Fixer de confiança liga às 3h da manhã com uma proposta irrecusável que expira em duas horas.',
      'Uma testemunha ensanguentada desmaia na entrada do apartamento dos personagens segurando um chip criptografado.',
      'Um antigo amigo de infância dos Nômades pede socorro após ter sua carga confiscada por guardas corruptos do DPNC.',
      'Um executivo em desgraça da Arasaka oferece ações secretas e 3.000eb por cabeça em troca de uma rota de fuga limpa da cidade.',
      'Um Ripperdoc de confiança avisa que uma remessa vital de ciberóptica militar foi interceptada pelo Maelstrom e precisa de resgate rápido.',
      'Um repórter da Rede 54 promete expor a ficha suja da equipe caso eles não escoltem uma testemunha protegida até a meia-noite.',
      'Um sinal de socorro clandestino da Trauma Team apita no rádio de um dos PJs: uma AV caiu em plena Zona de Combate com um magnata a bordo.',
      'O dono do prédio ameaça despejar todos os personagens até o fim da semana a menos que resolvam um "problema de ratos cromados" no subsolo.',
    ],
  },
  {
    beatType: 'Development',
    titlePt: '2. Desenvolvimento (The Development)',
    objective: 'Investigação, reconhecimento do terreno, coleta de recursos e primeiro contato com a oposição.',
    tips: 'Permita que diferentes perícias (Netrunning, Streetwise, Human Perception, Furtividade, Táticas) brilhem.',
    prompts: [
      'A equipe precisa invadir a rede local de um armazém em Kabuki para roubar a planta de segurança do prédio.',
      'Interrogar um técnico de câmeras de segurança em uma boate lotada enquanto evitam chamar a atenção dos leões-de-chácara cromados.',
      'Negociar a compra de uniformes e crachás falsificados com um contrabandista de Heywood que exige um favor perigoso em troca.',
      'Fazer vigília noturna na chuva para mapear o padrão de patrulhas e trocas de turno da escolta armada.',
      'Rastrear a frequência de rádio de uma van de transporte blindada enquanto cruzam as pontes vigiadas de Night City.',
      'Infiltrar-se como garçons ou técnicos de som em uma festa corporativa exclusiva em Charter Hill para plantar um grampo eletrônico.',
      'Visitar um Night Market secreto no Porto de Night City para conseguir um explosivo plástico ou um programa anti-ICE militar.',
      'Subornar um despachante portuário desiludido com 200eb e uma garrafa de uísque sintético importado para liberar a listagem de contêineres.',
    ],
  },
  {
    beatType: 'Cliffhanger',
    titlePt: '3. O Gancho Dramático (The Cliffhanger)',
    objective: 'Uma complicação repentina que eleva a aposta e ameaça arruinar o plano antes da execução.',
    tips: 'Crie uma sensação de pressão imediata: o tempo está acabando, uma traição desponta ou o perigo físico é iminente.',
    prompts: [
      'A sirene do prédio dispara inesperadamente: o cliente foi preso ou a carga foi movida para outro setor com 1 hora de antecedência!',
      'Um esquadrão rival de Solos chega ao mesmo local exatamente com a mesma missão e abre fogo contra a entrada!',
      'O sistema de câmeras reconhece o rosto de um dos personagens e tranca todas as saídas de emergência com portas corta-fogo blindadas!',
      'Uma chuva ácida severa começa a corroer os veículos de fuga enquanto tiros são disparados do telhado vizinho por atiradores de elite!',
      'O Netrunner da equipe aciona sem querer um Black ICE Hellhound que incendeia seu cyberdeck e ameaça fritar suas sinapses cerebrais!',
      'Uma viatura do DPNC para no sinal vermelho logo ao lado do esconderijo temporário onde a equipe está armada até os dentes!',
      'O contato dentro da instalação aparece jogado pela janela do 5º andar com um corte na garganta!',
      'O gerador de energia da região entra em colapso, mergulhando o quarteirão na escuridão total enquanto passos pesados ecoam nos corredores.',
    ],
  },
  {
    beatType: 'Twist',
    titlePt: '4. A Reviravolta (The Twist)',
    objective: 'Uma revelação chocante que subverte as expectativas dos personagens sobre o contratante ou o objetivo real.',
    tips: 'O cyberpunk vive da quebra de confiança. Quem parecia vítima pode ser o carrasco, e o prêmio pode ser uma maldição.',
    prompts: [
      'A carga não é um chip de dados, mas uma criança clonada ou um cientista sequestrado que implora para não ser entregue ao cliente!',
      'O Fixer que contratou a equipe vendeu a localização do ponto de entrega para a corporação rival para quitar as próprias dívidas de jogo!',
      'O alvo a ser eliminado é um familiar direto, um antigo amor ou um aliado jurado de um dos membros da equipe!',
      'A inteligência corporativa revela que a missão era apenas uma distração calculada para encobrir um golpe de estado em outra filial!',
      'O item roubado é um protótipo militar rastreado por GPS que já acionou um esquadrão de extermínio da Max-Tac a caminho!',
      'A pessoa que contratou os PJs na verdade já morreu há três dias: quem está dando as ordens é uma I.A. renegada simulando sua voz!',
      'O cliente pretendia pagar a equipe com contas bancárias descartáveis que expiram e bloqueiam o dinheiro após 30 minutos!',
      'A instalação pertence secretamente a um amigo influente da equipe, que agora considera os personagens traidores jurados.',
    ],
  },
  {
    beatType: 'Climax',
    titlePt: '5. O Clímax (The Climax)',
    objective: 'O confronto decisivo: tiroteio armado de alta intensidade, perseguição de veículos ou invasão desesperada da fortaleza.',
    tips: 'Use o ambiente a favor: tanques inflamáveis de CHOOH2, guindastes oscilantes, neon quebrando e cabos elétricos caídos.',
    prompts: [
      'Tiroteio frenético no heliponto da cobertura sob tempestade de raios enquanto uma AV-4 blindada tenta decolar com o alvo!',
      'Perseguição em alta velocidade na autoestrada dos Badlands contra motos dos Tyger Claws e vans blindadas cheias de fuzis!',
      'Batalha desesperada na câmara dos servidores contra um ciborgue assassino com Sandevistan ativado e lâminas Mantis cortando tudo!',
      'Encurralados em um galpão pegando fogo, tendo que segurar ondas de inimigos enquanto a porta dos fundos é forçada pelo técnico!',
      'Duelo letal em um trem expresso do Maglev em movimento a 300 km/h saltando entre vagões cheios de contêineres!',
      'Combate corpo a corpo na pista de dança de uma boate enquanto a música ensurdecedora esconde o barulho dos tiros e granadas de fumaça!',
      'Invasão de emergência em um submarino de contrabando prestes a submergir no Porto de Night City sob fogo de metralhadoras pesadas!',
      'Tiroteio em uma ponte suspensa em ruínas com pedaços de asfalto despencando a 50 metros de altura sobre as águas tóxicas da baía.',
    ],
  },
  {
    beatType: 'Resolution',
    titlePt: '6. A Resolução (The Resolution)',
    objective: 'Lidar com as consequências, receber o pagamento (ou cobrar a traição), tratar os feridos e calcular a reputação nas ruas.',
    tips: 'Em Cyberpunk, vitórias são sempre agridoces. O que sobrou da equipe? Quem agora jurou vingança contra os mercenários?',
    prompts: [
      'Pagamento efetuado com eddies limpos em um beco silencioso, mas com a promessa velada de que a corporação não esquecerá seus rostos.',
      'A equipe precisa correr para um Ripperdoc clandestino antes que um dos companheiros morra por sangramento de ferimento crítico grave.',
      'A manchete do jornal do dia seguinte culpa a equipe por um massacre que não cometeram, elevando a Reputação e atraindo o DPNC.',
      'Brinde agridoce no balcão do Afterlife lembrando dos companheiros caídos e dividindo os trocados que sobraram do aluguel.',
      'O Fixer traidor é encontrado em um motel barato de beira de estrada e implora por misericórdia oferecendo um cofre clandestino.',
      'A testemunha salva embarca em uma van nômade em direção ao leste, deixando uma maleta com armas raras como agradecimento.',
      'A corporação que financiou a operação apaga todas as evidências digitais do trabalho e finge que a equipe nunca existiu.',
      'A vitória nas ruas atrai olhares de Fixers de alto escalão, abrindo portas para contratos muito mais perigosos no próximo mês.',
    ],
  },
];

// Temas prontos de campanhas dos livros
export interface AdventurePresetTheme {
  id: string;
  title: string;
  faction: string;
  district: string;
  description: string;
  suggestedDV: number;
}

export const ADVENTURE_PRESET_THEMES: AdventurePresetTheme[] = [
  {
    id: 'arasaka_blackops',
    title: 'Operação Sombra: O Protótipo Arasaka',
    faction: 'Arasaka Corp',
    district: 'Downtown · City Center',
    description: 'Infiltração em uma suíte executiva protegida por drones para extrair um datashard com plantas de ciberóptica militar.',
    suggestedDV: 17,
  },
  {
    id: 'biotechnica_biohazard',
    title: 'Risco Biológico: A Carga da Biotechnica',
    faction: 'Biotechnica',
    district: 'Santo Domingo',
    description: 'Interceptação de um comboio químico transportando amostras de vírus sintético para uma estufa subterrânea.',
    suggestedDV: 15,
  },
  {
    id: 'totentanz_chrome',
    title: 'Noite de Sangue no Totentanz',
    faction: 'Maelstrom',
    district: 'Desenvolvimento de Watson',
    description: 'Resgate de um técnico de som que foi capturado pelo Maelstrom para instalar chips de modificação cerebral forçada.',
    suggestedDV: 15,
  },
  {
    id: 'trauma_down',
    title: 'Queda Livre: Trauma Team Abatida',
    faction: 'Trauma Team / Gangers Locais',
    district: 'Pacifica Playground',
    description: 'Uma AV-4 de resgate foi derrubada por mísseis caseiros. A equipe deve chegar ao local antes dos carniceiros locais.',
    suggestedDV: 16,
  },
  {
    id: 'badlands_run',
    title: 'Corrida da Morte nos Badlands',
    faction: 'Clã Nômade Aldecaldo vs Wraiths',
    district: 'Badlands',
    description: 'Escolta armada de uma carreta de água potável através do território de carniceiros motorizados armados com lança-chamas.',
    suggestedDV: 14,
  },
  {
    id: 'blackwall_leak',
    title: 'O Fantasma na Rede: Fuga da Blackwall',
    faction: 'NetWatch vs Netrunners Renegados',
    district: 'The Glen · Heywood',
    description: 'Um hacker de garagem acidentalmente baixou uma I.A. militar fragmentada que começou a controlar a rede elétrica do bairro.',
    suggestedDV: 17,
  },
  {
    id: 'japantown_debt',
    title: 'Dívida de Honra em Japantown',
    faction: 'Tyger Claws',
    district: 'Old Japantown · Westbrook',
    description: 'Um dono de cassino clandestino cobra uma dívida antiga de um dos PJs exigindo a sabotagem de uma casa de chá rival.',
    suggestedDV: 13,
  },
  {
    id: 'petrochem_sabotage',
    title: 'Fogo no Oleoduto: Sabotagem Petrochem',
    faction: 'Petrochem vs Ecologistas Radicais',
    district: 'North Heywood',
    description: 'Plantar dispositivos de interferência acústica em uma refinaria costeira para forçar o fechamento de uma linha poluente.',
    suggestedDV: 15,
  },
];

// Gerador procedural de Beat Chart completo
export function generateProceduralBeatChart(themeTitle?: string) {
  const chosenTheme = themeTitle || ADVENTURE_PRESET_THEMES[Math.floor(Math.random() * ADVENTURE_PRESET_THEMES.length)].title;

  const result: Record<string, string> = {};
  BEAT_CHART_STRUCTURE.forEach(beat => {
    const randomPrompt = beat.prompts[Math.floor(Math.random() * beat.prompts.length)];
    result[beat.beatType] = `[${beat.titlePt}]\nTema: ${chosenTheme}\n\n${randomPrompt}\n\n💡 Dica Mecânica: ${beat.tips}`;
  });

  return {
    theme: chosenTheme,
    beats: result,
  };
}

// ----------------------------------------------------------------------------
// 2. GERADOR DE IMPROVISO DE CENA & EVENTOS URBANOS IMEDIATOS
// ----------------------------------------------------------------------------

export interface SceneImprovTables {
  zones: {
    [key: string]: {
      description: string;
      sensory: { sights: string[]; sounds: string[]; smells: string[] };
      districts: string[];
    };
  };
  situations: string[];
  obstacles: { description: string; skill: string; dv: number; failureCost: string }[];
  npcs: {
    name: string;
    role: string;
    faction: string;
    demeanor: string;
    visualAppearance: string;
    motivation: string;
    dialogueHook: string;
  }[];
  twists: { title: string; narrative: string; mechanicalImpact: string }[];
}

export const SCENE_IMPROV_DATA: SceneImprovTables = {
  zones: {
    'Centro Corporativo & Coberturas': {
      description: 'Arranha-céus espelhados, patrulhas de drones executivos e seguranças particulares engravatados com armas ocultas.',
      districts: ['City Center', 'North Oak', 'Charter Hill'],
      sensory: {
        sights: [
          'Reflexos de painéis solares e telões gigantes em vidros espelhados negros de 80 andares.',
          'Drones esguios de segurança da Ziggurat pairando silenciosos como falcões de titânio.',
          'Hologramas em altíssima definição de perfumes caros e carros voadores projetados sobre a névoa limpa.',
          'Guardas corporativos impecáveis vestindo ternos balísticos blindados com óculos escuros cibernéticos.',
        ],
        sounds: [
          'Zumbido suave e contínuo de turbinas de AV-4 executivas cruzando corredores aéreos.',
          'Passos ritmados de coturnos polidos ecoando sobre o mármore impecável das calçadas.',
          'Eco abafado da voz metálica e polida da âncora da WNS transmitindo notícias financeiras.',
          'Murmúrio discreto de executivos usando ciberfone interno comunicando-se por subvocalização.',
        ],
        smells: [
          'Ar condicionado artificial filtrado com ozônio sintético e bactericida hospitalar.',
          'Café expresso genuíno de grãos reais importados misturado a tabaco de charuto cubano.',
          'Perfume caro de almíscar sintético e loção pós-barba de alta tecnologia.',
          'Cheiro de cera líquida de polimento automotivo fresco em calçadas privativas.',
        ],
      },
    },
    'Zona de Combate & Ruínas Urbanas': {
      description: 'Prédios bombardeados, ausência total de polícia, barricadas de lixo em chamas e tiroteios constantes.',
      districts: ['Old Downtown', 'South Night City', 'Pacifica Coastview'],
      sensory: {
        sights: [
          'Carcaças de carros viradas e queimadas servindo de trincheiras furadas de balas de grosso calibre.',
          'Grafitis fluorescentes ameaçadores em spray alertando intrusos a não darem mais um passo.',
          'Janelas sem vidros cobertas por chapas de aço corrugado e arame farpado eletrificado.',
          'Fogueiras acesas dentro de tambores enferrujados de óleo de CHOOH2 iluminando rostos com implantes brutais.',
        ],
        sounds: [
          'Estalos secos de fuzis de assalto disparando rajadas curtas a três esquinas de distância.',
          'Cacos de vidro estalando sob pneus de vans camufladas acelerando desesperadas.',
          'Risadas histéricas e distorcidas de gangers acelerados por Black Lace e estimulantes sintéticos.',
          'Latidos roucos de cães cibernéticos de ataque rosnando em ferros-velhos abandonados.',
        ],
        smells: [
          'Pólvora de munição queimada recente e fumaça amarga de borracha de pneus derretendo.',
          'Odor nauseante e adocicado de corpos humanos em decomposição escondidos em becos escuros.',
          'Esgoto a céu aberto misturado com lama tóxica de chuva ácida acumulada nas sarjetas.',
          'Fumaça densa de carne de rato ou cachorro sendo assada em espetos improvisados.',
        ],
      },
    },
    'Distritos Populares & Subúrbios': {
      description: 'Ruas apinhadas de pedestres, prédios de apartamentos abarrotados, quiosques de comida de rua e neon piscando.',
      districts: ['Watson Little China', 'Westbrook Japantown', 'Heywood Wellsprings', 'The Glen'],
      sensory: {
        sights: [
          'Varais de roupas e fios elétricos emaranhados cruzando o espaço entre prédios de seis andares.',
          'Letreiros de neon verticais em kanji e espanhol piscando e zumbindo em tons de rosa e turquesa.',
          'Quiosques apertados de comida de rua com caldeirões de lámen fervendo sob lonas de plástico transparente.',
          'Telas holográficas de arcades e lojas de conveniência 24h iluminando poças de água oleosa.',
        ],
        sounds: [
          'Mistura ensurdecedora de funk, reggaeton e j-pop sintético vazando de janelas de apartamentos.',
          'Gritos estridentes de camelôs vendendo chips ilegais de braindance e cigarros contrabandeados.',
          'Sirenes distantes de patrulha do DPNC passando velozes nas avenidas principais.',
          'Ruído de motores de motocicletas leves cortando o trânsito travado entre ônibus velhos.',
        ],
        smells: [
          'Fritura de pastéis de massa sintética, óleo de soja requentado e caldo de noodles condimentado.',
          'Gás de escapamento irritante de motores a CHOOH2 barato de carros populares mal regulados.',
          'Umidade de bueiros combinada com lixo orgânico exposto ao mormaço do asfalto.',
          'Fumaça adocicada de incensos baratos queimando em pequenos santuários na entrada de lojas.',
        ],
      },
    },
    'Badlands & Territórios Nômades': {
      description: 'Extensões desérticas de terra vermelha rachada, tempestades de poeira e comboios de ferro e poeira.',
      districts: ['Badlands Norte', 'Badlands Sul', 'Rodovia 101'],
      sensory: {
        sights: [
          'Planície de terra vermelha rachada estendendo-se até montanhas ressecadas sob um céu cinzento opaco.',
          'Torres metálicas de extração de petróleo da Petrochem subindo e descendo monotonamente.',
          'Redemoinhos de areia e sacolas plásticas soprados pelo vento quente e implacável.',
          'Tendas de lona reforçada e trailers modificados agrupados em círculo com antenas de rádio amador.',
        ],
        sounds: [
          'Uivo cortante do vento desértico chicoteando as chapas metálicas de carretas pesadas.',
          'Ronco gutural de motores V8 customizados de caminhonetes acelerando em estradas de terra batida.',
          'Silêncio imenso e opulento do deserto, quebrado apenas pelo chiar de rádios PX comunicando em código.',
          'Estralo de metal estalando enquanto motores quentes esfriam sob o vento gelado do crepúsculo.',
        ],
        smells: [
          'Poeira fina e arenosa que gruda na garganta e resseca as narinas a cada respiração.',
          'Combustível de alta octanagem, graxa de suspensão pesada e óleo diesel envelhecido.',
          'Fumaça de churrasco de carne de cobra ou escorpião temperada com pimenta forte.',
          'Borracha aquecida de pneus off-road rodando em cascalho escaldante.',
        ],
      },
    },
    'Subsolo, Metrô Abandonado & Esgotos': {
      description: 'Túneis de serviço inundados, trilhos enferrujados de maglev e refúgios de comunidades subterrâneas.',
      districts: ['Túneis do Maglev Antigo', 'Subsolo de Kabuki', 'Galerias Pluviais de Heywood'],
      sensory: {
        sights: [
          'Trilhos de trem magnético retorcidos e cobertos por camadas de ferrugem e líquen bioluminescente.',
          'Vigas de concreto desmoronadas amparadas precariamente por andaimes de madeira podre.',
          'Gotas de condensação escorrendo em canos de ferro fundido de 2 metros de diâmetro.',
          'Luzes químicas vermelhas e azuis presas em paredes de tijolos úmidos indicando rotas de fuga.',
        ],
        sounds: [
          'Eco cavernoso de passos na água rasa reverberando por centenas de metros de túneis escuros.',
          'Zumbido elétrico de alta tensão escapando de transformadores clandestinos pendurados no teto.',
          'Ruído de ratos e criaturas mutantes correndo sobre canos de esgoto e lixo plástico.',
          'Sopro distante e rítmico de ventiladores gigantes de circulação de ar do metrô da cidade.',
        ],
        smells: [
          'Cheiro sulfuroso e penetrante de umidade fétida misturada a mofo tóxico e água parada.',
          'Fumaça de cabos de cobre queimados por curto-circuito recente.',
          'Odor de desinfetante industrial velho misturado com resíduos biológicos acumulados.',
          'Ar pesado e rarefeito com forte traço de ferrugem metálica.',
        ],
      },
    },
    'Docas & Distrito Industrial Norte (NID)': {
      description: 'Contêineres de carga empilhados, guindastes gigantescos, depósitos frios e névoa salina corrosiva.',
      districts: ['Watson NID', 'Porto de Night City', 'Doca de Contêineres Morro Rock'],
      sensory: {
        sights: [
          'Paredes de contêineres marítimos empilhados em labirintos de quatro andares de altura.',
          'Braços mecânicos gigantescos de guindastes portuários movendo-se sob a chuva cinzenta.',
          'Fagulhas azuis e brancas de maçaricos industriais trabalhando em cascos de barcaças enferrujadas.',
          'Vans de carga sem placas entrando e saindo de galpões escuros com portas de enrolar metálicas.',
        ],
        sounds: [
          'Batida metálica e estrondosa de contêineres de 40 toneladas sendo assentados no chão de concreto.',
          'Apito grave e rouco de cargueiros marítimos manobrando na baía sob o nevoeiro denso.',
          'Ruído contínuo de esteiras rolantes transportando caixas de componentes e peças de maquinário.',
          'Gritos de estivadores e guardas de armazém dando ordens através de megafones arranhados.',
        ],
        smells: [
          'Névoa salgada e corrosiva do mar misturada a óleo de motor náutico derramado na água.',
          'Cheiro de ferro oxidado, tinta primer marinha tóxica e borracha de mangueiras de pressão.',
          'Fumaça química de solda elétrica e queima de combustíveis pesados de navios.',
          'Peixe podre flutuando entre garrafas plásticas presas nas margens dos cais de concreto.',
        ],
      },
    },
    'Mercados Noturnos & Feiras de Rua': {
      description: 'Becos estreitos apinhados de bancas iluminadas por cordões de lâmpadas, cheiro de comida e armas contrabandeadas.',
      districts: ['Mercado Noturno de Kabuki', 'Feira Livre de Vista del Rey', 'Beco dos Cromos'],
      sensory: {
        sights: [
          'Lâmpadas incandescentes amarelas amarradas em cordas balançando sobre bancas cobertas de lona.',
          'Maletas abertas exibindo pistolas cromadas, miras telescópicas e chips de memória empilhados.',
          'Gaiolas com animais sintéticos e pássaros mecânicos cantando melodias gravadas.',
          'Multidão densa de mercenários, civis encapuzados e gangers negociando aos cochichos.',
        ],
        sounds: [
          'Vozes sussurradas de Fixers negociando valores e transferências de eddies no leitor biométrico.',
          'Cliques metálicos ritmados de carregadores sendo testados e travas de segurança acionadas.',
          'Música ambiente oriental ou latina saindo de caixas de som portáteis presas com fita adesiva.',
          'Patinhas metálicas de drones de vigilância caseiros pousando nos toldos de zinco.',
        ],
        smells: [
          'Óleo lubrificante de armas de fogo misturado ao tempero picante de espetinhos fritos.',
          'Fumaça de cigarros com infusão de cafeína e aromatizantes artificiais de menta.',
          'Cheiro de plástico queimado vindo de ferros de solda montando circuitos na hora.',
          'Suor de dezenas de corpos apinhados em um beco estreito e abafado.',
        ],
      },
    },
    'Bares Lendários & Boates Noturnas': {
      description: 'Luzes estroboscópicas, música ensurdecedora, álcool sintético no copo e contratos selados nas cabines escuras.',
      districts: ['The Afterlife', 'Totentanz', 'El Coyote Cojo', 'Dick Licker Bar'],
      sensory: {
        sights: [
          'Feixes de lasers verdes e vermelhos rasgando a névoa artificial sobre a pista de dança apinhada.',
          'Balcão de madeira pesada riscado com marcas de facas e copos com bebidas fluorescentes brilhando no escuro.',
          'Seguranças gigantescos com ciberbraços cromados vigiando a porta dos fundos e camarotes VIP.',
          'Telas transmitindo vídeos musicais ultra-agressivos e dados de apostas de brigas de arena clandestinas.',
        ],
        sounds: [
          'Batidas graves e opressivas de synthwave industrial e rock cromado fazendo o chão de concreto vibrar.',
          'Vidros de garrafas tilintando enquanto o bartender serve shots de Smash e RealSkad sem parar.',
          'Gargalhadas roucas de Solos experientes compartilhando histórias de emboscadas e tiroteios.',
          'Chiado sutil de gelo seco e névoa artificial sendo disparada do teto a cada refrão da música.',
        ],
        smells: [
          'Álcool de cereais forte, cerveja sintética choca derramada no piso e xarope de frutas químicas.',
          'Tabaco aromático barato misturado a vapor de fumo eletrônico com cheiro de cereja e cravo.',
          'Ozônio liberado por amplificadores superaquecidos e luzes estroboscópicas de alta potência.',
          'Cheiro de couro sintético de jaquetas gastas e perfume barato de frequentadores da madrugada.',
        ],
      },
    },
    'Clínicas de Ripperdocs Clandestinas': {
      description: 'Cadeiras cirúrgicas ensanguentadas, ferramentas odontológicas reaproveitadas e tubos de anestésico duvidoso.',
      districts: ['Subsolo de Watson', 'Clínica de Beco em Pacifica', 'Laboratório Móvel de Heywood'],
      sensory: {
        sights: [
          'Cadeira odontológica reclinável presa ao chão com cintas de contenção de couro reforçado.',
          'Braço robótico cirúrgico suspenso com agulhas, bisturis e serras ósseas esterilizadas a fogo.',
          'Bandejas metálicas cheias de cabos de interface neural recém-extraídos de corpos recentes.',
          'Monitores de tubo antigos exibindo traçados de frequência cardíaca e níveis de anestesia sintética.',
        ],
        sounds: [
          'Zumbido agudo e estridente de brocas ósseas e serras de titânio cortando ligamentos mecânicos.',
          'Bipe rítmico e cansado de um monitor cardíaco de segunda mão conectado por eletrodos adesivos.',
          'Pingar constante de solução salina em um balde de plástico posicionado ao lado da maca.',
          'Murmúrio grogue de pacientes acordando de anestesia barata gemendo de dores nas juntas.',
        ],
        smells: [
          'Cheiro pungente de iodo, álcool isopropílico hospitalar e desinfetante cirúrgico concentrado.',
          'Odor metálico e quente de sangue recém-estancado e cauterização de tecidos de carne humana.',
          'Plástico aquecido e silicone cirúrgico saindo de embalagens seladas abertas com navalha.',
          'Café requentado e fumaça de cigarro consumido pelo próprio cirurgião durante o procedimento.',
        ],
      },
    },
    'Megaprédios & Favelas Verticais': {
      description: 'Monólitos residenciais de 120 andares abrigando 30.000 pessoas em cubículos sobrepostos com escadas intermináveis.',
      districts: ['Megabuilding H10', 'Megabuilding H4', 'Complexo Habitacional Charter'],
      sensory: {
        sights: [
          'Átrio central colossal de 100 andares com passarelas metálicas suspensas ligando blocos opostos.',
          'Centenas de portas de cubículos numeradas com pichações de gangues e avisos de corte de luz.',
          'Elevadores enferrujados de carga com portas arrombadas cobertas por grades de madeira.',
          'Crianças correndo pelas escadarias de concreto enquanto drones de entrega soltam pacotes de comida.',
        ],
        sounds: [
          'Zumbido elétrico onipresente dos dutos de ventilação central fazendo as paredes vibrarem.',
          'Eco simultâneo de televisores ligados em programas sensacionalistas e brigas domésticas aos gritos.',
          'Música saindo de rádios portáteis nos corredores enquanto moradores cozinham do lado de fora.',
          'Ruído de carrinhos de mercado com rodas emperradas sendo empurrados por catadores de lixo eletrônico.',
        ],
        smells: [
          'Cheiro característico de ração de Kibble cozida com tempero artificial barato e água mineral de filtro.',
          'Fumaça de cigarros baratos e fumo de ervas sintéticas nos patamares das escadas.',
          'Ar abafado e quente com cheiro de roupas secando no corredor e desinfetante de pinho.',
          'Vapor de comida de rua frita sendo vendida clandestinamente na porta do 42º andar.',
        ],
      },
    },
  },
  situations: [
    'Emboscada Repentina / Encontro Hostil com Sentinelas',
    'Negociação Clandestina / Troca de Maletas em Ponto Cego',
    'Fuga Desesperada a Pé sob Perseguição de Veículo',
    'Infiltração Silenciosa em Instalação com Câmeras Ativas',
    'Trégua Instável em Zona Neutra com Gangues Rivais',
    'Investigação de Cena de Assassinato / Massacre Recente',
    'Resgate de Testemunha Ferida Encurralada em um Beco',
    'Sabotagem de Gerador de Energia durante Tempestade Elétrica',
  ],
  obstacles: [
    {
      description: 'Um duto de vapor de alta pressão se rompeu no meio da passagem (jatos de calor a 180°C).',
      skill: 'Atletismo ou Acrobacia',
      dv: 15,
      failureCost: 'Sofre 2d6 de dano térmico direto ignorando armaduras de tecido.',
    },
    {
      description: 'Câmera corporativa inteligente de reconhecimento facial com rotação de 180 graus no portão.',
      skill: 'Furtividade ou Netrunning',
      dv: 14,
      failureCost: 'Dispara o alarme perimétrico e convoca 2 guardas armados em 2 turnos.',
    },
    {
      description: 'Cabo de alta tensão de 10.000V rompido tocando uma poça d’água rasa no chão.',
      skill: 'Eletrônica/Segurança ou Reflexos',
      dv: 15,
      failureCost: 'Choque elétrico causa 3d6 de dano e desativa temporariamente ciberware por 1 minuto.',
    },
    {
      description: 'Dois gangers armados do Maelstrom com fuzis cobrando 100eb de pedágio para permitir a passagem.',
      skill: 'Intimidação, Suborno ou Furtividade',
      dv: 13,
      failureCost: 'Os gangers sacam as armas e abrem fogo gritando por reforços.',
    },
    {
      description: 'Porta blindada de aço com fechadura digital biométrica danificada por tiros.',
      skill: 'Arrombamento ou Eletrônica',
      dv: 15,
      failureCost: 'A trava magnética entra em modo de bloqueio permanente (lockdown).',
    },
    {
      description: 'Cão de ataque cibernético farejador da Militech patrulhando a marquise superior.',
      skill: 'Trato com Animais ou Táticas de Emboscada',
      dv: 14,
      failureCost: 'O cão late ensurdecedoramente e salta sobre o personagem na retaguarda.',
    },
    {
      description: 'Bueiro transbordando lixo químico tóxico corrosivo cobrindo a única saída rápida.',
      skill: 'Resistência a Tortura/Drogas ou Físico',
      dv: 13,
      failureCost: 'Penalidade de -2 em todos os testes por 1 hora devido a náuseas e queimaduras leves.',
    },
    {
      description: 'Drone de vigilância aérea da Ziggurat vasculhando a rua com holofote estroboscópico de busca.',
      skill: 'Furtividade Urbana ou Camuflagem',
      dv: 15,
      failureCost: 'A localização da equipe é marcada no mapa de patrulha e gravada nos arquivos corporativos.',
    },
  ],
  npcs: [
    {
      name: 'Kira "Glitch" Chen',
      role: 'Netrunner Freelancer',
      faction: 'Independente',
      demeanor: 'Nervosa, olhando constantemente sobre o ombro, suando frio.',
      visualAppearance: 'Sobretudo transparente de vinil reflexivo, óculos espelhados de realidade aumentada e cabos neurais enrolados nos pulsos.',
      motivation: 'Tentando despistar um rastreamento de ICE Black corporativo que está queimando sua memória neural.',
      dialogueHook: '"Vocês têm cara de quem atira primeiro... me dêem dois minutos de cobertura antes que fritem meu cérebro!"',
    },
    {
      name: 'Sargento Diego "Bull" Ramos',
      role: 'Detetive Cansado do DPNC',
      faction: 'DPNC (Polícia de Night City)',
      demeanor: 'Cínico, mascando chiclete sintético, terno balístico amassado com manchas de café.',
      visualAppearance: 'Ciberolho direito antiquado com lente vermelha que estala ao focar e distintivo de latão preso no cinto.',
      motivation: 'Apenas querendo terminar o turno sem ter que preencher relatório de tiroteio de homicídio.',
      dialogueHook: '"Se vocês guardarem essas armas agora, eu finjo que não vi essa mala e todo mundo volta vivo pra casa."',
    },
    {
      name: 'Milo "Faísca" Santos',
      role: 'Mecânico de Rua / Techie',
      faction: 'Clã Nômade Aldecaldo (Desgarrado)',
      demeanor: 'Hiperativo, falando rápido enquanto ajusta chaves de fenda no cinto de ferramentas.',
      visualAppearance: 'Macacão sujo de graxa de motor CHOOH2, tatuagens tribais no pescoço e dedo indicador modificado com soldador.',
      motivation: 'Procurando peças raras de alternador de fuzil Smart em ferros-velhos para pagar uma dívida.',
      dialogueHook: '"Eu consigo desbloquear essa porta em 10 segundos, mas vai me custar 50 eddies e uma bala de 9mm."',
    },
    {
      name: 'Vee "Veludo" Fontaine',
      role: 'Fixer Novata de Heywood',
      faction: 'Mercado Negro Local',
      demeanor: 'Ambiciosa, fala mansa e calculada, conferindo a hora em um relógio de ouro holográfico.',
      visualAppearance: 'Casaco longo de pele sintética branca sobre colete balístico discreto e unhas cromadas afiadas.',
      motivation: 'Tentando fechar seu primeiro contrato de contrabando de alta patente para ganhar reputação no Afterlife.',
      dialogueHook: '"Night City é feita de oportunidades. Se vocês forem os mercenários certos, nós dois vamos sair ricos hoje à noite."',
    },
    {
      name: 'Rico "Carniceiro" Vasquez',
      role: 'Ripperdoc Clandestino',
      faction: 'Bancos de Corpos de Pacifica',
      demeanor: 'Calmo, com cheiro forte de antisséptico e voz rouca de fumante.',
      visualAppearance: 'Avental cirúrgico de borracha sobre camisa xadrez, quatro lentes de aumento ópticas presas na testa e mãos mecânicas impecáveis.',
      motivation: 'Procura órgãos cibernéticos intactos para atender clientes desesperados em sua clínica de porão.',
      dialogueHook: '"Se esse rapaz no chão morrer, não jogue fora o braço cibernético... eu pago 200 pratas na hora."',
    },
    {
      name: 'Max "Overkill" Kross',
      role: 'Solo Veterano de Guerra',
      faction: 'Ex-Militech Freelance',
      demeanor: 'Frio, postura ereta militar e olhos vazios de quem viu combates demais.',
      visualAppearance: 'Jaqueta tática pesada com insígnias arrancadas, ciberbraço reforçado com blindagem fosca e cicatriz profunda na mandíbula.',
      motivation: 'Contratado para garantir que nenhuma testemunha saia viva do quarteirão.',
      dialogueHook: '"Vocês estão no lugar errado, na hora errada. Dêem meia-volta antes que eu calcule suas trajetórias balísticas."',
    },
  ],
  twists: [
    {
      title: 'Chegada da Trauma Team',
      narrative: 'Uma sirene cortante de AV-4 ecoa nos prédios: uma equipe armada de resgate da Trauma Team desce no meio da rua disparando balas de borracha e fumaça para proteger um cliente corporativo ferido!',
      mechanicalImpact: 'A visibilidade cai para 3 metros; qualquer um com arma em punho vira alvo prioritário das sentinelas da AV.',
    },
    {
      title: 'Alerta de Ciberpsicopata',
      narrative: 'Um alarme ensurdecedor da Max-Tac dispara em todos os telefones e telões: um indivíduo em ciberpsicose violenta foi avistado a dois quarteirões e a polícia isolou o perímetro com grades eletrificadas!',
      mechanicalImpact: 'Todas as saídas para avenidas principais estão trancadas; barulhos de tiros pesados aproximam-se a cada rodada.',
    },
    {
      title: 'Apagão Elétrico no Quarteirão',
      narrative: 'Um estrondo elétrico sacode o asfalto quando um transformador explode: todas as luzes, letreiros de neon e câmeras se apagam simultaneamente, mergulhando a área na escuridão absoluta!',
      mechanicalImpact: 'Quem não possuir ciberolhos com Visão Noturna ou lanternas sofre penalidade de -4 em todos os testes de Percepção e Combate.',
    },
    {
      title: 'Transmissão de Braindance ao Vivo',
      narrative: 'Um drone clandestino com lente olho-de-peixe de um canal de fofocas de rua começa a filmar a cena ao vivo e projetar o rosto da equipe em telões da Ziggurat!',
      mechanicalImpact: 'O anonimato foi quebrado: +1 em Reputação pública temporária, mas Fixers inimigos recebem a localização da equipe.',
    },
    {
      title: 'A Mala de Dados Está Armada',
      narrative: 'Um bipe agudo e acelerado começa a soar de dentro do compartimento do alvo: uma carga de demolição com temporizador de 60 segundos foi ativada!',
      mechanicalImpact: 'Requer teste de Eletrônica/Segurança DV 15 para desarmar ou 3 ações para arremessá-la a uma distância segura.',
    },
    {
      title: 'Chuva Ácida Torrencial Repentina',
      narrative: 'O céu acinzentado se rompe e uma chuva amarelo-esverdeada altamente corrosiva começa a queimar os tecidos e a fiação exposta de veículos e roupas!',
      mechanicalImpact: 'Armaduras perdem 1 ponto de SP de cobertura a cada 10 minutos expostas sem abrigo coberto.',
    },
  ],
};

// Gerador procedural de cena e improviso offline
export function generateProceduralSceneImprov(zoneName?: string, situationName?: string) {
  const zoneKeys = Object.keys(SCENE_IMPROV_DATA.zones);
  const pickedZoneKey = zoneName && SCENE_IMPROV_DATA.zones[zoneName] ? zoneName : zoneKeys[Math.floor(Math.random() * zoneKeys.length)];
  const zoneData = SCENE_IMPROV_DATA.zones[pickedZoneKey];

  const pickedSituation = situationName || SCENE_IMPROV_DATA.situations[Math.floor(Math.random() * SCENE_IMPROV_DATA.situations.length)];
  const pickedSight = zoneData.sensory.sights[Math.floor(Math.random() * zoneData.sensory.sights.length)];
  const pickedSound = zoneData.sensory.sounds[Math.floor(Math.random() * zoneData.sensory.sounds.length)];
  const pickedSmell = zoneData.sensory.smells[Math.floor(Math.random() * zoneData.sensory.smells.length)];

  const pickedObstacle = SCENE_IMPROV_DATA.obstacles[Math.floor(Math.random() * SCENE_IMPROV_DATA.obstacles.length)];
  const pickedNPC = SCENE_IMPROV_DATA.npcs[Math.floor(Math.random() * SCENE_IMPROV_DATA.npcs.length)];
  const pickedTwist = SCENE_IMPROV_DATA.twists[Math.floor(Math.random() * SCENE_IMPROV_DATA.twists.length)];

  return {
    zone: pickedZoneKey,
    situation: pickedSituation,
    sensory: {
      sight: pickedSight,
      sound: pickedSound,
      smell: pickedSmell,
    },
    obstacle: {
      description: pickedObstacle.description,
      skill: pickedObstacle.skill,
      dv: pickedObstacle.dv,
      failureCost: pickedObstacle.failureCost,
    },
    npc: pickedNPC,
    twist: pickedTwist,
  };
}

// ----------------------------------------------------------------------------
// 3. SISTEMA OFICIAL DE TIMESKIP & DOWNTIME (LIVRO DE REGRAS CYBERPUNK RED)
// ----------------------------------------------------------------------------

export interface HousingLifestyleOption {
  id: string;
  name: string;
  costEb: number;
  description: string;
  comfort: string;
  hazardRisk?: string;
}

export const HOUSING_OPTIONS: HousingLifestyleOption[] = [
  {
    id: 'street',
    name: 'Morando na Rua / Marquise',
    costEb: 0,
    comfort: 'Miserável',
    description: 'Dormir sobre papelões em becos ou estações de metrô abandonadas, exposto à chuva ácida e assaltos.',
    hazardRisk: 'Role 1d10 a cada mês: em 1-3 você sofre assalto ou hipotermia (-1 em Físico por 1 semana).',
  },
  {
    id: 'cube',
    name: 'Hotel Cubículo (Cube Hotel)',
    costEb: 100,
    comfort: 'Péssimo',
    description: 'Cápsula de fibra de vidro de 2x1 metros com colchão sintético duro, tranca eletrônica barata e banheiro compartilhado no corredor.',
  },
  {
    id: 'container',
    name: 'Contêiner de Carga Adaptado',
    costEb: 300,
    comfort: 'Básico',
    description: 'Contêiner marítimo de metal enferrujado em um pátio vigiado por arame farpado. Possui pia, chuveiro frio e tomada elétrica.',
  },
  {
    id: 'studio',
    name: 'Apartamento Estúdio (Studio)',
    costEb: 500,
    comfort: 'Padrão das Ruas',
    description: 'Quitinete de um cômodo em prédio residencial popular com cozinha americana básica, fechadura digital e isolamento acústico razoável.',
  },
  {
    id: 'twobedroom',
    name: 'Apartamento de 2 Quartos (Two-Bedroom)',
    costEb: 1200,
    comfort: 'Bom',
    description: 'Apartamento espaçoso em distrito moderado com portaria eletrônica, aquecimento central, vaga de garagem e sacada.',
  },
  {
    id: 'penthouse',
    name: 'Cobertura Executiva (Penthouse / Condomínio de Luxo)',
    costEb: 2500,
    comfort: 'Luxo Corporativo',
    description: 'Suíte de alto padrão em North Oak ou City Center com segurança particular armada, heliponto privativo e ar condicionado filtrado.',
  },
];

export interface FoodLifestyleOption {
  id: string;
  name: string;
  costEb: number;
  description: string;
  quality: string;
}

export const FOOD_OPTIONS: FoodLifestyleOption[] = [
  {
    id: 'kibble',
    name: 'Ração de Grãos Kibble',
    costEb: 100,
    quality: 'Miserável',
    description: 'Pelotas secas de proteína de soja e cinzas vegetais com sabor artificial de carne salgada. Mantém vivo, mas destrói o humor.',
  },
  {
    id: 'prepak',
    name: 'Comida Pré-embalada Genérica (Prepak)',
    costEb: 300,
    quality: 'Padrão',
    description: 'Bandejas congeladas de purê sintético, macarrão instantâneo e refrigerante doce com corante. Alimentação comum do cidadão de Night City.',
  },
  {
    id: 'goodfood',
    name: 'Boa Comida & Restaurantes de Rua (Good Food)',
    costEb: 600,
    quality: 'Boa',
    description: 'Lámen de verdade em quiosques, sanduíches com pão fresco, cerveja de marca e refeições balanceadas preparadas no dia.',
  },
  {
    id: 'freshluxury',
    name: 'Comida Fresca Genuína & Luxo (Fresh & Luxury)',
    costEb: 1500,
    quality: 'Luxo',
    description: 'Legumes de estufa genuínos, carne bovina verdadeira, vinhos importados da França e queijos maturados da Europa.',
  },
];

export interface TraumaTeamOption {
  id: string;
  name: string;
  costEb: number;
  responseTime: string;
  description: string;
}

export const TRAUMA_TEAM_OPTIONS: TraumaTeamOption[] = [
  {
    id: 'none',
    name: 'Sem Cobertura de Saúde (Sem Plano)',
    costEb: 0,
    responseTime: 'Inexistente',
    description: 'Se for baleado ou mutilado, sua única esperança é um amigo levá-lo a um Ripperdoc de beco.',
  },
  {
    id: 'silver',
    name: 'Plano Trauma Team Prata (Silver)',
    costEb: 500,
    responseTime: '10 minutos',
    description: 'Cobertura médica de emergência básica com AV-4 armada caso o biomonitor detecte parada cardíaca em zonas moderadas.',
  },
  {
    id: 'executive',
    name: 'Plano Trauma Team Executivo (Executive / Gold)',
    costEb: 1000,
    responseTime: '3 a 5 minutos',
    description: 'Resposta de choque prioritária com equipe de assalto com fuzis pesados, estabilização cirúrgica instantânea e UTI móvel.',
  },
];

// Projetos de Downtime Oficiais do Cyberpunk RED
export interface DowntimeProjectOption {
  id: string;
  name: string;
  costEb: number;
  timeRequired: string;
  description: string;
  mechanicalBenefit: string;
}

export const DOWNTIME_PROJECTS: DowntimeProjectOption[] = [
  {
    id: 'standard_therapy',
    name: 'Terapia de Humanidade Padrão (Standard Therapy)',
    costEb: 500,
    timeRequired: '1 Semana',
    description: 'Sessões com psicólogo especializado em choque de cromo e integração biocibernética.',
    mechanicalBenefit: 'Recupera 2d6 pontos de Humanidade perdida por instalação de ciberware.',
  },
  {
    id: 'extreme_therapy',
    name: 'Terapia Extrema em Clínica Privada (Extreme Therapy)',
    costEb: 1000,
    timeRequired: '2 Semanas',
    description: 'Internação em clínica particular com tanques de isolamento sensorial e reprogramação neuroquímica profunda.',
    mechanicalBenefit: 'Recupera 4d6 pontos de Humanidade e restaura +1 ponto permanente no atributo EMP (até o valor original).',
  },
  {
    id: 'tech_fabrication',
    name: 'Fabricação / Customização de Equipamento (Tech)',
    costEb: 200,
    timeRequired: '1 a 2 Semanas',
    description: 'Uso de oficina de garagem para fabricar armas excelentes, blindagens personalizadas ou upgrades de veículos.',
    mechanicalBenefit: 'Economiza 50% do valor de mercado do item fabricado com sucesso em teste de Perícia Tech.',
  },
  {
    id: 'medical_recovery',
    name: 'Convalescença & Cura de Ferimentos Críticos (Medtech)',
    costEb: 250,
    timeRequired: '1 a 3 Semanas',
    description: 'Repouso em ambiente esterilizado sob antibióticos e cuidados médicos profissionais para regenerar lesões permanentes.',
    mechanicalBenefit: 'Remove ferimentos críticos graves (concussão cerebral, membros amputados, costelas fraturadas).',
  },
  {
    id: 'cyberware_tuning',
    name: 'Calibração & Manutenção Preventiva de Cromo (Black Chrome)',
    costEb: 150,
    timeRequired: '3 Dias',
    description: 'Troca de fiação, calibração de servos de reflexos (Sandevistan / Kerenzikov) e lubrificação de juntas sintéticas.',
    mechanicalBenefit: 'Previne falhas críticas em implantes e garante +1 em testes de Iniciativa no primeiro trabalho do mês.',
  },
];

// Hustles de todas as 10 Roles com tabela 1d6 oficial do Livro de Regras
export interface DetailedRoleHustle {
  role: string;
  d6Jobs: {
    d6: number;
    title: string;
    description: string;
    payoutRanks: { rank1to4: number; rank5to7: number; rank8to10: number };
    complicationHook?: string;
  }[];
}

export const DETAILED_ROLE_HUSTLES: DetailedRoleHustle[] = [
  {
    role: 'Solo (Mercenário de Combate)',
    d6Jobs: [
      {
        d6: 1,
        title: 'Segurança de Boate / Bar de Rua',
        description: 'Ficar de pé por 8 horas na porta de um bar imundo em Little China revistando bêbados e apartando brigas com socos ingleses.',
        payoutRanks: { rank1to4: 150, rank5to7: 300, rank8to10: 900 },
        complicationHook: 'Um dos baderneiros expulsos era primo de um tenente dos Tyger Claws que prometeu voltar com amigos.',
      },
      {
        d6: 2,
        title: 'Cobrança Agressiva de Dívidas',
        description: 'Acompanhar um agiota local para quebrar algumas mesas e intimidar comerciantes que atrasaram o pagamento de proteção.',
        payoutRanks: { rank1to4: 200, rank5to7: 400, rank8to10: 1000 },
      },
      {
        d6: 3,
        title: 'Escolta Tática de Carga Leve',
        description: 'Viajar no banco do passageiro de uma van blindada com espingarda em punho garantindo que peças de computador cheguem ao depósito.',
        payoutRanks: { rank1to4: 250, rank5to7: 450, rank8to10: 1200 },
      },
      {
        d6: 4,
        title: 'Guarda-Costas de Fixer Novato',
        description: 'Proteger um corretor de rua durante encontros noturnos em becos escuros enquanto negociam contrabando de armas.',
        payoutRanks: { rank1to4: 200, rank5to7: 500, rank8to10: 1300 },
        complicationHook: 'O Fixer tentou passar a perna no comprador e os dois lados sacaram armas, exigindo tiros de advertência.',
      },
      {
        d6: 5,
        title: 'Caçada a Foragido de Recompensa (Bounty)',
        description: 'Rastrear e imobilizar um ladrão de carros que tinha mandado de prisão preventiva emitido pelo Departamento de Justiça.',
        payoutRanks: { rank1to4: 300, rank5to7: 600, rank8to10: 1500 },
      },
      {
        d6: 6,
        title: 'Consultoria Tática para Segurança Corporativa',
        description: 'Treinar guardas novatos da Militech ou Petrochem em procedimentos de resposta armada contra invasão urbana.',
        payoutRanks: { rank1to4: 350, rank5to7: 700, rank8to10: 1800 },
      },
    ],
  },
  {
    role: 'Netrunner (Invasor de Rede)',
    d6Jobs: [
      {
        d6: 1,
        title: 'Limpeza de Vírus em Cyberdecks Caseiros',
        description: 'Passar noites desfragmentando cartões de memória e expurgando malwares de amadores em uma bancada de garagem.',
        payoutRanks: { rank1to4: 150, rank5to7: 300, rank8to10: 900 },
      },
      {
        d6: 2,
        title: 'Ripagem e Pirataria de Braindances',
        description: 'Quebrar travas de proteção de gravações sensoriais exclusivas de celebridades e distribuí-las na rede clandestina do Ziggurat.',
        payoutRanks: { rank1to4: 200, rank5to7: 350, rank8to10: 1000 },
        complicationHook: 'Uma das gravações continha imagens confidenciais de um crime de colarinho branco da Biotechnica.',
      },
      {
        d6: 3,
        title: 'Invasão de Câmeras de Trânsito para Fixers',
        description: 'Acessar a sub-rede municipal de transporte para apagar filmagens de placas de carros de fuga usados em trabalhos recentes.',
        payoutRanks: { rank1to4: 250, rank5to7: 450, rank8to10: 1100 },
      },
      {
        d6: 4,
        title: 'Varredura e Auditoria de Segurança Local',
        description: 'Testar os firewalls e nós de acesso de um armazém de contrabando garantindo que nenhum hacker concorrente invada.',
        payoutRanks: { rank1to4: 300, rank5to7: 500, rank8to10: 1300 },
      },
      {
        d6: 5,
        title: 'Roubo de Contas Bancárias Fantasma',
        description: 'Incursão cuidadosa em nós secundários de bancos de dados da World News Service desviando fundos de contas esquecidas.',
        payoutRanks: { rank1to4: 350, rank5to7: 650, rank8to10: 1500 },
        complicationHook: 'Um programa de rastreamento da NetWatch registrou a assinatura do seu deck e pode tentar um contra-ataque.',
      },
      {
        d6: 6,
        title: 'Consultoria de Contra-Inteligência Militar',
        description: 'Construir arquiteturas de dados complexas com camadas de Black ICE Hellhound e Asp para proteger segredos de laboratórios.',
        payoutRanks: { rank1to4: 400, rank5to7: 800, rank8to10: 2000 },
      },
    ],
  },
  {
    role: 'Tech (Técnico / Engenheiro)',
    d6Jobs: [
      {
        d6: 1,
        title: 'Reparo de Armas Quebradas de Gangue',
        description: 'Trocar percursores tortos, limar molas de carregadores e desengripar fuzis de assalto baratos recolhidos de tiroteios.',
        payoutRanks: { rank1to4: 150, rank5to7: 300, rank8to10: 900 },
      },
      {
        d6: 2,
        title: 'Desbloqueio e Desmanche de Ciberfone Roubado',
        description: 'Remover chips de rastreamento por hardware e restaurar telefones celulares de executivos mortos para revenda de rua.',
        payoutRanks: { rank1to4: 200, rank5to7: 350, rank8to10: 1000 },
      },
      {
        d6: 3,
        title: 'Instalação de Blindagem Balística em Sedans',
        description: 'Soldar placas de liga de titânio nas portas de carros civis para criar veículos resistentes a calibres de pistola.',
        payoutRanks: { rank1to4: 250, rank5to7: 450, rank8to10: 1200 },
      },
      {
        d6: 4,
        title: 'Fabricação de Munição Especial Perfurante (AP)',
        description: 'Passar dias na prensa de bancada produzindo projéteis balanceados com ponta de tungstênio para compradores do submundo.',
        payoutRanks: { rank1to4: 300, rank5to7: 550, rank8to10: 1400 },
        complicationHook: 'A pólvora usada pertencia a um lote militar desviado e a polícia está batendo de porta em porta.',
      },
      {
        d6: 5,
        title: 'Customização de Arma de Qualidade Excelente',
        description: 'Ajustar o peso do gatilho, polir a câmara de disparo e instalar trilhos ergonômicos em um fuzil para um Solo exigente.',
        payoutRanks: { rank1to4: 350, rank5to7: 650, rank8to10: 1600 },
      },
      {
        d6: 6,
        title: 'Engenharia Reversa de Protótipo Militar',
        description: 'Desmontar um ciberbraço secreto roubado da Kang Tao, desenhar os esquemas de engenharia e vendê-los a um fabricante rival.',
        payoutRanks: { rank1to4: 450, rank5to7: 850, rank8to10: 2200 },
      },
    ],
  },
  {
    role: 'Medtech (Médico / Ripperdoc)',
    d6Jobs: [
      {
        d6: 1,
        title: 'Curativos e Suturas em Becos Escuros',
        description: 'Costurar ferimentos de faca e estancar tiros superficiais de gangers que não podem pisar em hospitais do DPNC.',
        payoutRanks: { rank1to4: 150, rank5to7: 350, rank8to10: 950 },
      },
      {
        d6: 2,
        title: 'Venda de Antibióticos e Analgésicos Fracionados',
        description: 'Diluir remédios veterinários e fornecer comprimidos de combate a infecções para clínicas populares do subúrbio.',
        payoutRanks: { rank1to4: 200, rank5to7: 400, rank8to10: 1050 },
      },
      {
        d6: 3,
        title: 'Instalação Rápida de Ciberópticas de Rua',
        description: 'Operar pacientes na cadeira reclinável de um porão instalando olhos mecânicos com visão infravermelha barata.',
        payoutRanks: { rank1to4: 250, rank5to7: 500, rank8to10: 1250 },
        complicationHook: 'O paciente sofreu uma reação alérgica inesperada ao biocimento e teve febre de 40 graus na sua clínica.',
      },
      {
        d6: 4,
        title: 'Estabilização de Cirurgia de Trauma em Beco',
        description: 'Retirar um projétil de fuzil alojado no abdômen de um mercenário ferido sob luz de lanterna e sem anestesia pesada.',
        payoutRanks: { rank1to4: 300, rank5to7: 600, rank8to10: 1450 },
      },
      {
        d6: 5,
        title: 'Síntese de Farmacêuticos Exclusivos (Speedheal)',
        description: 'Produzir lotes controlados de estimulantes de cura celular acelerada para equipes de mercenários do Afterlife.',
        payoutRanks: { rank1to4: 350, rank5to7: 700, rank8to10: 1700 },
      },
      {
        d6: 6,
        title: 'Cirurgia Plástica Facial Clandestina (Mudar Identidade)',
        description: 'Reconstruir as feições ósseas de um fugitivo corporativo alterando impressões digitais e padrões de retina.',
        payoutRanks: { rank1to4: 450, rank5to7: 900, rank8to10: 2400 },
      },
    ],
  },
  {
    role: 'Fixer (Corretor de Mercado)',
    d6Jobs: [
      {
        d6: 1,
        title: 'Intermediação de Venda de Pistolas de Segunda Mão',
        description: 'Aproximar um ladrão de rua e um vigia desarmado, ganhando uma comissão de 15% sobre o valor das armas.',
        payoutRanks: { rank1to4: 150, rank5to7: 350, rank8to10: 1000 },
      },
      {
        d6: 2,
        title: 'Venda de Ingressos Falsos para Festas VIP',
        description: 'Arranjar crachás holográficos clonados para camarotes de boates cobiçadas em Japantown.',
        payoutRanks: { rank1to4: 200, rank5to7: 400, rank8to10: 1100 },
      },
      {
        d6: 3,
        title: 'Aluguel de Esconderijo Seguro (Safehouse)',
        description: 'Ceder a chave de um contêiner abandonado para um grupo de mercenários esfriar a cabeça após um tiroteio.',
        payoutRanks: { rank1to4: 250, rank5to7: 500, rank8to10: 1300 },
        complicationHook: 'A polícia cercou o quarteirão procurando outro criminoso e quase encontrou o seu esconderijo.',
      },
      {
        d6: 4,
        title: 'Organização de Banca em Night Market',
        description: 'Montar a logística de segurança e fornecedores para um mercado noturno de armas e cromo em um galpão portuário.',
        payoutRanks: { rank1to4: 300, rank5to7: 650, rank8to10: 1500 },
      },
      {
        d6: 5,
        title: 'Intermediação de Contrato de Extração Corporativa',
        description: 'Conectar um executivo querendo desertar da Militech a uma equipe de Solos profissionais, cobrando taxa de agenciamento.',
        payoutRanks: { rank1to4: 400, rank5to7: 750, rank8to10: 1800 },
      },
      {
        d6: 6,
        title: 'Monopólio de Remessa de Armas Pesadas',
        description: 'Controlar a distribuição de um contêiner de fuzis de precisão e lança-foguetes para gangues de um distrito inteiro.',
        payoutRanks: { rank1to4: 500, rank5to7: 950, rank8to10: 2500 },
      },
    ],
  },
  {
    role: 'Nomad (Nômade)',
    d6Jobs: [
      {
        d6: 1,
        title: 'Transporte de Carga de Alimentos pelos Badlands',
        description: 'Dirigir uma picape carregada de sacos de grãos por estradas poeirentas desviando de crateras e pregos.',
        payoutRanks: { rank1to4: 150, rank5to7: 350, rank8to10: 950 },
      },
      {
        d6: 2,
        title: 'Batedor de Estrada contra Salteadores Wraiths',
        description: 'Pilotar uma moto off-road 5 km à frente do comboio principal para sinalizar emboscadas e pontes quebradas.',
        payoutRanks: { rank1to4: 200, rank5to7: 400, rank8to10: 1100 },
      },
      {
        d6: 3,
        title: 'Mecânica Rápida de Carretas no Acampamento',
        description: 'Trocar correias de alternador, remendar pneus gigantes e calibrar suspensões de caminhões de combate.',
        payoutRanks: { rank1to4: 250, rank5to7: 500, rank8to10: 1250 },
      },
      {
        d6: 4,
        title: 'Contrabando de Equipamento pela Fronteira Estadual',
        description: 'Atravessar o posto de controle rodoviário com fundos falsos cheios de chips eletrônicos sem pagar taxas de alfândega.',
        payoutRanks: { rank1to4: 300, rank5to7: 600, rank8to10: 1450 },
        complicationHook: 'Guardas da patrulha de fronteira desconfiaram da suspensão baixa e exigiram 100eb de propina.',
      },
      {
        d6: 5,
        title: 'Escolta Armada de Comboio de Combustível CHOOH2',
        description: 'Proteger três carretas tanque com metralhadora rotativa montada na caçamba sob ataque de carros tunados com aríetes.',
        payoutRanks: { rank1to4: 350, rank5to7: 700, rank8to10: 1750 },
      },
      {
        d6: 6,
        title: 'Comando de Operação de Resgate nos Ermos',
        description: 'Liderar uma frota de buggies armados para resgatar membros do clã feitos reféns por bandidos do deserto.',
        payoutRanks: { rank1to4: 450, rank5to7: 900, rank8to10: 2300 },
      },
    ],
  },
  {
    role: 'Rockerboy (Músico Rebelde)',
    d6Jobs: [
      {
        d6: 1,
        title: 'Tocar na Calçada com Violão Sintético',
        description: 'Cantar canções ácidas contra corporações no metrô de Little China com o estojo aberto recebendo moedas de passantes.',
        payoutRanks: { rank1to4: 150, rank5to7: 300, rank8to10: 900 },
      },
      {
        d6: 2,
        title: 'Venda de Fitas de Áudio e Camisetas Feitas em Casa',
        description: 'Imprimir fanzines e vender gravações de shows clandestinos na porta de clubes concorrentes.',
        payoutRanks: { rank1to4: 200, rank5to7: 350, rank8to10: 1000 },
      },
      {
        d6: 3,
        title: 'Show Intimista em Bar de Subsolo',
        description: 'Fazer o som da noite em uma casa apertada com palco de engradados de cerveja e 50 fãs suados cantando junto.',
        payoutRanks: { rank1to4: 250, rank5to7: 450, rank8to10: 1200 },
      },
      {
        d6: 4,
        title: 'Discurso Inflamado e Liderança de Protesto de Rua',
        description: 'Subir no capô de um carro quebrado e conduzir centenas de trabalhadores descontentes contra uma fábrica poluente.',
        payoutRanks: { rank1to4: 300, rank5to7: 550, rank8to10: 1400 },
        complicationHook: 'A polícia dispersou a multidão com gás lacrimogêneo e seu rosto foi marcado como agitador público.',
      },
      {
        d6: 5,
        title: 'Abertura de Show de Banda Renomada no Afterlife',
        description: 'Tocar antes da atração principal em uma noite lendária, conquistando a atenção de Fixers e patrocinadores.',
        payoutRanks: { rank1to4: 350, rank5to7: 700, rank8to10: 1700 },
      },
      {
        d6: 6,
        title: 'Megashow de Estádio Transmitido Globalmente',
        description: 'Apresentação com telões holográficos e transmissão ao vivo no Data Pool mobilizando uma legião de seguidores fanáticos.',
        payoutRanks: { rank1to4: 500, rank5to7: 1000, rank8to10: 2500 },
      },
    ],
  },
  {
    role: 'Media (Jornalista Investigativo)',
    d6Jobs: [
      {
        d6: 1,
        title: 'Fotos Freelancer de Acidentes de Trânsito',
        description: 'Monitorar o rádio da polícia e chegar antes das ambulâncias para tirar fotos dramáticas e vendê-las a tablóides de fofoca.',
        payoutRanks: { rank1to4: 150, rank5to7: 300, rank8to10: 900 },
      },
      {
        d6: 2,
        title: 'Artigo Investigativo sobre Alimentos Contaminados',
        description: 'Escrever uma coluna em screamsheet independente denunciando lotes de ração com toxinas vendidas no subúrbio.',
        payoutRanks: { rank1to4: 200, rank5to7: 350, rank8to10: 1050 },
      },
      {
        d6: 3,
        title: 'Entrevista Exclusiva com Líder de Gangue',
        description: 'Entrar desarmado em um território perigoso do Maelstrom ou Valentinos para gravar um perfil documental cru.',
        payoutRanks: { rank1to4: 250, rank5to7: 450, rank8to10: 1250 },
        complicationHook: 'O gangster não gostou do título da matéria e mandou capangas fazerem ameaças de morte no seu interfone.',
      },
      {
        d6: 4,
        title: 'Vazamento de Documento Corporativo de Propina',
        description: 'Conseguir uma cópia em papel timbrado comprovando suborno de juízes municipais por uma empresa petroquímica.',
        payoutRanks: { rank1to4: 300, rank5to7: 600, rank8to10: 1500 },
      },
      {
        d6: 5,
        title: 'Reportagem Especial Transmitida na Rede 54',
        description: 'Gravar um mini-documentário de 15 minutos com alta audiência expondo esquema de tráfico de implantes clandestinos.',
        payoutRanks: { rank1to4: 350, rank5to7: 750, rank8to10: 1800 },
      },
      {
        d6: 6,
        title: 'Âncora Especial de Notícias com Audiência Milionária',
        description: 'Apresentar um programa investigativo de horário nobre nacional derrubando ações da diretoria da Arasaka na bolsa.',
        payoutRanks: { rank1to4: 450, rank5to7: 950, rank8to10: 2400 },
      },
    ],
  },
  {
    role: 'Lawman (Policial / Agente da Lei)',
    d6Jobs: [
      {
        d6: 1,
        title: 'Turno Extra de Patrulha a Pé na Chuva',
        description: 'Caminhar por quarteirões escuros de Little China no frio verificando portas de lojas trancadas e afastando bêbados.',
        payoutRanks: { rank1to4: 150, rank5to7: 300, rank8to10: 900 },
      },
      {
        d6: 2,
        title: 'Atendimento de Chamada de Perturbação da Ordem',
        description: 'Desarmar uma briga com garrafas quebradas em um restaurante barato sem usar tiros para não gerar papelada.',
        payoutRanks: { rank1to4: 200, rank5to7: 350, rank8to10: 1000 },
      },
      {
        d6: 3,
        title: 'Cumprimento de Mandado de Despejo em Bairro Perigoso',
        description: 'Escoltar oficiais de justiça com colete balístico pesado para retirar ocupantes ilegais de um depósito de gangues.',
        payoutRanks: { rank1to4: 250, rank5to7: 450, rank8to10: 1200 },
      },
      {
        d6: 4,
        title: 'Operação de Batida Policial em Ponto de Drogas',
        description: 'Derrubar a porta de um laboratório de Black Lace com escudo balístico e algemar suspeitos armados.',
        payoutRanks: { rank1to4: 300, rank5to7: 550, rank8to10: 1450 },
        complicationHook: 'Durante a revista, um dos suspeitos sussurrou que o capitão da sua própria delegacia é quem financiava o ponto.',
      },
      {
        d6: 5,
        title: 'Solução de Caso Arquivado de Homicídio Corporativo',
        description: 'Ligar pistas forenses esquecidas em arquivos e prender o assassino de aluguel responsável por uma morte antiga.',
        payoutRanks: { rank1to4: 350, rank5to7: 700, rank8to10: 1750 },
      },
      {
        d6: 6,
        title: 'Comando de Esquadrão Tático de Choque / Max-Tac',
        description: 'Coordenar blindados pesados e Solos de intervenção rápida para neutralizar ameaças militares de alto calibre.',
        payoutRanks: { rank1to4: 450, rank5to7: 900, rank8to10: 2300 },
      },
    ],
  },
  {
    role: 'Exec (Executivo Corporativo)',
    d6Jobs: [
      {
        d6: 1,
        title: 'Horas Extras em Relatórios Contábeis e Planilhas',
        description: 'Passar noites em claro no cubículo corporativo auditando desvios de combustível de frotas executivas.',
        payoutRanks: { rank1to4: 150, rank5to7: 300, rank8to10: 900 },
      },
      {
        d6: 2,
        title: 'Gerenciamento de Estagiários e Operários de Fábrica',
        description: 'Impor metas brutais de produtividade em uma linha de montagem de componentes de ciberware em Heywood.',
        payoutRanks: { rank1to4: 200, rank5to7: 350, rank8to10: 1050 },
      },
      {
        d6: 3,
        title: 'Supervisão de Logística de Armazém Alfandegário',
        description: 'Assinar despachos de contêineres e agilizar a liberação de cargas de alta prioridade sem inspeções da polícia.',
        payoutRanks: { rank1to4: 250, rank5to7: 450, rank8to10: 1250 },
      },
      {
        d6: 4,
        title: 'Intermediação Secreta com Mercenários do Afterlife',
        description: 'Repassar envelopes de eddies e alvos prioritários para Solos de confiança sem deixar rastros na contabilidade oficial.',
        payoutRanks: { rank1to4: 300, rank5to7: 600, rank8to10: 1500 },
        complicationHook: 'A corregedoria interna da corporação abriu uma auditoria nos seus registros de transferências.',
      },
      {
        d6: 5,
        title: 'Aprovação de Orçamento de Divisão de Projetos Especiais',
        description: 'Redirecionar 50.000eb de verba de pesquisa para o desenvolvimento de armamentos restritos e embolsar bonificação.',
        payoutRanks: { rank1to4: 400, rank5to7: 800, rank8to10: 1900 },
      },
      {
        d6: 6,
        title: 'Diretoria de Operações com Jato Executivo e Segurança Privada',
        description: 'Comandar a estratégia de expansão corporativa em todo o setor da Costa Oeste com poder de demissão sumária.',
        payoutRanks: { rank1to4: 500, rank5to7: 1000, rank8to10: 2500 },
      },
    ],
  },
];

// 20+ Eventos de Vida Aleatórios de Downtime (Expandidos com regras mecânicas exatas)
export interface LifeEventRoll {
  d10: number;
  title: string;
  category: 'Finanças' | 'Inimigos' | 'Romance' | 'Cibernéticos' | 'Sorte na Rua';
  description: string;
  mechanicalImpact: string;
}

export const RANDOM_LIFE_EVENTS: LifeEventRoll[] = [
  {
    d10: 1,
    title: 'Cobrança Agressiva de Dívida Antiga',
    category: 'Finanças',
    description: 'Um agiota ou banco de corpos lembrou de uma dívida de 500eb com juros abusivos e mandou cobradores quebrarem os vidros da sua casa.',
    mechanicalImpact: 'Pagar 500eb imediatamente ou sofrer emboscada armada de 2 mooks no próximo trabalho.',
  },
  {
    d10: 2,
    title: 'Achado de Ouro no Lixo Tecnológico',
    category: 'Sorte na Rua',
    description: 'Você encontrou uma caixa abandonada de componentes eletrônicos militares descartados por um laboratório que vale um bom dinheiro.',
    mechanicalImpact: 'Recebe +350eb livres em sua carteira.',
  },
  {
    d10: 3,
    title: 'Falha ou Rejeição Biológica de Ciberware',
    category: 'Cibernéticos',
    description: 'Um dos seus implantes começou a rejeitar tecidos orgânicos provocando dores lancinantes e febre alta de contaminação.',
    mechanicalImpact: 'Gasta 100eb em medicamentos imunossupressores ou sofre penalidade de -1 em testes de Físico (BODY/MOVE) por 1 semana.',
  },
  {
    d10: 4,
    title: 'Inimigo Antigo Ressurge das Sombras',
    category: 'Inimigos',
    description: 'Aquele gangster ou capanga corporativo que você humilhou no passado agora é líder de esquadrão e jurou vingança sangrenta.',
    mechanicalImpact: 'Gera um Inimigo de nível Tenente ativo na campanha que monitora os passos da equipe.',
  },
  {
    d10: 5,
    title: 'Caso de Amor Tóxico ou Intenso nas Ruas',
    category: 'Romance',
    description: 'Você se envolveu romanticamente com alguém charmoso, mas que carrega uma bagagem de problemas, perseguição e dívidas com o submundo.',
    mechanicalImpact: 'Ganha um contato amoroso fiel, mas rola na tabela de Complicações de Namoro a cada mês.',
  },
  {
    d10: 6,
    title: 'Aumento Repentino no Aluguel do Imóvel',
    category: 'Finanças',
    description: 'O proprietário da sua quitinete ou container foi comprado por um conglomerado imobiliário que dobrou a taxa de condomínio.',
    mechanicalImpact: 'O aluguel deste mês custa +200eb adicionais em despesas.',
  },
  {
    d10: 7,
    title: 'Contato Valioso Conquistado no Submundo',
    category: 'Sorte na Rua',
    description: 'Você ajudou um técnico de telecomunicações bêbado a não ser assaltado na saída de uma boate, e ele virou seu amigo leal.',
    mechanicalImpact: 'Ganha um contato com Perícia Electronics/Security Tech 14 para consultas gratuitas durante trabalhos.',
  },
  {
    d10: 8,
    title: 'Caçada por Documentação ou Identidade Falsa',
    category: 'Inimigos',
    description: 'O DPNC descobriu que seu chip de cidadania é forjado e emitiu uma ordem de verificação de antecedentes.',
    mechanicalImpact: 'Deve evitar viaturas da polícia ou pagar 150eb a um Fixer para limpar o registro municipal.',
  },
  {
    d10: 9,
    title: 'Aposta Sortuda no Pachinko de Japantown',
    category: 'Finanças',
    description: 'Uma noite regada a cerveja em Japantown rendeu um jackpot inacreditável em uma máquina de caça-níqueis adulterada.',
    mechanicalImpact: 'Ganha +400eb imediatos limpos para a carteira.',
  },
  {
    d10: 10,
    title: 'Fama e Reconhecimento Positivo nas Ruas',
    category: 'Sorte na Rua',
    description: 'Um vídeo gravado por um transeunte mostrando sua atuação profissional em tiroteio viralizou no Data Pool de Night City.',
    mechanicalImpact: '+1 ponto permanente de Reputação pública no submundo.',
  },
  {
    d10: 11,
    title: 'Tentativa de Furto na sua Residência',
    category: 'Finanças',
    description: 'Ladrões de beco arrombaram sua fechadura digital enquanto você estava fora e levaram mantimentos e equipamentos leves.',
    mechanicalImpact: 'Perde 150eb em itens sobressalentes ou munições armazenadas no quarto.',
  },
  {
    d10: 12,
    title: 'Sobrecarga Elétrica em Eletrodomésticos',
    category: 'Cibernéticos',
    description: 'Um pico de energia na rede do megaprédio queimou o carregador do seu cyberdeck ou a bateria do seu veículo.',
    mechanicalImpact: 'Custa 80eb para reparar o transformador queimado.',
  },
  {
    d10: 13,
    title: 'Favores Políticos Retribuídos',
    category: 'Sorte na Rua',
    description: 'Um funcionário municipal que você ajudou facilitou a liberação de uma licença de armas pesadas no distrito.',
    mechanicalImpact: 'Desconto de 10% na próxima compra em Night Markets de Fixers.',
  },
  {
    d10: 14,
    title: 'Briga de Trânsito com Gangers Armados',
    category: 'Inimigos',
    description: 'Um motorista acelerado por drogas bateu no seu retrovisor e ameaçou puxar um fuzil se você não pagasse o conserto.',
    mechanicalImpact: 'Exige teste de Intimidação DV 13 ou pagar 100eb para evitar tiroteio na hora.',
  },
  {
    d10: 15,
    title: 'Vício ou Dependência em Estimulantes Sintéticos',
    category: 'Cibernéticos',
    description: 'Para aguentar os turnos extenuantes de trabalho noturno, você começou a usar estimulantes de farmácia com frequência.',
    mechanicalImpact: 'Gasta 120eb por mês em doses de estimulante para evitar tremores nas mãos.',
  },
];

// Parâmetros para simulação procedural de Timeskip
export interface ProceduralTimeskipParams {
  months: number;
  role: string;
  roleRank: number; // 1-10
  housingId: string;
  foodId: string;
  traumaTeamId: string;
  downtimeProjectId?: string;
}

export interface MonthlyChronicle {
  month: number;
  hustleRoll: number;
  hustleTitle: string;
  hustleDesc: string;
  hustleEarnings: number;
  housingCost: number;
  foodCost: number;
  traumaCost: number;
  projectCost: number;
  netMonthBalance: number;
  lifeEvent?: LifeEventRoll;
  complication?: string;
  narrativeText: string;
}

export interface ProceduralTimeskipResult {
  monthsCount: number;
  totalEarnings: number;
  totalExpenses: number;
  finalNetBalance: number;
  monthlyChronicles: MonthlyChronicle[];
  projectCompleted?: DowntimeProjectOption;
  summary: string;
  cityShift: string;
  reputationImpact: string;
}

// Simulador procedural completo de Timeskip offline
export function generateProceduralTimeskip(params: ProceduralTimeskipParams): ProceduralTimeskipResult {
  const months = Math.max(1, params.months || 1);
  const housing = HOUSING_OPTIONS.find(h => h.id === params.housingId) || HOUSING_OPTIONS[2]; // Container
  const food = FOOD_OPTIONS.find(f => f.id === params.foodId) || FOOD_OPTIONS[1]; // Prepak
  const trauma = TRAUMA_TEAM_OPTIONS.find(t => t.id === params.traumaTeamId) || TRAUMA_TEAM_OPTIONS[0]; // None
  const project = params.downtimeProjectId ? DOWNTIME_PROJECTS.find(p => p.id === params.downtimeProjectId) : undefined;

  const roleHustleData = DETAILED_ROLE_HUSTLES.find(r => r.role.toLowerCase().includes(params.role.toLowerCase())) || DETAILED_ROLE_HUSTLES[0];

  let totalEarnings = 0;
  let totalExpenses = 0;
  const chronicles: MonthlyChronicle[] = [];

  for (let m = 1; m <= months; m++) {
    // 1d6 roll on role hustle table
    const d6 = Math.floor(Math.random() * 6) + 1;
    const job = roleHustleData.d6Jobs.find(j => j.d6 === d6) || roleHustleData.d6Jobs[0];

    // Determine payout according to rank
    let earnings = job.payoutRanks.rank1to4;
    if (params.roleRank >= 8) {
      earnings = job.payoutRanks.rank8to10;
    } else if (params.roleRank >= 5) {
      earnings = job.payoutRanks.rank5to7;
    }

    // Apply project cost on first month if present
    const projectCost = (m === 1 && project) ? project.costEb : 0;
    const monthExpenses = housing.costEb + food.costEb + trauma.costEb + projectCost;
    const netMonth = earnings - monthExpenses;

    totalEarnings += earnings;
    totalExpenses += monthExpenses;

    // Roll life event
    const randomEvent = RANDOM_LIFE_EVENTS[Math.floor(Math.random() * RANDOM_LIFE_EVENTS.length)];

    const chronicle: MonthlyChronicle = {
      month: m,
      hustleRoll: d6,
      hustleTitle: job.title,
      hustleDesc: job.description,
      hustleEarnings: earnings,
      housingCost: housing.costEb,
      foodCost: food.costEb,
      traumaCost: trauma.costEb,
      projectCost,
      netMonthBalance: netMonth,
      lifeEvent: randomEvent,
      complication: job.complicationHook,
      narrativeText: `Durante o mês ${m}, atuando como ${params.role} (Rank ${params.roleRank}), o personagem trabalhou em "${job.title}". Vivendo em ${housing.name} e comendo ${food.name}, gerou um rendimento de ${earnings}eb contra ${monthExpenses}eb em contas fixas. Saldo do mês: ${netMonth >= 0 ? `+${netMonth}` : netMonth}eb.`,
    };

    chronicles.push(chronicle);
  }

  const finalNet = totalEarnings - totalExpenses;

  const cityShifts = [
    'A guerra de preços entre a Trauma Team e a REO Meatwagon deixou o atendimento de emergência ainda mais agressivo.',
    'O Maelstrom aumentou o território em Watson, forçando pequenas lojas a pagar dobro de taxa de proteção.',
    'A Arasaka instalou três novos postos de monitoramento facial em Charter Hill após rumores de atentado contra diretores.',
    'A escassez de CHOOH2 fez o preço do combustível de carros e motos subir 15% nos postos dos Badlands.',
    'O DPNC abriu concurso emergencial para novos oficiais de rua devido à onda de assaltos em Heywood.',
  ];

  const repImpacts = [
    finalNet >= 0
      ? 'A equipe manteve as contas em dia e garantiu reputação de mercenários disciplinados e confiáveis.'
      : 'As dívidas acumuladas no mês forçaram o grupo a procurar trabalhos mais arriscados com Fixers de reputação duvidosa.',
  ];

  return {
    monthsCount: months,
    totalEarnings,
    totalExpenses,
    finalNetBalance: finalNet,
    monthlyChronicles: chronicles,
    projectCompleted: project,
    summary: `Intervalo de ${months} meses concluído para ${params.role} (Rank ${params.roleRank}). Renda total de trabalhos: ${totalEarnings}eb. Despesas de habitação, comida e saúde: ${totalExpenses}eb. Saldo líquido acumulado: ${finalNet >= 0 ? `+${finalNet}` : finalNet}eb.`,
    cityShift: cityShifts[Math.floor(Math.random() * cityShifts.length)],
    reputationImpact: repImpacts[0],
  };
}

// Compatibilidade com interfaces antigas
export interface RoleHustleTier {
  role: string;
  rank1to4: { formula: string; average: number; description: string };
  rank5to7: { formula: string; average: number; description: string };
  rank8to10: { formula: string; average: number; description: string };
}

export const ROLE_HUSTLES: RoleHustleTier[] = [
  {
    role: 'Solo (Mercenário de Combate)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Segurança de boate local, guarda-costas de Fixer novato, cobrança de pequenas dívidas.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Contratos corporativos de escolta tática, treinamento de milícias de bairro, resgates armados.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Trabalho de assassinato de elite, consultoria tática para a diretoria da Arasaka/Militech.' },
  },
  {
    role: 'Netrunner (Invasor de Rede)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Limpeza de vírus em cyberdecks caseiros, cópias piratas de braindance, invasão de câmeras de trânsito.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Quebra de fortalezas de dados corporativas secundárias, venda de dados confidenciais a Fixers.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Incursões profundas na Blackwall, roubo de protótipos de IAs militares, contra-espionagem global.' },
  },
  {
    role: 'Tech (Técnico / Engenheiro)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Reparo de armas de mooks, desbloqueio de celulares roubados, conserto de eletrodomésticos.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Customização de armas excelentes, blindagem de veículos nômades, fabricação de munição especial.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Invenção de cibernéticos revolucionários e exoesqueletos militares para o mercado negro.' },
  },
  {
    role: 'Medtech (Médico / Ripperdoc)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Costurar ferimentos de bala em becos, receitar antibióticos clandestinos, remoção rápida de projéteis.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Instalação de ciberbraços e olhos cibernéticos, estabilização cirúrgica de gangers baleados.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Cirurgias cerebrais de alta complexidade, síntese de farmacêuticos exclusivos, implantes de bioware militar.' },
  },
  {
    role: 'Fixer (Corretor de Mercado)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Intermediar venda de armas leves usadas, arranjar ingressos falsos para festas, favores de rua.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Organizar mercados noturnos (Night Markets), intermediar contratações de mercenários para corporações.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Monopolizar o comércio de armas pesadas de um distrito inteiro, influenciar eleições municipais.' },
  },
  {
    role: 'Nomad (Nômade)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Transporte de carga seca entre postos dos Badlands, batedor de estrada, reparos mecânicos de caravana.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Contrabando de tecnologia através de fronteiras blindadas, escolta pesada de comboios de água.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Comandar um clã nômade inteiro com esquadrões de AVs e comboios de guerra terrestres.' },
  },
  {
    role: 'Rockerboy (Músico Rebelde)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Shows em bares imundos de subsolo, venda de fitas de áudio piratas, apresentações de rua.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Atração principal em casas de show de médio porte, patrocínios de marcas de refrigerante.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Megashows no Estádio de Night City, liderar protestos que derrubam leis corporativas.' },
  },
  {
    role: 'Media (Jornalista Investigativo)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Artigos freelancer para tablóides de fofocas, fotos de acidentes de trânsito para screamsheets.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Reportagens investigativas exclusivas de corrupção corporativa, documentários para a Rede 54.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Âncora nacional da WNS com audiência de milhões e proteção jurídica integral.' },
  },
  {
    role: 'Lawman (Policial / Agente da Lei)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Turnos extras de patrulha a pé no frio, atendimento de ocorrências domésticas perigosas.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Comandar operações de batida policial em pontos de drogas, resolver casos arquivados de homicídio.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Capitão da Divisão de Crimes Corporativos ou Comandante de Esquadrão Tático da MaxTac.' },
  },
  {
    role: 'Exec (Executivo Corporativo)',
    rank1to4: { formula: '1d6 x 50eb', average: 175, description: 'Supervisão de relatórios contábeis, gerenciamento de estagiários de fábrica, horas extras de escritório.' },
    rank5to7: { formula: '2d6 x 50eb', average: 350, description: 'Diretor de projetos corporativos confidenciais, aprovação de orçamentos de segurança armada.' },
    rank8to10: { formula: '3d6 x 100eb', average: 1050, description: 'Vice-presidente de divisão executiva com jatos corporativos e residência em North Oak.' },
  },
];
