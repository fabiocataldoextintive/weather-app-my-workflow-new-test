# WeatherApp — Conventions

## TypeScript
- `strict: true` — no `any`, no implicit returns
- Use `inject()` function (not constructor injection) for all dependencies
- Prefer `readonly` properties in models/interfaces
- Generics for service methods (e.g., `StorageService.get<T>`)
- Barrel exports via `index.ts` for each folder

## Angular
- **Standalone components only** — no NgModules
- `ChangeDetectionStrategy.OnPush` on every component
- Template control flow: use `@if`, `@for`, `@switch` (Angular 17+ block syntax)
- Signals (`signal()`, `computed()`, `effect()`) for local component state
- `inject()` for service injection; no constructor injection
- Route lazy loading via `loadComponent` / `loadChildren`

## Naming Conventions
| Artifact | Pattern | Example |
|---|---|---|
| Component | `PascalCase` + `Component` | `SearchBarComponent` |
| Service | `PascalCase` + `Service` | `WeatherApiService` |
| Interface/Model | `PascalCase` (no `I` prefix) | `CurrentWeatherResponse` |
| NgRx Action group | `camelCase` feature + `Actions` | `weatherActions` |
| NgRx Selector | `select` + `PascalCase` | `selectCurrentWeather` |
| NgRx Effect | `camelCase` + `$` | `loadWeather$` |
| SCSS variables | `--token-name` (CSS custom props) | `--color-primary` |
| SCSS block | `kebab-case` BEM | `.search-bar__input--error` |
| localStorage key | `camelCase` | `weatherUpdateTimeInterval` |
| Git branch | `feature/<issue-id>` | `feature/INT-35` |

## SCSS
- All design tokens in `src/styles/_variables.scss` as CSS custom properties
- Mixins in `src/styles/_mixins.scss`
- Animations in `src/styles/_animations.scss`
- BEM methodology: `.block__element--modifier`
- Respect `prefers-reduced-motion` in all animation declarations
- No inline styles in components; styles go in component's `.scss` file

## NgRx State
- Use `createFeature` with `featureName` matching folder name
- Use `createActionGroup` for grouping related actions
- Reducers are pure functions; no side effects
- Effects handle all async logic; no HTTP calls in components
- Selectors are memoized; compose from feature selectors

## Testing (Vitest)
- Co-locate spec files: `foo.component.spec.ts` next to `foo.component.ts`
- ≥90% logic coverage required for all services and reducers
- Mock `Store` with `provideMockStore`; mock HTTP with `HttpClientTestingModule`
- Test file naming: `*.spec.ts`
- Describe block structure: `describe('ClassName', () => { describe('methodName', ...) })`

## Error Handling
- Never expose raw HTTP status codes or stack traces to users
- All errors flow through `ErrorHandlingInterceptor` → `AppUiError`
- Components receive `AppUiError | null` and display via `ErrorMessageComponent`
- Console logging only in development (`environment.ts`)

## i18n
- All user-visible strings must use `TranslatePipe` / `TranslateService`
- No hardcoded English strings in templates
- Minimum two languages: English (`en`) and Spanish (`es`)

## Git
- Commits follow Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`
- Feature branches: `feature/<issue-id>` off `develop`
- Bugfix branches: `bugfix/<issue-id>` off `develop`
- Hotfix branches: `hotfix/<issue-id>` off `main`
