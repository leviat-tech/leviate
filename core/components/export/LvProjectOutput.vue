<template>
  <div class="p-4">
    <CFormSection :title="title || $L('generate')">
      <div class="flex gap-4">
        <CIcon type="information-circle" size="md" />
        <span>{{ content || $l('generate_instructions')}}</span>
      </div>
    </CFormSection>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    title: String,
    content: String,
  });
</script>
