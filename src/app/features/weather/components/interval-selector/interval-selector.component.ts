import {
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import {
  INTERVAL_LABELS,
  INTERVAL_OPTIONS,
} from '../../../../core/models/interval.constants';
import { SettingsActions } from '../../../../store/settings/settings.actions';
import { selectIntervalMs } from '../../../../store/settings/settings.selectors';

@Component({
  selector: 'app-interval-selector',
  standalone: true,
  imports: [AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="interval-selector">
      <span class="interval-selector__label">Update interval:</span>
      <ul class="interval-selector__list" role="listbox" aria-label="Refresh interval options">
        @for (option of intervalOptions; track option) {
          <li
            class="interval-selector__item"
            [class.interval-selector__item--active]="(currentInterval$ | async) === option"
            role="option"
            [attr.aria-selected]="(currentInterval$ | async) === option"
            (click)="selectInterval(option)"
          >
            {{ labels[option] }}
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
  readonly labels = INTERVAL_LABELS;

  selectInterval(ms: number): void {
    this.store.dispatch(SettingsActions.setInterval({ intervalMs: ms }));
  }
}
