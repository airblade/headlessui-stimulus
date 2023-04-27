# Headless UI - Stimulus

Status: just started and a long way to go :)

This is a set of [Stimulus](https://stimulus.hotwired.dev) controllers for [Headless UI's components](https://headlessui.com).

- [x] [Menu (Dropdown)](#menu-dropdown)
- [ ] Listbox (Select)
- [ ] Combobox (Autocomplete)
- [ ] Switch (Toggle)
- [ ] Disclosure
- [ ] Dialog (Modal)
- [ ] Popover
- [ ] Radio Group
- [ ] Tabs
- [x] [Transitions](#transitions)


## Installation

```
bin/importmap pin headlessui-stimulus
```


## Usage

Register the components with your Stimulus application:

```diff
  import { Application } from '@hotwired/stimulus'
+ import { Menu } from 'headlessui-stimulus'

  const application = Application.start()
+ application.register('menu', Menu)
```

## Menu (Dropdown)

See [Headless UI: Menu](https://headlessui.com/react/menu).

Use the following markup (the classes and ARIA attributes are omitted for clarity).

```html
<div data-controller="menu">
    <button
        type="button"
        data-menu-target="button"
        data-action="click->menu#toggle keydown->menu#keydownButton"
    >
        ...
    </button>
    <div
        class="hidden"
        role="menu"
        tabindex="-1"
        data-menu-target="menuItems"
        data-action="keydown->menu#keydownItems"
    >
        <a
            href="..."
            role="menuitem"
            tabindex="-1"
            data-menu-target="menuItem"
            data-action="mouseover->menu#activate"
        >
            ...
        </a>
        <!-- more menu item links -->
    </div>
</div>
```

The component exposes information about its current state via `data-headlessui-state` attributes which you can use to conditionally apply different styles.

If you use Tailwind CSS and its [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss) plugin, you can use modifiers like `ui-open:*` and `ui-active:*`.

Alternatively you can specify classes for the active and inactive menu items like this:

```html
<div
    data-controller="menu"
    data-menu-active-class="..."
    data-menu-inactive-class="..."
>
```


## Transitions

Transitions are supported by each component.  Specify the transitions you want with these data attributes:

```html
data-transition-enter="..."
data-transition-enter-start="..."
data-transition-enter-end="..."
data-transition-leave="..."
data-transition-leave-start="..."
data-transition-leave-end="..."
```

If you are using Tailwind UI components, you can pretty much copy and paste the the transitions specified in the code comments.

For example, a sidebar component might include this comment in its source code:

```html
<!--
      Off-canvas menu backdrop, show/hide based on off-canvas menu state.

      Entering: "transition-opacity ease-linear duration-300"
        From: "opacity-0"
        To: "opacity-100"
      Leaving: "transition-opacity ease-linear duration-300"
        From: "opacity-100"
        To: "opacity-0"
-->
```

Here are the corresponding data attributes you would use:

```html
data-transition-enter="transition-opacity ease-linear duration-300"
data-transition-enter-start="opacity-0"
data-transition-enter-end="opacity-100"
data-transition-leave="transition-opacity ease-linear duration-300"
data-transition-leave-start="opacity-100"
data-transition-leave-end="opacity-0"
```


## Intellectual Property

This package is copyright Andrew Stewart.

This package is available as open source under the terms of the MIT licence.
