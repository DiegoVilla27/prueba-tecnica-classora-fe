import type { ReactNode } from 'react';

export interface AppLayoutProps {
  header: ReactNode;
  /** Work area (≈ 70 %): scan form and sale table. */
  children: ReactNode;
  /** Payment panel (≈ 30 %): fixed while the list scrolls. */
  aside: ReactNode;
  /** Shortcuts bar. */
  footer?: ReactNode;
}

/** Checkout page skeleton: header, 70/30 work area and shortcuts bar (Figma: AppLayout). */
export const AppLayout = ({ header, children, aside, footer }: AppLayoutProps) => (
  <div className="flex min-h-dvh flex-col bg-canvas">
    {header}
    <div className="flex flex-1 flex-col gap-6 p-6 lg:flex-row">
      <main className="flex min-w-0 flex-1 flex-col gap-4">{children}</main>
      <aside className="lg:sticky lg:top-6 lg:w-80 lg:self-start">{aside}</aside>
    </div>
    {footer && <footer className="px-6 pb-6">{footer}</footer>}
  </div>
);
