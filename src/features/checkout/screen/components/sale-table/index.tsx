import {
  Card,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableHeaderCell,
  EmptyState,
} from '@shared/components/ui';
import { ScanBarcode } from 'lucide-react';
import { CHECKOUT_COPY } from '../../../constants/messages';
import useLineActions from '../../../hooks/use-line-actions';
import useSaleStore, { selectLines } from '../../../store';
import SaleLineRow from '../sale-line-row';

/** Ticket of the sale: one row per product, or the empty state (Figma: SaleTable). */
export const SaleTable = () => {
  const lines = useSaleStore(selectLines);
  const lastAddedCode = useSaleStore((state) => state.lastAddedCode);
  const selectedLineId = useSaleStore((state) => state.selectedLineId);
  const { increase, decrease, remove } = useLineActions();

  if (lines.length === 0) {
    return (
      <Card padding="none">
        <EmptyState
          icon={<ScanBarcode className="size-6" />}
          title={CHECKOUT_COPY.emptyTitle}
          description={CHECKOUT_COPY.emptyDescription}
        />
      </Card>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden">
      <DataTable caption={CHECKOUT_COPY.tableCaption}>
        <DataTableHead>
          <tr>
            <DataTableHeaderCell>{CHECKOUT_COPY.columnProduct}</DataTableHeaderCell>
            <DataTableHeaderCell align="right">{CHECKOUT_COPY.columnUnitPrice}</DataTableHeaderCell>
            <DataTableHeaderCell align="center">{CHECKOUT_COPY.columnQuantity}</DataTableHeaderCell>
            <DataTableHeaderCell align="right">{CHECKOUT_COPY.columnAmount}</DataTableHeaderCell>
            <DataTableHeaderCell align="center">
              <span className="sr-only">{CHECKOUT_COPY.columnActions}</span>
            </DataTableHeaderCell>
          </tr>
        </DataTableHead>
        <DataTableBody>
          {lines.map((line) => (
            <SaleLineRow
              // productId, not id: an optimistic line changes id when the server confirms it.
              key={line.productId}
              line={line}
              isHighlighted={line.code === lastAddedCode}
              isSelected={line.id === selectedLineId}
              onIncrease={increase}
              onDecrease={decrease}
              onRemove={remove}
            />
          ))}
        </DataTableBody>
      </DataTable>
    </Card>
  );
};

export default SaleTable;
