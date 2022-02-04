<style scoped lang="scss">
    .title {
      font-weight: bold;
    }

</style>

<template>
  <k-layout>
    <div class="m-auto">
      <p v-if="panels.length > 0">
        Select a
        <span class="font-bold">Panel</span>
          from <span class="font-bold">Project Explorer</span>
          to continue.</p>
      <p v-else>Create a
        <span class="font-bold">Panel</span>
          from <span class="font-bold">Project Explorer</span>
          to Start.</p>
    </div>
  </k-layout>
</template>

<script>
import KLayout from '@/components/layout/k-layout.vue';
import Panel from '@/models/sample-model';

export default {
  name: 'home-page',
  components: {
    KLayout,
  },
  computed: {
    panels: () => Panel.all(),
  },
};
</script>
