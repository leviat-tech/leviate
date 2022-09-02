# Vue Style Guide

# Team specific guidelines

::: tip 💡 TL;DR
- Composition API with `<script setup>`
- Use Tailwind, try to avoid using `<style>`
- No first block indentation except for `<template>`
- Always use PascalCase for components
- Separate static and dynamic classes
:::

### Prefer using the Composition API with `<script setup>`

Only use Options API if there is a specific reason for doing so

### Use Tailwind classes instead of CSS for styling

Try to avoid using `<style>` tags in Vue SFCs, using tailwind classes for styling instead. Only use if absolutely necessary

### Component layout and format

Vue SFCs should be laid out and formatted as follows:

```jsx
<template>
  <!-- content starts here -->
</template>

<style scoped>
// No indentation
// Try and avoid using style tags if possible
// But place after template if necessary
</style>

<script setup>
// No indentation 
</script>
```

### Always use Pascal Case

For consistency and readability always use PascalCase for components (filenames, js and templates).

Using Pascal Case the mixture of upper and lower case letters makes components in templates more readable and easier to differentiate from standard HTML elements. Using the same case everywhere also avoids any uncertainty about what case to use where.

**ChildComponent.vue**

```jsx
<template>
  <div>Hello World</div>
</template>
```

**ParentComponent.vue**

```jsx
<template>
  <div>
    <ChildComponent />
  </div>
</template>

<script setup>
import ChildComponent from './ChildComponent.vue';
</script>
```

### Declare static and dynamic classes separately

To separate concerns, improve readability and avoid really long lines e.g.

```jsx
<div class="flex bg-red-500" :class="someComputedClassName"></div>
<div class="flex bg-blue-500" :class="[class1, class2]"></div>
<div class="flex bg-gray-500" :class="{ 'bg-green-500': isActive }"></div>
<div class="flex lots of classes eg items-center justify-center bg-yellow-500 etc"
     :class="[activeClass, dynamicClass, sizeClass]"></div>
```

# General Guidelines

We also recommend following the rules found in the official Vue style guide:

[https://v2.vuejs.org/v2/style-guide/](https://v2.vuejs.org/v2/style-guide/)

A summary of the main rules we’d like to follow:

- Ensure multi-word component names
- Self close components in templates
- Use the prefix ‘The’ for all singleton components (not including page/view root components) e.g. `<TheSidebar />`
- If `<style>` is used then it should be scoped