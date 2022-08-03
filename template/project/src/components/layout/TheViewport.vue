<template>
  <div class="viewport-container v-box border-r">
    <viewport-toolbar />
    <c-viewport-container
      v-model="maximizedViewport"
      :options="[ 'left', 'right' ]"
      :aspect-ratio="3"
    >MAXIMIZED VIEWPORT
      <c-viewport
        v-model="leftViewport"
        viewport-id="left"
        :options="[{ label: 'Left', value: 'left' }]"
      >LEFT VIEWPORT
      </c-viewport>
      <c-viewport
        v-model="rightViewport"
        viewport-id="right"
        :options="[{ label: 'Right', value: 'right' }]"
      >RIGHT VIEWPORT
      </c-viewport>
    </c-viewport-container>
  </div>
</template>


<script setup>
import { ref } from 'vue';

// import ViewportToolbar from '@/components/layout/toolbar/viewport-toolbar.vue';

const maximizedViewport = ref(null);
const leftViewport = ref('left');
const rightViewport = ref('right');
</script>
