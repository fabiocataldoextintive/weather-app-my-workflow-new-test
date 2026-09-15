import { describe, it, expect } from 'vitest';
import { App } from './app';

describe('App', () => {
  it('should have a title property', () => {
    const app = new App();
    expect(app.title).toBe('WeatherApp');
  });
});
