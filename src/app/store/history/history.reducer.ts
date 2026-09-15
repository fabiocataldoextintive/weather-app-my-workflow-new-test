import { createFeature, createReducer, on } from '@ngrx/store';
import { HistoryEntry } from '../../core/models/history.model';
import { HistoryActions } from './history.actions';

export interface HistoryState {
  entries: HistoryEntry[];
}

const initialState: HistoryState = {
  entries: [],
};

export const historyFeature = createFeature({
  name: 'history',
  reducer: createReducer(
    initialState,
    on(HistoryActions.loadHistorySuccess, (_state, { entries }) => ({
      entries,
    })),
    on(HistoryActions.addEntry, (state, { entry }) => {
      // Move to top, de-duplicate by city name (case-insensitive)
      const filtered = state.entries.filter(
        (e) => e.city.toLowerCase() !== entry.city.toLowerCase()
      );
      return { entries: [entry, ...filtered] };
    })
  ),
});

export const { selectHistoryState, selectEntries } = historyFeature;
