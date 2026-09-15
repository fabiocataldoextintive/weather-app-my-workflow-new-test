import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'weather',
    pathMatch: 'full',
  },
  {
    path: 'weather',
    loadComponent: () =>
      import('./features/weather/pages/weather-page/weather-page.component').then(
        (m) => m.WeatherPageComponent
      ),
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./features/history/pages/history-page/history-page.component').then(
        (m) => m.HistoryPageComponent
      ),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/pages/favorites-page/favorites-page.component').then(
        (m) => m.FavoritesPageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'weather',
  },
];
