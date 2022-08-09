<template>
  <div class="flex-1 p-4">

    <div class="mb-8 text-lg">
      <div>Entity: <b>{{ $route.params.entity }}</b></div>
      <div>ID: <b>{{ $route.params.id }}</b></div>
    </div>

    <ExampleForm />

  </div>
</template>

<script setup>
import ExampleForm from '@/components/forms/example-form.vue';
</script>
