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
import { registerSchema } from '@/lib/validations/auth';
import { useRegister } from '@/services/queries/useAuth';
import { cn } from '@/lib/utils';
import { z } from 'zod';

/**
 * Extended Register Schema with Confirm Password
 */
const registerFormSchema = registerSchema
  .extend({
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormType = z.infer<typeof registerFormSchema>;

interface RegisterFormProps {
  className?: string;
}

export function RegisterForm({ className }: RegisterFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const registerMutation = useRegister();

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: RegisterFormType) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <div className={cn('flex w-full flex-col gap-5 md:gap-6', className)}>
      {/* Switcher */}
      <div className='flex h-12 w-full items-center gap-2 rounded-2xl bg-neutral-100 p-2 md:h-14 md:gap-2'>
        <Link
          href='/login'
          className='md:text-md flex h-8 flex-1 items-center justify-center text-sm font-medium text-neutral-500 transition-all md:h-10'
        >
          Sign in
        </Link>
        <button
          className='shadow-card md:text-md flex h-8 flex-1 items-center justify-center rounded-xl bg-white text-sm font-bold text-neutral-950 transition-all md:h-10'
          type='button'
        >
          Sign up
        </button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-4 md:gap-5'
        >
          {/* Name */}
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder='Full Name'
                    className='md:text-md h-12 rounded-xl border-neutral-300 px-4 py-2 text-sm md:h-14'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs font-semibold md:text-sm' />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder='Email Address'
                    className='md:text-md h-12 rounded-xl border-neutral-300 px-4 py-2 text-sm md:h-14'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs font-semibold md:text-sm' />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder='Phone Number'
                    className='md:text-md h-12 rounded-xl border-neutral-300 px-4 py-2 text-sm md:h-14'
                    {...field}
                  />
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
                      className='absolute end-3 top-1/2 -translate-y-1/2 text-neutral-950'
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

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='relative'>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='Confirm Password'
                      className='md:text-md h-12 rounded-xl border-neutral-300 py-2 ps-4 pe-10 text-sm md:h-14'
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className='absolute end-3 top-1/2 -translate-y-1/2 text-neutral-950'
                    >
                      <Icon
                        icon={
                          showConfirmPassword
                            ? 'ri:eye-off-line'
                            : 'ri:eye-line'
                        }
                        className='size-5'
                      />
                    </button>
                  </div>
                </FormControl>
                <FormMessage className='text-xs font-semibold md:text-sm' />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className='bg-brand-primary text-md h-12 w-full rounded-full font-bold text-white transition-opacity hover:opacity-90 md:h-12'
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? 'Registering...' : 'Sign Up'}
          </Button>

          {registerMutation.isError && (
            <p className='text-brand-primary text-center text-xs font-semibold md:text-sm'>
              {registerMutation.error.message}
            </p>
          )}
        </form>
      </Form>
    </div>
  );
}
