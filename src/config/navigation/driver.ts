import {
  IconCar,
  IconCurrencyRupee,
  IconUserCode,
} from '@tabler/icons-react';
import { NavigationSection } from '@/components/Navigation/Navigation';

export const driverNavigation: NavigationSection[] = [
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