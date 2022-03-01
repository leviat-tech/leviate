<style scoped lang="scss">
    .title {
      font-weight: bold;
    }

</style>

<template>
  <layout>
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
  </layout>
</template>

<script>
import Layout from '@/components/layout/layout.vue';
import Panel from '@/models/sample-model';

export default {
  name: 'Home',
  components: {
    Layout,
  },
  computed: {
    panels: () => Panel.all(),
  },
};
</script>
