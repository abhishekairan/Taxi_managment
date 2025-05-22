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
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconCar, IconCurrencyRupee, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

// getting all driver for select menu
const drivers = await(await fetch(new URL('/api/user/driver','http://localhost:3000'))).json()
const driverSelect: {label:string,value:string}[] = drivers.map((d: DriverUserType)=>{return {value:String(d.id),label:d.name||""}})

// getting all vehicles for select menu
const trips = await(await fetch(new URL('/api/trip','http://localhost:3000'))).json()

const tripSelect: {label:string,value:string}[] = trips.map((v: TripsDBType)=>{return {value:String(v.id),label:`${new Date(v.end_time).toDateString()} - ${v.vehicle_number}`}})

const EditExpenseModal = ({ opened, Modelhandler, data, setData }: any) => {

  const router = useRouter()

  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    getValues,
    reset
  } = useForm<EditExpenseFormType>({
    resolver: zodResolver(EditExpenseFormSchema),
    defaultValues: data
  });

  useEffect(() => {
    if (data) {
      reset(data); 
    }
  }, [data, reset]);

  const onSelect = (value:string | null, obj: ComboboxItem) => {
    if(value){
      obj.value = value
    }
  }
  const onSubmit = async (values: EditExpenseFormType) => {
    const response = await EditExpenseModelSubmit(values)
    if(response){
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
              onChange={onSelect}
              leftSection={<IconUser size={20} />}
            />
            <Select
              {...register("trip_id")}
              data={tripSelect}
              placeholder="Select Trip"
              defaultValue={String(getValues('trip_id'))}
              onChange={onSelect}
              leftSection={<IconCar size={20} />}
            />
            <TextInput
              {...register("amount")}
              placeholder="Enter Amount"
              leftSection={<IconCurrencyRupee size={20} />}
            />
            <Textarea
              {...register("description")}
              label="Description"
              placeholder="Enter description..."
            />
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
