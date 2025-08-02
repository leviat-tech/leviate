import { ref } from 'vue';

const selectedProperties = ref([]);

const useSelectedProperties = () => selectedProperties;

export default useSelectedProperties;
