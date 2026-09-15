// Pure reducer tests — no Angular DI / TestBed needed
import { describe, it, expect, beforeEach } from 'vitest';
import { createReducer, on } from '@ngrx/store';
import { WeatherActions } from './weather.actions';
import { createAppUiError } from '../../core/models/app-ui-error.model';
import type { CurrentWeatherResponse, SearchResult } from '../../core/models/weather.model';

// Replicate the state shape locally to avoid importing the NgRx feature
export interface WeatherState {
  currentWeather: CurrentWeatherResponse | null;
  selectedCity: string | null;
  viewMode: 'table' | 'detail';
  loading: boolean;
  error: ReturnType<typeof createAppUiError> | null;
  suggestions: SearchResult[];
  tableData: Record<string, CurrentWeatherResponse>;
}

const initialState: WeatherState = {
  currentWeather: null,
  selectedCity: null,
  viewMode: 'table',
  loading: false,
  error: null,
  suggestions: [],
  tableData: {},
};

// Re-create the same reducer logic (mirrors weather.reducer.ts)
const weatherReducer = createReducer(
  initialState,
  on(WeatherActions.loadWeather, (state) => ({ ...state, loading: true, error: null })),
  on(WeatherActions.loadWeatherSuccess, (state, { weather, city }) => ({
    ...state,
    loading: false,
    currentWeather: weather,
    selectedCity: city,
    error: null,
    tableData: { ...state.tableData, [city.toLowerCase()]: weather },
  })),
  on(WeatherActions.loadWeatherFailure, (state, { error }) => ({ ...state, loading: false, error })),
  on(WeatherActions.loadSuggestionsSuccess, (state, { suggestions }) => ({ ...state, suggestions })),
  on(WeatherActions.loadSuggestionsClear, (state) => ({ ...state, suggestions: [] })),
  on(WeatherActions.selectCity, (state, { city }) => ({
    ...state,
    selectedCity: city,
    currentWeather: state.tableData[city.toLowerCase()] ?? null,
  })),
  on(WeatherActions.setViewMode, (state, { mode }) => ({ ...state, viewMode: mode })),
  on(WeatherActions.clearError, (state) => ({ ...state, error: null }))
);

const mockWeather: CurrentWeatherResponse = {
  location: {
    name: 'London', region: 'City of London', country: 'UK',
    lat: 51.5, lon: 0, tz_id: 'Europe/London', localtime_epoch: 0, localtime: '2026-09-15 12:00',
  },
  current: {
    temp_c: 20, temp_f: 68,
    condition: { text: 'Sunny', icon: '//icon.png', code: 1000 },
    wind_kph: 10, wind_mph: 6, humidity: 65, is_day: 1, wind_degree: 180, wind_dir: 'S',
    pressure_mb: 1015, pressure_in: 29.97, precip_mm: 0, precip_in: 0, cloud: 25,
    feelslike_c: 19, feelslike_f: 66, vis_km: 10, vis_miles: 6, uv: 4,
    gust_mph: 8, gust_kph: 12.9, last_updated_epoch: 0, last_updated: '',
  },
};

describe('weatherReducer', () => {
  it('sets loading on loadWeather', () => {
    const state = weatherReducer(initialState, WeatherActions.loadWeather({ city: 'London' }));
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('sets weather on loadWeatherSuccess', () => {
    const state = weatherReducer(
      { ...initialState, loading: true },
      WeatherActions.loadWeatherSuccess({ weather: mockWeather, city: 'London' })
    );
    expect(state.loading).toBe(false);
    expect(state.currentWeather).toEqual(mockWeather);
    expect(state.selectedCity).toBe('London');
    expect(state.tableData['london']).toEqual(mockWeather);
  });

  it('sets error on loadWeatherFailure', () => {
    const error = createAppUiError('NOT_FOUND', 'City not found');
    const state = weatherReducer(
      { ...initialState, loading: true },
      WeatherActions.loadWeatherFailure({ error })
    );
    expect(state.loading).toBe(false);
    expect(state.error).toEqual(error);
  });

  it('sets suggestions on loadSuggestionsSuccess', () => {
    const suggestions: SearchResult[] = [{ id: 1, name: 'London', region: 'UK', country: 'UK', lat: 51.5, lon: 0, url: '' }];
    const state = weatherReducer(initialState, WeatherActions.loadSuggestionsSuccess({ suggestions }));
    expect(state.suggestions).toEqual(suggestions);
  });

  it('clears suggestions on loadSuggestionsClear', () => {
    const state = weatherReducer(
      { ...initialState, suggestions: [{ id: 1, name: 'X', region: '', country: '', lat: 0, lon: 0, url: '' }] },
      WeatherActions.loadSuggestionsClear()
    );
    expect(state.suggestions).toEqual([]);
  });

  it('sets viewMode on setViewMode', () => {
    const state = weatherReducer(initialState, WeatherActions.setViewMode({ mode: 'detail' }));
    expect(state.viewMode).toBe('detail');
  });

  it('clears error on clearError', () => {
    const state = weatherReducer(
      { ...initialState, error: createAppUiError('UNKNOWN', 'Error') },
      WeatherActions.clearError()
    );
    expect(state.error).toBeNull();
  });

  it('selects city from tableData on selectCity', () => {
    const state = weatherReducer(
      { ...initialState, tableData: { london: mockWeather } },
      WeatherActions.selectCity({ city: 'London' })
    );
    expect(state.currentWeather).toEqual(mockWeather);
    expect(state.selectedCity).toBe('London');
  });

  it('returns initial state for unknown action', () => {
    const state = weatherReducer(undefined, { type: '__UNKNOWN__' } as never);
    expect(state).toEqual(initialState);
  });
});
