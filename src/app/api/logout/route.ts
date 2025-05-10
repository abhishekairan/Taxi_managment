import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const cookieStore = await cookies();
      const session = cookieStore.get('session');
      console.log('Session before deletion:', session);

      // Delete the session cookie
      await cookieStore.delete('session');
      console.log('Cookies after deletion:', cookieStore.getAll());

      return NextResponse.json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Error during logout:', error);
      return NextResponse.json(
        { message: 'Logout failed' })
    }
  }

  // Handle other HTTP methods
  res.setHeader('Allow', ['POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}