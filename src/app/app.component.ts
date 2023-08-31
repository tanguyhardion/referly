import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { createWorker } from 'tesseract.js';

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
    // tesseract warmup
    const worker = await createWorker();

    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    await worker.recognize(
      'https://tesseract.projectnaptha.com/img/eng_bw.png'
    );

    await worker.terminate();
  }
}
