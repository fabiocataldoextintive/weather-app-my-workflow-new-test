import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  withFetch,
  HttpClient,
} from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideServiceWorker } from '@angular/service-worker';
import { routes } from './app.routes';
import { weatherFeature } from './store/weather/weather.reducer';
import { historyFeature } from './store/history/history.reducer';
import { settingsFeature } from './store/settings/settings.reducer';
import { favoritesFeature } from './store/favorites/favorites.reducer';
import * as weatherEffects from './store/weather/weather.effects';
import * as historyEffects from './store/history/history.effects';
import * as settingsEffects from './store/settings/settings.effects';
import * as favoritesEffects from './store/favorites/favorites.effects';
import { errorHandlingInterceptor } from './core/interceptors/error-handling.interceptor';

/**
 * Factory for ngx-translate HTTP loader.
 * Loads translation files from `/app/i18n/`.
 */
export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, '/app/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([errorHandlingInterceptor]), withFetch()),
    provideStore({
      [weatherFeature.name]: weatherFeature.reducer,
      [historyFeature.name]: historyFeature.reducer,
      [settingsFeature.name]: settingsFeature.reducer,
      [favoritesFeature.name]: favoritesFeature.reducer,
    }),
    provideEffects([weatherEffects, historyEffects, settingsEffects, favoritesEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
    }),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      defaultLanguage: 'en',
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
