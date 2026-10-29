import { AuthLayout, Logo } from '@shared/components/ui';
import BrandPanel from './components/brand-panel';
import LoginForm from './components/login-form';

/** Login screen (CU-00): AuthLayout with the brand panel and the login form. */
export const LoginScreen = () => (
  <AuthLayout aside={<BrandPanel />}>
    <Logo className="mb-10 lg:hidden" />
    <LoginForm />
  </AuthLayout>
);

export default LoginScreen;
