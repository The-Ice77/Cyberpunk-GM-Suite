import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameSystem } from '../types/system';

export interface Combatant {
  id: string;
  name: string;
  system: GameSystem;
  initiative: number;
  currentHP: number;
  maxHP: number;
  // RED Armor:
  headSP: number;
  bodySP: number;
  // 2020 Armor:
  torsoSP?: number;
  rArmSP?: number;
  lArmSP?: number;
  rLegSP?: number;
  lLegSP?: number;
  btm?: number;
  // Status:
  conditions: string[];
  criticalInjuries: string[];
  deathSavePenalty: number;
  notes?: string;
  faction?: string;
  appearance?: string;
  weapons?: { name: string; damage: string; rof: number }[];
  combatNumber?: number;
}

interface CombatContextType {
  combatants: Combatant[];
  activeTurnIndex: number;
  roundNumber: number;
  addCombatant: (c: Combatant) => void;
  addMultipleCombatants: (items: Combatant[]) => void;
  removeCombatant: (id: string) => void;
  updateHP: (id: string, delta: number) => void;
  ablateSP: (id: string, location: 'head' | 'body' | 'torso' | 'rArm' | 'lArm' | 'rLeg' | 'lLeg', delta: number) => void;
  toggleCondition: (id: string, condition: string) => void;
  addCriticalInjury: (id: string, injury: string) => void;
  removeCriticalInjury: (id: string, injury: string) => void;
  updateCombatant: (id: string, partial: Partial<Combatant>) => void;
  rollInitiativeForCombatant: (id: string, refStat: number) => void;
  sortInitiative: () => void;
  nextTurn: () => void;
  prevTurn: () => void;
  clearCombat: () => void;
  exportJSON: () => string;
  importJSON: (data: string) => boolean;
}

const CombatContext = createContext<CombatContextType | undefined>(undefined);

export const CombatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [combatants, setCombatants] = useState<Combatant[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpunk_gm_combat_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTurnIndex, setActiveTurnIndex] = useState<number>(0);
  const [roundNumber, setRoundNumber] = useState<number>(1);

  useEffect(() => {
    localStorage.setItem('cyberpunk_gm_combat_list', JSON.stringify(combatants));
  }, [combatants]);

  const addCombatant = (c: Combatant) => {
    setCombatants(prev => [...prev, c]);
  };

  const addMultipleCombatants = (items: Combatant[]) => {
    setCombatants(prev => [...prev, ...items]);
  };

  const removeCombatant = (id: string) => {
    setCombatants(prev => prev.filter(c => c.id !== id));
  };

  const updateHP = (id: string, delta: number) => {
    setCombatants(prev => prev.map(c => {
      if (c.id !== id) return c;
      const newHP = Math.max(0, Math.min(c.maxHP, c.currentHP + delta));
      const conditions = [...c.conditions];
      
      const halfHP = Math.ceil(c.maxHP / 2);
      if (newHP <= halfHP && newHP > 0 && !conditions.includes('Gravemente Ferido (-2)')) {
        conditions.push('Gravemente Ferido (-2)');
      } else if (newHP > halfHP) {
        const idx = conditions.indexOf('Gravemente Ferido (-2)');
        if (idx !== -1) conditions.splice(idx, 1);
      }

      if (newHP === 0 && !conditions.includes('Ferido Mortalmente (Death Save!)')) {
        conditions.push('Ferido Mortalmente (Death Save!)');
      } else if (newHP > 0) {
        const idx = conditions.indexOf('Ferido Mortalmente (Death Save!)');
        if (idx !== -1) conditions.splice(idx, 1);
      }

      return { ...c, currentHP: newHP, conditions };
    }));
  };

  const ablateSP = (id: string, location: 'head' | 'body' | 'torso' | 'rArm' | 'lArm' | 'rLeg' | 'lLeg', delta: number) => {
    setCombatants(prev => prev.map(c => {
      if (c.id !== id) return c;
      const updated = { ...c };
      if (location === 'head') updated.headSP = Math.max(0, updated.headSP + delta);
      else if (location === 'body') updated.bodySP = Math.max(0, updated.bodySP + delta);
      else if (location === 'torso') updated.torsoSP = Math.max(0, (updated.torsoSP || 0) + delta);
      else if (location === 'rArm') updated.rArmSP = Math.max(0, (updated.rArmSP || 0) + delta);
      else if (location === 'lArm') updated.lArmSP = Math.max(0, (updated.lArmSP || 0) + delta);
      else if (location === 'rLeg') updated.rLegSP = Math.max(0, (updated.rLegSP || 0) + delta);
      else if (location === 'lLeg') updated.lLegSP = Math.max(0, (updated.lLegSP || 0) + delta);
      return updated;
    }));
  };

  const toggleCondition = (id: string, cond: string) => {
    setCombatants(prev => prev.map(c => {
      if (c.id !== id) return c;
      const exists = c.conditions.includes(cond);
      return {
        ...c,
        conditions: exists ? c.conditions.filter(x => x !== cond) : [...c.conditions, cond],
      };
    }));
  };

  const addCriticalInjury = (id: string, injury: string) => {
    setCombatants(prev => prev.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        criticalInjuries: [...c.criticalInjuries, injury],
        deathSavePenalty: c.deathSavePenalty + 1,
      };
    }));
  };

  const removeCriticalInjury = (id: string, injury: string) => {
    setCombatants(prev => prev.map(c => {
      if (c.id !== id) return c;
      return {
        ...c,
        criticalInjuries: c.criticalInjuries.filter(x => x !== injury),
        deathSavePenalty: Math.max(0, c.deathSavePenalty - 1),
      };
    }));
  };

  const updateCombatant = (id: string, partial: Partial<Combatant>) => {
    setCombatants(prev => prev.map(c => c.id === id ? { ...c, ...partial } : c));
  };

  const rollInitiativeForCombatant = (id: string, refStat: number) => {
    const roll = Math.floor(Math.random() * 10) + 1;
    const total = refStat + roll;
    setCombatants(prev => prev.map(c => c.id === id ? { ...c, initiative: total } : c));
  };

  const sortInitiative = () => {
    setCombatants(prev => [...prev].sort((a, b) => b.initiative - a.initiative));
    setActiveTurnIndex(0);
  };

  const nextTurn = () => {
    if (combatants.length === 0) return;
    if (activeTurnIndex >= combatants.length - 1) {
      setActiveTurnIndex(0);
      setRoundNumber(r => r + 1);
    } else {
      setActiveTurnIndex(prev => prev + 1);
    }
  };

  const prevTurn = () => {
    if (combatants.length === 0) return;
    if (activeTurnIndex <= 0) {
      setActiveTurnIndex(Math.max(0, combatants.length - 1));
      setRoundNumber(r => Math.max(1, r - 1));
    } else {
      setActiveTurnIndex(prev => prev - 1);
    }
  };

  const clearCombat = () => {
    setCombatants([]);
    setActiveTurnIndex(0);
    setRoundNumber(1);
    localStorage.removeItem('cyberpunk_gm_combat_list');
  };

  const exportJSON = () => {
    return JSON.stringify({ combatants, roundNumber, exportedAt: new Date().toISOString() }, null, 2);
  };

  const importJSON = (data: string): boolean => {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed.combatants)) {
        setCombatants(parsed.combatants);
        if (parsed.roundNumber) setRoundNumber(parsed.roundNumber);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <CombatContext.Provider value={{
      combatants,
      activeTurnIndex,
      roundNumber,
      addCombatant,
      addMultipleCombatants,
      removeCombatant,
      updateHP,
      ablateSP,
      toggleCondition,
      addCriticalInjury,
      removeCriticalInjury,
      updateCombatant,
      rollInitiativeForCombatant,
      sortInitiative,
      nextTurn,
      prevTurn,
      clearCombat,
      exportJSON,
      importJSON,
    }}>
      {children}
    </CombatContext.Provider>
  );
};

export const useCombat = (): CombatContextType => {
  const context = useContext(CombatContext);
  if (!context) {
    throw new Error('useCombat must be used within a CombatProvider');
  }
  return context;
};
