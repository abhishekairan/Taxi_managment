'use client';

import { useState, useEffect } from 'react';
import { ActionIcon, Group, Text, TextInput, Tooltip, Skeleton, Center, Stack } from '@mantine/core';
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { notifications } from '@mantine/notifications';
import { ExpenseTableType } from '@/lib/type';
import 'mantine-datatable/styles.layer.css';

const PAGE_SIZES = [5, 10, 20];
const ICON_SIZE = 18;

type ExpenseTableProps = {
  setEditData: (expense: ExpenseTableType | null) => void;
  editModelHandler: { open: () => void };
  refreshTrigger?: number;
};

export default function ExpenseTable({ setEditData, editModelHandler, refreshTrigger = 0 }: ExpenseTableProps) {
  const [records, setRecords] = useState<ExpenseTableType[]>([]);
  const [allRecords, setAllRecords] = useState<ExpenseTableType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<ExpenseTableType>>({
    columnAccessor: 'id',
    direction: 'desc',
  });
  const [queryDriver, setQueryDriver] = useState('');
  const [queryDescription, setQueryDescription] = useState('');

  // Load expenses and apply filters
  useEffect(() => {
    const loadExpenses = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/expenses');
        const fetchedExpenses = await response.json();
        let filteredExpenses = fetchedExpenses;

        // Apply search filters
        if (queryDriver) {
          filteredExpenses = filteredExpenses.filter((expense: any) => 
            expense.driver?.name?.toLowerCase().includes(queryDriver.toLowerCase())
          );
        }
        
        if (queryDescription) {
          filteredExpenses = filteredExpenses.filter((expense: any) => 
            expense.description?.toLowerCase().includes(queryDescription.toLowerCase())
          );
        }

        // Store all filtered records
        setAllRecords(filteredExpenses);

        // Apply sorting
        const sortedExpenses = [...filteredExpenses].sort((a, b) => {
          const aValue = a[sortStatus.columnAccessor as keyof ExpenseTableType];
          const bValue = b[sortStatus.columnAccessor as keyof ExpenseTableType];

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

        // Apply pagination
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setRecords(sortedExpenses.slice(from, to));
      } catch (error) {
        console.error('Error loading expenses:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to load expenses',
          color: 'red',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadExpenses();
  }, [page, pageSize, sortStatus, queryDriver, queryDescription, refreshTrigger]);

  // Handle expense deletion
  const handleDelete = async (expenseId: number) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/expenses?id=${expenseId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          notifications.show({
            title: 'Success',
            message: 'Expense deleted successfully',
            color: 'green',
          });
          // Refresh the data
          const updatedExpenses = await fetch('/api/expenses').then(res => res.json());
          setRecords(updatedExpenses);
        } else {
          notifications.show({
            title: 'Error',
            message: 'Failed to delete expense',
            color: 'red',
          });
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to delete expense',
          color: 'red',
        });
      }
      setIsLoading(false);
    }
  };

  const columns = [
    {
      accessor: 'id',
      render: ({id}: any) => <Text>#{id}</Text>,
      sortable: true
    },
    {
      accessor: 'driver_id',
      title: 'Driver',
      sortable: true,
      filter: (
        <TextInput
          label="Driver"
          description="Show expenses with driver names containing the specified text"
          placeholder="Search drivers..."
          leftSection={<IconSearch size={16} />}
          value={queryDriver}
          onChange={(e) => setQueryDriver(e.currentTarget.value)}
        />
      ),
      render: ({driver_id}: any) => <Text>{driver_id.name || 'N/A'}</Text>,
      filtering: queryDriver !== '',
    },
    {
      accessor: 'trip_id',
      title: 'Trip ID',
      sortable: true,
    },
    {
      accessor: 'amount',
      title: 'Amount',
      sortable: true,
      render: ({amount}: any) => <Text>₹{amount}</Text>,
    },
    {
      accessor: 'description',
      title: 'Description',
      sortable: true,
      filter: (
        <TextInput
          label="Description"
          description="Show expenses with descriptions containing the specified text"
          placeholder="Search descriptions..."
          leftSection={<IconSearch size={16} />}
          value={queryDescription}
          onChange={(e) => setQueryDescription(e.currentTarget.value)}
        />
      ),
      filtering: queryDescription !== '',
    },
    {
      accessor: 'created_at',
      title: 'Created At',
      sortable: true,
      render: ({created_at}: any) => (
        <Text>{created_at ? new Date(created_at).toLocaleString() : '-'}</Text>
      ),
    },
    {
      accessor: 'actions',
      title: 'Actions',
      render: (expense: ExpenseTableType) => (
        <Group gap="xs">
          <Tooltip label="Edit Expense">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => {
                setEditData(expense);
                editModelHandler.open();
              }}
              disabled={isLoading}
            >
              <IconEdit size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Expense">
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => handleDelete(expense.id ?? 0)}
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
    <DataTable<ExpenseTableType>
      minHeight={10}
      verticalSpacing="xs"
      striped
      highlightOnHover
      columns={columns}
      records={records}
      totalRecords={allRecords.length}
      recordsPerPage={pageSize}
      page={page}
      onPageChange={setPage}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={setPageSize}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
    />
  );
} 