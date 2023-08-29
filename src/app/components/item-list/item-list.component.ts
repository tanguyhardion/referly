import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Item } from 'src/app/model/item';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, ItemComponent],
})
export class ItemListComponent {
  items: Item[] = [];
}
