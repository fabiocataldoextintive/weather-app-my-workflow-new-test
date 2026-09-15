import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import { StorageService } from '../../core/services/storage.service';
import { HistoryEntry } from '../../core/models/history.model';
import { HistoryActions } from './history.actions';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const HISTORY_KEY = 'weatherHistory';

export const loadHistory$ = createEffect(
  (actions$ = inject(Actions), storage = inject(StorageService)) =>
    actions$.pipe(
      ofType(HistoryActions.loadHistory),
      map(() => {
        const entries = storage.get<HistoryEntry[]>(HISTORY_KEY) ?? [];
        return HistoryActions.loadHistorySuccess({ entries });
      })
    ),
  { functional: true }
);

export const persistHistory$ = createEffect(
  (actions$ = inject(Actions), store = inject(Store), storage = inject(StorageService)) =>
    actions$.pipe(
      ofType(HistoryActions.addEntry),
      // We need the full updated list, so we read from the store after state update
      // But effects run alongside reducers, so we do it imperatively
      tap(({ entry }) => {
        const current = storage.get<HistoryEntry[]>(HISTORY_KEY) ?? [];
        const filtered = current.filter(
          (e) => e.city.toLowerCase() !== entry.city.toLowerCase()
        );
        storage.set(HISTORY_KEY, [entry, ...filtered]);
      })
    ),
  { functional: true, dispatch: false }
);
