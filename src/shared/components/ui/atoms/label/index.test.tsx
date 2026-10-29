/**
 * @fileoverview Unit tests for the `Label` atom.
 * Verifies it names its control.
 */
import { render, screen } from '@testing-library/react';
import { Label } from '.';

describe('UI: Label', () => {
  it('should give its control an accessible name', () => {
    // Arrange
    const id = 'email';

    // Act
    render(
      <>
        <Label htmlFor={id}>Email</Label>
        <input id={id} />
      </>,
    );

    // Assert
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
  });
});
