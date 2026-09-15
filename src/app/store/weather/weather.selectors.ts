import { createSelector } from '@ngrx/store';
import { weatherFeature } from './weather.reducer';

export const selectWeatherTableEntries = createSelector(
  weatherFeature.selectTableData,
  (tableData) => Object.values(tableData)
);

export const selectCurrentWeatherForCity = (city: string) =>
  createSelector(
    weatherFeature.selectTableData,
    (tableData) => tableData[city.toLowerCase()] ?? null
  );

// Re-export feature selectors for convenience
export {
  selectCurrentWeather,
  selectSelectedCity,
  selectViewMode,
  selectLoading,
  selectError,
  selectSuggestions,
  selectTableData,
} from './weather.reducer';
