import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { INTERVAL_OPTIONS } from '../../../../core/models/interval.constants';
import { SettingsActions } from '../../../../store/settings/settings.actions';
import { selectIntervalMs } from '../../../../store/settings/settings.selectors';

/** Maps millisecond values to i18n translation keys. */
const INTERVAL_I18N_KEYS: Record<number, string> = {
  300_000: 'interval.5min',
  600_000: 'interval.10min',
  900_000: 'interval.15min',
  1_800_000: 'interval.30min',
};

@Component({
  selector: 'app-interval-selector',
  standalone: true,
  imports: [AsyncPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="interval-selector">
      <span class="interval-selector__label">{{ 'interval.label' | translate }}:</span>
      <ul class="interval-selector__list" role="listbox" aria-label="Refresh interval options">
        @for (option of intervalOptions; track option) {
          <li
            class="interval-selector__item"
            [class.interval-selector__item--active]="(currentInterval$ | async) === option"
            role="option"
            [attr.aria-selected]="(currentInterval$ | async) === option"
            (click)="selectInterval(option)"
          >
            {{ i18nKeys[option] | translate }}
          </li>
        }
      </ul>
    </div>
  `,
  styleUrl: './interval-selector.component.scss',
})
export class IntervalSelectorComponent {
  private readonly store = inject(Store);

  readonly currentInterval$ = this.store.select(selectIntervalMs);
  readonly intervalOptions = [...INTERVAL_OPTIONS];
  readonly i18nKeys = INTERVAL_I18N_KEYS;

  selectInterval(ms: number): void {
    this.store.dispatch(SettingsActions.setInterval({ intervalMs: ms }));
  }
}
