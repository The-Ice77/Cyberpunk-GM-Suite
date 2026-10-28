export interface BodyHarvestItem {
  name: string;
  category: 'Cibernético Recuperado' | 'Órgão Biológico Fresco';
  baseResaleEb: number;
  ripperdocMarkup: string;
  harvestDV: number;
  preservationTime: string;
  description: string;
}

export const BODY_BANK_HARVEST_TABLE: BodyHarvestItem[] = [
  { name: 'Coração Biológico Humano (Sem marcas de tiros)', category: 'Órgão Biológico Fresco', baseResaleEb: 1200, ripperdocMarkup: '1.000 a 1.500eb', harvestDV: 15, preservationTime: '4 Horas sem gelo / 24h em Cryotank', description: 'Item de altíssima demanda para transplante de idosos executivos corporativos.' },
  { name: 'Pulmões Livres de Fibrose (Par)', category: 'Órgão Biológico Fresco', baseResaleEb: 800, ripperdocMarkup: '700 a 1.000eb', harvestDV: 13, preservationTime: '6 Horas em caixa térmica', description: 'Raros de encontrar limpos em Night City devido à poluição e chuva ácida.' },
  { name: 'Fígado Orgânico Saudável', category: 'Órgão Biológico Fresco', baseResaleEb: 600, ripperdocMarkup: '500 a 800eb', harvestDV: 13, preservationTime: '8 Horas em solução salina', description: 'Muito procurado por veteranos com histórico de alcoolismo sintético.' },
  { name: 'Rim Biológico Funcional', category: 'Órgão Biológico Fresco', baseResaleEb: 500, ripperdocMarkup: '400 a 600eb', harvestDV: 13, preservationTime: '12 Horas em gelo', description: 'Fácil de colher e vender rapidamente em qualquer clínica de beco.' },
  { name: 'Ciberbraço Padrão (Sem danos estruturais graves)', category: 'Cibernético Recuperado', baseResaleEb: 300, ripperdocMarkup: '250 a 400eb', harvestDV: 11, preservationTime: 'Indefinido', description: 'Braço mecânico funcional; requer limpeza de biomonitores anteriores antes de revender.' },
  { name: 'Ciberolho com Ópticos Básicos', category: 'Cibernético Recuperado', baseResaleEb: 150, ripperdocMarkup: '100 a 200eb', harvestDV: 11, preservationTime: 'Indefinido', description: 'Módulo ocular artificial; se arrancado na marra pode perder 50% do valor.' },
  { name: 'Fiação Neural / Processador Neural', category: 'Cibernético Recuperado', baseResaleEb: 350, ripperdocMarkup: '300 a 500eb', harvestDV: 15, preservationTime: 'Requer solvente químico neutro', description: 'Extremamente delicado; se danificado por um ferimento na cabeça vira sucata inútil.' },
  { name: 'Acelerador Sandevistan Usado', category: 'Cibernético Recuperado', baseResaleEb: 600, ripperdocMarkup: '500 a 800eb', harvestDV: 15, preservationTime: 'Indefinido', description: 'Peça de combate disputadíssima no mercado negro de Solos e gangers.' },
];

export const POCKET_PERSONAL_ITEMS: string[] = [
  'Maço amassado de cigarros sintéticos Black Lace com 4 unidades e um isqueiro elétrico.',
  'Agente quebrado com tela rachada exibindo uma selfie desfocada de alguém amado.',
  'Credstick anônimo de plástico fosco contendo 17eb em moedas digitais não rastreáveis.',
  'Dois dados cromados de seis faces usados para apostar em becos de Japantown.',
  'Frasco com 3 comprimidos de estimulante barato para combater o cansaço (Dorphe).',
  'Canivete de mola enferrujado com o cabo gravado com as iniciais de uma gangue.',
  'Crachá de visitante falsificado da Corporação Ziggurat com foto de outra pessoa.',
  'Chip de memória contendo 2 horas de gravações de rádio pirata com comentários sarcásticos.',
  'Garrafa de vidro com restos de tequila barata misturada com pimenta vermelha.',
  'Chave magnética codificada de um quarto de Cube Hotel em Watson (válida até meia-noite).',
  'Colar com pingente de bala deflagrada presa por uma corrente de cobre.',
  'Inalador com dose única de filtro de ar anti-smog de emergência.',
  'Pequeno espelho de bolso com restos de pó de anestésico cirúrgico no canto.',
  'Ticket amassado de loteria do Canal 54 para o sorteio de amanhã à noite.',
  'Pen drive protegido por biometria que emite um bipe suave a cada dez minutos.',
  'Fita isolante preta de alta aderência e um cortador de lacres plásticos.',
  'Foto impressa em papel fotográfico analógico raro de uma família no deserto.',
  'Anel com ponteira afiada de aço usado para rasgar estofamento e cintos.',
  'Pacote de chiclete sabor canela sintética com cafeína concentrada.',
  'Cartão de visitas de um Ripperdoc clandestino em Kabuki escrito "Trabalho Limpo e Sem Nomes".',
  'Pedaço de papel com uma frequência de rádio anotada e a palavra "SOCORRO" sublinhada.',
  'Cabo adaptador de interface neural com pontas de ouro banhado levemente desgastadas.',
  'Pequena lanterna LED de alta intensidade com clip de fixação para boné.',
  'Ampola vazia de Black Lace com tampa roxa lacrada com fita plástica.',
  'Lata amassada de refrigerante Triti-Fizz sabor lima radioativa ainda fechada.',
  'Chaveiro com logotipo desgastado de uma oficina mecânica em Rancho Coronado.',
  'Mini-kit de costura cirúrgica estéril descartável de um uso só.',
  'Óculos escuros espelhados de policarbonato resistentes a arranhões.',
  'Pulseira de pano de entrada de uma festa rave subterrânea no Totentanz de ontem.',
  'Pente de cabelo metálico com lâmina oculta no cabo.',
];
