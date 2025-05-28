'use client';

import ProfileForm from '@/components/profile/ProfileForm';
import { useUserContext } from '@/context/UserContext';

export default function DriverProfilePage() {
  // const user = useUserContext()
  // console.log('Driver Profile Page', user);
  return <ProfileForm />;
}
