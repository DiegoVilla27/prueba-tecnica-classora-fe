/**
 * @fileoverview Unit tests for the catalog service.
 * Verifies a known code returns the product and an unknown one a domain error.
 */
import { environment } from '@core/environments';
import server from '@shared/mocks/server';
import { http, HttpResponse } from 'msw';
import { getProductByCodeSvc } from '.';
import { ProductNotFoundError } from '../errors/product-not-found';

describe('Catalog: services', () => {
  it('should return the product of a seeded code with its price in cents', async () => {
    // Arrange
    const code = '8412345000010';

    // Act
    const product = await getProductByCodeSvc(code);

    // Assert
    expect(product).toMatchObject({ code, name: 'Leche entera 1L', unitPrice: 95 });
  });

  it('should throw ProductNotFoundError for an unknown code', async () => {
    // Arrange
    const code = '9999999999999';

    // Act
    const lookup = getProductByCodeSvc(code);

    // Assert
    await expect(lookup).rejects.toBeInstanceOf(ProductNotFoundError);
  });

  it('should let other failures through so the UI can tell them from a missing product', async () => {
    // Arrange
    server.use(http.get(`${environment.apiUrl}/products/:code`, () => HttpResponse.error()));

    // Act
    const lookup = getProductByCodeSvc('8412345000010');

    // Assert
    await expect(lookup).rejects.not.toBeInstanceOf(ProductNotFoundError);
  });
});
