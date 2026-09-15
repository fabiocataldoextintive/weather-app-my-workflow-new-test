import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppUiError, createAppUiError } from '../models/app-ui-error.model';

function mapHttpError(error: HttpErrorResponse): AppUiError {
  if (!navigator.onLine || error.status === 0) {
    return createAppUiError(
      'NETWORK_ERROR',
      'No internet connection. Please check your network and try again.',
      true
    );
  }

  switch (error.status) {
    case 400: {
      // WeatherAPI returns 400 for city not found
      const apiMsg: string =
        (error.error as { error?: { message?: string } })?.error?.message ?? '';
      if (
        apiMsg.toLowerCase().includes('no matching location') ||
        apiMsg.toLowerCase().includes('not found')
      ) {
        return createAppUiError(
          'NOT_FOUND',
          'City not found. Please check the name and try again.',
          false
        );
      }
      return createAppUiError('UNKNOWN', 'Invalid request.', false);
    }
    case 401:
    case 403:
      return createAppUiError(
        'UNKNOWN',
        'Authentication error. Please contact support.',
        false
      );
    case 404:
      return createAppUiError(
        'NOT_FOUND',
        'City not found. Please check the name and try again.',
        false
      );
    case 429:
      return createAppUiError(
        'RATE_LIMIT',
        'Too many requests. Please wait a moment and try again.',
        true
      );
    default:
      if (error.status >= 500) {
        return createAppUiError(
          'SERVER_ERROR',
          'The weather service is temporarily unavailable. Please try again later.',
          true
        );
      }
      return createAppUiError(
        'UNKNOWN',
        'An unexpected error occurred. Please try again.',
        true
      );
  }
}

export const errorHandlingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  return next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        return throwError(() => mapHttpError(error));
      }
      return throwError(() =>
        createAppUiError('UNKNOWN', 'An unexpected error occurred.', true)
      );
    })
  );
};
