import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loading-spinner" role="status" aria-label="Loading">
      <div class="loading-spinner__circle"></div>
    </div>
  `,
  styles: [`
    .loading-spinner {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-8);

      &__circle {
        width: 40px;
        height: 40px;
        border: 3px solid var(--color-border);
        border-top-color: var(--color-primary);
        border-radius: 50%;

        @media (prefers-reduced-motion: no-preference) {
          animation: spin 0.8s linear infinite;
        }
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `],
})
export class LoadingSpinnerComponent {}
