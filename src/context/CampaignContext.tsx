import React, { createContext, useContext, useState, useEffect } from 'react';
import { NPCSheet } from '../types/system';

interface CampaignContextType {
  savedNPCs: NPCSheet[];
  saveNPC: (npc: NPCSheet) => void;
  deleteNPC: (id: string) => void;
  updateNPC: (id: string, updated: Partial<NPCSheet>) => void;
  exportNPCsJSON: () => string;
  importNPCsJSON: (jsonStr: string) => boolean;
  notes: string;
  setNotes: (notes: string) => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedNPCs, setSavedNPCs] = useState<NPCSheet[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpunk_gm_saved_npcs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notes, setNotesState] = useState<string>(() => {
    return localStorage.getItem('cyberpunk_gm_campaign_notes') || '';
  });

  useEffect(() => {
    localStorage.setItem('cyberpunk_gm_saved_npcs', JSON.stringify(savedNPCs));
  }, [savedNPCs]);

  useEffect(() => {
    localStorage.setItem('cyberpunk_gm_campaign_notes', notes);
  }, [notes]);

  const saveNPC = (npc: NPCSheet) => {
    setSavedNPCs(prev => {
      const exists = prev.findIndex(x => x.id === npc.id);
      if (exists !== -1) {
        const copy = [...prev];
        copy[exists] = npc;
        return copy;
      }
      return [npc, ...prev];
    });
  };

  const deleteNPC = (id: string) => {
    setSavedNPCs(prev => prev.filter(x => x.id !== id));
  };

  const updateNPC = (id: string, updated: Partial<NPCSheet>) => {
    setSavedNPCs(prev => prev.map(x => x.id === id ? { ...x, ...updated } : x));
  };

  const exportNPCsJSON = () => {
    return JSON.stringify({ npcs: savedNPCs, notes, exportDate: new Date().toISOString() }, null, 2);
  };

  const importNPCsJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (Array.isArray(parsed.npcs)) {
        setSavedNPCs(parsed.npcs);
        if (parsed.notes) setNotesState(parsed.notes);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return (
    <CampaignContext.Provider value={{
      savedNPCs,
      saveNPC,
      deleteNPC,
      updateNPC,
      exportNPCsJSON,
      importNPCsJSON,
      notes,
      setNotes: setNotesState,
    }}>
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = (): CampaignContextType => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};
