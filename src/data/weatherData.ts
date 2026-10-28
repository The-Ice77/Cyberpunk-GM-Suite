import { WeatherCondition } from '../types/system';

export interface WeatherSeasonTable {
  season: string;
  months: string;
  rolls: {
    d6: number;
    temperature: string;
    condition: string;
  }[];
}

export const seasonalWeatherTables: WeatherSeasonTable[] = [
  {
    season: 'Inverno (Winter)',
    months: 'Dezembro a Fevereiro',
    rolls: [
      { d6: 1, temperature: 'Frio extremo (~2°C / 35°F)', condition: 'Céu Limpo com Névoa Tóxica' },
      { d6: 2, temperature: 'Frio (~4°C / 40°F)', condition: 'Chuva Leve / Chuva com Neve Ácida' },
      { d6: 3, temperature: 'Frio (~4°C / 40°F)', condition: 'Nublado com Smog Industrial' },
      { d6: 4, temperature: 'Fresco (~10°C / 50°F)', condition: 'Nublado e Ventoso' },
      { d6: 5, temperature: 'Fresco (~10°C / 50°F)', condition: 'Chuva Forte com Granizo Ácido' },
      { d6: 6, temperature: 'Ameno (~15°C / 60°F)', condition: 'Clima Estranho (Rolar Tabela de Anomalias)' },
    ],
  },
  {
    season: 'Primavera (Spring)',
    months: 'Março a Maio',
    rolls: [
      { d6: 1, temperature: 'Frio (~4°C / 40°F)', condition: 'Céu Limpo' },
      { d6: 2, temperature: 'Fresco (~10°C / 50°F)', condition: 'Chuva Leve Intermitente' },
      { d6: 3, temperature: 'Fresco (~10°C / 50°F)', condition: 'Nublado' },
      { d6: 4, temperature: 'Fresco (~10°C / 50°F)', condition: 'Chuva Ácida Leve' },
      { d6: 5, temperature: 'Ameno (~15°C / 60°F)', condition: 'Tempestade de Chuva Pesada' },
      { d6: 6, temperature: 'Quente (~21°C / 70°F)', condition: 'Clima Estranho (Rolar Tabela de Anomalias)' },
    ],
  },
  {
    season: 'Verão (Summer)',
    months: 'Junho a Agosto',
    rolls: [
      { d6: 1, temperature: 'Ameno (~15°C / 60°F)', condition: 'Chuva Quente e Poluída' },
      { d6: 2, temperature: 'Quente (~21°C / 70°F)', condition: 'Céu Limpo (Poluição Visível no Horizonte)' },
      { d6: 3, temperature: 'Quente (~21°C / 70°F)', condition: 'Nublado e Abafado' },
      { d6: 4, temperature: 'Muito Quente (~27°C / 80°F)', condition: 'Céu Enevoado com Ozônio' },
      { d6: 5, temperature: 'Muito Quente (~27°C / 80°F)', condition: 'Céu Limpo e Sol Escaldante' },
      { d6: 6, temperature: 'Escaldante (~32°C / 90°F+)', condition: 'Clima Estranho (Rolar Tabela de Anomalias)' },
    ],
  },
  {
    season: 'Outono (Fall)',
    months: 'Setembro a Novembro',
    rolls: [
      { d6: 1, temperature: 'Fresco (~4°C / 40°F)', condition: 'Chuva Fria e Vento Forte' },
      { d6: 2, temperature: 'Ameno (~15°C / 60°F)', condition: 'Céu Limpo' },
      { d6: 3, temperature: 'Ameno (~15°C / 60°F)', condition: 'Nublado e Vento Seco dos Badlands' },
      { d6: 4, temperature: 'Ameno (~15°C / 60°F)', condition: 'Névoa Amarelada Baixa' },
      { d6: 5, temperature: 'Quente (~21°C / 70°F)', condition: 'Céu Limpo' },
      { d6: 6, temperature: 'Muito Quente (~27°C / 80°F)', condition: 'Clima Estranho (Rolar Tabela de Anomalias)' },
    ],
  },
];

export interface StrangeWeatherRoll {
  d10: number;
  name: string;
  namePt: string;
  duration: string;
  description: string;
  mechanics: string;
  citation: string;
}

export const strangeWeatherTable: StrangeWeatherRoll[] = [
  {
    d10: 1,
    name: 'Radioactive Windstorm',
    namePt: 'Vendaval Radioativo',
    duration: '1d6 x 10 Minutos (rajadas de 1d6 rodadas)',
    description: 'Ventos fortíssimos varrem a Hot Zone e a cratera da Torre Arasaka, espalhando isótopos de césio e partículas atômicas por bairros vizinhos.',
    mechanics: 'Qualquer um exposto sem Traje Anti-Radiação sofre efeitos de Radiação Severa (CP:R p. 181): DV15 Resist Torture/Drugs a cada hora ou perde 2d6 HP e adquire condição Enjoado.',
    citation: 'Night City Weather DLC p. 5 • CP:R p. 181',
  },
  {
    d10: 2,
    name: 'Ash Storm',
    namePt: 'Tempestade de Cinzas',
    duration: '1d6 x 10 Minutos',
    description: 'Incêndios maciços nos lixões ou nos Badlands empurram colunas densas de fuligem tóxica sobre a cidade, obscurecendo a luz solar em tons carmesins.',
    mechanics: 'Quem passar mais de 1 minuto sem Filtros Nasais ou Máscara Anti-Smog sofre teste de DV13 Resist Torture/Drugs ou sofre dano de Frasco de Veneno (2d6 direto no HP, CP:R p. 355) e ganha Ferimento Crítico de Corpo Estranho (Foreign Object) nos pulmões. Penalidade de -2 em Percepção e ataques à distância.',
    citation: 'Night City Weather DLC p. 4 • CP:R p. 355',
  },
  {
    d10: 3,
    name: 'Flooding',
    namePt: 'Inundação Costeira / Ressaca',
    duration: '1d6 Dias',
    description: 'O solo instável compactado após a explosão atômica de 2022 cede, e águas do Pacífico e de esgotos industriais transbordam avenidas, subsolos e estações subterrâneas.',
    mechanics: 'Nas ruas, água atinge 15 a 30 cm (dificulta tração de veículos). Em subsolos e túneis, vira terreno difícil (gasta o dobro de MOVE) e risco de choques elétricos por fiação exposta.',
    citation: 'Night City Weather DLC p. 5 • CP:R p. 169',
  },
  {
    d10: 4,
    name: 'Blood Rain',
    namePt: 'Chuva de Sangue (Blood Rain)',
    duration: '1d6 Horas',
    description: 'Precipitação oleosa, viscosa e avermelhada carregada de produtos químicos corrosivos e compostos de guerra bacteriológica/química da 4ª Guerra Corporativa.',
    mechanics: 'Rolar 1d6: Em 1-3 age como Chuva Ácida (-1 SP de armadura por minuto exposto sem proteção). Em 4-6, a cada minuto exposto sem proteção, o personagem é tratado como dosado com um Frasco de Biotoxina (DV15 Resist Torture/Drugs ou sofre 3d6 de dano direto no HP). Penalidade de -1 em Percepção e ataques à distância.',
    citation: 'Night City Weather DLC p. 4 • CP:R p. 355',
  },
  {
    d10: 5,
    name: 'Acid Rain',
    namePt: 'Chuva Ácida Severa',
    duration: '1d6 Horas',
    description: 'Gotas altamente cáusticas de pH 2.5 dissolvem tecidos sintéticos, desgastam tintas de carros e queimam pele desprotegida.',
    mechanics: 'Ablação contínua: Para cada minuto inteiro gasto sob a chuva ácida sem cobertura ou guarda-chuva, TODA armadura vestida sofre 1 ponto de ablação (-1 SP na Cabeça e no Corpo). Danifica itens expostos e pintura.',
    citation: 'Night City Weather DLC p. 4',
  },
  {
    d10: 6,
    name: 'Deadly Thunderstorm',
    namePt: 'Tempestade de Raios Destrutiva',
    duration: '1d6 x 10 Minutos',
    description: 'Tempestade elétrica violenta. A estática no ar faz os implantes zumbirem antes dos relâmpagos romperem os prédios.',
    mechanics: 'A cada 10 minutos, o Mestre rola 1d6. Em 4-6, um raio atinge a estrutura mais alta ou o personagem mais alto / segurando arma de metal com as duas mãos. Dano de 6d6 no corpo + efeito idêntico a Granada Flashbang (CP:R p. 346, DV15 Resist Torture/Drugs ou atordoado/cego). -2 em testes de Percepção e disparos à distância.',
    citation: 'Night City Weather DLC p. 4-5 • CP:R p. 346',
  },
  {
    d10: 7,
    name: 'Inversion Smog',
    namePt: 'Inversão Térmica com Smog Asfixiante',
    duration: '1d6 Dias',
    description: 'Massa de ar frio prende uma camada densa de fumaça de CHOOH2, fuligem e vapores petroquímicos sobre a cidade, como uma sopa amarela impenetrável.',
    mechanics: 'Visibilidade quase nula. Penalidade brutal de -4 em todos os testes de Percepção e ataques à distância. Quem passar mais de 1 minuto sem Máscara Anti-Smog ou Filtros Nasais sofre DV13 Resist Torture/Drugs como exposição a Frasco de Veneno (2d6 no HP).',
    citation: 'Night City Weather DLC p. 5 • CP:R p. 355',
  },
  {
    d10: 8,
    name: 'Cold Snap / Heat Wave',
    namePt: 'Onda Térmica Extrema (Frio Polar ou Calor Extremo)',
    duration: '1d6 Dias',
    description: 'Oscilação climática violenta. No frio, gelo negro cobre o asfalto. No calor, o mercúrio sobe para 45°C (113°F) com sensação térmica sufocante.',
    mechanics: 'Se Frio Polar: Regras de Exposição (CP:R p. 181). Gelo escorregadio impõe -2 em Atletismo, Condução e Esquiva. Se Onda de Calor: Aumenta em +2 a penalidade de armadura para REF, DEX e MOVE (ex: penalidade de -2 vira -4!). Regras de Exposição ao calor (desidratação e fadiga).',
    citation: 'Night City Weather DLC p. 4-5 • CP:R p. 181',
  },
  {
    d10: 9,
    name: 'Dust Storm',
    namePt: 'Tempestade de Poeira dos Badlands',
    duration: '1d6 x 10 Minutos',
    description: 'Ventos uivantes arrastam areia vermelha e partículas dos Badlands secos, cegando câmeras e diminuindo a tração nas estradas.',
    mechanics: 'Mais de 5 minutos sem máscara/filtros provoca Ferimento Crítico de Corpo Estranho (Foreign Object) nos pulmões (5 de dano sempre que se mover mais de 4m a pé no turno). Penalidade de -2 em testes de Percepção visual e tiros de longo alcance.',
    citation: 'Night City Weather DLC p. 5',
  },
  {
    d10: 10,
    name: 'City Grid Blackout',
    namePt: 'Apagão Elétrico de Setor',
    duration: '1d6 Dias',
    description: 'Subestações sobrecarregam ou são sabotadas. Setores inteiros perdem luz, conexões CitiNet, sinal de celulares e Data Pool.',
    mechanics: 'Raio de 1d10 quarteirões afetado. Prédios sem geradores próprios ficam em breu total (-4 sem Visão Noturna). Telefones/Agentes não alcançam o Data Pool nem conseguem chamar a polícia ou Trauma Team sem linha dedicada com fio.',
    citation: 'Night City Weather DLC p. 4',
  },
];

export interface UrbanEvent {
  id: string;
  title: string;
  zone: string;
  description: string;
  mechanics: string;
  hook: string;
}

export const urbanEventsList: UrbanEvent[] = [
  {
    id: 'militech-blockade',
    title: 'Bloqueio Armado da Militech',
    zone: 'Watson ou Corporate Center',
    description: 'Comboio militarizado de AVs e veículos blindados fechou uma avenida inteira com barricadas retráteis, revistando cidadãos sob pretexto de caça a terroristas.',
    mechanics: 'Passar pelo bloqueio exige suborno de 100eb (Fixer/Streetwise DV13) ou teste de Dissimulação / Furtividade DV15. Armas visíveis são confiscadas a menos que o porte corporativo seja válido.',
    hook: 'Um mensageiro ferido tenta passar um chip de dados escondido no bolso de um dos Edgerunners enquanto é empurrado pelos soldados.',
  },
  {
    id: 'ziggurat-outage',
    title: 'Queda de Servidor da Ziggurat',
    zone: 'Cidade Inteira',
    description: 'O Data Pool local sofre lentidão catastrófica; feeds de Realidade Aumentada (AR) piscam com estática e propagandas corrompidas.',
    mechanics: 'Testes de Biblioteca/Pesquisa no Data Pool têm penalidade de -3. Pagamentos digitais demoram 1d10 rodadas para autenticar.',
    hook: 'Durante a queda temporária de criptografia, arquivos confidenciais de executivos vazam em canais abertos de BBS.',
  },
  {
    id: 'food-riot',
    title: 'Revolta da Fome por Ração Kibble',
    zone: 'Santo Domingo ou Heywood',
    description: 'Um carregamento de comida fresca e ração sintetizada da Continental Brands atrasou, gerando motim popular em frente a um armazém da OASIS.',
    mechanics: 'Multidão enfurecida atua como terreno difícil e zona de perigo: teste de Atletismo DV13 para não ser pisoteado (2d6 de dano de contusão). Gás lacrimogêneo lançado pela polícia privada.',
    hook: 'O gerente do armazém oferece 1.000eb para quem escoltar seu carro pessoal para fora do cerco com segurança.',
  },
  {
    id: 'petrochem-leak',
    title: 'Vazamento Químico Petroquímico',
    zone: 'Industrial ou Badlands',
    description: 'Duto clandestino de CHOOH2 ou solventes pesados explodiu em um beco, liberando uma névoa inflamável e venenosa ao nível do chão.',
    mechanics: 'Qualquer faísca ou disparo de arma de fogo acende a fumaça gerando explosão de 6d6 em área de 10x10m. Sem máscara, DV13 Resist Torture/Drugs para evitar náuseas.',
    hook: 'Gangers locais estão recolhendo recipientes do produto para vender como droga sintética e atacam quem se aproximar.',
  },
  {
    id: 'trauma-evac',
    title: 'Extração de Alto Risco do Trauma Team',
    zone: 'Pacifica ou Old Combat Zone',
    description: 'Uma AV-4 de resgate desceu em emergência sob fogo pesado de foguetes caseiros de gangers para retirar um cliente com conta Platinum.',
    mechanics: 'Solos do Trauma Team estabelecem perímetro de fogo de supressão automático (DV17 Autofire). Qualquer um na linha de visão é alvejado sem aviso prévio.',
    hook: 'O piloto da AV-4 foi baleado e a nave está presa no teto; os médicos transmitem um pedido de reforço pago no canal aberto de emergência.',
  },
  {
    id: 'ncpd-sweep',
    title: 'Varredura Noturna do DPNC (NCPD Sweep)',
    zone: 'Little China ou The Glen',
    description: 'Dezenas de viaturas com sirenes abertas e holofotes aéreos isolam um quadrante caçando membros do Maelstrom que roubaram suprimentos médicos.',
    mechanics: 'Toque de recolher imposto. Qualquer pessoa na rua após às 22h é parada para identificação facial (Agente com Cidadania Legal DV13 ou prisão preventiva).',
    hook: 'Um membro ensanguentado dos Valentinos se esconde atrás da van dos PJs implorando por abrigo.',
  },
];
