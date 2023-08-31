import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./components/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'edit/:item',
    loadComponent: () =>
      import('./components/item-edit/item-edit.component').then(
        (m) => m.ItemEditComponent
      ),
  },
];
