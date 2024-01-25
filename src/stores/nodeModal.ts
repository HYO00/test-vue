import { defineStore } from 'pinia';
import { ref  } from 'vue';

// Define your store
export const useCommonStore  = defineStore('commonStore', () => {
  const nodeModal = ref({
    isModal: false,
    name: null,
    id:null
  })

  const setNodeModal = (item: { id: null; name: null; flag: boolean; }) => {
    nodeModal.value.id = item.id;
    nodeModal.value.name = item.name;
    nodeModal.value.isModal = item.flag;
  }

  const nodeItemInfo = ref({
    query: "",
    description: "",
    select: "",
    interests: [] as string[],
  })
  
  const setNodeItemInfo = (item: { query: string; description: string; select: string;  interests: string[] }) => {
    nodeItemInfo.value.query = item.query;
    nodeItemInfo.value.description = item.description;
    nodeItemInfo.value.select = item.select;
    nodeItemInfo.value.interests = item.interests;

  }


  return { nodeModal, setNodeModal, nodeItemInfo, setNodeItemInfo}

});
