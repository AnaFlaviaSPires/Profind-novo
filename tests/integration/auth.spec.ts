import { test, expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
const adminApp = initializeApp({ projectId: 'demo-profind' }, 'integration')
const password = 'Profind123!'
const emailFor = (prefix: string) => `${prefix}-${Date.now()}@example.com`
async function register(page: Page, email: string, professional = false) {
  await page.goto(`/cadastrar${professional ? '?perfil=professional' : ''}`)
  await page.getByLabel('Nome', { exact: true }).fill('Pessoa Teste')
  await page.getByLabel('E-mail', { exact: true }).fill(email)
  await page.getByLabel('Senha', { exact: true }).fill(password)
  await page.getByLabel('Confirme sua senha').fill(password)
  await page.getByRole('button', { name: 'Criar conta', exact: true }).click()
  await expect(page).toHaveURL(professional ? /\/profissional$/ : /\/cliente$/)
}
test('cliente cadastra, persiste sessão, sai, entra e não acessa admin', async ({ page }) => {
  const email = emailFor('cliente')
  await register(page, email)
  await expect(page.getByRole('heading', { name: 'Olá, Pessoa.' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Olá, Pessoa.' })).toBeVisible()
  await page.goto('/admin')
  await expect(page.getByRole('heading', { name: 'Acesso restrito' })).toBeVisible()
  await page.goto('/cliente')
  await page.getByRole('button', { name: 'Sair', exact: true }).click()
  await expect(page).toHaveURL(/\/entrar/)
  await page.getByLabel('E-mail', { exact: true }).fill(email)
  await page.getByLabel('Senha', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page).toHaveURL(/\/cliente$/)
})
test('profissional nasce bloqueado e adiciona papel cliente na mesma identidade', async ({
  page,
}) => {
  await register(page, emailFor('profissional'), true)
  await expect(page.getByText(/ainda não está habilitado/)).toBeVisible()
  await page.getByRole('button', { name: 'Também quero ser cliente' }).click()
  await page.getByRole('link', { name: 'Ir para o ambiente cliente' }).click()
  await expect(page).toHaveURL(/\/cliente$/)
  await page.goto('/conta')
  await expect(page.getByRole('heading', { name: 'Escolha seu ambiente' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Administração', exact: true })).toHaveCount(0)
  await page.getByRole('link', { name: 'Profissional', exact: true }).click()
  await page.getByRole('button', { name: 'Sair', exact: true }).click()
  await expect(page).toHaveURL(/\/entrar/)
})
test('cliente pode adicionar profissional e não duplica conta', async ({ page }) => {
  await register(page, emailFor('duplo'))
  await page.getByRole('button', { name: 'Também quero ser profissional' }).click()
  await page.getByRole('link', { name: 'Ir para o ambiente profissional' }).click()
  await expect(page).toHaveURL(/\/profissional$/)
  await expect(page.getByText(/ainda não está habilitado/)).toBeVisible()
})
test('validação impede confirmação divergente e login incorreto mostra erro', async ({ page }) => {
  await page.goto('/cadastrar')
  await page.getByLabel('Nome', { exact: true }).fill('Pessoa Teste')
  await page.getByLabel('E-mail', { exact: true }).fill(emailFor('validacao'))
  await page.getByLabel('Senha', { exact: true }).fill(password)
  await page.getByLabel('Confirme sua senha').fill('outrasenha')
  await page.getByRole('button', { name: 'Criar conta', exact: true }).click()
  await expect(page.getByRole('alert')).toHaveText('As senhas precisam ser iguais.')
  await page.goto('/entrar')
  await page.getByLabel('E-mail', { exact: true }).fill(emailFor('inexistente'))
  await page.getByLabel('Senha', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('E-mail ou senha incorretos')
})
test('recuperação gera código no emulador e permite trocar senha', async ({ page, request }) => {
  const email = emailFor('recuperacao')
  await register(page, email)
  await page.getByRole('button', { name: 'Sair', exact: true }).click()
  await page.goto('/recuperar-senha')
  await page.getByLabel('E-mail', { exact: true }).fill(email)
  await page.getByRole('button', { name: 'Enviar instruções' }).click()
  await expect(page.getByRole('heading', { name: 'Confira seu e-mail' })).toBeVisible()
  const response = await request.get(
    'http://127.0.0.1:9099/emulator/v1/projects/demo-profind/oobCodes',
  )
  const codes = await response.json()
  const code = codes.oobCodes.find((item: { email: string }) => item.email === email)
  expect(code?.oobCode).toBeTruthy()
  const change = await request.post(
    'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=demo-key-not-a-real-credential',
    { data: { oobCode: code.oobCode, newPassword: 'NovaSenha123!' } },
  )
  expect(change.ok()).toBe(true)
  await page.goto('/entrar')
  await page.getByLabel('E-mail', { exact: true }).fill(email)
  await page.getByLabel('Senha', { exact: true }).fill('NovaSenha123!')
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page).toHaveURL(/\/cliente$/)
})
test('conta Auth sem perfil consegue concluir cadastro após interrupção', async ({
  page,
  request,
}) => {
  const email = emailFor('interrompido')
  const result = await request.post(
    'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key-not-a-real-credential',
    { data: { email, password, returnSecureToken: true } },
  )
  expect(result.ok()).toBe(true)
  await page.goto('/entrar')
  await page.getByLabel('E-mail', { exact: true }).fill(email)
  await page.getByLabel('Senha', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Conclua seu cadastro' })).toBeVisible()
  await page.getByLabel('Nome', { exact: true }).fill('Conta Recuperada')
  await page.getByRole('button', { name: 'Concluir cadastro' }).click()
  await expect(page).toHaveURL(/\/cliente$/)
})
test('claim confiável permite ambiente administrativo e logout', async ({ page, request }) => {
  const email = emailFor('admin-autorizado')
  const result = await request.post(
    'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key-not-a-real-credential',
    { data: { email, password, returnSecureToken: true } },
  )
  const account = await result.json()
  await getAuth(adminApp).setCustomUserClaims(account.localId, { admin: true })
  await page.goto('/entrar')
  await page.getByLabel('E-mail', { exact: true }).fill(email)
  await page.getByLabel('Senha', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await page.getByRole('link', { name: 'Administração', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Acesso administrativo autorizado.' }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Sair', exact: true }).click()
  await expect(page).toHaveURL(/\/entrar/)
})
