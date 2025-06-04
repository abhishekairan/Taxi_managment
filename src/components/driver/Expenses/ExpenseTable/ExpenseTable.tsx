'use client';

import { useEffect, useState } from 'react';

import {
  ActionIcon,
  Group,
  Text,
  TextInput,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import {  IconPencil, IconSearch, IconTrash } from '@tabler/icons-react';
import sortBy from 'lodash/sortBy';
import {
  DataTable,
  DataTableProps,
  DataTableSortStatus,
} from 'mantine-datatable';
import 'mantine-datatable/styles.layer.css';

import { ExpenseTableType } from '@/lib/type';
import DeleteExpenseModal from './DeleteExpenseModal';
import { useUserContext } from '@/context/UserContext';

const PAGE_SIZES = [5, 10, 20];

const ICON_SIZE = 18;

const fetchData = async () => {
  const expenses = await fetch(new URL('/api/expenses', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'))
  const expensesData = await expenses.json()
  return expensesData || []
}

type ExpenseTableProps = {
  userId?: number;
  tripId?: number;
  setEditData: any
  editModelHandler: any
  editData: any
};

const ExpenseTable = ({ setEditData, editModelHandler, editData }: ExpenseTableProps) => {
  const {user} = useUserContext()
  const [data, setData] = useState<ExpenseTableType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1]);
  const [records, setRecords] = useState<ExpenseTableType[]>([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<ExpenseTableType>>({
    columnAccessor: 'full_name',
    direction: 'asc',
  });
  const [query, setQuery] = useState('');
  const [queryDescription, setQueryDescription] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [debouncedQueryDescription] = useDebouncedValue(queryDescription, 200);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  // console.log(records.filter((item: any) => item.id==2))

  // State for handling edit modal
  const [deleteOpened, DeleteModelHandler] = useDisclosure(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)  // Fetch expense data
  useEffect(() => {
    const updateData = async() => {
      try {
        setIsLoading(true);
        const fetchedData = await fetchData();
        let filteredData = fetchedData;
        if(user?.role?.toLowerCase() === 'driver' && user?.userId){
          filteredData = fetchedData.filter((item: ExpenseTableType) => 
            item.driver_id.id === Number(user.userId)
          );
        }
        setData(filteredData);
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      } finally {
        setIsLoading(false);
      }
    }
    updateData();
  }, [editData, deleteId, user?.role, user?.userId]);

  const columns: DataTableProps<ExpenseTableType>['columns'] = [
    {
      accessor: 'id',
      render: ({id}: any) => <Text>#{id}</Text>,
      sortable: true
    },
    {
      accessor: 'amount',
      sortable: true,
      render: (item: any) => <Text>₹{item.amount}</Text>,
    },
    {
      accessor: 'description',
      render: (item: any) => <Text>{item.description}</Text>,
      filter: (
        <TextInput
          label="Description"
          description="Show expenses whose include the specified text"
          placeholder="Search expenses"
          leftSection={<IconSearch size={16} />}
          value={queryDescription}
          onChange={(e) => setQueryDescription(e.currentTarget.value)}
        />),
      filtering: queryDescription !== '',
    },
    {
      accessor: 'created_at',
      title: 'Date',
      sortable: true,
      render:(item: any)=> <Text>{new Date(item.created_at).toDateString()}</Text>
    },
    
  ];

  const columnDriverName = 
    {
      accessor: 'driver_id.name',
      title: 'Driver',
      render: ({driver_id}: any) => <Text>{driver_id.name}</Text>,
      sortable: true,
      filter: (
        <TextInput
          label="Drivers"
          description="Show drivers whose names include the specified text"
          placeholder="Search drivers..."
          leftSection={<IconSearch size={16} />}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
        />
      ),
      filtering: query !== '',
    }

  const columnAction = {
      accessor: '',
      title: 'Actions',
      render: (item: any) => (
        <Group gap="sm">
          <Tooltip label="Edit Expense">
            <ActionIcon 
              onClick={() =>{
                setEditData({...item,driver_id: item.driver_id.id})
                editModelHandler.open()
              }}>
              <IconPencil color='green' size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Expense">
            <ActionIcon
              onClick={() =>{
                setDeleteId(item.id)
                DeleteModelHandler.open()
              }}>
              <IconTrash color='red' size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    }
    {user?.role == 'admin' && columns.push(columnDriverName)}
    columns.push(columnAction)
  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    
    // First sort the data
    const sortedData = sortBy(data, sortStatus.columnAccessor) as ExpenseTableType[];
    if (sortStatus.direction === 'desc') {
      sortedData.reverse();
    }

    // Then apply filters
    let filteredData = sortedData;
    
    if (debouncedQuery) {
      filteredData = filteredData.filter(({ driver_id }) => {
        if (!driver_id?.name) return false;
        return driver_id.name.toLowerCase().includes(debouncedQuery.trim().toLowerCase());
      });
    }

    if (debouncedQueryDescription) {
      filteredData = filteredData.filter(({ description }) => {
        if (!description) return false;
        return description.toLowerCase().includes(debouncedQueryDescription.trim().toLowerCase());
      });
    }

    // Removed status filtering as 'status' property does not exist in ExpenseTableType

    // Finally apply pagination
    const paginatedData = filteredData.slice(from, to);
    setRecords(paginatedData);
  }, [sortStatus, page, pageSize, debouncedQuery, selectedStatuses,debouncedQueryDescription]);
  return (<>
    <DeleteExpenseModal opened={deleteOpened} Modelhandler={DeleteModelHandler} id={deleteId} setId={setDeleteId}/>
    <DataTable<ExpenseTableType>
      minHeight={10}
      verticalSpacing="xs"
      striped
      highlightOnHover
      columns={columns}
      records={records}
      totalRecords={data.length}
      recordsPerPage={pageSize}
      page={page}
      onPageChange={(p) => setPage(p)}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={setPageSize}
      sortStatus={sortStatus}
      onSortStatusChange={(status) => setSortStatus(status)}
      fetching={isLoading}
      noRecordsText={isLoading ? "Loading..." : "No expenses found"}
    />
  </>);
};

export default ExpenseTable;
