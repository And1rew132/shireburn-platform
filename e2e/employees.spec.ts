import { expect, test } from '@playwright/test'

test('employee dashboard supports search and create workflow entry', async ({ page }) => {
  await page.goto('/employees')

  await expect(page.getByText('Purple Cross Ltd.')).toBeVisible()
  await page.getByPlaceholder('Code, name, role, or department').fill('Nicole')
  await expect(page.getByText('Nicole Berry')).toBeVisible()

  await page.goto('/employees?create=1')
  await expect(page.getByRole('heading', { name: 'Create employee' })).toBeVisible()
  await expect(page.getByPlaceholder('EMP051')).toBeVisible()
})
