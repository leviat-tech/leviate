<template>
  <c-text-input id="name" label="Name" v-model="entity.name"></c-text-input>
  <c-numeric-input id="width" label="Width" v-model="entity.width"></c-numeric-input>
  <c-numeric-input id="height" label="Height" v-model="entity.height"></c-numeric-input>
  <c-numeric-input id="depth" label="Depth" v-model="entity.depth"></c-numeric-input>
</template>


<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ExampleModel from '@/models/ExampleModel';

const route = useRoute();

const entity = computed(() => {
  const { id } = route.params;
  return ExampleModel.read().length === 0 ? {} : ExampleModel.find(id);
});
</script>
