import { cn } from '@shared/utils/cn';
import { Minus, Plus } from 'lucide-react';
import { IconButton } from '../../atoms/icon-button';

export interface QuantityStepperProps {
  value: number;
  /** Accessible name of the group, e.g. "Cantidad de Leche entera 1L". */
  label: string;
  /** `+` is disabled at the maximum (999 at the checkout). */
  max: number;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseLabel?: string;
  increaseLabel?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * − value + control (Figma: QuantityStepper).
 *
 * @remarks
 * `−` stays enabled at the minimum: what happens then (asking to remove the line, CU-02 B1)
 * is the screen's decision, not the stepper's.
 */
export const QuantityStepper = ({
  value,
  label,
  max,
  onDecrease,
  onIncrease,
  decreaseLabel = 'Reducir cantidad',
  increaseLabel = 'Aumentar cantidad',
  disabled = false,
  className,
}: QuantityStepperProps) => (
  <fieldset className={cn('m-0 inline-flex min-w-0 items-center gap-2 border-0 p-0', className)}>
    <legend className="sr-only">{label}</legend>
    <IconButton
      variant="outline"
      aria-label={decreaseLabel}
      icon={<Minus className="size-4" />}
      disabled={disabled}
      onClick={onDecrease}
    />
    {/* Plain text, not a live region: with many rows every stepper would talk at once. The
        screen announces changes once, through the app announcer. */}
    <span className="min-w-10 text-center text-body text-ink tabular-nums">{value}</span>
    <IconButton
      variant="outline"
      aria-label={increaseLabel}
      icon={<Plus className="size-4" />}
      disabled={disabled || value >= max}
      onClick={onIncrease}
    />
  </fieldset>
);
