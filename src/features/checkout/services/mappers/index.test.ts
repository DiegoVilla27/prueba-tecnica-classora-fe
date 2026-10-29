/**
 * @fileoverview Unit tests for the sale mapper.
 * Verifies the API sale becomes the domain sale with prices in cents.
 */
import { toSale } from '.';

describe('Checkout: mappers', () => {
  it('should map the API sale with unit prices in cents', () => {
    // Arrange
    const dto = {
      id: '79dc62c0-d640-48aa-af49-c1b806796005',
      status: 'OPEN' as const,
      cashierId: '5f8ebc23-bfd6-4b1d-85aa-ccc44236d910',
      lines: [
        {
          id: '124998b1-23e9-4270-8e30-4825e71c20f8',
          productId: '0b6e4c4e-1a2b-4c3d-8e9f-100000000001',
          code: '8412345000010',
          name: 'Leche entera 1L',
          unitPrice: 0.95,
          quantity: 2,
          subtotal: 1.9,
        },
      ],
      itemCount: 2,
      total: 1.9,
      version: 1,
      createdAt: '2026-10-29T14:55:47.487263Z',
      closedAt: null,
    };

    // Act
    const sale = toSale(dto);

    // Assert
    expect(sale).toEqual({
      id: dto.id,
      status: 'OPEN',
      version: 1,
      lines: [
        {
          id: '124998b1-23e9-4270-8e30-4825e71c20f8',
          productId: '0b6e4c4e-1a2b-4c3d-8e9f-100000000001',
          code: '8412345000010',
          name: 'Leche entera 1L',
          unitPrice: 95,
          quantity: 2,
        },
      ],
    });
  });
});
