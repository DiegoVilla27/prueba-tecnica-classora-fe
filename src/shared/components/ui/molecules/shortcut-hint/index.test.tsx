/**
 * @fileoverview Unit tests for the `ShortcutHint` molecule.
 */
import { render, screen } from '@testing-library/react';
import { ShortcutHint } from '.';

describe('UI: ShortcutHint', () => {
  it('should show each key and the action', () => {
    // Arrange
    const props = { keys: ['Ctrl', 'Z'], label: 'Deshacer' };

    // Act
    const { container } = render(<ShortcutHint {...props} />);

    // Assert
    expect(container.querySelectorAll('kbd')).toHaveLength(2);
    expect(screen.getByText('Deshacer')).toBeInTheDocument();
  });
});
