import { expect, test } from '@playwright/test'

test('employee dashboard supports search and create workflow entry', async ({ page, isMobile }) => {
  await page.goto('/employees')

  if (isMobile) {
    await expect(page.getByRole('button', { name: 'Open sidebar' })).toBeVisible()
  } else {
    await expect(page.getByText('Employee Management').first()).toBeVisible()
    await expect(page.getByText('Purple Cross Ltd.')).toBeVisible()
  }
  await page.getByPlaceholder('Code, name, role, or department').fill('Nicole')
  await expect(page.getByText('Nicole Berry')).toBeVisible()

  await page.goto('/employees?create=1')
  await expect(page.getByRole('heading', { name: 'Create employee' })).toBeVisible()
  await expect(page.getByPlaceholder('EMP051')).toBeVisible()
})
