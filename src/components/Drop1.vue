<script setup lang="ts">
import { reactive, ref } from "vue"
import { Nodes, Edges, LayerPositions } from "v-network-graph"
import data from "./data"
import * as vNG from "v-network-graph"

const nodes: Nodes = reactive({ ...data.nodes })
const edges: Edges = reactive({ ...data.edges })
const layouts = ref({ ...data.layouts })
let nextNodeIndex = Object.keys(nodes).length + 1
// const nextNodeIndex = ref(Object.keys(nodes).length + 1)
let nextEdgeIndex = Object.keys(nodes).length + 1
// const nextEdgeIndex = ref(Object.keys(edges).length + 1)
const graph = ref<vNG.Instance>()

const selectedNodes = ref<string[]>([])
const selectedEdges = ref<string[]>([])
console.log(selectedEdges, "selectedEdges")
// function addNode() {
//   const nodeId = `node${nextNodeIndex.value}`
//   const name = `N${nextNodeIndex.value}`
//   nodes[nodeId] = { name }
//   nextNodeIndex.value++
// }

function removeNode() {
  for (const nodeId of selectedNodes.value) {
    delete nodes[nodeId]
  }
}

function addEdge() {
  if (selectedNodes.value.length !== 2) return
  const [source, target] = selectedNodes.value;
  const edgeId = `edge${nextEdgeIndex}`
  edges[edgeId] = { source, target };
  selectedEdges.value.push(edgeId); 
  nextEdgeIndex++
}

function removeEdge() {
  for (const edgeId of selectedEdges.value) {
    delete edges[edgeId]
  }
  selectedEdges.value = [];
}
function exportData () {
   console.log("exportData", layouts.value , nodes, edges)
  // const text =  graph.value.exportAsSvgText({ embedImages: true })
}

const onDrop = (event:any) => {
  console.log(event, "here onDrop1", layouts.value, LayerPositions)
  const point = { x: event.offsetX, y: event.offsetY }
    // translate coordinates: DOM -> SVG
  const svgPoint = graph.value.translateFromDomToSvgCoordinates(point);

  const selectedItem = event.dataTransfer.getData("selectedItem");
  const nodeId = `node${nextNodeIndex}`;
  const name = selectedItem;
  layouts.value.nodes[nodeId] = svgPoint

  // Add the new node to the graph at the drop position
  nodes[nodeId] = { name };
  selectedNodes.value.push(nodeId);
  nextNodeIndex++;
  // nextEdgeIndex.value++
}

// const eventHandlers: vNG.EventHandlers = {
//   "view:click": ({ event }) => {
//     console.log("evev")
//     if (!graph.value) return

//     const point = { x: event.offsetX, y: event.offsetY }
//     // translate coordinates: DOM -> SVG
//     const svgPoint = graph.value.translateFromDomToSvgCoordinates(point)

//     // add node and its position
//     const nodeId = `node${nextNodeIndex}`
//     const name = `N${nextNodeIndex}`
//     layouts.value.nodes[nodeId] = svgPoint
//     nodes[nodeId] = { name }
//     nextNodeIndex++
//   },
// }
// const initialConfigs = vNG.defineConfigs({
//   node: {
//     selectable: 2,
//     normal: {
//       type: "rect",
//       radius: 16,
//       // for type is "rect" -->
//       width: 62,
//       height: 32,
//       borderRadius: 4,
//       // <-- for type is "rect"
//       strokeWidth: 0,
//       strokeColor: "#000000",
//       strokeDasharray: "0",
//       color: "#4466cc",
//     },
//     label: {
//       visible: true,
//       fontFamily: undefined,
//       fontSize: 13,
//       lineHeight: 1.1,
//       color: "#ffffff",
//       margin: 4,
//       direction: "south",
//       background: {
//         visible: false,
//         color: "#ffffff",
//         padding: {
//           vertical: 1,
//           horizontal: 4,
//         },
//         borderRadius: 2,
//       },
//     },
//   }
// })

//const configs = reactive(initialConfigs)

</script>

<template>
  <div class="demo-control-panel">
    <div>
      <label>Node:</label>
      <v-col cols="auto">
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
   
    ref="graph"
    v-model:selected-nodes="selectedNodes"
    v-model:selected-edges="selectedEdges"
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts"
    
    @drop.prevent="onDrop($event)"
    @dragenter.prevent
    @dragover.prevent
  />
</template>