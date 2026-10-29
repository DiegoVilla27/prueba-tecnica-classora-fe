/**
 * @fileoverview Unit tests for the auth services.
 * Verifies login stores the session, /users/me returns the cashier and logout clears it.
 */
import interceptorJwtAuth from '@core/interceptors/jwt';
import StorageService, { STORAGE_KEYS } from '@shared/utils/storage';
import { getMeSvc, loginSvc, logoutSvc } from '.';
import { DEMO_CREDENTIALS, MOCK_TOKENS } from '../mocks/data';

describe('Auth: services', () => {
  it('should store both tokens after a successful login', async () => {
    // Arrange
    const credentials = { ...DEMO_CREDENTIALS };

    // Act
    await loginSvc(credentials);

    // Assert
    expect(StorageService.get(STORAGE_KEYS.TOKEN)).toBe(MOCK_TOKENS.access);
    expect(StorageService.get(STORAGE_KEYS.REFRESH)).toBe(MOCK_TOKENS.refresh);
  });

  it('should return the signed-in cashier', async () => {
    // Arrange
    const eject = interceptorJwtAuth();
    StorageService.set(STORAGE_KEYS.TOKEN, MOCK_TOKENS.access);

    // Act
    const cashier = await getMeSvc();

    // Assert
    expect(cashier).toEqual({
      id: '5f8ebc23-bfd6-4b1d-85aa-ccc44236d910',
      firstName: 'Ana',
      lastName: 'López',
      email: 'cajero@pos.local',
    });
    eject();
  });

  it('should clear the session on logout', () => {
    // Arrange
    StorageService.set(STORAGE_KEYS.TOKEN, MOCK_TOKENS.access);
    StorageService.set(STORAGE_KEYS.REFRESH, MOCK_TOKENS.refresh);

    // Act
    logoutSvc();

    // Assert
    expect(StorageService.get(STORAGE_KEYS.TOKEN)).toBeNull();
    expect(StorageService.get(STORAGE_KEYS.REFRESH)).toBeNull();
  });
});
