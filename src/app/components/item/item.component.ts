import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { Item } from 'src/app/model/item';
import { Router } from '@angular/router';

@Component({
  selector: 'item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule],
})
export class ItemComponent {
  @Input() item: Item;

  constructor(private router: Router) {}

  onClick(): void {
    this.router.navigate(['edit', this.item.name]);
  }
}
