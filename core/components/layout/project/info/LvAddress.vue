<template>
  <address class="not-italic text-base-950">
    <template v-for="field in fields">
      <span :class="boldFields.includes(field) && 'font-semibold'">
        {{ field === 'country' ? getCountryValue(data[field]) :  data[field] }}
      </span><br>
    </template>
  </address>
</template>

<script setup>

import { useLocalize } from '../../../../plugins/localize';

const { $l } = useLocalize();

const props = defineProps({
  data: Object,
  fields: Array,
  boldFields: { type: Array, default: [] },
});

function getCountryValue(country) {
  if (country.includes('_')) {
      return $l(country);
    }
      return country;
};
</script>
