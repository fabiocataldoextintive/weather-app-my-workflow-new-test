import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { AppUiError } from '../../../core/models/app-ui-error.model';

@Component({
  selector: 'app-error-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (error) {
      <div class="error-message" role="alert" [attr.aria-live]="'assertive'">
        <span class="error-message__icon" aria-hidden="true">⚠️</span>
        <span class="error-message__text">{{ error.message }}</span>
        @if (error.retryable) {
          <button
            class="error-message__retry"
            type="button"
            (click)="retry.emit()"
            aria-label="Retry"
          >
            Retry
          </button>
        }
      </div>
    }
  `,
  styles: [`
    .error-message {
      display: flex;
      align-items: center;
      gap: var(--spacing-3);
      padding: var(--spacing-3) var(--spacing-4);
      background: var(--color-error-bg);
      border: 1px solid var(--color-error);
      border-radius: var(--border-radius);
      color: var(--color-error);
      font-size: var(--font-size-sm);

      @media (prefers-reduced-motion: no-preference) {
        animation: fadeIn 200ms ease-out;
      }

      &__text {
        flex: 1;
      }

      &__retry {
        padding: var(--spacing-1) var(--spacing-3);
        background: var(--color-error);
        color: white;
        border: none;
        border-radius: var(--border-radius-sm);
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
        cursor: pointer;
        transition: opacity var(--transition-fast);

        &:hover { opacity: 0.85; }
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `],
})
export class ErrorMessageComponent {
  @Input() error: AppUiError | null = null;
  @Output() retry = new EventEmitter<void>();
}
