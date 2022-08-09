<template>
  <CText-input id="name" label="Name" v-model="entity.name"></CText-input>
  <CNumeric-input id="width" label="Width" v-model="entity.width"></CNumeric-input>
  <CNumeric-input id="height" label="Height" v-model="entity.height"></CNumeric-input>
  <CNumeric-input id="depth" label="Depth" v-model="entity.depth"></CNumeric-input>
</template>


<script setup>
import useCurrentEntity from '@/composables/useCurrentEntity';

const entity = useCurrentEntity();
</script>
