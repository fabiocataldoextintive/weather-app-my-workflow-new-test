import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { WeatherActions } from '../../../../store/weather/weather.actions';
import { HistoryActions } from '../../../../store/history/history.actions';
import { SettingsActions } from '../../../../store/settings/settings.actions';
import {
  selectCurrentWeather,
  selectError,
  selectLoading,
  selectSelectedCity,
  selectViewMode,
} from '../../../../store/weather/weather.selectors';
import { selectEntries } from '../../../../store/history/history.selectors';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { IntervalSelectorComponent } from '../../components/interval-selector/interval-selector.component';
import { WeatherTableComponent } from '../../components/weather-table/weather-table.component';
import { WeatherDetailComponent } from '../../components/weather-detail/weather-detail.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-weather-page',
  standalone: true,
  imports: [
    AsyncPipe,
    SearchBarComponent,
    IntervalSelectorComponent,
    WeatherTableComponent,
    WeatherDetailComponent,
    LoadingSpinnerComponent,
    ErrorMessageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="weather-page">
      <div class="weather-page__search-section">
        <app-search-bar />
        <app-interval-selector />
      </div>

      @if (loading$ | async) {
        <app-loading-spinner />
      }

      <app-error-message
        [error]="(error$ | async) ?? null"
        (retry)="retryLastSearch()"
      />

      @if ((viewMode$ | async) === 'detail' && (currentWeather$ | async); as weather) {
        <app-weather-detail
          [weather]="weather"
          (back)="switchToTable()"
        />
      } @else {
        <div class="weather-page__table-section">
          <div class="weather-page__view-toggle">
            <span class="weather-page__view-label">View:</span>
            <button
              class="weather-page__toggle-btn"
              [class.weather-page__toggle-btn--active]="(viewMode$ | async) === 'table'"
              (click)="setViewMode('table')"
              type="button"
            >
              Table
            </button>
            <button
              class="weather-page__toggle-btn"
              [class.weather-page__toggle-btn--active]="(viewMode$ | async) === 'detail'"
              (click)="setViewMode('detail')"
              [disabled]="!(currentWeather$ | async)"
              type="button"
            >
              Detail
            </button>
          </div>

          <app-weather-table
            [entries]="(history$ | async) ?? []"
            [selectedCity]="(selectedCity$ | async) ?? null"
            (selectCity)="onSelectCity($event)"
          />
        </div>
      }
    </div>
  `,
  styleUrl: './weather-page.component.scss',
})
export class WeatherPageComponent implements OnInit {
  private readonly store = inject(Store);

  readonly loading$ = this.store.select(selectLoading);
  readonly error$ = this.store.select(selectError);
  readonly viewMode$ = this.store.select(selectViewMode);
  readonly currentWeather$ = this.store.select(selectCurrentWeather);
  readonly selectedCity$ = this.store.select(selectSelectedCity);
  readonly history$ = this.store.select(selectEntries);

  private lastSearchCity: string | null = null;

  ngOnInit(): void {
    this.store.dispatch(HistoryActions.loadHistory({}));
    this.store.dispatch(SettingsActions.loadSettings({}));
  }

  retryLastSearch(): void {
    if (this.lastSearchCity) {
      this.store.dispatch(WeatherActions.loadWeather({ city: this.lastSearchCity }));
    }
  }

  switchToTable(): void {
    this.store.dispatch(WeatherActions.setViewMode({ mode: 'table' }));
  }

  setViewMode(mode: 'table' | 'detail'): void {
    this.store.dispatch(WeatherActions.setViewMode({ mode }));
  }

  onSelectCity(city: string): void {
    this.lastSearchCity = city;
    this.store.dispatch(WeatherActions.loadWeather({ city }));
    this.store.dispatch(WeatherActions.setViewMode({ mode: 'detail' }));
  }
}
