/**
 * @fileoverview Unit tests for `useAnnouncer`.
 * Verifies messages land in a single polite live region.
 */
import { renderHook, screen, waitFor } from '@testing-library/react';
import useAnnouncer from '.';

describe('Shared: useAnnouncer', () => {
  it('should announce messages in one polite live region', async () => {
    // Arrange
    const { result } = renderHook(() => useAnnouncer());

    // Act
    result.current('Leche entera 1L añadida. Cantidad 1');
    result.current('Leche entera 1L añadida. Cantidad 2');

    // Assert
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('Leche entera 1L añadida. Cantidad 2'),
    );
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });
});
