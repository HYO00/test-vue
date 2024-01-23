import { defineStore } from 'pinia';
import { ref  } from 'vue';
// Define your store
export const useDataStore = defineStore('dataStore', () => {
  const nodeDataInfo = ref({})
  const setNodeDataInfo = (nodeInfo: any) => {
    nodeDataInfo.value = nodeInfo
  }

  return { nodeDataInfo, setNodeDataInfo}
  // state: () => ({
  //   nodeDataInfo: null,
  // }),
  // actions: {
  //   setNodeDataInfo(nodeInfo) {
  //     this.nodeDataInfo = nodeInfo;
  //   },
  // },
});
