import { expect, test } from '@playwright/test'

test('permite calcular en modo manual y resetear la app', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: /Continuar en Modo Manual/i }).click()
  await expect(page.getByText(/Estás en modo manual/i)).toBeVisible()
  await expect(page.getByTestId('result-salario-anual')).toContainText('24.000')

  await page.getByLabel(/Salario Fijo Mensual/i).fill('3000')
  await expect(page.getByTestId('result-salario-anual')).toContainText('36.000')

  await page.locator('#slider-dias').evaluate((node) => {
    const input = node as HTMLInputElement
    input.value = '33'
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })
  await expect(page.locator('#slider-dias')).toHaveValue('33')

  await page.getByRole('button', { name: /Calcular otro documento/i }).click()
  await expect(page.getByRole('heading', { name: /Sube tu nómina \(PDF o ZIP\)/i })).toBeVisible()
})
