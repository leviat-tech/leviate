import { ref } from 'vue';

const isAppInfoModalOpen = ref(false);

export default function useAppInfoModal() {

  return {
    isAppInfoModalOpen,
    openAppInfoModal: () => {
      console.log(isAppInfoModalOpen.value);
      isAppInfoModalOpen.value = true
      console.log(isAppInfoModalOpen.value);
    },
    closeAppInfoModal: () => isAppInfoModalOpen.value = false,
  }
}