/**
 * @fileoverview Unit tests for the checkout texts built from data.
 * Verifies plurals and amounts read naturally in Spanish.
 */
import { CHECKOUT_MESSAGES, CHECKOUT_TEXT } from '.';

describe('Checkout: messages', () => {
  it('should pluralise the summary and the clear warning', () => {
    // Arrange
    const counts = [
      [1, 1],
      [6, 4],
    ] as const;

    // Act
    const summaries = counts.map(([items, lines]) => CHECKOUT_TEXT.summary(items, lines));

    // Assert
    expect(summaries).toEqual(['1 artículo · 1 producto', '6 artículos · 4 productos']);
    expect(CHECKOUT_TEXT.clearDescription(1)).toMatch(/^Se eliminará el artículo de esta venta/);
    expect(CHECKOUT_TEXT.clearDescription(6)).toMatch(/^Se eliminarán los 6 artículos/);
    expect(CHECKOUT_TEXT.finalizeDescription(6, 4)).toBe(
      '6 artículos · 4 productos. Comprueba el total antes de confirmar.',
    );
  });

  it('should build the per-product texts and the completed amount', () => {
    // Arrange
    const name = 'Leche entera 1L';

    // Act
    const texts = [
      CHECKOUT_TEXT.removed(name),
      CHECKOUT_TEXT.added(name, 2),
      CHECKOUT_TEXT.quantityChanged(name, 3),
      CHECKOUT_TEXT.quantityLabel(name),
      CHECKOUT_TEXT.decreaseLabel(name),
      CHECKOUT_TEXT.increaseLabel(name),
      CHECKOUT_TEXT.removeLabel(name),
      CHECKOUT_MESSAGES.unknownCode('0000'),
      CHECKOUT_MESSAGES.addFailed(name),
      CHECKOUT_TEXT.completed(1494).replace(/ /g, ' '),
    ];

    // Assert
    expect(texts).toEqual([
      'Leche entera 1L eliminado',
      'Leche entera 1L añadido. Cantidad 2',
      'Leche entera 1L, cantidad 3',
      'Cantidad de Leche entera 1L',
      'Reducir cantidad de Leche entera 1L',
      'Aumentar cantidad de Leche entera 1L',
      'Eliminar Leche entera 1L',
      'No existe ningún producto con el código 0000. Revisa el código.',
      'No se pudo añadir Leche entera 1L. Vuelve a escanearlo.',
      'Venta finalizada · 14,94 €',
    ]);
  });
});
