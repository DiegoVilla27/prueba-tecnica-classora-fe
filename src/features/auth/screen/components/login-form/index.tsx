import { Alert, Button, FormField, PasswordField } from '@shared/components/ui';
import { ArrowRight } from 'lucide-react';
import { AUTH_MESSAGES, LOGIN_COPY } from '../../../constants/messages';
import useLoginForm from './hooks';

/** Login form (Figma: LoginScreen · form column). */
export const LoginForm = () => {
  const { register, errors, submit, isSubmitting, serverError, isSessionExpired } = useLoginForm();

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-labelledby="login-title"
      className="flex flex-col gap-6"
    >
      <header className="flex flex-col gap-3">
        <h1 id="login-title" className="text-title font-bold text-ink">
          {LOGIN_COPY.title}
        </h1>
        <p className="text-body text-ink-muted">{LOGIN_COPY.subtitle}</p>
      </header>

      {serverError && <Alert>{serverError}</Alert>}
      {isSessionExpired && <Alert variant="info">{AUTH_MESSAGES.sessionExpired}</Alert>}

      <FormField
        label={LOGIN_COPY.emailLabel}
        type="email"
        inputMode="email"
        autoComplete="username"
        placeholder={LOGIN_COPY.emailPlaceholder}
        error={errors.email?.message}
        {...register('email')}
      />
      <PasswordField
        label={LOGIN_COPY.passwordLabel}
        autoComplete="current-password"
        placeholder={LOGIN_COPY.passwordPlaceholder}
        error={errors.password?.message}
        {...register('password')}
      />

      <Button
        type="submit"
        size="lg"
        className="w-full"
        isLoading={isSubmitting}
        loadingText={LOGIN_COPY.submitting}
        endSlot={<ArrowRight aria-hidden="true" className="size-5" />}
      >
        {LOGIN_COPY.submit}
      </Button>

      <p className="text-xs text-ink-muted">{LOGIN_COPY.footnote}</p>
    </form>
  );
};

export default LoginForm;
