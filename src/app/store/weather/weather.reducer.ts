import { createFeature, createReducer, on } from '@ngrx/store';
import { AppUiError } from '../../core/models/app-ui-error.model';
import { CurrentWeatherResponse, SearchResult } from '../../core/models/weather.model';
import { WeatherActions } from './weather.actions';

export interface WeatherState {
  currentWeather: CurrentWeatherResponse | null;
  selectedCity: string | null;
  viewMode: 'table' | 'detail';
  loading: boolean;
  error: AppUiError | null;
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

export const weatherFeature = createFeature({
  name: 'weather',
  reducer: createReducer(
    initialState,
    on(WeatherActions.loadWeather, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(WeatherActions.loadWeatherSuccess, (state, { weather, city }) => ({
      ...state,
      loading: false,
      currentWeather: weather,
      selectedCity: city,
      error: null,
      tableData: {
        ...state.tableData,
        [city.toLowerCase()]: weather,
      },
    })),
    on(WeatherActions.loadWeatherFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    on(WeatherActions.loadSuggestionsSuccess, (state, { suggestions }) => ({
      ...state,
      suggestions,
    })),
    on(WeatherActions.loadSuggestionsClear, (state) => ({
      ...state,
      suggestions: [],
    })),
    on(WeatherActions.selectCity, (state, { city }) => ({
      ...state,
      selectedCity: city,
      currentWeather: state.tableData[city.toLowerCase()] ?? null,
    })),
    on(WeatherActions.setViewMode, (state, { mode }) => ({
      ...state,
      viewMode: mode,
    })),
    on(WeatherActions.clearError, (state) => ({
      ...state,
      error: null,
    }))
  ),
});

export const {
  selectWeatherState,
  selectCurrentWeather,
  selectSelectedCity,
  selectViewMode,
  selectLoading,
  selectError,
  selectSuggestions,
  selectTableData,
} = weatherFeature;
