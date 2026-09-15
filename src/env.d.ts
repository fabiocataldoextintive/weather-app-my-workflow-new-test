interface ImportMetaEnv {
  readonly NG_APP_WEATHER_API_KEY: string;
  readonly [key: string]: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
