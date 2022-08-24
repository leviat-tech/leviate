<template>
  <CModal v-if="showModal" title="Export" @close="close" size="lg">
    <div class="space-y-4 -mr-2 pl-2 pr-4 document-settings overflow-y-auto">
      <div class="flex justify-between space-x-8">
        <div class="py-1">Document</div>
        <div class="w-64">
<!--          <CSelect v-model="docType">-->
<!--            <option v-for="key, index in Object.keys(types)" v-bind:key="index" :value="key">-->
<!--              {{`${types[key].file_type} - ${types[key].name}` }}-->
<!--            </option>-->
<!--          </CSelect>-->
        </div>
      </div>
      <div class="space-y-4 pb-2">
        <div class="py-2 font-medium">Document Settings</div>
        </div>
    </div>
  </CModal>
</template>

<style scoped lang="scss">
.document-settings {
  max-height: 90vh;
}
</style>

<script>

export default {
  name: 'tool-export',
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
    documentComponent() {
      return {
        overview: overviewDocument,
      }[this.docType];
    },
  },
};

</script>
