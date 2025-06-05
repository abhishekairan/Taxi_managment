'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { decrypt, createSession } from '@/app/lib/session';
import db from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { ProfileFormSchema, ProfileFormType } from '@/lib/type';
import { getUserByEmail } from '@/db/utilis';


export async function updateProfile(formData: ProfileFormType) {
  console.log('formData:', formData);
  const validatedFields = ProfileFormSchema.safeParse(formData);
  const user = await getUserByEmail(formData.email);
  if (!validatedFields.success) {
    console.log('Validation errors:', validatedFields.error.errors);
    return { error: 'Invalid form data' };
  }
  console.log(validatedFields.data)

  try {
    // Update user in database
    await db
      .update(users)
      .set({
        name: validatedFields.data.name,
        email: validatedFields.data.email,
        phone_number: validatedFields.data.phoneNumber,
        profile_image: validatedFields.data.profileImage,
        updated_at: new Date().toISOString(),
      })
      .where(eq(users.id, Number(user?.id)));

    // Get updated user data
    const updatedUser = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(user?.id)));

    if (updatedUser && updatedUser.length > 0) {
      // Create new session with updated user data
      await createSession(updatedUser[0]);
    }

    revalidatePath('/driver/profile');
    revalidatePath('/dashboard/profile');
    
    return { success: true, user: updatedUser[0] };
  } catch (error) {
    console.error('Profile update error:', error);
    return { error: 'Failed to update profile' };
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