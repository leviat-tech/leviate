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
import { useLocalize } from '@crhio/leviate/plugins/host';
import { map, get, last, range } from 'lodash-es';
import BaseModel from '@crhio/leviate/BaseModel';
import { computed, inject, ref } from 'vue';
import { useRootStore } from '@crhio/leviate/store';

const rootStore = useRootStore();
const { $L } = useLocalize();

const query = ref('');
// TODO: expand when input is focussed
const width = computed(() => '200px');

const { registeredInputs } = inject('concrete');
const options = computed(() => {
  return map(registeredInputs, (el, id) => {
    return { key: getEntryFromId(id), value: id };
  });
});

function getEntryFromId(id) {
  const [entityName, entityId, path] = id.split('_');
  const instance = rootStore.getEntity(entityName, entityId);

  const allSubpaths = range(path.length)
    .filter((i) => path[i] === '.')
    .map((i) => path.slice(0, i));


  const entitySubpaths = allSubpaths.filter((subpath) => get(instance, subpath) instanceof BaseModel);
  const entityPath = entitySubpaths.map((subpath) => get(instance, subpath));
  const displayPath = entityPath.map((entity) => entity.name).join(' > ');

  const entity = last(entityPath) || instance;
  const termPath = entitySubpaths ? path.replace(last(entitySubpaths), '') : path;

  let term;
  if (get(instance, path) instanceof BaseModel) {
    term = get(instance, path).name;
  } else {
    term = entity.coercedSchema.getSearchTerm(termPath);
    term = $L(term, { capitalize: true });
  }
  return displayPath ? `${term} (${displayPath})` : term;
}

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
