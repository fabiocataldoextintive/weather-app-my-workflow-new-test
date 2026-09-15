import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { StorageService } from '../../core/services/storage.service';
import { FavoriteEntry } from '../../core/models/favorites.model';
import { FavoritesActions } from './favorites.actions';
import { selectFavoriteEntries } from './favorites.selectors';

const FAVORITES_KEY = 'weatherFavorites';

/**
 * Loads favorites from localStorage on app init.
 */
export const loadFavorites$ = createEffect(
  (
    actions$ = inject(Actions),
    storageService = inject(StorageService)
  ) =>
    actions$.pipe(
      ofType(FavoritesActions.loadFavorites),
      map(() => {
        const entries =
          storageService.get<FavoriteEntry[]>(FAVORITES_KEY) ?? [];
        return FavoritesActions.loadFavoritesSuccess({ entries });
      })
    ),
  { functional: true }
);

/**
 * Persists favorites to localStorage after add or remove actions.
 * Uses `withLatestFrom` to get the updated store state after the reducer ran.
 */
export const persistFavorites$ = createEffect(
  (
    actions$ = inject(Actions),
    store = inject(Store),
    storageService = inject(StorageService)
  ) =>
    actions$.pipe(
      ofType(FavoritesActions.addFavorite, FavoritesActions.removeFavorite),
      withLatestFrom(store.select(selectFavoriteEntries)),
      tap(([, entries]) => {
        storageService.set(FAVORITES_KEY, entries);
      })
    ),
  { functional: true, dispatch: false }
);
