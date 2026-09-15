import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CurrentWeatherResponse } from '../../../../core/models/weather.model';
import { TemperaturePipe } from '../../../../shared/pipes/temperature.pipe';

@Component({
  selector: 'app-weather-detail',
  standalone: true,
  imports: [TemperaturePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (weather) {
      <div class="weather-detail animate-fade-in">
        <div class="weather-detail__back-bar">
          <button class="weather-detail__back" (click)="back.emit()" type="button">
            ← Back to table
          </button>
        </div>

        <div class="weather-detail__hero">
          <div class="weather-detail__hero-bg"
            [style.background]="'linear-gradient(135deg, #0f172a 0%, #1a3a6b 100%)'">
          </div>
          <div class="weather-detail__hero-content">
            <div class="weather-detail__location">
              <h1 class="weather-detail__city">{{ weather.location.name }}</h1>
              <p class="weather-detail__region">{{ weather.location.region }}, {{ weather.location.country }}</p>
              <p class="weather-detail__localtime">🕐 {{ weather.location.localtime }}</p>
            </div>
            <div class="weather-detail__temp-section">
              <img
                class="weather-detail__icon"
                [src]="'https:' + weather.current.condition.icon"
                [alt]="weather.current.condition.text"
                width="80"
                height="80"
              />
              <div class="weather-detail__temps">
                <span class="weather-detail__temp-main">{{ weather.current.temp_c | temperature: 'C' : 1 }}</span>
                <span class="weather-detail__temp-alt">{{ weather.current.temp_f | temperature: 'F' : 1 }}</span>
              </div>
              <p class="weather-detail__condition-text">{{ weather.current.condition.text }}</p>
            </div>
          </div>
        </div>

        <div class="weather-detail__stats">
          <div class="weather-detail__stat">
            <span class="weather-detail__stat-icon">💨</span>
            <div class="weather-detail__stat-info">
              <span class="weather-detail__stat-label">Wind Speed</span>
              <span class="weather-detail__stat-value">{{ weather.current.wind_kph }} km/h</span>
            </div>
          </div>
          <div class="weather-detail__stat">
            <span class="weather-detail__stat-icon">🧭</span>
            <div class="weather-detail__stat-info">
              <span class="weather-detail__stat-label">Wind Direction</span>
              <span class="weather-detail__stat-value">{{ weather.current.wind_dir }}</span>
            </div>
          </div>
          <div class="weather-detail__stat">
            <span class="weather-detail__stat-icon">💧</span>
            <div class="weather-detail__stat-info">
              <span class="weather-detail__stat-label">Humidity</span>
              <span class="weather-detail__stat-value">{{ weather.current.humidity }}%</span>
            </div>
          </div>
          <div class="weather-detail__stat">
            <span class="weather-detail__stat-icon">🌡️</span>
            <div class="weather-detail__stat-info">
              <span class="weather-detail__stat-label">Feels Like</span>
              <span class="weather-detail__stat-value">{{ weather.current.feelslike_c | temperature: 'C' : 1 }}</span>
            </div>
          </div>
          <div class="weather-detail__stat">
            <span class="weather-detail__stat-icon">☁️</span>
            <div class="weather-detail__stat-info">
              <span class="weather-detail__stat-label">Cloud Cover</span>
              <span class="weather-detail__stat-value">{{ weather.current.cloud }}%</span>
            </div>
          </div>
          <div class="weather-detail__stat">
            <span class="weather-detail__stat-icon">👁️</span>
            <div class="weather-detail__stat-info">
              <span class="weather-detail__stat-label">Visibility</span>
              <span class="weather-detail__stat-value">{{ weather.current.vis_km }} km</span>
            </div>
          </div>
          <div class="weather-detail__stat">
            <span class="weather-detail__stat-icon">🌬️</span>
            <div class="weather-detail__stat-info">
              <span class="weather-detail__stat-label">Gust Speed</span>
              <span class="weather-detail__stat-value">{{ weather.current.gust_kph }} km/h</span>
            </div>
          </div>
          <div class="weather-detail__stat">
            <span class="weather-detail__stat-icon">☀️</span>
            <div class="weather-detail__stat-info">
              <span class="weather-detail__stat-label">UV Index</span>
              <span class="weather-detail__stat-value">{{ weather.current.uv }}</span>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './weather-detail.component.scss',
})
export class WeatherDetailComponent {
  @Input({ required: true }) weather!: CurrentWeatherResponse;
  @Output() back = new EventEmitter<void>();
}
