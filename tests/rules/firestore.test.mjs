import { readFile } from 'node:fs/promises'
import { after, before, beforeEach, test } from 'node:test'
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing'
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore'

let env
before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'demo-profind',
    firestore: { host: '127.0.0.1', port: 8080, rules: await readFile('firestore.rules', 'utf8') },
  })
})
beforeEach(async () => {
  await env.clearFirestore()
})
after(async () => {
  await env?.cleanup()
})
const dbFor = (uid, claims = {}) =>
  env.authenticatedContext(uid, { email: `${uid}@example.com`, ...claims }).firestore()
const userData = (uid, roles = ['client']) => ({
  name: 'Pessoa Teste',
  email: `${uid}@example.com`,
  roles,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
})
const professionalData = () => ({
  status: 'DRAFT',
  available: false,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp(),
})
async function createProfessional(db, uid, roles = ['professional']) {
  const batch = writeBatch(db)
  batch.set(doc(db, 'users', uid), userData(uid, roles))
  batch.set(doc(db, 'professionalProfiles', uid), professionalData())
  return batch.commit()
}
test('cliente cria e lê somente o próprio perfil', async () => {
  const db = dbFor('ana')
  await assertSucceeds(setDoc(doc(db, 'users/ana'), userData('ana')))
  await assertSucceeds(getDoc(doc(db, 'users/ana')))
  await assertFails(getDoc(doc(dbFor('bia'), 'users/ana')))
  await assertFails(getDocs(collection(db, 'users')))
  await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'users/ana')))
})
test('proíbe criar perfil em nome de outro usuário', async () => {
  await assertFails(setDoc(doc(dbFor('bia'), 'users/ana'), userData('ana')))
})
test('proíbe admin em papel, campo adicional e alteração de e-mail', async () => {
  const db = dbFor('ana')
  const ref = doc(db, 'users/ana')
  await assertFails(setDoc(ref, userData('ana', ['admin'])))
  await assertFails(setDoc(ref, { ...userData('ana'), admin: true }))
  await assertFails(setDoc(ref, { ...userData('ana'), email: 'outra@example.com' }))
  await setDoc(ref, userData('ana'))
  await assertFails(updateDoc(ref, { admin: true, updatedAt: serverTimestamp() }))
  await assertFails(updateDoc(ref, { roles: ['client', 'admin'], updatedAt: serverTimestamp() }))
})
test('cadastro profissional é atômico e nasce bloqueado', async () => {
  const db = dbFor('ana')
  await assertFails(setDoc(doc(db, 'users/ana'), userData('ana', ['professional'])))
  await assertSucceeds(createProfessional(db, 'ana'))
  await assertSucceeds(getDoc(doc(db, 'professionalProfiles/ana')))
  await assertFails(
    updateDoc(doc(db, 'professionalProfiles/ana'), { status: 'APPROVED', available: true }),
  )
  await assertFails(getDoc(doc(dbFor('bia'), 'professionalProfiles/ana')))
})
test('proíbe autoaprovação mesmo na criação e campos operacionais', async () => {
  const db = dbFor('ana')
  const batch = writeBatch(db)
  batch.set(doc(db, 'users/ana'), userData('ana', ['professional']))
  batch.set(doc(db, 'professionalProfiles/ana'), { ...professionalData(), status: 'APPROVED' })
  await assertFails(batch.commit())
  await assertFails(setDoc(doc(db, 'services/teste'), { clientId: 'ana' }))
  await assertFails(getDoc(doc(db, 'servicePrivate/teste')))
})
test('mesma identidade adiciona papel profissional em transação e mantém cliente', async () => {
  const db = dbFor('ana')
  const ref = doc(db, 'users/ana')
  await setDoc(ref, userData('ana'))
  const batch = writeBatch(db)
  batch.update(ref, { roles: ['client', 'professional'], updatedAt: serverTimestamp() })
  batch.set(doc(db, 'professionalProfiles/ana'), professionalData())
  await assertSucceeds(batch.commit())
  await assertFails(updateDoc(ref, { roles: ['professional'], updatedAt: serverTimestamp() }))
  await assertFails(updateDoc(ref, { roles: ['client', 'client'], updatedAt: serverTimestamp() }))
  await assertFails(deleteDoc(ref))
})
test('profissional pode adicionar cliente e dados imutáveis permanecem protegidos', async () => {
  const db = dbFor('ana')
  const ref = doc(db, 'users/ana')
  await createProfessional(db, 'ana')
  await assertSucceeds(
    updateDoc(ref, { roles: ['professional', 'client'], updatedAt: serverTimestamp() }),
  )
  await assertFails(updateDoc(ref, { email: 'bia@example.com', updatedAt: serverTimestamp() }))
  await assertFails(updateDoc(ref, { createdAt: new Date(0), updatedAt: serverTimestamp() }))
})
test('sem token administrativo não há acesso; mesmo admin não lista dados nesta sprint', async () => {
  const db = dbFor('ana', { admin: true })
  await assertFails(getDocs(collection(db, 'users')))
  await assertFails(getDoc(doc(db, 'users/bia')))
})
