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
