<style scoped lang="scss">
  @import '@/assets/styles/variables.scss';
  @import '@/assets/styles/buttons.scss';
  @import '@/assets/styles/inputs.scss';

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
          <c-select v-model="docType">
            <option v-for="key, index in Object.keys(documentList)" v-bind:key="index" :value="key">
              {{`${documentList[key].file_type} - ${documentList[key].name}` }}
            </option>
          </c-select>
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
import { get } from 'vuex-pathify';
import overviewDocument from '@/components/documents/overview-document.vue';

export default {
  name: 'k-tool-export',
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
    documentList: get('documents/types'),
    documentComponent() {
      return {
        overview: overviewDocument,
      }[this.docType];
    },
  },
};

</script>
