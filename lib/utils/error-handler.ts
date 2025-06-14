/**
 * Utility functions for handling unknown errors in catch blocks
 * Solves TypeScript "'error' is of type 'unknown'" issues
 */

/**
 * Type guard to check if an error is an Error object
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Type guard to check if an error has a message property
 */
export function hasMessage(error: unknown): error is { message: string } {
  return typeof error === 'object' && error !== null && 'message' in error;
}

/**
 * Type guard to check if an error has a stack property
 */
export function hasStack(error: unknown): error is { stack: string } {
  return typeof error === 'object' && error !== null && 'stack' in error;
}

/**
 * Safely extracts an error message from an unknown error
 * @param error - The unknown error from a catch block
 * @param fallback - Fallback message if no message can be extracted
 * @returns A string message
 */
export function getErrorMessage(error: unknown, fallback = 'An unknown error occurred'): string {
  if (isError(error)) {
    return error.message;
  }
  
  if (hasMessage(error)) {
    return String(error.message);
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (typeof error === 'object' && error !== null) {
    return JSON.stringify(error);
  }
  
  return fallback;
}

/**
 * Safely extracts a stack trace from an unknown error
 * @param error - The unknown error from a catch block
 * @returns A string stack trace or undefined
 */
export function getErrorStack(error: unknown): string | undefined {
  if (isError(error)) {
    return error.stack;
  }
  
  if (hasStack(error)) {
    return String(error.stack);
  }
  
  return undefined;
}

/**
 * Converts an unknown error to a string safely
 * @param error - The unknown error from a catch block
 * @returns A string representation of the error
 */
export function errorToString(error: unknown): string {
  if (isError(error)) {
    return error.toString();
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (typeof error === 'object' && error !== null) {
    return JSON.stringify(error);
  }
  
  return String(error);
}

/**
 * Creates a comprehensive error object from an unknown error
 * Useful for logging or API responses
 */
export function formatError(error: unknown, context?: string) {
  const message = getErrorMessage(error);
  const stack = getErrorStack(error);
  
  return {
    message,
    stack,
    context,
    originalError: error,
    timestamp: new Date().toISOString(),
  };
}