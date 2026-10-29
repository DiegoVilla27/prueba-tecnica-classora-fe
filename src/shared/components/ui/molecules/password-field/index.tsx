import { useState } from 'react';
import { FormField, type FormFieldProps } from '../form-field';

export interface PasswordFieldProps extends Omit<FormFieldProps, 'type' | 'endSlot'> {
  /** Text of the toggle when the password is hidden. */
  showLabel?: string;
  /** Text of the toggle when the password is visible. */
  hideLabel?: string;
}

/** Password field with a "Mostrar / Ocultar" toggle (Figma: PasswordField). */
export const PasswordField = ({
  showLabel = 'Mostrar',
  hideLabel = 'Ocultar',
  ...props
}: PasswordFieldProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <FormField
      type={isVisible ? 'text' : 'password'}
      endSlot={
        <button
          type="button"
          aria-pressed={isVisible}
          aria-label={`${isVisible ? hideLabel : showLabel} contraseña`}
          onClick={() => setIsVisible((visible) => !visible)}
          className="min-h-target rounded-control px-3 text-sm font-semibold text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus"
        >
          {isVisible ? hideLabel : showLabel}
        </button>
      }
      {...props}
    />
  );
};
