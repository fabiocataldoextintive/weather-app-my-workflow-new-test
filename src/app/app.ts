import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="app">
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
              Weather
            </a>
            <a
              class="app__nav-link"
              routerLink="/history"
              routerLinkActive="app__nav-link--active"
              ariaCurrentWhenActive="page"
            >
              History
            </a>
          </nav>
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
