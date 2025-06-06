"use client";

import { Modal, TextInput, NumberInput, Button, Group, Select, ComboboxItem, Text } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TripFormObject, TripFormSchema } from '@/lib/type';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import submitTrip from '@/app/actions/submitTrip';
import { useUserContext } from '@/context/UserContext';
import { get } from 'lodash';

const EditTripModal = ({ opened, Modelhandler, data, setData }: any) => {
  const router = useRouter();
  const { user } = useUserContext();
  const [vehicleSelect, setVehicleSelect] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('/api/vehicle');
        const vehicleData = await response.json();
        if (vehicleData) {
          const options = vehicleData.map((v: any) => ({
            value: v.vehicle_number,
            label: v.vehicle_number
          }));
          setVehicleSelect(options);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles();
  }, []);

  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues
  } = useForm<TripFormObject>({
    resolver: zodResolver(TripFormSchema),
    defaultValues: data
  });

  useEffect(() => {
    if (data) {
      reset(data);
    } else {
      reset({
        driver_id: user?.userId ? Number(user.userId) : undefined,
        isRunning: true
      });
    }
  }, [data, reset, user]);

  const onSubmit = async (values: TripFormObject) => {
    // console.log("Submitted values:", values);
    const response = await submitTrip(values);
    if(response) {
      setData(response);
      Modelhandler.close();
      router.refresh();
    }
  };

  const isRunning = watch('isRunning');

  const handleVehicleSelect = (value: string | null,obj: ComboboxItem) => {
    if (value) {
      obj.value = value;
      setValue('vehicle_number', value);
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={() => {
        reset();
        Modelhandler.close();
      }}
      title={data ? "Edit Trip" : "Create Trip"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Select
          {...register('vehicle_number')}
          label="Vehicle Number"
          placeholder="Select vehicle"
          data={vehicleSelect}
          defaultValue={String(data?.vehicle_number)}
          onChange={handleVehicleSelect}
          searchable
          error={errors.vehicle_number?.message}
          mb="sm"
        />
        {errors?.vehicle_number && (
          <Text
            c="red"
            size="sm"
          >{`${errors.vehicle_number.message}`}</Text>
        )}
        
        <TextInput
          label="Passenger Name"
          placeholder="Enter passenger name"
          {...register('passenger_name')}
          error={errors.passenger_name?.message}
          mb="sm"
        />
        {errors?.passenger_name && (
          <Text
            c="red"
            size="sm"
          >{`${errors.passenger_name.message}`}</Text>
        )}

        <TextInput
          label="From Location"
          placeholder="Enter start location"
          {...register('from_location')}
          error={errors.from_location?.message}
          mb="sm"
        />
        {errors?.from_location && (
          <Text
            c="red"
            size="sm"
          >{`${errors.from_location.message}`}</Text>
        )}

        <TextInput
          label="To Location"
          placeholder="Enter destination"
          {...register('to_location')}
          error={errors.to_location?.message}
          mb="sm"
        />
        {errors?.to_location && (
          <Text
            c="red"
            size="sm"
          >{`${errors.to_location.message}`}</Text>
        )}

        <TextInput
          label="Start Reading"
          placeholder="Enter start reading"
          {...register('start_reading', { valueAsNumber: true })}
          error={errors.start_reading?.message}
          mb="sm"
        />
        {errors?.start_reading && (
          <Text
            c="red"
            size="sm"
          >{`${errors.start_reading.message}`}</Text>
        )}

        {!isRunning && (
          <TextInput
            label="End Reading"
            placeholder="Enter end reading"
            {...register('end_reading', { valueAsNumber: true })}
            error={errors.end_reading?.message}
            mb="sm"
          />
        )}
        {errors?.end_reading && (
          <Text
            c="red"
            size="sm"
          >{`${errors.end_reading.message}`}</Text>
        )}
        <Group justify="flex-end" mt="md">
          <Button type="submit" variant="filled">
            {data ? "Update Trip" : "Create Trip"}
          </Button>
        </Group>
      </form>
    </Modal>
  );
};

export default EditTripModal;
