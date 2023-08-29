import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { StorageService } from 'src/app/service/storage.service';
import { ItemListComponent } from '../item-list/item-list.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, ItemListComponent],
})
export class HomePage {
  tesseractOutput: string = '';

  constructor(private storage: StorageService) {}
}
