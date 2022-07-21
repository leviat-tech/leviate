<template>
  <div class="project flex flex-col justify-between h-full pb-2 bg-gray-100 w-64">

    <slot name="toolbar" />

    <div class="flex flex-col justify-between flex-1">
      <div>

        <div class="h-box flex-limit items-center p-4 font-bold">
          Project Explorer
        </div>

        <slot />
      </div>

      <div>
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
