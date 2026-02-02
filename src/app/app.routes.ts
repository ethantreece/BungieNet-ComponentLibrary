import { Routes } from '@angular/router';
import { ComponentsPage } from './pages/components-page/components-page';
import { HomePage } from './pages/home-page/home-page';
import { CustomizationPage } from './pages/customization-page/customization-page';
import { H3CustomizationPage } from './pages/h3-customization-page/h3-customization-page';

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
        path: 'h2-customization',
        component: CustomizationPage
      },
      {
        path: 'h3-customization',
        component: H3CustomizationPage
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'BungieNet-ComponentLibrary'
  }
];
