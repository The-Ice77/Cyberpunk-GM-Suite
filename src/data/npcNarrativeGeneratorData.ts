// ========================================================
// GERADOR NARRATIVO DE NPCS (CYBERPUNK RED & 2020)
// Baseado no Core Rulebook (p. 388-409) & Danger Gal Dossier
// ========================================================

import { GameSystem, NPCTier, NPCSheet, WeaponItem } from '../types/system';
import { GANGS_LIST } from './gangsData';
import { FACTIONS_LIST } from './factionsData';

export type NarrativeArchetypeId =
  | 'combatant'
  | 'fixer_contact'
  | 'specialist'
  | 'civilian_witness'
  | 'law_enforcer';

export interface NarrativeArchetypeOption {
  id: NarrativeArchetypeId;
  name: string;
  badge: string;
  description: string;
  typicalRoles: string[];
  suggestedTiers: NPCTier[];
}

export const NARRATIVE_ARCHETYPES: NarrativeArchetypeOption[] = [
  {
    id: 'combatant',
    name: 'Oponente Armado / Combatente de Rua',
    badge: 'Combate & Conflito',
    description: 'Solos mercenários, capangas de gangue territorial, atiradores corporativos e ciberpsicopatas.',
    typicalRoles: ['Capanga de Assalto', 'Atirador de Elite', 'Solo Mercenário', 'Guarda-Costas Blindado', 'Batedor Furtivo'],
    suggestedTiers: ['mook', 'lieutenant', 'miniboss', 'boss'],
  },
  {
    id: 'fixer_contact',
    name: 'Contato Social / Fixer / Negociante',
    badge: 'Social & Contratos',
    description: 'Intermediários que movimentam eddies, segredos e trabalhos no submundo ou nos altos escalões.',
    typicalRoles: ['Fixer de Beco', 'Agiota Implacável', 'Bartender do Afterlife', 'Executivo Júnior', 'Contrabandista'],
    suggestedTiers: ['civilian', 'lieutenant', 'miniboss'],
  },
  {
    id: 'specialist',
    name: 'Especialista Técnico / Suporte de Campo',
    badge: 'Técnico & NET',
    description: 'Profissionais de elite com habilidades raras: invasores de rede, cirurgiões clandestinos ou engenheiros.',
    typicalRoles: ['Netrunner Fantasma', 'Ripperdoc Clandestino', 'Techie de Armas', 'Medtech de Combate', 'Piloto de Fuga'],
    suggestedTiers: ['lieutenant', 'miniboss', 'boss'],
  },
  {
    id: 'civilian_witness',
    name: 'Civil de Night City / Testemunha / Vítima',
    badge: 'Everyday People',
    description: 'Cidadãos comuns que cruzam o caminho dos Edgerunners como testemunhas, vítimas ou contratantes desesperados.',
    typicalRoles: ['Vendedor de Street Food', 'Cientista Falsificador', 'Garçom de Boate', 'Operário Fabril', 'Informante Amedrontado'],
    suggestedTiers: ['civilian', 'mook'],
  },
  {
    id: 'law_enforcer',
    name: 'Agente da Lei / Força Corporativa / Detetive',
    badge: 'Autoridade & Investigação',
    description: 'Policiais veteranos do NCPD, investigadores particulares cansados ou agentes táticos MaxTac.',
    typicalRoles: ['Detetive Particular', 'Patrulheiro do NCPD', 'Operador de Choque MaxTac', 'Inspetor de Segurança Corporativa'],
    suggestedTiers: ['mook', 'lieutenant', 'miniboss', 'boss'],
  },
];

// Tabelas Canônicas de Narrativa (Danger Gal Dossier & Corebook)
export const NPC_FIRST_NAMES = [
  'Leon', 'Valerie', 'Jax', 'Sasha', 'Rico', 'Nyx', 'Dante', 'Elena', 'Klaus', 'Mei',
  'Damian', 'Yuki', 'Garrison', 'Nova', 'Silas', 'Zara', 'T-Bug', 'Malik', 'Hana', 'Victor',
  'Cassidy', 'Axel', 'Renata', 'Cipher', 'Vince', 'Kira', 'Balthazar', 'Camila', 'Hector', 'Ivy',
];

export const NPC_LAST_NAMES = [
  'Vance', 'Cross', 'Valente', 'Sato', 'Kane', 'Mercer', 'Chen', 'Volkov', 'Mendoza', 'Kowalski',
  'Sterling', 'Nakamura', 'Delgado', 'Novak', 'Reyes', 'Takahashi', 'Santos', 'Blackwood', 'Alvarez', 'Moreau',
];

export const NPC_HANDLES = [
  'Ghost', 'Trigger', 'Cromo', 'Razor', 'Hex', 'Spike', 'Wires', 'Nerve', 'Viper', 'Zero',
  'Nails', 'Bullet', 'Byte', 'Fuse', 'Rook', 'Bones', 'Shadow', 'Smash', 'Apex', 'Glitch',
];

export const NPC_APPEARANCES = [
  'Jaqueta de couro rasgada com remendos de Kevlar, olhos cibernéticos Kiroshi de pupila felina e coturnos gastos.',
  'Terno executivo risca de giz com ombreiras reforçadas, relógio analógico banhado a ouro e postura impecável.',
  'Macacão de operário industrial manchado de graxa sintética, coldre de couro no peito e respirador no pescoço.',
  'Visual Streetwear volumoso com capuz neon luminescente, fiação aparente nas têmporas e tênis iluminados.',
  'Sobretudo cinza com gola levantada, cicatrizes faciais de queimadura química e óculos espelhados mesmo à noite.',
  'Colete tático militar com placas cerâmicas, insígnias raspadas e braço cibernético preto fosco.',
  'Camisa social desabotoada, tatuagens brilhantes de neon sob a pele e anéis pesados de monocarbono nos nós dos dedos.',
  'Roupas térmicas nômades cobertas de poeira dos Badlands, bandana vermelha e óculos de proteção contra tempestades.',
];

export const NPC_QUIRKS = [
  'Fuma cigarros sintéticos sem parar e brinca com o isqueiro metálico quando está ansioso.',
  'Fala em tom sussurrado e pausado, encarando fixamente os olhos de quem tenta intimidá-lo.',
  'Estala os dedos metálicos do ciberbraço com um estalo seco característico antes de fechar qualquer acordo.',
  'Usa gírias antigas das Guerras Corporativas e desconfia imediatamente de quem usa ternos limpos.',
  'Morde o lábio e bate o pé no chão com ritmo elétrico, visivelmente sobrecarregado de cafeína ou estimulantes.',
  'Limpa um revólver ou faca com um pano enquanto escuta os outros falarem, sem demonstrar emoção.',
  'Sorri excessivamente e gesticula com as mãos abertas para parecer inofensivo, mas nunca dá as costas à porta.',
  'Consulta um biomonitor no pulso de três em três minutos para checar batimentos e níveis de adrenalina.',
];

export const NPC_MOTIVATIONS = [
  'Conseguir 2.000 eb imediatamente para quitar uma dívida de vida com um agiota violento de Watson.',
  'Vingar a morte de seu irmão mais novo, que foi deixado para morrer em uma emboscada corporativa.',
  'Obter um chip de acesso codificado para sumir de Night City e começar uma vida nova nos Badlands.',
  'Impressionar o líder da facção para ser promovido a tenente e ganhar um território próprio de cobrança.',
  'Salvar sua família que está sendo ameaçada de despejo por uma megacorporação no setor residencial.',
  'Proteger um segredo industrial vazado que pode arruinar o diretor regional da Arasaka ou Militech.',
  'Encontrar um Ripperdoc de confiança para tratar um implante cibernético com defeito antes de surtar.',
  'Fechar um contrato mercenário arriscado sem que seus superiores desconfiem de sua lealdade dupla.',
];

export const NPC_SECRETS_WEAKNESSES = [
  'É um informante pago da Polícia (NCPD) que repassa rotas da gangue em troca de vista grossa nos negócios.',
  'Está sofrendo os primeiros sintomas de ciberpsicose, mascarando tremores com analgésicos ilegais pesados.',
  'Deve uma quantia colossal a um Fixer do Afterlife e sabe que tem um assassino em seu encalço.',
  'Roubou um shard de dados sigiloso de seu antigo empregador corporativo e não tem a chave para descriptografá-lo.',
  'Tem fobia incontrolável de fogo e armas incendiárias devido a um acidente traumático com CHOOH2.',
  'Não sabe atirar de verdade; toda sua postura intimidante é blefe sustentado por armas descarregadas ou cenográficas.',
  'Tem um biomonitor corporativo secreto alojado na espinha que rastreia sua localização física 24h por dia.',
  'Está contrabandeando remédios controlados de dentro do laboratório para uma clínica comunitária clandestina.',
];

export const NPC_DIALOGUE_HOOKS = [
  '"Em Night City, você é quem puxa o gatilho ou quem limpa o sangue da calçada. Escolha o seu lado logo, choomba."',
  '"Eu não quero problemas com vocês... só quero meus eddies e a garantia de que ninguém vai me seguir até em casa."',
  '"Você acha que a Arasaka joga pelas regras? Amigo, se eles quiserem te apagar, nem a sua certidão de nascimento sobra."',
  '"Diga o que você quer rápido. O ar nessa rua tá ficando denso e eu não pretendo ser pego com essa carga nos braços."',
  '"Tenho o que você precisa no chip, mas informação de elite custa caro. E eu não aceito promessas, só credsticks limpos."',
  '"Se você tocar nessa maleta, o alarme silencioso frita o meu deck e o esquadrão de extermínio chega em 90 segundos."',
  '"Eu já vi gente muito mais rápida que você terminar num saco plástico do Trauma Team. Vamos negociar com calma."',
  '"Me ajuda a sair daqui com vida e eu te entrego a senha do cofre nos fundos. É pegar ou largar."',
];

export const NPC_SURRENDER_TRIGGERS = [
  'Foge imediatamente se o HP cair para menos de 50% (Ferimento Grave) ou se o líder for eliminado.',
  'Joga a arma no chão e implora por sua vida assim que seu escudo ou armadura for perfurado por dano crítico.',
  'Nunca se rende enquanto houver civis ou aliados por perto; prefere lutar até a morte por orgulho e medo de parecer fraco.',
  'Tenta subornar os jogadores oferecendo seu credstick e a localização de um esconderijo se for encurralado.',
  'Finge rendição erguendo as mãos para puxar uma faca ou granada oculta no último segundo se houver brecha.',
  'Recua taticamente disparando fogo de supressão às cegas enquanto ativa uma cápsula de fumaça densa.',
  'Se rende pacificamente se os jogadores demonstrarem misericórdia e garantirem que não o entregarão à sua própria gangue.',
];

export const NPC_POCKET_LOOT_TABLE = [
  'Credstick com 2d6x10 eb não rastreáveis',
  'Maço de cigarros sintéticos com senha de rede privada rabiscada no filtro',
  'Frasco com 1 dose de droga de combate Smash ou Blue Glass',
  'Chave magnética clonada de uma van nos fundos do armazém',
  'Foto holográfica gasta de uma criança com um recado: "Volte para casa vivo"',
  'Crachá de visitante falso da Biotechnica com foto desatualizada',
  'Isqueiro pesado de metal gravado: "Para meu melhor Solo, com respeito"',
  'Shard de dados criptografado contendo mensagens ameaçadoras de um agiota',
  'Canivete dobrável de titânio gravado com as iniciais de uma gangue rival',
  'Dois curativos hemostáticos de emergência da Trauma Team (estéreis)',
  'Óculos escuros espelhados com armação de titânio (Valor: 50eb)',
  'Cartão de visita holográfico de um Ripperdoc em Kabuki: "Consertos sem perguntas"',
  'Gazuas eletrônicas para fechaduras magnéticas baratas',
  'Bolsa com 15 balas extras de calibre pesado enroladas em fita adesiva',
];

// Gerador Algorítmico Canônico de NPCs
export function generateNarrativeNPCOffline(options: {
  tier: NPCTier;
  archetypeId: NarrativeArchetypeId;
  factionCategory: 'gangs' | 'corps' | 'trauma' | 'police' | 'nomads' | 'independent';
  subfactionId?: string;
  system: GameSystem;
}): NPCSheet {
  const isRed = options.system === 'RED';
  const tier = options.tier;
  const archetype = NARRATIVE_ARCHETYPES.find(a => a.id === options.archetypeId) || NARRATIVE_ARCHETYPES[0];

  const first = NPC_FIRST_NAMES[Math.floor(Math.random() * NPC_FIRST_NAMES.length)];
  const last = NPC_LAST_NAMES[Math.floor(Math.random() * NPC_LAST_NAMES.length)];
  const handle = NPC_HANDLES[Math.floor(Math.random() * NPC_HANDLES.length)];
  const name = `${first} "${handle}" ${last}`;

  // Facção
  let factionName = 'Submundo Independente';
  let factionTactics = 'Mantém cobertura e age de acordo com a situação de perigo.';
  let factionWeapons = ['Pistola Pesada 3d6', 'Faca de Combate 2d6'];
  let factionGear = ['Agente Descartável', 'Credstick com fundos de emergência'];

  if (options.factionCategory === 'gangs') {
    const gang = GANGS_LIST.find(g => g.id === options.subfactionId) || GANGS_LIST[0];
    factionName = gang.name;
    factionTactics = gang.tactics;
    factionWeapons = gang.signatureWeapons;
    factionGear = gang.typicalGear;
  } else if (options.factionCategory === 'corps') {
    const corp = FACTIONS_LIST.find(f => f.id === (options.subfactionId || 'arasaka')) || FACTIONS_LIST[0];
    factionName = corp.name;
    factionTactics = corp.description;
    factionWeapons = corp.unitTypes[0]?.weaponsRED || ['Fuzil de Assalto Militech 5d6'];
    factionGear = corp.unitTypes[0]?.equipment || ['Rádio Criptografado', 'Colete Kevlar'];
  } else if (options.factionCategory === 'police') {
    factionName = 'Departamento de Polícia de Night City (NCPD)';
    factionTactics = 'Avança em duplas usando escudos balísticos e fogo cruzado coordenado.';
    factionWeapons = ['Pistola Pesada 3d6', 'Espingarda de Dispersão 5d6', 'Cassetete Elétrico Stun'];
    factionGear = ['Colete Tático Reforçado', 'Algemas Magnéticas', 'Rádio de Patrulha'];
  } else if (options.factionCategory === 'trauma') {
    factionName = 'Trauma Team Internacional';
    factionTactics = 'Foco absoluto em estabilizar o paciente contratado e eliminar ameaças no perímetro de evacuação.';
    factionWeapons = ['Submetralhadora Pesada 3d6 (ROF 2)', 'Pistola de Dardos Médicos'];
    factionGear = ['Maleta de Trauma Nível 1', 'Desfibrilador Cardíaco', 'Injetor de Coagulante'];
  } else if (options.factionCategory === 'nomads') {
    factionName = 'Família Nômade Aldecaldos (Badlands)';
    factionTactics = 'Combate motorizado, uso do terreno desértico e disparos de rifles de precisão apoiados.';
    factionWeapons = ['Fuzil de Precisão Nomad 5d6', 'Revólver Pesado 3d6'];
    factionGear = ['Filtro de Areia', 'Rádio CB Veicular', 'Kit de Solda Rápida'];
  }

  // Estatísticas oficiais por Tier (Cyberpunk RED Core Rulebook)
  let hp = 35;
  let combatNumber = 12;
  let body = 7;
  let will = 6;
  let ref = 7;
  let dex = 7;
  let spHead = 11;
  let spBody = 11;
  let reputation = 2;

  if (tier === 'civilian') {
    hp = 25;
    combatNumber = 8;
    body = 4;
    will = 5;
    ref = 5;
    dex = 5;
    spHead = 0;
    spBody = 4;
    reputation = 0;
  } else if (tier === 'mook') {
    hp = 30;
    combatNumber = 10;
    body = 6;
    will = 5;
    ref = 6;
    dex = 6;
    spHead = 7;
    spBody = 7;
    reputation = 1;
  } else if (tier === 'lieutenant') {
    hp = 40;
    combatNumber = 13;
    body = 8;
    will = 7;
    ref = 8;
    dex = 8;
    spHead = 11;
    spBody = 11;
    reputation = 3;
  } else if (tier === 'miniboss') {
    hp = 50;
    combatNumber = 15;
    body = 9;
    will = 8;
    ref = 8;
    dex = 8;
    spHead = 13;
    spBody = 13;
    reputation = 5;
  } else if (tier === 'boss') {
    hp = 65;
    combatNumber = 17;
    body = 11;
    will = 9;
    ref = 9;
    dex = 9;
    spHead = 15;
    spBody = 15;
    reputation = 7;
  }

  // Papel e função
  const roleName = `${archetype.typicalRoles[Math.floor(Math.random() * archetype.typicalRoles.length)]} (${tier.toUpperCase()})`;

  // Narrativa Canônica sorteada
  const appearance = NPC_APPEARANCES[Math.floor(Math.random() * NPC_APPEARANCES.length)];
  const quirks = NPC_QUIRKS[Math.floor(Math.random() * NPC_QUIRKS.length)];
  const motivation = NPC_MOTIVATIONS[Math.floor(Math.random() * NPC_MOTIVATIONS.length)];
  const weaknessOrSecret = NPC_SECRETS_WEAKNESSES[Math.floor(Math.random() * NPC_SECRETS_WEAKNESSES.length)];
  const dialogueHook = NPC_DIALOGUE_HOOKS[Math.floor(Math.random() * NPC_DIALOGUE_HOOKS.length)];
  const surrenderTrigger = NPC_SURRENDER_TRIGGERS[Math.floor(Math.random() * NPC_SURRENDER_TRIGGERS.length)];

  // Sorteia 3 itens dos bolsos
  const shuffledPockets = [...NPC_POCKET_LOOT_TABLE].sort(() => 0.5 - Math.random());
  const pocketLoot = shuffledPockets.slice(0, 3);

  // Armas formatadas
  const weapons: WeaponItem[] = factionWeapons.map((wName, idx) => ({
    name: wName,
    category: idx === 0 ? 'Arma Primária' : 'Arma Secundária',
    damage: wName.includes('5d6') ? '5d6' : wName.includes('4d6') ? '4d6' : wName.includes('3d6') ? '3d6' : '2d6',
    rof: wName.includes('5d6') || wName.includes('4d6') ? 1 : 2,
    system: 'BOTH',
  }));

  return {
    id: 'npc-' + Date.now(),
    name,
    faction: factionName,
    subfaction: options.subfactionId,
    tier,
    system: options.system,
    role: roleName,
    description: `${appearance} Conhecido nas ruas pelo codinome "${handle}".`,
    notes: `Alcunha: "${handle}"\nFacção: ${factionName}\nArquétipo: ${archetype.name}`,
    tactics: `${factionTactics} ${surrenderTrigger}`,
    reputation,
    // Narrative Fields
    archetype: archetype.name,
    appearance,
    quirks,
    motivation,
    weaknessOrSecret,
    surrenderTrigger,
    dialogueHook,
    pocketLoot,
    // Cyberpunk RED Statblock
    statsRED: {
      INT: archetype.id === 'specialist' ? 8 : 6,
      REF: ref,
      DEX: dex,
      TECH: archetype.id === 'specialist' ? 8 : 5,
      COOL: archetype.id === 'fixer_contact' ? 8 : 7,
      WILL: will,
      LUCK: tier === 'boss' ? 5 : 2,
      MOVE: 6,
      BODY: body,
      EMP: tier === 'boss' ? 2 : 4,
      HP: hp,
      seriouslyWounded: Math.ceil(hp / 2),
      deathSave: body,
      combatNumber,
      headSP: spHead,
      bodySP: spBody,
    },
    // Cyberpunk 2020 Statblock
    stats2020: {
      INT: archetype.id === 'specialist' ? 8 : 6,
      REF: ref,
      TEC: archetype.id === 'specialist' ? 8 : 5,
      COOL: archetype.id === 'fixer_contact' ? 8 : 7,
      ATR: 5,
      LUCK: tier === 'boss' ? 5 : 3,
      MA: 6,
      BODY: body,
      EMP: 4,
      BTM: body >= 10 ? -4 : body >= 8 ? -3 : body >= 5 ? -2 : -1,
      headSP: spHead,
      torsoSP: spBody,
      rArmSP: spBody - 2 > 0 ? spBody - 2 : 4,
      lArmSP: spBody - 2 > 0 ? spBody - 2 : 4,
      rLegSP: spBody - 2 > 0 ? spBody - 2 : 4,
      lLegSP: spBody - 2 > 0 ? spBody - 2 : 4,
    },
    skills: {
      'Combate Geral (Combat Number)': combatNumber,
      'Percepção (Perception)': combatNumber - 2,
      'Esquiva (Evasion)': combatNumber,
      'Manha de Rua (Streetwise)': combatNumber - 1,
      'Armas de Fogo / Briga': combatNumber,
    },
    weapons,
    cyberware: factionGear,
    gear: pocketLoot,
  };
}
