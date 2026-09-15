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
- Keys: `weatherUpdateTimeInterval`, `weatherHistory`, `weatherFavorites`, `appLanguage`

### `OnlineStatusService` (INT-49)
- `isOnline = signal(navigator.onLine)` — reactive signal
- Listens to `window` `online`/`offline` events to update signal

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

### `FavoriteEntry` (INT-40)
```typescript
interface FavoriteEntry {
  readonly city: string;
  readonly country: string;
  readonly lastUpdate: string; // ISO 8601 timestamp
  readonly weather: CurrentWeatherResponse;
}
```

---

## Feature: Weather (`src/app/features/weather/`)

### `SearchBarComponent` (INT-35)
- Debounced input (300ms) → dispatches `WeatherActions.loadSuggestions`
- Renders dropdown of `SearchResult[]` from selector
- On submit: dispatches `WeatherActions.loadWeather({ city })`
- Validation: empty → shows i18n error via `TranslateService.instant('search.empty')`
- All user-visible strings use `TranslatePipe` (INT-46)

### `IntervalSelectorComponent` (INT-42)
- Renders list of `INTERVAL_OPTIONS = [300000, 600000, 900000, 1800000]`
- Reads selection from `SettingsSelectors.selectIntervalMs`
- On change: dispatches `SettingsActions.setInterval`; persists to localStorage
- Interval labels use i18n keys: `interval.5min`, `interval.10min`, etc. (INT-46)

### `WeatherTableComponent` (INT-44, INT-45)
- Displays multiple cities in a table: city, temp_c, temp_f, condition, local time, humidity, wind
- `@Input() entries: HistoryEntry[]`
- Row click → emits `selectCity` event; parent dispatches `WeatherActions.selectCity` + `loadWeather` + `setViewMode('detail')`
- Default view mode is `'table'` (defined in reducer initialState)
- All column headers use `TranslatePipe` (INT-46)

### `WeatherDetailComponent` (INT-40, INT-48)
- Full-screen detail layout for selected city
- Shown when `viewMode === 'detail'`
- Uses `input.required<CurrentWeatherResponse>()` signal input (Angular 17+)
- Injects `Store`; reads `selectIsCityFavorited(city)` reactively via `toSignal + toObservable + switchMap`
- Shows ☆ "Add to Favorites" button (dispatches `FavoritesActions.addFavorite`) or ⭐ "Already in Favorites" (disabled) based on favorite state
- All user-visible strings use `TranslatePipe` (INT-46)

### `WeatherPageComponent`
- Host component; reads `viewMode` from store
- Conditionally renders table vs detail
- Contains `SearchBarComponent` + `IntervalSelectorComponent`
- `ngOnInit`: dispatches `loadHistory`, `loadSettings`, `loadFavorites` (INT-40)
- `onSelectCity`: dispatches `selectCity` (immediate feedback) + `loadWeather` + `setViewMode('detail')` (INT-44)

---

## Feature: History (`src/app/features/history/`)

### `HistoryListComponent` (INT-38, INT-39)
- Reads `HistorySelectors.selectEntries`
- Paginated (10 per page)
- On entry click: dispatches `WeatherActions.loadWeather({ city })` then navigates to `/weather` (INT-38)
- All user-visible strings use `TranslatePipe` (INT-46)

---

## Feature: Favorites (`src/app/features/favorites/`) (INT-40, INT-41)

### `FavoritesListComponent`
- Reads `FavoritesSelectors.selectFavoriteEntries`
- Paginated: 10 per page with "Load more" button
- Each item: city, country, condition icon, temp_c, condition text, lastUpdate
- Item click → dispatches `WeatherActions.loadWeather({ city })` + navigates to `/weather`
- "Remove" button → dispatches `FavoritesActions.removeFavorite({ city })` (stops event propagation)
- Empty state message when no favorites
- All user-visible strings use `TranslatePipe`

### `FavoritesPageComponent`
- Host page; renders `FavoritesListComponent`
- `ngOnInit`: dispatches `FavoritesActions.loadFavorites({})`

---

## Shared Components (`src/app/shared/`)

### `LoadingSpinnerComponent`
- CSS animation spinner
- Shown via `@if` on `selectLoading`

### `ErrorMessageComponent`
- `@Input() error: AppUiError | null`
- Shows `error.message`; retry button uses i18n key `error.retry` (INT-46)

### `TemperaturePipe`
- Formats temperature to N decimal places with unit label

### `LanguageSwitcherComponent` (INT-46)
- Injects `TranslateService` and `StorageService`
- Toggles between `'en'` and `'es'` on click
- Persists selection to localStorage key `appLanguage`
- On init: restores language from localStorage
- Displayed in app nav bar

### `OfflineBannerComponent` (INT-49)
- Injects `OnlineStatusService`
- Shows dismissible banner when `isOnline() === false` with i18n key `offline.banner`
- Effect resets `dismissed` signal when connectivity is restored
- Displayed at top of `AppComponent`

---

## NgRx Store (`src/app/store/`)

### `weather` slice
**Actions:** `loadWeather`, `loadWeatherSuccess`, `loadWeatherFailure`, `loadSuggestions`, `loadSuggestionsSuccess`, `loadSuggestionsClear`, `selectCity`, `setViewMode`, `clearError`
**Effects:**
- `loadWeather$`: offline guard (INT-49) → cache check (INT-43) → API call → dispatches `addEntry`
- `loadSuggestions$`: debounced city search
**Selectors:** `selectCurrentWeather`, `selectLoading`, `selectError`, `selectSuggestions`, `selectViewMode`, `selectSelectedCity`, `selectTableData`

### `history` slice
**Actions:** `addEntry`, `loadHistory`, `loadHistorySuccess`
**Effects:** `persistHistory$` (writes to localStorage on add), `loadHistory$` (reads from localStorage on init)
**Selectors:** `selectEntries`, `selectEntryByCity`

### `settings` slice
**Actions:** `setInterval`, `loadSettings`, `loadSettingsSuccess`
**Effects:** `persistSettings$`, `loadSettings$`
**Selectors:** `selectIntervalMs`

### `favorites` slice (INT-40)
**Actions:** `addFavorite`, `removeFavorite`, `loadFavorites`, `loadFavoritesSuccess`
**Reducer:**
- `addFavorite`: prepends entry (no duplicate by city, case-insensitive)
- `removeFavorite`: filters out city (case-insensitive)
- `loadFavoritesSuccess`: replaces all entries
**Effects:**
- `loadFavorites$`: reads `weatherFavorites` from localStorage → dispatches `loadFavoritesSuccess`
- `persistFavorites$`: on add/remove → uses `withLatestFrom(selectFavoriteEntries)` → writes to localStorage (dispatch: false)
**Selectors:** `selectFavoriteEntries`, `selectIsCityFavorited(city: string)`

---

## i18n (`src/app/i18n/`) (INT-46)

- `en.json` (English) and `es.json` (Spanish)
- Served via Angular asset config at `/app/i18n/*.json`
- Loaded by `TranslateHttpLoader` from `@ngx-translate/core` v16
- Default language: `'en'`; user selection persisted to localStorage key `appLanguage`
- Key namespaces: `nav`, `search`, `weather`, `history`, `favorites`, `interval`, `error`, `offline`, `lang`

## PWA (`src/`) (INT-49)

- `public/manifest.webmanifest` — Web App Manifest (name, icons, display: standalone)
- `src/ngsw-config.json` — Angular Service Worker config (app + i18n asset groups)
- Service worker registered in `app.config.ts` via `provideServiceWorker('ngsw-worker.js', { enabled: !isDevMode() })`
- `src/index.html` — adds `<link rel="manifest">` and `<meta name="theme-color">`
- Angular build: `serviceWorker: true` and `ngswConfigPath` set in production configuration
