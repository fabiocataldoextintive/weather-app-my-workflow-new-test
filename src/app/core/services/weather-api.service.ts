import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  CurrentWeatherResponse,
  SearchResult,
} from '../models/weather.model';

interface CacheEntry<T> {
  data$: Observable<T>;
  cachedAt: number;
}

@Injectable({ providedIn: 'root' })
export class WeatherApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.weatherApiBaseUrl;
  private readonly apiKey = import.meta.env.NG_APP_WEATHER_API_KEY;

  // In-memory cache: city -> CacheEntry
  private readonly currentWeatherCache = new Map<
    string,
    CacheEntry<CurrentWeatherResponse>
  >();
  private readonly suggestionsCache = new Map<
    string,
    CacheEntry<SearchResult[]>
  >();

  private readonly CACHE_TTL_MS = 60_000; // 1 minute for suggestions

  searchCities(query: string): Observable<SearchResult[]> {
    const key = query.toLowerCase().trim();
    const cached = this.suggestionsCache.get(key);
    if (cached && Date.now() - cached.cachedAt < this.CACHE_TTL_MS) {
      return cached.data$;
    }

    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('q', query);

    const data$ = this.http
      .get<SearchResult[]>(`${this.baseUrl}/search.json`, { params })
      .pipe(shareReplay(1));

    this.suggestionsCache.set(key, { data$, cachedAt: Date.now() });
    return data$;
  }

  getCurrentWeather(city: string): Observable<CurrentWeatherResponse> {
    const params = new HttpParams()
      .set('key', this.apiKey)
      .set('q', city)
      .set('aqi', 'no');

    return this.http
      .get<CurrentWeatherResponse>(`${this.baseUrl}/current.json`, { params })
      .pipe(
        catchError((err) => throwError(() => err))
      );
  }

  clearCurrentWeatherCache(): void {
    this.currentWeatherCache.clear();
  }
}
