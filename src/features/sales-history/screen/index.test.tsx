/**
 * @fileoverview Unit tests for `SalesHistoryScreen`.
 */
import { createTestWrapper } from '@shared/test-utils/render';
import { render, screen } from '@testing-library/react';
import SalesHistoryScreen from '.';

describe('Sales history: Screen', () => {
  it('should show the empty state when the cashier has no sales', async () => {
    // Arrange
    const { Wrapper } = createTestWrapper('/ventas');

    // Act
    render(<SalesHistoryScreen />, { wrapper: Wrapper });

    // Assert
    expect(screen.getByRole('heading', { level: 1, name: 'Ventas' })).toBeInTheDocument();
    expect(await screen.findByText('Todavía no hay ventas')).toBeInTheDocument();
  });
});
