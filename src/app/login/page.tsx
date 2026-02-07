import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your Foody account to start ordering.',
};

export default function LoginPage() {
  return (
    <AuthLayout
      title='Welcome Back'
      subtitle='Good to see you again! Let’s eat'
    >
      <LoginForm />
    </AuthLayout>
  );
}
