import StorageService, { STORAGE_KEYS } from '@shared/utils/storage';
import { Navigate, Outlet } from 'react-router';

/** Public-only routes (login): with a session the cashier goes straight to the checkout. */
const PublicGuard = () => {
  const token = StorageService.get<string>(STORAGE_KEYS.TOKEN);

  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicGuard;
