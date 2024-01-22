<script setup lang="ts">
import { reactive, ref } from "vue"
import { Nodes, Edges, Layouts, LayerPositions } from "v-network-graph"
import data from "./data"
import * as vNG from "v-network-graph"
import { RefSymbol } from "@vue/reactivity";

const nodes: Nodes = reactive({ ...data.nodes })
const edges: Edges = reactive({ ...data.edges })
const layouts: Layouts = reactive({...data.layouts})
const nextNodeIndex = ref(Object.keys(nodes).length + 1)
const nextEdgeIndex = ref(Object.keys(edges).length + 1)
const graph = ref<vNG.Instance>()

const selectedNodes = ref<string[]>([])
const selectedEdges = ref<string[]>([])

function addNode() {
  const nodeId = `node${nextNodeIndex.value}`
  const name = `N${nextNodeIndex.value}`
  nodes[nodeId] = { name }
  nextNodeIndex.value++
}

function removeNode() {
  for (const nodeId of selectedNodes.value) {
    delete nodes[nodeId]
  }
}

function addEdge() {
  if (selectedNodes.value.length !== 2) return
  const [source, target] = selectedNodes.value
  const edgeId = `edge${nextEdgeIndex.value}`
  edges[edgeId] = { source, target }
  nextEdgeIndex.value++
}

function removeEdge() {
  for (const edgeId of selectedEdges.value) {
    delete edges[edgeId]
  }
}
function exportData () {
   console.log("ex", graph, nodes, edges, layouts )
  // const text =  graph.value.exportAsSvgText({ embedImages: true })
}

const onDrop = (event:any, idx:number) => {
  console.log(event, idx, "here onDrop1", layouts, LayerPositions)
  const selectedItem = event.dataTransfer.getData("selectedItem");
  const nodeId = `node${nextNodeIndex.value}`;
  const name = selectedItem;
  
  // Get the coordinates of the drop position
  const x = event.clientX;
  const y = event.clientY;
  //   const canvasRect = document.getElementById('mynetwork').getBoundingClientRect();
  // const canvasX = x - canvasRect.left;
  // const canvasY = y - canvasRect.top;
  // const canvasCoord = { x: canvasX, y: canvasY };
  // const networkCoord = graph.DOMtoCanvas(canvasCoord);

  // Add the new node to the graph at the drop position
  nodes[nodeId] = { name, x, y };
  nextNodeIndex.value++;
}



</script>

<template>
  <div class="demo-control-panel">
    <div>
      <label>Node:</label>
      <v-col cols="auto">
        <v-btn block rounded="sm" size="small"  @click="addNode">add</v-btn>
        <v-btn block rounded="sm" size="small"  :disabled="selectedNodes.length == 0" @click="removeNode"
        >remove</v-btn>
      </v-col>
    </div>
    <div>
      <label>Edge:</label>
      <v-btn block rounded="sm" size="small" :disabled="selectedNodes.length != 2" @click="addEdge"
        >add</v-btn
      >
      <v-btn block rounded="sm" size="small" :disabled="selectedEdges.length == 0" @click="removeEdge"
        >remove</v-btn
      >
      <v-btn block rounded="sm" size="small"  @click="exportData"
        >export</v-btn
      >
    </div>
  </div>

  <v-network-graph
    id="mynetwork"
    ref="graph"
    v-model:selected-nodes="selectedNodes"
    v-model:selected-edges="selectedEdges"
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts"
    :configs="data.configs"
    @drop.prevent="onDrop($event, idx)"
    @dragenter.prevent
    @dragover.prevent
  />
</template>