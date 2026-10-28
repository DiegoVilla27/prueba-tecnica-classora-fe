/**
 * @fileoverview Unit tests for `httpService`.
 * Verifies each verb reaches the API and returns the unpacked response body.
 */
import { environment } from '@core/environments';
import server from '@shared/mocks/server';
import { http, HttpResponse } from 'msw';
import { httpService } from '.';

const api = (path: string) => `${environment.apiUrl}${path}`;

describe('Core: httpService', () => {
  it('should return the body of a GET request', async () => {
    // Arrange
    server.use(http.get(api('/ping'), () => HttpResponse.json({ ok: true })));

    // Act
    const body = await httpService.get<{ ok: boolean }>('/ping');

    // Assert
    expect(body).toEqual({ ok: true });
  });

  it('should send the payload of POST and PATCH requests', async () => {
    // Arrange
    server.use(
      http.post(api('/echo'), async ({ request }) => HttpResponse.json(await request.json())),
      http.patch(api('/echo'), async ({ request }) => HttpResponse.json(await request.json())),
    );

    // Act
    const created = await httpService.post<{ quantity: number }>('/echo', { quantity: 1 });
    const updated = await httpService.patch<{ quantity: number }>('/echo', { quantity: 2 });

    // Assert
    expect(created).toEqual({ quantity: 1 });
    expect(updated).toEqual({ quantity: 2 });
  });

  it('should resolve a DELETE request', async () => {
    // Arrange
    server.use(http.delete(api('/lines/1'), () => HttpResponse.json({ removed: true })));

    // Act
    const body = await httpService.delete<{ removed: boolean }>('/lines/1');

    // Assert
    expect(body).toEqual({ removed: true });
  });
});
