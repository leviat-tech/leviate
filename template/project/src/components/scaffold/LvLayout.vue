<template>
  <div class="h-full flex flex-col text-sm">
    <div class="flex flex-grow">

      <slot name="project-explorer" />

      <div class="flex-1">
        <slot />
      </div>

    </div>
  </div>
</template>
