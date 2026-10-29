/**
 * @fileoverview Unit tests for the `Spinner` atom.
 * Verifies the loading state is announced as a status.
 */
import { render, screen } from '@testing-library/react';
import { Spinner } from '.';

describe('UI: Spinner', () => {
  it('should announce its label as a status', () => {
    // Arrange
    const label = 'Conectando con el servidor…';

    // Act
    render(<Spinner label={label} hideLabel />);

    // Assert
    expect(screen.getByRole('status')).toHaveTextContent(label);
    expect(screen.getByText(label)).toHaveClass('sr-only');
  });
});
