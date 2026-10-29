/**
 * @fileoverview Unit tests for `SessionHeader`.
 * Verifies the sections, the active tab and the logout handler.
 */
import { expectNoA11yViolations } from '@shared/test-utils/axe';
import { createTestWrapper } from '@shared/test-utils/render';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SessionHeader from '.';

describe('Auth: SessionHeader', () => {
  it('should mark the current section and call the logout handler', async () => {
    // Arrange
    const user = userEvent.setup();
    const onLogout = vi.fn();
    const { Wrapper } = createTestWrapper('/ventas');
    const { container } = render(<SessionHeader onLogout={onLogout} />, { wrapper: Wrapper });

    // Act
    await user.click(screen.getByRole('button', { name: 'Salir' }));

    // Assert
    const sections = screen.getByRole('navigation', { name: 'Secciones' });
    expect(sections).toContainElement(screen.getByRole('link', { name: 'Caja' }));
    expect(screen.getByRole('link', { name: 'Ventas' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Caja' })).not.toHaveAttribute('aria-current');
    expect(onLogout).toHaveBeenCalledOnce();
    await expectNoA11yViolations(container);
  });
});
