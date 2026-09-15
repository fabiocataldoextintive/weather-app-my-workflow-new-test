import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { TranslatePipe } from '@ngx-translate/core';
import { CurrentWeatherResponse } from '../../../../core/models/weather.model';
import { FavoriteEntry } from '../../../../core/models/favorites.model';
import { FavoritesActions } from '../../../../store/favorites/favorites.actions';
import { selectIsCityFavorited } from '../../../../store/favorites/favorites.selectors';
import { TemperaturePipe } from '../../../../shared/pipes/temperature.pipe';

@Component({
  selector: 'app-weather-detail',
  standalone: true,
  imports: [TemperaturePipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (weather()) {
      <div class="weather-detail animate-fade-in">
        <div class="weather-detail__back-bar">
          <button class="weather-detail__back" (click)="back.emit()" type="button">
            ← {{ 'weather.backToTable' | translate }}
          </button>
          <div class="weather-detail__actions">
            @if (isFavorited()) {
              <button
                class="weather-detail__fav-btn weather-detail__fav-btn--active"
                type="button"
                disabled
                aria-label="Already in favorites"
              >
                ⭐ {{ 'favorites.added' | translate }}
              </button>
            } @else {
              <button
                class="weather-detail__fav-btn"
                type="button"
                (click)="addToFavorites()"
                [attr.aria-label]="'favorites.add' | translate"
              >
                ☆ {{ 'favorites.add' | translate }}
              </button>
            }
          </div>
        </div>

        <div class="weather-detail__hero">
          <div class="weather-detail__hero-bg"
            [style.background]="'linear-gradient(135deg, #0f172a 0%, #1a3a6b 100%)'">
          </div>
          <div class="weather-detail__hero-content">
            <div class="weather-detail__location">
              <h1 class="weather-detail__city">{{ weather()!.location.name }}</h1>
              <p class="weather-detail__region">{{ weather()!.location.region }}, {{ weather()!.location.country }}</p>
              <p class="weather-detail__localtime">🕐 {{ weather()!.location.localtime }}</p>
            </div>
            <div class="weather-detail__temp-section">
              <img
                class="weather-detail__icon"
                [src]="'https:' + weather()!.current.condition.icon"
                [alt]="weather()!.current.condition.text"
                width="80"
                height="80"
              />
              <div class="weather-detail__temps">
                <span class="weather-detail__temp-main">{{ weather()!.current.temp_c | temperature: 'C' : 1 }}</span>
                <span class="weather-detail__temp-alt">{{ weather()!.current.temp_f | temperature: 'F' : 1 }}</span>
              </div>
              <p class="weather-detail__condition-text">{{ weather()!.current.condition.text }}</p>
            </div>
          </div>
        </div>

        <div class="weather-detail__stats">
          <div class="weather-detail__stat">
            <span class="weather-detail__stat-icon">💨</span>
            <div class="weather-detail__stat-info">
              <span class="weather-detail__stat-label">{{ 'weather.windSpeed' | translate }}</span>
              <span class="weather-detail__stat-value">{{ weather()!.current.wind_kph }} km/h</span>
            </div>
          </div>
          <div class="weather-detail__stat">
            <span class="weather-detail__stat-icon">🧭</span>
            <div class="weather-detail__stat-info">
              <span class="weather-detail__stat-label">{{ 'weather.windDirection' | translate }}</span>
              <span class="weather-detail__stat-value">{{ weather()!.current.wind_dir }}</span>
            </div>
          </div>
          <div class="weather-detail__stat">
            <span class="weather-detail__stat-icon">💧</span>
            <div class="weather-detail__stat-info">
              <span class="weather-detail__stat-label">{{ 'weather.humidity' | translate }}</span>
              <span class="weather-detail__stat-value">{{ weather()!.current.humidity }}%</span>
            </div>
          </div>
          <div class="weather-detail__stat">
            <span class="weather-detail__stat-icon">🌡️</span>
            <div class="weather-detail__stat-info">
              <span class="weather-detail__stat-label">{{ 'weather.feelsLike' | translate }}</span>
              <span class="weather-detail__stat-value">{{ weather()!.current.feelslike_c | temperature: 'C' : 1 }}</span>
            </div>
          </div>
          <div class="weather-detail__stat">
            <span class="weather-detail__stat-icon">☁️</span>
            <div class="weather-detail__stat-info">
              <span class="weather-detail__stat-label">{{ 'weather.cloudCover' | translate }}</span>
              <span class="weather-detail__stat-value">{{ weather()!.current.cloud }}%</span>
            </div>
          </div>
          <div class="weather-detail__stat">
            <span class="weather-detail__stat-icon">👁️</span>
            <div class="weather-detail__stat-info">
              <span class="weather-detail__stat-label">{{ 'weather.visibility' | translate }}</span>
              <span class="weather-detail__stat-value">{{ weather()!.current.vis_km }} km</span>
            </div>
          </div>
          <div class="weather-detail__stat">
            <span class="weather-detail__stat-icon">🌬️</span>
            <div class="weather-detail__stat-info">
              <span class="weather-detail__stat-label">{{ 'weather.gustSpeed' | translate }}</span>
              <span class="weather-detail__stat-value">{{ weather()!.current.gust_kph }} km/h</span>
            </div>
          </div>
          <div class="weather-detail__stat">
            <span class="weather-detail__stat-icon">☀️</span>
            <div class="weather-detail__stat-info">
              <span class="weather-detail__stat-label">{{ 'weather.uvIndex' | translate }}</span>
              <span class="weather-detail__stat-value">{{ weather()!.current.uv }}</span>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './weather-detail.component.scss',
})
export class WeatherDetailComponent {
  readonly weather = input.required<CurrentWeatherResponse>();
  readonly back = output<void>();

  private readonly store = inject(Store);

  /** Reactive city name derived from the weather signal input. */
  private readonly city = computed(() => this.weather().location.name);

  /** Reactively resolves whether the current city is favorited. */
  readonly isFavorited = toSignal(
    toObservable(this.city).pipe(
      switchMap((city) => this.store.select(selectIsCityFavorited(city)))
    ),
    { initialValue: false }
  );

  /** Dispatches add-to-favorites action for the current weather data. */
  addToFavorites(): void {
    const w = this.weather();
    const entry: FavoriteEntry = {
      city: w.location.name,
      country: w.location.country,
      lastUpdate: new Date().toISOString(),
      weather: w,
    };
    this.store.dispatch(FavoritesActions.addFavorite({ entry }));
  }
}
