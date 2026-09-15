# WeatherApp — Project Overview

## Goal
A Progressive Web App (PWA) built with Angular 21 that allows users to search for cities, view current weather data, manage search history, and configure auto-refresh intervals.

## Stack
| Layer | Technology |
|---|---|
| Framework | Angular v21 (standalone components) |
| Language | TypeScript v6.0.2 (strict mode) |
| Styles | SCSS v1.99.0 (BEM, design tokens) |
| State Management | NgRx v21.1.0 (createFeature, typed selectors) |
| Unit Testing | Vitest v4.1.5 |
| HTTP Client | Angular HttpClient |
| Build Tool | Angular CLI v21 |
| API | WeatherAPI (https://www.weatherapi.com/docs/) |

## Vision
- **Fast UX:** OnPush change detection, lazy-loaded feature slices, API caching via Map + shareReplay(1)
- **Offline-ready:** PWA with service worker for history and favorites
- **Type-safe:** No `any`, strict TypeScript, central error model `AppUiError`
- **Accessible & Responsive:** BEM SCSS, Flexbox/Grid, `prefers-reduced-motion` support

## Key Features (Linear Issues)
| Issue | Feature |
|---|---|
| INT-35 | Search with autocomplete and validation |
| INT-36 | Display temperature, condition, wind, humidity, local time |
| INT-37 | Clear messages on network/API failure |
| INT-38 | Re-query weather from history (navigates to /weather after dispatch) |
| INT-39 | Recent searches saved and listed |
| INT-40 | Mark cities as favorites (NgRx slice + favorites button in detail view) |
| INT-41 | View and remove favorites (FavoritesListComponent + page) |
| INT-42 | Choose refresh interval (5/10/15/30 min) |
| INT-43 | Smart refresh via lastUpdate + interval |
| INT-44 | Table view default; row click dispatches selectCity + loadWeather + switches to detail |
| INT-45 | Switch table vs detailed mode |
| INT-46 | English and Spanish i18n via @ngx-translate/core; LanguageSwitcherComponent |
| INT-47 | Responsive mobile/desktop layout |
| INT-48 | Detailed view for selected city |
| INT-49 | PWA offline access (service worker, manifest, OfflineBannerComponent) |

## API Endpoints
- `GET /current.json?key=:key&q=:city` — Current weather
- `GET /search.json?key=:key&q=:query` — City autocomplete suggestions

## Persistence
| Key | Type | Description |
|---|---|---|
| `weatherUpdateTimeInterval` | number (ms) | Selected refresh interval |
| `weatherHistory` | JSON string | Array of HistoryEntry objects |
| `weatherFavorites` | JSON string | Array of FavoriteEntry objects |
| `appLanguage` | string | Selected language code ('en' or 'es') |
