import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from './shared/components/language-switcher/language-switcher.component';
import { OfflineBannerComponent } from './shared/components/offline-banner/offline-banner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    LanguageSwitcherComponent,
    OfflineBannerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app">
      <app-offline-banner />

      <header class="app__header">
        <div class="app__header-inner">
          <div class="app__brand">
            <span class="app__brand-icon" aria-hidden="true">⛅</span>
            <span class="app__brand-name">WeatherApp</span>
          </div>
          <nav class="app__nav" aria-label="Main navigation">
            <a
              class="app__nav-link"
              routerLink="/weather"
              routerLinkActive="app__nav-link--active"
              ariaCurrentWhenActive="page"
            >
              {{ 'nav.weather' | translate }}
            </a>
            <a
              class="app__nav-link"
              routerLink="/history"
              routerLinkActive="app__nav-link--active"
              ariaCurrentWhenActive="page"
            >
              {{ 'nav.history' | translate }}
            </a>
            <a
              class="app__nav-link"
              routerLink="/favorites"
              routerLinkActive="app__nav-link--active"
              ariaCurrentWhenActive="page"
            >
              {{ 'nav.favorites' | translate }}
            </a>
          </nav>
          <app-language-switcher />
        </div>
      </header>

      <main class="app__main">
        <router-outlet />
      </main>
    </div>
  `,
  styleUrl: './app.scss',
})
export class App {
  title = 'WeatherApp';
}
