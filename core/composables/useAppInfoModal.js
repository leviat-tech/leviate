import { ref } from 'vue';

const isAppInfoModalOpen = ref(false);

export default function useAppInfoModal() {

  return {
    isAppInfoModalOpen,
    openAppInfoModal: () => isAppInfoModalOpen.value = true,
    closeAppInfoModal: () => isAppInfoModalOpen.value = false,
  }
}