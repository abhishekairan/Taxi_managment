'use client';

import { ReactNode } from 'react';

import { AppShell, Container, rem, useMantineTheme } from '@mantine/core';
import { useDisclosure, useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { SidebarState } from '@/components/dashboard/layout';

import AppMain from '@/components/AppMain/';
import HeaderNav from '@/components/HeaderNav';
import Navigation from '@/components/Navigation';
import {
  IconCar,
  IconCurrencyRupee,
  IconUserCode,
} from '@tabler/icons-react';

type Props = {
  children: ReactNode;
};

const links = [
  {
    title: 'Home',
    links: [
      { label: 'Trip', icon: IconCar, link: '/driver' },
    ],
  },
  {
    title: 'Dashboard',
    links: [
      { label: 'Trips', icon: IconCar, link: '/driver/trips' },
      { label: 'Expenses', icon: IconCurrencyRupee, link: '/driver/expenses' },
      { label: 'Profile', icon: IconUserCode, link: '/driver/profile' },
    ],
  },
];

export function DriverLayout({ children }: Props) {
  const theme = useMantineTheme();
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened] = useDisclosure(true);
  const [sidebarState, setSidebarState] = useLocalStorage<SidebarState>({
    key: 'mantine-nav-state',
    defaultValue: 'full',
  });

  const toggleSidebarState = () => {
    setSidebarState((current) => {
      if (current === 'full') return 'mini';
      if (current === 'mini') return 'hidden';
      return 'full';
    });
  };

  return (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{
        width: sidebarState === 'full' ? 300 : sidebarState === 'mini' ? 60 : 0,
        breakpoint: 'md',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding={0}
    >
      <AppShell.Header
        style={{
          height: rem(60),
          boxShadow: tablet_match ? theme.shadows.md : theme.shadows.sm,
        }}
      >
        <Container fluid py="sm" px="lg">
          <HeaderNav
            mobileOpened={mobileOpened}
            toggleMobile={toggleMobile}
            sidebarState={sidebarState}
            onSidebarStateChange={toggleSidebarState}
          />
        </Container>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navigation
          links={links}
          onClose={toggleMobile}
          sidebarState={sidebarState}
          onSidebarStateChange={setSidebarState}
        />
      </AppShell.Navbar>
      <AppShell.Main>
        <AppMain>{children}</AppMain>
      </AppShell.Main>
    </AppShell>
  );
}