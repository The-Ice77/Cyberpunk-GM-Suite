export interface SignatureDrink {
  name: string;
  cost: string;
  category?: 'Coquetel Lendário' | 'Destilado Pesado' | 'Energético Cibernético' | 'Elixir Bioquímico' | 'Cerveja de Sarjeta';
  glassware?: string;
  visualServing?: string;
  ingredients?: string[];
  tastingNotes?: string;
  description: string;
  inGameEffect: string;
  sideEffect?: string;
  loreTrivia?: string;
}

export interface BarVenue {
  id: string;
  name: string;
  district: string;
  aesthetic: string;
  musicStyle: string;
  clientele: string;
  securityRating: 'Nenhuma (Faroeste)' | 'Baixa' | 'Média' | 'Pesada / Militar';
  signatureDrink: SignatureDrink;
  localRumors: string[];
  citation: string;
}

export const NIGHT_CITY_BARS: BarVenue[] = [
  {
    id: 'afterlife',
    name: 'The Afterlife (O Pós-Vida)',
    district: 'Little China · Watson — Antigo necrotério',
    aesthetic: 'Iluminação âmbar fosca, mesas de aço polido onde outrora ficavam macas de autópsia, cabines de conferência à prova de som e telas com obituários de Solos.',
    musicStyle: 'Industrial frio, batidas graves compassadas e rock clássico dos anos 2020.',
    clientele: 'Solos lendários, Fixers de elite (Rogue), Netrunners veteranos e mercenários com nome na praça.',
    securityRating: 'Pesada / Militar',
    signatureDrink: {
      name: 'Johnny Silverhand / David Martinez',
      cost: '100eb (Premium)',
      category: 'Coquetel Lendário',
      glassware: 'Copo Tumbler de Cristal Lapidado com Base Pesada de Chumbo',
      visualServing: 'Borda com crosta de sal grosso e flocos vermelhos de pimenta chilli. Névoa tênue de gelo seco que desce pelas laterais do copo feito uma cascata espectral.',
      ingredients: [
        'Dose dupla de Tequila envelhecida em barril de carvalho sintético',
        'Splash de Cerveja Mexicana Amarga artesanal',
        'Gotas de Licor de Canela com pimenta tabasco',
        'Cubo de gelo seco com infusão de turfa defumada',
      ],
      tastingNotes: 'O primeiro gole queima a garganta com um calor violento de agave defumado e pimenta viva, seguido por um golpe seco e amargo da cerveja que acende a mente e faz o coração bater acelerado no peito.',
      description: 'Dose dupla de tequila envelhecida com cerveja mexicana amarga, pimenta chilli na borda e névoa de gelo seco.',
      inGameEffect: '+1 em testes de Frieza (COOL / Facedown) pela próxima 1 hora; sensação inabalável de audácia e coragem mercenária.',
      sideEffect: 'Ao final de 1 hora, faça um teste de COOL DV 11 ou sentirá uma irresistível compulsão de aceitar o trabalho mais arriscado da noite.',
      loreTrivia: 'Regra de ouro do Afterlife: para ter uma bebida com seu nome no cardápio, você precisa morrer numa operação espetacular que vire lenda eterna entre os Solos de Night City.',
    },
    localRumors: [
      'Dizem que Rogue está contratando uma equipe para resgatar dados de uma AV-4 que caiu na Baía Coronado semana passada.',
      'Um Solo famoso deixou uma encomenda paga no armário #14 antes de desaparecer na Hot Zone.',
      'A Arasaka colocou uma recompensa de 50.000eb na cabeça de quem vazar o plano de rota da diretora Hanako.',
    ],
    citation: 'CP:R p. 308 • CP2020 p. 232 • Mixing Drinks p. 4',
  },
  {
    id: 'totentanz',
    name: 'Totentanz (Dança da Morte)',
    district: 'Desenvolvimento de Watson',
    aesthetic: 'Prédio decrépito de 5 andares; canos estourados jorrando vapor sobre a pista de mosh; piso manchado de sangue seco e fiação exposta; cadáveres às vezes deixados encostados na parede.',
    musicStyle: 'Neo-Trash Metal, Death Industrial ensurdecedor e sirenes distorcidas com mais de 120 decibéis.',
    clientele: 'Maelstrommers com visores sangrentos, boosters ensandecidos, ciberpsicopatas em busca de briga e góticos cibernéticos.',
    securityRating: 'Nenhuma (Faroeste)',
    signatureDrink: {
      name: 'Black Acid Boiler',
      cost: '20eb (Everyday)',
      category: 'Destilado Pesado',
      glassware: 'Tubo de ensaio de pirex industrial com braçadeira metálica anti-queimadura',
      visualServing: 'Líquido viscoso preto-alcatrão com faíscas verdes fosforescentes e borbulhas ácidas que corroem levemente o guardanapo de papel.',
      ingredients: [
        'CHOOH2 de pureza industrial destilado triplamente',
        'Licor de absinto sintético 80%',
        'Gota de solvente de cromo de motor',
        'Pó efervescente de sulfeto reativo',
      ],
      tastingNotes: 'Cheira a óleo de freio queimado e menta venenosa. O sabor é uma explosão metálica anestésica que faz a boca adormecer imediatamente e bloqueia os receptores de dor por choque elétrico.',
      description: 'CHOOH2 destilado com licor de absinto sintético e uma gota de solvente industrial.',
      inGameEffect: 'Teste DV 13 Resist Torture/Drugs. Se passar, ignora completamente penalidades de Ferimento (incluindo Gravemente Ferido) por 15 minutos.',
      sideEffect: 'Se falhar no DV 13, vomita bile ácida e fica Enjoado (-2 em todas as Ações) por 1 hora.',
      loreTrivia: 'Bebida favorita dos líderes do Maelstrom antes de entrar no mosh pit assassino da pista.',
    },
    localRumors: [
      'Pelo menos duas pessoas são mortas no mosh pit toda sexta-feira e os seguranças apenas jogam os corpos na caçamba.',
      'Um Ripperdoc do Maelstrom no terceiro andar está implantando garras de titânio roubadas a preço de banana.',
    ],
    citation: 'CP:R p. 308 • Mixing Drinks p. 8',
  },
  {
    id: 'el-coyote-cojo',
    name: 'El Coyote Cojo',
    district: 'The Glen · Heywood',
    aesthetic: 'Bar acolhedor e rústico com luzes amarelas quentes, fotos de veteranos de guerra nas paredes, bandeiras tricolores e cheiro de carnitas frescas preparadas por Mama Welles.',
    musicStyle: 'Mariachi moderno com sintetizadores, Cumbia e clássicos acústicos latinos.',
    clientele: 'Moradores locais de Heywood, membros dos Valentinos respeitando a trégua e trabalhadores de fábrica.',
    securityRating: 'Média',
    signatureDrink: {
      name: 'Coyote Especial',
      cost: '20eb (Everyday)',
      category: 'Coquetel Lendário',
      glassware: 'Copo de barro cozido tradicional com o logotipo da família Welles pirografado',
      visualServing: 'Líquido dourado límpido com fatia de lima fresca real, borda empoeirada com pimenta tajín artesanal e uma folha de hortelã aromática.',
      ingredients: [
        'Tequila 100% Agave importada de fazendas de Jalisco',
        'Suco fresco de lima mexicana real',
        'Xarope de cana de açúcar rústico',
        'Pitada de sal marinho vulcânico',
      ],
      tastingNotes: 'Doçura cítrica refrescante na entrada, acompanhada pelo calor aveludado e reconfortante do agave puro. Tem gosto de lar, família e lealdade de sangue.',
      description: 'Tequila dourada da casa com suco de lima fresca, sal grosso e licor de pimenta.',
      inGameEffect: 'Concede +1 em testes sociais com qualquer morador, fixer ou membro dos Valentinos de Heywood por 4 horas; acolhimento caloroso da comunidade.',
      sideEffect: 'Causa sonolência pacífica após 3 doses seguidas caso o personagem esteja exausto.',
      loreTrivia: 'Receita secreta de Mama Welles servida há mais de 25 anos para os heróis e vizinhos do bairro.',
    },
    localRumors: [
      'Padre Ibarra está procurando alguém para recuperar o carro de um jovem do bairro que foi roubado pela 6th Street.',
      'Mama Welles guarda uma espingarda de dois canos sob o balcão que já derrubou três assassinos corporativos nos anos 30.',
    ],
    citation: 'CP:R p. 309 • Gang Guide p. 22',
  },
  {
    id: 'lizzies-bar',
    name: "Lizzie's Bar",
    district: 'Kabuki · Watson',
    aesthetic: 'Neon rosa e roxo pulsante, estátuas de stripper cromadas, tacos de beisebol com pregos decorando o teto e cabines confortáveis de braindance privativo.',
    musicStyle: 'Synthwave sensual, Electro-Pop pesado e batidas eletrônicas dançantes.',
    clientele: 'Trabalhadores sexuais, artistas da noite, Fixers independentes e curiosos da vida noturna.',
    securityRating: 'Pesada / Militar',
    signatureDrink: {
      name: 'Pink Moxie Fizz',
      cost: '50eb (Costly)',
      category: 'Energético Cibernético',
      glassware: 'Taça Coupe de cristal holográfico que brilha sob luz negra',
      visualServing: 'Líquido cor-de-rosa néon efervescente com glitter comestível perolado que gira em espiral hipnótica no interior da taça.',
      ingredients: [
        'Refrigerante Triti-Fizz com infusão de gás hélio leve',
        'Licor de romã ácida sintética',
        'Vodka tri-destilada com taurina pura e nootrópicos neuroestimulantes',
        'Glitter comestível de fécula biodegradável',
      ],
      tastingNotes: 'Gosto elétrico e adocicado de frutas vermelhas espumantes com estalos na ponta da língua. Proporciona um foco mental instantâneo e uma sensação elétrica de euforia desinibida.',
      description: 'Refrigerante triti-fizz gaseificado com licor de romã e vodka com infusão de cafeína sintética.',
      inGameEffect: 'Restaura instantaneamente a concentração mental; cancela qualquer penalidade de Fadiga ou Sono Atrasado por 4 horas completas.',
      sideEffect: 'Após as 4 horas, o usuário sente uma queda abrupta de glicose (DV 12 Resistência para não precisar de um doce imediatamente).',
      loreTrivia: 'Criado pelas garotas das Moxes para aguentar turnos noturnos de 14 horas sem perder a postura nem a agilidade com tacos e pistolas.',
    },
    localRumors: [
      'As Moxes acabaram de instalar uma nova câmera de gravação de braindance de alta fidelidade que capturou um assassinato de um Executivo da Arasaka.',
      'Dois capangas dos Tyger Claws tentaram extorquir uma das dançarinas ontem e saíram de lá em sacos pretos.',
    ],
    citation: 'CP:R p. 308 • Mixing Drinks p. 11',
  },
  {
    id: 'the-short-circuit',
    name: 'The Short Circuit (Curto-Circuito)',
    district: 'Kabuki · Watson',
    aesthetic: 'Telas verdes de fósforo antigas piscando código UNIX, cheiro de solda e estanho no ar, bancadas de trabalho compartilhadas ao lado das torneiras de cerveja.',
    musicStyle: 'Chiptune, sintetizadores analógicos 8-bit e ambient eletrônico meditativo.',
    clientele: 'Netrunners freelancers, Técnicos de hardware, contrabandistas de chips e nerds do Data Pool.',
    securityRating: 'Média',
    signatureDrink: {
      name: 'Overclock Blue',
      cost: '50eb (Costly)',
      category: 'Elixir Bioquímico',
      glassware: 'Copo térmico de policarbonato com retículo digital que monitora a temperatura do líquido',
      visualServing: 'Bebida azul-cobalto fosforescente que pulsa em sincronia com campos eletromagnéticos próximos; servida gelada a -5°C.',
      ingredients: [
        'Extrato concentrado de mirtilo sintético enriquecido com colina',
        'Gin microdestilado com bagas de zimbro cibernético',
        'Isotônico de eletrólitos neuronais',
        'Nootrópico piracetam de grau médico',
      ],
      tastingNotes: 'Sabor frio e herbáceo com final metálico adstringente. Produz um formigamento nítido na nuca, onde os plugues neurais se conectam, acelerando o processamento do córtex cerebral.',
      description: 'Coquetel azul elétrico que brilha no escuro, misturado com nootrópicos e taurina pura.',
      inGameEffect: '+1 no próximo teste de Interface (Netrunning), Programação ou Eletrônica/Segurança realizado dentro dos próximos 45 minutos.',
      sideEffect: 'Pode provocar contrações involuntárias nas pontas dos dedos e nos olhos cibernéticos se ingerido mais de 2 vezes no mesmo dia.',
      loreTrivia: 'Desenvolvido por técnicos do Kabuki Market como combustível para invasões de Data Pools corporativos.',
    },
    localRumors: [
      'Um arquivo com os esquemas de defesa da subestação de energia de Watson está à venda por 800eb em um chip de memória colado embaixo da mesa 4.',
    ],
    citation: 'Mixing Drinks DLC p. 14',
  },
  {
    id: 'empathy',
    name: 'Club Empathy',
    district: 'Downtown · City Center',
    aesthetic: 'Minimalismo escandinavo ultramoderno, mármore branco sintético, aquários gigantes com peixes mecânicos e névoa aromática que reduz a ansiedade dos clientes.',
    musicStyle: 'Lounge eletrônico sofisticado, jazz neo-clássico com saxofone holográfico.',
    clientele: 'Diretores de corporações, lobistas políticos, diplomatas e modelos com biosculpting perfeito.',
    securityRating: 'Pesada / Militar',
    signatureDrink: {
      name: 'Synthetic Velvet Gold',
      cost: '500eb (Expensive)',
      category: 'Coquetel Lendário',
      glassware: 'Flûte de cristal austríaco com haste finíssima gravada a laser com o monograma do Empathy',
      visualServing: 'Espumante dourado de perlage contínua e minúscula, coroado por flocos flutuantes de ouro 24 quilates e perfume de flores brancas raras.',
      ingredients: [
        'Champanhe francês sintético com perfil enzimático de safra pré-guerra 1996',
        'Licor de flor de sabugueiro silvestre hidropônico',
        'Flocos micrométricos de ouro comestível 24k',
        'Essência aromática de flor de cerejeira japonesa',
      ],
      tastingNotes: 'Textura aveludada impecável, acidez equilibradíssima com notas de maçã dourada, brioche tostado e mel raro. O luxo absoluto destilado em taça.',
      description: 'Champanhe francês recriado molécula por molécula, com flocos de ouro comestível 24k e extrato de frutas reais.',
      inGameEffect: 'Concede +2 de bônus em todos os testes de Etiqueta Corporativa, Persuasão e Lábia realizados em ambientes de alta classe por 3 horas.',
      sideEffect: 'Gera ressentimento instantâneo em pessoas da classe trabalhadora de rua (-2 em Manha de Rua / Streetwise se sentirem o aroma aristocrático no personagem).',
      loreTrivia: 'Bebida favorita de conselheiros da Arasaka e lobistas de Bruxelas quando fecham contratos de bilhões de edies.',
    },
    localRumors: [
      'Um diretor da Militech está tendo um caso com a esposa do chefe de segurança da Arasaka e se encontram toda terça-feira na cabine VIP 1.',
    ],
    citation: 'CP:R p. 290 • CP2020 p. 235',
  },
  {
    id: 'forlorn-hope',
    name: 'The Forlorn Hope',
    district: 'Little China · Watson — Quarteirão Velho',
    aesthetic: 'Bar subterrâneo blindado construído em um antigo abrigo nuclear. As paredes são adornadas com capacetes perfurados por balas, medalhas de campanhas militares esquecidas e placas de blindagem de tanques.',
    musicStyle: 'Folk militar acústico, Rock clássico dos anos 90 e hinos de mercenários em volume moderado.',
    clientele: 'Veteranos condecorados da 2ª, 3ª e 4ª Guerra Corporativa, Solos aposentados e mercenários que valorizam honra marcial.',
    securityRating: 'Pesada / Militar',
    signatureDrink: {
      name: 'The Panzer Cocktail',
      cost: '40eb (Everyday)',
      category: 'Destilado Pesado',
      glassware: 'Caneca cilíndrica feita a partir de uma cápsula de projétil desativada de 30mm de canhão antiaéreo',
      visualServing: 'Bebida âmbar escura soltando fumaça cinzenta na superfície, decorada com um elo de fita de metralhadora desativada pendurada na borda.',
      ingredients: [
        'Whisky sintético de centeio envelhecido em farris de pólvora desativada',
        'Mel silvestre espesso das montanhas',
        'Splash de licor de café amargo',
        'Cinzas vegetais aromáticas defumadas',
      ],
      tastingNotes: 'Gosto potente de fumaça, carvalho e ferro temperado com o calor macio do mel. Desce como um tiro certeiro no peito, revigorando músculos cansados de combate e aquecendo a alma.',
      description: 'Whisky defumado em pólvora com mel silvestre e café amargo servido em cápsula de munição 30mm.',
      inGameEffect: '+1 em testes de Salva da Morte (Death Save) e +1 em testes de Resistência à Dor e Tortura por 2 horas; foco militar inabalável.',
      sideEffect: 'Exige um brinde em voz alta aos companheiros caídos antes do primeiro gole, sob risco de ser expulso do bar pelos veteranos.',
      loreTrivia: 'Criado no auge da 4ª Guerra Corporativa no The Forlorn Hope, o santuário sagrado dos combatentes de aluguel que sobreviveram para contar a história.',
    },
    localRumors: [
      'Dois generais reformados da Militech se encontram na mesa dos fundos toda quarta-feira para planejar golpes militares em pequenas nações da América Central.',
      'O barman guarda um fuzil antimaterial Barrett calibre .50 engatilhado atrás da chopeira.',
    ],
    citation: 'CP2020 p. 234 • Solo of Fortune p. 18 • CP:R p. 308',
  },
  {
    id: 'dick-liddys',
    name: "Dick Liddy's",
    district: 'The Glen · Heywood',
    aesthetic: 'Boteco sombrio e enfumaçado com persianas de madeira quebradas, lâmpadas incandescentes piscando com zumbido elétrico e copos com marcas d’água antigas.',
    musicStyle: 'Jazz Noir solitário, trompete melancólico e blues lento gravado em fitas analógicas.',
    clientele: 'Detetives particulares maltrapilhos, informantes de beco, policiais suspensos do DPNC e maridos traídos.',
    securityRating: 'Baixa',
    signatureDrink: {
      name: 'Private Eye Boilermaker',
      cost: '15eb (Cheap)',
      category: 'Cerveja de Sarjeta',
      glassware: 'Copo americano de vidro grosso e manchado ao lado de uma caneca de cerâmica',
      visualServing: 'Dose de Bourbon barato com fumaça mergulhada de cabeça para baixo dentro de uma caneca cheia de cerveja escura espumosa.',
      ingredients: [
        'Cerveja escura Synth-Stout com leveduras pesadas',
        'Dose dupla de Bourbon sintético barato com notas de caramelo tostado',
        'Gotas de xarope amargo de noz-moscada',
      ],
      tastingNotes: 'Amargo, cru e direto. Tem o sabor da chuva ácida nas calçadas de Night City e a queimação de casos não resolvidos às 4 horas da manhã.',
      description: 'Cerveja escura com uma dose de Bourbon mergulhada no copo e notas de caramelo tostado.',
      inGameEffect: '+1 em testes de Percepção e Dedução ao investigar cenas de crime ou procurar pistas no local por 1 hora.',
      sideEffect: 'Hálito pesado de álcool e tabaco que impõe -1 em testes de Sedução pelas próximas 2 horas.',
      loreTrivia: 'O drink clássico dos investigadores decadentes de Night City imortalizado nos romances baratos de holodisco.',
    },
    localRumors: [
      'Um detetive particular foi assassinado no banheiro ontem à noite e o assassino deixou um bilhete com o monograma da Petrochem.',
      'O garçom vende gravações de áudio de conversas confidenciais das mesas de canto por 50eb cada.',
    ],
    citation: 'Night City Sourcebook p. 88 • CP:R p. 309',
  },
];
