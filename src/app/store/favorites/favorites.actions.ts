import { createActionGroup, props } from '@ngrx/store';
import { FavoriteEntry } from '../../core/models/favorites.model';

export const FavoritesActions = createActionGroup({
  source: 'Favorites',
  events: {
    'Add Favorite': props<{ entry: FavoriteEntry }>(),
    'Remove Favorite': props<{ city: string }>(),
    'Load Favorites': props<Record<string, never>>(),
    'Load Favorites Success': props<{ entries: FavoriteEntry[] }>(),
  },
});
