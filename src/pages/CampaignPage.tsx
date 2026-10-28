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
} from 'lucide-react';
import { BEAT_CHART_STRUCTURE, SCENE_IMPROV_DATA, ROLE_HUSTLES, RANDOM_LIFE_EVENTS, RoleHustleTier } from '../data/campaignData';
import { useUserRole } from '../context/UserRoleContext';
import { NIGHT_CITY_DISTRICTS } from '../data/mapData';
import {
  generateAICampaignBeatChart,
  generateAISceneImprov,
  generateAITimeskipDowntime,
} from '../services/aiService';

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
  } = useUserRole();

  const [activeTab, setActiveTab] = useState<'beat-chart' | 'improv' | 'timeskip' | 'diaries'>('beat-chart');

  // BEAT CHART STATE
  const [beatThemeInput, setBeatThemeInput] = useState<string>('Infiltração em laboratório subterrâneo da Biotechnica');
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
  const [selectedZone, setSelectedZone] = useState<string>('Zona de Combate');
  const [improvSituation, setImprovSituation] = useState<string>('Investigando um beco escuro após ouvirem tiros de supressão.');
  const [isAiImprovLoading, setIsAiImprovLoading] = useState<boolean>(false);
  const [generatedScene, setGeneratedScene] = useState<any | null>(null);

  // TIMESKIP STATE
  const [timeskipMonths, setTimeskipMonths] = useState<number>(2);
  const [timeskipLifestyle, setTimeskipLifestyle] = useState<string>('Pré-embalado Genérico e Contêiner de Carga (1.300eb/mês)');
  const [isAiTimeskipLoading, setIsAiTimeskipLoading] = useState<boolean>(false);
  const [timeskipAIResult, setTimeskipAIResult] = useState<any | null>(null);

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
    } finally {
      setIsAiBeatLoading(false);
    }
  };

  // AI Scene Improv Generator
  const handleGenerateAIImprov = async () => {
    setIsAiImprovLoading(true);
    try {
      const res = await generateAISceneImprov(selectedZone, improvSituation);
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
    } finally {
      setIsAiImprovLoading(false);
    }
  };

  // AI Timeskip Simulator
  const handleGenerateAITimeskip = async () => {
    setIsAiTimeskipLoading(true);
    try {
      const res = await generateAITimeskipDowntime(
        timeskipMonths,
        timeskipLifestyle,
        ['Solo', 'Netrunner', 'Tech', 'Fixer']
      );
      setTimeskipAIResult(res);
    } catch (e) {
      console.error(e);
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
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
        <div className="flex items-center gap-1 bg-[#14141a] border border-[#27272a] rounded-xl p-1 text-xs font-medium overflow-x-auto no-scrollbar max-w-full whitespace-nowrap">
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
        </div>
      </div>

      {/* ======================================================== */}
      {/* ABA 1: BEAT CHART DE AVENTURAS COM IA                   */}
      {/* ======================================================== */}
      {activeTab === 'beat-chart' && (
        <div className="space-y-6">
          {/* AI Generation Control Bar */}
          <div className="p-4 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Tema ou gancho da aventura (ex: Roubo de protótipo de AV da Trauma Team, vingança contra o Maelstrom...)"
                value={beatThemeInput}
                onChange={e => setBeatThemeInput(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl px-3.5 py-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleGenerateAIBeatChart}
                disabled={isAiBeatLoading}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold shrink-0 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAiBeatLoading ? 'Gerando com IA...' : '⚡ Gerar Beat Chart com IA'}</span>
              </button>
            </div>
          </div>

          {/* 6 Beats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BEAT_CHART_STRUCTURE.map(beat => (
              <div
                key={beat.beatType}
                className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3 flex flex-col justify-between hover:border-zinc-700 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
                    <span className="text-xs font-bold text-zinc-100 font-mono">{beat.titlePt}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-cyan-400">
                      {beat.beatType}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {beat.objective}
                  </p>

                  <textarea
                    value={beatNotes[beat.beatType] || ''}
                    onChange={e => setBeatNotes({ ...beatNotes, [beat.beatType]: e.target.value })}
                    rows={6}
                    className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-2.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="text-[10px] font-mono text-zinc-500 italic">
                  💡 Dica do Mestre: {beat.tips}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 2: IMPROVISO DE CENAS COM IA                        */}
      {/* ======================================================== */}
      {activeTab === 'improv' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
            <h3 className="text-xs font-mono uppercase text-zinc-300 font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Gerador de Cena & Improviso</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Zona / Distrito:</label>
                <select
                  value={selectedZone}
                  onChange={e => setSelectedZone(e.target.value)}
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-2.5 text-zinc-200 font-mono"
                >
                  <option value="Zona de Combate">Zona de Combate</option>
                  <option value="Centro Corporativo">Centro Corporativo</option>
                  <option value="Distrito Moderado / Subúrbio">Distrito Moderado / Subúrbio</option>
                  <option value="Badlands">Badlands / Deserto</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-400 block mb-1">Situação Inicial:</label>
                <textarea
                  value={improvSituation}
                  onChange={e => setImprovSituation(e.target.value)}
                  rows={3}
                  className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-2.5 text-zinc-200 text-xs font-mono"
                />
              </div>

              <button
                onClick={handleGenerateAIImprov}
                disabled={isAiImprovLoading}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>{isAiImprovLoading ? 'Gerando com IA...' : '⚡ Improvisar Cena com IA'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-8">
            {generatedScene ? (
              <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] space-y-5 shadow-lg">
                <div className="border-b border-[#27272a] pb-3">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                    Cena Gerada // {generatedScene.zone}
                  </span>
                  <h3 className="text-base font-bold text-zinc-100 mt-1">Quadro Sensorial Imediato</h3>
                </div>

                {/* 3 Sensory Dimensions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Visão (Sight)</span>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">{generatedScene.sensory.sight}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Audição (Sound)</span>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">{generatedScene.sensory.sound}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Olfato (Smell)</span>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">{generatedScene.sensory.smell}</p>
                  </div>
                </div>

                {/* Instant NPC with Visual Appearance */}
                {generatedScene.npc && (
                  <div className="p-4 rounded-xl bg-[#0a0a0d] border border-cyan-500/30 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="text-cyan-300 text-sm">
                        NPC Imediato: {generatedScene.npc.name} ({generatedScene.npc.role})
                      </strong>
                    </div>
                    {generatedScene.npc.visualAppearance && (
                      <p className="text-zinc-200 text-xs">
                        <strong className="text-zinc-400 font-mono">Aparência Visual:</strong> {generatedScene.npc.visualAppearance}
                      </p>
                    )}
                    <p className="text-zinc-300 text-[11px]">
                      <strong className="text-zinc-400 font-mono">Motivação:</strong> {generatedScene.npc.motivation}
                    </p>
                    {generatedScene.npc.dialogueHook && (
                      <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-amber-200 text-[11px] italic">
                        {generatedScene.npc.dialogueHook}
                      </div>
                    )}
                  </div>
                )}

                {/* Immediate Hazard & Sudden Twist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/40 text-red-200 space-y-1">
                    <strong className="text-red-400 font-mono block">Perigo Imediato:</strong>
                    <p>{generatedScene.obstacle}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-900/40 text-amber-200 space-y-1">
                    <strong className="text-amber-400 font-mono block">Reviravolta Repentina:</strong>
                    <p>{generatedScene.twist}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-[#121217] border border-dashed border-[#27272a] text-center space-y-2">
                <Sparkles className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs text-zinc-400">Nenhuma cena gerada no momento.</p>
                <p className="text-[11px] text-zinc-500">Selecione o local ao lado e clique em "Improvisar Cena com IA".</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ABA 3: TIMESKIP & DOWNTIME COM IA                       */}
      {/* ======================================================== */}
      {activeTab === 'timeskip' && (
        <div className="p-6 rounded-2xl bg-[#121217] border border-[#27272a] max-w-4xl mx-auto space-y-6">
          <div className="border-b border-[#27272a] pb-3">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-cyan-500" />
              <span>Simulador de Timeskip & Downtime com IA</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Simule meses de intervalo entre trabalhos com crônicas de sobrevivência, despesas e bicos de rua gerados pela IA.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
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

            <div>
              <label className="text-[10px] font-mono text-zinc-400 block mb-1">Estilo de Vida & Moradia:</label>
              <input
                type="text"
                value={timeskipLifestyle}
                onChange={e => setTimeskipLifestyle(e.target.value)}
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-2.5 text-zinc-200 font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateAITimeskip}
            disabled={isAiTimeskipLoading}
            className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Zap className="w-4 h-4" />
            <span>{isAiTimeskipLoading ? 'Calculando Crônica de Downtime...' : '⚡ Simular Passagem de Tempo com IA'}</span>
          </button>

          {timeskipAIResult && (
            <div className="p-6 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-4 text-xs font-sans">
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

      {/* ======================================================== */}
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
    </div>
  );
};
