import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import * as Tesseract from 'tesseract.js';

import { SidenavComponent } from './components/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, SidenavComponent],
})
export class AppComponent implements OnInit {
  constructor() {}

  async ngOnInit(): Promise<void> {
    // tesseract warm up
    Tesseract.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  }

  /* onFileUpload(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.tesseractOutput = 'Loading...';
      Tesseract.recognize(file)
        .then(({ data: { text } }) => {
          this.tesseractOutput = text;
        })
        .catch((error) => {
          console.error(error);
          this.tesseractOutput =
            'The image could not be read, please try again with a clearer picture.';
        });
    }
  }*/
}
