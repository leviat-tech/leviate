<template>
  <div class="h-full p-4 flex flex-col">
    <h4 class="text-sky-dark font-bold mb-2 text-base">
      {{ $L('project_info_heading') }}
    </h4>

    <div
      class="flex justify-between mb-1 text-gray-500 font-bold border-b py-1 mb-2"
    >
      <div>{{ name }}</div>
      <div>#{{ number }}</div>
    </div>

    <LvAddress
      :data="project.address"
      :fields="['name', 'address', 'city', 'postalCode', 'country']"
      :bold-fields="['name']"
    />

    <LvClientInfo v-if="customer" v-bind="customer" />

    <div class="text-right">
      <CButton color="sky" size="sm" @click="openProjectSettings">{{
        $L('edit')
      }}</CButton>
    </div>
  </div>
</template>

<script setup>
import { useHost } from '@crhio/leviate';
import LvAddress from './LvAddress.vue';
import LvClientInfo from './LvClientInfo.vue';

const $host = useHost();

const { project, customer, origin } = $host.meta;
const { name, number } = project;

function openProjectSettings() {
  const projectEditUrl = `${origin}/projects/${[project.id]}`;
  window.open(projectEditUrl);
}
</script>
