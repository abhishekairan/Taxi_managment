'use client';

import { useUserContext } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserEditForm from '@/components/users/UserEditForm';
import { getAllUsers } from '@/app/actions/users';

export default function EditUserPage({ params }: { params: { userId: string } }) {
  const { user } = useUserContext();
  const router = useRouter();
  const [targetUser, setTargetUser] = useState<any>(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    const fetchUser = async () => {
      const result = await getAllUsers();
      if (result.error) {
        router.push('/dashboard');
      } else if (result.users) {
        const foundUser = result.users.find((u: any) => u.id.toString() === params.userId);
        if (foundUser) {
          setTargetUser(foundUser);
        } else {
          router.push('/dashboard');
        }
      }
    };

    fetchUser();
  }, [user, router, params.userId]);

  if (!targetUser) {
    return null;
  }

  return <UserEditForm user={targetUser} />;
} 