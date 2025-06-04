'use client';

import {
  Container,
  Grid,
  PaperProps,
  Stack,
} from '@mantine/core';
import ActiveDriverPie from '@/components/Pies/ActiveDriverPie/ActiveDriverPie';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

function DashboardPage() {
  return (
    <Container fluid>
      <Stack gap="lg">
        <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <ActiveDriverPie {...PAPER_PROPS}/>
          </Grid.Col>
          <Grid.Col span={12}>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

export default DashboardPage;