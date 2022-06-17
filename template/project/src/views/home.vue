<style scoped lang="scss">
    .title {
      font-weight: bold;
    }

</style>

<template>
  <layout>
    <div class="m-auto">
        Select or create an entity in the Project Explorer to continue
    </div>
  </layout>
</template>

<script>
import Layout from '@/components/layout/layout.vue';

export default {
  name: 'Home',
  components: {
    Layout,
  },
};
</script>
