<template>
  <the-layout>

    <div class="h-full flex">

      <the-configuration class="flex-1">
        <div class="flex-1 p-4">
          <div class="mb-8">
            <div>Entity: <b>{{ $route.params.type }}</b></div>
            <div>ID: <b>{{ $route.params.id }}</b></div>
          </div>

          <example-form />
        </div>
      </the-configuration>

      <the-viewport class="flex-1"></the-viewport>

    </div>

  </the-layout>
</template>

<script setup>
import TheLayout from '@/components/layout/TheLayout.vue';
import TheViewport from '@/components/layout/viewport/TheViewport.vue';
import TheConfiguration from '@/components/layout/TheConfiguration.vue';
import ExampleForm from '../components/forms/example-form.vue';
</script>
