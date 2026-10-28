export type VehicleCategory =
  | 'Todas'
  | 'Motocicleta'
  | 'Carro Compacto'
  | 'Carro Esportivo de Luxo'
  | 'Picape / Van'
  | 'Caminhão Pesado / Blindado'
  | 'Aerodino AV / Aeronave'
  | 'Barco / Aquático';

export interface VehicleModel {
  id: string;
  name: string;
  type: 'Motocicleta' | 'Carro Compacto' | 'Carro Esportivo de Luxo' | 'Picape / Van' | 'Caminhão Pesado / Blindado' | 'Aerodino AV / Aeronave' | 'Barco / Aquático';
  sdp: number;
  seats: number;
  speedMph: number;
  moveCombat: number;
  costEb: string;
  description: string;
  standardEquipment: string[];
}

export interface NomadUpgrade {
  name: string;
  costEb: string;
  sdpBonus?: number;
  effect: string;
}

export const VEHICLES_LIST: VehicleModel[] = [
  // MOTOCICLETAS
  {
    id: 'motorcycle-kusanagi',
    name: 'Yaiba Kusanagi CT-3X',
    type: 'Motocicleta',
    sdp: 35,
    seats: 2,
    speedMph: 150,
    moveCombat: 30,
    costEb: '20.000eb (Super Luxury)',
    description: 'A moto esportiva mais rápida e desejada de Night City. Carenagem aerodinâmica inspirada em anime dos anos 80, faróis de LED duplos e aceleração brutal.',
    standardEquipment: ['Computador de Bordo com HUD', 'Farol Duplo Halógeno', 'Freios ABS Eletromagnéticos', 'Pneus de Composto Térmico'],
  },
  {
    id: 'motorcycle-apollo',
    name: 'Brennan Apollo (Versão Badlands)',
    type: 'Motocicleta',
    sdp: 40,
    seats: 2,
    speedMph: 110,
    moveCombat: 24,
    costEb: '15.000eb (Luxury)',
    description: 'A moto preferida dos Nômades e exploradores dos Badlands. Suspensão telescópica reforçada de curso longo para saltar dunas e crateras de detritos.',
    standardEquipment: ['Suspensão Off-Road Alta', 'Alforjes Laterais Blindados', 'Farol de Neblina de Longo Alcance'],
  },
  {
    id: 'motorcycle-nazare',
    name: 'ARCH Nazaré / Racer Custom',
    type: 'Motocicleta',
    sdp: 40,
    seats: 2,
    speedMph: 160,
    moveCombat: 32,
    costEb: '30.000eb (Super Luxury)',
    description: 'Obra de arte mecânica construída à mão. Motor V-Twin estrondoso com chassi de fibra de carbono e escape de titânio polido.',
    standardEquipment: ['Painel Touchscreen Personalizado', 'Partida por Biometria', 'Transmissão Esportiva Rápida'],
  },

  // CARROS COMPACTOS & SEDÃS
  {
    id: 'compact-hella',
    name: 'Archer Hella EC-D i360',
    type: 'Carro Compacto',
    sdp: 50,
    seats: 4,
    speedMph: 90,
    moveCombat: 20,
    costEb: '10.000eb (Luxury)',
    description: 'O clássico sedã quatro portas visto em cada esquina de Watson e Heywood. Peças baratas, fácil de reparar com ferro velho e imune a desgastes leves.',
    standardEquipment: ['Airbags frontais e de cortina', 'Rádio estéreo CitiNet', 'Porta-malas espaçoso', 'Tanque com filtro de CHOOH2'],
  },
  {
    id: 'compact-maimai',
    name: 'Makigai Maimai P126',
    type: 'Carro Compacto',
    sdp: 35,
    seats: 2,
    speedMph: 75,
    moveCombat: 18,
    costEb: '5.000eb (Everyday)',
    description: 'O subcompacto elétrico ultra-econômico. Estaciona em qualquer vão de beco e faz manobras em 180 graus sem esforço, embora qualquer batida amasse a lataria.',
    standardEquipment: ['Sistema de Estacionamento Automático', 'Ar-condicionado compacto', 'Bateria de troca rápida'],
  },
  {
    id: 'compact-cortes',
    name: 'Villefort Cortes V5000 Executive',
    type: 'Carro Compacto',
    sdp: 60,
    seats: 5,
    speedMph: 110,
    moveCombat: 22,
    costEb: '25.000eb (Super Luxury)',
    description: 'Sedã executivo elegante com acabamento de couro sintético, painel amadeirado e suspensão a ar que absorve até o asfalto destruído da Zona de Combate.',
    standardEquipment: ['Vidros Térmicos Fumê', 'Computador de Navegação Corporativa', 'Isolamento Acústico de Cabine'],
  },

  // MUSCLE & ESPORTIVOS
  {
    id: 'sportscar-turbo-r',
    name: 'Quadra Turbo-R V-Tech',
    type: 'Carro Esportivo de Luxo',
    sdp: 60,
    seats: 2,
    speedMph: 180,
    moveCombat: 38,
    costEb: '50.000eb (Super Luxury)',
    description: 'O ícone absoluto das corridas ilegais de Night City. O motor V8 biturbo ruge alto, solta chamas pelo escape central e entrega tração traseira implacável.',
    standardEquipment: ['Painel holográfico de pilotagem', 'Câmeras 360 graus', 'Vidros fumê polarizados', 'Injeção direta de nitro'],
  },
  {
    id: 'sportscar-type66',
    name: 'Quadra Type-66 "Cthulhu / Jen Rowley"',
    type: 'Carro Esportivo de Luxo',
    sdp: 65,
    seats: 2,
    speedMph: 190,
    moveCombat: 40,
    costEb: '55.000eb (Super Luxury)',
    description: 'Puro muscle-car americano com chassi de aço pesado e potência bruta. Exige reflexos afiados para não derrapar nas curvas de Night City.',
    standardEquipment: ['Aerofólio Traseiro Ajustável', 'Gaiola Estrutural de Competição', 'Sistema de Resfriamento a Intercooler'],
  },
  {
    id: 'sportscar-caliburn',
    name: 'Rayfield Caliburn / Aerondight',
    type: 'Carro Esportivo de Luxo',
    sdp: 70,
    seats: 2,
    speedMph: 230,
    moveCombat: 48,
    costEb: '120.000eb+ (Exótico / Hipercarro)',
    description: 'O ápice da engenharia automotiva britânica. Não tem janelas de vidro: a cabine é uma concha selada com projeção holográfica CrystalDome e motor híbrido de plasma.',
    standardEquipment: ['Tecnologia CrystalDome (Visão 360 sem pontos cegos)', 'Piloto Automático Neural', 'Blindagem Composta Kevlar/Titânio'],
  },

  // PICAPES & VANS
  {
    id: 'heavy-truck-mackinaw',
    name: 'Thorton Mackinaw MTL1',
    type: 'Picape / Van',
    sdp: 80,
    seats: 4,
    speedMph: 85,
    moveCombat: 20,
    costEb: '30.000eb (Super Luxury)',
    description: 'A picape mais durável e confiável de todos os tempos. Chassi de longarina dupla, tração 4x4 e caçamba espaçosa para acomodar caixas de munição e armas.',
    standardEquipment: ['Tração integral 4x4 com bloqueio de diferencial', 'Guincho elétrico frontal', 'Tanque duplo de combustível', 'Pneus off-road'],
  },
  {
    id: 'van-columbus',
    name: 'Villefort Columbus V340-F Freight',
    type: 'Picape / Van',
    sdp: 75,
    seats: 6,
    speedMph: 80,
    moveCombat: 18,
    costEb: '22.000eb (Luxury)',
    description: 'Van de entrega de grande capacidade muito usada por equipes de infiltração mercenária, fixers e equipes clandestinas de braindance.',
    standardEquipment: ['Portas Traseiras de Abertura Total', 'Divisória Blindada de Carga', 'Tomadas de Alta Voltagem na Cabine'],
  },

  // CAMINHÕES PESADOS & BLINDADOS
  {
    id: 'truck-bratsk',
    name: 'Kaukaz Bratsk U4020 / Caminhão Pesado',
    type: 'Caminhão Pesado / Blindado',
    sdp: 120,
    seats: 4,
    speedMph: 60,
    moveCombat: 14,
    costEb: '60.000eb (Super Luxury)',
    description: 'Monstro de 8 rodas fabricado pela União Soviética. Atravessa rios secos, campos minados e escombros urbanos como se fossem cascalho fino.',
    standardEquipment: ['Tração 8x8 permanente', 'Guincho industrial de 15 toneladas', 'Cama de dormir na cabine estendida'],
  },
  {
    id: 'truck-behemoth',
    name: 'Militech Behemoth Armored Transport',
    type: 'Caminhão Pesado / Blindado',
    sdp: 150,
    seats: 12,
    speedMph: 70,
    moveCombat: 16,
    costEb: '150.000eb+ (Militar Restrito)',
    description: 'Fortaleza sobre rodas utilizada para escoltar executivos de alto escalão e carregar carregamentos ultra-secretos de armas sob fogo de bazucas.',
    standardEquipment: ['Blindagem Militar Composta SP 18', 'Chapa Defletora em V Contra Minas', 'Escotilhas de Tiro com Visores Blindados'],
  },

  // AERODINOS AV & AERONAVES
  {
    id: 'aerodyne-av4',
    name: 'Aerodino Tático AV-4 (Trauma Team / Militech)',
    type: 'Aerodino AV / Aeronave',
    sdp: 100,
    seats: 6,
    speedMph: 250,
    moveCombat: 50,
    costEb: '100.000eb+ (Super Luxury / Restrito)',
    description: 'Aeronave de decolagem e pouso vertical (VTOL) equipada com quatro turbofans direcionais. Capaz de descer em telhados de prédios e cruzar Night City em minutos.',
    standardEquipment: ['Navegação por satélite militar', 'Filtros atmosféricos NBC', 'Maca médica de suporte de vida', 'Rádio criptografado'],
  },
  {
    id: 'aerodyne-valgus',
    name: 'Zetatech Valgus Combat Gyro / Canhoneira Leve',
    type: 'Aerodino AV / Aeronave',
    sdp: 85,
    seats: 2,
    speedMph: 190,
    moveCombat: 42,
    costEb: '85.000eb (Restrito)',
    description: 'Girocóptero de combate ágil e esguio, equipado com sensores termais de solo e suporte para metralhadoras rotativas ou mísseis guiados.',
    standardEquipment: ['Sensores Infravermelhos de Solo', 'Piloto Automático Tático', 'Torreta com Conector Smartlink'],
  },

  // BARCOS & AQUÁTICOS
  {
    id: 'boat-seasprite',
    name: 'Lancha Rápida Sea Sprite 32',
    type: 'Barco / Aquático',
    sdp: 60,
    seats: 6,
    speedMph: 70,
    moveCombat: 22,
    costEb: '35.000eb (Super Luxury)',
    description: 'Lancha esportiva com casco em V de fibra reforçada para cortar as águas ácidas e poluídas da Baía de Coronado sem corrosão imediata.',
    standardEquipment: ['Sonar Náutico e GPS Marítimo', 'Casco com Tratamento Anti-Ácido', 'Holofote de Busca Noturna de 1.000.000 candelas'],
  },
];

export const NOMAD_UPGRADES_TABLE: NomadUpgrade[] = [
  {
    name: 'Vidros e Painéis Blindados',
    costEb: '2.000eb',
    sdpBonus: 15,
    effect: 'Adiciona +15 SDP ao veículo e protege os ocupantes contra tiros leves de armas de fogo (SP 13).',
  },
  {
    name: 'Blindagem Militar Pesada',
    costEb: '5.000eb',
    sdpBonus: 30,
    effect: 'Adiciona +30 SDP e placas de aço balístico de SP 16 na lataria. O veículo ganha imunidade a fogo de armas automáticas leves.',
  },
  {
    name: 'Torre de Teto com Metralhadora / SMG',
    costEb: '3.000eb',
    effect: 'Permite disparar uma arma pesada ou fuzil do teto com controle remoto a partir do banco do carona com ângulo de 360 graus.',
  },
  {
    name: 'Lança-Foguetes Anti-Blindado',
    costEb: '6.000eb',
    effect: 'Pod lateral carregado com 2 foguetes teleguiados de dano 8d6 contra veículos e ciborgues pesados.',
  },
  {
    name: 'Sistema de Injeção de Nitro (NOS)',
    costEb: '1.000eb',
    effect: 'Concede +10 de MOVE de combate durante 3 rodadas por ativação (máximo 3 cargas por botijão).',
  },
  {
    name: 'Pneus de Borracha Maciça Anti-Furo',
    costEb: '1.000eb',
    effect: 'Imune a perda de controle ou desaceleração por tiros nos pneus, vidros ou esteiras de pregos.',
  },
  {
    name: 'Ejetor de Fumaça e Óleo na Traseira',
    costEb: '800eb',
    effect: 'Cria uma nuvem de fumaça densa de 10m de largura ou pista escorregadia; veículos perseguidores precisam passar em DV15 Condução ou capotam.',
  },
  {
    name: 'Gaiola Interna Anti-Capotamento',
    costEb: '1.500eb',
    sdpBonus: 10,
    effect: 'Ocupantes sofrem apenas metade do dano em caso de colisão, abalroamento violento ou capotamento.',
  },
  {
    name: 'Pára-Choque Aríete Hidráulico (Ramming Prow)',
    costEb: '2.500eb',
    sdpBonus: 10,
    effect: 'Permite abalroar barricadas e outros veículos sem sofrer dano no radiador ou motor; causa +3d6 de dano de colisão extra no alvo.',
  },
  {
    name: 'Lança-Granadas Chaff & Fumaça Térmica IR',
    costEb: '2.000eb',
    effect: 'Quebra tranca de mísseis guiados por smartlink e cega sensores infravermelhos por 2 rodadas.',
  },
];
