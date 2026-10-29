/**
 * @fileoverview Unit tests for the `EmptyState` molecule.
 */
import { render, screen } from '@testing-library/react';
import { EmptyState } from '.';

describe('UI: EmptyState', () => {
  it('should render the title, the description and the action', () => {
    // Arrange
    const action = <button type="button">Nueva venta</button>;

    // Act
    render(
      <EmptyState
        title="Escanea un producto para empezar"
        description="El primer producto aparecerá aquí."
        action={action}
      />,
    );

    // Assert
    expect(screen.getByText('Escanea un producto para empezar')).toBeInTheDocument();
    expect(screen.getByText('El primer producto aparecerá aquí.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Nueva venta' })).toBeInTheDocument();
  });
});
