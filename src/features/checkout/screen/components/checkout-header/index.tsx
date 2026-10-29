import { cashierFullName, cashierInitials, useMe } from '@features/auth';
import { AppHeader, Button, Logo, Spinner, UserBadge } from '@shared/components/ui';
import { CHECKOUT_COPY } from '../../../constants/messages';

export interface CheckoutHeaderProps {
  onLogout: () => void;
}

/** Header of the checkout: brand, signed-in cashier and "Salir" (Figma: AppHeader). */
export const CheckoutHeader = ({ onLogout }: CheckoutHeaderProps) => {
  const { data: cashier } = useMe();

  return (
    <AppHeader
      brand={<Logo />}
      context={CHECKOUT_COPY.context}
      user={
        cashier ? (
          <UserBadge
            name={cashierFullName(cashier)}
            initials={cashierInitials(cashier)}
            description={CHECKOUT_COPY.cashierRole}
          />
        ) : (
          <Spinner label="Cargando cajero…" hideLabel />
        )
      }
      actions={
        <Button variant="ghost" onClick={onLogout}>
          {CHECKOUT_COPY.logout}
        </Button>
      }
    />
  );
};

export default CheckoutHeader;
