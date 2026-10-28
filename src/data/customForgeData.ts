import { HomebrewWeapon, HomebrewCyberware, HomebrewVehicle, HomebrewGearOrDrug } from './homebrewData';

// -------------------------------------------------------------
// FABRICANTES E MARCAS OFICIAIS DE NIGHT CITY
// -------------------------------------------------------------
export const VEHICLE_MANUFACTURERS = [
  { name: 'Quadra', origin: 'EUA / Detroit', reputation: 'Muscle cars potentes, barulhentos e ícones de rua (Turbo-R, Type-66).' },
  { name: 'Thorton', origin: 'EUA / Badlands', reputation: 'Picape e utilitários indestrutíveis muito usados por Nômades (Colby, Mackinaw).' },
  { name: 'Archer', origin: 'China / EUA', reputation: 'Carros compactos e sedãs acessíveis e fáceis de reparar (Hella, Quartz).' },
  { name: 'Rayfield', origin: 'Reino Unido', reputation: 'Superesportivos de ultraluxo aeroespacial para a elite corporativa (Caliburn, Aerondight).' },
  { name: 'Chevillon', origin: 'EUA', reputation: 'Sedãs pesados e viaturas de patrulha governamentais blindadas (Thrax, Emperor).' },
  { name: 'Mizutani', origin: 'Japão', reputation: 'Esportivos velozes com motores turboalimentados muito procurados por Tyger Claws (Shion).' },
  { name: 'Brennan', origin: 'EUA', reputation: 'Motos de aventura e rali de alta resistência para dunas e terra (Apollo).' },
  { name: 'Yaiba', origin: 'Japão', reputation: 'Supermotos aerodinâmicas velozes com tecnologia aeroespacial (Kusanagi).' },
  { name: 'Kaukaz', origin: 'União Soviética', reputation: 'Caminhões e blindados militares maciços com blindagem pesada (Zeya, Bratsk).' },
  { name: 'Villefort', origin: 'EUA', reputation: 'Sedãs clássicos e limusines executivas espaçosas e elegantes (Cortes, Alvarado).' },
  { name: 'Militech Defense', origin: 'EUA', reputation: 'Veículos blindados militares e canhoneiras AV-4 armadas para combate urbano.' },
];

export const WEAPON_MANUFACTURERS = [
  { name: 'Arasaka', origin: 'Japão', specialty: 'Armas de precisão militar, fuzis inteligentes e espadas monomoleculares de elite.' },
  { name: 'Militech', origin: 'EUA', specialty: 'Armamento padrão das forças armadas, confiável, robusto e compatível com munição militar.' },
  { name: 'Malorian Arms', origin: 'EUA', specialty: 'Pistolas e canhões de mão lendários feitos sob medida para Solos veteranos.' },
  { name: 'Tsunami Arms', origin: 'Japão', specialty: 'Fuzis sniper de alta tecnologia, tecnologia Gauss eletromagnética e smartguns.' },
  { name: 'Rostović', origin: 'Sérvia', specialty: 'Escopetas brutais e revólveres pesados baratos, barulhentos e muito resistentes.' },
  { name: 'Kendachi', origin: 'Japão', specialty: 'Lâminas térmicas, monokatanas cirúrgicas e armas brancas de carbono avançado.' },
  { name: 'Constitutional Arms', origin: 'EUA', specialty: 'Escopetas compactas e pistolas pesadas para defesa pessoal e segurança civil.' },
  { name: 'BudgetArms', origin: 'EUA', specialty: 'Armas de plástico descartáveis e baratas vendidas em máquinas de autosserviço (Vendits).' },
  { name: 'Federated Arms', origin: 'EUA', specialty: 'Pistolas automáticas clássicas e submetralhadoras urbanas de baixo custo.' },
  { name: 'Midnight Arms', origin: 'EUA', specialty: 'Canhões anti-material pesados, espingardas automáticas e lançadores de granadas.' },
];

export const CYBERWARE_MANUFACTURERS = [
  { name: 'Kiroshi Optics', specialty: 'Ciberolhos de alta definição, scanners ópticos, HUDs táticos e filtros térmicos.' },
  { name: 'Dynalar Technologies', specialty: 'Ciberbraços modulares, sistemas musculares enxertados e cyberware de reflexo.' },
  { name: 'Zetatech', specialty: 'Processadores neurais, cyberdecks integrados e chips de interface de dados.' },
  { name: 'Raven Microcybernetics', specialty: 'Ciberáudios sensíveis, sistemas de comunicação cifrados e jammers neurais.' },
  { name: 'Biotechnica', specialty: 'Músculos biológicos enxertados, órgãos clonados, glândulas de toxina e nanotecnologia.' },
  { name: 'Arasaka Medical Labs', specialty: 'Ciberware militar de camuflagem óptica, reforço ósseo de titânio e blindagem subdérmica.' },
  { name: 'Militech Combat Systems', specialty: 'Lançadores de projéteis de pulso, garras embutidas e aceleradores Sandevistan.' },
];

// -------------------------------------------------------------
// TABELAS DE DADOS MECÂNICOS E TEMÁTICOS PARA GERAÇÃO PROCEDURAL
// -------------------------------------------------------------

export const VEHICLE_TYPES = [
  { type: 'Motocicleta', baseSDP: 35, baseSP: 7, seats: 2, maxSpeed: 130, combatMove: 25, handlingDV: 13, baseCost: 15000 },
  { type: 'Carro Compacto', baseSDP: 50, baseSP: 10, seats: 4, maxSpeed: 105, combatMove: 20, handlingDV: 13, baseCost: 20000 },
  { type: 'Carro Esportivo de Luxo', baseSDP: 60, baseSP: 10, seats: 2, maxSpeed: 165, combatMove: 32, handlingDV: 15, baseCost: 50000 },
  { type: 'Picape / Van', baseSDP: 75, baseSP: 13, seats: 5, maxSpeed: 95, combatMove: 18, handlingDV: 13, baseCost: 30000 },
  { type: 'Caminhão Pesado / Blindado', baseSDP: 110, baseSP: 18, seats: 6, maxSpeed: 80, combatMove: 15, handlingDV: 15, baseCost: 75000 },
  { type: 'Aerodino AV / Aeronave', baseSDP: 85, baseSP: 15, seats: 4, maxSpeed: 200, combatMove: 40, handlingDV: 17, baseCost: 120000 },
  { type: 'Barco / Aquático', baseSDP: 65, baseSP: 10, seats: 4, maxSpeed: 85, combatMove: 16, handlingDV: 13, baseCost: 25000 },
];

export const NOMAD_MODS_POOL = [
  'Blindagem Reforçada em Chapas de Aço Rebitadas (+5 SDP, +2 SP)',
  'Tanque Duplo de CHOOH2 Blindado (Imune a furos de tiros normais)',
  'Injetor de Nitro-Booster (Aumenta velocidade máxima em +30 mph por 3 rodadas)',
  'Pneus Maciços Antifuro de Composto Térmico (Imunes a pregos e furos)',
  'Jammer de Rastreadores & Frequências de Rádio (Bloqueia drones em 50m)',
  'Aríete Frontal de Impacto Reforçado (Dobra dano ao abalroar outros veículos)',
  'Faróis Halógenos de Caça Noturna e Infravermelho',
  'Compartimento de Fundo Falso Selado com Chumbo (Invisível a raio-X)',
  'Vidros Fumê Blindados com Polarização Eletromagnética Instantânea',
  'Lança-Chamas de Tubo de Escapamento Traseiro (Dano 3d6 contra perseguidores)',
  'Sistema de Ejeção de Assento de Emergência com Paraquedas',
  'Computador de Bordo com HUD Holográfico e Interface Smartlink',
];

export const VEHICLE_WEAPONS_POOL = [
  { name: 'Metralhadora Tática Rostović 5.56mm', damage: '5d6', rof: 1, mountType: 'Torreta Remota de Teto com Mira Automática' },
  { name: 'Canhão Pesado Automático 12.7mm', damage: '6d6', rof: 1, mountType: 'Montagem Fixa Frontal no Capô (Disparo do Piloto)' },
  { name: 'Lançador Quádruplo de Foguetes Não-Guiados', damage: '8d6 em área de 6m', rof: 1, mountType: 'Cápsula Lateral na Carroceria (4 disparos)' },
  { name: 'Escopeta Automática Dupla 12GA', damage: '5d6', rof: 2, mountType: 'Grelha Frontal Oculta sob a Placa' },
  { name: 'Gerador de Pulso Eletromagnético (EMP)', damage: 'Desativa veículos em 10m por 1 rodada', rof: 1, mountType: 'Subchassi Traseiro' },
];

export const WEAPON_CATEGORIES_DATA = [
  { category: 'Pistola Pesada', damage: '3d6', rof: 2, shots: 8, concealment: 'Ocultável em Jaqueta (J)', ammo: '9mm / 11mm Pesada' },
  { category: 'Pistola Muito Pesada', damage: '4d6', rof: 1, shots: 8, concealment: 'Sob Sobretudo (L)', ammo: '.45 ACP / .50 Magnum' },
  { category: 'Submetralhadora (SMG)', damage: '2d6', rof: 1, shots: 30, concealment: 'Ocultável em Jaqueta (J)', ammo: '9mm Parabellum' },
  { category: 'Submetralhadora Pesada', damage: '3d6', rof: 1, shots: 40, concealment: 'Sob Sobretudo (L)', ammo: '10mm Auto' },
  { category: 'Fuzil de Assalto', damage: '5d6', rof: 1, shots: 30, concealment: 'Não Ocultável (N)', ammo: '5.56mm NATO / 7.62mm' },
  { category: 'Fuzil de Sniper', damage: '5d6', rof: 1, shots: 6, concealment: 'Não Ocultável (N)', ammo: '7.62x51mm / .338 Lapua' },
  { category: 'Espingarda Tática', damage: '5d6', rof: 1, shots: 8, concealment: 'Não Ocultável (N)', ammo: 'Cartuchos 12GA (Chumbo/Slug)' },
  { category: 'Arma Branca Muito Pesada', damage: '4d6', rof: 1, shots: 0, concealment: 'Sob Sobretudo (L)', ammo: 'Nenhuma (Corte/Impacto)' },
  { category: 'Arma Branca Média (Faca/Machete)', damage: '2d6', rof: 2, shots: 0, concealment: 'Ocultável em Jaqueta (J)', ammo: 'Nenhuma (Corte)' },
  { category: 'Canhão de Mão Exótico / Tech', damage: '5d6', rof: 1, shots: 4, concealment: 'Sob Sobretudo (L)', ammo: 'Célula de Energia Tech' },
];

export const WEAPON_ATTACHMENTS_POOL = [
  'Interface Smartlink (Requer ciberolho Kiroshi; concede +1 em testes de Ataque)',
  'Mira Holográfica Red-Dot (Concede +1 em disparos de média distância)',
  'Silenciador Tático de Titânio (Reduz som do tiro a um estalo abafado; DV 17 Ouvir)',
  'Tambor de Munição Expandido (+50% de capacidade no carregador)',
  'Módulo Laser Visível Infravermelho (+1 em tiros sem mira demorada)',
  'Empunhadura Ergonômica de Carbono Texturizado (+1 para resistir a desarme)',
  'Gatilho Aliviado de Competição (Saque e disparo rápidos no mesmo turno)',
  'Cano Pesado Raiado com Compensador de Recuo (Permite Rajadas com menos desvio)',
];

export const WEAPON_SPECIAL_EFFECTS_POOL = [
  'Projéteis Térmicos Incendiários: Se o alvo sofrer dano penetrante, entra em Chamas (2 de dano/rodada até apagar).',
  'Pulso EMP Neuronal: Em acertos críticos, sobrecarrega ciberware óptico do alvo cegando-o por 1 rodada.',
  'Carga Perfurante de Tungstênio: Ignora 2 pontos do SP de armadura do alvo no cálculo de penetração.',
  'Ricochete Computadorizado Smart: Pode atingir alvos atrás de cobertura total ricocheteando no piso/parede (-2 no ataque).',
  'Fio Monomolecular de Plasma: Ignora metade do SP da armadura em ataques corpo a corpo.',
  'Disparo Concussivo de Choque: Força teste de Resistência DV 14 ou o alvo é derrubado no chão.',
  'Célula Criogênica: Reduz o movimento (MOVE) do alvo em -2 pelo restante do turno do impacto.',
];

export const CYBERWARE_CATEGORIES_DATA = [
  { type: 'Neural', baseHL: '2d6 (7)', install: 'Clínica', desc: 'Processador neural que serve de base para cabos de dados, chips de perícia e Sandevistan.' },
  { type: 'Óptico', baseHL: '2d6 (7)', install: 'Clínica', desc: 'Substituição ocular por ciberolho com slots para miras, termografia e gravação de vídeo.' },
  { type: 'Auditivo', baseHL: '2d6 (7)', install: 'Clínica', desc: 'Ciberáudio interno com amplificadores de som, rádio bug detector e comunicação cifrada.' },
  { type: 'Membros', baseHL: '3d6 (10)', install: 'Hospital', desc: 'Ciberbraço ou Ciberperna reforçados com fibra de carbono, juntas blindadas e slots de armas embutidas.' },
  { type: 'Corporal', baseHL: '2d6 (7)', install: 'Clínica', desc: 'Implantes internos como pulmões de ar filtrado, injetores de adrenalina e coração sintético.' },
  { type: 'Borgware', baseHL: '4d6 (14)', install: 'Hospital', desc: 'Modificações corporais extremas para combate pesado com alta taxa de alienação e perda de humanidade.' },
];

export const CYBERWARE_EFFECTS_POOL = [
  '+2 em testes de Percepção Visual e mira noturna sem penalidades de escuridão.',
  'Concede +1 em Iniciativa e permite esquivar de projéteis balísticos mesmo sem REF 8.',
  'Adiciona +5 de PV máximo temporário e resiste a efeitos de toxinas ambientais com DV 15.',
  'Blindagem Subdérmica integrada que concede SP 7 para todo o corpo sem volume visível.',
  'Lâmina retrátil embutida no antebraço que pode ser sacada com Ação Livre (Dano 3d6, ROF 2).',
  'Injetor automático de Adrenalina: restaura 10 PV uma vez por dia quando a vida cair abaixo da metade.',
  'Interface de Netrunning direta com capacidade para carregar 2 programas adicionais no deck.',
  'Sensor de Movimento periférico em 360 graus que impede ataques furtivos pelas costas.',
];

// -------------------------------------------------------------
// FUNÇÕES DE GERAÇÃO PROCEDURAL (OFFLINE & INSTANTÂNEA)
// -------------------------------------------------------------

export function generateProceduralVehicle(options?: {
  type?: string;
  clanOrVibe?: string;
}): HomebrewVehicle {
  const vType = VEHICLE_TYPES.find(t => t.type === options?.type) || VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)];
  const mfg = VEHICLE_MANUFACTURERS[Math.floor(Math.random() * VEHICLE_MANUFACTURERS.length)];
  const clan = options?.clanOrVibe || 'Nômades Aldecaldos';

  const modelNames = ['Interceptor', 'Valkyrie', 'Wasteland King', 'Dune Runner', 'Nightstalker', 'Ghost Apex', 'Road Marauder', 'Iron Beast', 'Chrome Falcon', 'Thunderbolt'];
  const nickNames = ['Fúria do Asfalto', 'Besta de Ferro', 'Cangaceiro dos Badlands', 'Espinho Negro', 'Vento Tóxico', 'Sombra de Cromo', 'Devorador de CHOOH2'];
  
  const pickedModel = modelNames[Math.floor(Math.random() * modelNames.length)];
  const pickedNick = nickNames[Math.floor(Math.random() * nickNames.length)];
  const fullVehicleName = `${mfg.name} ${pickedModel} "${pickedNick}"`;

  // Select 2 random nomad mods
  const shuffledMods = [...NOMAD_MODS_POOL].sort(() => 0.5 - Math.random());
  const selectedMods = shuffledMods.slice(0, 2);

  // Maybe vehicle weapon
  const hasWeapon = Math.random() > 0.35;
  const weaponsMounted = hasWeapon ? [VEHICLE_WEAPONS_POOL[Math.floor(Math.random() * VEHICLE_WEAPONS_POOL.length)]] : [];

  const engines = [
    'V8 CHOOH2 Turboalimentado com escapamento livre',
    'Motor Híbrido Quântico com células de grafeno e recarga cinética',
    'Bi-turbo 4.0L com injeção direta de nitro e resfriador a nitrogênio',
    'Motor Elétrico Industrial de Alto Torque com baterias blindadas',
  ];

  const aesthetics = [
    'Pintura preto fosco com chapas de blindagem corrugadas rebitadas nas portas, luzes de LED âmbar sob o chassi e arranhões profundos de tiroteio.',
    'Carenagem aerodinâmica em fibra de carbono exposta com neons azul turquesa pulsantes e vidros polarizados espelhados.',
    'Pintura camuflada do deserto gasta pelo sol, para-brisa protegido por grade de aço e dois holofotes halógenos no teto.',
    'Chassi cromado reluzente com faixas vermelhas esportivas, suspensão rebaixada pneumática e interior em couro sintético vermelho.',
  ];

  const quirks = [
    'O rádio de bordo só sintoniza a estação de rádio pirata dos Badlands e o escapamento cospe labaredas ao reduzir.',
    'A partida só funciona após dar dois toques no painel de fusíveis central devido a um relé adaptado.',
    'Possui um compartimento refrigerado oculto sob o banco do motorista que cabe 4 latas ou um pacote de credsticks.',
    'O alarme emite o som ensurdecedor de uma sirene corporativa da MaxTac para afugentar ladrões de rua.',
  ];

  return {
    id: `hb-veh-${Date.now()}`,
    name: fullVehicleName,
    model: `${mfg.name} ${pickedModel}`,
    manufacturer: mfg.name,
    type: vType.type,
    clanOrOrigin: clan,
    sdp: vType.baseSDP + Math.floor(Math.random() * 15),
    armorBodySP: vType.baseSP + (selectedMods.some(m => m.includes('SP')) ? 2 : 0),
    armorGlassSP: Math.max(5, vType.baseSP - 3),
    seats: vType.seats,
    cargoCapacityKg: vType.type.includes('Caminhão') ? 2500 : vType.type.includes('Picape') ? 800 : 200,
    speedMph: vType.maxSpeed + Math.floor(Math.random() * 20),
    combatMove: vType.combatMove,
    handlingDV: vType.handlingDV,
    engineAndFuel: engines[Math.floor(Math.random() * engines.length)],
    costEb: `${vType.baseCost + Math.floor(Math.random() * 5) * 1000}eb`,
    weaponsMounted,
    installedNomadMods: selectedMods,
    visualAesthetic: aesthetics[Math.floor(Math.random() * aesthetics.length)],
    quirk: quirks[Math.floor(Math.random() * quirks.length)],
    notes: `Fabricado por ${mfg.name} (${mfg.origin}). Customizado para sobreviver às zonas mais brutais de Night City.`,
    author: 'Forja Mecânica de Night City',
    createdAt: new Date().toLocaleDateString('pt-BR'),
    isAiGenerated: false,
  };
}

export function generateProceduralWeapon(options?: {
  category?: string;
  manufacturer?: string;
  quality?: string;
}): HomebrewWeapon {
  const catData = WEAPON_CATEGORIES_DATA.find(c => c.category === options?.category) || WEAPON_CATEGORIES_DATA[Math.floor(Math.random() * WEAPON_CATEGORIES_DATA.length)];
  const mfg = WEAPON_MANUFACTURERS.find(m => m.name === options?.manufacturer) || WEAPON_MANUFACTURERS[Math.floor(Math.random() * WEAPON_MANUFACTURERS.length)];

  const weaponCodes = ['MK-IV', 'Viper', 'Hellfire', 'Widowmaker', 'Spectre', 'Carnage', 'Executioner', 'Ronin', 'Tsunami', 'Overkill'];
  const weaponNick = weaponCodes[Math.floor(Math.random() * weaponCodes.length)];
  const fullWeaponName = `${mfg.name} ${weaponNick} (${catData.category})`;

  const qualities = ['Pobre', 'Padrão', 'Excelente', 'Lendária'];
  const pickedQuality = options?.quality || qualities[Math.floor(Math.random() * qualities.length)];

  const shuffledAttachments = [...WEAPON_ATTACHMENTS_POOL].sort(() => 0.5 - Math.random());
  const selectedAttachments = shuffledAttachments.slice(0, pickedQuality === 'Excelente' || pickedQuality === 'Lendária' ? 2 : 1);
  const selectedEffect = WEAPON_SPECIAL_EFFECTS_POOL[Math.floor(Math.random() * WEAPON_SPECIAL_EFFECTS_POOL.length)];

  const costs: Record<string, string> = {
    'Pobre': '100eb (Qualidade Pobre - Engasga no 1)',
    'Padrão': '500eb (Qualidade Padrão de Rua)',
    'Excelente': '1.000eb (Qualidade Excelente - +1 no Ataque)',
    'Lendária': '2.500eb (Protótipo Militar de Elite)',
  };

  const visuals = [
    'Carcaça de polímero texturizado preto fosco com inscrições em kanji dourado e contador de munição digital OLED na lateral.',
    'Cromado pesado escovado com marcas de desgaste nas quinas e cabo revestido em fita isolante térmica.',
    'Pintura camuflada urbana em tons de cinza com cano perfurado ventilado e trilhos Picatinny para acessórios.',
    'Estrutura em fibra de carbono levíssima com detalhes em neon vermelho que iluminam levemente o gatilho.',
  ];

  const quirks = [
    'O coice produz um som agudo e metálico inconfundível que faz cabeças virarem nas redondezas.',
    'Possui número de série raspado e uma marca de contagem de 7 entalhes feitos com faca na empunhadura.',
    'O ejetor cospe cartuchos quentes com tanta força que podem queimar quem estiver imediatamente à direita.',
    'A arma aquece a mão do atirador através de resistências embutidas, ideal para noites geladas de vigília.',
  ];

  return {
    id: `hb-w-${Date.now()}`,
    name: fullWeaponName,
    category: catData.category,
    damage: catData.damage,
    rof: catData.rof,
    cost: costs[pickedQuality] || '500eb',
    shots: catData.shots,
    concealment: catData.concealment,
    reliability: pickedQuality === 'Pobre' ? 'Pobre (Engasga no 1)' : pickedQuality === 'Excelente' ? 'Muito Boa (+1 Ataque)' : 'Padrão',
    specialEffect: selectedEffect,
    notes: `Fabricada por ${mfg.name}. Calibre: ${catData.ammo}. Qualidade: ${pickedQuality}. Acessórios: ${selectedAttachments.join(', ')}. Estética: ${visuals[Math.floor(Math.random() * visuals.length)]} Peculiaridade: ${quirks[Math.floor(Math.random() * quirks.length)]}`,
    author: 'Armeiro Clandestino de Night City',
    createdAt: new Date().toLocaleDateString('pt-BR'),
  };
}

export function generateProceduralCyberware(options?: {
  type?: string;
  manufacturer?: string;
}): HomebrewCyberware {
  const cat = CYBERWARE_CATEGORIES_DATA.find(c => c.type === options?.type) || CYBERWARE_CATEGORIES_DATA[Math.floor(Math.random() * CYBERWARE_CATEGORIES_DATA.length)];
  const mfg = CYBERWARE_MANUFACTURERS.find(m => m.name === options?.manufacturer) || CYBERWARE_MANUFACTURERS[Math.floor(Math.random() * CYBERWARE_MANUFACTURERS.length)];

  const cNames = ['Synapse Overload', 'Phantom Reflex', 'Ghost Eye', 'Titanium Core', 'Neuro-Surge', 'Aegis Plating', 'Viper Strike', 'Bio-Boost'];
  const fullCName = `${mfg.name} ${cNames[Math.floor(Math.random() * cNames.length)]} (Série ${cat.type})`;

  const effect = CYBERWARE_EFFECTS_POOL[Math.floor(Math.random() * CYBERWARE_EFFECTS_POOL.length)];

  const costs = ['500eb (Carregador Padrão)', '1.000eb (Cromo Avançado)', '1.500eb (Cirurgia Militar)', '2.500eb (Protótipo Negro)'];

  const visualStyles = [
    'Carcaça de titânio acetinado com conectores banhados a ouro e fibra de carbono à mostra.',
    'Acabamento em pele sintética RealSkinned de terceira geração indistinguível de carne humana até o toque.',
    'Módulo metálico polido com luzes LED azuis pulsando sob uma lente de acrílico fumê.',
    'Chapa de blindagem externa texturizada em preto fosco com parafusos hexagonais de aço.',
  ];

  const glitches = [
    'Provoca um zumbido sutil na nuca quando há equipamentos militares ativos em um raio de 30 metros.',
    'Gera um tremor reflexo involuntário nos nós dos dedos quando a temperatura cai abaixo de zero.',
    'Emite um brilho fraco e estático nas extremidades quando o usuário sofre estresse severo de combate.',
    'Exige lubrificação com fluido sintético a cada 6 meses sob pena de chiar nas articulações.',
  ];

  return {
    id: `hb-c-${Date.now()}`,
    name: fullCName,
    type: cat.type,
    humanityLoss: cat.baseHL,
    cost: costs[Math.floor(Math.random() * costs.length)],
    install: cat.install,
    description: `${cat.desc} Desenvolvido pelos laboratórios da ${mfg.name}. Estética: ${visualStyles[Math.floor(Math.random() * visualStyles.length)]} Peculiaridade: ${glitches[Math.floor(Math.random() * glitches.length)]}`,
    mechanicalBonus: effect,
    author: 'Ripperdoc de Garagem',
    createdAt: new Date().toLocaleDateString('pt-BR'),
  };
}

export function generateProceduralGearOrDrug(options?: {
  category?: string;
}): HomebrewGearOrDrug {
  const isDrug = options?.category?.includes('Droga') || Math.random() > 0.5;

  if (isDrug) {
    const drugNames = ['Red Rush', 'Cyber-Stash', 'Blue Haze', 'Neuro-Blitz', 'Black Ice Drop', 'Ghost Fire', 'Viper Kiss'];
    const slangs = ['Fogo Vermelho', 'Raio Azul', 'Chute no Cérebro', 'Pó de Chooh2', 'Gelo Negro', 'Picada'];
    const pEffects = [
      '+2 em Iniciativa e +1 em Esquiva (Evasion) pela próxima 1 hora.',
      'Ignora completamente penalidades de Ferimentos Graves durante 30 minutos.',
      '+2 em testes de Sangue Frio e Intimidação; reduz a ansiedade de combate a zero.',
      'Aumenta o movimento (MOVE) em +3 e permite correr o dobro da velocidade em arrancadas.',
    ];
    const sCrashes = [
      'Após o efeito: -2 em todos os testes físicos por 4 horas devido a tremores intensos.',
      'Crash: enxaqueca severa e hipersensibilidade à luz solar ou neons brilhantes (-2 Percepção).',
      'Ressaca química: fadiga muscular extrema, exigindo dormir 8 horas ou sofrer 2 de dano.',
    ];

    const idx = Math.floor(Math.random() * drugNames.length);
    return {
      id: `hb-g-${Date.now()}`,
      name: drugNames[idx],
      slang: slangs[idx],
      category: 'Droga de Rua / Químico de Combate',
      costEb: `${Math.floor(Math.random() * 4 + 1) * 25}eb / dose`,
      deliveryMethodOrInterface: 'Inalador nasal pressurizado ou ampola hipodérmica de pulso',
      primaryEffect: pEffects[Math.floor(Math.random() * pEffects.length)],
      secondaryOrCrashEffect: sCrashes[Math.floor(Math.random() * sCrashes.length)],
      addictionDV: Math.floor(Math.random() * 4) + 12,
      duration: '1 hora de euforia e prontidão de combate',
      visualAesthetic: 'Ampola de vidro fosco com líquido efervescente luminescente e tampa de borracha lacrada.',
      notes: 'Substância sintética proibida sintetizada em laboratórios de porão em Arroyo.',
      author: 'Químico dos Valentinos',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      isAiGenerated: false,
    };
  } else {
    const gearNames = ['Cyberdeck Personalizado "Net-Reaper"', 'Colete Tático Reforçado "Aegis V"', 'Drone de Reconhecimento "Micro-Mosquito"', 'Arpéu Magnético com Cabo de Kevlar'];
    const gearEffects = [
      'Cyberdeck com 7 slots de programas, armadura SP 12 de hardware e módulo de overclocking (+1 Interface).',
      'Colete leve de Kevlar com placas de cerâmica móveis (SP 12 no corpo sem penalidade de MOVE).',
      'Drone aéreo furtivo com câmera térmica de longo alcance controlável por agente neural (DV 13 Furtividade).',
      'Arpéu motorizado que suporta até 200kg e dispara até 25 metros em 1 Ação.',
    ];
    const idx = Math.floor(Math.random() * gearNames.length);
    return {
      id: `hb-g-${Date.now()}`,
      name: gearNames[idx],
      slang: 'Ganga Tática de Elite',
      category: 'Equipamento Especial',
      costEb: `${Math.floor(Math.random() * 5 + 2) * 200}eb`,
      deliveryMethodOrInterface: 'Acoplável ao cinto tático ou interface neural direta',
      primaryEffect: gearEffects[idx],
      secondaryOrCrashEffect: 'Requer manutenção ou recarga de bateria a cada uso prolongado.',
      visualAesthetic: 'Equipamento militar preto fosco com borrachas de vedação contra chuva ácida e conectores reforçados.',
      notes: 'Item confeccionado artesanalmente por um Técnico do Afterlife com peças militares.',
      author: 'Técnico de Armazém',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      isAiGenerated: false,
    };
  }
}
