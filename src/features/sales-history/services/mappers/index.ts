import { fromEuros } from '@shared/utils/money';
import type { SaleDetail, SalesPage, SaleSummary } from '../../models/sale-record';
import type {
  SaleDetailResponseDto,
  SalePageResponseDto,
  SaleSummaryResponseDto,
} from '../dtos/response';

/** Maps a history row (euros) to the domain summary (cents). */
export const toSaleSummary = (dto: SaleSummaryResponseDto): SaleSummary => ({
  id: dto.id,
  status: dto.status,
  itemCount: dto.itemCount,
  lineCount: dto.lineCount,
  total: fromEuros(dto.total),
  createdAt: dto.createdAt,
  closedAt: dto.closedAt,
});

/** Maps a page of the history. */
export const toSalesPage = (dto: SalePageResponseDto): SalesPage => ({
  sales: dto.content.map(toSaleSummary),
  page: dto.page,
  totalPages: dto.totalPages,
  totalElements: dto.totalElements,
});

/** Maps a sale with its lines (euros → cents). */
export const toSaleDetail = (dto: SaleDetailResponseDto): SaleDetail => ({
  id: dto.id,
  status: dto.status,
  itemCount: dto.itemCount,
  lineCount: dto.lines.length,
  total: fromEuros(dto.total),
  createdAt: dto.createdAt,
  closedAt: dto.closedAt,
  lines: dto.lines.map((line) => ({
    id: line.id,
    code: line.code,
    name: line.name,
    unitPrice: fromEuros(line.unitPrice),
    quantity: line.quantity,
    subtotal: fromEuros(line.subtotal),
  })),
});
