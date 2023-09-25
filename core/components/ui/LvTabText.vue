<template>
  <div :class="{'text-xs font-semibold [writing-mode:vertical-lr] whitespace-nowrap rotate-180' : !isExpanded }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  isExpanded: {
    type: Boolean,
    default: true,
  },
});
</script>
