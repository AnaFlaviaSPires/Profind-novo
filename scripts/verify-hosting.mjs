import { loadEnv } from 'vite'
const env = { ...loadEnv('production', process.cwd(), 'VITE_'), ...process.env }
const project = env.VITE_FIREBASE_PROJECT_ID
if (!project || !/^[a-z][a-z0-9-]{4,28}[a-z0-9]$/.test(project) || project.startsWith('demo-'))
  throw new Error('Configure o projeto Firebase real.')
const url = `https://${project}.web.app`
for (const path of ['/', '/entrar', '/cliente']) {
  const response = await fetch(url + path)
  if (!response.ok || !(await response.text()).includes('ProFind — Quem sabe fazer.'))
    throw new Error(`Hosting não verificado em ${url + path}`)
}
console.log(
  `Hosting acessível e fallback SPA verificado: ${url}. Execute também o roteiro de autenticação em produção.`,
)
