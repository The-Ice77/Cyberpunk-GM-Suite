import { WEAPONS_DATABASE } from './arsenalData';
import { codexMarketItemsFor } from '../services/codexCatalog';

export interface NightMarketItem {
  name: string;
  category: string;
  priceEb: number;
  priceLabel: string;
  condition: 'Novo Lacrado' | 'Usado em Combate' | 'Militar Restrito' | 'Pirateado / Modificado';
  stock: number;
  description: string;
  mechanicalEffect?: string;
}

export interface NightMarketStall {
  vendorName: string;
  vendorTitle: string;
  vendorStyle: string;
  vendorPersonality: string;
  category: string;
  items: NightMarketItem[];
  specialService?: string;
}

export interface NightMarket {
  id: string;
  name: string;
  district: string;
  exactLocation: string;
  operatorFixer: {
    name: string;
    reputation: number;
    quirk: string;
    securityLevel: 'Baixa (Pistolas)' | 'Média (Solos Armados & Cães K-9)' | 'Alta (Torres e Snipers nos Telhados)';
    entryCondition: string;
  };
  atmosphere: string;
  stalls: NightMarketStall[];
  complication: {
    title: string;
    description: string;
    mechanicalHook: string;
  };
  bargainTip: string;
  isAi?: boolean;
}

export const NIGHT_MARKET_LOCATIONS = [
  {
    name: 'Túneis de Esgoto e Linha F do Metrô Abandonado',
    district: 'Watson (Kabuki)',
    atmosphere: 'Vapor quente saindo de grades enferrujadas, barracas iluminadas por fitas de LED âmbar e cheiro de lixo orgânico misturado com óleo mineral de armas.',
    securityLevel: 'Média (Solos Armados & Cães K-9)' as const,
    entryCondition: 'Apresentar chip de convite de um Fixer local ou pagar 20eb na entrada.',
  },
  {
    name: 'Pátio de Contêineres Docas #44',
    district: 'Zona Portuária / Marina',
    atmosphere: 'Contêineres empilhados criando corredores labirínticos sob névoa salgada e holofotes amarelos que piscam intermitentemente.',
    securityLevel: 'Alta (Torres e Snipers nos Telhados)' as const,
    entryCondition: 'Revista corporal rigorosa na cancela; armas pesadas devem ser travadas com lacre térmico.',
  },
  {
    name: 'Estacionamento Subterrâneo do Megabuilding HB-7',
    district: 'Heywood (Vista del Rey)',
    atmosphere: 'Chão manchado de óleo diesel e marcas de pneu, barracas montadas nas caçambas de picapes blindadas e música chicano-rap ecoando pelas colunas de concreto.',
    securityLevel: 'Média (Solos Armados & Cães K-9)' as const,
    entryCondition: 'Dar o aperto de mão com código dos Valentinos ou estar acompanhado por um morador de Heywood.',
  },
  {
    name: 'Galpão Frigorífico Desativado da Meat-Corp',
    district: 'Rancho Coronado (Santo Domingo)',
    atmosphere: 'Ganchos enferrujados pendurados no teto alto, névoa densa de gelo seco e vendedores vestindo casacos pesados de pele sintética com gorros táticos.',
    securityLevel: 'Baixa (Pistolas)' as const,
    entryCondition: 'Entrada franca, mas quem sacar arma dentro do frigorífico é fuzilado na hora.',
  },
  {
    name: 'Ruínas do Shopping Mall Pacifica Paradise',
    district: 'Pacifica',
    atmosphere: 'Vitrines quebradas cobertas por grafites neon, palmeiras de plástico derretidas e um DJ tocando batidas pesadas em um mezanino elevado.',
    securityLevel: 'Baixa (Pistolas)' as const,
    entryCondition: 'Pagar pedágio de 10eb para os olheiros nos acessos da rodovia.',
  },
  {
    name: 'Acampamento de Trailers e Tanques Velhos dos Badlands',
    district: 'Badlands Sul',
    atmosphere: 'Círculo de caminhões pesados com lonas amarradas entre as carrocerias criando um mercado coberto contra tempestades de areia, iluminado por fogueiras de CHOOH2.',
    securityLevel: 'Alta (Torres e Snipers nos Telhados)' as const,
    entryCondition: 'Declarar intenções pacíficas pelo rádio CB na frequência 104.2 antes de cruzar o perímetro de barricadas.',
  },
];

export const NIGHT_MARKET_OPERATORS = [
  {
    name: 'Damon "Checkmate" Cross',
    reputation: 6,
    quirk: 'Joga xadrez em uma tela holográfica no pulso enquanto negocia e nunca olha nos olhos por mais de dois segundos.',
  },
  {
    name: 'Mama Lupe de Heywood',
    reputation: 7,
    quirk: 'Oferece empanadas quentes aos compradores enquanto seus netos armados com fuzis patrulham os telhados.',
  },
  {
    name: 'Zane "Circuit" Takahashi',
    reputation: 5,
    quirk: 'Fala sussurrando através de um modulador vocal metálico e inspeciona cada nota de eurodólar com luz ultravioleta.',
  },
  {
    name: 'Capitã Nadia Rostova',
    reputation: 8,
    quirk: 'Ex-marinheira soviética com braço hidráulico massivo que abre garrafas de vodka russa com os dentes.',
  },
];

export const PRESET_STALLS: {
  category: string;
  vendorName: string;
  vendorTitle: string;
  vendorStyle: string;
  vendorPersonality: string;
  specialService?: string;
  itemPool: NightMarketItem[];
}[] = [
  {
    category: 'Armas Pesadas & Munições Especiais',
    vendorName: 'Gunnar "Bore" Stone',
    vendorTitle: 'Armeiro Clandestino de Combate',
    vendorStyle: 'Avental de couro balístico queimado de solda, tatuagem de cartucho de munição no pescoço e dedo indicador cibernético com paquímetro digital.',
    vendorPersonality: 'Áspero e pragmático. Não dá desconto em armas militares, mas adora discutir calibres e balística com Solos experientes.',
    specialService: 'Rosquear silenciador ou instalar trilho tático em 10 minutos (50eb + peças).',
    itemPool: [
      {
        name: 'Arasaka WSSA Heavy SMG (Preta Fosca)',
        category: 'Arma de Fogo',
        priceEb: 650,
        priceLabel: '650eb',
        condition: 'Militar Restrito',
        stock: 2,
        description: 'Submetralhadora pesada com silenciador integrado e supressor de chamas. Número de série lixado quimicamente.',
        mechanicalEffect: 'Dano 3d6, Autofire 3, Suprime recuo garantindo +1 no primeiro tiro do turno.',
      },
      {
        name: 'Revólver Malorian Arms 3516 Réplica Clandestina',
        category: 'Arma de Fogo',
        priceEb: 1200,
        priceLabel: '1.200eb',
        condition: 'Pirateado / Modificado',
        stock: 1,
        description: 'Cópia personalizada em ferro reforçado do canhão lendário. Cano estriado longo com recuo brutal.',
        mechanicalEffect: 'Dano 4d6+1, Exige BODY 8 ou braço cibernético para disparar sem penalidade.',
      },
      {
        name: 'Caixa de Munição Perfurante de Blindagem (AP) 11mm (50 un)',
        category: 'Munição Especial',
        priceEb: 200,
        priceLabel: '200eb',
        condition: 'Novo Lacrado',
        stock: 4,
        description: 'Projéteis de tungstênio projetados para estraçalhar placas de kevlar e Metalgear corporativo.',
        mechanicalEffect: 'Ablação de blindagem duplicada: reduz 2 pontos de SP por acerto em vez de 1.',
      },
      {
        name: 'Lança-Granadas Compacto de Pulso',
        category: 'Arma Pesada',
        priceEb: 1000,
        priceLabel: '1.000eb',
        condition: 'Militar Restrito',
        stock: 1,
        description: 'Montado sob o antebraço ou em trilho picatinny. Dispara granadas de 40mm a curta distância.',
        mechanicalEffect: 'Dano 6d6 em área de 6x6 metros. Recarga de 1 turno.',
      },
    ],
  },
  {
    category: 'Cromo de Combate & Implantes Ilicitamente Adquiridos',
    vendorName: 'Dra. Vivienne "Bisturi" Vance',
    vendorTitle: 'Ripperdoc Clandestina de Watson',
    vendorStyle: 'Bata cirúrgica cirurgicamente limpa sob jaqueta de couro grafitada, óculos de aumento com três lentes coloridas e mãos totalmente de cromo polido.',
    vendorPersonality: 'Calma, cínica e profissional. Trata implantes de segunda mão como artefatos cirúrgicos delicados.',
    specialService: 'Instalação cirúrgica imediata na van estéril atrás da banca (Cirurgia DV 15, taxa de 150eb).',
    itemPool: [
      {
        name: 'Módulo Acelerador Sandevistan Modelo Militech Mk.2',
        category: 'Cibernético Neural',
        priceEb: 1500,
        priceLabel: '1.500eb',
        condition: 'Militar Restrito',
        stock: 1,
        description: 'Injetor de adrenalina e overclock neural que faz o mundo ao redor parecer se mover em câmera lenta.',
        mechanicalEffect: 'Ação livre: +3 em Iniciativa por 1 minuto (1x por dia). Perda de Humanidade 2d6.',
      },
      {
        name: 'Lâminas Ocultas de Carbono (Wolverine Claws)',
        category: 'Arma Cibernética',
        priceEb: 800,
        priceLabel: '800eb',
        condition: 'Usado em Combate',
        stock: 2,
        description: 'Três garras retráteis instaladas nas costas da mão que deslizam silenciosamente entre os nós dos dedos.',
        mechanicalEffect: 'Dano 2d6, ignora metade da blindagem SP leve (SP 7 ou menor).',
      },
      {
        name: 'Olho Cibernético Kiroshi com Visão Térmica Integrada',
        category: 'Cibernético Óptico',
        priceEb: 700,
        priceLabel: '700eb',
        condition: 'Novo Lacrado',
        stock: 2,
        description: 'Íris dourada brilhante com capacidade de detectar assinaturas de calor através de fumaça e paredes finas de drywall.',
        mechanicalEffect: '+2 em Percepção contra alvos camuflados ou na escuridão total.',
      },
      {
        name: 'Subdermal Armor Leve de Kevlar Sintético',
        category: 'Cibernético Corporal',
        priceEb: 1000,
        priceLabel: '1.000eb',
        condition: 'Novo Lacrado',
        stock: 1,
        description: 'Trama de nanofibras injetada sob a derme que absorve estilhaços e perfurações leves.',
        mechanicalEffect: 'Fornece SP 7 fixo no torso e cabeça sem penalidade de movimento.',
      },
    ],
  },
  {
    category: 'Cyberdecks, Softwares Proibidos & Gadgets Hackers',
    vendorName: 'Zero-Cold (Ex-Netrunner da NetWatch)',
    vendorTitle: 'Fornecedor de Black ICE e Softwares Militares',
    vendorStyle: 'Capuz escuro sobre a cabeça, cabos neurais enrolados nos pulsos como pulseiras e óculos com matriz binária verde piscando nas lentes.',
    vendorPersonality: 'Paranóico e ágil. Testa cada cliente com um scanner anti-rastreamento antes de abrir o cofre dos decks.',
    specialService: 'Descriptografar chip de dados corporativo bloqueado (Interface DV 15, custo 100eb).',
    itemPool: [
      {
        name: 'Cyberdeck Customizado "Phantom-IX" com 7 Slots',
        category: 'Cyberdeck',
        priceEb: 1200,
        priceLabel: '1.200eb',
        condition: 'Pirateado / Modificado',
        stock: 1,
        description: 'Deck artesanal com carcaça de grafite fosco, dissipador de calor duplo de cobre e firmware destravado.',
        mechanicalEffect: '7 slots de programas/hardware. Bônus de +1 em Interface para quebrar senhas (DV).',
      },
      {
        name: 'Chip de Black ICE: Hellhound (Cão do Inferno)',
        category: 'Software Clandestino',
        priceEb: 500,
        priceLabel: '500eb',
        condition: 'Militar Restrito',
        stock: 2,
        description: 'Programa defensivo predador com forma de cão em chamas que caça invasores e incendeia seus cérebros.',
        mechanicalEffect: 'Ataque Interface + 6 contra Netrunner alvo. Causa 2d6 de dano direto aos pontos de vida do cérebro.',
      },
      {
        name: 'Disruptor Portátil EMP de Curto Alcance',
        category: 'Gadget Eletrônico',
        priceEb: 450,
        priceLabel: '450eb',
        condition: 'Usado em Combate',
        stock: 3,
        description: 'Dispositivo do tamanho de uma lata de cerveja que frita câmeras e desativa fechaduras eletrônicas por 30 segundos.',
        mechanicalEffect: 'Desativa eletrônicos e câmeras em raio de 4 metros por 1 rodada completa.',
      },
      {
        name: 'Agente Holográfico Criptografado Descartável (Burner)',
        category: 'Comunicação Segura',
        priceEb: 80,
        priceLabel: '80eb',
        condition: 'Novo Lacrado',
        stock: 6,
        description: 'Smartphone descartável blindado que apaga todas as memórias e destrói o chip ao receber um comando de voz.',
        mechanicalEffect: 'Comunicação criptografada impossível de rastrear sem teste de Netrunning DV 17.',
      },
    ],
  },
  {
    category: 'Químicos, Drogas de Rua & Estimulantes de Combate',
    vendorName: 'Galo "Chem" Martinez',
    vendorTitle: 'Mestre Químico dos Valentinos',
    vendorStyle: 'Regata branca, correntes pesadas de ouro sintético, luvas de borracha roxas e cheiro penetrante de acetona e canela.',
    vendorPersonality: 'Falante e eufórico. Garante que seus estimulantes são 99% puros e não causam cãibras mortais.',
    specialService: 'Misturar antídoto específico para venenos ou biotoxinas industriais (60eb).',
    itemPool: [
      {
        name: 'Injetor de Black Lace Militar (3 Doses)',
        category: 'Droga de Combate',
        priceEb: 150,
        priceLabel: '150eb',
        condition: 'Novo Lacrado',
        stock: 5,
        description: 'Líquido negro espesso em ampola descartável. Elimina o medo e ignora ferimentos graves.',
        mechanicalEffect: 'Ignora penalidades de Ferimento Grave por 10 minutos. Teste de Resistência à Droga DV 15.',
      },
      {
        name: 'Spray de Estimulante Speedheal (2 Cargas)',
        category: 'Fármaco Médico',
        priceEb: 200,
        priceLabel: '200eb',
        condition: 'Novo Lacrado',
        stock: 4,
        description: 'Aerossol médico estéril da Trauma Team que acelera coagulação e fecha feridas abertas.',
        mechanicalEffect: 'Recupera imediatamente 10 HP ou estabiliza um personagem à beira da morte sem teste de Medicina.',
      },
      {
        name: 'Frasco de Blue Glass Puro (5 Doses)',
        category: 'Alucinógeno Urbano',
        priceEb: 100,
        priceLabel: '100eb',
        condition: 'Novo Lacrado',
        stock: 3,
        description: 'Cristais azuis dissolúveis que aumentam a empatia e a conexão emocional em festas da alta sociedade.',
        mechanicalEffect: '+1 em testes sociais com artistas e gangers, mas -2 em Iniciativa e percepção tática.',
      },
    ],
  },
  {
    category: 'Contrabando Corporativo & Luxos Reais Raros',
    vendorName: 'Jacques "Caviar" Laurent',
    vendorTitle: 'Contrabandista de Luxos Europeus',
    vendorStyle: 'Terno risca de giz amarrotado, monóculo com display digital, anel de rubi e fala refinada com sotaque francês carregado.',
    vendorPersonality: 'Esnobe e requintado. Considera os gangers clientes brutos, mas adora o dinheiro vivo que trazem.',
    specialService: 'Autenticar relíquia antiga ou artefato pré-quarta guerra (Avaliação DV 13, 50eb).',
    itemPool: [
      {
        name: 'Lata de Café em Grão 100% Real da Colômbia (500g)',
        category: 'Iguaria Pré-Guerra',
        priceEb: 300,
        priceLabel: '300eb',
        condition: 'Novo Lacrado',
        stock: 2,
        description: 'Café de verdade não sintético, cultivado em solo real antes da praga da ferrugem. Aroma divino inconfundível.',
        mechanicalEffect: 'Preparar uma garrafa concede +1 em testes de Concentração para toda a equipe pela manhã.',
      },
      {
        name: 'Garrafa de Whisky Escocês 20 Anos de Destilaria Extinta',
        category: 'Bebida de Luxo',
        priceEb: 800,
        priceLabel: '800eb',
        condition: 'Novo Lacrado',
        stock: 1,
        description: 'Garrafa de vidro pesado com selo de cera lacrado. Uma moeda de troca diplomática com qualquer Executivo de Night City.',
        mechanicalEffect: 'Garante vantagem automática em teste de Persuasão ao presentear um diretor corporativo.',
      },
      {
        name: 'Jaqueta de Couro Blindada Kitsch com Leds Subdérmicos',
        category: 'Moda Blindada',
        priceEb: 450,
        priceLabel: '450eb',
        condition: 'Novo Lacrado',
        stock: 3,
        description: 'Jaqueta estilizada com ombreiras pontudas em neon rosa e placas internas de fibra balística SP 11.',
        mechanicalEffect: 'SP 11 no Torso com estilo Kitsch extravagante (+1 em Estilo em boates de neon).',
      },
    ],
  },
];

export const NIGHT_MARKET_COMPLICATIONS = [
  {
    title: 'Sirenes no Perímetro: Batida Surpresa do DPNC',
    description: 'Três viaturas do Departamento de Polícia de Night City cercam a saída principal com megafones exigindo rendição imediata dos contrabandistas. Vendedores começam a fechar as lonas freneticamente.',
    mechanicalHook: 'Teste de Percepção DV 14 para achar a rota de fuga nos dutos antes do cerco se fechar, ou Suborno de 100eb para o oficial na porta dos fundos.',
  },
  {
    title: 'Caçador de Recompensas na Multidão',
    description: 'Um Solo ciborgue veterano com uma escopeta pesada entra na feira comparando rostos de compradores com um cartaz holográfico de procurado que bate com a descrição de um dos membros do grupo.',
    mechanicalHook: 'Teste de Atuação DV 15 para se camuflar entre os compradores ou Furtividade DV 14 para escorregar para trás de uma pilha de caixotes.',
  },
  {
    title: 'Item com Rastreador GPS Corporativo Ativo',
    description: 'Após a compra de um item militar, um bip agudo silencioso começa a piscar na base do circuito: o equipamento tem um localizador satelital da Arasaka chamando uma equipe de recuperação armada.',
    mechanicalHook: 'Teste de Eletrônica/Segurança ou Cybertech DV 15 para desarmar o transmissor sem danificar os componentes do item.',
  },
  {
    title: 'Leilão Clandestino ao Vivo de Lâmina Monomolecular',
    description: 'O Fixer sobe em um caixote de metal e anuncia o leilão relâmpago de uma Katana de laser militar recuperada de um AV abatido. Solos e gangers começam a gritar lances acirrados com armas à mostra.',
    mechanicalHook: 'Lance inicial de 800eb. Teste de Apostas ou Blefe DV 16 para intimidar os concorrentes a desistirem do lance.',
  },
  {
    title: 'Tentativa de Furto / Batedores de Carteira de Rua',
    description: 'Dois garotos de rua fingem tropeçar no grupo derrubando latas de refrigerante sintético enquanto mãos ágeis tentam cortar a bolsa de munição ou surrupiar chips de eurodólares.',
    mechanicalHook: 'Teste de Percepção DV 15 para segurar o braço do batedor de carteira a tempo antes que ele suma entre as barracas.',
  },
];

export const NIGHT_MARKET_BARGAIN_TIPS = [
  'Regra Oficial de Pechincha (CP:R p. 338): Faça um teste resistido de Negociação (Trading) contra a perícia de Negociação do Vendedor (média DV 14 a 16). Se vencer, obtém 10% a 20% de desconto.',
  'Fixers da Equipe: Fixers com Rank de Operador podem convocar seus próprios contatos para encomendar peças com até 30% de margem e garantir itens restritos.',
  'Troca Direta por Munição ou Cromo: Vendedores do Mercado Negro aceitam pagar 50% do valor de tabela por peças de cibernéticos usados e armas limpas recolhidas dos combates.',
];

/**
 * Gera proceduralmente um Mercado Negro completo seguindo os parâmetros oficiais de Cyberpunk RED.
 */
export function generateProceduralNightMarket(customDistrict?: string): NightMarket {
  const locPool = customDistrict
    ? NIGHT_MARKET_LOCATIONS.filter(l => l.district.toLowerCase().includes(customDistrict.toLowerCase()))
    : NIGHT_MARKET_LOCATIONS;
  const loc = locPool.length > 0 ? locPool[Math.floor(Math.random() * locPool.length)] : NIGHT_MARKET_LOCATIONS[0];

  const fixer = NIGHT_MARKET_OPERATORS[Math.floor(Math.random() * NIGHT_MARKET_OPERATORS.length)];
  const comp = NIGHT_MARKET_COMPLICATIONS[Math.floor(Math.random() * NIGHT_MARKET_COMPLICATIONS.length)];
  const tip = NIGHT_MARKET_BARGAIN_TIPS[Math.floor(Math.random() * NIGHT_MARKET_BARGAIN_TIPS.length)];

  // Embaralha e escolhe 3 ou 4 bancas variadas
  const shuffledStalls = [...PRESET_STALLS].sort(() => 0.5 - Math.random());
  const selectedStalls = shuffledStalls.slice(0, 3 + Math.floor(Math.random() * 2)).map(s => {
    // Escolhe de 2 a 4 itens por banca
    const shuffledItems = [...s.itemPool].sort(() => 0.5 - Math.random()).slice(0, 2 + Math.floor(Math.random() * 2));
    return {
      vendorName: s.vendorName,
      vendorTitle: s.vendorTitle,
      vendorStyle: s.vendorStyle,
      vendorPersonality: s.vendorPersonality,
      category: s.category,
      specialService: s.specialService,
      items: [...shuffledItems, ...codexMarketItemsFor(s.category, 2)],
    };
  });

  return {
    id: `night-market-${Date.now()}`,
    name: `Mercado Negro Noturno: ${loc.name}`,
    district: loc.district,
    exactLocation: loc.name,
    operatorFixer: {
      name: fixer.name,
      reputation: fixer.reputation,
      quirk: fixer.quirk,
      securityLevel: loc.securityLevel,
      entryCondition: loc.entryCondition,
    },
    atmosphere: loc.atmosphere,
    stalls: selectedStalls,
    complication: comp,
    bargainTip: tip,
    isAi: false,
  };
}
