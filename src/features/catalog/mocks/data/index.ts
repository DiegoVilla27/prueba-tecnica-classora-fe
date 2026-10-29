import type { ProductResponseDto } from '../../services/dtos/response';

/**
 * The 20 products of the API catalog, exactly as `V3__reset_data_and_reseed_products.sql` of
 * the backend seeds them (same UUIDs, EAN-13 codes and prices in euros).
 */
export const mockProducts: ProductResponseDto[] = [
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000001',
    code: '8412345000010',
    name: 'Leche entera 1L',
    price: 0.95,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000002',
    code: '8412345000027',
    name: 'Pan de molde integral 460g',
    price: 1.65,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000003',
    code: '8412345000034',
    name: 'Huevos frescos M (12 uds)',
    price: 2.79,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000004',
    code: '8412345000041',
    name: 'Aceite de oliva virgen extra 1L',
    price: 8.95,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000005',
    code: '8412345000058',
    name: 'Arroz redondo 1kg',
    price: 1.29,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000006',
    code: '8412345000065',
    name: 'Yogur natural (pack 4)',
    price: 1.15,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000007',
    code: '8412345000072',
    name: 'Café molido natural 250g',
    price: 3.49,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000008',
    code: '8412345000089',
    name: 'Agua mineral 1,5L',
    price: 0.45,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000009',
    code: '8412345000096',
    name: 'Tomate frito 400g',
    price: 0.89,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000010',
    code: '8412345000102',
    name: 'Detergente líquido 30 lavados',
    price: 6.75,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000011',
    code: '8412345000119',
    name: 'Bolsa de papel',
    price: 0.1,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000012',
    code: '8412345000126',
    name: 'Plátanos de Canarias 1kg',
    price: 2.19,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000013',
    code: '8412345000133',
    name: 'Macarrones 500g',
    price: 0.85,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000014',
    code: '8412345000140',
    name: 'Atún claro en aceite (pack 3)',
    price: 2.95,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000015',
    code: '8412345000157',
    name: 'Queso semicurado 250g',
    price: 3.25,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000016',
    code: '8412345000164',
    name: 'Jamón cocido extra 200g',
    price: 2.4,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000017',
    code: '8412345000171',
    name: 'Galletas María 800g',
    price: 1.99,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000018',
    code: '8412345000188',
    name: 'Zumo de naranja 1L',
    price: 1.49,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000019',
    code: '8412345000195',
    name: 'Papel higiénico doble capa (12 rollos)',
    price: 4.5,
  },
  {
    id: '0b6e4c4e-1a2b-4c3d-8e9f-100000000020',
    code: '8412345000201',
    name: 'Cerveza lata 33cl (pack 6)',
    price: 3.89,
  },
];

/** Products used by name in tests. */
export const MILK = mockProducts[0]!;
export const BAG = mockProducts[10]!;
