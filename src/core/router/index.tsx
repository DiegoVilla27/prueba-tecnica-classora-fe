import { Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { routes } from './config';

const router = createBrowserRouter(routes);

/** App router. The fallback is empty: lazy screens load in a few milliseconds. */
const AppRoutes = () => (
  <Suspense fallback={null}>
    <RouterProvider router={router} />
  </Suspense>
);

export default AppRoutes;
