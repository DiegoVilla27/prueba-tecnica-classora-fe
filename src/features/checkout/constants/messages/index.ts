import { formatMoney } from '@shared/utils/format-money';

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

/** Microcopy of the checkout, literal from the Figma frames (docs/03-ux-ui.md §6). */
export const CHECKOUT_COPY = {
  context: 'Puesto de caja',
  cashierRole: 'Sesión de cajero',
  logout: 'Salir',
  title: 'Venta en curso',
  statusOpen: 'Abierta',
  scanLabel: 'Código de producto',
  scanPlaceholder: 'Escanea o escribe el código',
  scanHelp: 'Escanea un código y pulsa Enter. También puedes introducirlo manualmente.',
  scanSubmit: 'Añadir',
  tableCaption: 'Productos de la venta',
  columnProduct: 'Producto',
  columnUnitPrice: 'P. unitario',
  columnQuantity: 'Cantidad',
  columnAmount: 'Importe',
  columnActions: 'Acciones',
  lastAdded: 'Último añadido',
  emptyTitle: 'Escanea un producto para empezar',
  emptyDescription: 'Los productos aparecerán aquí con su precio y su importe.',
  totalTitle: 'Total de la venta',
  stateLabel: 'Estado',
  stateValue: 'En curso',
  finalize: 'Finalizar venta',
  finalizeDisabledHint: 'Añade productos para finalizar',
  clear: 'Vaciar venta',
  shortcutsLabel: 'Atajos de teclado',
  shortcutsTrailing: 'Importes en euros',
  connecting: 'Conectando con el servidor…',
  connectingHint: 'El servidor puede tardar hasta un minuto en arrancar.',
  loadError: 'No se pudo cargar la venta.',
  retry: 'Reintentar',
  back: 'Volver a la venta',
  finalizeOverline: 'Revisar venta',
  finalizeTitle: '¿Finalizar esta venta?',
  finalizing: 'Finalizando…',
  clearOverline: 'Cancelar venta',
  clearTitle: '¿Vaciar la venta?',
  clearing: 'Vaciando…',
  logoutOverline: 'Cerrar sesión',
  logoutTitle: '¿Quieres salir de la caja?',
  logoutDescription: 'La venta quedará abierta y podrás recuperarla al volver a iniciar sesión.',
  logoutConfirm: 'Cerrar sesión',
  completedTitle: 'Venta finalizada',
  newSale: 'Nueva venta',
  undo: 'Deshacer',
} as const;

/** Messages built from data (counts, names, codes). */
export const CHECKOUT_TEXT = {
  summary: (items: number, lines: number) =>
    `${plural(items, 'artículo', 'artículos')} · ${plural(lines, 'producto', 'productos')}`,
  finalizeDescription: (items: number, lines: number) =>
    `${CHECKOUT_TEXT.summary(items, lines)}. Comprueba el total antes de confirmar.`,
  clearDescription: (items: number) =>
    `${items === 1 ? 'Se eliminará el artículo' : `Se eliminarán los ${items} artículos`} de esta venta. Esta acción no se puede deshacer.`,
  completed: (total: number) => `Venta finalizada · ${formatMoney(total)}`,
  removed: (name: string) => `${name} eliminado`,
  added: (name: string, quantity: number) => `${name} añadido. Cantidad ${quantity}`,
  quantityChanged: (name: string, quantity: number) => `${name}, cantidad ${quantity}`,
  quantityLabel: (name: string) => `Cantidad de ${name}`,
  decreaseLabel: (name: string) => `Reducir cantidad de ${name}`,
  increaseLabel: (name: string) => `Aumentar cantidad de ${name}`,
  removeLabel: (name: string) => `Eliminar ${name}`,
};

/** Error messages of the checkout (docs/03-ux-ui.md §6 and CU-01…CU-05). */
export const CHECKOUT_MESSAGES = {
  invalidCode: 'Código no válido. Introduce entre 4 y 14 dígitos.',
  invalidQuantity: 'Cantidad no válida. Introduce entre 1 y 999 unidades.',
  maxQuantity: 'Cantidad máxima por producto: 999. No se añadieron más unidades.',
  unknownCode: (code: string) =>
    `No existe ningún producto con el código ${code}. Revisa el código.`,
  lookupFailed: 'No se pudo consultar el producto. Revisa la conexión y vuelve a pulsar Enter.',
  addFailed: (name: string) => `No se pudo añadir ${name}. Vuelve a escanearlo.`,
  changeFailed: 'No se pudo cambiar la cantidad. Inténtalo de nuevo.',
  removeFailed: 'No se pudo eliminar la línea. Inténtalo de nuevo.',
  finalizeFailed: 'No se pudo finalizar la venta. La venta sigue abierta: vuelve a intentarlo.',
  clearFailed: 'No se pudo vaciar la venta. Vuelve a intentarlo.',
  saleChanged: 'La venta ha cambiado en otra pestaña. Se ha recargado.',
} as const;
