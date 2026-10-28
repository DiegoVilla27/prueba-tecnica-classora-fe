/** Keys of the values the app keeps in `localStorage` (same as task-manager). */
export const STORAGE_KEYS = {
  TOKEN: 'TOKEN',
  REFRESH: 'REFRESH',
} as const;

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

/**
 * Thin wrapper over `localStorage` for the session tokens.
 *
 * @remarks
 * Strings are stored as they are and anything else as JSON. Access errors (private mode,
 * quota) are swallowed: the app then behaves as if there were no session.
 */
class StorageService {
  /**
   * Reads a value.
   *
   * @typeParam T - Expected type of the stored value.
   * @param key - Storage key.
   * @returns The value, or `null` if it is missing or cannot be read.
   */
  static get<T>(key: StorageKey): T | null {
    try {
      const value = localStorage.getItem(key);
      if (value === null) return null;

      try {
        return JSON.parse(value) as T;
      } catch {
        return value as T;
      }
    } catch {
      return null;
    }
  }

  /**
   * Stores a value.
   *
   * @param key - Storage key.
   * @param value - Value to store; non-strings are serialized as JSON.
   */
  static set<T>(key: StorageKey, value: T): void {
    try {
      localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch {
      // Storage unavailable: the session simply is not persisted.
    }
  }

  /**
   * Removes a value.
   *
   * @param key - Storage key.
   */
  static remove(key: StorageKey): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Nothing to remove if storage is unavailable.
    }
  }

  /** Removes the whole session (access and refresh tokens). */
  static clearSession(): void {
    StorageService.remove(STORAGE_KEYS.TOKEN);
    StorageService.remove(STORAGE_KEYS.REFRESH);
  }
}

export default StorageService;
