import { Routes } from '@angular/router';
import { ButtonPage } from './pages/button-page/button-page';
import { HomePage } from './pages/home-page/home-page';

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
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: HomePage
      },
      {
        path: 'buttons',
        component: ButtonPage
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'BungieNet-ComponentLibrary'
  }
];
