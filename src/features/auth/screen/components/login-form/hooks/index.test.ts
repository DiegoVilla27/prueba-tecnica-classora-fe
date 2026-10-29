/**
 * @fileoverview Unit tests for `useLoginForm` and its error mapping.
 * Verifies a valid submit signs in and API errors become cashier-friendly messages.
 */
import { ApiError } from '@core/errors/api-error';
import { createTestWrapper } from '@shared/test-utils/render';
import StorageService, { STORAGE_KEYS } from '@shared/utils/storage';
import { act, renderHook, waitFor } from '@testing-library/react';
import useLoginForm, { toLoginErrorMessage } from '.';
import { DEMO_CREDENTIALS, MOCK_TOKENS } from '../../../../mocks/data';

describe('Auth: useLoginForm', () => {
  it('should sign in with valid credentials', async () => {
    // Arrange
    const { Wrapper } = createTestWrapper('/login');
    const { result } = renderHook(() => useLoginForm(), { wrapper: Wrapper });
    const email = result.current.register('email');
    const password = result.current.register('password');

    // Act
    await act(async () => {
      await email.onChange({ target: { name: 'email', value: DEMO_CREDENTIALS.email } });
      await password.onChange({ target: { name: 'password', value: DEMO_CREDENTIALS.password } });
      await result.current.submit();
    });

    // Assert
    await waitFor(() => expect(StorageService.get(STORAGE_KEYS.TOKEN)).toBe(MOCK_TOKENS.access));
    expect(result.current.serverError).toBeNull();
  });

  it('should flag an expired session from the URL', () => {
    // Arrange
    const { Wrapper } = createTestWrapper('/login?expired=1');

    // Act
    const { result } = renderHook(() => useLoginForm(), { wrapper: Wrapper });

    // Assert
    expect(result.current.isSessionExpired).toBe(true);
  });

  it('should map each API failure to its message', () => {
    // Arrange
    const errors = [401, 429, 500, null, 400].map((status) => new ApiError('x', status));

    // Act
    const messages = errors.map(toLoginErrorMessage);

    // Assert
    expect(messages).toEqual([
      'Email o contraseña incorrectos.',
      'Demasiados intentos. Espera un minuto y vuelve a probar.',
      expect.stringContaining('No se pudo conectar con el servidor.'),
      expect.stringContaining('No se pudo conectar con el servidor.'),
      'No se pudo iniciar sesión. Vuelve a intentarlo.',
    ]);
  });
});
