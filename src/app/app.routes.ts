import { Routes } from '@angular/router';
import { ComponentsPage } from './pages/components-page/components-page';
import { HomePage } from './pages/home-page/home-page';
import { CustomizationPage } from './pages/customization-page/customization-page';

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
        path: 'components',
        component: ComponentsPage
      },
      {
        path: 'customization',
        component: CustomizationPage
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'BungieNet-ComponentLibrary'
  }
];
