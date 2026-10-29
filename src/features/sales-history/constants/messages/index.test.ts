/**
 * @fileoverview Unit tests for the sales history texts.
 */
import { HISTORY_TEXT, SALE_STATUS } from '.';

describe('Sales history: messages', () => {
  it('should build the page label, summaries and status labels', () => {
    // Arrange
    const iso = '2026-10-29T13:55:00Z';

    // Act
    const texts = [
      HISTORY_TEXT.pageLabel(0, 3, 42),
      HISTORY_TEXT.pageLabel(0, 0, 0),
      HISTORY_TEXT.summary(1, 1),
      HISTORY_TEXT.detailDescription('COMPLETED', 6, 4),
    ];

    // Assert
    expect(texts).toEqual([
      'Página 1 de 3 · 42 ventas',
      'Página 1 de 1 · 0 ventas',
      '1 artículo · 1 producto',
      'Finalizada · 6 artículos · 4 productos',
    ]);
    expect(HISTORY_TEXT.saleTitle(iso)).toMatch(/^Venta del 29\/10\/26, \d{2}:55$/);
    expect(HISTORY_TEXT.viewLabel(iso)).toMatch(/^Ver detalle de la venta del 29\/10\/26/);
    expect(SALE_STATUS.CANCELLED).toEqual({ label: 'Cancelada', tone: 'danger' });
  });
});
