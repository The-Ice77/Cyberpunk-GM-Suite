import React from 'react';
import {
  Users,
  MapPin,
  Compass,
  Crosshair,
  Network,
  BookOpen,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  User,
  Library,
  Crown,
  UserCheck,
  X,
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { useUserRole } from '../../context/UserRoleContext';

export type ActivePage =
  | 'hub'
  | 'people'
  | 'world'
  | 'campaign'
  | 'arsenal'
  | 'netrunning'
  | 'codex'
  | 'player-sheet'
  | 'archive';

interface SidebarProps {
  activePage: ActivePage;
  onSelectPage: (page: ActivePage) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, onSelectPage, isOpen, onToggle }) => {
  const { system, isRed } = useSystem();
  const { role, setRole } = useUserRole();

  const isPlayer = role === 'PLAYER';

  const GM_NAV_ITEMS: { id: ActivePage; label: string; icon: React.ReactNode; categoryNumber: string; badge?: string }[] = [
    { id: 'hub', label: 'Hub Principal', icon: <LayoutDashboard className="w-4 h-4" />, categoryNumber: '00' },
    { id: 'people', label: 'Pessoas & Facções', icon: <Users className="w-4 h-4" />, categoryNumber: '01' },
    { id: 'world', label: 'Mundo & Night City', icon: <MapPin className="w-4 h-4" />, categoryNumber: '02' },
    { id: 'campaign', label: 'Diretor de Campanha', icon: <Compass className="w-4 h-4" />, categoryNumber: '03' },
    { id: 'arsenal', label: 'Arsenal & Loot', icon: <Crosshair className="w-4 h-4" />, categoryNumber: '04' },
    { id: 'netrunning', label: 'Netrunning & IoT', icon: <Network className="w-4 h-4" />, categoryNumber: '05', badge: isRed ? 'Elevador' : 'Fortaleza' },
    { id: 'codex', label: 'Biblioteca & Códice', icon: <BookOpen className="w-4 h-4" />, categoryNumber: '06', badge: 'Tripla' },
    { id: 'player-sheet', label: 'Fichas de Jogadores', icon: <User className="w-4 h-4" />, categoryNumber: '07' },
    { id: 'archive', label: 'Biblioteca Digital', icon: <Library className="w-4 h-4" />, categoryNumber: '08', badge: '82 PDFs' },
  ];

  const PLAYER_NAV_ITEMS: { id: ActivePage; label: string; icon: React.ReactNode; categoryNumber: string; badge?: string }[] = [
    { id: 'player-sheet', label: 'Minha Ficha', icon: <User className="w-4 h-4" />, categoryNumber: '01', badge: 'Ativo' },
    { id: 'hub', label: 'Hub Principal', icon: <LayoutDashboard className="w-4 h-4" />, categoryNumber: '00' },
    { id: 'people', label: 'Pessoas & Facções', icon: <Users className="w-4 h-4" />, categoryNumber: '02' },
    { id: 'world', label: 'Mapa & Distritos', icon: <MapPin className="w-4 h-4" />, categoryNumber: '03' },
    { id: 'arsenal', label: 'Arsenal & Cromo', icon: <Crosshair className="w-4 h-4" />, categoryNumber: '04' },
    { id: 'netrunning', label: 'Netrunning & Cyberdeck', icon: <Network className="w-4 h-4" />, categoryNumber: '05', badge: isRed ? 'Elevador' : 'Fortaleza' },
    { id: 'campaign', label: 'Diário & Missões', icon: <Compass className="w-4 h-4" />, categoryNumber: '06' },
    { id: 'codex', label: 'Biblioteca & Códice', icon: <BookOpen className="w-4 h-4" />, categoryNumber: '07' },
    { id: 'archive', label: 'Biblioteca Digital', icon: <Library className="w-4 h-4" />, categoryNumber: '08', badge: '82 PDFs' },
  ];

  const navItems = isPlayer ? PLAYER_NAV_ITEMS : GM_NAV_ITEMS;

  const handleItemClick = (pageId: ActivePage) => {
    onSelectPage(pageId);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#0c0c10] border-r border-[#27272a] flex flex-col transition-all duration-200 shadow-2xl lg:shadow-none ${
          isOpen ? 'w-72 max-w-[85vw]' : 'w-16 -translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Sidebar Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-[#27272a] bg-[#101015]">
          {isOpen ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                {isPlayer ? <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> : <Crown className="w-3.5 h-3.5 text-red-400" />}
                <span>{isPlayer ? 'Modo Jogador' : 'Modo Mestre'}</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                {system}
              </span>
            </div>
          ) : (
            <span className={`w-2.5 h-2.5 rounded-full mx-auto ${isPlayer ? 'bg-cyan-400' : 'bg-red-500'}`} />
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggle}
            className="hidden lg:flex p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition"
            aria-label="Colapsar Barra Lateral"
          >
            {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onToggle}
            className="flex lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
            aria-label="Fechar Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Switcher Pill in Sidebar (Mobile & Desktop) */}
        {isOpen && (
          <div className="p-3 border-b border-[#27272a] bg-[#0e0e13]">
            <span className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block mb-1.5">
              Alternar Papel:
            </span>
            <div className="grid grid-cols-2 gap-1.5 bg-[#08080b] p-1 rounded-xl border border-zinc-800/80">
              <button
                onClick={() => setRole('GM')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  role === 'GM'
                    ? 'bg-red-950/80 text-red-300 border border-red-800/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-red-400" />
                <span>Mestre</span>
              </button>
              <button
                onClick={() => setRole('PLAYER')}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  role === 'PLAYER'
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Jogador</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation List */}
        <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition active:scale-[0.98] ${
                  isActive
                    ? 'bg-zinc-800/90 text-zinc-100 border border-zinc-700/80 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#14141a]'
                }`}
                title={item.label}
              >
                <span className={`${isActive ? (isPlayer ? 'text-cyan-400' : 'text-red-500') : 'text-zinc-400'}`}>
                  {item.icon}
                </span>

                {isOpen && (
                  <div className="flex-1 flex items-center justify-between text-left">
                    <span className="truncate">{item.label}</span>
                    {item.badge ? (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {item.badge}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-zinc-600">
                        {item.categoryNumber}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Status Footer */}
        <div className="p-3 border-t border-[#27272a] text-[11px] text-zinc-500 font-mono bg-[#0a0a0d]">
          {isOpen ? (
            <div className="space-y-1">
              <div className="text-zinc-400 flex items-center justify-between">
                <span>{isPlayer ? 'Edgerunner Sheet' : 'Night City 2020 / 2045'}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${isPlayer ? 'bg-cyan-950/80 text-cyan-300' : 'bg-red-950/80 text-red-300'}`}>
                  {role}
                </span>
              </div>
              <div className="text-[10px] text-zinc-600">Vercel Ready • 82 Manuais & DLCs</div>
            </div>
          ) : (
            <div className="text-center text-[10px]">{role}</div>
          )}
        </div>
      </aside>
    </>
  );
};
