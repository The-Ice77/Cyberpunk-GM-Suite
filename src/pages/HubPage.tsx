import React from 'react';
import {
  Users,
  MapPin,
  Compass,
  Crosshair,
  Network,
  BookOpen,
  ArrowRight,
  Shield,
  Zap,
  Activity,
  FileText,
  Sparkles,
  User,
  Library,
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { useCampaign } from '../context/CampaignContext';
import { useCombat } from '../context/CombatContext';
import { ActivePage } from '../components/layout/Sidebar';

interface HubPageProps {
  onNavigate: (page: ActivePage) => void;
  onOpenTarot?: () => void;
}

export const HubPage: React.FC<HubPageProps> = ({ onNavigate, onOpenTarot }) => {
  const { system, isRed, toggleSystem } = useSystem();
  const { savedNPCs, notes, setNotes } = useCampaign();
  const { combatants } = useCombat();

  const MODULE_CARDS: {
    id: ActivePage;
    number: string;
    title: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
    features: string[];
    tag: string;
  }[] = [
    {
      id: 'people',
      number: '01',
      title: 'Pessoas & Facções',
      subtitle: 'Inimigos, NPCs e Construtor de Fichas',
      description: 'Gerador automático por escalões (Mook a Ciberpsicopata) e facções oficiais (Maelstrom, Arasaka, Trauma Team, MaxTac). Construtor manual e biblioteca persistente.',
      icon: <Users className="w-5 h-5 text-red-500" />,
      features: ['Mooks, Tenentes e Chefes', 'Gangues, Corporações e Nômades', 'Fichas Completas RED & 2020'],
      tag: 'NPCs & Fichas',
    },
    {
      id: 'world',
      number: '02',
      title: 'Mundo & Night City',
      subtitle: 'Mapa, Clima, Encontros e Vida Noturna',
      description: 'Mapa vetorial interativo com tempos de resposta de polícia e trauma, simulador do DLC Night City Weather com penalidades exatas, tabelas d100 de rua, Digital Dating e Screamsheets.',
      icon: <MapPin className="w-5 h-5 text-amber-500" />,
      features: ['Mapa Distrital Interativo', 'Bases Táticas & Invasões', 'Clima Cáustico & Encontros'],
      tag: 'Ambientação',
    },
    {
      id: 'campaign',
      number: '03',
      title: 'Diretor de Campanha',
      subtitle: 'Sessões, Cenas, Improviso e Passagem de Tempo',
      description: 'Estruture aventuras com o Beat Chart oficial dos livros (Gancho ao Clímax), gere cenas e obstáculos imediatos em 1 clique, e simule meses de Timeskip com tabelas de bicos (Hustles).',
      icon: <Compass className="w-5 h-5 text-cyan-500" />,
      features: ['Beat Chart Oficial (6 Atos)', 'Improvisador de Cenas Sensoriais', 'Simulador de Hustles e Aluguel'],
      tag: 'Narrativa',
    },
    {
      id: 'arsenal',
      number: '04',
      title: 'Arsenal, Cromo & Loot',
      subtitle: 'Recompensas por Abate, Catálogo e Garagem',
      description: 'Gere saques de combate com dinheiro, munição, itens pessoais dos bolsos (Data Pack) e colheita do Banco de Corpos (Ripperdoc). Catálogo completo e upgrades de veículos nômades.',
      icon: <Crosshair className="w-5 h-5 text-emerald-500" />,
      features: ['Loot por Nível de Ameaça', 'Colheita de Órgãos e Cromo', 'Garagem com SDP e Upgrades'],
      tag: 'Equipamento',
    },
    {
      id: 'netrunning',
      number: '05',
      title: 'Netrunning Especializado',
      subtitle: isRed ? 'Arquitetura NET por Andares (Elevador)' : 'Fortalezas de Dados Clássicas 2020',
      description: isRed
        ? 'Gerador visual de arquiteturas com senhas (DVs), arquivos confidenciais, nós de controle de segurança e estátuas de Black ICE ativo (Hellhound, Giant, Liche).'
        : 'Gerador de Fortalezas com Muros de Dados, Portões de Código, CPUs, Realidades Virtuais temáticas e programas clássicos da Série Demônio (Imp, Balron, Cão Infernal).',
      icon: <Network className="w-5 h-5 text-purple-500" />,
      features: isRed
        ? ['Andares e Nós de Controle', 'Fichas de Black ICE com SPD/HP', 'Ações de Interface']
        : ['CPUs e Muros de Dados', 'Série Demônio e Cão Infernal', 'Temas de Realidade Virtual'],
      tag: 'Ciberespaço',
    },
    {
      id: 'codex',
      number: '06',
      title: 'Biblioteca & Códice Triplo',
      subtitle: 'Sistema Oficial, Banco do Mestre e Forja Homebrew',
      description: 'Acesse o Bestiário oficial com envio para combate em 1 clique, consulte regras com citações exatas, gerencie o acervo da sua campanha e crie armas, cromo e inimigos na Forja Homebrew.',
      icon: <BookOpen className="w-5 h-5 text-rose-500" />,
      features: ['Bestiário com 1-Click Combate', 'Biblioteca do Mestre (Campanha)', 'Forja Homebrew (Armas, Cromo, Chefes)'],
      tag: 'Repositório',
    },
    {
      id: 'player-sheet',
      number: '07',
      title: 'Fichas de Jogadores',
      subtitle: 'Gerador Completo, Rolo de Dados & Perícias',
      description: 'Ficha interativa completa com rolagem integrada de perícias, combate com cálculo de dano e ablação, inventário com peso e custo, ciberware e gerador de lifepath.',
      icon: <User className="w-5 h-5 text-cyan-400" />,
      features: ['Ficha Interativa RED & 2020', 'Rolo Rápido de Dano e Críticos', 'Inventário & Ciberware'],
      tag: 'Personagens',
    },
    {
      id: 'archive',
      number: '08',
      title: 'Biblioteca Digital',
      subtitle: '82 Manuais Oficiais & DLCs Indexados',
      description: 'Consulta abrangente de todos os livros básicos, suplementos de facções, aventuras, screamsheets e expansões de regras em PDF indexados para a campanha.',
      icon: <Library className="w-5 h-5 text-amber-400" />,
      features: ['82 Livros e Manuais Oficiais', 'Busca Instantânea por Categoria', 'DLCs e Complementos'],
      tag: 'Arquivos',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-2">
      {/* Top Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#121218] via-[#14141d] to-[#121218] border border-[#27272a] shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-950/40 border border-red-800/40 text-[11px] font-mono text-red-300">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            <span>Sistema Ativo: Cyberpunk {system} ({isRed ? '2045 - Time of the RED' : '2020 - O Futuro Sombrio'})</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Cyberpunk GM Suite
          </h1>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Painel integral de apoio à narração para Mestres de RPG. Todos os dados foram extraídos e indexados diretamente dos livros básicos e suplementos oficiais do workspace.
          </p>
        </div>

        {/* Quick System Rule Badge & Switch */}
        <div className="p-3.5 rounded-xl bg-[#0a0a0d] border border-[#27272a] space-y-2 text-xs font-mono min-w-[240px]">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Mecânica de Regras:</span>
            <button
              onClick={toggleSystem}
              className="text-red-400 hover:text-red-300 underline font-semibold"
            >
              Alternar
            </button>
          </div>
          {isRed ? (
            <div className="space-y-1 text-[11px] text-zinc-300">
              <div className="flex justify-between"><span>Atributos:</span><strong className="text-zinc-100">10 Stats (WILL, DEX...)</strong></div>
              <div className="flex justify-between"><span>Cálculo HP:</span><strong className="text-zinc-100">10 + 5 &times; &lceil;(B+W)/2&rceil;</strong></div>
              <div className="flex justify-between"><span>Blindagem SP:</span><strong className="text-zinc-100">Cabeça & Corpo (Ablação -1)</strong></div>
            </div>
          ) : (
            <div className="space-y-1 text-[11px] text-zinc-300">
              <div className="flex justify-between"><span>Atributos:</span><strong className="text-zinc-100">9 Stats Clássicos (ATR, MA...)</strong></div>
              <div className="flex justify-between"><span>Absorção:</span><strong className="text-zinc-100">BTM / MTC (-0 a -5)</strong></div>
              <div className="flex justify-between"><span>Blindagem SP:</span><strong className="text-zinc-100">6 Localizações de Dano</strong></div>
            </div>
          )}
        </div>
      </div>

      {/* Campaign Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#121217] border border-[#27272a] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">Fichas Salvas</span>
            <div className="text-lg font-bold font-mono text-zinc-100">{savedNPCs.length}</div>
          </div>
          <Users className="w-5 h-5 text-zinc-600" />
        </div>
        <div className="p-3.5 rounded-xl bg-[#121217] border border-[#27272a] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">Em Combate</span>
            <div className="text-lg font-bold font-mono text-zinc-100">{combatants.length}</div>
          </div>
          <Activity className="w-5 h-5 text-red-500" />
        </div>
        <div className="p-3.5 rounded-xl bg-[#121217] border border-[#27272a] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">Fontes Ingestadas</span>
            <div className="text-lg font-bold font-mono text-zinc-100">82 Manuais & DLCs</div>
          </div>
          <BookOpen className="w-5 h-5 text-amber-500" />
        </div>
        <div className="p-3.5 rounded-xl bg-[#121217] border border-[#27272a] flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] text-zinc-500 uppercase tracking-wider font-mono">Deploy</span>
            <div className="text-lg font-bold font-mono text-emerald-400">Vercel Ready</div>
          </div>
          <Shield className="w-5 h-5 text-emerald-500" />
        </div>
      </div>

      {/* Cyberpunk Tarot Feature Spotlight Banner */}
      {onOpenTarot && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-[#121218] border border-purple-800/40 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg group hover:border-purple-600/60 transition">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700/50 text-[10px] font-mono uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                DLC Oficial RED & Misty 2077
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">22 Arcanos Maiores + 4 Reis de Phantom Liberty</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-2">
              <span>Tarot de Night City: Tiragem Oracular & Críticos de Combate</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Puxe as cartas arcanas pintadas pelas ruas de Night City com animação holográfica de virada, leituras oraculares com IA de Misty, e o sistema oficial de Lesões Críticas de Combate ativado ao rolar 3 ou mais dados 6 no dano.
            </p>
          </div>
          <button
            onClick={onOpenTarot}
            className="self-stretch md:self-auto px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-purple-900/40 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 text-purple-200" />
            <span>Puxar Cartas de Tarot</span>
            <ArrowRight className="w-4 h-4 text-purple-200" />
          </button>
        </div>
      )}

      {/* 6 Category Independent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {MODULE_CARDS.map(card => (
          <div
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className="group cursor-pointer p-5 rounded-2xl bg-[#121217] hover:bg-[#15151c] border border-[#27272a] hover:border-zinc-600 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-zinc-600 group-hover:text-red-500 transition">
                  CAT // {card.number}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                  {card.tag}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#181820] border border-[#27272a] group-hover:border-zinc-600 transition">
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white transition">
                    {card.title}
                  </h3>
                  <p className="text-[11px] text-zinc-400">{card.subtitle}</p>
                </div>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                {card.description}
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-[#1f1f26]">
              <div className="space-y-1">
                {card.features.map((feat, i) => (
                  <div key={i} className="text-[11px] text-zinc-500 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-zinc-600" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs font-medium text-zinc-300 group-hover:text-red-400 transition pt-1">
                <span>Acessar Módulo</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Campaign Notes Scratchpad */}
      <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <FileText className="w-4 h-4 text-red-500" />
            <span>Bloco de Notas da Sessão (Persistência Local Automática)</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">Salvo a cada caractere</span>
        </div>
        <textarea
          rows={3}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Anote ganchos rápidos de missão, nomes de NPCs improvisados, senhas ou dívidas dos jogadores..."
          className="w-full bg-[#0a0a0d] border border-[#27272a] rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-red-500 font-mono leading-relaxed"
        />
      </div>
    </div>
  );
};
