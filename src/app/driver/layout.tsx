import { ReactNode } from 'react';

import { DriverLayout } from '@/components/driver/layout';

type Props = {
  children: ReactNode;
};

function DashboardLayout({ children }: Props) {
  return <DriverLayout>{children}</DriverLayout>;
}

export default DashboardLayout;
