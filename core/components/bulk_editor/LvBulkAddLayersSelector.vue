<template>
  <div>
    <div class="text-sm font-semibold px-1 pl-2 select-none">
      {{ $L('layer_selection') }}
    </div>
    <div v-for="layer in layersLists" class="flex items-center pt-2">
      <CCheckbox v-model="layer.isSelected" no-wrap />
      <div class="text-xs font-semibold px-1 pl-2 select-none">
        {{ layer.name }}
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  layersLists: Object,
});
</script>
