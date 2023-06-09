import { openDB } from 'idb';

type PlanData = {
  id: string;
  text: string;
  date: string;
};

class IndexedDBManager {
  private db: any;
  async openDB(): Promise<void> {
    this.db = await openDB('planDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('plans')) {
          db.createObjectStore('plans', { keyPath: 'id' });
        }
      },
    });
  }

  public async addData(data: PlanData): Promise<void> {
    if (!this.db) {
      throw new Error('Database is not open');
    }

    const tx = this.db.transaction('plans', 'readwrite');
    const store = tx.objectStore('plans');
    const request = store.add(data);
    await new Promise<void>((resolve) => {
      request.onsuccess = () => resolve();
    });
    await tx.done;
  }

  async listByFuture(key: string): Promise<any[]> {
    const list: any[] = [];
    if (!this.db) {
      await this.openDB();
    }
    const transaction = this.db.transaction('plans', 'readonly');
    const objectStore = transaction.objectStore('plans');
    const plans = await objectStore.getAll();
    const promiseArray = plans.map((item: any) => {
      if (item.date === key && item.type === 'plan') {
        list.push(item);
      }
    });
    await Promise.all(promiseArray);
    return list;
  }

  async listByPast(key: string): Promise<any[]> {
    const list: any[] = [];
    if (!this.db) {
      await this.openDB();
    }
    const transaction = this.db.transaction('plans', 'readonly');
    const objectStore = transaction.objectStore('plans');
    const plans = await objectStore.getAll();
    const promiseArray = plans.map((item: any) => {
      if (item.date === key && item.type === 'past') {
        list.push(item);
      }
    });
    await Promise.all(promiseArray);
    return list;
  }

  async updateType(planId: string, type: string) {
    const transaction = this.db.transaction('plans', 'readwrite');
    const objectStore = transaction.objectStore('plans');
    const getRequest = await objectStore.get(planId);
    getRequest.type = type;
    const updateRequest = await objectStore.put(getRequest);
    return updateRequest;
  }

  async deletePlan(planId: string): Promise<void> {
    const transaction = this.db.transaction('plans', 'readwrite');
    const objectStore = transaction.objectStore('plans');
    await objectStore.delete(planId);
  }

  isDatabaseReady() {
    return new Promise((resolve) => {
      const request = window.indexedDB.open('planDB');
      request.onsuccess = () => {
        const db = request.result;
        db.close();
        resolve(true);
      };
      request.onerror = () => {
        resolve(false);
      };
    });
  }
}

export default IndexedDBManager;
