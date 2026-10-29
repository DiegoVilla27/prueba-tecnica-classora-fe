import { AppLayout, Badge, ShortcutsBar } from '@shared/components/ui';
import { CHECKOUT_COPY } from '../constants/messages';
import CheckoutHeader from './components/checkout-header';
import ClearSaleModal from './components/clear-sale-modal';
import FinalizeSaleModal from './components/finalize-sale-modal';
import LogoutModal from './components/logout-modal';
import SaleCompleted from './components/sale-completed';
import SaleTable from './components/sale-table';
import ScanForm from './components/scan-form';
import ServerStatus from './components/server-status';
import TotalPanel from './components/total-panel';
import useCheckoutScreen from './hooks';

const SHORTCUTS = [
  { keys: ['⏎'], label: 'Añadir' },
  { keys: ['F12'], label: 'Finalizar' },
  { keys: ['Ctrl', 'Z'], label: 'Deshacer' },
  { keys: ['Esc'], label: 'Cerrar diálogo' },
];

/** Checkout screen (CU-01…CU-08): AppLayout with the scan form, the sale and the total. */
export const CheckoutScreen = () => {
  const screen = useCheckoutScreen();
  const { currentSale } = screen;
  const isUnavailable = currentSale.isLoading || currentSale.isError;

  return (
    <>
      <AppLayout
        header={<CheckoutHeader onLogout={screen.requestLogout} />}
        aside={<TotalPanel onFinalize={screen.openFinalize} onClear={screen.openClear} />}
        footer={
          <ShortcutsBar
            label={CHECKOUT_COPY.shortcutsLabel}
            shortcuts={SHORTCUTS}
            trailing={CHECKOUT_COPY.shortcutsTrailing}
          />
        }
      >
        <div className="flex items-center gap-4">
          <h1 className="text-title font-bold text-ink">{CHECKOUT_COPY.title}</h1>
          {screen.isWorking && <Badge>{CHECKOUT_COPY.statusOpen}</Badge>}
        </div>

        {isUnavailable && (
          <ServerStatus isError={currentSale.isError} onRetry={currentSale.retry} />
        )}

        {screen.isCompleted ? (
          <SaleCompleted
            total={screen.total}
            onNewSale={screen.startNext}
            isStarting={screen.isStartingNext}
          />
        ) : (
          <>
            <ScanForm disabled={!screen.isWorking} />
            <SaleTable />
          </>
        )}
      </AppLayout>

      <FinalizeSaleModal
        isOpen={screen.openModal === 'finalize'}
        onClose={screen.closeModal}
        onConfirm={screen.confirmFinalize}
        {...screen.finalizeState}
      />
      <ClearSaleModal
        isOpen={screen.openModal === 'clear'}
        onClose={screen.closeModal}
        onConfirm={screen.confirmClear}
        {...screen.clearState}
      />
      <LogoutModal
        isOpen={screen.openModal === 'logout'}
        onClose={screen.closeModal}
        onConfirm={screen.endSession}
      />
    </>
  );
};

export default CheckoutScreen;
