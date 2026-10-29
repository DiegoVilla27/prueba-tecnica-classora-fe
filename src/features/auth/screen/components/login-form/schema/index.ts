import { z } from 'zod';
import { AUTH_MESSAGES } from '../../../../constants/messages';

/** Login form validation: the only source of truth for its rules (CLAUDE.md §4). */
const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, AUTH_MESSAGES.emailRequired)
    .pipe(z.email(AUTH_MESSAGES.emailInvalid)),
  password: z.string().min(1, AUTH_MESSAGES.passwordRequired),
});

export type LoginFormValues = z.infer<typeof LoginSchema>;

export default LoginSchema;
