import { createActionGroup, props } from '@ngrx/store';

export const SettingsActions = createActionGroup({
  source: 'Settings',
  events: {
    'Set Interval': props<{ intervalMs: number }>(),
    'Load Settings': props<Record<string, never>>(),
    'Load Settings Success': props<{ intervalMs: number }>(),
  },
});
