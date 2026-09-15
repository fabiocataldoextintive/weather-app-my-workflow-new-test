import { describe, it, expect } from 'vitest';
import { createReducer, on } from '@ngrx/store';
import { HistoryActions } from './history.actions';
import type { HistoryEntry } from '../../core/models/history.model';

interface HistoryState { entries: HistoryEntry[]; }

const initialState: HistoryState = { entries: [] };

const historyReducer = createReducer(
  initialState,
  on(HistoryActions.loadHistorySuccess, (_state, { entries }) => ({ entries })),
  on(HistoryActions.addEntry, (state, { entry }) => {
    const filtered = state.entries.filter(
      (e) => e.city.toLowerCase() !== entry.city.toLowerCase()
    );
    return { entries: [entry, ...filtered] };
  })
);

const mockEntry: HistoryEntry = {
  city: 'London',
  country: 'UK',
  lastUpdate: '2026-09-15T10:00:00.000Z',
  weather: {
    location: { name: 'London', region: 'City of London', country: 'UK', lat: 51.5, lon: 0, tz_id: 'Europe/London', localtime_epoch: 0, localtime: '2026-09-15 12:00' },
    current: { temp_c: 20, temp_f: 68, condition: { text: 'Sunny', icon: '//icon.png', code: 1000 }, wind_kph: 10, wind_mph: 6, humidity: 65, is_day: 1, wind_degree: 180, wind_dir: 'S', pressure_mb: 1015, pressure_in: 29.97, precip_mm: 0, precip_in: 0, cloud: 25, feelslike_c: 19, feelslike_f: 66, vis_km: 10, vis_miles: 6, uv: 4, gust_mph: 8, gust_kph: 12.9, last_updated_epoch: 0, last_updated: '' },
  },
};

describe('historyReducer', () => {
  it('loads history successfully', () => {
    const state = historyReducer(initialState, HistoryActions.loadHistorySuccess({ entries: [mockEntry] }));
    expect(state.entries).toEqual([mockEntry]);
  });

  it('adds entry to top of list', () => {
    const paris: HistoryEntry = { ...mockEntry, city: 'Paris', country: 'France' };
    const state = historyReducer({ entries: [paris] }, HistoryActions.addEntry({ entry: mockEntry }));
    expect(state.entries[0].city).toBe('London');
  });

  it('deduplicates by city (case-insensitive)', () => {
    const state = historyReducer(
      { entries: [mockEntry] },
      HistoryActions.addEntry({ entry: { ...mockEntry, city: 'london', lastUpdate: '2026-09-15T11:00:00.000Z' } })
    );
    expect(state.entries.length).toBe(1);
    expect(state.entries[0].lastUpdate).toBe('2026-09-15T11:00:00.000Z');
  });

  it('moves updated city to top', () => {
    const paris: HistoryEntry = { ...mockEntry, city: 'Paris', country: 'France' };
    const state = historyReducer(
      { entries: [paris, mockEntry] },
      HistoryActions.addEntry({ entry: { ...mockEntry, lastUpdate: '2026-09-15T12:00:00.000Z' } })
    );
    expect(state.entries[0].city).toBe('London');
    expect(state.entries[1].city).toBe('Paris');
  });

  it('starts with empty entries', () => {
    const state = historyReducer(undefined, { type: '__UNKNOWN__' } as never);
    expect(state.entries).toEqual([]);
  });
});
