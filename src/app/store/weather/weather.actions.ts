import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { AppUiError } from '../../core/models/app-ui-error.model';
import { CurrentWeatherResponse, SearchResult } from '../../core/models/weather.model';

export const WeatherActions = createActionGroup({
  source: 'Weather',
  events: {
    'Load Weather': props<{ city: string }>(),
    'Load Weather Success': props<{ weather: CurrentWeatherResponse; city: string }>(),
    'Load Weather Failure': props<{ error: AppUiError }>(),

    'Load Suggestions': props<{ query: string }>(),
    'Load Suggestions Success': props<{ suggestions: SearchResult[] }>(),
    'Load Suggestions Clear': emptyProps(),

    'Select City': props<{ city: string }>(),
    'Set View Mode': props<{ mode: 'table' | 'detail' }>(),
    'Clear Error': emptyProps(),
  },
});
