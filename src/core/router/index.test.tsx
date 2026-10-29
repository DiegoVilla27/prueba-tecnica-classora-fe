/**
 * @fileoverview Unit tests for `AppRoutes`.
 */
import { AppProviders } from '@core/providers';
import { render, screen } from '@testing-library/react';
import AppRoutes from '.';

describe('Core: AppRoutes', () => {
  it('should render the router and land an anonymous visit on the login', async () => {
    // Arrange
    window.history.pushState({}, '', '/');

    // Act
    render(
      <AppProviders>
        <AppRoutes />
      </AppProviders>,
    );

    // Assert
    expect(await screen.findByRole('heading', { name: 'Entra en tu caja' })).toBeInTheDocument();
  });
});
