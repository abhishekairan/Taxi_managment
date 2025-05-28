'use client';

import { useState, useEffect } from 'react';
import { ActionIcon, Group, Text, TextInput, Tooltip, Skeleton, Stack } from '@mantine/core';
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { notifications } from '@mantine/notifications';
import { VehicleDBType } from '@/lib/type';
import 'mantine-datatable/styles.layer.css';

const PAGE_SIZES = [5, 10, 20];
const ICON_SIZE = 18;

type VehicleTableProps = {
  setEditData: (vehicle: VehicleDBType | null) => void;
  editModelHandler: { open: () => void };
  refreshTrigger?: number;
};

export default function VehicleTable({ setEditData, editModelHandler, refreshTrigger = 0 }: VehicleTableProps) {
  const [records, setRecords] = useState<VehicleDBType[]>([]);
  const [allRecords, setAllRecords] = useState<VehicleDBType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<VehicleDBType>>({
    columnAccessor: 'id',
    direction: 'desc',
  });
  const [queryVehicleNumber, setQueryVehicleNumber] = useState('');
  const [queryFromLocation, setQueryFromLocation] = useState('');

  // Load vehicles and apply filters
  useEffect(() => {
    const loadVehicles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/vehicle');
        const fetchedVehicles = await response.json();
        let filteredVehicles = fetchedVehicles;

        // Apply search filters
        if (queryVehicleNumber) {
          filteredVehicles = filteredVehicles.filter((vehicle: VehicleDBType) => 
            vehicle.vehicle_number?.toLowerCase().includes(queryVehicleNumber.toLowerCase())
          );
        }
        
        if (queryFromLocation) {
          filteredVehicles = filteredVehicles.filter((vehicle: VehicleDBType) => 
            vehicle.default_from_location?.toLowerCase().includes(queryFromLocation.toLowerCase())
          );
        }

        // Store all filtered records
        setAllRecords(filteredVehicles);

        // Apply sorting
        const sortedVehicles = [...filteredVehicles].sort((a, b) => {
          const aValue = a[sortStatus.columnAccessor as keyof VehicleDBType];
          const bValue = b[sortStatus.columnAccessor as keyof VehicleDBType];

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
        setRecords(sortedVehicles.slice(from, to));
      } catch (error) {
        console.error('Error loading vehicles:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to load vehicles',
          color: 'red',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicles();
  }, [page, pageSize, sortStatus, queryVehicleNumber, queryFromLocation, refreshTrigger]);

  // Handle vehicle deletion
  const handleDelete = async (vehicleId: number) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/vehicle/${vehicleId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          notifications.show({
            title: 'Success',
            message: 'Vehicle deleted successfully',
            color: 'green',
          });
          // Refresh the data
          const updatedVehicles = await fetch('/api/vehicle').then(res => res.json());
          setRecords(updatedVehicles);
        } else {
          notifications.show({
            title: 'Error',
            message: 'Failed to delete vehicle',
            color: 'red',
          });
        }
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to delete vehicle',
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
      accessor: 'vehicle_number',
      title: 'Vehicle Number',
      sortable: true,
      filter: (
        <TextInput
          label="Vehicle Number"
          description="Show vehicles with numbers containing the specified text"
          placeholder="Search vehicle numbers..."
          leftSection={<IconSearch size={16} />}
          value={queryVehicleNumber}
          onChange={(e) => setQueryVehicleNumber(e.currentTarget.value)}
        />
      ),
      filtering: queryVehicleNumber !== '',
    },
    {
      accessor: 'speedometer_reading',
      title: 'Speedometer',
      sortable: true,
      render: ({speedometer_reading}: VehicleDBType) => <Text>{speedometer_reading || '-'}</Text>,
    },
    {
      accessor: 'default_from_location',
      title: 'Default From',
      sortable: true,
      filter: (
        <TextInput
          label="From Location"
          description="Show vehicles with default from locations containing the specified text"
          placeholder="Search locations..."
          leftSection={<IconSearch size={16} />}
          value={queryFromLocation}
          onChange={(e) => setQueryFromLocation(e.currentTarget.value)}
        />
      ),
      render: ({default_from_location}: VehicleDBType) => <Text>{default_from_location || '-'}</Text>,
      filtering: queryFromLocation !== '',
    },
    {
      accessor: 'default_to_location',
      title: 'Default To',
      sortable: true,
      render: ({default_to_location}: VehicleDBType) => <Text>{default_to_location || '-'}</Text>,
    },
    {
      accessor: 'default_passenger',
      title: 'Default Passenger',
      sortable: true,
      render: ({default_passenger}: VehicleDBType) => <Text>{default_passenger || '-'}</Text>,
    },
    {
      accessor: 'actions',
      title: 'Actions',
      render: (vehicle: VehicleDBType) => (
        <Group gap="xs">
          <Tooltip label="Edit Vehicle">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => {
                setEditData(vehicle);
                editModelHandler.open();
              }}
              disabled={isLoading}
            >
              <IconEdit size={ICON_SIZE} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete Vehicle">
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => handleDelete(vehicle.id? vehicle.id : 0)}
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
    <DataTable<VehicleDBType>
      minHeight={10}
      verticalSpacing="xs"
      striped
      highlightOnHover
      columns={columns}
      records={records}
      totalRecords={allRecords.length}
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
  );
}
