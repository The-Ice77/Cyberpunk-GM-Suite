import React, { useState } from 'react';
import {
  Building2,
  Shield,
  Skull,
  Bot,
  Sparkles,
  Dices,
  Copy,
  Check,
  Bookmark,
  BookmarkPlus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Crosshair,
  Cpu,
  Zap,
  Key,
  Flame,
  Radio,
  Eye,
  Lock,
  Layers,
  MapPin,
  AlertTriangle,
  FileText,
  Plus,
  Compass,
  ArrowRight,
  Maximize2,
  Sliders,
} from 'lucide-react';
import {
  TacticalStructure,
  StructureRoom,
  StructureCategory,
  StructureScale,
  StructureThreatLevel,
  STRUCTURE_CATEGORY_INFO,
  STRUCTURE_THREAT_INFO,
  generateProceduralStructure,
} from '../../data/structureGeneratorData';
import { generateAITacticalStructure } from '../../services/aiService';
import { useCombat, Combatant } from '../../context/CombatContext';
import { NPCSheet } from '../../types/system';
import { FACTIONS_LIST } from '../../data/factionsData';
import { GANGS_LIST } from '../../data/gangsData';

export const StructureGeneratorSection: React.FC = () => {
  const { addCombatant } = useCombat();

  // Generator Options State
  const [category, setCategory] = useState<StructureCategory>('gang_base');
  const [scale, setScale] = useState<StructureScale>('medium');
  const [threatLevel, setThreatLevel] = useState<StructureThreatLevel>('medium');
  const [faction, setFaction] = useState<string>('Maelstrom');
  const [district, setDistrict] = useState<string>('Watson (Northside Industrial)');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [showAiOptions, setShowAiOptions] = useState<boolean>(false);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);

  // Active Structure State
  const [currentStructure, setCurrentStructure] = useState<TacticalStructure>(() =>
    generateProceduralStructure({
      category: 'gang_base',
      scale: 'medium',
      threatLevel: 'medium',
      faction: 'Maelstrom',
      district: 'Watson (Northside Industrial)',
    })
  );

  const [selectedRoomNumber, setSelectedRoomNumber] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [combatSentToast, setCombatSentToast] = useState<string | null>(null);

  // Vault of Saved Structures
  const [savedStructures, setSavedStructures] = useState<TacticalStructure[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpunk_saved_structures');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const selectedRoom = currentStructure.rooms.find(r => r.roomNumber === selectedRoomNumber) || currentStructure.rooms[0];

  // Procedural Generator Trigger
  const handleGenerateProcedural = () => {
    const struct = generateProceduralStructure({
      category,
      scale,
      threatLevel,
      faction,
      district,
    });
    setCurrentStructure(struct);
    setSelectedRoomNumber(1);
  };

  // AI Generator Trigger
  const handleGenerateAI = async () => {
    setIsLoadingAI(true);
    try {
      const struct = await generateAITacticalStructure({
        category,
        scale,
        threatLevel,
        faction,
        district,
        customPrompt,
      });
      setCurrentStructure(struct);
      setSelectedRoomNumber(1);
    } catch (err) {
      console.error('Error generating structure with AI:', err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Save Structure to Vault
  const handleSaveStructure = () => {
    setSavedStructures(prev => {
      const filtered = prev.filter(s => s.id !== currentStructure.id);
      const updated = [currentStructure, ...filtered];
      localStorage.setItem('cyberpunk_saved_structures', JSON.stringify(updated));
      return updated;
    });
    setCombatSentToast(`Estrutura "${currentStructure.name}" salva no Cofre!`);
    setTimeout(() => setCombatSentToast(null), 3000);
  };

  // Delete from Vault
  const handleDeleteSaved = (id: string) => {
    setSavedStructures(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('cyberpunk_saved_structures', JSON.stringify(updated));
      return updated;
    });
  };

  // Send Room NPCs to Combat Drawer
  const handleSendRoomToCombat = (room: StructureRoom) => {
    if (!room.npcs || room.npcs.length === 0) return;

    room.npcs.forEach(npc => {
      for (let i = 0; i < npc.count; i++) {
        const unitName = npc.count > 1 ? `${npc.name} #${i + 1}` : npc.name;
        const combatant: Combatant = {
          id: `combat-${room.id}-${npc.id}-${i}-${Date.now()}`,
          name: `${unitName} (${room.name})`,
          system: 'RED',
          initiative: Math.floor(Math.random() * 10) + 1 + Math.max(2, Math.floor(npc.combatNumber / 2)),
          currentHP: npc.hp,
          maxHP: npc.hp,
          headSP: npc.headSP,
          bodySP: npc.bodySP,
          conditions: [],
          criticalInjuries: [],
          deathSavePenalty: 0,
          combatNumber: npc.combatNumber,
          faction: currentStructure.faction,
          notes: `Local: ${room.name} (${room.floor}) | Tática: ${npc.tactics}`,
          weapons: npc.weapons.map(w => ({ name: w, damage: '3d6', rof: 1 })),
        };
        addCombatant(combatant);
      }
    });

    setCombatSentToast(`Enviados ${room.npcs.reduce((a, b) => a + b.count, 0)} inimigos da ${room.name} para o Rastreador de Combate!`);
    setTimeout(() => setCombatSentToast(null), 3000);
  };

  // Copy Full Briefing to Clipboard
  const handleCopyDossier = () => {
    const text = `=== PLANTA TÁTICA & ESTRUTURA: ${currentStructure.name.toUpperCase()} ===
Localização: ${currentStructure.district} | Facção: ${currentStructure.faction}
Escala: ${currentStructure.scale.toUpperCase()} (${currentStructure.rooms.length} Salas) | Ameaça: ${currentStructure.threatLevel.toUpperCase()}

[FACHADA & PERÍMETRO]
${currentStructure.facadeDescription}
Defesas Perimétricas: ${currentStructure.perimeterSecurity}
Brecha / Rota Oculta: ${currentStructure.infiltrationWeakness}

[ATMOSFERA INTERIOR]
${currentStructure.atmosphereDescription}
Netarch: ${currentStructure.netarchSummary || 'Sem rede estruturada'}

[SALAS E AMBIENTES]
${currentStructure.rooms.map(r => `--- SALA #${r.roomNumber}: ${r.name} (${r.floor}) ---
Finalidade: ${r.purpose}
Iluminação: ${r.lighting} | Cobertura: ${r.cover} | Segurança: ${r.securityLevel}
NPCs: ${r.npcs.map(n => `${n.count}x ${n.name} (HP ${n.hp}, SP ${n.bodySP}, CN ${n.combatNumber})`).join(', ') || 'Nenhum'}
Interações: ${r.interactionPoints.map(p => `[${p.type.toUpperCase()}] ${p.title} (DV ${p.dv} ${p.skillRequired}) - ${p.description}`).join(' | ')}
Conecta com Salas: ${r.connectedRoomNumbers.join(', ')}
${r.lootText ? `Saque Especial: ${r.lootText}` : ''}
`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const threat = STRUCTURE_THREAT_INFO[currentStructure.threatLevel];
  const categoryInfo = STRUCTURE_CATEGORY_INFO[currentStructure.category];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {combatSentToast && (
        <div className="p-3.5 rounded-xl bg-purple-950/80 border border-purple-500/60 text-purple-200 font-mono text-xs flex items-center justify-between shadow-lg animate-pulse">
          <span className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-purple-400" />
            {combatSentToast}
          </span>
          <button onClick={() => setCombatSentToast(null)} className="text-zinc-400 hover:text-zinc-100">&times;</button>
        </div>
      )}

      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#17131b] via-[#201524] to-[#17131b] border border-purple-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/50 font-bold">
              Módulo Tático de Arquitetura & Infiltração
            </span>
            <span className="text-[10px] font-mono text-zinc-400">
              Plantas Baixas, Layout de Salas & DVs de Segurança
            </span>
          </div>
          <h2 className="text-xl font-bold text-zinc-100 mt-1 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            <span>Gerador Tático de Estruturas, Prédios & Bases de Gangue</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyDossier}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono font-medium flex items-center gap-1.5 transition border border-zinc-700"
            title="Copiar Relatório Tático Completo da Estrutura"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar Dossiê'}</span>
          </button>
          <button
            type="button"
            onClick={handleSaveStructure}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow"
            title="Salvar Estrutura na Campanha"
          >
            <BookmarkPlus className="w-4 h-4" />
            <span>Salvar no Cofre</span>
          </button>
        </div>
      </div>

      {/* Configuration Controls Card */}
      <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* 1. Category */}
          <div>
            <label className="block text-zinc-400 mb-1 font-semibold uppercase text-[11px]">
              1. Categoria da Estrutura:
            </label>
            <select
              value={category}
              onChange={e => {
                const cat = e.target.value as StructureCategory;
                setCategory(cat);
                setFaction(STRUCTURE_CATEGORY_INFO[cat].defaultFaction);
              }}
              className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-200 focus:outline-none focus:border-purple-500 font-sans"
            >
              {Object.entries(STRUCTURE_CATEGORY_INFO).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.icon} {info.label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Scale (Room Count) */}
          <div>
            <label className="block text-zinc-400 mb-1 font-semibold uppercase text-[11px]">
              2. Escala & Quantidade de Salas:
            </label>
            <select
              value={scale}
              onChange={e => setScale(e.target.value as StructureScale)}
              className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-200 focus:outline-none focus:border-purple-500 font-sans"
            >
              <option value="small">Pequeno (3 a 5 Salas - Beco / Esconderijo)</option>
              <option value="medium">Médio (6 a 9 Salas - Base / Clube Fortificado)</option>
              <option value="large">Grande / Fortaleza (10 a 14 Salas - Megaplex / Arasaka)</option>
            </select>
          </div>

          {/* 3. Threat Level & Difficulty */}
          <div>
            <label className="block text-zinc-400 mb-1 font-semibold uppercase text-[11px]">
              3. Ameaça & Dificuldade de Invasão:
            </label>
            <select
              value={threatLevel}
              onChange={e => setThreatLevel(e.target.value as StructureThreatLevel)}
              className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-200 focus:outline-none focus:border-purple-500 font-sans"
            >
              {Object.entries(STRUCTURE_THREAT_INFO).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.label} (Base DV {info.baseDV})
                </option>
              ))}
            </select>
          </div>

          {/* 4. Faction */}
          <div>
            <label className="block text-zinc-400 mb-1 font-semibold uppercase text-[11px]">
              4. Facção / Corporação Ocupante:
            </label>
            <input
              type="text"
              value={faction}
              onChange={e => setFaction(e.target.value)}
              placeholder="Ex: Arasaka Security, Maelstrom, Tyger Claws..."
              className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-zinc-200 focus:outline-none focus:border-purple-500 font-sans"
            />
          </div>
        </div>

        {/* District and AI Prompt Section */}
        <div className="pt-2 border-t border-zinc-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex-1 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
              <input
                type="text"
                value={district}
                onChange={e => setDistrict(e.target.value)}
                placeholder="Distrito de Night City (ex: Watson, Heywood, Centro Corporativo...)"
                className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2 text-xs text-zinc-200 font-mono focus:border-purple-500"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAiOptions(!showAiOptions)}
            className="text-xs font-mono text-purple-400 hover:text-purple-300 transition flex items-center gap-1.5 shrink-0"
          >
            <Bot className="w-4 h-4" />
            <span>{showAiOptions ? 'Ocultar Opções de IA' : 'Instruções Extras de IA (Gemini)'}</span>
            {showAiOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* AI Prompt Input */}
        {showAiOptions && (
          <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-2 animate-in fade-in duration-150">
            <label className="block text-xs font-mono text-purple-300 font-semibold">
              Instruções Personalizadas para a IA:
            </label>
            <input
              type="text"
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              placeholder="Ex: Refinaria secreta disfarçada de lava-rápido com piscina de ácido e torretas camufladas..."
              className="w-full bg-[#0a0a0d] border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-purple-500"
            />
          </div>
        )}

        {/* Action Triggers */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleGenerateProcedural}
            className="w-full sm:flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-95 text-zinc-200 font-mono text-xs font-semibold transition border border-zinc-700 flex items-center justify-center gap-2 shadow"
          >
            <Dices className="w-4 h-4 text-purple-400" />
            <span>🎲 Gerar Planta Baixa por Regras Oficiais (Offline)</span>
          </button>

          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={isLoadingAI}
            className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-500 hover:to-red-500 active:scale-95 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 text-yellow-200 ${isLoadingAI ? 'animate-spin' : ''}`} />
            <span>{isLoadingAI ? 'Sintetizando Estrutura com IA...' : '⚡ Forjar Estrutura com IA Co-GM (Gemini)'}</span>
          </button>
        </div>
      </div>

      {/* Main Structure Showcase: Overview & Narrative Briefing */}
      <div className="p-6 rounded-2xl bg-[#121217] border border-purple-900/40 space-y-5 shadow-xl text-xs">
        {/* Header Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/50 font-bold">
                {categoryInfo.icon} {categoryInfo.label}
              </span>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-bold ${threat.badge}`}>
                {threat.label}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                {currentStructure.rooms.length} Salas Interconectadas
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                {currentStructure.district}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-zinc-100 tracking-tight">
              {currentStructure.name}
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Ocupante: <strong className="text-purple-300">{currentStructure.faction}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono px-3 py-1.5 rounded-xl bg-purple-950/40 text-purple-300 border border-purple-800/40 font-bold">
              DV Base de Invasão: {threat.baseDV}
            </span>
          </div>
        </div>

        {/* Narrative & Tactical Reconnaissance Briefing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 leading-relaxed font-sans">
          {/* Card: Fachada & Atmosfera */}
          <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
            <span className="text-[11px] font-mono font-bold text-zinc-300 uppercase flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-400" />
              <span>1. Reconhecimento Externo & Atmosfera</span>
            </span>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              <strong>Fachada:</strong> {currentStructure.facadeDescription}
            </p>
            <p className="text-zinc-400 text-[11px] leading-relaxed pt-1 border-t border-zinc-800/60">
              <strong>Interior:</strong> {currentStructure.atmosphereDescription}
            </p>
          </div>

          {/* Card: Perímetro, Brechas & Netarch */}
          <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-2">
            <span className="text-[11px] font-mono font-bold text-zinc-300 uppercase flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-red-400" />
              <span>2. Segurança Perimétrica & Pontos Cegos</span>
            </span>
            <p className="text-zinc-300 text-[11px] leading-relaxed">
              <strong>Defesas Externas:</strong> {currentStructure.perimeterSecurity}
            </p>
            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-[11px]">
              <strong className="block font-mono uppercase text-[10px] text-emerald-400 mb-0.5">
                🔓 Brecha Tática / Rota Oculta de Infiltração:
              </strong>
              {currentStructure.infiltrationWeakness}
            </div>
          </div>
        </div>

        {/* Netarch Summary Banner if available */}
        {currentStructure.netarchSummary && (
          <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/40 flex items-center gap-2.5 text-xs text-cyan-200 font-mono">
            <Cpu className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <strong className="text-cyan-300 block text-[11px]">Arquitetura de Rede Local (Netarch):</strong>
              <span>{currentStructure.netarchSummary}</span>
            </div>
          </div>
        )}
      </div>

      {/* TACTICAL BLUEPRINT / ROOM LAYOUT GRID */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-zinc-100">
              Planta Baixa Tática & Distribuição de Salas ({currentStructure.rooms.length} Salas)
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            Clique em qualquer sala para inspecionar NPCs, coberturas e pontos de invasão
          </span>
        </div>

        {/* Interactive Room Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {currentStructure.rooms.map(room => {
            const isSelected = room.roomNumber === selectedRoomNumber;
            const npcCount = room.npcs ? room.npcs.reduce((a, b) => a + b.count, 0) : 0;
            const interactionCount = room.interactionPoints ? room.interactionPoints.length : 0;

            return (
              <button
                key={room.id}
                type="button"
                onClick={() => setSelectedRoomNumber(room.roomNumber)}
                className={`p-4 rounded-xl border text-left transition relative flex flex-col justify-between space-y-3 group ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-950/40 ring-2 ring-purple-500/50'
                    : 'bg-[#121217] border-zinc-800 hover:border-zinc-600'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      isSelected ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      SALA #{room.roomNumber.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">{room.floor}</span>
                  </div>

                  <h4 className="text-xs font-bold text-zinc-100 group-hover:text-purple-300 transition line-clamp-1">
                    {room.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 mt-1">
                    {room.purpose}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
                  {/* Badges for NPCs, Netarch, Loot */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                    {npcCount > 0 ? (
                      <span className="px-1.5 py-0.5 rounded bg-red-950/60 border border-red-900/60 text-red-300 flex items-center gap-1">
                        <Skull className="w-2.5 h-2.5 text-red-400" />
                        <span>{npcCount} {npcCount === 1 ? 'NPC' : 'NPCs'}</span>
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500">Sem guardas</span>
                    )}

                    {interactionCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-900/60 text-cyan-300 flex items-center gap-1">
                        <Zap className="w-2.5 h-2.5 text-cyan-400" />
                        <span>{interactionCount} Pts</span>
                      </span>
                    )}

                    {room.netarchAccess && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-950/60 border border-blue-900/60 text-blue-300 flex items-center gap-1">
                        <Cpu className="w-2.5 h-2.5 text-blue-400" />
                        <span>Net</span>
                      </span>
                    )}
                  </div>

                  {/* Room connections */}
                  <div className="text-[9px] font-mono text-zinc-500 truncate">
                    Portas para: {room.connectedRoomNumbers.map(n => `#${n}`).join(', ') || 'Nenhuma'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Room Deep Tactical Infiltration Panel */}
        {selectedRoom && (
          <div className="p-6 rounded-2xl bg-[#141219] border border-purple-500/60 space-y-5 shadow-2xl animate-fade-in text-xs">
            {/* Room Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded bg-purple-600 text-white font-mono text-xs font-bold">
                    SALA #{selectedRoom.roomNumber.toString().padStart(2, '0')}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">{selectedRoom.floor}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    {selectedRoom.lighting}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    Cobertura: {selectedRoom.cover}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-100">{selectedRoom.name}</h3>
                <p className="text-xs text-zinc-300 font-sans mt-0.5">{selectedRoom.purpose}</p>
              </div>

              {/* Room Actions */}
              <div className="flex items-center gap-2">
                {selectedRoom.npcs && selectedRoom.npcs.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleSendRoomToCombat(selectedRoom)}
                    className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-red-950/50"
                    title="Enviar todos os NPCs desta sala para o Rastreador de Combate"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>⚔️ Enviar NPCs p/ Combate</span>
                  </button>
                )}
              </div>
            </div>

            {/* Sensory & Atmospheric Description */}
            <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-1.5">
              <span className="text-[11px] font-mono font-bold text-purple-300 uppercase block">
                Descrição Sensorial ao Abrir a Porta:
              </span>
              <p className="text-zinc-300 font-sans leading-relaxed text-[11px]">
                {selectedRoom.sensoryDescription}
              </p>
            </div>

            {/* NPCs and Interaction Points 2-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Column 1: Posicionamento de Inimigos / NPCs */}
              <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-xs font-mono font-bold text-zinc-200 uppercase flex items-center gap-1.5">
                    <Skull className="w-4 h-4 text-red-400" />
                    <span>Inimigos & Ocupantes da Sala</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {selectedRoom.npcs ? selectedRoom.npcs.reduce((a, b) => a + b.count, 0) : 0} presentes
                  </span>
                </div>

                {selectedRoom.npcs && selectedRoom.npcs.length > 0 ? (
                  <div className="space-y-3">
                    {selectedRoom.npcs.map((npc, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <strong className="text-zinc-100 text-xs block">
                              {npc.count}x {npc.name}
                            </strong>
                            <span className="text-[10px] font-mono text-red-400">{npc.role}</span>
                          </div>
                          <div className="text-right font-mono text-[11px]">
                            <span className="text-zinc-300 block">HP: <strong className="text-white">{npc.hp}</strong></span>
                            <span className="text-zinc-400 text-[10px]">SP: {npc.headSP}/{npc.bodySP}</span>
                          </div>
                        </div>

                        <div className="text-[10px] font-mono text-zinc-400 space-y-0.5 pt-1 border-t border-zinc-800/60">
                          <div>Armas: <span className="text-zinc-200">{npc.weapons.join(', ')}</span></div>
                          <div>Combat Number: <span className="text-red-400 font-bold">{npc.combatNumber}</span></div>
                          <div className="pt-0.5">Tática: <span className="text-zinc-300 font-sans italic">{npc.tactics}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-zinc-500 font-mono text-xs">
                    Nenhum inimigo estacionado nesta sala no momento.
                  </div>
                )}
              </div>

              {/* Column 2: Pontos de Interação Táticos & Hackeáveis */}
              <div className="p-4 rounded-xl bg-[#0a0a0d] border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="text-xs font-mono font-bold text-zinc-200 uppercase flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>Pontos de Invasão & Interação Tática</span>
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {selectedRoom.interactionPoints ? selectedRoom.interactionPoints.length : 0} disponíveis
                  </span>
                </div>

                {selectedRoom.interactionPoints && selectedRoom.interactionPoints.length > 0 ? (
                  <div className="space-y-3">
                    {selectedRoom.interactionPoints.map((pt, pIdx) => (
                      <div key={pIdx} className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <strong className="text-zinc-100 text-xs block">{pt.title}</strong>
                            <div className="flex items-center gap-2 mt-0.5">
                              {pt.dv && (
                                <span className="px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-mono text-[10px] font-bold">
                                  DV {pt.dv}
                                </span>
                              )}
                              {pt.skillRequired && (
                                <span className="text-[10px] font-mono text-zinc-400">
                                  Perícia: {pt.skillRequired}
                                </span>
                              )}
                            </div>
                          </div>

                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 uppercase">
                            {pt.type}
                          </span>
                        </div>

                        <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                          {pt.description}
                        </p>

                        <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 text-[10px] font-mono text-emerald-400">
                          <strong>Efeito Tático:</strong> {pt.effect}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-zinc-500 font-mono text-xs">
                    Nenhum dispositivo de segurança ou terminal identificado.
                  </div>
                )}
              </div>
            </div>

            {/* Room Footer: Loot and Navigation Links */}
            <div className="pt-3 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs">
              <div className="text-zinc-400">
                {selectedRoom.lootText && (
                  <span className="text-amber-300 flex items-center gap-1.5">
                    <span>📦</span> Saque Oculto: <strong>{selectedRoom.lootText}</strong>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-zinc-400">
                <span>Passagens Diretas:</span>
                {selectedRoom.connectedRoomNumbers.map(cNum => (
                  <button
                    key={cNum}
                    type="button"
                    onClick={() => setSelectedRoomNumber(cNum)}
                    className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-purple-900/60 text-zinc-300 hover:text-purple-200 border border-zinc-700 transition"
                  >
                    Ir p/ Sala #{cNum} &rarr;
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SAVED STRUCTURES VAULT */}
      {savedStructures.length > 0 && (
        <div className="p-5 rounded-2xl bg-[#121217] border border-[#27272a] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-purple-400" />
              <span>Cofre de Estruturas & Bases Salvas na Campanha ({savedStructures.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {savedStructures.map(saved => (
              <div
                key={saved.id}
                className="p-3.5 rounded-xl bg-[#0a0a0d] border border-zinc-800 flex flex-col justify-between space-y-2 hover:border-zinc-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 mb-1">
                    <span>{saved.category}</span>
                    <span className="text-purple-400 font-bold">{saved.rooms.length} Salas</span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-100 truncate">{saved.name}</h4>
                  <div className="text-[10px] text-zinc-400 font-mono truncate">{saved.faction} &bull; {saved.district}</div>
                </div>

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStructure(saved);
                      setSelectedRoomNumber(1);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[11px] font-mono font-medium transition"
                  >
                    Abrir Planta
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSaved(saved.id)}
                    className="p-1 text-zinc-500 hover:text-red-400 transition"
                    title="Excluir do Cofre"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
