import { Nodes, Edges, Layouts } from "v-network-graph";

const nodes: Nodes = {
  node1: { name: "Node 1" },
  node2: { name: "Node 2" },
  node3: { name: "Node 3" },
  node4: { name: "Node 4" },
};

const edges: Edges = {
  edge1: { source: "node1", target: "node2" },
};

const layouts: Layouts = {
  nodes: {
    node1: { x: 0, y: 0 },
    node2: { x: 50, y: 50 },
    node3: { x: 100, y: 0 },
    node4: { x: 150, y: 50 },
  },
};

export default {
  nodes,
  edges,
  layouts,
};

export function nodeTree(nodeTree: any) {
throw new Error("Function not implemented.");
}

export function edges(edges: any) {
throw new Error("Function not implemented.");
}

export function layouts<T>(layouts: any) {
throw new Error("Function not implemented.");
}
