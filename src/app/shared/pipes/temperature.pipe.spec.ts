import { describe, it, expect } from 'vitest';
import { TemperaturePipe } from './temperature.pipe';

describe('TemperaturePipe', () => {
  let pipe: TemperaturePipe;

  beforeEach(() => {
    pipe = new TemperaturePipe();
  });

  it('formats Celsius with 1 decimal by default', () => {
    expect(pipe.transform(20.567)).toBe('20.6°C');
  });

  it('formats Fahrenheit', () => {
    expect(pipe.transform(68.1, 'F')).toBe('68.1°F');
  });

  it('formats with 0 decimals', () => {
    expect(pipe.transform(20.7, 'C', 0)).toBe('21°C');
  });

  it('formats negative temperatures', () => {
    expect(pipe.transform(-5.5, 'C', 1)).toBe('-5.5°C');
  });

  it('formats 0 degrees', () => {
    expect(pipe.transform(0, 'C', 0)).toBe('0°C');
  });
});
