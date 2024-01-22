<template>
  <div>
    <div id="mynetwork" ref="container"  
        @drop.prevent="onDrop($event, idx)"
         @dragenter.prevent
         @dragover.prevent></div>
    <button @click="addNode">Add Node</button>
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
import { Network } from 'vis-network';
import type { Data, Node, Edge, Options } from 'vis-network';


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
  manipulation: {
    enabled: true,
  },
  physics: {
    enabled: false,
  },
  autoResize: false,
});

const container = ref<HTMLElement | null>(null);
let network: Network | null = null;

const graphData = computed(() => ({
  nodes,
  edges,
}) as Data);

const addNode = () => {
  const newNodeId = nodes.length + 1;
  const newNode: Node = { id: newNodeId, label: `Node ${newNodeId}` };
  nodes.push(newNode);
  console.log(newNode, "add", network)
  if (network) {
    console.log(graphData.value)
    network.setData(graphData.value);
  }
};

const onDrop = (event:any, idx:number) => {
            console.log(event, idx, "ondrop") 
            const selectedItem = event.dataTransfer.getData("selectedItem");
            // Perform actions with the dropped item on the canvas
            console.log("Dropped item:", selectedItem);
            const newNode = {
                id: new Date().getTime(), // 간단한 방법으로 고유 ID 생성
                label: selectedItem,
                shape: 'box',
                x: event.x,  // 드롭된 위치를 기준으로 노드의 초기 위치 설정
                y: event.y
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