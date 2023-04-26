import { Controller } from '@hotwired/stimulus'
import { enter, leave } from 'el-transition'

export default class extends Controller {

  static targets = ['button', 'menuItems', 'menuItem']
  static values  = {index: Number}

  connect() {
    this.boundCloseOnClickOutsideElement = this.closeOnClickOutsideElement.bind(this)
  }

  closeOnClickOutsideElement(event) {
    if (!this.element.contains(event.target)) this.close()
  }

  indexValueChanged(value) {
    this.menuItemTargets.forEach(
      (el, i) => el.dataset.headlessuiState = i == value ? 'active' : ''
    )
    this.menuItemTargets[value].focus()
  }

  toggle(event) {
    if (this.isOpen()) {
      this.close()
    }
    else {
      this.open(event)
      this.first()
    }
  }

  open(event) {
    this.element.setAttribute('open', '')
    this.buttonTarget.setAttribute('aria-expanded', 'true')
    this.menuItemsTarget.dataset.headlessuiState = 'open'

    enter(this.menuItemsTarget)

    window.addEventListener('click', this.boundCloseOnClickOutsideElement)
    // Stop this (click) event from triggering the listener we just
    // added to the window.
    if (event.type === 'click') event.stopPropagation()
  }

  close() {
    window.removeEventListener('click', this.boundCloseOnClickOutsideElement)

    this.element.removeAttribute('open')
    this.buttonTarget.setAttribute('aria-expanded', 'false')
    delete this.menuItemsTarget.dataset.headlessuiState

    leave(this.menuItemsTarget).then(() => {
      this.buttonTarget.focus()
    })
  }

  down(event) {
    if (this.isOpen()) {
      this.indexValue = this.indexOf(this.activeMenuItemSucc())
    }
    else {
      this.open(event)
      this.first()
    }
  }

  up(event) {
    if (this.isOpen()) {
      this.indexValue = this.indexOf(this.activeMenuItemPrev())
    }
    else {
      this.open(event)
      this.last()
    }
  }

  first() {
    if (!this.isOpen()) return
    this.indexValue = this.indexOf(this.activeMenuItems()[0])
  }

  last() {
    if (!this.isOpen()) return
    this.indexValue = this.indexOf(
      this.activeMenuItems()[this.activeMenuItems().length - 1]
    )
  }

  clickItem(event) {
    event.target.click()
  }

  // letter - lowercase
  focusMatchingItem(letter) {
    const i = this
      .menuItemTargets
      .findIndex(el => el.textContent.trim()[0].toLowerCase() === letter)
    if (i != -1) this.indexValue = i
  }

  keydownButton(event) {
    switch (event.key.toLowerCase()) {
      case 'arrowup':
        this.up(event)
        break
      case 'arrowdown':
        this.down(event)
        break

    }
  }

  keydownItems(event) {
    const key = event.key.toLowerCase()
    switch (key) {
      case 'escape':
        this.close()
        break
      case 'arrowup':
        this.up(event)
        break
      case 'arrowdown':
        this.down(event)
        break
      case 'tab':
        event.preventDefault()
        this.down(event)
        break
      case 'home':
        this.first()
        break
      case 'end':
        this.last()
        break
      case key.length == 1 && /[a-z]/.test(key) && key:
        this.focusMatchingItem(key)
        break
    }
  }

  indexOf(menuItem) {
    return this.menuItemTargets.indexOf(menuItem)
  }

  activeIndexOf(menuItem) {
    return this.activeMenuItems().indexOf(menuItem)
  }

  activeIndex() {
    return this.activeIndexOf(this.activeMenuItem())
  }

  activeMenuItem() {
    return this.menuItemTargets[this.indexValue]
  }

  activeMenuItemSucc() {
    return this.activeMenuItems()[
      (this.activeIndex() + 1) % this.activeMenuItems().length
    ]
  }

  activeMenuItemPrev(menuItem) {
    return this.activeMenuItems()[
      (this.activeIndex() - 1 + this.activeMenuItems().length) %
        this.activeMenuItems().length
    ]
  }

  activeMenuItems() {
    return this.menuItemTargets.filter(el => !el.hasAttribute('disabled'))
  }

  isOpen() {
    return this.element.hasAttribute('open')
  }

}
