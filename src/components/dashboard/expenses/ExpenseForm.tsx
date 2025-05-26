'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  TextInput,
  Button,
  Group,
  Stack,
  Select,
  NumberInput,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { z } from 'zod';
import { ExpenseDBType, ExpenseTableType } from '@/lib/type';

const ExpenseFormSchema = z.object({
  id: z.number().optional(),
  driver_id: z.number().nullable(),
  trip_id: z.number().nullable(),
  amount: z.number().nullable(),
  description: z.string().nullable(),
});

type ExpenseFormType = z.infer<typeof ExpenseFormSchema>;

interface ExpenseFormProps {
  expense?: ExpenseTableType | null;
  onClose: (shouldRefresh?: boolean) => void;
}

export default function ExpenseForm({ expense, onClose }: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ExpenseFormType>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: {
      id: expense?.id,
      driver_id: expense?.driver_id.id ?? null,
      trip_id: expense?.trip_id ?? null,
      amount: expense?.amount ?? null,
      description: expense?.description ?? null,
    },
  });

  const onSubmit = async (values: ExpenseFormType) => {
    try {
      const response = await fetch('/api/expenses', {
        method: expense ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (result.error) {
        notifications.show({
          title: 'Error',
          message: result.error,
          color: 'red',
        });
      } else {
        notifications.show({
          title: 'Success',
          message: expense ? 'Expense updated successfully' : 'Expense created successfully',
          color: 'green',
        });
        onClose(true);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      notifications.show({
        title: 'Error',
        message: 'An unexpected error occurred',
        color: 'red',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <NumberInput
          label="Driver ID"
          placeholder="Enter driver ID"
          error={errors.driver_id?.message}
          value={watch('driver_id') ?? undefined}
          onChange={(value) => setValue('driver_id', value ? Number(value) : null)}
        />

        <NumberInput
          label="Trip ID"
          placeholder="Enter trip ID"
          error={errors.trip_id?.message}
          value={watch('trip_id') ?? undefined}
          onChange={(value) => setValue('trip_id', value ? Number(value) : null)}
        />

        <NumberInput
          label="Amount"
          placeholder="Enter amount"
          error={errors.amount?.message}
          value={watch('amount') ?? undefined}
          onChange={(value) => setValue('amount', value ? Number(value) : null)}
        />

        <TextInput
          label="Description"
          placeholder="Enter description"
          error={errors.description?.message}
          {...register('description')}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button type="submit">
            {expense ? 'Update Expense' : 'Create Expense'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
} 