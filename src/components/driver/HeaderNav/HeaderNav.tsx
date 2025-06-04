'use client';

import {
  ActionIcon,
  Avatar,
  Burger,
  Flex,
  Group,
  Indicator,
  Menu,
  Stack,
  Text,
  TextInput,
  Tooltip,
  rem,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconBell,
  IconCircleHalf2,
  IconMessageCircle,
  IconMoonStars,
  IconPower,
  IconSearch,
  IconSunHigh,
} from '@tabler/icons-react';

import { SidebarState } from '@/components/dashboard/layout';
import { useRouter } from 'next/navigation';

const ICON_SIZE = 20;

type HeaderNavProps = {
  mobileOpened?: boolean;
  toggleMobile?: () => void;
  sidebarState: SidebarState;
  onSidebarStateChange: () => void;
};

const HeaderNav = (props: HeaderNavProps) => {
  const { toggleMobile, mobileOpened, onSidebarStateChange } = props;
  const theme = useMantineTheme();
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const mobile_match = useMediaQuery('(max-width: 425px)');
  

  const router = useRouter();

  return (
    <Group justify="space-between">
      <Group gap={0}>
        <Tooltip label="Toggle side navigation">
          <Burger visibleFrom="md" size="sm" onClick={onSidebarStateChange} />
        </Tooltip>
        <Burger
          opened={mobileOpened}
          onClick={toggleMobile}
          hiddenFrom="md"
          size="sm"
        />
        {/* <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="md" size="sm"/> */}
      </Group>
      <Group>
        <Tooltip label="Logout">
          <ActionIcon onClick={()=> router.replace('/logout')}>
            <IconPower size={ICON_SIZE} />
          </ActionIcon>
        </Tooltip>
        <Menu shadow="lg" width={200}>
          <Menu.Target>
            <Tooltip label="Switch color modes">
              <ActionIcon variant="light">
                {colorScheme === 'auto' ? (
                  <IconCircleHalf2 size={ICON_SIZE} />
                ) : colorScheme === 'dark' ? (
                  <IconMoonStars size={ICON_SIZE} />
                ) : (
                  <IconSunHigh size={ICON_SIZE} />
                )}
              </ActionIcon>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label tt="uppercase" ta="center" fw={600}>
              Select color modes
            </Menu.Label>
            <Menu.Item
              leftSection={<IconSunHigh size={16} />}
              onClick={() => setColorScheme('light')}
            >
              Light
            </Menu.Item>
            <Menu.Item
              leftSection={<IconMoonStars size={16} />}
              onClick={() => setColorScheme('dark')}
            >
              Dark
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};

export default HeaderNav;
