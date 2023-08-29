import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Item } from '../model/item';
import { SubCategory } from '../model/sub-category';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init().then(() => console.log('storage initialized'));
    this.getRoot().then((data) => console.log(data));
  }

  private async init() {
    this._storage = await this.storage.create();
    if ((await this.getRoot()) == null) {
      await this.set('root', {});
    }
  }

  /* tree methods */

  async getRoot(): Promise<any> {
    return await this.get('root');
  }

  async addCategory(category: string): Promise<any> {
    const root = await this.getRoot();
    root[category] = {};
    return await this.set('root', root);
  }

  async removeCategory(category: string): Promise<any> {
    const root = await this.getRoot();
    delete root[category];
    return await this.set('root', root);
  }

  async addSubCategory(
    category: string,
    subCategory: SubCategory
  ): Promise<any> {
    const root = await this.getRoot();
    root[category][subCategory.name] = subCategory.items;
    return await this.set('root', root);
  }

  async removeSubCategory(category: string, subCategory: string): Promise<any> {
    const root = await this.getRoot();
    delete root[category][subCategory];
    return await this.set('root', root);
  }

  async addItem(
    category: string,
    subCategory: string,
    item: Item
  ): Promise<any> {
    const root = await this.getRoot();
    if (!root[category][subCategory]) {
      root[category][subCategory] = []; // Initialize the array
    }
    return await this.set('root', root);
  }

  /* ------------- */

  /* basic methds */

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

  /* ------------- */
}
