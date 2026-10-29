/**
 * @fileoverview Unit tests for the sale services against the in-memory MSW sale.
 * Verifies the full lifecycle: open, scan, change, remove, complete and cancel.
 */
import { environment } from '@core/environments';
import { BAG, MILK } from '@features/catalog/mocks/data';
import server from '@shared/mocks/server';
import { http, HttpResponse } from 'msw';
import {
  addLineSvc,
  cancelSaleSvc,
  completeSaleSvc,
  getCurrentSaleSvc,
  openSaleSvc,
  removeLineSvc,
  updateLineSvc,
} from '.';
import { seedOpenSale } from '../mocks/data';

describe('Checkout: services', () => {
  it('should return null when there is no open sale and open a new one', async () => {
    // Arrange
    const before = await getCurrentSaleSvc();

    // Act
    const opened = await openSaleSvc();

    // Assert
    expect(before).toBeNull();
    expect(opened).toMatchObject({ status: 'OPEN', lines: [] });
    expect(await getCurrentSaleSvc()).toEqual(opened);
  });

  it('should return the existing open sale when opening a second one (409)', async () => {
    // Arrange
    const existing = seedOpenSale([[MILK.code, 1]]);

    // Act
    const opened = await openSaleSvc();

    // Assert
    expect(opened.id).toBe(existing.id);
  });

  it('should scan, change and remove lines, returning the updated sale each time', async () => {
    // Arrange
    const { id } = await openSaleSvc();

    // Act
    const scanned = await addLineSvc(id, { code: MILK.code, quantity: 2 });
    const withBag = await addLineSvc(id, { code: BAG.code, quantity: 1 });
    const changed = await updateLineSvc(id, withBag.lines[1]!.id, { quantity: 3 });
    const removed = await removeLineSvc(id, changed.lines[0]!.id);

    // Assert
    expect(scanned.lines[0]).toMatchObject({ code: MILK.code, unitPrice: 95, quantity: 2 });
    expect(changed.lines[1]).toMatchObject({ code: BAG.code, quantity: 3 });
    expect(removed.lines.map((line) => line.code)).toEqual([BAG.code]);
  });

  it('should complete a sale with lines and cancel another one', async () => {
    // Arrange
    const { id } = await openSaleSvc();
    await addLineSvc(id, { code: MILK.code, quantity: 1 });

    // Act
    const completed = await completeSaleSvc(id);
    const next = await openSaleSvc();
    await cancelSaleSvc(next.id);

    // Assert
    expect(completed.status).toBe('COMPLETED');
    expect(await getCurrentSaleSvc()).toBeNull();
  });

  it('should reject going over 999 units with a 422 ApiError', async () => {
    // Arrange
    const { id } = await openSaleSvc();
    await addLineSvc(id, { code: MILK.code, quantity: 998 });

    // Act
    const request = addLineSvc(id, { code: MILK.code, quantity: 2 });

    // Assert
    await expect(request).rejects.toMatchObject({ response: { status: 422 } });
  });

  it('should let server failures through when loading or opening the sale', async () => {
    // Arrange
    server.use(
      http.get(
        `${environment.apiUrl}/sales/current`,
        () => new HttpResponse(null, { status: 503 }),
      ),
      http.post(`${environment.apiUrl}/sales`, () => new HttpResponse(null, { status: 503 })),
    );

    // Act
    const loading = getCurrentSaleSvc();
    const opening = openSaleSvc();

    // Assert
    await expect(loading).rejects.toMatchObject({ response: { status: 503 } });
    await expect(opening).rejects.toMatchObject({ response: { status: 503 } });
  });
});
