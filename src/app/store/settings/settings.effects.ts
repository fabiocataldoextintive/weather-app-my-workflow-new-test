import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { StorageService } from '../../core/services/storage.service';
import { DEFAULT_INTERVAL_MS, INTERVAL_OPTIONS } from '../../core/models/interval.constants';
import { SettingsActions } from './settings.actions';

const INTERVAL_KEY = 'weatherUpdateTimeInterval';

export const loadSettings$ = createEffect(
  (actions$ = inject(Actions), storage = inject(StorageService)) =>
    actions$.pipe(
      ofType(SettingsActions.loadSettings),
      map(() => {
        const raw = storage.get<number>(INTERVAL_KEY);
        // Validate that saved value is one of the allowed interval options
        const intervalMs =
          raw !== null && INTERVAL_OPTIONS.includes(raw)
            ? raw
            : DEFAULT_INTERVAL_MS;
        return SettingsActions.loadSettingsSuccess({ intervalMs });
      })
    ),
  { functional: true }
);

export const persistSettings$ = createEffect(
  (actions$ = inject(Actions), storage = inject(StorageService)) =>
    actions$.pipe(
      ofType(SettingsActions.setInterval),
      tap(({ intervalMs }) => storage.set(INTERVAL_KEY, intervalMs))
    ),
  { functional: true, dispatch: false }
);
