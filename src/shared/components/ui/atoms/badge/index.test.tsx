/**
 * @fileoverview Unit tests for the `Badge` atom.
 */
import { render, screen } from '@testing-library/react';
import { Badge } from '.';

describe('UI: Badge', () => {
  it('should render the status label', () => {
    // Arrange
    const label = 'Abierta';

    // Act
    render(<Badge>{label}</Badge>);

    // Assert
    expect(screen.getByText(label)).toHaveClass('border-border', 'text-xs');
  });
});
