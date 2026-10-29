import { Alert, Button, Card, Spinner } from '@shared/components/ui';
import { CHECKOUT_COPY } from '../../../constants/messages';

export interface ServerStatusProps {
  isError: boolean;
  onRetry: () => void;
}

/**
 * Shown while the sale cannot be loaded (CU-08): Render's cold start or the server down.
 *
 * @remarks
 * While it is on screen the scan field stays disabled, so no scan is lost.
 */
export const ServerStatus = ({ isError, onRetry }: ServerStatusProps) =>
  isError ? (
    <Card padding="lg" className="flex items-center justify-between gap-4">
      <Alert className="flex-1">{CHECKOUT_COPY.loadError}</Alert>
      <Button variant="secondary" onClick={onRetry}>
        {CHECKOUT_COPY.retry}
      </Button>
    </Card>
  ) : (
    <Card padding="lg" className="flex flex-col gap-1">
      <Spinner label={CHECKOUT_COPY.connecting} />
      <p className="pl-7 text-xs text-ink-muted">{CHECKOUT_COPY.connectingHint}</p>
    </Card>
  );

export default ServerStatus;
