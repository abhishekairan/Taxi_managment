'use client';

import { useEffect, useState } from 'react';

import {
  ActionIcon,
  Avatar,
  Badge,
  Flex,
  Group,
  HoverCard,
  MantineColor,
  Modal,
  MultiSelect,
  Stack,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { IconCloudDownload, IconEye, IconPencil, IconSearch, IconTrash } from '@tabler/icons-react';
import sortBy from 'lodash/sortBy';
import {
  DataTable,
  DataTableProps,
  DataTableSortStatus,
} from 'mantine-datatable';
import { useRouter } from 'next/navigation';

import { PATH_INVOICES } from '@/routes';
import { EditExpenseFormType, ExpenseTableType } from '@/lib/type';
import EditExpenseModal from './EditExpenseModal';

const PAGE_SIZES = [5, 10, 20];

const ICON_SIZE = 18;


type ExpenseTableProps = {
  data: ExpenseTableType[];
  userId?: number;
  tripId?: number;
};

const ExpenseTable = ({ data, userId, tripId }: ExpenseTableProps) => {
  // console.log(data)
  const theme = useMantineTheme();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [selectedRecords, setSelectedRecords] = useState<ExpenseTableType[]>([]);
  const [records, setRecords] = useState<ExpenseTableType[]>(data.slice(0, pageSize));
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'full_name',
    direction: 'asc',
  });
  const [query, setQuery] = useState('');
  const [queryDescription, setQueryDescription] = useState('');
  const [debouncedQuery] = useDebouncedValue(query, 200);
  const [debouncedQueryDescription] = useDebouncedValue(queryDescription, 200);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const router = useRouter();

  // State for handling edit modal
  const [editOpened, editModelHandler] = useDisclosure(false)
  const [editData, setEditData] = useState<EditExpenseFormType>()

  const columns: DataTableProps<ExpenseTableType>['columns'] = [
    {
      accessor: 'id',
      render: ({id}: any) => <Text>#{id}</Text>,
      sortable: true
    },
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
    {
      accessor: '',
      title: 'Actions',
      render: (item: any) => (
        <Group gap="sm">
          <Tooltip label="Edit Expense">
            <ActionIcon 
              onClick={() =>{
                setEditData({...item,driver_id: item.driver_id.id})
                console.log("EditData:",editData)
                editModelHandler.open()
              }}>
              <IconPencil color='green' size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Expense">
            <ActionIcon>
              <IconTrash color='red' size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];
  useEffect(() => {
    setPage(1);
  }, [pageSize]);


  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const d = sortBy(data, sortStatus.columnAccessor) as ExpenseTableType[];
    const dd = sortStatus.direction === 'desc' ? d.reverse() : d;
    let filtered = dd.slice(from, to) as ExpenseTableType[];

    if (debouncedQuery || selectedStatuses.length) {
      filtered = data
        .filter(({ driver_id }) => {
          if(!driver_id?.name) return false
          if (
            debouncedQuery !== '' &&
            !driver_id.name
              .toLowerCase()
              .includes(debouncedQuery.trim().toLowerCase())
          ) {
            return false;
          }

          // @ts-ignore
          if (
            selectedStatuses.length &&
            !selectedStatuses.some((s) => s === status)
          ) {
            return false;
          }
          return true;
        })
        .slice(from, to);
    }
    if(debouncedQueryDescription || selectedStatuses.length){
      filtered = data.filter(({description})=>{
        if(debouncedQueryDescription != '' && !description?.toLocaleLowerCase().includes(debouncedQueryDescription.trim().toLowerCase())){
          return false
        }
        return true
      }).slice(from,to)
    }

    setRecords(filtered);
  }, [sortStatus, data, page, pageSize, debouncedQuery, selectedStatuses,debouncedQueryDescription]);

  return (<>
    <EditExpenseModal opened={editOpened} Modelhandler={editModelHandler} data={editData} setData={setEditData}/>
    <DataTable
      minHeight={10}
      verticalSpacing="xs"
      striped
      highlightOnHover
      // @ts-ignore
      columns={columns}
      records={records}
      selectedRecords={selectedRecords}
      // @ts-ignore
      onSelectedRecordsChange={setSelectedRecords}
      totalRecords={
        debouncedQuery || selectedStatuses.length > 0
          ? records.length
          : data.length
      }
      recordsPerPage={pageSize}
      page={page}
      onPageChange={(p) => setPage(p)}
      recordsPerPageOptions={PAGE_SIZES}
      onRecordsPerPageChange={setPageSize}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
    />
  </>);
};

export default ExpenseTable;
