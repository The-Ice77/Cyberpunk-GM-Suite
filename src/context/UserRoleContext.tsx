import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlayerCharacter, PREMADE_ARCHETYPES } from '../data/playerArchetypes';

export type UserRole = 'GM' | 'PLAYER';

export interface CustomDistrictLocation {
  id: string;
  name: string;
  districtId: string;
  type: string;
  description: string;
  notes: string;
  x?: number;
  y?: number;
  dangerLevel: string;
  color?: string;
  icon?: string;
  factionId?: string;
  isAiGenerated?: boolean;
  gmSecrets?: string;
}

interface CampaignWorldState {
  customLocations: CustomDistrictLocation[];
  sessionLogs: { id: string; date: string; title: string; notes: string; xpAwarded: number }[];
  customFactions: { id: string; name: string; turf: string; leader: string; description: string }[];
}

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  // Player Characters Management
  playerCharacters: PlayerCharacter[];
  activeCharacterId: string | null;
  activeCharacter: PlayerCharacter | null;
  setActiveCharacterId: (id: string) => void;
  savePlayerCharacter: (pc: PlayerCharacter) => void;
  deletePlayerCharacter: (id: string) => void;
  // GM Campaign World State
  worldState: CampaignWorldState;
  addCustomLocation: (loc: CustomDistrictLocation) => void;
  updateCustomLocation: (id: string, partial: Partial<CustomDistrictLocation>) => void;
  deleteCustomLocation: (id: string) => void;
  addSessionLog: (log: { title: string; notes: string; xpAwarded: number }) => void;
  deleteSessionLog: (id: string) => void;
  addCustomFaction: (fac: { name: string; turf: string; leader: string; description: string }) => void;
  deleteCustomFaction: (id: string) => void;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined);

export const UserRoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('cyberpunk_user_role') as UserRole) || 'GM';
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !localStorage.getItem('cyberpunk_user_role');
  });

  // Player Characters List
  const [playerCharacters, setPlayerCharacters] = useState<PlayerCharacter[]>(() => {
    try {
      const saved = localStorage.getItem('cyberpunk_player_characters');
      return saved ? JSON.parse(saved) : PREMADE_ARCHETYPES;
    } catch {
      return PREMADE_ARCHETYPES;
    }
  });

  const [activeCharacterId, setActiveCharacterId] = useState<string | null>(() => {
    return playerCharacters[0]?.id || null;
  });

  // GM World Building State
  const [worldState, setWorldState] = useState<CampaignWorldState>(() => {
    try {
      const saved = localStorage.getItem('cyberpunk_gm_world_state');
      return saved
        ? JSON.parse(saved)
        : {
            customLocations: [
              {
                id: 'loc-1',
                name: 'Clínica Ripperdoc Dr. K Chrome',
                districtId: 'watson',
                type: 'Clínica Clandestina',
                description: 'Consultório nos fundos de uma casa de chá em Kabuki especializada em Sandevistan contrabandeadas.',
                notes: 'Dr. K deve um favor para o grupo por causa de uma dívida com a Maelstrom.',
                dangerLevel: 'Baixo',
                x: 430,
                y: 200,
              },
            ],
            sessionLogs: [
              {
                id: 'sess-1',
                date: new Date().toLocaleDateString('pt-BR'),
                title: 'Sessão 01: O Primeiro Contrato no Afterlife',
                notes: 'O grupo se conheceu nas mesas do Afterlife. Rogue ofereceu um serviço para resgatar uma carga de CHOOH2 na divisa de Watson com Rancho Coronado.',
                xpAwarded: 60,
              },
            ],
            customFactions: [
              {
                id: 'fac-1',
                name: 'Sindicato dos Corvos Negros',
                turf: 'Subsolos de Watson',
                leader: 'Valerie "Hex" Kane',
                description: 'Rede autônoma de contrabandistas de chips neurais proibidos e armas militares.',
              },
            ],
          };
    } catch {
      return { customLocations: [], sessionLogs: [], customFactions: [] };
    }
  });

  useEffect(() => {
    localStorage.setItem('cyberpunk_user_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('cyberpunk_player_characters', JSON.stringify(playerCharacters));
  }, [playerCharacters]);

  useEffect(() => {
    localStorage.setItem('cyberpunk_gm_world_state', JSON.stringify(worldState));
  }, [worldState]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setShowOnboarding(false);
  };

  const savePlayerCharacter = (pc: PlayerCharacter) => {
    setPlayerCharacters(prev => {
      const idx = prev.findIndex(p => p.id === pc.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = pc;
        return copy;
      }
      return [pc, ...prev];
    });
    setActiveCharacterId(pc.id);
  };

  const deletePlayerCharacter = (id: string) => {
    setPlayerCharacters(prev => prev.filter(p => p.id !== id));
    if (activeCharacterId === id) {
      setActiveCharacterId(playerCharacters.find(p => p.id !== id)?.id || null);
    }
  };

  const addCustomLocation = (loc: CustomDistrictLocation) => {
    setWorldState(prev => ({
      ...prev,
      customLocations: [...prev.customLocations, loc],
    }));
  };

  const updateCustomLocation = (id: string, partial: Partial<CustomDistrictLocation>) => {
    setWorldState(prev => ({
      ...prev,
      customLocations: prev.customLocations.map(l => (l.id === id ? { ...l, ...partial } : l)),
    }));
  };

  const deleteCustomLocation = (id: string) => {
    setWorldState(prev => ({
      ...prev,
      customLocations: prev.customLocations.filter(l => l.id !== id),
    }));
  };

  const addSessionLog = (log: { title: string; notes: string; xpAwarded: number }) => {
    setWorldState(prev => ({
      ...prev,
      sessionLogs: [
        {
          id: 'log-' + Date.now(),
          date: new Date().toLocaleDateString('pt-BR'),
          ...log,
        },
        ...prev.sessionLogs,
      ],
    }));
  };

  const deleteSessionLog = (id: string) => {
    setWorldState(prev => ({
      ...prev,
      sessionLogs: prev.sessionLogs.filter(s => s.id !== id),
    }));
  };

  const addCustomFaction = (fac: { name: string; turf: string; leader: string; description: string }) => {
    setWorldState(prev => ({
      ...prev,
      customFactions: [
        {
          id: 'fac-' + Date.now(),
          ...fac,
        },
        ...prev.customFactions,
      ],
    }));
  };

  const deleteCustomFaction = (id: string) => {
    setWorldState(prev => ({
      ...prev,
      customFactions: prev.customFactions.filter(f => f.id !== id),
    }));
  };

  const activeCharacter = playerCharacters.find(p => p.id === activeCharacterId) || playerCharacters[0] || null;

  return (
    <UserRoleContext.Provider
      value={{
        role,
        setRole,
        showOnboarding,
        setShowOnboarding,
        playerCharacters,
        activeCharacterId,
        activeCharacter,
        setActiveCharacterId,
        savePlayerCharacter,
        deletePlayerCharacter,
        worldState,
        addCustomLocation,
        updateCustomLocation,
        deleteCustomLocation,
        addSessionLog,
        deleteSessionLog,
        addCustomFaction,
        deleteCustomFaction,
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = (): UserRoleContextType => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider');
  }
  return context;
};
