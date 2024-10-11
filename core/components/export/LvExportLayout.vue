<template>
  <div class="h-full flex">
    <CResizable class="flex w-full">
      <CPane class="border-r-2 border-steel h-full" primary :min="'300px'">
        <div class="px-4 border-r h-full overflow-scroll">
          <slot name="right" />
        </div>
      </CPane>
      <CPane class="h-full flex-row" :min="'515px'">
        <div class="my-6 px-4">
          <slot name="left" />
        </div>
      </CPane>
    </CResizable>
  </div>
</template>
