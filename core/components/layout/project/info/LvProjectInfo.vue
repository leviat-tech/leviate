<template>
  <div class="h-full flex flex-col text-xs px-4 pb-4 pt-2">
    <CHeading :size="2" :title="$L('project_info_heading')" />

    <div class="flex justify-between text-base-800 font-bold border-b py-1 mb-2 text-sm">
      <div>{{ name }}</div>
      <div>#{{ number }}</div>
    </div>

    <LvAddress
      :data="project.address"
      :fields="['name', 'street', 'city', 'postcode', 'country']"
      :bold-fields="['name']"
    />

    <LvClientInfo v-if="customer" v-bind="customer" />

    <div class="text-right flex justify-end mt-4">
      <CButton color="base" size="sm" @click="openConfigurationSettings">{{
        $L('edit')
      }}</CButton>
    </div>
  </div>
</template>

<script setup>
import { useHost } from '@crhio/leviate';
import { CHeading } from '@crhio/concrete';
import LvAddress from './LvAddress.vue';
import LvClientInfo from './LvClientInfo.vue';

const $host = useHost();

const { configurator, project, customer, origin } = $host.meta;
const configuration = $host.configuration

const { name, number } = project;

function openConfigurationSettings() {
  const configurationEditUrl = new URL(
    `/configurators/${configurator.id}/configurations/${configuration.id}/edit`,
    origin
  ).toString()

  window.open(configurationEditUrl);
}
</script>
