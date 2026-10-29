const dateTimeFormatter = new Intl.DateTimeFormat('es-ES', {
  dateStyle: 'short',
  timeStyle: 'short',
});

/**
 * Formats an API timestamp (ISO 8601, UTC) as local Spanish date and time: `"29/10/26, 14:55"`.
 *
 * @param isoDate - Timestamp sent by the API.
 * @returns The date and time in the browser time zone.
 */
export const formatDateTime = (isoDate: string): string =>
  dateTimeFormatter.format(new Date(isoDate));
