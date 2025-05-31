'use client';

import {
  Button,
  Container,
  Grid,
  Group,
  Paper,
  PaperProps,
  Stack,
  Text,
} from '@mantine/core';
import ActiveDriverPie from '@/components/Pies/ActiveDriverPie/ActiveDriverPie';
import ActiveCarPie from '@/components/Pies/ActiveCarPie/ActiveCarPie';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

function Page() {
  return (
    <>
      <>
        <title>Default Dashboard</title>
      </>
      <Container fluid>
        <Stack gap="lg">
          <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
            <Grid.Col span={6}>
              <ActiveDriverPie {...PAPER_PROPS} />
            </Grid.Col>
            <Grid.Col span={6}>
              <ActiveCarPie {...PAPER_PROPS} />
            </Grid.Col>

            <Grid.Col span={12}>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}

export default Page;