<template>
  <c-text-input id="name" label="Name" v-model="entity.name"></c-text-input>
  <c-numeric-input id="width" label="Width" v-model="entity.width"></c-numeric-input>
  <c-numeric-input id="height" label="Height" v-model="entity.height"></c-numeric-input>

  {{ entity }}
</template>


<script setup>
import { computed } from 'vue';
import ExampleModel from '@/models/ExampleModel';
import { useRoute } from 'vue-router';

const route = useRoute();

const entity = computed(() => {
  console.log('Calc');
  const { id } = route.params;
  return ExampleModel.read().length === 0 ? {} : ExampleModel.find(id).data;
});

window.m = ExampleModel;


</script>
