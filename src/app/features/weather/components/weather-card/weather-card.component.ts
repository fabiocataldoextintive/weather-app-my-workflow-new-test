import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { CurrentWeatherResponse } from '../../../../core/models/weather.model';
import { TemperaturePipe } from '../../../../shared/pipes/temperature.pipe';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [TemperaturePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (weather) {
      <div class="weather-card animate-fade-in-up">
        <div class="weather-card__header">
          <div class="weather-card__location">
            <h2 class="weather-card__city">{{ weather.location.name }}</h2>
            <p class="weather-card__region">{{ weather.location.region }}, {{ weather.location.country }}</p>
          </div>
          <div class="weather-card__local-time">
            <span class="weather-card__time-label">Local Time</span>
            <span class="weather-card__time-value">{{ weather.location.localtime }}</span>
          </div>
        </div>

        <div class="weather-card__main">
          <img
            class="weather-card__icon"
            [src]="'https:' + weather.current.condition.icon"
            [alt]="weather.current.condition.text"
            width="64"
            height="64"
          />
          <div class="weather-card__temps">
            <span class="weather-card__temp-c">{{ weather.current.temp_c | temperature: 'C' : 1 }}</span>
            <span class="weather-card__temp-separator">/</span>
            <span class="weather-card__temp-f">{{ weather.current.temp_f | temperature: 'F' : 1 }}</span>
          </div>
          <p class="weather-card__condition">{{ weather.current.condition.text }}</p>
        </div>

        <div class="weather-card__details">
          <div class="weather-card__detail">
            <span class="weather-card__detail-icon" aria-hidden="true">💨</span>
            <span class="weather-card__detail-label">Wind</span>
            <span class="weather-card__detail-value">{{ weather.current.wind_kph }} km/h {{ weather.current.wind_dir }}</span>
          </div>
          <div class="weather-card__detail">
            <span class="weather-card__detail-icon" aria-hidden="true">💧</span>
            <span class="weather-card__detail-label">Humidity</span>
            <span class="weather-card__detail-value">{{ weather.current.humidity }}%</span>
          </div>
          <div class="weather-card__detail">
            <span class="weather-card__detail-icon" aria-hidden="true">🌡️</span>
            <span class="weather-card__detail-label">Feels like</span>
            <span class="weather-card__detail-value">{{ weather.current.feelslike_c | temperature: 'C' : 1 }}</span>
          </div>
          <div class="weather-card__detail">
            <span class="weather-card__detail-icon" aria-hidden="true">☁️</span>
            <span class="weather-card__detail-label">Cloud cover</span>
            <span class="weather-card__detail-value">{{ weather.current.cloud }}%</span>
          </div>
        </div>
      </div>
    }
  `,
  styleUrl: './weather-card.component.scss',
})
export class WeatherCardComponent {
  @Input({ required: true }) weather!: CurrentWeatherResponse;
}
