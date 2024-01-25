<script setup lang="ts">
import { ref } from "vue"
import * as vNG from "v-network-graph"
import data from "../../static/data"
import { useDataStore } from '../../stores/nodeData';
import { useNetworkStore } from '../../stores/network';
import tableDataJson from "../../static/tableData.json";
import { Tabulator } from 'tabulator-tables';
import { TableData } from '../../types/tableDataTypes';

import { makeDraggable } from '../../utils/dragUtil';

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

const eventHandlers: vNG.EventHandlers = {
  "node:click": ({node}) => {
    dataStore.setNodeDataInfo(nodes[node]);
  },
  "node:contextmenu": showNodeContextMenu,
};
const onNodeMenuClick = () => {
  for (const node in nodes) {
    
    if (nodes[node].name === menuTargetNode.value) {
      const tableName = nodes[node].name as string;

      // 새로운 테이블 컨테이너 생성
      const tableContainer = document.createElement('div');
      tableContainer.classList.add('table-container');

      // 테이블 컨테이너에 ID 할당
      tableContainer.id = `container-${tableName}`;

      // 닫기 버튼 생성
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.classList.add('close-button')
      closeButton.onclick = () => tableContainer.remove();
      makeDraggable(tableContainer);

      // 테이블 컨테이너에 닫기 버튼 추가

      // 새로운 Tabulator 테이블 생성
      const newTable = document.createElement('div');
      newTable.id = `table-${tableName}`;
      tableContainer.appendChild(newTable);
      tableContainer.appendChild(closeButton);

      // DOM에 테이블 컨테이너 추가
      document.body.appendChild(tableContainer);

      // Tabulator 인스턴스 생성
      new Tabulator(`#table-${tableName}`, {
        data: tableData[tableName].data,
        columns: tableData[tableName].columns
      });
    }
  }
};

const onTransFormMenuClick = () => {
  if (edges) {
    for (const edge in edges ) {
      const transformContainer = document.getElementById('transform-table-container');
      if (transformContainer) {
          transformContainer.style.visibility = 'visible' // 컨테이너 내용 비우기
      }

      const { source, target } = edges[edge];
      const sourceTableName = nodes[source].name as string;
      const targetTableName = nodes[target].name as string;

      new Tabulator(`#source-table`, {
        data: tableData[sourceTableName].data,
        columns: tableData[sourceTableName].columns,
      });

      new Tabulator(`#target-table`, {
        data: tableData[targetTableName].data,
        columns: tableData[targetTableName].columns
      });

      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.classList.add('close-button');
      closeButton.onclick = () => {
        const transformContainer = document.getElementById('transform-table-container');
        closeButton.remove();
        if (transformContainer) {
          transformContainer.style.visibility = 'hidden' // 컨테이너 내용 비우기
        }
      };

      if (transformContainer) {
        transformContainer.appendChild(closeButton);
      }
    }
  }
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
          <v-btn block rounded="sm" size="small"  @click="networkStore.importData(fileInput)">
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
      <div @click="onTransFormMenuClick">Transform</div>
    </div>
    <div ref="draggableContainer"  id="table-container" class="draggable-container"></div>
    <div id="transform-table-container">
      <div id="source-table"></div>
      <div id="target-table"></div>
    </div>
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

.draggable-container button {
  position: absolute;
  top: 0;
  right: 0;
  /* 버튼 스타일 */
}

.table-container {
  position: absolute; /* 절대 위치 */
  border: 1px solid #ddd; /* 테두리 스타일 */
  background-color: white; /* 배경색 */
  cursor: move; /* 커서 스타일 */
}

.close-button {
  border: none;
  background-color: #f44336;
  color: white;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}



#transform-table-container {
  display: flex;
  flex-direction: row;
  width: 100%;
}
</style>