import { GameSystem, NPCTier, NPCSheet, WeaponItem } from '../types/system';
import { GANGS_LIST } from './gangsData';
import { FACTIONS_LIST } from './factionsData';
import { enrichNPCFromCodex } from '../services/codexCatalog';
import { ThreatCalibration, applyThreatCalibration, getPowerLabel, isDefaultCalibration } from '../utils/threatScaling';

export type SquadPresetId =
  | 'ncpd'
  | 'maxtac'
  | 'trauma_team'
  | 'gang_maelstrom'
  | 'gang_valentinos'
  | 'gang_tyger_claws'
  | 'gang_6th_street'
  | 'gang_voodoo_boys'
  | 'gang_generic'
  | 'corp_arasaka'
  | 'corp_militech'
  | 'corp_kang_tao'
  | 'nomad_pack'
  | 'booster_anarchists'
  | 'custom';

export type SquadThreatLevel = 'Baixo' | 'Médio' | 'Alto' | 'Extremo' | 'Pesadelo';

export type SquadTacticalRole =
  | 'leader'
  | 'heavy'
  | 'gunner'
  | 'specialist'
  | 'support'
  | 'sniper'
  | 'mook'
  | 'drone_k9';

export interface SquadMember {
  id: string;
  name: string;
  callsign: string;
  roleTitle: string;
  tacticalRole: SquadTacticalRole;
  tier: NPCTier;
  isLeader: boolean;
  hp: number;
  maxHP: number;
  headSP: number;
  bodySP: number;
  combatNumber: number;
  ref: number;
  dex: number;
  body: number;
  weapons: {
    name: string;
    damage: string;
    rof: number;
    notes?: string;
  }[];
  cyberware: string[];
  gear: string[];
  tacticalOrder: string;
  quoteOrBanter: string;
  sheet: NPCSheet;
}

export interface EnemySquad {
  id: string;
  squadName: string;
  presetId: SquadPresetId;
  factionName: string;
  radioCallsign: string;
  threatLevel: SquadThreatLevel;
  totalMembers: number;
  doctrine: string;
  tacticalDirectives: string[];
  specialAssets: string[];
  surrenderThreshold: string;
  members: SquadMember[];
  aiGenerated?: boolean;
  notes?: string;
}

export interface SquadGenerationOptions {
  presetId: SquadPresetId;
  customFactionName?: string;
  squadSize?: number; // 2 to 10
  threatLevel?: SquadThreatLevel;
  system: GameSystem;
  includeNetrunner?: boolean;
  includeHeavy?: boolean;
  includeSniper?: boolean;
  missionContext?: string;
}

export interface SquadPresetDefinition {
  id: SquadPresetId;
  name: string;
  badge: string;
  category: 'police' | 'trauma' | 'maxtac' | 'gang' | 'corp' | 'nomad' | 'custom';
  defaultFaction: string;
  defaultThreat: SquadThreatLevel;
  defaultSize: number;
  description: string;
  doctrineTemplate: string;
  specialAssetsPool: string[];
  surrenderRules: string;
  callsignPrefixes: string[];
  roleDistribution: SquadTacticalRole[];
  colorTheme: {
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    accent: string;
  };
}

export const SQUAD_PRESET_DEFINITIONS: Record<SquadPresetId, SquadPresetDefinition> = {
  ncpd: {
    id: 'ncpd',
    name: 'Patrulha / Tático NCPD',
    badge: 'NCPD TÁTICO',
    category: 'police',
    defaultFaction: 'NCPD (Night City Police Dept)',
    defaultThreat: 'Médio',
    defaultSize: 4,
    description: 'Oficiais de patrulha da polícia de Night City com escudeiro tático, viatura blindada e suporte de sirene.',
    doctrineTemplate: 'Protocolo 10-99 de Contenção Armada. Estabelecer perímetro, suprimir alvos com fogo coordenado e exigir rendição imediata sob mira.',
    specialAssetsPool: [
      'Viatura Policial Cruiser com sirene e rádio integrado',
      'Escudo Balístico Tático à Prova de Balas (SP 10 adicional)',
      'Granadas de Luz e Som (Flashbang) de Atordoamento',
      'Algemas de Carbono com Trava Neural',
      'Drone de Reconhecimento NCPD Micro-Eye',
    ],
    surrenderRules: 'Se o oficial comandante cair ou 50% da patrulha for abatida, recuam para a viatura e solicitam reforços de código 3.',
    callsignPrefixes: ['Viatura 4-Bravo', 'Patrulha Delta-09', 'Unidade Watson 11', 'Tático Heywood 3'],
    roleDistribution: ['leader', 'heavy', 'gunner', 'gunner', 'drone_k9'],
    colorTheme: {
      badgeBg: 'bg-blue-950/80',
      badgeBorder: 'border-blue-600/60',
      badgeText: 'text-blue-300',
      accent: 'blue',
    },
  },
  maxtac: {
    id: 'maxtac',
    name: 'Max-Tac (Psycho Squad)',
    badge: 'MAX-TAC DIVISÃO 01',
    category: 'maxtac',
    defaultFaction: 'NCPD // Divisão de Força Máxima (Max-Tac)',
    defaultThreat: 'Extremo',
    defaultSize: 4,
    description: 'A força mais letal e temida de Night City. Ciberpsicopatas fardados com armaduras pesadas e licença irrestrita para matar.',
    doctrineTemplate: 'Diretriz Ômega de Eliminação Total. Alvos com implantes cibernéticos hostis são executados sem negociação. Prioridade: letalidade instantânea.',
    specialAssetsPool: [
      'AV-4 Blindado de Intervenção Rápida com Canhão Automático',
      'Granadas de Pulso Eletromagnético (PEM) Militech',
      'Armaduras Subdérmicas e Exoesqueléticas MetalGear Grau Militar',
      'Injetores Automáticos de Fármacos de Combate Sandevistan / Kerenzikov',
      'Cyberdeck Tático com Programa Black ICE Vira-Sangue & Hellhound',
    ],
    surrenderRules: 'Max-Tac NUNCA se rende. Lutam até o último homem ou até a destruição completa de todas as ameaças biológicas ou cibernéticas no setor.',
    callsignPrefixes: ['Ceifador 01', 'Esquadrão Psycho-9', 'Max-Tac Lança-Negra', 'Voo Carniceiro 04'],
    roleDistribution: ['leader', 'heavy', 'gunner', 'specialist'],
    colorTheme: {
      badgeBg: 'bg-indigo-950/80',
      badgeBorder: 'border-indigo-500/70',
      badgeText: 'text-indigo-300',
      accent: 'indigo',
    },
  },
  trauma_team: {
    id: 'trauma_team',
    name: 'Trauma Team International (TTI)',
    badge: 'TTI RESGATE PLATINA',
    category: 'trauma',
    defaultFaction: 'Trauma Team International',
    defaultThreat: 'Alto',
    defaultSize: 4,
    description: 'Esquadrão aeromédico fortemente armado enviado para extrair clientes segurados vivos, custe o que custar.',
    doctrineTemplate: 'Protocolo de Extração Platina. Criar zona de segurança de 10 metros ao redor do cliente. Neutralizar qualquer ameaça viva no caminho com disparos letais imediatos.',
    specialAssetsPool: [
      'AV-4 Médico de Evacuação Rápida com Canhões Gatling',
      'Kit Criogênico de Estabilização de Trauma Imediato',
      'Granadas Térmicas Fumígenas Brancas de Bloqueio Visual',
      'Injetores Pneumáticos Speedheal & Fitas de Hemostasia Cirúrgica',
      'Escudos Balísticos Verdes de Alta Absorção TTI',
    ],
    surrenderRules: 'Não negociam nem se rendem. Caso o cliente seja extraído com sucesso, recuam imediatamente para o AV-4 e decolam sob fogo de cobertura.',
    callsignPrefixes: ['Voo TT-401', 'Resgate Delta-Ouro', 'Med-Evac 12', 'Unidade Cirúrgica 07'],
    roleDistribution: ['leader', 'support', 'heavy', 'gunner'],
    colorTheme: {
      badgeBg: 'bg-emerald-950/80',
      badgeBorder: 'border-emerald-500/70',
      badgeText: 'text-emerald-300',
      accent: 'emerald',
    },
  },
  gang_maelstrom: {
    id: 'gang_maelstrom',
    name: 'Bando Ciberpsicótico Maelstrom',
    badge: 'MAELSTROM CYBER-PACK',
    category: 'gang',
    defaultFaction: 'Maelstrom',
    defaultThreat: 'Alto',
    defaultSize: 5,
    description: 'Loucos ciber-aumentados cobertos de cromo tosco, óticos multifocais vermelhos e armas automáticas brutais.',
    doctrineTemplate: 'Carnificina Caótica Sem Recuo. Injetam Black Lace nas veias, avançam aos berros atirando com escopetas e katanas aquecidas.',
    specialAssetsPool: [
      'Injetores de Droga de Combate Black Lace (Imunidade a Dor)',
      'Escopetas Serradas Automáticas com Cartuchos Incendiários',
      'Lâminas Mantis e Garras Ripper nos membros superiores',
      'Coquetéis Molotov Químicos de Chumbo Líquido',
      'Implantes Óticos Pentagrama Vermelho com Visão Térmica',
    ],
    surrenderRules: 'Fanáticos e dessensibilizados. Só recuam se sofrerem dano cerebral massivo ou se o tenente líder explodir em pedaços.',
    callsignPrefixes: ['Célula Matadouro 6', 'Bando Olho de Sangue', 'Gangue Totentanz Norte'],
    roleDistribution: ['leader', 'heavy', 'mook', 'mook', 'specialist'],
    colorTheme: {
      badgeBg: 'bg-red-950/80',
      badgeBorder: 'border-red-600/70',
      badgeText: 'text-red-300',
      accent: 'red',
    },
  },
  gang_valentinos: {
    id: 'gang_valentinos',
    name: 'Quadrilha Los Valentinos',
    badge: 'VALENTINOS HERMANDAD',
    category: 'gang',
    defaultFaction: 'Valentinos',
    defaultThreat: 'Médio',
    defaultSize: 5,
    description: 'Guerreiros de honra do Heywood com armas cromadas e douradas, tatuagens de Santa Muerte e lealdade inabalável.',
    doctrineTemplate: 'Emboscada Urbana com Cobertura Cruzada. Atiram em dupla, protegem os irmãos feridos e canalizam o tiroteio para becos fechados.',
    specialAssetsPool: [
      'Pistolas Pesadas Banhadas a Ouro e Gravações de Santa Muerte',
      'Lowriders Turbinados com Blindagem nas Portas',
      'Submetralhadoras Duplas de Alta Cadência (ROF 2)',
      'Machetes de Aço Monofilamentar com Punho de Marfim',
    ],
    surrenderRules: 'Se mais de 60% tombarem, recuam honrando os mortos jurando vingança de sangue perpétua contra os mercenários.',
    callsignPrefixes: ['La Raza 04', 'Irmãos de Vista del Rey', 'Bando Santa Muerte'],
    roleDistribution: ['leader', 'gunner', 'gunner', 'mook', 'sniper'],
    colorTheme: {
      badgeBg: 'bg-amber-950/80',
      badgeBorder: 'border-amber-600/70',
      badgeText: 'text-amber-300',
      accent: 'amber',
    },
  },
  gang_tyger_claws: {
    id: 'gang_tyger_claws',
    name: 'Esquadrão Tyger Claws (Katanas & Motos)',
    badge: 'TYGER CLAWS GANG',
    category: 'gang',
    defaultFaction: 'Tyger Claws',
    defaultThreat: 'Médio',
    defaultSize: 4,
    description: 'Yakuza de Japantown motorizados em motos velozes, armados com Smartguns Kang Tao e Katanas térmicas.',
    doctrineTemplate: 'Golpe Relâmpago e Fuga. Aproximação veloz com motos, saraivada de tiros inteligentes e combate corpo-a-corpo letal com katanas.',
    specialAssetsPool: [
      'Motos de Alta Cilindrada Yaiba Kusanagi CT-3X',
      'Katanas Térmicas de Corte Molecular',
      'Tatuagens Subdérmicas com Inibidores de Dor e Luzes Neon',
      'Smartguns Leves com Travamento Automático de Alvo',
    ],
    surrenderRules: 'Seguem ordens rígidas do Oyabun. Fogem caso a vantagem numérica seja anulada por armas pesadas.',
    callsignPrefixes: ['Garras de Japantown', 'Motos Kusanagi 3', 'Bando Tora'],
    roleDistribution: ['leader', 'gunner', 'gunner', 'specialist'],
    colorTheme: {
      badgeBg: 'bg-rose-950/80',
      badgeBorder: 'border-rose-600/70',
      badgeText: 'text-rose-300',
      accent: 'rose',
    },
  },
  gang_6th_street: {
    id: 'gang_6th_street',
    name: 'Milícia Patriótica 6th Street',
    badge: '6TH STREET VETERANOS',
    category: 'gang',
    defaultFaction: '6th Street',
    defaultThreat: 'Médio',
    defaultSize: 5,
    description: 'Veteranos de guerra da 4ª Guerra Corporativa armados com equipamento militar excedente, fuzis de assalto e bandeiras desbotadas.',
    doctrineTemplate: 'Formação Militar de Trincheira. Fogo de supressão constante por fuzis enquanto o atirador de elite faz disparos na cabeça.',
    specialAssetsPool: [
      'Caminhonete Utilitária com Metralhadora Montada na Caçamba',
      'Fuzis de Assalto Militech Ronin Excedentes de Guerra',
      'Colete Balístico Militar SP 12 Camuflado',
      'Granadas de Fragmentação e Óculos Balísticos',
    ],
    surrenderRules: 'Recuam em ordem militar caso fiquem sem munição pesada ou o atirador de elite seja neutralizado.',
    callsignPrefixes: ['Pelotão Santo Domingo 2', 'Veteranos da 4ª Guerra', 'Companhia Bravo 6'],
    roleDistribution: ['leader', 'sniper', 'gunner', 'gunner', 'heavy'],
    colorTheme: {
      badgeBg: 'bg-orange-950/80',
      badgeBorder: 'border-orange-600/70',
      badgeText: 'text-orange-300',
      accent: 'orange',
    },
  },
  gang_voodoo_boys: {
    id: 'gang_voodoo_boys',
    name: 'Célula Netrunner Voodoo Boys',
    badge: 'VOODOO BOYS NET-CELL',
    category: 'gang',
    defaultFaction: 'Voodoo Boys',
    defaultThreat: 'Alto',
    defaultSize: 4,
    description: 'Netrunners enigmáticos de Pacifica especialistas em quebra de ciberimplantes, vírus de neurotoxina e subversão de hardware.',
    doctrineTemplate: 'Guerra Cibernética em Rede. Enquanto os guardas de corpo dão cobertura, os netrunners fritam a interface neural e ciberware dos alvos.',
    specialAssetsPool: [
      'Cyberdecks Personalizados com Programas de Superaquecimento Cerebral',
      'Fitas de Congelamento de Ciberware e Inibidores de Sinal',
      'Submetralhadoras Silenciadas e Dardos Neurotóxicos',
      'Drones Terrestres Hackeados com Armas de Choque',
    ],
    surrenderRules: 'Desconectam e somem nas ruínas de Pacifica assim que os dados forem extraídos ou as defesas externas caírem.',
    callsignPrefixes: ['Célula Bataclan', 'Mestres de Pacifica', 'Nó de Rede Voodoo 9'],
    roleDistribution: ['leader', 'specialist', 'specialist', 'heavy'],
    colorTheme: {
      badgeBg: 'bg-violet-950/80',
      badgeBorder: 'border-violet-600/70',
      badgeText: 'text-violet-300',
      accent: 'violet',
    },
  },
  gang_generic: {
    id: 'gang_generic',
    name: 'Quadrilha de Rua / Boostergang',
    badge: 'QUADRILHA DE RUA',
    category: 'gang',
    defaultFaction: 'Gangue de Rua Local',
    defaultThreat: 'Baixo',
    defaultSize: 5,
    description: 'Bando violento de punks de rua, drogados com synthcoke e armados com pistolas baratas e facas de combate.',
    doctrineTemplate: 'Avanço Desesperado em Bando. Gritam intimidações, atiram sem mirar e tentam sobrecarregar a vítima pelo número de corpos.',
    specialAssetsPool: [
      'Doses de Synthcoke e E-Pills para coragem imediata',
      'Pistolas Leves e Facas de Trincheira Enferrujadas',
      'Jaquetas de Couro com Chapas de Metal Remendadas SP 7',
      'Tacos de Beisebol com Pregos e Correntes de Aço',
    ],
    surrenderRules: 'Basta um tiro bem colocado no líder ou uma exibição de poder de fogo pesado para os covardes correrem pelo beco.',
    callsignPrefixes: ['Bando do Beco', 'Punks de Night City', 'Aloprados da Zona'],
    roleDistribution: ['leader', 'mook', 'mook', 'mook', 'mook'],
    colorTheme: {
      badgeBg: 'bg-zinc-900',
      badgeBorder: 'border-zinc-700',
      badgeText: 'text-zinc-300',
      accent: 'zinc',
    },
  },
  corp_arasaka: {
    id: 'corp_arasaka',
    name: 'Esquadrão Tático Arasaka Black Ops',
    badge: 'ARASAKA BLACK OPS',
    category: 'corp',
    defaultFaction: 'Arasaka Corporation',
    defaultThreat: 'Extremo',
    defaultSize: 4,
    description: 'Segurança de elite corporativa japonesa com uniformes pretos lacrados, Smartguns Arasaka e disciplina militar implacável.',
    doctrineTemplate: 'Execução Cirúrgica e Sem Testemunhas. Supressão silenciosa, avanço por quadrantes e aniquilação metódica de intrusos corporativos.',
    specialAssetsPool: [
      'Smart Rifles Arasaka Nowaki com Rastreamento Balístico',
      'Uniformes Balísticos Lacrados Arasaka com Capacete Fechado SP 13',
      'Camuflagem Óptica Termo-Visual (Invisibilidade Parcial)',
      'Granadas de Gás Asfixiante Nervoso Neuro-Paralisante',
      'Agente Netrunner Corporativo com Software Exclusivo Arasaka',
    ],
    surrenderRules: 'Suicídio com cápsula de cianeto ou acionamento de auto-destruição de ciberimplantes antes de serem capturados ou interrogados.',
    callsignPrefixes: ['Equipe Sombra 01', 'Esquadrão Corvo Arasaka', 'Tático Torre 8'],
    roleDistribution: ['leader', 'heavy', 'gunner', 'specialist'],
    colorTheme: {
      badgeBg: 'bg-red-950/90',
      badgeBorder: 'border-red-500/80',
      badgeText: 'text-red-200',
      accent: 'red',
    },
  },
  corp_militech: {
    id: 'corp_militech',
    name: 'Tropa de Choque Militech Arms',
    badge: 'MILITECH STRIKE TEAM',
    category: 'corp',
    defaultFaction: 'Militech',
    defaultThreat: 'Alto',
    defaultSize: 5,
    description: 'Soldados mercenários contratados pela maior corporação bélica do mundo, com armas pesadas de alto calibre e blindagens grossas.',
    doctrineTemplate: 'Superioridade de Fogo Maciço. Destruição do terreno inimigo com granadas e metralhadoras até não restar cobertura de pé.',
    specialAssetsPool: [
      'Fuzis de Assalto Militech Ronin & Escopetas Crusher',
      'Colete Balístico Reforçado de Infantaria SP 13',
      'Lança-Granadas de Apoio de 40mm',
      'Exoesqueleto de Suporte Físico BODY 10',
    ],
    surrenderRules: 'Profissionais pragmáticos. Negociam trégua ou retirada se a recompensa da missão não compensar o custo das baixas.',
    callsignPrefixes: ['Striker Militech 4', 'Contratados Cão de Guerra', 'Pelotão Alpha-Mil'],
    roleDistribution: ['leader', 'heavy', 'gunner', 'gunner', 'support'],
    colorTheme: {
      badgeBg: 'bg-cyan-950/80',
      badgeBorder: 'border-cyan-600/70',
      badgeText: 'text-cyan-300',
      accent: 'cyan',
    },
  },
  corp_kang_tao: {
    id: 'corp_kang_tao',
    name: 'Segurança Especial Kang Tao',
    badge: 'KANG TAO SMART-FORCE',
    category: 'corp',
    defaultFaction: 'Kang Tao',
    defaultThreat: 'Alto',
    defaultSize: 4,
    description: 'Especialistas chineses em armamento inteligente, munições auto-guiadas que curvam esquinas e capacetes HUD conectados.',
    doctrineTemplate: 'Triangulação por Mira Inteligente. Disparam de trás de coberturas seguras enquanto os projéteis teleguiados fazem curvas no ar.',
    specialAssetsPool: [
      'Smart Pistolas G-58 Dian & Rifles L-69 Zhuo',
      'Capacetes HUD com Interface Neural de Alvos Múltiplos',
      'Granadas Sensor de Calor e Radares Portáteis de Parede',
    ],
    surrenderRules: 'Seguem protocolos de contingência corporativa e acionam suporte remoto de drones caso encurralados.',
    callsignPrefixes: ['Dragão de Ferro 3', 'Esquadrão Zhuo 09', 'Tático Kang Tao'],
    roleDistribution: ['leader', 'gunner', 'gunner', 'specialist'],
    colorTheme: {
      badgeBg: 'bg-emerald-950/80',
      badgeBorder: 'border-emerald-600/70',
      badgeText: 'text-emerald-300',
      accent: 'emerald',
    },
  },
  nomad_pack: {
    id: 'nomad_pack',
    name: 'Bando Nômade das Badlands',
    badge: 'BADLANDS NOMAD PACK',
    category: 'nomad',
    defaultFaction: 'Aldecaldos (ou Nômades das Badlands)',
    defaultThreat: 'Médio',
    defaultSize: 4,
    description: 'Sobreviventes do deserto unidos por laços familiares, atiradores exímios em veículos todo-terreno customizados.',
    doctrineTemplate: 'Manobra de Cerco e Flanco Rápido. Mantêm os oponentes à distância com fuzis de longo alcance enquanto os batedores cortam rotas de fuga.',
    specialAssetsPool: [
      'Veículo Buggy Todo-Terreno Armado com Blindagem de Sucata',
      'Rifles de Precisão de Longo Alcance com Miras Térmicas',
      'Granadas de Areia Quimicamente Abrasivas',
      'Rádios de Banda Curta Codificados por Dialeto Nômade',
    ],
    surrenderRules: 'Família vem em primeiro lugar. Jamais abandonam os próprios parentes feridos no asfalto quente.',
    callsignPrefixes: ['Bando Aldecaldo Sul', 'Matilha do Asfalto', 'Batedores do Deserto'],
    roleDistribution: ['leader', 'sniper', 'gunner', 'support'],
    colorTheme: {
      badgeBg: 'bg-amber-950/80',
      badgeBorder: 'border-amber-700/70',
      badgeText: 'text-amber-300',
      accent: 'amber',
    },
  },
  booster_anarchists: {
    id: 'booster_anarchists',
    name: 'Culto Anarquista Ciberpunk',
    badge: 'CULTISTAS ANARQUISTAS',
    category: 'gang',
    defaultFaction: 'Anarquistas / Ciber-Fanáticos',
    defaultThreat: 'Médio',
    defaultSize: 5,
    description: 'Extremistas que repudiam corporações e a lei, usando bombas caseiras, coquetéis incendiários e armas modificadas.',
    doctrineTemplate: 'Guerra de Guerrilha Desordenada. Detonação de explosivos improvisados para desestabilizar o inimigo seguido de investida suicida.',
    specialAssetsPool: [
      'Explosivos Caseiros C-4 Remendados com Celulares Velhos',
      'Coquetéis Molotov de Fósforo Branco',
      'Machetes Eletrificados com Baterias de Carro',
    ],
    surrenderRules: 'Gritam frases anarquistas e preferem ativar granadas nas próprias mãos a se renderem a seguranças corporativos.',
    callsignPrefixes: ['Célula Caos Zero', 'Terroristas do Subsolo', 'Irmãos da Chama'],
    roleDistribution: ['leader', 'heavy', 'mook', 'mook', 'specialist'],
    colorTheme: {
      badgeBg: 'bg-red-950/90',
      badgeBorder: 'border-orange-600/70',
      badgeText: 'text-orange-300',
      accent: 'orange',
    },
  },
  custom: {
    id: 'custom',
    name: 'Tropa / Quadrilha Personalizada ("Qualquer Coisa")',
    badge: 'TROPA CUSTOMIZADA',
    category: 'custom',
    defaultFaction: 'Mercenários / Força Hostil',
    defaultThreat: 'Médio',
    defaultSize: 4,
    description: 'Crie qualquer agrupamento de inimigos: milícia de bairro, assassinos de aluguel, equipe de assalto a banco ou cultistas.',
    doctrineTemplate: 'Diretriz Tática Adaptativa. Formação mista com linha de fogo e especialistas conforme definido pelo Mestre da sessão.',
    specialAssetsPool: [
      'Veículo Blindado de Transporte',
      'Granadas Táticas Mistas (Fumaça e Luz)',
      'Injetores Médicos de Emergência',
      'Rádios de Frequência Militar Criptografada',
    ],
    surrenderRules: 'Rendem-se conforme o bom senso do Mestre e o nível de perigo da cena.',
    callsignPrefixes: ['Esquadrão Custom-01', 'Tropa Bravo', 'Bando da Rua'],
    roleDistribution: ['leader', 'heavy', 'gunner', 'specialist'],
    colorTheme: {
      badgeBg: 'bg-purple-950/80',
      badgeBorder: 'border-purple-600/70',
      badgeText: 'text-purple-300',
      accent: 'purple',
    },
  },
};

const SQUAD_FIRST_NAMES = [
  'Viktor', 'Jax', 'Raven', 'Marcus', 'Lena', 'Elena', 'Kael', 'Dante', 'T-Bug', 'Rocco',
  'Slick', 'Nyx', 'Brick', 'Zero', 'Crash', 'Malik', 'Hana', 'Blaze', 'Cipher', 'Viper',
  'Spike', 'Ghost', 'Kowalski', 'Reyes', 'Tanner', 'Vance', 'Cross', 'Silver', 'Mendez', 'Steel'
];

const SQUAD_NICKNAMES: Record<SquadTacticalRole, string[]> = {
  leader: ['Sargento', 'Comandante', 'Chefe', 'Tenente', 'Capitão', 'Ás', 'Patrão', 'Mestre', 'Zero-Um', 'Alpha'],
  heavy: ['Marreta', 'Blindado', 'Tanque', 'Rochedo', 'Gárgula', 'Trincheira', 'Colosso', 'Quebra-Ossos', 'Big-Dog', 'Muralha'],
  gunner: ['Gatilho', 'Fuzil', 'Blitz', 'Pólvora', 'Chumbo', 'Vapor', 'Rajada', 'Balas', 'Cão-Guia', 'Sentinela'],
  specialist: ['Wire', 'Bug', 'Código', 'Zero-Bit', 'Sombra', 'Neural', 'Pixel', 'Sonda', 'Antena', 'Cripto'],
  support: ['Bisturi', 'Doc', 'Soro', 'Curativo', 'Faixa', 'Chave-Inglesa', 'Fita-Térmica', 'Kit', 'Agulha', 'Oxigênio'],
  sniper: ['Olho-de-Águia', 'Silêncio', 'Mira', 'Vento', 'Eco', 'Distância', 'Telescópio', 'Fantasma', 'Ponto-Cego', 'Apex'],
  mook: ['Recruta', 'Novato', 'Bucha', 'Soldado', 'Rua', 'Carne', 'Sombra', 'Número-Dois', 'Garoto', 'Pivete'],
  drone_k9: ['K-9 Fang', 'Cão-Ciber Rex', 'Drone Micro-Eye', 'Rotordog', 'Sentinela-4', 'Vigilante-K', 'Mordida-Pesada'],
};

const SQUAD_LAST_NAMES = [
  'Vance', 'Kowalski', 'Silver', 'Cross', 'Tanaka', 'Mendez', 'Steel', 'Frost', 'Mercer', 'Chen',
  'Black', 'Reyes', 'Novak', 'Winter', 'Kane', 'Wolf', 'Stone', 'Sato', 'Moreno', 'Karpov'
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function calculateRoleStats(
  role: SquadTacticalRole,
  threat: SquadThreatLevel,
  isLeader: boolean,
  system: GameSystem
): {
  tier: NPCTier;
  roleTitle: string;
  hp: number;
  headSP: number;
  bodySP: number;
  combatNumber: number;
  ref: number;
  dex: number;
  body: number;
  will: number;
  move: number;
  weapons: { name: string; damage: string; rof: number; notes?: string }[];
  cyberware: string[];
  gear: string[];
  tacticalOrder: string;
} {
  // Threat multipliers
  const threatBonusHP = threat === 'Pesadelo' ? 25 : threat === 'Extremo' ? 15 : threat === 'Alto' ? 10 : threat === 'Médio' ? 5 : 0;
  const threatBonusSP = threat === 'Pesadelo' ? 4 : threat === 'Extremo' ? 3 : threat === 'Alto' ? 2 : threat === 'Médio' ? 0 : -2;
  const threatBonusCombat = threat === 'Pesadelo' ? 3 : threat === 'Extremo' ? 2 : threat === 'Alto' ? 1 : threat === 'Médio' ? 0 : -1;

  if (isLeader || role === 'leader') {
    return {
      tier: threat === 'Pesadelo' ? 'boss' : threat === 'Extremo' ? 'miniboss' : 'lieutenant',
      roleTitle: 'Oficial Comandante / Líder da Quadrilha',
      hp: Math.max(30, 45 + threatBonusHP),
      headSP: Math.min(15, Math.max(11, 12 + threatBonusSP)),
      bodySP: Math.min(15, Math.max(11, 12 + threatBonusSP)),
      combatNumber: Math.min(17, Math.max(12, 14 + threatBonusCombat)),
      ref: 8,
      dex: 7,
      body: 8,
      will: 7,
      move: 6,
      weapons: [
        { name: 'Fuzil de Assalto Tático Militech (5d6)', damage: '5d6', rof: 1, notes: 'Munição Armor Piercing' },
        { name: 'Pistola Pesada Smart (3d6)', damage: '3d6', rof: 2, notes: 'Smartlink integrado (+1 ataque)' },
      ],
      cyberware: ['Interface Neural', 'Smartgun Link', 'Processador Kerenzikov (+2 Iniciativa)', 'Ciberolho com Visão Noturna'],
      gear: ['Rádio Tático Criptografado', 'Colete Kevlar Reforçado', '2x Injetores Speedheal', 'Binóculo Térmico'],
      tacticalOrder: 'Coordena o fogo do esquadrão, dá ordens de flanqueamento e lidera o avanço tático.',
    };
  }

  if (role === 'heavy') {
    return {
      tier: threat === 'Pesadelo' || threat === 'Extremo' ? 'miniboss' : 'lieutenant',
      roleTitle: 'Operador Pesado / Escudeiro Balístico',
      hp: Math.max(35, 50 + threatBonusHP),
      headSP: Math.min(15, Math.max(12, 13 + threatBonusSP)),
      bodySP: Math.min(15, Math.max(12, 14 + threatBonusSP)),
      combatNumber: Math.min(16, Math.max(12, 13 + threatBonusCombat)),
      ref: 7,
      dex: 6,
      body: 10,
      will: 6,
      move: 5,
      weapons: [
        { name: 'Escopeta Automática Pesada Crusher (5d6)', damage: '5d6', rof: 1, notes: 'Efeito Cone de Dispersão' },
        { name: 'Escudo Balístico Móvel Tático', damage: '1d6', rof: 1, notes: 'Bloqueia 10 de dano até quebrar' },
        { name: 'Soco Inglês Ciberware Big Knuckles (2d6)', damage: '2d6', rof: 2, notes: 'Dano corporal' },
      ],
      cyberware: ['Armadura Subdérmica (SP 4 adicional)', 'Exoesqueleto Muscular (+2 BODY)', 'Ciberbraço de Titânio'],
      gear: ['Escudo Balístico Tático', 'Armadura de Placas Pesadas MetalGear', 'Granadas de Fumaça'],
      tacticalOrder: 'Avança na frente formando cobertura física móvel, atraindo disparos e suprimindo em curta distância.',
    };
  }

  if (role === 'specialist') {
    return {
      tier: 'lieutenant',
      roleTitle: 'Especialista Tático / Netrunner de Combate',
      hp: Math.max(25, 35 + threatBonusHP),
      headSP: Math.min(13, Math.max(7, 11 + threatBonusSP)),
      bodySP: Math.min(13, Math.max(7, 11 + threatBonusSP)),
      combatNumber: Math.min(15, Math.max(11, 13 + threatBonusCombat)),
      ref: 7,
      dex: 6,
      body: 5,
      will: 8,
      move: 6,
      weapons: [
        { name: 'Submetralhadora Compacta (2d6)', damage: '2d6', rof: 2, notes: 'Fácil ocultação' },
        { name: 'Ataque de Cyberdeck Black ICE (Vira-Sangue)', damage: '3d6 direto na cabeça', rof: 1, notes: 'Invasão rápida de ciberimplantes' },
      ],
      cyberware: ['Interface Neural', 'Cyberdeck Militar Sony C-90', 'Injetor Neural de Fármacos', 'Plugues de Interface'],
      gear: ['Cyberdeck Portátil', 'Cabos de Fibra Óptica', 'Emissor de Ruído Eletrônico', 'Fita de Bloqueio Neural'],
      tacticalOrder: 'Fica atrás da cobertura buscando invadir o ciberware dos alvos, desativar armas inteligentes e desligar óticos.',
    };
  }

  if (role === 'support') {
    return {
      tier: 'lieutenant',
      roleTitle: 'Médico de Combate / Técnico de Evacuação',
      hp: Math.max(30, 40 + threatBonusHP),
      headSP: Math.min(14, Math.max(9, 11 + threatBonusSP)),
      bodySP: Math.min(14, Math.max(9, 12 + threatBonusSP)),
      combatNumber: Math.min(15, Math.max(11, 13 + threatBonusCombat)),
      ref: 7,
      dex: 7,
      body: 6,
      will: 7,
      move: 7,
      weapons: [
        { name: 'Pistola Pesada Automática (3d6)', damage: '3d6', rof: 2, notes: 'Mira Laser (+1 ataque)' },
        { name: 'Injetor de Sedativo / Neuro-Paralisante', damage: 'Resistir DV 15 ou Paralisado', rof: 1, notes: 'Uso médico defensivo' },
      ],
      cyberware: ['Ciberolho com Scanner Biológico de Vitais', 'Ferramenta Tech no Dedo', 'Interface de Dados Médicos'],
      gear: ['Kit de Trauma Imediato Speedheal', 'Desfibrilador Portátil', 'Fitas Hemostáticas', 'Granadas de Fumaça Branca'],
      tacticalOrder: 'Permanece na retaguarda, aplica primeiros socorros imediatos em aliados caídos e mantém rota de fuga segura.',
    };
  }

  if (role === 'sniper') {
    return {
      tier: 'lieutenant',
      roleTitle: 'Franco-Atirador / Atirador de Precisão',
      hp: Math.max(25, 35 + threatBonusHP),
      headSP: Math.min(13, Math.max(7, 10 + threatBonusSP)),
      bodySP: Math.min(13, Math.max(7, 11 + threatBonusSP)),
      combatNumber: Math.min(16, Math.max(13, 14 + threatBonusCombat)),
      ref: 8,
      dex: 7,
      body: 6,
      will: 7,
      move: 6,
      weapons: [
        { name: 'Rifle de Precisão Sniper (5d6)', damage: '5d6', rof: 1, notes: 'Alcance Extremo (DV 15 até 100m), Mira Térmica' },
        { name: 'Pistola Leve Oculta (2d6)', damage: '2d6', rof: 2, notes: 'Arma de backup' },
      ],
      cyberware: ['Ciberolho com Zoom Ótico 8x e Telêmetro', 'Compensador de Recuo no Braço'],
      gear: ['Capa de Camuflagem Termo-Óptica', 'Tripé de Apoio Balístico', 'Rádio de Frequência Silenciosa'],
      tacticalOrder: 'Posiciona-se em terreno elevado ou ponto cego, disparando nos jogadores mais perigosos ou nos seus curandeiros.',
    };
  }

  if (role === 'drone_k9') {
    return {
      tier: 'mook',
      roleTitle: 'Unidade Canina Cibernética / Drone Tático',
      hp: Math.max(20, 25 + threatBonusHP),
      headSP: 7 + threatBonusSP,
      bodySP: 7 + threatBonusSP,
      combatNumber: Math.min(14, Math.max(10, 12 + threatBonusCombat)),
      ref: 8,
      dex: 8,
      body: 6,
      will: 5,
      move: 8,
      weapons: [
        { name: 'Mordida Ciber-Mandíbula de Titânio (3d6)', damage: '3d6', rof: 1, notes: 'Abre ferimento crítico no 6' },
        { name: 'Derrubar & Prender no Chão', damage: 'Teste Contestado DEX/BODY', rof: 1, notes: 'Alvo fica Caído (-2)' },
      ],
      cyberware: ['Cibermandíbula de Aço', 'Sensor Olfativo Químico Aumentado', 'Patas Reforçadas (+2 MOVE)'],
      gear: ['Colete Balístico Canino K-9 SP 7', 'Coleira com Rastreador GPS e Câmera'],
      tacticalOrder: 'Avança em velocidade máxima, salta no alvo isolado para derrubá-lo no chão e mantê-lo imobilizado.',
    };
  }

  // Default: Gunner or Mook
  const isMook = role === 'mook';
  return {
    tier: isMook ? 'mook' : 'lieutenant',
    roleTitle: isMook ? 'Soldado de Rua / Bucha de Canhão' : 'Fuzileiro de Linha / Operador Tático',
    hp: Math.max(20, (isMook ? 25 : 35) + threatBonusHP),
    headSP: Math.min(13, Math.max(7, (isMook ? 7 : 11) + threatBonusSP)),
    bodySP: Math.min(13, Math.max(7, (isMook ? 7 : 11) + threatBonusSP)),
    combatNumber: Math.min(15, Math.max(10, (isMook ? 11 : 13) + threatBonusCombat)),
    ref: isMook ? 6 : 7,
    dex: 6,
    body: 6,
    will: 5,
    move: 6,
    weapons: isMook
      ? [
          { name: 'Pistola Pesada (3d6)', damage: '3d6', rof: 2 },
          { name: 'Faca de Combate (1d6)', damage: '1d6', rof: 2 },
        ]
      : [
          { name: 'Fuzil de Assalto ou Espingarda (5d6)', damage: '5d6', rof: 1 },
          { name: 'Submetralhadora Tática (2d6)', damage: '2d6', rof: 2 },
        ],
    cyberware: isMook ? ['Interface Neural Básica'] : ['Ciberolho com Visor HUD', 'Subdermal Pocket'],
    gear: ['Colete de Kevlar de Rua', '2x Carregadores Extras', 'Lanterna Tática'],
    tacticalOrder: 'Mantém fogo de cobertura contínuo enquanto se move de abrigo em abrigo.',
  };
}

/**
 * Gerador de Tropas / Quadrilhas Offline (Canônico e Rápido)
 */
export function generateEnemySquadOffline(options: SquadGenerationOptions): EnemySquad {
  const presetDef = SQUAD_PRESET_DEFINITIONS[options.presetId] || SQUAD_PRESET_DEFINITIONS.ncpd;
  const factionName = options.customFactionName?.trim() || presetDef.defaultFaction;
  const threat = options.threatLevel || presetDef.defaultThreat;
  const targetSize = Math.max(2, Math.min(16, options.squadSize || presetDef.defaultSize));

  const radioCallsign = `${getRandomItem(presetDef.callsignPrefixes)} #${Math.floor(Math.random() * 89 + 10)}`;

  // Determine roles for squad members
  const roles: SquadTacticalRole[] = [];
  // 1st member is always the Leader
  roles.push('leader');

  // Fill up roles from preset or specific inclusions
  const pool = [...presetDef.roleDistribution.slice(1)];
  if (options.includeHeavy && !pool.includes('heavy')) pool.unshift('heavy');
  if (options.includeNetrunner && !pool.includes('specialist')) pool.push('specialist');
  if (options.includeSniper && !pool.includes('sniper')) pool.push('sniper');

  while (roles.length < targetSize) {
    if (pool.length > 0) {
      roles.push(pool.shift()!);
    } else {
      // Alternate between gunner and mook
      roles.push(roles.length % 2 === 0 ? 'gunner' : 'mook');
    }
  }

  // Create members
  const rawMembers: SquadMember[] = roles.map((role, idx) => {
    const isLeader = idx === 0;
    const stats = calculateRoleStats(role, threat, isLeader, options.system);
    const firstName = getRandomItem(SQUAD_FIRST_NAMES);
    const nickname = getRandomItem(SQUAD_NICKNAMES[role] || SQUAD_NICKNAMES.gunner);
    const lastName = getRandomItem(SQUAD_LAST_NAMES);
    const fullName = `${firstName} "${nickname}" ${lastName}`;
    const callsign = `${nickname.toUpperCase()}-${idx + 1}`;

    const memberWeapons: WeaponItem[] = stats.weapons.map(w => ({
      name: w.name,
      category: 'Armamento Tático',
      damage: w.damage,
      rof: w.rof,
      system: options.system,
      notes: w.notes,
    }));

    const sheet: NPCSheet = {
      id: `squad-npc-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
      name: fullName,
      faction: factionName,
      tier: stats.tier,
      system: options.system,
      role: stats.roleTitle,
      description: `${stats.roleTitle} operando pela tropa "${factionName}". Indicativo de rádio: ${callsign}.`,
      statsRED: {
        INT: 6,
        REF: stats.ref,
        DEX: stats.dex,
        TECH: 5,
        COOL: 6,
        WILL: stats.will,
        LUCK: 0,
        MOVE: stats.move,
        BODY: stats.body,
        EMP: 4,
        HP: stats.hp,
        seriouslyWounded: Math.ceil(stats.hp / 2),
        deathSave: stats.body,
        combatNumber: stats.combatNumber,
        headSP: stats.headSP,
        bodySP: stats.bodySP,
      },
      skills: {
        'Combate': stats.combatNumber,
        'Percepção': stats.combatNumber - 2,
        'Atletismo': stats.combatNumber - 3,
        'Furtividade': stats.combatNumber - 3,
      },
      weapons: memberWeapons,
      cyberware: stats.cyberware,
      gear: stats.gear,
      tactics: stats.tacticalOrder,
      appearance: `Uniforme tático característico de ${factionName}, postura de prontidão armada com ${stats.weapons[0].name}.`,
      surrenderTrigger: presetDef.surrenderRules,
    };

    const quoteOptions = [
      `"Alvo confirmado no setor! Fogo à vontade!"`,
      `"Cobrindo flanco direito! Não deixem eles saírem do beco!"`,
      `"Recarregando! Segurem o avanço deles por três segundos!"`,
      `"Aqui é ${callsign}, preciso de supressão imediata naquela janela!"`,
      `"Eles sangram como qualquer um. Derrubem todos!"`,
    ];

    return {
      id: `member-${idx}-${Date.now()}`,
      name: fullName,
      callsign,
      roleTitle: stats.roleTitle,
      tacticalRole: role,
      tier: stats.tier,
      isLeader,
      hp: stats.hp,
      maxHP: stats.hp,
      headSP: stats.headSP,
      bodySP: stats.bodySP,
      combatNumber: stats.combatNumber,
      ref: stats.ref,
      dex: stats.dex,
      body: stats.body,
      weapons: stats.weapons,
      cyberware: stats.cyberware,
      gear: stats.gear,
      tacticalOrder: stats.tacticalOrder,
      quoteOrBanter: getRandomItem(quoteOptions),
      sheet,
    };
  });

  const members: SquadMember[] = rawMembers.map(codexifyMember);

  const specialAssetsCount = Math.min(presetDef.specialAssetsPool.length, threat === 'Pesadelo' ? 4 : threat === 'Extremo' ? 3 : 2);
  const selectedAssets = [...presetDef.specialAssetsPool].slice(0, specialAssetsCount);

  const squadName = options.missionContext?.trim()
    ? `${presetDef.name}: ${options.missionContext.trim()}`
    : `${presetDef.name} (${radioCallsign})`;

  return {
    id: `squad-${Date.now()}`,
    squadName,
    presetId: options.presetId,
    factionName,
    radioCallsign,
    threatLevel: threat,
    totalMembers: members.length,
    doctrine: presetDef.doctrineTemplate,
    tacticalDirectives: [
      `1. O Líder (${members[0].name}) define o foco prioritário de fogo.`,
      `2. Elementos pesados e escudeiros avançam absorvendo dano enquanto a linha mantém disparos supressivos.`,
      `3. Em caso de perda de comunicação ou baixa do comandante: ${presetDef.surrenderRules}`,
    ],
    specialAssets: selectedAssets,
    surrenderThreshold: presetDef.surrenderRules,
    members,
    notes: options.missionContext || `Esquadrão gerado para combate imediato ou patrulha em Night City.`,
  };
}

/**
 * Aplica a Calibragem de Poder a uma tropa inteira (membros + fichas).
 * O líder recebe +1 nível; `spread` gera variação individual entre os demais membros.
 */
export function applySquadCalibration(squad: EnemySquad, cal: ThreatCalibration): EnemySquad {
  if (isDefaultCalibration(cal)) return squad;

  const members = squad.members.map(m => {
    const jitter = cal.spread > 0 && !m.isLeader
      ? Math.floor(Math.random() * (cal.spread * 2 + 1)) - cal.spread
      : 0;
    const memberOffset = Math.max(-8, Math.min(8, cal.powerOffset + jitter + (m.isLeader ? 1 : 0)));
    const sheet = applyThreatCalibration(m.sheet, cal, memberOffset);
    const s = sheet.statsRED;
    return {
      ...m,
      tier: sheet.tier,
      roleTitle: sheet.role,
      hp: s ? s.HP : m.hp,
      maxHP: s ? s.HP : m.maxHP,
      headSP: s ? s.headSP : m.headSP,
      bodySP: s ? s.bodySP : m.bodySP,
      combatNumber: s?.combatNumber ?? m.combatNumber,
      ref: s ? s.REF : m.ref,
      dex: s ? s.DEX : m.dex,
      body: s ? s.BODY : m.body,
      weapons: sheet.weapons.map(w => ({ name: w.name, damage: w.damage, rof: w.rof ?? 1, notes: w.notes })),
      cyberware: sheet.cyberware,
      gear: sheet.gear,
      tacticalOrder: sheet.tactics || m.tacticalOrder,
      sheet,
    };
  });

  const label = getPowerLabel(cal.powerOffset).label;
  const extraDirectives: string[] = [];
  if (cal.traits.includes('never_surrender') || cal.cyberLevel === 'psycho') {
    extraDirectives.push('4. Fanáticos: a tropa não recua nem se rende, mesmo com o líder caído.');
  }
  if (cal.traits.includes('ambush_ready')) {
    extraDirectives.push('5. Emboscada: o grupo age primeiro no turno 1 se não for detectado.');
  }
  if (cal.powerOffset <= -3) {
    extraDirectives.push('4. Moral frágil: a tropa quebra e foge ao perder dois membros.');
  }

  return {
    ...squad,
    members,
    tacticalDirectives: [...squad.tacticalDirectives, ...extraDirectives],
    notes: `${squad.notes ? squad.notes + '\n' : ''}⚡ Calibragem de Poder: ${label} (${cal.powerOffset > 0 ? '+' : ''}${cal.powerOffset})${cal.spread ? `, variação ±${cal.spread}` : ''}.`,
  };
}

/** Resolve armas, ciberware e equipamento de um membro diretamente no Códice. */
export function codexifyMember(m: SquadMember): SquadMember {
  const sheet = enrichNPCFromCodex(m.sheet);
  return {
    ...m,
    weapons: sheet.weapons.map(w => ({ name: w.name, damage: w.damage, rof: w.rof ?? 1, notes: w.notes })),
    cyberware: sheet.cyberware,
    gear: sheet.gear,
    sheet,
  };
}

export function codexifySquad(squad: EnemySquad): EnemySquad {
  return { ...squad, members: squad.members.map(codexifyMember) };
}
