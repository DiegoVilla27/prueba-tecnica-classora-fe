/**
 * @fileoverview Unit tests for the catalog mapper.
 * Verifies the price becomes cents.
 */
import { toProduct } from '.';

describe('Catalog: mappers', () => {
  it('should map the API product with the price in cents', () => {
    // Arrange
    const dto = {
      id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000001',
      code: '8412345000010',
      name: 'Leche entera 1L',
      price: 0.95,
    };

    // Act
    const product = toProduct(dto);

    // Assert
    expect(product).toEqual({ id: dto.id, code: dto.code, name: dto.name, unitPrice: 95 });
  });
});
