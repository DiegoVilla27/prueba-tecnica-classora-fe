import { cn } from '@shared/utils/cn';
import { Avatar } from '../../atoms/avatar';

export interface UserBadgeProps {
  name: string;
  initials: string;
  /** Second line, e.g. "Sesión de cajero". */
  description?: string;
  className?: string;
}

/** Avatar + name + role of the signed-in person (Figma: UserBadge). */
export const UserBadge = ({ name, initials, description, className }: UserBadgeProps) => (
  <div className={cn('flex items-center gap-3', className)}>
    <Avatar initials={initials} />
    <div className="flex flex-col">
      <span className="text-sm font-semibold text-ink">{name}</span>
      {description && <span className="text-xs text-ink-muted">{description}</span>}
    </div>
  </div>
);
