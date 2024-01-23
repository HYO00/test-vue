import { defineStore } from 'pinia';
import { ref, reactive  } from 'vue';
import { Nodes } from "v-network-graph"

export const useNewaStore = defineStore('newNodeStore', () => {
    const newNodeData:Nodes = reactive({});

    const setNewDataInfo = (nodeInfo: any) => {
        newNodeData.value = nodeInfo
    }

    return {   newNodeData, setNewDataInfo }
})