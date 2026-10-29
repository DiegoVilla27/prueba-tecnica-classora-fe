/**
 * @fileoverview Unit tests for the `ShortcutsBar` organism.
 */
import { render, screen } from '@testing-library/react';
import { ShortcutsBar } from '.';

describe('UI: ShortcutsBar', () => {
  it('should list every shortcut in a named list', () => {
    // Arrange
    const shortcuts = [
      { keys: ['⏎'], label: 'Añadir' },
      { keys: ['F12'], label: 'Finalizar' },
    ];

    // Act
    render(
      <ShortcutsBar label="Atajos de teclado" shortcuts={shortcuts} trailing="Importes en euros" />,
    );

    // Assert
    expect(screen.getByRole('list', { name: 'Atajos de teclado' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Importes en euros')).toBeInTheDocument();
  });
});
