/**
 * @fileoverview Unit tests for the JWT interceptor.
 * Verifies the Bearer header, the single silent refresh and the expired session.
 */
import axiosInstance from '@core/axios';
import { environment } from '@core/environments';
import server from '@shared/mocks/server';
import StorageService, { STORAGE_KEYS } from '@shared/utils/storage';
import { http, HttpResponse } from 'msw';
import interceptorJwtAuth from '.';

const api = (path: string) => `${environment.apiUrl}${path}`;

/** `/users/me` answers 200 only with the given token, 401 otherwise. */
const meAcceptingOnly = (validToken: string) =>
  http.get(api('/users/me'), ({ request }) =>
    request.headers.get('Authorization') === `Bearer ${validToken}`
      ? HttpResponse.json({ firstName: 'Ana' })
      : new HttpResponse(null, { status: 401 }),
  );

describe('Core: interceptorJwtAuth', () => {
  const onSessionExpired = vi.fn();
  let eject: () => void;

  beforeEach(() => {
    onSessionExpired.mockClear();
    eject = interceptorJwtAuth({ onSessionExpired });
  });
  afterEach(() => eject());

  it('should send the stored access token as a Bearer header', async () => {
    // Arrange
    StorageService.set(STORAGE_KEYS.TOKEN, 'valid-access');
    server.use(meAcceptingOnly('valid-access'));

    // Act
    const { data } = await axiosInstance.get('/users/me');

    // Assert
    expect(data).toEqual({ firstName: 'Ana' });
  });

  it('should refresh once for concurrent 401s and retry them with the new token', async () => {
    // Arrange
    let refreshCalls = 0;
    StorageService.set(STORAGE_KEYS.TOKEN, 'expired-access');
    StorageService.set(STORAGE_KEYS.REFRESH, 'valid-refresh');
    server.use(
      meAcceptingOnly('new-access'),
      http.post(api('/auth/refresh'), () => {
        refreshCalls += 1;
        return HttpResponse.json({ accessToken: 'new-access', refreshToken: 'new-refresh' });
      }),
    );

    // Act
    const responses = await Promise.all([
      axiosInstance.get('/users/me'),
      axiosInstance.get('/users/me'),
    ]);

    // Assert
    expect(responses.map((response) => response.status)).toEqual([200, 200]);
    expect(refreshCalls).toBe(1);
    expect(StorageService.get(STORAGE_KEYS.TOKEN)).toBe('new-access');
    expect(StorageService.get(STORAGE_KEYS.REFRESH)).toBe('new-refresh');
  });

  it('should clear the session and notify when the refresh fails', async () => {
    // Arrange
    StorageService.set(STORAGE_KEYS.TOKEN, 'expired-access');
    StorageService.set(STORAGE_KEYS.REFRESH, 'expired-refresh');
    server.use(
      meAcceptingOnly('never'),
      http.post(api('/auth/refresh'), () => new HttpResponse(null, { status: 401 })),
    );

    // Act
    const request = axiosInstance.get('/users/me');

    // Assert
    await expect(request).rejects.toMatchObject({ response: { status: 401 } });
    expect(onSessionExpired).toHaveBeenCalledOnce();
    expect(StorageService.get(STORAGE_KEYS.TOKEN)).toBeNull();
  });

  it('should not refresh when the login itself returns 401', async () => {
    // Arrange
    server.use(http.post(api('/auth/login'), () => new HttpResponse(null, { status: 401 })));

    // Act
    const request = axiosInstance.post('/auth/login', { email: 'a@b.c', password: 'x' });

    // Assert
    await expect(request).rejects.toMatchObject({ response: { status: 401 } });
    expect(onSessionExpired).not.toHaveBeenCalled();
  });
});
