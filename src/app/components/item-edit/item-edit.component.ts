import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { Item } from 'src/app/model/item';
import { StorageService } from 'src/app/service/storage.service';
import { SelectedNodeService } from 'src/app/service/selected-node.service';

@Component({
  selector: 'item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule],
})
export class ItemEditComponent implements OnInit {
  item: Item;

  constructor(
    private storageService: StorageService,
    private selectedNodeService: SelectedNodeService,
    private activatedRoute: ActivatedRoute
  ) {
    this.selectedNodeService.getSelectedNode().subscribe((node) => {
      if (node) {
        const itemParam = this.activatedRoute.snapshot.paramMap.get('item');
        if (itemParam) {
          this.storageService
            .getItem(node.category, node.subCategory.name, itemParam as string)
            .then((item) => {
              this.item = item;
            });
        }
      }
    });
  }

  async ngOnInit(): Promise<void> {}
}
