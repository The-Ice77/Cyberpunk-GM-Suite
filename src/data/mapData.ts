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

export const NIGHT_CITY_DISTRICTS: MapDistrict[] = [
  {
    id: 'corporate-center',
    name: 'Centro Corporativo (Corporate Center)',
    zoneType: 'Corporate',
    threatLevel: 'Low',
    threatRatingNumber: 2,
    ncpdResponseTime: 'Menos de 2 minutos (Prioridade Máxima)',
    traumaTeamResponse: 'Sub-3 minutos (Cobertura Total AV-4)',
    dominantFactions: ['Arasaka', 'Militech', 'DPNC Divisão Executiva'],
    description: 'O coração financeiro reluzente da metrópole reconstruída. Arranha-céus de vidro negro e blindagem militar elevam-se acima do solo. Policiamento privado implacável e câmeras biométricas a cada metro.',
    svgPath: 'M 420 320 L 530 320 L 550 430 L 410 430 Z',
    polygonPoints: '44,35 54,36 55,44 52,49 43,49 39,44 40,38',
    centerCoords: { x: 48, y: 44 },
    shortName: 'CORP CENTER',
    strokeColor: '#10b981',
    fillColor: 'rgba(16, 185, 129, 0.22)',
    colorTheme: 'border-emerald-500 text-emerald-400 bg-emerald-950/40',
    pointsOfInterest: [
      { name: 'Cratera Memorial Arasaka (Torre Antiga)', type: 'Monumento / Zona Radioativa', description: 'O marco zero da detonação atômica de 2022. Cercado por muros de contenção e monitores Geiger constantes.', dangerLevel: 'Alto' },
      { name: 'Sede Regional da Militech', type: 'Fortaleza Corporativa', description: 'Complexo brutalista com artilharia antiaérea instalada no heliponto e guardas com exoesqueletos nas guaritas.', dangerLevel: 'Extremo se invadido' },
      { name: 'Prefeitura de Night City & Palácio da Justiça', type: 'Governo Municipal', description: 'Onde o prefeito Lucius Rhyne e o Conselho de Vereadores manobram acordos políticos e leis tributárias.', dangerLevel: 'Baixo' },
      { name: 'Club Empathy', type: 'Lounge VIP', description: 'O clube mais exclusivo da costa oeste para presidentes de empresas e investidores da bolsa.', dangerLevel: 'Baixo' },
    ],
  },
  {
    id: 'watson',
    name: 'Watson (Little China, Kabuki, NID)',
    zoneType: 'Moderate',
    threatLevel: 'High',
    threatRatingNumber: 7,
    ncpdResponseTime: '10 a 20 minutos (Raramente entram sozinhos)',
    traumaTeamResponse: '5 a 8 minutos (Requer escolta em certos becos)',
    dominantFactions: ['Tyger Claws (Kabuki)', 'Maelstrom (NID)', 'The Moxes'],
    description: 'Outrora projetado para ser o centro da prosperidade tecnológica japonesa, Watson foi abandonado após a 4ª Guerra e se transformou em uma colcha de retalhos de mercados superlotados, armazéns fabris decadentes e guerras de gangues violentas.',
    svgPath: 'M 350 140 L 560 140 L 530 320 L 420 320 L 350 250 Z',
    polygonPoints: '27,7 41,6 52,8 58,14 57,26 53,32 44,35 37,34 32,28 28,19 26,11',
    centerCoords: { x: 44, y: 24 },
    shortName: 'WATSON',
    strokeColor: '#f59e0b',
    fillColor: 'rgba(245, 158, 11, 0.20)',
    colorTheme: 'border-amber-500 text-amber-400 bg-amber-950/40',
    pointsOfInterest: [
      { name: 'The Afterlife Bar', type: 'Templo dos Mercenários', description: 'O bar lendário de Solos e Fixers fundado nas câmaras frias de um antigo necrotério.', dangerLevel: 'Médio (Trégua armada)' },
      { name: 'Mercado de Kabuki', type: 'Bazar Subterrâneo', description: 'Feira labiríntica de três andares onde se vende desde carne clonada até implantes roubados e chips de vírus.', dangerLevel: 'Médio' },
      { name: 'Clube Totentanz', type: 'Covil da Maelstrom', description: 'Fábrica abandonada transformada em clube noturno de metal extremo com média de 2 mortes por noite.', dangerLevel: 'Extremo' },
      { name: "Lizzie's Bar", type: 'Clube de Braindance', description: 'Quartel-general das Moxes decorado com neons cor-de-rosa e guardas armadas com escopetas.', dangerLevel: 'Baixo se respeitar as regras' },
    ],
  },
  {
    id: 'westbrook',
    name: 'Westbrook (Japantown & Charter Hill)',
    zoneType: 'Corporate',
    threatLevel: 'Medium',
    threatRatingNumber: 4,
    ncpdResponseTime: '3 a 7 minutos',
    traumaTeamResponse: 'Sub-4 minutos',
    dominantFactions: ['Tyger Claws', 'Arasaka', 'Segurança Privada Charter'],
    description: 'Distrito de entretenimento noturno exuberante e residências executivas de classe média-alta. As ruas de Japantown fervilham com lanternas de papel holográficas, casas de pachinko e bares sofisticados.',
    svgPath: 'M 560 160 L 720 180 L 730 360 L 550 360 L 530 240 Z',
    polygonPoints: '58,14 68,16 77,17 78,28 75,37 72,43 61,42 55,36 54,31 57,25',
    centerCoords: { x: 65, y: 32 },
    shortName: 'WESTBROOK',
    strokeColor: '#38bdf8',
    fillColor: 'rgba(56, 189, 248, 0.20)',
    colorTheme: 'border-blue-500 text-blue-400 bg-blue-950/40',
    pointsOfInterest: [
      { name: 'Santuário de Cherry Blossom', type: 'Templo Tradicional', description: 'Parque arborizado com cerejeiras geneticamente adaptadas à chuva ácida, ponto de encontro pacífico.', dangerLevel: 'Baixo' },
      { name: 'Cassino & Hotel Clouds', type: 'Complexo de Bonecas (Dolls)', description: 'Arranha-céu de alta tecnologia oferecendo experiências de acompanhantes moduladas por chips comportamentais.', dangerLevel: 'Médio' },
      { name: 'Condomínio Fechado de Charter Hill', type: 'Residencial de Luxo', description: 'Mansões protegidas por torres de metralhadoras automatizadas e guardas uniformizados com cães cibernéticos.', dangerLevel: 'Alto para invasores' },
    ],
  },
  {
    id: 'heywood',
    name: 'Heywood (The Glen & Vista Del Rey)',
    zoneType: 'Moderate',
    threatLevel: 'Medium',
    threatRatingNumber: 5,
    ncpdResponseTime: '5 a 12 minutos',
    traumaTeamResponse: '4 a 6 minutos',
    dominantFactions: ['Valentinos', 'DPNC Delegacia Central', 'Padre Ibarra'],
    description: 'Bairro vibrante e denso com enorme coração comunitário e raízes latinas. Conhecido como o "quarto de dormir" de Night City, mesclando conjuntos habitacionais modestos com prédios cívicos governamentais.',
    svgPath: 'M 330 370 L 410 430 L 400 580 L 290 560 L 300 420 Z',
    polygonPoints: '39,44 43,49 46,51 45,63 38,65 30,64 27,54 31,46',
    centerCoords: { x: 38, y: 55 },
    shortName: 'HEYWOOD',
    strokeColor: '#eab308',
    fillColor: 'rgba(234, 179, 8, 0.20)',
    colorTheme: 'border-yellow-500 text-yellow-400 bg-yellow-950/40',
    pointsOfInterest: [
      { name: 'Bar El Coyote Cojo', type: 'Ponto Comunitário', description: 'O lendário bar de Mama Welles, terra neutra dos Valentinos e coração de Heywood.', dangerLevel: 'Baixo' },
      { name: 'Delegacia Central do DPNC (The Glen)', type: 'Quartel Policial', description: 'Fortaleza de concreto com viaturas e celas de triagem rápida.', dangerLevel: 'Médio' },
      { name: 'Igreja de Nossa Senhora de Guadalupe', type: 'Centro Espiritual', description: 'Catedral gótica restaurada onde Padre Ibarra atende fiéis e media disputas de gangues.', dangerLevel: 'Baixo' },
    ],
  },
  {
    id: 'santo-domingo',
    name: 'Santo Domingo (Arroyo & Rancho Coronado)',
    zoneType: 'Industrial',
    threatLevel: 'High',
    threatRatingNumber: 6,
    ncpdResponseTime: '15 a 30 minutos',
    traumaTeamResponse: '7 a 12 minutos (Cobram taxa de zona perigosa)',
    dominantFactions: ['6th Street', 'Petrochem', 'Continental Brands'],
    description: 'O pulmão fabril decadente de Night City. Fileiras intermináveis de casinhas pré-fabricadas idênticas em Rancho Coronado espremidas sob as chaminés fumegantes das gigantescas usinas químicas de Arroyo.',
    svgPath: 'M 550 360 L 730 360 L 760 590 L 510 570 L 490 430 Z',
    polygonPoints: '61,42 72,43 78,46 79,64 68,67 56,66 56,50 58,42',
    centerCoords: { x: 67, y: 55 },
    shortName: 'SANTO DOMINGO',
    strokeColor: '#f97316',
    fillColor: 'rgba(249, 115, 22, 0.20)',
    colorTheme: 'border-orange-500 text-orange-400 bg-orange-950/40',
    pointsOfInterest: [
      { name: 'Refinaria Principal da Petrochem', type: 'Megausina Industrial', description: 'Complexo de tanques de CHOOH2 fortemente guardado por torres de vigilância e arame farpado.', dangerLevel: 'Alto' },
      { name: 'QG da 6th Street em Arroyo', type: 'Depósito Fortificado', description: 'Armazém militarizado com caminhões blindados e oficinas ilegais de armas de fogo.', dangerLevel: 'Alto' },
      { name: 'Parque Industrial de Distribuição OASIS', type: 'Centrais de Ração', description: 'Docas de carga onde carretas trazem ração sintética para alimentar as lojas de conveniência.', dangerLevel: 'Médio' },
    ],
  },
  {
    id: 'pacifica',
    name: 'Pacifica (Coastview & Playground)',
    zoneType: 'Combat Zone',
    threatLevel: 'Extreme',
    threatRatingNumber: 9,
    ncpdResponseTime: 'NENHUMA (Sem jurisdição / Polícia não entra)',
    traumaTeamResponse: 'Apenas Planos Corporativos Especializados com Escolta Pesada de AV',
    dominantFactions: ['Voodoo Boys', 'Animais (Animals)', 'Comunidade Independente'],
    description: 'O paraíso turístico planejado que faliu durante as Guerras Corporativas. Hoje é uma zona livre de lei, com hotéis cinco estrelas inacabados transformados em fortalezas de sobrevivência e mercados autônomos.',
    svgPath: 'M 260 560 L 400 580 L 420 740 L 230 730 Z',
    polygonPoints: '30,64 38,65 47,63 46,78 41,83 25,83 23,73 27,66',
    centerCoords: { x: 36, y: 74 },
    shortName: 'PACIFICA',
    strokeColor: '#c084fc',
    fillColor: 'rgba(192, 132, 252, 0.22)',
    colorTheme: 'border-purple-500 text-purple-400 bg-purple-950/40',
    pointsOfInterest: [
      { name: 'Batty’s Hotel', type: 'Cripta de Netrunning', description: 'Hotel abandonado que serve de base de operações para os melhores invasores da Rede dos Voodoo Boys.', dangerLevel: 'Extremo' },
      { name: 'Grand Imperial Mall (GIM)', type: 'Shopping em Ruínas', description: 'Shopping de proporções monumentais transformado em arena de treinamento e fortaleza armada.', dangerLevel: 'Extremo' },
      { name: 'Roda Gigante de Coastview', type: 'Monumento Decrépito', description: 'Estrutura enferrujada à beira da praia poluída, marco visual visível de toda a costa sul.', dangerLevel: 'Médio' },
    ],
  },
  {
    id: 'combat-zones',
    name: 'Zonas de Combate (Old Combat Zone & Hot Zone)',
    zoneType: 'Combat Zone',
    threatLevel: 'Extreme',
    threatRatingNumber: 10,
    ncpdResponseTime: 'ZERO (Sem serviço)',
    traumaTeamResponse: 'ZERO (Resgate cancelado automaticamente)',
    dominantFactions: ['Inquisidores', 'Bozos', 'Maelstrom', 'Scavengers'],
    description: 'Áreas da cidade onde a civilização ruiu completamente. Não há eletricidade da rede pública, água encanada ou lei. Prédios bombardeados servem de abrigo para gangues assassinas e clínicas de extração de órgãos.',
    svgPath: 'M 400 430 L 490 430 L 510 570 L 400 580 Z',
    polygonPoints: '46,51 55,49 56,62 47,63',
    centerCoords: { x: 51, y: 56 },
    shortName: 'COMBAT ZONE',
    strokeColor: '#ef4444',
    fillColor: 'rgba(239, 68, 68, 0.26)',
    colorTheme: 'border-red-600 text-red-500 bg-red-950/70',
    pointsOfInterest: [
      { name: 'Edifício Memorial da Antiga Torre Médica', type: 'Ruína Vertical', description: 'Prédio de 40 andares sem elevador habitado por dezenas de pequenos clãs em guerra constante.', dangerLevel: 'Extremo' },
      { name: 'Mercado da Meia-Noite dos Scavs', type: 'Feira Clandestina de Órgãos', description: 'Onde armas roubadas e cibernéticos arrancados de corpos frescos são leiloados sob tochas de óleo.', dangerLevel: 'Extremo' },
    ],
  },
  {
    id: 'badlands',
    name: 'Badlands (Deserto da Califórnia do Norte)',
    zoneType: 'Outskirts',
    threatLevel: 'High',
    threatRatingNumber: 7,
    ncpdResponseTime: 'Polícia Rodoviária Estadual apenas nas autoestradas principais',
    traumaTeamResponse: '15 a 30 minutos (AV-4 de longo alcance)',
    dominantFactions: ['Família Aldecaldo', 'Wraiths (Nômades Renegados)', 'Red Chrome Legion'],
    description: 'Extensões áridas e desérticas de terra vermelha que cercam Night City. Varridas por tempestades de poeira e poços de petróleo da Petrochem. Dominadas por caravanas nômades fortemente armadas.',
    svgPath: 'M 100 80 L 850 80 L 850 780 L 100 780 Z',
    polygonPoints: '78,17 96,19 96,93 49,93 45,83 79,64 78,46 76,17',
    centerCoords: { x: 82, y: 78 },
    shortName: 'BADLANDS',
    strokeColor: '#b45309',
    fillColor: 'rgba(180, 83, 9, 0.18)',
    colorTheme: 'border-amber-600 text-amber-400 bg-amber-950/40',
    pointsOfInterest: [
      { name: 'Acampamento Principal Aldecaldo', type: 'Cidade de Carretas Móvel', description: 'Centenas de trailers e tendas em círculo protegidos por atiradores de elite e drones solares.', dangerLevel: 'Baixo para amigos dos Nômades' },
      { name: 'Fazendas de Proteína da Biotechnica', type: 'Complexo de Estufas Gigantes', description: 'Quilômetros de estufas seladas cultivando algas e trigo transgênico para fabricação de CHOOH2.', dangerLevel: 'Alto para intrusos' },
      { name: 'Lixão Automotivo de Red Dirt', type: 'Cemitério de Máquinas', description: 'Milhares de carcaças de carros e AVs da guerra servindo de esconderijo para saqueadores.', dangerLevel: 'Alto' },
    ],
  },
];

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

// Find district by coordinates
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
