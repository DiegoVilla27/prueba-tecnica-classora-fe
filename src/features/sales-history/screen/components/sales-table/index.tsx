import {
  Badge,
  Button,
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeaderCell,
  DataTableRow,
  Money,
} from '@shared/components/ui';
import { formatDateTime } from '@shared/utils/format-date';
import { HISTORY_COPY, HISTORY_TEXT, SALE_STATUS } from '../../../constants/messages';
import type { SaleSummary } from '../../../models/sale-record';

export interface SalesTableProps {
  sales: SaleSummary[];
  onOpen: (sale: SaleSummary) => void;
}

/** History table: one row per sale, newest first, with a button to open its detail. */
export const SalesTable = ({ sales, onOpen }: SalesTableProps) => (
  // Below md each sale is a two-line block: date + total, then status + "Ver". From md, a table.
  <DataTable caption={HISTORY_COPY.tableCaption} className="block md:table">
    <DataTableHead isSticky className="hidden md:table-header-group">
      <tr>
        <DataTableHeaderCell>{HISTORY_COPY.columnDate}</DataTableHeaderCell>
        <DataTableHeaderCell>{HISTORY_COPY.columnStatus}</DataTableHeaderCell>
        <DataTableHeaderCell align="right">{HISTORY_COPY.columnItems}</DataTableHeaderCell>
        <DataTableHeaderCell align="right">{HISTORY_COPY.columnProducts}</DataTableHeaderCell>
        <DataTableHeaderCell align="right">{HISTORY_COPY.columnTotal}</DataTableHeaderCell>
        <DataTableHeaderCell align="right">
          <span className="sr-only">{HISTORY_COPY.columnActions}</span>
        </DataTableHeaderCell>
      </tr>
    </DataTableHead>
    <DataTableBody className="block md:table-row-group">
      {sales.map((sale) => (
        <DataTableRow
          key={sale.id}
          className="flex flex-wrap items-center gap-y-2 border-t border-border px-2 py-3 md:table-row md:p-0"
        >
          <DataTableCell className="w-1/2 px-2 py-0 md:order-none md:w-auto md:px-4 md:py-3 text-body text-ink tabular-nums">
            {formatDateTime(sale.createdAt)}
          </DataTableCell>
          <DataTableCell className="order-3 w-1/2 px-2 py-0 md:order-none md:w-auto md:px-4 md:py-3">
            <Badge tone={SALE_STATUS[sale.status].tone}>{SALE_STATUS[sale.status].label}</Badge>
          </DataTableCell>
          <DataTableCell
            align="right"
            className="hidden text-body text-ink tabular-nums md:table-cell"
          >
            {sale.itemCount}
          </DataTableCell>
          <DataTableCell
            align="right"
            className="hidden text-body text-ink tabular-nums md:table-cell"
          >
            {sale.lineCount}
          </DataTableCell>
          <DataTableCell
            align="right"
            className="order-2 w-1/2 px-2 py-0 md:order-none md:w-auto md:px-4 md:py-3"
          >
            <Money cents={sale.total} size="lg" />
          </DataTableCell>
          <DataTableCell
            align="right"
            className="order-4 w-1/2 px-2 py-0 md:order-none md:w-auto md:px-4 md:py-3"
          >
            <Button
              variant="secondary"
              aria-label={HISTORY_TEXT.viewLabel(sale.createdAt)}
              onClick={() => onOpen(sale)}
            >
              {HISTORY_COPY.view}
            </Button>
          </DataTableCell>
        </DataTableRow>
      ))}
    </DataTableBody>
  </DataTable>
);

export default SalesTable;
