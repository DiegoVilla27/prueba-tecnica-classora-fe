import type { ReactNode } from 'react';

export interface AuthLayoutProps {
  /** Brand panel on the left (green). Hidden below `lg`, where only the form is shown. */
  aside: ReactNode;
  /** The form column. */
  children: ReactNode;
}

/** Login page skeleton: brand panel + centred form (Figma: AuthLayout). */
export const AuthLayout = ({ aside, children }: AuthLayoutProps) => (
  <div className="flex min-h-dvh bg-surface">
    <aside className="hidden flex-col justify-between bg-primary p-12 text-on-primary lg:flex lg:w-7/16">
      {aside}
    </aside>
    <main className="flex flex-1 items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md">{children}</div>
    </main>
  </div>
);
