import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { selectEntries } from '../../../../store/history/history.selectors';
import { WeatherActions } from '../../../../store/weather/weather.actions';
import { HistoryEntry } from '../../../../core/models/history.model';
import { TemperaturePipe } from '../../../../shared/pipes/temperature.pipe';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-history-list',
  standalone: true,
  imports: [AsyncPipe, DatePipe, TemperaturePipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="history-list">
      <h2 class="history-list__title">{{ 'history.title' | translate }}</h2>
      @if ((entries$ | async)?.length === 0) {
        <p class="history-list__empty">{{ 'history.empty' | translate }}</p>
      } @else {
        <ul class="history-list__items" role="list">
          @for (entry of pagedEntries(); track entry.city) {
            <li
              class="history-list__item"
              role="listitem"
              (click)="loadCity(entry)"
              tabindex="0"
              (keydown.enter)="loadCity(entry)"
            >
              <img
                class="history-list__icon"
                [src]="'https:' + entry.weather.current.condition.icon"
                [alt]="entry.weather.current.condition.text"
                width="32"
                height="32"
              />
              <div class="history-list__info">
                <span class="history-list__city">{{ entry.city }}</span>
                <span class="history-list__country">{{ entry.country }}</span>
              </div>
              <div class="history-list__weather">
                <span class="history-list__temp">
                  {{ entry.weather.current.temp_c | temperature: 'C' : 0 }}
                </span>
                <span class="history-list__condition">{{ entry.weather.current.condition.text }}</span>
              </div>
              <span class="history-list__time">
                {{ entry.lastUpdate | date: 'short' }}
              </span>
            </li>
          }
        </ul>

        @if (hasMore()) {
          <div class="history-list__pagination">
            <button
              class="history-list__load-more"
              type="button"
              (click)="loadMore()"
            >
              {{ 'history.loadMore' | translate }}
            </button>
          </div>
        }
      }
    </div>
  `,
  styleUrl: './history-list.component.scss',
})
export class HistoryListComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private allEntries: HistoryEntry[] = [];
  private page = signal(1);

  readonly entries$ = this.store.select(selectEntries);
  readonly pagedEntries = signal<HistoryEntry[]>([]);
  readonly hasMore = signal(false);

  constructor() {
    this.entries$.subscribe((entries) => {
      this.allEntries = entries;
      this.updatePaged();
    });
  }

  private updatePaged(): void {
    const count = this.page() * PAGE_SIZE;
    this.pagedEntries.set(this.allEntries.slice(0, count));
    this.hasMore.set(this.allEntries.length > count);
  }

  loadMore(): void {
    this.page.update((p) => p + 1);
    this.updatePaged();
  }

  /**
   * Dispatches weather load for the selected city and navigates to the weather page.
   * @param entry - The history entry to load weather for
   */
  loadCity(entry: HistoryEntry): void {
    this.store.dispatch(WeatherActions.loadWeather({ city: entry.city }));
    this.router.navigate(['/weather']);
  }
}
