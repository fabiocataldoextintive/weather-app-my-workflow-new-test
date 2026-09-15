import { createFeature, createReducer, on } from '@ngrx/store';
import { DEFAULT_INTERVAL_MS } from '../../core/models/interval.constants';
import { SettingsActions } from './settings.actions';

export interface SettingsState {
  updateIntervalMs: number;
}

const initialState: SettingsState = {
  updateIntervalMs: DEFAULT_INTERVAL_MS,
};

export const settingsFeature = createFeature({
  name: 'settings',
  reducer: createReducer(
    initialState,
    on(SettingsActions.setInterval, (state, { intervalMs }) => ({
      ...state,
      updateIntervalMs: intervalMs,
    })),
    on(SettingsActions.loadSettingsSuccess, (state, { intervalMs }) => ({
      ...state,
      updateIntervalMs: intervalMs,
    }))
  ),
});

export const { selectSettingsState, selectUpdateIntervalMs } = settingsFeature;
