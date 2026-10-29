import { z } from 'zod';

/** `AuthResponseDTO` of `POST /auth/login` and `POST /auth/refresh`. */
export const AuthResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  tokenType: z.literal('Bearer'),
  expiresIn: z.number().int().positive(),
});
export type AuthResponseDto = z.infer<typeof AuthResponseSchema>;

/** `UserMeResponseDTO` of `GET /users/me`. */
export const UserMeResponseSchema = z.object({
  id: z.uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
});
export type UserMeResponseDto = z.infer<typeof UserMeResponseSchema>;
