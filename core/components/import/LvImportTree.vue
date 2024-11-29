<template>
  <div>
    <h1>Hierarchy Tree</h1>
    <h2>Type of data: {{ typeof(layerSortedJSON) }}</h2>
    <div v-for="(layerEntities, index) in layerSortedJSON" :key="index" class="checkbox-item">
      <input type="checkbox" :value="index">
      <label>{{ "Layer: " + index }}</label>
      <div v-for="(entity, index) in layerEntities" class="ml-6">
        <input type="checkbox" :value="index">
        <label>{{ "Entity: " + index }}</label>
      </div>
    </div>
    <pre>{{ layerSortedJSON }}</pre>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  layerSortedJSON: {
    type: Array,
    required: true,
    default: () => []
  }
});

</script>