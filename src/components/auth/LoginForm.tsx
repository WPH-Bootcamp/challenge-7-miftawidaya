'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { loginSchema, LoginType } from '@/lib/validations/auth';
import { useLogin } from '@/services/queries/useAuth';
import { cn } from '@/lib/utils';

interface LoginFormProps {
  className?: string;
}

export function LoginForm({ className }: Readonly<LoginFormProps>) {
  const [showPassword, setShowPassword] = React.useState(false);
  const loginMutation = useLogin();

  const form = useForm<LoginType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginType) => {
    loginMutation.mutate(data);
  };

  return (
    <div className={cn('flex w-full flex-col gap-5 md:gap-6', className)}>
      {/* Switcher */}
      <div className='flex h-12 w-full items-center gap-2 rounded-2xl bg-neutral-100 p-2 md:h-14 md:gap-2'>
        <button
          className='shadow-card md:text-md flex h-8 flex-1 items-center justify-center rounded-xl bg-white text-sm font-bold text-neutral-950 transition-all md:h-10'
          type='button'
        >
          Sign in
        </button>
        <Link
          href='/register'
          className='md:text-md flex h-8 flex-1 items-center justify-center text-sm font-medium text-neutral-500 transition-all md:h-10'
        >
          Sign up
        </Link>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-4 md:gap-5'
        >
          {/* Email */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='relative'>
                    <Input
                      placeholder='Email Address'
                      className='md:text-md h-12 rounded-xl border-neutral-300 px-4 py-2 text-sm md:h-14'
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className='text-xs font-semibold md:text-sm' />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Password'
                      className='md:text-md h-12 rounded-xl border-neutral-300 py-2 ps-4 pe-10 text-sm md:h-14'
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className='absolute end-3 top-1/2 -translate-y-1/2 text-neutral-950 transition-colors hover:text-neutral-700'
                    >
                      <Icon
                        icon={showPassword ? 'ri:eye-off-line' : 'ri:eye-line'}
                        className='size-5'
                      />
                    </button>
                  </div>
                </FormControl>
                <FormMessage className='text-xs font-semibold md:text-sm' />
              </FormItem>
            )}
          />

          {/* Remember Me */}
          <div className='flex h-7 items-center gap-2 md:h-7.5'>
            <Checkbox id='remember-me' className='size-5' />
            <label
              htmlFor='remember-me'
              className='md:text-md cursor-pointer text-sm leading-7 font-medium tracking-tight text-neutral-950 md:leading-7.5'
            >
              Remember Me
            </label>
          </div>

          <Button
            type='submit'
            className='bg-brand-primary text-md h-12 w-full rounded-full font-bold text-white transition-opacity hover:opacity-90 md:h-12'
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Logging in...' : 'Sign In'}
          </Button>

          {loginMutation.isError && (
            <p className='text-brand-primary text-center text-xs font-semibold md:text-sm'>
              {loginMutation.error.message}
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}
