import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { Item } from 'src/app/model/item';
import { StorageService } from 'src/app/service/storage.service';
import { SelectedNodeService } from 'src/app/service/selected-node.service';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'item-edit',
  templateUrl: './item-edit.component.html',
  styleUrls: ['./item-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class ItemEditComponent {
  item: Item;
  private onTextChangeSubject = new Subject<void>();

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

    this.onTextChangeSubject.pipe(debounceTime(1000)).subscribe(() => {
      this.storageService.updateReference(this.item);
    });
  }
  onTextChange(event: Event): void {
    this.item.content = (event.target as HTMLInputElement).value;
    this.onTextChangeSubject.next();
  }
}
