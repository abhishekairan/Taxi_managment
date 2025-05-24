'use client';

import { Loader, Center, Stack, Text, Paper } from '@mantine/core';

export default function EditUserLoading() {
  return (
    <Center h="100vh">
      <Paper radius="md" p="xl" withBorder>
        <Stack align="center" gap="md">
          <Loader size="xl" variant="dots" />
          <Text>Loading user details...</Text>
        </Stack>
      </Paper>
    </Center>
  );
} 