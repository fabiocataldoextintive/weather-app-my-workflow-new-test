import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import {
  provideHttpClientTesting,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { WeatherApiService } from './weather-api.service';

describe('WeatherApiService', () => {
  let service: WeatherApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WeatherApiService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(WeatherApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('searchCities', () => {
    it('calls the search endpoint with query param', async () => {
      const mockData = [{ id: 1, name: 'London', region: 'City of London', country: 'UK', lat: 51, lon: 0, url: 'london' }];
      const promise = firstValueFrom(service.searchCities('London'));
      const req = httpMock.expectOne((r) => r.url.includes('/search.json'));
      expect(req.request.params.get('q')).toBe('London');
      req.flush(mockData);
      const result = await promise;
      expect(result).toEqual(mockData);
    });

    it('returns same observable reference for same query (cache hit)', () => {
      const obs1 = service.searchCities('paris');
      const obs2 = service.searchCities('paris');
      expect(obs1).toBe(obs2);
      // Subscribe to trigger the HTTP request then flush
      obs1.subscribe();
      httpMock.expectOne((r) => r.url.includes('/search.json')).flush([]);
    });
  });

  describe('getCurrentWeather', () => {
    it('calls the current weather endpoint with city param', async () => {
      const mockWeather = {
        location: { name: 'London', region: 'UK', country: 'UK', lat: 51.5, lon: 0, tz_id: 'Europe/London', localtime_epoch: 0, localtime: '' },
        current: { temp_c: 20, temp_f: 68, condition: { text: 'Sunny', icon: '//icon.png', code: 1000 }, wind_kph: 10, wind_mph: 6, humidity: 65, is_day: 1, wind_degree: 0, wind_dir: 'N', pressure_mb: 1015, pressure_in: 29.97, precip_mm: 0, precip_in: 0, cloud: 25, feelslike_c: 19, feelslike_f: 66, vis_km: 10, vis_miles: 6, uv: 4, gust_mph: 8, gust_kph: 12.9, last_updated_epoch: 0, last_updated: '' },
      };
      const promise = firstValueFrom(service.getCurrentWeather('London'));
      const req = httpMock.expectOne((r) => r.url.includes('/current.json'));
      expect(req.request.params.get('q')).toBe('London');
      req.flush(mockWeather);
      const result = await promise;
      expect(result.location.name).toBe('London');
    });
  });

  describe('clearCurrentWeatherCache', () => {
    it('does not throw', () => {
      expect(() => service.clearCurrentWeatherCache()).not.toThrow();
    });
  });
});
