import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { WeatherActions } from '../../../../store/weather/weather.actions';
import { selectSuggestions } from '../../../../store/weather/weather.selectors';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, AsyncPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="search-bar">
      <div class="search-bar__input-wrapper">
        <input
          class="search-bar__input"
          type="text"
          [placeholder]="'search.placeholder' | translate"
          [(ngModel)]="query"
          (ngModelChange)="onQueryChange($event)"
          (keydown.enter)="onSubmit()"
          (blur)="onBlur()"
          autocomplete="off"
          aria-label="Search city"
          aria-haspopup="listbox"
          [attr.aria-expanded]="showSuggestions()"
        />
        <button
          class="search-bar__clear"
          type="button"
          (click)="clear()"
          aria-label="Clear search"
        >
          ✕
        </button>
        <button
          class="search-bar__submit"
          type="button"
          (click)="onSubmit()"
          [attr.aria-label]="'search.button' | translate"
        >
          🔍
        </button>
      </div>

      @if (validationError()) {
        <p class="search-bar__validation" role="alert">{{ validationError() }}</p>
      }

      @if (showSuggestions() && (suggestions$ | async)?.length) {
        <ul class="search-bar__suggestions" role="listbox" aria-label="City suggestions">
          @for (suggestion of (suggestions$ | async); track suggestion.id) {
            <li
              class="search-bar__suggestion"
              role="option"
              (mousedown)="selectSuggestion(suggestion.name)"
            >
              <span class="search-bar__suggestion-city">{{ suggestion.name }}</span>
              <span class="search-bar__suggestion-country">{{ suggestion.region }}, {{ suggestion.country }}</span>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);
  private readonly translateService = inject(TranslateService);

  readonly suggestions$ = this.store.select(selectSuggestions);
  readonly showSuggestions = signal(false);
  readonly validationError = signal<string | null>(null);

  query = '';

  onQueryChange(value: string): void {
    this.validationError.set(null);
    if (value.trim().length >= 1) {
      this.showSuggestions.set(true);
      this.store.dispatch(WeatherActions.loadSuggestions({ query: value }));
    } else {
      this.showSuggestions.set(false);
      this.store.dispatch(WeatherActions.loadSuggestionsClear());
    }
  }

  onSubmit(): void {
    const trimmed = this.query.trim();
    if (!trimmed) {
      this.validationError.set(
        this.translateService.instant('search.empty')
      );
      return;
    }
    this.validationError.set(null);
    this.showSuggestions.set(false);
    this.store.dispatch(WeatherActions.loadSuggestionsClear());
    this.store.dispatch(WeatherActions.loadWeather({ city: trimmed }));
  }

  selectSuggestion(cityName: string): void {
    this.query = cityName;
    this.showSuggestions.set(false);
    this.store.dispatch(WeatherActions.loadSuggestionsClear());
    this.store.dispatch(WeatherActions.loadWeather({ city: cityName }));
  }

  onBlur(): void {
    // Delay to allow mousedown on suggestion to fire first
    setTimeout(() => this.showSuggestions.set(false), 150);
  }

  clear(): void {
    this.query = '';
    this.validationError.set(null);
    this.showSuggestions.set(false);
    this.store.dispatch(WeatherActions.loadSuggestionsClear());
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.store.dispatch(WeatherActions.loadSuggestionsClear());
  }
}
