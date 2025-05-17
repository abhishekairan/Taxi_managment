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
import submitTrip, { formProps } from '@/app/actions/submitTrip';
import { useRouter } from 'next/navigation';

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
  user?: any
  vehicles: typeof vehicles.$inferSelect[]
}

const TripForm = (formData: formDataProps) => {

  console.log('Client reloaded')

  const router = useRouter()

  const formdata = useForm({
    initialValues: {
      'id': formData.data?.id,
      'driver_id':formData.user?.userId,
      'vehicle_id': String(formData.data?.vehicle_id?.id),
      'passenger_name': formData.data?.passenger_name || formData.data?.vehicle_id?.default_passenger || '',
      'from_location': formData.data?.from_location || formData.data?.vehicle_id?.default_from_location,
      'to_location': formData.data?.to_location || formData.data?.vehicle_id?.default_to_location,
      'start_reading': formData.data?.start_reading,
      'end_reading': formData.data?.end_reading,
      'isRunning': formData.data?.isRunning || false
    },
    mode:'uncontrolled',
    validate:{
      end_reading: (value:number|undefined,values)=>{
        if(values.isRunning){
          if(!value){
            return "End reading is required"
          }else if(values.start_reading && value<values.start_reading){
            return "Invalid reading"
          }
        }
      }
    }
  });
  const onChangeVehiclee = (value: string | null, obj: ComboboxItem) => {
    const vehicleObj = formData.vehicles.find((e)=>{return e.id===Number(value)})
    formdata.setValues({'from_location': vehicleObj?.default_from_location || undefined,'to_location': vehicleObj?.default_to_location || undefined,'vehicle_id': value || '',passenger_name: vehicleObj?.default_passenger || undefined,'start_reading': vehicleObj?.speedometer_reading || undefined})
  }

  // console.log("formdata:",formdata)
  // formdata.setFieldValue('isRunning', false);
  return (
    <>
      <form onSubmit={formdata.onSubmit(submitTrip)}>
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
                    data={formData.vehicles.map((vehicle) => ({value: String(vehicle.id), label: vehicle.vehicle_number}))}
                    key={formdata.key('vehicle_id')}
                    {...formdata.getInputProps('vehicle_id')}
                    onChange={onChangeVehiclee}
                  />
                  <TextInput
                    label="Passenger name"
                    placeholder={formdata.values.passenger_name || "Passenger name"}
                    disabled={formdata.values.isRunning}
                    key={formdata.key('passenger_name')}
                    {...formdata.getInputProps('passenger_name')}
                  />
                  <TextInput
                    label="From Location"
                    placeholder={formdata.values.from_location || "From location"}
                    key={formdata.key('from_location')}
                    {...formdata.getInputProps('from_location')}
                  />
                  <TextInput
                    label="To Location"
                    placeholder="To location"
                    key={formdata.key('to_location')}
                    {...formdata.getInputProps('to_location')}

                  />
                  <Group grow>
                    <NumberInput
                      disabled={formdata.values.isRunning}
                      label="Start Reading"
                      placeholder="Start reading"
                      key={formdata.key('start_reading')}
                      {...formdata.getInputProps('start_reading')}
                    />
                    <NumberInput 
                      disabled={!formdata.values.isRunning}
                      label="End Reading"
                      placeholder="End reading"
                      key={formdata.key('end_reading')}
                      {...formdata.getInputProps('end_reading')}
                    />
                  </Group>
                  <Group grow justify='center'>
                    <Button type='submit' disabled={formdata.values.isRunning} color='green' leftSection={<IconCar size={16}/>}>
                      Start Trip
                    </Button>
                    <Button type='submit' disabled={!formdata.values.isRunning} color='red' leftSection={<IconBusStop size={16}/>}>
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
