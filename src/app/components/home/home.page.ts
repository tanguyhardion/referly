import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage.service';
import { ItemListComponent } from '../item-list/item-list.component';
import { SelectedNodeService } from 'src/app/service/selected-node.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ItemListComponent],
})
export class HomePage implements OnInit {
  hasSelectedNode: boolean;

  constructor(
    private storageService: StorageService,
    private selectedNodeService: SelectedNodeService
  ) {}

  ngOnInit(): void {
    this.selectedNodeService.getSelectedNode().subscribe(async (node) => {
      this.hasSelectedNode = !!(
        node && (await this.updateSelectedNodeStatus(node))
      );
    });
  }

  private async updateSelectedNodeStatus(node: any): Promise<boolean> {
    const items = await this.storageService.getItems(
      node.category,
      node.subCategory
    );
    return items.length > 0;
  }
}
