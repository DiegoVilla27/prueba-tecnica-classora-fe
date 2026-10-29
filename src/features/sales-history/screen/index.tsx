import { SessionHeader } from '@features/auth';
import {
  Alert,
  AppLayout,
  Button,
  Card,
  EmptyState,
  Pagination,
  Spinner,
} from '@shared/components/ui';
import { Receipt } from 'lucide-react';
import { useState } from 'react';
import { HISTORY_COPY, HISTORY_TEXT } from '../constants/messages';
import useSalesPage from '../hooks/use-sales-page';
import type { SaleSummary } from '../models/sale-record';
import SaleDetailModal from './components/sale-detail-modal';
import SalesTable from './components/sales-table';

/** Sales history (UC-S09): the cashier's sales, newest first, with the detail of each one. */
export const SalesHistoryScreen = () => {
  const [page, setPage] = useState(0);
  const [selectedSale, setSelectedSale] = useState<SaleSummary | null>(null);
  const history = useSalesPage(page);

  const content = () => {
    if (history.isPending) {
      return (
        <Card padding="lg">
          <Spinner label={HISTORY_COPY.loading} />
        </Card>
      );
    }
    if (history.isError) {
      return (
        <Card padding="lg" className="flex items-center justify-between gap-4">
          <Alert className="flex-1">{HISTORY_COPY.loadError}</Alert>
          <Button variant="secondary" onClick={() => void history.refetch()}>
            {HISTORY_COPY.retry}
          </Button>
        </Card>
      );
    }
    if (history.data.totalElements === 0) {
      return (
        <Card padding="none" className="flex flex-1 items-center justify-center">
          <EmptyState
            icon={<Receipt className="size-6" />}
            title={HISTORY_COPY.emptyTitle}
            description={HISTORY_COPY.emptyDescription}
          />
        </Card>
      );
    }
    return (
      <Card padding="none" className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto">
          <SalesTable sales={history.data.sales} onOpen={setSelectedSale} />
        </div>
        <div className="border-t border-border p-4">
          <Pagination
            page={history.data.page}
            totalPages={history.data.totalPages}
            onPageChange={setPage}
            disabled={history.isPlaceholderData}
            label={HISTORY_TEXT.pageLabel(
              history.data.page,
              history.data.totalPages,
              history.data.totalElements,
            )}
          />
        </div>
      </Card>
    );
  };

  return (
    <>
      <AppLayout header={<SessionHeader />}>
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-ink sm:text-title">{HISTORY_COPY.title}</h1>
          <p className="text-sm text-ink-muted">{HISTORY_COPY.subtitle}</p>
        </header>
        {content()}
      </AppLayout>
      <SaleDetailModal sale={selectedSale} onClose={() => setSelectedSale(null)} />
    </>
  );
};

export default SalesHistoryScreen;
