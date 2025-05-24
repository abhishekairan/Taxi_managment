'use client';

import { Loader, Center, Stack, Text, Paper } from '@mantine/core';

export default function UsersLoading() {
  return (
    <Center h="100vh">
      <Paper radius="md" p="xl" withBorder>
        <Stack align="center" gap="md">
          <Loader size="xl" variant="dots" />
          <Text>Loading users...</Text>
        </Stack>
      </Paper>
    </Center>
  );
} 