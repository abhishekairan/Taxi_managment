'use client';

import {
  Badge,
  Box,
  Button,
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
import Reac,{useActionState} from 'react'
import { useForm } from '@mantine/form';
import Surface from '@/components/Surface/Surface';
import { JWTPayload } from 'jose';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

interface formDataProps{
  data:{
    id?: number;
    driver_id?: number;
    vehicle_id?: number;
    passenger_name?: string;
    from_location?: string;
    to_location?: string;
    start_reading?: number;
    end_reading?: number;
    start_time?: string;
    end_time?: string;
    isRunning: boolean
  }
  user?: JWTPayload;
}

const TripForm = (formData: formDataProps) => {
  const formdata = useForm({
    initialValues: {...formData},
  });
  // console.log(formdata)
  // formdata.setFieldValue('isRunning', false);
  return (
    <>
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
                    {formData.data.isRunning? <Badge color="green" radius="sm">Active</Badge>:<Badge color="gray" radius="sm">Inactive</Badge>}
                    
                  </Group>
                  <Select 
                    label="Select vehicle"
                    placeholder="Select vehicle"
                    data={[
                      { value: 'car', label: 'Car' },
                      { value: 'bike', label: 'Bike' },
                      { value: 'truck', label: 'Truck' },
                    ]}
                  />
                  <TextInput
                    label="Passenger name"
                    placeholder="Passenger name"
                    {...formdata.getInputProps('email')}
                  />
                  <TextInput
                    label="From Location"
                    placeholder="From location"
                    {...formdata.getInputProps('address')}
                  />
                  <TextInput
                    label="To Location"
                    placeholder="To location"
                    {...formdata.getInputProps('address')}
                  />
                  <Group grow>
                    <NumberInput
                      label="Start Reading"
                      placeholder="Start reading"
                      {...formdata.getInputProps('email')}
                    />
                    <NumberInput 
                      disabled={!formdata.getInputProps('isRunning')}
                      label="End Reading"
                      placeholder="End reading"
                      {...formdata.getInputProps('email')}
                    />
                  </Group>
                  <Group grow justify='center'>
                    <Button disabled={formData.data.isRunning} color='green' leftSection={<IconCar size={16} />}>
                      Start Trip
                    </Button>
                    <Button disabled={!formdata.getInputProps('isRunning')} color='red' leftSection={<IconBusStop size={16} />}>
                      End Trip
                    </Button>
                  </Group>
                </Stack>
              </Surface>
            </Grid.Col>

          </Grid>
        </Stack>
      </Container>
    </>
  );
}

export default TripForm
