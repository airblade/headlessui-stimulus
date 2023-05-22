import { Controller } from '@hotwired/stimulus'
import { enter, leave } from 'el-transition'
import { keyboardFocusableElements, uid } from './util.js'

// TODO popover group - https://github.com/tailwindlabs/headlessui/discussions/2503
export default class extends Controller {

  static targets = ['button', 'panel', 'overlay']
  static values  = {
    open: Boolean,
    focusPanel: Boolean,
    focusOnClose: String,
    unmount: Boolean
  }

  initialize() {
    this.boundCloseOnClickOutsideElement = this.closeOnClickOutsideElement.bind(this)
  }

  connect() {
    this.connected = true
    this.setAriaAttributes()
  }

  disconnect() {
    window.removeEventListener('click', this.boundCloseOnClickOutsideElement)
  }

  closeOnClickOutsideElement(event) {
    if (!this.element.contains(event.target)) this.close()
  }

  openValueChanged(value, prev) {
    if (value) {
      this.doOpen()
    }
    else {
      this.doClose()
    }
  }

  toggle() {
    this.openValue = !this.openValue
  }

  open(event) {
    this.openValue = true
  }

  close() {
    this.openValue = false
  }

  // Override this to use a third party, e.g. Popper.js.
  async showPanel() {
    await enter(this.panelTarget)
  }

  keydownPanel(event) {
    if (event.key.toLowerCase() !== 'tab') return

    window.requestAnimationFrame(() => {
      if (!this.panelTarget.contains(document.activeElement)) {
        this.tabbing = true
        this.close()
      }
    })
  }

  async doOpen() {
    this.element.dataset.headlessuiState = 'open'
    this.buttonTarget.dataset.headlessuiState = 'open'
    this.panelTarget.dataset.headlessuiState = 'open'

    this.buttonTarget.setAttribute('aria-expanded', 'true')

    if (this.hasOverlayTarget) enter(this.overlayTarget)

    await this.showPanel()
    if (this.focusPanelValue) this.focusPanelFirstElement()

    window.addEventListener('click', this.boundCloseOnClickOutsideElement)
  }

  doClose() {
    delete this.element.dataset.headlessuiState
    delete this.buttonTarget.dataset.headlessuiState
    delete this.panelTarget.dataset.headlessuiState

    this.buttonTarget.setAttribute('aria-expanded', 'false')

    window.removeEventListener('click', this.boundCloseOnClickOutsideElement)

    if (this.hasOverlayTarget) leave(this.overlayTarget)

    leave(this.panelTarget).then(() => {
      if (this.unmountValue) this.panelTarget.remove()
    })

    if (!this.connected) return

    this.setFocusOnClose()
  }

  focusPanelFirstElement() {
    keyboardFocusableElements(this.panelTarget)[0]?.focus()
  }

  setFocusOnClose() {
    if (this.tabbing) {
      this.tabbing = false
      return
    }

    if (this.focusOnCloseValue === '') {
      this.buttonTarget.focus()
    }
    else {
      document.querySelector(this.focusOnCloseValue)?.focus()
    }
  }

  setAriaAttributes() {
    let id = this.panelTarget.id
    if (id == '') {
      id = uid()
      this.panelTarget.id = id
    }
    this.buttonTarget.setAttribute('aria-controls', id)
  }

}
