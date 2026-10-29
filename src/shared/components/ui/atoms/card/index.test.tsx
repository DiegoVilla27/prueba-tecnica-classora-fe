/**
 * @fileoverview Unit tests for the `Card` atom.
 */
import { render, screen } from '@testing-library/react';
import { Card } from '.';

describe('UI: Card', () => {
  it('should wrap content in a bordered surface with the chosen padding', () => {
    // Arrange
    const padding = 'none';

    // Act
    render(
      <Card as="section" padding={padding} aria-label="Productos de la venta">
        contenido
      </Card>,
    );

    // Assert
    const card = screen.getByRole('region', { name: 'Productos de la venta' });
    expect(card).toHaveClass('rounded-card', 'border-border', 'bg-surface');
    expect(card).not.toHaveClass('p-5');
  });
});
