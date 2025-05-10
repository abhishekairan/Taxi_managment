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
  const response = await fetch(new URL('/api/logout','http://localhost:3000'), {
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
};

export default route;