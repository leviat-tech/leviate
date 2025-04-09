import { computed, ref } from 'vue';
import { useHost } from '../plugins/host';

let isInitialized = ref(false);

const versions = ref([]);
export const activeVersionId = ref(null);

const activeVersion = computed(() => {
  return (
    versions.value.find((version) => version.id === activeVersionId.value) ||
    useHost().configuration
  );
});

const rootVersionId = computed(() => {
  const rootVersion = versions.value.find((version) => !version.parentId);
  return rootVersion.id;
});

function getVersionById(id) {
  return versions.value.find((version) => version.id === id);
}

async function loadVersion(id) {
  await useHost().setActiveVersionId(id);
  window.location.reload();
}

async function fetchVersions() {
  const { getVersions, getActiveVersionId } = useHost();
  versions.value = await getVersions();
  activeVersionId.value = await getActiveVersionId();
  console.log(versions.value, activeVersionId.value)
}

export default function useVersions() {
  if (!isInitialized.value) {
    fetchVersions().then(() => {
      isInitialized.value = true;
    });
  }

  return {
    versions,
    isInitialized,
    activeVersion,
    activeVersionId,
    rootVersionId,
    getVersionById,
    loadVersion,
    setName: async (name, id) => {
      await useHost().setName(name, id);
      return fetchVersions();
    },
    createVersion: async (name, fromId) => {
      const id = fromId || activeVersionId.value;
      const newVersion = await useHost().createVersion(name, id);
      return loadVersion(newVersion.id);
    },
    deleteVersion: async (id) => {
      await useHost().deleteVersion(id);

      const isActiveVersion = activeVersionId.value === id;

      if (!isActiveVersion) {
        return fetchVersions();
      }

      const nextActiveVersionIndex = versions.value.findIndex((version) => version.id === id) - 1;
      const nextActiveVersionId = versions.value[nextActiveVersionIndex].id;
      return loadVersion(nextActiveVersionId);
    },
  };
}
