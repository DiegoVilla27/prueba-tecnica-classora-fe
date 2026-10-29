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
      <form onSubmit={submit} noValidate className="flex items-start gap-3">
        <div className="flex-1">
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
          className="mt-7"
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
