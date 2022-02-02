<template>
  <k-trifold>
    <sample-form v-show="selectedElement==null" :instance="current" :key="current.id" :errors="currentErrors"/>
    <component
      v-if="selectedElement"
      :is="elementForm"
      :errors="currentErrors"
    />
  </k-trifold>
</template>

<script>
import { get, sync } from 'vuex-pathify';
import KTrifold from '@/components/layout/trifold/k-trifold.vue';
import SampleForm from '@/components/forms/sample-form.vue';

export default {
  name: 'KPanel',
  computed: {
    current: get('current'),
    currentErrors: get('errors/currentErrors'),
    selectedElement: sync('display/selectedElement')
  },
  components: {
    SampleForm,
    KTrifold
  },
};
</script>
