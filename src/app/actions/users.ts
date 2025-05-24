'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { decrypt } from '@/app/lib/session';
import db from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function updateUserRole(userId: string, newRole: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) {
    return { error: 'Not authenticated' };
  }

  const payload = await decrypt(sessionCookie);
  if (!payload || !payload.role || payload.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  try {
    await db
      .update(users)
      .set({
        role: newRole,
        updated_at: new Date().toISOString(),
      })
      .where(eq(users.id, parseInt(userId)));

    revalidatePath('/dashboard/users' as const);
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update role' };
  }
}

export async function getAllUsers() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) {
    return { error: 'Not authenticated' };
  }

  const payload = await decrypt(sessionCookie);
  if (!payload || !payload.role || payload.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  try {
    const allUsers = await db.select().from(users);
    return { users: allUsers };
  } catch (error) {
    return { error: 'Failed to fetch users' };
  }
}

export async function resetPassword(formData: FormData) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;
  if (!sessionCookie) {
    return { error: 'Not authenticated' };
  }

  const payload = await decrypt(sessionCookie);
  if (!payload || !payload.userId) {
    return { error: 'Invalid session' };
  }

  const newPassword = formData.get('newPassword');
  if (!newPassword || typeof newPassword !== 'string') {
    return { error: 'New password is required' };
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db
      .update(users)
      .set({
        password_hash: hashedPassword,
        updated_at: new Date().toISOString(),
      })
      .where(eq(users.id, Number(payload.userId)));

    return { success: true };
  } catch (error) {
    return { error: 'Failed to reset password' };
  }
} 