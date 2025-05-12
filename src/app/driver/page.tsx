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
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';

import MobileDesktopChart from '@/components/MobileDesktopChart/MobileDesktopChart';
import PageHeader from '@/components/PageHeader/PageHeader';
import RevenueChart from '@/components/RevenueChart/RevenueChart';
import ActiveDriverPie from '@/components/Pies/ActiveDriverPie/ActiveDriverPie';
import ActiveCarPie from '@/components/Pies/ActiveCarPie/ActiveCarPie';
import StatsGrid from '@/components/StatsGrid/StatsGrid';
import ProjectsTable from '@/components/ProjectsTable/ProjectsTable';
import { useFetchData } from '@/hooks';
import { PATH_TASKS } from '@/routes';

const PAPER_PROPS: PaperProps = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
  style: { height: '100%' },
};

function Page() {
  const {
    data: projectsData,
    error: projectsError,
    loading: projectsLoading,
  } = useFetchData('/mocks/Projects.json');
  const {
    data: statsData,
    error: statsError,
    loading: statsLoading,
  } = useFetchData('/mocks/StatsGrid.json');

  return (
    <>
      <>
        <title>Default Dashboard</title>
      </>
      <Container fluid>
        <Stack gap="lg">
          <PageHeader title="Default dashboard" withActions={true} />
          <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
            <Grid.Col span={6}>
              <ActiveDriverPie {...PAPER_PROPS} />
            </Grid.Col>
            <Grid.Col span={6}>
              <ActiveCarPie {...PAPER_PROPS} />
            </Grid.Col>

            <Grid.Col span={12}>
              <Paper {...PAPER_PROPS}>
                <Group justify="space-between" mb="md">
                  <Text size="lg" fw={600}>
                    Tasks
                  </Text>
                  <Button
                    variant="subtle"
                    component={Link}
                    href={PATH_TASKS.root}
                    rightSection={<IconChevronRight size={18} />}
                  >
                    View all
                  </Button>
                </Group>
                <ProjectsTable
                  data={projectsData.slice(0, 6)}
                  error={projectsError}
                  loading={projectsLoading}
                />
              </Paper>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </>
  );
}

export default Page;