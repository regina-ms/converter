import { cookies } from 'next/headers'
import { v4 } from 'uuid'

export async function createSession() {
  const cookieStore = await cookies()
  const userId = `guest_${v4()}`
  cookieStore.set('guest-id', userId, { httpOnly: true, maxAge: 60 * 60 * 24 })
  return userId
}
