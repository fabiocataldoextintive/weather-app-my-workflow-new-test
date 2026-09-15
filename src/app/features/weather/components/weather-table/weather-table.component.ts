import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { HistoryEntry } from '../../../../core/models/history.model';
import { TemperaturePipe } from '../../../../shared/pipes/temperature.pipe';

@Component({
  selector: 'app-weather-table',
  standalone: true,
  imports: [TemperaturePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="weather-table">
      @if (entries.length === 0) {
        <p class="weather-table__empty">
          No weather data yet. Search for a city to get started.
        </p>
      } @else {
        <div class="weather-table__wrapper">
          <table class="weather-table__table" role="grid" aria-label="Recent weather searches">
            <thead>
              <tr>
                <th scope="col">City</th>
                <th scope="col">Condition</th>
                <th scope="col">Temp (°C)</th>
                <th scope="col">Temp (°F)</th>
                <th scope="col">Wind</th>
                <th scope="col">Humidity</th>
                <th scope="col">Local Time</th>
              </tr>
            </thead>
            <tbody>
              @for (entry of entries; track entry.city) {
                <tr
                  class="weather-table__row"
                  [class.weather-table__row--selected]="entry.city === selectedCity"
                  (click)="selectCity.emit(entry.city)"
                  role="row"
                  tabindex="0"
                  (keydown.enter)="selectCity.emit(entry.city)"
                >
                  <td class="weather-table__city">
                    <div class="weather-table__city-name">{{ entry.weather.location.name }}</div>
                    <div class="weather-table__city-country">{{ entry.weather.location.country }}</div>
                  </td>
                  <td class="weather-table__condition">
                    <img
                      [src]="'https:' + entry.weather.current.condition.icon"
                      [alt]="entry.weather.current.condition.text"
                      width="32"
                      height="32"
                    />
                    <span>{{ entry.weather.current.condition.text }}</span>
                  </td>
                  <td>{{ entry.weather.current.temp_c | temperature: 'C' : 1 }}</td>
                  <td>{{ entry.weather.current.temp_f | temperature: 'F' : 1 }}</td>
                  <td>{{ entry.weather.current.wind_kph }} km/h</td>
                  <td>{{ entry.weather.current.humidity }}%</td>
                  <td class="weather-table__time">{{ entry.weather.location.localtime }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styleUrl: './weather-table.component.scss',
})
export class WeatherTableComponent {
  @Input({ required: true }) entries: HistoryEntry[] = [];
  @Input() selectedCity: string | null = null;
  @Output() selectCity = new EventEmitter<string>();
}
