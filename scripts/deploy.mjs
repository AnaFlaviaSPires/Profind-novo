import { loadEnv } from 'vite'
import { spawnSync } from 'node:child_process'
const env = { ...loadEnv('production', process.cwd(), 'VITE_'), ...process.env }
const required = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
]
if (
  required.some((key) => !env[key]) ||
  env.VITE_FIREBASE_PROJECT_ID.startsWith('demo-') ||
  env.VITE_USE_EMULATORS === 'true'
) {
  throw new Error(
    'Deploy bloqueado: configure o aplicativo Firebase real em .env.local ou nas variáveis do ambiente. Projetos demo e emuladores não podem ser publicados.',
  )
}
if (!/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(env.VITE_FIREBASE_PROJECT_ID))
  throw new Error('Project ID inválido.')
function run(file, args) {
  const result = spawnSync(process.execPath, [file, ...args], { stdio: 'inherit', env })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status || 1)
}
run('node_modules/typescript/bin/tsc', ['-b'])
run('node_modules/vite/bin/vite.js', ['build', '--configLoader', 'runner'])
run('node_modules/firebase-tools/lib/bin/firebase.js', [
  'deploy',
  '--project',
  env.VITE_FIREBASE_PROJECT_ID,
  '--only',
  'firestore:rules,firestore:indexes,hosting',
])
