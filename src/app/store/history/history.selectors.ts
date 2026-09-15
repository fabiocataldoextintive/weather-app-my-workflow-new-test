import { createSelector } from '@ngrx/store';
import { historyFeature } from './history.reducer';

export const selectEntryByCity = (city: string) =>
  createSelector(historyFeature.selectEntries, (entries) =>
    entries.find((e) => e.city.toLowerCase() === city.toLowerCase()) ?? null
  );

export { selectEntries } from './history.reducer';
