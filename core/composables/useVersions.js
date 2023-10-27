import { computed, ref } from 'vue';
import { useHost } from '../plugins/host';
import { useRootStore } from '@crhio/leviate';

let isInitialized = false;

const versions = ref([]);
const activeVersionId = ref(null);
const activeVersion = computed(() => {
  return versions.find(version => version.id === activeVersionId.value);
});

async function loadVersion(id) {
  const newState = await useHost().loadConfiguration(id);
  // TODO: fix panel tab minimising when loading new version
  useRootStore().replaceState(newState);
  activeVersionId.value = id;
}

async function fetchVersions() {
  versions.value = await useHost().getVersions(false);
}

export default function useVersions() {
  if (!isInitialized) {
    activeVersionId.value = useHost().getConfiguration().id;
    fetchVersions();
  }

  return {
    versions,
    activeVersion,
    activeVersionId,
    getActiveVersion: () => activeVersion.value,
    getActiveVersionId: () => activeVersionId.value,
    getVersionById: (id) => {
      return versions.value.find(version => version.id === id)
    },
    loadVersion,
    createVersion: async (name, fromId) => {
      const id = fromId || activeVersionId.value;
      const newVersion = await useHost().createVersion(name, id);
      fetchVersions();
      loadVersion(newVersion.id);

      // TODO: set new version as active
    },
    deleteVersion: async (id) => {
      useHost().deleteVersion(id);
      fetchVersions();
    }
  }
}
