/**
 * @fileoverview Unit tests for the `AppHeader` organism.
 */
import { render, screen } from '@testing-library/react';
import { AppHeader } from '.';

describe('UI: AppHeader', () => {
  it('should place brand, context, user and actions in a banner', () => {
    // Arrange
    const actions = <button type="button">Salir</button>;

    // Act
    render(
      <AppHeader
        brand={<p>classora / TPV</p>}
        context="Puesto de caja"
        user={<p>Ana López</p>}
        actions={actions}
      />,
    );

    // Assert
    const banner = screen.getByRole('banner');
    expect(banner).toHaveTextContent('classora / TPV');
    expect(banner).toHaveTextContent('Puesto de caja');
    expect(banner).toHaveTextContent('Ana López');
    expect(screen.getByRole('button', { name: 'Salir' })).toBeInTheDocument();
  });
});
