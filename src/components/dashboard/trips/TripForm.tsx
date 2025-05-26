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
import { DateTimePicker } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { z } from 'zod';
import { TripsDBType, TripTableType } from '@/lib/type';

const TripFormSchema = z.object({
  id: z.number().optional(),
  driver_id: z.number().min(1, 'Driver is required'),
  vehicle_number: z.string().min(1, 'Vehicle number is required'),
  passenger_name: z.string().min(1, 'Passenger name is required'),
  from_location: z.string().min(1, 'From location is required'),
  to_location: z.string().min(1, 'To location is required'),
  start_reading: z.number().min(0, 'Start reading must be positive'),
  end_reading: z.number().optional().nullable(),
  start_time: z.string().optional().nullable(),
  end_time: z.string().optional().nullable(),
  isRunning: z.boolean(),
});

type TripFormType = z.infer<typeof TripFormSchema>;

interface TripFormProps {
  trip?: TripTableType | null;
  onClose: (shouldRefresh?: boolean) => void;
}

export default function TripForm({ trip, onClose }: TripFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TripFormType>({
    resolver: zodResolver(TripFormSchema),
    defaultValues: {
      id: trip?.id,
      driver_id: trip?.driver_id.id,
      vehicle_number: trip?.vehicle_number ?? '',
      passenger_name: trip?.passenger_name ?? '',
      from_location: trip?.from_location ?? '',
      to_location: trip?.to_location ?? '',
      start_reading: trip?.start_reading ?? 0,
      end_reading: trip?.end_reading ?? null,
      start_time: trip?.start_time ?? null,
      end_time: trip?.end_time ?? null,
      isRunning: trip?.isRunning ?? true,
    },
  });

  const onSubmit = async (values: TripFormType) => {
    try {
      const response = await fetch('/api/trips', {
        method: trip ? 'PUT' : 'POST',
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
          message: trip ? 'Trip updated successfully' : 'Trip created successfully',
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
          value={watch('driver_id')}
          onChange={(value) => setValue('driver_id', Number(value))}
        />

        <TextInput
          label="Vehicle Number"
          placeholder="Enter vehicle number"
          error={errors.vehicle_number?.message}
          {...register('vehicle_number')}
        />

        <TextInput
          label="Passenger Name"
          placeholder="Enter passenger name"
          error={errors.passenger_name?.message}
          {...register('passenger_name')}
        />

        <TextInput
          label="From Location"
          placeholder="Enter from location"
          error={errors.from_location?.message}
          {...register('from_location')}
        />

        <TextInput
          label="To Location"
          placeholder="Enter to location"
          error={errors.to_location?.message}
          {...register('to_location')}
        />

        <NumberInput
          label="Start Reading"
          placeholder="Enter start reading"
          error={errors.start_reading?.message}
          value={watch('start_reading')}
          onChange={(value) => setValue('start_reading', Number(value))}
        />

        <NumberInput
          label="End Reading"
          placeholder="Enter end reading"
          error={errors.end_reading?.message}
          value={watch('end_reading') ?? undefined}
          onChange={(value) => setValue('end_reading', value ? Number(value) : null)}
        />

        <DateTimePicker
          label="Start Time"
          placeholder="Select start time"
          value={watch('start_time') ? new Date(watch('start_time')!) : null}
          onChange={(date: Date | null) => setValue('start_time', date?.toISOString() ?? null)}
          error={errors.start_time?.message}
        />

        <DateTimePicker
          label="End Time"
          placeholder="Select end time"
          value={watch('end_time') ? new Date(watch('end_time')!) : null}
          onChange={(date: Date | null) => setValue('end_time', date?.toISOString() ?? null)}
          error={errors.end_time?.message}
        />

        <Select
          label="Status"
          placeholder="Select status"
          data={[
            { value: 'true', label: 'Running' },
            { value: 'false', label: 'Completed' },
          ]}
          error={errors.isRunning?.message}
          value={watch('isRunning')?.toString()}
          onChange={(value) => setValue('isRunning', value === 'true')}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button type="submit">
            {trip ? 'Update Trip' : 'Create Trip'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
} 