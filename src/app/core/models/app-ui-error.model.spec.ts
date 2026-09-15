import { describe, it, expect } from 'vitest';
import { createAppUiError } from '../models/app-ui-error.model';
import { INTERVAL_OPTIONS, DEFAULT_INTERVAL_MS, INTERVAL_LABELS } from '../models/interval.constants';

describe('AppUiError', () => {
  it('creates error with correct shape', () => {
    const err = createAppUiError('NOT_FOUND', 'City not found', false);
    expect(err.code).toBe('NOT_FOUND');
    expect(err.message).toBe('City not found');
    expect(err.retryable).toBe(false);
  });

  it('defaults retryable to false', () => {
    const err = createAppUiError('UNKNOWN', 'Unknown error');
    expect(err.retryable).toBe(false);
  });

  it('allows retryable true', () => {
    const err = createAppUiError('SERVER_ERROR', 'Server error', true);
    expect(err.retryable).toBe(true);
  });
});

describe('INTERVAL_OPTIONS', () => {
  it('has exactly 4 options', () => {
    expect(INTERVAL_OPTIONS.length).toBe(4);
  });

  it('is sorted ascending', () => {
    const sorted = [...INTERVAL_OPTIONS].sort((a, b) => a - b);
    expect([...INTERVAL_OPTIONS]).toEqual(sorted);
  });

  it('starts with 5 minutes in ms', () => {
    expect(INTERVAL_OPTIONS[0]).toBe(300_000);
  });

  it('ends with 30 minutes in ms', () => {
    expect(INTERVAL_OPTIONS[3]).toBe(1_800_000);
  });

  it('DEFAULT_INTERVAL_MS is 5 minutes', () => {
    expect(DEFAULT_INTERVAL_MS).toBe(300_000);
  });

  it('INTERVAL_LABELS has label for each option', () => {
    for (const option of INTERVAL_OPTIONS) {
      expect(INTERVAL_LABELS[option]).toBeDefined();
    }
  });
});
