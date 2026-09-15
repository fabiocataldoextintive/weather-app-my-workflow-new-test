import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { OnlineStatusService } from '../../../core/services/online-status.service';

@Component({
  selector: 'app-offline-banner',
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!onlineStatusService.isOnline() && !dismissed()) {
      <div class="offline-banner" role="alert" aria-live="polite">
        <span class="offline-banner__text">{{ 'offline.banner' | translate }}</span>
        <button
          class="offline-banner__close"
          type="button"
          (click)="dismiss()"
          aria-label="Dismiss offline notification"
        >
          ✕
        </button>
      </div>
    }
  `,
  styleUrl: './offline-banner.component.scss',
})
export class OfflineBannerComponent {
  protected readonly onlineStatusService = inject(OnlineStatusService);
  readonly dismissed = signal(false);

  constructor() {
    // Reset dismissed state when connectivity is restored
    effect(() => {
      if (this.onlineStatusService.isOnline()) {
        this.dismissed.set(false);
      }
    });
  }

  /** Hides the banner until the next offline event. */
  dismiss(): void {
    this.dismissed.set(true);
  }
}
