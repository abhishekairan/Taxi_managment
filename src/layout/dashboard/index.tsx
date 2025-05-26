'use client';

import { ReactNode } from 'react';

import { AppShell, Container, rem, useMantineTheme } from '@mantine/core';
import { useDisclosure, useLocalStorage, useMediaQuery } from '@mantine/hooks';

import AppMain from '@/components/AppMain';
import HeaderNav from '@/components/HeaderNav';
import Navigation from '@/components/Navigation';
import {
  IconCar,
  IconCurrencyRupee,
  IconUserCode,
} from '@tabler/icons-react';

export type SidebarState = 'hidden' | 'mini' | 'full';

type Props = {
  children: ReactNode;
};


const links = [
  {
    title: 'Dashboard',
    links: [
      { label: 'Trips', icon: IconCar, link: '/dashboard/trips' },
      { label: 'Expenses', icon: IconCurrencyRupee, link: '/dashboard/expenses' },
      { label: 'Users', icon: IconUserCode, link: '/dashboard/users' },
    ],
  },
];

export function DashboardLayout({ children }: Props) {
  const theme = useMantineTheme();
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false,{
    onOpen: () => console.log('Opened'),
    onClose: () => console.log('Closed'),
  });
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