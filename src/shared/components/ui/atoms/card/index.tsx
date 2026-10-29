import { cn } from '@shared/utils/cn';
import type { ComponentProps } from 'react';

export type CardPadding = 'none' | 'md' | 'lg';

export interface CardProps extends ComponentProps<'div'> {
  /** Semantic element: a named `section` becomes a landmark, `aside` for the total panel. */
  as?: 'div' | 'section' | 'aside';
  /** `none` for tables (rows reach the border), `md` 20 px, `lg` 24 px. */
  padding?: CardPadding;
}

const paddings: Record<CardPadding, string> = {
  none: '',
  md: 'p-5',
  lg: 'p-6',
};

/** White surface with a soft border: the code block, the table, the total panel (Figma: Card). */
export const Card = ({ as: Element = 'div', padding = 'md', className, ...props }: CardProps) => (
  <Element
    className={cn('rounded-card border border-border bg-surface', paddings[padding], className)}
    {...props}
  />
);
