'use client';

import { useEffect, useState } from 'react';
import { ActionIcon, Group, Text, TextInput, Tooltip } from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { IconPencil, IconSearch, IconTrash } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useUserContext } from '@/context/UserContext';
import { TripTableType } from '@/lib/type';
import DeleteTripModal from './DeleteTripModal';
import 'mantine-datatable/styles.layer.css';

const PAGE_SIZES = [5, 10, 20];
const ICON_SIZE = 18;

const fetchData = async () => {
  const trips = await fetch(new URL('/api/trip', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'));
  const tripsData = await trips.json();
  return tripsData || [];
};

type TripTableProps = {
  setEditData: any;
  editModelHandler: any;
  editData: any;
};

const TripTable = ({ setEditData, editModelHandler, editData }: TripTableProps) => {
  const {user} = useUserContext();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [records, setRecords] = useState<TripTableType[]>([]);  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<TripTableType>>({
    columnAccessor: 'id',
    direction: 'desc',
  });
  const [queryVehicle, setQueryVehicle] = useState('');
  const [queryPassenger, setQueryPassenger] = useState('');
  const [debouncedQueryVehicle] = useDebouncedValue(queryVehicle, 200);
  const [debouncedQueryPassenger] = useDebouncedValue(queryPassenger, 200);

  // State for handling delete modal
  const [deleteOpened, DeleteModelHandler] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  useEffect(() => {
    const updateRecords = async() => {
      const data = await fetchData();
      let filteredData = data;
      
      // Filter by user if driver
      if(user?.role === 'driver') {
        filteredData = data.filter((item: TripTableType) => item.driver_id.id === Number(user.userId));
        // console.log("User is a driver, filtered trips by user ID:", data);

      }

      // Apply search filters
      if (debouncedQueryVehicle) {
        filteredData = filteredData.filter((item: TripTableType) => 
          item.vehicle_number.toLowerCase().includes(debouncedQueryVehicle.toLowerCase())
        );
      }
      
      if (debouncedQueryPassenger) {
        filteredData = filteredData.filter((item: TripTableType) => 
          item.passenger_name.toLowerCase().includes(debouncedQueryPassenger.toLowerCase())
        );
      }

      // Apply sorting
      const sortedData = [...filteredData].sort((a, b) => {
        const aValue = a[sortStatus.columnAccessor as keyof TripTableType];
        const bValue = b[sortStatus.columnAccessor as keyof TripTableType];

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
      setRecords(sortedData.slice(from, to));
    };
    updateRecords();
  }, [editData, deleteId, user, pageSize, debouncedQueryVehicle, debouncedQueryPassenger, sortStatus, page]);

  const columns = [
    {
      accessor: 'id',
      render: ({id}: any) => <Text>#{id}</Text>,
      sortable: true
    },
    {
      accessor: 'vehicle_number',
      title: 'Vehicle',
      sortable: true,
      filter: (
        <TextInput
          label="Vehicle"
          description="Show trips with vehicle number containing the specified text"
          placeholder="Search vehicles..."
          leftSection={<IconSearch size={16} />}
          value={queryVehicle}
          onChange={(e) => setQueryVehicle(e.currentTarget.value)}
        />
      ),
      filtering: queryVehicle !== '',
    },
    {
      accessor: 'passenger_name',
      title: 'Passenger',
      sortable: true,
      filter: (
        <TextInput
          label="Passenger"
          description="Show trips with passenger names containing the specified text"
          placeholder="Search passengers..."
          leftSection={<IconSearch size={16} />}
          value={queryPassenger}
          onChange={(e) => setQueryPassenger(e.currentTarget.value)}
        />
      ),
      filtering: queryPassenger !== '',
    },
    {
      accessor: 'from_location',
      title: 'From',
      sortable: true,
    },
    {
      accessor: 'to_location',
      title: 'To',
      sortable: true,
    },
    {
      accessor: 'start_reading',
      title: 'Start Reading',
      sortable: true,
    },
    {
      accessor: 'end_reading',
      title: 'End Reading',
      sortable: true,
    },
    {
      accessor: 'start_time',
      title: 'Start Time',
      render: (record: TripTableType) => <Text>{new Date(record.start_time || '').toLocaleString()}</Text>,
      sortable: true,
    },
    {
      accessor: 'end_time',
      title: 'End Time',
      render: (record: TripTableType) => record.end_time ? <Text>{new Date(record.end_time).toLocaleString()}</Text> : '-',
      sortable: true,
    },
    {
      accessor: 'isRunning',
      title: 'Status',
      render: (record: TripTableType) => <Text color={record.isRunning ? 'green' : 'blue'}>{record.isRunning ? 'Active' : 'Completed'}</Text>,
      sortable: true,
    },
    {
      accessor: 'actions',
      title: 'Actions',
      render: (record: TripTableType) => (
        <Group gap="sm">
          <Tooltip label="Edit Trip">
            <ActionIcon 
              onClick={() => {
                // console.log("record to be set for editing:",record)
                setEditData({...record, driver_id: record.driver_id.id});
                editModelHandler.open();
              }}>
              <IconPencil color='green' size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Trip">
            <ActionIcon
              onClick={() => {
                setDeleteId(record.id || null);
                DeleteModelHandler.open();
              }}>
              <IconTrash color='red' size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];

  return (<>
    <DeleteTripModal opened={deleteOpened} Modelhandler={DeleteModelHandler} id={deleteId} setId={setDeleteId}/>    
    <DataTable<TripTableType>
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
    />
  </>);
};

export default TripTable;
