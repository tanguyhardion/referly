import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { TodoItemFlatNode } from '../../model/todo-item-flat-node';
import { TodoItemNode } from '../../model/todo-item-node';
import { ChecklistDatabase } from '../../model/checklist-database';
import { SelectedNodeService } from 'src/app/service/selected-node.service';
import { Node } from 'src/app/model/node';
import { StorageService } from 'src/app/service/storage.service';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tree',
  templateUrl: 'tree.component.html',
  styleUrls: ['tree.component.scss'],
  providers: [ChecklistDatabase],
  standalone: true,
  imports: [
    MatTreeModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
})
export class TreeComponent {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  sidenav: SidenavComponent;

  constructor(
    private _database: ChecklistDatabase,
    private selectedNodeService: SelectedNodeService,
    private storageService: StorageService,
    private viewContainerRef: ViewContainerRef,
    private router: Router
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this.getLevel,
      this.isExpandable,
      this.getChildren
    );
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(
      this.getLevel,
      this.isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    _database.dataChange.subscribe((data) => {
      this.dataSource.data = data;
    });

    const _injector = this.viewContainerRef.parentInjector;
    const _parent: SidenavComponent = _injector.get<SidenavComponent>(SidenavComponent); 
    this.sidenav = _parent;
  }

  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) =>
    _nodeData.item === '';

  isCategory = (_: number, _nodeData: TodoItemFlatNode) => {
    const nestedNode = this.flatNodeMap.get(_nodeData);
    return nestedNode?.isCategory;
  };

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };

  /**
   * Get the parent node of a node
   */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  insertCategory(name: string) {
    if (name !== '') {
      this._database.addCategory(name);
    }
  }

  insertSubCategory(node: TodoItemFlatNode) {
    const parentNode = this.flatNodeMap.get(node);
    this._database.addSubCategory(parentNode!, '');
    this.treeControl.expand(node);
  }

  /**
   * Save the node to database
   */
  saveNode(node: TodoItemFlatNode, itemValue: string) {
    const nestedNode = this.flatNodeMap.get(node);
    const parentNode = this.getParentNode(node);
    this._database.updateItem(parentNode!, nestedNode!, itemValue);
  }

  clearTree() {
    this._database.clear();
  }

  export() {
    this._database.export().then((data) => {
      this.downloadFile(data, 'data.json');
    });
  }

  downloadFile(data: string, fileName: string) {
    Filesystem.writeFile({
      path: fileName,
      data: data,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    }).then();
  }

  onNodeSelected(node: TodoItemFlatNode) {
    this.storageService
      .getSubCategory(this.getParentNode(node)!.item, node.item)
      .then((data) => {
        this.selectedNodeService.setSelectedNode(
          new Node(this.getParentNode(node)!.item, data)
        );
      });
      this.sidenav.toggle();
      this.router.navigate(['/home']);
    }
}
