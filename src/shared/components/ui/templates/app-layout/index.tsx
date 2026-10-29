import type { ReactNode } from 'react';

export interface AppLayoutProps {
  header: ReactNode;
  /** Work area (≈ 70 %, or the whole width without `aside`). */
  children: ReactNode;
  /** Side panel (≈ 30 %): the payment panel of the checkout. Optional. */
  aside?: ReactNode;
  /** Shortcuts bar. */
  footer?: ReactNode;
}

/**
 * App page skeleton: header, work area (+ optional side panel) and footer (Figma: AppLayout).
 *
 * @remarks
 * From `lg` up it fills exactly the viewport height: the work area and the side panel stretch
 * to the bottom and long content scrolls inside them (e.g. the sale table), so the total and
 * the actions never move. Below `lg` (tablet, 200 % zoom) the page scrolls normally.
 */
export const AppLayout = ({ header, children, aside, footer }: AppLayoutProps) => (
  <div className="flex min-h-dvh flex-col bg-canvas lg:h-dvh">
    {header}
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 lg:min-h-0 lg:flex-row">
      <main className="flex min-w-0 flex-1 flex-col gap-4 lg:min-h-0">{children}</main>
      {aside && <aside className="lg:w-80 lg:shrink-0">{aside}</aside>}
    </div>
    {footer && <footer className="px-4 pb-4 md:px-6 md:pb-6">{footer}</footer>}
  </div>
);
