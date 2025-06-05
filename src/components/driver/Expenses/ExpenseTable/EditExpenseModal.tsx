"use client";

import EditExpenseModelSubmit from "@/app/actions/EditExpenseModelSubmit";
import { DriverUserType, EditExpenseFormSchema, EditExpenseFormType, ExpenseDBSchema, TripsDBType } from "@/lib/type";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  ComboboxItem,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconCar, IconCurrencyRupee, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const EditExpenseModal = ({ opened, Modelhandler, data, setData }: any) => {
  const router = useRouter();
  const [driverSelect, setDriverSelect] = useState<{label: string, value: string}[]>([]);
  const [tripSelect, setTripSelect] = useState<{label: string, value: string}[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch drivers
        const driversResponse = await fetch(new URL('/api/user/driver', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'));
        const drivers = await driversResponse.json();
        const driverOptions = drivers.map((d: DriverUserType) => ({
          value: String(d.id),
          label: d.name || ""
        }));
        setDriverSelect(driverOptions);

        // Fetch trips
        const tripsResponse = await fetch(new URL('/api/trip', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'));
        const trips = await tripsResponse.json();
        const tripOptions = trips.map((v: TripsDBType) => ({
          value: String(v.id),
          label: `${new Date(v.end_time).toDateString()} - ${v.vehicle_number}`
        }));
        setTripSelect(tripOptions);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    getValues,
    reset,
    setValue
  } = useForm<EditExpenseFormType>({
    resolver: zodResolver(EditExpenseFormSchema),
    defaultValues: data
  });

  useEffect(() => {
    if (data) {
      reset(data); 
    }
  }, [data, reset,setData]);

  const onSelectDriverId = (value:string | null, obj: ComboboxItem) => {
    if(value){
      obj.value = value
      setValue("driver_id",value)
    }
  }
  const onSelectTripId = (value:string | null, obj: ComboboxItem) => {
    if(value){
      obj.value = value
      setValue("trip_id",value)
    }
  }
  const onSubmit = async (values: EditExpenseFormType) => {
    const response = await EditExpenseModelSubmit(values)
    if(response){
      setData({...response,id: undefined})
      reset({
        driver_id: String(response.driver_id),
        trip_id: String(response.trip_id),
        amount: response.amount? response.amount : undefined,
        description: response.description? response.description : undefined,
        id: undefined
      })
      Modelhandler.close()
      router.refresh()
    }
  }
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          Modelhandler.close();
        }}
        withCloseButton
        title="Edit Expense"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Select
              {...register("driver_id")}
              data = {driverSelect}
              label="Select Driver"
              defaultValue={String(getValues('driver_id'))}
              onChange={onSelectDriverId}
              leftSection={<IconUser size={20} />}
            />
            {errors?.driver_id && (
              <Text
                c="red"
                size="sm"
              >{`${errors.driver_id.message}`}</Text>
            )}
            <Select
              {...register("trip_id")}
              data={tripSelect}
              placeholder="Select Trip"
              defaultValue={String(getValues('trip_id'))}
              onChange={onSelectTripId}
              leftSection={<IconCar size={20} />}
            />
            {errors?.trip_id && (
              <Text
                c="red"
                size="sm"
              >{`${errors.trip_id.message}`}</Text>
            )}
            <TextInput
              {...register("amount")}
              placeholder="Enter Amount"
              leftSection={<IconCurrencyRupee size={20} />}
            />
            {errors?.amount && (
              <Text
                c="red"
                size="sm"
              >{`${errors.amount.message}`}</Text>
            )}
            <Textarea
              {...register("description")}
              label="Description"
              placeholder="Enter description..."
            />
            {errors?.description && (
              <Text
                c="red"
                size="sm"
              >{`${errors.description.message}`}</Text>
            )}
            <Group justify="flex-end">
              <Button type="submit" variant="filled" color="green">
                Save
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default EditExpenseModal;
