import { NPCTier } from '../types/system';

export type StructureCategory =
  | 'gang_base'
  | 'corp_facility'
  | 'nightclub_bar'
  | 'ripperdoc_clinic'
  | 'megabuilding'
  | 'smuggler_den'
  | 'police_precinct'
  | 'lab_research';

export type StructureScale = 'small' | 'medium' | 'large';

export type StructureThreatLevel = 'low' | 'medium' | 'high' | 'extreme';

export interface RoomNPC {
  id: string;
  name: string;
  role: string;
  count: number;
  tier: NPCTier;
  hp: number;
  combatNumber: number;
  headSP: number;
  bodySP: number;
  weapons: string[];
  tactics: string;
  isLeader?: boolean;
}

export interface RoomInteractionPoint {
  id: string;
  title: string;
  type: 'hack' | 'lock' | 'power' | 'loot' | 'camera' | 'trap' | 'vent' | 'intel';
  dv?: number;
  skillRequired?: string;
  description: string;
  effect: string;
  isCompleted?: boolean;
}

export interface StructureRoom {
  id: string;
  roomNumber: number;
  name: string;
  floor: string;
  purpose: string;
  sensoryDescription: string;
  lighting: 'Iluminado' | 'Penumbra / Neon' | 'Escuridão Total';
  cover: 'Nenhuma' | 'Média (SP 15)' | 'Pesada (SP 25)';
  securityLevel: string;
  npcs: RoomNPC[];
  interactionPoints: RoomInteractionPoint[];
  connectedRoomNumbers: number[];
  lootText?: string;
  netarchAccess?: boolean;
}

export interface TacticalStructure {
  id: string;
  name: string;
  category: StructureCategory;
  scale: StructureScale;
  threatLevel: StructureThreatLevel;
  district: string;
  faction: string;
  facadeDescription: string;
  atmosphereDescription: string;
  perimeterSecurity: string;
  infiltrationWeakness: string;
  rooms: StructureRoom[];
  netarchSummary?: string;
  createdAt: string;
  isAiGenerated?: boolean;
}

// -------------------------------------------------------------
// METADADOS E TABELAS PROCEDURAIS
// -------------------------------------------------------------

export const STRUCTURE_CATEGORY_INFO: Record<StructureCategory, { label: string; icon: string; description: string; defaultFaction: string }> = {
  gang_base: {
    label: 'Base de Gangue / Covil Urbano',
    icon: '💀',
    description: 'Armazéns ocupados, fábricas de drogas sintéticas, fortalezas de beco com arame farpado e barricadas.',
    defaultFaction: 'Maelstrom',
  },
  corp_facility: {
    label: 'Instalação Corporativa Arasaka / Militech',
    icon: '🏢',
    description: 'Torres blindadas, black-sites subterrâneos, divisões de segurança com biometria e vidros à prova de balas.',
    defaultFaction: 'Arasaka Security',
  },
  nightclub_bar: {
    label: 'Clube Noturno, Bar & Vida Noturna',
    icon: '🍸',
    description: 'Boates com som industrial, salões VIP clandestinos, depósitos de bebidas contrabandeadas e salas de contagem.',
    defaultFaction: 'Tyger Claws',
  },
  ripperdoc_clinic: {
    label: 'Clínica de Ripperdoc & Banco de Corpos',
    icon: '💉',
    description: 'Salas cirúrgicas com cheiro de antisséptico e sangue synth, câmaras criogênicas e estoque de implantes roubados.',
    defaultFaction: 'Scavengers / Ripperdoc Clandestino',
  },
  megabuilding: {
    label: 'Megaprédio Residencial / Cortiço Vertical',
    icon: '🏙️',
    description: 'Estruturas de concreto massivo com centenas de andares, mercados ilegais internos e pontes de tiroteio.',
    defaultFaction: 'Gangue de Megabuilding',
  },
  smuggler_den: {
    label: 'Entreposto de Contrabando & Oficina',
    icon: '📦',
    description: 'Oficinas subterrâneas de改装 de veículos, hangares com saídas para canais aquáticos e rotas das Badlands.',
    defaultFaction: 'Nômades Aldecaldos / Contrabandistas',
  },
  police_precinct: {
    label: 'Posto Tático NCPD / MaxTac / Trauma Team',
    icon: '🛡️',
    description: 'Pátios de viaturas blindadas, celas de detenção reforçadas, depósitos de evidências e helipontos de AV-4.',
    defaultFaction: 'NCPD Tático',
  },
  lab_research: {
    label: 'Laboratório Secreto de P&D / Biotecnica',
    icon: '🧬',
    description: 'Câmaras limpas herméticas, servidores quânticos, incubadoras de biopets e armas experimentais.',
    defaultFaction: 'Kang Tao / Biotecnica',
  },
};

export const STRUCTURE_THREAT_INFO: Record<StructureThreatLevel, { label: string; color: string; badge: string; baseDV: number }> = {
  low: {
    label: 'Nível 1 - Baixa (Rua / Periferia)',
    color: 'text-emerald-400',
    badge: 'bg-emerald-950/60 border-emerald-800 text-emerald-300',
    baseDV: 13,
  },
  medium: {
    label: 'Nível 2 - Média (Fortificado / Gangue Armada)',
    color: 'text-amber-400',
    badge: 'bg-amber-950/60 border-amber-800 text-amber-300',
    baseDV: 15,
  },
  high: {
    label: 'Nível 3 - Alta (Militar / Corporação)',
    color: 'text-orange-400',
    badge: 'bg-orange-950/60 border-orange-800 text-orange-300',
    baseDV: 17,
  },
  extreme: {
    label: 'Nível 4 - Extrema / Black-Ops (Arasaka / MaxTac)',
    color: 'text-red-400',
    badge: 'bg-red-950/60 border-red-800 text-red-300',
    baseDV: 21,
  },
};

// -------------------------------------------------------------
// GERADOR PROCEDURAL OFFLINE
// -------------------------------------------------------------

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateProceduralStructure(options: {
  category: StructureCategory;
  scale: StructureScale;
  threatLevel: StructureThreatLevel;
  faction?: string;
  district?: string;
}): TacticalStructure {
  const { category, scale, threatLevel } = options;
  const faction = options.faction || STRUCTURE_CATEGORY_INFO[category].defaultFaction;
  const district = options.district || 'Watson (Northside Industrial)';

  // Determine room count
  let targetRoomCount = 4;
  if (scale === 'small') targetRoomCount = 3 + Math.floor(Math.random() * 3); // 3 to 5
  if (scale === 'medium') targetRoomCount = 6 + Math.floor(Math.random() * 4); // 6 to 9
  if (scale === 'large') targetRoomCount = 10 + Math.floor(Math.random() * 5); // 10 to 14

  const threat = STRUCTURE_THREAT_INFO[threatLevel];

  // Specific Names and Narrative
  let structureName = '';
  let facade = '';
  let atmosphere = '';
  let perimeter = '';
  let weakness = '';

  if (category === 'corp_facility') {
    structureName = `Complexo de Segurança ${faction} // Sub-Nível 4`;
    facade = 'Fachada brutalista de concreto reforçado com placas de aço escovado e vidros fumê reflexivos blindados. Câmeras térmicas de 360° embutidas nas cornijas com holofotes infravermelhos.';
    atmosphere = 'Ar-condicionado gelado com cheiro metálico de ozônio e polímeros novos. Zumbido contínuo de refrigeração líquida dos racks de servidores e silêncio tenso pontuado por bips eletrônicos.';
    perimeter = 'Grade eletrificada de 4 metros (DV 15 para contornar), portão duplo com cancela hidráulica para blindados e 2 torretas automáticas embutidas no teto.';
    weakness = 'Duto de exaustão do gerador auxiliar nos fundos que dá acesso direto à ventilação do piso dos servidores sem passar pela recepção blindada (Atletismo DV 14).';
  } else if (category === 'gang_base') {
    structureName = `Covil dos ${faction} // "O Matadouro"`;
    facade = 'Galpão industrial abandonado com paredes grafitadas com tags da gangue, janelas tapadas com chapas de aço corrugado soldadas e barricadas feitas de carcaças de carros incendiados.';
    atmosphere = 'Cheiro forte de óleo de motor queimado, sangue synth e maconha com cianeto. Luz estroboscópica vermelha e amarela, som de música noise industrial reverberando pelo piso de concreto.';
    perimeter = 'Armadilhas sonoras feitas de latas e arame farpado nas calçadas, sentinelas armados no telhado com fuzis e holofote de busca improvisado alimentado por gerador a CHOOH2.';
    weakness = 'Quadro de força externo precário na lateral do beco: um corte de fiação (Eletrônica DV 13) apaga 100% da iluminação do galpão e deixa os guardas desorientados por 2 rodadas.';
  } else if (category === 'nightclub_bar') {
    structureName = `Clube Noturno "Chrome & Velvet" (${faction})`;
    facade = 'Fachada em degradê roxo e ciano com letreiros neon pulsantes em ideogramas japoneses. Fila na porta contida por cordões de veludo e dois Solos imensos como leões-de-chácara.';
    atmosphere = 'Névoa pesada de gelo seco misturada com feromônios sintéticos e álcool barato. Graves de sintetizador que fazem o tórax vibrar, iluminação em tons de fúcsia e fumaça de cigarros synth.';
    perimeter = 'Detector de armas magnético no hall de entrada (esconder armas requer Dissimulação DV 16), câmeras discretas de alta resolução focadas no bar e saídas de emergência com alarme sonoro.';
    weakness = 'A porta dos fundos para descarregamento de barris de chopp fica destrancada durante o pico da meia-noite enquanto ajudantes descansam (Furtividade DV 13).';
  } else if (category === 'ripperdoc_clinic') {
    structureName = `Clínica Clandestina de Biorreparo // Dr. Chrome`;
    facade = 'Entrada discreta através de um porão de lavanderia 24h. Porta de ferro pesada com olho mágico reforçado e interfone codificado.';
    atmosphere = 'Cheiro agressivo de antisséptico hospitalar, desinfetante cítrico e fluidos biológicos. Iluminação clínica branca de tubo fluorescente oscilante e som de monitores cardíacos.';
    perimeter = 'Porta blindada com trinco eletromagnético (DV 16 para decodificar), alarme silencioso ligado diretamente a mercenários contratados e câmera disfarçada na lâmpada do corredor.';
    weakness = 'A janela do poço de ventilação no teto da sala de cirurgia possui uma grade frouxa presa apenas por dois parafusos enferrujados (Básico Técnico DV 12).';
  } else if (category === 'megabuilding') {
    structureName = `Megaprédio H10 // Bloco Ocupado pelos ${faction}`;
    facade = 'Monólito vertical de 90 andares em concreto encardido por chuva ácida. Centenas de passarelas suspensas, antenas piratas e dutos de esgoto expostos.';
    atmosphere = 'Vapor quente vazando das tubulações, cheiro de comida de rua frita e fumaça tóxica. Eco constante de passos rápidos, sirenes distantes e crianças correndo no concreto.';
    perimeter = 'Passarela de acesso estreita barricada com sacos de areia, sentinelas revistando quem sobe e câmeras ligadas à rede de cabos piratas.';
    weakness = 'Duto de descarte de lixo vertical inativo que permite rapel ou escalada dos andares inferiores diretamente para o depósito do 12º andar (Atletismo DV 14).';
  } else {
    structureName = `Entreposto & Garagem Subterrânea (${faction})`;
    facade = 'Rampa de acesso descendente para subterrâneo com portão de ferro rolante amassado por batidas e câmeras em caixas blindadas.';
    atmosphere = 'Cheiro de gasolina sintética CHOOH2, graxa preta e metal cortado por plasma. Iluminação amarelada por lâmpadas de vapor de sódio.';
    perimeter = 'Câmeras na rampa com gravação em disco óptico, sensores de pressão no chão para detectar veículos e trancas de barra de aço duplo.';
    weakness = 'Canal de drenagem pluvial antigo que passa sob a oficina e tem uma tampa de bueiro que sai dentro do depósito de peças (BODY 8 ou Ferramentas DV 13).';
  }

  // Generate Rooms
  const roomTemplates = [
    {
      name: 'Hall de Entrada & Triagem Blindada',
      floor: 'Térreo',
      purpose: 'Controle de acesso, revista de armamentos e primeiro filtro de intrusos.',
      lighting: 'Iluminado' as const,
      cover: 'Média (SP 15)' as const,
      security: 'Câmera CFTV + Portão Eletrônico',
      interaction: {
        title: 'Console da Cancela / Fechadura Eletrônica',
        type: 'lock' as const,
        dv: threat.baseDV,
        skill: 'Eletrônica / Segurança',
        desc: 'Painel digital touch-screen que destranca o acesso ao saguão interno.',
        effect: 'Abre a porta sem disparar o alarme perimétrico.',
      },
      npc: {
        name: `Guarda de Guarita (${faction})`,
        role: 'Vigia Armado',
        count: 2,
        tier: 'mook' as const,
        hp: 30,
        combatNumber: threat.baseDV - 2,
        headSP: threatLevel === 'low' ? 4 : 11,
        bodySP: threatLevel === 'low' ? 7 : 11,
        weapons: ['Pistola Pesada 3d6', 'Faca Tática 1d6'],
        tactics: 'Atiram de trás da mureta e tentam acionar o botão de alarme geral.',
      },
    },
    {
      name: 'Corredor Central de Trânsito & Dutos',
      floor: 'Térreo / 1º Andar',
      purpose: 'Circulação interna com visadas longas para dissuadir invasores.',
      lighting: 'Penumbra / Neon' as const,
      cover: 'Nenhuma' as const,
      security: 'Detector de Movimento Infravermelho',
      interaction: {
        title: 'Sensor de Presença Laser no Rodapé',
        type: 'trap' as const,
        dv: threat.baseDV,
        skill: 'Percepção / Eletrônica',
        desc: 'Feixe infravermelho fino que corta o corredor.',
        effect: 'Desativa o gatilho da sirene antes que o grupo cruze o corredor.',
      },
      npc: {
        name: `Patrulha Móvel (${faction})`,
        role: 'Combatente em Ronda',
        count: threatLevel === 'extreme' ? 3 : 2,
        tier: 'mook' as const,
        hp: 35,
        combatNumber: threat.baseDV - 1,
        headSP: 11,
        bodySP: 11,
        weapons: ['Submetralhadora 2d6 (ROF 1/rajada)', 'Bastão de Choque'],
        tactics: 'Movem-se em dupla cobrindo ângulos opostos.',
      },
    },
    {
      name: 'Sala de Monitoramento & Segurança de CFTV',
      floor: '1º Andar',
      purpose: 'Vigilância eletrônica por vídeo de todas as câmeras do perímetro.',
      lighting: 'Iluminado' as const,
      cover: 'Média (SP 15)' as const,
      security: 'Painel Central com Alarme Geral',
      interaction: {
        title: 'Servidor de Vídeo / Câmeras de CFTV',
        type: 'camera' as const,
        dv: threat.baseDV - 1,
        skill: 'Técnico em Ciber / Invasão',
        desc: 'Computador industrial com as telas de todas as salas da base.',
        effect: 'Permite congelar as gravações ou desligar todas as câmeras do local por 10 minutos.',
      },
      npc: {
        name: `Operador de Câmeras (${faction})`,
        role: 'Operador Técnico',
        count: 1,
        tier: 'mook' as const,
        hp: 25,
        combatNumber: threat.baseDV - 3,
        headSP: 0,
        bodySP: 4,
        weapons: ['Pistola Leve 2d6'],
        tactics: 'Tenta se abaixar sob a bancada e pedir socorro pelo rádio.',
      },
    },
    {
      name: 'Central de Dados & Terminal Netarch',
      floor: 'Subsolo / Andar Técnico',
      purpose: 'Armazenamento de dados corporativos ou registros de contrabando.',
      lighting: 'Penumbra / Neon' as const,
      cover: 'Pesada (SP 25)' as const,
      security: 'Ponto de Acesso Físico da Netarch (Jack-in)',
      interaction: {
        title: 'Ponto de Acesso de Interface da Netarch',
        type: 'hack' as const,
        dv: threat.baseDV + 2,
        skill: 'Interface (Netrunner)',
        desc: 'Tomada de fibra ótica de conexão direta com a arquitetura digital do prédio.',
        effect: 'Permite que um Netrunner faça Jack-In para controlar portas, torretas e acessar arquivos confidenciais.',
      },
      npc: {
        name: `Netrunner de Guarda (${faction})`,
        role: 'Especialista Cibernético',
        count: 1,
        tier: 'lieutenant' as const,
        hp: 40,
        combatNumber: threat.baseDV,
        headSP: 11,
        bodySP: 11,
        weapons: ['Cyberdeck Arasaka', 'Pistola Smart 3d6'],
        tactics: 'Plugado no sistema; ativa demônios e torretas da sala contra intrusos.',
      },
    },
    {
      name: 'Depósito de Armas & Almoxarifado Tático',
      floor: 'Térreo / Fundos',
      purpose: 'Armazenamento de fuzis sobressalentes, munição pesada e coletes.',
      lighting: 'Penumbra / Neon' as const,
      cover: 'Pesada (SP 25)' as const,
      security: 'Porta com Fechadura de Grau Militar',
      interaction: {
        title: 'Caixas de Armas Lacradas & Cofre de Munição',
        type: 'loot' as const,
        dv: threat.baseDV,
        skill: 'Básico Técnico / Arrombamento',
        desc: 'Cadeados pesados e caixas plásticas de transporte balístico.',
        effect: 'Gera 2x Fuzis de Assalto, 50 cartuchos de munição especial e 1 Granada de Fragmentação.',
      },
      npc: {
        name: `Armeiro & Guarda Pesado (${faction})`,
        role: 'Defensor de Arsenal',
        count: 1,
        tier: 'lieutenant' as const,
        hp: 45,
        combatNumber: threat.baseDV,
        headSP: 13,
        bodySP: 13,
        weapons: ['Espingarda Calibre 12 (5d6)', 'Faca Pesada 2d6'],
        tactics: 'Dispara à queima-roupa e joga granada se houver grupo reunido.',
      },
    },
    {
      name: 'Quadro de Força, Baterias & Gerador CHOOH2',
      floor: 'Subsolo / Beco Traseiro',
      purpose: 'Fornecimento primário e reserva de energia para toda a instalação.',
      lighting: 'Escuridão Total' as const,
      cover: 'Pesada (SP 25)' as const,
      security: 'Grade com Cadeado Analógico',
      interaction: {
        title: 'Disjuntor Geral & Válvula de Combustível',
        type: 'power' as const,
        dv: threat.baseDV - 2,
        skill: 'Básico Técnico / Eletrônica',
        desc: 'Grandes alavancas de alta voltagem e tubulações de CHOOH2 pressurizado.',
        effect: 'Corta 100% da energia do complexo ou causa sobrecarga com vazamento de fumaça cega.',
      },
      npc: {
        name: `Técnico de Manutenção (${faction})`,
        role: 'Mecânico de Suporte',
        count: 1,
        tier: 'mook' as const,
        hp: 20,
        combatNumber: threat.baseDV - 4,
        headSP: 0,
        bodySP: 4,
        weapons: ['Chave Inglesa Pesada 2d6', 'Pistola Leve 1d6'],
        tactics: 'Foge imediatamente em direção à sala mais próxima gritando por socorro.',
      },
    },
    {
      name: 'Gabinete Executivo / Sala do Líder da Facção',
      floor: 'Andar Superior / Cobertura',
      purpose: 'Tomada de decisões, cofres de dinheiro limpo/sujo e reuniões de comando.',
      lighting: 'Iluminado' as const,
      cover: 'Pesada (SP 25)' as const,
      security: 'Porta com Biometria & Alarme de Coerção',
      interaction: {
        title: 'Cofre de Parede Biométrico Oculto',
        type: 'loot' as const,
        dv: threat.baseDV + 2,
        skill: 'Eletrônica / Decodificação',
        desc: 'Cofre embutido atrás de uma pintura holográfica estilizada.',
        effect: `Contém ${threatLevel === 'extreme' ? '4.500 eb em fichas bancárias' : threatLevel === 'high' ? '2.000 eb' : '800 eb'}, contratos corporativos e drogas finas.`,
      },
      npc: {
        name: `Comandante / Tenente (${faction})`,
        role: 'Líder da Instalação',
        count: 1,
        tier: (threatLevel === 'extreme' ? 'boss' : 'miniboss') as NPCTier,
        hp: threatLevel === 'extreme' ? 70 : 50,
        combatNumber: threat.baseDV + 2,
        headSP: threatLevel === 'extreme' ? 15 : 12,
        bodySP: threatLevel === 'extreme' ? 15 : 12,
        weapons: ['Fuzil Smart com Mira Térmica (4d6)', 'Lâminas Mantis (3d6)'],
        tactics: 'Ativa Sandevistan/Cromos no primeiro turno, busca cobertura pesada e não se rende fácil.',
        isLeader: true,
      },
    },
    {
      name: 'Terraço de Heliponto & Rota de Fuga de Emergência',
      floor: 'Cobertura',
      purpose: 'Pouso de aerodinos AV-4, vigilância aérea e plataforma de franco-atirador.',
      lighting: 'Penumbra / Neon' as const,
      cover: 'Média (SP 15)' as const,
      security: 'Holofotes com Detector de Calor',
      interaction: {
        title: 'Guincho de Rapel & Saída de Emergência',
        type: 'vent' as const,
        dv: threat.baseDV - 2,
        skill: 'Atletismo / Sobrevivência',
        desc: 'Cabos de aço fixados nas calhas que descem até o beco dos fundos.',
        effect: 'Permite rota de fuga silenciosa do prédio sem passar pelos andares inferiores.',
      },
      npc: {
        name: `Franco-Atirador de Telhado (${faction})`,
        role: 'Sniper de Cobertura',
        count: 1,
        tier: 'lieutenant' as const,
        hp: 35,
        combatNumber: threat.baseDV + 1,
        headSP: 11,
        bodySP: 11,
        weapons: ['Rifle Sniper de Precisão (5d6)', 'Pistola Pesada (3d6)'],
        tactics: 'Dispara deitado do parapeito contra alvos no pátio ou na rua.',
      },
    },
    {
      name: 'Sala de Interrogatório & Celas de Contenção',
      floor: 'Subsolo 02',
      purpose: 'Detenção de espiões de gangues rivais, reféns corporativos e extração de dados.',
      lighting: 'Penumbra / Neon' as const,
      cover: 'Pesada (SP 25)' as const,
      security: 'Grades de Titânio com Trava Magnética',
      interaction: {
        title: 'Console de Liberação das Celas',
        type: 'intel' as const,
        dv: threat.baseDV,
        skill: 'Segurança / Eletrônica',
        desc: 'Teclado com código de 6 dígitos que controla os trincos eletromagnéticos.',
        effect: 'Liberta prisioneiros que podem agir como distração ou recompensar o grupo com favores.',
      },
      npc: {
        name: `Interrogador Sádico (${faction})`,
        role: 'Especialista em Coerção',
        count: 1,
        tier: 'mook' as const,
        hp: 30,
        combatNumber: threat.baseDV - 1,
        headSP: 7,
        bodySP: 7,
        weapons: ['Taser de Alta Voltagem', 'Pistola Pesada 3d6'],
        tactics: 'Usa reféns como escudo humano se atacado.',
      },
    },
    {
      name: 'Refeitório, Dormitórios & Área de Descanso',
      floor: '2º Andar',
      purpose: 'Alojamento da tropa de plantão, beliches de descanso e dispensadores de comida sintética.',
      lighting: 'Iluminado' as const,
      cover: 'Média (SP 15)' as const,
      security: 'Fechadura Padrão',
      interaction: {
        title: 'Dispensador de Comida & Duto de Exaustão',
        type: 'vent' as const,
        dv: threat.baseDV - 2,
        skill: 'Furtividade / Dissimulação',
        desc: 'Tubulação larga de gordura que conecta as cozinhas aos dutos gerais.',
        effect: 'Permite espionar conversas dos guardas para obter senhas de portas ou passar gás sonífero.',
      },
      npc: {
        name: `Soldados em Folga (${faction})`,
        role: 'Tropa em Descanso',
        count: threatLevel === 'extreme' ? 4 : 2,
        tier: 'mook' as const,
        hp: 30,
        combatNumber: threat.baseDV - 2,
        headSP: 0,
        bodySP: 4,
        weapons: ['Pistola Pesada 3d6 (no coldre de cintura)', 'Garrafa de Chopp'],
        tactics: 'Pegos de surpresa no primeiro turno sem armadura completa.',
      },
    },
    {
      name: 'Laboratório Químico & Prensa de Síntese',
      floor: '1º Andar / Fundos',
      purpose: 'Refino de drogas de rua, testes biológicos ou produção de estimulantes de combate.',
      lighting: 'Iluminado' as const,
      cover: 'Média (SP 15)' as const,
      security: 'Chuveiro de Descontaminação com Alarme de Vazamento',
      interaction: {
        title: 'Válvula de Gases Tóxicos / Solventes',
        type: 'trap' as const,
        dv: threat.baseDV,
        skill: 'Química / Básico Técnico',
        desc: 'Válvulas manuais de cilindros pressurizados de reagentes voláteis.',
        effect: 'Libera névoa ácida que causa 2d6 de dano de contusão por rodada em quem não tiver máscara.',
      },
      npc: {
        name: `Químico de Beco (${faction})`,
        role: 'Cientista Clandestino',
        count: 1,
        tier: 'mook' as const,
        hp: 20,
        combatNumber: threat.baseDV - 3,
        headSP: 0,
        bodySP: 4,
        weapons: ['Bisturi Cirúrgico 1d6', 'Spray de Pimenta Tóxico'],
        tactics: 'Atira frascos de ácido e tenta alcançar o alarme de incêndio.',
      },
    },
    {
      name: 'Oficina Mecânica & Baia de Veículos',
      floor: 'Subsolo / Térreo',
      purpose: 'Manutenção de viaturas, blindagem de picapes e reparo de ciberware pesado.',
      lighting: 'Penumbra / Neon' as const,
      cover: 'Pesada (SP 25)' as const,
      security: 'Portão Pantográfico de Ferro com Trava Pneumática',
      interaction: {
        title: 'Elevador Hidráulico de Veículo',
        type: 'power' as const,
        dv: threat.baseDV - 1,
        skill: 'Básico Técnico / Eletrônica',
        desc: 'Controle de alavanca da rampa hidráulica que sustenta uma picape blindada.',
        effect: 'Pode derrubar o veículo como barricada esmagadora (4d6 de dano de impacto).',
      },
      npc: {
        name: `Mecânico Solo (${faction})`,
        role: 'Mecânico Pesado',
        count: 1,
        tier: 'mook' as const,
        hp: 35,
        combatNumber: threat.baseDV - 1,
        headSP: 4,
        bodySP: 11,
        weapons: ['Maçarico Industrial 3d6', 'Pistola Pesada 3d6'],
        tactics: 'Usa a lataria do veículo como cobertura quase impenetrável.',
      },
    },
  ];

  // Select the appropriate slice of rooms based on count
  const selectedTemplates = roomTemplates.slice(0, targetRoomCount);

  // Build the room objects with logical connections
  const rooms: StructureRoom[] = selectedTemplates.map((tmpl, index) => {
    const roomNum = index + 1;
    // Calculate connections (linear progression with cross-links)
    const connected: number[] = [];
    if (roomNum > 1) connected.push(roomNum - 1);
    if (roomNum < targetRoomCount) connected.push(roomNum + 1);
    // Add an alternate secret / duto link for tactical depth
    if (roomNum === 1 && targetRoomCount >= 6) connected.push(6); // entrance connects to generator / back alley

    const interactionPoint: RoomInteractionPoint = {
      id: `pt-${roomNum}-${Date.now()}`,
      title: tmpl.interaction.title,
      type: tmpl.interaction.type,
      dv: tmpl.interaction.dv,
      skillRequired: tmpl.interaction.skill,
      description: tmpl.interaction.desc,
      effect: tmpl.interaction.effect,
      isCompleted: false,
    };

    const roomNPC: RoomNPC = {
      id: `npc-${roomNum}-${Date.now()}`,
      name: tmpl.npc.name,
      role: tmpl.npc.role,
      count: tmpl.npc.count,
      tier: (tmpl.npc.tier as NPCTier) || 'mook',
      hp: tmpl.npc.hp,
      combatNumber: tmpl.npc.combatNumber,
      headSP: tmpl.npc.headSP,
      bodySP: tmpl.npc.bodySP,
      weapons: tmpl.npc.weapons,
      tactics: tmpl.npc.tactics,
      isLeader: tmpl.npc.isLeader || false,
    };

    const hasNetarch = tmpl.name.includes('Netarch') || tmpl.name.includes('Monitoramento');

    return {
      id: `room-${roomNum}`,
      roomNumber: roomNum,
      name: tmpl.name,
      floor: tmpl.floor,
      purpose: tmpl.purpose,
      sensoryDescription: `${tmpl.purpose} Iluminação: ${tmpl.lighting}. Coberturas táticas disponíveis: ${tmpl.cover}. Segurança local: ${tmpl.security}.`,
      lighting: tmpl.lighting,
      cover: tmpl.cover,
      securityLevel: tmpl.security,
      npcs: [roomNPC],
      interactionPoints: [interactionPoint],
      connectedRoomNumbers: Array.from(new Set(connected)),
      lootText: tmpl.name.includes('Armas') ? '2x Fuzis de Assalto e 50x munições' : tmpl.name.includes('Líder') ? 'Cofre com créditos e chips criptografados' : undefined,
      netarchAccess: hasNetarch,
    };
  });

  return {
    id: `struct-${Date.now()}`,
    name: structureName,
    category,
    scale,
    threatLevel,
    district,
    faction,
    facadeDescription: facade,
    atmosphereDescription: atmosphere,
    perimeterSecurity: perimeter,
    infiltrationWeakness: weakness,
    rooms,
    netarchSummary: `Arquitetura de Rede Local (Netarch) de ${threatLevel === 'extreme' ? '6 Pisos com Black ICE Hellhound' : threatLevel === 'high' ? '4 Pisos com Asp e Wisps' : '3 Pisos com Bloodhound'}. Pontos de acesso identificados na Sala de Servidores e nas Câmeras de CFTV.`,
    createdAt: new Date().toISOString(),
    isAiGenerated: false,
  };
}
