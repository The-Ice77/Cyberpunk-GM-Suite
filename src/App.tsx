import React, { useState } from 'react';
import { SystemProvider } from './context/SystemContext';
import { CombatProvider } from './context/CombatContext';
import { CampaignProvider } from './context/CampaignContext';
import { UserRoleProvider } from './context/UserRoleContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, ActivePage } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { DiceDrawer } from './components/dice/DiceDrawer';
import { CombatDrawer } from './components/combat/CombatDrawer';
import { CyberpunkAICoGM } from './components/ai/CyberpunkAICoGM';
import { TarotDrawer } from './components/tarot/TarotDrawer';

import { HubPage } from './pages/HubPage';
import { PeoplePage } from './pages/PeoplePage';
import { WorldPage } from './pages/WorldPage';
import { CampaignPage } from './pages/CampaignPage';
import { ArsenalPage } from './pages/ArsenalPage';
import { NetrunningPage } from './pages/NetrunningPage';
import { CodexPage } from './pages/CodexPage';
import { PlayerSheetPage } from './pages/PlayerSheetPage';
import { DigitalArchivePage } from './pages/DigitalArchivePage';

export const AppContent: React.FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>('hub');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  });
  const [isDiceOpen, setIsDiceOpen] = useState<boolean>(false);
  const [isCombatOpen, setIsCombatOpen] = useState<boolean>(false);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [isTarotOpen, setIsTarotOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar
        onToggleDice={() => {
          setIsDiceOpen(prev => !prev);
          if (!isDiceOpen) {
            setIsCombatOpen(false);
            setIsAiOpen(false);
            setIsTarotOpen(false);
          }
        }}
        onToggleCombat={() => {
          setIsCombatOpen(prev => !prev);
          if (!isCombatOpen) {
            setIsDiceOpen(false);
            setIsAiOpen(false);
            setIsTarotOpen(false);
          }
        }}
        onToggleAi={() => {
          setIsAiOpen(prev => !prev);
          if (!isAiOpen) {
            setIsDiceOpen(false);
            setIsCombatOpen(false);
            setIsTarotOpen(false);
          }
        }}
        onToggleTarot={() => {
          setIsTarotOpen(prev => !prev);
          if (!isTarotOpen) {
            setIsDiceOpen(false);
            setIsCombatOpen(false);
            setIsAiOpen(false);
          }
        }}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
      />

      {/* Main Workspace: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Collapsible Minimalist Sidebar */}
        <Sidebar
          activePage={activePage}
          onSelectPage={page => setActivePage(page)}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(prev => !prev)}
        />

        {/* Independent Page Display with Mobile Bottom Bar Clearance */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 pb-24 lg:pb-8">
          {activePage === 'hub' && (
            <HubPage
              onNavigate={page => setActivePage(page)}
              onOpenTarot={() => setIsTarotOpen(true)}
            />
          )}
          {activePage === 'people' && <PeoplePage />}
          {activePage === 'world' && <WorldPage />}
          {activePage === 'campaign' && <CampaignPage />}
          {activePage === 'arsenal' && <ArsenalPage />}
          {activePage === 'netrunning' && <NetrunningPage />}
          {activePage === 'codex' && <CodexPage />}
          {activePage === 'player-sheet' && <PlayerSheetPage />}
          {activePage === 'archive' && <DigitalArchivePage />}
        </main>
      </div>

      {/* Quick Mobile Bottom Navigation Bar (Thumb Friendly) */}
      <MobileBottomNav
        activePage={activePage}
        onSelectPage={page => setActivePage(page)}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        onToggleCombat={() => {
          setIsCombatOpen(prev => !prev);
          if (!isCombatOpen) {
            setIsDiceOpen(false);
            setIsAiOpen(false);
          }
        }}
        onToggleAi={() => {
          setIsAiOpen(prev => !prev);
          if (!isAiOpen) {
            setIsDiceOpen(false);
            setIsCombatOpen(false);
          }
        }}
        isCombatOpen={isCombatOpen}
        isAiOpen={isAiOpen}
      />

      {/* Global Utilities Drawers */}
      <DiceDrawer
        isOpen={isDiceOpen}
        onClose={() => setIsDiceOpen(false)}
      />

      <CombatDrawer
        isOpen={isCombatOpen}
        onClose={() => setIsCombatOpen(false)}
        onOpenTarot={() => {
          setIsCombatOpen(false);
          setIsTarotOpen(true);
        }}
      />

      <CyberpunkAICoGM
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />

      <TarotDrawer
        isOpen={isTarotOpen}
        onClose={() => setIsTarotOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SystemProvider>
      <UserRoleProvider>
        <CampaignProvider>
          <CombatProvider>
            <AppContent />
          </CombatProvider>
        </CampaignProvider>
      </UserRoleProvider>
    </SystemProvider>
  );
};

export default App;
