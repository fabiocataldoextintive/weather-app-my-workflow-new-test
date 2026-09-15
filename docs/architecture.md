# WeatherApp — Architecture

## Application Type
Angular 21 SPA / PWA — Standalone Components, No NgModules

## Directory Structure
```
src/
├── app/
│   ├── core/                          # Singleton services, interceptors, guards
│   │   ├── interceptors/
│   │   │   └── error-handling.interceptor.ts
│   │   ├── services/
│   │   │   ├── weather-api.service.ts
│   │   │   └── storage.service.ts
│   │   └── models/
│   │       ├── app-ui-error.model.ts
│   │       ├── weather.model.ts
│   │       └── history.model.ts
│   ├── features/
│   │   ├── weather/                   # INT-35, INT-36, INT-37, INT-43, INT-45, INT-48
│   │   │   ├── components/
│   │   │   │   ├── search-bar/
│   │   │   │   ├── interval-selector/
│   │   │   │   ├── weather-card/
│   │   │   │   ├── weather-table/
│   │   │   │   └── weather-detail/
│   │   │   └── weather.routes.ts
│   │   └── history/                   # INT-38, INT-39
│   │       ├── components/
│   │       │   └── history-list/
│   │       └── history.routes.ts
│   ├── shared/
│   │   ├── components/
│   │   │   ├── loading-spinner/
│   │   │   └── error-message/
│   │   └── pipes/
│   │       └── temperature.pipe.ts
│   ├── store/                         # NgRx state slices
│   │   ├── weather/
│   │   │   ├── weather.actions.ts
│   │   │   ├── weather.reducer.ts
│   │   │   ├── weather.effects.ts
│   │   │   └── weather.selectors.ts
│   │   ├── history/
│   │   │   ├── history.actions.ts
│   │   │   ├── history.reducer.ts
│   │   │   ├── history.effects.ts
│   │   │   └── history.selectors.ts
│   │   └── settings/
│   │       ├── settings.actions.ts
│   │       ├── settings.reducer.ts
│   │       └── settings.selectors.ts
│   ├── i18n/
│   │   ├── en.json
│   │   └── es.json
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── styles/
│   ├── _variables.scss
│   ├── _mixins.scss
│   ├── _animations.scss
│   └── styles.scss
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

## State Management (NgRx)

### Feature Slices
| Slice | Purpose |
|---|---|
| `weather` | Current weather data, loading/error state, view mode (table/detail) |
| `history` | Recent search entries with `lastUpdate` timestamp |
| `settings` | Refresh interval (ms), persisted to localStorage |

### State Shape
```typescript
interface AppState {
  weather: WeatherState;
  history: HistoryState;
  settings: SettingsState;
}

interface WeatherState {
  currentWeather: CurrentWeatherResponse | null;
  selectedCity: string | null;
  viewMode: 'table' | 'detail';
  loading: boolean;
  error: AppUiError | null;
  suggestions: SearchResult[];
  tableData: Record<string, CurrentWeatherResponse>;
}

interface HistoryState {
  entries: HistoryEntry[];
}

interface SettingsState {
  updateIntervalMs: number; // default: 300000 (5 min)
}
```

## Caching Strategy (INT-43)
- `WeatherApiService` maintains an in-memory `Map<string, CacheEntry>` keyed by city name
- On search: check `lastUpdate` in history entry vs `updateIntervalMs`
- If `(now - lastUpdate) > intervalMs` → call API, update cache and history
- Else → return cached data from NgRx store / history

## Error Handling
- `ErrorHandlingInterceptor` intercepts all HTTP errors
- Maps to `AppUiError` with `code`, `message`, `retryable` flag
- Components display via `<app-error-message>` standalone component

## Change Detection
All components use `ChangeDetectionStrategy.OnPush`. Data flows through:
- `Store` selectors → async pipe in templates
- `Signal`-based local state where applicable

## Routing (Lazy)
```
/ → redirect to /weather
/weather → WeatherPageComponent (lazy)
/history → HistoryPageComponent (lazy)
```
