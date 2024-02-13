<template>
  <CModal v-if="appInfoModal.isOpen" :title="title" @close="appInfoModal.close">
    <div class="flex -m-6 p-6 bg-gray-100">
      <div class="flex-grow flex flex-col justify-between mr-24 text-xs leading-5">
        <div>
          <img src="https://leviatcdn.blob.core.windows.net/static/branding/logo.png" width="180" class="mb-1"/>
          <div>{{ $l('built_by') }} Leviat Digital Engineering</div>
        </div>

        <div>
          <div>{{ $L('version') }} {{ version }}</div>
          <div> {{ $l('built_on') }} {{ date }}
          </div>
          <button class="text-indigo" @click="openReleaseNotes">
            ({{ $l('release_notes') }})
          </button>
        </div>

        <div>&copy; {{ new Date().getFullYear() }} Leviat. {{ $l('all_rights_reserved') }}</div>



      </div>
      <div>
        <img src="/thumbnail.png" width="200" class="p-4 border rounded bg-white"/>
      </div>
    </div>
  </CModal>
</template>

<script>
import useAppInfoModal from '../composables/useAppInfoModal.js';

export default {
  created() {
    this.appInfoModal = useAppInfoModal();
  },
  computed: {
    title() {
      return this.appInfoModal.appName;
    },
    version() {
      return this.appInfoModal.appVersion;
    },
    date() {
      return this.appInfoModal.buildDate;
    }
  },
  methods: {
    openReleaseNotes() {
      this.appInfoModal.close();
      this.$router.push('/release-notes');
    }
  }
}

</script>
