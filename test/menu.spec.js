import { test, expect } from '@playwright/test'


test.beforeEach(async ({ page }, testInfo) => {
  await page.goto('menu.html')
})


test('menu is closed initially', async ({ page }) => {
  await expect(page.locator('[data-menu-target="button"]')).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('[data-menu-target="menuItems"]')).not.toBeVisible()
})


test('mouse click button opens menu', async ({ page }) => {
  await page.locator('[data-menu-target="button"]').click()
  await expect(page.locator('[data-menu-target="button"]')).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('[data-menu-target="menuItems"]')).toBeVisible()
  await expect(page.locator('[data-menu-target="menuItem"]').locator('nth=0')).toBeFocused()
})


test('mouse click button with open menu closes menu', async ({ page }) => {
  await page.locator('[data-menu-target="button"]').click()
  await page.locator('[data-menu-target="button"]').click()
  await expect(page.locator('[data-menu-target="button"]')).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('[data-menu-target="button"]')).toBeFocused()
  await expect(page.locator('[data-menu-target="menuItems"]')).not.toBeVisible()
})


test('mouse click outside open menu closes menu', async ({ page }) => {
  await page.locator('[data-menu-target="button"]').click()
  await page.getByText('This is outside the menu.').click()
  await expect(page.locator('[data-menu-target="button"]')).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('[data-menu-target="button"]')).toBeFocused()
  await expect(page.locator('[data-menu-target="menuItems"]')).not.toBeVisible()
})


test('enter on button opens menu', async ({ page }) => {
  await page.locator('[data-menu-target="button"]').focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('[data-menu-target="button"]')).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('[data-menu-target="menuItems"]')).toBeVisible()
  await expect(page.locator('[data-menu-target="menuItem"]').locator('nth=0')).toBeFocused()
})


test('space on button opens menu', async ({ page }) => {
  await page.locator('[data-menu-target="button"]').focus()
  await page.keyboard.press('Space')
  await expect(page.locator('[data-menu-target="button"]')).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('[data-menu-target="menuItems"]')).toBeVisible()
  await expect(page.locator('[data-menu-target="menuItem"]').locator('nth=0')).toBeFocused()
})


test('down arrow on button opens menu and focuses first item', async ({ page }) => {
  await page.locator('[data-menu-target="button"]').focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('[data-menu-target="button"]')).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('[data-menu-target="menuItems"]')).toBeVisible()
  await expect(page.locator('[data-menu-target="menuItem"]').locator('nth=0')).toBeFocused()
})


test('up arrow on button opens menu and focuses last item', async ({ page }) => {
  await page.locator('[data-menu-target="button"]').focus()
  await page.keyboard.press('ArrowUp')
  await expect(page.locator('[data-menu-target="button"]')).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('[data-menu-target="menuItems"]')).toBeVisible()
  await expect(page.locator('[data-menu-target="menuItem"]').locator('nth=-1')).toBeFocused()
})


test('escape with open menu closes menu', async ({ page }) => {
  await page.locator('[data-menu-target="button"]').click()
  await page.keyboard.press('Escape')
  await expect(page.locator('[data-menu-target="button"]')).toHaveAttribute('aria-expanded', 'false')
  await expect(page.locator('[data-menu-target="button"]')).toBeFocused()
  await expect(page.locator('[data-menu-target="menuItems"]')).not.toBeVisible()
})


test('down arrow when menu is open focuses next item', async ({ page }) => {
  await page.locator('[data-menu-target="button"]').click()
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('[data-menu-target="menuItem"]').locator('nth=1')).toBeFocused()
})


test('up arrow when menu is open focuses previous item', async ({ page }) => {
  await page.locator('[data-menu-target="button"]').click()
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowUp')
  await expect(page.locator('[data-menu-target="menuItem"]').locator('nth=0')).toBeFocused()
})


test('down arrow when menu is open skips disabled items', async ({ page }) => {
  await page.locator('[data-menu-target="button"]').click()
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('[data-menu-target="menuItem"]').locator('nth=3')).toBeFocused()
})


test('up arrow when menu is open skips disabled items', async ({ page }) => {
  await page.locator('[data-menu-target="button"]').click()
  await page.keyboard.press('End')
  await page.keyboard.press('ArrowUp')
  await page.keyboard.press('ArrowUp')
  await expect(page.locator('[data-menu-target="menuItem"]').locator('nth=1')).toBeFocused()
})


test('down arrow when menu is open does not wrap', async ({ page }) => {
  await page.locator('[data-menu-target="button"]').click()
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('[data-menu-target="menuItem"]').locator('nth=4')).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(page.locator('[data-menu-target="menuItem"]').locator('nth=4')).toBeFocused()
})


test('up arrow when menu is open does not wrap', async ({ page }) => {
  await page.locator('[data-menu-target="button"]').click()
  await page.keyboard.press('ArrowUp')
  await page.keyboard.press('ArrowUp')
  await page.keyboard.press('ArrowUp')
  await expect(page.locator('[data-menu-target="menuItem"]').locator('nth=0')).toBeFocused()
  await page.keyboard.press('ArrowUp')
  await expect(page.locator('[data-menu-target="menuItem"]').locator('nth=0')).toBeFocused()
})


test('home when menu is open focuses first item', async ({ page }) => {
  await page.locator('[data-menu-target="button"]').click()
  await page.keyboard.press('Home')
  await expect(page.locator('[data-menu-target="menuItem"]').locator('nth=0')).toBeFocused()
})


test('end when menu is open focuses last item', async ({ page }) => {
  await page.locator('[data-menu-target="button"]').click()
  await page.keyboard.press('End')
  await expect(page.locator('[data-menu-target="menuItem"]').locator('nth=-1')).toBeFocused()
})


test.skip('enter when menu is open activates current item', async ({ page }) => {
  // I can't figure out how to test this
  // https://stackoverflow.com/q/76111166/151007
  await page.locator('[data-menu-target="button"]').click()

  let clicked = false
  page.locator('[data-menu-target="menuItem"]').locator('nth=0').once('click', event => {clicked = true})

  await page.keyboard.press('Enter')

  await expect(clicked).toBeTruthy()
})


test.skip('space when menu is open activates current item', async ({ page }) => {
  // Same problem as previous test.
})


test('letter when menu is open focuses first item matching letter', async ({ page }) => {
  await page.locator('[data-menu-target="button"]').click()
  await page.keyboard.type('m')
  await expect(page.locator('[data-menu-target="menuItem"]').filter({hasText: 'Move'})).toBeFocused()
})


test('focus is trapped when menu is open', async ({ page }) => {
  await page.locator('[data-menu-target="button"]').click()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  // tab wraps around
  await expect(page.locator('[data-menu-target="menuItem"]').locator('nth=0')).toBeFocused()
})
