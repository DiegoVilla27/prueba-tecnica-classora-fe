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

  it('should colour the status tones', () => {
    // Arrange
    const labels = ['Finalizada', 'Cancelada'];

    // Act
    render(
      <>
        <Badge tone="success">{labels[0]}</Badge>
        <Badge tone="danger">{labels[1]}</Badge>
      </>,
    );

    // Assert
    expect(screen.getByText('Finalizada')).toHaveClass('text-primary');
    expect(screen.getByText('Cancelada')).toHaveClass('text-danger');
  });
});
