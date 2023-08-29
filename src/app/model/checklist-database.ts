import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { TodoItemNode } from './todo-item-node';
import { StorageService } from '../service/storage.service';
import { Item } from './item';
import { TodoItemFlatNode } from './todo-item-flat-node';

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);
  item1 = new Item('item1', 'content1', []);
  item2 = new Item('item2', 'content2', []);
  item3 = new Item('item3', 'content3', []);
  item4 = new Item('item4', 'content4', []);
  item5 = new Item('item5', 'content5', []);
  TREE_DATA = {
    Category: {
      'SubCategory 1': [this.item1.name, this.item2.name],
    },
    Category2: {
      'SubCategory 2': [this.item3.name, this.item4.name],
    },
    Category3: {
      'SubCategory 3': [this.item5.name],
    },
  };

  get data(): TodoItemNode[] {
    return this.dataChange.value;
  }

  constructor(private storageService: StorageService) {
    this.initialize();
  }

  async initialize() {
    const data = this.buildFileTree(await this.storageService.getRoot(), 0);

    // notify the change
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: { [key: string]: any }, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  addCategory(name: string) {
    this.data.push({
      item: name,
      isCategory: true,
      children: [],
    } as TodoItemNode);
    this.dataChange.next(this.data);
    this.storageService.addCategory(name);
  }

  /**
   * Add a sub-category
   */
  addSubCategory(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({ item: name } as TodoItemNode);
      this.dataChange.next(this.data);
      this.storageService.addSubCategory(parent.item, {
        name: name,
        items: [],
      });
    }
  }

  /**
   * Add an item to to-do list
   */
  addItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({ item: name } as TodoItemNode);
      this.dataChange.next(this.data);
      this.storageService.addItem(parent.item, name, {
        name: name,
        content: '',
        keywords: [],
      });
    }
  }

  updateItem(parentNode: TodoItemFlatNode, node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
    this.storageService.addItem(parentNode.item, node.item, {
      name: node.item,
      content: '',
      keywords: [],
    });
  }

  clear() {
    this.storageService.clear();
    this.dataChange.next(this.data);
  }
}
