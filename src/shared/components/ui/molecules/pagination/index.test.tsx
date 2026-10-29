/**
 * @fileoverview Unit tests for the `Pagination` molecule.
 * Verifies moving between pages and the disabled edges.
 */
import { expectNoA11yViolations } from '@shared/test-utils/axe';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '.';

describe('UI: Pagination', () => {
  it('should move to the next page and disable previous on the first one', async () => {
    // Arrange
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const { container } = render(
      <Pagination page={0} totalPages={3} onPageChange={onPageChange} label="Página 1 de 3" />,
    );

    // Act
    await user.click(screen.getByRole('button', { name: 'Siguiente' }));

    // Assert
    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    expect(screen.getByRole('navigation', { name: 'Página 1 de 3' })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it('should disable next on the last page', () => {
    // Arrange
    const props = { page: 2, totalPages: 3, onPageChange: vi.fn(), label: 'Página 3 de 3' };

    // Act
    render(<Pagination {...props} />);

    // Assert
    expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Anterior' })).toBeEnabled();
  });
});
