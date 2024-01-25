import { defineStore } from 'pinia';
import { ref  } from 'vue';

// Define your store
export const useCommonStore  = defineStore('commonStore', () => {
  const nodeModal = ref({
    isModal: false,
    name: null,
    id:null
  })

  const setNodeModal = (flag:boolean) => {
    nodeModal.value.isModal = flag
  }

  return { nodeModal, setNodeModal}

});
