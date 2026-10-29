import { Button, Card, FormField } from '@shared/components/ui';
import { CornerDownLeft } from 'lucide-react';
import { CHECKOUT_COPY } from '../../../constants/messages';
import { SCAN_INPUT_ID } from '../../../constants/dom';
import useScanForm from './hooks';

export interface ScanFormProps {
  /** Until the sale is loaded the field is disabled (server waking up). */
  disabled?: boolean;
}

/** Product code field + "Añadir" (Figma: ScanForm). */
export const ScanForm = ({ disabled = false }: ScanFormProps) => {
  const { register, error, submit } = useScanForm(disabled);

  return (
    <Card as="section" padding="lg" aria-label={CHECKOUT_COPY.scanLabel}>
      {/* Below sm the button goes under the field, full width, so the field keeps its size. */}
      <form onSubmit={submit} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <FormField
            id={SCAN_INPUT_ID}
            label={CHECKOUT_COPY.scanLabel}
            size="lg"
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
            placeholder={CHECKOUT_COPY.scanPlaceholder}
            helperText={CHECKOUT_COPY.scanHelp}
            error={error}
            disabled={disabled}
            {...register('code')}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="w-full sm:mt-7 sm:w-auto"
          disabled={disabled}
          endSlot={<CornerDownLeft aria-hidden="true" className="size-5" />}
        >
          {CHECKOUT_COPY.scanSubmit}
        </Button>
      </form>
    </Card>
  );
};

export default ScanForm;
