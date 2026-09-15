// Refresh interval options in milliseconds: 5, 10, 15, 30 minutes
export const INTERVAL_OPTIONS: readonly number[] = [
  300_000,   // 5 min
  600_000,   // 10 min
  900_000,   // 15 min
  1_800_000, // 30 min
] as const;

export const DEFAULT_INTERVAL_MS = INTERVAL_OPTIONS[0]; // 5 min

export const INTERVAL_LABELS: Record<number, string> = {
  300_000: '5 min',
  600_000: '10 min',
  900_000: '15 min',
  1_800_000: '30 min',
};
