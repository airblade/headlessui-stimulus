import { Controller } from '@hotwired/stimulus'
import { enter, leave } from 'el-transition'

export default class extends Controller {

  static targets = ['button', 'menuItems', 'menuItem']
  static values  = {index: Number}
  static classes = ['active', 'inactive']

  connect() {
    this.boundCloseOnClickOutsideElement = this.closeOnClickOutsideElement.bind(this)
  }

  closeOnClickOutsideElement(event) {
    if (!this.element.contains(event.target)) this.close()
  }

  indexValueChanged(value) {
    this.menuItemTargets.forEach((el, i) => {
      if (i == value) {
        el.dataset.headlessuiState = 'active'
        if (this.hasActiveClass) el.classList.add(...this.activeClasses)
        if (this.hasInactiveClass) el.classList.remove(...this.inactiveClasses)
      }
      else {
        el.dataset.headlessuiState = ''
        if (this.hasActiveClass) el.classList.remove(...this.activeClasses)
        if (this.hasInactiveClass) el.classList.add(...this.inactiveClasses)
      }
    })

    if (this.menuItemTargets[value] == undefined) console.log(value)
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

  down(event, wrap) {
    if (this.isOpen()) {
      this.indexValue = this.indexOf(this.activeMenuItemSucc(wrap))
    }
    else {
      this.open(event)
      this.first()
    }
  }

  up(event, wrap) {
    if (this.isOpen()) {
      this.indexValue = this.indexOf(this.activeMenuItemPrev(wrap))
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

  clickItem(target) {
    target.click()
    this.close()
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
        this.up(event, false)
        break
      case 'arrowdown':
        this.down(event, false)
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
        this.up(event, false)
        break
      case 'arrowdown':
        this.down(event, false)
        break
      case 'tab':
        event.preventDefault()
        event.shiftKey ? this.up(event, true) : this.down(event, true)
        break
      case 'home':
        this.first()
        break
      case 'end':
        this.last()
        break
      case ' ':
      case 'enter':
        this.clickItem(event.target)
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

  activeMenuItemSucc(wrap) {
    if (wrap) {
      return this.activeMenuItems()[
        (this.activeIndex() + 1) % this.activeMenuItems().length
      ]
    }
    else {
      return this.activeMenuItems()[this.activeIndex() + 1] ||
             this.activeMenuItems()[this.activeIndex()]
    }
  }

  activeMenuItemPrev(wrap) {
    if (wrap) {
      return this.activeMenuItems()[
        (this.activeIndex() - 1 + this.activeMenuItems().length) %
          this.activeMenuItems().length
      ]
    }
    else {
      if (this.activeIndex() == 0) {
        return this.activeMenuItems()[0]
      }
      else {
        return this.activeMenuItems()[this.activeIndex() - 1]
      }
    }
  }

  activeMenuItems() {
    return this.menuItemTargets.filter(el => !el.hasAttribute('disabled'))
  }

  isOpen() {
    return this.element.hasAttribute('open')
  }

}
