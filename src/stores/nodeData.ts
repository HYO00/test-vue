import { defineStore } from 'pinia';
import { ref  } from 'vue';
// Define your store
export const useDataStore = defineStore('dataStore', () => {
  const nodeDataInfo = ref({})
  
  const setNodeDataInfo = (nodeInfo: any) => {
    console.log(nodeInfo, "store")
    nodeDataInfo.value = nodeInfo
  }

  return { nodeDataInfo, setNodeDataInfo}

});
