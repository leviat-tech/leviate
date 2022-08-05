<template>
  <div class="viewport flex flex-col">
    <the-viewport-toolbar />

    <c-viewport-container
      v-model="maximizedViewport"
      :options="['top', 'bottom']"
      :aspect-ratio="2"
    >
      <c-viewport
        v-model="topViewport"
        viewport-id="top"
        :options="[{ label: 'Top View', value: 'top' }]"
      >
        <drawing-top :entity="entity"></drawing-top>
      </c-viewport>

      <c-viewport
        v-model="bottomViewport"
        viewport-id="bottom"
        :options="[{ label: 'Side View', value: 'bottom' }]"
      >
        <drawing-side :entity="entity"></drawing-side>
      </c-viewport>

    </c-viewport-container>
  </div>
</template>


<script setup>
import { computed, ref } from 'vue';
import TheViewportToolbar from './TheViewportToolbar.vue';
import DrawingTop from './DrawingTop.vue';
import DrawingSide from './DrawingSide.vue';
import ExampleModel from '@/models/ExampleModel';
import { useRoute } from 'vue-router';

const route = useRoute();
const entity = computed(() => ExampleModel.find(route.params.id));

const maximizedViewport = ref(null);
const topViewport = ref('top');
const bottomViewport = ref('bottom');
</script>
