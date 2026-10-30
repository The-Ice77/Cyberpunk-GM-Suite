import { enrichNPCFromCodex } from '../services/codexCatalog';
// ========================================================
// GERADOR DEDICADO DE CIVIS & CIDADÃOS (CYBERPUNK RED)
// Baseado no DLC Everyday People & Night City Lore
// ========================================================

import { GameSystem, NPCSheet, WeaponItem } from '../types/system';

export type CivilianOccupationId =
  | 'street_vendor'
  | 'bodega_owner'
  | 'factory_worker'
  | 'club_bartender'
  | 'corp_junior_clerk'
  | 'scared_witness'
  | 'gang_victim'
  | 'clinic_nurse'
  | 'street_performer'
  | 'tech_repairman'
  | 'cubicle_tenant';

export type CivilianDistrictOrigin =
  | 'watson'
  | 'heywood'
  | 'pacifica'
  | 'city_center'
  | 'badlands'
  | 'santo_domingo';

export interface CivilianOccupationOption {
  id: CivilianOccupationId;
  name: string;
  badge: string;
  description: string;
  typicalClothes: string;
  typicalSelfDefense: string[];
}

export const CIVILIAN_OCCUPATIONS: CivilianOccupationOption[] = [
  {
    id: 'street_vendor',
    name: 'Vendedor de Rua / Cozinheiro de Barraca',
    badge: 'Comércio Popular',
    description: 'Trabalhador autônomo que passa o dia fritando comida sintética ou vendendo bugigangas sob chuva ácida.',
    typicalClothes: 'Avental manchado de gordura sobre moletom velho e touca térmica.',
    typicalSelfDefense: ['Cutelo de Cozinha Pesado 2d6', 'Frasco de Óleo Fervente'],
  },
  {
    id: 'bodega_owner',
    name: 'Dono de Mercearia / Bodega 24h',
    badge: 'Comércio Local',
    description: 'Comerciante desconfiado atrás de um balcão com vidro blindado trincado, acostumado com assaltos noturnos.',
    typicalClothes: 'Camisa pólo desbotada, suspensórios e óculos de leitura com armação colada com fita.',
    typicalSelfDefense: ['Espingarda Cano Duplo Antiga 4d6 (debaixo do balcão)', 'Botão de Alarme de Pânico'],
  },
  {
    id: 'factory_worker',
    name: 'Operário Fabril / Trabalhador Portuário',
    badge: 'Indústria Pesada',
    description: 'Trabalha em turnos de 14 horas montando peças mecânicas ou descarregando contêineres no porto.',
    typicalClothes: 'Macacão industrial resistente a ácido, luvas de couro gastas e botas com biqueira de aço.',
    typicalSelfDefense: ['Chave de Fenda Industrial 1d6', 'Pequeno Pé de Cabra 2d6'],
  },
  {
    id: 'club_bartender',
    name: 'Bartender / Garçom de Boate Noturna',
    badge: 'Vida Noturna',
    description: 'Escuta segredos de Fixers bêbados e Solos estressados enquanto serve shots de álcool destilado barato.',
    typicalClothes: 'Camisa preta justa, colete com fiação neon suave e pano úmido no ombro.',
    typicalSelfDefense: ['Garrafa de Vidro Quebrada 1d6', 'Spray de Pimenta / Atordoamento'],
  },
  {
    id: 'corp_junior_clerk',
    name: 'Contador / Funcionário Corporativo Júnior',
    badge: 'Colarinho Branco',
    description: 'Engrenagem dispensável de uma megacorporação, morrendo de medo de demissão sumária ou corte de convênio.',
    typicalClothes: 'Terno executivo sintético barato de poliéster, crachá holográfico no peito e maleta pasta rígida.',
    typicalSelfDefense: ['Canivete Retrátil 1d6', 'Agente Descartável para Chamar Segurança'],
  },
  {
    id: 'scared_witness',
    name: 'Testemunha Ocular Aterrorizada',
    badge: 'Segredo Perigoso',
    description: 'Estava no lugar errado na hora errada e viu um assassinato corporativo ou descarregamento de contrabando.',
    typicalClothes: 'Roupas civis amarrotadas, capuz puxado até os olhos e olhar paranoico para todas as esquinas.',
    typicalSelfDefense: ['Desarmado (Foco absoluto em correr e se esconder)'],
  },
  {
    id: 'gang_victim',
    name: 'Morador Vítima de Extorsão de Gangue',
    badge: 'Desespero',
    description: 'Família está sendo ameaçada pela gangue local que exige taxa de proteção semanal que ele não pode pagar.',
    typicalClothes: 'Roupas casuais surradas, bandagens nos nós dos dedos ou rosto com hematoma recente.',
    typicalSelfDefense: ['Tubo de Ferro Improvisado 1d6', 'Faca de Cozinha 1d6'],
  },
  {
    id: 'clinic_nurse',
    name: 'Enfermeiro Comunitário / Cuidador de Beco',
    badge: 'Saúde Popular',
    description: 'Atende feridos a tiros e doentes pobres que não têm como pagar os preços abusivos do Trauma Team.',
    typicalClothes: 'Jaleco cirúrgico descolorido, luvas de borracha estéreis e estetoscópio analógico no pescoço.',
    typicalSelfDefense: ['Bisturi Descartável 1d6', 'Injetor Hipodérmico com Sedativo Leve'],
  },
  {
    id: 'street_performer',
    name: 'Artista de Rua / Rockerboy Amador',
    badge: 'Cultura de Rua',
    description: 'Toca sintetizador ou guitarra de segunda mão nas calçadas de Night City sonhando com um contrato musical.',
    typicalClothes: 'Jaqueta jeans repleta de patches musicais, cabelo pintado com tinta fluorescente e fones nos ouvidos.',
    typicalSelfDefense: ['Pedal de Guitarra de Metal 1d6', 'Desarmado'],
  },
  {
    id: 'tech_repairman',
    name: 'Técnico de Reparo / Pequeno Armeiro',
    badge: 'Tecnologia Barata',
    description: 'Conserta chips queimados, ciberbraços enferrujados e telões quebrados no fundo de uma garagem.',
    typicalClothes: 'Colete com bolsos cheios de chaves de precisão, ferro de solda no cinto e lupa ótica.',
    typicalSelfDefense: ['Ferro de Solda Elétrico 2d6', 'Pistola Leve de Bolso 2d6'],
  },
  {
    id: 'cubicle_tenant',
    name: 'Inquilino de Megaprédio / Morador Comum',
    badge: 'Cidadão Típico',
    description: 'Cidadão comum tentando apenas sobreviver a mais um mês no cubículo apertado de um megaprédio residencial.',
    typicalClothes: 'Moletom com capuz largo, calça de abrigo confortável e sacola plástica com compras de supermercado.',
    typicalSelfDefense: ['Alarme Pessoal Sonoro Estridente', 'Spray de Gás Lacrimogêneo'],
  },
];

export const CIVILIAN_DISTRICTS: { id: CivilianDistrictOrigin; name: string; socialClass: string; typicalTrouble: string }[] = [
  { id: 'watson', name: 'Watson (Little China & Kabuki)', socialClass: 'Classe Baixa / Imigrantes', typicalTrouble: 'Conflitos entre Maelstrom e Tyger Claws nas esquinas.' },
  { id: 'heywood', name: 'Heywood (The Glen & Vista del Rey)', socialClass: 'Classe Trabalhadora / Bairros Unidos', typicalTrouble: 'Cobranças de proteção do Valentino e disputas familiares.' },
  { id: 'pacifica', name: 'Pacifica (Zona de Combate & Hotspots)', socialClass: 'Marginalizados / Sem Serviços Públicos', typicalTrouble: 'Falta total de energia elétrica e trocas de tiros diárias.' },
  { id: 'city_center', name: 'City Center (Distrito Corporativo)', socialClass: 'Executivos & Assalariados de Escritório', typicalTrouble: 'Espionagem corporativa, demissões sumárias e paranoia.' },
  { id: 'santo_domingo', name: 'Santo Domingo (Rancho Coronado & Arroyo)', socialClass: 'Operários de Fábrica', typicalTrouble: 'Vazamentos químicos tóxicos e violência de gangue 6th Street.' },
  { id: 'badlands', name: 'Periferia dos Badlands (Acampamentos)', socialClass: 'Refugiados & Trabalhadores de Estufa', typicalTrouble: 'Tempestades de areia ácida e ataques de saqueadores Wraiths.' },
];

export const CIVILIAN_NAMES = [
  'Mateo Ramirez', 'Li Na Chen', 'Tomasz Nowak', 'Maria Santos', 'Kenji Takahashi',
  'Chloe Dubois', 'Darnell Washington', 'Fatima Al-Mansoor', 'Igor Volkov', 'Beatriz Silva',
  'Hassan El-Sayed', 'Aoi Tanaka', 'Brenda Miller', 'Rajesh Patel', 'Esperanza Morales',
  'Dmitri Petrov', 'Sun-Hi Park', 'Lucas Oliveira', 'Nadia Kowalska', 'Anthony Taylor',
];

export const CIVILIAN_QUIRKS = [
  'Tosse seca frequente devido à poluição do ar e usa um inalador barato a cada vinte minutos.',
  'Olhos inquietos que nunca param de vigiar os arredores e as mãos dos interlocutores.',
  'Usa um anel de casamento desgastado e gira o metal no dedo quando fica tenso ou nervoso.',
  'Carrega uma foto holográfica amassada de um filho e mostra para quem demonstrar um mínimo de gentileza.',
  'Tem tremores nas mãos causados por estimulantes baratos usados para aguentar jornadas de 16 horas.',
  'Fala muito rápido com sotaque carregado e gesticula de forma apologética para evitar confrontos.',
  'Segura a bolsa ou mochila contra o peito com as duas mãos, protegendo seus poucos pertences.',
  'Checa o relógio analógico de pulso com frequência neurótica para não perder a condução ou o turno.',
];

export const CIVILIAN_PANIC_REACTIONS = [
  'Entra em pânico histérico, grita desesperadamente e sai correndo às cegas na direção oposta aos tiros.',
  'Cai no chão com as mãos na cabeça, encolhendo-se em posição fetal atrás da primeira cobertura disponível.',
  'Ergue os braços trêmulos e implora por sua vida: "Por favor, não atirem! Eu tenho dois filhos para sustentar!"',
  'Oferece imediatamente o credstick com suas poucas economias do mês para não ser machucado.',
  'Fica paralisado de terror catatônico, com os olhos vidrados sem conseguir emitir som ou mover as pernas.',
  'Tenta rastejar para baixo de mesas, caçambas ou tubulações de esgoto rezando para não ser notado.',
  'Puxa o agente celular e tenta ligar em pânico para a central do NCPD, mesmo sabendo que a viatura demora horas.',
];

export const CIVILIAN_SECRETS_KNOWLEDGE = [
  'Viu o momento exato em que uma van executiva preta descarregou uma pessoa amarrada num armazém abandonado.',
  'Sabe a senha antiga de uma porta de serviço que dá acesso direto aos fundos do laboratório corporativo.',
  'Achou um chip de dados criptografado que caiu do bolso de um Solo baleado que morreu na sarjeta de seu quiosque.',
  'Ouviu uma conversa sigilosa no banheiro da boate sobre uma emboscada armada contra a equipe de mercenários.',
  'Conhece o dono da oficina mecânica clandestina que altera placas e raspa números de motor de viaturas roubadas.',
  'Tem a gravação de segurança da câmera do quiosque mostrando o rosto limpo do assassino do NCPD.',
  'Sabe que o inspetor sanitário aceita 200eb de propina para liberar o trânsito livre de cargas sem checagem.',
  'É sobrinho do contador de um Fixer importante e sabe onde fica o cofre reserva do escritório.',
];

export const CIVILIAN_MISSION_HOOKS = [
  'Precisa desesperadamente de 800 eb até amanhã para pagar o resgate de sua filha que foi levada pela gangue.',
  'Quer contratar alguém para escoltá-lo em segurança até o terminal de trem NCART para fugir de Night City.',
  'Pede ajuda para recuperar seu caminhão de entregas que foi tomado por capangas armados em Heywood.',
  'Deseja entregar um chip de dados perigoso a um repórter do Network 54 antes que a corporação o liquide.',
  'Precisa de um remédio controlado raro que só um Ripperdoc de Kabuki possui para tratar sua mãe acamada.',
  'Quer que os Edgerunners intimidaem um agiota violento que dobrou os juros de uma dívida injusta.',
  'Oferece refeições de graça e abrigo seguro num porão secreto se os mercenários afastarem assaltantes da rua.',
];

export const CIVILIAN_POCKET_LOOT = [
  'Credstick com 2d6x5 eb para as compras do dia',
  'Cartão magnético de metrô NCART com 3 viagens restantes',
  'Chave magnética gasta do cubículo residencial 402B',
  'Maço de cigarros sintéticos com 4 unidades e isqueiro plástico',
  'Foto holográfica dobrada da família sorrindo em Pacifica',
  'Frasco com pastilhas de analgésico genérico para dor de cabeça',
  'Lenço de papel úmido e álcool em gel antisséptico',
  'Fita métrica pequena ou caneta esferográfica que falha',
  'Comprovante amarrotado de pagamento de aluguel atrasado',
  'Bala sintética mastigável sabor Tutti-Frutti químico',
];

// Gerador Algorítmico Canônico de Civis (Everyday People)
function buildCivilianRaw(options: {
  occupationId?: CivilianOccupationId;
  districtId?: CivilianDistrictOrigin;
  system: GameSystem;
}): NPCSheet {
  const occ = CIVILIAN_OCCUPATIONS.find(o => o.id === options.occupationId) || CIVILIAN_OCCUPATIONS[Math.floor(Math.random() * CIVILIAN_OCCUPATIONS.length)];
  const district = CIVILIAN_DISTRICTS.find(d => d.id === options.districtId) || CIVILIAN_DISTRICTS[Math.floor(Math.random() * CIVILIAN_DISTRICTS.length)];

  const name = CIVILIAN_NAMES[Math.floor(Math.random() * CIVILIAN_NAMES.length)];
  const quirk = CIVILIAN_QUIRKS[Math.floor(Math.random() * CIVILIAN_QUIRKS.length)];
  const panic = CIVILIAN_PANIC_REACTIONS[Math.floor(Math.random() * CIVILIAN_PANIC_REACTIONS.length)];
  const secret = CIVILIAN_SECRETS_KNOWLEDGE[Math.floor(Math.random() * CIVILIAN_SECRETS_KNOWLEDGE.length)];
  const hook = CIVILIAN_MISSION_HOOKS[Math.floor(Math.random() * CIVILIAN_MISSION_HOOKS.length)];

  // Sorteia 3 itens civis dos bolsos
  const shuffledPockets = [...CIVILIAN_POCKET_LOOT].sort(() => 0.5 - Math.random());
  const pocketLoot = shuffledPockets.slice(0, 3);

  // Armas leves de autodefesa (se houver)
  const weapons: WeaponItem[] = occ.typicalSelfDefense.map((wName, idx) => ({
    name: wName,
    category: 'Autodefesa Civil',
    damage: wName.includes('4d6') ? '4d6' : wName.includes('2d6') ? '2d6' : '1d6',
    rof: 1,
    system: 'BOTH',
  }));

  // Stats Oficiais de Civis (Everyday People DLC)
  const hp = 25;
  const combatNumber = 7;
  const sp = occ.id === 'factory_worker' ? 4 : occ.id === 'bodega_owner' ? 4 : 0;

  return {
    id: 'civilian-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    name,
    faction: `Civil de ${district.name}`,
    subfaction: district.id,
    tier: 'civilian',
    system: options.system,
    role: `${occ.name} (${district.socialClass})`,
    description: `${occ.typicalClothes} Cidadão comum residente em ${district.name}.`,
    notes: `Ocupação: ${occ.name}\nBairro: ${district.name}\nClasse: ${district.socialClass}`,
    tactics: `REACÃO SOB FOGO: ${panic}`,
    reputation: 0,
    // Narrative Fields
    archetype: occ.badge,
    appearance: occ.typicalClothes,
    quirks: quirk,
    motivation: hook,
    weaknessOrSecret: secret,
    surrenderTrigger: panic,
    dialogueHook: `"Por favor, eu só trabalho aqui... Não tenho nada a ver com o tiroteio de vocês!"`,
    pocketLoot,
    // Cyberpunk RED Statblock (Everyday People)
    statsRED: {
      INT: 5,
      REF: 5,
      DEX: 5,
      TECH: occ.id === 'tech_repairman' || occ.id === 'factory_worker' ? 7 : 4,
      COOL: 4,
      WILL: 5,
      LUCK: 2,
      MOVE: 5,
      BODY: 4,
      EMP: 6,
      HP: hp,
      seriouslyWounded: 13,
      deathSave: 4,
      combatNumber,
      headSP: 0,
      bodySP: sp,
    },
    // Cyberpunk 2020 Statblock
    stats2020: {
      INT: 5,
      REF: 5,
      TEC: occ.id === 'tech_repairman' ? 7 : 4,
      COOL: 4,
      ATR: 5,
      LUCK: 2,
      MA: 5,
      BODY: 4,
      EMP: 6,
      BTM: -1,
      headSP: 0,
      torsoSP: sp,
      rArmSP: 0,
      lArmSP: 0,
      rLegSP: 0,
      lLegSP: 0,
    },
    skills: {
      'Percepção (Perception)': 8,
      'Esquiva / Fuga (Evasion)': 8,
      'Manha de Rua (Streetwise)': 7,
      'Comércio / Negociação': 7,
      'Ofício / Trabalho Diário': 9,
    },
    weapons,
    cyberware: ['Sem implantes militares', 'Interface neural civil básica (ou chip pessoal)'],
    gear: pocketLoot,
  };
}


/** Gera o civil e resolve armas de autodefesa diretamente no Códice. */
export function generateCivilianOffline(options: Parameters<typeof buildCivilianRaw>[0]): NPCSheet {
  return enrichNPCFromCodex(buildCivilianRaw(options));
}
