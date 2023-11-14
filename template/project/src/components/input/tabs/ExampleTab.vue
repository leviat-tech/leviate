<template>
  <LvInputTabPanel class="p-4" tab-id="example">
    <div class="mb-8 text-lg">
      <div>Entity: <b>{{ $route.params.entity }}</b></div>
      <div>ID: <b>{{ $route.params.id }}</b></div>
    </div>
    <ExampleForm />
  </LvInputTabPanel>
</template>

<script setup>
import ExampleForm from '@/components/input/forms/ExampleForm.vue';
import { LvInputTabPanel } from '@crhio/leviate/components';
</script>
