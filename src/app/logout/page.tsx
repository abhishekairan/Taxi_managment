// src/app/logout/page.tsx
'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';

const route = async () => {
  console.log('on logout page');
  const cookieStore = await cookies();

  if (!cookieStore.get('session')) {
    await redirect('/');
  }
    // Call the API route to delete the session
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      console.error('Error during logout:', response.statusText);
      return;
    }
  
    const data = await response.json();
    console.log(data);
    return (
      <div>
        Logout successful!
      </div>
    );
  } catch (error) {
    console.error('Error during logout:', error);
    return (
      <div>
        An error occurred during logout. Please try again later.
      </div>
    );
  }
};

export default route;