import type { ReactNode } from 'react';

export interface AppHeaderProps {
  /** Usually the `Logo`. */
  brand: ReactNode;
  /** Text next to the brand: "Puesto de caja". */
  context?: ReactNode;
  /** Main navigation (tabs), after the brand. */
  nav?: ReactNode;
  /** Usually a `UserBadge`. */
  user?: ReactNode;
  /** Header actions: "Salir". */
  actions?: ReactNode;
}

/**
 * Top bar of the app: brand on the left, session on the right (Figma: AppHeader).
 *
 * @remarks
 * Below `md` it takes two rows: brand + session on the first one, the navigation on its own
 * full-width row. The context text only shows from `lg`, where there is room for it.
 */
export const AppHeader = ({ brand, context, nav, user, actions }: AppHeaderProps) => (
  <header className="flex flex-wrap items-center gap-x-3 gap-y-3 bg-surface px-4 py-3 sm:gap-x-6 md:flex-nowrap md:px-6 md:py-4">
    <div className="flex min-w-0 items-center gap-4">
      {brand}
      {context && <p className="hidden text-sm text-ink-muted lg:block">{context}</p>}
    </div>
    {nav && <div className="order-last w-full md:order-none md:w-auto">{nav}</div>}
    <div className="ml-auto flex items-center gap-3 md:gap-6">
      {user}
      {actions}
    </div>
  </header>
);
