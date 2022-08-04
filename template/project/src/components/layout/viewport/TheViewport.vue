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
        :options="[{ label: 'Top', value: 'top' }, { label: 'Bottom', value: 'bottom' }]"
      >
        TOP VIEWPORT
      </c-viewport>

      <c-viewport
        v-model="bottomViewport"
        viewport-id="bottom"
        :options="[{ label: 'Bottom', value: 'bottom' }]"
      >
        BOTTOM VIEWPORT
      </c-viewport>

    </c-viewport-container>
  </div>
</template>


<script setup>
import { ref } from 'vue';

import TheViewportToolbar from './TheViewportToolbar.vue';

const maximizedViewport = ref(null);
const topViewport = ref('top');
const bottomViewport = ref('bottom');
</script>
