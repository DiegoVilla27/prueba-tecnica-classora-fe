/**
 * @fileoverview Unit tests for the `Kbd` atom.
 */
import { render, screen } from '@testing-library/react';
import { Kbd } from '.';

describe('UI: Kbd', () => {
  it('should render a keyboard key in both tones', () => {
    // Arrange
    const keys = ['F12', 'Esc'];

    // Act
    render(
      <>
        <Kbd>{keys[0]}</Kbd>
        <Kbd tone="plain">{keys[1]}</Kbd>
      </>,
    );

    // Assert
    expect(screen.getByText('F12').tagName).toBe('KBD');
    expect(screen.getByText('F12')).toHaveClass('border');
    expect(screen.getByText('Esc')).not.toHaveClass('border');
  });
});
