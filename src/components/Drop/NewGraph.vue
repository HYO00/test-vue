<script setup lang="ts">
import { ref, Ref } from "vue"
import * as vNG from "v-network-graph"
import data from "../../static/data"
import { useDataStore } from '../../stores/nodeData';
import { useNetworkStore } from '../../stores/network';
import tableDataJson from "../../static/tableData.json";
import { Tabulator } from 'tabulator-tables';
import { TableData } from '../../types/tableDataTypes';
import { useCommonStore } from '../../stores/nodeModal';
import Example from "../../components/Modal/Example.vue"

const modalStore = useCommonStore();
const dataStore = useDataStore();
const networkStore = useNetworkStore();

const { nodes, edges, layouts } = networkStore;

const graph = ref<vNG.VNetworkGraphInstance | null>(null);
const fileInput = ref<HTMLElement | null>(null);

const nodeMenu = ref<HTMLDivElement>();
const menuTargetNode = ref("");
const tableData:TableData = tableDataJson;

const showContextMenu = (element: HTMLElement, event: MouseEvent) => {
  element.style.left = event.x + "px"
  element.style.top = event.y + "px"
  element.style.visibility = "visible"
  const handler = (event: PointerEvent) => {
    if (!event.target || !element.contains(event.target as HTMLElement)) {
      element.style.visibility = "hidden"
      document.removeEventListener("pointerdown", handler, { capture: true })
    }
  }
  document.addEventListener("pointerdown", handler, { passive: true, capture: true })
};

const showNodeContextMenu = (params: vNG.NodeEvent<MouseEvent>) => {
  const { node, event } = params
  // Disable browser's default context menu
  event.stopPropagation()
  event.preventDefault()
  if (nodeMenu.value) {
    menuTargetNode.value = nodes[node].name ?? ""
    showContextMenu(nodeMenu.value, event)
  }
};



const onNodeMenuClick = () => {
  for (const node in nodes) {
    if (nodes[node].name === menuTargetNode.value) {
      const tableName = nodes[node].name as string;

      const newTable = document.createElement('div');
      newTable.id = tableName;

      const tableContainer = document.getElementById('table-container');
      if (tableContainer) {
        tableContainer.appendChild(newTable); // 새 요소 추가
      }

      new Tabulator(`#${tableName}`, {
        data: tableData[tableName].data,
        columns: tableData[tableName].columns,
        layout:'fitColumns'
      });
      
    }
  }
};
const draggableContainer:Ref<HTMLElement | null> = ref(null);


const startDrag = (event:MouseEvent) => {
  const el = draggableContainer.value;
  if (!el) return;

  let posX = event.clientX - el.getBoundingClientRect().left;
  let posY = event.clientY - el.getBoundingClientRect().top;

  const moveElement = (moveEvent: MouseEvent) => {
    el.style.left = moveEvent.clientX - posX + 'px';
    el.style.top = moveEvent.clientY - posY + 'px';
  };

  const stopDrag = () => {
    document.removeEventListener('mousemove', moveElement);
    document.removeEventListener('mouseup', stopDrag);
  };

  document.addEventListener('mousemove', moveElement);
  document.addEventListener('mouseup', stopDrag);
};




const eventHandlers: vNG.EventHandlers = {
  "node:click": ({node}) => {
    dataStore.setNodeDataInfo( nodes[node]);
  },
  "node:dblclick": ({node}) => {
     console.log(nodes[node], "db click", modalStore.nodeModal.isModal )
    const clikedItem = {
      id: nodes[node].nodeId,
      name: nodes[node].name,
      flag: !modalStore.nodeModal.isModal
    }
    modalStore.setNodeModal(clikedItem)
  },
  "node:contextmenu": showNodeContextMenu,
}

</script>

<template>
  <div class="graph-container">
    <div class="demo-control-panel">
      <div class="btnBox">
        <label>Node:</label>
        <v-btn @click="networkStore.addNode()">add</v-btn>
        <v-btn :disabled="networkStore.selectedNodes.length == 0" @click="networkStore.removeNode()"
          >remove</v-btn
        >
      </div>
      <div class="btnBox">
        <label>Edge:</label>
        <v-btn :disabled="networkStore.selectedNodes.length != 2" @click="networkStore.addEdge()"
          >add</v-btn
        >
        <v-btn :disabled="networkStore.selectedEdges.length == 0" @click="networkStore.removeEdge()"
          >remove</v-btn
        >
      </div>
      <div>
          <v-btn block rounded="sm" size="small"  @click="networkStore.exportData(graph)">export</v-btn>
          <v-btn block rounded="sm" size="small"  @click="networkStore.importData(fileInput as HTMLElement)">
              importData
              <input ref="fileInput" type="file" style="display: none" @change="networkStore.handleFileChange($event)" />
          </v-btn>
      </div>
    </div>
    <v-network-graph
      class="graphBox"
      ref="graph"
      v-model:selected-nodes="networkStore.selectedNodes"
      v-model:selected-edges="networkStore.selectedEdges"
      :nodes="nodes"
      :edges="edges"
      :layouts="layouts"
      :configs="data.configs"
      :event-handlers="eventHandlers"
      @drop.prevent="networkStore.onDrop($event, graph)"
      @dragenter.prevent
      @dragover.prevent
    />
    <div ref="nodeMenu" class="context-menu">
      Menu for the nodes
      <div @click="onNodeMenuClick">{{ menuTargetNode }}</div>
    </div>
    <div ref="draggableContainer"  id="table-container" class="draggable-container" @mousedown="startDrag"></div>
    <Example :dialog="modalStore.nodeModal.isModal"/>
  </div>

</template>

<style>
.graph-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.demo-control-panel {
  display: flex;
}
.graphBox{
  border: 1px solid rgb(140, 155, 237);
  border-radius: 5px;
  margin-top: 10px;
}
.btnBox{
  display: flex;
  margin: 10px;
}

.context-menu {
  width: 180px;
  background-color: #efefef;
  padding: 10px;
  position: fixed;
  visibility: hidden;
  font-size: 12px;
  border: 1px solid #aaa;
  box-shadow: 2px 2px 2px #aaa;
  color: #000000;

  > div {
    border: 1px dashed #000000;
    padding: 4px;
    margin-top: 8px;
    color: #000000;
  }
}

.draggable-container {
  position: absolute;
  cursor: grab;
}
</style>