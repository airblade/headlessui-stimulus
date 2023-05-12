import { test, expect } from '@playwright/test'


test.beforeEach(async ({ page }, testInfo) => {
  await page.goto('dialog.html')
})


test('dialog is opened initially', async ({ page }) => {
  await expect(page.locator('[data-controller="dialog"]')).toHaveAttribute('aria-modal', 'true')
  await expect(page.locator('[data-controller="dialog"]')).toHaveAttribute('role', 'dialog')

  let id = await page.locator('[data-dialog-target="title"]').getAttribute('id')
  await expect(page.locator('[data-controller="dialog"]')).toHaveAttribute('aria-labelledby', id)

  id = await page.locator('[data-dialog-target="description"]').getAttribute('id')
  await expect(page.locator('[data-controller="dialog"]')).toHaveAttribute('aria-describedby', id)

  await expect(page.locator('[data-dialog-target="backdrop"]')).toBeVisible()
  await expect(page.locator('[data-dialog-target="panel"]')).toBeVisible()
})


test('mouse click outside open dialog closes dialog', async ({ page }) => {
  await page.locator('#canvas').click({force: true, position: {x: 0, y: 0}})
  await expect(page.locator('[data-dialog-target="backdrop"]')).not.toBeVisible()
  await expect(page.locator('[data-dialog-target="panel"]')).not.toBeVisible()
})


test('escape with open dialog closes dialog', async ({ page }) => {
  await page.keyboard.press('Escape')
  await expect(page.locator('[data-dialog-target="backdrop"]')).not.toBeVisible()
  await expect(page.locator('[data-dialog-target="panel"]')).not.toBeVisible()
})


test('intial focus with open dialog', async ({ page }) => {
  await expect(page.locator('[data-dialog-target="initialFocus"]')).toBeFocused()
})


test('tab when dialog is open focuses next item', async ({ page }) => {
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', {name: 'payment'})).toBeFocused()
})


test('shift+tab when dialog is open focuses previous item', async ({ page }) => {
  await page.keyboard.press('Shift+Tab')
  await expect(page.getByRole('link', {name: 'your order'})).toBeFocused()
})
