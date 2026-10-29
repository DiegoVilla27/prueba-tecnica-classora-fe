import type { UserMeResponseDto } from '../../services/dtos/response';

/** Demo cashier of the mocks: same data as the cashier seeded in the local backend. */
export const DEMO_CREDENTIALS = { email: 'cajero@pos.local', password: 'cajero1234' } as const;

export const demoCashier: UserMeResponseDto = {
  id: '5f8ebc23-bfd6-4b1d-85aa-ccc44236d910',
  firstName: 'Ana',
  lastName: 'López',
  email: DEMO_CREDENTIALS.email,
};

/** Fake tokens: the mocks only check they match, they are not real JWTs. */
export const MOCK_TOKENS = {
  access: 'mock-access-token',
  refresh: 'mock-refresh-token',
} as const;

/** Builds the API error body (`ErrorResponseDTO`). */
export const apiErrorBody = (
  status: number,
  error: string,
  message: string,
  errors: { field: string; message: string }[] = [],
) => ({ timestamp: new Date().toISOString(), status, error, message, errors });
