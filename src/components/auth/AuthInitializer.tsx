'use client';

import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { RootState } from '@/features/store';
import { setCredentials, logout } from '@/features/auth/authSlice';
import { useProfile } from '@/services/queries/useAuth';

/**
 * AuthInitializer Component
 * @description Handles authentication state hydration on application load.
 * Syncs the Redux state with the session stored in cookies.
 */
export function AuthInitializer({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const token = Cookies.get('auth_token');

  const isAuthPage = pathname === '/login' || pathname === '/register';

  // Only fetch profile if we have a token, aren't authenticated, and not on login/register pages
  const { data: user, isError } = useProfile(
    !!token && !isAuthenticated && !isAuthPage
  );

  React.useEffect(() => {
    if (token && user && !isAuthenticated) {
      dispatch(setCredentials({ user, token }));
    } else if (isError && !isAuthenticated) {
      // If token exists but profile fetch fails, token is likely invalid/expired
      Cookies.remove('auth_token');
      dispatch(logout());
    } else if (!token && isAuthenticated) {
      // If no token but Redux thinks we are logged in (e.g. cookie cleared manually)
      dispatch(logout());
    }
  }, [token, user, isError, dispatch, isAuthenticated]);

  return <>{children}</>;
}
