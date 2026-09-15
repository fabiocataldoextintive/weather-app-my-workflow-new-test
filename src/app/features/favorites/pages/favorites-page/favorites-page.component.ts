import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '@ngx-translate/core';
import { FavoritesActions } from '../../../../store/favorites/favorites.actions';
import { FavoritesListComponent } from '../../components/favorites-list/favorites-list.component';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [FavoritesListComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="favorites-page">
      <app-favorites-list />
    </div>
  `,
  styles: [
    `
      .favorites-page {
        max-width: var(--max-width-content);
        margin: 0 auto;
        padding: var(--spacing-6) var(--spacing-4);
      }
    `,
  ],
})
export class FavoritesPageComponent implements OnInit {
  private readonly store = inject(Store);

  ngOnInit(): void {
    this.store.dispatch(FavoritesActions.loadFavorites({}));
  }
}
