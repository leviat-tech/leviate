<template>
  <trifold>
    Entity: {{ $route.params.id }}
  </trifold>
</template>

<script>
import Trifold from '@/components/layout/trifold/trifold.vue';

export default {
  name: 'Entity',
  components: {
    Trifold,
  },
};
</script>
