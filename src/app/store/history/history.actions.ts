import { createActionGroup, props } from '@ngrx/store';
import { HistoryEntry } from '../../core/models/history.model';

export const HistoryActions = createActionGroup({
  source: 'History',
  events: {
    'Add Entry': props<{ entry: HistoryEntry }>(),
    'Load History': props<Record<string, never>>(),
    'Load History Success': props<{ entries: HistoryEntry[] }>(),
  },
});
