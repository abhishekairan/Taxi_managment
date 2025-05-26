'use server';

import { revalidatePath } from 'next/cache';
import db from '@/db/index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { UserManagementFormType } from '@/lib/type';
import { getUserByEmail } from '@/db/utilis';

// Create new user
export async function createUser(formData: UserManagementFormType) {
  // console.log('Creating user:', formData);
  
  try {
    // Check if user with email already exists
    const existingUser = await getUserByEmail(formData.email);
    if (existingUser) {
      return { error: 'User with this email already exists' };
    }

    // Hash password if provided
    const hashedPassword = formData.password 
      ? await bcrypt.hash(formData.password, 10)
      : await bcrypt.hash('default123', 10); // Default password if none provided

    // Insert new user
    await db.insert(users).values({
      name: formData.name,
      email: formData.email,
      password_hash: hashedPassword,
      role: formData.role,
      phone_number: formData.phoneNumber,
      profile_image: formData.profileImage,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    revalidatePath('/dashboard/users');
    return { success: true };
  } catch (error) {
    console.error('Create user error:', error);
    return { error: 'Failed to create user' };
  }
}

// Update existing user
export async function updateUser(formData: UserManagementFormType) {
  // console.log('Updating user:', formData);
  
  if (!formData.id) {
    return { error: 'User ID is required' };
  }

  try {
    const updateData: any = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      phone_number: formData.phoneNumber,
      profile_image: formData.profileImage,
      updated_at: new Date().toISOString(),
    };

    // Only update password if provided
    if (formData.password) {
      updateData.password_hash = await bcrypt.hash(formData.password, 10);
    }

    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, formData.id));

    revalidatePath('/dashboard/users');
    return { success: true };
  } catch (error) {
    console.error('Update user error:', error);
    return { error: 'Failed to update user' };
  }
}

// Delete user
export async function deleteUser(userId: number) {
  // console.log('Deleting user:', userId);
  
  try {
    await db
      .delete(users)
      .where(eq(users.id, userId));

    revalidatePath('/dashboard/users');
    return { success: true };
  } catch (error) {
    console.error('Delete user error:', error);
    return { error: 'Failed to delete user' };
  }
}

// Get all users
export async function getUsers() {
  try {
    const allUsers = await db
      .select()
      .from(users)
      .orderBy(users.created_at);

    return allUsers;
  } catch (error) {
    console.error('Get users error:', error);
    return [];
  }
}

// Get single user
export async function getUser(userId: number) {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .get();

    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
} 