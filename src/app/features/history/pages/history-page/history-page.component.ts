import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { HistoryActions } from '../../../../store/history/history.actions';
import { HistoryListComponent } from '../../components/history-list/history-list.component';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [HistoryListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="history-page">
      <app-history-list />
    </div>
  `,
  styles: [`
    .history-page {
      max-width: var(--max-width-content);
      margin: 0 auto;
      padding: var(--spacing-6) var(--spacing-4);
    }
  `],
})
export class HistoryPageComponent implements OnInit {
  private readonly store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(HistoryActions.loadHistory({}));
  }
}
