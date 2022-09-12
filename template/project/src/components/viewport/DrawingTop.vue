<template>
  <div>
    <div class="border-black" :class="[colorClass, borderClass]" :style="style"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  entity: Object
});

const style = computed(() => {
  const { width, depth } = props.entity;

  return {
    width: `${width }px`,
    height: `${depth }px`
  }
})

const colorClasses = {
  red: 'bg-red-300',
  orange: 'bg-orange-300',
  yellow: 'bg-yellow-300',
  green: 'bg-green-300',
  blue: 'bg-blue-300',
  purple: 'bg-purple-300',
};

const colorClass = computed(() => {
  return colorClasses[props.entity.color.top];
});

const borderClass = computed(() => {
  return props.entity.hasBorder && 'border-2';
})
</script>
