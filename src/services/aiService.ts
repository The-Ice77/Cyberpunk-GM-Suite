import { HomebrewWeapon, HomebrewCyberware, HomebrewVehicle, HomebrewGearOrDrug } from '../data/homebrewData';
import {
  generateProceduralVehicle,
  generateProceduralWeapon,
  generateProceduralCyberware,
  generateProceduralGearOrDrug,
} from '../data/customForgeData';
import { RULES_CODEX_DATABASE } from '../data/rulesCodexData';
import { GANGS_LIST } from '../data/gangsData';
import { strangeWeatherTable } from '../data/weatherData';
import { NightMarket } from '../data/nightMarketData';
import {
  SessionRewardResult,
  SessionDifficultyId,
  MissionOutcomeId,
  calculateSessionRewardsOffline,
  SESSION_DIFFICULTY_TIERS,
  MISSION_OUTCOMES,
  SPECIAL_SALVAGE_POOL,
} from '../data/rewardsData';
import {
  generateNarrativeNPCOffline,
  NarrativeArchetypeId,
} from '../data/npcNarrativeGeneratorData';
import {
  generatePetOffline,
  PetNatureId,
  PetSizeId,
  PetTrainingId,
} from '../data/petGeneratorData';
import { TarotCard, TarotSpreadType, DrawnCard } from '../data/tarotData';
import { NPCSheet, NPCTier, GameSystem } from '../types/system';

export const DEFAULT_USER_API_KEY = '';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isRuleCitation?: boolean;
}

/**
 * Modelos do Google Gemini suportados em ordem de cascata resiliente.
 * Se o modelo principal sofrer pico de tráfego temporário (503/429),
 * o sistema tenta automaticamente o próximo da lista sem falhar a requisição.
 */
export const CANDIDATE_GEMINI_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.7-flash',
  'gemini-flash-latest',
];

export function getEffectiveApiKey(providedKey?: string | null): string {
  if (providedKey && providedKey.trim().length > 10) {
    return providedKey.trim();
  }
  const envKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim().length > 10) {
    return envKey.trim();
  }
  const stored = typeof window !== 'undefined' ? localStorage.getItem('cyberpunk_gemini_api_key') : null;
  if (stored && stored.trim().length > 10) {
    return stored.trim();
  }
  return '';
}

export interface GeminiCallOptions {
  prompt: string;
  systemInstruction?: string;
  isJson?: boolean;
  temperature?: number;
  topP?: number;
  apiKey?: string | null;
}

/**
 * Despachante central para a API do Google Gemini com:
 * 1. Cascata automática de modelos para 100% de disponibilidade.
 * 2. Injeção de semente de entropia para evitar respostas repetitivas ou idênticas.
 * 3. Temperatura alta (0.95 - 1.0) para máxima variedade criativa no universo Cyberpunk.
 */
export async function callGeminiAPI(options: GeminiCallOptions): Promise<string | null> {
  const activeKey = getEffectiveApiKey(options.apiKey);
  if (!activeKey) return null;

  // Semente dinâmica de entropia para quebrar repetições e incentivar variedade
  const entropyNonce = `[Entropia-Variação-${Date.now().toString(36)}-${Math.floor(Math.random() * 99999)}]`;
  const variationGuidance = `\n\n(Diretriz de Variabilidade: Gere uma resposta única, surpreendente e crua no tom de Cyberpunk. Nunca use clichês ou nomes idênticos a gerações anteriores. ${entropyNonce})`;
  const fullPrompt = `${options.prompt}${variationGuidance}`;

  const temperature = options.temperature ?? (options.isJson ? 0.95 : 1.0);
  const topP = options.topP ?? 0.95;

  for (const model of CANDIDATE_GEMINI_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`;
      const payload: any = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: options.systemInstruction
                  ? `${options.systemInstruction}\n\n${fullPrompt}`
                  : fullPrompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature,
          topP,
          ...(options.isJson ? { responseMimeType: 'application/json' } : {}),
        },
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      } else {
        console.warn(`[Gemini Cascade] Modelo ${model} retornou status ${res.status}. Tentando próximo modelo...`);
      }
    } catch (err: any) {
      console.warn(`[Gemini Cascade] Falha ao conectar ao modelo ${model}:`, err?.message || err);
    }
  }

  return null;
}

/**
 * Executa uma chamada à API do Gemini e faz parse seguro de JSON,
 * limpando eventuais marcações de markdown (```json ... ```).
 */
export async function callGeminiJSON<T = any>(
  prompt: string,
  options?: { systemInstruction?: string; temperature?: number; apiKey?: string | null }
): Promise<T | null> {
  const rawText = await callGeminiAPI({
    prompt,
    systemInstruction: options?.systemInstruction,
    isJson: true,
    temperature: options?.temperature ?? 0.95,
    apiKey: options?.apiKey,
  });

  if (!rawText) return null;

  try {
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();
    return JSON.parse(cleaned) as T;
  } catch (parseErr) {
    console.warn('Erro ao processar JSON retornado pelo Gemini:', parseErr, rawText);
    return null;
  }
}

// 0. CHAT ASSISTANT PRINCIPAL: CYBERPUNK NEURAL CO-GM
export async function askCyberpunkAI(
  prompt: string,
  apiKey: string | null,
  campaignContext?: string
): Promise<string> {
  const systemInstruction = `Você é o "Cyberpunk Neural Co-GM", um assistente de inteligência artificial de elite e co-mestre especializado em RPG de mesa Cyberpunk RED e Cyberpunk 2020.
Você conhece todas as regras oficiais de R. Talsorian Games (Corebook RED, Cyberpunk 2020, Black Chrome, Night City Weather, Gang Guide, Data Pack).
Suas respostas devem ser no tom do gênero Cyberpunk (direto, visceral, técnico e cinematográfico).
Sempre forneça cálculos exatos de DVs, dano e regras mecânicas quando solicitado, citando as páginas e livros oficiais.

DIRETRIZES ESSENCIAIS DE FORMATAÇÃO (MARKDOWN):
- Estruture suas respostas sempre em Markdown limpo e bem diagramado.
- Use **negrito** para destacar nomes de personagens, perícias, DVs, dados de dano, custos em eb e termos-chave.
- Use subtítulos (### e ####) para organizar blocos de informação lógica (ex: ### Mecânica de Resolução, ### Consequências Narrativas).
- Use listas com marcadores (-) ou numeradas (1.) para passos, táticas, opções ou itens de inventário.
- Use citações em bloco (>) para avisos táticos de mestre, falas de NPCs ou trechos de rádio da polícia/Trauma Team.
- Use tabelas Markdown (| Coluna 1 | Coluna 2 |) para comparações de armas, distâncias, DVs ou estatísticas.
- Use crases (\`termo\`) para termos técnicos e blocos de código (\`\`\`) para fichas rápidas ou fórmulas matemáticas.

Contexto atual da mesa: ${campaignContext || 'Sessão em Night City'}`;

  const aiReply = await callGeminiAPI({
    prompt,
    systemInstruction,
    isJson: false,
    temperature: 1.0,
    apiKey,
  });

  if (aiReply) return aiReply;

  // BUILT-IN OFFLINE CYBERPUNK ORACLE ENGINE (com alta variedade dinâmica)
  const lower = prompt.toLowerCase();

  for (const r of RULES_CODEX_DATABASE) {
    if (lower.includes(r.id) || r.tags.some(t => lower.includes(t.toLowerCase()))) {
      return `📡 **Consulta de Protocolo: ${r.title}** (${r.bookCitation})\n\n**Resumo Direto:** ${r.summary}\n\n**Mecânica Aplicada:**\n${r.mechanics}\n\n${r.formulaOrTable ? `\`\`\`\n${r.formulaOrTable}\n\`\`\`` : ''}\n\n*Dica do Co-GM:* Mantenha o combate dinâmico e aplique as penalidades imediatamente no rastreador lateral!`;
    }
  }

  for (const g of GANGS_LIST) {
    if (lower.includes(g.id) || lower.includes(g.name.toLowerCase())) {
      return `🏢 **Dossiê Tático: ${g.name}** [${g.threatLevel}]\n\n**Território Dominante:** ${g.turf.join(', ')}\n**Líder Conhecido:** ${g.leader}\n**Identificadores:** ${g.identifiers}\n\n**Diretriz Tática em Tiroteio:** ${g.tactics}\n**Armas de Assinatura:** ${g.signatureWeapons.join(' | ')}\n\n*Fonte Oficial:* ${g.citation}`;
    }
  }

  if (lower.includes('clima') || lower.includes('chuva') || lower.includes('tempo') || lower.includes('weather')) {
    const sw = strangeWeatherTable[Math.floor(Math.random() * strangeWeatherTable.length)];
    return `☁️ **Boletim Meteorológico de Emergência (Night City Weather DLC):**\n\n**Condição Ativa:** ${sw.namePt} (${sw.name})\n**Duração Estimada:** ${sw.duration}\n\n**Efeito Narrativo:** ${sw.description}\n\n**Penalidade Mecânica:** ${sw.mechanics}\n\n*Referência:* ${sw.citation}`;
  }

  if (lower.includes('gancho') || lower.includes('missao') || lower.includes('contrato') || lower.includes('gig')) {
    const clients = [
      'Executivo traído da Petrochem',
      'Fixer respeitado do Afterlife',
      'Padre Ibarra de Heywood',
      'Médico clandestino em fuga',
      'Netrunner dissidente da Kang Tao',
      'Líder nômade dos Aldecaldos',
      'Jornalista investigativo do Canal 54',
      'Ripperdoc endividado com os Valentinos',
    ];
    const targets = [
      'resgatar um contêiner de chips neurais blindados',
      'extrair um cientista da Biotechnica antes da execução',
      'eliminar um líder de célula do Maelstrom com Sandevistan',
      'recuperar um carro esporte carregado de armas nos Badlands',
      'invadir a cobertura de um executivo durante uma festa de gala',
      'roubar a gravação bruta de um braindance de assassinato',
      'destruir um laboratório clandestino de Black Lace no Arroyo',
    ];
    const client = clients[Math.floor(Math.random() * clients.length)];
    const target = targets[Math.floor(Math.random() * targets.length)];
    const payout = Math.floor(Math.random() * 4 + 1) * 500 + 1000;

    return `💼 **Proposta de Trabalho da Rede Clandestina:**\n\n**Contratante:** ${client}\n**Objetivo Principal:** ${target}\n**Pagamento Estimado:** ${payout}eb por Edgerunner no ato da entrega.\n**Complicação:** O local foi isolado por uma tempestade de cinzas ácida ou há uma equipe rival de Solos monitorando o mesmo perímetro.\n\n*O que a equipe faz primeiro: reconhecimento furtivo ou chute na porta?*`;
  }

  const randomGMs = [
    `🤖 **Transmissão Neural Co-GM:**\n\n"Em Night City, ninguém sai ileso se hesitar por mais de um segundo. Analisei a sua solicitação:\n\n*Para resolver isso em jogo:* determine o Atributo relevante + Perícia do personagem + rolagem de 1d10 explodindo vs DV da tarefa. Se estiver em combate, lembre-se que alvos com REF 8+ podem esquivar de disparos com a perícia Esquiva (Evasion).\n\nQuer que eu gere um encontro surpresa, interprete um ferimento crítico ou calcule as defesas de uma fortaleza de dados agora?"`,
    `🤖 **Transmissão Neural Co-GM:**\n\n"Os sensores de rua captaram seu sinal. Se você precisa de uma decisão rápida de regras:\n\n- **Ações em Combate:** 1 Ação de Movimento + 1 Ação Principal por turno.\n- **Ablação de Blindagem:** Sempre que o dano penetrar o SP da armadura, reduza o SP daquela localização em -1 permanentemente até o reparo.\n- **Críticos:** Dois dados 6 no dano causam uma Lesão Crítica (+5 de dano bônus direto aos PVs!)."`,
    `🤖 **Transmissão Neural Co-GM:**\n\n"Frequência segura estabelecida. Se a cena estiver travada, use a regra de ouro de Cyberpunk: *faça a porta se abrir com dois caras armados entrando atirando*.\n\nPosso calcular estatísticas de combate, gerar NPCs na hora ou puxar uma carta de Tarot para definir o destino dos personagens."`,
  ];

  return randomGMs[Math.floor(Math.random() * randomGMs.length)];
}

// 1. Encounter Generator with AI
export async function generateAIExtendedEncounter(
  districtName: string,
  timeOfDay: string,
  apiKey?: string
): Promise<{
  title: string;
  actors: string;
  sceneDescription: string;
  tacticalObstacle: string;
  mechanicsAndDVs: string;
  twist: string;
}> {
  const prompt = `Crie um encontro urbano dinâmico, tenso e cinematográfico para Cyberpunk RED no distrito de ${districtName} durante o horário: ${timeOfDay}.
Retorne estritamente em formato JSON com os seguintes campos:
{
  "title": "título curto e chamativo",
  "actors": "quem está presente no encontro",
  "sceneDescription": "descrição sensorial viva (sons, cheiros, iluminação neon, clima)",
  "tacticalObstacle": "o obstáculo tático ou combate imediato",
  "mechanicsAndDVs": "testes mecânicos sugeridos com DVs exatos (ex: DV 13 Percepção, DV 15 Furtividade)",
  "twist": "uma reviravolta ou complicação dramática imprevista"
}`;

  const aiResult = await callGeminiJSON<{
    title: string;
    actors: string;
    sceneDescription: string;
    tacticalObstacle: string;
    mechanicsAndDVs: string;
    twist: string;
  }>(prompt, { apiKey });

  if (aiResult) return aiResult;

  // Fallback offline com alta variação
  const encounterTemplates = [
    {
      title: `Emboscada de Becos em ${districtName}`,
      actors: `3 Gangers armados e um Doutor Clandestino ferido`,
      sceneDescription: `Chuva ácida estalando no asfalto quente de ${districtName}. Neons piscando em azul e amarelo sobre latões de lixo em chamas. O ar cheira a óleo de CHOOH2 queimado e comida sintética estragada.`,
      tacticalObstacle: `Dois capangas montaram barricada atrás de um sedã acidentado munidos de espingardas pesadas (dano 5d6). O terceiro tenta arrombar a trava magnética da porta dos fundos.`,
      mechanicsAndDVs: `Teste de Percepção DV 13 para notar a mira laser no escuro; Teste de Atletismo DV 15 para saltar por cima do carro sem tomar fogo de supressão.`,
      twist: `O médico não é refém: ele roubou uma maleta de órgãos criogênicos da Trauma Team com rastreador GPS ativo que soará em 3 rodadas!`,
    },
    {
      title: `Cobrança Armada no Pátio de ${districtName}`,
      actors: `4 Enforcers da gangue local cercando um entregador de dados em uma moto elétrica`,
      sceneDescription: `Sirenes distantes da polícia ecoando pelas esquinas escuras. Fumaça densa de escapamento cobre o chão enquanto poças refletem letreiros quebrados de propaganda da Arasaka.`,
      tacticalObstacle: `Dois motoqueiros aceleram em círculos para encurralar a vítima enquanto o líder saca uma Katana Térmica zumbindo a alta temperatura.`,
      mechanicsAndDVs: `Teste de Intimidação DV 15 para fazer o bando recuar; Esquiva DV 14 contra disparos de SMG disparados em movimento.`,
      twist: `A moto do entregador carrega um cilindro de gás comprimido que explodirá se for atingido por projétil penetrante (Dano 4d6 em 4m)!`,
    },
    {
      title: `Operação de Varredura Secreta da Corporação`,
      actors: `Equipe tática da Militech com camuflagem ótica interrogando civis`,
      sceneDescription: `Luzes estroboscópicas brancas de um drone aéreo varrendo os becos de ${districtName}. O zumbido de hélices abafa qualquer pedido de socorro.`,
      tacticalObstacle: `Drones de reconhecimento com sensores infravermelhos bloqueiam a saída principal do quarteirão.`,
      mechanicsAndDVs: `Furtividade DV 15 para passar sob a sombra dos toldos; Cybertech ou Interface DV 13 para bloquear o sinal do drone.`,
      twist: `O alvo procurado pelos soldados se escondeu no porta-malas do veículo dos próprios jogadores!`,
    },
  ];

  return encounterTemplates[Math.floor(Math.random() * encounterTemplates.length)];
}

// 2. Screamsheet Generator with AI
export async function generateAIScreamsheet(
  topic: string,
  apiKey?: string
): Promise<{
  network: string;
  headline: string;
  article: string;
  hiddenGig: string;
  payout: string;
  isAi?: boolean;
}> {
  const corps = ['Petrochem', 'Arasaka', 'Militech', 'Kang Tao', 'Biotechnica', 'Trauma Team', 'Ziggurat', 'Night Corp', 'Continental Brands', 'SovOil'];
  const randomCorp = corps[Math.floor(Math.random() * corps.length)];
  const newsNetworks = ['Canal 54 News', 'World News Service (WNS)', 'Night City Inquirer', 'Ziggurat Pulse', 'N54 Live', 'Radio Free Night City'];
  const randomNet = newsNetworks[Math.floor(Math.random() * newsNetworks.length)];

  const prompt = `Crie uma notícia de jornal / Screamsheet completa, visceral, original e sensacionalista para Cyberpunk RED sobre o tópico: "${topic}".
Canal de transmissão sugerido: ${randomNet}.
Corporação ou facção de contexto: ${randomCorp}.
IMPORTANTE: Nunca repita manchetes comuns. Varie os crimes, escândalos, acidentes e ganchos de missão.
Retorne em JSON puro:
{
  "network": "Canal 54 News / World News Service / Night City Inquirer / Ziggurat Pulse / N54 Live",
  "headline": "Manchete impactante sensacionalista em caixa alta",
  "article": "Artigo jornalístico de 2 a 3 parágrafos narrando o fato com viés corporativo ou de rua",
  "hiddenGig": "O gancho de missão secreto que um Fixer esperto extrai desta notícia",
  "payout": "valor de pagamento sugerido em eb por Edgerunner"
}`;

  const aiResult = await callGeminiJSON<{
    network: string;
    headline: string;
    article: string;
    hiddenGig: string;
    payout: string;
  }>(prompt, { apiKey });

  if (aiResult) return { ...aiResult, isAi: true };

  // Fallback offline com múltiplas notícias variadas
  const newsPool = [
    {
      network: 'World News Service (WNS)',
      headline: `EXPLOSÃO EM DUTO DA PETROCHEM INTERROMPE DISTRIBUIÇÃO EM ARROYO`,
      article: `Na madrugada de hoje, uma detonação de alta potência comprometeu uma das linhas de transferência de CHOOH2 da Petrochem no distrito de Arroyo. Representantes culpam sabotadores ecoterroristas, enquanto o DPNC declarou toque de recolher em cinco quarteirões.`,
      hiddenGig: `Um Fixer rival quer que a equipe entre no perímetro interditado antes dos peritos da Arasaka para extrair o disco rígido da câmera de segurança que gravou os reais executores.`,
      payout: '1.800eb por mercenário + 3 doses de drogas sintéticas',
    },
    {
      network: 'Night City Inquirer',
      headline: `VAZAMENTO DE BIOTECNOLOGIA PROVOCA SURTO DE RAIVA CIBERNÉTICA EM LITTLE CHINA`,
      article: `Três clínicas clandestinas foram fechadas às pressas após implantes neurais piratas causarem episódios de histeria coletiva e surtos violentos em Kabuki. A MaxTac foi acionada e neutralizou quatro indivíduos com ciberware de combate.`,
      hiddenGig: `Um médico ripperdoc quer resgatar o lote intacto de microprocessadores neurais antes que a incineradora corporativa destrua a evidência.`,
      payout: '2.200eb por mercenário + desconto vitalício em cirurgias',
    },
    {
      network: 'Canal 54 News',
      headline: `CONVOI MILITAR DA KANG TAO EMBOSCADO NA INTERESTADUAL 101`,
      article: `Tropas nômades não identificadas interceptaram um veículo blindado de transporte de chips quânticos nos arredores de Night City. O confronto durou mais de 20 minutos com armamento anti-veículo pesado.`,
      hiddenGig: `O líder nômade contratou mercenários para decodificar a carga antes que os satélites de rastreamento da Kang Tao localizem o esconderijo no deserto.`,
      payout: '3.000eb por mercenário',
    },
  ];

  const picked = newsPool[Math.floor(Math.random() * newsPool.length)];
  return { ...picked, isAi: false };
}

// 3. Campaign Beat Chart Generator with AI
export async function generateAICampaignBeatChart(
  themeOrIdea: string,
  apiKey?: string
): Promise<{
  hook: { title: string; narrative: string; mechanicalAction: string };
  development: { title: string; narrative: string; skillChecks: string };
  cliffhanger: { title: string; narrative: string; urgentChoice: string };
  twist: { title: string; narrative: string; betrayalOrSecret: string };
  climax: { title: string; narrative: string; battlefieldSetup: string };
  resolution: { title: string; narrative: string; payoutAndConsequences: string };
}> {
  const prompt = `Você é um mestre experiente de Cyberpunk RED. Crie uma aventura completa usando a estrutura oficial do Beat Chart (6 atos) baseada na ideia: "${themeOrIdea}".
Retorne estritamente um JSON no seguinte formato:
{
  "hook": { "title": "1. O Gancho", "narrative": "como os personagens são contratados ou atraídos", "mechanicalAction": "teste inicial ou oferta de eddies" },
  "development": { "title": "2. Desenvolvimento", "narrative": "investigação e reconhecimento do alvo", "skillChecks": "testes sugeridos com DVs de perícias" },
  "cliffhanger": { "title": "3. Gancho Dramático", "narrative": "uma complicação que acelera o perigo", "urgentChoice": "dilema urgente para a equipe" },
  "twist": { "title": "4. A Reviravolta", "narrative": "traição, revelação ou segredo obscuro", "betrayalOrSecret": "detalhe da quebra de confiança" },
  "climax": { "title": "5. O Clímax", "narrative": "confronto armado decisivo ou invasão", "battlefieldSetup": "elementos do cenário de combate (cobertura, tanques explosivos, etc)" },
  "resolution": { "title": "6. A Resolução", "narrative": "desfecho e pagamento", "payoutAndConsequences": "reputação, eddies e inimigos gerados" }
}`;

  const aiResult = await callGeminiJSON<any>(prompt, { apiKey });
  if (aiResult) return aiResult;

  // Fallback offline estruturado e dinâmico
  return {
    hook: {
      title: '1. O Gancho: Encontro no Fundo do Afterlife',
      narrative: `Um Fixer com ciberolhos dourados entrega um datashard encriptado sobre a mesa. O alvo é invadir uma instalação discreta da Petrochem e extrair um protótipo de célula de combustível CHOOH2. Oferta: 2.000eb por cabeça.`,
      mechanicalAction: `Teste de Conversação ou Negociação DV 14 para arrancar adiantamento de 500eb ou equipamento tático adicional.`,
    },
    development: {
      title: '2. Desenvolvimento: Vigilância sob Chuva Ácida',
      narrative: `A equipe faz a vigilância do armazém sob chuva cáustica. Drones de segurança monitoram o telhado e uma guarita com 3 guardas da Militech controla o portão de veículos.`,
      skillChecks: `Furtividade DV 15 para ultrapassar o campo visual dos holofotes; Netrunning DV 14 para desligar a cerca eletrificada através da câmera externa.`,
    },
    cliffhanger: {
      title: '3. Gancho Dramático: Sirene de Emergência Antecipada',
      narrative: `Quando o grupo põe as mãos no contêiner, o alarme de invasão dispara sozinho! O turno de guardas foi trocado 1 hora antes do programado e um blindado com metralhadora rotativa estaciona na saída principal bloqueando os veículos de fuga!`,
      urgentChoice: `Arrombar a saída dos fundos sob fogo cruzado ou lutar contra a guarnição blindada do portão.`,
    },
    twist: {
      title: '4. A Reviravolta: Carga Humana',
      narrative: `O contêiner não tem células de bateria: dentro dele está um engenheiro genético sequestrado da Biotechnica, amordaçado e com implantes de contenção, implorando para não ser entregue porque o Fixer pretende vendê-lo ao mercado negro de cirurgias do Maelstrom!`,
      betrayalOrSecret: `O Fixer mentiu sobre a natureza do trabalho e a equipe agora precisa escolher entre o dinheiro sujo e a própria moral.`,
    },
    climax: {
      title: '5. O Clímax: Tiroteio na Área de Descarga',
      narrative: `Um esquadrão de choque intercepta os personagens na ponte da autoestrada durante a fuga sob uma tempestade de vento e cinzas tóxicas. Tiroteio com veículos em alta velocidade e granadas.`,
      battlefieldSetup: `Carretas tombadas fornecem cobertura com SP 25; tambores de combustível inflamável podem ser detonados com disparos visados (DV 15, Dano 6d6 em 6m).`,
    },
    resolution: {
      title: '6. A Resolução: O Preço das Ruas',
      narrative: `A equipe consegue escapar para uma garagem segura em Watson. O cientista oferece o código de uma conta bancária corporativa secreta se o ajudarem a fugir da cidade.`,
      payoutAndConsequences: `+1 em Reputação no submundo; 2.500eb por mercenário; O Fixer agora guarda rancor e colocará mercenários atrás do grupo na próxima semana.`,
    },
  };
}

// 4. Scene Improv Generator with AI
export async function generateAISceneImprov(
  zone: string,
  situation: string,
  apiKey?: string
): Promise<{
  sensorySights: string;
  sensorySounds: string;
  sensorySmells: string;
  instantNPC: { name: string; role: string; visualAppearance: string; motivation: string; dialogueHook: string };
  immediateHazard: string;
  suddenTwist: string;
}> {
  const prompt = `Crie elementos imediatos de improvisação sensorial e narrativa de cena para Cyberpunk RED.
Zona: ${zone}
Situação atual: ${situation}
Retorne em JSON:
{
  "sensorySights": "o que os personagens veem no ambiente",
  "sensorySounds": "o que se ouve (máquinas, vozes, música, tiros)",
  "sensorySmells": "os cheiros característicos de Night City",
  "instantNPC": {
    "name": "nome completo ou alcunha do NPC",
    "role": "profissão ou facção",
    "visualAppearance": "descrição física viva de roupas, ciberware visível e cicatrizes",
    "motivation": "o que ele quer imediatamente da cena",
    "dialogueHook": "uma frase de fala inicial de impacto"
  },
  "immediateHazard": "perigo físico ou obstáculo mecânico presente",
  "suddenTwist": "um evento repentino que muda a dinâmica"
}`;

  const aiResult = await callGeminiJSON<any>(prompt, { apiKey });
  if (aiResult) return aiResult;

  const npcPool = [
    {
      name: `Rico "Faísca" Navarro`,
      role: `Técnico de Cromo Clandestino`,
      visualAppearance: `Jaqueta tática com manchas de graxa de motor, três lentes de aumento ópticas presas com fita isolante no olho esquerdo e dedos mecânicos que tremem quando não estão segurando um ferro de solda.`,
      motivation: `Tentando recuperar uma mala de chips de interface roubada antes que seu chefe descubra.`,
      dialogueHook: `"Vocês aí com cara de mercenários... me dêem dois minutos de cobertura e eu divido metade do cromo com vocês!"`,
    },
    {
      name: `Vanya "Icepick" Rossi`,
      role: `Netrunner de Aluguel`,
      visualAppearance: `Sobretudo transparente de vinil reflexivo, cabos neurais enrolados no antebraço como pulseiras e óculos de realidade virtual com matriz verde piscando.`,
      motivation: `Desesperado para descarregar o calor de um firewall que está fritando seus circuitos cerebrais.`,
      dialogueHook: `"Se vocês não me ajudarem a desligar essa antena, nós todos vamos fritar em trinta segundos!"`,
    },
  ];
  const pickedNPC = npcPool[Math.floor(Math.random() * npcPool.length)];

  return {
    sensorySights: `Fios elétricos soltos faiscando no teto de zinco molhado; luz estroboscópica de um holograma de refrigerante quebrado piscando em magenta sobre poças de água oleosa em ${zone}.`,
    sensorySounds: `Gotejar rítmico de água contaminada; batidas graves de funk-techno vazando da porta de um clube a meio quarteirão; chiado de rádio da polícia captado por frequências abertas.`,
    sensorySmells: `Cheiro penetrante de ozônio sintético misturado com fumaça de carne de soja queimada em uma barraquinha de rua.`,
    instantNPC: pickedNPC,
    immediateHazard: `Um bueiro de vapor de alta pressão rompido bloqueia o beco (DV 15 Atletismo para saltar sem sofrer 2d6 de dano térmico).`,
    suddenTwist: `Uma van preta sem identificação para bruscamente na esquina e três agentes com capacetes espelhados desembarcam apontando fuzis com miras laser.`,
  };
}

// 5. Timeskip Downtime Simulator with AI
export async function generateAITimeskipDowntime(
  months: number,
  lifestyle: string,
  rolesList: string[],
  apiKey?: string
): Promise<{
  summary: string;
  monthlyEvents: { month: number; eventTitle: string; narrative: string; mechanicalResult: string }[];
  cityShift: string;
  reputationImpact: string;
}> {
  const prompt = `Simule a passagem de tempo (Timeskip) de ${months} meses em Night City para um grupo de Edgerunners com as seguintes classes: ${rolesList.join(', ')}. Estilo de vida do grupo: ${lifestyle}.
Retorne em JSON:
{
  "summary": "resumo geral de como o grupo sobreviveu nos meses de intervalo",
  "monthlyEvents": [
    {
      "month": 1,
      "eventTitle": "título do evento do mês",
      "narrative": "o que aconteceu (trabalhos, despesas, brigas de vizinhos, encontros)",
      "mechanicalResult": "ganho ou perda de eddies, despesa de aluguel e status de ciberware"
    }
  ],
  "cityShift": "como o cenário político ou as gangues de Night City mudaram nesse tempo",
  "reputationImpact": "como a reputação do grupo mudou nas ruas"
}`;

  const aiResult = await callGeminiJSON<any>(prompt, { apiKey });
  if (aiResult) return aiResult;

  const events = [];
  for (let m = 1; m <= months; m++) {
    events.push({
      month: m,
      eventTitle: `Mês ${m}: Bicos de Contrato e Manutenção de Cromo`,
      narrative: `A equipe realizou trabalhos discretos de escolta e cobrança para pagar o aluguel e evitar atenções corporativas indesejadas em Night City.`,
      mechanicalResult: `Despesa de aluguel paga; saldo de +${Math.floor(Math.random() * 500 + 400)}eb por personagem.`,
    });
  }

  return {
    summary: `Durante os ${months} meses, a equipe alternou entre bicos menores de escolta e períodos de reclusão para não chamar atenção corporativa. O custo de vida consumiu boa parte das reservas.`,
    monthlyEvents: events,
    cityShift: `A Arasaka reforçou o patrulhamento aéreo em Heywood e o preço da munição de calibre pesado subiu 20% no mercado negro.`,
    reputationImpact: `O grupo é agora conhecido pelos Fixers locais como sobreviventes confiáveis que não fogem quando as coisas esquentam.`,
  };
}

// 6. Net Architecture Generator with AI
export async function generateAINetArchitecture(
  targetOrg: string,
  difficulty: 'basic' | 'standard' | 'advanced' | 'fortress',
  apiKey?: string
): Promise<{
  name: string;
  floorsCount: number;
  floors: { floor: number; type: string; dv: number; content: string; notes?: string }[];
  blackICEList: { name: string; floor: number; spd: number; hp: number; effect: string }[];
  secretDataLoot: string;
}> {
  const prompt = `Crie uma Arquitetura NET completa e detalhada para Cyberpunk RED para o alvo: "${targetOrg}" com nível de dificuldade: "${difficulty}".
Siga as regras de elevador de andares com senhas (DVs), nós de controle (câmeras, maglocks, metralhadoras de teto), arquivos secretos e Black ICE oficial (Hellhound, Raven, Liche, Giant, etc).
Retorne em JSON:
{
  "name": "nome da rede corporativa ou terminal",
  "floorsCount": 7,
  "floors": [
    { "floor": 1, "type": "Senha / Arquivo / Controle / Black ICE", "dv": 13, "content": "descrição do que há no andar", "notes": "efeito em caso de sucesso" }
  ],
  "blackICEList": [
    { "name": "Hellhound / Killer / etc", "floor": 3, "spd": 6, "hp": 25, "effect": "queima sinapses do netrunner" }
  ],
  "secretDataLoot": "conteúdo dos arquivos confidenciais que podem ser vendidos a Fixers"
}`;

  const aiResult = await callGeminiJSON<any>(prompt, { apiKey });
  if (aiResult) return aiResult;

  return {
    name: `Sub-Rede de Segurança ${targetOrg}`,
    floorsCount: difficulty === 'fortress' ? 14 : difficulty === 'advanced' ? 10 : 7,
    floors: [
      { floor: 1, type: 'Senha', dv: 13, content: 'Firewall de Reconhecimento Biométrico', notes: 'Abrir acesso ao elevador de dados' },
      { floor: 2, type: 'Controle', dv: 13, content: 'Nó de Câmeras de Vigilância do Prédio', notes: 'Permite congelar loops de gravação' },
      { floor: 3, type: 'Black ICE', dv: 14, content: 'Armadilha Hellhound Ativa', notes: 'Ataca iniciativa do Netrunner' },
      { floor: 4, type: 'Arquivo', dv: 14, content: 'Registros de Deslocamento de AVs', notes: 'Valor de revenda: 500eb' },
      { floor: 5, type: 'Controle', dv: 15, content: 'Torreta Automática de Teto do Corredor', notes: 'Pode ser desativada ou virada contra os guardas' },
      { floor: 6, type: 'Senha', dv: 15, content: 'Criptografia Quântica Militar', notes: 'Bloqueia o núcleo central' },
      { floor: 7, type: 'Arquivo', dv: 15, content: 'Projeto Secreto de Ciberware Experimental', notes: 'Valor no mercado negro: 2.000eb' },
    ],
    blackICEList: [
      { name: 'Hellhound', floor: 3, spd: 6, hp: 25, effect: 'Causa 2d6 de dano diretamente ao cérebro do Netrunner e incendeia o deck' },
    ],
    secretDataLoot: 'Planilhas de suborno de policiais do DPNC e rota de entrega de protótipos de armas pesadas.',
  };
}

// 7. Custom Vehicle Generator with AI
export async function generateAICustomVehicle(
  type: string,
  nomadClan: string,
  apiKey?: string
): Promise<{
  name: string;
  type: string;
  clan: string;
  sdp: number;
  seats: number;
  speedMph: number;
  costEb: string;
  visualAesthetic: string;
  installedNomadMods: string[];
  weaponsMounted: string[];
  quirk: string;
}> {
  const prompt = `Crie um veículo customizado para Cyberpunk RED.
Tipo: ${type}
Clã Nômade ou Origem: ${nomadClan}
Retorne em JSON:
{
  "name": "nome apelido carinhoso de rua",
  "type": "${type}",
  "clan": "${nomadClan}",
  "sdp": 75,
  "seats": 5,
  "speedMph": 110,
  "costEb": "valor estimado no mercado negro",
  "visualAesthetic": "descrição visual detalhada da pintura, soldas, blindagem e escapamentos",
  "installedNomadMods": ["mod 1", "mod 2", "mod 3"],
  "weaponsMounted": ["arma montada se houver"],
  "quirk": "peculiaridade divertida ou mecânica do carro"
}`;

  const aiResult = await callGeminiJSON<any>(prompt, { apiKey });
  if (aiResult) return aiResult;

  return {
    name: `Caravan Ranger "Fúria do Deserto"`,
    type,
    clan: nomadClan,
    sdp: 75,
    seats: 5,
    speedMph: 110,
    costEb: '25.000eb (Custom Nômade)',
    visualAesthetic: `Picape pesada com chapas de aço corrugado rebitadas nas portas, para-brisa protegido por grade de ferro e quatro holofotes halógenos no teto iluminando tempestades de poeira.`,
    installedNomadMods: ['Tanque Duplo de CHOOH2 Blindado', 'Pneus Maciços Antifuro', 'Aríete Frontal de Choque'],
    weaponsMounted: ['Metralhadora Leve Rostović 5.56mm montada no teto com controle remoto da cabine'],
    quirk: `O rádio de bordo só sintoniza a estação de rock pirata dos Badlands e o escapamento cospe chamas ao reduzir a marcha.`,
  };
}

// 8. Custom Bar & Club Generator with AI
export async function generateAICustomBar(
  district: string,
  vibe: string,
  apiKey?: string
): Promise<{
  name: string;
  district: string;
  aesthetic: string;
  musicStyle: string;
  clientele: string;
  securityRating: string;
  signatureDrink: {
    name: string;
    cost: string;
    category?: any;
    glassware?: string;
    visualServing?: string;
    ingredients?: string[];
    tastingNotes?: string;
    description: string;
    inGameEffect: string;
    sideEffect?: string;
    loreTrivia?: string;
  };
  localRumors: string[];
}> {
  const barThemes = [
    'Subsolo industrial clandestino de Netrunners com cabos refrigerados',
    'Rooftop de alta tecnologia com vista panorâmica para o memorial da Arasaka',
    'Boteco pesado de motoqueiros com cheiro forte de CHOOH2 e palco de punk rock',
    'Arcade neon retro-futurista com luz negra e lâmen sintético',
    'Galpão flutuante nas docas úmidas de Pacifica com música tribal eletrônica',
    'Antigo abrigo antiaéreo reconvertido em lounge noir com mesas de bilhar'
  ];
  const randomBarTheme = barThemes[Math.floor(Math.random() * barThemes.length)];

  const prompt = `Crie um bar ou casa noturna memorável e totalmente único para Night City no distrito de ${district}.
Vibe solicitada: ${vibe || randomBarTheme}.
Conceito atmosférico adicional: ${randomBarTheme}.
IMPORTANTE: Crie um nome original e diferente de bares comuns (não use "Chrome Siren" ou "Afterlife").
Retorne em JSON:
{
  "name": "nome estiloso da boate ou boteco",
  "district": "${district}",
  "aesthetic": "descrição visual da iluminação, decoração, fumaça e balcão",
  "musicStyle": "gênero musical e decibéis tocando",
  "clientele": "quem frequenta o local",
  "securityRating": "Nenhuma (Faroeste) / Baixa / Média / Pesada / Militar",
  "signatureDrink": {
    "name": "nome do drink especial",
    "cost": "35eb",
    "category": "Coquetel Lendário / Destilado Pesado / Energético Cibernético / Elixir Bioquímico / Cerveja de Sarjeta",
    "glassware": "estilo do copo",
    "visualServing": "como é servido, cores, névoa ou efervescência",
    "ingredients": ["ingrediente 1", "ingrediente 2", "ingrediente 3"],
    "tastingNotes": "sensação sensorial detalhada no primeiro gole e queimação",
    "description": "resumo direto dos ingredientes e sabor",
    "inGameEffect": "bônus mecânico exato de regra e duração",
    "sideEffect": "ressaca ou efeito secundário",
    "loreTrivia": "história ou lenda sobre a criação do drink"
  },
  "localRumors": ["rumor 1 com gancho de missão", "rumor 2"]
}`;

  const aiResult = await callGeminiJSON<any>(prompt, { apiKey });
  if (aiResult) return aiResult;

  const barNames = [
    { name: 'The Chrome Siren', drink: "Siren's Byte", effect: '+1 em Interface de Netrunning por 1h' },
    { name: 'Neon Samurai', drink: 'Katana Slash Shot', effect: '+1 em Esquiva (Evasion) por 1h' },
    { name: 'Afterburner Lounge', drink: 'CHOOH2 Blue Flame', effect: '+2 em Iniciativa no primeiro turno de combate' },
  ];
  const pickedBar = barNames[Math.floor(Math.random() * barNames.length)];

  return {
    name: pickedBar.name,
    district,
    aesthetic: `Subsolo com teto baixo coberto por tubulações cromadas que condensam gotas de água gelada; iluminação fria azul turquesa refletindo em mesas de espelho escuro.`,
    musicStyle: `Synthwave pesado com vocais distorcidos e baixo pulsante a 110 dB.`,
    clientele: `Netrunners de aluguel, batedores de carteira e técnicos de cibernéticos clandestinos.`,
    securityRating: `Média`,
    signatureDrink: {
      name: pickedBar.drink,
      cost: '40eb',
      category: 'Elixir Bioquímico',
      glassware: 'Copo térmico de policarbonato fosco com LED azul na base',
      visualServing: 'Líquido azul neon com microbolhas efervescentes que brilham sob luz ambiente.',
      ingredients: ['Vodka sintética 70%', 'Xarope de mirtilo radioativo', 'Gotas de eletrólito neuronal'],
      tastingNotes: 'Gosto gélido de menta e frutas escuras que faz a língua formigar e anestesia levemente os dentes.',
      description: 'Vodka sintética azul misturada com energético de taurina e cristais efervescentes.',
      inGameEffect: pickedBar.effect,
      sideEffect: 'Insônia leve pelas próximas 6 horas.',
      loreTrivia: 'Criado pelo barman em celebração à queda da rede em 2043.',
    },
    localRumors: [
      `Dizem que o barman esconde uma antena transmissora ligada diretamente à fortaleza de dados da Ziggurat no porão.`,
      `Uma Solo ciborgue deixou uma mala lacrada no cofre do bar e prometeu 5.000eb para quem entregá-la em Westbrook.`,
    ],
  };
}

// 9. Digital Dating & Datepath Generator with AI
export interface AIDateResult {
  partnerName: string;
  partnerRole: string;
  partnerStyle: string;
  keywords: string[];
  locationName: string;
  district: string;
  activity: string;
  complicationTitle: string;
  complicationDesc: string;
  complicationHook: string;
  conversationStarter?: string;
  secretAgenda?: string;
  isAi?: boolean;
}

export async function generateAIDate(
  preferences?: {
    district?: string;
    partnerType?: string;
    vibe?: string;
    prompt?: string;
  },
  apiKey?: string
): Promise<AIDateResult> {
  const contextDesc = [
    preferences?.district ? `Distrito: ${preferences.district}` : '',
    preferences?.partnerType ? `Tipo de Parceiro(a): ${preferences.partnerType}` : '',
    preferences?.vibe ? `Clima / Estilo: ${preferences.vibe}` : '',
    preferences?.prompt ? `Instruções adicionais: ${preferences.prompt}` : '',
  ].filter(Boolean).join(' | ');

  const nameInspirations = [
    'Dante "Apex" Kowalski', 'Sora "Ghost" Takahashi', 'Malik "Ironclad" Al-Mansoor',
    'Yuki "Katana" Tanaka', 'Zoe "Neon" Rossi', 'Goran "Buster" Varga',
    'Helena "Valkyrie" Silva', 'Kael "Cipher" O\'Connor', 'Rocco "Spark" Russo',
    'Leila "Mirage" Chen', 'Valentin "Apex" Cruz', 'Jax "Dust" Mendoza',
    'Raven "Hex" Kelly', 'Carmen "Viper" Ortiz', 'Axel "Chrome" Vance'
  ];
  const randomSample = nameInspirations.sort(() => 0.5 - Math.random()).slice(0, 3).join(', ');

  const prompt = `Você é o Co-Mestre de Cyberpunk RED especialista no DLC oficial "Digital Dating & Datepath" (Garden Patch Dating).
Gere um encontro romântico detalhado, surpreendente, cru e cinematográfico para um mercenário de Night City com base nos parâmetros: "${contextDesc || 'Encontro casual no submundo de Night City'}".

DIRETRIZ DE DIVERSIDADE & ANTI-REPETIÇÃO:
- Crie um personagem totalmente NOVO. NUNCA use o nome "Nyx" ou "Nova" repetidamente.
- Inspire-se em diversas etnias e origens culturais de Night City (exemplos de nomes/estilos: ${randomSample}).
- Varie a atitude: pode ser alguém caloroso, cínico, paranoico, militarista, sedutor ou rebelde.
- Varie os papéis: ${preferences?.partnerType || 'Solo, Netrunner, Tech, Ripperdoc, Nômade, Executivo, Rockerboy, Cop ou Fixer'}.

Retorne EXCLUSIVAMENTE um objeto JSON válido com a seguinte estrutura:
{
  "partnerName": "Nome completo e apelido de rua entre aspas",
  "partnerRole": "Papel do sistema (ex: Solo Freelancer, Netrunner de Aluguel, Executiva Júnior, Médica Clandestina, Rockerboy Rebelde, Nômade das Badlands)",
  "partnerStyle": "Descrição detalhada do visual, roupas de estilo cyberpunk (Kitsch, Neotetro, High Fashion ou Militar), implantes visíveis e postura corporal",
  "keywords": ["#PalavraChave1", "#PalavraChave2", "#PalavraChave3"],
  "locationName": "Nome atmosférico do local do encontro (bar, restaurante subterrâneo, galeria de arcades, mirante de ferro-velho, estande de tiro)",
  "district": "Distrito de Night City (Watson, Westbrook, Heywood, Pacifica, Centro Corporativo, Santo Domingo ou Badlands)",
  "activity": "Atividade do encontro planejada pelo par",
  "complicationTitle": "Título da Complicação inesperada do encontro",
  "complicationDesc": "Narrativa da complicação que interrompe o date",
  "complicationHook": "Regra mecânica para o Mestre resolver a complicação (teste de perícia com DV)",
  "conversationStarter": "Frase de abertura ou assunto instigante que o par puxa na mesa",
  "secretAgenda": "Motivação oculta ou segredo do par para este encontro"
}`;

  const aiResult = await callGeminiJSON<AIDateResult>(prompt, { apiKey });
  if (aiResult) {
    return { ...aiResult, isAi: true };
  }

  // Fallback offline com alta rotação de parceiros
  const offlineDates: AIDateResult[] = [
    {
      partnerName: 'Kira "Nova" Chen',
      partnerRole: 'Solo Freelancer & Veterana de Heywood',
      partnerStyle: 'Jaqueta de couro desgastada com ombreiras Kevlar, ciberolho Kiroshi dourado e sorriso confiante de quem já viu de tudo.',
      keywords: ['#CombateUrbano', '#ArmasPesadas', '#Lealdade'],
      locationName: 'El Coyote Cojo Rooftop Bar',
      district: preferences?.district || 'Heywood (The Glen)',
      activity: 'Comparar cicatrizes de combate e testar a precisão em um alvo holográfico enquanto tomam tequila sintética com sal.',
      complicationTitle: 'Vingança dos Valentinos',
      complicationDesc: 'Dois capangas entram no bar procurando Kira por um antigo desentendimento em uma aposta de corrida.',
      complicationHook: 'Teste de Intimidação DV 15 ou Esquiva DV 14 para dispersar a confusão sem tiros.',
      conversationStarter: '"Quantas vezes você já quase morreu neste mês? Eu parei de contar na quarta."',
      secretAgenda: 'Precisa de um parceiro de confiança para invadir um depósito de penhores e resgatar a medalha militar do irmão.',
      isAi: false,
    },
    {
      partnerName: 'Dante "Vex" Morales',
      partnerRole: 'Técnico de Garagem & Piloto Nômade',
      partnerStyle: 'Macacão jeans reforçado, bandana vermelha, mãos cobertas por tatuagens de fiação e anéis de cromo escovado.',
      keywords: ['#Velocidade', '#CustomCars', '#Badlands'],
      locationName: 'Redline Diner & Pátio de Chooh2',
      district: preferences?.district || 'Santo Domingo (Rancho Coronado)',
      activity: 'Ajustar o turbocompressor de um carro de arrancada enquanto dividem uma porção de hambúrguer sintético com batatas fritas picantes.',
      complicationTitle: 'Racha Clandestino Forçado',
      complicationDesc: 'A gangue 6th Street bloqueia o cruzamento e desafia Dante para uma corrida com apostas altas valendo o próprio veículo.',
      complicationHook: 'Teste de Pilotagem DV 15 ou Tática DV 13 para escolher o melhor trajeto pela autoestrada.',
      conversationStarter: '"O motor de um carro nunca mente para você. As pessoas em Night City, por outro lado..."',
      secretAgenda: 'Está acumulando eddies para comprar uma passagem de volta para seu clã nômade no sul.',
      isAi: false,
    },
    {
      partnerName: 'Chloe "Silk" Moreau',
      partnerRole: 'Executiva Júnior de Relações Corporativas',
      partnerStyle: 'Terno risca de giz assimétrico de alta costura, perfume sintético de orquídea rara e relógio de pulso holográfico de platina.',
      keywords: ['#AltaModa', '#Conspiração', '#VinhoSintético'],
      locationName: 'Skyline Terrace Lounge',
      district: preferences?.district || 'Centro Corporativo',
      activity: 'Degustar vinho tinto sintético em uma mesa com vista panorâmica para o memorial da Arasaka.',
      complicationTitle: 'Escuta Grampeada',
      complicationDesc: 'O detector de bugs de Chloe apita: há um agente de contrainteligência corporativa gravando a conversa na mesa ao lado.',
      complicationHook: 'Teste de Percepção DV 14 para identificar o espião ou Conversação DV 15 para inventar uma mentira convincente.',
      conversationStarter: '"Todo mundo em Night City tem um preço. Me diga o seu antes que meu chefe descubra."',
      secretAgenda: 'Quer vazar uma planilha confidencial da diretoria para a mídia antes de ser demitida.',
      isAi: false,
    },
    {
      partnerName: 'Nyx "Glitch" Sterling',
      partnerRole: 'Netrunner Freelancer & DJ de Rádio Pirata',
      partnerStyle: 'Jaqueta bomber holográfica com fios de fibra óptica azuis pulsando no colarinho, cabelo raspado de um lado com tatuagem neural de circuito, olhos ópticos ciano e sorriso sarcástico.',
      keywords: ['#Netrunning', '#Synth-Drinks', '#Música Subterrânea'],
      locationName: 'Sub-Zero Arcade & Noodle Bar',
      district: preferences?.district || 'Watson (Kabuki)',
      activity: 'Desafiar uns aos outros no arcade retrô de combate enquanto dividem uma tigela fumegante de lámen sintético apimentado com cerveja de arroz.',
      complicationTitle: 'Varredura Surpresa da NCPD',
      complicationDesc: 'Duas viaturas do DPNC param com sirenes ligadas em frente ao bar buscando um hacker procurado. Nyx empalidece e enfia discretamente um chip de dados criptografado no seu bolso.',
      complicationHook: 'Teste de Atuação DV 14 para fingir que são apenas um casal apaixonado e distrair os policiais, ou Furtividade DV 15 para sair pelos fundos.',
      conversationStarter: '"Você prefere morrer de velhice no tédio ou virar uma lenda de Night City queimando antes dos trinta?"',
      secretAgenda: 'Está sendo caçada pela NetWatch por quebrar um firewall corporativo e precisa de alguém com mira boa para cobrir sua retaguarda.',
      isAi: false,
    },
  ];

  return offlineDates[Math.floor(Math.random() * offlineDates.length)];
}

// 10. Night Market / Mercado Negro Generator with AI
export async function generateAINightMarket(
  preferences?: {
    district?: string;
    focusCategory?: string;
    dangerLevel?: string;
    prompt?: string;
  },
  apiKey?: string
): Promise<NightMarket> {
  const contextDesc = [
    preferences?.district ? `Distrito: ${preferences.district}` : '',
    preferences?.focusCategory ? `Foco de Mercadorias: ${preferences.focusCategory}` : '',
    preferences?.dangerLevel ? `Nível de Perigo / Segurança: ${preferences.dangerLevel}` : '',
    preferences?.prompt ? `Instruções adicionais: ${preferences.prompt}` : '',
  ].filter(Boolean).join(' | ');

  const marketLocations = [
    'docas clandestinas de contêineres marítimos enferrujados sob a chuva',
    'túnel de metrô desativado sob trilhos eletrificados vigiado por snipers',
    'estacionamento subterrâneo de shopping abandonado com barracas iluminadas por néon',
    'acampamento de trailers nômades fortificado no perímetro das colinas',
    'antigo matadouro industrial com câmaras frigoríficas adaptadas para quiosques'
  ];
  const randomLoc = marketLocations[Math.floor(Math.random() * marketLocations.length)];

  const prompt = `Você é o Co-Mestre de Cyberpunk RED especialista nas regras oficiais de "Night Markets" (Mercados Noturnos / Mercado Negro, Livro Básico pp. 336-342).
Gere um Mercado Negro clandestino completo, atmosférico, imprevisível e perigoso com base nos parâmetros: "${contextDesc || 'Mercado Negro secreto no submundo de Night City'}".
Cenário de inspiração para localização: ${randomLoc}.
IMPORTANTE: Gere nomes criativos, vendedores carismáticos com personalidades únicas e itens raros variados. Nunca repita nomes anteriores.

Retorne EXCLUSIVAMENTE um objeto JSON válido com a seguinte estrutura:
{
  "id": "night-market-ai-${Date.now()}",
  "name": "Nome evocativo do Mercado Noturno",
  "district": "Distrito de Night City (Watson, Westbrook, Heywood, Pacifica, Santo Domingo ou Badlands)",
  "exactLocation": "Localização secreta exata e acesso",
  "operatorFixer": {
    "name": "Nome e apelido do Fixer organizador",
    "reputation": 6,
    "quirk": "Cacoete, postura ou mania do Fixer",
    "securityLevel": "Baixa (Pistolas) ou Média (Solos Armados & Cães K-9) ou Alta (Torres e Snipers nos Telhados)",
    "entryCondition": "Regra para entrar no mercado"
  },
  "atmosphere": "Descrição sensorial rica (iluminação neon/lâmpadas a óleo, fumaça, cheiro de comida sintética frita, música e tensão armada)",
  "stalls": [
    {
      "vendorName": "Nome do vendedor(a)",
      "vendorTitle": "Título ou especialidade",
      "vendorStyle": "Descrição visual do vendedor e sua banca",
      "vendorPersonality": "Personalidade de negociação e fala",
      "category": "Armas Pesadas | Cromo & Implantes | Cyberdecks & Softwares | Químicos & Drogas | Contrabando Corporativo | Roupas Blindadas",
      "specialService": "Serviço extra no local com custo e perícia",
      "items": [
        {
          "name": "Nome exato do item",
          "category": "Categoria do item",
          "priceEb": 500,
          "priceLabel": "500eb",
          "condition": "Novo Lacrado ou Usado em Combate ou Militar Restrito ou Pirateado / Modificado",
          "stock": 2,
          "description": "Descrição detalhada do item no universo Cyberpunk",
          "mechanicalEffect": "Efeito no sistema (dano, blindagem, bônus em perícia ou duração)"
        }
      ]
    }
  ],
  "complication": {
    "title": "Complicação imprevista no mercado",
    "description": "O que acontece enquanto os personagens estão negociando",
    "mechanicalHook": "Regra mecânica / teste com DV para o Mestre resolver o evento"
  },
  "bargainTip": "Dica prática de pechincha ou negociação com o Fixer"
}`;

  const aiResult = await callGeminiJSON<NightMarket>(prompt, { apiKey });
  if (aiResult) {
    return {
      ...aiResult,
      id: `night-market-ai-${Date.now()}`,
      isAi: true,
    };
  }

  // Fallback offline estruturado
  return {
    id: `night-market-offline-${Date.now()}`,
    name: 'Bazar Clandestino das Docas 44',
    district: preferences?.district || 'Watson (Northside)',
    exactLocation: 'Galpão naval abandonado sob a ponte do porto, acesso por escotilha de descarga enferrujada.',
    operatorFixer: {
      name: 'Marta "Chave-Mestra" Varga',
      reputation: 6,
      quirk: 'Masca chiclete de nicotina continuamente e nunca olha nos olhos de quem não mostra credsticks primeiro.',
      securityLevel: 'Média (Solos Armados & Cães K-9)',
      entryCondition: 'Senha diária ("Olho de Vidro") ou taxa de entrada de 20eb por pessoa na porta.',
    },
    atmosphere: 'Fumaça espessa de CHOOH2 misturada a vapor de cozimento de algas fritas. Holofotes halógenos pendurados por fios expostos iluminam bancas improvisadas sobre caixotes industriais.',
    stalls: [
      {
        vendorName: 'Klaus "Martelo" Brandt',
        vendorTitle: 'Armeiro Clandestino dos Bakkers',
        vendorStyle: 'Macacão reforçado com manchas de fuligem, avental de couro e óculos de solda na testa.',
        vendorPersonality: 'Grosseiro, mas apaixonado por mecânica pesada. Trata as armas como filhas.',
        category: 'Armas Pesadas & Munições',
        specialService: 'Lixar números de série de fábrica e ajustar gatilho (+1 em Saque Rápido por 100eb)',
        items: [
          {
            name: 'Escopeta Tática Rostović Modificada',
            category: 'Armas Pesadas',
            priceEb: 650,
            priceLabel: '650eb',
            condition: 'Usado em Combate',
            stock: 2,
            description: 'Escopeta pesada calibre 12 com cano serrado e empunhadura ergonômica de polímero.',
            mechanicalEffect: 'Dano 5d6 (projétil ou chumbo em cone). ROF 1. Carregador de 4 cartuchos.',
          },
          {
            name: 'Caixa de Munição Perfurante de Armadura (AP) 9mm',
            category: 'Munição Especial',
            priceEb: 150,
            priceLabel: '150eb (50 balas)',
            condition: 'Militar Restrito',
            stock: 4,
            description: 'Projéteis com núcleo de tungstênio projetados para triturar coletes de kevlar.',
            mechanicalEffect: 'Ablata 2 pontos de SP de armadura a cada impacto bem-sucedido que penetre a defesa.',
          },
        ],
      },
      {
        vendorName: 'Dra. Sora "Bisturi" Tanaka',
        vendorTitle: 'Ripperdoc Renegada da Biotechnica',
        vendorStyle: 'Bata cirúrgica preta de vinil com mangas dobradas, luvas de nitrilo e ciberbraço cirúrgico multifuncional.',
        vendorPersonality: 'Cirúrgica, cínica e extremamente rápida. Odeia conversa fiada.',
        category: 'Cromo & Implantes Neurais',
        specialService: 'Instalação cirúrgica imediata no furgão médico dos fundos (DV 15 Cirurgia, 200eb)',
        items: [
          {
            name: 'Ciberolho Kiroshi com HUD de Mira Óptica',
            category: 'Cibernético',
            priceEb: 500,
            priceLabel: '500eb',
            condition: 'Novo Lacrado',
            stock: 1,
            description: 'Implante ocular com retícula de mira computadorizada e zoom digital 8x.',
            mechanicalEffect: '+1 em testes de Ataque com Armas de Fogo em alvos além de 15 metros.',
          },
          {
            name: 'Black ICE Defensivo: Vira-Lata (Bloodhound)',
            category: 'Software Clandestino',
            priceEb: 400,
            priceLabel: '400eb',
            condition: 'Novo Lacrado',
            stock: 2,
            description: 'Programa farejador que rastreia a localização física exata de quem tentar invadir seu cyberdeck.',
            mechanicalEffect: 'Rastreia o IP e terminal do Netrunner invasor em até 1 minuto de combate na rede.',
          },
        ],
      },
    ],
    complication: {
      title: 'Tiroteio Repentino: Invasão da Gangue Tyger Claws',
      description: 'Quatro membros da gangue Tyger Claws em motos katana aceleram pelos corredores estreitos do mercado exigindo que o Fixer pague a porcentagem de proteção da semana, atirando para o alto.',
      mechanicalHook: 'Teste de Esquiva ou Tática DV 14 para se abrigar atrás das bancas blindadas sem perder as compras, ou Intimidação DV 16 para fazer os motoqueiros recuarem.',
    },
    bargainTip: 'Regra Oficial de Pechincha (CP:R p. 338): Faça um teste resistido de Negociação (Trading) contra o vendedor. Uma margem de vitória de +3 ou mais reduz o preço final em 10% a 20%.',
    isAi: false,
  };
}

// 11. Lifepath Backstory Narrative Generator with AI
export async function generateAILifepathBackstory(
  characterName: string,
  role: string,
  lifepath: Record<string, string>,
  apiKey?: string
): Promise<string> {
  const prompt = `Você é o Co-Mestre Neural de Cyberpunk RED. Escreva uma crônica narrativa emocionante, visceral e rica em primeira pessoa (3 parágrafos curtos) para o personagem "${characterName}" (${role}) com base nas seguintes escolhas oficiais de Lifepath:
- Origem Cultural: ${lifepath.culturalOrigin || 'Night City'}
- Estilo & Penteado: ${lifepath.clothingStyle || 'Casual'} com ${lifepath.hairstyle || 'Curto'}
- Personalidade & Postura: ${lifepath.personality || 'Frio'}
- Origem Familiar & Crise: ${lifepath.familyBackground || 'Rua'} | ${lifepath.familyCrisis || 'Perda total'}
- Ambiente de Infância: ${lifepath.childhoodEnvironment || 'Subsolo'}
- Valores & Pessoa Importante: ${lifepath.valueMost || 'Liberdade'} | ${lifepath.valuedPerson || 'Mentor'}
- Posse Estimada: ${lifepath.valuedPossession || 'Arma herdada'}
- Caso de Amor Trágico: ${lifepath.tragicLoveAffair || 'Traição'}
- Arqui-Inimigo (Nemesis): ${lifepath.nemesis || 'Corporativo rival'}
- Objetivo de Vida Supremo: ${lifepath.lifeGoals || 'Lenda do Afterlife'}

Retorne exclusivamente o texto da biografia formatado em Markdown com parágrafos fluidos, tom noir visceral, gírias do universo (eddies, choomba, cromo) e pronto para ser usado na mesa de RPG.`;

  const aiReply = await callGeminiAPI({ prompt, isJson: false, apiKey });
  if (aiReply) return aiReply;

  // Fallback rico
  return `Nasci sob o céu cinzento e tempestuoso de ${lifepath.culturalOrigin || 'Night City'}. Minha infância foi forjada em ${lifepath.childhoodEnvironment || 'ruas violentas e becos escuros'}, onde aprendi desde cedo que ${lifepath.personality || 'apenas os mais rápidos sobrevivem'}. Minha família enfrentou um golpe devastador quando ${lifepath.familyCrisis || 'perdemos tudo para o moedor de carne corporativo'}.\n\nHoje ganho a vida como ${role || 'Edgerunner'}. O que mais valorizo acima de qualquer eddie é ${lifepath.valueMost || 'minha honra e liberdade'}. Carrego sempre comigo ${lifepath.valuedPossession || 'minha arma de estimação'}, relíquia que me liga a ${lifepath.valuedPerson || 'quem me ensinou o ofício'}.\n\nMas Night City cobra seu preço em sangue: no passado, ${lifepath.tragicLoveAffair || 'uma tragédia amorosa me deixou cicatrizes incuráveis'}. E para piorar, ${lifepath.nemesis || 'um inimigo mortal'} segue no meu encalço. Mas nada vai me parar até eu ${lifepath.lifeGoals || 'me tornar uma lenda viva do Afterlife'}.`;
}

// 12. END-OF-SESSION REWARD GENERATOR & DEBRIEF (CYBERPUNK RED IP & PROGRESSION)
export async function generateAISessionRewards(options: {
  sessionTitle: string;
  difficultyId: SessionDifficultyId;
  outcomeId: MissionOutcomeId;
  selectedTagIds: string[];
  sessionDescription: string;
  partyMembers: { name: string; role: string }[];
  fixerName?: string;
  apiKey?: string;
}): Promise<SessionRewardResult> {
  const difficulty = SESSION_DIFFICULTY_TIERS[options.difficultyId] || SESSION_DIFFICULTY_TIERS.standard;
  const outcome = MISSION_OUTCOMES[options.outcomeId] || MISSION_OUTCOMES.standard_success;

  const prompt = `Você é o "Cyberpunk Neural Co-GM", árbitro e co-mestre oficial do sistema de RPG Cyberpunk RED (R. Talsorian Games).
Você foi chamado para conduzir o DEBRIEFING E AVALIAÇÃO DE RECOMPENSAS DE FIM DE SESSÃO da mesa.

DIRETRIZES OFICIAIS DE REGRAS (CYBERPUNK RED CORE RULEBOOK págs. 410-412):
1. Pontos de Investimento (IP / Improvement Points) são concedidos por sessão aos jogadores para progressão de fichas.
2. Pagamento do Contrato em Eurodólares (eb / Eddies) por jogador.
3. Reputação (Rep): 0 (discreto), +1 (notícia nas ruas/Data Pool), ou +2 (feito lendário no Afterlife).

DADOS DA SESSÃO FORNECIDOS PELO MESTRE:
- Título: "${options.sessionTitle || 'Operação nas Ruas'}"
- Escopo / Dificuldade Declarada: ${difficulty.name} (${difficulty.baseIP} IP base sugerido)
- Desfecho dos Objetivos: ${outcome.name}
- Contratante / Fixer: ${options.fixerName || 'Fixer local'}
- Personagens Presentes: ${options.partyMembers.map(p => `${p.name} (${p.role})`).join(', ') || 'Equipe de Edgerunners'}
- Tags Marcadas pelo Mestre: ${options.selectedTagIds.join(', ') || 'Nenhuma tag'}
- Relato Detalhado do Mestre: "${options.sessionDescription || 'A equipe enfrentou oposição armada, cumpriu os objetivos e garantiu a extração.'}"

Responda ESTRITAMENTE em formato JSON puro:
{
  "totalIP": 55,
  "ipBreakdown": {
    "base": 40,
    "outcomeMultiplier": 1.0,
    "objectivesBonus": 10,
    "threatBonus": 5,
    "roleplayBonus": 0,
    "tacticsBonus": 0
  },
  "cashEbPerPlayer": 1200,
  "reputationChange": 1,
  "screamsheetHeadline": "MANCHETE EM CAIXA ALTA ESTILO SCREAMSHEET DE NIGHT CITY",
  "screamsheetArticle": "Parágrafo curto de 3 a 5 linhas como notícia pública publicada no CitiNet/Data Pool.",
  "specialLoot": [
    {
      "id": "loot-ai-1",
      "name": "Nome do item ou favor conquistado",
      "category": "Cromo/Cyberware",
      "valueEb": 750,
      "description": "Breve descrição lore do item resgatado.",
      "mechanicalEffect": "Efeito mecânico claro para jogo."
    }
  ],
  "mvpHighlights": [
    "Destaque tático ou interpretativo 1",
    "Destaque tático ou interpretativo 2"
  ],
  "nextSessionHooks": [
    "Gancho dramático 1 para a próxima sessão",
    "Gancho dramático 2 para a próxima sessão",
    "Gancho dramático 3 para a próxima sessão"
  ],
  "coGMVerdict": "Análise analítica e motivacional do Co-GM para o Mestre e jogadores justificando o IP e orientando a evolução das fichas."
}`;

  const parsed = await callGeminiJSON<any>(prompt, { apiKey: options.apiKey });
  if (parsed) {
    const partyCount = Math.max(1, options.partyMembers.length || 4);
    return {
      sessionTitle: options.sessionTitle,
      difficulty,
      outcome,
      totalIP: Number(parsed.totalIP) || 45,
      ipBreakdown: parsed.ipBreakdown || {
        base: difficulty.baseIP,
        outcomeMultiplier: outcome.multiplierIP,
        objectivesBonus: 10,
        threatBonus: 5,
        roleplayBonus: 5,
        tacticsBonus: 5,
      },
      cashEbPerPlayer: Number(parsed.cashEbPerPlayer) || difficulty.baseEb,
      totalGroupCashEb: (Number(parsed.cashEbPerPlayer) || difficulty.baseEb) * partyCount,
      reputationChange: Number(parsed.reputationChange) || 0,
      screamsheetHeadline: parsed.screamsheetHeadline || 'NOTÍCIA LOCAL: TIROTEIO EM NIGHT CITY',
      screamsheetArticle: parsed.screamsheetArticle || 'Operação relatada no Data Pool.',
      specialLoot: parsed.specialLoot?.length ? parsed.specialLoot : [SPECIAL_SALVAGE_POOL[0]],
      mvpHighlights: parsed.mvpHighlights || ['Atuação sólida em combate e cumprimento de contrato.'],
      nextSessionHooks: parsed.nextSessionHooks || ['Contratante cobra explicações sobre os custos da operação.'],
      coGMVerdict: parsed.coGMVerdict || 'Excelente progresso operacional nas ruas.',
      isAiGenerated: true,
    };
  }

  // Fallback seguro usando motor offline
  const fallback = calculateSessionRewardsOffline({
    sessionTitle: options.sessionTitle,
    difficultyId: options.difficultyId,
    outcomeId: options.outcomeId,
    selectedTagIds: options.selectedTagIds,
    partyMemberCount: options.partyMembers.length || 4,
    fixerName: options.fixerName,
  });
  return {
    ...fallback,
    isAiGenerated: false,
  };
}

// 13. GERADOR NARRATIVO DE NPCS COM IA (DANGER GAL DOSSIER & COREBOOK)
export async function generateAINarrativeNPC(options: {
  tier: NPCTier;
  archetypeId: NarrativeArchetypeId;
  factionCategory: 'gangs' | 'corps' | 'trauma' | 'police' | 'nomads' | 'independent';
  subfactionId?: string;
  system: GameSystem;
  extraContext?: string;
  apiKey?: string;
}): Promise<NPCSheet> {
  const baseNPC = generateNarrativeNPCOffline(options);

  const prompt = `Você é o "Cyberpunk Neural Co-GM", gerador oficial de NPCs com profundidade narrativa para Cyberpunk RED (Core Rulebook e Danger Gal Dossier).
Crie um NPC marcante com foco em NARRATIVA, MOTIVAÇÕES, FRAQUEZAS E DIÁLOGOS NOIR.
IMPORTANTE: Crie um personagem totalmente NOVO, único e memorável.

PARÂMETROS:
- Escalão (Tier): ${options.tier.toUpperCase()}
- Arquétipo Narrativo: ${options.archetypeId}
- Facção: ${baseNPC.faction}
- Sistema: ${options.system}
- Contexto da Cena: ${options.extraContext || 'Encontro nas ruas de Night City'}

Retorne ESTRITAMENTE em formato JSON puro:
{
  "name": "Nome e 'Alcunha' Sobrenome",
  "role": "Papel específico de rua",
  "appearance": "Descrição visual de 2 a 3 linhas (roupas, cromo visível, cicatrizes, estilo)",
  "quirks": "Maneirismos, cacoetes ou tiques nervosos",
  "motivation": "O que quer imediatamente da equipe ou na cena (Objetivo pessoal urgente)",
  "weaknessOrSecret": "Segredo sujo, vício, dívida impagável ou ponto fraco que pode ser explorado",
  "dialogueHook": "Uma frase de impacto em primeira pessoa para o Mestre falar em cena",
  "surrenderTrigger": "Condição exata sob a qual foge, se rende ou tenta negociar a própria vida",
  "tactics": "Diretriz tática em combate",
  "pocketLoot": [
    "Item pessoal narrativo 1",
    "Item pessoal narrativo 2",
    "Item pessoal narrativo 3"
  ]
}`;

  const parsed = await callGeminiJSON<any>(prompt, { apiKey: options.apiKey });
  if (parsed) {
    return {
      ...baseNPC,
      name: parsed.name || baseNPC.name,
      role: parsed.role || baseNPC.role,
      appearance: parsed.appearance || baseNPC.appearance,
      description: `${parsed.appearance || baseNPC.appearance} Conhecido como "${parsed.name || baseNPC.name}".`,
      quirks: parsed.quirks || baseNPC.quirks,
      motivation: parsed.motivation || baseNPC.motivation,
      weaknessOrSecret: parsed.weaknessOrSecret || baseNPC.weaknessOrSecret,
      dialogueHook: parsed.dialogueHook || baseNPC.dialogueHook,
      surrenderTrigger: parsed.surrenderTrigger || baseNPC.surrenderTrigger,
      tactics: `${parsed.tactics || baseNPC.tactics} ${parsed.surrenderTrigger || baseNPC.surrenderTrigger}`,
      pocketLoot: parsed.pocketLoot?.length ? parsed.pocketLoot : baseNPC.pocketLoot,
      gear: parsed.pocketLoot?.length ? parsed.pocketLoot : baseNPC.gear,
    };
  }

  return baseNPC;
}

// 14. GERADOR DEDICADO DE PETS & BIOCRIATURAS COM IA (CYBERPUNK RED)
export async function generateAIPet(options: {
  natureId: PetNatureId;
  sizeId: PetSizeId;
  trainingId: PetTrainingId;
  ownerFaction?: string;
  system: GameSystem;
  extraContext?: string;
  apiKey?: string;
}): Promise<NPCSheet> {
  const basePet = generatePetOffline(options);

  const prompt = `Você é o "Cyberpunk Neural Co-GM", gerador de animais cibernéticos e biocriaturas para Cyberpunk RED (p. 317 Animals & Interface RED Vol. 2 Pet Shop).
Crie um Pet / Animal Cibernético único e cinematográfico.

PARÂMETROS:
- Natureza: ${options.natureId}
- Porte: ${options.sizeId}
- Adestramento: ${options.trainingId}
- Dono / Facção: ${options.ownerFaction || 'NCPD ou Mercenários'}
- Contexto: ${options.extraContext || 'Animal de guarda ou companhia em Night City'}

Retorne ESTRITAMENTE em formato JSON puro:
{
  "name": "Nome e (Raça ou Linhagem)",
  "appearance": "Descrição sensorial detalhada da carcaça, pelagem, cromo visível e olhos",
  "quirks": "Comportamento animal peculiar ou cacoete característico",
  "petInstinct": "Instinto dominante e comportamento na presença de estranhos",
  "tactics": "Como ataca ou defende em combate",
  "specialImplants": ["Implante cibernético 1", "Implante 2"],
  "pocketLoot": ["Item preso na coleira ou compartimento secreto"]
}`;

  const parsed = await callGeminiJSON<any>(prompt, { apiKey: options.apiKey });
  if (parsed) {
    return {
      ...basePet,
      name: parsed.name || basePet.name,
      appearance: parsed.appearance || basePet.appearance,
      description: `${parsed.appearance || basePet.appearance} Pertencente a ${options.ownerFaction || 'Submundo'}.`,
      quirks: parsed.quirks || basePet.quirks,
      petInstinct: parsed.petInstinct || basePet.petInstinct,
      tactics: `${parsed.tactics || basePet.tactics}`,
      cyberware: parsed.specialImplants?.length ? parsed.specialImplants : basePet.cyberware,
      pocketLoot: parsed.pocketLoot?.length ? parsed.pocketLoot : basePet.pocketLoot,
    };
  }

  return basePet;
}

// 15. LEITURA DE TAROT COM IA (MISTY'S ESOTERICA & CYBERPUNK 2077)
export async function generateAITarotReading(options: {
  spreadTitle: string;
  cards: { name: string; number: string; position: string; isReversed: boolean; upright: string; reversed: string }[];
  campaignContext?: string;
  characterName?: string;
  apiKey?: string;
}): Promise<{
  cardsNarrative: { position: string; cardName: string; interpretation: string }[];
  overallInterpretation: string;
  coGMPlotTwist: string;
  mistyClosingWords: string;
}> {
  const cardListStr = options.cards
    .map(c => `- Posição [${c.position}]: ${c.number} - ${c.name} (${c.isReversed ? 'INVERTIDA / Sombra' : 'DIRETA / Luz'}) -> Significado Base: ${c.isReversed ? c.reversed : c.upright}`)
    .join('\n');

  const prompt = `Você é Misty Ollaszewski, a esotérica e cartomante mais respeitada de Night City (Cyberpunk 2077), atuando como Co-Mestre oracular de RPG.
Você está realizando uma leitura mística de cartas de Tarot para ${options.characterName ? `o mercenário ${options.characterName}` : 'a equipe de Edgerunners'}.

TIRAGEM REALIZADA: "${options.spreadTitle}"
CARTAS PUXADAS DO BARALHO DE NIGHT CITY:
${cardListStr}

CONTEXTO DA MESA/CAMPANHA:
${options.campaignContext || 'Sessão mercenária no submundo de Night City'}

Retorne ESTRITAMENTE em formato JSON puro:
{
  "cardsNarrative": [
    {
      "position": "Nome da posição",
      "cardName": "Nome da carta",
      "interpretation": "Interpretação poética e visceral de Misty sobre como essa carta afeta a vida do personagem na cena."
    }
  ],
  "overallInterpretation": "Síntese geral da tiragem (2 parágrafos no tom noir espiritual de Misty, com incenso, gírias do universo e pressentimento sombrio).",
  "coGMPlotTwist": "Uma sugestão concreta de reviravolta dramática para o Mestre de RPG introduzir na aventura baseada no arcano dominante.",
  "mistyClosingWords": "Uma frase final de despedida comovente de Misty avisando o personagem sobre os perigos da cidade."
}`;

  const parsed = await callGeminiJSON<any>(prompt, { apiKey: options.apiKey });
  if (parsed && parsed.cardsNarrative?.length) {
    return parsed;
  }

  // Fallback offline dinâmico construído a partir das cartas reais puxadas
  const cardNames = options.cards.map(c => c.name).join(' e ');
  return {
    cardsNarrative: options.cards.map(c => ({
      position: c.position,
      cardName: `${c.number} - ${c.name} (${c.isReversed ? 'Invertida' : 'Direta'})`,
      interpretation: c.isReversed
        ? `Na sombra desta posição, ${c.name} alerta: ${c.reversed}. Cuidado com a pressa e falsas promessas.`
        : `Nesta posição luminosa, ${c.name} ilumina o caminho: ${c.upright}. Confie nos seus instintos mas mantenha a arma engatilhada.`,
    })),
    overallInterpretation: `As cartas de Night City sussurram entre as brumas de incenso. A presença marcante de ${cardNames} revela que os fios do destino estão sob tensão máxima nos distritos escuros da cidade. Não há coincidências no ciberespaço nem nas ruas: cada contrato aceito cobra um pedaço da sua humanidade.`,
    coGMPlotTwist: `Uma reviravolta dramática ligada à carta ${options.cards[0]?.name || 'dominante'}: o patrocinador da missão oculta um vínculo sanguíneo ou corporativo direto com o alvo do trabalho.`,
    mistyClosingWords: '"As cartas mostram o que pode ser, choomba, não o que tem que ser. Mantenha os olhos bem abertos lá fora."',
  };
}

// 16. FORJA DE VEÍCULOS CUSTOMIZADOS COM IA
export async function generateAICustomVehicleDetailed(options?: {
  type?: string;
  clanOrVibe?: string;
  prompt?: string;
  apiKey?: string;
}): Promise<HomebrewVehicle> {
  const proceduralFallback = generateProceduralVehicle({
    type: options?.type,
    clanOrVibe: options?.clanOrVibe,
  });

  const prompt = `Você é o "Cyberpunk Neural Co-GM", especialista nas regras oficiais de Veículos e Modificações Nômades de Cyberpunk RED (pp. 322-325 e Black Chrome).
Crie um veículo customizado, visceral, detalhado e único para o universo Cyberpunk.

PARÂMETROS:
- Categoria / Chassi: ${options?.type || 'Qualquer tipo de veículo'}
- Clã Nômade / Estilo: ${options?.clanOrVibe || 'Nômades dos Badlands ou Corredores de Rua'}
- Instruções adicionais do Mestre: ${options?.prompt || 'Nenhuma'}

Retorne ESTRITAMENTE em formato JSON puro:
{
  "name": "Nome e 'Alcunha' do Veículo",
  "model": "Marca e Modelo (ex: Quadra Type-66 'Javelina' ou Thorton Mackinaw 'Beast')",
  "manufacturer": "Fabricante (Quadra, Thorton, Archer, Rayfield, Chevillon, Mizutani, Brennan, Yaiba, Kaukaz, Villefort ou Militech)",
  "type": "Motocicleta | Carro Compacto | Carro Esportivo de Luxo | Picape / Van | Caminhão Pesado / Blindado | Aerodino AV / Aeronave | Barco / Aquático",
  "clanOrOrigin": "Clã ou Facção de Origem",
  "sdp": 75,
  "armorBodySP": 13,
  "armorGlassSP": 10,
  "seats": 4,
  "cargoCapacityKg": 500,
  "speedMph": 120,
  "combatMove": 24,
  "handlingDV": 13,
  "engineAndFuel": "Descrição do motor e combustível (ex: V8 CHOOH2 Biturbo com nitro)",
  "costEb": "35.000eb",
  "weaponsMounted": [
    {
      "name": "Nome da arma montada",
      "damage": "5d6",
      "rof": 1,
      "mountType": "Torreta Remota de Teto ou Grelha Frontal Oculta"
    }
  ],
  "installedNomadMods": [
    "Blindagem Reforçada (+5 SDP, +2 SP)",
    "Pneus Antifuro de Composto Térmico",
    "Jammer de Frequências e Rastreadores"
  ],
  "visualAesthetic": "Descrição visual rica da pintura, soldas, blindagem, neons e estilo",
  "quirk": "Peculiaridade mecânica ou cacoete do veículo",
  "notes": "Histórico do veículo ou quem foi seu dono anterior"
}`;

  const parsed = await callGeminiJSON<any>(prompt, { apiKey: options?.apiKey });
  if (parsed && parsed.name) {
    return {
      id: `hb-veh-ai-${Date.now()}`,
      name: parsed.name,
      model: parsed.model || proceduralFallback.model,
      manufacturer: parsed.manufacturer || proceduralFallback.manufacturer,
      type: parsed.type || proceduralFallback.type,
      clanOrOrigin: parsed.clanOrOrigin || proceduralFallback.clanOrOrigin,
      sdp: Number(parsed.sdp) || proceduralFallback.sdp,
      armorBodySP: Number(parsed.armorBodySP) || proceduralFallback.armorBodySP,
      armorGlassSP: Number(parsed.armorGlassSP) || proceduralFallback.armorGlassSP,
      seats: Number(parsed.seats) || proceduralFallback.seats,
      cargoCapacityKg: Number(parsed.cargoCapacityKg) || proceduralFallback.cargoCapacityKg,
      speedMph: Number(parsed.speedMph) || proceduralFallback.speedMph,
      combatMove: Number(parsed.combatMove) || proceduralFallback.combatMove,
      handlingDV: Number(parsed.handlingDV) || proceduralFallback.handlingDV,
      engineAndFuel: parsed.engineAndFuel || proceduralFallback.engineAndFuel,
      costEb: parsed.costEb || proceduralFallback.costEb,
      weaponsMounted: parsed.weaponsMounted || proceduralFallback.weaponsMounted,
      installedNomadMods: parsed.installedNomadMods || proceduralFallback.installedNomadMods,
      visualAesthetic: parsed.visualAesthetic || proceduralFallback.visualAesthetic,
      quirk: parsed.quirk || proceduralFallback.quirk,
      notes: parsed.notes || proceduralFallback.notes,
      author: 'Forja IA (Gemini Flash)',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      isAiGenerated: true,
    };
  }

  return proceduralFallback;
}

// 17. FORJA DE ARMAS CUSTOMIZADAS COM IA
export async function generateAICustomWeaponDetailed(options?: {
  category?: string;
  manufacturer?: string;
  quality?: string;
  prompt?: string;
  apiKey?: string;
}): Promise<HomebrewWeapon> {
  const proceduralFallback = generateProceduralWeapon({
    category: options?.category,
    manufacturer: options?.manufacturer,
    quality: options?.quality,
  });

  const prompt = `Você é o "Cyberpunk Neural Co-GM", especialista no arsenal bélico oficial de Cyberpunk RED e Cyberpunk 2020.
Crie uma arma de fogo ou arma branca customizada, icônica, detalhada e balanceada para o sistema.

PARÂMETROS:
- Categoria: ${options?.category || 'Qualquer tipo de arma'}
- Fabricante: ${options?.manufacturer || 'Arasaka, Militech, Malorian, Tsunami, Rostović ou Kendachi'}
- Nível de Qualidade: ${options?.quality || 'Padrão ou Excelente'}
- Instruções adicionais: ${options?.prompt || 'Nenhuma'}

Retorne ESTRITAMENTE em formato JSON puro:
{
  "name": "Nome e Alcunha da Arma",
  "category": "Pistola Pesada | Pistola Muito Pesada | Submetralhadora | Fuzil de Assalto | Fuzil de Sniper | Espingarda Tática | Arma Branca Muito Pesada",
  "damage": "Dano oficial (ex: 3d6, 4d6, 5d6)",
  "rof": 1,
  "shots": 8,
  "cost": "1.000eb (Qualidade Excelente)",
  "concealment": "Ocultável em Jaqueta (J) | Sob Sobretudo (L) | Não Ocultável (N)",
  "reliability": "Pobre | Padrão | Muito Boa (MB) | Excelente (EX)",
  "specialEffect": "Efeito especial ou mecânica única no combate",
  "notes": "Detalhes de calibre, acessórios instalados, estética visual e peculiaridade",
  "attachments": ["Acessório 1", "Acessório 2"],
  "visualAesthetic": "Descrição visual do acabamento, carcaça e LEDs",
  "quirk": "Peculiaridade ou cacoete da arma"
}`;

  const parsed = await callGeminiJSON<any>(prompt, { apiKey: options?.apiKey });
  if (parsed && parsed.name) {
    const notesCombined = `${parsed.notes || ''} Calibre: ${parsed.ammo || 'Padrão'}. Acessórios: ${parsed.attachments ? parsed.attachments.join(', ') : 'Padrão'}. Estética: ${parsed.visualAesthetic || ''}. Peculiaridade: ${parsed.quirk || ''}`.trim();
    return {
      id: `hb-w-ai-${Date.now()}`,
      name: parsed.name,
      category: parsed.category || proceduralFallback.category,
      damage: parsed.damage || proceduralFallback.damage,
      rof: Number(parsed.rof) || proceduralFallback.rof,
      cost: parsed.cost || proceduralFallback.cost,
      shots: Number(parsed.shots) || proceduralFallback.shots,
      concealment: parsed.concealment || proceduralFallback.concealment,
      reliability: parsed.reliability || proceduralFallback.reliability,
      specialEffect: parsed.specialEffect || proceduralFallback.specialEffect,
      notes: notesCombined || proceduralFallback.notes,
      author: 'Forja IA (Gemini Flash)',
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };
  }

  return proceduralFallback;
}

// 18. FORJA DE IMPLANTES & CIBERNÉTICOS COM IA
export async function generateAICustomCyberwareDetailed(options?: {
  type?: string;
  manufacturer?: string;
  prompt?: string;
  apiKey?: string;
}): Promise<HomebrewCyberware> {
  const proceduralFallback = generateProceduralCyberware({
    type: options?.type,
    manufacturer: options?.manufacturer,
  });

  const prompt = `Você é o "Cyberpunk Neural Co-GM", cirurgião e especialista no sistema oficial de Ciberware de Cyberpunk RED (pp. 356-368 e Black Chrome).
Crie um implante cibernético inovador, balanceado e visceral.

PARÂMETROS:
- Categoria de Cromo: ${options?.type || 'Neural, Óptico, Auditivo, Membros, Corporal ou Borgware'}
- Fabricante: ${options?.manufacturer || 'Kiroshi, Dynalar, Zetatech, Raven, Biotechnica, Arasaka ou Militech'}
- Instruções adicionais: ${options?.prompt || 'Nenhuma'}

Retorne ESTRITAMENTE em formato JSON puro:
{
  "name": "Nome e Linha de Modelo do Implante",
  "type": "Neural | Óptico | Auditivo | Membros | Corporal | Borgware",
  "humanityLoss": "Perda de Humanidade (ex: 2d6 (7) ou 3d6 (10))",
  "cost": "1.000eb",
  "install": "Mall | Clínica | Hospital",
  "description": "Descrição sensorial de funcionamento e lore da peça",
  "mechanicalBonus": "Bônus mecânico exato e regras de uso na ficha",
  "visualFinish": "Acabamento visual do implante no corpo",
  "sideEffectOrGlitch": "Peculiaridade, glitch ou efeito colateral sutil"
}`;

  const parsed = await callGeminiJSON<any>(prompt, { apiKey: options?.apiKey });
  if (parsed && parsed.name) {
    const fullDesc = `${parsed.description || ''} Acabamento: ${parsed.visualFinish || 'Padrão'}. Glitch: ${parsed.sideEffectOrGlitch || 'Nenhum'}`.trim();
    return {
      id: `hb-c-ai-${Date.now()}`,
      name: parsed.name,
      type: parsed.type || proceduralFallback.type,
      humanityLoss: parsed.humanityLoss || proceduralFallback.humanityLoss,
      cost: parsed.cost || proceduralFallback.cost,
      install: parsed.install || proceduralFallback.install,
      description: fullDesc || proceduralFallback.description,
      mechanicalBonus: parsed.mechanicalBonus || proceduralFallback.mechanicalBonus,
      author: 'Forja IA (Gemini Flash)',
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };
  }

  return proceduralFallback;
}

// 19. FORJA DE DROGAS, QUÍMICOS E EQUIPAMENTOS ESPECIAIS COM IA
export async function generateAICustomGearOrDrugDetailed(options?: {
  category?: string;
  prompt?: string;
  apiKey?: string;
}): Promise<HomebrewGearOrDrug> {
  const proceduralFallback = generateProceduralGearOrDrug({
    category: options?.category,
  });

  const prompt = `Você é o "Cyberpunk Neural Co-GM", químico de rua e mestre em equipamentos e drogas de combate de Cyberpunk RED.
Crie um item de rua, químico/droga sintética ou equipamento tático customizado para o universo Cyberpunk.

PARÂMETROS:
- Categoria: ${options?.category || 'Droga de Rua / Químico de Combate ou Equipamento Especial'}
- Instruções adicionais: ${options?.prompt || 'Nenhuma'}

Retorne ESTRITAMENTE em formato JSON puro:
{
  "name": "Nome do item ou químico",
  "slang": "Gíria de rua",
  "category": "Droga de Rua / Químico de Combate | Cyberdeck Customizado | Blindagem / Traje Tático | Equipamento Especial",
  "costEb": "50eb / dose ou 500eb",
  "deliveryMethodOrInterface": "Método de uso (inalador, ampola, conector neural, colete)",
  "primaryEffect": "Bônus mecânico principal ou efeito de combate",
  "secondaryOrCrashEffect": "Crash, ressaca ou efeito colateral",
  "addictionDV": 13,
  "duration": "Duração do efeito",
  "visualAesthetic": "Descrição visual do frasco, cápsula ou equipamento",
  "notes": "Histórico ou dica de uso"
}`;

  const parsed = await callGeminiJSON<any>(prompt, { apiKey: options?.apiKey });
  if (parsed && parsed.name) {
    return {
      id: `hb-g-ai-${Date.now()}`,
      name: parsed.name,
      slang: parsed.slang || proceduralFallback.slang,
      category: parsed.category || proceduralFallback.category,
      costEb: parsed.costEb || proceduralFallback.costEb,
      deliveryMethodOrInterface: parsed.deliveryMethodOrInterface || proceduralFallback.deliveryMethodOrInterface,
      primaryEffect: parsed.primaryEffect || proceduralFallback.primaryEffect,
      secondaryOrCrashEffect: parsed.secondaryOrCrashEffect || proceduralFallback.secondaryOrCrashEffect,
      addictionDV: Number(parsed.addictionDV) || proceduralFallback.addictionDV,
      duration: parsed.duration || proceduralFallback.duration,
      visualAesthetic: parsed.visualAesthetic || proceduralFallback.visualAesthetic,
      notes: parsed.notes || proceduralFallback.notes,
      author: 'Forja IA (Gemini Flash)',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      isAiGenerated: true,
    };
  }

  return proceduralFallback;
}
