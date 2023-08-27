import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  async set(key: string, value: any): Promise<any> {
    return await this.storage?.set(key, value);
  }

  async get(key: string): Promise<any> {
    return await this.storage?.get(key);
  }

  async remove(key: string): Promise<any> {
    return await this.storage?.remove(key);
  }

  async clear(): Promise<any> {
    return await this.storage?.clear();
  }

  async getAllKeys(): Promise<string[]> {
    return await this.storage?.keys();
  }

  async getLength(): Promise<number> {
    return await this.storage?.length();
  }
}
