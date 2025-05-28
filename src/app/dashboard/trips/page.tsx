'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Group, Button, Paper, Modal, LoadingOverlay } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { TripsDBType, TripTableType } from '@/lib/type';
import TripForm from '@/components/dashboard/trips/TripForm';
import TripTable from '@/components/dashboard/trips/TripTable';

export default function TripsPage() {
  const [selectedTrip, setSelectedTrip] = useState<TripTableType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Show loading for at least 1 second

    return () => clearTimeout(timer);
  }, []);

  const handleFormClose = (shouldRefresh?: boolean) => {
    setIsFormOpen(false);
    setSelectedTrip(null);
    if (shouldRefresh) {
      setRefreshKey(prev => prev + 1); // Increment refresh key to trigger table reload
    }
  };

  return (
    <Container size="2xl" pos="relative">
      <LoadingOverlay 
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ type: "dots" }}
      />
      
      <Paper p="md" radius="md">
        <Group justify="space-between" mb="lg">
          <Title order={2}>Trip Management</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setIsFormOpen(true)}
          >
            Add Trip
          </Button>
        </Group>

        <TripTable
          setEditData={setSelectedTrip}
          editModelHandler={{
            open: () => setIsFormOpen(true),
          }}
          refreshTrigger={refreshKey}
        />
      </Paper>

      <Modal
        opened={isFormOpen}
        onClose={() => handleFormClose()}
        title={selectedTrip ? 'Edit Trip' : 'Add New Trip'}
        size="md"
      >
        <TripForm 
          trip={selectedTrip} 
          onClose={handleFormClose}
        />
      </Modal>
    </Container>
  );
} 