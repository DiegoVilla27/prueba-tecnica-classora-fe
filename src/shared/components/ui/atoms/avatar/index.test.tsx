/**
 * @fileoverview Unit tests for the `Avatar` atom.
 */
import { render } from '@testing-library/react';
import { Avatar } from '.';

describe('UI: Avatar', () => {
  it('should show the initials as decoration', () => {
    // Arrange
    const initials = 'AL';

    // Act
    const { container } = render(<Avatar initials={initials} />);

    // Assert
    expect(container.firstChild).toHaveTextContent(initials);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});
