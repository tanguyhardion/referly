import { Component, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { TreeComponent } from '../tree/tree.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    TreeComponent,
  ],
})
export class SidenavComponent {
  @ViewChild('sidenav') sidenav: MatSidenav;

  toggle() {
    this.sidenav.toggle();
  }
}
