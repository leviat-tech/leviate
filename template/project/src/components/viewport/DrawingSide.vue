<template>
  <div>
    <div class="border-black border-2 bg-red-300" :style="style"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  entity: Object
});

const style = computed(() => {
  const { width, height } = props.entity;

  return {
    width: `${width  }px`,
    height: `${height  }px`
  }
})
</script>
