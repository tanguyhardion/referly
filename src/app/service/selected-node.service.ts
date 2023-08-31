import { Injectable } from '@angular/core';
import { Node } from '../model/node';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectedNodeService {
  private selectedNode = new BehaviorSubject<Node | null>(null);

  getSelectedNode(): BehaviorSubject<Node | null> {
    return this.selectedNode;
  }

  constructor() {}

  setSelectedNode(node: Node) {
    this.selectedNode.next(node);
  }
}
