export type ErrorCode =
  | 'NOT_FOUND'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'RATE_LIMIT'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN';

export interface AppUiError {
  readonly code: ErrorCode;
  readonly message: string;
  readonly retryable: boolean;
}

export function createAppUiError(
  code: ErrorCode,
  message: string,
  retryable = false
): AppUiError {
  return { code, message, retryable };
}
