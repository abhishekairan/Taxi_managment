'use client';

import { useState, useEffect } from 'react';
import { ActionIcon, Group, Text, TextInput, Tooltip, Skeleton, Center, Stack } from '@mantine/core';
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { notifications } from '@mantine/notifications';
import { TripTableType } from '@/lib/type';
import 'mantine-datatable/styles.layer.css';

const PAGE_SIZES = [5, 10, 20];
const ICON_SIZE = 18;

type TripTableProps = {
  setEditData: (trip: TripTableType | null) => void;
  editModelHandler: { open: () => void };
  refreshTrigger?: number;
};

export default function TripTable({ setEditData, editModelHandler, refreshTrigger = 0 }: TripTableProps) {
  const [records, setRecords] = useState<TripTableType[]>([]);
  const [allRecords, setAllRecords] = useState<TripTableType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<TripTableType>>({
    columnAccessor: 'id',
    direction: 'desc',
  });
  const [queryDriver, setQueryDriver] = useState('');
  const [queryVehicle, setQueryVehicle] = useState('');

  // Load trips and apply filters
  useEffect(() => {
    const loadTrips = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/trip');
        const fetchedTrips = await response.json();
        console.log("Fetched Trips: ",fetchedTrips)
        let filteredTrips = fetchedTrips;

        // Apply search filters
        if (queryDriver) {
          filteredTrips = filteredTrips.filter((trip: any) => 
            trip.driver?.name?.toLowerCase().includes(queryDriver.toLowerCase())
          );
        }
        
        if (queryVehicle) {
          filteredTrips = filteredTrips.filter((trip: any) => 
            trip.vehicle_number?.toLowerCase().includes(queryVehicle.toLowerCase())
          );
        }

        // Store all filtered records
        setAllRecords(filteredTrips);

        // Apply sorting
        const sortedTrips = [...filteredTrips].sort((a, b) => {
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
        setRecords(sortedTrips.slice(from, to));
      } catch (error) {
        console.error('Error loading trips:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to load trips',
          color: 'red',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTrips();
  }, [page, pageSize, sortStatus, queryDriver, queryVehicle, refreshTrigger]);

  // Handle trip deletion
  const handleDelete = async (tripId: number) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/trip/${tripId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          notifications.show({
            title: 'Success',
            message: 'Trip deleted successfully',
            color: 'green',
          });
          // Refresh the data
          const updatedTrips = await fetch('/api/trip').then(res => res.json());
          setAllRecords(updatedTrips);
          setRecords(updatedTrips.slice(0, pageSize));
        } else {
          notifications.show({
            title: 'Error',
            message: 'Failed to delete trip',
            color: 'red',
          });
        }
      } catch (error) {
        console.error('Error deleting trip:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to delete trip',
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
      accessor: 'driver',
      title: 'Driver',
      sortable: true,
      filter: (
        <TextInput
          label="Driver"
          description="Show trips with driver names containing the specified text"
          placeholder="Search drivers..."
          leftSection={<IconSearch size={16} />}
          value={queryDriver}
          onChange={(e) => setQueryDriver(e.currentTarget.value)}
        />
      ),
      render: ({driver_id}: TripTableType) => <Text>{driver_id?.name || '-'}</Text>,
      filtering: queryDriver !== '',
    },
    {
      accessor: 'vehicle_number',
      title: 'Vehicle',
      sortable: true,
      filter: (
        <TextInput
          label="Vehicle"
          description="Show trips with vehicle numbers containing the specified text"
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
      sortable: true,
      render: ({start_time}: any) => (
        <Text>{start_time ? new Date(start_time).toLocaleString() : '-'}</Text>
      ),
    },
    {
      accessor: 'end_time',
      title: 'End Time',
      sortable: true,
      render: ({end_time}: any) => (
        <Text>{end_time ? new Date(end_time).toLocaleString() : '-'}</Text>
      ),
    },
    {
      accessor: 'actions',
      title: 'Actions',
      render: (trip: TripTableType) => (
        <Group gap="xs">
          <Tooltip label="Edit Trip">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => {
                setEditData(trip);
                editModelHandler.open();
              }}
              disabled={isLoading}
            >
              <IconEdit size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Trip">
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => handleDelete(trip.id ?? 0)}
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
    <DataTable<TripTableType>
      minHeight={10}
      verticalSpacing="lg"
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