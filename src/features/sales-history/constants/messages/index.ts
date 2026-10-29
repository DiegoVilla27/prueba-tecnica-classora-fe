import { formatDateTime } from '@shared/utils/format-date';
import type { BadgeTone } from '@shared/components/ui';
import type { SaleRecordStatus } from '../../models/sale-record';

/** Sales per page of the history. */
export const SALES_PAGE_SIZE = 20;

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

/** Status label and badge tone: colour always comes with text. */
export const SALE_STATUS: Record<SaleRecordStatus, { label: string; tone: BadgeTone }> = {
  OPEN: { label: 'Abierta', tone: 'neutral' },
  COMPLETED: { label: 'Finalizada', tone: 'success' },
  CANCELLED: { label: 'Cancelada', tone: 'danger' },
};

/** Microcopy of the sales history. */
export const HISTORY_COPY = {
  title: 'Ventas',
  subtitle: 'Historial de tu caja, de la más reciente a la más antigua.',
  tableCaption: 'Ventas de la caja',
  columnDate: 'Fecha',
  columnStatus: 'Estado',
  columnItems: 'Artículos',
  columnProducts: 'Productos',
  columnTotal: 'Total',
  columnActions: 'Acciones',
  view: 'Ver',
  emptyTitle: 'Todavía no hay ventas',
  emptyDescription: 'Las ventas que abras en la caja aparecerán aquí.',
  loading: 'Cargando ventas…',
  loadError: 'No se pudieron cargar las ventas.',
  retry: 'Reintentar',
  detailOverline: 'Detalle de la venta',
  detailLoading: 'Cargando la venta…',
  detailError: 'No se pudo cargar la venta. Cierra y vuelve a intentarlo.',
  detailEmpty: 'Esta venta no tiene productos.',
  detailTotal: 'Total',
  close: 'Cerrar',
  columnProduct: 'Producto',
  columnUnitPrice: 'P. unitario',
  columnQuantity: 'Cantidad',
  columnAmount: 'Importe',
} as const;

/** Texts built from data. */
export const HISTORY_TEXT = {
  summary: (items: number, lines: number) =>
    `${plural(items, 'artículo', 'artículos')} · ${plural(lines, 'producto', 'productos')}`,
  saleTitle: (createdAt: string) => `Venta del ${formatDateTime(createdAt)}`,
  viewLabel: (createdAt: string) => `Ver detalle de la venta del ${formatDateTime(createdAt)}`,
  pageLabel: (page: number, totalPages: number, total: number) =>
    `Página ${page + 1} de ${Math.max(totalPages, 1)} · ${plural(total, 'venta', 'ventas')}`,
  detailDescription: (status: SaleRecordStatus, items: number, lines: number) =>
    `${SALE_STATUS[status].label} · ${HISTORY_TEXT.summary(items, lines)}`,
};
