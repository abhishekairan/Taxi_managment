'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Group, Button, Paper, Modal, LoadingOverlay } from '@mantine/core';
import { IconUserPlus } from '@tabler/icons-react';
import { UserTableType } from '@/lib/type';
import UserForm from '@/components/dashboard/users/UserForm';
import UserTable from '@/components/dashboard/users/UserTable';

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<UserTableType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Show loading for at least 1 second

    return () => clearTimeout(timer);
  }, []);

  const handleFormClose = (shouldRefresh?: boolean) => {
    setIsFormOpen(false);
    setSelectedUser(null);
    if (shouldRefresh) {
      setRefreshKey(prev => prev + 1); // Increment refresh key to trigger table reload
    }
  };

  return (
    <Container size="2xl" pos="relative">
      <LoadingOverlay 
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ type: "dots" }}
      />
      
      <Paper p="md" radius="md">
        <Group justify="space-between" mb="lg">
          <Title order={2}>User Management</Title>
          <Button
            leftSection={<IconUserPlus size={16} />}
            onClick={() => setIsFormOpen(true)}
          >
            Add User
          </Button>
        </Group>

        <UserTable
          setEditData={setSelectedUser}
          editModelHandler={{
            open: () => setIsFormOpen(true),
          }}
          refreshTrigger={refreshKey}
        />
      </Paper>

      <Modal
        opened={isFormOpen}
        onClose={() => handleFormClose()}
        title={selectedUser ? 'Edit User' : 'Add New User'}
        size="md"
      >
        <UserForm 
          user={selectedUser} 
          onClose={handleFormClose}
        />
      </Modal>
    </Container>
  );
} 