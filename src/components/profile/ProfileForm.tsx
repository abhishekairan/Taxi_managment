'use client';

import { useUserContext } from '@/context/UserContext';
import { useForm } from '@mantine/form';
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
import { useState } from 'react';
import { updateProfile } from '@/app/actions/profile';

export default function ProfileForm() {
  const { user } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
      profileImage: user?.profileImage || '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
    },
  });

  const handleProfileUpdate = async (values: typeof form.values) => {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (key === 'profileImage' && (value as any) instanceof File) {
        formData.append('file', value);
      } else {
        formData.append(key, value);
      }
    });

    if ((values.profileImage as any) instanceof File) {
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
      notifications.show({
        title: 'Success',
        message: 'Profile updated successfully',
        color: 'green',
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Title order={2} mb="md">
        Profile Settings
      </Title>

      <form onSubmit={form.onSubmit(handleProfileUpdate)}>
        <Stack>
          <Group>
            <Avatar
              src={form.values.profileImage}
              size={120}
              radius={120}
              mx="auto"
            />
            <FileInput
              label="Profile Image"
              placeholder="Upload profile image"
              accept="image/*"
              {...form.getInputProps('profileImage')}
            />
          </Group>
          <TextInput
            label="Name"
            placeholder="Your name"
            {...form.getInputProps('name')}
          />
          <TextInput
            label="Email"
            placeholder="Your email"
            {...form.getInputProps('email')}
          />
          <TextInput
            label="Phone Number"
            placeholder="Your phone number"
            {...form.getInputProps('phoneNumber')}
          />
          <Button type="submit" loading={isSubmitting}>
            Update Profile
          </Button>
        </Stack>
      </form>
    </Paper>
  );
} 