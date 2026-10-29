/** Lifecycle status of a sale, as the API sends it. */
export type SaleRecordStatus = 'OPEN' | 'COMPLETED' | 'CANCELLED';

/** A sale in the history (no lines). Amounts in cents, dates as ISO strings (UTC). */
export interface SaleSummary {
  id: string;
  status: SaleRecordStatus;
  itemCount: number;
  lineCount: number;
  total: number;
  createdAt: string;
  closedAt: string | null;
}

/** One page of the history, newest first. */
export interface SalesPage {
  sales: SaleSummary[];
  page: number;
  totalPages: number;
  totalElements: number;
}

/** A line of a past sale, as it was charged. */
export interface SaleRecordLine {
  id: string;
  code: string;
  name: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

/** A past sale with its lines (detail modal). */
export interface SaleDetail extends SaleSummary {
  lines: SaleRecordLine[];
}
