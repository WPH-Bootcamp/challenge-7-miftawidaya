'use client';

import * as React from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react';
import { toast } from 'sonner';

import { RootState } from '@/features/store';
import { Button } from '@/components/ui/button';
import {
  ProfileSidebar,
  ProfileSidebarSkeleton,
} from '@/components/user/ProfileSidebar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { profileSchema, ProfileType } from '@/lib/validations/auth';
import { useUpdateProfile } from '@/services/queries/useAuth';
import { cn } from '@/lib/utils';

/**
 * ProfileInfoRow - Displays a label-value pair for profile information
 */
function ProfileInfoRow({
  label,
  value,
}: Readonly<{
  label: string;
  value: string | undefined;
}>) {
  return (
    <div className='flex h-7 items-center justify-between md:h-7.5'>
      <span className='text-md font-medium tracking-[-0.03em] text-neutral-950 md:text-lg'>
        {label}
      </span>
      <span className='text-md font-bold tracking-[-0.02em] text-neutral-950 md:text-lg'>
        {value || '-'}
      </span>
    </div>
  );
}

/**
 * ProfilePageSkeleton - Loading placeholder for ProfilePage
 * @description Matches the layout and dimensions of the profile card to prevent layout shift.
 */
function ProfilePageSkeleton() {
  return (
    <div className='custom-container mx-auto flex flex-col gap-6 py-20 md:flex-row md:items-start md:gap-8 md:py-32'>
      {/* Desktop Sidebar Skeleton */}
      <ProfileSidebarSkeleton />

      {/* Main Content Skeleton */}
      <div className='flex min-w-0 flex-1 grow flex-col gap-6 md:max-w-131'>
        {/* Page Title Skeleton */}
        <Skeleton className='h-9 w-32 md:h-10.5 md:w-40' />

        {/* Profile Card Skeleton */}
        <div className='shadow-card flex w-full flex-col gap-6 rounded-2xl bg-white p-4 md:p-5'>
          <div className='flex w-full flex-col gap-6'>
            {/* Avatar Section Skeleton */}
            <div className='flex flex-col gap-4'>
              <Skeleton className='h-5 w-24' />
              <Skeleton className='size-16 rounded-full md:size-20' />
            </div>

            {/* Info Rows Skeleton */}
            <div className='flex flex-col gap-4 md:gap-5'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='flex h-7 items-center justify-between md:h-7.5'
                >
                  <Skeleton className='h-5 w-24 md:h-6' />
                  <Skeleton className='h-5 w-32 md:h-6' />
                </div>
              ))}
            </div>

            {/* Button Skeleton */}
            <div className='pt-2'>
              <Skeleton className='h-11 w-full rounded-full' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ProfilePage Component
 * @description User profile page showing personal information with sidebar on desktop
 */
export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = React.useState(false);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const updateProfile = useUpdateProfile();

  const form = useForm<ProfileType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  // Update form values when user changes (e.g., after optimistic rollback or fetch)
  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, form]);

  if (!user) return <ProfilePageSkeleton />;

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onSubmit = async (data: ProfileType) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);

    const file = fileInputRef.current?.files?.[0];
    if (file) {
      formData.append('avatar', file);
    }

    try {
      // 1. Trigger optimistic update immediately
      updateProfile.mutate(formData);

      // 2. Close edit mode instantly to remove the "Saving..." delay feel
      setIsEditing(false);
      setAvatarPreview(null);

      // Success toast will be handled by the mutation or can be omitted if redundant
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
      // If error occurs immediately (synchronously), we might need to stay in edit mode
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAvatarPreview(null);
    form.reset();
  };

  return (
    <div className='custom-container mx-auto flex flex-col gap-6 py-20 md:flex-row md:items-start md:gap-8 md:py-32'>
      {/* Desktop Sidebar - Hidden on mobile */}
      <ProfileSidebar />

      {/* Main Content (Frame 72) */}
      <div className='flex min-w-0 flex-1 grow flex-col gap-6 md:max-w-131'>
        {/* Page Title (Profile) */}
        <h1 className='text-display-xs md:text-display-lg leading-9 font-extrabold text-neutral-950 md:leading-10.5'>
          Profile
        </h1>

        {/* Profile Card (Frame 71) */}
        <div className='shadow-card flex w-full flex-col gap-6 rounded-2xl bg-white p-4 md:p-5'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='flex w-full flex-col gap-6'
            >
              {/* Profile Info Wrapper (Frame 70) */}
              <div className='flex w-full flex-col gap-6 md:gap-6'>
                {/* Avatar Section */}
                <div className='relative flex flex-col gap-4'>
                  <FormLabel className='text-sm font-bold text-neutral-950'>
                    Profile Picture
                  </FormLabel>

                  {isEditing ? (
                    <label
                      onDragOver={onDragOver}
                      onDragLeave={onDragLeave}
                      onDrop={onDrop}
                      className={cn(
                        'relative flex w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-6 transition-all duration-300 outline-none md:p-10',
                        isDragging
                          ? 'border-brand-primary bg-brand-primary/5 scale-[1.01]'
                          : 'focus-visible:ring-brand-primary border-neutral-200 bg-neutral-50 hover:border-neutral-300 hover:bg-neutral-100/50 focus-visible:ring-2 focus-visible:ring-offset-2'
                      )}
                    >
                      <input
                        type='file'
                        ref={fileInputRef}
                        className='hidden'
                        accept='image/*'
                        onChange={onAvatarChange}
                      />
                      <div className='relative size-20 shrink-0 overflow-hidden rounded-full shadow-lg md:size-28'>
                        {avatarPreview || user.avatar ? (
                          <Image
                            src={avatarPreview || user.avatar || ''}
                            alt={user.name}
                            fill
                            sizes='(max-width: 768px) 80px, 112px'
                            className='object-cover'
                            unoptimized={
                              !!avatarPreview ||
                              (typeof user.avatar === 'string' &&
                                user.avatar.startsWith('blob:'))
                            }
                          />
                        ) : (
                          <div className='flex size-full items-center justify-center bg-neutral-200 text-3xl font-bold text-neutral-500'>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className='absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100'>
                          <Icon
                            icon='ri:camera-line'
                            className='size-8 text-white'
                          />
                        </div>
                      </div>

                      <div className='flex flex-col items-center gap-1.5 text-center'>
                        <div className='flex items-center gap-1 text-sm font-semibold text-neutral-950'>
                          <span className='text-brand-primary hover:underline'>
                            Click to upload
                          </span>
                          <span>or drag and drop</span>
                        </div>
                        <p className='text-xs text-neutral-500'>
                          SVG, PNG, JPG or GIF (max. 800x800px)
                        </p>
                      </div>
                    </label>
                  ) : (
                    <div className='relative size-16 shrink-0 overflow-hidden rounded-full md:size-20'>
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          fill
                          sizes='(max-width: 768px) 64px, 80px'
                          className='object-cover'
                          unoptimized={
                            typeof user.avatar === 'string' &&
                            user.avatar.startsWith('blob:')
                          }
                        />
                      ) : (
                        <div className='flex size-full items-center justify-center bg-neutral-200 text-xl font-bold text-neutral-500'>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Form Fields or Static Info */}
                <div className='flex flex-col gap-4 md:gap-5'>
                  {/* Name */}
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name='name'
                      render={({ field }) => (
                        <FormItem>
                          <div className='flex flex-col gap-2'>
                            <FormLabel className='text-sm font-bold text-neutral-950'>
                              Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Full Name'
                                className='md:text-md h-12 rounded-xl border-neutral-300 px-4 py-2 text-sm md:h-14'
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage className='text-xs font-semibold md:text-sm' />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <ProfileInfoRow label='Name' value={user.name} />
                  )}

                  {/* Email */}
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name='email'
                      render={({ field }) => (
                        <FormItem>
                          <div className='flex flex-col gap-2'>
                            <FormLabel className='text-sm font-bold text-neutral-950'>
                              Email
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Email Address'
                                className='md:text-md h-12 rounded-xl border-neutral-300 px-4 py-2 text-sm md:h-14'
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage className='text-xs font-semibold md:text-sm' />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <ProfileInfoRow label='Email' value={user.email} />
                  )}

                  {/* Phone */}
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name='phone'
                      render={({ field }) => (
                        <FormItem>
                          <div className='flex flex-col gap-2'>
                            <FormLabel className='text-sm font-bold text-neutral-950'>
                              Nomor Handphone
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='Phone Number'
                                className='md:text-md h-12 rounded-xl border-neutral-300 px-4 py-2 text-sm md:h-14'
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage className='text-xs font-semibold md:text-sm' />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <ProfileInfoRow
                      label='Nomor Handphone'
                      value={user.phone}
                    />
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-col gap-3'>
                {isEditing ? (
                  <div className='flex w-full flex-col gap-3'>
                    <Button
                      type='submit'
                      className='bg-brand-primary hover:bg-brand-primary/90 h-11 w-full rounded-full text-base font-bold text-neutral-50'
                      disabled={updateProfile.isPending}
                    >
                      {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={handleCancel}
                      className='h-11 w-full rounded-full border-neutral-300 text-base font-bold text-neutral-950 hover:bg-neutral-50'
                      disabled={updateProfile.isPending}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    type='button'
                    onClick={() => setIsEditing(true)}
                    className='bg-brand-primary hover:bg-brand-primary/90 h-11 w-full rounded-full text-base font-bold text-neutral-50'
                  >
                    Update Profile
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
