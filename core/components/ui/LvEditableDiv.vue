<template>
  <div ref="inputRef"
       :contenteditable="isEditable"
       @blur="onUpdate"
       @keydown.enter.prevent="onUpdate"
       @keydown.esc="onCancel"
  >
    {{ modelValue }}
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';

const props = defineProps({
  isEditable: Boolean,
  modelValue: [String, Number],
  autofocus: Boolean,
});

let canUpdate = true;
const inputRef = ref(null);
const emit = defineEmits(['update:modelValue']);

function onUpdate() {
  if (!canUpdate) return;

  const value = inputRef.value.innerHTML;
  emit('update:modelValue', value);
}

function onCancel() {
  // Prevent onUpdate emitting event after blur
  canUpdate = false;

  inputRef.value.innerHTML = props.modelValue;
  inputRef.value.blur();

  canUpdate = true;
}

function focusInput() {
  const el = inputRef.value;
  el.focus();

  const range = document.createRange();
  range.selectNodeContents(el);

  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

watch(() => props.isEditable, async (isEditable) => {
  if (isEditable && props.autofocus) {
    await nextTick();
    focusInput()
  }
});
</script>
