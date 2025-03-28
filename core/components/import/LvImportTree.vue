<template>
  <div class="px-4">
    <div v-for="(shape, i) in shapes" :key="i" class="checkbox-item">
      <CCheckbox
        size="xs"
        v-model="shapes[i].isSelected"
        :label="shape.name || `${$L('import_shape')} ${i + 1}`"
        :label-formatter="(val) => val.label"
      />
    </div>
  </div>
</template>

<script setup>
  import useShapeSelect from '../../composables/useShapeSelect';

  const { shapes } = useShapeSelect();
</script>
