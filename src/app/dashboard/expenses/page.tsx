'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Group, Button, Paper, Modal, LoadingOverlay } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { ExpenseDBType, ExpenseTableType } from '@/lib/type';
import ExpenseForm from '@/components/dashboard/expenses/ExpenseForm';
import ExpenseTable from '@/components/dashboard/expenses/ExpenseTable';

export default function ExpensesPage() {
  const [selectedExpense, setSelectedExpense] = useState<ExpenseTableType | null>(null);
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
    setSelectedExpense(null);
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
          <Title order={2}>Expense Management</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setIsFormOpen(true)}
          >
            Add Expense
          </Button>
        </Group>

        <ExpenseTable
          setEditData={setSelectedExpense}
          editModelHandler={{
            open: () => setIsFormOpen(true),
          }}
          refreshTrigger={refreshKey}
        />
      </Paper>

      <Modal
        opened={isFormOpen}
        onClose={() => handleFormClose()}
        title={selectedExpense ? 'Edit Expense' : 'Add New Expense'}
        size="md"
      >
        <ExpenseForm 
          expense={selectedExpense} 
          onClose={handleFormClose}
        />
      </Modal>
    </Container>
  );
} 