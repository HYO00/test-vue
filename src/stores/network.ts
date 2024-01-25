import { defineStore } from 'pinia';
import { Nodes, Edges, Layouts } from "v-network-graph"
import * as vNG from "v-network-graph"
import { ref, computed } from 'vue';

export const useNetworkStore = defineStore('networkStore', () => {
    // 반응형 상태 정의
    const nodes = ref({} as Nodes);
    const edges = ref({} as Edges);
    const selectedNodes = ref([] as string[]);
    const selectedEdges = ref([] as string[]);
    const layouts = ref({ nodes: {} } as Layouts);
    
    
    // 아래 reactive 형태로도 가능 만약에 사용하게 된다면 그냥 nodes가 아니고 state.nodes로 사용해야함
    
    // const state = reactive({
    //     nodes: {} as Nodes,
    //     edges: {} as Edges,
    //     selectedNodes: [] as string[],
    //     selectedEdges: [] as string[],
    //     layouts: { nodes: {} } as Layouts
    // });

    // 계산된 속성 정의
    const nodeCount = computed(() => Object.keys(nodes.value).length + 1);
    const edgeCount = computed(() => Object.keys(edges.value).length + 1);

    // 메소드 정의
    const addNode = () => {
        const nodeId = `node${nodeCount.value}`;
        const name = `N${nodeCount.value}`;
        nodes.value[nodeId] = { name };
    };

    const removeNode = () => {
        for (const selectedNode of selectedNodes.value) {
            delete nodes.value[selectedNode];
        }
    };

    const addEdge = () => {
        if (selectedNodes.value.length !== 2) {
            return;
        }
        const [source, target] = selectedNodes.value;
        const edgeId = `edge${edgeCount.value}`;
        edges.value[edgeId] = { source, target };
    };

    const removeEdge = () => {
        for (const selectedEdge of selectedEdges.value) {
            delete edges.value[selectedEdge];
        }
    };

    const onDrop = (event: DragEvent, graph: vNG.VNetworkGraphInstance | null) => {
        if (!graph) return;
        const point = { x: event.offsetX, y: event.offsetY };
        const svgPoint = graph.translateFromDomToSvgCoordinates(point);
        const selectedItem = event.dataTransfer?.getData("selectedItem");
        const dropItem = selectedItem && JSON.parse(selectedItem);
        const nodeId = dropItem?.id;
        const name = dropItem?.name ?? '';
        layouts.value.nodes[nodeId] = svgPoint;
        nodes.value[nodeId] = { name, nodeId };
    };

    const  exportData = (graph: vNG.VNetworkGraphInstance | null) => {
        debugger;
        if (!graph) return;
        //const text = await graph.value.exportAsSvgText()
        const exportInfo =  {
          nodes: nodes.value,
          edges: edges.value,
          layouts :layouts.value
        };
    
        let exportValue = JSON.stringify(exportInfo, undefined, 2);
    
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
    };

    const importData = (fileInput: HTMLElement | null) => {
        if (fileInput) {
          (fileInput as HTMLInputElement).click();
        }
      }
      
    const handleFileChange = (event:Event) => {
        const input = event.target as HTMLInputElement;
        
        if (input && input.files) {
            const file = input.files[0];

            const reader = new FileReader();
        
            reader.onload = (e:ProgressEvent<FileReader>) => {
            try {
                const importedData = JSON.parse(e.target?.result as string);
    
                // Populate nodes
                for (const nodeId in importedData.nodes) {
                    const { name, info } = importedData.nodes[nodeId];
                    nodes.value[nodeId] = { name, info};
                }
        
                // Populate edges
                for (const edgeId in importedData.edges) {
                    const { source, target } = importedData.edges[edgeId];
                    edges.value[edgeId] = { source, target };
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
      
    

    // setup 스토어 반환
    return { 
        nodes,
        edges, 
        selectedNodes,
        selectedEdges, 
        layouts,
        nodeCount,
        edgeCount,
        addNode,
        removeNode,
        addEdge,
        removeEdge,
        onDrop,
        exportData,
        importData,
        handleFileChange
    };
});



// option store 방식


// import { defineStore } from 'pinia';
// import { Nodes, Edges, Layouts } from "v-network-graph"
// import * as vNG from "v-network-graph"


// export const useNetworkStore = defineStore('networkStore', {
//     state: () => ({
//         nodes:{} as Nodes,
//         edges:{} as Edges,
//         selectedNodes: [] as string[],
//         selectedEdges: [] as string[],
//         layouts: {nodes: {

//         }} as Layouts
//     }),
//     getters:{
//         nodeCount(state) {
//             return Object.keys(state.nodes).length + 1;
//         },
//         edgeCount(state) {
//             return Object.keys(state.edges).length + 1;
//         }
//     },
//     actions: {
//         addNode() {
//             const nodeId = `node${this.nodeCount}`;
//             const name = `N${this.nodeCount}`;
//             this.nodes[nodeId] = {name}
//         },
//         removeNode() {
//             for (const selectedNode of this.selectedNodes) {
//                 delete this.nodes[selectedNode];
//             }
//         },
//         addEdge() {
//             if (this.selectedNodes.length !== 2) {
//                 return
//             }
//             const [source, target] = this.selectedNodes;
//             const edgeId = `edge${this.edgeCount}`;
//             this.edges[edgeId] = {source, target};
//         },
//         removeEdge() {
//             for (const selectedEdge of this.selectedEdges) {
//                 delete this.edges[selectedEdge];
//             }
//         },
//         onDrop (event:DragEvent, graph: vNG.Instance) {
//             if (!graph) return;
//             const point = { x: event.offsetX, y: event.offsetY }
//             // translate coordinates: DOM -> SVG
//             const svgPoint = graph.translateFromDomToSvgCoordinates(point);
//             const selectedItem = event.dataTransfer?.getData("selectedItem");
//             const nodeId = `node${this.nodeCount}`
//             const name = `${selectedItem}`
//             this.layouts.nodes[nodeId] = svgPoint
//             this.nodes[nodeId] = { name };
//         }
//     }
// })