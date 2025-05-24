'use client';

import { useUserContext } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { Button, Group, Stack, Title } from '@mantine/core';
import { getAllUsers } from '@/app/actions/users';

export default function UsersPage() {
  const { user } = useUserContext();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    const fetchUsers = async () => {
      const result = await getAllUsers();
      if (result.error) {
        router.push('/dashboard');
      } else if (result.users) {
        setUsers(result.users);
      }
    };

    fetchUsers();
  }, [user, router]);

  return (
    <Stack>
      <Title order={2}>User Management</Title>
      <DataTable
        borderColor="gray.3"
        borderRadius="sm"
        striped
        highlightOnHover
        data={users}
        columns={[
          { accessor: 'name', title: 'Name' },
          { accessor: 'email', title: 'Email' },
          { accessor: 'phone_number', title: 'Phone Number' },
          { accessor: 'role', title: 'Role' },
          {
            accessor: 'actions',
            title: 'Actions',
            render: (record) => (
              <Group>
                <Button
                  variant="light"
                  onClick={() => router.push(`/dashboard/users/edit/${record.id}`)}
                >
                  Edit User
                </Button>
              </Group>
            ),
          },
        ]}
      />
    </Stack>
  );
} 