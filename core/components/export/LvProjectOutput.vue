<template>
  <div class="p-4">
    <CFormSection :title="$L('generate')">
      <div class="flex gap-4">
        <CIcon type="information-circle" size="md" />
        <span>{{ $l('generate_instructions') }}</span>
      </div>
    </CFormSection>
  </div>
</template>
