import StorageService, { STORAGE_KEYS } from '@shared/utils/storage';
import { Navigate, Outlet } from 'react-router';

/** Lets the route through only with a session; otherwise sends the cashier to `/login`. */
const PrivateGuard = () => {
  const token = StorageService.get<string>(STORAGE_KEYS.TOKEN);

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateGuard;
