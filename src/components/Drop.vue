<template>
  <div>
    <div id="mynetwork" ref="container"  
        @drop.prevent="onDrop($event, idx)"
         @dragenter.prevent
         @dragover.prevent></div>
    <!-- <v-btn @click="addNode">Add Node</v-btn> -->
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
width: 100%;
height: 620px;
margin: 5px 0;
border: 1px solid #000;
}
</style>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue';
import { IdType, Network } from 'vis-network';
import type { Data, Node, Edge, Options } from 'vis-network';

const fileInput = ref(null);

const nodes = reactive<Node[]>([
  // { id: 1, label: "Node 1" },
  // { id: 2, label: "Node 2" },
  // { id: 3, label: "Node 3" },
  // { id: 4, label: "Node 4" },
]);

const edges = reactive<Edge[]>([
  // { from: 1, to: 3 },
  // { from: 1, to: 2 },
  // { from: 2, to: 4 },
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

const addNode = () => {
  const newNodeId = nodes.length + 1;
  const newNode: Node = { id: newNodeId, label: `Node ${newNodeId}` };
  nodes.push(newNode);
  if (network) {
    network.setData(graphData.value);
  }
};

function addConnections(elem: { connections: IdType[] | { fromId: IdType; toId: IdType; }[] | any[][]; id: any; }, _index: IdType) {
  // need to replace this with a tree of the network, then get child direct children of the element
  elem.connections = network.getConnectedNodes(elem.id);

  // let edgesInfo: { from: any; to: any; }[] = [];

  // elem.connections.forEach((connectedNodeId: any) => {
  //   edgesInfo.push({
  //     from: elem.id,
  //     to: connectedNodeId,
  //     // Add other edge properties as needed
  //   });
  // });

  // elem.connections.push(edgesInfo);
}


const exportData = () => {
  // clearOutputArea();
  const nodePositions = objectToArray(network.getPositions());
   nodes.forEach(addConnections);
   const exportedNodes = nodePositions.map(nodePosition => {
    const connectedNodes = network.getConnectedNodes(nodePosition.id);
    return {
      id: nodePosition.id,
      label: nodePosition.label,
      x: nodePosition.x,
      y: nodePosition.y,
      connections: connectedNodes,
    };
  });
  console.log(exportedNodes, "exportedNodesexportedNodesexportedNodes")


  // pretty print node data
  exportValue = JSON.stringify(nodes, undefined, 2);
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

  // resizeExportArea();
}
function objectToArray(obj: { [x: string]: any; }) {
  return Object.keys(obj).map(function (key) {
    obj[key].id = key;
    obj[key].id = key
    return obj[key];
  });
}

function getNodeData(data: any[]) {
  var networkNodes: { id: any; label: any; x: any; y: any; }[] = [];
    console.log("1 getNode", data)
  data.forEach(function (elem: { id: any; x: any; y: any; }, _index: any, _array: any) {
    networkNodes.push({
      id: elem.id,
      label: elem.label,
      x: elem.x,
      y: elem.y,
    });
  });
    console.log("getNodeData", networkNodes)
  return  networkNodes;//network.body.data.nodes.update(networkNodes);
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
  return networkEdges;// network.body.data.edges.update(networkEdges)
 // return graphData.update(networkEdges);
}
const importData = () => {
  fileInput.value.click();
}
//import 
// const importData = () => {

//   const inputValue = exportValue;
//   const inputData = inputValue! && JSON.parse(inputValue);
//   console.log("in import ", getNodeData(inputData), getEdgeData(inputData))
//   const data = {
//     nodes: getNodeData(inputData),
//     edges: getEdgeData(inputData),
//   };
//   console.log("import data", data)

//   network = new Network(container.value, data, options);

// }
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

        network = new Network(container.value, data, options);
      } catch (error) {
        console.error('Error parsing JSON file:', error);
      }
    };

    reader.readAsText(file);
  }
}


const onDrop = (event:any, idx:number) => {
  console.log(event, idx, "ondrop") 
  //좌표변환
  // const x = event.clientX;
  // const y = event.clientY;
  const pointer = network.DOMtoCanvas({
        x: event.layerX,
        y: event.layerY,
      });

  // const canvasRect = document.getElementById('mynetwork').getBoundingClientRect();
  // const canvasX = x - canvasRect.left;
  // const canvasY = y - canvasRect.top;
  // const canvasCoord = { x: canvasX, y: canvasY };
  // const networkCoord = network.DOMtoCanvas(canvasCoord);

  const selectedItem = event.dataTransfer.getData("selectedItem");
  // Perform actions with the dropped item on the canvas
  console.log("Dropped item:", selectedItem);
  const newNode = {
      id: new Date().getTime(), // 간단한 방법으로 고유 ID 생성
      label: selectedItem,
      shape: 'box',
      x: pointer.x,  // 드롭된 위치를 기준으로 노드의 초기 위치 설정
      y: pointer.y
  };
//  console.log(this, this.nodes,   this.network , this.network.canvas)
  nodes.push(newNode)
  console.log(network, "in drop network")
  network.setData(graphData.value);
}


onMounted(() => {
  if (container.value) {
    console.log(container.value, options)
    network = new Network(container.value, graphData.value, options);
  }
});
</script>