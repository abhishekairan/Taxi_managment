"use client";

import {
  Badge,
  Button,
  ComboboxItem,
  Container,
  Grid,
  Group,
  Paper,
  PaperProps,
  Select,
  Skeleton,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconBusStop, IconCar } from "@tabler/icons-react";
import Surface from "@/components/Surface/Surface";
import { useForm } from "react-hook-form";
import { TripFormObject, TripFormSchema, VehicleDBType } from "@/lib/type";
import { zodResolver } from "@hookform/resolvers/zod";
import submitTrip from "@/app/actions/submitTrip";
import { useEffect, useState } from "react";

const PAPER_PROPS: PaperProps = {
  p: "md",
  shadow: "md",
  radius: "md",
  style: { height: "100%" },
};

const TripForm = ({ formData }: any) => {
  console.log("FormData: ",formData)
  const [vehicles, setVehicles] = useState<{ value: string; label: string }[]>([]);
  const [vehiclesData, setVehiclesData] = useState<VehicleDBType[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("/api/vehicle");
        const vehiclesResponse = await response.json();
        setVehiclesData(vehiclesResponse);
        const vehicleOptions = vehiclesResponse.map((v: VehicleDBType) => ({
          value: v.vehicle_number,
          label: v.vehicle_number
        }));
        setVehicles(vehicleOptions);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles();
  }, []);

  // react-hook-form
  const {
    formState: { errors, isSubmitting },
    register,
    getValues,
    setValue,
    handleSubmit,
    reset,
  } = useForm<TripFormObject>({
    resolver: zodResolver(TripFormSchema),
    defaultValues: {...formData}
  });

  // On Change handler for select menu
  const onChangeVehiclee = (value: string | null, obj: ComboboxItem) => {
    const vehicleObj = vehiclesData.find((e: VehicleDBType) => {
      return e.vehicle_number === value;
    });
    if(vehicleObj){ 
      setValue("from_location", vehicleObj.default_from_location || '');
      setValue("to_location", vehicleObj.default_to_location || '') ;
      setValue("start_reading", vehicleObj.speedometer_reading || 0);
      setValue("passenger_name", vehicleObj.default_passenger || '');
      setValue('vehicle_number', value || '');
    }
  };

  // On Submit Function
  const OnSubmitTripForm = async (values: TripFormObject) => {
    console.log("OnSubmitTripForm Triggered")
    const response = await submitTrip(values)
    // console.log("Response recived after updating trip in TripForm:",response)
    const verifiedResponse = TripFormSchema.safeParse(response)
    if(verifiedResponse.success){
      console.log("Successfully parsed response from server into TripFormSchema",verifiedResponse.data)
      // setformData(response)
      if(verifiedResponse.data.isRunning){
        // console.log("Resetting form data to current trip data")
        reset(verifiedResponse.data)
      }else{
        // console.log("Resetting form data to empty")
        reset()
        setValue('isRunning',false,{shouldValidate:true})
      }
    }else{
      console.log(verifiedResponse.error)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(OnSubmitTripForm)}>
        <Container fluid>
          <Stack gap="lg">
            <Grid gutter={{ base: 5, xs: "md", md: "xl", xl: 50 }}>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Skeleton visible={isSubmitting}>
                <Surface component={Paper} {...PAPER_PROPS}>
                  <Stack>
                    <Group>
                      <Text size="lg" fw={600}>
                        Trip information
                      </Text>
                      {formData?.isRunning ? (
                        <Badge color="green" radius="sm">
                          Active
                        </Badge>
                      ) : (
                        <Badge color="gray" radius="sm">
                          Inactive
                        </Badge>
                      )}
                    </Group>

                    {/* Vehicle Select Menu */}
                    <Select
                      {...register("vehicle_number")}
                      defaultValue={formData?.vehicle_number}
                      label="Select vehicle"
                      placeholder="Select vehicle"
                      data={vehicles || undefined}
                      disabled={getValues("isRunning")}
                      onChange={onChangeVehiclee}
                    />
                    {errors?.vehicle_number && (
                      <Text
                        c="red"
                        size="sm"
                      >{`${errors.vehicle_number.message}`}</Text>
                    )}

                    {/* Passenger Field */}
                    <TextInput
                      {...register("passenger_name", {
                        required: "Passenger name is required",
                      })}
                      label="Passenger name"
                      placeholder="Passenger name"
                      disabled={getValues("isRunning")}
                    />
                    {errors?.passenger_name && (
                      <Text
                        c="red"
                        size="sm"
                      >{`${errors.passenger_name.message}`}</Text>
                    )}

                    {/* From Location Field */}
                    <TextInput
                      {...register("from_location", {
                        required: "From Location is required",
                      })}
                      label="From Location"
                      placeholder="From location"
                    />
                    {errors?.from_location && (
                      <Text
                        c="red"
                        size="sm"
                      >{`${errors.from_location.message}`}</Text>
                    )}

                    {/* To Location Field */}
                    <TextInput
                      {...register("to_location", {
                        required: "To Location is required",
                      })}
                      label="To Location"
                      placeholder="To location"
                    />
                    {errors?.to_location && (
                      <Text
                        c="red"
                        size="sm"
                      >{`${errors.to_location.message}`}</Text>
                    )}

                    {/* Reading Field */}
                    <Group grow>
                      <Stack>
                        {/* Start Reading Field */}
                        <TextInput
                          {...register("start_reading", {
                            pattern: new RegExp("^[0-9]+$"),
                            required: "Start reading is required",
                          })}
                          disabled={getValues("isRunning")}
                          label="Start Reading"
                          placeholder="Start reading"
                        />
                        {errors?.start_reading?.type === "pattern" && (
                          <Text c="red" size="sm">
                            Only Numbers Allowed
                          </Text>
                        )}
                        {errors?.start_reading?.type === "required" && (
                          <Text
                            c="red"
                            size="sm"
                          >{`${errors?.start_reading.message}`}</Text>
                        )}
                        {errors?.start_reading && (
                          <Text
                            c="red"
                            size="sm"
                          >{`${errors?.start_reading.message}`}</Text>
                        )}
                      </Stack>
                      <Stack>
                        {/* Ending Reading Field */}
                        <TextInput
                          {...register("end_reading", {
                            pattern: new RegExp("^[d]+$ | ^[0-9]+$"),
                            disabled: !getValues("isRunning"),
                          })}
                          label="End Reading"
                          placeholder="End reading"
                        />
                        {errors?.end_reading?.type === "pattern" && (
                          <Text c="red" size="sm">
                            Only Numbers Allowed
                          </Text>
                        )}
                        {errors?.end_reading?.type === "required" && (
                          <Text
                            c="red"
                            size="sm"
                          >{`${errors?.end_reading.message}`}</Text>
                        )}
                        {errors?.end_reading && (
                          <Text
                            c="red"
                            size="sm"
                          >{`${errors?.end_reading.message}`}</Text>
                        )}
                      </Stack>
                    </Group>

                    {/* Buttons */}
                    <Group grow justify="center">
                      {/* Start Trip */}
                      <Button
                        type="submit"
                        disabled={getValues("isRunning")}
                        color="green"
                        leftSection={<IconCar size={16}/>}
                        onClick={(value)=>{console.log(errors)}}
                      >
                        Start Trip
                      </Button>

                      {/* End Trip */}
                      <Button
                        type="submit"
                        disabled={!getValues("isRunning")}
                        color="red"
                        leftSection={<IconBusStop size={16}/>}
                      >
                        End Trip
                      </Button>
                    </Group>
                  </Stack>
                </Surface>
                </Skeleton>
              </Grid.Col>
            </Grid>
          </Stack>
        </Container>
      </form>
    </>
  );
};

export default TripForm;
