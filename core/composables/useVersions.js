import { computed, ref } from 'vue';
import { useHost } from '../plugins/host';
import { useRootStore } from '@crhio/leviate';

let isInitialized = false;

const versions = ref([]);
export const activeVersionId = ref(null);

const activeVersion = computed(() => {
  return versions.value.find(version => version.id === activeVersionId.value);
});

const rootVersionId = computed(() => {
  const rootVersion =  versions.value.find(version => !version.parentId);
  return rootVersion.id;
});

function getVersionById(id) {
  return versions.value.find(version => version.id === id)
}

function loadVersion(id) {
  const newState = getVersionById(id).state;
  useRootStore().replaceState(newState);
  activeVersionId.value = id;
}

async function fetchVersions() {
  versions.value = await useHost().getVersions(false);
}

export default function useVersions() {
  if (!isInitialized) {
    isInitialized = true;
    // activeVersionId.value = useHost().getConfiguration().id;
    fetchVersions();
  }

  return {
    versions,
    activeVersion,
    activeVersionId,
    rootVersionId,
    getActiveVersion: () => activeVersion.value,
    getActiveVersionId: () => activeVersionId.value,
    getVersionById,
    loadVersion,
    createVersion: async (name, fromId) => {
      const id = fromId || activeVersionId.value;
      const newVersion = await useHost().createVersion(name, id);
      await fetchVersions();
      loadVersion(newVersion.id);
    },
    deleteVersion: async (id) => {
      useHost().deleteVersion(id);
      fetchVersions();
    }
  }
}
