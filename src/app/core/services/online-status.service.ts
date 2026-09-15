import { Injectable, signal } from '@angular/core';

/**
 * Tracks the browser's online/offline status using signals.
 * Listens to window `online` and `offline` events.
 */
@Injectable({ providedIn: 'root' })
export class OnlineStatusService {
  readonly isOnline = signal(navigator.onLine);

  constructor() {
    window.addEventListener('online', () => this.isOnline.set(true));
    window.addEventListener('offline', () => this.isOnline.set(false));
  }
}
