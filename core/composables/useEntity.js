import { useRoute } from 'vue-router';
import { onUnmounted, shallowRef, watch } from 'vue';

const entityRef = shallowRef(null);

export function useEntity(model) {
  if (entityRef.value) return entityRef;

  const route = useRoute();

  watch(
    () => route.params.id,
    (id) => {
      entityRef.value = model.find(id);
    },
    { immediate: true }
  );

  onUnmounted(() => {
    entityRef.value = null;

    return;
  });

  return entityRef;
}
