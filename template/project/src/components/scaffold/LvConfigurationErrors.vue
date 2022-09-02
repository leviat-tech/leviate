<template>
  <CStatusBar :messages="errors" @click="onClick" @dismiss="onDismiss"/>
</template>

<script setup>
import { computed } from 'vue';
import { useMessageStore } from '@crhio/leviate';

const messageStore = useMessageStore();
const errors = computed(() => [...messageStore.configErrors, ...messageStore.calculationErrors]);

 function onClick(id) {
  const el = document.getElementById(id);

  if (!el) return;

  el.scrollIntoView(true);
  el.focus();
}

function onDismiss(index) {
  const error = errors.value[index];
  messageStore.removeMessage(error.id);
}
</script>
