import { Controller } from '@hotwired/stimulus'
import { enter, leave } from 'el-transition'

/*

Headless UI: Menu

https://headlessui.com/react/menu

Expects the following markup (omitting the classes and ARIA attributes).
The `data-transition-*` attributes are optional.

   <div data-controller="menu">
     <button
       type="button"
       data-menu-target="button"
       data-action="click->menu#toggle keydown->menu#keydownButton"
     >
       ...
     </button>
     <div
       role="menu"
       tabindex="-1"
       data-menu-target="menuItems"
       data-action="keydown->menu#keydownItems"
       data-transition-enter="transition ease-out duration-100"
       data-transition-enter-start="transform opacity-0 scale-95"
       data-transition-enter-end="transform opacity-100 scale-100"
       data-transition-leave="transition ease-in duration-75"
       data-transition-leave-start="transform opacity-100 scale-100"
       data-transition-leave-end="transform opacity-0 scale-95"
     >
       <a
         href="..."
         role="menuitem"
         tabindex="-1"
         data-menu-target="menuItem"
         data-action="keydown.space->menu#clickItem"
       >
         ...
       </a>
     </div>
   </div>

*/
export default class extends Controller {

  static targets = ['button', 'menuItems', 'menuItem']
  static values  = {index: Number}

  connect() {
    this.boundCloseOnClickOutsideElement = this.closeOnClickOutsideElement.bind(this)
    this.boundCloseOnEscape = this.closeOnEscape.bind(this)
  }

  closeOnClickOutsideElement(event) {
    if (!this.element.contains(event.target)) this.close()
  }

  closeOnEscape(event) {
    if (event.key === 'Escape') this.close()
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

    window.addEventListener('keydown', this.boundCloseOnEscape)
    window.addEventListener('click', this.boundCloseOnClickOutsideElement)
    // Stop this (click) event from triggering the listener we just
    // added to the window.
    if (event.type === 'click') event.stopPropagation()
  }

  close() {
    window.removeEventListener('click', this.boundCloseOnClickOutsideElement)
    window.removeEventListener('keydown', this.boundCloseOnEscape)

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

  // key - lower case letter
  clickMatchingItem(key) {
    this.menuItemTargets.find(el => el.text[0].toLowerCase() === key)?.click()
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
      case /[a-z]/.test(key) && key:
        this.clickMatchingItem(key)
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
