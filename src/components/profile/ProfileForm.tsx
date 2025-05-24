'use client';

import { useUserContext } from '@/context/UserContext';
import {
  TextInput,
  Button,
  Group,
  Paper,
  Title,
  Stack,
  Avatar,
  FileInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState, useEffect } from 'react';
import { updateProfile } from '@/app/actions/profile';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileFormSchema, ProfileFormType, useUserType } from '@/lib/type';
import { IconUser } from '@tabler/icons-react';

export default function ProfileForm() {
  const { user, setUser } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    getValues
  } = useForm<ProfileFormType>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      profileImage: user?.profileImage ?? '',
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name ?? '',
        email: user.email ?? '',
        phoneNumber: user.phoneNumber ?? '',
        profileImage: user.profileImage ?? '',
      });
    }
  }, [user, reset]);

  const profileImage = watch('profileImage');

  const handleFileChange = (file: File | null) => {
    if (file) {
      // Create preview URL for the selected file
      const objectUrl = URL.createObjectURL(file);
      setPreviewFile(file);
      setValue('profileImage', objectUrl, { shouldValidate: true });
    } else {
      setPreviewFile(null);
    }
  };

  const handleProfileUpdate = async (values: ProfileFormType) => {
    setIsSubmitting(true);
    const formData = new FormData();
    if (previewFile instanceof File) {
      formData.append('file', previewFile);
    }

    if (previewFile instanceof File) {
      const uploadResponse = await fetch('/api/upload/profile-image', {
        method: 'POST',
        body: formData,
      });
      const uploadResult = await uploadResponse.json();
      if (uploadResult.error) {
        notifications.show({
          title: 'Error',
          message: uploadResult.error,
          color: 'red',
        });
        setIsSubmitting(false);
        return;
      }
      formData.set('profileImage', uploadResult.path);
    }

    const result = await updateProfile(formData);
    if (result.error) {
      notifications.show({
        title: 'Error',
        message: result.error,
        color: 'red',
      });
    } else {
      // Update the user context with all updated fields
      if (result.success && user) {
        const updatedUser = {
          ...user,
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          phoneNumber: formData.get('phoneNumber') as string,
          profileImage: formData.get('profileImage') as string,
        };
        setUser(updatedUser);
        
        // Reset form with updated values
        reset({
          name: updatedUser.name ?? '',
          email: updatedUser.email ?? '',
          phoneNumber: updatedUser.phoneNumber ?? '',
          profileImage: updatedUser.profileImage ?? '',
        });

        // Clear preview URL after successful update

        notifications.show({
          title: 'Success',
          message: 'Profile updated successfully',
          color: 'green',
        });
      }
    }
    setIsSubmitting(false);
  };

  // Cleanup preview URL when component unmounts
  // Get the avatar source

  return (
    <Paper radius="md" p="xl" withBorder>
      <Title order={2} mb="md">
        Profile Settings
      </Title>

      <form onSubmit={handleSubmit(handleProfileUpdate)}>
        <Stack>
          <Group>
            <Avatar
              src={previewFile ? URL.createObjectURL(previewFile) : user?.profileImage || ''}
              size={120}
              radius={120}
              mx="auto"
              color="blue"
            >
              <IconUser size={60} />
            </Avatar>
            <FileInput
              label="Profile Image"
              placeholder="Upload profile image"
              accept="image/*"
              error={errors.profileImage?.message}
              onChange={handleFileChange}
            />
          </Group>
          <TextInput
            label="Name"
            placeholder="Your name"
            error={errors.name?.message}
            {...register('name')}
          />
          <TextInput
            label="Email"
            placeholder="Your email"
            error={errors.email?.message}
            {...register('email')}
          />
          <TextInput
            label="Phone Number"
            placeholder="Your phone number"
            error={errors.phoneNumber?.message}
            {...register('phoneNumber')}
          />
          <Button type="submit" loading={isSubmitting}>
            Update Profile
          </Button>
        </Stack>
      </form>
    </Paper>
  );
} 