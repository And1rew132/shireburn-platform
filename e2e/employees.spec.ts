import { expect, test } from '@playwright/test'

test('employee dashboard supports login, search, floating create, and logout', async ({ page, isMobile }) => {
  await page.goto('/employees')

  await expect(page.getByRole('heading', { name: 'Employee Management' })).toBeVisible()
  await page.getByLabel('Email').fill('sarah.mallia@shireburn.com')
  await page.getByLabel('Password').fill('shireburn-demo')
  await expect(page.getByRole('button', { name: 'Login' })).toBeEnabled()
  await page.waitForLoadState('networkidle')
  await page.getByRole('button', { name: 'Login' }).click()

  await expect(page).toHaveURL(/\/employees/)
  if (isMobile) {
    await expect(page.getByRole('button', { name: 'Open sidebar' })).toBeVisible()
  } else {
    await expect(page.getByText('Employee Management').first()).toBeVisible()
    await expect(page.getByText('Purple Cross Ltd.')).toBeVisible()
  }

  await page.getByPlaceholder('Code, name, role, or department').fill('Nicole')
  await expect(page.getByText('Nicole Berry')).toBeVisible()

  await page.getByRole('button', { name: 'Open floating actions' }).click()
  await page.getByRole('button', { name: 'Create employee' }).click()
  await expect(page.getByRole('heading', { name: 'Create employee' })).toBeVisible()
  await expect(page.getByPlaceholder('EMP051')).toBeVisible()
  await page.getByRole('button', { name: 'Close' }).click()
  await expect(page.getByRole('heading', { name: 'Create employee' })).toBeHidden()

  await page.getByRole('button', { name: 'Logout' }).click()
  await expect(page).toHaveURL(/\/login/)
})
