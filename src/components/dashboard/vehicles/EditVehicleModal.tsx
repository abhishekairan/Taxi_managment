'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, TextInput, NumberInput, Button, Group } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { VehicleDBType } from '@/lib/type';
import { z } from 'zod';

// Vehicle Form Schema for validation
const VehicleFormSchema = z.object({
  id: z.number().optional(),
  vehicle_number: z.string().min(1, "Vehicle number is required"),
  speedometer_reading: z.number().min(0, "Speedometer reading must be positive").nullable(),
  default_passenger: z.string().nullable().optional(),
  default_from_location: z.string().nullable().optional(),
  default_to_location: z.string().nullable().optional(),
});

type VehicleFormType = z.infer<typeof VehicleFormSchema>;

type EditVehicleModalProps = {
  opened: boolean;
  onClose: (shouldRefresh?: boolean) => void;
  data: VehicleDBType | null;
};

export default function EditVehicleModal({ opened, onClose, data }: EditVehicleModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<VehicleFormType>({
    resolver: zodResolver(VehicleFormSchema),
    defaultValues: data || {
      vehicle_number: '',
      speedometer_reading: 0,
      default_passenger: '',
      default_from_location: '',
      default_to_location: '',
    }
  });

  const onSubmit = async (values: VehicleFormType) => {
    try {
      const endpoint = values.id ? `/api/vehicle/${values.id}` : '/api/vehicle';
      const method = values.id ? 'UPDATE' : 'PUT';
        // console.log('Submitting vehicle data:', values);
        // console.log('Endpoint:', endpoint);
        // console.log('Method:', method);
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to save vehicle');
      }

      notifications.show({
        title: 'Success',
        message: `Vehicle ${values.id ? 'updated' : 'created'} successfully`,
        color: 'green',
      });

      reset();
      onClose(true);
    } catch (error) {
      console.error('Error saving vehicle:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to save vehicle',
        color: 'red',
      });
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={() => {
        reset();
        onClose();
      }}
      title={data ? 'Edit Vehicle' : 'Add Vehicle'}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label="Vehicle Number"
          placeholder="Enter vehicle number"
          required
          {...register('vehicle_number')}
          error={errors.vehicle_number?.message}
          mb="sm"
        />

        <TextInput
          label="Speedometer Reading"
          placeholder="Current speedometer reading"
          {...register('speedometer_reading', { 
            setValueAs: v => v === '' ? null : Number(v)
          })}
          error={errors.speedometer_reading?.message}
          mb="sm"
        />

        <TextInput
          label="Default From Location"
          placeholder="Default starting location"
          {...register('default_from_location')}
          error={errors.default_from_location?.message}
          mb="sm"
        />

        <TextInput
          label="Default To Location"
          placeholder="Default destination"
          {...register('default_to_location')}
          error={errors.default_to_location?.message}
          mb="sm"
        />

        <TextInput
          label="Default Passenger"
          placeholder="Default passenger name"
          {...register('default_passenger')}
          error={errors.default_passenger?.message}
          mb="md"
        />

        <Group justify="flex-end">
          <Button variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {data ? 'Update' : 'Create'}
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
