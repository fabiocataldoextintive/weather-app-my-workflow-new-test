import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  debounceTime,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { AppUiError } from '../../core/models/app-ui-error.model';
import { WeatherApiService } from '../../core/services/weather-api.service';
import { HistoryActions } from '../history/history.actions';
import { selectEntries } from '../history/history.selectors';
import { selectIntervalMs } from '../settings/settings.selectors';
import { WeatherActions } from './weather.actions';

export const loadWeather$ = createEffect(
  (
    actions$ = inject(Actions),
    weatherApiService = inject(WeatherApiService),
    store = inject(Store)
  ) =>
    actions$.pipe(
      ofType(WeatherActions.loadWeather),
      withLatestFrom(
        store.select(selectEntries),
        store.select(selectIntervalMs)
      ),
      switchMap(([{ city }, historyEntries, intervalMs]) => {
        // INT-43: Check cache via history lastUpdate
        const normalizedCity = city.toLowerCase().trim();
        const historyEntry = historyEntries.find(
          (e) => e.city.toLowerCase() === normalizedCity
        );

        if (historyEntry) {
          const elapsed = Date.now() - new Date(historyEntry.lastUpdate).getTime();
          if (elapsed < intervalMs) {
            // Use cached data — no API call needed
            return of(
              WeatherActions.loadWeatherSuccess({
                weather: historyEntry.weather,
                city,
              })
            );
          }
        }

        // Call the API
        return weatherApiService.getCurrentWeather(city).pipe(
          switchMap((weather) => [
            WeatherActions.loadWeatherSuccess({ weather, city }),
            HistoryActions.addEntry({
              entry: {
                city: weather.location.name,
                country: weather.location.country,
                lastUpdate: new Date().toISOString(),
                weather,
              },
            }),
          ]),
          catchError((error: AppUiError) =>
            of(WeatherActions.loadWeatherFailure({ error }))
          )
        );
      })
    ),
  { functional: true }
);

export const loadSuggestions$ = createEffect(
  (
    actions$ = inject(Actions),
    weatherApiService = inject(WeatherApiService)
  ) =>
    actions$.pipe(
      ofType(WeatherActions.loadSuggestions),
      debounceTime(300),
      switchMap(({ query }) => {
        if (!query || query.trim().length < 1) {
          return of(WeatherActions.loadSuggestionsClear());
        }
        return weatherApiService.searchCities(query).pipe(
          map((suggestions) =>
            WeatherActions.loadSuggestionsSuccess({ suggestions })
          ),
          catchError(() => of(WeatherActions.loadSuggestionsClear()))
        );
      })
    ),
  { functional: true }
);
