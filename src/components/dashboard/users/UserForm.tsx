'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextInput,
  Button,
  Group,
  Stack,
  Select,
  PasswordInput,
  FileInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconUpload } from '@tabler/icons-react';
import { UserManagementFormSchema, UserManagementFormType, UserTableType } from '@/lib/type';
import { createUser, updateUser } from '@/app/actions/userManagement';
import { useState } from 'react';

interface UserFormProps {
  user?: UserTableType | null;
  onClose: (shouldRefresh?: boolean) => void;
}

export default function UserForm({ user, onClose }: UserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<UserManagementFormType>({
    resolver: zodResolver(UserManagementFormSchema),
    defaultValues: {
      id: user?.id,
      name: user?.name ?? '',
      email: user?.email ?? '',
      role: (user?.role as 'ADMIN' | 'DRIVER') ?? 'DRIVER',
      phoneNumber: user?.phone_number ?? '',
      profileImage: user?.profile_image ?? '',
    },
  });

  const handleFileChange = async (file: File | null) => {
    if (file) {
      setPreviewFile(file);
      // Create a preview URL
      const objectUrl = URL.createObjectURL(file);
      setValue('profileImage', objectUrl, { shouldValidate: true });
    } else {
      setPreviewFile(null);
      setValue('profileImage', '', { shouldValidate: true });
    }
  };

  const onSubmit = async (values: UserManagementFormType) => {
    setIsSubmitting(true);
    // console.log('Form values:', values);

    try {
      // Handle file upload if there's a new file
      if (previewFile instanceof File) {
        const formData = new FormData();
        formData.append('file', previewFile);
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
        values.profileImage = uploadResult.path;
      }

      // Create or update user
      const result = user
        ? await updateUser(values)
        : await createUser(values);

      if (result.error) {
        notifications.show({
          title: 'Error',
          message: result.error,
          color: 'red',
        });
      } else {
        notifications.show({
          title: 'Success',
          message: user ? 'User updated successfully' : 'User created successfully',
          color: 'green',
        });
        onClose(true);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      notifications.show({
        title: 'Error',
        message: 'An unexpected error occurred',
        color: 'red',
      });
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <FileInput
          label="Profile Image"
          placeholder="Upload profile image"
          accept="image/*"
          leftSection={<IconUpload size={14} />}
          onChange={handleFileChange}
        />

        <TextInput
          label="Name"
          placeholder="Enter name"
          error={errors.name?.message}
          {...register('name')}
        />

        <TextInput
          label="Email"
          placeholder="Enter email"
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label={user ? 'New Password (optional)' : 'Password'}
          placeholder={user ? 'Leave blank to keep current' : 'Enter password'}
          error={errors.password?.message}
          {...register('password')}
        />

        <Select
          label="Role"
          placeholder="Select role"
          data={[
            { value: 'ADMIN', label: 'Admin' },
            { value: 'DRIVER', label: 'Driver' },
          ]}
          error={errors.role?.message}
          {...register('role')}
          value={watch('role')}
          onChange={(value) => setValue('role', value as 'ADMIN' | 'DRIVER')}
        />

        <TextInput
          label="Phone Number"
          placeholder="Enter phone number"
          error={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {user ? 'Update User' : 'Create User'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
} 