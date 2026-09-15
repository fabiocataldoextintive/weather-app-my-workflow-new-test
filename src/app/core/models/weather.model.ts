// Mirrors /search.json response array item
export interface SearchResult {
  readonly id: number;
  readonly name: string;
  readonly region: string;
  readonly country: string;
  readonly lat: number;
  readonly lon: number;
  readonly url: string;
}

// Mirrors /current.json response
export interface CurrentWeatherResponse {
  readonly location: WeatherLocation;
  readonly current: CurrentWeather;
}

export interface WeatherLocation {
  readonly name: string;
  readonly region: string;
  readonly country: string;
  readonly lat: number;
  readonly lon: number;
  readonly tz_id: string;
  readonly localtime_epoch: number;
  readonly localtime: string;
}

export interface CurrentWeather {
  readonly last_updated_epoch: number;
  readonly last_updated: string;
  readonly temp_c: number;
  readonly temp_f: number;
  readonly is_day: number;
  readonly condition: WeatherCondition;
  readonly wind_mph: number;
  readonly wind_kph: number;
  readonly wind_degree: number;
  readonly wind_dir: string;
  readonly pressure_mb: number;
  readonly pressure_in: number;
  readonly precip_mm: number;
  readonly precip_in: number;
  readonly humidity: number;
  readonly cloud: number;
  readonly feelslike_c: number;
  readonly feelslike_f: number;
  readonly vis_km: number;
  readonly vis_miles: number;
  readonly uv: number;
  readonly gust_mph: number;
  readonly gust_kph: number;
}

export interface WeatherCondition {
  readonly text: string;
  readonly icon: string;
  readonly code: number;
}
