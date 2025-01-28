<template>
  <div class="relative transition-all duration-150">
    <CAutoComplete :placeholder="$L('search')"
                   v-model="query"
                   :options="options"
                   @change="onSelect"
                   size="sm"
    >
      <template #suffix>
        <div class="absolute z-30 w-8 h-8 p-1.5 right-0 text-gray-400">
          <CIcon type="search"/>
        </div>
      </template>
    </CAutoComplete>
  </div>
</template>

<script setup>
import { map } from 'lodash-es';
import { computed, inject, ref } from 'vue';
import { useRootStore } from '@crhio/leviate';

const rootStore = useRootStore();

const query = ref('');

const { registeredInputs } = inject('concrete');
const options = computed(() => {
  return map(registeredInputs, (el, id) => {
    return { key: rootStore.getEntryFromId(id), value: id };
  });
});

async function onSelect(val) {
  query.value = '';
  const el = document.getElementById(val);

  if (!el) return;

  setTimeout(() => {
    el.scrollIntoView(true);
    document.querySelector('.configuration__content').scrollTop -= 100;
    focusElement(el);
  }, 0);
}

function focusElement(el) {
  const button = el.querySelector('button');
  const elementToFocus = button || el;

  elementToFocus.focus();
}
</script>
