import { ReactNode } from 'react';

import { DashboardLayout } from '@/layout/Dashboard';

type Props = {
  children: ReactNode;
};

function Layout({ children }: Props) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default Layout;
