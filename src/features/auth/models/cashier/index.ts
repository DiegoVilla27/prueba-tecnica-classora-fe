/** The signed-in cashier (the only kind of user). */
export interface Cashier {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

/**
 * Full name shown in the header.
 *
 * @param cashier - Signed-in cashier.
 * @returns First and last name, e.g. `"Ana López"`.
 */
export const cashierFullName = ({ firstName, lastName }: Cashier): string =>
  `${firstName} ${lastName}`.trim();

/**
 * Initials for the avatar.
 *
 * @param cashier - Signed-in cashier.
 * @returns Up to two upper-case initials, e.g. `"AL"`.
 */
export const cashierInitials = ({ firstName, lastName }: Cashier): string =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toLocaleUpperCase('es');
