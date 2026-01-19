import { Routes } from '@angular/router';
import { ButtonPage } from './pages/button-page/button-page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'BungieNet-ComponentLibrary',
    pathMatch: 'full'
  },
  {
    path: 'BungieNet-ComponentLibrary',
    children: [
      {
        path: 'buttons',
        component: ButtonPage
      },
      // Add more component pages here
      {
        path: '',
        redirectTo: 'buttons',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'BungieNet-ComponentLibrary'
  }
];
