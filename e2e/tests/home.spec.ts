import { expect, test } from '@playwright/test'

test('carga la home y muestra el mensaje de privacidad', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', { name: /Calcula tu indemnización, finiquito y paro/i }),
  ).toBeVisible()
  await expect(page.getByText(/procesamos todo localmente en tu navegador/i)).toBeVisible()
})
