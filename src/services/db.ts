/**
 * Cyberpunk RED & 2020 GM Suite - Persistent Storage Database Engine
 * Unified IndexedDB with automatic LocalStorage synchronization, 
 * zero quota errors, offline PDF storage, and full database export/import.
 */

const DB_NAME = 'CyberpunkSuiteDB';
const DB_VERSION = 1;

export interface VaultPdfDoc {
  id: string;
  name: string;
  title: string;
  size: string;
  category: string;
  data: ArrayBuffer | Blob;
  addedAt: string;
}

export interface FullDatabaseBackup {
  version: number;
  exportedAt: string;
  source: string;
  playerCharacters: any[];
  savedNPCs: any[];
  worldState: any;
  campaignDiaries: any[];
  campaignNotes: string;
  homebrewLibrary: any;
  savedStructures: any[];
  customBars: any[];
  customVehicles: any[];
  settings: Record<string, any>;
}

class CyberpunkDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported in this environment'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        
        // Create Object Stores if they don't exist
        const stores = [
          'characters',
          'npcs',
          'world',
          'campaign',
          'arsenal',
          'combat',
          'structures',
          'pdfVault',
          'settings'
        ];

        stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        });
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  // Generic key-value helpers
  async setItem(storeName: string, id: string, data: any): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const record = { id, data, updatedAt: new Date().toISOString() };
        const req = store.put(record);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      console.warn(`[CyberpunkDB] Failed to set ${storeName}/${id}:`, e);
      // Fallback to localStorage if possible
      try {
        if (typeof data === 'string') {
          localStorage.setItem(`cp_db_${storeName}_${id}`, data);
        } else {
          localStorage.setItem(`cp_db_${storeName}_${id}`, JSON.stringify(data));
        }
      } catch {}
    }
  }

  async getItem<T = any>(storeName: string, id: string): Promise<T | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.get(id);
        req.onsuccess = () => {
          if (req.result && 'data' in req.result) {
            resolve(req.result.data as T);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      // Fallback
      try {
        const fallback = localStorage.getItem(`cp_db_${storeName}_${id}`);
        return fallback ? JSON.parse(fallback) : null;
      } catch {
        return null;
      }
    }
  }

  async deleteItem(storeName: string, id: string): Promise<void> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      try {
        localStorage.removeItem(`cp_db_${storeName}_${id}`);
      } catch {}
    }
  }

  async getAllItems<T = any>(storeName: string): Promise<T[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => {
          const results = (req.result || []).map(r => r.data || r);
          resolve(results as T[]);
        };
        req.onerror = () => reject(req.error);
      });
    } catch (e) {
      return [];
    }
  }

  // ==========================================
  // DOMAIN-SPECIFIC STORAGE METHODS
  // ==========================================

  // 1. Player Characters
  async saveCharacters(characters: any[]): Promise<void> {
    await this.setItem('characters', 'player_list', characters);
    try {
      localStorage.setItem('cyberpunk_player_characters', JSON.stringify(characters));
    } catch {}
  }

  async loadCharacters(): Promise<any[] | null> {
    const fromDB = await this.getItem<any[]>('characters', 'player_list');
    if (fromDB && fromDB.length > 0) return fromDB;

    // LocalStorage fallback
    try {
      const saved = localStorage.getItem('cyberpunk_player_characters');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  // 2. NPCs & Bestiary
  async saveNPCs(npcs: any[]): Promise<void> {
    await this.setItem('npcs', 'saved_npcs_list', npcs);
    try {
      localStorage.setItem('cyberpunk_gm_saved_npcs', JSON.stringify(npcs));
    } catch {}
  }

  async loadNPCs(): Promise<any[] | null> {
    const fromDB = await this.getItem<any[]>('npcs', 'saved_npcs_list');
    if (fromDB) return fromDB;
    try {
      const saved = localStorage.getItem('cyberpunk_gm_saved_npcs');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  // 3. Campaign Diaries (Markdown)
  async saveDiaries(diaries: any[]): Promise<void> {
    await this.setItem('campaign', 'markdown_diaries', diaries);
    try {
      localStorage.setItem('cyberpunk_campaign_markdown_diaries', JSON.stringify(diaries));
    } catch {}
  }

  async loadDiaries(): Promise<any[] | null> {
    const fromDB = await this.getItem<any[]>('campaign', 'markdown_diaries');
    if (fromDB) return fromDB;
    try {
      const saved = localStorage.getItem('cyberpunk_campaign_markdown_diaries');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  // 4. World State (Pins, Safe Houses, Custom Bars)
  async saveWorldState(worldState: any): Promise<void> {
    await this.setItem('world', 'campaign_world_state', worldState);
    try {
      localStorage.setItem('cyberpunk_gm_world_state', JSON.stringify(worldState));
    } catch {}
  }

  async loadWorldState(): Promise<any | null> {
    const fromDB = await this.getItem<any>('world', 'campaign_world_state');
    if (fromDB) return fromDB;
    try {
      const saved = localStorage.getItem('cyberpunk_gm_world_state');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  // 5. Saved Structures
  async saveStructures(structures: any[]): Promise<void> {
    await this.setItem('structures', 'saved_structures_list', structures);
    try {
      localStorage.setItem('cyberpunk_saved_structures', JSON.stringify(structures));
    } catch {}
  }

  async loadStructures(): Promise<any[] | null> {
    const fromDB = await this.getItem<any[]>('structures', 'saved_structures_list');
    if (fromDB) return fromDB;
    try {
      const saved = localStorage.getItem('cyberpunk_saved_structures');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  // 6. Homebrew Library
  async saveHomebrew(homebrew: any): Promise<void> {
    await this.setItem('arsenal', 'homebrew_library', homebrew);
    try {
      localStorage.setItem('cyberpunk_homebrew_library', JSON.stringify(homebrew));
    } catch {}
  }

  async loadHomebrew(): Promise<any | null> {
    const fromDB = await this.getItem<any>('arsenal', 'homebrew_library');
    if (fromDB) return fromDB;
    try {
      const saved = localStorage.getItem('cyberpunk_homebrew_library');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  // 7. PDF Vault (Offline stored books & supplements inside IndexedDB)
  async savePdfToVault(doc: {
    id: string;
    name: string;
    title: string;
    size: string;
    category: string;
    data: ArrayBuffer | Blob;
  }): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('pdfVault', 'readwrite');
      const store = tx.objectStore('pdfVault');
      const record = {
        id: doc.id,
        name: doc.name,
        title: doc.title,
        size: doc.size,
        category: doc.category || 'Manual',
        data: doc.data,
        addedAt: new Date().toISOString(),
      };
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getPdfFromVault(id: string): Promise<VaultPdfDoc | null> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('pdfVault', 'readonly');
        const store = tx.objectStore('pdfVault');
        const req = store.get(id);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return null;
    }
  }

  async getAllVaultPdfs(): Promise<{ id: string; name: string; title: string; size: string; category: string; addedAt: string }[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction('pdfVault', 'readonly');
        const store = tx.objectStore('pdfVault');
        const req = store.getAll();
        req.onsuccess = () => {
          const list = (req.result || []).map(item => ({
            id: item.id,
            name: item.name,
            title: item.title,
            size: item.size,
            category: item.category,
            addedAt: item.addedAt,
          }));
          resolve(list);
        };
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [];
    }
  }

  async deletePdfFromVault(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('pdfVault', 'readwrite');
      const store = tx.objectStore('pdfVault');
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // ==========================================
  // FULL DATABASE EXPORT & RESTORE ENGINE
  // ==========================================

  async exportFullDatabaseBackup(): Promise<string> {
    const characters = (await this.loadCharacters()) || [];
    const npcs = (await this.loadNPCs()) || [];
    const worldState = (await this.loadWorldState()) || {};
    const diaries = (await this.loadDiaries()) || [];
    const structures = (await this.loadStructures()) || [];
    const homebrew = (await this.loadHomebrew()) || {};

    let notes = '';
    let customBars: any[] = [];
    let customVehicles: any[] = [];
    try {
      notes = localStorage.getItem('cyberpunk_gm_campaign_notes') || '';
      customBars = JSON.parse(localStorage.getItem('cyberpunk_custom_bars') || '[]');
      customVehicles = JSON.parse(localStorage.getItem('cyberpunk_custom_vehicles') || '[]');
    } catch {}

    const backup: FullDatabaseBackup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      source: 'Cyberpunk GM Suite Persistent IndexedDB Engine',
      playerCharacters: characters,
      savedNPCs: npcs,
      worldState,
      campaignDiaries: diaries,
      campaignNotes: notes,
      homebrewLibrary: homebrew,
      savedStructures: structures,
      customBars,
      customVehicles,
      settings: {
        role: localStorage.getItem('cyberpunk_user_role') || 'GM',
        system: localStorage.getItem('cyberpunk_gm_system') || 'RED',
        geminiKeySet: !!localStorage.getItem('cyberpunk_gemini_api_key'),
      },
    };

    return JSON.stringify(backup, null, 2);
  }

  async importFullDatabaseBackup(jsonString: string): Promise<{ success: boolean; message: string; counts: Record<string, number> }> {
    try {
      const backup: FullDatabaseBackup = JSON.parse(jsonString);

      if (!backup.playerCharacters && !backup.savedNPCs && !backup.worldState) {
        return { success: false, message: 'Arquivo JSON não contém uma estrutura de backup válida do Cyberpunk GM Suite.', counts: {} };
      }

      const counts: Record<string, number> = {};

      if (Array.isArray(backup.playerCharacters)) {
        await this.saveCharacters(backup.playerCharacters);
        counts['Personagens'] = backup.playerCharacters.length;
      }
      if (Array.isArray(backup.savedNPCs)) {
        await this.saveNPCs(backup.savedNPCs);
        counts['NPCs & Inimigos'] = backup.savedNPCs.length;
      }
      if (backup.worldState) {
        await this.saveWorldState(backup.worldState);
        counts['Locais do Mapa'] = backup.worldState.customLocations?.length || 0;
      }
      if (Array.isArray(backup.campaignDiaries)) {
        await this.saveDiaries(backup.campaignDiaries);
        counts['Abas de Diário'] = backup.campaignDiaries.length;
      }
      if (Array.isArray(backup.savedStructures)) {
        await this.saveStructures(backup.savedStructures);
        counts['Estruturas'] = backup.savedStructures.length;
      }
      if (backup.homebrewLibrary) {
        await this.saveHomebrew(backup.homebrewLibrary);
        counts['Itens Homebrew'] = (backup.homebrewLibrary.weapons?.length || 0) + (backup.homebrewLibrary.cyberware?.length || 0);
      }
      if (backup.campaignNotes) {
        localStorage.setItem('cyberpunk_gm_campaign_notes', backup.campaignNotes);
      }
      if (Array.isArray(backup.customBars)) {
        localStorage.setItem('cyberpunk_custom_bars', JSON.stringify(backup.customBars));
      }
      if (Array.isArray(backup.customVehicles)) {
        localStorage.setItem('cyberpunk_custom_vehicles', JSON.stringify(backup.customVehicles));
      }

      return {
        success: true,
        message: 'Backup restaurado com sucesso no IndexedDB e LocalStorage!',
        counts,
      };
    } catch (err: any) {
      return { success: false, message: `Erro ao importar: ${err?.message || 'JSON inválido'}`, counts: {} };
    }
  }

  /**
   * Initializes database and migrates any legacy localStorage records
   * into IndexedDB so no existing user data is ever lost.
   */
  async init(): Promise<void> {
    try {
      await this.getDB();

      // Check if characters exist in IndexedDB; if not, migrate from localStorage
      const existingChars = await this.getItem('characters', 'player_list');
      if (!existingChars) {
        const lsChars = localStorage.getItem('cyberpunk_player_characters');
        if (lsChars) {
          try {
            await this.saveCharacters(JSON.parse(lsChars));
          } catch {}
        }
      }

      // Check NPCs
      const existingNPCs = await this.getItem('npcs', 'saved_npcs_list');
      if (!existingNPCs) {
        const lsNPCs = localStorage.getItem('cyberpunk_gm_saved_npcs');
        if (lsNPCs) {
          try {
            await this.saveNPCs(JSON.parse(lsNPCs));
          } catch {}
        }
      }

      // Check Diaries
      const existingDiaries = await this.getItem('campaign', 'markdown_diaries');
      if (!existingDiaries) {
        const lsDiaries = localStorage.getItem('cyberpunk_campaign_markdown_diaries');
        if (lsDiaries) {
          try {
            await this.saveDiaries(JSON.parse(lsDiaries));
          } catch {}
        }
      }

      // Check World
      const existingWorld = await this.getItem('world', 'campaign_world_state');
      if (!existingWorld) {
        const lsWorld = localStorage.getItem('cyberpunk_gm_world_state');
        if (lsWorld) {
          try {
            await this.saveWorldState(JSON.parse(lsWorld));
          } catch {}
        }
      }

      // Check Structures
      const existingStructs = await this.getItem('structures', 'saved_structures_list');
      if (!existingStructs) {
        const lsStructs = localStorage.getItem('cyberpunk_saved_structures');
        if (lsStructs) {
          try {
            await this.saveStructures(JSON.parse(lsStructs));
          } catch {}
        }
      }

      // Check Homebrew
      const existingHomebrew = await this.getItem('arsenal', 'homebrew_library');
      if (!existingHomebrew) {
        const lsHomebrew = localStorage.getItem('cyberpunk_homebrew_library');
        if (lsHomebrew) {
          try {
            await this.saveHomebrew(JSON.parse(lsHomebrew));
          } catch {}
        }
      }
    } catch (err) {
      console.warn('[CyberpunkDB] Init warning:', err);
    }
  }
}

export const cyberpunkDB = new CyberpunkDatabase();
// Trigger background initialization
if (typeof window !== 'undefined') {
  cyberpunkDB.init();
}
