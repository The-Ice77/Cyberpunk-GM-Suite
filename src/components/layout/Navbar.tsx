import React, { useState } from 'react';
import { Dices, ShieldAlert, Download, Upload, Cpu, Menu, Bot, UserCheck, Shield, Crown } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { useCombat } from '../../context/CombatContext';
import { useCampaign } from '../../context/CampaignContext';
import { useUserRole } from '../../context/UserRoleContext';

interface NavbarProps {
  onToggleDice: () => void;
  onToggleCombat: () => void;
  onToggleSidebar: () => void;
  onToggleAi: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleDice,
  onToggleCombat,
  onToggleSidebar,
  onToggleAi,
}) => {
  const { system, setSystem, isRed } = useSystem();
  const { role, setRole, showOnboarding, setShowOnboarding } = useUserRole();
  const { combatants } = useCombat();
  const { exportNPCsJSON, importNPCsJSON } = useCampaign();
  const [showBackupModal, setShowBackupModal] = useState<boolean>(false);
  const [importText, setImportText] = useState<string>('');
  const [importFeedback, setImportFeedback] = useState<string>('');

  const handleExport = () => {
    const dataStr = exportNPCsJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cyberpunk_gm_suite_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const ok = importNPCsJSON(importText);
    if (ok) {
      setImportFeedback('Dados importados com sucesso!');
      setTimeout(() => {
        setImportFeedback('');
        setShowBackupModal(false);
      }, 1200);
    } else {
      setImportFeedback('Erro: JSON inválido. Verifique o formato.');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-14 bg-[#09090b]/90 backdrop-blur-md border-b border-[#27272a] px-4 lg:px-6 flex items-center justify-between">
        {/* Left: Mobile menu toggle + Brand Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition lg:hidden"
            aria-label="Alternar Menu Lateral"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-sm font-bold tracking-wider text-zinc-100 uppercase hidden sm:inline">
              Cyberpunk GM Suite
            </span>
          </div>
        </div>

        {/* Center: System Selector Pill & Role Selector */}
        <div className="flex items-center gap-2">
          {/* System RED vs 2020 */}
          <div className="flex items-center bg-[#14141a] border border-[#27272a] rounded-lg p-0.5 shadow-inner">
            <button
              onClick={() => setSystem('RED')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition ${
                isRed
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              RED
            </button>
            <button
              onClick={() => setSystem('2020')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition ${
                !isRed
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              2020
            </button>
          </div>

          {/* User Role: GM vs Player */}
          <div className="hidden sm:flex items-center bg-[#14141a] border border-[#27272a] rounded-lg p-0.5 shadow-inner">
            <button
              onClick={() => setRole('GM')}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                role === 'GM'
                  ? 'bg-zinc-800 text-red-400 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Modo Mestre: Gestão de mundo, NPCs, campanhas e ferramentas de direção"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Mestre</span>
            </button>
            <button
              onClick={() => setRole('PLAYER')}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                role === 'PLAYER'
                  ? 'bg-zinc-800 text-cyan-400 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Modo Jogador: Ficha de personagem, inventário, PV, Humanidade e rolagens pessoais"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Jogador</span>
            </button>
          </div>
        </div>

        {/* Right: AI Co-GM, Quick Drawers & Backup Buttons */}
        <div className="flex items-center gap-2">
          {/* AI Neural Co-GM Trigger */}
          <button
            onClick={onToggleAi}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#14141a] hover:bg-zinc-800 text-zinc-200 border border-[#27272a] text-xs font-medium transition"
            title="Abrir Assistente Neural Co-GM IA (Gemini / Oráculo)"
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Co-GM IA</span>
          </button>

          {/* Dice Drawer Toggle */}
          <button
            onClick={onToggleDice}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#14141a] hover:bg-zinc-800 text-zinc-200 border border-[#27272a] text-xs font-medium transition"
            title="Abrir Rolador de Dados"
          >
            <Dices className="w-4 h-4 text-red-500" />
            <span className="hidden md:inline">Dados</span>
          </button>

          {/* Combat Tracker Drawer Toggle */}
          <button
            onClick={onToggleCombat}
            className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#14141a] hover:bg-zinc-800 text-zinc-200 border border-[#27272a] text-xs font-medium transition"
            title="Abrir Rastreador de Combate"
          >
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span className="hidden md:inline">Combate</span>
            {combatants.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-red-600 text-[10px] font-mono font-bold text-white">
                {combatants.length}
              </span>
            )}
          </button>

          {/* Backup Modal Trigger */}
          <button
            onClick={() => setShowBackupModal(true)}
            className="p-1.5 rounded bg-[#14141a] hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-[#27272a] transition"
            title="Exportar / Importar Dados da Campanha"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Backup Modal */}
      {showBackupModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-[#27272a] rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-red-500" />
                Backup & Sincronização Local (JSON)
              </h3>
              <button
                onClick={() => setShowBackupModal(false)}
                className="text-zinc-400 hover:text-zinc-200 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Todos os seus NPCs, estado do mapa e notas de campanha são mantidos com segurança no <code>localStorage</code> do seu navegador. Você pode baixar um backup JSON completo ou restaurar uma campanha anterior a qualquer momento.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleExport}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-medium border border-zinc-700 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Arquivo JSON</span>
              </button>
            </div>

            <div className="space-y-2 pt-2 border-t border-[#27272a]">
              <label className="block text-xs font-medium text-zinc-300">
                Restaurar Backup (Cole o JSON aqui):
              </label>
              <textarea
                rows={4}
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder='Cole o conteúdo do arquivo .json aqui...'
                className="w-full bg-[#0a0a0d] border border-[#27272a] rounded p-2 text-xs font-mono text-zinc-300 focus:outline-none focus:border-red-500"
              />
              {importFeedback && (
                <div className={`text-xs font-medium ${importFeedback.includes('sucesso') ? 'text-emerald-400' : 'text-red-400'}`}>
                  {importFeedback}
                </div>
              )}
              <button
                onClick={handleImport}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-medium transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Importar e Substituir Dados</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Role Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121217] border border-[#27272a] rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <span className="text-[11px] font-mono tracking-widest uppercase text-red-500 font-semibold">
                SISTEMA OPERACIONAL CYBERPUNK // BEM-VINDO
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-zinc-100">
                Qual o seu papel na mesa hoje?
              </h2>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                A suíte se adapta às suas necessidades imediatas. Você pode alternar seu papel a qualquer momento no topo da tela.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Game Master */}
              <button
                onClick={() => {
                  setRole('GM');
                  setShowOnboarding(false);
                }}
                className="group p-5 rounded-xl bg-[#171720] border border-[#27272a] hover:border-red-500/80 text-left transition flex flex-col justify-between space-y-4 hover:shadow-lg hover:shadow-red-950/20"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-400 group-hover:scale-105 transition">
                    <Crown className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-100 group-hover:text-red-400 transition">
                    Mestre (Game Master)
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Controle de NPCs, criador de campanhas, mapa tático de distritos, clima diário, arquitetura NET, rastreador de combate e oráculo IA.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-red-400/90 font-medium pt-2 border-t border-zinc-800">
                  ENTRAR COMO MESTRE →
                </div>
              </button>

              {/* Option 2: Player */}
              <button
                onClick={() => {
                  setRole('PLAYER');
                  setShowOnboarding(false);
                }}
                className="group p-5 rounded-xl bg-[#171720] border border-[#27272a] hover:border-cyan-500/80 text-left transition flex flex-col justify-between space-y-4 hover:shadow-lg hover:shadow-cyan-950/20"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-100 group-hover:text-cyan-400 transition">
                    Jogador (Edgerunner)
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Ficha interativa completa, cálculo de PV/SP, ablação de blindagem, inventário de armas e munição, perda de Humanidade e LifePath.
                  </p>
                </div>
                <div className="text-[10px] font-mono text-cyan-400/90 font-medium pt-2 border-t border-zinc-800">
                  ENTRAR COMO JOGADOR →
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
