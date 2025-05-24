'use client';

import { Loader, Center, Stack, Text } from '@mantine/core';

export default function DashboardLoading() {
  return (
    <Center h="100vh">
      <Stack align="center" gap="md">
        <Loader size="xl" variant="dots" />
        <Text>Loading dashboard...</Text>
      </Stack>
    </Center>
  );
} 