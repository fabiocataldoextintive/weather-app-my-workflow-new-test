import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  withFetch,
} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
import { routes } from './app.routes';
import { weatherFeature } from './store/weather/weather.reducer';
import { historyFeature } from './store/history/history.reducer';
import { settingsFeature } from './store/settings/settings.reducer';
import * as weatherEffects from './store/weather/weather.effects';
import * as historyEffects from './store/history/history.effects';
import * as settingsEffects from './store/settings/settings.effects';
import { errorHandlingInterceptor } from './core/interceptors/error-handling.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([errorHandlingInterceptor]), withFetch()),
    provideStore({
      [weatherFeature.name]: weatherFeature.reducer,
      [historyFeature.name]: historyFeature.reducer,
      [settingsFeature.name]: settingsFeature.reducer,
    }),
    provideEffects([weatherEffects, historyEffects, settingsEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
    }),
  ],
};
