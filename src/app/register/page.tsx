import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create a Foody account to enjoy homemade flavors.',
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title='Create Account'
      subtitle='Join Foody and enjoy delicious homemade food!'
    >
      <RegisterForm />
    </AuthLayout>
  );
}
