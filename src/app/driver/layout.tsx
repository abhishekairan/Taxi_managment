import { ReactNode } from 'react';

import { DriverLayout } from '@/layout/Driver';

type Props = {
  children: ReactNode;
};

function DashboardLayout({ children }: Props) {
  return <DriverLayout>{children}</DriverLayout>;
}

export default DashboardLayout;
