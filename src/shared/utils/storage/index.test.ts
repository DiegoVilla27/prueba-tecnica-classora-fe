/**
 * @fileoverview Unit tests for `StorageService`.
 * Verifies tokens are stored, read back and cleared from `localStorage`.
 */
import StorageService, { STORAGE_KEYS } from '.';

describe('Utils: StorageService', () => {
  beforeEach(() => localStorage.clear());

  it('should store a token and read it back', () => {
    // Arrange
    StorageService.set(STORAGE_KEYS.TOKEN, 'access-token');

    // Act
    const token = StorageService.get<string>(STORAGE_KEYS.TOKEN);

    // Assert
    expect(token).toBe('access-token');
  });

  it('should store objects as JSON', () => {
    // Arrange
    StorageService.set(STORAGE_KEYS.REFRESH, { value: 'refresh-token' });

    // Act
    const stored = StorageService.get<{ value: string }>(STORAGE_KEYS.REFRESH);

    // Assert
    expect(stored).toEqual({ value: 'refresh-token' });
  });

  it('should remove both tokens when clearing the session', () => {
    // Arrange
    StorageService.set(STORAGE_KEYS.TOKEN, 'access-token');
    StorageService.set(STORAGE_KEYS.REFRESH, 'refresh-token');

    // Act
    StorageService.clearSession();

    // Assert
    expect(StorageService.get(STORAGE_KEYS.TOKEN)).toBeNull();
    expect(StorageService.get(STORAGE_KEYS.REFRESH)).toBeNull();
  });
});
