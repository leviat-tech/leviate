<template>
  <LvInputFileDrop @select="selectFile">
    <div>Drag file to upload or</div>
    <LvInputFileSelect @select="selectFile" accept=".dxf,.pdf" class="py-2"/>
    <div>{{ filename }}&nbsp;</div>
  </LvInputFileDrop>
</template>

<script setup>
import LvInputFileDrop from './LvInputFileDrop.vue';
import LvInputFileSelect from './LvInputFileSelect.vue';
import useShapeSelect from '../../composables/useShapeSelect';
import { ref } from 'vue';

const { setShapesFromFile } = useShapeSelect();

const filename = ref('');

async function selectFile(file) {
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
</script>
