/**
 * @fileoverview Unit tests for the `DataTable` pieces.
 * Verifies a semantic table with caption, column headers and row states.
 */
import { expectNoA11yViolations } from '@shared/test-utils/axe';
import { render, screen } from '@testing-library/react';
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
} from '.';

describe('UI: DataTable', () => {
  it('should render an accessible table with highlighted and selected rows', async () => {
    // Arrange
    const caption = 'Productos de la venta';

    // Act
    const { container } = render(
      <DataTable caption={caption}>
        <DataTableHead isSticky>
          <tr>
            <DataTableHeaderCell>Producto</DataTableHeaderCell>
            <DataTableHeaderCell align="right">Importe</DataTableHeaderCell>
          </tr>
        </DataTableHead>
        <DataTableBody>
          <DataTableRow isHighlighted>
            <DataTableCell>Leche entera 1L</DataTableCell>
            <DataTableCell align="right">1,90 €</DataTableCell>
          </DataTableRow>
          <DataTableRow isSelected>
            <DataTableCell>Bolsa de papel</DataTableCell>
            <DataTableCell align="right">0,30 €</DataTableCell>
          </DataTableRow>
        </DataTableBody>
      </DataTable>,
    );

    // Assert
    expect(screen.getByRole('table', { name: caption })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Importe' })).toHaveClass('text-right');
    expect(screen.getAllByRole('rowgroup')[0]).toHaveClass('sticky', 'top-0');
    const [, highlighted, selected] = screen.getAllByRole('row');
    expect(highlighted).toHaveClass('bg-primary-subtle');
    expect(selected).toHaveAttribute('aria-selected', 'true');
    await expectNoA11yViolations(container);
  });
});
