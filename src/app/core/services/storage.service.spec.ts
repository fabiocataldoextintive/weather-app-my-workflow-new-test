import { describe, it, expect } from 'vitest';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    service = new StorageService();
  });

  describe('get', () => {
    it('returns null for missing key', () => {
      expect(service.get('nonexistent')).toBeNull();
    });

    it('returns parsed value for existing key', () => {
      localStorage.setItem('testKey', JSON.stringify({ foo: 'bar' }));
      expect(service.get<{ foo: string }>('testKey')).toEqual({ foo: 'bar' });
    });

    it('returns null for invalid JSON', () => {
      localStorage.setItem('badKey', '{invalid-json');
      expect(service.get('badKey')).toBeNull();
    });
  });

  describe('set', () => {
    it('stores serialized value', () => {
      service.set('myKey', { value: 42 });
      expect(localStorage.getItem('myKey')).toBe('{"value":42}');
    });

    it('stores numbers', () => {
      service.set('num', 300000);
      expect(service.get<number>('num')).toBe(300000);
    });
  });

  describe('remove', () => {
    it('removes existing key', () => {
      service.set('key', 'value');
      service.remove('key');
      expect(service.get('key')).toBeNull();
    });

    it('does not throw for missing key', () => {
      expect(() => service.remove('nonexistent')).not.toThrow();
    });
  });
});
