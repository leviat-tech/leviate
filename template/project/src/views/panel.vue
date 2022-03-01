<template>
  <trifold>
    <sample-form v-show="selectedElement==null" :instance="current" :key="current.id" :errors="currentErrors"/>
    <component
      v-if="selectedElement"
      :is="elementForm"
      :errors="currentErrors"
    />
  </trifold>
</template>

<script>
import { get, sync } from 'vuex-pathify';
import Trifold from '@/components/layout/trifold/trifold.vue';
import SampleForm from '@/components/forms/sample-form.vue';

export default {
  name: 'Panel',
  computed: {
    current: get('current'),
    currentErrors: get('errors/currentErrors'),
    selectedElement: sync('display/selectedElement'),
  },
  components: {
    SampleForm,
    Trifold,
  },
};
</script>
