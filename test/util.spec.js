import { test, expect } from '@playwright/test'
import { keyboardFocusableElements, uid } from '../src//util.js'

test('uid', () => {
  const a = uid()
  const b = uid()
  expect(a).not.toEqual(b)
})
