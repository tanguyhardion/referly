import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Item } from 'src/app/model/item';

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ItemComponent {
  @Input() item: Item;
}
