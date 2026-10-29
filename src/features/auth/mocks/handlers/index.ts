import { http, HttpResponse } from 'msw';
import type { LoginRequestDto } from '../../services/dtos/request';
import { apiErrorBody, DEMO_CREDENTIALS, demoCashier, MOCK_TOKENS } from '../data';

const tokens = () => ({
  accessToken: MOCK_TOKENS.access,
  refreshToken: MOCK_TOKENS.refresh,
  tokenType: 'Bearer',
  expiresIn: 3600,
});

/** Same answers as the Java API for `/auth/*` and `/users/me`. */
const handlersAuth = [
  http.post('*/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequestDto;

    if (!email || !password) {
      return HttpResponse.json(
        apiErrorBody(400, 'Bad Request', 'The request contains validation errors', [
          ...(!email ? [{ field: 'email', message: 'Email is required' }] : []),
          ...(!password ? [{ field: 'password', message: 'Password is required' }] : []),
        ]),
        { status: 400 },
      );
    }
    if (email !== DEMO_CREDENTIALS.email || password !== DEMO_CREDENTIALS.password) {
      return HttpResponse.json(apiErrorBody(401, 'Unauthorized', 'Invalid credentials.'), {
        status: 401,
      });
    }
    return HttpResponse.json(tokens());
  }),

  http.post('*/auth/refresh', async ({ request }) => {
    const { refreshToken } = (await request.json()) as { refreshToken?: string };
    return refreshToken === MOCK_TOKENS.refresh
      ? HttpResponse.json(tokens())
      : HttpResponse.json(apiErrorBody(401, 'Unauthorized', 'Invalid refresh token.'), {
          status: 401,
        });
  }),

  http.get('*/users/me', ({ request }) =>
    request.headers.get('Authorization') === `Bearer ${MOCK_TOKENS.access}`
      ? HttpResponse.json(demoCashier)
      : HttpResponse.json(apiErrorBody(401, 'Unauthorized', 'Authentication required.'), {
          status: 401,
        }),
  ),
];

export default handlersAuth;
