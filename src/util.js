export function keyboardFocusableElements(element) {
  return [
    ...element.querySelectorAll(
      'a[href], button, input:not([type="hidden"]), select, textarea, summary, [tabindex]:not([tabindex="-1"])'
    )
  ].filter(el =>
    !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
  )
}

export function uid() {
  return String(
    Date.now().toString(32) + Math.random().toString(16)
  ).replace(/\./g, '')
}
