import { describe, it, expect } from 'vitest';
import { createReducer, on } from '@ngrx/store';
import { FavoritesActions } from './favorites.actions';
import type { FavoriteEntry } from '../../core/models/favorites.model';

interface FavoritesState {
  entries: FavoriteEntry[];
}

const initialState: FavoritesState = { entries: [] };

const favoritesReducer = createReducer(
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
);

const mockEntry: FavoriteEntry = {
  city: 'London',
  country: 'UK',
  lastUpdate: '2026-09-15T10:00:00.000Z',
  weather: {
    location: {
      name: 'London',
      region: 'City of London',
      country: 'UK',
      lat: 51.5,
      lon: 0,
      tz_id: 'Europe/London',
      localtime_epoch: 0,
      localtime: '2026-09-15 12:00',
    },
    current: {
      temp_c: 20,
      temp_f: 68,
      condition: { text: 'Sunny', icon: '//icon.png', code: 1000 },
      wind_kph: 10,
      wind_mph: 6,
      humidity: 65,
      is_day: 1,
      wind_degree: 180,
      wind_dir: 'S',
      pressure_mb: 1015,
      pressure_in: 29.97,
      precip_mm: 0,
      precip_in: 0,
      cloud: 25,
      feelslike_c: 19,
      feelslike_f: 66,
      vis_km: 10,
      vis_miles: 6,
      uv: 4,
      gust_mph: 8,
      gust_kph: 12.9,
      last_updated_epoch: 0,
      last_updated: '',
    },
  },
};

const parisEntry: FavoriteEntry = { ...mockEntry, city: 'Paris', country: 'France' };

describe('favoritesReducer', () => {
  it('returns initial state for unknown action', () => {
    const state = favoritesReducer(undefined, { type: '__UNKNOWN__' } as never);
    expect(state.entries).toEqual([]);
  });

  describe('addFavorite', () => {
    it('prepends entry to an empty list', () => {
      const state = favoritesReducer(
        initialState,
        FavoritesActions.addFavorite({ entry: mockEntry })
      );
      expect(state.entries).toHaveLength(1);
      expect(state.entries[0].city).toBe('London');
    });

    it('prepends new entry before existing ones', () => {
      const state = favoritesReducer(
        { entries: [parisEntry] },
        FavoritesActions.addFavorite({ entry: mockEntry })
      );
      expect(state.entries[0].city).toBe('London');
      expect(state.entries[1].city).toBe('Paris');
    });

    it('does not add duplicate (case-insensitive)', () => {
      const state = favoritesReducer(
        { entries: [mockEntry] },
        FavoritesActions.addFavorite({
          entry: { ...mockEntry, city: 'london' },
        })
      );
      expect(state.entries).toHaveLength(1);
    });

    it('does not mutate existing state', () => {
      const original = { entries: [parisEntry] };
      favoritesReducer(original, FavoritesActions.addFavorite({ entry: mockEntry }));
      expect(original.entries).toHaveLength(1);
    });
  });

  describe('removeFavorite', () => {
    it('removes entry by city name', () => {
      const state = favoritesReducer(
        { entries: [mockEntry, parisEntry] },
        FavoritesActions.removeFavorite({ city: 'London' })
      );
      expect(state.entries).toHaveLength(1);
      expect(state.entries[0].city).toBe('Paris');
    });

    it('removes entry case-insensitively', () => {
      const state = favoritesReducer(
        { entries: [mockEntry] },
        FavoritesActions.removeFavorite({ city: 'london' })
      );
      expect(state.entries).toHaveLength(0);
    });

    it('returns same state if city not found', () => {
      const state = favoritesReducer(
        { entries: [parisEntry] },
        FavoritesActions.removeFavorite({ city: 'Tokyo' })
      );
      expect(state.entries).toHaveLength(1);
    });
  });

  describe('loadFavoritesSuccess', () => {
    it('replaces entries with loaded data', () => {
      const state = favoritesReducer(
        { entries: [parisEntry] },
        FavoritesActions.loadFavoritesSuccess({ entries: [mockEntry] })
      );
      expect(state.entries).toHaveLength(1);
      expect(state.entries[0].city).toBe('London');
    });

    it('clears entries when loaded list is empty', () => {
      const state = favoritesReducer(
        { entries: [mockEntry] },
        FavoritesActions.loadFavoritesSuccess({ entries: [] })
      );
      expect(state.entries).toHaveLength(0);
    });
  });
});
