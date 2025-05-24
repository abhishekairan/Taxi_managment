import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const response = NextResponse.json({ message: 'Logout successful' });
      
      // Delete the session cookie with same attributes as when it was set
      response.cookies.set('session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        expires: new Date(0),
        priority: 'high'
      });

      return response;
    } catch (error) {
      console.error('Error during logout:', error);
      return NextResponse.json(
        { message: 'Logout failed' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}