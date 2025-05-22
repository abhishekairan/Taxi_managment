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
import { getAllDrivers, getAllExpenses } from '@/db/utilis';
import { ExpenseTableType } from '@/lib/type';
const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};

const expenses = await getAllExpenses()
const drivers = await getAllDrivers()
const newdata: ExpenseTableType[] = expenses.map((v)=>{
    return {...v,driver_id:(drivers.filter((d)=>d.id==v.driver_id))[0]}
})
function Page() {

  return (
    <>
      <>
        <title>Expenses</title>
      </>
      <Container fluid>
        <Stack gap="lg">
            <Group justify='flex-start'>
            <Button leftSection={<IconPlus size={18}/>}>Add Expense</Button>
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
            <ExpenseTable
              data={newdata}
            />
          </Paper>
        </Stack>
      </Container>
    </>
  );
}

export default Page;