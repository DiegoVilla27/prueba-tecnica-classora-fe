import { httpService } from '@core/http';
import StorageService, { STORAGE_KEYS } from '@shared/utils/storage';
import type { Cashier } from '../models/cashier';
import type { LoginRequestDto } from './dtos/request';
import { AuthResponseSchema, UserMeResponseSchema } from './dtos/response';
import { toCashier } from './mappers';

const API_AUTH = '/auth';
const API_USERS = '/users';

/**
 * Time the login waits for the API: covers Render's cold start (about 50 s on the free plan),
 * which is when a cashier is most likely to be the first visitor of the day.
 */
const LOGIN_TIMEOUT_MS = 60_000;

/**
 * Signs the cashier in and stores the session tokens.
 *
 * @param credentials - Email and password.
 * @throws {ApiError} 401 on wrong credentials, 429 on too many attempts, `null` status on network errors.
 */
const loginSvc = async (credentials: LoginRequestDto): Promise<void> => {
  const data = await httpService.post<unknown, LoginRequestDto>(`${API_AUTH}/login`, credentials, {
    timeout: LOGIN_TIMEOUT_MS,
  });
  const { accessToken, refreshToken } = AuthResponseSchema.parse(data);
  StorageService.set(STORAGE_KEYS.TOKEN, accessToken);
  StorageService.set(STORAGE_KEYS.REFRESH, refreshToken);
};

/**
 * Loads the signed-in cashier.
 *
 * @returns The cashier of the current session.
 */
const getMeSvc = async (): Promise<Cashier> => {
  const data = await httpService.get<unknown>(`${API_USERS}/me`);
  return toCashier(UserMeResponseSchema.parse(data));
};

/**
 * Ends the session on this device.
 *
 * @remarks
 * The API is stateless (JWT): there is no logout endpoint, the tokens are simply dropped.
 * The open sale stays on the server and is recovered at the next login.
 */
const logoutSvc = (): void => {
  StorageService.clearSession();
};

export { getMeSvc, loginSvc, logoutSvc };
