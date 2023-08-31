import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Camera, CameraResultType } from '@capacitor/camera';

import { NgxSpinnerService } from 'ngx-spinner';
import { NgxSpinnerModule } from 'ngx-spinner';

import { nanoid } from 'nanoid';
import * as Tesseract from 'tesseract.js';

import { Item } from 'src/app/model/item';
import { ItemComponent } from '../item/item.component';
import { StorageService } from 'src/app/service/storage.service';
import { SelectedNodeService } from 'src/app/service/selected-node.service';
import { Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    NgxSpinnerModule,
    ItemComponent,
  ],
})
export class ItemListComponent implements OnInit {
  items$: Observable<Item[]>;

  constructor(
    private storageService: StorageService,
    private selectedNodeService: SelectedNodeService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.items$ = this.selectedNodeService.getSelectedNode().pipe(
      switchMap((node) => {
        if (node) {
          return this.storageService.getItems(node.category, node.subCategory);
        } else {
          return of([]);
        }
      })
    );
  }

  onFabClick() {
    this.getPictureText().then((text) => {
      const node = this.selectedNodeService.getSelectedNode().value;
      if (node) {
        this.storageService.addReference(
          node.category,
          node.subCategory,
          new Item(nanoid(), text, [])
        );
      }
    });
  }

  async getPictureText(): Promise<string> {
    const image = await Camera.getPhoto({
      quality: 50,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });
    var imageUrl = image.webPath;

    return await this.recognizeImage(imageUrl!);
  }

  async recognizeImage(imageUrl: string): Promise<string> {
    /* const worker = await createWorker();
    await worker.loadLanguage('fr');
    await worker.initialize('fr');

    const {
      data: { text },
    } = await worker.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');

    await worker.terminate();

    return text; */

    this.spinner.show();

    try {
      const {
        data: { text },
      } = await Tesseract.recognize(imageUrl, 'fra');

      return text;
    } catch (error) {
      return 'image content could not be recognized';
    } finally {
      this.spinner.hide();
    }
  }
}
