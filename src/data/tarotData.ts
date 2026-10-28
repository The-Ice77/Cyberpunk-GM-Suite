export const TAROT_CARD_BACK_URL = '/tarot_cards/tarot-back.jpg';

// ========================================================
// COMPÊNDIO & REGRAS OFICIAIS DO TAROT DE NIGHT CITY
// Baseado no DLC Oficial "Night City Tarot v1.2" (R. Talsorian Games & CD PROJEKT RED)
// e nos Arcanos Maiores de Cyberpunk 2077 & Phantom Liberty
// ========================================================

export interface TarotCard {
  id: string;
  number: string;
  numberInt: number;
  namePt: string;
  nameEn: string;
  imageUrl: string;
  archetype: string;
  graffitiLocation: string;
  color: string;
  accentBorder: string;
  iconSymbol: string;
  officialRedEffect: {
    summary: string;
    fullText: string;
    criticalInjuriesInflicted?: string[];
  };
  uprightMeaning: string;
  reversedMeaning: string;
  narrativeHook: string;
  loreDescription: string;
}

export type TarotSpreadType = 'omen' | 'streets_three' | 'night_city_cross' | 'edgerunner_destiny' | 'combat_critical';

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  positionLabel: string;
  positionDescription: string;
  revealed: boolean;
}

export interface TarotReadingResult {
  spreadType: TarotSpreadType;
  title: string;
  drawnCards: DrawnCard[];
  overallInterpretation?: string;
  coGMVerdict?: string;
  isAiGenerated: boolean;
}

// 22 ARCANOS MAIORES CANÔNICOS + 4 ARCANOS DE PHANTOM LIBERTY
export const NIGHT_CITY_TAROT_DECK: TarotCard[] = [
  {
    id: 'tarot-0-fool',
    imageUrl: '/tarot_cards/tarot-0-fool.jpg',
    number: '0',
    numberInt: 0,
    namePt: 'O Louco',
    nameEn: 'The Fool',
    archetype: 'O Salto no Abismo & Novos Começos',
    graffitiLocation: 'Parede externa do Apartamento de V no Megabuilding H10, Watson',
    color: '#06b6d4',
    accentBorder: 'border-cyan-500',
    iconSymbol: '🌀',
    officialRedEffect: {
      summary: 'Desativa todo o ciberware do alvo por 1 hora.',
      fullText: 'Todo o ciberware da vítima fica inoperante por uma hora. Cibermembros inoperantes agem como membros de carne desmembrados, pendendo frouxamente. Se o alvo ficar sem sentidos, sofre -4 em qualquer teste (como se em fumaça ou escuridão). Se não tiver ciberware, sofre Ferimento Crítico de Corpo Estranho e perde 3d6 de Humanidade.',
      criticalInjuriesInflicted: ['Corpo Estranho (se sem cromo)'],
    },
    uprightMeaning: 'Início de uma nova jornada mercenária, coragem imprudente, inocência perante os perigos de Night City e o salto de fé no desconhecido.',
    reversedMeaning: 'Ingenuidade fatal, arrogância cega que leva direto a uma emboscada, falta de preparo tático e desastre anunciado.',
    narrativeHook: 'Um Fixer novato oferece um trabalho que parece fácil demais, mas exige pular de cabeça em território hostil sem plano de retirada.',
    loreDescription: 'O Louco representa V no primeiro passo da escada do submundo. É o momento antes do tiro soar, a pureza de quem ainda acredita que sairá ileso das ruas.',
  },
  {
    id: 'tarot-1-magician',
    imageUrl: '/tarot_cards/tarot-1-magician.jpg',
    number: 'I',
    numberInt: 1,
    namePt: 'O Mago',
    nameEn: 'The Magician',
    archetype: 'O Domínio Tecnológico & A Vontade',
    graffitiLocation: 'Pilar sob o viaduto próximo ao Lizzie’s Bar (Moxes), Watson',
    color: '#ec4899',
    accentBorder: 'border-pink-500',
    iconSymbol: '⚡',
    officialRedEffect: {
      summary: 'Destrói 1 ciberware e incendeia o alvo (Deadly on Fire).',
      fullText: 'O Mestre escolhe uma peça de ciberware da vítima: ela é destruída (reparável após a luta). Além disso, a vítima entra na condição Mortiferamente em Chamas (Deadly On Fire, dano contínuo). Se não tiver ciberware, sofre o fogo e uma arma equipada engasga exigindo uma Ação para destravar.',
    },
    uprightMeaning: 'Maestria da tecnologia, netrunning de alta precisão, capacidade de dobrar a realidade física e digital conforme a própria vontade.',
    reversedMeaning: 'Manipulação maliciosa, arrogância cibernética, trapaças na rede e perda do controle sobre as próprias ferramentas.',
    narrativeHook: 'Um Netrunner fantasma entra no feed neural da equipe no meio de uma invasão, oferecendo abrir portas em troca de arquivos confidenciais.',
    loreDescription: 'O Mago é o criador e o usurpador. Representa aqueles que dominam o cromo e a fiação neural, transformando códigos e eletricidade em poder letal.',
  },
  {
    id: 'tarot-2-high-priestess',
    imageUrl: '/tarot_cards/tarot-2-high-priestess.jpg',
    number: 'II',
    numberInt: 2,
    namePt: 'A Alta Sacerdotisa',
    nameEn: 'The High Priestess',
    archetype: 'Os Mistérios da Rede & Intuição',
    graffitiLocation: 'Edifício abandonado onde Hanako Arasaka foi mantida em cativeiro, Heywood',
    color: '#a855f7',
    accentBorder: 'border-purple-500',
    iconSymbol: '🔮',
    officialRedEffect: {
      summary: 'Causa Corpo Estranho venenoso (DV 15 Resistência ou 3d6 dano ao mover).',
      fullText: 'A vítima sofre o Ferimento Crítico de Corpo Estranho. Sempre que mover mais de 4 metros a pé em um Turno, deve vencer teste de DV 15 Resistir a Tortura/Drogas ou sofrer 3d6 de dano direto aos Pontos de Vida (veneno/estilhaço corrosivo).',
      criticalInjuriesInflicted: ['Corpo Estranho Envenenado'],
    },
    uprightMeaning: 'Sabedoria oculta, intuição aguçada, segredos sussurrados além da Blackwall e a verdade velada nos bastidores corporativos.',
    reversedMeaning: 'Segredos perigosos guardados pela metade, duplicidade de caráter, paranoia e manipulação emocional.',
    narrativeHook: 'Um contato da equipe sabe exatamente quem ordenou o ataque, mas só revelará a verdade se for resgatada de um esconderijo sob vigília.',
    loreDescription: 'Guardiã do véu entre a luz das telas e a escuridão dos servidores proibidos. Ela exige silêncio, paciência e respeito aos mistérios não solucionados.',
  },
  {
    id: 'tarot-3-empress',
    imageUrl: '/tarot_cards/tarot-3-empress.jpg',
    number: 'III',
    numberInt: 3,
    namePt: 'A Imperatriz',
    nameEn: 'The Empress',
    archetype: 'Abundância, Poder Materno & Autoridade',
    graffitiLocation: 'Entrada subterrânea do Afterlife, Little China, Watson',
    color: '#eab308',
    accentBorder: 'border-yellow-500',
    iconSymbol: '👑',
    officialRedEffect: {
      summary: 'A música sobe: os próximos 3 ataques bem-sucedidos causam Ferimentos Críticos garantidos!',
      fullText: 'A música sobe e a adrenalina estoura. Os próximos três testes de ataque bem-sucedidos contra um único oponente neste combate infligem Ferimentos Críticos automaticamente, independentemente do que os dados de dano mostrarem.',
    },
    uprightMeaning: 'Prosperidade nas ruas, contratos lucrativos, influência dominante no submundo (o trono de Rogue no Afterlife) e fertilidade de alianças.',
    reversedMeaning: 'Dependência sufocante de um patrono implacável, ganância desmedida, tirania e manipulação dos subordinados como peões descartáveis.',
    narrativeHook: 'Uma figura lendária das ruas decide apadrinhar a equipe, abrindo portas de ouro, mas exigindo fidelidade cega em uma guerra silenciosa.',
    loreDescription: 'Rogue Amendiares sentada em sua cabine no Afterlife. Ela dita quem vive, quem morre e quem recebe contratos que pagam milhões de ed-bucks.',
  },
  {
    id: 'tarot-4-emperor',
    imageUrl: '/tarot_cards/tarot-4-emperor.jpg',
    number: 'IV',
    numberInt: 4,
    namePt: 'O Imperador',
    nameEn: 'The Emperor',
    archetype: 'A Ordem Rígida & O Controle Corporativo',
    graffitiLocation: 'Perto da Praça Konpeki Plaza, Arasaka Waterfront, Watson',
    color: '#ef4444',
    accentBorder: 'border-red-500',
    iconSymbol: '🏛️',
    officialRedEffect: {
      summary: 'Um Jogador escolhe 1 Ferimento Crítico de Cabeça e 1 de Tronco para o alvo sofrer!',
      fullText: 'O Imperador concede o poder de moldar a narrativa. O Mestre escolhe um Jogador para selecionar um Ferimento Crítico da tabela de Cabeça e um da tabela de Tronco. A vítima sofre ambos os Ferimentos Críticos imediatamente.',
    },
    uprightMeaning: 'Estrutura inabalável, autoridade máxima, estabilidade imposta pelo ferro e a supremacia corporativa de Saburo Arasaka.',
    reversedMeaning: 'Tirania fria, despotismo megalomaníaco, burocracia assassina e o esmagamento implacável da dignidade individual.',
    narrativeHook: 'Uma megacorporação decreta toque de recolher e bloqueia um distrito inteiro com tanques e Solos blindados, prendendo a equipe no epicentro.',
    loreDescription: 'Saburo Arasaka e o absolutismo das megacorporações. O poder que transcende a mortalidade através de bancos de dados neurais e monopólio bélico.',
  },
  {
    id: 'tarot-5-hierophant',
    imageUrl: '/tarot_cards/tarot-5-hierophant.jpg',
    number: 'V',
    numberInt: 5,
    namePt: 'O Hierofante',
    nameEn: 'The Hierophant',
    archetype: 'A Tradição, O Código de Honra & A Fé',
    graffitiLocation: 'Túnel de esgoto perto de Japantown, Westbrook',
    color: '#f97316',
    accentBorder: 'border-orange-500',
    iconSymbol: '📜',
    officialRedEffect: {
      summary: 'O ataque causa DANO DUPLO, mas a arma usada é destruída para sempre!',
      fullText: 'O ataque causa o DOBRO do dano que causaria após a armadura e multiplicadores serem calculados. Contudo, se foi feito por uma arma, ela é destruída além de qualquer possibilidade de reparo pelo sacrifício exigido.',
    },
    uprightMeaning: 'Respeito aos velhos códigos de honra das ruas (Padre Ibarra e Takemura), mentoria de veteranos, compromisso inabalável com a palavra dada.',
    reversedMeaning: 'Fanatismo cego, obediência a regras obsoletas que custam vidas, traição de juramentos sagrados e hipocrisia moral.',
    narrativeHook: 'Um veterano respeitado exige que a equipe resolva um conflito sangrento sem disparar tiros, seguindo os rituais antigos de julgamento de honra.',
    loreDescription: 'A bússola moral em uma cidade sem alma. Representa aqueles que ainda acreditam em lealdade, honra familiar e promessas seladas com sangue.',
  },
  {
    id: 'tarot-6-lovers',
    imageUrl: '/tarot_cards/tarot-6-lovers.jpg',
    number: 'VI',
    numberInt: 6,
    namePt: 'Os Enamorados',
    nameEn: 'The Lovers',
    archetype: 'A Encruzilhada Moral & Laços Inquebráveis',
    graffitiLocation: 'Paredão do cinema Drive-in abandonado em North Oak, Westbrook',
    color: '#f43f5e',
    accentBorder: 'border-rose-500',
    iconSymbol: '❤️',
    officialRedEffect: {
      summary: 'O ataque atinge a Cabeça e agarra o oponente (Grapple automático).',
      fullText: 'Este ataque agora acerta a cabeça, mesmo se mirado em outro local. Se foi um ataque corpo a corpo, a vítima é imediatamente considerada a defensora agarrada (Grappled) pelo atacante.',
    },
    uprightMeaning: 'Alianças profundas forjadas no fogo, paixão avassaladora, cumplicidade sob fogo cruzado e escolhas dramáticas de vida ou morte.',
    reversedMeaning: 'Traição romântica ou entre parceiros de equipe, conflito destrutivo de interesses e a quebra irreparável de confiança.',
    narrativeHook: 'Dois mercenários rivais que se amavam no passado são contratados em lados opostos de um assalto corporativo.',
    loreDescription: 'A dor e a beleza de amar em Night City. Escolher entre salvar a pessoa que você ama ou cumprir o contrato e garantir a sobrevivência.',
  },
  {
    id: 'tarot-7-chariot',
    imageUrl: '/tarot_cards/tarot-7-chariot.jpg',
    number: 'VII',
    numberInt: 7,
    namePt: 'O Carro',
    nameEn: 'The Chariot',
    archetype: 'Velocidade, Determinação & Conquista',
    graffitiLocation: 'Parede perto de Tom’s Diner, Little China, Watson',
    color: '#3b82f6',
    accentBorder: 'border-blue-500',
    iconSymbol: '🏎️',
    officialRedEffect: {
      summary: 'Ablação extra de 5 pontos na blindagem do alvo, mesmo sem penetrar!',
      fullText: 'O ataque encontra uma falha estrutural fortuita na armadura do alvo, abrindo um rombo. A blindagem da vítima na localização atingida é ablada em 5 pontos adicionais, mesmo se o dano não penetrou o SP original.',
    },
    uprightMeaning: 'Ímpeto triunfante, controle absoluto sobre a máquina e a velocidade, vitória pela obstinação e perseguições eletrizantes no asfalto.',
    reversedMeaning: 'Perda catastrófica de controle, arrogância veloz que culmina em colisão fatal, agressividade cega e fuga desgovernada.',
    narrativeHook: 'Uma perseguição em alta velocidade pela autoestrada de Night City transportando uma carga que explode se o velocímetro cair abaixo de 80 km/h.',
    loreDescription: 'Os motores rugindo a CHOOH2 e o asfalto sangrando. Representa o guerreiro que assume o volante de seu próprio destino e não pisa no freio.',
  },
  {
    id: 'tarot-8-strength',
    imageUrl: '/tarot_cards/tarot-8-strength.jpg',
    number: 'VIII',
    numberInt: 8,
    namePt: 'A Força',
    nameEn: 'Strength',
    archetype: 'Resiliência, Coragem & Autodomínio',
    graffitiLocation: 'Parede de armazém industrial em Rancho Coronado, Santo Domingo',
    color: '#10b981',
    accentBorder: 'border-emerald-500',
    iconSymbol: '🦁',
    officialRedEffect: {
      summary: 'O ataque causa +25 de DANO BRUTO ADICIONAL antes da armadura!',
      fullText: 'A Força empodera o ataque com brutalidade devastadora. O ataque causa 25 de dano adicional. Esse dano extra é somado ao dano rolado ANTES de subtrair o SP da armadura ou calcular qualquer multiplicador.',
    },
    uprightMeaning: 'Coragem estoica sob fogo de artilharia, domínio da própria mente sobre os impulsos assassinos do cromo e triunfo moral.',
    reversedMeaning: 'Brutalidade vazia, queda na selvageria descontrolada da ciberpsicose e o colapso da resistência física.',
    narrativeHook: 'Um Solo de elite ferido protege a retirada de civis sozinho contra um esquadrão inteiro em um corredor estreito.',
    loreDescription: 'A verdadeira força não reside nos pistões hidráulicos de um ciberbraço de titânio, mas na capacidade de suportar a dor sem perder a humanidade.',
  },
  {
    id: 'tarot-9-hermit',
    imageUrl: '/tarot_cards/tarot-9-hermit.jpg',
    number: 'IX',
    numberInt: 9,
    namePt: 'O Eremita',
    nameEn: 'The Hermit',
    archetype: 'O Isolamento, A Blackwall & A Busca Interior',
    graffitiLocation: 'Fachada da igreja dos Voodoo Boys em Pacifica',
    color: '#6366f1',
    accentBorder: 'border-indigo-500',
    iconSymbol: '🕯️',
    officialRedEffect: {
      summary: 'Causa Olho Perdido DUAS VEZES no alvo (-4 em testes se ficar cego).',
      fullText: 'A vítima sofre o Ferimento Crítico de Olho Perdido duas vezes (o penalizador de perícia se aplica uma vez). Se isso deixar o alvo sem visão/sensores, sofre penalidade de -4 em qualquer teste por obscuridade total.',
      criticalInjuriesInflicted: ['Olho Perdido (x2)'],
    },
    uprightMeaning: 'Introspecção profunda, pesquisa solitária nos cantos escuros do Data Pool, busca de mentores que vivem à margem e verdades ocultas.',
    reversedMeaning: 'Isolamento amargo, paranoia crônica, solidão destrutiva e a perda completa da capacidade de se relacionar com outros seres humanos.',
    narrativeHook: 'O único técnico capaz de destrancar um vírus militar vive em um bunker subaquático em Pacifica e recusa contato com estranhos.',
    loreDescription: 'Alt Cunningham vivendo como um código senciente além da muralha de gelo da Blackwall. Conhecimento supremo conquistado ao preço do desapego carnal.',
  },
  {
    id: 'tarot-10-wheel-of-fortune',
    imageUrl: '/tarot_cards/tarot-10-wheel-of-fortune.jpg',
    number: 'X',
    numberInt: 10,
    namePt: 'A Roda da Fortuna',
    nameEn: 'Wheel of Fortune',
    archetype: 'O Caos das Ruas & A Reviravolta do Destino',
    graffitiLocation: 'Parede do Sunset Motel nos Badlands do Leste',
    color: '#e11d48',
    accentBorder: 'border-rose-600',
    iconSymbol: '🎡',
    officialRedEffect: {
      summary: 'O ataque desvia para outro alvo aleatório ou cai no chão, e a arma emperra!',
      fullText: 'Ataque à distância: o Mestre determina um novo alvo aleatório próximo para receber o disparo. Ataque corpo a corpo: quem atacou cai no chão (Prone) e o ataque erra. A arma usada emperra exigindo uma Ação para destravar.',
    },
    uprightMeaning: 'Mudança radical de sorte, virada inesperada a favor dos Edgerunners, oportunidades de ouro que caem do céu como chuva ácida.',
    reversedMeaning: 'Maré de azar terrível, complicação imprevista no clímax do trabalho e a perda repentina de tudo o que foi conquistado.',
    narrativeHook: 'Um tiroteio é subitamente interrompido por um terremoto de baixa intensidade que rompe tubulações de gás inflamável.',
    loreDescription: 'Em Night City, um segundo você está bebendo champanhe sintético na cobertura corporativa; no segundo seguinte, seu corpo é desovado em uma caçamba de lixo.',
  },
  {
    id: 'tarot-11-justice',
    imageUrl: '/tarot_cards/tarot-11-justice.jpg',
    number: 'XI',
    numberInt: 11,
    namePt: 'A Justiça',
    nameEn: 'Justice',
    archetype: 'Causa e Efeito, Ajuste de Contas & Veredito',
    graffitiLocation: 'Cisterna sob viaduto industrial em Arroyo, Santo Domingo',
    color: '#14b8a6',
    accentBorder: 'border-teal-500',
    iconSymbol: '⚖️',
    officialRedEffect: {
      summary: 'Tira o fôlego da vítima: -5 em Esquiva contra Melee e NÃO PODE esquivar de tiros!',
      fullText: 'O ataque atinge com clareza penetrante e arranca o ar dos pulmões da vítima. Pelo próximo minuto (10 rodadas), ela sofre -5 em testes de Esquiva contra ataques corporais e NÃO PODE esquivar de ataques à distância de forma alguma.',
    },
    uprightMeaning: 'As consequências inevitáveis dos atos pregressos, dívidas cobradas com juros, verdade exposta na rede e o equilíbrio cármico das ruas.',
    reversedMeaning: 'Injustiça impune, corporações que compram juízes e delegados, condenação de inocentes e abuso de poder desmedido.',
    narrativeHook: 'Uma vítima de um trabalho anterior da equipe ressurge contratando Solos do Afterlife para exigir indenização ou sangue.',
    loreDescription: 'Não há justiça cega na cidade da ganância; a justiça aqui é rápida, de calibre pesado e não perdoa quem deixa pontas soltas pelo caminho.',
  },
  {
    id: 'tarot-12-hanged-man',
    imageUrl: '/tarot_cards/tarot-12-hanged-man.jpg',
    number: 'XII',
    numberInt: 12,
    namePt: 'O Enforcado',
    nameEn: 'The Hanged Man',
    archetype: 'O Sacrifício Voluntário & Nova Perspectiva',
    graffitiLocation: 'Torre d’água nos poços de petróleo petrolíferos fora dos limites urbanos',
    color: '#8b5cf6',
    accentBorder: 'border-violet-500',
    iconSymbol: '🪢',
    officialRedEffect: {
      summary: 'Derruba o alvo no chão e inflige Lesão Espinhal e Efeito Chicote!',
      fullText: 'O Enforcado significa sacrifício doloroso. A vítima é derrubada no chão (Prone) e sofre simultaneamente os Ferimentos Críticos de Lesão Espinhal (Spinal Injury) e Efeito Chicote (Whiplash).',
      criticalInjuriesInflicted: ['Lesão Espinhal', 'Efeito Chicote'],
    },
    uprightMeaning: 'Olhar o mundo de cabeça para baixo, sacrifício calculado em nome dos parceiros, aceitar uma pausa forçada para repensar os planos.',
    reversedMeaning: 'Sacrifício inútil, martírio tolo por quem não merece, teimosia autodestrutiva e recusa em enxergar a verdade evidente.',
    narrativeHook: 'Um dos mercenários precisa se entregar como refém voluntário para dar tempo da van de fuga dos civis escapar dos radares.',
    loreDescription: 'Estar suspenso entre a vida e a morte. Johnny Silverhand preso dentro da mente de V, assistindo ao mundo através de olhos que não são seus.',
  },
  {
    id: 'tarot-13-death',
    imageUrl: '/tarot_cards/tarot-13-death.jpg',
    number: 'XIII',
    numberInt: 13,
    namePt: 'A Morte',
    nameEn: 'Death',
    archetype: 'A Transformação Radical & O Fim de Uma Era',
    graffitiLocation: 'Outdoor de vidro perto do restaurante Embers, The Glen, Heywood',
    color: '#64748b',
    accentBorder: 'border-slate-500',
    iconSymbol: '💀',
    officialRedEffect: {
      summary: 'Alvo rola Death Save imediato! Se falhar, vai a 0 HP; ao acordar, ganha 3d6 de Humanidade!',
      fullText: 'A vítima deve rolar imediatamente um Teste de Morte (Death Save). Se falhar, é reduzida a 0 HP e fica inconsciente por 1 minuto. Ao recobrar a consciência, recupera 3d6 Pontos de Humanidade (até o máximo) pelo choque transformador da quase morte.',
    },
    uprightMeaning: 'Fim definitivo de um ciclo longo, morte de uma identidade velha para o renascimento de uma lenda, metamorfose necessária e inevitável.',
    reversedMeaning: 'Resistência desesperada ao óbvio, apodrecimento em uma situação sem saída, pavor paralisante da mortalidade.',
    narrativeHook: 'O patrono ou mentor mais importante da equipe é assassinado em praça pública, forçando os personagens a assumirem o comando do submundo.',
    loreDescription: 'A Morte não é apenas o túmulo; é a faca que corta as correntes do passado. Em Night City, para virar uma lenda viva, parte de você precisa morrer.',
  },
  {
    id: 'tarot-14-temperance',
    imageUrl: '/tarot_cards/tarot-14-temperance.jpg',
    number: 'XIV',
    numberInt: 14,
    namePt: 'A Temperança',
    nameEn: 'Temperance',
    archetype: 'Harmonia entre Mente e Cromo & Autocontrole',
    graffitiLocation: 'Paredão do Columbário de North Oak, Westbrook',
    color: '#0ea5e9',
    accentBorder: 'border-sky-500',
    iconSymbol: '🕊️',
    officialRedEffect: {
      summary: 'A vítima escolhe um membro para ser Desmembrado e outro para ser Quebrado!',
      fullText: 'A Temperança exige uma escolha com significado pessoal. A vítima deve escolher um de seus membros para sofrer o Ferimento Crítico Desmembrado (Dismembered), e depois um membro diferente para sofrer Membro Quebrado (Broken).',
      criticalInjuriesInflicted: ['Membro Desmembrado', 'Membro Quebrado'],
    },
    uprightMeaning: 'Equilíbrio zen entre cromo e carne, paciência tática em emboscadas, moderação, manter a compostura quando todos entram em pânico.',
    reversedMeaning: 'Desequilíbrio letal, conflito entre software e emoções, fúria cega que consome recursos e munição.',
    narrativeHook: 'Um ciborgue quase totalmente militarizado pede ajuda à equipe para mediar um acordo de paz entre duas células rivais sem recorrer a armas.',
    loreDescription: 'O final onde Johnny assume o corpo de V em paz e parte de Night City em um ônibus. A aceitação serena do fluxo da vida e da máquina.',
  },
  {
    id: 'tarot-15-devil',
    imageUrl: '/tarot_cards/tarot-15-devil.jpg',
    number: 'XV',
    numberInt: 15,
    namePt: 'O Diabo',
    nameEn: 'The Devil',
    archetype: 'O Pacto Faustiano & As Correntes Corporativas',
    graffitiLocation: 'Projeção mental e parede secreta no laboratório Mikoshi da Arasaka',
    color: '#dc2626',
    accentBorder: 'border-red-600',
    iconSymbol: '😈',
    officialRedEffect: {
      summary: 'Ataque atinge a Cabeça automaticamente e causa Lesão Cerebral e Orelha Perdida!',
      fullText: 'O Diabo pune os excessos e o medo. Este ataque acerta a cabeça, mesmo se originalmente mirado em outro lugar. Adicionalmente, a vítima sofre simultaneamente os Ferimentos Críticos de Lesão Cerebral (Brain Injury) e Orelha Perdida (Lost Ear).',
      criticalInjuriesInflicted: ['Lesão Cerebral', 'Orelha Perdida'],
    },
    uprightMeaning: 'O abraço da besta corporativa, assinar um contrato com letras miúdas em troca de salvação temporária, perda da alma para a máquina.',
    reversedMeaning: 'Rebelião violenta contra os mestres que o escravizam, quebra de contratos leoninos e arrancamento das algemas.',
    narrativeHook: 'Um executivo da Arasaka oferece salvar a vida de um aliado da equipe em troca de um chip de inteligência que os personagens roubaram.',
    loreDescription: 'O pacto com a Arasaka. V preso em uma estação espacial como uma mente copiada no Mikoshi. A ilusão de controle que termina em subserviência eterna.',
  },
  {
    id: 'tarot-16-tower',
    imageUrl: '/tarot_cards/tarot-16-tower.jpg',
    number: 'XVI',
    numberInt: 16,
    namePt: 'A Torre',
    nameEn: 'The Tower',
    archetype: 'A Catástrofe Repentina & A Queda de Monólitos',
    graffitiLocation: 'Base dos escombros da antiga Torre Arasaka, Memorial Park, City Center',
    color: '#f59e0b',
    accentBorder: 'border-amber-500',
    iconSymbol: '🗼',
    officialRedEffect: {
      summary: 'Crânio Rachado, Traqueia Esmagada e Chicote! Por 1h, não sente dor e ignora Ferimento Grave!',
      fullText: 'A Torre é o desastre que revela resiliência oculta. O alvo sofre Crânio Rachado, Traqueia Esmagada e Efeito Chicote (sem bônus de dano extra). Pela próxima hora, a vítima não sente dor e ignora todas as penalidades de Ferimento Grave!',
      criticalInjuriesInflicted: ['Crânio Rachado', 'Traqueia Esmagada', 'Efeito Chicote'],
    },
    uprightMeaning: 'Colapso repentino de estruturas tidas como intocáveis (como a bomba atômica de 2023), choque brutal que limpa o tabuleiro de mentiras.',
    reversedMeaning: 'Tentar conter uma explosão inevitável com as mãos nuas, desastre adiado por pouco e pânico desenfreado.',
    narrativeHook: 'O complexo de servidores que a equipe invadiu entra em processo de autodestruição com colapso estrutural do teto em 3 minutos.',
    loreDescription: 'A noite de 20 de agosto de 2023, quando a Torre Arasaka caiu em chamas atômicas. O lembrete eterno de que nenhum império é invencível.',
  },
  {
    id: 'tarot-17-star',
    imageUrl: '/tarot_cards/tarot-17-star.jpg',
    number: 'XVII',
    numberInt: 17,
    namePt: 'A Estrela',
    nameEn: 'The Star',
    archetype: 'A Esperança, A Família Nômade & O Céu Aberto',
    graffitiLocation: 'Antena de sinal solar no acampamento dos Aldecaldos, Badlands do Sul',
    color: '#38bdf8',
    accentBorder: 'border-sky-400',
    iconSymbol: '⭐',
    officialRedEffect: {
      summary: 'Disparo perfura e ricocheteia acertando um 2º inimigo (ou o mesmo alvo 2x)!',
      fullText: 'Ataque à Distância: perfura o alvo e ricocheteia acertando um segundo inimigo a até 20 metros (ou o mesmo alvo uma segunda vez no tronco com nova rolagem de dano!). Ataque Melee: causa Costelas Quebradas e Pulmão Colapsado.',
      criticalInjuriesInflicted: ['Costelas Quebradas (se Melee)', 'Pulmão Colapsado (se Melee)'],
    },
    uprightMeaning: 'Esperança pura, cura das feridas mais profundas, a solidariedade dos Nômades sob as estrelas dos Badlands e um futuro promissor.',
    reversedMeaning: 'Falsa esperança vendida por charlatões, desespero disfarçado de otimismo e miragens nas areias do deserto.',
    narrativeHook: 'Um comboio de Nômades corta a cerca de segurança da cidade e oferece uma rota de fuga limpa no meio de um cerco militar.',
    loreDescription: 'O final onde V e Panam partem de Night City montados no tanque Basilisk em direção ao horizonte livre. A vitória que não precisa de manchete de jornal.',
  },
  {
    id: 'tarot-18-moon',
    imageUrl: '/tarot_cards/tarot-18-moon.jpg',
    number: 'XVIII',
    numberInt: 18,
    namePt: 'A Lua',
    nameEn: 'The Moon',
    archetype: 'A Ilusão, O Delírio & A Loucura Subconsciente',
    graffitiLocation: 'Muro do complexo residencial fechado da Arasaka em North Oak, Westbrook',
    color: '#c084fc',
    accentBorder: 'border-purple-400',
    iconSymbol: '🌙',
    officialRedEffect: {
      summary: 'Corpo Estranho DUAS VEZES (cabeça e corpo); arma melee fica cravada e desarma o atacante!',
      fullText: 'A Lua brilha sobre a ferocidade cega. A vítima sofre o Ferimento Crítico de Corpo Estranho duas vezes: uma no corpo e uma na cabeça. Se foi por arma branca, a arma fica cravada no corpo do alvo e o atacante é desarmado!',
      criticalInjuriesInflicted: ['Corpo Estranho no Tronco', 'Corpo Estranho na Cabeça'],
    },
    uprightMeaning: 'Nada é o que parece no reflexo prateado, ilusões de ótica, conspirações que desafiam a lógica e a necessidade de confiar no instinto animal.',
    reversedMeaning: 'Dissipação gradual da névoa de mentiras, acordar de um pesadelo químico e a clareza conquistada após a loucura.',
    narrativeHook: 'O cliente que contratou a equipe era, na verdade, uma projeção holográfica operada por uma IA rebelde para testar as defesas da fábrica.',
    loreDescription: 'A estação orbital Crystal Palace flutuando distante na órbita da Terra. O sonho inalcançável de escapar da lama enquanto se afoga nela.',
  },
  {
    id: 'tarot-19-sun',
    imageUrl: '/tarot_cards/tarot-19-sun.jpg',
    number: 'XIX',
    numberInt: 19,
    namePt: 'O Sol',
    nameEn: 'The Sun',
    archetype: 'A Glória Máxima & A Consagração da Lenda',
    graffitiLocation: 'Parede da torre de transmissão em Little China, Watson',
    color: '#fbbf24',
    accentBorder: 'border-amber-400',
    iconSymbol: '☀️',
    officialRedEffect: {
      summary: 'Detona uma granada nos bolsos da vítima imediatamente ou destrói seu equipamento!',
      fullText: 'O Sol é a celebração do massacre deslumbrante. Se a vítima carregar qualquer granada ou explosivo, o Mestre escolhe um deles para EXPLODIR IMEDIATAMENTE no corpo dela! Se não tiver explosivos, um item de equipamento é desintegrado além do reparo.',
    },
    uprightMeaning: 'Sucesso triunfante, nome gravado em letras douradas no cardápio do Afterlife, realização dos sonhos e o ápice da glória nas ruas.',
    reversedMeaning: 'Falsa sensação de vitória que atrai inveja mortal, queimar-se ao voar perto demais do sol e triunfos com custos impagáveis.',
    narrativeHook: 'A equipe realiza um trabalho tão espetacular que todos os Fixers de Night City começam a disputar seus serviços pagando em dobro.',
    loreDescription: 'V no topo do mundo como a maior lenda viva do Afterlife, vestindo terno de luxo e olhando a cidade do topo da torre. A glória absoluta.',
  },
  {
    id: 'tarot-20-judgement',
    imageUrl: '/tarot_cards/tarot-20-judgement.jpg',
    number: 'XX',
    numberInt: 20,
    namePt: 'O Julgamento',
    nameEn: 'Judgement',
    archetype: 'O Acerto de Contas Final & O Despertar',
    graffitiLocation: 'Pilar na arena subterrânea da antiga Arasaka Tower, City Center',
    color: '#fb7185',
    accentBorder: 'border-rose-400',
    iconSymbol: '📯',
    officialRedEffect: {
      summary: 'Dedos Esmagados em uma mão e Mão Desmembrada na outra mão!',
      fullText: 'O Julgamento é um despertar doloroso do qual ninguém sai intacto. A vítima sofre o Ferimento Crítico Dedos Esmagados (Crushed Fingers) em uma das mãos, e Mão Desmembrada (Dismembered Hand) na outra mão!',
      criticalInjuriesInflicted: ['Dedos Esmagados', 'Mão Desmembrada'],
    },
    uprightMeaning: 'A hora de responder pelos próprios atos diante da história, reconciliação com o passado, decisão definitiva sem retorno e despertar.',
    reversedMeaning: 'Condenação inexorável, covardia perante os erros cometidos, arrependimento tardio e a justiça dos homens que falha.',
    narrativeHook: 'Um tribunal improvisado do submundo reúne representantes de várias facções para julgar uma quebra de trégua envolvendo a equipe.',
    loreDescription: 'O momento em que os sinos dobram e você não pode mais fugir de quem você é. A resposta final à pergunta: você prefere morrer como ninguém ou viver para sempre como lenda?',
  },
  {
    id: 'tarot-21-world',
    imageUrl: '/tarot_cards/tarot-21-world.jpg',
    number: 'XXI',
    numberInt: 21,
    namePt: 'O Mundo',
    nameEn: 'The World',
    archetype: 'A Conclusão do Ciclo, Plenitude & Legado',
    graffitiLocation: 'Terraço do prédio de Misty perto da clínica do Viktor, Little China, Watson',
    color: '#22c55e',
    accentBorder: 'border-emerald-500',
    iconSymbol: '🌍',
    officialRedEffect: {
      summary: 'Quem causou o efeito ganha 1 TURNO EXTRA com +5 em todas as perícias e ignora ferimentos!',
      fullText: 'O Mundo coloca tudo em perspectiva em um instante de iluminação e adrenalina pura. O personagem que causou a tiragem do Mundo GANHA UM TURNO ADICIONAL imediatamente. Durante esse turno, recebe +5 em qualquer teste de perícia, ignora todas as penalidades de ferimentos e não precisa rolar Death Save se estiver mortalmente ferido!',
    },
    uprightMeaning: 'Conclusão vitoriosa de uma campanha épica, domínio sobre o ambiente, integração total da equipe e legado indelével na história da cidade.',
    reversedMeaning: 'Sensação de incompletude, pontas soltas que se recusam a fechar e a incapacidade de aceitar que um capítulo terminou.',
    narrativeHook: 'O golpe mestre é finalizado com precisão cirúrgica, redefinindo o equilíbrio de poder de Night City para as próximas décadas.',
    loreDescription: 'O terraço de Misty com vista para os telhados de Watson. O fechamento do ciclo de V, onde todas as escolhas convergem para um único ponto de paz e destino.',
  },

  // BÔNUS: 4 ARCANOS DA CORTE DE PHANTOM LIBERTY (DOGTOWN)
  {
    id: 'tarot-king-cups',
    imageUrl: '/tarot_cards/tarot-king-cups.jpg',
    number: 'KC',
    numberInt: 22,
    namePt: 'Rei de Copas',
    nameEn: 'King of Cups',
    archetype: 'O Alívio do Sofrimento & O Fim da Dor',
    graffitiLocation: 'Parede nos túneis subterrâneos de Dogtown, Pacifica',
    color: '#38bdf8',
    accentBorder: 'border-sky-500',
    iconSymbol: '🏆',
    officialRedEffect: {
      summary: 'Misericórdia tática: remove todos os Ferimentos Críticos de um aliado ferido!',
      fullText: 'O Rei de Copas representa a compaixão e o alívio do tormento. Quando ativado, um combatente aliado no campo de batalha é imediatamente estabilizado, curando 2d6 de HP e neutralizando todas as penalidades de Ferimentos Críticos pelo resto do combate.',
    },
    uprightMeaning: 'Misericórdia no meio da carnificina, alívio da dor alheia, lealdade emocional pura e o fim do sofrimento de um companheiro.',
    reversedMeaning: 'Frieza que permite a morte de inocentes, manipulação por pena e decisões covardes vestidas de compaixão.',
    narrativeHook: 'Um médico desertor da Militech pede proteção para retirar civis doentes de uma zona de fogo cruzado em Dogtown.',
    loreDescription: 'O final trágico e misericordioso de Songbird em Phantom Liberty, quando V escolhe honrar seu último pedido de libertação.',
  },
  {
    id: 'tarot-king-swords',
    imageUrl: '/tarot_cards/tarot-king-swords.jpg',
    number: 'KS',
    numberInt: 23,
    namePt: 'Rei de Espadas',
    nameEn: 'King of Swords',
    archetype: 'A Razão de Estado, O Dever & O Preço Militar',
    graffitiLocation: 'Entrada da base de comando da BARGHEST no Estádio de Dogtown',
    color: '#94a3b8',
    accentBorder: 'border-slate-400',
    iconSymbol: '⚔️',
    officialRedEffect: {
      summary: 'Precisão militar: o próximo ataque da equipe ignora COMPLETAMENTE o SP da blindagem!',
      fullText: 'O Rei de Espadas golpeia com precisão cirúrgica militar. O próximo ataque realizado pela equipe ignora 100% da blindagem (SP) do alvo, causando dano direto aos Pontos de Vida.',
    },
    uprightMeaning: 'Lealdade cega ao dever, precisão tática implacável (Solomon Reed), sacrifício pessoal pela missão e razão sobre a emoção.',
    reversedMeaning: 'Traidor que age por obediência cega a governos corruptos, desumanização e remorso sufocado por ordens superiores.',
    narrativeHook: 'Um agente secreto do governo da NUSA exige que a equipe entregue seu contratante para evitar uma intervenção militar federal.',
    loreDescription: 'Solomon Reed. O soldado de ferro que cumpre qualquer ordem pelo bem da nação, mesmo que isso custe a vida de seus próprios amigos.',
  },
  {
    id: 'tarot-king-wands',
    imageUrl: '/tarot_cards/tarot-king-wands.jpg',
    number: 'KW',
    numberInt: 24,
    namePt: 'Rei de Paus',
    nameEn: 'King of Wands',
    archetype: 'A Fúria Revolucionária, Ambição & Voo Rumo à Lua',
    graffitiLocation: 'Mural no porto espacial de Night City / Centro Espacial orbital',
    color: '#f97316',
    accentBorder: 'border-orange-500',
    iconSymbol: '🚀',
    officialRedEffect: {
      summary: 'Sobrecarga de rede: drena 100% dos dados do alvo e causa curto-circuito em massa!',
      fullText: 'O Rei de Paus queima como uma supernova de ambição. Causa curto-circuito em todos os aparelhos eletrônicos num raio de 10 metros, desarmando torres e desligando cyberdecks inimigos por 1 rodada.',
    },
    uprightMeaning: 'Liderança inspiradora, audácia revolucionária, a coragem de quebrar as correntes da Terra e voar rumo à Lua livre.',
    reversedMeaning: 'Ambição desesperada que sacrifica aliados inocentes, egoísmo impulsivo e chamas que devoram quem as acendeu.',
    narrativeHook: 'Uma Netrunner em fuga da FIA oferece um protótipo de IA que vale milhões se a equipe ajudá-la a embarcar em uma nave orbital.',
    loreDescription: 'Song So Mi (Songbird) cruzando os céus em direção à Lua. A mulher que sacrificou tudo e enganou a todos para ter mais um dia de liberdade viva.',
  },
  {
    id: 'tarot-king-pentacles',
    imageUrl: '/tarot_cards/tarot-king-pentacles.jpg',
    number: 'KP',
    numberInt: 25,
    namePt: 'Rei de Ouros',
    nameEn: 'King of Pentacles',
    archetype: 'O Senhor da Guerra, Monopólio & O Mercado Negro',
    graffitiLocation: 'Mural no mercado clandestino do Estádio de Dogtown (Kurt Hansen)',
    color: '#84cc16',
    accentBorder: 'border-lime-500',
    iconSymbol: '💰',
    officialRedEffect: {
      summary: 'Loot extraordinário: duplica o pagamento ou o saldo de eddies saqueado na cena!',
      fullText: 'O Rei de Ouros domina a circulação de bens e riquezas. Quando ativado, o pagamento em Eurodólares acordado ou os fundos saqueados na cena são DUPLICADOS instantaneamente.',
    },
    uprightMeaning: 'Poderio econômico autônomo, controle de zonas francas e mercados negros (Kurt Hansen e Dogtown), estabilidade e fartura de armas raras.',
    reversedMeaning: 'Ganância predatória, militarismo mercenário implacável, extorsão e o estrangulamento dos mais fracos pelo preço dos remédios.',
    narrativeHook: 'O senhor da guerra local oferece acesso irrestrito ao catálogo de armas militares confiscadas se a equipe eliminar um concorrente rebelde.',
    loreDescription: 'Coronel Kurt Hansen reinando sobre o mercado negro de Dogtown. A prova de que quem controla as armas e o comércio dita as leis de Night City.',
  },
];

// Helper: Sorteia carta respeitando regra de repetição ou baralho completo
export function drawRandomTarotCard(excludeIds: string[] = []): { card: TarotCard; isReversed: boolean } {
  const available = NIGHT_CITY_TAROT_DECK.filter(c => !excludeIds.includes(c.id));
  const pool = available.length > 0 ? available : NIGHT_CITY_TAROT_DECK;
  const card = pool[Math.floor(Math.random() * pool.length)];
  const isReversed = Math.random() < 0.35; // 35% de chance de sair invertida
  return { card, isReversed };
}

// Spreads pré-configurados
export const TAROT_SPREAD_CONFIGS: Record<TarotSpreadType, {
  title: string;
  cardCount: number;
  description: string;
  positions: { label: string; description: string }[];
}> = {
  omen: {
    title: 'Presságio do Dia // Omen de Night City',
    cardCount: 1,
    description: 'Uma única carta puxada para ditar o clima, o pressentimento de Misty ou a reviravolta climática da sessão de hoje.',
    positions: [
      { label: 'O Presságio', description: 'A energia dominante que guiará os eventos, encontros e perigos das ruas hoje.' },
    ],
  },
  streets_three: {
    title: 'As Três Cartas das Ruas // Passado, Presente e Futuro',
    cardCount: 3,
    description: 'A clássica leitura de Misty Ollaszewski para os Edgerunners entenderem as raízes do trabalho, o conflito e o desfecho.',
    positions: [
      { label: '1. O Passado (A Dívida)', description: 'As escolhas pregressas, os erros e a origem do contrato que trouxeram a equipe até aqui.' },
      { label: '2. O Presente (A Encruzilhada)', description: 'O obstáculo imediato, o contratante, a traição em potencial e a decisão que precisa ser tomada agora.' },
      { label: '3. O Futuro (O Preço da Glória)', description: 'O destino sangrento, a promessa de glória eterna no Afterlife ou o túmulo no lixão dos Badlands.' },
    ],
  },
  night_city_cross: {
    title: 'A Cruz de Night City // Leitura Completa de Destino',
    cardCount: 5,
    description: 'Uma tiragem aprofundada de 5 cartas revelando todas as camadas da conspiração urbana e o destino dos envolvidos.',
    positions: [
      { label: '1. O Contrato (A Situação)', description: 'O cenário manifesto e o que parece estar acontecendo na superfície.' },
      { label: '2. A Oposição (O Obstáculo)', description: 'A força antagônica, a gangue rival ou o agente corporativo que barra o caminho.' },
      { label: '3. A Sombra (O Ponto Fraco)', description: 'O segredo não dito, o vício oculto ou a fraqueza de humanidade da equipe.' },
      { label: '4. A Força Externa (O Poder Maior)', description: 'A intervenção de megacorporações, da polícia ou do ambiente hostil da cidade.' },
      { label: '5. O Veredito Supremo', description: 'A conclusão final: se haverá ascensão como lenda viva ou esquecimento brutal.' },
    ],
  },
  edgerunner_destiny: {
    title: 'O Destino do Edgerunner // Lifepath & Conflito Pessoal',
    cardCount: 3,
    description: 'Tiragem mística focada no dilema moral, no arqui-inimigo e no objetivo supremo de um personagem da mesa.',
    positions: [
      { label: '1. A Alma & O Cromo', description: 'O conflito interno entre a humanidade do personagem e seus implantes mecânicos.' },
      { label: '2. O Arqui-Inimigo (Nêmesis)', description: 'A sombra que persegue os passos do personagem e sua próxima jogada.' },
      { label: '3. O Objetivo de Vida', description: 'A chave para alcançar sua aspiração suprema ou a armadilha que o destruirá.' },
    ],
  },
  combat_critical: {
    title: 'Disparo Crítico // Regra Oficial Night City Tarot v1.2',
    cardCount: 1,
    description: 'Acionada quando 3 ou mais dados de dano rolam 6 (Dano Crítico Triplo). Aplica o efeito oficial do livro de regras!',
    positions: [
      { label: 'Efeito Crítico do Arcano', description: 'Substitui ou potencializa a lesão crítica de combate com um evento espetacular das regras oficiais.' },
    ],
  },
};
