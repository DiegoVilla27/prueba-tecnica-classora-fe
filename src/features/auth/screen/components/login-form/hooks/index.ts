import { ApiError } from '@core/errors/api-error';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router';
import { AUTH_MESSAGES } from '../../../../constants/messages';
import { loginSvc } from '../../../../services';
import LoginSchema, { type LoginFormValues } from '../schema';

/**
 * Turns a failed login into the message the cashier reads.
 *
 * @param error - Error thrown by `loginSvc`.
 * @returns Spanish microcopy: wrong credentials, too many attempts or server unreachable.
 */
export const toLoginErrorMessage = (error: unknown): string => {
  const { status } = ApiError.from(error);
  if (status === 401) return AUTH_MESSAGES.invalidCredentials;
  if (status === 429) return AUTH_MESSAGES.tooManyAttempts;
  if (status === null || status >= 500) return AUTH_MESSAGES.serverUnavailable;
  return AUTH_MESSAGES.unexpected;
};

/**
 * Login form logic (same pattern as `useLoginPage` of task-manager): RHF + Zod for the fields
 * and a mutation for `POST /auth/login`.
 *
 * @returns Field registration, errors, submit handler and the server error to show.
 */
const useLoginForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    resetField,
    setFocus,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const login = useMutation({
    mutationFn: loginSvc,
    onSuccess: () => navigate('/', { replace: true }),
    onError: () => {
      // CU-00 A2: the password is cleared and focused to type it again.
      resetField('password');
      setFocus('password');
    },
  });

  return {
    register,
    errors,
    submit: handleSubmit((values) => login.mutate(values)),
    isSubmitting: login.isPending,
    serverError: login.isError ? toLoginErrorMessage(login.error) : null,
    isSessionExpired: searchParams.get('expired') === '1' && !login.isError,
  };
};

export default useLoginForm;
