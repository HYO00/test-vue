import { Nodes, Edges, Layouts, defineConfigs } from "v-network-graph"

const nodes: Nodes = {
  node1: { name: "N1" },
  node2: { name: "N2" },
  node3: { name: "N3" },
}

const edges: Edges = {
  edge1: { source: "node1", target: "node2" },
  edge2: { source: "node2", target: "node3" },
}

const layouts: Layouts = {
  nodes: {
    node1: { x: 50, y: 0 },
    node2: { x: 0, y: 75 },
    node3: { x: 100, y: 75 },
  },
}

const configs = defineConfigs({
  node: {
    selectable: 2, // up to 2 nodes
    normal: {
      type: "rect",
      radius: 16,
      // for type is "rect" -->
      width: 62,
      height: 32,
      borderRadius: 4,
      // <-- for type is "rect"
      strokeWidth: 0,
      strokeColor: "#000000",
      strokeDasharray: "0",
      color: "#4466cc",
    },
    label: {
      visible: true,
      fontFamily: undefined,
      fontSize: 13,
      lineHeight: 1.1,
      color: "#ffffff",
      margin: 4,
      direction: "south",
    }
  },
  edge: {
    selectable: true,
    normal: {
      width: 3,
    },
  },
})

export default {
  nodes,
  edges,
  layouts,
  configs,
} 