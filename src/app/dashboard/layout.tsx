import { ReactNode } from 'react';

import { DashboardLayout } from '@/components/dashboard/layout';

type Props = {
  children: ReactNode;
};

function Layout({ children }: Props) {
  return <DashboardLayout>{children}</DashboardLayout>;
}

export default Layout;
