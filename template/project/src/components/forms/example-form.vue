<template>
  <c-text-input id="name" label="Name" v-model="entity.name"></c-text-input>
  <c-numeric-input id="width" label="Width"></c-numeric-input>
  <c-numeric-input id="height" label="Height"></c-numeric-input>

  {{ entity.name }}
</template>


<script setup>
import { computed } from 'vue';
import ExampleModel from '@/models/ExampleModel';
import { useRoute } from 'vue-router';

const route = useRoute();

const entity = computed(() => {
  const { id } = route.params;
  return ExampleModel.read().length === 0 ? {} : ExampleModel.find(id).data;
});

console.log(ExampleModel);


</script>
