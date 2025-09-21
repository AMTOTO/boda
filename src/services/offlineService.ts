interface OfflineData {
  id: string;
  type: 'household' | 'patient' | 'vaccination' | 'transport_request' | 'health_alert';
  data: any;
  timestamp: Date;
  synced: boolean;
}

class OfflineService {
  private dbName = 'ParaBodaOfflineDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (typeof window === 'undefined' || !window.indexedDB) {
      console.warn('IndexedDB not available');
      return;
    }
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('offlineData')) {
          const store = db.createObjectStore('offlineData', { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('synced', 'synced', { unique: false });
        }

        if (!db.objectStoreNames.contains('userSettings')) {
          db.createObjectStore('userSettings', { keyPath: 'key' });
        }
      };
    });
  }

  async saveData(type: OfflineData['type'], data: any): Promise<string> {
    if (!this.db) await this.init();

    const offlineData: OfflineData = {
      id: `${type}_${Date.now()}`,
      type,
      data,
      timestamp: new Date(),
      synced: false
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      const request = store.add(offlineData);

      request.onsuccess = () => resolve(offlineData.id);
      request.onerror = () => reject(request.error);
    });
  }

  async getData(type?: OfflineData['type']): Promise<OfflineData[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      
      let request: IDBRequest;
      if (type) {
        const index = store.index('type');
        request = index.getAll(type);
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getUnsyncedData(): Promise<OfflineData[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      const index = store.index('synced');
      const request = index.getAll(false);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async markAsSynced(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      const getRequest = store.get(id);

      getRequest.onsuccess = () => {
        const data = getRequest.result;
        if (data) {
          data.synced = true;
          const putRequest = store.put(data);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        } else {
          reject(new Error('Data not found'));
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async syncData(): Promise<void> {
    const unsyncedData = await this.getUnsyncedData();
    
    for (const item of unsyncedData) {
      try {
        // Simulate API sync
        await this.syncToServer(item);
        await this.markAsSynced(item.id);
      } catch (error) {
        console.error('Sync failed for item:', item.id, error);
      }
    }
  }

  private async syncToServer(data: OfflineData): Promise<void> {
    // Mock API call - replace with actual server sync
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Synced to server:', data);
        resolve();
      }, 1000);
    });
  }

  async clearSyncedData(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      const index = store.index('synced');
      const request = index.openCursor(true);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  // Check if online and trigger sync
  async checkAndSync(): Promise<void> {
    if (navigator.onLine) {
      await this.syncData();
    }
  }
}

export const offlineService = new OfflineService();

// Initialize offline service
offlineService.init().catch(console.error);

// Auto-sync when coming back online
window.addEventListener('online', () => {
  offlineService.checkAndSync().catch(console.error);
});