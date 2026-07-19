import { cookies } from 'next/headers'
import { v4 } from 'uuid'
import { COOKIE_ID } from '@/constants'

export async function createSession() {
  const cookieStore = await cookies()
  const userId = v4()
  cookieStore.set(COOKIE_ID, userId, { httpOnly: true, maxAge: 31_536_000 })
  return userId
}
