import path from 'node:path'

import { expect, test } from '@playwright/test'

const FIXTURES_DIR = path.join(process.cwd(), 'e2e', 'fixtures')

test('muestra error controlado al subir un PDF vacío', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('file-input').setInputFiles(path.join(FIXTURES_DIR, 'nomina-vacia.pdf'))

  await expect(page.getByTestId('error-modal')).toBeVisible()
  await expect(page.getByText(/Archivo vacío/i)).toBeVisible()
})

test('abre el modal de contraseña al subir un ZIP', async ({ page }) => {
  await page.goto('/')

  await page
    .getByTestId('file-input')
    .setInputFiles(path.join(FIXTURES_DIR, 'nomina-protegida.zip'))

  await expect(page.getByTestId('password-modal')).toBeVisible()
  await expect(page.getByText(/Nómina Protegida con Contraseña/i)).toBeVisible()
})
