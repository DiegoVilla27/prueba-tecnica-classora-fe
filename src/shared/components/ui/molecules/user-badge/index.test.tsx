/**
 * @fileoverview Unit tests for the `UserBadge` molecule.
 */
import { render, screen } from '@testing-library/react';
import { UserBadge } from '.';

describe('UI: UserBadge', () => {
  it('should show the name and the role next to the initials', () => {
    // Arrange
    const props = { name: 'Ana López', initials: 'AL', description: 'Sesión de cajero' };

    // Act
    render(<UserBadge {...props} />);

    // Assert
    expect(screen.getByText('Ana López')).toBeInTheDocument();
    expect(screen.getByText('Sesión de cajero')).toBeInTheDocument();
    expect(screen.getByText('AL')).toHaveAttribute('aria-hidden', 'true');
  });
});
