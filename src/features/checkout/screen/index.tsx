import { cashierFullName, cashierInitials, useLogout, useMe } from '@features/auth';
import {
  AppHeader,
  AppLayout,
  Badge,
  Button,
  Card,
  EmptyState,
  Kbd,
  KeyValue,
  Logo,
  Money,
  Overline,
  ShortcutsBar,
  Spinner,
  UserBadge,
} from '@shared/components/ui';
import { ScanBarcode } from 'lucide-react';

const SHORTCUTS = [
  { keys: ['⏎'], label: 'Añadir' },
  { keys: ['F12'], label: 'Finalizar' },
  { keys: ['Ctrl', 'Z'], label: 'Deshacer' },
  { keys: ['Esc'], label: 'Cerrar diálogo' },
];

/**
 * Checkout screen.
 *
 * @remarks
 * Provisional until hito 5: the layout already uses the design system (header with the
 * signed-in cashier, 70/30 areas, shortcuts bar); the scan form, the sale table and the
 * actions are wired in hito 5.
 */
export const CheckoutScreen = () => {
  const { data: cashier } = useMe();
  const logout = useLogout();

  return (
    <AppLayout
      header={
        <AppHeader
          brand={<Logo />}
          context="Puesto de caja"
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
            <Button variant="ghost" onClick={logout}>
              Salir
            </Button>
          }
        />
      }
      aside={
        <Card
          as="section"
          padding="lg"
          aria-labelledby="total-title"
          className="flex flex-col gap-6"
        >
          <Overline id="total-title">Total de la venta</Overline>
          <Money cents={0} size="total" />
          <KeyValue label="Estado" value="En curso" />
          <Button size="lg" disabled endSlot={<Kbd tone="onPrimary">F12</Kbd>}>
            Finalizar venta
          </Button>
        </Card>
      }
      footer={
        <ShortcutsBar
          label="Atajos de teclado"
          shortcuts={SHORTCUTS}
          trailing="Importes en euros"
        />
      }
    >
      <div className="flex items-center gap-4">
        <h1 className="text-title font-bold text-ink">Venta en curso</h1>
        <Badge>Abierta</Badge>
      </div>
      <Card padding="none">
        <EmptyState
          icon={<ScanBarcode className="size-6" />}
          title="Escanea un producto para empezar"
          description="El escáner y el teclado se conectan en el hito 5."
        />
      </Card>
    </AppLayout>
  );
};

export default CheckoutScreen;
