import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { logoutSvc } from '../../services';

/**
 * Ends the session (CU-07): drops the tokens and every cached query, then goes to `/login`.
 *
 * @remarks
 * The open sale is kept on the server and is recovered at the next login.
 *
 * @returns A function that logs the cashier out.
 */
const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    logoutSvc();
    queryClient.clear();
    navigate('/login', { replace: true });
  };
};

export default useLogout;
