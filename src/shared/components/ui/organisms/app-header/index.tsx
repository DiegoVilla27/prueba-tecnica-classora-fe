import type { ReactNode } from 'react';

export interface AppHeaderProps {
  /** Usually the `Logo`. */
  brand: ReactNode;
  /** Text next to the brand: "Puesto de caja". */
  context?: ReactNode;
  /** Usually a `UserBadge`. */
  user?: ReactNode;
  /** Header actions: "Salir". */
  actions?: ReactNode;
}

/** Top bar of the app: brand on the left, session on the right (Figma: AppHeader). */
export const AppHeader = ({ brand, context, user, actions }: AppHeaderProps) => (
  <header className="flex items-center justify-between gap-6 bg-surface px-6 py-4">
    <div className="flex items-center gap-4">
      {brand}
      {context && <p className="text-sm text-ink-muted">{context}</p>}
    </div>
    <div className="flex items-center gap-6">
      {user}
      {actions}
    </div>
  </header>
);
