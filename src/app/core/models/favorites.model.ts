import { CurrentWeatherResponse } from './weather.model';

export interface FavoriteEntry {
  readonly city: string;
  readonly country: string;
  readonly lastUpdate: string; // ISO 8601 timestamp
  readonly weather: CurrentWeatherResponse;
}
