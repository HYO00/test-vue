<template>
  <div>
    <div id="mynetwork" ref="container"  
        @drop.prevent="onDrop($event)"
         @dragenter.prevent
         @dragover.prevent>
    </div>
    <v-btn @click="exportData">export</v-btn>
    <div>
      <v-btn @click="importData">import
      <input ref="fileInput" type="file" style="display: none" @change="handleFileChange" />
    </v-btn>
    </div>

  </div>
</template>

<style>
#mynetwork {
width: 900px;
height: 620px;
margin: 5px 0;
border: 1px solid #000;
}
</style>

<script setup lang="ts">
import { ref, onMounted, reactive, computed  } from 'vue';
import { Network } from 'vis-network';
import type { Data, Node, Edge, Options } from 'vis-network';
import { DataSet } from 'vis-data';
 import { useDataStore } from '../stores/nodeData';

const dataStore = useDataStore();
const fileInput = ref(null);


const nodes = new DataSet<Node>([
 
]);

const edges = new DataSet<Edge>([

]);

const options: Options = reactive({
  width: '100%', // 캔버스의 가로 크기
  height: "100%", // 캔버스의 세로 크기
  manipulation: {
    enabled: true,
  },
  physics: false,
  autoResize: false,
  nodes:{
    shape: 'box',
  //  margin: { top: 15, right: 20, bottom:15, left: 20 }
  },
  edges: {
    arrows: "to",
  }
 
});

const container = ref<HTMLElement | null>(null);

let network: Network | null = null;
let exportValue: Object | null = null;


const graphData = computed(() => ({
  nodes,
  edges,
}) as Data);

const onDrop = (event:any) => {

            const selectedItem = event.dataTransfer.getData("selectedItem");
            if (network && container.value) {

              const canvasCoords = network.DOMtoCanvas({x: event.layerX, y: event.layerY });
              const newNodeId = nodes.length + 1;


              const newNode = {
                id: newNodeId, // 간단한 방법으로 고유 ID 생성
                label: selectedItem,
                shape: 'box',
                x: canvasCoords.x,
                y: canvasCoords.y
              };
            
            nodes.add(newNode);
            }            
}

const exportData = () => {
  // clearOutputArea();
  let nodes = network && objectToArray(network.getPositions());
  nodes && nodes.forEach(addConnections);

  var labels = {};
  nodes && nodes.forEach(function (node) {
    labels[node.id] = network.body.nodes[node.id].options.label;
  });

  // Add labels to nodes
  nodes.forEach(function (node) {
    node.label = labels[node.id];
  });
 
    // const exportedNodes = nodes.map(nodePosition => {
    //   const connectedNodes = network && network.getConnectedNodes(nodePosition.id);
    //     return {
    //       id: nodePosition.id,
    //       label: nodePosition.label,
    //       x: nodePosition.x,
    //       y: nodePosition.y,
    //       connections: connectedNodes,
    //     };
    // });

  // pretty print node data
  exportValue = JSON.stringify(nodes, undefined, 2);
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

function objectToArray(obj: { [x: string]: any; }) {
  return Object.keys(obj).map(function (key) {
    obj[key].id = key;
    obj[key].id = key
    return obj[key];
  });
}

function addConnections(elem: any) {
  elem.connections = network && network.getConnectedNodes(elem.id);
}

const importData = () => {
  fileInput.value.click();
}

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        const data = {
          nodes: getNodeData(importedData),
          edges: getEdgeData(importedData),
        };
        // nodes.add(getNodeData(importedData));
        network = new Network(container.value, data, options);
    
      } catch (error) {
        console.error('Error parsing JSON file:', error);
      }
    };
    reader.readAsText(file);
  }
}

function getNodeData(data: any[]) {
  var networkNodes: { id: any; label: any; x: any; y: any; }[] = [];
    console.log("1 getNode", data)
  data.forEach(function (elem: { id: any; x: any; y: any; label: string}, _index: any, _array: any) {
    networkNodes.push({
      id: elem.id,
      label: elem.label,
      x: elem.x,
      y: elem.y,
    });
  });
    console.log("getNodeData", networkNodes)
    return new DataSet(networkNodes);
}

function getEdgeData(data: any[]) {
  var networkEdges: { from: any; to: any; }[] = [];
  data.forEach(function (node: { connections: any[]; id: any; }) {
    // add the connection
    node.connections.forEach(function (connId: any, _cIndex: any, _conns: any) { //node의 연결된 번호를 순회 
      networkEdges.push({ from: node.id, to: connId }); //현재 node id와 연결된 번호를 push
      let cNode = getNodeById(data, connId);
      var elementConnections = cNode.connections;
      // remove the connection from the other node to prevent duplicate connections
      var duplicateIndex = elementConnections.findIndex(function (connection: any) {
        return connection == node.id; // double equals since id can be numeric or string
      });
      if (duplicateIndex != -1) {
        elementConnections.splice(duplicateIndex, 1);
      }
    });
  });
  console.log("in   networkEges", networkEdges, graphData)
  return new DataSet(networkEdges);
}

function getNodeById(data: string | any[], id: string) {
  for (var n = 0; n < data.length; n++) {
    if (data[n].id == id) {
      // double equals since id can be numeric or string
      return data[n];
    }
  }
  throw "Can not find id '" + id + "' in data";
}



          

onMounted(() => {
  if (container.value) {
    network = new Network(container.value, graphData.value, options);
  }
  if (network) {
    network && network.on('click', (event: any) => {
      const nodeId = network && network.getNodeAt(event.pointer.DOM);
      const edgedId = network && network.getEdgeAt(event.pointer.DOM);
      const nodeInfo = nodes.get(nodeId);

      console.log(nodeId, edgedId, "in click", nodeInfo)
      dataStore.setNodeDataInfo(nodeInfo);
      console.log(dataStore.nodeDataInfo)
    })
  }
});

</script>