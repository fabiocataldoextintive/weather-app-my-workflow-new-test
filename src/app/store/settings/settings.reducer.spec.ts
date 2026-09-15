import { describe, it, expect } from 'vitest';
import { createReducer, on } from '@ngrx/store';
import { SettingsActions } from './settings.actions';
import { DEFAULT_INTERVAL_MS } from '../../core/models/interval.constants';

interface SettingsState { updateIntervalMs: number; }

const initialState: SettingsState = { updateIntervalMs: DEFAULT_INTERVAL_MS };

const settingsReducer = createReducer(
  initialState,
  on(SettingsActions.setInterval, (state, { intervalMs }) => ({ ...state, updateIntervalMs: intervalMs })),
  on(SettingsActions.loadSettingsSuccess, (state, { intervalMs }) => ({ ...state, updateIntervalMs: intervalMs }))
);

describe('settingsReducer', () => {
  it('has default interval of 5 minutes', () => {
    expect(initialState.updateIntervalMs).toBe(300_000);
  });

  it('updates interval on setInterval', () => {
    const state = settingsReducer(initialState, SettingsActions.setInterval({ intervalMs: 600_000 }));
    expect(state.updateIntervalMs).toBe(600_000);
  });

  it('restores interval from storage on loadSettingsSuccess', () => {
    const state = settingsReducer(initialState, SettingsActions.loadSettingsSuccess({ intervalMs: 900_000 }));
    expect(state.updateIntervalMs).toBe(900_000);
  });

  it('does not mutate existing state', () => {
    const original = { ...initialState };
    settingsReducer(initialState, SettingsActions.setInterval({ intervalMs: 1_800_000 }));
    expect(initialState).toEqual(original);
  });

  it('returns initial state for unknown action', () => {
    const state = settingsReducer(undefined, { type: '__UNKNOWN__' } as never);
    expect(state).toEqual(initialState);
  });
});
