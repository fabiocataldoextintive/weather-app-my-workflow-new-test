import { createSelector } from '@ngrx/store';
import { favoritesFeature } from './favorites.reducer';

export const selectFavoriteEntries = favoritesFeature.selectEntries;

/**
 * Returns a memoized selector that checks whether a given city is favorited.
 * @param city - City name (case-insensitive)
 */
export const selectIsCityFavorited = (city: string) =>
  createSelector(favoritesFeature.selectEntries, (entries) =>
    entries.some((e) => e.city.toLowerCase() === city.toLowerCase())
  );
