/**
 * @fileoverview Unit tests for the `Logo` atom.
 * Verifies the brand name is readable and the mark is decorative.
 */
import { render, screen } from '@testing-library/react';
import { Logo } from '.';

describe('UI: Logo', () => {
  it('should show the brand name with a decorative mark', () => {
    // Arrange
    const tone = 'onPrimary';

    // Act
    const { container } = render(<Logo tone={tone} />);

    // Assert
    expect(screen.getByText('classora / TPV')).toHaveClass('text-on-primary');
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('c');
  });
});
