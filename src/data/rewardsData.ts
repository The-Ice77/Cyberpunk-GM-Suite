import { pickFromCodex } from '../services/codexCatalog';
// ========================================================
// SISTEMA OFICIAL DE RECOMPENSAS DE FIM DE SESSÃO & PROGRESSÃO
// Baseado no Cyberpunk RED Core Rulebook (págs. 410-412)
// ========================================================

export type SessionDifficultyId = 'routine' | 'standard' | 'dangerous' | 'climax';
export type MissionOutcomeId = 'total_success' | 'standard_success' | 'partial_success' | 'heroic_failure' | 'disaster';
export type RewardTagCategory = 'objective' | 'threat' | 'roleplay' | 'tactics' | 'impact';

export interface SessionDifficultyTier {
  id: SessionDifficultyId;
  name: string;
  badge: string;
  baseIP: number;
  ipRange: string;
  baseEb: number;
  ebRange: string;
  description: string;
}

export interface MissionOutcome {
  id: MissionOutcomeId;
  name: string;
  multiplierIP: number;
  multiplierEb: number;
  description: string;
  badgeColor: string;
}

export interface SessionRewardTag {
  id: string;
  label: string;
  category: RewardTagCategory;
  ipBonus: number;
  ebBonus: number;
  repBonus: number;
  description: string;
}

export interface SpecialSalvageItem {
  id: string;
  name: string;
  category: 'Cromo/Cyberware' | 'Armamento' | 'Software/Data' | 'Favor de NPC' | 'Item Raro';
  valueEb: number;
  description: string;
  mechanicalEffect: string;
}

export interface SessionRewardResult {
  sessionTitle: string;
  difficulty: SessionDifficultyTier;
  outcome: MissionOutcome;
  totalIP: number;
  ipBreakdown: {
    base: number;
    outcomeMultiplier: number;
    objectivesBonus: number;
    threatBonus: number;
    roleplayBonus: number;
    tacticsBonus: number;
  };
  cashEbPerPlayer: number;
  totalGroupCashEb: number;
  reputationChange: number;
  screamsheetHeadline: string;
  screamsheetArticle: string;
  specialLoot: SpecialSalvageItem[];
  mvpHighlights: string[];
  nextSessionHooks: string[];
  coGMVerdict: string;
  isAiGenerated: boolean;
}

// 1. ESCALÕES DE DIFICULDADE DE SESSÃO (Cyberpunk RED Core Rulebook p. 411)
export const SESSION_DIFFICULTY_TIERS: Record<SessionDifficultyId, SessionDifficultyTier> = {
  routine: {
    id: 'routine',
    name: 'Bico Rutineiro / Sem Risco Mortal',
    badge: '10 - 20 IP',
    baseIP: 15,
    ipRange: '10 - 20 IP',
    baseEb: 400,
    ebRange: '200 - 500 eb',
    description: 'Trabalhos menores, entregas na Zona Segura, tarefas de baixo escalão sem oposição armada pesada.',
  },
  standard: {
    id: 'standard',
    name: 'Missão Padrão de Night City (Gig Mercenário)',
    badge: '30 - 50 IP',
    baseIP: 40,
    ipRange: '30 - 50 IP',
    baseEb: 1000,
    ebRange: '800 - 1.500 eb',
    description: 'O serviço clássico de um Edgerunner: invasão a armazém, emboscada contra gangers territoriais ou extração sob fogo moderado.',
  },
  dangerous: {
    id: 'dangerous',
    name: 'Operação Perigosa / Alto Risco Corporativo',
    badge: '50 - 75 IP',
    baseIP: 60,
    ipRange: '50 - 75 IP',
    baseEb: 2000,
    ebRange: '1.500 - 3.000 eb',
    description: 'Confronto contra forças de elite corporativa, invasão a laboratórios secretos, Black ICE mortal na rede ou emboscadas com risco real de morte.',
  },
  climax: {
    id: 'climax',
    name: 'Clímax de Arco / Vida ou Morte Lendária',
    badge: '75 - 100+ IP',
    baseIP: 85,
    ipRange: '75 - 100+ IP',
    baseEb: 4500,
    ebRange: '3.500 - 10.000+ eb',
    description: 'O ápice da campanha: assalto a quartel-general de megacorp, confronto contra uma lenda viva do Afterlife ou vingança sangrenta contra ciberpsicopatas.',
  },
};

// 2. DESFECHOS DA MISSÃO (Modificadores oficiais de entrega de objetivos)
export const MISSION_OUTCOMES: Record<MissionOutcomeId, MissionOutcome> = {
  total_success: {
    id: 'total_success',
    name: 'Sucesso Total com Distinção (120% IP)',
    multiplierIP: 1.2,
    multiplierEb: 1.25,
    description: 'Todos os objetivos principais e secundários foram concluídos impecavelmente, sem pontas soltas nem quebra de contrato.',
    badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
  },
  standard_success: {
    id: 'standard_success',
    name: 'Sucesso Operacional Padrão (100% IP)',
    multiplierIP: 1.0,
    multiplierEb: 1.0,
    description: 'O objetivo contratado foi cumprido conforme o acordo com o Fixer.',
    badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20',
  },
  partial_success: {
    id: 'partial_success',
    name: 'Sucesso Parcial com Custos Altos (80% IP)',
    multiplierIP: 0.8,
    multiplierEb: 0.75,
    description: 'A missão foi salva no último minuto, mas houve perdas colaterais, civis feridos ou parte da carga foi destruída.',
    badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
  },
  heroic_failure: {
    id: 'heroic_failure',
    name: 'Fracasso com Fuga Heroica (50% IP)',
    multiplierIP: 0.5,
    multiplierEb: 0.2,
    description: 'O objetivo falhou devido a traição ou forças esmagadoras, mas a equipe lutou com bravura e sobreviveu para contar a história.',
    badgeColor: 'text-orange-400 border-orange-500/40 bg-orange-950/20',
  },
  disaster: {
    id: 'disaster',
    name: 'Fracasso Desastroso / Fuga Caótica (30% IP)',
    multiplierIP: 0.3,
    multiplierEb: 0.0,
    description: 'Fuga desordenada abandonando os objetivos, quebra de reputação com contratantes e perda de equipamentos.',
    badgeColor: 'text-red-400 border-red-500/40 bg-red-950/20',
  },
};

// 3. TAGS RÁPIDAS DE AVALIAÇÃO DE SESSÃO (25 Critérios Ciberpunk)
export const SESSION_REWARD_TAGS: SessionRewardTag[] = [
  // --- OBJETIVOS & DESFECHO ---
  {
    id: 'obj_main_done',
    label: 'Objetivo Principal Concluído',
    category: 'objective',
    ipBonus: 10,
    ebBonus: 0,
    repBonus: 0,
    description: 'A meta central exigida pelo contratante foi executada com êxito.',
  },
  {
    id: 'obj_secondary_bonus',
    label: 'Objetivos Secundários Cumpridos',
    category: 'objective',
    ipBonus: 10,
    ebBonus: 300,
    repBonus: 0,
    description: 'A equipe foi além e cumpriu tarefas opcionais ou bônus contratual.',
  },
  {
    id: 'obj_clean_no_alarms',
    label: 'Infiltração sem Disparar Alarmes',
    category: 'objective',
    ipBonus: 10,
    ebBonus: 200,
    repBonus: 0,
    description: 'Nenhum alarme soou e a equipe entrou e saiu como fantasmas na rede.',
  },
  {
    id: 'obj_evidence_wiped',
    label: 'Evidências & Câmeras Destruídas',
    category: 'objective',
    ipBonus: 5,
    ebBonus: 0,
    repBonus: 0,
    description: 'Nenhum vídeo, log de IP ou impressão biológica foi deixado para trás.',
  },
  {
    id: 'obj_vip_saved',
    label: 'Resgate Perfeito de Refém / VIP',
    category: 'objective',
    ipBonus: 10,
    ebBonus: 400,
    repBonus: 1,
    description: 'A testemunha-chave ou refém foi extraída com vida e sem sequelas.',
  },

  // --- AMEAÇA & COMBATE LETAL ---
  {
    id: 'threat_gang_brawl',
    label: 'Confronto contra Gangue Territorial Armada',
    category: 'threat',
    ipBonus: 5,
    ebBonus: 0,
    repBonus: 0,
    description: 'Tiroteio de rua contra membros de gangues locais armados com automáticas.',
  },
  {
    id: 'threat_corp_strike',
    label: 'Esquadrão Tático Corporativo de Elite',
    category: 'threat',
    ipBonus: 15,
    ebBonus: 0,
    repBonus: 1,
    description: 'Combate intenso contra soldados com armadura pesada, granadas e rifles táticos.',
  },
  {
    id: 'threat_cyberpsycho',
    label: 'Confrontou Ciberpsicopata / Solo Blindado',
    category: 'threat',
    ipBonus: 15,
    ebBonus: 0,
    repBonus: 1,
    description: 'Enfrentou um monstro de cromo militarizado com reflexos sobre-humanos.',
  },
  {
    id: 'threat_net_black_ice',
    label: 'Batalha Netrunning Mortal (Black ICE)',
    category: 'threat',
    ipBonus: 10,
    ebBonus: 0,
    repBonus: 0,
    description: 'O Netrunner enfrentou Hellhounds, Ravens ou vírus cerebrais em combate na rede.',
  },
  {
    id: 'threat_ambush_survived',
    label: 'Superou Emboscada Traiçoeira',
    category: 'threat',
    ipBonus: 10,
    ebBonus: 0,
    repBonus: 0,
    description: 'Inimigos atacaram pelas costas em terreno desfavorável e a equipe virou a luta.',
  },
  {
    id: 'threat_critical_injuries',
    label: 'Ferimentos Críticos / Quase Morte de Membro',
    category: 'threat',
    ipBonus: 5,
    ebBonus: 0,
    repBonus: 0,
    description: 'Um ou mais personagens sofreram ferimentos graves que exigem internação ou cirurgia.',
  },

  // --- INTERPRETAÇÃO & ATITUDE CIBERPUNK ---
  {
    id: 'rp_style_substance',
    label: 'Estilo Acima da Substância (Atitude Ciberpunk)',
    category: 'roleplay',
    ipBonus: 10,
    ebBonus: 0,
    repBonus: 1,
    description: 'Os personagens agiram com a clássica rebeldia, poses cinematográficas e gírias de rua.',
  },
  {
    id: 'rp_role_mastery',
    label: 'Uso Brilhante de Habilidades de Papel',
    category: 'roleplay',
    ipBonus: 10,
    ebBonus: 0,
    repBonus: 0,
    description: 'Solos, Netrunners, Techies, Medtechs ou Rockerboys usaram suas habilidades centrais com maestria.',
  },
  {
    id: 'rp_lifepath_conflict',
    label: 'Explorou Dilema do Lifepath / Nêmesis',
    category: 'roleplay',
    ipBonus: 10,
    ebBonus: 0,
    repBonus: 0,
    description: 'Conflitos com o arqui-inimigo pessoal, família ou valores do passado vieram à tona.',
  },
  {
    id: 'rp_moral_sacrifice',
    label: 'Dilema Moral Difícil / Sacrifício por Princípio',
    category: 'roleplay',
    ipBonus: 10,
    ebBonus: 0,
    repBonus: 0,
    description: 'A equipe abriu mão de dinheiro fácil para salvar inocentes ou manter sua honra.',
  },
  {
    id: 'rp_vivid_dialogue',
    label: 'Excelente Diálogo e Negociação em Cena',
    category: 'roleplay',
    ipBonus: 5,
    ebBonus: 0,
    repBonus: 0,
    description: 'Interpretação marcante em primeira pessoa com NPCs de Night City.',
  },

  // --- TÁTICAS & TRABALHO EM EQUIPE ---
  {
    id: 'tactics_synergy',
    label: 'Sincronia Tática Perfeita entre Classes',
    category: 'tactics',
    ipBonus: 10,
    ebBonus: 0,
    repBonus: 0,
    description: 'O hacker abriu as portas enquanto o Solo dava fogo de cobertura e o Techie sabotava o gerador.',
  },
  {
    id: 'tactics_non_lethal',
    label: 'Abordagem Não Letal / Evitou Banho de Sangue',
    category: 'tactics',
    ipBonus: 10,
    ebBonus: 0,
    repBonus: 0,
    description: 'Desarmaram ou nocautearam a oposição sem assassinatos desnecessários.',
  },
  {
    id: 'tactics_clever_hack',
    label: 'Hack de Infraestrutura ou Gambiarra de Ambiente',
    category: 'tactics',
    ipBonus: 10,
    ebBonus: 0,
    repBonus: 0,
    description: 'Usaram guindastes, tubos de vapor, fiação exposta ou câmeras a favor da equipe.',
  },
  {
    id: 'tactics_smooth_deal',
    label: 'Diplomacia / Malícia com Fixer ou Gangue',
    category: 'tactics',
    ipBonus: 5,
    ebBonus: 250,
    repBonus: 0,
    description: 'Resolveram um impasse tenso na conversa e ainda negociaram um pagamento extra.',
  },
  {
    id: 'tactics_crossfire_control',
    label: 'Controle de Campo com Fogo de Supressão',
    category: 'tactics',
    ipBonus: 5,
    ebBonus: 0,
    repBonus: 0,
    description: 'Posicionamento defensivo com cobertura pesada e recuo estratégico ordenado.',
  },

  // --- IMPACTO EM NIGHT CITY ---
  {
    id: 'impact_screamsheet_fame',
    label: 'Virou Manchete no Screamsheet do Data Pool',
    category: 'impact',
    ipBonus: 5,
    ebBonus: 0,
    repBonus: 1,
    description: 'Os eventos da missão foram noticiados publicamente nos canais de mídia da cidade.',
  },
  {
    id: 'impact_fixer_respect',
    label: 'Conquistou Confiança de um Fixer Influente',
    category: 'impact',
    ipBonus: 5,
    ebBonus: 0,
    repBonus: 0,
    description: 'O Fixer agora considera a equipe como primeira opção para contratos lucrativos.',
  },
  {
    id: 'impact_corp_vendetta',
    label: 'Criou Inimizade com Megacorporação (Aviso Vermelho)',
    category: 'impact',
    ipBonus: 5,
    ebBonus: 0,
    repBonus: 0,
    description: 'A equipe entrou na lista negra de uma empresa poderosa, gerando ganchos futuros.',
  },
  {
    id: 'impact_stolen_prototype',
    label: 'Protótipo Militar ou Shard Ultrassecreto Resgatado',
    category: 'impact',
    ipBonus: 10,
    ebBonus: 500,
    repBonus: 0,
    description: 'A equipe colocou as mãos em um artefato tecnológico cobiçado pelo mercado negro.',
  },
];

// 4. POOL DE SAQUES ESPECIAIS (Cyberpunk RED Lore)
export const SPECIAL_SALVAGE_POOL: SpecialSalvageItem[] = [
  {
    id: 'loot-1',
    name: 'Shard Criptografado da Militech com Plantas de Instalação',
    category: 'Software/Data',
    valueEb: 800,
    description: 'Um chip de dados com selo militar contendo mapas e pontos cegos de segurança de um bunker de testes nos Badlands.',
    mechanicalEffect: 'Concede +2 em testes de Tática ou Segurança ao planejar invasões em instalações da Militech.',
  },
  {
    id: 'loot-2',
    name: 'Fiação Neural Sandevistan Speedware (Preservada)',
    category: 'Cromo/Cyberware',
    valueEb: 1000,
    description: 'Implante neural de combate recuperado de um Solo abatido. Conectores limpos e prontos para implante por um Ripperdoc.',
    mechanicalEffect: 'Permite ativação de combate com +3 de Iniciativa por 1 minuto quando implantado.',
  },
  {
    id: 'loot-3',
    name: 'Passe de Emergência Silver da Trauma Team Internacional',
    category: 'Item Raro',
    valueEb: 1200,
    description: 'Cartão magnético pré-pago autorizando uma chamada de resgate de emergência armada com tempo de resposta de 3 minutos.',
    mechanicalEffect: 'Uso único: convoca equipe de evacuação blindada da Trauma Team para extrair um aliado ferido.',
  },
  {
    id: 'loot-4',
    name: 'Lote de 40 Projéteis Perfurantes de Blindagem (AP) 11mm',
    category: 'Armamento',
    valueEb: 400,
    description: 'Munição especial militar com ponta de tungstênio reforçado feita para perfurar coletes corporativos pesados.',
    mechanicalEffect: 'Reduz o SP da blindagem do alvo em 2 pontos adicionais a cada acerto que penetrar a defesa.',
  },
  {
    id: 'loot-5',
    name: 'Programa de Defesa Netrunner: "Worm" com Código-Fonte',
    category: 'Software/Data',
    valueEb: 600,
    description: 'Software de intrusão que corrói firewalls corporativos silenciosamente durante combates na rede.',
    mechanicalEffect: 'Ocupa 1 slot de cyberdeck. Causa dano contínuo de 1d6 ao SDP do sistema inimigo a cada turno.',
  },
  {
    id: 'loot-6',
    name: 'Favor Confidencial de Ripperdoc Clandestino de Watson',
    category: 'Favor de NPC',
    valueEb: 500,
    description: 'Um vale-cirurgia sem perguntas com Dr. K em Kabuki para instalação estéril de cromo sem registro policial.',
    mechanicalEffect: 'Dispensa o custo em dinheiro da instalação de um cromo ou trata um ferimento crítico gratuitamente.',
  },
  {
    id: 'loot-7',
    name: 'Fuzil de Assalto Arasaka WSSA com Retículo Holográfico',
    category: 'Armamento',
    valueEb: 750,
    description: 'Arma de serviço corporativa leve com silenciador integrado de fábrica e conexão Smartgun opcional.',
    mechanicalEffect: 'Dano 5d6, capacidade para 30 projéteis, disparo em rajada de 3 tiros (ROF 1).',
  },
  {
    id: 'loot-8',
    name: 'Dívida de Honra com o Fixer da Região',
    category: 'Favor de NPC',
    valueEb: 600,
    description: 'O Fixer reconhece a lealdade da equipe e concorda em fornecer um arquivo de inteligência confidencial sem cobrar ed-bucks.',
    mechanicalEffect: 'Pode ser resgatado em qualquer momento para obter a localização ou fraqueza de um alvo de missão futura.',
  },
];

// 5. REGRAS OFICIAIS DE GASTO DE IP (Tabela Cyberpunk RED Corebook p. 411)
export const IP_PROGRESSION_RULES = [
  {
    category: 'Perícias Custo 1x (Ex: Atletismo, Pistola, Furtividade)',
    costFormula: 'Novo Nível x 10 IP',
    examples: [
      { fromTo: 'Nível 0 → 1', costIP: 10 },
      { fromTo: 'Nível 1 → 2', costIP: 20 },
      { fromTo: 'Nível 2 → 3', costIP: 30 },
      { fromTo: 'Nível 3 → 4', costIP: 40 },
      { fromTo: 'Nível 4 → 5', costIP: 50 },
      { fromTo: 'Nível 5 → 6', costIP: 60 },
      { fromTo: 'Nível 6 → 7', costIP: 70 },
      { fromTo: 'Nível 7 → 8', costIP: 80 },
      { fromTo: 'Nível 8 → 9', costIP: 90 },
      { fromTo: 'Nível 9 → 10', costIP: 100 },
    ],
    notes: 'A maioria das perícias da ficha utiliza o multiplicador de custo 1x.',
  },
  {
    category: 'Perícias Custo 2x (Ex: Artes Marciais, Pilotagem, Demolições)',
    costFormula: 'Novo Nível x 20 IP',
    examples: [
      { fromTo: 'Nível 0 → 1', costIP: 20 },
      { fromTo: 'Nível 1 → 2', costIP: 40 },
      { fromTo: 'Nível 2 → 3', costIP: 60 },
      { fromTo: 'Nível 3 → 4', costIP: 80 },
      { fromTo: 'Nível 4 → 5', costIP: 100 },
      { fromTo: 'Nível 5 → 6', costIP: 120 },
      { fromTo: 'Nível 6 → 7', costIP: 140 },
    ],
    notes: 'Perícias especializadas exigem o dobro de dedicação e treinamento.',
  },
  {
    category: 'Habilidade de Papel / Role Ability (Ex: Interface, Combat Awareness, Maker)',
    costFormula: 'Novo Nível x 60 IP',
    examples: [
      { fromTo: 'Rank 4 → 5', costIP: 300 },
      { fromTo: 'Rank 5 → 6', costIP: 360 },
      { fromTo: 'Rank 6 → 7', costIP: 420 },
      { fromTo: 'Rank 7 → 8', costIP: 480 },
      { fromTo: 'Rank 8 → 9', costIP: 540 },
      { fromTo: 'Rank 9 → 10', costIP: 600 },
    ],
    notes: 'Aumentar a habilidade de papel desbloqueia novas manobras e escalões na carreira.',
  },
];

// 6. MOTOR DE CÁLCULO OFFLINE (Baseado nas Tabelas de Referência Oficiais)
export function calculateSessionRewardsOffline(options: {
  sessionTitle: string;
  difficultyId: SessionDifficultyId;
  outcomeId: MissionOutcomeId;
  selectedTagIds: string[];
  partyMemberCount: number;
  fixerName?: string;
}): SessionRewardResult {
  const difficulty = SESSION_DIFFICULTY_TIERS[options.difficultyId] || SESSION_DIFFICULTY_TIERS.standard;
  const outcome = MISSION_OUTCOMES[options.outcomeId] || MISSION_OUTCOMES.standard_success;

  const activeTags = SESSION_REWARD_TAGS.filter(t => options.selectedTagIds.includes(t.id));

  // Soma de bônus por categoria
  let objectivesBonus = 0;
  let threatBonus = 0;
  let roleplayBonus = 0;
  let tacticsBonus = 0;
  let tagsEbBonus = 0;
  let tagsRepBonus = 0;

  for (const tag of activeTags) {
    if (tag.category === 'objective') objectivesBonus += tag.ipBonus;
    else if (tag.category === 'threat') threatBonus += tag.ipBonus;
    else if (tag.category === 'roleplay') roleplayBonus += tag.ipBonus;
    else if (tag.category === 'tactics') tacticsBonus += tag.ipBonus;
    else if (tag.category === 'impact') {
      objectivesBonus += tag.ipBonus;
    }

    tagsEbBonus += tag.ebBonus;
    tagsRepBonus += tag.repBonus;
  }

  // Cálculo de IP: Base ajustada pelo multiplicador de desfecho + bônus de performance
  const baseCalculated = Math.round(difficulty.baseIP * outcome.multiplierIP);
  const totalIP = Math.max(10, baseCalculated + objectivesBonus + threatBonus + roleplayBonus + tacticsBonus);

  // Cálculo de Pagamento em Eurodólares (eb)
  const baseEbCalculated = Math.round(difficulty.baseEb * outcome.multiplierEb);
  const cashEbPerPlayer = Math.max(0, baseEbCalculated + tagsEbBonus);
  const partyCount = Math.max(1, options.partyMemberCount || 4);
  const totalGroupCashEb = cashEbPerPlayer * partyCount;

  // Reputação (0, +1 ou +2)
  let reputationChange = 0;
  if (tagsRepBonus > 0 && outcome.multiplierIP >= 0.8) {
    reputationChange = Math.min(2, tagsRepBonus);
  } else if (options.difficultyId === 'climax' && outcome.multiplierIP >= 1.0) {
    reputationChange = 1;
  }

  // Manchete e Artigo dos Screamsheets de Night City
  const screamsheetHeadline = reputationChange > 0
    ? `🔥 EXPLOSÃO NA ZONA INDUSTRIAL: OPERAÇÃO MERCENÁRIA SACUDE AS RUAS DE NIGHT CITY!`
    : `📰 NOTAS DE GUIA DA REDE: TIROTEIO ISOLADO DEIXA DANOS MATERIAIS NO SUBÚRBIO`;

  const screamsheetArticle = `Fontes do Data Pool relatam movimentação violenta durante as primeiras horas da madrugada. Testemunhas afirmam que um grupo tático independente foi avistado no local. Representantes corporativos negaram envolvimento oficial, enquanto clínicas de Ripperdocs registram aumento nas encomendas de analgésicos e reposição de blindagem.`;

  // Seleciona 1 a 2 saques temáticos
  const specialLoot: SpecialSalvageItem[] = [];
  if (activeTags.some(t => t.id === 'impact_stolen_prototype' || t.id === 'threat_net_black_ice')) {
    specialLoot.push(SPECIAL_SALVAGE_POOL[0]); // Shard da Militech
  }
  if (activeTags.some(t => t.id === 'threat_cyberpsycho' || t.id === 'threat_corp_strike')) {
    specialLoot.push(SPECIAL_SALVAGE_POOL[1]); // Sandevistan
  }
  if (activeTags.some(t => t.id === 'impact_fixer_respect' || t.id === 'tactics_smooth_deal')) {
    specialLoot.push(SPECIAL_SALVAGE_POOL[7]); // Dívida de Honra Fixer
  }
  if (specialLoot.length === 0) {
    // Pega um item randômico
    const randomItem = SPECIAL_SALVAGE_POOL[Math.floor(Math.random() * SPECIAL_SALVAGE_POOL.length)];
    specialLoot.push(randomItem);
  }

  // Item adicional sorteado diretamente do Códice (oficial + homebrew)
  const codexLoot = pickFromCodex({ kind: Math.random() > 0.5 ? 'weapon' : 'cyberware', minCost: 100 })[0];
  if (codexLoot) {
    specialLoot.push({
      id: 'codex-' + Date.now(),
      name: codexLoot.name + ' 📖',
      category: codexLoot.kind === 'weapon' ? 'Armamento' : 'Cromo/Cyberware',
      valueEb: codexLoot.costEb,
      description: codexLoot.description || 'Item recuperado, listado no Códice.',
      mechanicalEffect: codexLoot.kind === 'weapon'
        ? 'Dano ' + codexLoot.raw.damage + ', ROF ' + (codexLoot.raw.rof ?? 1) + '. Custo de referência: ' + codexLoot.costLabel
        : 'Perda de Humanidade ' + codexLoot.raw.humanityLoss + '. Requer ripperdoc para instalar.',
    } as SpecialSalvageItem);
  }

  const mvpHighlights = [
    'Execução tática firme sob tiroteio pesado mantendo o esquadrão de pé.',
    'Uso pontual de habilidades de papel e infiltração para driblar obstáculos.',
    'Decisões de sobrevivência pragmáticas típicas de Edgerunners experientes.',
  ];

  const nextSessionHooks = [
    `O contratante ${options.fixerName || 'Fixer'} exige uma prestação de contas antes de liberar a próxima leva de contratos.`,
    'Rastros da operação chamaram a atenção de agentes da polícia ou seguranças corporativos.',
    'Um intermediário no Afterlife ouviu rumores do que aconteceu e tem uma proposta ainda mais perigosa.',
  ];

  const coGMVerdict = `Sessão avaliada com pontuação oficial de ${totalIP} IP por jogador. A equipe demonstrou postura mercenária digna das ruas de Night City com pagamento médio sugerido de ${cashEbPerPlayer}eb. O saldo de IP deve ser usado para evoluir perícias prioritárias ou subir o rank da habilidade de papel.`;

  return {
    sessionTitle: options.sessionTitle || 'Sessão de Operação em Night City',
    difficulty,
    outcome,
    totalIP,
    ipBreakdown: {
      base: baseCalculated,
      outcomeMultiplier: outcome.multiplierIP,
      objectivesBonus,
      threatBonus,
      roleplayBonus,
      tacticsBonus,
    },
    cashEbPerPlayer,
    totalGroupCashEb,
    reputationChange,
    screamsheetHeadline,
    screamsheetArticle,
    specialLoot,
    mvpHighlights,
    nextSessionHooks,
    coGMVerdict,
    isAiGenerated: false,
  };
}
