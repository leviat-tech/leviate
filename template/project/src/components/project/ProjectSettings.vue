<template>
  <div class="p-4 space-y-4">
    <CFormSection stacked>
      <div class="space-y-4">

        <CTextInput label="config_name" no-translate v-model="data.configName"/>
        <CListbox v-model="data.locale"
                  label="locale"
                  :options="$availableLanguages"
                  :formatter="$L"
        />
        <CTextArea label="client_notes" v-model="data.clientNotes" :rows="4"/>
        <CTextArea label="internal_notes" v-model="data.internalNotes" :rows="4"/>

        <div class='flex space-x-4 mt-8'>
          <CButton class="w-full" @click="save">Save</CButton>
          <CButton class="w-full" fill="outline" @click="reset">Reset</CButton>
        </div>
      </div>
    </CFormSection>
  </div>
</template>


<script setup>
import { reactive } from 'vue';
import { useLocalize, transact } from '@crhio/leviate';
import { useSettingsStore } from '@/store/settings';

const localize = useLocalize();
const settings = useSettingsStore();

const data = reactive({
  configName: settings.configName,
  clientNotes: settings.clientNotes,
  internalNotes: settings.internalNotes,
  locale: localize.locale.value,
});

const reset = () => {
  Object.assign(data, {
    configName: '',
    clientNotes: '',
    internalNotes: '',
  })
}

const save = () => {
  transact(() => {
    settings.clientNotes = data.clientNotes;
    settings.internalNotes = data.internalNotes;
    settings.configName = data.configName;
    settings.locale = localize.locale.value;
    localize.setLocale(data.locale);
  });
}

settings.$subscribe(() => {
  Object.assign(data, settings.$state);
});

const debug = () => console.log(data);
</script>
