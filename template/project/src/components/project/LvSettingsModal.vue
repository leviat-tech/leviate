<template>
  <CModal :show="showModal" title="Settings" @close="showModal = false" size="lg">
    <div class="space-y-4">

      <div class="flex justify-between space-x-8">
          <CTextInput v-model="localConfigName" label="Config Name"/>
      </div>

      <div class="flex justify-between space-x-8">
        <div class="py-1">Language</div>
        <div class="w-64">
          <CTextInput :disabled="true" :modelValue="locale" />
        </div>
      </div>

      <div class="flex justify-between space-x-8">
        <div class="py-1">Client Notes</div>
        <div class="w-64">
<!--          <CTextarea v-model="localClientNotes" :rows="4" />-->
        </div>
      </div>

      <div class="flex justify-between space-x-8">
        <div class="py-1">Internal Notes</div>
        <div class="w-64">
<!--          <CTextarea v-model="localInternalNotes" :rows="4" />-->
        </div>
      </div>

      <div class='flex space-x-6 mt-8'>
        <CButton class="w-full" @click="reset">Reset</CButton>
        <CButton class="w-full" @click="save">Save</CButton>
      </div>
    </div>
  </CModal>
</template>


<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { useHost } from '@crhio/leviate/plugins/host';
import { useSettingsStore } from '@/store/settings';

const host = useHost();
const settings = useSettingsStore();

const props = defineProps({
  modelValue: Boolean
});

const emit = defineEmits(['update:modelValue']);

const data = reactive({
  localConfigName: '',
  localClientNotes: '',
  localInternalNotes: '',
});

const showModal = ref(props.modelValue);
const showValue = computed(() => props.modelValue);

const save = () => {
  settings.clientNotes = data.localClientNotes;
  settings.internalNotes = data.localInternalNotes;
  if (settings.configName !== data.localConfigName) {
    this.setName();
  }
  showModal.value = false;
}

const debug = () => console.log(data);
const { locale } = host.getMeta().user;

const setName = async () => {
  host.setName(data.localConfigName);
  settings.configName = data.localConfigName;
}

watch(showModal, (show) => {
  emit('update:modelValue', show);
});

watch(showValue, val => {
  showModal.value = val;
});
</script>
