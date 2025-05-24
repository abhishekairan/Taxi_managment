'use client';

import { useEffect, useState } from 'react';
import { ActionIcon, Group, Text, TextInput, Tooltip, useMantineTheme } from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { IconPencil, IconSearch, IconTrash } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useUserContext } from '@/context/UserContext';
import { TripsDBType } from '@/lib/type';
import DeleteTripModal from './DeleteTripModal';

const PAGE_SIZES = [5, 10, 20];
const ICON_SIZE = 18;

const fetchData = async () => {
  const trips = await fetch(new URL('/api/trip','http://localhost:3000'));
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
  const theme = useMantineTheme();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [records, setRecords] = useState<TripsDBType[]>([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<TripsDBType>>({
    columnAccessor: 'created_at',
    direction: 'desc',
  });
  const [queryVehicle, setQueryVehicle] = useState('');
  const [queryPassenger, setQueryPassenger] = useState('');
  const [debouncedQueryVehicle] = useDebouncedValue(queryVehicle, 200);
  const [debouncedQueryPassenger] = useDebouncedValue(queryPassenger, 200);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // State for handling delete modal
  const [deleteOpened, DeleteModelHandler] = useDisclosure(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const updateRecords = async() => {
      const data = await fetchData();
      let filteredData = data;
      
      // Filter by user if driver
      if(user?.role === 'driver') {
        filteredData = data.filter((item: TripsDBType) => item.driver_id === Number(user.userId));
      }
      
      setRecords(filteredData.slice(0, pageSize));
    };
    updateRecords();
  }, [editData, deleteId, user, pageSize]);

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
      render: (record: TripsDBType) => <Text>{new Date(record.start_time || '').toLocaleString()}</Text>,
      sortable: true,
    },
    {
      accessor: 'end_time',
      title: 'End Time',
      render: (record: TripsDBType) => record.end_time ? <Text>{new Date(record.end_time).toLocaleString()}</Text> : '-',
      sortable: true,
    },
    {
      accessor: 'isRunning',
      title: 'Status',
      render: (record: TripsDBType) => <Text color={record.isRunning ? 'green' : 'blue'}>{record.isRunning ? 'Active' : 'Completed'}</Text>,
      sortable: true,
    },
    {
      accessor: 'actions',
      title: 'Actions',
      render: (record: TripsDBType) => (
        <Group gap="sm">
          <Tooltip label="Edit Trip">
            <ActionIcon 
              onClick={() => {
                setEditData(record);
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
    <DataTable<TripsDBType>
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
