import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameSystem } from '../types/system';

interface SystemContextType {
  system: GameSystem;
  setSystem: (system: GameSystem) => void;
  toggleSystem: () => void;
  isRed: boolean;
  is2020: boolean;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [system, setSystemState] = useState<GameSystem>(() => {
    const saved = localStorage.getItem('cyberpunk_gm_system');
    return (saved === '2020' || saved === 'RED') ? saved : 'RED';
  });

  useEffect(() => {
    localStorage.setItem('cyberpunk_gm_system', system);
  }, [system]);

  const setSystem = (newSystem: GameSystem) => {
    setSystemState(newSystem);
  };

  const toggleSystem = () => {
    setSystemState(prev => prev === 'RED' ? '2020' : 'RED');
  };

  return (
    <SystemContext.Provider value={{
      system,
      setSystem,
      toggleSystem,
      isRed: system === 'RED',
      is2020: system === '2020',
    }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = (): SystemContextType => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
