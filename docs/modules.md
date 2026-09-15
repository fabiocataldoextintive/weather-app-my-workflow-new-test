# WeatherApp — Modules & Features

## Core Layer (`src/app/core/`)

### `WeatherApiService`
- `searchCities(query: string): Observable<SearchResult[]>` — calls `/search.json`
- `getCurrentWeather(city: string): Observable<CurrentWeatherResponse>` — calls `/current.json`
- Internal `Map<string, CacheEntry>` for caching; `shareReplay(1)` per request

### `StorageService`
- `get<T>(key: string): T | null`
- `set<T>(key: string, value: T): void`
- `remove(key: string): void`
- Keys: `weatherUpdateTimeInterval`, `weatherHistory`, `weatherFavorites`

### `ErrorHandlingInterceptor`
- Intercepts `HttpErrorResponse`
- Maps to `AppUiError { code, message, retryable }`
- `401/403` → auth error; `404` → city not found; `5xx` → server error; network → connectivity error

## Models (`src/app/core/models/`)

### `AppUiError`
```typescript
interface AppUiError {
  code: 'NOT_FOUND' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'RATE_LIMIT' | 'UNKNOWN';
  message: string;
  retryable: boolean;
}
```

### `CurrentWeatherResponse`
Typed mirror of `/current.json` response (location, current object with temp_c, temp_f, condition, wind_kph, humidity, localtime)

### `SearchResult`
Typed mirror of `/search.json` array items (id, name, region, country)

### `HistoryEntry`
```typescript
interface HistoryEntry {
  city: string;
  country: string;
  lastUpdate: string; // ISO timestamp
  weather: CurrentWeatherResponse;
}
```

---

## Feature: Weather (`src/app/features/weather/`)

### `SearchBarComponent` (INT-35)
- Debounced input (300ms) → dispatches `WeatherActions.loadSuggestions`
- Renders dropdown of `SearchResult[]` from selector
- On submit: dispatches `WeatherActions.loadWeather({ city })`
- Validation: empty → shows i18n error; no-results → "city not found"

### `IntervalSelectorComponent` (INT-42)
- Renders list of `INTERVAL_OPTIONS = [300000, 600000, 900000, 1800000]`
- Reads selection from `SettingsSelectors.selectIntervalMs`
- On change: dispatches `SettingsActions.setInterval`; persists to localStorage

### `WeatherCardComponent` (INT-36, INT-48)
- Displays: temp_c, temp_f, condition text, condition icon, wind_kph, humidity, localtime
- `@Input() weather: CurrentWeatherResponse`
- Loading state via `WeatherSelectors.selectLoading`

### `WeatherTableComponent` (INT-45)
- Displays multiple cities in a table: city, temp_c, temp_f, condition, local time
- `@Input() entries: HistoryEntry[]`
- Row click → dispatches `WeatherActions.selectCity`

### `WeatherDetailComponent` (INT-48)
- Full-screen detail layout for selected city
- Shown when `viewMode === 'detail'`

### `WeatherPageComponent`
- Host component; reads `viewMode` from store
- Conditionally renders table vs detail
- Contains `SearchBarComponent` + `IntervalSelectorComponent`

---

## Feature: History (`src/app/features/history/`)

### `HistoryListComponent` (INT-38, INT-39)
- Reads `HistorySelectors.selectEntries`
- Paginated (10 per page)
- On entry click: dispatches `WeatherActions.loadWeatherFromHistory({ entry })`
- Respects INT-43 cache rules via effect

---

## Shared Components (`src/app/shared/`)

### `LoadingSpinnerComponent`
- CSS animation spinner
- Shown via `*ngIf` / `@if` on `selectLoading`

### `ErrorMessageComponent`
- `@Input() error: AppUiError | null`
- Shows translated message; retry button if `retryable`

### `TemperaturePipe`
- Formats temperature to N decimal places with unit label

---

## NgRx Store (`src/app/store/`)

### `weather` slice
**Actions:** `loadWeather`, `loadWeatherSuccess`, `loadWeatherFailure`, `loadSuggestions`, `loadSuggestionsSuccess`, `selectCity`, `setViewMode`  
**Effects:** `loadWeather$` (calls WeatherApiService, handles cache via INT-43 logic), `loadSuggestions$` (debounce in component, effect calls API)  
**Selectors:** `selectCurrentWeather`, `selectLoading`, `selectError`, `selectSuggestions`, `selectViewMode`, `selectSelectedCity`, `selectTableData`

### `history` slice
**Actions:** `addEntry`, `loadHistory`, `loadHistorySuccess`  
**Effects:** `persistHistory$` (writes to localStorage on add), `loadHistory$` (reads from localStorage on init)  
**Selectors:** `selectEntries`, `selectEntryByCity`

### `settings` slice
**Actions:** `setInterval`, `loadSettings`, `loadSettingsSuccess`  
**Effects:** `persistSettings$`, `loadSettings$`  
**Selectors:** `selectIntervalMs`

---

## i18n (`src/app/i18n/`)
- `en.json` and `es.json`
- Keys: `search.placeholder`, `search.empty`, `search.notFound`, `error.network`, `error.server`, `error.rateLimit`, `weather.humidity`, `weather.wind`, `weather.localTime`, `history.title`, `interval.label`
