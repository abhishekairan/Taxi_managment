'use client';

import { Loader, Center } from '@mantine/core';

export default function Loading() {
  return (
    <Center h="100vh">
      <Loader size="xl" variant="dots" />
    </Center>
  );
} 