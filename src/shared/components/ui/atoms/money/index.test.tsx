/**
 * @fileoverview Unit tests for the `Money` atom.
 */
import { render, screen } from '@testing-library/react';
import { Money } from '.';

describe('UI: Money', () => {
  it('should format cents with tabular figures and the total size', () => {
    // Arrange
    const cents = 1494;

    // Act
    render(<Money cents={cents} size="total" />);

    // Assert
    const amount = screen.getByText(/14,94/);
    expect(amount).toHaveTextContent('14,94 €');
    expect(amount).toHaveClass('tabular-nums', 'text-total');
  });
});
