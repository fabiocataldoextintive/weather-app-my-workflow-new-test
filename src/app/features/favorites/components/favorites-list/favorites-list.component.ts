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
import { selectFavoriteEntries } from '../../../../store/favorites/favorites.selectors';
import { FavoritesActions } from '../../../../store/favorites/favorites.actions';
import { WeatherActions } from '../../../../store/weather/weather.actions';
import { FavoriteEntry } from '../../../../core/models/favorites.model';
import { TemperaturePipe } from '../../../../shared/pipes/temperature.pipe';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [AsyncPipe, DatePipe, TemperaturePipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="favorites-list">
      <h2 class="favorites-list__title">{{ 'favorites.title' | translate }}</h2>

      @if ((entries$ | async)?.length === 0) {
        <p class="favorites-list__empty">{{ 'favorites.empty' | translate }}</p>
      } @else {
        <ul class="favorites-list__items" role="list">
          @for (entry of pagedEntries(); track entry.city) {
            <li
              class="favorites-list__item"
              role="listitem"
              (click)="loadCity(entry)"
              tabindex="0"
              (keydown.enter)="loadCity(entry)"
            >
              <img
                class="favorites-list__icon"
                [src]="'https:' + entry.weather.current.condition.icon"
                [alt]="entry.weather.current.condition.text"
                width="40"
                height="40"
              />
              <div class="favorites-list__info">
                <span class="favorites-list__city">{{ entry.city }}</span>
                <span class="favorites-list__country">{{ entry.country }}</span>
              </div>
              <div class="favorites-list__weather">
                <span class="favorites-list__temp">
                  {{ entry.weather.current.temp_c | temperature: 'C' : 0 }}
                </span>
                <span class="favorites-list__condition">
                  {{ entry.weather.current.condition.text }}
                </span>
              </div>
              <span class="favorites-list__time">
                {{ entry.lastUpdate | date: 'short' }}
              </span>
              <button
                class="favorites-list__remove"
                type="button"
                [attr.aria-label]="('favorites.remove' | translate) + ' ' + entry.city"
                (click)="removeCity($event, entry.city)"
              >
                {{ 'favorites.remove' | translate }}
              </button>
            </li>
          }
        </ul>

        @if (hasMore()) {
          <div class="favorites-list__pagination">
            <button
              class="favorites-list__load-more"
              type="button"
              (click)="loadMore()"
            >
              {{ 'favorites.loadMore' | translate }}
            </button>
          </div>
        }
      }
    </div>
  `,
  styleUrl: './favorites-list.component.scss',
})
export class FavoritesListComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private allEntries: FavoriteEntry[] = [];
  private page = signal(1);

  readonly entries$ = this.store.select(selectFavoriteEntries);
  readonly pagedEntries = signal<FavoriteEntry[]>([]);
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
   * Dispatches weather load and navigates to the weather page.
   * @param entry - The favorite entry to load weather for
   */
  loadCity(entry: FavoriteEntry): void {
    this.store.dispatch(WeatherActions.loadWeather({ city: entry.city }));
    this.router.navigate(['/weather']);
  }

  /**
   * Removes the city from favorites without triggering city navigation.
   * @param event - Click event (stops propagation to parent li)
   * @param city - City name to remove
   */
  removeCity(event: Event, city: string): void {
    event.stopPropagation();
    this.store.dispatch(FavoritesActions.removeFavorite({ city }));
  }
}
