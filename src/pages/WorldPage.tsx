import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  CloudRain,
  Compass,
  FileText,
  Wine,
  Heart,
  AlertTriangle,
  Clock,
  Shield,
  Zap,
  Sparkles,
  ExternalLink,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Plus,
  Skull,
  Crosshair,
  Layers,
  X,
  Navigation,
  Building2,
  Bot,
  RotateCcw,
  Trash2,
  Flame,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
  Dices,
  Home,
  UtensilsCrossed,
  Train,
  Church,
  Edit3,
  Sliders,
  Wand2,
  Target,
  Radio,
  BookOpen,
  Eye,
  Copy,
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { useUserRole, CustomDistrictLocation } from '../context/UserRoleContext';
import { NIGHT_CITY_DISTRICTS, MapDistrict, isPointInPolygon, detectDistrictByCoords } from '../data/mapData';
import { seasonalWeatherTables, strangeWeatherTable, urbanEventsList, StrangeWeatherRoll, UrbanEvent, WeatherRollEntry, DISTRICT_WEATHER_NUANCES } from '../data/weatherData';
import { NIGHT_CITY_BARS, BarVenue } from '../data/barsData';
import { DATING_KEYWORDS, DATING_LOCATIONS, DATING_COMPLICATIONS } from '../data/datingData';
import { SCREAMSHEET_NETWORKS, SCREAMSHEET_TEMPLATES } from '../data/screamsheetData';
import { GANGS_LIST, GangProfile } from '../data/gangsData';
import { generateAIExtendedEncounter, generateAIScreamsheet, generateAICustomBar, generateAIDate, AIDateResult, generateAICustomMapLocation, generateAIWeatherAtmosphere, AIWeatherAtmosphereResult } from '../services/aiService';
import { NightMarketSection } from '../components/world/NightMarketSection';
import { SafeHousesSection } from '../components/world/SafeHousesSection';
import { StreetFoodDrinksSection } from '../components/world/StreetFoodDrinksSection';
import {
  SUBWAY_ENCOUNTERS_TABLE,
  HOUSES_OF_WORSHIP_TABLE,
  SubwayStrangerItem,
  HouseOfWorshipItem,
  rollSubwayEncounter,
  rollHouseOfWorship,
} from '../data/chanceOfLifetimeData';

// Gang Map Overlay Data
interface MapGangSpot {
  id: string;
  name: string;
  gangId: string;
  logo: string;
  xPct: number;
  yPct: number;
  turfText: string;
}

const MAP_GANG_SPOTS: MapGangSpot[] = [
  // Watson (North & Northwest)
  { id: 'g-maelstrom', name: 'Maelstrom', gangId: 'maelstrom', logo: '/gang_logos/Maelstrom Logo.png', xPct: 43, yPct: 20, turfText: 'Watson / NID & Totentanz' },
  { id: 'g-piranhas', name: 'Piranhas', gangId: 'piranhas', logo: '/gang_logos/Piranhas Logo.png', xPct: 40, yPct: 34, turfText: 'Watson / Marina & Little China' },
  { id: 'g-lightning', name: 'Lightning Cats', gangId: 'lightning-cats', logo: '/gang_logos/Lightning Cats Logo.png', xPct: 42, yPct: 27, turfText: 'Kabuki / Beco dos Sintetizadores' },
  { id: 'g-fixies', name: 'Fixies Couriers', gangId: 'fixies-couriers', logo: '/gang_logos/Fixies Couriers Logo.png', xPct: 44, yPct: 29, turfText: 'Corredores Expressos de Watson' },
  { id: 'g-princesses', name: 'Princesses of Justice', gangId: 'princesses-of-justice', logo: '/gang_logos/Princesses of Justice Logo.png', xPct: 46, yPct: 25, turfText: 'Kabuki / Arcades de Little China' },
  { id: 'g-mudang', name: 'Mudang Gumi', gangId: 'mudang-gumi', logo: '/gang_logos/Mudang Gumi Logo.png', xPct: 45, yPct: 22, turfText: 'Little China / Templos Subterrâneos' },
  { id: 'g-shroomers', name: 'Shroomers', gangId: 'shroomers', logo: '/gang_logos/Shroomers Logo.png', xPct: 41, yPct: 31, turfText: 'Watson / Porões Úmidos' },

  // Westbrook & City Center (East & Center)
  { id: 'g-tyger', name: 'Tyger Claws', gangId: 'tyger-claws', logo: '/gang_logos/Tyger Claws Logo.png', xPct: 62, yPct: 32, turfText: 'Westbrook / Japantown & Kabuki' },
  { id: 'g-g3', name: 'G3', gangId: 'g3', logo: '/gang_logos/G3 Logo.png', xPct: 63, yPct: 36, turfText: 'Charter Hill / Complexo Tático' },
  { id: 'g-julliard', name: 'Julliard Guild', gangId: 'julliard-guild', logo: '/gang_logos/Julliard Guild Logo.png', xPct: 65, yPct: 33, turfText: 'Westbrook / Teatros de Gala' },
  { id: 'g-muses', name: 'The Muses', gangId: 'muses', logo: '/gang_logos/Muses Logo.png', xPct: 64, yPct: 29, turfText: 'Westbrook / Galerias de Alta Moda' },
  { id: 'g-willows', name: 'The Willows', gangId: 'willows', logo: '/gang_logos/Willows Logo.png', xPct: 61, yPct: 35, turfText: 'Charter Hill / Salões de Chá de Luxo' },
  { id: 'g-culper', name: 'Culper Ring', gangId: 'culper-ring', logo: '/gang_logos/Culper Ring Logo.png', xPct: 53, yPct: 43, turfText: 'Centro Corporativo / Redes de Sombra' },
  { id: 'g-vampyres', name: 'Philharmonic Vampyres', gangId: 'philharmonic-vampyres', logo: '/gang_logos/Philharmonic Vampyres Logo.png', xPct: 50, yPct: 45, turfText: 'Centro Corporativo / Teatros Góticos' },
  { id: 'g-eurotrashers', name: 'Eurotrashers', gangId: 'eurotrashers', logo: '/gang_logos/Eurotrashers Logo.png', xPct: 55, yPct: 38, turfText: 'North Oak / Coberturas Exclusivas' },
  { id: 'g-golddragons', name: 'Gold Dragons', gangId: 'gold-dragons', logo: '/gang_logos/Gold Dragons Logo.png', xPct: 48, yPct: 26, turfText: 'Chinatown / Docas e Casas de Mahjong' },
  { id: 'g-enhanced', name: 'The Enhanced', gangId: 'enhanced', logo: '/gang_logos/Enhanced Logo.png', xPct: 47, yPct: 28, turfText: 'Centro Médico / Laboratórios Cromados' },

  // Heywood (Southwest & Central South)
  { id: 'g-valentinos', name: 'Valentinos', gangId: 'valentinos', logo: '/gang_logos/Street Queens Logo.png', xPct: 42, yPct: 54, turfText: 'Heywood / The Glen & El Coyote Cojo' },
  { id: 'g-queens', name: 'Street Queens', gangId: 'street-queens', logo: '/gang_logos/Street Queens Logo.png', xPct: 40, yPct: 51, turfText: 'Heywood / Calçadão das Boates' },
  { id: 'g-sinful', name: 'Sinful Adams', gangId: 'sinful-adams', logo: '/gang_logos/Sinful Adams Logo.png', xPct: 44, yPct: 57, turfText: 'Heywood / Cortiços de Carne Crua' },
  { id: 'g-undertow', name: 'Undertow', gangId: 'undertow', logo: '/gang_logos/Undertow Logo.png', xPct: 37, yPct: 48, turfText: 'Docas de Morro Rock & Baía' },

  // Santo Domingo (Southeast Industrial)
  { id: 'g-6th', name: '6th Street', gangId: '6th-street', logo: '/gang_logos/6th Street Logo.png', xPct: 66, yPct: 53, turfText: 'Santo Domingo / Rancho Coronado' },
  { id: 'g-iron', name: 'Iron Sights', gangId: 'iron-sights', logo: '/gang_logos/Iron Sights Logo.png', xPct: 60, yPct: 60, turfText: 'Arroyo Industrial / Silos de Ferro' },
  { id: 'g-generationred', name: 'Generation Red', gangId: 'generation-red', logo: '/gang_logos/Generation Red Logo.png', xPct: 64, yPct: 55, turfText: 'Rancho Coronado / Escolas em Ruínas' },
  { id: 'g-toecutters', name: 'ToeCutters', gangId: 'toecutters', logo: '/gang_logos/ToeCutters Logo.png', xPct: 62, yPct: 58, turfText: 'Arroyo / Desmanches e Açougues' },
  { id: 'g-killkrashers', name: 'Kill Krashers', gangId: 'kill-krashers', logo: '/gang_logos/Kill Krashers Logo.png', xPct: 67, yPct: 57, turfText: 'Arroyo / Pátios de Demolição' },
  { id: 'g-dragula', name: 'Dragula Racers', gangId: 'dragula-racers', logo: '/gang_logos/Dragula Racers Logo.png', xPct: 65, yPct: 62, turfText: 'Santo Domingo / Autoestrada dos Caixões' },
  { id: 'g-yellowbrick', name: 'Yellow Brick Road', gangId: 'yellow-brick-road', logo: '/gang_logos/Yellow Brick Road Gang.png', xPct: 69, yPct: 51, turfText: 'Colinas Orientais / Estrada Amarela' },

  // Pacifica & Coastview (Far South Coastal)
  { id: 'g-voodoo', name: 'Voodoo Boys', gangId: 'voodoo-boys', logo: '/gang_logos/Voodoo Boys Logo.png', xPct: 38, yPct: 72, turfText: 'Pacifica / Coastview & Batty\'s Hotel' },
  { id: 'g-alligators', name: 'Albino Alligators', gangId: 'albino-alligators', logo: '/gang_logos/Albino Alligators Logo.png', xPct: 35, yPct: 75, turfText: 'Esgotos Subterrâneos de Pacifica' },
  { id: 'g-bozos', name: 'Bozos', gangId: 'bozos', logo: '/gang_logos/Bozos Logo.png', xPct: 40, yPct: 78, turfText: 'Parque de Diversão em Ruínas Pacifica' },
  { id: 'g-hippies', name: 'Dirty Hippies', gangId: 'dirty-hippies', logo: '/gang_logos/Dirty Hippies Logo.png', xPct: 33, yPct: 71, turfText: 'Praias Tóxicas de Pacifica' },

  // Combat Zones (Fortified Ruins)
  { id: 'g-inquisitors', name: 'Inquisidores', gangId: 'inquisitors', logo: '/gang_logos/Inquisitors Logo.png', xPct: 48, yPct: 56, turfText: 'Zona de Combate Central / Igrejas Mortas' },
  { id: 'g-zoners', name: 'Zoners', gangId: 'zoners', logo: '/gang_logos/Zoners Logo.png', xPct: 52, yPct: 54, turfText: 'Zona de Combate / Bunkers Murados' },
  { id: 'g-reckoners', name: 'Reckoners', gangId: 'reckoners', logo: '/gang_logos/Reckoners Logo.png', xPct: 50, yPct: 58, turfText: 'Zona de Combate / Marco Zero Apocalíptico' },
  { id: 'g-wildthings', name: 'Wild Things', gangId: 'wild-things', logo: '/gang_logos/Wild Things Logo.png', xPct: 53, yPct: 50, turfText: 'Combat Zone Norte / Galpões Selvagens' },
  { id: 'g-ratkings', name: 'Rat Kings', gangId: 'rat-kings', logo: '/gang_logos/Rat Kings Logo.png', xPct: 48, yPct: 49, turfText: 'Galerias do Antigo Metrô Abandonado' },

  // Badlands & Outskirts (North, East, South)
  { id: 'g-steel', name: 'Steel Vaqueros', gangId: 'steel-vaqueros', logo: '/gang_logos/Steel Vaqueros Logo.png', xPct: 79, yPct: 75, turfText: 'Badlands Sul / Interestadual 101' },
  { id: 'g-arzintynon', name: 'Arzin Tynon', gangId: 'arzin-tynon', logo: '/gang_logos/Arzin Tynon Logo.png', xPct: 83, yPct: 71, turfText: 'Badlands / Pedágios de Chooh2' },
  { id: 'g-redchrome', name: 'Red Chrome Legion', gangId: 'red-chrome-legion', logo: '/gang_logos/Red Chrome Legion Logo.png', xPct: 74, yPct: 24, turfText: 'North Oak Periferia / Desmanches' },
  { id: 'g-deadwoods', name: 'Deadwoods', gangId: 'deadwoods', logo: '/gang_logos/Deadwoods Logo.png', xPct: 70, yPct: 18, turfText: 'Florestas Mortas ao Norte' },
  { id: 'g-tombstone', name: 'Tombstone Preservers', gangId: 'tombstone-preservers', logo: '/gang_logos/Tombstone Preservers Logo.png', xPct: 55, yPct: 22, turfText: 'Cemitério de Night City & Crematórios' },
  { id: 'g-andersons', name: 'The Andersons', gangId: 'andersons', logo: '/gang_logos/Andersons Logo.png', xPct: 58, yPct: 27, turfText: 'Little Europe / Subúrbios Nostálgicos' },
  { id: 'g-primetime', name: 'PrimeTimePlayers', gangId: 'primetime-players', logo: '/gang_logos/PrimeTimePlayers Logo.png', xPct: 56, yPct: 35, turfText: 'Estúdios de TV Abandonados' },
];

// Megacorporate Complexes & Fortresses
interface MapCorpFacility {
  id: string;
  name: string;
  corp: 'Arasaka' | 'Militech' | 'Petrochem' | 'Biotechnica' | 'Kang Tao' | 'Ziggurat' | 'Trauma Team' | 'Continental Brands' | 'Night Corp';
  districtId: string;
  type: string;
  xPct: number;
  yPct: number;
  securityRating: 'Máxima Militar' | 'Alta Corporativa' | 'Extrema / Ciberdefesa';
  description: string;
}

const MAP_CORP_FACILITIES: MapCorpFacility[] = [
  { id: 'corp-arasaka', name: 'Memorial & Antiga Torre Arasaka', corp: 'Arasaka', districtId: 'corporate-center', type: 'Marco Zero / Fortaleza', xPct: 49, yPct: 43, securityRating: 'Máxima Militar', description: 'Cratera da explosão de 2022 rodeada por torres de metralhadoras automáticas e patrulhas da Arasaka com armadura pesada.' },
  { id: 'corp-militech', name: 'Sede Regional Militech Night City', corp: 'Militech', districtId: 'corporate-center', type: 'Complexo Militar Brutalista', xPct: 52, yPct: 46, securityRating: 'Máxima Militar', description: 'Quartel corporativo blindado com artilharia antiaérea no telhado e divisão de tanques leves prontos para mobilização.' },
  { id: 'corp-petrochem', name: 'Megausina & Tanques de CHOOH2 Petrochem', corp: 'Petrochem', districtId: 'santo-domingo', type: 'Refinaria Química', xPct: 67, yPct: 59, securityRating: 'Alta Corporativa', description: 'Labirinto de tubulações sob pressão vigiado por Solos de segurança privada e torres de alarme halon.' },
  { id: 'corp-biotechnica', name: 'Complexo de Estufas Biotechnica', corp: 'Biotechnica', districtId: 'badlands', type: 'Fazendas de Proteína & Trigo Transgênico', xPct: 75, yPct: 82, securityRating: 'Alta Corporativa', description: 'Quilômetros de estufas seladas no deserto protegidas por drones de reconhecimento aéreo e cercas eletrificadas.' },
  { id: 'corp-kangtao', name: 'Centro de Pesquisa Cibernética Kang Tao', corp: 'Kang Tao', districtId: 'westbrook', type: 'Laboratório de Armas Inteligentes', xPct: 65, yPct: 37, securityRating: 'Extrema / Ciberdefesa', description: 'Instalação ultra-secreta de engenharia de smart-weapons e micro-chips sob firewall de Black ICE duplo.' },
  { id: 'corp-ziggurat', name: 'Torre Central CitiNet & Data Pool Ziggurat', corp: 'Ziggurat', districtId: 'corporate-center', type: 'Hub de Telecomunicações', xPct: 47, yPct: 48, securityRating: 'Extrema / Ciberdefesa', description: 'O cérebro digital da nova rede de Night City, com antenas parabólicas gigantes e servidores refrigerados a nitrogênio.' },
  { id: 'corp-trauma', name: 'Heliponto Central Trauma Team™ Internacional', corp: 'Trauma Team', districtId: 'corporate-center', type: 'Despacho Médico de Emergência', xPct: 45, yPct: 42, securityRating: 'Alta Corporativa', description: 'Base de lançamento imediato de canhoneiras médicas AV-4 equipadas para ressuscitação de clientes corporativos.' },
  { id: 'corp-continental', name: 'Complexo de Alimentos OASIS Continental Brands', corp: 'Continental Brands', districtId: 'santo-domingo', type: 'Sintetizador de Ração', xPct: 62, yPct: 53, securityRating: 'Alta Corporativa', description: 'Fábrica de pasta alimentícia kibble e prepack operando 24 horas sob escolta de guardas armados.' },
  { id: 'corp-nightcorp', name: 'Centro de Inteligência Urbana Night Corp', corp: 'Night Corp', districtId: 'corporate-center', type: 'Infraestrutura Urbana Secreta', xPct: 49, yPct: 40, securityRating: 'Extrema / Ciberdefesa', description: 'O misterioso consórcio gestor da infraestrutura de Night City, com firewalls indevassáveis e agentes autônomos de segurança.' },
];

// Map District Centers for Overlay Markers
interface MapDistrictZoneMarker {
  id: string;
  name: string;
  shortName: string;
  xPct: number;
  yPct: number;
  threatLevel: string;
  color: string;
  bounds: { left: number; top: number; width: number; height: number };
}

const MAP_DISTRICT_ZONES: MapDistrictZoneMarker[] = [
  { id: 'watson', name: 'Watson', shortName: 'WATSON', xPct: 45, yPct: 25, threatLevel: 'Alto', color: 'border-amber-500 text-amber-400 bg-amber-950/40', bounds: { left: 28, top: 8, width: 32, height: 30 } },
  { id: 'corporate-center', name: 'Centro Corporativo', shortName: 'CORP CENTER', xPct: 48, yPct: 46, threatLevel: 'Baixo', color: 'border-emerald-500 text-emerald-400 bg-emerald-950/40', bounds: { left: 42, top: 38, width: 18, height: 16 } },
  { id: 'westbrook', name: 'Westbrook', shortName: 'WESTBROOK', xPct: 63, yPct: 34, threatLevel: 'Médio', color: 'border-blue-500 text-blue-400 bg-blue-950/40', bounds: { left: 56, top: 22, width: 24, height: 22 } },
  { id: 'heywood', name: 'Heywood', shortName: 'HEYWOOD', xPct: 41, yPct: 54, threatLevel: 'Médio', color: 'border-amber-500 text-amber-400 bg-amber-950/40', bounds: { left: 32, top: 46, width: 22, height: 20 } },
  { id: 'santo-domingo', name: 'Santo Domingo', shortName: 'SANTO DOMINGO', xPct: 65, yPct: 56, threatLevel: 'Alto', color: 'border-orange-500 text-orange-400 bg-orange-950/40', bounds: { left: 55, top: 46, width: 25, height: 22 } },
  { id: 'pacifica', name: 'Pacifica', shortName: 'PACIFICA', xPct: 36, yPct: 73, threatLevel: 'Extremo', color: 'border-red-600 text-red-400 bg-red-950/60', bounds: { left: 26, top: 66, width: 24, height: 20 } },
  { id: 'combat-zones', name: 'Zonas de Combate', shortName: 'COMBAT ZONE', xPct: 52, yPct: 54, threatLevel: 'Extremo', color: 'border-red-600 text-red-500 bg-red-950/70', bounds: { left: 45, top: 48, width: 16, height: 18 } },
  { id: 'badlands', name: 'Badlands', shortName: 'BADLANDS', xPct: 80, yPct: 78, threatLevel: 'Alto', color: 'border-amber-600 text-amber-400 bg-amber-950/40', bounds: { left: 70, top: 60, width: 28, height: 35 } },
];

// Notable POI Pins for Overlay
interface MapPoiMarker {
  id: string;
  name: string;
  districtId: string;
  type: string;
  xPct: number;
  yPct: number;
  danger: string;
}

const MAP_POI_MARKERS: MapPoiMarker[] = [
  { id: 'poi-afterlife', name: 'The Afterlife Bar', districtId: 'watson', type: 'Bar de Mercenários', xPct: 47, yPct: 30, danger: 'Médio' },
  { id: 'poi-totentanz', name: 'Totentanz Club', districtId: 'watson', type: 'Covil Maelstrom', xPct: 44, yPct: 20, danger: 'Extremo' },
  { id: 'poi-kabuki', name: 'Mercado de Kabuki', districtId: 'watson', type: 'Bazar Noturno', xPct: 42, yPct: 26, danger: 'Médio' },
  { id: 'poi-lizzies', name: "Lizzie's Bar", districtId: 'watson', type: 'Clube Mox', xPct: 44, yPct: 33, danger: 'Baixo' },
  { id: 'poi-cherry', name: 'Santuário Cherry Blossom', districtId: 'westbrook', type: 'Parque Sagrado', xPct: 62, yPct: 30, danger: 'Baixo' },
  { id: 'poi-clouds', name: 'Hotel & Cassino Clouds', districtId: 'westbrook', type: 'Dolls Lounge', xPct: 64, yPct: 36, danger: 'Médio' },
  { id: 'poi-coyote', name: 'Bar El Coyote Cojo', districtId: 'heywood', type: 'Bar Valentinos', xPct: 42, yPct: 56, danger: 'Baixo' },
  { id: 'poi-ncpd-glen', name: 'Delegacia DPNC The Glen', districtId: 'heywood', type: 'Fortaleza Policial', xPct: 39, yPct: 52, danger: 'Médio' },
  { id: 'poi-6th-hq', name: 'QG da 6th Street', districtId: 'santo-domingo', type: 'Armazém Militar', xPct: 66, yPct: 52, danger: 'Alto' },
  { id: 'poi-battys', name: "Batty's Hotel", districtId: 'pacifica', type: 'Cripta Voodoo Boys', xPct: 35, yPct: 71, danger: 'Extremo' },
  { id: 'poi-gim', name: 'Grand Imperial Mall (GIM)', districtId: 'pacifica', type: 'Shopping em Ruínas', xPct: 38, yPct: 76, danger: 'Extremo' },
  { id: 'poi-aldecaldo', name: 'Acampamento Aldecaldo', districtId: 'badlands', type: 'Cidade de Trailers', xPct: 82, yPct: 77, danger: 'Baixo' },
];

export const WorldPage: React.FC = () => {
  const { system } = useSystem();
  const { worldState, addCustomLocation, updateCustomLocation, deleteCustomLocation } = useUserRole();
  const [activeTab, setActiveTab] = useState<'map' | 'weather' | 'encounters' | 'venues'>('map');

  // MAP ENHANCED STATE
  const viewportRef = useRef<HTMLDivElement>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('watson');
  const selectedDistrict = NIGHT_CITY_DISTRICTS.find(d => d.id === selectedDistrictId) || NIGHT_CITY_DISTRICTS[0];
  const [mapSource, setMapSource] = useState<'2045' | 'atlas'>('2045');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [filterGangs, setFilterGangs] = useState<boolean>(true);
  const [filterPOIs, setFilterPOIs] = useState<boolean>(true);
  const [filterDistricts, setFilterDistricts] = useState<boolean>(true);
  const [filterCorps, setFilterCorps] = useState<boolean>(true);
  const [filterCustomPins, setFilterCustomPins] = useState<boolean>(true);

  // Drag to pan state & draggable pins
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragDistance, setDragDistance] = useState<number>(0);
  const [draggedPinId, setDraggedPinId] = useState<string | null>(null);

  // Modals, Inspectors & Gangs Drawer
  const [selectedGang, setSelectedGang] = useState<GangProfile | null>(null);
  const [highlightedGangId, setHighlightedGangId] = useState<string | null>(null);
  const [showGangDirectory, setShowGangDirectory] = useState<boolean>(false);
  const [gangSearchTerm, setGangSearchTerm] = useState<string>('');
  const [selectedCorp, setSelectedCorp] = useState<MapCorpFacility | null>(null);
  const [selectedCustomPin, setSelectedCustomPin] = useState<any | null>(null);
  const [showAddPinModal, setShowAddPinModal] = useState<boolean>(false);
  const [newPinName, setNewPinName] = useState<string>('');
  const [newPinType, setNewPinType] = useState<string>('Clube / Bar Noturno');
  const [newPinDistrict, setNewPinDistrict] = useState<string>('watson');
  const [newPinDanger, setNewPinDanger] = useState<string>('Médio');
  const [newPinGangId, setNewPinGangId] = useState<string>('');
  const [newPinColor, setNewPinColor] = useState<string>('amber');
  const [newPinDesc, setNewPinDesc] = useState<string>('');
  const [newPinNotes, setNewPinNotes] = useState<string>('');
  const [clickCoords, setClickCoords] = useState<{ xPct: number; yPct: number } | null>(null);
  const [editingPinId, setEditingPinId] = useState<string | null>(null);
  const [newPinIcon, setNewPinIcon] = useState<string>('MapPin');
  const [enableClustering, setEnableClustering] = useState<boolean>(true);
  const [activeCluster, setActiveCluster] = useState<any | null>(null);
  const [isAiGeneratingPin, setIsAiGeneratingPin] = useState<boolean>(false);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    screenX: number;
    screenY: number;
    xPct: number;
    yPct: number;
    district: MapDistrict;
    targetPin?: CustomDistrictLocation | null;
  } | null>(null);

  // Close context menu on outside click
  useEffect(() => {
    const handleCloseCtx = () => {
      setContextMenu(null);
    };
    window.addEventListener('click', handleCloseCtx);
    return () => window.removeEventListener('click', handleCloseCtx);
  }, []);

  // Map Right-Click Context Menu Handler
  const handleMapContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!viewportRef.current) return;
    const rect = viewportRef.current.getBoundingClientRect();
    const clientXInCanvas = (e.clientX - rect.left - (rect.width / 2) - panOffset.x) / zoomLevel + (rect.width / 2);
    const clientYInCanvas = (e.clientY - rect.top - (rect.height / 2) - panOffset.y) / zoomLevel + (rect.height / 2);
    const xPct = Math.max(1, Math.min(99, Math.round((clientXInCanvas / rect.width) * 1000) / 10));
    const yPct = Math.max(1, Math.min(99, Math.round((clientYInCanvas / rect.height) * 1000) / 10));

    const detectedDistrict = detectDistrictByCoords(xPct, yPct);
    setContextMenu({
      visible: true,
      screenX: Math.min(window.innerWidth - 280, Math.max(10, e.clientX)),
      screenY: Math.min(window.innerHeight - 360, Math.max(10, e.clientY)),
      xPct,
      yPct,
      district: detectedDistrict,
      targetPin: null,
    });
  };

  // Quick AI Point Generator at Coordinates
  const handleCreatePointWithAI = async (xPct: number, yPct: number, district: MapDistrict) => {
    setIsAiGeneratingPin(true);
    try {
      const aiLoc = await generateAICustomMapLocation(district.name);
      const newPin: CustomDistrictLocation = {
        id: 'pin-ai-' + Date.now(),
        name: aiLoc.name,
        districtId: district.id,
        type: aiLoc.type,
        description: aiLoc.description,
        notes: `[Notas Secretas]: ${aiLoc.notes}\n[Boatos]: ${aiLoc.rumor}`,
        dangerLevel: aiLoc.dangerLevel,
        x: xPct,
        y: yPct,
        color: aiLoc.dangerLevel === 'Extremo' ? 'red' : aiLoc.dangerLevel === 'Alto' ? 'purple' : 'amber',
        icon: 'Sparkles',
        isAiGenerated: true,
      };
      addCustomLocation(newPin);
      setSelectedCustomPin(newPin);
      setSelectedDistrictId(district.id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiGeneratingPin(false);
      setContextMenu(null);
    }
  };

  // Open Edit Modal for existing pin
  const handleOpenEditPin = (pin: CustomDistrictLocation) => {
    setEditingPinId(pin.id);
    setNewPinName(pin.name);
    setNewPinType(pin.type);
    setNewPinDistrict(pin.districtId);
    setNewPinDanger(pin.dangerLevel);
    setNewPinColor(pin.color || 'amber');
    setNewPinIcon(pin.icon || 'MapPin');
    setNewPinGangId(pin.factionId || '');
    setNewPinDesc(pin.description || '');
    setNewPinNotes(pin.notes || '');
    setClickCoords({ xPct: pin.x ?? 50, yPct: pin.y ?? 50 });
    setShowAddPinModal(true);
    setContextMenu(null);
  };

  // Open Create Modal for new pin
  const handleOpenCreatePin = (coords?: { xPct: number; yPct: number }, distId?: string) => {
    setEditingPinId(null);
    setNewPinName('');
    setNewPinType('Clube / Bar Noturno');
    setNewPinDistrict(distId || selectedDistrictId);
    setNewPinDanger('Médio');
    setNewPinColor('amber');
    setNewPinIcon('MapPin');
    setNewPinGangId('');
    setNewPinDesc('');
    setNewPinNotes('');
    setClickCoords(coords || { xPct: 50, yPct: 50 });
    setShowAddPinModal(true);
    setContextMenu(null);
  };

  // Procedural random name for custom pin
  const handleRollRandomPinName = () => {
    const prefixes = ['Toca do', 'Bar', 'Clínica Ripper', 'Esconderijo', 'Depósito Clandestino', 'Bunker', 'Cyber-Lounge', 'Oásis do'];
    const names = ['Cromo Negro', 'Chacal', 'Dragão de Neon', 'Afterlife II', 'Zero Grau', 'Maelstrom Sul', 'Silverhand', 'Corvo Branco', 'Sombra'];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const n = names[Math.floor(Math.random() * names.length)];
    setNewPinName(`${p} ${n}`);
  };

  // Structure entities for map and cluster computation
  interface MapEntity {
    id: string;
    kind: 'gang' | 'corp' | 'poi' | 'custom';
    name: string;
    xPct: number;
    yPct: number;
    data: any;
  }

  interface MapClusterGroup {
    id: string;
    xPct: number;
    yPct: number;
    items: MapEntity[];
  }

  const mapClusters: MapClusterGroup[] = React.useMemo(() => {
    const visible: MapEntity[] = [];
    if (filterGangs) {
      MAP_GANG_SPOTS.forEach(g => visible.push({ id: g.id, kind: 'gang', name: g.name, xPct: g.xPct, yPct: g.yPct, data: g }));
    }
    if (filterCorps) {
      MAP_CORP_FACILITIES.forEach(c => visible.push({ id: c.id, kind: 'corp', name: c.name, xPct: c.xPct, yPct: c.yPct, data: c }));
    }
    if (filterPOIs) {
      MAP_POI_MARKERS.forEach(p => visible.push({ id: p.id, kind: 'poi', name: p.name, xPct: p.xPct, yPct: p.yPct, data: p }));
    }
    if (filterCustomPins) {
      worldState.customLocations.forEach(c => visible.push({ id: c.id, kind: 'custom', name: c.name, xPct: c.x ?? 50, yPct: c.y ?? 50, data: c }));
    }

    if (!enableClustering) {
      return visible.map(it => ({ id: it.id, xPct: it.xPct, yPct: it.yPct, items: [it] }));
    }

    const clusters: MapClusterGroup[] = [];
    const assigned = new Set<string>();
    const radius = 3.6 / Math.max(1, zoomLevel);

    for (let i = 0; i < visible.length; i++) {
      const it = visible[i];
      if (assigned.has(it.id)) continue;
      const group: MapEntity[] = [it];
      assigned.add(it.id);

      for (let j = i + 1; j < visible.length; j++) {
        const other = visible[j];
        if (assigned.has(other.id)) continue;
        const dist = Math.hypot(it.xPct - other.xPct, it.yPct - other.yPct);
        if (dist <= radius) {
          group.push(other);
          assigned.add(other.id);
        }
      }

      const avgX = group.reduce((acc, g) => acc + g.xPct, 0) / group.length;
      const avgY = group.reduce((acc, g) => acc + g.yPct, 0) / group.length;

      clusters.push({
        id: `c-${i}-${group.length}`,
        xPct: Math.round(avgX * 10) / 10,
        yPct: Math.round(avgY * 10) / 10,
        items: group,
      });
    }

    return clusters;
  }, [filterGangs, filterCorps, filterPOIs, filterCustomPins, worldState.customLocations, enableClustering, zoomLevel]);

  // WEATHER STATE
  const [selectedSeasonIdx, setSelectedSeasonIdx] = useState<number>(0);
  const [selectedWeatherDistrict, setSelectedWeatherDistrict] = useState<string>('watson');
  const [weatherSubTab, setWeatherSubTab] = useState<'narrative' | 'sensory' | 'tactics' | 'districts'>('narrative');
  const [isGeneratingWeatherAI, setIsGeneratingWeatherAI] = useState<boolean>(false);
  const [aiWeatherAtmosphere, setAiWeatherAtmosphere] = useState<AIWeatherAtmosphereResult | null>(null);
  const [weatherCopied, setWeatherCopied] = useState<boolean>(false);
  const [currentWeatherRoll, setCurrentWeatherRoll] = useState<{
    temperature: string;
    condition: string;
    strangeAnomaly?: StrangeWeatherRoll;
    citation: string;
    tempRoll: number;
    condRoll: number;
    entry?: WeatherRollEntry;
    districtId: string;
  } | null>(null);
  const [currentUrbanEvent, setCurrentUrbanEvent] = useState<UrbanEvent | null>(null);

  // ENCOUNTER STATE
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'night'>('night');
  const [generatedEncounter, setGeneratedEncounter] = useState<{
    rollD100: number;
    title: string;
    actors: string;
    activity: string;
    complication: string;
  } | null>(null);
  const [aiEncounter, setAiEncounter] = useState<any | null>(null);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [rolledSubway, setRolledSubway] = useState<SubwayStrangerItem | null>(null);
  const [rolledWorship, setRolledWorship] = useState<HouseOfWorshipItem | null>(null);

  // VENUES & SOCIAL STATE
  const [venueSubTab, setVenueSubTab] = useState<'bars' | 'market' | 'safehouses' | 'streetfood' | 'dating' | 'screamsheets'>('bars');
  const [barFilterTab, setBarFilterTab] = useState<'all' | 'official' | 'custom'>('all');
  const [customBars, setCustomBars] = useState<BarVenue[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpunk_custom_bars');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const allBarsList = [...customBars, ...NIGHT_CITY_BARS];
  const [selectedBar, setSelectedBar] = useState<BarVenue>(allBarsList[0]);
  const [showAddBarModal, setShowAddBarModal] = useState<boolean>(false);
  const [isGeneratingBarAI, setIsGeneratingBarAI] = useState<boolean>(false);
  const [newBarName, setNewBarName] = useState<string>('');
  const [newBarDistrict, setNewBarDistrict] = useState<string>('Watson');
  const [newBarVibe, setNewBarVibe] = useState<string>('Neons decadentes, fumaça densa e rock industrial');
  const [newBarAesthetic, setNewBarAesthetic] = useState<string>('');
  const [newBarClientele, setNewBarClientele] = useState<string>('');
  const [newBarMusic, setNewBarMusic] = useState<string>('Industrial Synth / Punk Rock');
  const [newBarSecurity, setNewBarSecurity] = useState<'Nenhuma (Faroeste)' | 'Baixa' | 'Média' | 'Pesada / Militar'>('Média');
  const [newBarDrinkName, setNewBarDrinkName] = useState<string>('Red Chrome Cocktail');
  const [newBarDrinkCost, setNewBarDrinkCost] = useState<string>('30eb');
  const [newBarDrinkCategory, setNewBarDrinkCategory] = useState<string>('Destilado Pesado');
  const [newBarDrinkGlassware, setNewBarDrinkGlassware] = useState<string>('Copo tumbler de cristal com base de chumbo');
  const [newBarDrinkVisual, setNewBarDrinkVisual] = useState<string>('Névoa rubra efervescente com borda de sal picante');
  const [newBarDrinkIngredients, setNewBarDrinkIngredients] = useState<string>('CHOOH2 destilado triplo, licor de romã ácida, pimenta tabasco');
  const [newBarDrinkTasting, setNewBarDrinkTasting] = useState<string>('Entrada doce que explode em queimação química anestesiando a garganta e aguçando a visão.');
  const [newBarDrinkEffect, setNewBarDrinkEffect] = useState<string>('+1 em Iniciativa pela próxima 1 hora');
  const [newBarDrinkSideEffect, setNewBarDrinkSideEffect] = useState<string>('Tremedeira leve nas mãos após duas doses');
  const [newBarDrinkTrivia, setNewBarDrinkTrivia] = useState<string>('Bebida preferida dos mercenários locais antes de invasões perigosas.');
  const [drinkOrderedToast, setDrinkOrderedToast] = useState<{ drinkName: string; tastingNotes: string; effect: string; glassware?: string } | null>(null);
  const [newBarRumor, setNewBarRumor] = useState<string>('Dizem que mercenários da Arasaka estão recrutando nas mesas do fundo.');

  const [generatedDate, setGeneratedDate] = useState<AIDateResult | any | null>(null);
  const [isDateAiLoading, setIsDateAiLoading] = useState<boolean>(false);
  const [dateAiPrompt, setDateAiPrompt] = useState<string>('');
  const [showDateAiOptions, setShowDateAiOptions] = useState<boolean>(false);
  const [dateAiDistrict, setDateAiDistrict] = useState<string>('Qualquer');
  const [dateAiPartnerRole, setDateAiPartnerRole] = useState<string>('Qualquer');

  const [showScreamsheetAiOptions, setShowScreamsheetAiOptions] = useState<boolean>(false);

  // Delete single custom bar
  const handleDeleteCustomBar = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir permanentemente este bar customizado?')) {
      const updated = customBars.filter(b => b.id !== id);
      setCustomBars(updated);
      localStorage.setItem('cyberpunk_custom_bars', JSON.stringify(updated));
      setSelectedBar(NIGHT_CITY_BARS[0]);
    }
  };

  // Clear all custom bars
  const handleClearAllCustomBars = () => {
    if (window.confirm('Tem certeza que deseja apagar todos os bares criados artificialmente pelo Mestre? Os locais oficiais dos livros permanecerão intactos.')) {
      setCustomBars([]);
      localStorage.removeItem('cyberpunk_custom_bars');
      setSelectedBar(NIGHT_CITY_BARS[0]);
    }
  };

  // Roll Romance Date with full bug-free structure
  const handleRollDate = () => {
    const kw1 = DATING_KEYWORDS[Math.floor(Math.random() * DATING_KEYWORDS.length)];
    const kw2 = DATING_KEYWORDS[Math.floor(Math.random() * DATING_KEYWORDS.length)];
    const loc = DATING_LOCATIONS[Math.floor(Math.random() * DATING_LOCATIONS.length)];
    const act = loc.activities[Math.floor(Math.random() * loc.activities.length)];
    const comp = DATING_COMPLICATIONS[Math.floor(Math.random() * DATING_COMPLICATIONS.length)];

    const partners = [
      { name: 'Kira "Nova" Chen', role: 'Netrunner Freelancer', style: 'Moletom holográfico, tatuagens luminosas e tênis neon com cabos trançados.' },
      { name: 'Dante "Iron" Vance', role: 'Solo Veterano de Heywood', style: 'Jaqueta militar desgastada com ombreiras de couro e ciberolho azul brilhante.' },
      { name: 'Chloe "Silk" Moreau', role: 'Executiva Júnior da Petrochem', style: 'Terno risca de giz com corte assimétrico e perfume sintético raro de orquídea.' },
      { name: 'Rocco "Spark" Rossi', role: 'Técnico de Garagem em Watson', style: 'Macacão jeans graxento, chaves de fenda no coldre e sorriso descontraído.' },
      { name: 'T-Bug "Viper" Tanaka', role: 'DJ do Totentanz / Rockerboy', style: 'Cabelo verde-limão espetado com leds cibernéticos e jaqueta cravejada de spikes.' },
      { name: 'Sora "Stitch" Morita', role: 'Cirurgiã de Rua Clandestina', style: 'Bata cirúrgica preta com detalhes em cromo e bisturi laser no pulso.' },
      { name: 'Jax "Dust" Mendoza', role: 'Nômade dos Bakkers', style: 'Bandana no pescoço, botas de couro empoeiradas e óculos de piloto espelhados.' },
      { name: 'Raven "Hex" Kelly', role: 'Bartender do Afterlife', style: 'Colete preto elegante, anéis pesados de tungstênio e fala macia e misteriosa.' },
    ];
    const partner = partners[Math.floor(Math.random() * partners.length)];

    setGeneratedDate({
      partnerName: partner.name,
      partnerRole: partner.role,
      partnerStyle: partner.style,
      keywords: [kw1.pt, kw2.pt],
      locationName: loc.locationName,
      district: loc.district,
      activity: act,
      complicationTitle: comp.title,
      complicationDesc: comp.description,
      complicationHook: comp.mechanicalHook,
      isAi: false,
    });
  };

  // AI Romance Date Generator
  const handleGenerateAIDate = async () => {
    setIsDateAiLoading(true);
    try {
      const res = await generateAIDate({
        district: dateAiDistrict === 'Qualquer' ? undefined : dateAiDistrict,
        partnerType: dateAiPartnerRole === 'Qualquer' ? undefined : dateAiPartnerRole,
        prompt: dateAiPrompt.trim() || undefined,
      });
      setGeneratedDate(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsDateAiLoading(false);
    }
  };

  // Procedural Screamsheet Roll
  const handleRollScreamsheet = () => {
    const net = SCREAMSHEET_NETWORKS[Math.floor(Math.random() * SCREAMSHEET_NETWORKS.length)];
    const tmpl = SCREAMSHEET_TEMPLATES[Math.floor(Math.random() * SCREAMSHEET_TEMPLATES.length)];
    const headline = tmpl.headlines[Math.floor(Math.random() * tmpl.headlines.length)];
    const intro = tmpl.intros[Math.floor(Math.random() * tmpl.intros.length)];
    const body = tmpl.bodies[Math.floor(Math.random() * tmpl.bodies.length)];
    const conclusion = tmpl.conclusions[Math.floor(Math.random() * tmpl.conclusions.length)];
    const gig = tmpl.gigs[Math.floor(Math.random() * tmpl.gigs.length)];

    setGeneratedScreamsheet({
      network: `${net.name} [${net.bias}]`,
      headline,
      article: `${intro} ${body} ${conclusion}`,
      hiddenGig: `${gig.objective} (Cliente: ${gig.client} | Alvo: ${gig.target} | Perigo: ${gig.dangerLevel})`,
      payout: gig.payout,
      isAi: false,
    });
  };
  const [generatedScreamsheet, setGeneratedScreamsheet] = useState<any | null>(null);
  const [screamsheetTopic, setScreamsheetTopic] = useState<string>('Escândalo de Implantes Piratas em Watson');
  const [isScreamsheetAiLoading, setIsScreamsheetAiLoading] = useState<boolean>(false);

  // AI Custom Bar Generator Handler
  const handleGenerateCustomBarAI = async () => {
    setIsGeneratingBarAI(true);
    try {
      const res = await generateAICustomBar(newBarDistrict, newBarVibe);
      setNewBarName(res.name);
      setNewBarAesthetic(res.aesthetic);
      setNewBarMusic(res.musicStyle);
      setNewBarClientele(res.clientele);
      const sec = (res.securityRating || '').toLowerCase();
      if (sec.includes('nenhuma') || sec.includes('faroeste')) setNewBarSecurity('Nenhuma (Faroeste)');
      else if (sec.includes('baixa')) setNewBarSecurity('Baixa');
      else if (sec.includes('pesada') || sec.includes('militar')) setNewBarSecurity('Pesada / Militar');
      else setNewBarSecurity('Média');
      if (res.signatureDrink) {
        setNewBarDrinkName(res.signatureDrink.name);
        setNewBarDrinkCost(res.signatureDrink.cost);
        if (res.signatureDrink.category) setNewBarDrinkCategory(res.signatureDrink.category);
        if (res.signatureDrink.glassware) setNewBarDrinkGlassware(res.signatureDrink.glassware);
        if (res.signatureDrink.visualServing) setNewBarDrinkVisual(res.signatureDrink.visualServing);
        if (res.signatureDrink.ingredients) {
          setNewBarDrinkIngredients(Array.isArray(res.signatureDrink.ingredients) ? res.signatureDrink.ingredients.join(', ') : res.signatureDrink.ingredients);
        }
        if (res.signatureDrink.tastingNotes) setNewBarDrinkTasting(res.signatureDrink.tastingNotes);
        setNewBarDrinkEffect(res.signatureDrink.inGameEffect);
        if (res.signatureDrink.sideEffect) setNewBarDrinkSideEffect(res.signatureDrink.sideEffect);
        if (res.signatureDrink.loreTrivia) setNewBarDrinkTrivia(res.signatureDrink.loreTrivia);
      }
      if (res.localRumors && res.localRumors.length > 0) {
        setNewBarRumor(res.localRumors[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingBarAI(false);
    }
  };

  // Order drink toast handler
  const handleOrderDrink = (drink: any) => {
    setDrinkOrderedToast({
      drinkName: drink.name,
      tastingNotes: drink.tastingNotes || drink.description,
      effect: drink.inGameEffect,
      glassware: drink.glassware,
    });
  };

  // Save Custom Bar
  const handleSaveCustomBar = () => {
    if (!newBarName.trim()) return;
    const newBar: BarVenue = {
      id: 'custom-bar-' + Date.now(),
      name: newBarName.trim(),
      district: newBarDistrict,
      securityRating: newBarSecurity,
      aesthetic: newBarAesthetic || 'Bar urbano decorado com painéis de neon e balcão de zinco oxidado.',
      clientele: newBarClientele || 'Mercenários, solos e fixers locais.',
      musicStyle: newBarMusic || 'Punk Rock e Eletrônico.',
      signatureDrink: {
        name: newBarDrinkName,
        cost: newBarDrinkCost,
        category: newBarDrinkCategory as any,
        glassware: newBarDrinkGlassware,
        visualServing: newBarDrinkVisual,
        ingredients: newBarDrinkIngredients.split(',').map(i => i.trim()).filter(Boolean),
        tastingNotes: newBarDrinkTasting,
        description: newBarDrinkTasting || 'Bebida artesanal energética destilada com xarope sintético de frutas.',
        inGameEffect: newBarDrinkEffect,
        sideEffect: newBarDrinkSideEffect,
        loreTrivia: newBarDrinkTrivia,
      },
      localRumors: newBarRumor ? [newBarRumor] : ['Rumores de negociações ilícitas no estacionamento.'],
      citation: 'Bar Customizado do Mestre',
    };
    const updated = [newBar, ...customBars];
    setCustomBars(updated);
    setSelectedBar(newBar);
    localStorage.setItem('cyberpunk_custom_bars', JSON.stringify(updated));
    setShowAddBarModal(false);
  };

  // Roll Weather handler (with rich narrative & sensory details)
  const handleRollWeather = () => {
    const season = seasonalWeatherTables[selectedSeasonIdx];
    const tempRoll = Math.floor(Math.random() * 6);
    const condRoll = Math.floor(Math.random() * 6);
    const tempEntry = season.rolls[tempRoll];
    const condEntry = season.rolls[condRoll];

    let strangeAnomaly: StrangeWeatherRoll | undefined = undefined;
    if (condRoll === 5) {
      const strangeIdx = Math.floor(Math.random() * strangeWeatherTable.length);
      strangeAnomaly = strangeWeatherTable[strangeIdx];
    }

    setCurrentWeatherRoll({
      temperature: tempEntry.temperature,
      condition: condEntry.condition,
      strangeAnomaly,
      citation: strangeAnomaly ? strangeAnomaly.citation : 'Night City Weather DLC pp. 2-5',
      tempRoll: tempRoll + 1,
      condRoll: condRoll + 1,
      entry: condEntry,
      districtId: selectedWeatherDistrict,
    });
    setAiWeatherAtmosphere(null);
  };

  const handleGenerateWeatherAI = async () => {
    if (!currentWeatherRoll) return;
    setIsGeneratingWeatherAI(true);
    try {
      const season = seasonalWeatherTables[selectedSeasonIdx];
      const districtNuance = DISTRICT_WEATHER_NUANCES[selectedWeatherDistrict];
      const result = await generateAIWeatherAtmosphere({
        season: season.season,
        temperature: currentWeatherRoll.temperature,
        condition: currentWeatherRoll.condition,
        districtName: districtNuance ? districtNuance.districtName : selectedWeatherDistrict,
        strangeAnomalyName: currentWeatherRoll.strangeAnomaly?.namePt,
      });
      setAiWeatherAtmosphere(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingWeatherAI(false);
    }
  };

  const handleCopyWeatherNarration = (text: string) => {
    navigator.clipboard.writeText(text);
    setWeatherCopied(true);
    setTimeout(() => setWeatherCopied(false), 2500);
  };

  const handleRollUrbanEvent = () => {
    const ev = urbanEventsList[Math.floor(Math.random() * urbanEventsList.length)];
    setCurrentUrbanEvent(ev);
  };

  // Roll Encounters
  const handleRollEncounter = () => {
    const d100 = Math.floor(Math.random() * 100) + 1;
    const activities = [
      'Discutindo aos gritos sobre um pagamento atrasado em frente a uma loja de conveniência.',
      'Fazendo manutenção em uma moto tunada com escapamento aberto e cheiro forte de CHOOH2.',
      'Tentando forçar a fechadura eletrônica de uma porta corta-fogo com um pé de cabra.',
      'Vendendo chips de braindance piratas em um beco escuro.',
      'Observando o movimento com binóculos de cima de uma marquise.',
      'Sendo encurralados por uma patrulha civil que exige identificação imediata.',
    ];
    const complications = [
      'Uma sirene de viatura do DPNC soa no início do quarteirão.',
      'Um dos envolvidos saca uma granada de fumaça e a joga no chão ao notar aproximação.',
      'Câmeras corporativas de reconhecimento facial iniciam varredura na esquina.',
      'Dois atiradores em uma van blindada dobram a esquina em alta velocidade.',
    ];

    let title = 'Encontro Casual de Esquina';
    let actors = 'Gangers locais em disputa territorial';
    if (d100 > 80) {
      title = 'Alerta Máximo: Equipe de Operações Corporativas';
      actors = '4 Agentes de Segurança Armada escoltando uma maleta lacrada';
    } else if (d100 > 60) {
      title = 'Tensão Armada de Gangue';
      actors = '6 Membros armados cobrando pedágio de pedestres';
    } else if (d100 > 40) {
      title = 'Fixer e Mercenário em Negociação';
      actors = 'Um corretor de contratos elegante e dois seguranças cibernéticos';
    }

    setGeneratedEncounter({
      rollD100: d100,
      title,
      actors,
      activity: activities[Math.floor(Math.random() * activities.length)],
      complication: complications[Math.floor(Math.random() * complications.length)],
    });
  };

  // AI Encounter Generation
  const handleGenerateAIEncounter = async () => {
    setIsAiLoading(true);
    try {
      const res = await generateAIExtendedEncounter(selectedDistrict.name, timeOfDay === 'day' ? 'Dia' : 'Noite');
      setAiEncounter(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  // AI Screamsheet Generation
  const handleGenerateAIScreamsheet = async () => {
    setIsScreamsheetAiLoading(true);
    try {
      const res = await generateAIScreamsheet(screamsheetTopic);
      setGeneratedScreamsheet({
        ...res,
        isAi: true,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsScreamsheetAiLoading(false);
    }
  };

  // Non-passive wheel event listener on viewportRef to prevent scrolling page while zooming
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const step = e.deltaY < 0 ? 0.2 : -0.2;
      setZoomLevel(prev => Math.min(3, Math.max(1, +(prev + step).toFixed(2))));
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Clamp panOffset whenever zoomLevel changes so the map never flees the screen
  useEffect(() => {
    if (zoomLevel === 1) {
      setPanOffset({ x: 0, y: 0 });
      return;
    }
    const el = viewportRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const maxPanX = (rect.width * (zoomLevel - 1)) / 2;
    const maxPanY = (rect.height * (zoomLevel - 1)) / 2;
    setPanOffset(prev => ({
      x: Math.max(-maxPanX, Math.min(maxPanX, prev.x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, prev.y)),
    }));
  }, [zoomLevel]);

  // Center and highlight gang on tactical map
  const focusGangOnMap = (gang: GangProfile) => {
    setSelectedGang(gang);
    setHighlightedGangId(gang.id);
    const spot = MAP_GANG_SPOTS.find(s => s.gangId === gang.id);
    if (spot && viewportRef.current) {
      const rect = viewportRef.current.getBoundingClientRect();
      const targetZoom = Math.max(zoomLevel, 1.6);
      setZoomLevel(targetZoom);
      const maxPanX = (rect.width * (targetZoom - 1)) / 2;
      const maxPanY = (rect.height * (targetZoom - 1)) / 2;
      const offsetX = -1 * ((spot.xPct - 50) / 100) * rect.width;
      const offsetY = -1 * ((spot.yPct - 50) / 100) * rect.height;
      setPanOffset({
        x: Math.max(-maxPanX, Math.min(maxPanX, offsetX)),
        y: Math.max(-maxPanY, Math.min(maxPanY, offsetY)),
      });
    }
  };

  // Drag handlers for map and draggable custom pins
  const onMouseDownMap = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // left click only
    setIsDragging(true);
    setDragDistance(0);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const onTouchStartMap = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragDistance(0);
    setDragStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
  };

  const onMouseMoveMap = (e: React.MouseEvent) => {
    // 1. Draggable Pin repositioning
    if (draggedPinId && viewportRef.current) {
      const rect = viewportRef.current.getBoundingClientRect();
      const clientXInCanvas = (e.clientX - rect.left - (rect.width / 2) - panOffset.x) / zoomLevel + (rect.width / 2);
      const clientYInCanvas = (e.clientY - rect.top - (rect.height / 2) - panOffset.y) / zoomLevel + (rect.height / 2);
      const xPct = Math.max(2, Math.min(98, Math.round((clientXInCanvas / rect.width) * 100)));
      const yPct = Math.max(2, Math.min(98, Math.round((clientYInCanvas / rect.height) * 100)));
      updateCustomLocation(draggedPinId, { x: xPct, y: yPct });
      return;
    }

    // 2. Viewport pan with mathematical edge containment
    if (!isDragging || !viewportRef.current) return;
    setDragDistance(prev => prev + Math.abs(e.movementX) + Math.abs(e.movementY));
    const rect = viewportRef.current.getBoundingClientRect();
    const maxPanX = (rect.width * (zoomLevel - 1)) / 2;
    const maxPanY = (rect.height * (zoomLevel - 1)) / 2;
    const rawX = e.clientX - dragStart.x;
    const rawY = e.clientY - dragStart.y;
    setPanOffset({
      x: Math.max(-maxPanX, Math.min(maxPanX, rawX)),
      y: Math.max(-maxPanY, Math.min(maxPanY, rawY)),
    });
  };

  const onTouchMoveMap = (e: React.TouchEvent) => {
    if (!isDragging || !viewportRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const rawX = touch.clientX - dragStart.x;
    const rawY = touch.clientY - dragStart.y;
    const dist = Math.hypot(rawX - panOffset.x, rawY - panOffset.y);
    setDragDistance(prev => prev + dist);
    const rect = viewportRef.current.getBoundingClientRect();
    const maxPanX = (rect.width * (zoomLevel - 1)) / 2;
    const maxPanY = (rect.height * (zoomLevel - 1)) / 2;
    setPanOffset({
      x: Math.max(-maxPanX, Math.min(maxPanX, rawX)),
      y: Math.max(-maxPanY, Math.min(maxPanY, rawY)),
    });
  };

  const onMouseUpMap = () => {
    setIsDragging(false);
    setDraggedPinId(null);
  };

  const onTouchEndMap = () => {
    setIsDragging(false);
    setDraggedPinId(null);
  };

  const resetMapView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setHighlightedGangId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header & Sub-tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            <span>Mundo & Night City</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Mapa tático de distritos, fortalezas de megacorporações, clima cáustico e geradores de rua.
          </p>
        </div>

        {/* Sub-tabs pills */}
        <div className="flex items-center gap-1 bg-[#14141a] border border-[#27272a] rounded-xl p-1 text-xs font-medium overflow-x-auto no-scrollbar max-w-full whitespace-nowrap">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'map' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Mapa Tático Interativo
          </button>
          <button
            onClick={() => setActiveTab('weather')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'weather' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Clima & Eventos
          </button>
          <button
            onClick={() => setActiveTab('encounters')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${activeTab === 'encounters' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Encontros de Rua</span>
          </button>
          <button
            onClick={() => setActiveTab('venues')}
            className={`px-3 py-1.5 rounded-md transition ${activeTab === 'venues' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
          >
            Bares, Mercado Negro, Dating & Notícias
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: INTERACTIVE MAP */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          {/* Map Controls Toolbar */}
          <div className="p-3.5 rounded-2xl bg-[#121217] border border-[#27272a] flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
            {/* Left: Map Cartography Source Switcher */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-zinc-400 font-semibold uppercase text-[11px] flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-500" />
                <span>Base Cartográfica:</span>
              </span>
              <div className="flex items-center bg-[#0a0a0d] border border-[#27272a] rounded-lg p-0.5">
                <button
                  onClick={() => setMapSource('2045')}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition ${
                    mapSource === '2045'
                      ? 'bg-red-600 text-white font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Night City 2045
                </button>
                <button
                  onClick={() => setMapSource('atlas')}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition ${
                    mapSource === 'atlas'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Atlas HD (Saga MacKenzie)
                </button>
              </div>
            </div>

            {/* Middle: Overlay Layer Filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-zinc-500 font-mono text-[11px]">Filtros:</span>
              <button
                onClick={() => setFilterDistricts(p => !p)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition ${
                  filterDistricts ? 'bg-zinc-800 border-zinc-600 text-zinc-200 font-semibold' : 'bg-transparent border-zinc-800 text-zinc-500 line-through'
                }`}
              >
                Distritos
              </button>
              <button
                onClick={() => setFilterGangs(p => !p)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition flex items-center gap-1 ${
                  filterGangs ? 'bg-zinc-800 border-red-700/80 text-red-300 font-semibold' : 'bg-transparent border-zinc-800 text-zinc-500 line-through'
                }`}
              >
                <Skull className="w-3 h-3 text-red-500" />
                <span>Gangues (43 Brasões)</span>
              </button>
              <button
                onClick={() => setFilterCorps(p => !p)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition flex items-center gap-1 ${
                  filterCorps ? 'bg-zinc-800 border-cyan-700/80 text-cyan-300 font-semibold' : 'bg-transparent border-zinc-800 text-zinc-500 line-through'
                }`}
              >
                <Building2 className="w-3 h-3 text-cyan-400" />
                <span>Megacorporações</span>
              </button>
              <button
                onClick={() => setFilterPOIs(p => !p)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition flex items-center gap-1 ${
                  filterPOIs ? 'bg-zinc-800 border-zinc-600 text-zinc-300 font-semibold' : 'bg-transparent border-zinc-800 text-zinc-500 line-through'
                }`}
              >
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>POIs de Rua</span>
              </button>
              <button
                onClick={() => setFilterCustomPins(p => !p)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition flex items-center gap-1 ${
                  filterCustomPins ? 'bg-zinc-800 border-amber-700/80 text-amber-300 font-semibold' : 'bg-transparent border-zinc-800 text-zinc-500 line-through'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Pins do Mestre ({worldState.customLocations.length})</span>
              </button>

              <button
                onClick={() => setEnableClustering(p => !p)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition flex items-center gap-1 ${
                  enableClustering
                    ? 'bg-purple-950/70 border-purple-500 text-purple-300 font-bold shadow-sm'
                    : 'bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
                title="Agrupa marcadores muito próximos para evitar sobreposição caótica no mapa"
              >
                <Layers className="w-3 h-3 text-purple-400" />
                <span>Agrupar Pontos ({enableClustering ? 'Ativo' : 'Desligado'})</span>
              </button>
            </div>

            {/* Right: Zoom Controls, Pan Reset & Add Custom Pin */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-[#0a0a0d] border border-[#27272a] rounded-lg p-0.5">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(1, prev - 0.25))}
                  className="p-1 text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
                  disabled={zoomLevel <= 1}
                  title="Diminuir Zoom"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono text-[10px] text-zinc-300 min-w-[42px] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.25))}
                  className="p-1 text-zinc-400 hover:text-zinc-200 disabled:opacity-30"
                  disabled={zoomLevel >= 2.5}
                  title="Aumentar Zoom"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={resetMapView}
                  className="px-2 py-0.5 text-[10px] font-mono text-zinc-400 hover:text-zinc-200 border-l border-zinc-800 flex items-center gap-1"
                  title="Resetar Zoom e Posição"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              </div>

              <button
                onClick={() => {
                  setClickCoords({ xPct: 50, yPct: 50 });
                  setShowAddPinModal(true);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium flex items-center gap-1.5 transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Criar Ponto</span>
              </button>
            </div>
          </div>

          {/* Interactive Map Canvas + Inspector Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Real Map Viewport with Drag-to-Pan (8 cols) */}
            <div className="lg:col-span-8 p-3 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1">
                <span>
                  MAPA: <strong className="text-zinc-200">{mapSource === '2045' ? 'NIGHT CITY 2045 (CORE RED)' : 'ATLAS HD (SAGA MACKENZIE)'}</strong>
                </span>
                <span className="text-[11px] text-zinc-500">
                  Clique e arraste com o mouse para mover • Roda do mouse amplia
                </span>
              </div>

              {/* Viewport Box */}
              <div
                ref={viewportRef}
                className="relative w-full aspect-[4/3] bg-[#09090c] rounded-xl border border-[#1f1f26] overflow-hidden select-none shadow-inner"
                onMouseDown={onMouseDownMap}
                onMouseMove={onMouseMoveMap}
                onMouseUp={onMouseUpMap}
                onMouseLeave={onMouseUpMap}
                onTouchStart={onTouchStartMap}
                onTouchMove={onTouchMoveMap}
                onTouchEnd={onTouchEndMap}
                onContextMenu={handleMapContextMenu}
                style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
                onClick={e => {
                  if (dragDistance > 6) return;
                  if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === 'IMG') {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clientXInCanvas = (e.clientX - rect.left - (rect.width / 2) - panOffset.x) / zoomLevel + (rect.width / 2);
                    const clientYInCanvas = (e.clientY - rect.top - (rect.height / 2) - panOffset.y) / zoomLevel + (rect.height / 2);
                    const xPct = Math.max(2, Math.min(98, Math.round((clientXInCanvas / rect.width) * 100)));
                    const yPct = Math.max(2, Math.min(98, Math.round((clientYInCanvas / rect.height) * 100)));
                    setClickCoords({ xPct, yPct });
                    setShowAddPinModal(true);
                  }
                }}
              >
                <div
                  className="relative w-full h-full transition-transform duration-75 origin-center"
                  style={{
                    transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(${zoomLevel})`,
                    transformOrigin: 'center center',
                  }}
                >
                  {/* Official High-Resolution Map Image */}
                  <img
                    src={mapSource === '2045' ? '/nc_2045_map_0.jpg' : '/map_extract_0.jpg'}
                    alt="Night City Map"
                    className="w-full h-full object-cover rounded-lg filter brightness-90 contrast-105 pointer-events-none select-none"
                    draggable={false}
                  />

                  {/* 1. PRECISE VECTOR DISTRICT POLYGONS (SEGUINDO AS LINHAS DO MAPA) */}
                  {filterDistricts && (
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    >
                      <defs>
                        <filter id="neon-district-glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="0.8" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      {NIGHT_CITY_DISTRICTS.map(district => {
                        const isSelected = selectedDistrictId === district.id;
                        return (
                          <polygon
                            key={district.id}
                            points={district.polygonPoints}
                            fill={isSelected ? district.fillColor.replace('0.20', '0.38').replace('0.22', '0.40').replace('0.18', '0.35') : district.fillColor}
                            stroke={district.strokeColor}
                            strokeWidth={isSelected ? '0.7' : '0.32'}
                            strokeDasharray={isSelected ? undefined : '1.4 0.7'}
                            filter={isSelected ? 'url(#neon-district-glow)' : undefined}
                            className="pointer-events-auto cursor-pointer transition-all duration-200 hover:brightness-150"
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedDistrictId(district.id);
                            }}
                          >
                            <title>{`${district.name} (${district.threatLevel})`}</title>
                          </polygon>
                        );
                      })}
                    </svg>
                  )}

                  {/* 2. CENTER DISTRICT SECTOR BADGES */}
                  {filterDistricts &&
                    NIGHT_CITY_DISTRICTS.map(d => {
                      const isSelected = selectedDistrictId === d.id;
                      return (
                        <div
                          key={`badge-${d.id}`}
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedDistrictId(d.id);
                          }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-15 transition group pointer-events-auto"
                          style={{ left: `${d.centerCoords.x}%`, top: `${d.centerCoords.y}%` }}
                        >
                          <div
                            className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-bold tracking-wider backdrop-blur-md shadow-md transition transform group-hover:scale-110 ${
                              isSelected
                                ? 'bg-red-600 text-white border-white ring-2 ring-red-400 scale-105'
                                : `${d.colorTheme} hover:brightness-125`
                            }`}
                          >
                            {d.shortName}
                          </div>
                        </div>
                      );
                    })}

                  {/* 3. CLUSTERED & INDIVIDUAL MAP MARKERS (PREVENÇÃO DE SOBREPOSIÇÃO) */}
                  {mapClusters.map(cluster => {
                    // CASE A: CLUSTER OF MULTIPLE OVERLAPPING POINTS
                    if (cluster.items.length > 1) {
                      const hasGang = cluster.items.some(it => it.kind === 'gang');
                      const hasCustom = cluster.items.some(it => it.kind === 'custom');
                      const hasCorp = cluster.items.some(it => it.kind === 'corp');
                      return (
                        <div
                          key={cluster.id}
                          onClick={e => {
                            e.stopPropagation();
                            setActiveCluster(cluster);
                          }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group pointer-events-auto"
                          style={{ left: `${cluster.xPct}%`, top: `${cluster.yPct}%` }}
                          title={`${cluster.items.length} locais agrupados neste ponto (Clique para expandir)`}
                        >
                          <div className="relative">
                            <div className="px-2 py-1 rounded-full bg-purple-950/90 border-2 border-purple-400 text-purple-200 font-mono text-[11px] font-bold shadow-2xl flex items-center gap-1 group-hover:scale-125 transition ring-2 ring-purple-600/50 backdrop-blur-md">
                              {hasGang ? (
                                <Skull className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                              ) : hasCustom ? (
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                              ) : hasCorp ? (
                                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                              ) : (
                                <Layers className="w-3.5 h-3.5 text-purple-400" />
                              )}
                              <span>{cluster.items.length}</span>
                            </div>
                            <span className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 -bottom-5 whitespace-nowrap bg-black/95 text-purple-300 border border-purple-700 text-[9px] font-mono px-2 py-0.5 rounded shadow-xl pointer-events-none z-50">
                              {cluster.items.length} locais próximos (Clique para abrir)
                            </span>
                          </div>
                        </div>
                      );
                    }

                    // CASE B: SINGLE MARKER
                    const item = cluster.items[0];

                    // B.1 Gang Marker
                    if (item.kind === 'gang') {
                      const spot = item.data;
                      const isHighlighted = highlightedGangId === spot.gangId;
                      return (
                        <div
                          key={spot.id}
                          onClick={e => {
                            e.stopPropagation();
                            const gData = GANGS_LIST.find(g => g.id === spot.gangId) || null;
                            if (gData) focusGangOnMap(gData);
                          }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group transition pointer-events-auto ${
                            isHighlighted ? 'scale-125 z-40' : ''
                          }`}
                          style={{ left: `${spot.xPct}%`, top: `${spot.yPct}%` }}
                          title={`Gangue: ${spot.name} (${spot.turfText}) - Clique para ver território`}
                        >
                          <div className="relative">
                            <div
                              className={`w-8 h-8 rounded-full bg-[#0a0a0d]/90 p-0.5 shadow-lg group-hover:scale-125 transition flex items-center justify-center overflow-hidden border ${
                                isHighlighted
                                  ? 'border-red-400 ring-4 ring-red-500/80 animate-pulse bg-red-950'
                                  : 'border-red-500/80 group-hover:border-red-400'
                              }`}
                            >
                              <img
                                src={spot.logo}
                                alt={spot.name}
                                className="w-full h-full object-contain filter drop-shadow"
                                onError={(e: any) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                            <span className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 -bottom-5 whitespace-nowrap bg-black/95 text-red-300 border border-red-700 text-[9px] font-mono px-1.5 py-0.5 rounded shadow-lg pointer-events-none z-40">
                              {spot.name}
                            </span>
                          </div>
                        </div>
                      );
                    }

                    // B.2 Corp Facility Marker
                    if (item.kind === 'corp') {
                      const corp = item.data;
                      return (
                        <div
                          key={corp.id}
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedCorp(corp);
                          }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-25 group transition pointer-events-auto"
                          style={{ left: `${corp.xPct}%`, top: `${corp.yPct}%` }}
                          title={`Corporação: ${corp.name} (${corp.securityRating})`}
                        >
                          <div className="p-1 rounded-md bg-[#0a0a0d]/95 border border-cyan-400 text-cyan-300 shadow-xl group-hover:scale-125 group-hover:border-white transition flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                          </div>
                          <span className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 -bottom-5 whitespace-nowrap bg-black/95 text-cyan-300 border border-cyan-600 text-[9px] font-mono px-1.5 py-0.5 rounded shadow-lg pointer-events-none z-40">
                            🏢 {corp.name}
                          </span>
                        </div>
                      );
                    }

                    // B.3 Official POI Marker
                    if (item.kind === 'poi') {
                      const poi = item.data;
                      return (
                        <div
                          key={poi.id}
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedDistrictId(poi.districtId);
                          }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-15 group transition pointer-events-auto"
                          style={{ left: `${poi.xPct}%`, top: `${poi.yPct}%` }}
                          title={`${poi.name} (${poi.type})`}
                        >
                          <div className="p-1 rounded-full bg-amber-950/80 border border-amber-400 text-amber-300 shadow-md group-hover:scale-125 transition">
                            <MapPin className="w-3 h-3" />
                          </div>
                          <span className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 -bottom-5 whitespace-nowrap bg-black/95 text-amber-200 border border-amber-700 text-[9px] font-mono px-1.5 py-0.5 rounded shadow-lg pointer-events-none z-40">
                            {poi.name}
                          </span>
                        </div>
                      );
                    }

                    // B.4 Custom GM Pin
                    if (item.kind === 'custom') {
                      const loc = item.data;
                      const x = loc.x ?? 50;
                      const y = loc.y ?? 50;
                      const isBeingDragged = draggedPinId === loc.id;
                      return (
                        <div
                          key={loc.id}
                          onPointerDown={e => {
                            e.stopPropagation();
                            setDraggedPinId(loc.id);
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedDistrictId(loc.districtId);
                            setSelectedCustomPin(loc);
                          }}
                          onContextMenu={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            const dist = NIGHT_CITY_DISTRICTS.find(d => d.id === loc.districtId) || NIGHT_CITY_DISTRICTS[0];
                            setContextMenu({
                              visible: true,
                              screenX: Math.min(window.innerWidth - 280, Math.max(10, e.clientX)),
                              screenY: Math.min(window.innerHeight - 360, Math.max(10, e.clientY)),
                              xPct: x,
                              yPct: y,
                              district: dist,
                              targetPin: loc,
                            });
                          }}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing z-30 group transition-transform pointer-events-auto ${
                            isBeingDragged ? 'scale-150 z-50 ring-4 ring-amber-400 rounded-full' : ''
                          }`}
                          style={{ left: `${x}%`, top: `${y}%` }}
                          title={`Marcador: ${loc.name} (Clique direito para opções / Arraste para mover)`}
                        >
                          <div
                            className={`p-1 rounded-full border shadow-lg group-hover:scale-125 transition ${
                              loc.color === 'red'
                                ? 'bg-red-950/90 border-red-500 text-red-300'
                                : loc.color === 'cyan'
                                ? 'bg-cyan-950/90 border-cyan-500 text-cyan-300'
                                : loc.color === 'purple'
                                ? 'bg-purple-950/90 border-purple-500 text-purple-300'
                                : loc.color === 'emerald'
                                ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300'
                                : 'bg-amber-950/90 border-amber-400 text-amber-300'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <span className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 -bottom-5 whitespace-nowrap bg-black/95 text-amber-300 border border-amber-600 text-[9px] font-mono px-1.5 py-0.5 rounded shadow-lg pointer-events-none z-40">
                            ★ {loc.name} (Botão direito para editar)
                          </span>
                        </div>
                      );
                    }

                    return null;
                  })}

                  {/* 4. ACTIVE CLUSTER POPOVER (SPIDERFY EXPANDED CARD) */}
                  {activeCluster && (
                    <div
                      className="absolute z-50 p-4 rounded-2xl bg-[#0c0c12]/95 border-2 border-purple-500 shadow-2xl backdrop-blur-md w-72 space-y-3 pointer-events-auto animate-in fade-in zoom-in-95 duration-150"
                      style={{
                        left: `${Math.min(72, Math.max(28, activeCluster.xPct))}%`,
                        top: `${Math.min(70, Math.max(25, activeCluster.yPct))}%`,
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                        <div className="flex items-center gap-1.5 font-mono text-purple-300 font-bold text-xs">
                          <Layers className="w-4 h-4 text-purple-400" />
                          <span>{activeCluster.items.length} Pontos Agrupados</span>
                        </div>
                        <button
                          onClick={() => setActiveCluster(null)}
                          className="p-1 rounded text-zinc-400 hover:text-zinc-200"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 divide-y divide-zinc-800/60 font-sans text-xs">
                        {activeCluster.items.map((it: any) => (
                          <div
                            key={it.id}
                            onClick={() => {
                              if (it.kind === 'gang') {
                                const g = GANGS_LIST.find(gx => gx.id === it.data.gangId);
                                if (g) focusGangOnMap(g);
                              } else if (it.kind === 'corp') {
                                setSelectedCorp(it.data);
                              } else if (it.kind === 'poi') {
                                setSelectedDistrictId(it.data.districtId);
                              } else if (it.kind === 'custom') {
                                setSelectedCustomPin(it.data);
                                setSelectedDistrictId(it.data.districtId);
                              }
                              setActiveCluster(null);
                            }}
                            className="pt-1.5 first:pt-0 p-1.5 rounded-lg hover:bg-zinc-800/60 cursor-pointer transition flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <span className="font-bold text-zinc-200 truncate group-hover:text-purple-300">
                                {it.name}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 uppercase flex-shrink-0">
                              {it.kind === 'gang' ? 'Gangue' : it.kind === 'corp' ? 'Corp' : it.kind === 'custom' ? 'Meu Pin' : 'POI'}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-zinc-800 flex gap-2">
                        <button
                          onClick={() => {
                            setZoomLevel(prev => Math.min(2.5, prev + 0.5));
                            setPanOffset({
                              x: (50 - activeCluster.xPct) * 4,
                              y: (50 - activeCluster.yPct) * 4,
                            });
                            setActiveCluster(null);
                          }}
                          className="flex-1 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span>Ampliar (+Zoom)</span>
                        </button>
                        <button
                          onClick={() => setActiveCluster(null)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono"
                        >
                          Fechar
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 5. FLOATING RIGHT-CLICK CONTEXT MENU (PODER DE EDITAR DO LUGAR) */}
                  {contextMenu && contextMenu.visible && (
                    <div
                      className="fixed z-50 w-64 p-3 rounded-2xl bg-[#0e0e14]/98 border-2 border-red-500/80 shadow-2xl backdrop-blur-md text-xs font-sans space-y-2 animate-in fade-in zoom-in-95 duration-100"
                      style={{
                        left: `${contextMenu.screenX}px`,
                        top: `${contextMenu.screenY}px`,
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="border-b border-zinc-800 pb-2 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 font-bold flex items-center gap-1">
                            <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                            <span>Radar Tático</span>
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {contextMenu.xPct}%, {contextMenu.yPct}%
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-zinc-200">
                          {contextMenu.targetPin ? contextMenu.targetPin.name : contextMenu.district.name}
                        </h4>
                      </div>

                      {/* Context actions */}
                      <div className="space-y-1">
                        {!contextMenu.targetPin ? (
                          <>
                            <button
                              onClick={() => {
                                handleOpenCreatePin({ xPct: contextMenu.xPct, yPct: contextMenu.yPct }, contextMenu.district.id);
                              }}
                              className="w-full text-left px-2.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white flex items-center gap-2 transition"
                            >
                              <Plus className="w-3.5 h-3.5 text-amber-400" />
                              <span>Adicionar Marcador Aqui</span>
                            </button>

                            <button
                              onClick={() => {
                                handleCreatePointWithAI(contextMenu.xPct, contextMenu.yPct, contextMenu.district);
                              }}
                              disabled={isAiGeneratingPin}
                              className="w-full text-left px-2.5 py-2 rounded-xl bg-gradient-to-r from-red-950/60 to-purple-950/60 hover:from-red-900/60 hover:to-purple-900/60 text-amber-300 flex items-center gap-2 border border-red-800/40 transition"
                            >
                              <Wand2 className={`w-3.5 h-3.5 text-amber-400 ${isAiGeneratingPin ? 'animate-spin' : ''}`} />
                              <span>{isAiGeneratingPin ? 'Gerando com IA...' : '⚡ Criar Ponto com IA Gemini'}</span>
                            </button>

                            <button
                              onClick={() => {
                                setNewBarDistrict(contextMenu.district.id);
                                setShowAddBarModal(true);
                                setContextMenu(null);
                              }}
                              className="w-full text-left px-2.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white flex items-center gap-2 transition"
                            >
                              <Wine className="w-3.5 h-3.5 text-rose-400" />
                              <span>Criar Bar / Safehouse Aqui</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveTab('encounters');
                                handleRollEncounter();
                                setContextMenu(null);
                              }}
                              className="w-full text-left px-2.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white flex items-center gap-2 transition"
                            >
                              <Compass className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Rolar Encontro Neste Local</span>
                            </button>

                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(`X: ${contextMenu.xPct}%, Y: ${contextMenu.yPct}% (${contextMenu.district.name})`);
                                setContextMenu(null);
                              }}
                              className="w-full text-left px-2.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 flex items-center gap-2 transition text-[11px] font-mono"
                            >
                              <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                              <span>Copiar Coordenadas</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                handleOpenEditPin(contextMenu.targetPin!);
                              }}
                              className="w-full text-left px-2.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white flex items-center gap-2 transition"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                              <span>Editar Informações do Ponto</span>
                            </button>

                            <button
                              onClick={() => {
                                setDraggedPinId(contextMenu.targetPin!.id);
                                setContextMenu(null);
                              }}
                              className="w-full text-left px-2.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white flex items-center gap-2 transition"
                            >
                              <Target className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Arrastar para Mover</span>
                            </button>

                            <button
                              onClick={() => {
                                deleteCustomLocation(contextMenu.targetPin!.id);
                                setContextMenu(null);
                              }}
                              className="w-full text-left px-2.5 py-2 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-red-300 flex items-center gap-2 border border-red-800/40 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" />
                              <span>Excluir Marcador do Mapa</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
</div>
              </div>

              {/* Quick District Selector & 43 Gangs Directory Toggle */}
              <div className="space-y-2 pt-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase mr-1">Foco de Distrito:</span>
                    {NIGHT_CITY_DISTRICTS.map(d => (
                      <button
                        key={d.id}
                        onClick={() => {
                          setSelectedDistrictId(d.id);
                          resetMapView();
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono transition ${
                          d.id === selectedDistrictId
                            ? 'bg-red-600 text-white font-bold shadow-sm'
                            : 'bg-[#181820] text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                        }`}
                      >
                        {d.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowGangDirectory(prev => !prev)}
                    className={`px-3 py-1 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition ${
                      showGangDirectory
                        ? 'bg-red-950 border-red-700 text-red-200 font-bold'
                        : 'bg-[#181820] border-zinc-800 text-zinc-300 hover:text-zinc-100'
                    }`}
                  >
                    <Skull className="w-3.5 h-3.5 text-red-500" />
                    <span>Catálogo de Gangues ({GANGS_LIST.length})</span>
                  </button>
                </div>

                {/* 43 GANGS EXPANDABLE DIRECTORY ON MAP */}
                {showGangDirectory && (
                  <div className="p-3.5 rounded-xl bg-[#0e0e13] border border-[#27272a] space-y-3 animate-in fade-in duration-200">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                      <div className="relative flex-1 w-full">
                        <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          placeholder="Buscar entre as 43 gangues oficiais (ex: Maelstrom, 6th Street, Bozos, Tyger, Valentinos...)"
                          value={gangSearchTerm}
                          onChange={e => setGangSearchTerm(e.target.value)}
                          className="w-full bg-[#08080b] border border-[#27272a] rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-red-500 font-mono"
                        />
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        Clique em uma gangue para focar no mapa e abrir opções
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-56 overflow-y-auto pr-1">
                      {GANGS_LIST.filter(g =>
                        g.name.toLowerCase().includes(gangSearchTerm.toLowerCase()) ||
                        g.turf.some(t => t.toLowerCase().includes(gangSearchTerm.toLowerCase())) ||
                        g.category.toLowerCase().includes(gangSearchTerm.toLowerCase())
                      ).map(gang => (
                        <div
                          key={gang.id}
                          onClick={() => focusGangOnMap(gang)}
                          className="p-2 rounded-lg bg-[#14141a] hover:bg-zinc-800 border border-zinc-800 hover:border-red-700/80 cursor-pointer transition flex items-center gap-2 group"
                        >
                          <div className="w-7 h-7 rounded-full bg-black/60 border border-zinc-700 p-0.5 shrink-0 flex items-center justify-center overflow-hidden">
                            {gang.logoFilename ? (
                              <img
                                src={`/gang_logos/${gang.logoFilename}`}
                                alt={gang.name}
                                className="w-full h-full object-contain"
                                onError={(e: any) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <Skull className="w-3.5 h-3.5 text-red-400" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-[11px] font-bold text-zinc-200 group-hover:text-red-400 block truncate">
                              {gang.name}
                            </span>
                            <span className="text-[9px] text-zinc-500 block truncate font-mono">
                              {gang.turf[0] || gang.category}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* District & Location Inspector Column (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                      {selectedDistrict.zoneType}
                    </span>
                    <h2 className="text-base font-bold text-zinc-100 mt-1">
                      {selectedDistrict.name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-500 block font-mono">Ameaça</span>
                    <span
                      className={`text-xs font-mono font-bold ${
                        selectedDistrict.threatLevel === 'Extreme'
                          ? 'text-red-400'
                          : selectedDistrict.threatLevel === 'High'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {selectedDistrict.threatLevel} ({selectedDistrict.threatRatingNumber}/10)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed max-h-32 overflow-y-auto pr-1">
                  {selectedDistrict.description}
                </p>

                {/* Response Times Box */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#0a0a0d] border border-[#27272a]">
                    <span className="text-[10px] text-zinc-500 uppercase block mb-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" /> Resposta DPNC
                    </span>
                    <span className="text-zinc-200 font-semibold text-[11px] leading-tight block">
                      {selectedDistrict.ncpdResponseTime}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0a0a0d] border border-[#27272a]">
                    <span className="text-[10px] text-zinc-500 uppercase block mb-0.5 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-red-500" /> Trauma Team™
                    </span>
                    <span className="text-zinc-200 font-semibold text-[11px] leading-tight block">
                      {selectedDistrict.traumaTeamResponse}
                    </span>
                  </div>
                </div>

                {/* Dominant Factions with Quick Click */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono uppercase text-zinc-400 font-semibold block">
                    Facções Dominantes
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedDistrict.dominantFactions.map((fac, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-zinc-800 text-[11px] text-zinc-300 border border-zinc-700"
                      >
                        {fac}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Points of Interest (POIs) */}
                <div className="space-y-2 pt-2 border-t border-[#1f1f26]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-zinc-400 font-semibold">
                      Pontos Notáveis ({selectedDistrict.pointsOfInterest.length})
                    </span>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedDistrict.pointsOfInterest.map((poi, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-[#0a0a0d] border border-[#27272a] space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-zinc-100">{poi.name}</strong>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                            {poi.type}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400">{poi.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-[#1f1f26] space-y-2">
                  <button
                    onClick={() => {
                      setActiveTab('encounters');
                      handleRollEncounter();
                    }}
                    className="w-full py-2 rounded-lg bg-[#1a1a24] hover:bg-zinc-800 border border-[#27272a] text-zinc-200 text-xs font-medium flex items-center justify-center gap-1.5 transition"
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-500" />
                    <span>Rolar Encontro Neste Distrito</span>
                  </button>

                  <button
                    onClick={() => {
                      setNewPinDistrict(selectedDistrict.id);
                      setClickCoords({ xPct: 50, yPct: 50 });
                      setShowAddPinModal(true);
                    }}
                    className="w-full py-2 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800/40 text-red-300 text-xs font-medium flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Ponto de Interesse Aqui</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CORP FACILITY MODAL */}
          {selectedCorp && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#121217] border border-[#27272a] rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
                <div className="flex items-start justify-between border-b border-[#27272a] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-700/60 text-cyan-400">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        {selectedCorp.corp}
                      </span>
                      <h3 className="text-base font-bold text-zinc-100 mt-1">{selectedCorp.name}</h3>
                      <span className="text-[11px] text-zinc-400 font-mono">Segurança: {selectedCorp.securityRating}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCorp(null)} className="p-1 rounded text-zinc-400 hover:text-zinc-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2 text-xs leading-relaxed text-zinc-300">
                  <p>{selectedCorp.description}</p>
                </div>
                <div className="pt-2 border-t border-[#27272a] flex justify-end">
                  <button
                    onClick={() => setSelectedCorp(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* GANG DETAILS MODAL */}
          {selectedGang && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#121217] border border-[#27272a] rounded-2xl max-w-xl w-full p-4 sm:p-6 space-y-5 shadow-2xl max-h-[92vh] overflow-y-auto">
                <div className="flex items-start justify-between border-b border-[#27272a] pb-3">
                  <div className="flex items-center gap-3">
                    {selectedGang.logoFilename && (
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-red-700/60 p-1 flex items-center justify-center">
                        <img
                          src={`/gang_logos/${selectedGang.logoFilename}`}
                          alt={selectedGang.name}
                          className="w-full h-full object-contain"
                          onError={(e: any) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/60">
                        {selectedGang.category}
                      </span>
                      <h3 className="text-lg font-bold text-zinc-100 mt-0.5">{selectedGang.name}</h3>
                      <span className="text-xs text-zinc-400 font-mono">Líder: {selectedGang.leader}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedGang(null)} className="p-1 rounded text-zinc-400 hover:text-zinc-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
                  <div>
                    <strong className="text-zinc-300 block mb-1">Território (Turf):</strong>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedGang.turf.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-300 text-[11px]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <strong className="text-zinc-300 block mb-0.5">Descrição & Filosofia:</strong>
                    <p className="text-zinc-400">{selectedGang.description}</p>
                    <blockquote className="mt-1.5 pl-3 border-l-2 border-red-500 text-zinc-400 italic">
                      "{selectedGang.philosophy}"
                    </blockquote>
                  </div>

                  <div>
                    <strong className="text-zinc-300 block mb-0.5">Táticas de Combate:</strong>
                    <p className="text-zinc-400">{selectedGang.tactics}</p>
                  </div>

                  <div>
                    <strong className="text-zinc-300 block mb-0.5">Armamento Típico:</strong>
                    <ul className="list-disc list-inside text-zinc-400 space-y-0.5">
                      {selectedGang.signatureWeapons.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#27272a] flex flex-wrap items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      const spot = MAP_GANG_SPOTS.find(s => s.gangId === selectedGang.id);
                      const xPct = spot ? spot.xPct : 50;
                      const yPct = spot ? spot.yPct : 50;
                      addCustomLocation({
                        id: 'gang-pin-' + selectedGang.id + '-' + Date.now(),
                        name: `Covil: ${selectedGang.name}`,
                        districtId: selectedDistrictId,
                        type: 'Covil de Gangue',
                        description: `Base territorial da gangue ${selectedGang.name} em ${selectedGang.turf[0] || 'Night City'}. Liderado por ${selectedGang.leader}.`,
                        notes: `Ameaça: ${selectedGang.threatLevel}. Armas: ${selectedGang.signatureWeapons.join(', ')}`,
                        dangerLevel: selectedGang.threatLevel,
                        x: xPct,
                        y: yPct,
                      } as any);
                      setSelectedGang(null);
                      alert(`Ponto territorial da gangue ${selectedGang.name} adicionado ao mapa com sucesso!`);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Covil no Mapa</span>
                  </button>
                  <button
                    onClick={() => setSelectedGang(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium"
                  >
                    Fechar Dossiê
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SUPERCHARGED ADD / EDIT CUSTOM PIN MODAL */}
          {showAddPinModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#121217] border border-[#27272a] rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>{editingPinId ? 'Editar Marcador do Mapa' : 'Adicionar Novo Ponto ao Mapa'}</span>
                    </h3>
                    <span className="text-[11px] font-mono text-zinc-400">
                      Coordenadas: {clickCoords ? `X: ${clickCoords.xPct}%, Y: ${clickCoords.yPct}%` : 'Centro'}
                    </span>
                  </div>
                  <button onClick={() => setShowAddPinModal(false)} className="p-1 rounded text-zinc-400 hover:text-zinc-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs max-h-[70vh] overflow-y-auto pr-1">
                  {/* Name + Randomize Button */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-zinc-400 font-mono">Nome do Ponto:</label>
                      <button
                        type="button"
                        onClick={handleRollRandomPinName}
                        className="text-[10px] font-mono text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <Dices className="w-3 h-3" />
                        <span>Sortear Nome</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={newPinName}
                      onChange={e => setNewPinName(e.target.value)}
                      placeholder="ex: Bar Totentanz II, Clínica Ripperdoc Dr. Cho, Covil Maelstrom..."
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  {/* District & Danger */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 font-mono mb-1">Distrito:</label>
                      <select
                        value={newPinDistrict}
                        onChange={e => setNewPinDistrict(e.target.value)}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-red-500"
                      >
                        {NIGHT_CITY_DISTRICTS.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name.split(' ')[0]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-mono mb-1">Nível de Perigo:</label>
                      <select
                        value={newPinDanger}
                        onChange={e => setNewPinDanger(e.target.value)}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-red-500"
                      >
                        <option value="Seguro">Seguro (Zona Verde)</option>
                        <option value="Baixo">Baixo (Área Civil / Vigiada)</option>
                        <option value="Médio">Médio (Tensão de Rua)</option>
                        <option value="Alto">Alto (Zona Hostil Armada)</option>
                        <option value="Extremo">Extremo (Zona de Guerra / Ciberpsico)</option>
                      </select>
                    </div>
                  </div>

                  {/* Category & Controlling Faction */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-zinc-400 font-mono mb-1">Categoria:</label>
                      <select
                        value={newPinType}
                        onChange={e => setNewPinType(e.target.value)}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-red-500"
                      >
                        <option value="Clube / Bar Noturno">Clube / Bar Noturno</option>
                        <option value="Clínica Ripperdoc Clandestina">Clínica Ripperdoc Clandestina</option>
                        <option value="Covil de Gangue">Covil de Gangue</option>
                        <option value="Instalação Corporativa">Instalação Corporativa</option>
                        <option value="Safehouse / Esconderijo">Safehouse / Esconderijo</option>
                        <option value="Bazar / Mercado Negro">Bazar / Mercado Negro</option>
                        <option value="Data Fortress / QG Netrunner">Data Fortress / QG Netrunner</option>
                        <option value="Residência / Apartamento">Residência / Apartamento</option>
                        <option value="Ponto de Encontro Fixer">Ponto de Encontro Fixer</option>
                        <option value="Objetivo de Missão">Objetivo de Missão</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-zinc-400 font-mono mb-1">Gangue ou Facção Vinculada:</label>
                      <select
                        value={newPinGangId}
                        onChange={e => setNewPinGangId(e.target.value)}
                        className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-red-500"
                      >
                        <option value="">Nenhuma / Neutro</option>
                        {GANGS_LIST.map(g => (
                          <option key={g.id} value={g.id}>
                            {g.name} ({g.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Color Selection */}
                  <div>
                    <label className="block text-zinc-400 font-mono mb-1">Cor do Marcador no Mapa:</label>
                    <div className="flex items-center gap-3">
                      {[
                        { id: 'amber', label: 'Âmbar', class: 'bg-amber-500' },
                        { id: 'red', label: 'Vermelho', class: 'bg-red-500' },
                        { id: 'cyan', label: 'Ciano', class: 'bg-cyan-500' },
                        { id: 'purple', label: 'Roxo', class: 'bg-purple-500' },
                        { id: 'emerald', label: 'Esmeralda', class: 'bg-emerald-500' },
                      ].map(c => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setNewPinColor(c.id)}
                          className={`w-6 h-6 rounded-full ${c.class} transition ${
                            newPinColor === c.id ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                          }`}
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Precise Coordinates Sliders (Poder de colocar pontos em qualquer lugar) */}
                  <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold flex items-center gap-1.5">
                      <Sliders className="w-3 h-3 text-cyan-400" />
                      <span>Ajuste Fino de Coordenadas no Mapa</span>
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-0.5">
                          <span>Posição X:</span>
                          <span className="text-cyan-300 font-bold">{clickCoords?.xPct ?? 50}%</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="98"
                          step="0.5"
                          value={clickCoords?.xPct ?? 50}
                          onChange={e => setClickCoords(prev => ({ xPct: Number(e.target.value), yPct: prev?.yPct ?? 50 }))}
                          className="w-full accent-cyan-400"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-0.5">
                          <span>Posição Y:</span>
                          <span className="text-cyan-300 font-bold">{clickCoords?.yPct ?? 50}%</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="98"
                          step="0.5"
                          value={clickCoords?.yPct ?? 50}
                          onChange={e => setClickCoords(prev => ({ xPct: prev?.xPct ?? 50, yPct: Number(e.target.value) }))}
                          className="w-full accent-cyan-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div>
                    <label className="block text-zinc-400 font-mono mb-1">Descrição Pública (O que os jogadores veem):</label>
                    <textarea
                      rows={2}
                      value={newPinDesc}
                      onChange={e => setNewPinDesc(e.target.value)}
                      placeholder="Fachada, neons piscando, sons ou seguranças na porta..."
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-400 font-mono mb-1">Notas Secretas do Mestre (Confidencial):</label>
                    <textarea
                      rows={2}
                      value={newPinNotes}
                      onChange={e => setNewPinNotes(e.target.value)}
                      placeholder="NPCs ocultos, armadilhas, senhas de acesso, loot escondido..."
                      className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#27272a] flex items-center justify-between gap-2">
                  {editingPinId ? (
                    <button
                      type="button"
                      onClick={() => {
                        deleteCustomLocation(editingPinId);
                        setShowAddPinModal(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/40 text-xs flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Excluir Ponto</span>
                    </button>
                  ) : <div />}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddPinModal(false)}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newPinName.trim()) return;
                        if (editingPinId) {
                          updateCustomLocation(editingPinId, {
                            name: newPinName.trim(),
                            districtId: newPinDistrict,
                            type: newPinType,
                            description: newPinDesc,
                            notes: newPinNotes,
                            dangerLevel: newPinDanger,
                            x: clickCoords?.xPct ?? 50,
                            y: clickCoords?.yPct ?? 50,
                            color: newPinColor,
                            factionId: newPinGangId,
                          });
                        } else {
                          addCustomLocation({
                            id: 'pin-' + Date.now(),
                            name: newPinName.trim(),
                            districtId: newPinDistrict,
                            type: newPinType,
                            description: newPinDesc,
                            notes: newPinNotes,
                            dangerLevel: newPinDanger,
                            x: clickCoords?.xPct ?? 50,
                            y: clickCoords?.yPct ?? 50,
                            color: newPinColor,
                            factionId: newPinGangId,
                          });
                        }
                        setShowAddPinModal(false);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs shadow-lg shadow-red-950/40"
                    >
                      {editingPinId ? 'Atualizar Marcador' : 'Salvar no Mapa'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INSPECTOR MODAL FOR CUSTOM PIN */}
          {selectedCustomPin && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#121217] border border-[#27272a] rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto">
                <div className="flex items-start justify-between border-b border-[#27272a] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-600/60 text-amber-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {selectedCustomPin.type} • Perigo: {selectedCustomPin.dangerLevel}
                      </span>
                      <h3 className="text-base font-bold text-zinc-100 mt-1">{selectedCustomPin.name}</h3>
                    </div>
                  </div>
                  <button onClick={() => setSelectedCustomPin(null)} className="p-1 rounded text-zinc-400 hover:text-zinc-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-zinc-300">
                  {selectedCustomPin.description && (
                    <div>
                      <strong className="text-zinc-400 font-mono block text-[11px] mb-0.5">Descrição Pública:</strong>
                      <p className="bg-[#0a0a0d] p-2.5 rounded-lg border border-zinc-800">{selectedCustomPin.description}</p>
                    </div>
                  )}

                  {selectedCustomPin.notes && (
                    <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 space-y-1">
                      <strong className="text-amber-400 font-mono block text-[11px]">Notas Secretas do Mestre:</strong>
                      <p className="text-amber-200">{selectedCustomPin.notes}</p>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-[#27272a] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        deleteCustomLocation(selectedCustomPin.id);
                        setSelectedCustomPin(null);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800/50 text-xs font-mono transition"
                    >
                      Excluir
                    </button>
                    <button
                      onClick={() => {
                        const pinToEdit = selectedCustomPin;
                        setSelectedCustomPin(null);
                        handleOpenEditPin(pinToEdit);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/40 text-xs font-mono transition flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedCustomPin(null)}
                    className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: WEATHER & URBAN EVENTS (NARRATIVA EXPANDIDA & REGRAS OFICIAIS) */}
      {activeTab === 'weather' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: WEATHER GENERATOR & NARRATIVE HUD (7 cols) */}
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-5">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div>
                <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <CloudRain className="w-5 h-5 text-red-500" />
                  <span>Gerador de Clima & Atmosfera Narrativa (Night City Weather DLC)</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Tabelas oficiais de rolagens 2d6, ablações ácidas, descrições noir e detalhes sensoriais da rua.
                </p>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Ref: RTG-CPR-Weather</span>
            </div>

            {/* Season Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase text-zinc-400 font-bold">
                1. Selecione a Época do Ano:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {seasonalWeatherTables.map((s, idx) => (
                  <button
                    key={s.season}
                    onClick={() => setSelectedSeasonIdx(idx)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      selectedSeasonIdx === idx
                        ? 'bg-zinc-800 border-red-500 text-zinc-100 font-semibold ring-1 ring-red-500/50 shadow-sm'
                        : 'bg-[#0a0a0d] border-[#27272a] text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    <div className="text-xs font-bold">{s.season.split(' ')[0]}</div>
                    <div className="text-[10px] text-zinc-500">{s.months}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* District Context Selector for Weather */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono uppercase text-zinc-400 font-bold">
                  2. Distrito de Referência (Microclima Local):
                </label>
                <span className="text-[10px] font-mono text-cyan-400">
                  {DISTRICT_WEATHER_NUANCES[selectedWeatherDistrict]?.districtName.split(' (')[0]}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] font-mono">
                {Object.values(DISTRICT_WEATHER_NUANCES).map(d => {
                  const isSel = selectedWeatherDistrict === d.districtId;
                  return (
                    <button
                      key={d.districtId}
                      type="button"
                      onClick={() => setSelectedWeatherDistrict(d.districtId)}
                      className={`p-1.5 rounded-lg border text-center transition truncate ${
                        isSel
                          ? 'bg-cyan-950/70 border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-[#0a0a0d] border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                      title={d.districtName}
                    >
                      {d.districtName.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Roll Action Button */}
            <button
              onClick={handleRollWeather}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:via-rose-500 hover:to-amber-500 text-white font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-red-950/40 flex items-center justify-center gap-2 active:scale-98 font-mono"
            >
              <Zap className="w-4 h-4 text-amber-200" />
              <span>Rolar Clima do Dia (Tabelas Canônicas 2d6)</span>
            </button>

            {/* Weather Result Display */}
            {currentWeatherRoll && (
              <div className="p-4 sm:p-5 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-4">
                {/* Result Top Line */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-2.5 gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                      <span>Boletim Meteorológico de Night City</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-400">
                      1d6 Temp: {currentWeatherRoll.tempRoll} • 1d6 Cond: {currentWeatherRoll.condRoll}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">{currentWeatherRoll.citation}</span>
                </div>

                {/* Temp & Condition Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-zinc-900/70 p-3 rounded-xl border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Temperatura Oficial</span>
                    <strong className="text-zinc-100 font-mono text-base block">{currentWeatherRoll.temperature}</strong>
                    <span className="text-[10px] text-zinc-500 block">Estação: {seasonalWeatherTables[selectedSeasonIdx].season.split(' ')[0]}</span>
                  </div>
                  <div className="bg-zinc-900/70 p-3 rounded-xl border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase font-mono block">Condição de Superfície</span>
                    <strong className="text-zinc-100 font-mono text-base block">{currentWeatherRoll.condition}</strong>
                    <span className="text-[10px] text-zinc-500 block">Setor: {DISTRICT_WEATHER_NUANCES[selectedWeatherDistrict]?.districtName.split(' (')[0]}</span>
                  </div>
                </div>

                {/* Strange Weather Anomaly Box (If d6 = 6) */}
                {currentWeatherRoll.strangeAnomaly && (
                  <div className="p-4 rounded-xl bg-red-950/40 border-2 border-red-600/80 space-y-2.5 text-xs shadow-lg animate-in fade-in duration-150">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-red-800/60 pb-2">
                      <span className="font-bold text-red-300 flex items-center gap-1.5 text-sm">
                        <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
                        <span>ANOMALIA CLIMÁTICA: {currentWeatherRoll.strangeAnomaly.namePt}</span>
                      </span>
                      <span className="font-mono text-[10px] text-red-300 bg-red-900/60 px-2 py-0.5 rounded border border-red-700/60 self-start sm:self-auto">
                        Duração: {currentWeatherRoll.strangeAnomaly.duration}
                      </span>
                    </div>

                    <p className="text-zinc-200 leading-relaxed text-xs">
                      {currentWeatherRoll.strangeAnomaly.description}
                    </p>

                    <div className="p-2.5 rounded-lg bg-black/60 border border-red-800/60 text-[11px] font-mono text-red-200 space-y-1">
                      <strong className="text-red-400 block uppercase">Regra Mecânica Oficial (Dano / Penalidade):</strong>
                      <p>{currentWeatherRoll.strangeAnomaly.mechanics}</p>
                    </div>

                    {currentWeatherRoll.strangeAnomaly.survivalProtocols && (
                      <div className="text-[10px] font-mono text-zinc-300">
                        <strong className="text-amber-400">Protocolo de Sobrevivência: </strong>
                        {currentWeatherRoll.strangeAnomaly.survivalProtocols}
                      </div>
                    )}
                  </div>
                )}

                {/* SUB-TABS FOR EXPANDED NARRATIVE, SENSORY & TACTICAL EFFECTS */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-1 bg-[#14141a] border border-[#27272a] rounded-xl p-1 text-xs font-mono overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => setWeatherSubTab('narrative')}
                      className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                        weatherSubTab === 'narrative'
                          ? 'bg-red-600 text-white font-bold shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Narração Noir (Boxed Text)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWeatherSubTab('sensory')}
                      className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                        weatherSubTab === 'sensory'
                          ? 'bg-zinc-800 text-amber-300 font-bold border border-amber-600/40'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Detalhes Sensoriais da Rua</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWeatherSubTab('tactics')}
                      className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                        weatherSubTab === 'tactics'
                          ? 'bg-zinc-800 text-cyan-300 font-bold border border-cyan-600/40'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Efeitos Táticos em Combate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setWeatherSubTab('districts')}
                      className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                        weatherSubTab === 'districts'
                          ? 'bg-zinc-800 text-purple-300 font-bold border border-purple-600/40'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Home className="w-3.5 h-3.5 text-purple-400" />
                      <span>Nuance no Distrito</span>
                    </button>
                  </div>

                  {/* SUB-TAB 1: BOXED NARRATION FOR THE GM */}
                  {weatherSubTab === 'narrative' && (
                    <div className="space-y-3 animate-in fade-in duration-100">
                      {/* Boxed Text Card */}
                      <div className="p-4 rounded-xl bg-gradient-to-r from-[#17141f] to-[#121218] border border-amber-600/40 space-y-2.5 relative">
                        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>Para Narrar aos Jogadores (Leitura em Voz Alta)</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyWeatherNarration(
                              aiWeatherAtmosphere?.boxedNarration ||
                              (currentWeatherRoll.strangeAnomaly
                                ? currentWeatherRoll.strangeAnomaly.boxedNarration
                                : currentWeatherRoll.entry?.boxedNarration || '')
                            )}
                            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] font-mono flex items-center gap-1 border border-zinc-700 transition"
                          >
                            {weatherCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{weatherCopied ? 'Copiado!' : 'Copiar Texto'}</span>
                          </button>
                        </div>

                        <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed italic font-serif">
                          "{aiWeatherAtmosphere?.boxedNarration ||
                            (currentWeatherRoll.strangeAnomaly
                              ? currentWeatherRoll.strangeAnomaly.boxedNarration
                              : currentWeatherRoll.entry?.boxedNarration)}"
                        </p>

                        <div className="pt-2 border-t border-zinc-800/60 text-[11px] text-zinc-400 leading-relaxed font-sans">
                          {currentWeatherRoll.entry?.narrativeDescription}
                        </div>
                      </div>

                      {/* AI Atmosphere Expander Button & Output */}
                      <div className="p-3.5 rounded-xl bg-[#0e0e14] border border-zinc-800 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="text-xs font-bold text-zinc-200 block">
                              Expandir Cena com IA Co-GM
                            </span>
                            <span className="text-[11px] text-zinc-500">
                              Gera parágrafos noir sob medida e ganchos de eventos na rua para o distrito de {DISTRICT_WEATHER_NUANCES[selectedWeatherDistrict]?.districtName.split(' (')[0]}.
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleGenerateWeatherAI}
                            disabled={isGeneratingWeatherAI}
                            className="py-1.5 px-3 rounded-lg bg-gradient-to-r from-purple-700 to-red-700 hover:from-purple-600 hover:to-red-600 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0"
                          >
                            <Wand2 className={`w-3.5 h-3.5 text-amber-300 ${isGeneratingWeatherAI ? 'animate-spin' : ''}`} />
                            <span>{isGeneratingWeatherAI ? 'Escrevendo...' : '⚡ Gerar com IA'}</span>
                          </button>
                        </div>

                        {aiWeatherAtmosphere && (
                          <div className="p-3 rounded-lg bg-[#07070a] border border-purple-800/50 space-y-2 text-xs animate-in fade-in duration-150">
                            <span className="text-[11px] font-mono text-purple-300 font-bold block">
                              ★ {aiWeatherAtmosphere.sceneTitle}
                            </span>
                            {aiWeatherAtmosphere.streetEncounterHooks?.length > 0 && (
                              <div className="space-y-1 pt-1 border-t border-zinc-800">
                                <span className="text-[10px] font-mono text-amber-400 font-bold block uppercase">
                                  Imprevistos Imediatos Provocados pelo Clima na Cena:
                                </span>
                                {aiWeatherAtmosphere.streetEncounterHooks.map((h, i) => (
                                  <p key={i} className="text-zinc-300 text-[11px] leading-relaxed">
                                    • {h}
                                  </p>
                                ))}
                              </div>
                            )}
                            {aiWeatherAtmosphere.tacticalAdvice && (
                              <div className="text-[11px] font-mono text-cyan-300 pt-1 border-t border-zinc-800">
                                <strong>Conselho para o Mestre: </strong>
                                {aiWeatherAtmosphere.tacticalAdvice}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 2: SENSORY DETAILS OF THE STREET */}
                  {weatherSubTab === 'sensory' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in duration-100">
                      {/* Visual */}
                      <div className="p-3.5 rounded-xl bg-[#0e0e14] border border-zinc-800 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-amber-400 font-bold flex items-center gap-1.5">
                          <span>💡</span>
                          <span>Visual & Iluminação Neon</span>
                        </span>
                        <p className="text-zinc-300 text-[11px] leading-relaxed">
                          {currentWeatherRoll.strangeAnomaly?.sensoryAtmosphere.visual ||
                            currentWeatherRoll.entry?.sensoryAtmosphere.visual}
                        </p>
                      </div>

                      {/* Scent & Air */}
                      <div className="p-3.5 rounded-xl bg-[#0e0e14] border border-zinc-800 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-rose-400 font-bold flex items-center gap-1.5">
                          <span>👃</span>
                          <span>Olfato, Gosto & Tato</span>
                        </span>
                        <p className="text-zinc-300 text-[11px] leading-relaxed">
                          {currentWeatherRoll.strangeAnomaly?.sensoryAtmosphere.scentAndAir ||
                            currentWeatherRoll.entry?.sensoryAtmosphere.scentAndAir}
                        </p>
                      </div>

                      {/* Soundscape */}
                      <div className="p-3.5 rounded-xl bg-[#0e0e14] border border-zinc-800 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold flex items-center gap-1.5">
                          <span>🔊</span>
                          <span>Paisagem Sonora Urbana</span>
                        </span>
                        <p className="text-zinc-300 text-[11px] leading-relaxed">
                          {currentWeatherRoll.strangeAnomaly?.sensoryAtmosphere.soundscape ||
                            currentWeatherRoll.entry?.sensoryAtmosphere.soundscape}
                        </p>
                      </div>

                      {/* Street Life */}
                      <div className="p-3.5 rounded-xl bg-[#0e0e14] border border-zinc-800 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                          <span>👥</span>
                          <span>Comportamento nas Ruas</span>
                        </span>
                        <p className="text-zinc-300 text-[11px] leading-relaxed">
                          {currentWeatherRoll.strangeAnomaly?.sensoryAtmosphere.streetLife ||
                            currentWeatherRoll.entry?.sensoryAtmosphere.streetLife}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 3: TACTICAL EFFECTS & COMBAT MODIFIERS */}
                  {weatherSubTab === 'tactics' && (
                    <div className="p-4 rounded-xl bg-[#0e0e14] border border-zinc-800 space-y-3 text-xs animate-in fade-in duration-100">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-1">
                          Regras & Modificadores Táticos Oficiais:
                        </span>
                        <p className="text-zinc-200 leading-relaxed text-xs">
                          {currentWeatherRoll.strangeAnomaly?.mechanics ||
                            currentWeatherRoll.entry?.tacticalEffects}
                        </p>
                      </div>

                      {/* Recommended Gear */}
                      {((currentWeatherRoll.strangeAnomaly?.recommendedGear || currentWeatherRoll.entry?.recommendedGear)?.length ?? 0) > 0 && (
                        <div className="pt-2 border-t border-zinc-800 space-y-1.5">
                          <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                            Equipamentos & Trajes Recomendados para Sobrevivência:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {(currentWeatherRoll.strangeAnomaly?.recommendedGear || currentWeatherRoll.entry?.recommendedGear || []).map((gear, i) => (
                              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                                🛡️ {gear}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* SUB-TAB 4: DISTRICT SPECIFIC NUANCE */}
                  {weatherSubTab === 'districts' && (
                    <div className="p-4 rounded-xl bg-[#0e0e14] border border-purple-800/40 space-y-3 text-xs animate-in fade-in duration-100">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                        <strong className="text-purple-300 text-sm">
                          {DISTRICT_WEATHER_NUANCES[selectedWeatherDistrict]?.districtName}
                        </strong>
                        <span className="text-[10px] font-mono text-zinc-500">Microclima Local</span>
                      </div>

                      <p className="text-zinc-200 leading-relaxed">
                        {DISTRICT_WEATHER_NUANCES[selectedWeatherDistrict]?.localAtmosphere}
                      </p>

                      <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-800 space-y-1">
                        <strong className="text-amber-400 font-mono text-[11px] block">Detalhe de Cena no Distrito:</strong>
                        <p className="text-zinc-300 text-[11px]">
                          {DISTRICT_WEATHER_NUANCES[selectedWeatherDistrict]?.sensoryHook}
                        </p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/40 space-y-1">
                        <strong className="text-red-400 font-mono text-[11px] block">Perigo Ambiental Típico deste Bairro:</strong>
                        <p className="text-red-200 text-[11px]">
                          {DISTRICT_WEATHER_NUANCES[selectedWeatherDistrict]?.environmentalHazard}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: URBAN EVENTS (5 cols) */}
          <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div>
                <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Acontecimentos Urbanos da Cidade</span>
                </h2>
                <p className="text-xs text-zinc-400">Imprevistos de infraestrutura, bloqueios e operações militares.</p>
              </div>
            </div>

            <button
              onClick={handleRollUrbanEvent}
              className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium text-xs border border-zinc-700 transition"
            >
              Sortear Acontecimento Urbano
            </button>

            {currentUrbanEvent ? (
              <div className="p-4 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-zinc-100">{currentUrbanEvent.title}</strong>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                    {currentUrbanEvent.zone}
                  </span>
                </div>

                <p className="text-zinc-300 leading-relaxed">{currentUrbanEvent.description}</p>

                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 space-y-1 font-mono text-[11px]">
                  <span className="text-amber-400 font-bold block">Regra Mecânica:</span>
                  <p className="text-zinc-300">{currentUrbanEvent.mechanics}</p>
                </div>

                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 space-y-1 text-[11px]">
                  <span className="text-red-400 font-bold block">Gancho de Missão Oculto:</span>
                  <p className="text-zinc-300">{currentUrbanEvent.hook}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-zinc-600 border border-dashed border-[#27272a] rounded-xl">
                Clique no botão acima para gerar um incidente na cidade.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: RANDOM ENCOUNTERS & AI ENCOUNTER GENERATOR */}
      {activeTab === 'encounters' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Top Encounter Controls */}
          <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
              <div>
                <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-500" />
                  <span>Gerador de Encontros de Rua em {selectedDistrict.name}</span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Gere incidentes tabelados com d100 ou solicite uma cena completa enriquecida pelo motor Neural Co-GM IA.
                </p>
              </div>

              <div className="flex items-center bg-[#0a0a0d] border border-[#27272a] rounded-lg p-0.5 text-xs font-mono">
                <button
                  onClick={() => setTimeOfDay('day')}
                  className={`px-3 py-1 rounded transition ${timeOfDay === 'day' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-400'}`}
                >
                  Dia
                </button>
                <button
                  onClick={() => setTimeOfDay('night')}
                  className={`px-3 py-1 rounded transition ${timeOfDay === 'night' ? 'bg-red-600 text-white font-bold' : 'text-zinc-400'}`}
                >
                  Noite
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleRollEncounter}
                className="py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold text-xs uppercase tracking-wider transition border border-zinc-700 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Rolar Tabela d100 Oficial</span>
              </button>

              <button
                onClick={handleGenerateAIEncounter}
                disabled={isAiLoading}
                className="py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-semibold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Bot className={`w-4 h-4 ${isAiLoading ? 'animate-spin' : ''}`} />
                <span>{isAiLoading ? 'Sintetizando com IA...' : '⚡ Gerar Encontro Dinâmico com IA'}</span>
              </button>
            </div>
          </div>

          {/* AI Generated Encounter Card */}
          {aiEncounter && (
            <div className="p-6 rounded-2xl bg-[#0f0f15] border border-amber-600/50 space-y-4 text-xs shadow-xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-amber-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-amber-950/60 border border-amber-700/60 text-amber-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400 block font-bold">
                      ENCONTRO GERADO POR INTELIGÊNCIA ARTIFICIAL // {selectedDistrict.name.toUpperCase()}
                    </span>
                    <h3 className="text-base font-bold text-zinc-100">{aiEncounter.title}</h3>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  {timeOfDay === 'day' ? 'Diurno' : 'Noturno'}
                </span>
              </div>

              <div className="space-y-3 leading-relaxed">
                <div>
                  <strong className="text-zinc-200 block font-mono text-[11px] mb-0.5">Personagens / Facções Envolvidas:</strong>
                  <p className="text-zinc-300 bg-[#0a0a0d] p-2.5 rounded-lg border border-zinc-800">{aiEncounter.actors}</p>
                </div>

                <div>
                  <strong className="text-zinc-200 block font-mono text-[11px] mb-0.5">Descrição Sensorial da Cena:</strong>
                  <p className="text-zinc-300 italic bg-[#0a0a0d] p-3 rounded-lg border border-zinc-800 leading-relaxed">{aiEncounter.sceneDescription}</p>
                </div>

                <div>
                  <strong className="text-zinc-200 block font-mono text-[11px] mb-0.5">Obstáculo Tático Imediato:</strong>
                  <p className="text-zinc-300 bg-[#0a0a0d] p-2.5 rounded-lg border border-zinc-800">{aiEncounter.tacticalObstacle}</p>
                </div>

                <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/40 text-[11px] font-mono">
                  <strong className="text-cyan-400 block mb-1">Mecânicas & DVs Sugeridos:</strong>
                  <p className="text-cyan-200">{aiEncounter.mechanicsAndDVs}</p>
                </div>

                <div className="p-3 rounded-lg bg-red-950/30 border border-red-800/50 text-[11px]">
                  <strong className="text-red-400 font-mono block mb-1">Reviravolta Inesperada (Twist):</strong>
                  <p className="text-red-200">{aiEncounter.twist}</p>
                </div>
              </div>
            </div>
          )}

          {/* Standard d100 Table Result */}
          {generatedEncounter && (
            <div className="p-5 rounded-2xl bg-[#0a0a0d] border border-[#27272a] space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 font-mono">
                <span className="text-sm font-bold text-zinc-100">{generatedEncounter.title}</span>
                <span className="text-[11px] text-red-400 font-bold">d100 Rolado: {generatedEncounter.rollD100}</span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-mono uppercase text-zinc-500 block">Quem está presente:</span>
                  <p className="text-zinc-200 font-medium">{generatedEncounter.actors}</p>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase text-zinc-500 block">O que estão fazendo:</span>
                  <p className="text-zinc-300 leading-relaxed">{generatedEncounter.activity}</p>
                </div>

                <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 text-[11px]">
                  <span className="font-bold text-amber-400 block font-mono mb-1">Complicação Imediata:</span>
                  <p className="text-amber-200 leading-relaxed">{generatedEncounter.complication}</p>
                </div>
              </div>
            </div>
          )}

          {/* SPECIALIZED CHANCE OF A LIFETIME ENCOUNTERS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#27272a]">
            {/* SUBWAY STRANGERS */}
            <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center">
                    <Train className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">Estranhos no Metrô (NCART)</h3>
                    <p className="text-[11px] text-zinc-400">20 Encontros no Monotrilho & Vagões</p>
                  </div>
                </div>
                <button
                  onClick={() => setRolledSubway(rollSubwayEncounter())}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 font-mono text-xs border border-cyan-800/50 transition shadow-sm"
                >
                  <Dices className="w-3.5 h-3.5" />
                  <span>Rolar d20</span>
                </button>
              </div>

              {rolledSubway ? (
                <div className="p-4 rounded-xl bg-[#0a0a0d] border border-cyan-900/30 space-y-2.5 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                    <span className="font-bold text-zinc-100 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                        #{rolledSubway.roll}
                      </span>
                      {rolledSubway.title}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">NCART Line</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block">Aparência & Trejeitos</span>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">{rolledSubway.visual} (Quirks: {rolledSubway.quirkOrItem})</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-800/30">
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block mb-0.5">Gancho de Mestre (GM Hook)</span>
                    <p className="text-cyan-200 text-[11px] leading-relaxed">{rolledSubway.gmEncounterHook}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#0a0a0d] border border-dashed border-zinc-800 text-center py-6">
                  <p className="text-xs text-zinc-500">Clique em "Rolar d20" para sortear um passageiro excêntrico ou suspeito no vagão.</p>
                </div>
              )}
            </div>

            {/* HOUSES OF WORSHIP */}
            <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-950/40 border border-amber-800/40 flex items-center justify-center">
                    <Church className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">Templos & Cultos de Night City</h3>
                    <p className="text-[11px] text-zinc-400">10 Locais Sagrados e Regras de Santuário</p>
                  </div>
                </div>
                <button
                  onClick={() => setRolledWorship(rollHouseOfWorship())}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 font-mono text-xs border border-amber-800/50 transition shadow-sm"
                >
                  <Dices className="w-3.5 h-3.5" />
                  <span>Rolar d10</span>
                </button>
              </div>

              {rolledWorship ? (
                <div className="p-4 rounded-xl bg-[#0a0a0d] border border-amber-900/30 space-y-2.5 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between border-b border-zinc-800/60 pb-2">
                    <span className="font-bold text-zinc-100 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40">
                        #{rolledWorship.id}
                      </span>
                      {rolledWorship.name}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400/90">{rolledWorship.district}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block">Crença / Fé</span>
                    <span className="text-zinc-200 font-medium text-[11px]">{rolledWorship.deityOrCreed}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block">Arquitetura & Espaço</span>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">{rolledWorship.architecture}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block">Comunidade & Fiéis</span>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">{rolledWorship.community}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/30">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block mb-0.5">Regra de Santuário (Sanctuary Rule)</span>
                    <p className="text-amber-200 text-[11px] leading-relaxed font-mono">{rolledWorship.sanctuaryRule}</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-[#0a0a0d] border border-dashed border-zinc-800 text-center py-6">
                  <p className="text-xs text-zinc-500">Clique em "Rolar d10" para encontrar um templo, capela, mesquita, sinagoga ou terreiro com direito a refúgio.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: VENUES, DATING & SCREAMSHEETS */}
      {activeTab === 'venues' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-[#27272a] pb-3 text-xs font-medium">
            <button
              onClick={() => setVenueSubTab('bars')}
              className={`px-3 py-1.5 rounded-lg transition ${venueSubTab === 'bars' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Bares & Boates Lendárias
            </button>
            <button
              onClick={() => setVenueSubTab('market')}
              className={`px-3 py-1.5 rounded-lg transition ${venueSubTab === 'market' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Mercado Negro (Night Market)
            </button>
            <button
              onClick={() => setVenueSubTab('safehouses')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${venueSubTab === 'safehouses' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Esconderijos & Safe Houses</span>
            </button>
            <button
              onClick={() => setVenueSubTab('streetfood')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${venueSubTab === 'streetfood' ? 'bg-zinc-800 text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>Comida & Bebida de Rua</span>
            </button>
            <button
              onClick={() => setVenueSubTab('dating')}
              className={`px-3 py-1.5 rounded-lg transition ${venueSubTab === 'dating' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Digital Dating (Datepath)
            </button>
            <button
              onClick={() => setVenueSubTab('screamsheets')}
              className={`px-3 py-1.5 rounded-lg transition ${venueSubTab === 'screamsheets' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-400 hover:text-zinc-200'}`}
            >
              Notícias Screamsheets
            </button>
          </div>

          {/* 1. BARS */}
          {venueSubTab === 'bars' && (
            <div className="space-y-4">
              {/* Bars Toolbar: Add, Filter, and AI Generate */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#121217] border border-[#27272a] text-xs">
                <div>
                  <span className="font-mono text-zinc-200 font-bold block text-sm">
                    Bares, Balcões & Boates de Night City ({allBarsList.length} Locais)
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    Locais lendários dos livros e estabelecimentos customizados criados pelo Mestre.
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {customBars.length > 0 && (
                    <button
                      onClick={handleClearAllCustomBars}
                      className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 text-xs font-mono transition flex items-center gap-1.5"
                      title="Apagar todos os bares criados pelo mestre"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Limpar Bares Criados ({customBars.length})</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowAddBarModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-semibold text-xs tracking-wider uppercase transition shadow-md flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Criar Novo Bar</span>
                  </button>
                </div>
              </div>

              {/* Bar Filter Pills */}
              <div className="flex items-center gap-2 font-mono text-xs">
                <button
                  onClick={() => setBarFilterTab('all')}
                  className={`px-3 py-1.5 rounded-xl border transition ${
                    barFilterTab === 'all'
                      ? 'bg-zinc-800 border-zinc-600 text-zinc-100 font-bold'
                      : 'bg-[#121217] border-[#27272a] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Todos ({allBarsList.length})
                </button>
                <button
                  onClick={() => setBarFilterTab('official')}
                  className={`px-3 py-1.5 rounded-xl border transition ${
                    barFilterTab === 'official'
                      ? 'bg-red-950/60 border-red-700 text-red-200 font-bold'
                      : 'bg-[#121217] border-[#27272a] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Lendários Oficiais ({NIGHT_CITY_BARS.length})
                </button>
                <button
                  onClick={() => setBarFilterTab('custom')}
                  className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1 ${
                    barFilterTab === 'custom'
                      ? 'bg-amber-950/60 border-amber-700 text-amber-200 font-bold'
                      : 'bg-[#121217] border-[#27272a] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>Criados pelo Mestre</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-900/60 text-[10px] text-amber-300">
                    {customBars.length}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Bar List */}
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  <span className="text-xs font-mono uppercase text-zinc-400 block font-semibold">
                    Selecione um Estabelecimento:
                  </span>
                  {allBarsList
                    .filter(bar => {
                      const isCustom = bar.id.startsWith('custom-bar-') || bar.citation?.includes('Custom');
                      if (barFilterTab === 'official') return !isCustom;
                      if (barFilterTab === 'custom') return isCustom;
                      return true;
                    })
                    .map(bar => {
                      const isCustom = bar.id.startsWith('custom-bar-') || bar.citation?.includes('Custom');
                      const isSelected = selectedBar?.id === bar.id;

                      return (
                        <div
                          key={bar.id}
                          onClick={() => setSelectedBar(bar)}
                          className={`w-full p-3 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-zinc-800 border-red-500 text-zinc-100 shadow-sm'
                              : 'bg-[#121217] border-[#27272a] text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <div className="text-xs font-bold flex items-center gap-1.5">
                              <span className="truncate">{bar.name}</span>
                              {isCustom && (
                                <span className="text-[9px] font-mono px-1 rounded bg-amber-950 text-amber-300 border border-amber-800 flex-shrink-0">
                                  Custom
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-zinc-500 truncate mt-0.5">{bar.district}</div>
                          </div>

                          {isCustom && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCustomBar(bar.id);
                              }}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-950/40 transition flex-shrink-0"
                              title="Excluir este bar customizado"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>

                {/* Selected Bar Detail Card */}
                {selectedBar && (
                  <div className="md:col-span-2 p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                            {selectedBar.citation || 'Bar & Balcão'}
                          </span>
                          {(selectedBar.id.startsWith('custom-bar-') || selectedBar.citation?.includes('Custom')) && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                              Criado pelo Mestre
                            </span>
                          )}
                        </div>
                        <h2 className="text-base font-bold text-zinc-100 mt-1">{selectedBar.name}</h2>
                        <span className="text-xs text-zinc-400 font-mono">📍 {selectedBar.district}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-zinc-500 block font-mono">Segurança</span>
                          <span className="text-xs font-mono font-bold text-zinc-200">{selectedBar.securityRating}</span>
                        </div>
                        {(selectedBar.id.startsWith('custom-bar-') || selectedBar.citation?.includes('Custom')) && (
                          <button
                            onClick={() => handleDeleteCustomBar(selectedBar.id)}
                            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 transition"
                            title="Excluir bar criado artificialmente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">{selectedBar.aesthetic}</p>

                    {/* SHOWCASE DA BEBIDA ESPECIAL DA CASA */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#181216] via-[#121217] to-[#0d0d12] border border-amber-900/40 space-y-3.5 shadow-xl">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-800/50 text-amber-400">
                            <Wine className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                              Bebida Especial da Casa (Signature Drink)
                            </span>
                            <div className="flex items-center gap-2 flex-wrap mt-0.5">
                              <h3 className="text-sm font-bold text-zinc-100">{selectedBar.signatureDrink.name}</h3>
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950/80 text-red-300 border border-red-800/60 font-bold">
                                {selectedBar.signatureDrink.cost}
                              </span>
                              {selectedBar.signatureDrink.category && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                                  {selectedBar.signatureDrink.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleOrderDrink(selectedBar.signatureDrink)}
                          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-bold text-xs uppercase tracking-wider transition shadow flex items-center gap-1.5 shrink-0"
                          title="Simular beber este drink especial no balcão"
                        >
                          <Wine className="w-3.5 h-3.5" />
                          <span>Virar Dose / Beber</span>
                        </button>
                      </div>

                      {/* Glassware and Visual Serving */}
                      {(selectedBar.signatureDrink.glassware || selectedBar.signatureDrink.visualServing) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {selectedBar.signatureDrink.glassware && (
                            <div className="p-2.5 rounded-lg bg-[#0a0a0d] border border-zinc-800/80">
                              <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5">Estilo do Copo (Glassware):</span>
                              <p className="text-zinc-300 text-[11px] font-mono">{selectedBar.signatureDrink.glassware}</p>
                            </div>
                          )}
                          {selectedBar.signatureDrink.visualServing && (
                            <div className="p-2.5 rounded-lg bg-[#0a0a0d] border border-zinc-800/80">
                              <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5">Apresentação & Efeito Visual:</span>
                              <p className="text-zinc-300 text-[11px]">{selectedBar.signatureDrink.visualServing}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Ingredients Matrix */}
                      {selectedBar.signatureDrink.ingredients && selectedBar.signatureDrink.ingredients.length > 0 && (
                        <div>
                          <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Ingredientes da Receita:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedBar.signatureDrink.ingredients.map((ing, iIdx) => (
                              <span key={iIdx} className="px-2 py-0.5 rounded-md bg-[#0a0a0d] border border-zinc-800 text-zinc-300 text-[10px] font-mono">
                                🥃 {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Tasting Notes / Sensory Experience */}
                      <div className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800/90 text-xs space-y-1">
                        <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Paladar & Sensação Sensorial:
                        </span>
                        <p className="text-zinc-300 italic text-[11px] leading-relaxed">
                          "{selectedBar.signatureDrink.tastingNotes || selectedBar.signatureDrink.description}"
                        </p>
                      </div>

                      {/* Mechanical Effect & Side Effect */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/50 space-y-0.5">
                          <span className="text-amber-400 text-[10px] font-mono font-bold uppercase block">
                            ⚡ Efeito em Regras (Buff In-Game):
                          </span>
                          <p className="text-amber-200 text-xs">{selectedBar.signatureDrink.inGameEffect}</p>
                        </div>
                        {selectedBar.signatureDrink.sideEffect && (
                          <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-900/40 space-y-0.5">
                            <span className="text-red-400 text-[10px] font-mono font-bold uppercase block flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Efeito Colateral / Ressaca:
                            </span>
                            <p className="text-red-300 text-[11px]">{selectedBar.signatureDrink.sideEffect}</p>
                          </div>
                        )}
                      </div>

                      {/* Lore Trivia */}
                      {selectedBar.signatureDrink.loreTrivia && (
                        <div className="text-[10px] font-mono text-zinc-500 italic pt-1 border-t border-zinc-800/60">
                          <strong>Origem do Drink:</strong> {selectedBar.signatureDrink.loreTrivia}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1">
                        <span className="text-[10px] text-zinc-500 font-mono uppercase block mb-0.5">Público Frequente:</span>
                        <p className="text-zinc-300 text-[11px] leading-relaxed">{selectedBar.clientele}</p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1">
                        <span className="text-[10px] text-zinc-500 font-mono uppercase block mb-0.5">Estilo Musical:</span>
                        <p className="text-zinc-400 text-[11px] font-mono">{selectedBar.musicStyle}</p>
                      </div>
                    </div>

                    {selectedBar.localRumors && selectedBar.localRumors.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs">
                        <span className="text-amber-400 font-mono font-bold block mb-1.5">Rumores Recentes no Balcão:</span>
                        <ul className="list-disc list-inside text-amber-200 space-y-1">
                          {selectedBar.localRumors.map((rumor, rIdx) => (
                            <li key={rIdx}>{rumor}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* MODAL: CRIAR BAR CUSTOMIZADO COM IA */}
              {showAddBarModal && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-[#121217] border border-[#27272a] rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                      <div className="flex items-center gap-2">
                        <Wine className="w-5 h-5 text-amber-500" />
                        <h3 className="text-sm font-bold text-zinc-100">Criar Novo Bar / Boate em Night City</h3>
                      </div>
                      <button onClick={() => setShowAddBarModal(false)} className="p-1 rounded text-zinc-400 hover:text-zinc-200">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* AI Generator Helper Bar */}
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2 text-xs">
                      <span className="text-amber-400 font-mono font-bold uppercase block flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Forjador de Bares com IA (Gemini)
                      </span>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={newBarVibe}
                          onChange={e => setNewBarVibe(e.target.value)}
                          placeholder="Estética desejada (ex: Clube gótico de netrunners, boteco imundo...)"
                          className="flex-1 bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none text-xs"
                        />
                        <button
                          type="button"
                          onClick={handleGenerateCustomBarAI}
                          disabled={isGeneratingBarAI}
                          className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-600 to-red-600 text-white font-semibold text-xs whitespace-nowrap transition disabled:opacity-50"
                        >
                          {isGeneratingBarAI ? 'Criando...' : '⚡ Preencher com IA'}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-zinc-400 font-mono mb-1">Nome do Bar:</label>
                          <input
                            type="text"
                            value={newBarName}
                            onChange={e => setNewBarName(e.target.value)}
                            placeholder="ex: Totentanz II, The Neon Snake..."
                            className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-400 font-mono mb-1">Distrito:</label>
                          <input
                            type="text"
                            value={newBarDistrict}
                            onChange={e => setNewBarDistrict(e.target.value)}
                            placeholder="Watson, Westbrook, Heywood..."
                            className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-red-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-zinc-400 font-mono mb-1">Ambiente & Decoração (Aesthetic):</label>
                        <textarea
                          rows={2}
                          value={newBarAesthetic}
                          onChange={e => setNewBarAesthetic(e.target.value)}
                          placeholder="Iluminação, fumaça, acabamento das mesas e balcão..."
                          className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-zinc-400 font-mono mb-1">Clientele Frequente:</label>
                          <input
                            type="text"
                            value={newBarClientele}
                            onChange={e => setNewBarClientele(e.target.value)}
                            placeholder="ex: Mercenários, Solos, Gangers..."
                            className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-red-500"
                          />
                        </div>
                        <div>
                          <label className="block text-zinc-400 font-mono mb-1">Nível de Segurança:</label>
                          <select
                            value={newBarSecurity}
                            onChange={e => setNewBarSecurity(e.target.value as any)}
                            className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-red-500"
                          >
                            <option value="Nenhuma (Faroeste)">Nenhuma (Faroeste)</option>
                            <option value="Baixa">Baixa</option>
                            <option value="Média">Média</option>
                            <option value="Pesada / Militar">Pesada / Militar</option>
                          </select>
                        </div>
                      </div>

                      {/* Signature Drink Section in Modal */}
                      <div className="p-3.5 rounded-xl bg-[#0e0e13] border border-amber-900/30 space-y-2.5">
                        <span className="text-amber-400 font-mono font-bold text-xs uppercase flex items-center gap-1.5">
                          <Wine className="w-3.5 h-3.5" /> Detalhes da Bebida Especial da Casa
                        </span>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-zinc-400 font-mono text-[11px] mb-1">Nome do Drink:</label>
                            <input
                              type="text"
                              value={newBarDrinkName}
                              onChange={e => setNewBarDrinkName(e.target.value)}
                              placeholder="ex: Neon Venom"
                              className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-zinc-400 font-mono text-[11px] mb-1">Preço (eb):</label>
                            <input
                              type="text"
                              value={newBarDrinkCost}
                              onChange={e => setNewBarDrinkCost(e.target.value)}
                              placeholder="ex: 35eb (Costly)"
                              className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-zinc-400 font-mono text-[11px] mb-1">Categoria:</label>
                            <select
                              value={newBarDrinkCategory}
                              onChange={e => setNewBarDrinkCategory(e.target.value)}
                              className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none text-xs"
                            >
                              <option value="Coquetel Lendário">Coquetel Lendário</option>
                              <option value="Destilado Pesado">Destilado Pesado</option>
                              <option value="Energético Cibernético">Energético Cibernético</option>
                              <option value="Elixir Bioquímico">Elixir Bioquímico</option>
                              <option value="Cerveja de Sarjeta">Cerveja de Sarjeta</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-zinc-400 font-mono text-[11px] mb-1">Copo & Apresentação (Glassware):</label>
                            <input
                              type="text"
                              value={newBarDrinkGlassware}
                              onChange={e => setNewBarDrinkGlassware(e.target.value)}
                              placeholder="ex: Copo de chumbo, névoa de gelo seco..."
                              className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-zinc-400 font-mono text-[11px] mb-1">Ingredientes da Mistura:</label>
                            <input
                              type="text"
                              value={newBarDrinkIngredients}
                              onChange={e => setNewBarDrinkIngredients(e.target.value)}
                              placeholder="separados por vírgula (ex: Tequila, Pimenta, Gelo Seco)"
                              className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none text-xs"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-zinc-400 font-mono text-[11px] mb-1">Paladar & Sensação Sensorial (Tasting Notes):</label>
                          <input
                            type="text"
                            value={newBarDrinkTasting}
                            onChange={e => setNewBarDrinkTasting(e.target.value)}
                            placeholder="como queima na garganta, aroma, gosto e reação..."
                            className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none text-xs"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-zinc-400 font-mono text-[11px] mb-1">Efeito em Regra (Buff):</label>
                            <input
                              type="text"
                              value={newBarDrinkEffect}
                              onChange={e => setNewBarDrinkEffect(e.target.value)}
                              placeholder="ex: +1 em COOL por 1 hora"
                              className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-zinc-400 font-mono text-[11px] mb-1">Efeito Colateral / Ressaca:</label>
                            <input
                              type="text"
                              value={newBarDrinkSideEffect}
                              onChange={e => setNewBarDrinkSideEffect(e.target.value)}
                              placeholder="ex: DV 12 Resistência contra náusea"
                              className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-zinc-400 font-mono mb-1">Rumor Recente no Balcão:</label>
                        <input
                          type="text"
                          value={newBarRumor}
                          onChange={e => setNewBarRumor(e.target.value)}
                          placeholder="Fofoca ou gancho de missão para os jogadores..."
                          className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-lg p-2 text-zinc-200 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#27272a] flex items-center justify-end gap-2">
                      <button
                        onClick={() => setShowAddBarModal(false)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveCustomBar}
                        className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                      >
                        Salvar Bar
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL / TOAST: BEBER NO BALCÃO */}
              {drinkOrderedToast && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-[#121217] border border-amber-600/60 rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <div className="flex items-center gap-2">
                        <Wine className="w-5 h-5 text-amber-500" />
                        <h3 className="text-sm font-bold text-zinc-100 font-mono">Bebida Servida no Balcão!</h3>
                      </div>
                      <button onClick={() => setDrinkOrderedToast(null)} className="p-1 rounded text-zinc-400 hover:text-zinc-200">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="text-center space-y-1">
                      <span className="text-[10px] font-mono uppercase text-amber-400">Você vira a dose de</span>
                      <h2 className="text-xl font-bold text-zinc-100">{drinkOrderedToast.drinkName}</h2>
                      {drinkOrderedToast.glassware && (
                        <span className="text-xs font-mono text-zinc-400 block">Servido em: {drinkOrderedToast.glassware}</span>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 text-xs text-zinc-300 italic leading-relaxed">
                      "{drinkOrderedToast.tastingNotes}"
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 space-y-1 text-xs">
                      <span className="text-amber-400 font-mono font-bold block">⚡ Efeito Mecânico em Regra:</span>
                      <p className="text-amber-200">{drinkOrderedToast.effect}</p>
                    </div>

                    <button
                      onClick={() => setDrinkOrderedToast(null)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-semibold text-xs transition uppercase tracking-wider shadow"
                    >
                      Bater o Copo no Balcão & Continuar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. NIGHT MARKET / MERCADO NEGRO */}
          {venueSubTab === 'market' && (
            <NightMarketSection initialDistrict={selectedDistrict?.name} />
          )}

          {/* 3. SAFE HOUSES & ESCONDERIJOS */}
          {venueSubTab === 'safehouses' && (
            <SafeHousesSection />
          )}

          {/* 4. STREET FOOD, DRINKS & VENDIT */}
          {venueSubTab === 'streetfood' && (
            <StreetFoodDrinksSection />
          )}

          {/* 3. DATING */}
          {venueSubTab === 'dating' && (
            <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] max-w-2xl mx-auto space-y-5">
              <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
                <div>
                  <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <span>Digital Dating & Datepath (DLC Oficial)</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Gera encontros românticos de mercenários com parceiro(a), locais, atividades e complicações táticas.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* 1. Standard Button: Procedural Date Roll */}
                <button
                  onClick={handleRollDate}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
                >
                  <Dices className="w-4 h-4" />
                  <span>Sortear Encontro Romântico (Datepath Oficial)</span>
                </button>

                {/* 2. Extra Option: AI Date Generator */}
                <div className="rounded-xl border border-pink-900/40 bg-pink-950/15 p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-pink-400" />
                      <span className="text-xs font-bold text-zinc-200">Opção Extra: Gerar com IA (Gemini)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDateAiOptions(!showDateAiOptions)}
                      className="text-[11px] font-mono text-pink-400 hover:text-pink-300 transition flex items-center gap-1"
                    >
                      <span>{showDateAiOptions ? 'Ocultar Opções' : 'Personalizar Date'}</span>
                      {showDateAiOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {showDateAiOptions && (
                    <div className="space-y-2.5 pt-2 border-t border-pink-950/50 animate-in fade-in duration-150">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] font-mono text-zinc-400 block mb-1">Distrito Desejado:</label>
                          <select
                            value={dateAiDistrict}
                            onChange={e => setDateAiDistrict(e.target.value)}
                            className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-pink-500"
                          >
                            <option value="Qualquer">Qualquer Distrito</option>
                            {NIGHT_CITY_DISTRICTS.map(d => (
                              <option key={d.id} value={d.name}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-mono text-zinc-400 block mb-1">Papel do Par:</label>
                          <select
                            value={dateAiPartnerRole}
                            onChange={e => setDateAiPartnerRole(e.target.value)}
                            className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none focus:border-pink-500"
                          >
                            <option value="Qualquer">Qualquer Perfil</option>
                            <option value="Netrunner">Netrunner Freelancer</option>
                            <option value="Solo">Solo de Aluguel</option>
                            <option value="Techie">Técnico(a) / Engenheiro(a)</option>
                            <option value="Medtech">Médico(a) Clandestino(a)</option>
                            <option value="Rockerboy">Rockerboy / Artista Rebelde</option>
                            <option value="Executivo(a)">Executivo(a) Corporativo(a)</option>
                            <option value="Fixer">Fixer Conectado(a)</option>
                            <option value="Nômade">Nômade das Estradas</option>
                            <option value="Bartender">Bartender do Submundo</option>
                            <option value="Cidadão">Cidadão Comum</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-zinc-400 block mb-1">
                          Instruções / Vibe Específica (Opcional):
                        </label>
                        <input
                          type="text"
                          value={dateAiPrompt}
                          onChange={e => setDateAiPrompt(e.target.value)}
                          placeholder="Ex: Solo veterano com cicatrizes em um diner decadente de Heywood..."
                          className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-pink-500"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleGenerateAIDate}
                    disabled={isDateAiLoading}
                    className="w-full py-2.5 rounded-xl bg-pink-700 hover:bg-pink-600 disabled:opacity-50 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow"
                  >
                    <Bot className={`w-3.5 h-3.5 ${isDateAiLoading ? 'animate-spin' : ''}`} />
                    <span>{isDateAiLoading ? 'IA Elaborando Encontro...' : 'Gerar Encontro com IA'}</span>
                  </button>
                </div>
              </div>

              {/* Date Card Result */}
              {generatedDate && (
                <div className="p-5 rounded-2xl bg-[#0a0a0d] border border-pink-900/40 space-y-4 text-xs animate-in fade-in duration-200">
                  <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                          generatedDate.isAi
                            ? 'bg-purple-950 text-purple-300 border border-purple-800/50'
                            : 'bg-pink-950 text-pink-300 border border-pink-800/50'
                        }`}>
                          {generatedDate.isAi ? '🤖 Gerado com IA (Gemini)' : '🎲 Sorteado (Datepath DLC)'}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-zinc-100">{generatedDate.partnerName}</h4>
                      <span className="text-xs text-zinc-400 font-mono">{generatedDate.partnerRole}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-zinc-800 text-zinc-300">
                      📍 {generatedDate.district}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-0.5">Estilo Visual do Parceiro(a):</span>
                    <p className="text-zinc-300 italic">{generatedDate.partnerStyle}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Tags do Garden Dating (#Keywords):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {generatedDate.keywords.map((k: string, i: number) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-full bg-pink-950/60 border border-pink-800/50 text-pink-300 text-[10px] font-mono font-bold">
                          #{k.replace('#', '')}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <strong className="text-zinc-200">{generatedDate.locationName}</strong>
                      <span className="text-zinc-400">{generatedDate.district}</span>
                    </div>
                    <p className="text-zinc-300 text-xs">
                      <strong className="text-cyan-400 font-normal">Atividade Planejada:</strong> {generatedDate.activity}
                    </p>
                  </div>

                  {/* AI Extra fields if present */}
                  {generatedDate.conversationStarter && (
                    <div className="p-3 rounded-xl bg-pink-950/25 border border-pink-900/40 text-xs space-y-1">
                      <span className="text-[10px] font-mono uppercase text-pink-400 font-bold block">Assunto para Puxar Conversa:</span>
                      <p className="text-pink-200 italic">{generatedDate.conversationStarter}</p>
                    </div>
                  )}

                  {generatedDate.secretAgenda && (
                    <div className="p-3 rounded-xl bg-purple-950/25 border border-purple-900/40 text-xs space-y-1">
                      <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block">Agenda Oculta / Segredo do Par (Mestre):</span>
                      <p className="text-purple-200">{generatedDate.secretAgenda}</p>
                    </div>
                  )}

                  <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-800/50 text-xs space-y-1.5">
                    <div className="flex items-center gap-1.5 text-red-400 font-bold font-mono">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Complicação do Encontro: {generatedDate.complicationTitle}</span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed">{generatedDate.complicationDesc}</p>
                    <div className="text-[11px] font-mono text-amber-300 bg-red-950/40 p-2.5 rounded-lg border border-red-900/50">
                      <strong className="text-amber-400 block mb-0.5">Resolução Mecânica Sugerida:</strong>
                      <span>{generatedDate.complicationHook}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. SCREAMSHEETS */}
          {venueSubTab === 'screamsheets' && (
            <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] max-w-3xl mx-auto space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
                <div>
                  <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-red-500" />
                    <span>Notícias Screamsheets & Ganchos de Missão</span>
                  </h3>
                  <p className="text-xs text-zinc-400">Gera manchetes completas de jornais de Night City com contrato oculto.</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* 1. Standard Button: Procedural Screamsheet Roll */}
                <button
                  onClick={handleRollScreamsheet}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-red-700 to-rose-700 hover:from-red-600 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
                >
                  <Dices className="w-4 h-4" />
                  <span>Sortear Notícia dos Arquivos (Screamsheet DLC)</span>
                </button>

                {/* 2. Extra Option: AI Screamsheet Generator */}
                <div className="rounded-xl border border-red-900/40 bg-red-950/15 p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-red-400" />
                      <span className="text-xs font-bold text-zinc-200">Opção Extra: Gerar Notícia com IA (Gemini)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowScreamsheetAiOptions(!showScreamsheetAiOptions)}
                      className="text-[11px] font-mono text-red-400 hover:text-red-300 transition flex items-center gap-1"
                    >
                      <span>{showScreamsheetAiOptions ? 'Ocultar Opções' : 'Digitar Tema com IA'}</span>
                      {showScreamsheetAiOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {showScreamsheetAiOptions && (
                    <div className="space-y-2 pt-2 border-t border-red-950/50 animate-in fade-in duration-150">
                      <label className="block text-[10px] font-mono text-zinc-400">
                        Tópico / Acontecimento Específico para a Notícia:
                      </label>
                      <input
                        type="text"
                        value={screamsheetTopic}
                        onChange={e => setScreamsheetTopic(e.target.value)}
                        placeholder="Ex: Escândalo da Arasaka, Apagão em Heywood, Maelstrom invadindo Kabuki..."
                        className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  )}

                  <button
                    onClick={handleGenerateAIScreamsheet}
                    disabled={isScreamsheetAiLoading}
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition shadow"
                  >
                    <Bot className={`w-3.5 h-3.5 ${isScreamsheetAiLoading ? 'animate-spin' : ''}`} />
                    <span>{isScreamsheetAiLoading ? 'Redigindo Notícia com IA...' : 'Gerar Notícia com IA'}</span>
                  </button>
                </div>
              </div>

              {/* Screamsheet Result Display */}
              {generatedScreamsheet && (
                <div className="p-6 rounded-2xl bg-[#0a0a0d] border border-[#27272a] space-y-4 text-xs font-mono animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 font-bold uppercase">{generatedScreamsheet.network}</span>
                      <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                        generatedScreamsheet.isAi
                          ? 'bg-purple-950 text-purple-300 border border-purple-800/50'
                          : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}>
                        {generatedScreamsheet.isAi ? '🤖 IA Gemini' : '🎲 Arquivo DLC'}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500">EDIÇÃO DIGITAL NOTURNA</span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-zinc-100 uppercase tracking-tight font-sans">
                    {generatedScreamsheet.headline}
                  </h2>

                  <p className="text-zinc-300 font-sans leading-relaxed text-xs">
                    {generatedScreamsheet.article || `${generatedScreamsheet.intro} ${generatedScreamsheet.body} ${generatedScreamsheet.conclusion}`}
                  </p>

                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-1 font-sans">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block">
                      GANCHO DE MISSÃO OCULTO (GIG)
                    </span>
                    <p className="text-amber-200 text-xs">
                      {generatedScreamsheet.hiddenGig || generatedScreamsheet.gig?.objective}
                    </p>
                    <div className="text-[11px] font-mono text-emerald-400 pt-1">
                      <strong>Recompensa Estimada:</strong> {generatedScreamsheet.payout || generatedScreamsheet.gig?.payout}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
