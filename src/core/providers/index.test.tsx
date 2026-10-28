/**
 * @fileoverview Unit tests for `AppProviders`.
 * Verifies children render with access to the query client.
 */
import { useQueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { AppProviders, createQueryClient } from '.';

const QueryClientProbe = () => {
  const client = useQueryClient();
  return <p>{client ? 'query client ready' : 'missing'}</p>;
};

describe('Core: AppProviders', () => {
  it('should render children with a query client available', () => {
    // Arrange
    const queryClient = createQueryClient();

    // Act
    render(
      <AppProviders queryClient={queryClient}>
        <QueryClientProbe />
      </AppProviders>,
    );

    // Assert
    expect(screen.getByText('query client ready')).toBeInTheDocument();
  });

  it('should not retry mutations by default', () => {
    // Arrange
    const queryClient = createQueryClient();

    // Act
    const { mutations, queries } = queryClient.getDefaultOptions();

    // Assert
    expect(mutations?.retry).toBe(false);
    expect(queries?.retry).toBe(1);
  });
});
