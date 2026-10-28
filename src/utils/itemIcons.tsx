import React from 'react';
import {
  Crosshair,
  Target,
  Flame,
  Zap,
  Sword,
  Bomb,
  Cpu,
  Eye,
  Activity,
  Shield,
  ShieldAlert,
  Radio,
  Volume2,
  Skull,
  Bot,
  Heart,
  Wrench,
  Terminal,
  Smartphone,
  Compass,
  Sparkles,
  Smile,
  Pill,
  Car,
  Bike,
  Truck,
  Ship,
  Plane,
  Disc,
  Layers,
  HelpCircle,
  Package,
  PawPrint,
  Glasses,
  Footprints,
} from 'lucide-react';

// ========================================================
// 1. HELPERS DE ÍCONES CONTEXTUAIS
// ========================================================

/**
 * Retorna o ícone mais apropriado para uma Arma baseado em seu nome ou categoria.
 */
export function getWeaponIcon(categoryOrName: string = '', className: string = 'w-4 h-4 text-red-400'): React.ReactElement {
  const norm = categoryOrName.toLowerCase();

  // Armas Brancas / Lâminas
  if (norm.includes('faca') || norm.includes('katana') || norm.includes('espada') || norm.includes('lâmina') || norm.includes('lamina') || norm.includes('machado') || norm.includes('corrente') || norm.includes('bastão') || norm.includes('melee') || norm.includes('branca')) {
    return <Sword className={className} />;
  }

  // Fuzis / Snipers / Precisão
  if (norm.includes('sniper') || norm.includes('precisão') || norm.includes('rifle') || norm.includes('fuzil') || norm.includes('assalto')) {
    return <Crosshair className={className} />;
  }

  // Espingardas / Shotguns / Dispersão
  if (norm.includes('espingarda') || norm.includes('shotgun') || norm.includes('doze') || norm.includes('calibre 12') || norm.includes('slug')) {
    return <Flame className={className} />;
  }

  // Submetralhadoras / SMG / Rajadas
  if (norm.includes('smg') || norm.includes('submetralhadora') || norm.includes('rajada') || norm.includes('automática')) {
    return <Zap className={className} />;
  }

  // Pesadas / Lança-Foguetes / Granadas / Explosivos
  if (norm.includes('pesada') || norm.includes('granada') || norm.includes('explosiv') || norm.includes('míssil') || norm.includes('foguete') || norm.includes('canhão') || norm.includes('lança')) {
    return <Bomb className={className} />;
  }

  // Ciberarmas / Mantis / Gorila
  if (norm.includes('mantis') || norm.includes('gorilla') || norm.includes('monowire') || norm.includes('projétil embutido') || norm.includes('ciberarma')) {
    return <Cpu className={className} />;
  }

  // Pistolas / Revólveres / Padrão
  if (norm.includes('pistola') || norm.includes('revólver') || norm.includes('revolver') || norm.includes('handgun') || norm.includes('arma')) {
    return <Target className={className} />;
  }

  return <Crosshair className={className} />;
}

/**
 * Retorna o ícone mais apropriado para Ciberware / Cromos.
 */
export function getCyberwareIcon(typeOrName: string = '', className: string = 'w-4 h-4 text-cyan-400'): React.ReactElement {
  const norm = typeOrName.toLowerCase();

  // Óptico / Visão / Olhos
  if (norm.includes('óptic') || norm.includes('optic') || norm.includes('olho') || norm.includes('visão') || norm.includes('mira') || norm.includes('térmic') || norm.includes('infravermelho') || norm.includes('kiroshi')) {
    return <Eye className={className} />;
  }

  // Neural / Sandevistan / Kerenzikov / Reflexos / Processadores
  if (norm.includes('neural') || norm.includes('sandevistan') || norm.includes('kerenzikov') || norm.includes('processador') || norm.includes('chip') || norm.includes('interface') || norm.includes('sistema nervoso') || norm.includes('co-processador')) {
    return <Activity className={className} />;
  }

  // Auditivo / Sensores / Rádio
  if (norm.includes('audit') || norm.includes('ouvido') || norm.includes('áudio') || norm.includes('sensor sonoro') || norm.includes('rádio') || norm.includes('comunicador')) {
    return <Volume2 className={className} />;
  }

  // Membros / Ciberbraço / Ciberperna / Garras / Força
  if (norm.includes('membro') || norm.includes('braço') || norm.includes('perna') || norm.includes('mão') || norm.includes('pé') || norm.includes('garra') || norm.includes('gorilla') || norm.includes('articular')) {
    return <Zap className={className} />;
  }

  // Corporal / Blindagem Subcutânea / Placas / Esqueleto
  if (norm.includes('corporal') || norm.includes('subcutânea') || norm.includes('blindagem') || norm.includes('placa') || norm.includes('esqueleto') || norm.includes('pele') || norm.includes('enxerto') || norm.includes('reforço')) {
    return <ShieldAlert className={className} />;
  }

  // Borgware / Cibermonstruosidades / Ciberpsicose
  if (norm.includes('borg') || norm.includes('psicose') || norm.includes('titã') || norm.includes('pesadelo') || norm.includes('militar pesado') || norm.includes('exótico')) {
    return <Skull className={className} />;
  }

  return <Cpu className={className} />;
}

/**
 * Retorna o ícone para Equipamentos, Drogas e Armaduras.
 */
export function getGearIcon(categoryOrName: string = '', className: string = 'w-4 h-4 text-emerald-400'): React.ReactElement {
  const norm = categoryOrName.toLowerCase();

  // Medicina & Ripperdoc
  if (norm.includes('medicina') || norm.includes('ripperdoc') || norm.includes('trauma') || norm.includes('curativo') || norm.includes('biorreparo') || norm.includes('spray') || norm.includes('sangue')) {
    return <Heart className={className} />;
  }

  // Ferramentas & Invasão / Tech / Cyberdeck
  if (norm.includes('ferramenta') || norm.includes('invasão') || norm.includes('cyberdeck') || norm.includes('hack') || norm.includes('chave') || norm.includes('técnico') || norm.includes('soldador')) {
    return <Wrench className={className} />;
  }

  // Comunicação & IA
  if (norm.includes('comunicação') || norm.includes('agente') || norm.includes('rádio') || norm.includes('smartphone') || norm.includes('holofone') || norm.includes('ia')) {
    return <Smartphone className={className} />;
  }

  // Sobrevivência & Rua
  if (norm.includes('sobrevivência') || norm.includes('rua') || norm.includes('mochila') || norm.includes('ração') || norm.includes('corda') || norm.includes('lanterna') || norm.includes('máscara')) {
    return <Compass className={className} />;
  }

  // Estilo & Vida Noturna
  if (norm.includes('estilo') || norm.includes('vida noturna') || norm.includes('óculos') || norm.includes('roupa') || norm.includes('joia') || norm.includes('synth')) {
    return <Sparkles className={className} />;
  }

  // Drogas & Químicos
  if (norm.includes('droga') || norm.includes('dose') || norm.includes('comprimido') || norm.includes('lace') || norm.includes('coke') || norm.includes('smash') || norm.includes('blue glass')) {
    return <Pill className={className} />;
  }

  // Armaduras & Coletes
  if (norm.includes('armadura') || norm.includes('colete') || norm.includes('capacete') || norm.includes('kevlar') || norm.includes('armorjack') || norm.includes('sp ')) {
    return <Shield className={className} />;
  }

  // Munição
  if (norm.includes('munição') || norm.includes('cartucho') || norm.includes('bala') || norm.includes('projétil') || norm.includes('pente') || norm.includes('tambor')) {
    return <Layers className={className} />;
  }

  return <Package className={className} />;
}

/**
 * Retorna o ícone para Veículos.
 */
export function getVehicleIcon(typeOrName: string = '', className: string = 'w-4 h-4 text-amber-400'): React.ReactElement {
  const norm = typeOrName.toLowerCase();

  if (norm.includes('moto') || norm.includes('kusanagi') || norm.includes('apollo') || norm.includes('nazare')) {
    return <Bike className={className} />;
  }
  if (norm.includes('caminhão') || norm.includes('blindado') || norm.includes('behemoth') || norm.includes('bratsk') || norm.includes('tanque')) {
    return <Truck className={className} />;
  }
  if (norm.includes('aerodino') || norm.includes('av-') || norm.includes('aeronave') || norm.includes('drone') || norm.includes('valgus')) {
    return <Plane className={className} />;
  }
  if (norm.includes('barco') || norm.includes('aquático') || norm.includes('lancha') || norm.includes('hydrofoil')) {
    return <Ship className={className} />;
  }

  return <Car className={className} />;
}

// ========================================================
// 2. GALERIA DE AVATARES E IMAGENS CYBERPUNK PRÉ-CONFIGURADAS
// ========================================================

export interface PresetImageItem {
  id: string;
  name: string;
  category: 'personagem' | 'inimigo' | 'pet' | 'veiculo' | 'arma' | 'cromo';
  url: string;
  tags: string[];
}

export const CYBERPUNK_IMAGE_PRESETS: PresetImageItem[] = [
  // --- PERSONAGENS & INIMIGOS ---
  {
    id: 'char-solo-male',
    name: 'Solo Mercenário Brutal',
    category: 'personagem',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    tags: ['solo', 'mercenário', 'combate', 'cibernético'],
  },
  {
    id: 'char-solo-femme',
    name: 'Solo Assassina Urbana',
    category: 'personagem',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    tags: ['solo', 'atiradora', 'neon', 'mulher'],
  },
  {
    id: 'char-netrunner',
    name: 'Netrunner no Ciberespaço',
    category: 'personagem',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    tags: ['netrunner', 'hacker', 'código', 'deep web'],
  },
  {
    id: 'char-cyberpsycho',
    name: 'Ciberpsicopata Maelstrom',
    category: 'inimigo',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    tags: ['ciberpsicopata', 'inimigo', 'maelstrom', 'crânio neon'],
  },
  {
    id: 'char-exec',
    name: 'Executivo Arasaka / Agente',
    category: 'personagem',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    tags: ['executivo', 'corpo', 'terno', 'arasaka'],
  },
  {
    id: 'char-ripperdoc',
    name: 'Ripperdoc & Techie Clandestino',
    category: 'personagem',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    tags: ['ripperdoc', 'médico', 'tecnologia', 'clínica'],
  },
  {
    id: 'char-nomad',
    name: 'Nômade Guerreiro das Badlands',
    category: 'personagem',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    tags: ['nômade', 'aldecaldos', 'deserto', 'badlands'],
  },
  {
    id: 'char-tyger-claw',
    name: 'Lâmina Urbana / Tyger Claw',
    category: 'inimigo',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    tags: ['tyger claws', 'gangue', 'katana', 'japantown'],
  },
  {
    id: 'char-mactac',
    name: 'Operador Tático Max-Tac',
    category: 'inimigo',
    url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    tags: ['maxtac', 'polícia', 'choque', 'tático'],
  },

  // --- PETS & BIOPETS ---
  {
    id: 'pet-k9-drone',
    name: 'Drone Tático K-9 Militar',
    category: 'pet',
    url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80',
    tags: ['pet', 'drone', 'vigia', 'robô', 'militar'],
  },
  {
    id: 'pet-cyber-dog',
    name: 'Cão de Guarda Biocibernético',
    category: 'pet',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80',
    tags: ['pet', 'cão', 'guarda', 'mordida'],
  },
  {
    id: 'pet-cyber-cat',
    name: 'Felino Sintético / Gato de Rua',
    category: 'pet',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
    tags: ['pet', 'gato', 'felino', 'biopet'],
  },
  {
    id: 'pet-falcon',
    name: 'Ciber-Falcão de Reconhecimento',
    category: 'pet',
    url: 'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?w=600&auto=format&fit=crop&q=80',
    tags: ['pet', 'falcão', 'ave', 'aéreo', 'drone'],
  },

  // --- VEÍCULOS ---
  {
    id: 'veh-kusanagi',
    name: 'Yaiba Kusanagi CT-3X (Moto)',
    category: 'veiculo',
    url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=700&auto=format&fit=crop&q=80',
    tags: ['moto', 'esportiva', 'veloz', 'kusanagi'],
  },
  {
    id: 'veh-apollo',
    name: 'Brennan Apollo (Moto Off-Road)',
    category: 'veiculo',
    url: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=700&auto=format&fit=crop&q=80',
    tags: ['moto', 'nômade', 'trilha', 'apollo'],
  },
  {
    id: 'veh-turbor',
    name: 'Quadra Turbo-R V-Tech (Muscle)',
    category: 'veiculo',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=700&auto=format&fit=crop&q=80',
    tags: ['carro', 'muscle', 'turbo', 'quadra'],
  },
  {
    id: 'veh-mackinaw',
    name: 'Thorton Mackinaw (Picape Pesada)',
    category: 'veiculo',
    url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=700&auto=format&fit=crop&q=80',
    tags: ['picape', 'nômade', 'carga', 'thorton'],
  },
  {
    id: 'veh-caliburn',
    name: 'Rayfield Caliburn (Hipercarro)',
    category: 'veiculo',
    url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=700&auto=format&fit=crop&q=80',
    tags: ['hipercarro', 'luxo', 'rayfield', 'aerodinâmico'],
  },
  {
    id: 'veh-behemoth',
    name: 'Militech Behemoth Blindado',
    category: 'veiculo',
    url: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=700&auto=format&fit=crop&q=80',
    tags: ['blindado', 'caminhão', 'militar', 'militech'],
  },
  {
    id: 'veh-av4',
    name: 'Zetatech Surveyance (Aerodino AV-4)',
    category: 'veiculo',
    url: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=700&auto=format&fit=crop&q=80',
    tags: ['aerodino', 'av-4', 'aéreo', 'drone'],
  },

  // --- ARMAS ---
  {
    id: 'wpn-heavy-pistol',
    name: 'Pistola Pesada Tática',
    category: 'arma',
    url: 'https://images.unsplash.com/photo-1585589074491-3c1bbac1dc42?w=600&auto=format&fit=crop&q=80',
    tags: ['pistola', 'pesada', 'tiro', 'revólver'],
  },
  {
    id: 'wpn-assault-rifle',
    name: 'Fuzil de Assalto Militech',
    category: 'arma',
    url: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=600&auto=format&fit=crop&q=80',
    tags: ['fuzil', 'assalto', 'militar', 'rajada'],
  },
  {
    id: 'wpn-shotgun',
    name: 'Espingarda Tática de Combate',
    category: 'arma',
    url: 'https://images.unsplash.com/photo-1572883454114-1cf0031ede2a?w=600&auto=format&fit=crop&q=80',
    tags: ['shotgun', 'espingarda', 'curto alcance', 'chumbo'],
  },
  {
    id: 'wpn-katana',
    name: 'Katana Monomolecular Arasaka',
    category: 'arma',
    url: 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=600&auto=format&fit=crop&q=80',
    tags: ['katana', 'espada', 'lâmina', 'corte'],
  },

  // --- CROMOS / CIBERWARE ---
  {
    id: 'cw-optics',
    name: 'Ciberolho Óptico Kiroshi',
    category: 'cromo',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
    tags: ['ciberolho', 'óptico', 'visão', 'kiroshi'],
  },
  {
    id: 'cw-sandevistan',
    name: 'Acelerador Sandevistan / Neural',
    category: 'cromo',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    tags: ['sandevistan', 'neural', 'velocidade', 'reflexos'],
  },
  {
    id: 'cw-cyberarm',
    name: 'Ciberbraço Mecânico Reforçado',
    category: 'cromo',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80',
    tags: ['ciberbraço', 'membro', 'prótese', 'força'],
  },
  {
    id: 'cw-subdermal',
    name: 'Blindagem Subcutânea de Titânio',
    category: 'cromo',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    tags: ['blindagem', 'subcutânea', 'armadura', 'pele'],
  },
];
