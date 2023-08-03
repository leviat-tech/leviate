<template>
  <div ref="el" class="relative max-w-4xl mx-auto p-6 pb-24">
    <button class="absolute top-6 right-0 text-sky-dark" @click="$router.back()">&larr;{{ $L('back') }}</button>

    <h1 class="text-2xl font-bold mb-6">{{ $L('release_notes') }}</h1>

    <transition-group
      :enter-from-class="releases.length > 3 ? 'opacity-0 pl-8' : ''"
    >
      <div v-for="release, i in releases" :key="release.version" class="transition duration-1000">

        <h2 class="text-xl font-bold">{{ $L('version') }} {{ release.version }}</h2>
        <div class="text-xs mb-4 text-steel-dark">{{ $L('released') }} {{ release.date }}</div>

        <template v-for="groupName in ['features', 'fixes']">
          <div v-if="release[groupName]">
            <div class="font-bold">{{ $L(groupName) }}</div>
            <ul class="ml-4 list-disc list-inside text-sm">
              <li v-for="item in release[groupName]" v-html="formatItem(item)" />
            </ul>
          </div>
        </template>

        <hr class="my-8">

      </div>
    </transition-group>

    <button v-if="allReleases.length > releases.length"
            @click="showMore"
            class="text-sky-dark">{{ $l('show_more') }}</button>

  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue';

const el = ref(null);

const allReleases = ref([]);

// Initially show the latest 3 releases;
const truncateIndex = ref(3);

const releases = computed(() => {
  return allReleases.value.slice(0, truncateIndex.value);
});

function formatItem(text) {
  const matches = text.match(/\*\*(\w+):\*\*(.+)/)

  if (!matches) return text;

  return `<span class="pb-0.5 pt-0 px-1.5 bg-indigo text-white text-xs rounded">${matches[1]}</span>${matches[2]}`
}

async function showMore() {
  const firstNewItemIndex = truncateIndex.value;

  truncateIndex.value += 1;

  await nextTick();

  const newItemHeader = document.getElementsByTagName('h2')[firstNewItemIndex];

  el.value.parentNode.scrollTo({ top: newItemHeader.offsetTop, behavior: 'smooth' });
}

fetch('/updates.json').then(res => res.json()).then(json => allReleases.value = json);

</script>