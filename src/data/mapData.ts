import { DistrictInfo } from '../types/system';

export interface MapDistrict extends DistrictInfo {
  svgPath: string;
  polygonPoints: string;
  centerCoords: { x: number; y: number };
  shortName: string;
  strokeColor: string;
  fillColor: string;
  colorTheme: string;
}

// Official 2045 Cyberpunk RED Districts directly aligned with the official map (map_extract_0.jpg & legend map_extract_2.jpg)
export const NIGHT_CITY_DISTRICTS: MapDistrict[] = [
  // 1. NorCal Military Base [M]
  {
    id: 'norcal-military',
    name: 'Base Militar NorCal (NorCal Military Base)',
    zoneType: 'Corporate',
    threatLevel: 'Extreme',
    threatRatingNumber: 9,
    ncpdResponseTime: 'Jurisdição Militar Federal / Militech (Tiroteio Imediato)',
    traumaTeamResponse: 'Acesso Proibido a Não-Militares',
    dominantFactions: ['Militech Defesa Territorial', 'Exército dos EUA / NorCal'],
    description: 'Instalação militar e aeródromo de defesa na península norte de Night City. Guarnecida com baterias de mísseis terra-ar, radares de varredura orbital e pistas para caças supersônicos.',
    svgPath: 'M 200 200 L 280 100 L 350 60 L 470 80 L 550 140 L 500 180 L 430 180 L 360 180 L 300 220 L 230 240 Z',
    polygonPoints: '20,20 28,10 35,6 47,8 55,14 50,18 43,18 36,18 30,22 23,24',
    centerCoords: { x: 41.1, y: 12.1 },
    shortName: 'NORCAL BASE',
    strokeColor: '#ef4444',
    fillColor: 'rgba(239, 68, 68, 0.25)',
    colorTheme: 'border-red-600 text-red-400 bg-red-950/40',
    pointsOfInterest: [
      { name: 'Pista de Pouso Costeira NorCal', type: 'Instalação Militar', description: 'Pista de decolagem estendida sobre a baía de Estero para caças e cargueiros táticos.', dangerLevel: 'Extremo' },
      { name: 'Bunker de Comando Subterrâneo', type: 'Sede Militar', description: 'Complexo blindado a 30 metros de profundidade com geradores independentes.', dangerLevel: 'Extremo' },
    ],
  },

  // 2. Watson Development [N]
  {
    id: 'watson-development',
    name: 'Desenvolvimento de Watson (Watson Development)',
    zoneType: 'Moderate',
    threatLevel: 'High',
    threatRatingNumber: 7,
    ncpdResponseTime: '10 a 20 minutos (Raramente entram sozinhos)',
    traumaTeamResponse: '5 a 8 minutos (Requer escolta armada pesada)',
    dominantFactions: ['Maelstrom', 'The Moxes', 'Fixers Independentes'],
    description: 'O setor central de Watson em reconstrução. Antigos galpões fabris abandonados e canteiros de obras inacabados agora servem de oficinas ilegais de cromo, covis de gangues e mercados improvisados.',
    svgPath: 'M 360 180 L 430 180 L 470 190 L 470 330 L 440 360 L 370 350 L 340 260 L 360 190 Z',
    polygonPoints: '36,18 43,18 47,19 47,33 44,36 37,35 34,26 36,19',
    centerCoords: { x: 43.0, y: 26.0 },
    shortName: 'WATSON DEV',
    strokeColor: '#f59e0b',
    fillColor: 'rgba(245, 158, 11, 0.22)',
    colorTheme: 'border-amber-500 text-amber-400 bg-amber-950/40',
    pointsOfInterest: [
      { name: 'Clube Totentanz', type: 'Covil da Maelstrom', description: 'Antiga fábrica transformada na meca do neo-trash metal e tiroteios de mercenários.', dangerLevel: 'Extremo' },
      { name: 'Oficinas Clandestinas de Cromo', type: 'Ripperdocs', description: 'Becos estreitos onde se instalam implantes militares roubados sem registro.', dangerLevel: 'Alto' },
    ],
  },

  // 3. Kabuki [O]
  {
    id: 'kabuki',
    name: 'Kabuki',
    zoneType: 'Moderate',
    threatLevel: 'Medium',
    threatRatingNumber: 5,
    ncpdResponseTime: '8 a 15 minutos',
    traumaTeamResponse: 'Sub-6 minutos',
    dominantFactions: ['Tyger Claws', 'Comerciantes Livres de Kabuki', 'The Moxes'],
    description: 'Bazar labiríntico denso e barulhento com pontes de pedestres suspensas, letreiros em neon holográfico e feiras de comida que nunca fecham. Centro comercial informal de implantes e eletrônicos.',
    svgPath: 'M 470 190 L 540 190 L 560 230 L 540 340 L 490 340 L 470 330 Z',
    polygonPoints: '47,19 54,19 56,23 54,34 49,34 47,33',
    centerCoords: { x: 50.5, y: 25.3 },
    shortName: 'KABUKI',
    strokeColor: '#fbbf24',
    fillColor: 'rgba(251, 191, 36, 0.22)',
    colorTheme: 'border-yellow-400 text-yellow-300 bg-yellow-950/40',
    pointsOfInterest: [
      { name: 'Mercado Redondo de Kabuki', type: 'Feira Subterrânea', description: 'Três andares espirais com barracas vendendo desde noodles até cyberdecks modificados.', dangerLevel: 'Médio' },
      { name: "Lizzie's Bar (Extensão)", type: 'Clube de Braindance', description: 'Ponto de encontro das Moxes com segurança pesada e neons rosas.', dangerLevel: 'Baixo' },
    ],
  },

  // 4. New Westbrook [P]
  {
    id: 'new-westbrook',
    name: 'Novo Westbrook (New Westbrook)',
    zoneType: 'Corporate',
    threatLevel: 'Medium',
    threatRatingNumber: 4,
    ncpdResponseTime: '3 a 7 minutos',
    traumaTeamResponse: 'Sub-4 minutos (Serviço Total)',
    dominantFactions: ['Tyger Claws', 'Charter Hill Security', 'Arasaka'],
    description: 'Distrito próspero com arranha-céus reluzentes e residências de executivos e gerentes corporativos. Bares refinados, lounges de alta classe e casas de jogos orientais dominam as avenidas.',
    svgPath: 'M 550 140 L 620 170 L 660 220 L 650 340 L 560 360 L 550 250 L 540 190 Z',
    polygonPoints: '55,14 62,17 66,22 65,34 56,36 55,25 54,19',
    centerCoords: { x: 60.8, y: 22.4 },
    shortName: 'NEW WESTBROOK',
    strokeColor: '#38bdf8',
    fillColor: 'rgba(56, 189, 248, 0.22)',
    colorTheme: 'border-sky-400 text-sky-300 bg-sky-950/40',
    pointsOfInterest: [
      { name: 'Hotel & Cassino Clouds', type: 'Lounge VIP', description: 'Arranha-céu com acompanhantes cibernéticas de luxo moduladas por chips comportamentais.', dangerLevel: 'Médio' },
      { name: 'Santuário Shinto da Colina', type: 'Templo Tradicional', description: 'Parque isolado com jardins zen mantidos por monges e robôs jardineiros.', dangerLevel: 'Baixo' },
    ],
  },

  // 5. Charter Hill [Q]
  {
    id: 'charter-hill',
    name: 'Charter Hill',
    zoneType: 'Corporate',
    threatLevel: 'Low',
    threatRatingNumber: 3,
    ncpdResponseTime: '2 a 5 minutos (Guarda Privada Integrada)',
    traumaTeamResponse: 'Sub-3 minutos (Prioridade Platina)',
    dominantFactions: ['Segurança Privada Charter', 'Militech', 'Arasaka'],
    description: 'Colinas arborizadas pontilhadas de mansões modernistas protegidas por guaritas fortificadas, câmeras de alta definição e drones patrulheiros. Residência de diretores corporativos e diplomatas.',
    svgPath: 'M 660 280 L 750 280 L 770 360 L 710 370 L 660 350 Z',
    polygonPoints: '66,28 75,28 77,36 71,37 66,35',
    centerCoords: { x: 71.8, y: 32.4 },
    shortName: 'CHARTER HILL',
    strokeColor: '#0ea5e9',
    fillColor: 'rgba(14, 165, 233, 0.22)',
    colorTheme: 'border-blue-500 text-blue-400 bg-blue-950/40',
    pointsOfInterest: [
      { name: 'Condomínios Murados das Colinas', type: 'Residências Fortificadas', description: 'Propriedades fechadas com metralhadoras embutidas nas cercas vivas.', dangerLevel: 'Alto para invasores' },
      { name: 'Charter Security Garrison', type: 'Base Militarizada', description: 'Quartel central com veículos blindados leves e helicópteros executivos.', dangerLevel: 'Baixo' },
    ],
  },

  // 6. Exec Zone [R]
  {
    id: 'exec-zone',
    name: 'Zona Executiva (Exec Zone)',
    zoneType: 'Corporate',
    threatLevel: 'Low',
    threatRatingNumber: 2,
    ncpdResponseTime: 'Menos de 2 minutos (Prioridade Máxima)',
    traumaTeamResponse: 'Sub-2 minutos (AV-4 no local)',
    dominantFactions: ['Militech Defesa Executiva', 'Petrochem VIP', 'Consórcio Financeiro'],
    description: 'Enclave ultra-exclusivo e higienizado com arquitetura neoclássica e brutalista corporativa. As ruas são limpas 24 horas por dia e qualquer pessoa sem crachá corporativo é revistada ou detida.',
    svgPath: 'M 670 370 L 770 370 L 770 460 L 680 460 L 660 420 Z',
    polygonPoints: '67,37 77,37 77,46 68,46 66,42',
    centerCoords: { x: 73.2, y: 40.1 },
    shortName: 'EXEC ZONE',
    strokeColor: '#10b981',
    fillColor: 'rgba(16, 185, 129, 0.25)',
    colorTheme: 'border-emerald-500 text-emerald-400 bg-emerald-950/40',
    pointsOfInterest: [
      { name: 'Centro de Convenções Corporativo', type: 'Auditório de Cúpula', description: 'Onde acordos multibilionários entre megacorporações são assinados sob segurança máxima.', dangerLevel: 'Baixo' },
      { name: 'Heliporto Executivo Sul', type: 'Transporte Aéreo', description: 'Base de lançamento de AVs para voos diretos até Morro Rock e Los Angeles.', dangerLevel: 'Baixo' },
    ],
  },

  // 7. Little Europe [A]
  {
    id: 'little-europe',
    name: 'Pequena Europa (Little Europe)',
    zoneType: 'Moderate',
    threatLevel: 'Medium',
    threatRatingNumber: 4,
    ncpdResponseTime: '5 a 10 minutos',
    traumaTeamResponse: 'Sub-5 minutos',
    dominantFactions: ['DPNC Divisão Centro', 'Negociantes Independentes', 'Bistrôs Europeus'],
    description: 'Bairro charmoso reconstruído com réplicas de fachadas do século XIX, bistrôs franceses, cafés e galerias de arte boêmias misturadas a escritórios de advocacia corporativa.',
    svgPath: 'M 320 380 L 460 380 L 460 450 L 350 460 L 320 440 Z',
    polygonPoints: '32,38 46,38 46,45 35,46 32,44',
    centerCoords: { x: 39.1, y: 42.1 },
    shortName: 'LITTLE EUROPE',
    strokeColor: '#a855f7',
    fillColor: 'rgba(168, 85, 247, 0.22)',
    colorTheme: 'border-purple-400 text-purple-300 bg-purple-950/40',
    pointsOfInterest: [
      { name: 'Café & Bistrô Neoclássico', type: 'Restaurante Gastronômico', description: 'Ponto de encontro onde Fixers refinados negociam contratos de espionagem industrial.', dangerLevel: 'Baixo' },
      { name: 'Livraria & Antiquário Analógico', type: 'Comércio Raro', description: 'Loja com livros de papel autênticos sobreviventes da Guerra Corporativa.', dangerLevel: 'Baixo' },
    ],
  },

  // 8. Upper Marina [B]
  {
    id: 'upper-marina',
    name: 'Upper Marina',
    zoneType: 'Moderate',
    threatLevel: 'Medium',
    threatRatingNumber: 5,
    ncpdResponseTime: '6 a 12 minutos',
    traumaTeamResponse: 'Sub-4 minutos',
    dominantFactions: ['Piranhas', 'Trauma Team Internacional', 'Guarda Portuária'],
    description: 'Píeres modernos com ancoradouros para iates de velocidade corporativos, armazéns de peças náuticas e restaurantes de frutos do mar clonados com vista para a baía de Del Coronado.',
    svgPath: 'M 460 380 L 580 400 L 580 470 L 510 480 L 460 440 Z',
    polygonPoints: '46,38 58,40 58,47 51,48 46,44',
    centerCoords: { x: 54.6, y: 43.3 },
    shortName: 'UPPER MARINA',
    strokeColor: '#06b6d4',
    fillColor: 'rgba(6, 182, 212, 0.22)',
    colorTheme: 'border-cyan-400 text-cyan-300 bg-cyan-950/40',
    pointsOfInterest: [
      { name: 'Doca de Iates Rápidos', type: 'Porto Privado', description: 'Lanchas blindadas com motores turbo para fuga rápida de executivos pelo mar.', dangerLevel: 'Médio' },
      { name: 'Torre de Controle Náutico', type: 'Infraestrutura Portuária', description: 'Monitora tráfego de cargas e submarinos na entrada da baía.', dangerLevel: 'Baixo' },
    ],
  },

  // 9. The Hot Zone [D]
  {
    id: 'the-hot-zone',
    name: 'The Hot Zone (Marco Zero Radioativo / Ruínas Arasaka)',
    zoneType: 'Combat Zone',
    threatLevel: 'Extreme',
    threatRatingNumber: 10,
    ncpdResponseTime: 'ZERO (Proibido para viaturas policiais)',
    traumaTeamResponse: 'ZERO (Contrato de Resgate Nulo por Radiação)',
    dominantFactions: ['Scavengers', 'Saqueadores Radioativos', 'Drones Automatizados de Contenção'],
    description: 'A gigantesca cratera atômica deixada pela bomba nuclear de 2022 que pulverizou as Torres Arasaka. Cercada por muros de concreto armado e torres de aviso de radiação gama.',
    svgPath: 'M 410 450 L 540 450 L 550 540 L 410 550 L 400 490 Z',
    polygonPoints: '41,45 54,45 55,54 41,55 40,49',
    centerCoords: { x: 47.4, y: 49.6 },
    shortName: 'HOT ZONE',
    strokeColor: '#dc2626',
    fillColor: 'rgba(220, 38, 38, 0.35)',
    colorTheme: 'border-red-600 text-red-500 bg-red-950/70',
    pointsOfInterest: [
      { name: 'Cratera da Antiga Torre Arasaka', type: 'Marco Zero Nuclear', description: 'O buraco fundido e vitrificado de 50 metros de profundidade com detritos de servidores soterrados.', dangerLevel: 'Extremo / Radiação Letal' },
      { name: 'Muralha de Chumbo e Contenção', type: 'Barreira Militar', description: 'Muro vigiado por sentinelas eletrônicas para evitar que perigos escapem para Downtown.', dangerLevel: 'Extremo' },
    ],
  },

  // 10. Downtown [C]
  {
    id: 'downtown',
    name: 'Downtown (Centro Comercial & Financeiro)',
    zoneType: 'Corporate',
    threatLevel: 'Low',
    threatRatingNumber: 3,
    ncpdResponseTime: 'Menos de 3 minutos',
    traumaTeamResponse: 'Sub-3 minutos',
    dominantFactions: ['Militech', 'DPNC Divisão Central', 'Ziggurat CitiNet'],
    description: 'O reluzente centro comercial com torres de escritórios de vidro escuro, telões holográficos de 30 andares e patrulhas frequentes do DPNC. O centro do poder legislativo e bancário municipal.',
    svgPath: 'M 240 440 L 410 440 L 410 520 L 240 520 L 240 480 Z',
    polygonPoints: '24,44 41,44 41,52 24,52 24,48',
    centerCoords: { x: 30.1, y: 48.0 },
    shortName: 'DOWNTOWN',
    strokeColor: '#10b981',
    fillColor: 'rgba(16, 185, 129, 0.22)',
    colorTheme: 'border-emerald-500 text-emerald-400 bg-emerald-950/40',
    pointsOfInterest: [
      { name: 'Prefeitura de Night City & Corte Cívica', type: 'Governo Municipal', description: 'Palácio de mármore e vidro onde o Conselho Municipal vota as leis da cidade.', dangerLevel: 'Baixo' },
      { name: 'Torre CitiNet Ziggurat', type: 'Telecomunicações Globais', description: 'Megaestrutura de antenas que processa as comunicações de dados e Data Pools da metrópole.', dangerLevel: 'Médio' },
    ],
  },

  // 11. University District [F]
  {
    id: 'university-district',
    name: 'Distrito Universitário (University District)',
    zoneType: 'Moderate',
    threatLevel: 'Medium',
    threatRatingNumber: 4,
    ncpdResponseTime: '5 a 10 minutos',
    traumaTeamResponse: 'Sub-5 minutos',
    dominantFactions: ['Universidade de Night City', 'Netrunners Acadêmicos', 'Segurança do Campus'],
    description: 'Campus histórico reconstruído com bibliotecas digitais fechadas, laboratórios de biotecnologia e cafeterias repletas de estudantes, técnicos e netrunners em busca de dados proibidos.',
    svgPath: 'M 240 520 L 410 520 L 410 600 L 250 600 L 240 560 Z',
    polygonPoints: '24,52 41,52 41,60 25,60 24,56',
    centerCoords: { x: 29.7, y: 55.8 },
    shortName: 'UNIVERSITY',
    strokeColor: '#6366f1',
    fillColor: 'rgba(99, 102, 241, 0.22)',
    colorTheme: 'border-indigo-400 text-indigo-300 bg-indigo-950/40',
    pointsOfInterest: [
      { name: 'Biblioteca Central de Dados', type: 'Acervo Digital', description: 'Servidores locais protegidos por ICE acadêmico contendo manuais técnicos e patentes antigas.', dangerLevel: 'Baixo' },
      { name: 'Dormitórios Comunitários de Pesquisa', type: 'Moradia Estudantil', description: 'Apartamentos compactos onde hackers novatos constroem e testam cyberdecks caseiros.', dangerLevel: 'Médio' },
    ],
  },

  // 12. South Night City [I]
  {
    id: 'south-night-city',
    name: 'South Night City',
    zoneType: 'Moderate',
    threatLevel: 'High',
    threatRatingNumber: 6,
    ncpdResponseTime: '10 a 20 minutos',
    traumaTeamResponse: '6 a 10 minutos',
    dominantFactions: ['Valentinos', 'Gangues de Bairro', 'Oficinas Independentes'],
    description: 'Bairro residencial de alta densidade com conjuntos habitacionais de concreto, feiras livres de rua e garagens de tunagem. Ponto de transição entre o centro cívico e a costa sul.',
    svgPath: 'M 260 600 L 400 600 L 400 660 L 280 660 L 260 630 Z',
    polygonPoints: '26,60 40,60 40,66 28,66 26,63',
    centerCoords: { x: 33.8, y: 62.7 },
    shortName: 'SOUTH NC',
    strokeColor: '#eab308',
    fillColor: 'rgba(234, 179, 8, 0.22)',
    colorTheme: 'border-yellow-500 text-yellow-400 bg-yellow-950/40',
    pointsOfInterest: [
      { name: 'Garagem Central de Chooh2', type: 'Oficina Mecânica', description: 'Ponto de encontro de pilotos de racha e contrabandistas de combustível sintético.', dangerLevel: 'Médio' },
      { name: 'Conjunto Habitacional Skyline South', type: 'Megaprédio Residencial', description: 'Quatro blocos habitacionais com mais de 10 mil residentes espremidos em microapartamentos.', dangerLevel: 'Médio' },
    ],
  },

  // 13. Port of Night City [J]
  {
    id: 'port-of-night-city',
    name: 'Porto de Night City (Port of Night City)',
    zoneType: 'Industrial',
    threatLevel: 'High',
    threatRatingNumber: 7,
    ncpdResponseTime: '15 a 25 minutos',
    traumaTeamResponse: '8 a 12 minutos',
    dominantFactions: ['Sindicato dos Estivadores', 'Contrabandistas Oceânicos', 'Militech Portuária'],
    description: 'Guindastes monumentais descarregando contêineres marítimos de navios cargueiros automatizados. O local mais movimentado para tráfico de armamentos e suprimentos pesados.',
    svgPath: 'M 230 660 L 320 660 L 320 740 L 240 740 L 220 700 Z',
    polygonPoints: '23,66 32,66 32,74 24,74 22,70',
    centerCoords: { x: 30.1, y: 68.8 },
    shortName: 'PORT OF NC',
    strokeColor: '#0284c7',
    fillColor: 'rgba(2, 132, 199, 0.22)',
    colorTheme: 'border-sky-600 text-sky-400 bg-sky-950/40',
    pointsOfInterest: [
      { name: 'Pátio de Contêineres de Carga', type: 'Armazém Portuário', description: 'Labirinto de caixas de aço de 12 metros onde cargas "desaparecem" rotineiramente.', dangerLevel: 'Alto' },
      { name: 'Doca Seca dos Submarinos de Carga', type: 'Manutenção Naval', description: 'Instalação onde submarinos autônomos de alta profundidade são reparados.', dangerLevel: 'Alto' },
    ],
  },

  // 14. Reclamation Zone [K]
  {
    id: 'reclamation-zone',
    name: 'Zona de Reclamação (Reclamation Zone)',
    zoneType: 'Moderate',
    threatLevel: 'Medium',
    threatRatingNumber: 5,
    ncpdResponseTime: '12 a 20 minutos',
    traumaTeamResponse: '7 a 10 minutos',
    dominantFactions: ['Equipes de Reconstrução Cívica', 'Nômades Construtores', 'Cooperativas'],
    description: 'Área recuperada das águas da baía com aterros de concreto e cascalho. Projetos habitacionais experimentais e estufas comunitárias tentam recuperar a dignidade urbana.',
    svgPath: 'M 320 660 L 420 660 L 420 750 L 320 750 L 320 700 Z',
    polygonPoints: '32,66 42,66 42,75 32,75 32,70',
    centerCoords: { x: 35.0, y: 71.2 },
    shortName: 'RECLAMATION',
    strokeColor: '#84cc16',
    fillColor: 'rgba(132, 204, 22, 0.22)',
    colorTheme: 'border-lime-500 text-lime-400 bg-lime-950/40',
    pointsOfInterest: [
      { name: 'Central de Triagem de Entulho e Concreto', type: 'Reciclagem Industrial', description: 'Britadeiras industriais triturando destroços da guerra para construir novos alicerces.', dangerLevel: 'Médio' },
      { name: 'Vila Modular de Contêineres', type: 'Habitação Temporária', description: 'Assentamento comunitário limpo e vigiado por milícias de trabalhadores voluntários.', dangerLevel: 'Baixo' },
    ],
  },

  // 15. The Glen [G]
  {
    id: 'the-glen',
    name: 'The Glen (Coração de Heywood)',
    zoneType: 'Moderate',
    threatLevel: 'Medium',
    threatRatingNumber: 5,
    ncpdResponseTime: '5 a 12 minutos',
    traumaTeamResponse: '4 a 6 minutos',
    dominantFactions: ['Valentinos', 'DPNC Delegacia Central', 'Padre Ibarra'],
    description: 'Bairro vibrante com enorme orgulho comunitário e raízes latinas profundas. Mescla edifícios governamentais robustos com cortiços decorados com murais de Nossa Senhora de Guadalupe.',
    svgPath: 'M 400 560 L 490 560 L 490 670 L 400 670 Z',
    polygonPoints: '40,56 49,56 49,67 40,67',
    centerCoords: { x: 44.3, y: 63.0 },
    shortName: 'THE GLEN',
    strokeColor: '#f59e0b',
    fillColor: 'rgba(245, 158, 11, 0.22)',
    colorTheme: 'border-amber-500 text-amber-400 bg-amber-950/40',
    pointsOfInterest: [
      { name: 'Bar El Coyote Cojo', type: 'Templo Comunitário', description: 'O lendário bar de Mama Welles, território neutro dos Valentinos e o coração caloroso de Heywood.', dangerLevel: 'Baixo se respeitar as regras' },
      { name: 'Delegacia Central do DPNC The Glen', type: 'Quartel Policial', description: 'Bunker de concreto com frotas de viaturas blindadas e celas de custódia rápida.', dangerLevel: 'Médio' },
    ],
  },

  // 16. Little China [E]
  {
    id: 'little-china',
    name: 'Little China (Chinatown Central)',
    zoneType: 'Moderate',
    threatLevel: 'Medium',
    threatRatingNumber: 5,
    ncpdResponseTime: '6 a 12 minutos',
    traumaTeamResponse: 'Sub-5 minutos',
    dominantFactions: ['Gold Dragons', 'Mudang Gumi', 'The Afterlife Bar'],
    description: 'Distrito mercantil vibrante espremido entre as ruínas da Hot Zone e a entrada do canal. Fachadas cobertas por dragões dourados, lojas de ervas tradicionais e clínicas cirúrgicas discretas.',
    svgPath: 'M 540 480 L 650 490 L 670 580 L 550 570 Z',
    polygonPoints: '54,48 65,49 67,58 55,57',
    centerCoords: { x: 60.5, y: 53.0 },
    shortName: 'LITTLE CHINA',
    strokeColor: '#ec4899',
    fillColor: 'rgba(236, 72, 153, 0.22)',
    colorTheme: 'border-pink-500 text-pink-400 bg-pink-950/40',
    pointsOfInterest: [
      { name: 'The Afterlife Bar', type: 'Santuário de Solos & Fixers', description: 'Construído no antigo necrotério de um hospital, onde lendas como Johnny Silverhand são reverenciadas em drinks.', dangerLevel: 'Médio / Trégua Armada' },
      { name: 'Casa de Chá & Drogas de Ervas', type: 'Comércio Tradicional', description: 'Ponto de encontro discreto de corretores corporativos e médicos clandestinos.', dangerLevel: 'Baixo' },
    ],
  },

  // 17. Old Japantown [H]
  {
    id: 'old-japantown',
    name: 'Old Japantown',
    zoneType: 'Moderate',
    threatLevel: 'High',
    threatRatingNumber: 6,
    ncpdResponseTime: '8 a 15 minutos',
    traumaTeamResponse: 'Sub-6 minutos',
    dominantFactions: ['Tyger Claws', 'Comerciantes Tradicionais Japoneses'],
    description: 'A histórica Japantown original, densamente reconstruída com casas de pachinko, restaurantes de ramen fumegantes sob lanternas vermelhas e garagens subterrâneas de motos velozes.',
    svgPath: 'M 490 560 L 590 570 L 580 640 L 490 640 Z',
    polygonPoints: '49,56 59,57 58,64 49,64',
    centerCoords: { x: 53.8, y: 59.8 },
    shortName: 'OLD JAPANTOWN',
    strokeColor: '#f43f5e',
    fillColor: 'rgba(244, 63, 94, 0.22)',
    colorTheme: 'border-rose-500 text-rose-400 bg-rose-950/40',
    pointsOfInterest: [
      { name: 'Santuário Cherry Blossom Antigo', type: 'Jardim Tradicional', description: 'Cerejeiras sintéticas e sinos de oração onde líderes dos Tyger Claws prestam juramentos de sangue.', dangerLevel: 'Médio' },
      { name: 'Pachinko Palace Neon', type: 'Casa de Apostas', description: 'Centenas de máquinas de apostas barulhentas lavando eurodólares de contrabando.', dangerLevel: 'Médio' },
    ],
  },

  // 18. Old Combat Zone [L]
  {
    id: 'old-combat-zone',
    name: 'Old Combat Zone (Zona de Combate Antiga)',
    zoneType: 'Combat Zone',
    threatLevel: 'Extreme',
    threatRatingNumber: 10,
    ncpdResponseTime: 'ZERO (Sem jurisdição policial)',
    traumaTeamResponse: 'ZERO (Resgates cancelados automaticamente)',
    dominantFactions: ['Inquisidores', 'Bozos', 'Zoners', 'Scavengers'],
    description: 'Área devastada onde o governo civil desapareceu por completo. Prédios semi-destruídos por bombardeios abrigam facções sádicas, clínicas clandestinas de extração forçada e mercados negros.',
    svgPath: 'M 440 650 L 570 640 L 560 710 L 440 710 Z',
    polygonPoints: '44,65 57,64 56,71 44,71',
    centerCoords: { x: 51.4, y: 67.0 },
    shortName: 'OLD COMBAT',
    strokeColor: '#ef4444',
    fillColor: 'rgba(239, 68, 68, 0.30)',
    colorTheme: 'border-red-600 text-red-500 bg-red-950/70',
    pointsOfInterest: [
      { name: 'Catedral dos Inquisidores', type: 'Covil Extremista', description: 'Ruína de uma igreja onde cibernéticos são arrancados à força de vítimas sequestradas.', dangerLevel: 'Extremo' },
      { name: 'Circo da Morte dos Bozos', type: 'Arena Macabra', description: 'Galpão fortificado repleto de armadilhas explosivas e risadas sintéticas gravadas.', dangerLevel: 'Extremo' },
    ],
  },

  // 19. Heywood Docks [S]
  {
    id: 'heywood-docks',
    name: 'Docas de Heywood (Heywood Docks)',
    zoneType: 'Industrial',
    threatLevel: 'High',
    threatRatingNumber: 6,
    ncpdResponseTime: '12 a 20 minutos',
    traumaTeamResponse: '7 a 10 minutos',
    dominantFactions: ['Sindicato Portuário Oriental', '6th Street', 'Petrochem'],
    description: 'A margem oriental do Morro Canal repleta de cais de barcaças, tanques de armazenamento de combustíveis e depósitos alfandegários pesadamente vigiados.',
    svgPath: 'M 620 560 L 730 560 L 740 640 L 630 640 Z',
    polygonPoints: '62,56 73,56 74,64 63,64',
    centerCoords: { x: 68.0, y: 60.9 },
    shortName: 'HEYWOOD DOCKS',
    strokeColor: '#d97706',
    fillColor: 'rgba(217, 119, 6, 0.22)',
    colorTheme: 'border-amber-600 text-amber-500 bg-amber-950/40',
    pointsOfInterest: [
      { name: 'Ponte de San Morro (Cabeceira Leste)', type: 'Ponto Estratégico', description: 'A grande ponte suspensa que conecta o coração cívico à margem oriental da metrópole.', dangerLevel: 'Médio' },
      { name: 'Depósitos Químicos do Canal', type: 'Silos Industriais', description: 'Fileiras de tanques pressurizados guardados por guardas armados com submetralhadoras.', dangerLevel: 'Alto' },
    ],
  },

  // 20. North Heywood [T]
  {
    id: 'north-heywood',
    name: 'North Heywood',
    zoneType: 'Moderate',
    threatLevel: 'Medium',
    threatRatingNumber: 5,
    ncpdResponseTime: '8 a 15 minutos',
    traumaTeamResponse: '5 a 8 minutos',
    dominantFactions: ['Valentinos', 'Comunidade Heywood', 'Pequenas Oficinas'],
    description: 'Subúrbio residencial ao longo da Interestadual 9, habitado por famílias de operários fabris e veteranos das Guerras Corporativas que mantêm suas próprias patrulhas de vizinhança.',
    svgPath: 'M 730 580 L 830 590 L 830 680 L 740 670 Z',
    polygonPoints: '73,58 83,59 83,68 74,67',
    centerCoords: { x: 75.1, y: 64.0 },
    shortName: 'NORTH HEYWOOD',
    strokeColor: '#f59e0b',
    fillColor: 'rgba(245, 158, 11, 0.22)',
    colorTheme: 'border-amber-500 text-amber-400 bg-amber-950/40',
    pointsOfInterest: [
      { name: 'Complexo Habitacional Bonita Way', type: 'Casas Geminadas', description: 'Casas populares de dois andares com churrasqueiras no quintal e carros antigos reformados.', dangerLevel: 'Baixo' },
      { name: 'Viaduto da Interestadual 9', type: 'Entroncamento Rodoviário', description: 'Rota rápida de saída da cidade em direção aos territórios nômades do leste.', dangerLevel: 'Médio' },
    ],
  },

  // 21. Heywood Industrial Zone [U]
  {
    id: 'heywood-industrial',
    name: 'Zona Industrial de Heywood (Heywood Industrial Zone)',
    zoneType: 'Industrial',
    threatLevel: 'High',
    threatRatingNumber: 7,
    ncpdResponseTime: '15 a 30 minutos',
    traumaTeamResponse: '8 a 12 minutos',
    dominantFactions: ['Petrochem', 'Iron Sights', 'ToeCutters'],
    description: 'Cinturão de chaminés expelindo fumaça tóxica amarela, refinarias de CHOOH2 e oficinas mecânicas pesadas operando no ritmo estridente de prensas hidráulicas e soldas.',
    svgPath: 'M 550 640 L 690 640 L 680 760 L 540 750 Z',
    polygonPoints: '55,64 69,64 68,76 54,75',
    centerCoords: { x: 61.6, y: 72.1 },
    shortName: 'HEYWOOD IND',
    strokeColor: '#ea580c',
    fillColor: 'rgba(234, 88, 12, 0.22)',
    colorTheme: 'border-orange-600 text-orange-400 bg-orange-950/40',
    pointsOfInterest: [
      { name: 'Mega-Refinaria Petrochem Morro', type: 'Usina Química', description: 'Torres gigantes de destilação de álcool combustível CHOOH2 protegidas por canhões automáticos.', dangerLevel: 'Alto' },
      { name: 'Pátio de Ferro-Velho e Desmanche Iron Sights', type: 'Covil de Gangue', description: 'Oficina clandestina especializada em blindar picapes e caminhões de combate.', dangerLevel: 'Alto' },
    ],
  },

  // 22. Santo Domingo [V]
  {
    id: 'santo-domingo',
    name: 'Santo Domingo',
    zoneType: 'Industrial',
    threatLevel: 'High',
    threatRatingNumber: 7,
    ncpdResponseTime: '15 a 30 minutos',
    traumaTeamResponse: '8 a 14 minutos (Taxa de risco cobrada)',
    dominantFactions: ['6th Street', 'Continental Brands', 'Armazéns Independentes'],
    description: 'O pulmão fabril do sudeste de Night City. Fileiras infinitas de depósitos alimentares da Continental Brands e usinas de sintetização química misturadas a fortalezas patriotas da 6th Street.',
    svgPath: 'M 630 700 L 780 700 L 780 850 L 640 850 Z',
    polygonPoints: '63,70 78,70 78,85 64,85',
    centerCoords: { x: 70.5, y: 79.2 },
    shortName: 'SANTO DOMINGO',
    strokeColor: '#f97316',
    fillColor: 'rgba(249, 115, 22, 0.22)',
    colorTheme: 'border-orange-500 text-orange-400 bg-orange-950/40',
    pointsOfInterest: [
      { name: 'Complexo OASIS Continental Brands', type: 'Sintetizador de Alimentos', description: 'Fábrica de ração sintética, kibble e alimentos ultra-processados que alimentam a população.', dangerLevel: 'Médio' },
      { name: 'QG Fortaleza da 6th Street', type: 'Bunker de Milícia', description: 'Armazém militarizado com caminhões blindados, canhões de artilharia e veteranos patriotas armados.', dangerLevel: 'Alto' },
    ],
  },

  // 23. Pacifica Playground [W]
  {
    id: 'pacifica-playground',
    name: 'Pacifica Playground (Coastview & Resorts)',
    zoneType: 'Combat Zone',
    threatLevel: 'Extreme',
    threatRatingNumber: 9,
    ncpdResponseTime: 'NENHUMA (Sem serviço policial / Sem jurisdição)',
    traumaTeamResponse: 'Apenas Planos Corporativos com Escolta Pesada de AV-4',
    dominantFactions: ['Voodoo Boys', 'Animais (Animals)', 'Comunidade Independente de Pacifica'],
    description: 'O outrora paradisíaco projeto de resorts e parques de diversão de luxo que faliu após as Guerras Corporativas. Hoje uma zona autônoma governada por hackers do ciberespaço e gangues de gladiadores com esteroides.',
    svgPath: 'M 240 780 L 440 780 L 440 930 L 250 930 L 230 850 Z',
    polygonPoints: '24,78 44,78 44,93 25,93 23,85',
    centerCoords: { x: 34.0, y: 85.8 },
    shortName: 'PACIFICA',
    strokeColor: '#c084fc',
    fillColor: 'rgba(192, 132, 252, 0.25)',
    colorTheme: 'border-purple-500 text-purple-400 bg-purple-950/40',
    pointsOfInterest: [
      { name: 'Batty’s Hotel', type: 'Cripta de Netrunning', description: 'Hotel abandonado transformado em quartel-general de imersão profunda dos Voodoo Boys.', dangerLevel: 'Extremo' },
      { name: 'Grand Imperial Mall (GIM)', type: 'Shopping em Ruínas', description: 'Shopping center monumental onde os Animais montaram ringues de luta e arenas de gladiadores.', dangerLevel: 'Extremo' },
      { name: 'Roda Gigante Abandonada de Coastview', type: 'Monumento', description: 'Silhueta enferrujada à beira da praia poluída visível em toda a costa sul.', dangerLevel: 'Médio' },
    ],
  },

  // 24. Rancho Coronado [X]
  {
    id: 'rancho-coronado',
    name: 'Rancho Coronado',
    zoneType: 'Moderate',
    threatLevel: 'Medium',
    threatRatingNumber: 5,
    ncpdResponseTime: '12 a 25 minutos',
    traumaTeamResponse: '7 a 12 minutos',
    dominantFactions: ['6th Street', 'Trabalhadores Fabris', 'Comunidade Local'],
    description: 'Subúrbio residencial estilo anos 50 com casinhas idênticas pré-fabricadas construídas para abrigar a força de trabalho das fábricas de Santo Domingo e das refinarias de CHOOH2.',
    svgPath: 'M 420 800 L 610 800 L 610 960 L 420 960 Z',
    polygonPoints: '42,80 61,80 61,96 42,96',
    centerCoords: { x: 50.2, y: 91.9 },
    shortName: 'RANCHO CORONADO',
    strokeColor: '#ca8a04',
    fillColor: 'rgba(202, 138, 4, 0.22)',
    colorTheme: 'border-yellow-600 text-yellow-400 bg-yellow-950/40',
    pointsOfInterest: [
      { name: 'Praça Central de Rancho Coronado', type: 'Centro Comunitário', description: 'Coreto de ferro cercado por lanchonetes de milk-shake sintético e veteranos conversando.', dangerLevel: 'Baixo' },
      { name: 'Posto de Controle da 6th Street', type: 'Barreira Armada', description: 'Ponto onde milicianos checam carros que entram para impedir gangues da Combat Zone.', dangerLevel: 'Médio' },
    ],
  },

  // 25. Morro Rock
  {
    id: 'morro-rock',
    name: 'Morro Rock (Porto Espacial & Ilha Offshore)',
    zoneType: 'Corporate',
    threatLevel: 'Extreme',
    threatRatingNumber: 8,
    ncpdResponseTime: 'Força de Segurança Orbital Independente',
    traumaTeamResponse: 'Sub-3 minutos (AV-4 Dedicado)',
    dominantFactions: ['Consórcio Espacial Orbital', 'Militech Defesa Aeroespacial'],
    description: 'A ilha rochosa que domina a baía de Del Coronado, transformada em base de lançamento de foguetes, naves sub-orbitais e transporte de suprimentos para as colônias Highrider.',
    svgPath: 'M 80 340 L 260 340 L 260 430 L 80 430 Z',
    polygonPoints: '8,34 26,34 26,43 8,43',
    centerCoords: { x: 19.5, y: 38.5 },
    shortName: 'MORRO ROCK',
    strokeColor: '#3b82f6',
    fillColor: 'rgba(59, 130, 246, 0.25)',
    colorTheme: 'border-blue-500 text-blue-400 bg-blue-950/40',
    pointsOfInterest: [
      { name: 'Torre de Lançamento Orbital Morro Rock', type: 'Plataforma Espacial', description: 'Gantry gigante de lançamento para cargueiros aeroespaciais e shuttles corporativos.', dangerLevel: 'Extremo / Segurança Máxima' },
      { name: 'Complexo Radar de Rastreamento', type: 'Base de Rádio e Satélites', description: 'Parabólicas monumentais sincronizadas com estações orbitais L-5.', dangerLevel: 'Alto' },
    ],
  },

  // 26. Badlands
  {
    id: 'badlands',
    name: 'Badlands (Deserto Circundante da Califórnia do Norte)',
    zoneType: 'Outskirts',
    threatLevel: 'High',
    threatRatingNumber: 7,
    ncpdResponseTime: 'Polícia Rodoviária Estadual apenas nas rodovias interestaduais',
    traumaTeamResponse: '15 a 30 minutos (AV-4 de Longo Alcance)',
    dominantFactions: ['Família Aldecaldo', 'Wraiths (Nômades Renegados)', 'Red Chrome Legion'],
    description: 'Extensões áridas de terra vermelha, poços de petróleo e tempestades de areia que cercam Night City. Território dominado por comboios nômades armados e comboios da Petrochem.',
    svgPath: 'M 780 100 L 980 100 L 980 950 L 800 950 L 780 500 Z',
    polygonPoints: '78,10 98,10 98,95 80,95 78,50',
    centerCoords: { x: 86.0, y: 48.0 },
    shortName: 'BADLANDS',
    strokeColor: '#b45309',
    fillColor: 'rgba(180, 83, 9, 0.20)',
    colorTheme: 'border-amber-600 text-amber-400 bg-amber-950/40',
    pointsOfInterest: [
      { name: 'Acampamento Principal Aldecaldo', type: 'Cidade de Carretas Móvel', description: 'Centenas de trailers e oficinas sobre rodas protegidos por atiradores de elite e drones solares.', dangerLevel: 'Baixo para amigos dos Nômades' },
      { name: 'Estufas de Proteína Biotechnica', type: 'Complexo Agrícola', description: 'Quilômetros de estufas seladas cultivando algas e trigo transgênico para fabricação de CHOOH2.', dangerLevel: 'Alto para intrusos' },
      { name: 'Cemitério de Máquinas de Red Dirt', type: 'Lixão Automotivo', description: 'Milhares de carcaças de tanques e carros da guerra servindo de refúgio para contrabandistas.', dangerLevel: 'Alto' },
    ],
  },
];

// Compatibility aliases for legacy IDs from previous versions
export const DISTRICT_LEGACY_ALIASES: Record<string, string> = {
  'watson': 'watson-development',
  'corporate-center': 'downtown',
  'westbrook': 'new-westbrook',
  'heywood': 'the-glen',
  'pacifica': 'pacifica-playground',
  'combat-zones': 'old-combat-zone',
};

// Ray-casting algorithm to test if point (xPct, yPct) is inside polygon string "x1,y1 x2,y2..."
export function isPointInPolygon(x: number, y: number, pointsStr: string): boolean {
  const points = pointsStr
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(p => {
      const [px, py] = p.split(',').map(Number);
      return { x: px, y: py };
    });

  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const xi = points[i].x;
    const yi = points[i].y;
    const xj = points[j].x;
    const yj = points[j].y;

    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// Find district by coordinates with ray-casting and distance fallback
export function detectDistrictByCoords(x: number, y: number): MapDistrict {
  for (const d of NIGHT_CITY_DISTRICTS) {
    if (d.polygonPoints && isPointInPolygon(x, y, d.polygonPoints)) {
      return d;
    }
  }
  // Fallback to nearest center
  let closest = NIGHT_CITY_DISTRICTS[0];
  let minDistance = Infinity;
  for (const d of NIGHT_CITY_DISTRICTS) {
    const dist = Math.hypot(d.centerCoords.x - x, d.centerCoords.y - y);
    if (dist < minDistance) {
      minDistance = dist;
      closest = d;
    }
  }
  return closest;
}
