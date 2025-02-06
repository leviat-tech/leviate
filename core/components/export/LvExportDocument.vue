<template>
  <div>
    <CButton :disabled="isDisabled" @click="generate">
      <span v-if="!isGenerating" class="w-14">{{ $L('generate') }}</span>
      <div v-else class="w-14 flex justify-center">
        <CIcon type="sync" size="sm" class="animate-spin"></CIcon>
      </div>
    </CButton>

    <template v-if="!isGenerating">
      <div v-if="isGenerated === false" class="flex items-center mt-4 text-danger font-bold">
        <CIcon type="warning" size="md" class="mr-2"></CIcon>{{ $L('generate_failed') }}
      </div>
      <div v-if="isGenerated === true" class="flex items-center mt-4">
        <CIcon type="check" size="md" class="text-success mr-2"></CIcon>
        <span class="text-success font-bold">{{ $l('generate_success') }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  defineProps<{
    generate: Function;
    isDisabled: Boolean;
    isGenerated: Boolean | null;
    isGenerating: Boolean;
  }>();
</script>
