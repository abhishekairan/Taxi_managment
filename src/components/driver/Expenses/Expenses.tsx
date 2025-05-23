'use client';

import {
  ActionIcon,
  Anchor,
  Button,
  Container,
  em,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import { IconDotsVertical, IconPlus } from '@tabler/icons-react';

import ExpenseTable from './ExpenseTable/ExpenseTable';
import EditExpenseModal from './ExpenseTable/EditExpenseModal';
import { useDisclosure } from '@mantine/hooks';
import { EditExpenseFormType } from '@/lib/type';
import { useState } from 'react';



const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};

function Page() {

  const [editOpened, editModelHandler] = useDisclosure(false)
  const [editData, setEditData] = useState<EditExpenseFormType | null>()

  return (
    <>
      <>
        <title>Expenses</title>
      </>
      <EditExpenseModal opened={editOpened} Modelhandler={editModelHandler} data={editData} setData={setEditData}/>
      <Container fluid>
        <Stack gap="lg">
            <Group justify='flex-start'>
            <Button leftSection={<IconPlus size={18}/>} onClick={() =>{
              setEditData(null)
              editModelHandler.open()
            }}>Add Expense</Button>
            </Group>
            
          
          <Paper {...PAPER_PROPS}>
            <Group justify="space-between" mb="md">
              <Text fz="lg" fw={600}>
                Expenses
              </Text>
              <ActionIcon>
                <IconDotsVertical size={18} />
              </ActionIcon>
            </Group>
            <ExpenseTable editData={editData} setEditData={setEditData} editModelHandler={editModelHandler} 
            />
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

export default Page;