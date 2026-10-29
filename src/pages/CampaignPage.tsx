import React, { useState, useEffect } from 'react';

import {

  Compass,

  Calendar,

  Sparkles,

  Zap,

  DollarSign,

  AlertTriangle,

  FileText,

  Copy,

  Check,

  RotateCcw,

  Plus,

  Trash2,

  MapPin,

  Users,

  BookOpen,

  Award,

  Image as ImageIcon,

  Eye,

  Edit,

  Download,

  Bold,

  Italic,

  List,

  Quote,

  Table as TableIcon,

  Minus,

  Gift,

  Trophy,

  CheckSquare,

  Square,

  Bot,

  Shield,

  Crosshair,

  ArrowRight,

  HelpCircle,

  Star,

  BookmarkCheck,

  Send,

  Target,

  Dices,

  Coins,

  HeartHandshake,

  Activity,

  Wrench,

  Home,

  UtensilsCrossed,

  Building2,

  Flame,

} from 'lucide-react';

import {

  BEAT_CHART_STRUCTURE,

  ADVENTURE_PRESET_THEMES,

  generateProceduralBeatChart,

  SCENE_IMPROV_DATA,

  generateProceduralSceneImprov,

  HOUSING_OPTIONS,

  FOOD_OPTIONS,

  TRAUMA_TEAM_OPTIONS,

  DOWNTIME_PROJECTS,

  DETAILED_ROLE_HUSTLES,

  RANDOM_LIFE_EVENTS,

  generateProceduralTimeskip,

  ProceduralTimeskipResult,

  RoleHustleTier,

} from '../data/campaignData';

import {

  SESSION_DIFFICULTY_TIERS,

  MISSION_OUTCOMES,

  SESSION_REWARD_TAGS,

  IP_PROGRESSION_RULES,

  SPECIAL_SALVAGE_POOL,

  calculateSessionRewardsOffline,

  SessionDifficultyId,

  MissionOutcomeId,

  RewardTagCategory,

  SessionRewardResult,

} from '../data/rewardsData';

import {

  generateAICampaignBeatChart,

  generateAISceneImprov,

  generateAITimeskipDowntime,

  generateAISessionRewards,

} from '../services/aiService';

import { useUserRole } from '../context/UserRoleContext';

import { NIGHT_CITY_DISTRICTS } from '../data/mapData';





interface DiaryTab {

  id: string;

  title: string;

  content: string;

  updatedAt: string;

}



const DEFAULT_DIARIES: DiaryTab[] = [

  {

    id: 'diary-session-1',

    title: 'Sessão 01: O Trabalho em Kabuki',

    content: `# Sessão 01: O Trabalho em Kabuki

**Data:** 15 de Outubro de 2045  

**XP Concedido:** 60 IP  

**Local:** Kabuki Market & Distrito Industrial Norte (NID)



---



### Resumo da Sessão

A equipe se reuniu no bar *The Chrome Siren* após uma chamada do Fixer Vee. O trabalho parecia simples: recuperar uma van blindada que foi interceptada por uma célula booster do Maelstrom.



> "Se o cromo dentro daquela van cair na mão do Warlock, Watson vai queimar em 48 horas." — *Fixer Vee*



### Principais Acontecimentos:

1. **Reconhecimento:** O Netrunner interceptou as câmeras do cruzamento e descobriu 4 gangers fortemente modificados de guarda.

2. **O Tiroteio:** O Solo disparou um tiro mirado desativando o atirador da marquise enquanto a equipe flanqueava pela tubulação de vapor.

3. **A Revelação:** No porta-malas da van não havia peças mecânicas, mas sim três civis com biomonitores da Arasaka!



![Street Cyberpunk Concept](https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80)



### Pontas Soltas para a Próxima Sessão:

- [ ] Quem financiou o sequestro dos civis?

- [ ] O Fixer Vee sabia o que realmente estava na carga?

- [ ] O Maelstrom prometeu vingança contra o Solo.`,

    updatedAt: '2045-10-15',

  },

  {

    id: 'diary-corps',

    title: 'Dossiê: Megacorporações & Segredos',

    content: `# Dossiê de Inteligência Corporativa



### 1. Arasaka Corporation

- **Divisão:** Inteligência & Segurança Regional

- **Contato Conhecido:** Subdiretor Tanaka (Westbrook)

- **Status da Equipe:** Neutro para Desconfiado (-1)

- **Nota Secreta:** Tanaka está desviando chips neurais militares para uma conta secreta na Suíça.



---



### 2. Trauma Team Internacional

- **Nível de Resposta:** Código Platina (menos de 2 minutos em Heywood).

- **Cartões da Equipe:** Nenhum (somente cobertura Silver de emergência do Fixer).`,

    updatedAt: '2045-10-18',

  },

];



export const CampaignPage: React.FC = () => {

  const {

    worldState,

    addCustomLocation,

    deleteCustomLocation,

    addCustomFaction,

    deleteCustomFaction,

    playerCharacters,

    savePlayerCharacter,

    addSessionLog,

  } = useUserRole();



  const [activeTab, setActiveTab] = useState<'beat-chart' | 'improv' | 'timeskip' | 'diaries' | 'rewards'>('beat-chart');



  // BEAT CHART STATE

  const [beatThemeInput, setBeatThemeInput] = useState<string>('Infiltração em laboratório subterrâneo da Biotechnica');

  const [selectedPresetTheme, setSelectedPresetTheme] = useState<string>('');

  const [isAiBeatLoading, setIsAiBeatLoading] = useState<boolean>(false);

  const [beatNotes, setBeatNotes] = useState<{ [key: string]: string }>({

    Hook: 'Um Fixer anônimo liga às 3h da manhã oferecendo 1.500eb por cabeça para invadir um armazém em Kabuki antes que o carregamento parta.',

    Development: 'A equipe pesquisa a segurança no Data Pool e descobre que a rota de câmeras tem um ponto cego no duto de ventilação.',

    Cliffhanger: 'A sirene de emergência soa mais cedo: a guarda foi trocada por um esquadrão corporativo blindado!',

    Twist: 'O caixote não contém armas, mas uma cobaia humana viva que implora por ajuda.',

    Climax: 'Tiroteio intenso no teto do armazém sob chuva torrencial enquanto a van de fuga espera na esquina.',

    Resolution: 'A equipe decide libertar a cobaia nos Badlands e ganha a inimizade da corporação, mas o respeito dos Nômades.',

  });

  const [copiedAdventure, setCopiedAdventure] = useState<boolean>(false);



  // SCENE IMPROV STATE

  const [selectedZone, setSelectedZone] = useState<string>('Zona de Combate & Ruínas Urbanas');

  const [selectedSituationPreset, setSelectedSituationPreset] = useState<string>('');

  const [improvSituation, setImprovSituation] = useState<string>('Investigando um beco escuro após ouvirem tiros de supressão.');

  const [isAiImprovLoading, setIsAiImprovLoading] = useState<boolean>(false);

  const [generatedScene, setGeneratedScene] = useState<any | null>(null);

  const [copiedSceneToast, setCopiedSceneToast] = useState<boolean>(false);



  // TIMESKIP STATE

  const [timeskipMonths, setTimeskipMonths] = useState<number>(2);

  const [timeskipRole, setTimeskipRole] = useState<string>('Solo');

  const [timeskipRoleRank, setTimeskipRoleRank] = useState<number>(4);

  const [timeskipHousingId, setTimeskipHousingId] = useState<string>('container');

  const [timeskipFoodId, setTimeskipFoodId] = useState<string>('prepak');

  const [timeskipTraumaId, setTimeskipTraumaId] = useState<string>('none');

  const [timeskipProjectId, setTimeskipProjectId] = useState<string>('standard_therapy');

  const [timeskipLifestyle, setTimeskipLifestyle] = useState<string>('Contêiner de Carga e Pré-embalado Genérico (600eb/mês)');

  const [isAiTimeskipLoading, setIsAiTimeskipLoading] = useState<boolean>(false);

  const [timeskipMode, setTimeskipMode] = useState<'procedural' | 'ai'>('procedural');

  const [proceduralTimeskipResult, setProceduralTimeskipResult] = useState<ProceduralTimeskipResult | null>(null);

  const [timeskipAIResult, setTimeskipAIResult] = useState<any | null>(null);



  // ========================================================

  // RECOMPENSAS DE FIM DE SESSÃO (IP & PROGRESSÃO) STATE

  // ========================================================

  const [sessionTitle, setSessionTitle] = useState<string>(`Operação ${new Date().toLocaleDateString('pt-BR')}: Infiltração em Kabuki`);

  const [sessionDifficultyId, setSessionDifficultyId] = useState<SessionDifficultyId>('standard');

  const [missionOutcomeId, setMissionOutcomeId] = useState<MissionOutcomeId>('standard_success');

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([

    'obj_main_done',

    'threat_gang_brawl',

    'tactics_synergy',

    'rp_style_substance',

  ]);

  const [sessionDescription, setSessionDescription] = useState<string>(

    'A equipe foi contratada para recuperar um contêiner de chips neurais blindados roubados por gangers do Maelstrom. O Netrunner desativou as torres automatizadas enquanto o Solo forneceu fogo de supressão no pátio e o Techie sabotou as saídas de emergência. A carga foi entregue sem baixas civis.'

  );

  const [fixerName, setFixerName] = useState<string>('Fixer Vee (Afterlife)');

  const [tagCategoryFilter, setTagCategoryFilter] = useState<RewardTagCategory | 'all'>('all');

  const [rewardResult, setRewardResult] = useState<SessionRewardResult | null>(() => {

    return calculateSessionRewardsOffline({

      sessionTitle: 'Operação Inicial em Kabuki',

      difficultyId: 'standard',

      outcomeId: 'standard_success',

      selectedTagIds: ['obj_main_done', 'threat_gang_brawl', 'tactics_synergy', 'rp_style_substance'],

      partyMemberCount: 4,

      fixerName: 'Fixer Vee',

    });

  });

  const [isCalculatingRewards, setIsCalculatingRewards] = useState<boolean>(false);

  const [isAiCalculatingRewards, setIsAiCalculatingRewards] = useState<boolean>(false);

  const [rewardsToast, setRewardsToast] = useState<string | null>(null);

  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(() => {

    return playerCharacters.map(p => p.id);

  });

  const [showProgressionRulesModal, setShowProgressionRulesModal] = useState<boolean>(false);



  // Toggle selection of reward tags

  const toggleRewardTag = (tagId: string) => {

    setSelectedTagIds(prev =>

      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]

    );

  };



  // Toggle character participation

  const toggleCharacterSelection = (charId: string) => {

    setSelectedCharacterIds(prev =>

      prev.includes(charId) ? prev.filter(id => id !== charId) : [...prev, charId]

    );

  };



  const selectAllCharacters = () => {

    if (selectedCharacterIds.length === playerCharacters.length) {

      setSelectedCharacterIds([]);

    } else {

      setSelectedCharacterIds(playerCharacters.map(p => p.id));

    }

  };



  // 1. Calculate Rewards Offline (Official Reference Tables)

  const handleCalculateOffline = () => {

    setIsCalculatingRewards(true);

    const result = calculateSessionRewardsOffline({

      sessionTitle,

      difficultyId: sessionDifficultyId,

      outcomeId: missionOutcomeId,

      selectedTagIds,

      partyMemberCount: selectedCharacterIds.length || playerCharacters.length || 4,

      fixerName,

    });

    setRewardResult(result);

    setIsCalculatingRewards(false);

    setRewardsToast(`Recompensas calculadas pelas tabelas oficiais: +${result.totalIP} IP concedidos!`);

    setTimeout(() => setRewardsToast(null), 3000);

  };



  // 2. Calculate & Debrief with AI Co-GM (Gemini)

  const handleCalculateAI = async () => {

    setIsAiCalculatingRewards(true);

    try {

      const party = playerCharacters

        .filter(p => selectedCharacterIds.includes(p.id))

        .map(p => ({ name: p.name, role: p.role }));



      const result = await generateAISessionRewards({

        sessionTitle,

        difficultyId: sessionDifficultyId,

        outcomeId: missionOutcomeId,

        selectedTagIds,

        sessionDescription,

        partyMembers: party.length ? party : [{ name: 'Equipe de Edgerunners', role: 'Mercenários' }],

        fixerName,

      });



      setRewardResult(result);

      setRewardsToast(`Avaliação da IA Co-GM concluída: +${result.totalIP} IP e ${result.cashEbPerPlayer}eb por jogador!`);

      setTimeout(() => setRewardsToast(null), 3500);

    } catch (err) {

      console.error(err);

      handleCalculateOffline();

    } finally {

      setIsAiCalculatingRewards(false);

    }

  };



  // 3. Distribute IP & Eddies to Selected Players

  const handleDistributeToPlayers = () => {

    if (!rewardResult) return;

    if (selectedCharacterIds.length === 0) {

      setRewardsToast('Atenção: selecione pelo menos um personagem para receber as recompensas!');

      setTimeout(() => setRewardsToast(null), 3000);

      return;

    }



    let updatedCount = 0;

    playerCharacters.forEach(pc => {

      if (selectedCharacterIds.includes(pc.id)) {

        const newIP = (pc.improvementPoints ?? 0) + rewardResult.totalIP;

        const newCash = (pc.cashEb ?? 0) + rewardResult.cashEbPerPlayer;

        const newRep = (pc.reputation ?? 0) + (rewardResult.reputationChange || 0);



        savePlayerCharacter({

          ...pc,

          improvementPoints: newIP,

          cashEb: newCash,

          reputation: newRep,

        });

        updatedCount++;

      }

    });



    // Registra no histórico de sessões

    addSessionLog({

      title: rewardResult.sessionTitle,

      notes: `${rewardResult.coGMVerdict}



Pagamento: ${rewardResult.cashEbPerPlayer}eb | Rep: +${rewardResult.reputationChange}

${rewardResult.screamsheetHeadline}`,

      xpAwarded: rewardResult.totalIP,

    });



    setRewardsToast(`🎁 Sucesso! +${rewardResult.totalIP} IP e ${rewardResult.cashEbPerPlayer}eb creditados para ${updatedCount} edgerunners!`);

    setTimeout(() => setRewardsToast(null), 4000);

  };



  // 4. Save Rewards as Markdown Diary Tab

  const handleSaveToDiaries = () => {

    if (!rewardResult) return;

    const newId = 'diary-session-' + Date.now();

    const markdownContent = `# ${rewardResult.sessionTitle}

**Data da Operação:** ${new Date().toLocaleDateString('pt-BR')}  

**IP / Pontos de Investimento Concedidos:** +${rewardResult.totalIP} IP por Jogador  

**Pagamento por Edgerunner:** ${rewardResult.cashEbPerPlayer} eb (Total do Grupo: ${rewardResult.totalGroupCashEb} eb)  

**Mudança de Reputação:** +${rewardResult.reputationChange} Reputação  

**Contratante / Fixer:** ${fixerName || 'Submundo'}  



---



### 📰 Manchete do Screamsheet (Data Pool)

> **"${rewardResult.screamsheetHeadline}"**  

> *${rewardResult.screamsheetArticle}*



---



### 📋 Resumo Operacional da Sessão

${sessionDescription}



---



### 🎖️ Breakdown de Pontuação (Cyberpunk RED Corebook)

- **IP Base da Dificuldade (${rewardResult.difficulty.name}):** ${rewardResult.ipBreakdown.base} IP

- **Multiplicador de Desfecho (${rewardResult.outcome.name}):** x${rewardResult.ipBreakdown.outcomeMultiplier}

- **Bônus de Objetivos:** +${rewardResult.ipBreakdown.objectivesBonus} IP

- **Bônus de Ameaça & Combate:** +${rewardResult.ipBreakdown.threatBonus} IP

- **Bônus de Atitude & Roleplay:** +${rewardResult.ipBreakdown.roleplayBonus} IP

- **Bônus de Tática & Cooperação:** +${rewardResult.ipBreakdown.tacticsBonus} IP

- **TOTAL FINAL POR JOGADOR:** **${rewardResult.totalIP} IP**



---



### 📦 Saques Especiais & Favores Recuperados

${rewardResult.specialLoot.map(item => `- **${item.name}** [${item.category}] (${item.valueEb} eb): ${item.description} *(Efeito: ${item.mechanicalEffect})*`).join('\n')}



---



### 🌟 Destaques da Equipe (MVP)

${rewardResult.mvpHighlights.map(h => `- ${h}`).join('\n')}



---



### 🔗 Ganchos para a Próxima Sessão

${rewardResult.nextSessionHooks.map(hook => `- [ ] ${hook}`).join('\n')}



---

*Veredito do Co-GM:* ${rewardResult.coGMVerdict}`;



    const newTab: DiaryTab = {

      id: newId,

      title: rewardResult.sessionTitle.slice(0, 32),

      content: markdownContent,

      updatedAt: new Date().toISOString().split('T')[0],

    };



    setDiaries(prev => [...prev, newTab]);

    setActiveDiaryId(newId);

    setActiveTab('diaries');

    setRewardsToast('Relatório de recompensas salvo com sucesso na aba de Diários!');

    setTimeout(() => setRewardsToast(null), 3000);

  };



  // 5. Copy Report to Clipboard for Discord/WhatsApp

  const handleCopyReport = () => {

    if (!rewardResult) return;

    const text = `🏆 **CYBERPUNK RED // RELATÓRIO DE FIM DE SESSÃO** 🏆

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 **Missão:** ${rewardResult.sessionTitle}

⚡ **Pontos de Investimento (IP):** +${rewardResult.totalIP} IP por jogador

💰 **Pagamento:** ${rewardResult.cashEbPerPlayer} eb por cabeça (${rewardResult.totalGroupCashEb} eb total)

⭐ **Reputação:** +${rewardResult.reputationChange} Rep

📰 **Screamsheet:** "${rewardResult.screamsheetHeadline}"



📦 **Saque Especial:**

${rewardResult.specialLoot.map(l => `• ${l.name} (${l.valueEb}eb) - ${l.description}`).join('\n')}



🔗 **Ganchos Futuros:**

${rewardResult.nextSessionHooks.map(h => `• ${h}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;



    navigator.clipboard.writeText(text);

    setRewardsToast('Relatório copiado para a área de transferência!');

    setTimeout(() => setRewardsToast(null), 2500);

  };



  // DIARIES (MARKDOWN MULTI-TAB) STATE

  const [diaries, setDiaries] = useState<DiaryTab[]>(() => {

    try {

      const saved = localStorage.getItem('cyberpunk_campaign_markdown_diaries');

      return saved ? JSON.parse(saved) : DEFAULT_DIARIES;

    } catch {

      return DEFAULT_DIARIES;

    }

  });

  const [activeDiaryId, setActiveDiaryId] = useState<string>(diaries[0]?.id || 'diary-session-1');

  const [diaryMode, setDiaryMode] = useState<'write' | 'preview'>('write');



  // Persist diaries

  useEffect(() => {

    localStorage.setItem('cyberpunk_campaign_markdown_diaries', JSON.stringify(diaries));

  }, [diaries]);



  const currentDiary = diaries.find(d => d.id === activeDiaryId) || diaries[0];



  // 1. Procedural Beat Chart Generator (100% Offline / Regras dos Livros)

  const handleRollProceduralBeatChart = () => {

    const res = generateProceduralBeatChart(beatThemeInput);

    setBeatNotes(res.beats);

  };



  // Roll single beat prompt

  const handleRollSingleBeatPrompt = (beatType: string) => {

    const beatDef = BEAT_CHART_STRUCTURE.find(b => b.beatType === beatType);

    if (!beatDef) return;

    const randomPrompt = beatDef.prompts[Math.floor(Math.random() * beatDef.prompts.length)];

    setBeatNotes(prev => ({

      ...prev,

      [beatType]: `${randomPrompt}\n\n💡 Dica Mecânica: ${beatDef.tips}`,

    }));

  };



  // Copy full adventure to clipboard

  const handleCopyFullAdventure = () => {

    let fullText = `=== BEAT CHART DE AVENTURA: ${beatThemeInput.toUpperCase()} ===\n\n`;

    BEAT_CHART_STRUCTURE.forEach(beat => {

      fullText += `[${beat.titlePt}]\n${beatNotes[beat.beatType] || 'Nenhuma nota registrada.'}\n\n`;

    });

    navigator.clipboard.writeText(fullText);

    setCopiedAdventure(true);

    setTimeout(() => setCopiedAdventure(false), 2500);

  };



  // AI Beat Chart Generator

  const handleGenerateAIBeatChart = async () => {

    setIsAiBeatLoading(true);

    try {

      const res = await generateAICampaignBeatChart(beatThemeInput);

      setBeatNotes({

        Hook: `${res.hook.title}: ${res.hook.narrative}\n\n[Mecânica]: ${res.hook.mechanicalAction}`,

        Development: `${res.development.title}: ${res.development.narrative}\n\n[Perícias]: ${res.development.skillChecks}`,

        Cliffhanger: `${res.cliffhanger.title}: ${res.cliffhanger.narrative}\n\n[Dilema]: ${res.cliffhanger.urgentChoice}`,

        Twist: `${res.twist.title}: ${res.twist.narrative}\n\n[Revelação]: ${res.twist.betrayalOrSecret}`,

        Climax: `${res.climax.title}: ${res.climax.narrative}\n\n[Cenário]: ${res.climax.battlefieldSetup}`,

        Resolution: `${res.resolution.title}: ${res.resolution.narrative}\n\n[Consequências]: ${res.resolution.payoutAndConsequences}`,

      });

    } catch (e) {

      console.error(e);

      handleRollProceduralBeatChart();

    } finally {

      setIsAiBeatLoading(false);

    }

  };



  // 2. Procedural Scene Improv (100% Offline / Regras dos Livros)

  const handleRollProceduralImprov = () => {

    const res = generateProceduralSceneImprov(selectedZone, improvSituation);

    setGeneratedScene({

      zone: res.zone,

      sensory: res.sensory,

      obstacle: `${res.obstacle.description} (Requer teste de ${res.obstacle.skill} DV ${res.obstacle.dv}. Falha: ${res.obstacle.failureCost})`,

      npc: res.npc,

      twist: `${res.twist.title}: ${res.twist.narrative} [Impacto: ${res.twist.mechanicalImpact}]`,

    });

  };



  // AI Scene Improv Generator

  const handleGenerateAIImprov = async () => {

    setIsAiImprovLoading(true);

    try {

      const res = await generateAISceneImprov(selectedZone, improvSituation, {

        threatLevel: 'Padrão das Ruas',

      });

      setGeneratedScene({

        zone: selectedZone,

        sensory: {

          sight: res.sensorySights,

          sound: res.sensorySounds,

          smell: res.sensorySmells,

        },

        obstacle: res.immediateHazard,

        npc: res.instantNPC,

        twist: res.suddenTwist,

      });

    } catch (e) {

      console.error(e);

      handleRollProceduralImprov();

    } finally {

      setIsAiImprovLoading(false);

    }

  };



  // Copy Scene Improv to Clipboard

  const handleCopyScene = () => {

    if (!generatedScene) return;

    const text = `=== CENA IMPROVISADA // ${generatedScene.zone.toUpperCase()} ===

[QUADRO SENSORIAL]

Visão: ${generatedScene.sensory.sight}

Audição: ${generatedScene.sensory.sound}

Olfato: ${generatedScene.sensory.smell}



[NPC IMEDIATO]

${generatedScene.npc.name} (${generatedScene.npc.role || 'Cidadão'})

Aparência: ${generatedScene.npc.visualAppearance || generatedScene.npc.demeanor}

Motivação: ${generatedScene.npc.motivation}

Fala: ${generatedScene.npc.dialogueHook}



[PERIGO IMEDIATO]

${generatedScene.obstacle}



[REVIRAVOLTA REPENTINA]

${generatedScene.twist}`;

    navigator.clipboard.writeText(text);

    setCopiedSceneToast(true);

    setTimeout(() => setCopiedSceneToast(false), 2500);

  };



  // 3. Procedural Timeskip Simulator (100% Offline / Core Rulebook)

  const handleRollProceduralTimeskip = () => {

    const res = generateProceduralTimeskip({

      months: timeskipMonths,

      role: timeskipRole,

      roleRank: timeskipRoleRank,

      housingId: timeskipHousingId,

      foodId: timeskipFoodId,

      traumaTeamId: timeskipTraumaId,

      downtimeProjectId: timeskipProjectId || undefined,

    });

    setProceduralTimeskipResult(res);

    setTimeskipMode('procedural');

  };



  // AI Timeskip Simulator

  const handleGenerateAITimeskip = async () => {

    setIsAiTimeskipLoading(true);

    try {

      const housingName = HOUSING_OPTIONS.find(h => h.id === timeskipHousingId)?.name;

      const foodName = FOOD_OPTIONS.find(f => f.id === timeskipFoodId)?.name;

      const traumaName = TRAUMA_TEAM_OPTIONS.find(t => t.id === timeskipTraumaId)?.name;

      const projectName = DOWNTIME_PROJECTS.find(p => p.id === timeskipProjectId)?.name;



      const res = await generateAITimeskipDowntime(

        timeskipMonths,

        timeskipLifestyle,

        [timeskipRole],

        {

          housing: housingName,

          food: foodName,

          trauma: traumaName,

          project: projectName,

          roleRank: timeskipRoleRank,

        }

      );

      setTimeskipAIResult(res);

      setTimeskipMode('ai');

    } catch (e) {

      console.error(e);

      handleRollProceduralTimeskip();

    } finally {

      setIsAiTimeskipLoading(false);

    }

  };



  // Markdown Toolbar Inserter

  const insertMarkdown = (prefix: string, suffix: string = '') => {

    if (!currentDiary) return;

    const updatedContent = currentDiary.content + `\n${prefix}texto${suffix}`;

    updateCurrentDiaryContent(updatedContent);

  };



  const updateCurrentDiaryContent = (text: string) => {

    setDiaries(prev =>

      prev.map(d => (d.id === activeDiaryId ? { ...d, content: text, updatedAt: new Date().toISOString().slice(0, 10) } : d))

    );

  };



  const handleAddNewDiaryTab = () => {

    const newId = `diary-${Date.now()}`;

    const newTab: DiaryTab = {

      id: newId,

      title: `Nova Sessão #${diaries.length + 1}`,

      content: `# Nova Sessão #${diaries.length + 1}\n**Data:** ${new Date().toLocaleDateString('pt-BR')}\n\n### Objetivos da Sessão:\n- [ ] Investigar pista\n- [ ] Encontrar o Fixer\n`,

      updatedAt: new Date().toISOString().slice(0, 10),

    };

    setDiaries(prev => [...prev, newTab]);

    setActiveDiaryId(newId);

  };



  const handleDeleteCurrentDiaryTab = () => {

    if (diaries.length <= 1) return;

    setDiaries(prev => prev.filter(d => d.id !== activeDiaryId));

    setActiveDiaryId(diaries[0].id);

  };



  // Basic HTML-safe Markdown Formatter for Preview

  const renderMarkdownPreview = (text: string) => {

    return text.split('\n').map((line, idx) => {

      // Images: ![alt](url)

      const imgMatch = line.match(/!\[(.*?)\]\((.*?)\)/);

      if (imgMatch) {

        return (

          <div key={idx} className="my-3">

            <img

              src={imgMatch[2]}

              alt={imgMatch[1]}

              className="max-h-80 w-auto rounded-xl border border-zinc-800 object-cover shadow-md"

              onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'; }}

            />

            {imgMatch[1] && <span className="text-[10px] text-zinc-500 font-mono mt-1 block">{imgMatch[1]}</span>}

          </div>

        );

      }

      // Headings

      if (line.startsWith('# ')) {

        return <h1 key={idx} className="text-xl font-bold text-zinc-100 border-b border-zinc-800 pb-2 my-3">{line.replace('# ', '')}</h1>;

      }

      if (line.startsWith('## ')) {

        return <h2 key={idx} className="text-lg font-bold text-zinc-200 mt-4 mb-2">{line.replace('## ', '')}</h2>;

      }

      if (line.startsWith('### ')) {

        return <h3 key={idx} className="text-sm font-bold text-cyan-400 font-mono mt-3 mb-1">{line.replace('### ', '')}</h3>;

      }

      // Blockquote

      if (line.startsWith('> ')) {

        return (

          <blockquote key={idx} className="border-l-4 border-amber-500 pl-3 py-1 my-2 bg-amber-950/20 text-amber-200 text-xs italic rounded-r-lg">

            {line.replace('> ', '')}

          </blockquote>

        );

      }

      // Horizontal Rule

      if (line.trim() === '---') {

        return <hr key={idx} className="border-zinc-800 my-4" />;

      }

      // Lists

      if (line.startsWith('- [ ] ')) {

        return <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300 my-1"><span className="w-3.5 h-3.5 rounded border border-zinc-600 inline-block" /> {line.replace('- [ ] ', '')}</div>;

      }

      if (line.startsWith('- [x] ')) {

        return <div key={idx} className="flex items-center gap-2 text-xs text-emerald-400 my-1"><Check className="w-3.5 h-3.5" /> <span className="line-through">{line.replace('- [x] ', '')}</span></div>;

      }

      if (line.startsWith('- ') || line.startsWith('* ')) {

        return <li key={idx} className="text-xs text-zinc-300 ml-4 list-disc my-0.5">{line.substring(2)}</li>;

      }

      // Empty line

      if (!line.trim()) {

        return <div key={idx} className="h-2" />;

      }

      // Standard paragraph

      return <p key={idx} className="text-xs text-zinc-300 leading-relaxed">{line}</p>;

    });

  };



  return (

    <div className="max-w-7xl mx-auto space-y-6">

      {/* Top Header & Navigation */}

      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 border-b border-[#27272a] pb-4">

        <div>

          <h1 className="text-xl font-bold text-zinc-100 flex items-center gap-2">

            <Compass className="w-5 h-5 text-cyan-500" />

            <span>Diretor de Campanha & Diários Narrativos</span>

          </h1>

          <p className="text-xs text-zinc-400 mt-1">

            Geração de aventuras com o Beat Chart oficial, improvisador de cenas, simulador de timeskip e diários multi-abas em Markdown com suporte a imagens e IA.

          </p>

        </div>



        {/* Tab Pills */}

        <div className="flex flex-wrap items-center gap-1.5 bg-[#14141a] border border-[#27272a] rounded-xl p-1.5 text-xs font-medium">

          <button

            onClick={() => setActiveTab('beat-chart')}

            className={`px-3 py-1.5 rounded-lg transition ${

              activeTab === 'beat-chart' ? 'bg-zinc-800 text-zinc-100 font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200'

            }`}

          >

            Beat Chart (Aventuras)

          </button>

          <button

            onClick={() => setActiveTab('improv')}

            className={`px-3 py-1.5 rounded-lg transition ${

              activeTab === 'improv' ? 'bg-zinc-800 text-zinc-100 font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200'

            }`}

          >

            Improviso de Cenas

          </button>

          <button

            onClick={() => setActiveTab('timeskip')}

            className={`px-3 py-1.5 rounded-lg transition ${

              activeTab === 'timeskip' ? 'bg-zinc-800 text-zinc-100 font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200'

            }`}

          >

            Timeskip & Downtime

          </button>

          <button

            onClick={() => setActiveTab('diaries')}

            className={`px-3 py-1.5 rounded-lg transition ${

              activeTab === 'diaries' ? 'bg-zinc-800 text-amber-400 font-bold shadow-sm' : 'text-zinc-400 hover:text-zinc-200'

            }`}

          >

            Diários do Mestre (Markdown)

          </button>

          <button

            onClick={() => setActiveTab('rewards')}

            className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${

              activeTab === 'rewards'

                ? 'bg-zinc-800 text-emerald-400 font-bold shadow-sm border border-emerald-500/40'

                : 'text-zinc-400 hover:text-zinc-200'

            }`}

          >

            <Award className="w-3.5 h-3.5 text-emerald-400" />

            <span>Recompensas de Fim de Sessão</span>

            <span className="text-[9px] font-mono px-1 py-0.2 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">IP & Loot</span>

          </button>

        </div>

      </div>



      {/* ======================================================== */}

      {/* ABA 1: BEAT CHART DE AVENTURAS & HISTÓRIAS (REGRAS OFICIAIS + IA) */}
      {/* ======================================================== */}
      {activeTab === 'beat-chart' && (
        <div className="space-y-6">
          {/* Top Control Bar with Presets and dual Generation */}
          <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4 shadow-sm">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 border-b border-[#27272a] pb-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Gerador do Beat Chart Oficial de Campanhas</span>
                </h3>
                <p className="text-xs text-zinc-400">
                  Estrutura oficial dos livros de Cyberpunk RED (Gancho, Desenvolvimento, Cliffhanger, Twist, Clímax e Resolução).
                </p>
              </div>

              {/* Preset Adventure Themes Selector */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <span className="text-[11px] font-mono text-zinc-400 shrink-0">Temas Clássicos:</span>
                <select
                  value={selectedPresetTheme}
                  onChange={e => {
                    const themeId = e.target.value;
                    setSelectedPresetTheme(themeId);
                    const found = ADVENTURE_PRESET_THEMES.find(t => t.id === themeId);
                    if (found) {
                      setBeatThemeInput(`${found.title} (${found.district})`);
                    }
                  }}
                  className="bg-[#0a0a0d] border border-[#27272a] rounded-xl px-2.5 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="">-- Escolher Tema dos Livros --</option>
                  {ADVENTURE_PRESET_THEMES.map(theme => (
                    <option key={theme.id} value={theme.id}>
                      {theme.title} // {theme.faction}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input & Dual Action Buttons */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              <input
                type="text"
                placeholder="Tema ou gancho da aventura (ex: Assalto ao laboratório da Biotechnica, vingança contra o Maelstrom...)"
                value={beatThemeInput}
                onChange={e => setBeatThemeInput(e.target.value)}
                className="w-full min-w-0 bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500 font-sans"
              />

              <div className="flex flex-wrap items-center gap-2">
                {/* 1. Procedural Offline Roll Button */}
                <button
                  onClick={handleRollProceduralBeatChart}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-600 hover:to-red-600 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition shadow"
                  title="Sorteia uma aventura completa usando as tabelas oficiais sem precisar de internet"
                >
                  <Dices className="w-4 h-4" />
                  <span>Sortear Aventura (Livros)</span>
                </button>

                {/* 2. AI Generator Button */}
                <button
                  onClick={handleGenerateAIBeatChart}
                  disabled={isAiBeatLoading}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition shadow disabled:opacity-50"
                  title="Usa inteligência artificial para redigir uma história completa sob medida para o tema"
                >
                  <Sparkles className={`w-4 h-4 ${isAiBeatLoading ? 'animate-spin' : ''}`} />
                  <span>{isAiBeatLoading ? 'Gerando com IA...' : '⚡ Gerar com IA'}</span>
                </button>

                {/* Copy Adventure Button */}
                <button
                  onClick={handleCopyFullAdventure}
                  className="px-3.5 py-2.5 rounded-xl bg-[#1c1c24] hover:bg-zinc-800 border border-[#27272a] text-zinc-300 font-mono text-xs flex items-center justify-center gap-1.5 transition"
                  title="Copiar os 6 Beats formatados para a área de transferência"
                >
                  {copiedAdventure ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                  <span>{copiedAdventure ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 6 Beats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BEAT_CHART_STRUCTURE.map(beat => (
              <div
                key={beat.beatType}
                className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3 flex flex-col justify-between hover:border-zinc-700 transition shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
                    <span className="text-xs font-bold text-zinc-100 font-mono">{beat.titlePt}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-cyan-400 border border-cyan-900/40">
                        {beat.beatType}
                      </span>
                      <button
                        onClick={() => handleRollSingleBeatPrompt(beat.beatType)}
                        className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-400 transition"
                        title="Sortear novo prompt aleatório para este Beat"
                      >
                        <Dices className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {beat.objective}
                  </p>

                  <textarea
                    value={beatNotes[beat.beatType] || ''}
                    onChange={e => setBeatNotes({ ...beatNotes, [beat.beatType]: e.target.value })}
                    rows={6}
                    className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-2.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-cyan-500 leading-relaxed"
                  />
                </div>

                <div className="text-[10px] font-mono text-zinc-500 italic pt-1 border-t border-zinc-900">
                  💡 Dica do Mestre: {beat.tips}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 2: IMPROVISO DE CENAS & EVENTOS URBANOS             */}
      {/* ======================================================== */}
      {activeTab === 'improv' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4 shadow-sm">
            <div className="border-b border-[#27272a] pb-3">
              <h3 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Gerador de Cena & Improviso</span>
              </h3>
              <p className="text-[11px] text-zinc-400 mt-1">
                Gere atmosfera sensorial, NPCs instantâneos com falas e perigos táticos dos livros.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Zone / District Selector (10 Expanded Zones) */}
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">
                  Zona / Ambiente de Night City (10 Opções):
                </label>
                <select
                  value={selectedZone}
                  onChange={e => setSelectedZone(e.target.value)}
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-2.5 text-zinc-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                >
                  {Object.keys(SCENE_IMPROV_DATA.zones).map(zoneKey => (
                    <option key={zoneKey} value={zoneKey}>
                      {zoneKey}
                    </option>
                  ))}
                </select>
                {SCENE_IMPROV_DATA.zones[selectedZone] && (
                  <p className="text-[10px] text-zinc-500 mt-1 italic">
                    {SCENE_IMPROV_DATA.zones[selectedZone].description}
                  </p>
                )}
              </div>

              {/* Situation Preset Selector */}
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">
                  Situação / Contexto de Tensão (Opcional):
                </label>
                <select
                  value={selectedSituationPreset}
                  onChange={e => {
                    const sit = e.target.value;
                    setSelectedSituationPreset(sit);
                    if (sit) setImprovSituation(sit);
                  }}
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-2 text-zinc-300 font-mono text-[11px] mb-2 focus:outline-none focus:border-cyan-500"
                >
                  <option value="">-- Escolher Situação das Ruas --</option>
                  {SCENE_IMPROV_DATA.situations.map((sit, idx) => (
                    <option key={idx} value={sit}>
                      {sit}
                    </option>
                  ))}
                </select>

                <textarea
                  value={improvSituation}
                  onChange={e => setImprovSituation(e.target.value)}
                  rows={3}
                  placeholder="Descreva a situação atual dos personagens..."
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-2.5 text-zinc-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* 1. Procedural Offline Roll Button */}
                <button
                  onClick={handleRollProceduralImprov}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-600 hover:to-red-600 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow"
                  title="Gera a cena inteira na hora com tabelas do livro"
                >
                  <Dices className="w-4 h-4" />
                  <span>🎲 Sortear Cena Completa (Offline)</span>
                </button>

                {/* 2. AI Generator Button */}
                <button
                  onClick={handleGenerateAIImprov}
                  disabled={isAiImprovLoading}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow"
                  title="Usa IA para criar uma cena única e descritiva"
                >
                  <Zap className={`w-4 h-4 ${isAiImprovLoading ? 'animate-spin' : ''}`} />
                  <span>{isAiImprovLoading ? 'Improvisando com IA...' : '⚡ Improvisar Cena com IA'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Generated Scene Display (8 cols) */}
          <div className="lg:col-span-8">
            {generatedScene ? (
              <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-5 shadow-lg animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#27272a] pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                      Cena Gerada // {generatedScene.zone}
                    </span>
                    <h3 className="text-base font-bold text-zinc-100 mt-1">Quadro Tático & Sensorial Imediato</h3>
                  </div>

                  <button
                    onClick={handleCopyScene}
                    className="px-3 py-1.5 rounded-lg bg-[#1c1c24] hover:bg-zinc-800 border border-[#27272a] text-zinc-300 font-mono text-xs flex items-center gap-1.5 transition"
                  >
                    {copiedSceneToast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                    <span>{copiedSceneToast ? 'Copiado!' : 'Copiar Cena'}</span>
                  </button>
                </div>

                {/* 3 Sensory Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-1">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block flex items-center gap-1">
                      👁️ Visão (Sight)
                    </span>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">{generatedScene.sensory.sight}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block flex items-center gap-1">
                      👂 Audição (Sound)
                    </span>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">{generatedScene.sensory.sound}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-1">
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold block flex items-center gap-1">
                      👃 Olfato (Smell)
                    </span>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">{generatedScene.sensory.smell}</p>
                  </div>
                </div>

                {/* Instant NPC with Full Visual Appearance and Dialogue Hook */}
                {generatedScene.npc && (
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-cyan-500/30 space-y-2 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <strong className="text-cyan-300 text-sm">
                          {generatedScene.npc.name}
                        </strong>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {generatedScene.npc.role}
                        </span>
                      </div>
                      {generatedScene.npc.faction && (
                        <span className="text-[10px] font-mono text-zinc-400">
                          Facção: <strong className="text-zinc-200">{generatedScene.npc.faction}</strong>
                        </span>
                      )}
                    </div>

                    {(generatedScene.npc.visualAppearance || generatedScene.npc.demeanor) && (
                      <p className="text-zinc-300 text-xs leading-relaxed">
                        <strong className="text-zinc-400 font-mono">Aparência & Cromo:</strong>{' '}
                        {generatedScene.npc.visualAppearance || generatedScene.npc.demeanor}
                      </p>
                    )}

                    <p className="text-zinc-300 text-[11px]">
                      <strong className="text-zinc-400 font-mono">Motivação Imediata:</strong> {generatedScene.npc.motivation}
                    </p>

                    {generatedScene.npc.dialogueHook && (
                      <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-amber-200 text-xs italic font-sans flex items-start gap-2">
                        <span className="text-amber-400 font-bold shrink-0">Fala:</span>
                        <span>"{generatedScene.npc.dialogueHook.replace(/^"+|"+$/g, '')}"</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Immediate Hazard & Sudden Twist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/40 text-red-200 space-y-1">
                    <strong className="text-red-400 font-mono block flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Perigo / Obstáculo Imediato:</span>
                    </strong>
                    <p className="text-[11px] leading-relaxed text-zinc-300">{generatedScene.obstacle}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40 text-amber-200 space-y-1">
                    <strong className="text-amber-400 font-mono block flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Reviravolta Repentina:</span>
                    </strong>
                    <p className="text-[11px] leading-relaxed text-zinc-300">{generatedScene.twist}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-16 rounded-2xl bg-[#121217] border border-dashed border-[#27272a] text-center space-y-3">
                <Sparkles className="w-10 h-10 text-zinc-600 mx-auto" />
                <h4 className="text-sm font-bold text-zinc-300">Nenhuma cena improvisada no momento</h4>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Selecione o ambiente ao lado e clique em <strong>"Sortear Cena Completa (Offline)"</strong> ou <strong>"Improvisar com IA"</strong> para receber descrições imediatas com NPCs, perigos e reviravoltas.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 3: TIMESKIP & DOWNTIME (REGRAS OFICIAIS + IA)        */}
      {/* ======================================================== */}
      {activeTab === 'timeskip' && (
        <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] max-w-4xl mx-auto space-y-6 shadow-sm">
          <div className="border-b border-[#27272a] pb-3">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-500" />
              <span>Simulador de Timeskip & Downtime (Livro de Regras & IA)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Simule meses de intervalo entre missões com as tabelas oficiais de bicos (Hustles 1d6) de todas as 10 Roles, custos de aluguel e alimentação, seguros da Trauma Team, Terapia de Humanidade e crônicas com IA.
            </p>
          </div>

          {/* Downtime Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            {/* 1. Duration */}
            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Duração do Intervalo:</label>
              <select
                value={timeskipMonths}
                onChange={e => setTimeskipMonths(parseInt(e.target.value))}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-2.5 text-zinc-200 font-mono"
              >
                <option value={1}>1 Mês de Downtime</option>
                <option value={2}>2 Meses de Downtime</option>
                <option value={3}>3 Meses de Downtime</option>
                <option value={6}>6 Meses (Meio Ano)</option>
              </select>
            </div>

            {/* 2. Role */}
            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Classe / Role do Personagem:</label>
              <select
                value={timeskipRole}
                onChange={e => setTimeskipRole(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-2.5 text-zinc-200 font-mono"
              >
                {DETAILED_ROLE_HUSTLES.map(r => (
                  <option key={r.role} value={r.role}>
                    {r.role}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Role Rank */}
            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Nível de Perícia / Rank:</label>
              <select
                value={timeskipRoleRank}
                onChange={e => setTimeskipRoleRank(parseInt(e.target.value))}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-2.5 text-zinc-200 font-mono"
              >
                <option value={4}>Rank 1 a 4 (Iniciante / Batedor de Rua)</option>
                <option value={6}>Rank 5 a 7 (Profissional Estabelecido)</option>
                <option value={9}>Rank 8 a 10 (Lenda Viva de Night City)</option>
              </select>
            </div>

            {/* 4. Housing */}
            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Moradia / Acomodação:</label>
              <select
                value={timeskipHousingId}
                onChange={e => setTimeskipHousingId(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-2.5 text-zinc-200 font-mono"
              >
                {HOUSING_OPTIONS.map(h => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.costEb} eb/mês)
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Food & Lifestyle */}
            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Alimentação & Estilo de Vida:</label>
              <select
                value={timeskipFoodId}
                onChange={e => setTimeskipFoodId(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-2.5 text-zinc-200 font-mono"
              >
                {FOOD_OPTIONS.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.costEb} eb/mês)
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Trauma Team Health Plan */}
            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Seguro de Saúde Trauma Team:</label>
              <select
                value={timeskipTraumaId}
                onChange={e => setTimeskipTraumaId(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-2.5 text-zinc-200 font-mono"
              >
                {TRAUMA_TEAM_OPTIONS.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.costEb} eb/mês)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Downtime Special Project (Black Chrome & Interface RED) */}
          <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-1.5 text-xs">
            <label className="text-[10px] font-mono text-amber-400 font-bold block flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" />
              <span>Projeto Especial de Downtime (Opcional - Regras Oficiais):</span>
            </label>
            <select
              value={timeskipProjectId}
              onChange={e => setTimeskipProjectId(e.target.value)}
              className="w-full bg-[#121217] border border-[#27272a] rounded-xl p-2.5 text-zinc-200 font-mono text-xs focus:outline-none focus:border-amber-500"
            >
              <option value="">-- Nenhum Projeto Especial (Apenas Sobreviver) --</option>
              {DOWNTIME_PROJECTS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.costEb} eb - {p.timeRequired})
                </option>
              ))}
            </select>
            {timeskipProjectId && (
              <p className="text-[11px] text-zinc-400 italic">
                Benefício: {DOWNTIME_PROJECTS.find(p => p.id === timeskipProjectId)?.mechanicalBenefit}
              </p>
            )}
          </div>

          {/* Dual Action Execution Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* 1. Procedural Offline Button */}
            <button
              onClick={handleRollProceduralTimeskip}
              className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-700 to-red-700 hover:from-amber-600 hover:to-red-600 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow"
              title="Calcula os bicos com rolagens 1d6 da Role, desconta despesas e eventos aleatórios"
            >
              <Dices className="w-4 h-4" />
              <span>🎲 Simular Downtime (Regras dos Livros)</span>
            </button>

            {/* 2. AI Generator Button */}
            <button
              onClick={handleGenerateAITimeskip}
              disabled={isAiTimeskipLoading}
              className="py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 shadow"
              title="Gera uma crônica cinematográfica e personalizada com IA"
            >
              <Zap className={`w-4 h-4 ${isAiTimeskipLoading ? 'animate-spin' : ''}`} />
              <span>{isAiTimeskipLoading ? 'Calculando com IA...' : '⚡ Simular Crônica com IA'}</span>
            </button>
          </div>

          {/* View Mode Switcher if results exist */}
          {(proceduralTimeskipResult || timeskipAIResult) && (
            <div className="flex items-center justify-center gap-2 border-b border-[#27272a] pb-2 text-xs font-mono">
              <span className="text-zinc-500">Exibindo Resultado:</span>
              {proceduralTimeskipResult && (
                <button
                  onClick={() => setTimeskipMode('procedural')}
                  className={`px-3 py-1 rounded-lg transition ${
                    timeskipMode === 'procedural'
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  🎲 Tabelas Oficiais (Procedural)
                </button>
              )}
              {timeskipAIResult && (
                <button
                  onClick={() => setTimeskipMode('ai')}
                  className={`px-3 py-1 rounded-lg transition ${
                    timeskipMode === 'ai'
                      ? 'bg-cyan-600 text-white font-bold'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  🤖 Crônica da IA (Gemini)
                </button>
              )}
            </div>
          )}

          {/* RESULT 1: PROCEDURAL OFFICIAL TABLES (LIVRO DE REGRAS) */}
          {timeskipMode === 'procedural' && proceduralTimeskipResult && (
            <div className="p-6 rounded-2xl bg-[#0a0a0d] border border-[#27272a] space-y-5 text-xs font-sans animate-in fade-in duration-150">
              {/* Financial Scoreboard */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 text-emerald-200 space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">
                    💰 Ganhos com Bicos (Hustles)
                  </span>
                  <p className="text-base font-bold font-mono">+{proceduralTimeskipResult.totalEarnings} eb</p>
                </div>
                <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-800/40 text-red-200 space-y-1">
                  <span className="text-[10px] font-mono text-red-400 uppercase font-bold block">
                    💸 Despesas Totais de Vida
                  </span>
                  <p className="text-base font-bold font-mono">-{proceduralTimeskipResult.totalExpenses} eb</p>
                </div>
                <div className={`p-3.5 rounded-xl border space-y-1 ${
                  proceduralTimeskipResult.finalNetBalance >= 0
                    ? 'bg-cyan-950/20 border-cyan-800/40 text-cyan-200'
                    : 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                }`}>
                  <span className="text-[10px] font-mono uppercase font-bold block">
                    ⚖️ Saldo Líquido Final
                  </span>
                  <p className="text-base font-bold font-mono">
                    {proceduralTimeskipResult.finalNetBalance >= 0 ? `+${proceduralTimeskipResult.finalNetBalance} eb` : `${proceduralTimeskipResult.finalNetBalance} eb`}
                  </p>
                </div>
              </div>

              {/* Month by Month Chronicles */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                  Linha do Tempo Mês a Mês ({proceduralTimeskipResult.monthsCount} Meses):
                </span>
                {proceduralTimeskipResult.monthlyChronicles.map(m => (
                  <div key={m.month} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/60 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                          MÊS {m.month}
                        </span>
                        <span className="text-xs font-bold text-zinc-100">{m.hustleTitle}</span>
                        <span className="text-[10px] font-mono text-zinc-500">(1d6: [{m.hustleRoll}])</span>
                      </div>
                      <span className={`text-[11px] font-mono font-bold ${
                        m.netMonthBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        Saldo: {m.netMonthBalance >= 0 ? `+${m.netMonthBalance}` : m.netMonthBalance} eb
                      </span>
                    </div>

                    <p className="text-zinc-300 text-[11px] leading-relaxed">{m.hustleDesc}</p>

                    {m.complication && (
                      <div className="p-2 rounded bg-amber-950/20 border border-amber-800/30 text-amber-300 text-[11px] italic">
                        ⚠️ Complicação nas Ruas: {m.complication}
                      </div>
                    )}

                    {m.lifeEvent && (
                      <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 text-[11px] space-y-0.5">
                        <div className="flex items-center justify-between">
                          <strong className="text-cyan-300 font-mono">🎲 Evento de Vida: {m.lifeEvent.title}</strong>
                          <span className="text-[9px] font-mono text-zinc-500 uppercase">{m.lifeEvent.category}</span>
                        </div>
                        <p className="text-zinc-400 text-[10px]">{m.lifeEvent.description}</p>
                        <p className="text-amber-300 text-[10px] font-mono font-semibold pt-0.5">
                          Impacto: {m.lifeEvent.mechanicalImpact}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* City Shift and Reputation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3.5 rounded-xl bg-[#121217] border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block font-bold">
                    🏙️ Mudança no Cenário de Night City:
                  </span>
                  <p className="text-zinc-300 text-[11px] leading-relaxed">{proceduralTimeskipResult.cityShift}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#121217] border border-zinc-800 space-y-1">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block font-bold">
                    ⭐ Impacto na Reputação:
                  </span>
                  <p className="text-amber-300 text-[11px] leading-relaxed">{proceduralTimeskipResult.reputationImpact}</p>
                </div>
              </div>
            </div>
          )}

          {/* RESULT 2: AI NARRATIVE CHRONICLE (GEMINI) */}
          {timeskipMode === 'ai' && timeskipAIResult && (
            <div className="p-6 rounded-2xl bg-[#0a0a0d] border border-[#27272a] space-y-4 text-xs font-sans animate-in fade-in duration-150">
              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-cyan-200 leading-relaxed">
                <strong className="text-cyan-400 font-mono block mb-1">Resumo do Intervalo:</strong>
                {timeskipAIResult.summary}
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">
                  Eventos Mês a Mês:
                </span>
                {timeskipAIResult.monthlyEvents?.map((m: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-zinc-100 font-mono">Mês {m.month}: {m.eventTitle}</strong>
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">{m.narrative}</p>
                    <div className="text-[10px] font-mono text-emerald-400 pt-1">
                      Resultado Mecânico: {m.mechanicalResult}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 rounded-xl bg-[#121217] border border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Mudança no Cenário da Cidade:</span>
                  <p className="text-zinc-300 text-[11px]">{timeskipAIResult.cityShift}</p>
                </div>
                <div className="p-3 rounded-xl bg-[#121217] border border-zinc-800">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Impacto na Reputação:</span>
                  <p className="text-amber-300 text-[11px]">{timeskipAIResult.reputationImpact}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ABA 4: DIÁRIOS MULTI-ABAS EM MARKDOWN COM IMAGENS        */}

      {/* ======================================================== */}

      {activeTab === 'diaries' && (

        <div className="space-y-4">

          {/* Top Tabs Bar */}

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#27272a] pb-2">

            <div className="flex flex-wrap items-center gap-1.5">

              {diaries.map(tab => (

                <button

                  key={tab.id}

                  onClick={() => setActiveDiaryId(tab.id)}

                  className={`px-3 py-1.5 rounded-xl text-xs font-medium font-mono transition flex items-center gap-2 ${

                    activeDiaryId === tab.id

                      ? 'bg-zinc-800 text-amber-300 border border-amber-500/50 shadow-sm'

                      : 'bg-[#121217] text-zinc-400 hover:text-zinc-200 border border-zinc-800'

                  }`}

                >

                  <BookOpen className="w-3.5 h-3.5" />

                  <span>{tab.title}</span>

                </button>

              ))}



              <button

                onClick={handleAddNewDiaryTab}

                className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-mono flex items-center gap-1 transition"

                title="Adicionar Nova Aba de Diário"

              >

                <Plus className="w-3.5 h-3.5 text-emerald-400" />

                <span>Nova Aba</span>

              </button>

            </div>



            <div className="flex items-center gap-2">

              {/* Write vs Preview Toggle */}

              <div className="flex items-center bg-[#14141a] border border-[#27272a] rounded-lg p-0.5 text-xs font-mono">

                <button

                  onClick={() => setDiaryMode('write')}

                  className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${

                    diaryMode === 'write' ? 'bg-zinc-800 text-zinc-100 font-bold' : 'text-zinc-400'

                  }`}

                >

                  <Edit className="w-3 h-3" />

                  <span>Editar</span>

                </button>

                <button

                  onClick={() => setDiaryMode('preview')}

                  className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${

                    diaryMode === 'preview' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400'

                  }`}

                >

                  <Eye className="w-3 h-3" />

                  <span>Visualizar</span>

                </button>

              </div>



              {diaries.length > 1 && (

                <button

                  onClick={handleDeleteCurrentDiaryTab}

                  className="p-1.5 rounded-lg bg-zinc-900 text-zinc-500 hover:text-red-400 border border-zinc-800"

                  title="Excluir Esta Aba de Diário"

                >

                  <Trash2 className="w-3.5 h-3.5" />

                </button>

              )}

            </div>

          </div>



          {/* Diary Editor & Preview Workspace */}

          {currentDiary && (

            <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4 shadow-sm">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27272a] pb-3">

                <input

                  type="text"

                  value={currentDiary.title}

                  onChange={e =>

                    setDiaries(prev =>

                      prev.map(d => (d.id === activeDiaryId ? { ...d, title: e.target.value } : d))

                    )

                  }

                  className="bg-transparent font-bold text-base text-zinc-100 focus:outline-none focus:border-b focus:border-amber-500 w-full sm:w-80"

                />

                <span className="text-[10px] font-mono text-zinc-500">

                  Atualizado em: {currentDiary.updatedAt}

                </span>

              </div>



              {/* Markdown Toolbar (visible in write mode) */}

              {diaryMode === 'write' && (

                <div className="flex flex-wrap items-center gap-1 p-1.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 text-zinc-400">

                  <button

                    onClick={() => insertMarkdown('**', '**')}

                    className="p-1.5 rounded hover:bg-zinc-800 hover:text-zinc-200"

                    title="Negrito"

                  >

                    <Bold className="w-3.5 h-3.5" />

                  </button>

                  <button

                    onClick={() => insertMarkdown('*', '*')}

                    className="p-1.5 rounded hover:bg-zinc-800 hover:text-zinc-200"

                    title="Itálico"

                  >

                    <Italic className="w-3.5 h-3.5" />

                  </button>

                  <button

                    onClick={() => insertMarkdown('### ')}

                    className="px-2 py-1 rounded text-[11px] font-mono hover:bg-zinc-800 hover:text-zinc-200"

                    title="Título H3"

                  >

                    H3

                  </button>

                  <button

                    onClick={() => insertMarkdown('- ')}

                    className="p-1.5 rounded hover:bg-zinc-800 hover:text-zinc-200"

                    title="Lista"

                  >

                    <List className="w-3.5 h-3.5" />

                  </button>

                  <button

                    onClick={() => insertMarkdown('> ')}

                    className="p-1.5 rounded hover:bg-zinc-800 hover:text-zinc-200"

                    title="Citação"

                  >

                    <Quote className="w-3.5 h-3.5" />

                  </button>

                  <button

                    onClick={() => insertMarkdown('---')}

                    className="p-1.5 rounded hover:bg-zinc-800 hover:text-zinc-200"

                    title="Linha Divisória"

                  >

                    <Minus className="w-3.5 h-3.5" />

                  </button>

                  <button

                    onClick={() => insertMarkdown('![Legenda da Imagem](https://link-da-imagem.jpg)')}

                    className="p-1.5 rounded hover:bg-zinc-800 hover:text-zinc-200 flex items-center gap-1 text-[11px] font-mono"

                    title="Inserir Imagem por URL"

                  >

                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />

                    <span>Imagem</span>

                  </button>

                </div>

              )}



              {/* Textarea or Preview */}

              {diaryMode === 'write' ? (

                <textarea

                  value={currentDiary.content}

                  onChange={e => updateCurrentDiaryContent(e.target.value)}

                  rows={18}

                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-4 text-xs font-mono text-zinc-200 leading-relaxed focus:outline-none focus:border-amber-500"

                />

              ) : (

                <div className="p-6 rounded-xl bg-[#0a0a0d] border border-zinc-800/80 min-h-[400px] space-y-1 font-sans">

                  {renderMarkdownPreview(currentDiary.content)}

                </div>

              )}



              <div className="flex items-center justify-between pt-2 border-t border-[#27272a] text-[10px] font-mono text-zinc-500">

                <span>Salvo automaticamente no armazenamento local.</span>

                <button

                  onClick={() => {

                    const blob = new Blob([currentDiary.content], { type: 'text/markdown' });

                    const url = URL.createObjectURL(blob);

                    const link = document.createElement('a');

                    link.href = url;

                    link.download = `${currentDiary.title.replace(/\s+/g, '_')}.md`;

                    link.click();

                    URL.revokeObjectURL(url);

                  }}

                  className="flex items-center gap-1 hover:text-zinc-300"

                >

                  <Download className="w-3 h-3" />

                  <span>Baixar como .md</span>

                </button>

              </div>

            </div>

          )}

        </div>

      )}



      {/* ======================================================== */}

      {/* ABA 5: RECOMPENSAS DE FIM DE SESSÃO & PROGRESSÃO (IP)    */}

      {/* ======================================================== */}

      {activeTab === 'rewards' && (

        <div className="space-y-6">

          {/* Toast Notification */}

          {rewardsToast && (

            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-mono text-xs flex items-center justify-between shadow-lg shadow-emerald-950/40 animate-pulse">

              <span className="flex items-center gap-2">

                <Award className="w-4 h-4 text-emerald-400" />

                {rewardsToast}

              </span>

              <button onClick={() => setRewardsToast(null)} className="text-zinc-400 hover:text-zinc-100">

                &times;

              </button>

            </div>

          )}



          {/* Top Banner & Quick Reference Guide */}

          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#121217] via-[#16161f] to-[#121217] border border-[#27272a] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

            <div>

              <div className="flex items-center gap-2">

                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">

                  Cyberpunk RED Core Rulebook (p. 410-412)

                </span>

                <span className="text-[10px] font-mono text-zinc-500">Debriefing & Progressão</span>

              </div>

              <h2 className="text-lg font-bold text-zinc-100 mt-1 flex items-center gap-2">

                <Award className="w-5 h-5 text-emerald-400" />

                <span>Gerador de Recompensas de Fim de Sessão</span>

              </h2>

              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">

                Calcule os <strong>Pontos de Investimento (IP)</strong> para a evolução de perícias e habilidades de papel dos jogadores, remuneração em Eurodólares (eb), mudanças de Reputação e saques raros através das tabelas canônicas ou com a inteligência do Co-GM.

              </p>

            </div>



            <button

              onClick={() => setShowProgressionRulesModal(true)}

              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-cyan-300 border border-zinc-700 font-mono text-xs flex items-center gap-2 transition shrink-0"

            >

              <HelpCircle className="w-4 h-4 text-cyan-400" />

              <span>Como Gastar IP (Tabela)</span>

            </button>

          </div>



          {/* Main 2-Column Responsive Workspace */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Column (5 cols): Session Inputs & Tags */}

            <div className="lg:col-span-5 space-y-5">

              {/* Session Identification Card */}

              <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">

                <h3 className="text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">

                  <BookmarkCheck className="w-4 h-4 text-emerald-400" /> 1. Identificação do Trabalho

                </h3>



                <div className="space-y-3">

                  <div>

                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Título da Sessão / Contrato:</label>

                    <input

                      type="text"

                      value={sessionTitle}

                      onChange={e => setSessionTitle(e.target.value)}

                      placeholder="Ex: Operação 02: Resgate em Watson"

                      className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"

                    />

                  </div>



                  <div>

                    <label className="text-[11px] font-mono text-zinc-400 block mb-1">Fixer / Contratante (Opcional):</label>

                    <input

                      type="text"

                      value={fixerName}

                      onChange={e => setFixerName(e.target.value)}

                      placeholder="Ex: Fixer Vee, Padre, Rogue"

                      className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-emerald-500"

                    />

                  </div>

                </div>

              </div>



              {/* Difficulty / Scope Card */}

              <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">

                <h3 className="text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">

                  <Target className="w-4 h-4 text-cyan-400" /> 2. Escala & Nível de Risco do Trabalho

                </h3>



                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">

                  {Object.values(SESSION_DIFFICULTY_TIERS).map(tier => {

                    const isSelected = sessionDifficultyId === tier.id;

                    return (

                      <button

                        key={tier.id}

                        type="button"

                        onClick={() => setSessionDifficultyId(tier.id)}

                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${

                          isSelected

                            ? 'bg-emerald-950/30 border-emerald-500 text-emerald-200'

                            : 'bg-[#0a0a0d] border-zinc-800/80 hover:border-zinc-700 text-zinc-400'

                        }`}

                      >

                        <div>

                          <div className="flex items-center justify-between">

                            <span className="text-xs font-bold text-zinc-200 block truncate">{tier.name.split('/')[0]}</span>

                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold ${

                              isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'

                            }`}>

                              {tier.badge}

                            </span>

                          </div>

                          <p className="text-[10px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">

                            {tier.description}

                          </p>

                        </div>

                      </button>

                    );

                  })}

                </div>

              </div>



              {/* Mission Outcome Card */}

              <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">

                <h3 className="text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">

                  <CheckSquare className="w-4 h-4 text-amber-400" /> 3. Desfecho dos Objetivos Contratados

                </h3>



                <div className="space-y-2">

                  {Object.values(MISSION_OUTCOMES).map(outcome => {

                    const isSelected = missionOutcomeId === outcome.id;

                    return (

                      <button

                        key={outcome.id}

                        type="button"

                        onClick={() => setMissionOutcomeId(outcome.id)}

                        className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between text-xs ${

                          isSelected

                            ? `${outcome.badgeColor} border-current font-bold`

                            : 'bg-[#0a0a0d] border-zinc-800/80 hover:border-zinc-700 text-zinc-400'

                        }`}

                      >

                        <div>

                          <span className="block text-zinc-200">{outcome.name}</span>

                          <span className="text-[10px] text-zinc-500 font-normal">{outcome.description}</span>

                        </div>

                        {isSelected && <Check className="w-4 h-4 shrink-0 ml-2" />}

                      </button>

                    );

                  })}

                </div>

              </div>



              {/* Session Evaluation Tags */}

              <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">

                <div className="flex items-center justify-between">

                  <h3 className="text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">

                    <Star className="w-4 h-4 text-purple-400" /> 4. Critérios & Acontecimentos Marcantes

                  </h3>

                  <span className="text-[10px] font-mono text-emerald-400 font-bold">

                    {selectedTagIds.length} selecionadas

                  </span>

                </div>



                {/* Tag Category Filter */}

                <div className="flex flex-wrap items-center gap-1 bg-[#0a0a0d] p-1 rounded-xl border border-zinc-800 text-[10px] font-mono">

                  {[

                    { id: 'all', label: 'Todas' },

                    { id: 'objective', label: 'Objetivos' },

                    { id: 'threat', label: 'Ameaça/Luta' },

                    { id: 'roleplay', label: 'Roleplay' },

                    { id: 'tactics', label: 'Táticas' },

                    { id: 'impact', label: 'Impacto' },

                  ].map(f => (

                    <button

                      key={f.id}

                      type="button"

                      onClick={() => setTagCategoryFilter(f.id as any)}

                      className={`px-2 py-1 rounded-lg transition shrink-0 ${

                        tagCategoryFilter === f.id

                          ? 'bg-zinc-800 text-zinc-100 font-bold'

                          : 'text-zinc-500 hover:text-zinc-300'

                      }`}

                    >

                      {f.label}

                    </button>

                  ))}

                </div>



                {/* Tag Pills List */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">

                  {SESSION_REWARD_TAGS.filter(t => tagCategoryFilter === 'all' || t.category === tagCategoryFilter).map(tag => {

                    const isSelected = selectedTagIds.includes(tag.id);

                    return (

                      <button

                        key={tag.id}

                        type="button"

                        onClick={() => toggleRewardTag(tag.id)}

                        className={`p-2 rounded-xl border text-left text-xs transition flex flex-col justify-between ${

                          isSelected

                            ? 'bg-emerald-950/30 border-emerald-500/70 text-emerald-200'

                            : 'bg-[#0a0a0d] border-zinc-800/80 hover:border-zinc-700 text-zinc-400'

                        }`}

                        title={tag.description}

                      >

                        <div className="flex items-start justify-between gap-1">

                          <span className="text-[11px] font-medium leading-tight">{tag.label}</span>

                          <span className={`text-[9px] font-mono px-1 py-0.5 rounded shrink-0 font-bold ${

                            isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-500'

                          }`}>

                            +{tag.ipBonus} IP

                          </span>

                        </div>

                        {tag.ebBonus > 0 && (

                          <span className="text-[9px] font-mono text-amber-400 block mt-1">+{tag.ebBonus} eb</span>

                        )}

                      </button>

                    );

                  })}

                </div>

              </div>



              {/* Freeform Narrative Description */}

              <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">

                <div className="flex items-center justify-between">

                  <h3 className="text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">

                    <FileText className="w-4 h-4 text-cyan-400" /> 5. Relato Narrativo dos Feitos (Para o Co-GM)

                  </h3>

                  <button

                    type="button"

                    onClick={() => {

                      setSessionDescription(

                        'A equipe invadiu o complexo de testes da Biotechnica nos Badlands sob tempestade de poeira ácida. O Solo desativou dois drones de combate com tiros de sniper perfurantes enquanto a Netrunner realizou uma corrida NET de 4 andares destruindo um Black ICE Hellhound. No cofre, descobriram que a carga continha um cientista desertor com ferimentos críticos e o Medtech realizou uma cirurgia de emergência no furgão salvando sua vida.'

                      );

                    }}

                    className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 underline"

                  >

                    Preencher Exemplo

                  </button>

                </div>



                <textarea

                  value={sessionDescription}

                  onChange={e => setSessionDescription(e.target.value)}

                  rows={4}

                  placeholder="Descreva as decisões marcantes, hacks, tiroteios, dilemas morais e momentos épicos da sessão para que o Co-GM elabore o relatório completo..."

                  className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 font-mono focus:outline-none focus:border-emerald-500 leading-relaxed"

                />



                {/* Action Buttons */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">

                  <button

                    type="button"

                    onClick={handleCalculateOffline}

                    disabled={isCalculatingRewards || isAiCalculatingRewards}

                    className="py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 font-mono text-xs font-bold flex items-center justify-center gap-2 transition"

                  >

                    <Zap className="w-3.5 h-3.5 text-cyan-400" />

                    <span>Calcular por Tabelas (Offline)</span>

                  </button>



                  <button

                    type="button"

                    onClick={handleCalculateAI}

                    disabled={isCalculatingRewards || isAiCalculatingRewards}

                    className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition shadow-md shadow-emerald-950/40"

                  >

                    {isAiCalculatingRewards ? (

                      <>

                        <RotateCcw className="w-3.5 h-3.5 animate-spin text-white" />

                        <span>Avaliando Sessão...</span>

                      </>

                    ) : (

                      <>

                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />

                        <span>Avaliar com IA Co-GM</span>

                      </>

                    )}

                  </button>

                </div>

              </div>

            </div>



            {/* Right Column (7 cols): Calculated Rewards Dashboard */}

            <div className="lg:col-span-7 space-y-5">

              {rewardResult ? (

                <>

                  {/* HERO REWARD CARDS */}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

                    {/* IP Card */}

                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-[#121217] to-[#121217] border border-emerald-500/50 shadow-lg shadow-emerald-950/30 flex flex-col justify-between">

                      <div className="flex items-center justify-between">

                        <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Investimento</span>

                        <Award className="w-4 h-4 text-emerald-400" />

                      </div>

                      <div className="my-2">

                        <div className="text-3xl font-extrabold font-mono text-emerald-400 flex items-baseline gap-1">

                          <span>+{rewardResult.totalIP}</span>

                          <span className="text-sm font-sans text-emerald-500 font-semibold">IP</span>

                        </div>

                        <span className="text-[10px] text-zinc-400 block font-mono">Por jogador da mesa</span>

                      </div>

                      <div className="text-[9px] font-mono text-zinc-500 border-t border-emerald-900/40 pt-1.5">

                        Base: {rewardResult.ipBreakdown.base} | Bônus: +{rewardResult.ipBreakdown.objectivesBonus + rewardResult.ipBreakdown.threatBonus + rewardResult.ipBreakdown.roleplayBonus + rewardResult.ipBreakdown.tacticsBonus}

                      </div>

                    </div>



                    {/* Cash Card */}

                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-[#121217] to-[#121217] border border-amber-500/50 shadow-lg shadow-amber-950/30 flex flex-col justify-between">

                      <div className="flex items-center justify-between">

                        <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Pagamento</span>

                        <DollarSign className="w-4 h-4 text-amber-400" />

                      </div>

                      <div className="my-2">

                        <div className="text-3xl font-extrabold font-mono text-amber-400 flex items-baseline gap-1">

                          <span>+{rewardResult.cashEbPerPlayer}</span>

                          <span className="text-sm font-sans text-amber-500 font-semibold">eb</span>

                        </div>

                        <span className="text-[10px] text-zinc-400 block font-mono">Por Edgerunner</span>

                      </div>

                      <div className="text-[9px] font-mono text-zinc-500 border-t border-amber-900/40 pt-1.5 truncate">

                        Total Grupo: {rewardResult.totalGroupCashEb} eb

                      </div>

                    </div>



                    {/* Reputation Card */}

                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-[#121217] to-[#121217] border border-purple-500/50 shadow-lg shadow-purple-950/30 flex flex-col justify-between">

                      <div className="flex items-center justify-between">

                        <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">Reputação</span>

                        <Trophy className="w-4 h-4 text-purple-400" />

                      </div>

                      <div className="my-2">

                        <div className="text-3xl font-extrabold font-mono text-purple-400 flex items-baseline gap-1">

                          <span>+{rewardResult.reputationChange}</span>

                          <span className="text-sm font-sans text-purple-500 font-semibold">Rep</span>

                        </div>

                        <span className="text-[10px] text-zinc-400 block font-mono">Impacto em Night City</span>

                      </div>

                      <div className="text-[9px] font-mono text-zinc-500 border-t border-purple-900/40 pt-1.5 truncate">

                        {rewardResult.reputationChange > 0 ? 'Notícia no CitiNet' : 'Operação Encoberta'}

                      </div>

                    </div>

                  </div>



                  {/* Screamsheet News Article Box */}

                  <div className="p-5 rounded-2xl bg-[#0e0e13] border border-zinc-800 space-y-2 relative overflow-hidden">

                    <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-mono px-3 py-0.5 uppercase tracking-widest font-bold">

                      Data Pool Screamsheet

                    </div>

                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">

                      Noticiário Urbano de Night City // Edição Extra

                    </span>

                    <h4 className="text-sm font-bold font-mono text-red-400 uppercase tracking-tight">

                      {rewardResult.screamsheetHeadline}

                    </h4>

                    <p className="text-xs text-zinc-300 leading-relaxed font-sans italic border-l-2 border-red-500/40 pl-3">

                      "{rewardResult.screamsheetArticle}"

                    </p>

                  </div>



                  {/* Special Salvage & Loot Cards */}

                  <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">

                    <div className="flex items-center justify-between">

                      <h4 className="text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">

                        <Gift className="w-4 h-4 text-emerald-400" /> Saques Especiais, Shards & Favores Recuperados

                      </h4>

                      <span className="text-[10px] font-mono text-zinc-500">{rewardResult.specialLoot.length} itens</span>

                    </div>



                    <div className="grid grid-cols-1 gap-2.5">

                      {rewardResult.specialLoot.map(item => (

                        <div key={item.id} className="p-3 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1">

                          <div className="flex items-center justify-between">

                            <strong className="text-xs text-zinc-200">{item.name}</strong>

                            <div className="flex items-center gap-2">

                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-400">

                                {item.category}

                              </span>

                              <span className="text-xs font-mono text-amber-400 font-bold">{item.valueEb} eb</span>

                            </div>

                          </div>

                          <p className="text-[11px] text-zinc-400 leading-relaxed">{item.description}</p>

                          <div className="text-[10px] font-mono text-emerald-400 pt-0.5 flex items-center gap-1">

                            <Zap className="w-3 h-3 shrink-0" />

                            <span>Efeito: {item.mechanicalEffect}</span>

                          </div>

                        </div>

                      ))}

                    </div>

                  </div>



                  {/* MVP Moments & Next Session Hooks */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className="p-4 rounded-xl bg-[#121217] border border-[#27272a] space-y-2">

                      <span className="text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">

                        <Trophy className="w-3.5 h-3.5 text-amber-400" /> Destaques Operacionais (MVP)

                      </span>

                      <ul className="space-y-1 text-xs text-zinc-300">

                        {rewardResult.mvpHighlights.map((m, idx) => (

                          <li key={idx} className="flex items-start gap-1.5">

                            <span className="text-amber-400 text-xs shrink-0">•</span>

                            <span>{m}</span>

                          </li>

                        ))}

                      </ul>

                    </div>



                    <div className="p-4 rounded-xl bg-[#121217] border border-[#27272a] space-y-2">

                      <span className="text-xs font-mono uppercase text-zinc-400 font-semibold flex items-center gap-1.5">

                        <Compass className="w-3.5 h-3.5 text-cyan-400" /> Ganchos para a Próxima Sessão

                      </span>

                      <ul className="space-y-1 text-xs text-zinc-300">

                        {rewardResult.nextSessionHooks.map((h, idx) => (

                          <li key={idx} className="flex items-start gap-1.5">

                            <span className="text-cyan-400 text-xs shrink-0">&rarr;</span>

                            <span>{h}</span>

                          </li>

                        ))}

                      </ul>

                    </div>

                  </div>



                  {/* Co-GM Narrative Verdict */}

                  <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 leading-relaxed space-y-1">

                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block flex items-center gap-1">

                      <Bot className="w-3.5 h-3.5" /> Veredito do Co-GM

                    </span>

                    <p className="italic text-zinc-300">{rewardResult.coGMVerdict}</p>

                  </div>



                  {/* DISTRIBUTION PANEL TO PARTY CHARACTERS */}

                  <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-[#121217] to-zinc-900 border border-emerald-500/40 space-y-4">

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">

                      <div>

                        <h4 className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">

                          <Users className="w-4 h-4 text-emerald-400" /> Conceder Recompensas aos Jogadores da Mesa

                        </h4>

                        <p className="text-[11px] text-zinc-400 mt-0.5">

                          Selecione os edgerunners presentes para creditar os <strong>+{rewardResult.totalIP} IP</strong> e <strong>+{rewardResult.cashEbPerPlayer} eb</strong> diretamente em suas fichas.

                        </p>

                      </div>



                      <button

                        type="button"

                        onClick={selectAllCharacters}

                        className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline shrink-0"

                      >

                        {selectedCharacterIds.length === playerCharacters.length ? 'Desmarcar Todos' : 'Selecionar Todos'}

                      </button>

                    </div>



                    {/* Character Selection Cards */}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">

                      {playerCharacters.map(pc => {

                        const isChecked = selectedCharacterIds.includes(pc.id);

                        return (

                          <button

                            key={pc.id}

                            type="button"

                            onClick={() => toggleCharacterSelection(pc.id)}

                            className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${

                              isChecked

                                ? 'bg-emerald-950/40 border-emerald-500 text-emerald-200'

                                : 'bg-[#0a0a0d] border-zinc-800 text-zinc-500 hover:text-zinc-300'

                            }`}

                          >

                            <div className="truncate">

                              <strong className="text-xs text-zinc-200 block truncate">{pc.name}</strong>

                              <span className="text-[10px] font-mono text-zinc-400 block">{pc.role} &bull; {pc.handle}</span>

                              <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500 mt-1">

                                <span className="text-emerald-400">{pc.improvementPoints ?? 0} IP</span>

                                <span>&bull;</span>

                                <span className="text-amber-400">{pc.cashEb ?? 0} eb</span>

                              </div>

                            </div>

                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-2 ${

                              isChecked ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-zinc-700 bg-zinc-900'

                            }`}>

                              {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}

                            </div>

                          </button>

                        );

                      })}

                    </div>



                    {/* Action Bar */}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">

                      <div className="flex items-center gap-2">

                        <button

                          type="button"

                          onClick={handleSaveToDiaries}

                          className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-zinc-700 font-mono text-xs flex items-center gap-1.5 transition"

                          title="Criar uma nova aba nos Diários da Campanha com este relatório completo"

                        >

                          <BookOpen className="w-3.5 h-3.5 text-amber-400" />

                          <span>Salvar no Diário (.md)</span>

                        </button>

                        <button

                          type="button"

                          onClick={handleCopyReport}

                          className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 font-mono text-xs flex items-center gap-1.5 transition"

                          title="Copiar texto formatado para o Discord da mesa"

                        >

                          <Copy className="w-3.5 h-3.5 text-cyan-400" />

                          <span>Copiar (Discord/Zap)</span>

                        </button>

                      </div>



                      <button

                        type="button"

                        onClick={handleDistributeToPlayers}

                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-2 transition shadow-md shadow-emerald-950/50"

                      >

                        <Gift className="w-4 h-4 text-emerald-100" />

                        <span>Distribuir IP & Eddies aos {selectedCharacterIds.length} Jogadores</span>

                      </button>

                    </div>

                  </div>

                </>

              ) : (

                <div className="p-12 rounded-2xl bg-[#121217] border border-dashed border-zinc-800 text-center space-y-3">

                  <Award className="w-10 h-10 text-zinc-600 mx-auto" />

                  <h4 className="text-sm font-bold text-zinc-300 font-mono">Nenhuma Recompensa Calculada Ainda</h4>

                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">

                    Selecione o escopo, desfecho e tags da sessão na coluna à esquerda e clique em <strong>"Calcular por Tabelas"</strong> ou <strong>"Avaliar com IA Co-GM"</strong>.

                  </p>

                </div>

              )}

            </div>

          </div>



          {/* MODAL: TABELA OFICIAL DE REGRAS DE PROGRESSÃO COM IP */}

          {showProgressionRulesModal && (

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">

              <div className="bg-[#121217] border border-zinc-700 rounded-2xl max-w-3xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto font-sans shadow-2xl">

                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">

                  <div className="flex items-center gap-2">

                    <Award className="w-5 h-5 text-emerald-400" />

                    <h3 className="text-base font-bold text-zinc-100 font-mono">

                      Tabela Oficial de Custos de IP (Cyberpunk RED p. 411)

                    </h3>

                  </div>

                  <button

                    onClick={() => setShowProgressionRulesModal(false)}

                    className="text-zinc-400 hover:text-zinc-100 text-sm font-mono px-2 py-1 rounded bg-zinc-800"

                  >

                    Fechar &times;

                  </button>

                </div>



                <p className="text-xs text-zinc-400 leading-relaxed">

                  Os jogadores acumulam <strong>Pontos de Investimento (IP)</strong> ao final de cada sessão. Esses pontos são investidos diretamente para subir o nível de perícias ou da sua Habilidade de Papel (Role Ability).

                </p>



                <div className="space-y-4">

                  {IP_PROGRESSION_RULES.map((rule, idx) => (

                    <div key={idx} className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">

                      <div className="flex items-center justify-between">

                        <strong className="text-xs font-bold text-emerald-400 font-mono">{rule.category}</strong>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-cyan-300 font-bold">

                          {rule.costFormula}

                        </span>

                      </div>

                      <p className="text-[11px] text-zinc-400">{rule.notes}</p>



                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 font-mono text-xs">

                        {rule.examples.map((ex, exIdx) => (

                          <div key={exIdx} className="p-2 rounded bg-zinc-900 border border-zinc-800/80 text-center">

                            <span className="text-[10px] text-zinc-500 block">{ex.fromTo}</span>

                            <strong className="text-emerald-400">{ex.costIP} IP</strong>

                          </div>

                        ))}

                      </div>

                    </div>

                  ))}

                </div>



                <div className="pt-3 border-t border-zinc-800 flex justify-end">

                  <button

                    onClick={() => setShowProgressionRulesModal(false)}

                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono"

                  >

                    Entendido

                  </button>

                </div>

              </div>

            </div>

          )}

        </div>

      )}

    </div>

  );

};

