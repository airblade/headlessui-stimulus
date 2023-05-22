# Headless UI - Stimulus

Please see the [demo page](https://airblade.github.io/headlessui-stimulus) for some examples.

Status: implementing the components as I need them.  Just started and a long way to go :)

This is a set of [Stimulus](https://stimulus.hotwired.dev) controllers for [Headless UI's components](https://headlessui.com).

- [x] [Menu (Dropdown)](#menu-dropdown)
- [ ] Listbox (Select)
- [ ] Combobox (Autocomplete)
- [ ] Switch (Toggle)
- [ ] Disclosure
- [x] [Dialog (Modal)](#dialog-modal)
- [x] [Popover](#popover)
- [ ] Radio Group
- [ ] Tabs
- [x] [Transitions](#transitions)

They all come with keyboard navigation and focus management, and automatically manage relevant ARIA attributes.


## Installation

```
bin/importmap pin headlessui-stimulus
```


## Usage

Register the components with your Stimulus application.  For example, to register the Menu (Dropdown) component:

```diff
  import { Application } from '@hotwired/stimulus'
+ import { Menu } from 'headlessui-stimulus'

  const application = Application.start()
+ application.register('menu', Menu)
```

Note: you must have a `hidden` CSS class for elements to show and hide:

```css
.hidden {
  display: none;
}
```

If you use Tailwind CSS's [@headlessui/tailwindcss](https://github.com/tailwindlabs/headlessui/tree/main/packages/%40headlessui-tailwindcss) plugin, you can use modifiers like `ui-open:*` and `ui-active:*` to style these components.

If you don't use the plugin, you can use the `data-headlessui-state` attributes directly to conditionally apply different styles.


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

Optionally you can specify classes for the active and inactive menu items like this:

```html
<div
    data-controller="menu"
    data-menu-active-class="..."
    data-menu-inactive-class="..."
>
```


## Dialog (Modal)

See [Headless UI: Dialog](https://headlessui.com/react/dialog).

Use the following markup (the classes and ARIA attributes are omitted for clarity).

```html
<div data-controller="dialog">
    <!-- optional backdrop -->
    <div data-dialog-target="backdrop"></div>

    <div data-dialog-target="panel" data-action="keydown->dialog#keydown">
        <h1 data-dialog-target="title">An important notice</h1>
        <p data-dialog-target="description">Blah blah blah.</p>
        ...
        <button data-action="dialog#close">...</button>
        ...
    </div>
</div>
```

To open the dialog:

- either call `dialog#open` on the controller;
- or set `data-dialog-open-value="true"` on the controller's element.

To close the dialog:

- either call `dialog#close` on the controller;
- or set `data-dialog-open-value="false"` on the controller's element;
- or click outside the panel;
- or press <kbd>Escape</kbd>.

If your dialog has a title and a description, use `data-dialog-target="title"` and `data-dialog-target="description"` to provide the most accessible experience.  This will link your title and description to the controller element via the `aria-labelledby` and `aria-describedby` attributes.

When the dialog opens, the panel's first focusable element by DOM order receives focus.  To specify that a different element should receive focus initially, give it the data attribute `data-dialog-target="initialFocus"`.

You can configure your dialog with the following attributes.  Declare them on the controller as `data-dialog-[name]-value`.

| Name | Default | Description |
|--|--|--|
| open | `false` | Whether the dialog is open (`true`) or closed (`false`). |
| unmount | `false` | On closing the dialog, whether to remove it from the DOM (`true`) or hide it (`false`). |

You can specify transitions on the backdrop and the panel.


## Popover

See [Headless UI: Popover](https://headlessui.com/react/popover).

Use the following markup (the classes and ARIA attributes are omitted for clarity).

```html
<div data-controller="popover" data-action="keydown.esc->popover#close">
    <button
        type="button"
        data-popover-target="button"
        data-action="popover#toggle"
    >
        ...
    </button>

    <!-- optional -->
    <div data-popover-target="overlay" data-action="click->popover#close"></div>

    <div data-popover-target="panel" data-action="keydown->popover#keydownPanel">
        ...
    </div>
</div>
```

To open the popover:

- either call `popover#open` on the controller;
- or set `data-popover-open-value="true"` on the controller's element.

To close the popover:

- either call `popover#close` on the controller;
- or set `data-popover-open-value="false"` on the controller's element.
- or <kbd>Tab</kbd> out of the panel;
- or click outside the panel;
- or press <kbd>Escape</kbd>.

When the popover opens, the panel does not receive focus until you <kbd>Tab</kbd> into it.  If you would prefer the first focusable element in the panel to receive focus when the panel opens, set the `data-popover-focus-panel="true"` data attribute on the controller's element.

When the popover closes (unless you <kbd>Tab</kbd> out), focus returns to the button target.  If you want another element to receive focus, set the `data-popover-focus-on-close-value="..."`.  The value should be a CSS selector.

You can configure your popover with the following attributes.  Declare them on the controller as `data-popover-[name]-value`.

| Name | Default | Description |
|--|--|--|
| open | `false` | Whether the popover is open (`true`) or closed (`false`). |
| focus-panel | `false` | On opening the popover, whether to focus the panel's first focusable element. |
| focus-on-close | "" | On closing the popover (except by using <kbd>Tab</kbd>), the element to focus, expressed as a CSS selector.  `""` focuses the button target. |
| unmount | `false` | On closing the popover, whether to remove it from the DOM (`true`) or hide it (`false`). |

You can specify transitions on the overlay and the panel.

Popover groups are not supported yet (because [I'm not sure how they are supposed to behave](https://github.com/tailwindlabs/headlessui/discussions/2503).)


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
