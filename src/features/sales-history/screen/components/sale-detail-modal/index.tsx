import {
  Alert,
  Button,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
  Modal,
  Money,
  Spinner,
} from '@shared/components/ui';
import { HISTORY_COPY, HISTORY_TEXT } from '../../../constants/messages';
import useSaleDetail from '../../../hooks/use-sale-detail';
import type { SaleSummary } from '../../../models/sale-record';

export interface SaleDetailModalProps {
  /** Sale whose detail is shown; `null` closes the modal. */
  sale: SaleSummary | null;
  onClose: () => void;
}

/** Lines, quantities and amounts of a past sale (read-only). */
export const SaleDetailModal = ({ sale, onClose }: SaleDetailModalProps) => {
  const detail = useSaleDetail(sale?.id ?? null);

  return (
    <Modal
      isOpen={sale !== null}
      onClose={onClose}
      size="lg"
      overline={HISTORY_COPY.detailOverline}
      title={sale ? HISTORY_TEXT.saleTitle(sale.createdAt) : HISTORY_COPY.detailOverline}
      description={
        sale ? HISTORY_TEXT.detailDescription(sale.status, sale.itemCount, sale.lineCount) : null
      }
      actions={
        <Button
          variant="secondary"
          size="lg"
          className="col-span-2"
          data-autofocus
          onClick={onClose}
        >
          {HISTORY_COPY.close}
        </Button>
      }
    >
      {detail.isPending && <Spinner label={HISTORY_COPY.detailLoading} />}
      {detail.isError && <Alert>{HISTORY_COPY.detailError}</Alert>}
      {detail.data &&
        (detail.data.lines.length === 0 ? (
          <p className="text-body text-ink-muted">{HISTORY_COPY.detailEmpty}</p>
        ) : (
          <div className="max-h-80 overflow-y-auto rounded-card border border-border">
            <DataTable caption={HISTORY_TEXT.saleTitle(detail.data.createdAt)}>
              <DataTableHead isSticky>
                <tr>
                  <DataTableHeaderCell>{HISTORY_COPY.columnProduct}</DataTableHeaderCell>
                  <DataTableHeaderCell align="right" className="hidden sm:table-cell">
                    {HISTORY_COPY.columnUnitPrice}
                  </DataTableHeaderCell>
                  <DataTableHeaderCell align="right">
                    {HISTORY_COPY.columnQuantity}
                  </DataTableHeaderCell>
                  <DataTableHeaderCell align="right">
                    {HISTORY_COPY.columnAmount}
                  </DataTableHeaderCell>
                </tr>
              </DataTableHead>
              <DataTableBody>
                {detail.data.lines.map((line) => (
                  <DataTableRow key={line.id} className="border-t border-border">
                    <DataTableCell>
                      <p className="text-body font-semibold text-ink">{line.name}</p>
                      <p className="text-xs text-ink-muted">{line.code}</p>
                    </DataTableCell>
                    <DataTableCell align="right" className="hidden sm:table-cell">
                      <Money cents={line.unitPrice} />
                    </DataTableCell>
                    <DataTableCell align="right" className="text-body text-ink tabular-nums">
                      {line.quantity}
                    </DataTableCell>
                    <DataTableCell align="right">
                      <Money cents={line.subtotal} size="lg" />
                    </DataTableCell>
                  </DataTableRow>
                ))}
              </DataTableBody>
            </DataTable>
          </div>
        ))}
      {detail.data && (
        <p className="flex items-baseline justify-between border-t border-border pt-4">
          <span className="text-body font-semibold text-ink">{HISTORY_COPY.detailTotal}</span>
          <Money cents={detail.data.total} size="total" />
        </p>
      )}
    </Modal>
  );
};

export default SaleDetailModal;
