/**
 * @fileoverview Unit tests for the `KeyValue` molecule.
 */
import { render, screen } from '@testing-library/react';
import { KeyValue } from '.';

describe('UI: KeyValue', () => {
  it('should pair the label with its value in a description list', () => {
    // Arrange
    const props = { label: 'Estado', value: 'En curso' };

    // Act
    render(<KeyValue {...props} />);

    // Assert
    expect(screen.getByRole('term')).toHaveTextContent('Estado');
    expect(screen.getByRole('definition')).toHaveTextContent('En curso');
  });
});
