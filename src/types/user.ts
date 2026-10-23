import type { Timestamp } from 'firebase/firestore'

export type Role = 'client' | 'professional'
export interface UserProfile {
  name: string
  email: string
  roles: Role[]
  createdAt: Timestamp
  updatedAt: Timestamp
}
