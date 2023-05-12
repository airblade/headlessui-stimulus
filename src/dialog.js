import { Controller } from '@hotwired/stimulus'
import { enter, leave } from 'el-transition'

export default class extends Controller {

  static targets = ['panel', 'backdrop', 'title', 'description', 'initialFocus']
  static values  = { open: Boolean, unmount: Boolean }

  // Bind the outside-click handler in initialize() rather than connect()
  // because the openValueChanged() value callback, which uses the handler,
  // runs between initialize() and connect().
  initialize() {
    this.boundCloseOnClickOutsideElement = this.closeOnClickOutsideElement.bind(this)
  }

  connect() {
    this.setAriaAttributes()
  }

  closeOnClickOutsideElement(event) {
    if (!this.panelTarget.contains(event.target)) this.close()
  }

  openValueChanged(value) {
    if (value) {
      this.doOpen()
    }
    else {
      this.doClose()
    }
  }

  open(event) {
    this.openValue = true
    event.stopPropagation()
  }

  close() {
    this.openValue = false
  }

  keydown(event) {
    switch(event.key.toLowerCase()) {
      case 'escape':
        this.close()
        break
      case 'tab':
        event.preventDefault()
        event.shiftKey ? this.up(event) : this.down(event)
        break
    }
  }

  // private

  setAriaAttributes() {
    this.element.setAttribute('aria-modal', true)
    this.element.setAttribute('role', 'dialog')

    if (this.hasTitleTarget) {
      let id = this.titleTarget.id
      if (id == '') {
        id = this.uid()
        this.titleTarget.id = id
      }
      this.element.setAttribute('aria-labelledby', id)
    }

    if (this.hasDescriptionTarget) {
      let id = this.descriptionTarget.id
      if (id == '') {
        id = this.uid()
        this.descriptionTarget.id = id
      }
      this.element.setAttribute('aria-describedby', id)
    }
  }

  doOpen(event) {
    this.element.dataset.headlessuiState = 'open'
    this.panelTarget.dataset.headlessuiState = 'open'

    enter(this.backdropTarget)
    enter(this.panelTarget)

    this.initialFocusElement()?.focus()
    window.addEventListener('click', this.boundCloseOnClickOutsideElement)
  }

  doClose() {
    delete this.element.dataset.headlessuiState
    delete this.panelTarget.dataset.headlessuiState

    window.removeEventListener('click', this.boundCloseOnClickOutsideElement)

    leave(this.backdropTarget)
    leave(this.panelTarget).then(() => {
      if (this.unmountValue) this.element.remove()
    })
  }

  up() {
    const i = this.focusablePanelElements().indexOf(document.activeElement)
    const j = (i - 1 + this.focusablePanelElements().length) %
      this.focusablePanelElements().length
    this.focusablePanelElements()[j].focus()
  }

  down() {
    const i = this.focusablePanelElements().indexOf(document.activeElement)
    const j = (i + 1) % this.focusablePanelElements().length
    this.focusablePanelElements()[j].focus()
  }

  initialFocusElement() {
    return this.hasInitialFocusTarget
         ? this.initialFocusTarget
         : this.focusablePanelElements()[0]
  }

  focusablePanelElements() {
    // Or we could introduce `data-dialog-target="focusable"`.
    return this.keyboardFocusableElements(this.panelTarget)
  }

  keyboardFocusableElements(element) {
    return [
      ...element.querySelectorAll(
        'a[href], button, input:not([type="hidden"]), select, textarea, summary, [tabindex]:not([tabindex="-1"])'
      )
    ].filter(el =>
      !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
    )
  }

  uid() {
    return String(
      Date.now().toString(32) + Math.random().toString(16)
    ).replace(/\./g, '')
  }

}
