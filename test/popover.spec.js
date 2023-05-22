import { test, expect } from '@playwright/test'


test.beforeEach(async ({ page }, testInfo) => {
  await page.goto('popover.html')
})


test('popover button is not focused initially', async ({ page }) => {
  await expect(page.locator('[data-popover-target="button"]')).not.toBeFocused()
})


test('popover is closed initially', async ({ page }) => {
  await expect(page.locator('[data-popover-target="button"]')).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('[data-popover-target="panel"]')).not.toBeVisible()
})


test('popover button controls panel', async ({ page }) => {
  const id = await page.locator('[data-popover-target="panel"]').getAttribute('id')
  await expect(page.locator('[data-popover-target="button"]')).toHaveAttribute('aria-controls', id)
})


test('state of open popover', async ({ page }) => {
  await page.locator('[data-popover-target="button"]').click()
  await expect(page.locator('[data-controller="popover"]')).toHaveAttribute('data-popover-open-value', 'true')
  await expect(page.locator('[data-controller="popover"]')).toHaveAttribute('data-headlessui-state', 'open')
  await expect(page.locator('[data-popover-target="button"]')).toHaveAttribute('data-headlessui-state', 'open')
  await expect(page.locator('[data-popover-target="button"]')).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('[data-popover-target="panel"]')).toHaveAttribute('data-headlessui-state', 'open')
  await expect(page.locator('[data-popover-target="panel"]')).toBeVisible()
  await expect(page.locator('a:has-text("Some link")')).not.toBeFocused()
})


test('state of opened then closed popover', async ({ page }) => {
  await page.locator('[data-popover-target="button"]').click()
  await page.locator('[data-popover-target="overlay"]').click()
  await expect(page.locator('[data-controller="popover"]')).toHaveAttribute('data-popover-open-value', 'false')
  await expect(page.locator('[data-controller="popover"]')).not.toHaveAttribute('data-headlessui-state', 'open')
  await expect(page.locator('[data-popover-target="button"]')).not.toHaveAttribute('data-headlessui-state', 'open')
  await expect(page.locator('[data-popover-target="button"]')).not.toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('[data-popover-target="panel"]')).not.toHaveAttribute('data-headlessui-state', 'open')
  await expect(page.locator('[data-popover-target="panel"]')).not.toBeVisible()
  await expect(page.locator('a:has-text("Some link")')).not.toBeFocused()
  await expect(page.locator('[data-popover-target="button"]')).toBeFocused()
})


test('mouse click button opens popover', async ({ page }) => {
  await page.locator('[data-popover-target="button"]').click()
  await expect(page.locator('[data-controller="popover"]')).toHaveAttribute('data-popover-open-value', 'true')
})


test.skip('mouse click button with open menu closes menu', async ({ page }) => {
  // the overlay intercepts pointer events so we cannot reach the button
})


test('mouse click overlay closes menu', async ({ page }) => {
  await page.locator('[data-popover-target="button"]').click()
  await page.locator('[data-popover-target="overlay"]').click()
  await expect(page.locator('[data-controller="popover"]')).toHaveAttribute('data-popover-open-value', 'false')
})


test('enter on button opens popover', async ({ page }) => {
  await page.locator('[data-popover-target="button"]').focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('[data-controller="popover"]')).toHaveAttribute('data-popover-open-value', 'true')
})


test('space on button opens popover', async ({ page }) => {
  await page.locator('[data-popover-target="button"]').focus()
  await page.keyboard.press('Space')
  await expect(page.locator('[data-controller="popover"]')).toHaveAttribute('data-popover-open-value', 'true')
})


test('escape with open popover closes popover', async ({ page }) => {
  await page.locator('[data-popover-target="button"]').focus()
  await page.keyboard.press('Escape')
  await expect(page.locator('[data-controller="popover"]')).toHaveAttribute('data-popover-open-value', 'false')
  await expect(page.locator('[data-popover-target="button"]')).toBeFocused()
})


test('tab when popover is open focuses first item in panel', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Fails for React and Vue too')

  await page.locator('[data-popover-target="button"]').focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Tab')
  await expect(page.locator('a:has-text("Some link")')).toBeFocused()
})


test('shift+tab when popover is open focuses previous item', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Fails for React and Vue too')

  await page.locator('[data-popover-target="button"]').focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await expect(page.locator('a:has-text("Another link")')).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(page.locator('a:has-text("Some link")')).toBeFocused()
})


test('tabbing out of popover closes it', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Fails for React and Vue too')

  await page.locator('[data-popover-target="button"]').focus()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await expect(page.locator('select')).toBeFocused()
  await expect(page.locator('[data-controller="popover"]')).toHaveAttribute('data-popover-open-value', 'false')
})
