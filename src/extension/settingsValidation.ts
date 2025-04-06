
/**
 * Validation functions for settings
 */

/**
 * Validate URL format
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
