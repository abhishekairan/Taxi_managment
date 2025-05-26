import {
  IconDashboard,
  IconUsers,
  IconCar,
  IconSettings,
  IconReportAnalytics,
} from '@tabler/icons-react';
import { NavigationSection } from '@/components/Navigation/Navigation';

export const adminNavigation: NavigationSection[] = [
  {
    title: 'Overview',
    links: [
      { label: 'Dashboard', icon: IconDashboard, link: '/dashboard' },
    ],
  },
  {
    title: 'Management',
    links: [
      { label: 'Users', icon: IconUsers, link: '/dashboard/users' },
      { label: 'Drivers', icon: IconCar, link: '/dashboard/drivers' },
      { label: 'Reports', icon: IconReportAnalytics, link: '/dashboard/reports' },
      { label: 'Settings', icon: IconSettings, link: '/dashboard/settings' },
    ],
  },
]; 