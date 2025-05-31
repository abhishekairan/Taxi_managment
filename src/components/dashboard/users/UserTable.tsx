'use client';

import { useState, useEffect } from 'react';
import { ActionIcon, Group, Text, TextInput, Tooltip, Skeleton, Center, Stack, Button } from '@mantine/core';
import { IconEdit, IconSearch, IconTrash, IconDownload } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { notifications } from '@mantine/notifications';
import { UserTableType, UserDBType } from '@/lib/type';
import 'mantine-datatable/styles.layer.css';
import { getUsers, deleteUser } from '@/app/actions/userManagement';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PAGE_SIZES = [5, 10, 20];
const ICON_SIZE = 18;

type UserTableProps = {
  setEditData: (user: UserTableType | null) => void;
  editModelHandler: { open: () => void };
  refreshTrigger?: number;
};

export default function UserTable({ setEditData, editModelHandler, refreshTrigger = 0 }: UserTableProps) {
  const [records, setRecords] = useState<UserTableType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<UserTableType>>({
    columnAccessor: 'id',
    direction: 'desc',
  });
  const [queryName, setQueryName] = useState('');
  const [queryEmail, setQueryEmail] = useState('');

  // Load users and apply filters
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const fetchedUsers = await getUsers();
        let filteredUsers = fetchedUsers;

        // Apply search filters
        if (queryName) {
          filteredUsers = filteredUsers.filter((user) => 
            user.name?.toLowerCase().includes(queryName.toLowerCase())
          );
        }
        
        if (queryEmail) {
          filteredUsers = filteredUsers.filter((user) => 
            user.email?.toLowerCase().includes(queryEmail.toLowerCase())
          );
        }

        // Apply sorting
        const sortedUsers = [...filteredUsers].sort((a, b) => {
          const aValue = a[sortStatus.columnAccessor as keyof UserDBType];
          const bValue = b[sortStatus.columnAccessor as keyof UserDBType];

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortStatus.direction === 'asc' 
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          }

          if (aValue === null || aValue === undefined) return sortStatus.direction === 'asc' ? 1 : -1;
          if (bValue === null || bValue === undefined) return sortStatus.direction === 'asc' ? -1 : 1;

          return sortStatus.direction === 'asc' 
            ? Number(aValue) - Number(bValue)
            : Number(bValue) - Number(aValue);
        });

        // Transform to UserTableType with proper type handling
        const transformedUsers: UserTableType[] = sortedUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || 'DRIVER', // Default to DRIVER if null
          phone_number: user.phone_number,
          profile_image: user.profile_image,
          created_at: user.created_at || new Date().toISOString(), // Default to current date if null
          updated_at: user.updated_at || new Date().toISOString() // Default to current date if null
        }));

        // Apply pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords(transformedUsers.slice(from, to));
      } catch (error) {
        console.error('Error loading users:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to load users',
          color: 'red',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [page, pageSize, sortStatus, queryName, queryEmail, refreshTrigger]);

  // Handle user deletion
  const handleDelete = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setIsLoading(true);
      try {
        const result = await deleteUser(userId);
        if (result.error) {
          notifications.show({
            title: 'Error',
            message: result.error,
            color: 'red',
          });
        } else {
          notifications.show({
            title: 'Success',
            message: 'User deleted successfully',
            color: 'green',
          });
          // Refresh the data
          const updatedUsers = await getUsers();
          // Transform to UserTableType with proper type handling
          const transformedUsers: UserTableType[] = updatedUsers.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || 'DRIVER', // Default to DRIVER if null
            phone_number: user.phone_number,
            profile_image: user.profile_image,
            created_at: user.created_at || new Date().toISOString(), // Default to current date if null
            updated_at: user.updated_at || new Date().toISOString() // Default to current date if null
          }));
          setRecords(transformedUsers);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to delete user',
          color: 'red',
        });
      }
      setIsLoading(false);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Users Report', 14, 15);
    
    // Prepare table data
    const tableData = records.map(record => [
      `#${record.id}`,
      record.name || '-',
      record.email || '-',
      record.role || '-',
      record.phone_number || '-',
      record.created_at ? new Date(record.created_at).toLocaleString() : '-',
    ]);

    // Define table headers
    const headers = [
      'ID',
      'Name',
      'Email',
      'Role',
      'Phone',
      'Created At'
    ];

    // Generate table
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 25,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
      },
    });

    // Save the PDF
    doc.save('users-report.pdf');
  };

  const columns = [
    {
      accessor: 'id',
      render: ({id}: any) => <Text>#{id}</Text>,
      sortable: true
    },
    {
      accessor: 'name',
      title: 'Name',
      sortable: true,
      filter: (
        <TextInput
          label="Name"
          description="Show users with names containing the specified text"
          placeholder="Search names..."
          leftSection={<IconSearch size={16} />}
          value={queryName}
          onChange={(e) => setQueryName(e.currentTarget.value)}
        />
      ),
      filtering: queryName !== '',
    },
    {
      accessor: 'email',
      title: 'Email',
      sortable: true,
      filter: (
        <TextInput
          label="Email"
          description="Show users with email containing the specified text"
          placeholder="Search emails..."
          leftSection={<IconSearch size={16} />}
          value={queryEmail}
          onChange={(e) => setQueryEmail(e.currentTarget.value)}
        />
      ),
      filtering: queryEmail !== '',
    },
    {
      accessor: 'role',
      title: 'Role',
      sortable: true,
    },
    {
      accessor: 'phone_number',
      title: 'Phone',
      sortable: true,
    },
    {
      accessor: 'actions',
      title: 'Actions',
      render: (user: UserTableType) => (
        <Group gap="xs">
          <Tooltip label="Edit User">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => {
                setEditData(user);
                editModelHandler.open();
              }}
              disabled={isLoading}
            >
              <IconEdit size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete User">
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => handleDelete(user.id)}
              disabled={isLoading}
            >
              <IconTrash size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Stack>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} h={40} radius="sm" />
        ))}
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <Group justify="flex-end">
        <Button
          leftSection={<IconDownload size={16} />}
          onClick={handleExportPDF}
          disabled={isLoading}
          variant="light"
          color="blue"
        >
          Export to PDF
        </Button>
      </Group>
      
      <DataTable<UserTableType>
        minHeight={10}
        verticalSpacing="xs"
        striped
        highlightOnHover
        columns={columns}
        records={records}
        totalRecords={records.length}
        recordsPerPage={pageSize}
        page={page}
        onPageChange={(p) => setPage(p)}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={setPageSize}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        fetching={isLoading}
        loaderType="dots"
      />
    </Stack>
  );
} 