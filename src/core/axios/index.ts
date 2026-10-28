import { environment } from '@core/environments';
import axios from 'axios';

/**
 * Single Axios instance for the Java API.
 *
 * @remarks
 * The 10 s timeout covers a normal request; Render's cold start is handled by the screens
 * (retries with a "Conectando con el servidor…" state), not here.
 */
export const axiosInstance = axios.create({
  baseURL: environment.apiUrl,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
