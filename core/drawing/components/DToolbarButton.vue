<template>
  <div v-if="!icon" class="w-4">&nbsp;</div>
  <component :is="icon" v-else class="w-fit h-fit" />
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const props = defineProps({
  svgname: {
    type: String,
    required: true,
  },
});

const icon = defineAsyncComponent(() => import(`../assets/${props.svgname}.svg`));
</script>
