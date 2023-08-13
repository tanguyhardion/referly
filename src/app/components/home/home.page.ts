import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import * as Tesseract from 'tesseract.js';
import { SQLiteService } from 'src/app/services/sqlite.service';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class HomePage implements OnInit {
  tesseractOutput: string;
  dbContent: string;

  constructor(
    private sqliteService: SQLiteService,
    private sqliteDBConnection: SQLiteDBConnection
  ) {
    this.tesseractOutput = '';
    this.dbContent = '';
    this.sqliteService.initializePlugin();
    this.sqliteService
      .openDatabase('referly.db', false, 'secret', 1, false)
      .then((db: any) => {
        this.sqliteDBConnection = db;
      })
      .catch((error) => {
        console.error(error);
      });
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

  saveToDB() {
  }
}
