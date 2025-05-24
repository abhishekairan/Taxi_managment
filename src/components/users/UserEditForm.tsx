'use client';

import { useForm } from '@mantine/form';
import {
  TextInput,
  Button,
  Group,
  Paper,
  Title,
  Stack,
  Select,
  Modal,
  PasswordInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { updateUserRole, resetPassword } from '@/app/actions/users';

interface UserEditFormProps {
  user: any;
}

export default function UserEditForm({ user }: UserEditFormProps) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordForm = useForm({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      newPassword: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value, values) =>
        value !== values.newPassword ? 'Passwords did not match' : null,
    },
  });

  const handlePasswordReset = async (values: typeof passwordForm.values) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('newPassword', values.newPassword);

    const result = await resetPassword(formData);
    if (result.error) {
      notifications.show({
        title: 'Error',
        message: result.error,
        color: 'red',
      });
    } else {
      notifications.show({
        title: 'Success',
        message: 'Password reset successfully',
        color: 'green',
      });
      setIsPasswordModalOpen(false);
      passwordForm.reset();
    }
    setIsSubmitting(false);
  };

  const handleRoleUpdate = async (newRole: string) => {
    setIsSubmitting(true);
    const result = await updateUserRole(user.id, newRole);
    if (result.error) {
      notifications.show({
        title: 'Error',
        message: result.error,
        color: 'red',
      });
    } else {
      notifications.show({
        title: 'Success',
        message: 'Role updated successfully',
        color: 'green',
      });
      setIsRoleModalOpen(false);
    }
    setIsSubmitting(false);
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Title order={2} mb="md">
        Edit User
      </Title>

      <Stack>
        <TextInput
          label="Name"
          value={user.name}
          readOnly
        />
        <TextInput
          label="Email"
          value={user.email}
          readOnly
        />
        <TextInput
          label="Phone Number"
          value={user.phone_number}
          readOnly
        />
        <TextInput
          label="Role"
          value={user.role}
          readOnly
        />
        <Group>
          <Button
            variant="light"
            onClick={() => setIsRoleModalOpen(true)}
          >
            Edit Role
          </Button>
          <Button
            variant="light"
            color="red"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            Reset Password
          </Button>
        </Group>
      </Stack>

      <Modal
        opened={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Update User Role"
      >
        <Select
          label="Role"
          placeholder="Select role"
          data={[
            { value: 'admin', label: 'Admin' },
            { value: 'driver', label: 'Driver' },
          ]}
          defaultValue={user.role}
          onChange={(value) => {
            if (value) {
              handleRoleUpdate(value);
            }
          }}
        />
      </Modal>

      <Modal
        opened={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Reset Password"
      >
        <form onSubmit={passwordForm.onSubmit(handlePasswordReset)}>
          <Stack>
            <PasswordInput
              label="New Password"
              placeholder="Enter new password"
              {...passwordForm.getInputProps('newPassword')}
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm new password"
              {...passwordForm.getInputProps('confirmPassword')}
            />
            <Button type="submit" loading={isSubmitting}>
              Reset Password
            </Button>
          </Stack>
        </form>
      </Modal>
    </Paper>
  );
} 