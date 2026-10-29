/**
 * @fileoverview Unit tests for `useMe`.
 * Verifies the signed-in cashier is loaded.
 */
import interceptorJwtAuth from '@core/interceptors/jwt';
import { createTestWrapper } from '@shared/test-utils/render';
import StorageService, { STORAGE_KEYS } from '@shared/utils/storage';
import { renderHook, waitFor } from '@testing-library/react';
import useMe from '.';
import { MOCK_TOKENS } from '../../mocks/data';

describe('Auth: useMe', () => {
  it('should load the signed-in cashier', async () => {
    // Arrange
    const eject = interceptorJwtAuth();
    StorageService.set(STORAGE_KEYS.TOKEN, MOCK_TOKENS.access);
    const { Wrapper } = createTestWrapper();

    // Act
    const { result } = renderHook(() => useMe(), { wrapper: Wrapper });

    // Assert
    await waitFor(() => expect(result.current.data?.firstName).toBe('Ana'));
    eject();
  });
});
