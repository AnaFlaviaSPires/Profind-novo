import { doc, runTransaction, serverTimestamp } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from '../lib/firebase'
import type { Role, UserProfile } from '../types/user'

// A transaction also makes retrying an interrupted registration idempotent.
export async function ensureProfile(user: User, name: string, role: Role) {
  if (!db || !user.email) throw new Error('Firebase indisponível')
  const database = db
  await runTransaction(database, async (transaction) => {
    const ref = doc(database, 'users', user.uid)
    const snapshot = await transaction.get(ref)
    const old = snapshot.exists() ? (snapshot.data() as UserProfile) : null
    if (old?.roles.includes(role)) return
    const roles = old ? [...old.roles, role] : [role]
    if (old) transaction.update(ref, { roles, updatedAt: serverTimestamp() })
    else
      transaction.set(ref, {
        name: name.trim(),
        email: user.email,
        roles,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    if (role === 'professional')
      transaction.set(doc(database, 'professionalProfiles', user.uid), {
        status: 'DRAFT',
        available: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
  })
}
