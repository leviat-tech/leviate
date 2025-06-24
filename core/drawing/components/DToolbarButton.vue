<template>
  <div v-if="!tool.icon" class="w-4 text-red">E</div>

</template>

<script setup>
const props = defineProps({
  tool: Object
});

console.log(props.tool)
</script>
