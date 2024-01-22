<script setup lang="ts">
import { reactive, ref } from "vue"
import { Nodes, Edges } from "v-network-graph"
import * as vNG from "v-network-graph"
import data from "./data"

let nodes: Nodes = reactive({ ...data.nodes })
let edges: Edges = reactive({ ...data.edges })
const nextNodeIndex = ref(Object.keys(nodes).length + 1)
const nextEdgeIndex = ref(Object.keys(edges).length + 1)

const selectedNodes = ref<string[]>([])
const selectedEdges = ref<string[]>([])

const graph = ref<vNG.Instance>();
const layouts = ref({ ...data.layouts })
const fileInput = ref(null);

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

const onDrop = (event:any) => {
    console.log(event, "in new drop", graph)
    if (!graph.value) return;
    const point = { x: event.offsetX, y: event.offsetY }
    // translate coordinates: DOM -> SVG
    const svgPoint = graph.value.translateFromDomToSvgCoordinates(point);
    const selectedItem = event.dataTransfer.getData("selectedItem");
    const nodeId = `node${nextNodeIndex.value}`
    const name = `${selectedItem}`
    layouts.value.nodes[nodeId] = svgPoint
    nodes[nodeId] = { name };
    nextNodeIndex.value++
}

const  exportData = async() => {

    if (!graph.value) return;
    const text = await graph.value.exportAsSvgText()
    console.log(text, "exportData", layouts.value , nodes, edges)
    const exportInfo =  {
      nodes: nodes,
      edges: edges,
      layouts :layouts.value
    };
    console.log("--------", exportInfo)
    let exportValue = JSON.stringify(exportInfo, undefined, 2);
    console.log("exportValue", exportValue)
    // exportArea.value = exportValue;
    const blob = new Blob([exportValue], { type: "application/json" });

    // Create a link element
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);

    // Set the download attribute and link URL
    a.download = "network_data.json";
    a.href = url;

    // Append the link to the body and trigger the click event
    document.body.appendChild(a);
    a.click();

    // Remove the link element from the body
    document.body.removeChild(a);

    // Release the Blob URL
    URL.revokeObjectURL(url);
}

// const importData = () => {
//     const importedData = {
//     nodes: { node1: { name: 'N1' }, node2: { name: 'N2' } },
//     edges: { edge1: { source: 'node1', target: 'node2' } },
//     layouts: {
//       nodes: {
//         node1: { x: 50, y: 0 },
//         node2: { x: 0, y: 75 }
//       }
//     }
//   };

    // nodes = reactive({});
    // edges = reactive({});
   
// }

const importData = () => {
  fileInput.value.click();
}

const handleFileChange = (event:any) => {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        nextNodeIndex.value = 1;
        nextEdgeIndex.value = 1;

        // Populate nodes
        for (const nodeId in importedData.nodes) {
            const { name } = importedData.nodes[nodeId];
            nodes[nodeId] = { name };
            nextNodeIndex.value++;
        }

        // Populate edges
        for (const edgeId in importedData.edges) {
            const { source, target } = importedData.edges[edgeId];
            edges[edgeId] = { source, target };
            nextEdgeIndex.value++;
        }
        for (const nodeId in importedData.layouts.nodes) {
            const { x, y } = importedData.layouts.nodes[nodeId];
            layouts.value.nodes[nodeId] = { x, y };
        }

        
      } catch (error) {
        console.error('Error parsing JSON file:', error);
      }
    };

    reader.readAsText(file);
  }
}

</script>

<template>
  <div class="demo-control-panel">
    <div class="btnBox">
      <label>Node:</label>
      <v-btn @click="addNode">add</v-btn>
      <v-btn :disabled="selectedNodes.length == 0" @click="removeNode"
        >remove</v-btn
      >
    </div>
    <div class="btnBox">
      <label>Edge:</label>
      <v-btn :disabled="selectedNodes.length != 2" @click="addEdge"
        >add</v-btn
      >
      <v-btn :disabled="selectedEdges.length == 0" @click="removeEdge"
        >remove</v-btn
      >
    </div>
    <div>
        <v-btn block rounded="sm" size="small"  @click="exportData">export</v-btn>
        <v-btn block rounded="sm" size="small"  @click="importData">
            importData
            <input ref="fileInput" type="file" style="display: none" @change="handleFileChange" />
        </v-btn>
    </div>
  </div>

  <v-network-graph
    ref="graph"
    v-model:selected-nodes="selectedNodes"
    v-model:selected-edges="selectedEdges"
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts"
    :configs="data.configs"
    @drop.prevent="onDrop($event)"
    @dragenter.prevent
    @dragover.prevent
  />
</template>

<style>
.btnBox{
    display: flex;
    margin: 10px;
}
</style>