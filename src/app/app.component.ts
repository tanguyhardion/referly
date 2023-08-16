import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { SidenavComponent } from './components/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, SidenavComponent],
})
export class AppComponent {
  constructor() {}
}
