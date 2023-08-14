import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import * as Tesseract from 'tesseract.js';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class HomePage implements OnInit {
  tesseractOutput: string;

  constructor() {
    this.tesseractOutput = '';
  }

  ngOnInit(): void {
    // warming up tesseract
    Tesseract.recognize('https://tesseract.projectnaptha.com/img/eng_bw.png');
  }

  onFileUpload(event: Event) {
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
  }
}
