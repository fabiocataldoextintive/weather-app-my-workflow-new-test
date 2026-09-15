import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { StorageService } from '../../../core/services/storage.service';

const LANG_KEY = 'appLanguage';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="lang-switcher"
      type="button"
      (click)="switchLanguage()"
      [attr.aria-label]="'lang.switchTo' | translate"
    >
      {{ 'lang.switchTo' | translate }}
    </button>
  `,
  styleUrl: './language-switcher.component.scss',
})
export class LanguageSwitcherComponent {
  private readonly translateService = inject(TranslateService);
  private readonly storageService = inject(StorageService);

  readonly currentLang = signal(this.translateService.currentLang ?? 'en');

  constructor() {
    const savedLang = this.storageService.get<string>(LANG_KEY);
    if (savedLang && savedLang !== this.translateService.currentLang) {
      this.translateService.use(savedLang);
      this.currentLang.set(savedLang);
    }
  }

  /**
   * Toggles between English and Spanish, persists the selection.
   */
  switchLanguage(): void {
    const next = this.currentLang() === 'en' ? 'es' : 'en';
    this.translateService.use(next);
    this.storageService.set(LANG_KEY, next);
    this.currentLang.set(next);
  }
}
