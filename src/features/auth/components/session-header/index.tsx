import { APP_NAV } from '@core/router/nav';
import { AppHeader, Button, Logo, Spinner, UserBadge } from '@shared/components/ui';
import { cn } from '@shared/utils/cn';
import { NavLink } from 'react-router';
import useLogout from '../../hooks/use-logout';
import useMe from '../../hooks/use-me';
import { cashierFullName, cashierInitials } from '../../models/cashier';

export interface SessionHeaderProps {
  /**
   * What "Salir" does. Defaults to logging out at once; the checkout passes its own handler to
   * confirm first when the sale has products (CU-07).
   */
  onLogout?: () => void;
}

const tabClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'block min-h-target rounded-control px-3 py-2.5 text-sm font-semibold motion-safe:transition-colors md:min-h-0 md:py-2',
    'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus',
    isActive ? 'bg-primary-subtle text-primary' : 'text-ink-muted hover:bg-canvas hover:text-ink',
  );

/** Header of every signed-in screen: brand, sections (Caja · Ventas), cashier and "Salir". */
export const SessionHeader = ({ onLogout }: SessionHeaderProps) => {
  const { data: cashier } = useMe();
  const logout = useLogout();

  return (
    <AppHeader
      brand={<Logo />}
      context="Puesto de caja"
      nav={
        <nav aria-label="Secciones">
          <ul className="flex gap-1">
            {APP_NAV.map(({ to, label }) => (
              // Equal-width tabs on their own row on phones; compact next to the brand from md.
              <li key={to} className="flex-1 text-center md:flex-none">
                <NavLink to={to} end className={tabClass}>
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      }
      user={
        cashier ? (
          <UserBadge
            name={cashierFullName(cashier)}
            initials={cashierInitials(cashier)}
            description="Sesión de cajero"
          />
        ) : (
          <Spinner label="Cargando cajero…" hideLabel />
        )
      }
      actions={
        <Button variant="ghost" onClick={onLogout ?? logout}>
          Salir
        </Button>
      }
    />
  );
};

export default SessionHeader;
