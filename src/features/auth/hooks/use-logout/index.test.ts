/**
 * @fileoverview Unit tests for `useLogout`.
 * Verifies the session and the query cache are cleared.
 */
import { createTestWrapper } from '@shared/test-utils/render';
import StorageService, { STORAGE_KEYS } from '@shared/utils/storage';
import { act, renderHook } from '@testing-library/react';
import useLogout from '.';

describe('Auth: useLogout', () => {
  it('should clear the tokens and the cached queries', () => {
    // Arrange
    StorageService.set(STORAGE_KEYS.TOKEN, 'access-token');
    const { Wrapper, queryClient } = createTestWrapper();
    queryClient.setQueryData(['me'], { firstName: 'Ana' });
    const { result } = renderHook(() => useLogout(), { wrapper: Wrapper });

    // Act
    act(() => result.current());

    // Assert
    expect(StorageService.get(STORAGE_KEYS.TOKEN)).toBeNull();
    expect(queryClient.getQueryData(['me'])).toBeUndefined();
  });
});
