import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router';
import PrivateGuard from '../private';
import PublicGuard from '../public';

// Screens are loaded on demand: each feature exports its screen by default for React.lazy.
const LoginScreen = lazy(() =>
  import('@features/auth').then((module) => ({ default: module.LoginScreen })),
);
const CheckoutScreen = lazy(() =>
  import('@features/checkout').then((module) => ({ default: module.CheckoutScreen })),
);

/** Route table: `/login` (public), `/` (private) and any other path back to `/`. */
export const routes: RouteObject[] = [
  {
    element: <PublicGuard />,
    children: [{ path: '/login', element: <LoginScreen /> }],
  },
  {
    element: <PrivateGuard />,
    children: [{ path: '/', element: <CheckoutScreen /> }],
  },
  { path: '*', element: <Navigate to="/" replace /> },
];
