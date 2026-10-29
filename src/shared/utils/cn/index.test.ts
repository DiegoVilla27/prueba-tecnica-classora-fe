/**
 * @fileoverview Unit tests for the `cn` class name helper.
 * Verifies conditional classes are joined and Tailwind conflicts are resolved.
 */
import { cn } from '.';

describe('Utils: cn', () => {
  it('should join conditional classes and keep the last conflicting utility', () => {
    // Arrange
    const isActive = true;

    // Act
    const result = cn('px-2 text-ink', isActive && 'px-4', { hidden: false });

    // Assert
    expect(result).toBe('text-ink px-4');
  });
});

describe('Utils: cn with the design tokens', () => {
  it('should keep a token text color next to a token font size', () => {
    // Arrange
    const classes = ['text-on-primary', 'text-body'];

    // Act
    const result = cn(...classes);

    // Assert
    expect(result).toBe('text-on-primary text-body');
  });

  it('should still resolve conflicts between token font sizes', () => {
    // Arrange
    const classes = ['text-sm', 'text-title'];

    // Act
    const result = cn(...classes);

    // Assert
    expect(result).toBe('text-title');
  });
});
