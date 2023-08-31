import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Camera, CameraResultType } from '@capacitor/camera';

import { createWorker } from 'tesseract.js';

import { Item } from 'src/app/model/item';
import { ItemComponent } from '../item/item.component';
import { StorageService } from 'src/app/service/storage.service';
import { SelectedNodeService } from 'src/app/service/selected-node.service';

@Component({
  selector: 'item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, ItemComponent],
})
export class ItemListComponent implements OnInit {
  items: Item[] = [];

  constructor(
    private storageService: StorageService,
    private selectedNodeService: SelectedNodeService
  ) {}

  async ngOnInit(): Promise<void> {
    this.selectedNodeService.getSelectedNode().subscribe(async (node) => {
      if (node) {
        this.items = await this.storageService.getItems(
          node.category,
          node.subCategory
        );
      }
    });
  }

  onFabClick() {
    this.getPictureText();
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
    const worker = await createWorker();
    await worker.loadLanguage('fr');
    await worker.initialize('fr');

    const {
      data: { text },
    } = await worker.recognize(imageUrl);

    await worker.terminate();
    
    return text;
  }
}
