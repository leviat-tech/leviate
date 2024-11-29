<template>
  <LvLayout>
    <div class="flex">
    <!--{{ $l('import') }}-->
      <LvInputPanel>
        <!--Custom event listens for emit when JSON has been sorted by layer and triggers function to capture it-->
       <LvFileSelector @layersSorted="receiveJSON"/>
       <!--Renders tree if data has been accepted-->
       <LvImportTree v-if="layerSortedJSON" :layerSortedJSON="layerSortedJSON"/>
      </LvInputPanel>

      <LvViewportPanel>
      </LvViewportPanel>

      <LvInputPanel/>
    </div>
  </LvLayout>
</template>

<script setup>
import LvLayout from '@crhio/leviate/components/layout/LvLayout.vue';
import LvFileSelector from '@crhio/leviate/components/import/LvFileSelector.vue';
import LvImportTree from '@crhio/leviate/components/import/LvImportTree.vue';
import LvInputPanel from '@crhio/leviate/components/layout/LvInputPanel.vue';
import LvViewportPanel from '@crhio/leviate/components/layout/LvViewportPanel.vue';
import InputRoot from '@/components/input/InputRoot.vue';
import ViewportRoot from '@/components/viewport/ViewportRoot.vue';
import { ref } from "vue";

const layerSortedJSON = ref(null);

const receiveJSON = (JSON) => {
  layerSortedJSON.value = JSON;
}

</script>
