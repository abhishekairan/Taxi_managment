'use client';

import {
  ActionIcon,
  Button,
  Container,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import { IconDotsVertical, IconPlus } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useUserContext } from '@/context/UserContext';
import { TripFormObject } from '@/lib/type';
import TripTable from './TripTable/TripTable';
import EditTripModal from './TripTable/EditTripModal';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};

function Trips() {
  const {user} = useUserContext();
  const [editOpened, editModelHandler] = useDisclosure(false);
  const [editData, setEditData] = useState<TripFormObject | null>();

  return (
    <>
      <>
        <title>Trips</title>
      </>
      <EditTripModal opened={editOpened} Modelhandler={editModelHandler} data={editData} setData={setEditData}/>
      <Container fluid>
        <Stack gap="lg">
            <Group justify='flex-start'>
            <Button 
              leftSection={<IconPlus size={18}/>} 
              onClick={() => {
                setEditData(null);
                editModelHandler.open();
              }}>
              Add Trip
            </Button>
            </Group>
          
          <Paper {...PAPER_PROPS}>
            <Group justify="space-between" mb="md">
              <Text fz="lg" fw={600}>
                Trips
              </Text>
              <ActionIcon>
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Group>
            <TripTable 
              editData={editData} 
              setEditData={setEditData} 
              editModelHandler={editModelHandler} 
            />
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

export default Trips;
