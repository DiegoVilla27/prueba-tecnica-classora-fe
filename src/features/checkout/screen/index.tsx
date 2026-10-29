import { cashierFullName, useLogout, useMe } from '@features/auth';
import { Button, Logo, Spinner } from '@shared/components/ui';

/**
 * Checkout screen.
 *
 * @remarks
 * Provisional until hito 5 (AppLayout, scan form, sale table, total panel). It already shows the
 * signed-in cashier and lets them log out, so the whole session flow works end to end.
 */
export const CheckoutScreen = () => {
  const { data: cashier } = useMe();
  const logout = useLogout();

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <header className="flex items-center justify-between bg-surface px-6 py-4">
        <Logo />
        <div className="flex items-center gap-4">
          {cashier ? (
            <p className="text-sm font-semibold text-ink">{cashierFullName(cashier)}</p>
          ) : (
            <Spinner label="Cargando cajero…" hideLabel />
          )}
          <Button variant="ghost" onClick={logout}>
            Salir
          </Button>
        </div>
      </header>
      <main className="grid flex-1 place-items-center p-6">
        <h1 className="text-title font-bold text-ink">Venta en curso</h1>
      </main>
    </div>
  );
};

export default CheckoutScreen;
