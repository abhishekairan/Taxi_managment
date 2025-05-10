import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { users } from '@/db/schema'

interface SessionPayload {
  [userId: string]: string
  email: string;
  role: string;
  name: string;
  expiresAt: string;
}
 
const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)
 
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}
 
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
    return null
  }
}

export async function createSession(user: typeof users.$inferSelect) {
  const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
  const payload = {
    userId: String(user.id),
    email: user?.email || 'abc@example.com',
    role: user?.role || 'Driver',
    name: user?.name || 'Driver',
    expiresAt: expiresAt.toISOString(),
  }
  const session = await encrypt(payload)
  const cookieStore = await cookies()
 
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })

  return session
}

export async function updateSession() {
  const session = (await cookies()).get('session')?.value
  const payload = await decrypt(session)
 
  if (!session || !payload) {
    return null
  }
 
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}


export async function deleteSession() {
  const cookieStore = await cookies()
  // console.log('cookies before delete:', cookieStore.getAll())
  await cookieStore.delete('session')
  console.log('cookies after delete:', cookieStore.getAll())
  return 
}