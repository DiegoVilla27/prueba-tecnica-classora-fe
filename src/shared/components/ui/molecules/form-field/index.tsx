import { CircleAlert } from 'lucide-react';
import { useId, type ReactNode } from 'react';
import { Input, type InputProps } from '../../atoms/input';
import { Label } from '../../atoms/label';

export interface FormFieldProps extends Omit<InputProps, 'invalid'> {
  /** Visible label, linked to the input. */
  label: string;
  /** Hint under the field when there is no error. */
  helperText?: ReactNode;
  /** Error under the field: red border, icon + text, announced with `role="alert"`. */
  error?: string;
}

/**
 * Label + input + hint or error, wired for accessibility (Figma: FormField).
 *
 * @remarks
 * The error is linked with `aria-describedby` and never relies on color alone (icon + text).
 */
export const FormField = ({ label, helperText, error, id, ...inputProps }: FormFieldProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;
  const hasMessage = Boolean(error || helperText);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={inputId}>{label}</Label>
      <Input
        id={inputId}
        invalid={Boolean(error)}
        aria-describedby={hasMessage ? messageId : undefined}
        {...inputProps}
      />
      {error ? (
        <p id={messageId} role="alert" className="flex items-center gap-2 text-sm text-danger">
          <CircleAlert aria-hidden="true" className="size-4 shrink-0" />
          {error}
        </p>
      ) : (
        helperText && (
          <p id={messageId} className="text-xs text-ink-muted">
            {helperText}
          </p>
        )
      )}
    </div>
  );
};
