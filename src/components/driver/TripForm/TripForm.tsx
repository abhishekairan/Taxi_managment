'use client';

import {
  Badge,
  Box,
  Button,
  ComboboxItem,
  Container,
  Grid,
  Group,
  NumberInput,
  Paper,
  PaperProps,
  Select,
  Stack,
  Text,
  TextInput
} from '@mantine/core';
import { IconBusStop, IconCar } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import Surface from '@/components/Surface/Surface';
import { JWTPayload } from 'jose';
import { vehicles } from '@/db/schema';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

interface formDataProps{
  data?:{
    id?: number;
    driver_id?: {
      id: number;
      name: string;
      email: string;
    }
    vehicle_id?: {
      id: number;
      vehicle_number: string;
      speedometer_reading:  number;
      default_passenger: string;
      default_from_location: string;
      default_to_location: string
    };
    passenger_name?: string;
    from_location?: string;
    to_location?: string;
    start_reading?: number;
    end_reading?: number;
    start_time?: string;
    end_time?: string;
    isRunning?: boolean
  }
  user?: JWTPayload;
  vehicles: typeof vehicles.$inferSelect[]
}

const TripForm = (formData: formDataProps) => {
  const formdata = useForm({
    initialValues: {...formData},
  });

  console.log("formdata:",formdata.values)
  
  // console.log("formdata:",formdata)
  // formdata.setFieldValue('isRunning', false);
  return (
    <>
      <form onSubmit={formdata.onSubmit((values) => console.log(values))}>
      <Container fluid>
        <Stack gap="lg">
          <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Surface component={Paper} {...PAPER_PROPS}>
                <Stack>
                  <Group>
                    <Text size="lg" fw={600}>
                      Trip information
                    </Text>
                    {formData.data?.isRunning? <Badge color="green" radius="sm">Active</Badge>:<Badge color="gray" radius="sm">Inactive</Badge>}
                    
                  </Group>
                  <Select 
                    label="Select vehicle"
                    placeholder="Select vehicle"
                    data={formdata.values.vehicles.map((vehicle) => ({value: String(vehicle.id), label: vehicle.vehicle_number}))}
                    value={formdata.values.data?.isRunning? String(formdata.values.data.vehicle_id?.id) : undefined}
                    disabled={formdata.values.data?.isRunning}
                  />
                  <TextInput
                    label="Passenger name"
                    placeholder={formdata.values.data?.vehicle_id?.default_passenger? formdata.values.data.vehicle_id?.default_passenger : "Passenger name"}
                    key={formdata.key('passenger_name')}
                    {...formdata.getInputProps('email')}
                    disabled={formdata.values.data?.isRunning}
                    value={formdata.values.data?.isRunning? formdata.values.data.passenger_name : undefined}
                  />
                  <TextInput
                    label="From Location"
                    placeholder={formdata.values.data?.vehicle_id?.default_passenger? formdata.values.data.vehicle_id?.default_passenger : "From location"}
                    {...formdata.getInputProps('address')}
                  />
                  <TextInput
                    label="To Location"
                    placeholder="To location"
                    {...formdata.getInputProps('address')}

                  />
                  <Group grow>
                    <NumberInput
                      disabled={formdata.values.data?.isRunning}
                      label="Start Reading"
                      placeholder="Start reading"
                      {...formdata.getInputProps('email')}
                      value={formdata.values.data?.isRunning? formdata.values.data.start_reading : undefined}
                    />
                    <NumberInput 
                      disabled={!formdata.getInputProps('isRunning')}
                      label="End Reading"
                      placeholder="End reading"
                      {...formdata.getInputProps('email')}
                    />
                  </Group>
                  <Group grow justify='center'>
                    <Button disabled={formData.data?.isRunning} color='green' leftSection={<IconCar size={16} type='submit'/>}>
                      Start Trip
                    </Button>
                    <Button disabled={!formData.data?.isRunning} color='red' leftSection={<IconBusStop size={16} />}>
                      End Trip
                    </Button>
                  </Group>
                </Stack>
              </Surface>
            </Grid.Col>

          </Grid>
        </Stack>
      </Container>
      </form>
    </>
  );
}

export default TripForm
