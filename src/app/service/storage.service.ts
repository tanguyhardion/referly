import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Item } from '../model/item';
import { SubCategory } from '../model/sub-category';
import { BehaviorSubject, Observable, Subject, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private _storage: Storage | null = null;
  private itemsSubject: Subject<Item[]> = new Subject<Item[]>(); // Use Subject or BehaviorSubject

  constructor(private storage: Storage) {
    this.init().then();
    this.getRoot().then();
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

  getItems(category: string, subCategory: SubCategory): Observable<Item[]> {
    this.getRoot().then((root) => {
      const items = root[category][subCategory.name].items;
      this.itemsSubject.next(items);
    });
    return from(this.getItemsFromStorage(category, subCategory));
  }

  async getItem(
    category: string,
    subCategory: string,
    item: string
  ): Promise<Item> {
    const root = await this.getRoot();
    return root[category][subCategory].items.find((i: Item) => i.name === item);
  }

  async getSubCategory(
    category: string,
    subCategory: string
  ): Promise<SubCategory> {
    const root = await this.getRoot();
    return root[category][subCategory];
  }

  async addSubCategory(
    category: string,
    subCategory: SubCategory
  ): Promise<any> {
    if (subCategory.name) {
      const root = await this.getRoot();
      root[category][subCategory.name] = subCategory;
      return await this.set('root', root);
    }
  }

  async removeSubCategory(category: string, subCategory: string): Promise<any> {
    const root = await this.getRoot();
    delete root[category][subCategory];
    return await this.set('root', root);
  }

  async addItem(
    category: string,
    subCategory: SubCategory,
    item: Item
  ): Promise<any> {
    const root = await this.getRoot();
    if (!root[category][subCategory.name]) {
      root[category][subCategory.name] = subCategory;
    }
    return await this.set('root', root);
  }

  async addReference(
    category: string,
    subCategory: SubCategory,
    item: Item
  ): Promise<any> {
    const root = await this.getRoot();
    const categoryObj = root[category];
    categoryObj[subCategory.name].items.push(item);

    await this.set('root', root);
    await this.emitItemsUpdate(category, subCategory);
  }

  private async emitItemsUpdate(category: string, subCategory: SubCategory) {
    const updatedItems = this.getItemsFromStorage(category, subCategory);
    this.itemsSubject.next(await updatedItems);
  }

  private async getItemsFromStorage(
    category: string,
    subCategory: SubCategory
  ): Promise<Item[]> {
    const root = await this.getRoot();
    const categoryObj = await root[category];
    return categoryObj[subCategory.name].items;
  }

  getItemsObservable(): Observable<Item[]> {
    return this.itemsSubject.asObservable();
  }

  async updateReference(item: Item): Promise<any> {
    const root = await this.getRoot();
    for (const category in root) {
      for (const subCategory in root[category]) {
        root[category][subCategory].items = root[category][
          subCategory
        ].items.map((i: Item) => {
          if (i.name === item.name) {
            return item;
          } else {
            return i;
          }
        });
      }
    }
    return await this.set('root', root);
  }

  async removeReference(item: Item): Promise<any> {
    const root = await this.getRoot();
    for (const category in root) {
      for (const subCategory in root[category]) {
        root[category][subCategory].items = root[category][
          subCategory
        ].items.filter((i: Item) => i.name !== item.name);
      }
    }
    return await this.set('root', root);
  }

  async export(): Promise<string> {
    const root = await this.getRoot();
    return JSON.stringify(root);
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
