import { RULES_CODEX_DATABASE } from '../data/rulesCodexData';
import { GANGS_LIST } from '../data/gangsData';
import { strangeWeatherTable } from '../data/weatherData';
import { NightMarket } from '../data/nightMarketData';

export const DEFAULT_USER_API_KEY = '';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  isRuleCitation?: boolean;
}

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

export async function askCyberpunkAI(
  prompt: string,
  apiKey: string | null,
  campaignContext?: string
): Promise<string> {
  const activeKey = getEffectiveApiKey(apiKey);

  if (activeKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`;
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

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\nPergunta do Mestre/Jogador: ${prompt}` }],
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) return reply;
      } else {
        console.warn(`Gemini API returned status ${response.status}, falling back to built-in oracle.`);
      }
    } catch (err: any) {
      console.warn('Fallback to Offline Oracle due to API error:', err.message);
    }
  }

  // BUILT-IN OFFLINE CYBERPUNK ORACLE ENGINE
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
    const clients = ['Executivo traído da Petrochem', 'Fixer respeitado do Afterlife', 'Padre Ibarra de Heywood', 'Médico clandestino em fuga'];
    const targets = ['resgatar um contêiner de chips neurais blindados', 'extrair um cientista da Biotechnica antes da execução', 'eliminar um líder de célula do Maelstrom com Sandevistan', 'recuperar um carro esporte carregado de armas nos Badlands'];
    const client = clients[Math.floor(Math.random() * clients.length)];
    const target = targets[Math.floor(Math.random() * targets.length)];
    const payout = Math.floor(Math.random() * 3 + 1) * 500 + 500;

    return `💼 **Proposta de Trabalho da Rede Clandestina:**\n\n**Contratante:** ${client}\n**Objetivo Principal:** ${target}\n**Pagamento Estimado:** ${payout}eb por Edgerunner no ato da entrega.\n**Complicação:** O local foi isolado por uma tempestade de cinzas ácida ou há uma equipe rival de Solos monitorando o mesmo perímetro.\n\n*O que a equipe faz primeiro: reconhecimento furtivo ou chute na porta?*`;
  }

  return `🤖 **Transmissão Neural Co-GM:**\n\n"Em Night City, ninguém sai ileso se hesitar por mais de um segundo. Analisei a sua solicitação:\n\n*Para resolver isso em jogo:* determine o Atributo relevante + Perícia do personagem + rolagem de 1d10 explodindo vs DV da tarefa. Se estiver em combate, lembre-se que alvos com REF 8+ podem esquivar de disparos com a perícia Esquiva (Evasion).\n\nQuer que eu gere um encontro surpresa, interprete um ferimento crítico ou calcule as defesas de uma fortaleza de dados agora?"`;
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
  const activeKey = getEffectiveApiKey(apiKey);
  const prompt = `Crie um encontro urbano dinâmico e cinematográfico para Cyberpunk RED no distrito de ${districtName} durante o horário: ${timeOfDay}.
Retorne no formato JSON com os seguintes campos:
{
  "title": "título curto e chamativo",
  "actors": "quem está presente no encontro",
  "sceneDescription": "descrição sensorial viva (sons, cheiros, iluminação neon, clima)",
  "tacticalObstacle": "o obstáculo tático ou combate imediato",
  "mechanicsAndDVs": "testes mecânicos sugeridos com DVs exatos (ex: DV 13 Percepção, DV 15 Furtividade)",
  "twist": "uma reviravolta ou complicação dramática imprevista"
}`;

  if (activeKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return JSON.parse(text);
      }
    } catch (e) {
      console.warn('AI Encounter fallback:', e);
    }
  }

  return {
    title: `Emboscada de Becos em ${districtName}`,
    actors: `3 Gangers armados e um Doutor Clandestino ferido`,
    sceneDescription: `Chuva ácida estalando no asfalto quente. Neons piscando em azul e amarelo sobre latões de lixo em chamas. O ar cheira a óleo de CHOOH2 queimado e comida sintética estragada.`,
    tacticalObstacle: `Dois capangas montaram barricada atrás de um sedã acidentado munidos de espingardas pesadas (dano 5d6). O terceiro tenta arrombar a trava magnética da porta dos fundos.`,
    mechanicsAndDVs: `Teste de Percepção DV 13 para notar a mira laser no escuro; Teste de Atletismo DV 15 para saltar por cima do carro sem tomar fogo de supressão.`,
    twist: `O médico não é refém: ele roubou uma maleta de órgãos criogênicos da Trauma Team com rastreador GPS ativo que soará em 3 rodadas!`,
  };
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
}> {
  const activeKey = getEffectiveApiKey(apiKey);
  const prompt = `Crie uma notícia de jornal / Screamsheet completa para Cyberpunk RED sobre o tópico: "${topic}".
Retorne em JSON:
{
  "network": "Canal 54 News / World News Service / Night City Inquirer",
  "headline": "Manchete impactante sensacionalista em caixa alta",
  "article": "Artigo jornalístico de 2 a 3 parágrafos narrando o fato com viés corporativo ou de rua",
  "hiddenGig": "O gancho de missão secreto que um Fixer esperto extrai desta notícia",
  "payout": "valor de pagamento sugerido em eb por Edgerunner"
}`;

  if (activeKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return JSON.parse(text);
      }
    } catch (e) {
      console.warn('AI Screamsheet fallback:', e);
    }
  }

  return {
    network: 'World News Service (WNS)',
    headline: 'EXPLOSÃO EM DUTO DA PETROCHEM INTERROMPE DISTRIBUIÇÃO EM ARROYO',
    article: 'Na madrugada desta terça-feira, uma detonação de alta potência comprometeu uma das linhas de transferência de CHOOH2 da Petrochem no distrito industrial de Arroyo. Representantes corporativos culpam sabotadores ecoterroristas, enquanto o DPNC declarou toque de recolher em cinco quarteirões ao redor da refinaria.',
    hiddenGig: 'Um Fixer rival quer que a equipe entre no perímetro interditado antes dos peritos da Arasaka para extrair o disco rígido da câmera de segurança que gravou os reais executores.',
    payout: '1.800eb por mercenário + 3 doses de drogas sintéticas',
  };
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
  const activeKey = getEffectiveApiKey(apiKey);
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

  if (activeKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return JSON.parse(text);
      }
    } catch (e) {
      console.warn('AI Beat Chart fallback:', e);
    }
  }

  return {
    hook: {
      title: '1. O Gancho: Chamada Clandestina no Pós-Vida',
      narrative: `Um Fixer veterano chama a equipe para uma cabine privada no Afterlife às 2h da madrugada. A proposta: invadir um armazém periférico da Petrochem em Heywood antes do amanhecer para recuperar um contêiner lacrado com protótipos de células de combustível de lítio-grafeno.`,
      mechanicalAction: `Oferta de 2.000eb por personagem. Teste de Human Perception DV 14 revela que o Fixer está nervoso e com uma dívida pesada para pagar até as 6h da manhã.`,
    },
    development: {
      title: '2. Desenvolvimento: Reconhecimento e Infiltração',
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
  const activeKey = getEffectiveApiKey(apiKey);
  const prompt = `Crie elementos imediatos de improvisação de cena para Cyberpunk RED.
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

  if (activeKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return JSON.parse(text);
      }
    } catch (e) {
      console.warn('AI Scene Improv fallback:', e);
    }
  }

  return {
    sensorySights: `Fios elétricos soltos faiscando no teto de zinco molhado; luz estroboscópica de um holograma de refrigerante quebrado piscando em magenta sobre poças de água oleosa.`,
    sensorySounds: `Gotejar rítmico de água contaminada; batidas graves de funk-techno vazando da porta de um clube a meio quarteirão; chiado de rádio da polícia captado por frequências abertas.`,
    sensorySmells: `Cheiro penetrante de ozônio sintético misturado com fumaça de carne de soja queimada em uma barraquinha de rua.`,
    instantNPC: {
      name: `Rico "Faísca" Navarro`,
      role: `Técnico de Cromo Clandestino`,
      visualAppearance: `Jaqueta tática com manchas de graxa de motor, três lentes de aumento ópticas presas com fita isolante no olho esquerdo e dedos mecânicos que tremem quando não estão segurando um ferro de solda.`,
      motivation: `Tentando recuperar uma mala de chips de interface roubada antes que seu chefe descubra.`,
      dialogueHook: `"Vocês aí com cara de mercenários... me dêem dois minutos de cobertura e eu divido metade do cromo com vocês!"`,
    },
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
  const activeKey = getEffectiveApiKey(apiKey);
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

  if (activeKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return JSON.parse(text);
      }
    } catch (e) {
      console.warn('AI Timeskip fallback:', e);
    }
  }

  return {
    summary: `Durante os ${months} meses, a equipe alternou entre bicos menores de escolta e períodos de reclusão em contêineres de carga para não chamar atenção corporativa. O custo de vida consumiu boa parte das reservas.`,
    monthlyEvents: [
      {
        month: 1,
        eventTitle: 'Manutenção de Cromo e Aluguel Atrasado',
        narrative: `O senhorio do prédio em Santo Domingo ameaçou cortar a energia se o aluguel de 1.000eb não fosse pago. O grupo fez pequenos trabalhos de segurança para um mercado noturno local.`,
        mechanicalResult: `Despesa de 1.000eb de aluguel; ganho de 1.200eb em bicos de rua por membro.`,
      },
      {
        month: 2,
        eventTitle: 'Guerra Territorial de Gangues',
        narrative: `Os Tyger Claws tentaram expandir para o quarteirão da equipe. Tiros noturnos forçaram os personagens a barricar janelas com chapas de aço.`,
        mechanicalResult: `Consumo de 50 balas por personagem em tiroteios defensivos. Reputação local mantida.`,
      },
    ],
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
  const activeKey = getEffectiveApiKey(apiKey);
  const prompt = `Crie uma Arquitetura NET completa e detalhada para Cyberpunk RED para o alvo: "${targetOrg}" com nível de dificuldade: "${difficulty}".
Siga as regras de elevador de andares com senhas (DVs), nós de controle (câmeras, maglocks, metralhadoras de teto), arquivos secretos e Black ICE oficial (Hellhound, Raven, Liche, Giant, etc).
Retorne em JSON:
{
  "name": "nome da rede corporativa ou terminal",
  "floorsCount": número de andares (ex: 6 para básica, 9 para padrão, 12 para avançada, 16 para fortaleza),
  "floors": [
    { "floor": 1, "type": "Senha / Arquivo / Controle / Black ICE", "dv": número do DV de interface, "content": "descrição do que há no andar", "notes": "efeito em caso de sucesso" }
  ],
  "blackICEList": [
    { "name": "Hellhound / Killer / etc", "floor": 3, "spd": 6, "hp": 25, "effect": "queima sinapses do netrunner" }
  ],
  "secretDataLoot": "conteúdo dos arquivos confidenciais que podem ser vendidos a Fixers"
}`;

  if (activeKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return JSON.parse(text);
      }
    } catch (e) {
      console.warn('AI Net Architecture fallback:', e);
    }
  }

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
  const activeKey = getEffectiveApiKey(apiKey);
  const prompt = `Crie um veículo customizado para Cyberpunk RED.
Tipo: ${type}
Clã Nômade ou Origem: ${nomadClan}
Retorne em JSON:
{
  "name": "nome apelido carinhoso de rua",
  "type": "${type}",
  "clan": "${nomadClan}",
  "sdp": número de pontos estruturais (35 a 120),
  "seats": número de passageiros,
  "speedMph": velocidade máxima em milhas/hora,
  "costEb": "valor estimado no mercado negro",
  "visualAesthetic": "descrição visual detalhada da pintura, soldas, blindagem e escapamentos",
  "installedNomadMods": ["mod 1", "mod 2", "mod 3"],
  "weaponsMounted": ["arma montada se houver"],
  "quirk": "peculiaridade divertida ou mecânica do carro"
}`;

  if (activeKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return JSON.parse(text);
      }
    } catch (e) {
      console.warn('AI Custom Vehicle fallback:', e);
    }
  }

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
  const activeKey = getEffectiveApiKey(apiKey);
  const prompt = `Crie um bar ou casa noturna memorável para Night City no distrito de ${district} com a estética / clima: ${vibe}.
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
    "cost": "preço em eb (ex: 35eb)",
    "category": "Coquetel Lendário / Destilado Pesado / Energético Cibernético / Elixir Bioquímico / Cerveja de Sarjeta",
    "glassware": "estilo do copo (ex: Copo tumbler pesado com borda de sal)",
    "visualServing": "como é servido, cores, névoa ou efervescência",
    "ingredients": ["ingrediente 1", "ingrediente 2", "ingrediente 3"],
    "tastingNotes": "sensação sensorial detalhada no primeiro gole e queimação",
    "description": "resumo direto dos ingredientes e sabor",
    "inGameEffect": "bônus mecânico exato de regra e duração",
    "sideEffect": "ressaca ou teste de resistência se houver",
    "loreTrivia": "história ou lenda sobre a criação do drink"
  },
  "localRumors": ["rumor 1 com gancho de missão", "rumor 2"]
}`;

  if (activeKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return JSON.parse(text);
      }
    } catch (e) {
      console.warn('AI Bar fallback:', e);
    }
  }

  return {
    name: `The Chrome Siren (A Sereia de Cromo)`,
    district,
    aesthetic: `Subsolo com teto baixo coberto por tubulações cromadas que condensam gotas de água gelada; iluminação fria azul turquesa refletindo em mesas de espelho escuro.`,
    musicStyle: `Synthwave pesado com vocais distorcidos e baixo pulsante a 110 dB.`,
    clientele: `Netrunners de aluguel, batedores de carteira e técnicos de cibernéticos clandestinos.`,
    securityRating: `Média`,
    signatureDrink: {
      name: `Siren's Byte`,
      cost: '40eb',
      category: 'Elixir Bioquímico',
      glassware: 'Copo térmico de policarbonato fosco com LED azul na base',
      visualServing: 'Líquido azul neon com microbolhas efervescentes que brilham sob luz ambiente e soltam aroma de mentol gelado.',
      ingredients: [
        'Vodka sintética 70% com infusão de cafeína pura',
        'Xarope de mirtilo radioativo com taurina',
        'Gotas de eletrólito neuronal efervescente',
      ],
      tastingNotes: 'Gosto gélido de menta e frutas escuras que faz a língua formigar e anestesia levemente os dentes, gerando um surto imediato de clareza cognitiva.',
      description: 'Vodka sintética azul misturada com energético de taurina e cristais efervescentes de cafeína pura.',
      inGameEffect: '+1 em testes de Interface de Netrunning e Cybertech pela próxima 1 hora.',
      sideEffect: 'Insônia e taquicardia leve pelas próximas 6 horas.',
      loreTrivia: 'Criado pelo barman em celebração à invasão da subestação de dados da Ziggurat em 2043.',
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
  const activeKey = getEffectiveApiKey(apiKey);
  const contextDesc = [
    preferences?.district ? `Distrito: ${preferences.district}` : '',
    preferences?.partnerType ? `Tipo de Parceiro(a): ${preferences.partnerType}` : '',
    preferences?.vibe ? `Clima / Estilo: ${preferences.vibe}` : '',
    preferences?.prompt ? `Instruções adicionais: ${preferences.prompt}` : '',
  ].filter(Boolean).join(' | ');

  const prompt = `Você é o Co-Mestre de Cyberpunk RED especialista no DLC oficial "Digital Dating & Datepath" (Garden Patch Dating).
Gere um encontro romântico detalhado e atmosférico para um mercenário de Night City com base nos parâmetros: "${contextDesc || 'Encontro casual no submundo de Night City'}".

Retorne EXCLUSIVAMENTE um objeto JSON válido com a seguinte estrutura:
{
  "partnerName": "Nome completo e apelido de rua entre aspas (ex: Kira \\"Nova\\" Chen ou Rex \\"Chrome\\" Morales)",
  "partnerRole": "Papel do sistema (ex: Solo Freelancer, Netrunner de Aluguel, Executiva Júnior, Médica Clandestina, Rockerboy Rebelde, Nômade das Badlands)",
  "partnerStyle": "Descrição detalhada do visual, roupas de estilo cyberpunk (Kitsch, Neotetro, High Fashion ou Militar), implantes visíveis e postura corporal",
  "keywords": ["#PalavraChave1", "#PalavraChave2", "#PalavraChave3"],
  "locationName": "Nome atmosférico do local do encontro (bar, restaurante subterrâneo, galeria de arcades, mirante de ferro-velho, estande de tiro)",
  "district": "Distrito de Night City (Watson, Westbrook, Heywood, Pacifica, Centro Corporativo, Santo Domingo ou Badlands)",
  "activity": "Atividade do encontro planejada pelo par",
  "complicationTitle": "Título da Complicação inesperada do encontro (ex: Ex-Amante com Sandevistan, Tiroteio de Gangue na Saída, Cartão Clonado Recusado, Invasão da NCPD)",
  "complicationDesc": "Narrativa da complicação que interrompe o date",
  "complicationHook": "Regra mecânica para o Mestre resolver a complicação (teste de perícia com DV, ex: Conversação DV 15 ou Tática DV 13)",
  "conversationStarter": "Frase de abertura ou assunto instigante que o par puxa na mesa",
  "secretAgenda": "Motivação oculta ou segredo do par para este encontro"
}`;

  if (activeKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return { ...parsed, isAi: true };
        }
      }
    } catch (e) {
      console.warn('AI Date fallback:', e);
    }
  }

  return {
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
    isAi: true,
  };
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
  const activeKey = getEffectiveApiKey(apiKey);
  const contextDesc = [
    preferences?.district ? `Distrito: ${preferences.district}` : '',
    preferences?.focusCategory ? `Foco de Mercadorias: ${preferences.focusCategory}` : '',
    preferences?.dangerLevel ? `Nível de Perigo / Segurança: ${preferences.dangerLevel}` : '',
    preferences?.prompt ? `Instruções adicionais: ${preferences.prompt}` : '',
  ].filter(Boolean).join(' | ');

  const prompt = `Você é o Co-Mestre de Cyberpunk RED especialista nas regras oficiais de "Night Markets" (Mercados Noturnos / Mercado Negro, Livro Básico pp. 336-342).
Gere um Mercado Negro clandestino completo, atmosférico e perigoso com base nos parâmetros: "${contextDesc || 'Mercado Negro secreto no submundo de Night City'}".

Retorne EXCLUSIVAMENTE um objeto JSON válido com a seguinte estrutura:
{
  "id": "night-market-ai-${Date.now()}",
  "name": "Nome evocativo do Mercado Noturno (ex: Mercado Negro do Esgoto da Linha F, Bazar Clandestino das Docas 44, Feira de Cromo Roubado de Vista del Rey)",
  "district": "Distrito de Night City (Watson, Westbrook, Heywood, Pacifica, Santo Domingo ou Badlands)",
  "exactLocation": "Localização secreta exata e acesso",
  "operatorFixer": {
    "name": "Nome e apelido do Fixer organizador",
    "reputation": 6,
    "quirk": "Cacoete, postura ou mania do Fixer",
    "securityLevel": "Baixa (Pistolas) ou Média (Solos Armados & Cães K-9) ou Alta (Torres e Snipers nos Telhados)",
    "entryCondition": "Regra para entrar no mercado (convite, senha, pedágio em eb ou revista de armas)"
  },
  "atmosphere": "Descrição sensorial rica (iluminação neon/lâmpadas a óleo, fumaça, cheiro de comida sintética frita, música e tensão armada)",
  "stalls": [
    {
      "vendorName": "Nome do vendedor(a)",
      "vendorTitle": "Título ou especialidade (ex: Armeiro Clandestino, Ripperdoc de Garagem, Químico dos Valentinos)",
      "vendorStyle": "Descrição visual do vendedor e sua banca",
      "vendorPersonality": "Personalidade de negociação e fala",
      "category": "Armas Pesadas | Cromo & Implantes | Cyberdecks & Softwares | Químicos & Drogas | Contrabando Corporativo | Roupas Blindadas",
      "specialService": "Serviço extra no local com custo e perícia (ex: Instalação cirúrgica de implante, lixar números de série de arma, quebrar senha de chip)",
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
    "title": "Complicação imprevista no mercado (ex: Batida da NCPD, Caçador de Recompensas, Item com Rastreador GPS, Briga de Gangues)",
    "description": "O que acontece enquanto os personagens estão negociando",
    "mechanicalHook": "Regra mecânica / teste com DV para o Mestre resolver o evento"
  },
  "bargainTip": "Dica prática de pechincha ou negociação com o Fixer"
}`;

  if (activeKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text);
          return {
            ...parsed,
            id: `night-market-ai-${Date.now()}`,
            isAi: true,
          };
        }
      }
    } catch (e) {
      console.warn('AI Night Market fallback:', e);
    }
  }

  // Fallback se API falhar ou sem chave
  return {
    id: `night-market-fallback-${Date.now()}`,
    name: 'Mercado Negro Clandestino do Subsolo de Kabuki',
    district: preferences?.district || 'Watson (Kabuki)',
    exactLocation: 'Túneis de ventilação sob a praça do mercado central de Kabuki, acesso por escada caracol atrás de um açougue sintético.',
    operatorFixer: {
      name: 'Rico "Centavo" Valente',
      reputation: 6,
      quirk: 'Fuma charutos sintéticos cubanos com ponta dourada e anota débitos em uma placa de ardósia digital.',
      securityLevel: 'Média (Solos Armados & Cães K-9)',
      entryCondition: 'Apresentar 20eb na portaria ou senha fornecida por um Ripperdoc de Watson.',
    },
    atmosphere: 'Vapor quente avermelhado de geradores a CHOOH2, bancas de ferro dobrável iluminadas por tiras de LED neon ciano, aroma acre de solda eletrônica misturado com carne de porco clonada grelhando.',
    stalls: [
      {
        vendorName: 'Klaus "Balaço" Becker',
        vendorTitle: 'Armeiro Militar Veterano',
        vendorStyle: 'Colete tático gasto sem mangas revelando braços cobertos de queimaduras de pólvora e óculos balísticos amarelados.',
        vendorPersonality: 'Direto, sem rodeios. Só aceita eurodólares em espécie ou munição pesada em troca.',
        category: 'Armas Pesadas & Munições Especiais',
        specialService: 'Lixar número de série e trocar agulha de percussão em 15 minutos (40eb).',
        items: [
          {
            name: 'Fuzil de Precisão Sternmeyer Sniping-55',
            category: 'Fuzil de Precisão',
            priceEb: 1100,
            priceLabel: '1.100eb',
            condition: 'Militar Restrito',
            stock: 1,
            description: 'Fuzil antimaterial com luneta holográfica de zoom 12x e bipé retrátil de titânio.',
            mechanicalEffect: 'Dano 5d6, ignora penalidades de distância longa acima de 50 metros se apoiado.',
          },
          {
            name: 'Caixa de Balas Incendiárias 9mm (50 un)',
            category: 'Munição Especial',
            priceEb: 150,
            priceLabel: '150eb',
            condition: 'Novo Lacrado',
            stock: 3,
            description: 'Projéteis com ponta oca preenchida com gel inflamável de fósforo branco.',
            mechanicalEffect: 'Se causar dano ao HP, o alvo pega fogo causando 2 de dano por turno até apagar.',
          },
        ],
      },
      {
        vendorName: 'Doc Haruto "Nervo" Sato',
        vendorTitle: 'Cirurgião Excluído da Arasaka',
        vendorStyle: 'Máscara respiratória cirúrgica com filtros laterais cromados, avental emborrachado e ferramentas ultrassônicas na bancada.',
        vendorPersonality: 'Metódico e frio. Explica os riscos de ciberpsicose com indiferença cirúrgica.',
        category: 'Cromo de Combate & Implantes Ilicitamente Adquiridos',
        specialService: 'Implantação estéril de cromo no furgão médico adjacente (Cirurgia DV 15, 120eb).',
        items: [
          {
            name: 'Linear Frame Beta (Exoesqueleto Interno)',
            category: 'Cibernético Corporal',
            priceEb: 2500,
            priceLabel: '2.500eb',
            condition: 'Militar Restrito',
            stock: 1,
            description: 'Vigas de fibra de titânio aparafusadas na coluna e fêmures, elevando a força física a níveis desumanos.',
            mechanicalEffect: 'Define o atributo BODY em 14. Dano desarmado sobe para 4d6. Exige Interface Neural.',
          },
          {
            name: 'Olho Cibernético Kiroshi com Scanner de Drones',
            category: 'Cibernético Óptico',
            priceEb: 650,
            priceLabel: '650eb',
            condition: 'Usado em Combate',
            stock: 2,
            description: 'Íris carmesim que detecta sinais de radiofrequência e sobrevoo de drones espiões a até 200m.',
            mechanicalEffect: '+2 em Percepção contra vigilância eletrônica e emboscadas aéreas.',
          },
        ],
      },
      {
        vendorName: 'Nyx "Datastream"',
        vendorTitle: 'Techie Clandestina de Hardware',
        vendorStyle: 'Macacão de corrida com fiação exposta, soldador a laser pendurado no coldre e pulseira de leds de diagnóstico.',
        vendorPersonality: 'Hiperativa e apaixonada por peças raras. Adora falar sobre overclocking de processadores.',
        category: 'Cyberdecks, Softwares Proibidos & Gadgets Hackers',
        specialService: 'Overclock de cyberdeck para adicionar +1 slot de memória temporário (80eb).',
        items: [
          {
            name: 'Cyberdeck Arasaka Portátil Militar "Shinigami-3"',
            category: 'Cyberdeck',
            priceEb: 1400,
            priceLabel: '1.400eb',
            condition: 'Pirateado / Modificado',
            stock: 1,
            description: 'Carcaça preta fosca com placa de proteção contra contra-ataques neurais.',
            mechanicalEffect: '8 slots de programas/hardware. Reduz em 2 o dano de Black ICE sofrido pelo Netrunner.',
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
    isAi: true,
  };
}

// 11. Lifepath Backstory Narrative Generator with AI
export async function generateAILifepathBackstory(
  characterName: string,
  role: string,
  lifepath: Record<string, string>,
  apiKey?: string
): Promise<string> {
  const activeKey = getEffectiveApiKey(apiKey);
  if (!activeKey) {
    return `Nasci sob o céu cinzento e tempestuoso de ${lifepath.culturalOrigin || 'Night City'}. Minha infância foi forjada em ${lifepath.childhoodEnvironment || 'ruas violentas e becos escuros'}, onde aprendi desde cedo que ${lifepath.personality || 'apenas os mais rápidos sobrevivem'}. Minha família enfrentou um golpe devastador quando ${lifepath.familyCrisis || 'perdemos tudo para o moedor de carne corporativo'}.\n\nHoje ganho a vida como ${role || 'Edgerunner'}. O que mais valorizo acima de qualquer eddie é ${lifepath.valueMost || 'minha honra e liberdade'}. Carrego sempre comigo ${lifepath.valuedPossession || 'minha arma de estimação'}, relíquia que me liga a ${lifepath.valuedPerson || 'quem me ensinou o ofício'}.\n\nMas Night City cobra seu preço em sangue: no passado, ${lifepath.tragicLoveAffair || 'uma tragédia amorosa me deixou cicatrizes incuráveis'}. E para piorar, ${lifepath.nemesis || 'um inimigo mortal'} segue no meu encalço. Mas nada vai me parar até eu ${lifepath.lifeGoals || 'me tornar uma lenda viva do Afterlife'}.`;
  }

  const prompt = `Você é o Co-Mestre Neural de Cyberpunk RED. Escreva uma crônica narrativa emocionante e visceral em primeira pessoa (3 parágrafos curtos) para o personagem "${characterName}" (${role}) com base nas seguintes escolhas oficiais de Lifepath:
- Origem Cultural: ${lifepath.culturalOrigin}
- Estilo & Penteado: ${lifepath.clothingStyle} com ${lifepath.hairstyle}
- Personalidade & Postura: ${lifepath.personality}
- Origem Familiar & Crise: ${lifepath.familyBackground} | ${lifepath.familyCrisis}
- Ambiente de Infância: ${lifepath.childhoodEnvironment}
- Valores & Pessoa Importante: ${lifepath.valueMost} | ${lifepath.valuedPerson}
- Posse Estimada: ${lifepath.valuedPossession}
- Caso de Amor Trágico: ${lifepath.tragicLoveAffair}
- Arqui-Inimigo (Nemesis): ${lifepath.nemesis}
- Objetivo de Vida Supremo: ${lifepath.lifeGoals}

Retorne exclusivamente o texto da biografia formatado em Markdown com parágrafos fluidos, tom noir visceral, gírias do universo (eddies, choomba, cromo) e pronto para ser usado na mesa de RPG.`;

  if (activeKey) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return text.trim();
        }
      }
    } catch (err) {
      console.error('Error generating AI lifepath backstory:', err);
    }
  }

  // Fallback se sem chave ou erro
  return `Nasci sob o céu tóxico de ${lifepath.culturalOrigin || 'Night City'}. Cresci aprendendo que ${lifepath.feelingsAboutPeople || 'ninguém é confiável nas ruas'}. Meu bem mais precioso sempre foi ${lifepath.valuedPossession || 'minha arma'}, e nunca esqueci a lição de ${lifepath.familyCrisis || 'quando tudo desmoronou'}. Meu objetivo supremo é ${lifepath.lifeGoals || 'fazer meu nome nas ruas e virar uma lenda'}. Com ${lifepath.nemesis || 'meus inimigos'} caçando meus passos, cada trabalho na Zona de Combate é uma questão de vida ou morte.`;
}
