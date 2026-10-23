// Run locally under a trusted operator's Application Default Credentials, never in the browser.
import { initializeApp, applicationDefault } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
const [projectId, uid, action] = process.argv.slice(2)
if (!projectId || !uid || !['grant', 'revoke'].includes(action)) {
  throw new Error('Uso: node scripts/set-admin.mjs PROJECT_ID UID grant|revoke')
}
initializeApp({ credential: applicationDefault(), projectId })
const auth = getAuth()
const user = await auth.getUser(uid)
const claims = { ...user.customClaims }
if (action === 'grant') claims.admin = true
else delete claims.admin
await auth.setCustomUserClaims(uid, claims)
await auth.revokeRefreshTokens(uid)
console.log(
  `Autorização administrativa ${action === 'grant' ? 'atribuída' : 'removida'}. Entre novamente para atualizar os privilégios. Tokens existentes podem durar até uma hora.`,
)
