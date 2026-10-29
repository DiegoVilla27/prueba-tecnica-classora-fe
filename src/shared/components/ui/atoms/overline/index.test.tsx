/**
 * @fileoverview Unit tests for the `Overline` atom.
 * Verifies the text and both tones.
 */
import { render, screen } from '@testing-library/react';
import { Overline } from '.';

describe('UI: Overline', () => {
  it('should render the label in both tones', () => {
    // Arrange
    const label = 'Total de la venta';

    // Act
    render(
      <>
        <Overline>{label}</Overline>
        <Overline tone="onPrimary">Puesto de caja</Overline>
      </>,
    );

    // Assert
    expect(screen.getByText(label)).toHaveClass('uppercase', 'text-ink-muted');
    expect(screen.getByText('Puesto de caja')).toHaveClass('text-on-primary');
  });
});
