import { Logo, Overline } from '@shared/components/ui';
import { LOGIN_COPY } from '../../../constants/messages';

/** Green brand panel on the left of the login (Figma: LoginScreen · aside). */
export const BrandPanel = () => (
  <>
    <Logo tone="onPrimary" />
    <div className="flex flex-col gap-6">
      <Overline tone="onPrimary">{LOGIN_COPY.brandOverline}</Overline>
      <p className="text-display font-semibold text-balance">{LOGIN_COPY.brandHeadline}</p>
      <p className="max-w-sm text-body">{LOGIN_COPY.brandDescription}</p>
    </div>
    <p className="text-sm">{LOGIN_COPY.brandFooter}</p>
  </>
);

export default BrandPanel;
