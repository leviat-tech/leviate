<template>
  <div ref="el" class="relative max-w-4xl mx-auto p-6 pb-24">
    <button class="absolute top-6 right-0 text-sky-dark" @click="goBack">&larr;{{ $l('back') }}</button>

    <h1 class="text-2xl font-bold mb-6">{{ $l('release_notes') }}</h1>

    <transition-group name="fade" enter-active-class="duration-1000">
      <div v-for="(release, i) in releases" :key="release.version">
        <h2 class="text-xl font-bold">{{ $l('version') }} {{ release.version }}</h2>
        <div class="text-xs mb-4 text-steel-dark">{{ $l('released') }} {{ release.date }}</div>

        <template v-for="groupName in ['features', 'fixes']">
          <div v-if="release[groupName]">
            <div class="font-bold">{{ $l(groupName) }}</div>
            <ul class="ml-4 list-disc list-inside text-sm">
              <li v-for="item in release[groupName]" v-html="formatItem(item)"></li>
            </ul>
          </div>
        </template>

        <hr class="my-8">
      </div>
    </transition-group>

    <button v-if="allReleases.length > releases.length" @click="showMore" class="text-sky-dark">{{ $l('show_more') }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      el: null,
      allReleases: [],
      truncateIndex: 3
    };
  },
  computed: {
    releases() {
      return this.allReleases.slice(0, this.truncateIndex);
    }
  },
  methods: {
    formatItem(text) {
      const matches = text.match(/\*\*(\w+):\*\*(.+)/);
      if (!matches) return text;
      return `<span class="pb-0.5 pt-0 px-1.5 bg-indigo text-white text-xs rounded">${matches[1]}</span>${matches[2]}`;
    },
    goBack() {
      this.$router.back();
    },
    showMore() {
      const firstNewItemIndex = this.truncateIndex;
      this.truncateIndex += 1;
      this.$nextTick(() => {
        const newItemHeader = document.getElementsByTagName('h2')[firstNewItemIndex];
        this.el.parentNode.scrollTo({ top: newItemHeader.offsetTop, behavior: 'smooth' });
      });
    }
  },
  mounted() {
    fetch('updates.json')
    .then(res => res.json())
    .then(json => (this.allReleases = json));
  }
};
</script>
