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

import { DriverUserType, ExpenseDBType, ExpenseTableType } from '@/lib/type';
import DeleteExpenseModal from './DeleteExpenseModal';
import { useUserContext } from '@/context/UserContext';

const PAGE_SIZES = [5, 10, 20];

const ICON_SIZE = 18;

const fetchData = async () => {
  const expenses = await fetch(new URL('/api/expenses','http://localhost:3000'))
  const expensesData = await expenses.json()
  // console.log("expensesData:",expensesData)
  const drivers = await fetch(new URL('/api/user/driver','http://localhost:3000'))
  const driversData = await drivers.json()
  // console.log("driversData:",driversData)
  let data: ExpenseTableType[]
  if( drivers && expenses){
    data = expensesData.data.map((v: ExpenseDBType)=>{
        return {...v,driver_id:(driversData.filter((d: DriverUserType)=>d.id==v.driver_id))[0]}
    })
    return data
  }
  return []
}
const newdata = await fetchData()

type ExpenseTableProps = {
  userId?: number;
  tripId?: number;
  setEditData: any
  editModelHandler: any
  editData: any
};

const ExpenseTable = ({ userId, tripId, setEditData, editModelHandler, editData }: ExpenseTableProps) => {

  const {user} = useUserContext()
  if(user?.role == 'driver'){
    newdata.filter((item: any) => item.driver_id.id == user.userId)
  }
  // console.log(data)
  const theme = useMantineTheme();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [records, setRecords] = useState<ExpenseTableType[]>(newdata.slice(0, pageSize));
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
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
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    const updateRecords = async() => {
      const data = await fetchData()
      setRecords(data.slice(0, pageSize))
    }
    updateRecords()
  },[editData,deleteId])

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
    const d = sortBy(newdata, sortStatus.columnAccessor) as ExpenseTableType[];
    const dd = sortStatus.direction === 'desc' ? d.reverse() : d;
    let filtered = dd.slice(from, to) as ExpenseTableType[];

    if (debouncedQuery || selectedStatuses.length) {
      filtered = records
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
      filtered = records.filter(({description})=>{
        if(!description) return false
        if(debouncedQueryDescription != '' && !description?.toLowerCase().includes(debouncedQueryDescription.trim().toLowerCase())){
          return false
        }
        
          // @ts-ignore
          if (
            selectedStatuses.length &&
            !selectedStatuses.some((s) => s === status)
          ) {
            return false;
          }
          return true;
      }).slice(from,to)
    }

    setRecords(filtered);
  }, [sortStatus, page, pageSize, debouncedQuery, selectedStatuses,debouncedQueryDescription]);

  return (<>
    <DeleteExpenseModal opened={deleteOpened} Modelhandler={DeleteModelHandler} id={deleteId} setId={setDeleteId}/>
    <DataTable
      minHeight={10}
      verticalSpacing="xs"
      striped
      highlightOnHover
      // @ts-ignore
      columns={columns}
      records={records}
      // @ts-ignore
      totalRecords={
        debouncedQuery || selectedStatuses.length > 0
          ? records.length
          : newdata.length
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
