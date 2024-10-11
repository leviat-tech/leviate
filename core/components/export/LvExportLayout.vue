<template>
  <div class="h-full flex">
        <div class="basis-1/4 min-w-[300px] px-4 border-r h-full overflow-scroll">
          <slot name="right" />
        </div>
        <div class="my-6 px-4 w-full">
          <slot name="left" />
        </div>
  </div>
</template>
