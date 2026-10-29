import React from 'react';
import {
  LayoutDashboard,
  Users,
  MapPin,
  Crosshair,
  User,
  ShieldAlert,
  Bot,
  Menu,
} from 'lucide-react';
import { ActivePage } from './Sidebar';
import { useUserRole } from '../../context/UserRoleContext';
import { useCombat } from '../../context/CombatContext';

interface MobileBottomNavProps {
  activePage: ActivePage;
  onSelectPage: (page: ActivePage) => void;
  onToggleSidebar: () => void;
  onToggleCombat: () => void;
  onToggleAi: () => void;
  isCombatOpen: boolean;
  isAiOpen: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activePage,
  onSelectPage,
  onToggleSidebar,
  onToggleCombat,
  onToggleAi,
  isCombatOpen,
  isAiOpen,
}) => {
  const { role } = useUserRole();
  const { combatants } = useCombat();
  const isPlayer = role === 'PLAYER';

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-[#0a0a0d]/95 backdrop-blur-lg border-t border-[#27272a] px-1 pt-1.5 pb-safe select-none shadow-2xl"
      aria-label="Navegação Rápida Mobile"
    >
      <div className="grid grid-cols-6 items-center text-center">
        {/* Item 1: Primary Hub / Player Sheet */}
        {isPlayer ? (
          <button
            onClick={() => onSelectPage('player-sheet')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition active:scale-95 ${
              activePage === 'player-sheet'
                ? 'text-cyan-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight truncate w-full">Ficha</span>
          </button>
        ) : (
          <button
            onClick={() => onSelectPage('hub')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition active:scale-95 ${
              activePage === 'hub'
                ? 'text-red-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight truncate w-full">Hub</span>
          </button>
        )}

        {/* Item 2: NPCs (GM) or Arsenal (Player) */}
        {isPlayer ? (
          <button
            onClick={() => onSelectPage('arsenal')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition active:scale-95 ${
              activePage === 'arsenal'
                ? 'text-cyan-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Crosshair className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight truncate w-full">Arsenal</span>
          </button>
        ) : (
          <button
            onClick={() => onSelectPage('people')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition active:scale-95 ${
              activePage === 'people'
                ? 'text-red-400 font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight truncate w-full">NPCs</span>
          </button>
        )}

        {/* Item 3: World & Map */}
        <button
          onClick={() => onSelectPage('world')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition active:scale-95 ${
            activePage === 'world'
              ? isPlayer ? 'text-cyan-400 font-bold' : 'text-amber-400 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight truncate w-full">Mundo</span>
        </button>

        {/* Item 4: AI Co-GM */}
        <button
          onClick={onToggleAi}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition active:scale-95 relative ${
            isAiOpen
              ? 'text-emerald-400 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <Bot className="w-5 h-5 mb-0.5" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-[10px] tracking-tight truncate w-full">Co-GM IA</span>
        </button>

        {/* Item 5: Combat Page */}
        <button
          onClick={() => onSelectPage('combat')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition active:scale-95 relative ${
            activePage === 'combat'
              ? 'text-red-400 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <ShieldAlert className="w-5 h-5 mb-0.5" />
            {combatants.length > 0 && (
              <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-red-600 text-[9px] font-mono font-bold text-white min-w-[14px]">
                {combatants.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight truncate w-full">Combate</span>
        </button>

        {/* Item 6: Menu / Full Sidebar */}
        <button
          onClick={onToggleSidebar}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-zinc-400 hover:text-zinc-100 transition active:scale-95"
          aria-label="Abrir Menu Completo"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight truncate w-full">Mais</span>
        </button>
      </div>
    </nav>
  );
};
