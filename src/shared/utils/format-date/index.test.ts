/**
 * @fileoverview Unit tests for `formatDateTime`.
 */
import { formatDateTime } from '.';

describe('Utils: formatDateTime', () => {
  it('should format an ISO timestamp as Spanish short date and time', () => {
    // Arrange
    const iso = '2026-10-29T13:55:00Z';

    // Act
    const text = formatDateTime(iso);

    // Assert
    expect(text).toMatch(/^29\/10\/26, \d{2}:55$/);
  });
});
