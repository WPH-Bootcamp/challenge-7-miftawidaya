import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import { authService } from '@/services/api/auth';
import { setCredentials, logout, updateUser } from '@/features/auth/authSlice';
import { LoginInput, RegisterInput, User } from '@/types/auth';

/**
 * Authentication Queries and Mutations
 */

export const useLogin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (response) => {
      const { user, token } = response.data;

      // Set cookie for SSR/Middleware
      Cookies.set('auth_token', token, { expires: 7 });

      // Update Redux state
      dispatch(setCredentials({ user, token }));

      // Clear all queries as user context changed
      queryClient.clear();

      // Redirect to home
      router.push('/');
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (response) => {
      const { user, token } = response.data;

      // Set cookie for SSR/Middleware
      Cookies.set('auth_token', token, { expires: 7 });

      // Update Redux state
      dispatch(setCredentials({ user, token }));

      // Clear all queries as user context changed
      queryClient.clear();

      // Redirect to home
      router.push('/');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const router = useRouter();

  return () => {
    // Remove cookie
    Cookies.remove('auth_token');

    // Reset Redux state
    dispatch(logout());

    // Clear all queries
    queryClient.clear();

    // Redirect to login
    router.push('/login');
  };
};

export const useProfile = (enabled = true) => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
    select: (response) => response.data,
    enabled,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (data: FormData) => authService.updateProfile(data),
    onMutate: async (formData: FormData) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['profile'] });

      // Snapshot the previous value
      const previousProfile = queryClient.getQueryData<User>(['profile']);

      // Extract optimistic data from FormData
      const optimisticUser: Partial<User> = {};
      let optimisticAvatarUrl: string | null = null;

      if (formData.has('name')) {
        optimisticUser.name = formData.get('name') as string;
      }
      if (formData.has('email')) {
        optimisticUser.email = formData.get('email') as string;
      }
      if (formData.has('phone')) {
        optimisticUser.phone = formData.get('phone') as string;
      }

      // Optimistically update avatar if a new file is uploaded
      const avatarFile = formData.get('avatar');
      if (avatarFile instanceof File) {
        optimisticAvatarUrl = URL.createObjectURL(avatarFile);
        optimisticUser.avatar = optimisticAvatarUrl;
      }

      // Optimistically update to the new value in Query Cache
      if (previousProfile) {
        queryClient.setQueryData<User>(['profile'], {
          ...previousProfile,
          ...optimisticUser,
        });
      }

      // Optimistically update Redux
      dispatch(updateUser(optimisticUser));

      return { previousProfile, optimisticAvatarUrl };
    },
    onError: (err, formData, context) => {
      // Rollback to the previous value in Query Cache
      if (context?.previousProfile) {
        queryClient.setQueryData(['profile'], context.previousProfile);
        // Rollback Redux
        dispatch(updateUser(context.previousProfile));
      }
    },
    onSettled: (_data, error, _variables) => {
      // Always refetch after error or success to ensure we are in sync with the server
      if (!error) {
        toast.success('Profile updated successfully');
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
