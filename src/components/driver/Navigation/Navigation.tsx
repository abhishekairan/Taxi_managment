import { useEffect } from 'react';

import { ActionIcon, Box, Flex, Group, ScrollArea, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconBriefcase,
  IconCar,
  IconCurrencyRupee,
  IconMessages,
  IconUserCode,
  IconX,
} from '@tabler/icons-react';

import { SidebarState } from '@/apps/layout';
import Logo from '@/components/Logo/Logo';
import UserProfileButton from '@/components/UserButton';
import { LinksGroup } from '@/components/Navigation/Links/Links';
import UserProfileData from '@/public/mocks/UserProfile.json';
import {
  PATH_APPS,
} from '@/routes';

import classes from './Navigation.module.css';

const mockdata = [
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

type NavigationProps = {
  onClose: () => void;
  sidebarState: SidebarState;
  onSidebarStateChange: (state: SidebarState) => void;
};

const Navigation = ({
  onClose,
  onSidebarStateChange,
  sidebarState,
}: NavigationProps) => {
  const tablet_match = useMediaQuery('(max-zwidth: 768px)');

  const links = mockdata.map((m) => (
    <Box key={m.title} pl={0} mb={sidebarState === 'mini' ? 0 : 'md'}>
      {sidebarState !== 'mini' && (
        <Text
          tt="uppercase"
          size="xs"
          pl="md"
          fw={500}
          mb="sm"
          className={classes.linkHeader}
        >
          {m.title}
        </Text>
      )}
      {m.links.map((item) => (
        <LinksGroup
          key={item.label}
          {...item}
          isMini={sidebarState === 'mini'}
          closeSidebar={() => {
            setTimeout(() => {
              onClose();
            }, 250);
          }}
        />
      ))}
    </Box>
  ));

  useEffect(() => {
    if (tablet_match) {
      onSidebarStateChange('full');
    }
  }, [onSidebarStateChange, tablet_match]);

  return (
    <div className={classes.navbar} data-sidebar-state={sidebarState}>
      <div className={classes.header}>
        <Flex justify="space-between" align="center" gap="sm">
          <Group
            justify={sidebarState === 'mini' ? 'center' : 'space-between'}
            style={{ flex: tablet_match ? 'auto' : 1 }}
          >
            <Logo className={classes.logo} showText={sidebarState !== 'mini'} />
          </Group>
          {tablet_match && (
            <ActionIcon onClick={onClose} variant="transparent">
              <IconX color="white" />
            </ActionIcon>
          )}
        </Flex>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner} data-sidebar-state={sidebarState}>
          {links}
        </div>
      </ScrollArea>

      <div className={classes.footer}>
        {/* <UserProfileButton
          email={user?.email || UserProfileData.email}
          image={UserProfileData.avatar}
          name={UserProfileData.name}
          showText={sidebarState !== 'mini'}
        /> */}
      </div>
    </div>
  );
};

export default Navigation;
