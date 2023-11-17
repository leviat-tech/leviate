<template>
  <div class="h-full p-4">

    <div class="text-sky-dark font-bold text-lg mb-2">{{ $L('project_info_heading') }}</div>

    <div class="ml-2">
      <div class="flex justify-between mb-1 text-gray-500 text-base font-bold border-b pb-1 mb-2">
        <div>{{ name }}</div>
        <div>#{{ number }}</div>
      </div>

      <LvAddress :data="project.address"
                 :fields="['name', 'address', 'city', 'postalCode', 'country']"
                 :bold-fields="['name']"/>

    </div>

    <LvClientInfo v-if="customer" v-bind="customer" />

    <div class="text-right">
      <CButton color="sky" size="sm" @click="openProjectSettings">{{ $L('edit') }}</CButton>
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
  window.open(projectEditUrl)
}
</script>
