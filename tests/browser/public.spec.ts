import { test, expect } from '@playwright/test'

for (const width of [320, 390, 768, 1440]) {
  test(`página pública e formulários sem overflow em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /Quem sabe fazer/ })).toBeVisible()
    await expect(page.locator('.category')).toHaveCount(7)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.screenshot({ path: `artifacts/home-${width}.png`, fullPage: true })
    await page.getByRole('link', { name: 'Solicitar serviço', exact: true }).click()
    await expect(page).toHaveURL(/\/entrar/)
    await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeDisabled()
    for (const path of ['/cadastrar?perfil=professional', '/recuperar-senha']) {
      await page.goto(path)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
    }
    expect(errors).toEqual([])
  })
}
test('menu móvel abre, navega e fecha', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto('/')
  await page.getByRole('button', { name: 'Abrir menu' }).click()
  await expect(page.getByRole('navigation')).toBeVisible()
  await page.getByRole('navigation').getByRole('link', { name: 'Sou profissional' }).click()
  await expect(page).toHaveURL(/perfil=professional/)
  await expect(page.getByRole('button', { name: 'Sou profissional', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  )
  await expect(page.getByRole('navigation')).toBeHidden()
})
test('visitante não acessa ambientes privados e rota desconhecida é tratada', async ({ page }) => {
  for (const area of ['cliente', 'profissional', 'admin']) {
    await page.goto(`/${area}`)
    await expect(page).toHaveURL(/\/entrar/)
  }
  await page.goto('/inexistente')
  await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible()
})
