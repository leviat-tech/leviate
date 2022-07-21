<style scoped lang="scss">

  .document-settings {
    max-height: 90vh;
  }

</style>


<template>
  <c-modal v-if="showModal" title="Export" @close="close" size="lg">
    <div class="space-y-4 -mr-2 pl-2 pr-4 document-settings overflow-y-auto">
      <div class="flex justify-between space-x-8">
        <div class="py-1">Document</div>
        <div class="w-64">
<!--          <c-select v-model="docType">-->
<!--            <option v-for="key, index in Object.keys(types)" v-bind:key="index" :value="key">-->
<!--              {{`${types[key].file_type} - ${types[key].name}` }}-->
<!--            </option>-->
<!--          </c-select>-->
        </div>
      </div>
      <div class="space-y-4 pb-2">
        <div class="py-2 font-medium">Document Settings</div>
        <component :is="documentComponent" @closed="close"></component>
        </div>
    </div>
  </c-modal>
</template>


<script>
// import { mapState } from 'pinia';
import overviewDocument from '@/components/documents/overview-document.vue';
// import { useDocumentStore } from '@/store/documents';

export default {
  name: 'tool-export',
  components: {
    overviewDocument,
  },
  data: () => ({
    docType: 'overview',
    showModal: false,
  }),
  methods: {
    open() {
      this.showModal = true;
    },
    close() {
      this.showModal = false;
    },
  },
  computed: {
    // ...mapState(useDocumentStore, ['types']),
    documentComponent() {
      return {
        overview: overviewDocument,
      }[this.docType];
    },
  },
};

</script>
