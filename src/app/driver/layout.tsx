import { ReactNode } from 'react';

import { MainLayout } from '@/layout/driver/';

type Props = {
  children: ReactNode;
};

function DashboardLayout({ children }: Props) {
  return <MainLayout>{children}</MainLayout>;
}

export default DashboardLayout;
