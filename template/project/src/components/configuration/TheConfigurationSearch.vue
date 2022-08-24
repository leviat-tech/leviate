<template>
  <div :style="{ width }">
    <CAutoComplete placeholder="" v-model="query" :options="options" @change="onSelect" @focus="onFocus">
      <template #suffix>
        <CInputAffix>
          <CIcon type="search"/>
        </CInputAffix>
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
// TODO: expand when input is focussed
const width = computed(() => '200px');

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
    el.focus();
  }, 0);
}

function onFocus() {

}
</script>
