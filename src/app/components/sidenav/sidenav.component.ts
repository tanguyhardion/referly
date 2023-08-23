import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

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
    TreeComponent,
  ],
})
export class SidenavComponent {}
