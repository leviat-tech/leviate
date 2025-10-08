<template>
  <LvInputFileDrop
    :label="$l('import_drag_file')"
    accept=".dxf,.pdf"
    @error="onError"
    @select="selectFile">
    <LvInputFileSelect
      @select="selectFile"
      accept=".dxf,.pdf"
      class="py-2"
      id="input-dxf-pdf-importer"
      :label="$L('import_select_file')"
    />
    <div :class="error && 'text-danger'">{{ error || filename }}&nbsp;</div>
  </LvInputFileDrop>
</template>

<script setup>
import LvInputFileDrop from './LvInputFileDrop.vue';
import LvInputFileSelect from './LvInputFileSelect.vue';
import useShapeSelect from '../../composables/useShapeSelect';
import { ref } from 'vue';
import { useLocalize } from '../../plugins/localize';

const { setShapesFromFile, clearShapes } = useShapeSelect();

const filename = ref('');
const error = ref('');
const { $l } = useLocalize();

async function selectFile(file) {
  if (!file) return;

  error.value = '';

  const { name } = file;
  const type = name.split('.').pop();
  filename.value = name;
  const content = await getFileContent(file);

  return setShapesFromFile({ name, type, content });
}

function getFileContent(file) {
  return new Promise((resolve) => {

    const reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function(e) {
      resolve(e.target.result);
    };
  });
}

function onError(msg) {
  clearShapes();
  error.value = $l(msg);

}
</script>
