<style scoped lang="scss">

.viewport-container {
  border-right: 1px solid $color-gray-04;
}
</style>


<template>
  <div class="viewport-container v-box">
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


<script>
import ViewportToolbar from '@/components/layout/toolbar/viewport-toolbar.vue';


export default {
  name: 'viewport-container',
  components: {
    ViewportToolbar,
  },
  data() {
    return {
      cloned: null,
      maximizedViewport: null,
      leftViewport: 'left',
      rightViewport: 'right',
    };
  },
};
</script>
