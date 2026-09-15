import { createFeature, createReducer, on } from '@ngrx/store';
import { FavoriteEntry } from '../../core/models/favorites.model';
import { FavoritesActions } from './favorites.actions';

export interface FavoritesState {
  entries: FavoriteEntry[];
}

const initialState: FavoritesState = {
  entries: [],
};

export const favoritesFeature = createFeature({
  name: 'favorites',
  reducer: createReducer(
    initialState,
    on(FavoritesActions.addFavorite, (state, { entry }) => {
      const alreadyExists = state.entries.some(
        (e) => e.city.toLowerCase() === entry.city.toLowerCase()
      );
      if (alreadyExists) return state;
      return { ...state, entries: [entry, ...state.entries] };
    }),
    on(FavoritesActions.removeFavorite, (state, { city }) => ({
      ...state,
      entries: state.entries.filter(
        (e) => e.city.toLowerCase() !== city.toLowerCase()
      ),
    })),
    on(FavoritesActions.loadFavoritesSuccess, (_state, { entries }) => ({
      entries,
    }))
  ),
});
