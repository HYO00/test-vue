<script setup lang="ts">
import { Ref, computed, reactive, ref, watch } from "vue";
import { VShape } from "v-network-graph";
import * as vNG from "v-network-graph";
import data from "./data";
import { useLinkMode } from "./linkMode";

// ref="graph"
const graph = ref<vNG.Instance>();


const nodes = reactive(data.nodes);
const edges = reactive(data.edges);
const layouts = reactive(data.layouts);
const configs = vNG.defineConfigs({
  edge: {
    normal: {
      color: "#4466cc",
    },
  },
});

const customLayers = {
  linking: "edges", // The "linking" layer is above the "edges" layer
};

const isLinkMode = ref(true);
const { nodeHandlers, linkModeState, temporaryLinkLinePos } = useLinkMode(
  graph,
  isLinkMode,
  edges,
  layouts,
  generateEdgeIdFuncFactory(edges)
);

function toggleLinkMode() {
  isLinkMode.value = !isLinkMode.value;
}

function generateEdgeIdFuncFactory(edges: vNG.Edges) {
  return (source: string, target: string) => {
    const base = `${source}=>${target}`;
    let index = 0;
    let edgeId = `${base}.${index}`;
    while (edgeId in edges) {
      index++;
      edgeId = `${base}.${index}`;
    }
    return edgeId;
  };
}
</script>

<template>
  <div class="control">
    Making Link Mode: [{{ isLinkMode ? "ON" : "OFF" }}]
    <button @click="toggleLinkMode" class="controlBtn">
      Turn {{ isLinkMode ? "OFF" : "ON" }}
    </button>
  </div>
  <v-network-graph
    ref="graph"
    class="network-graph"
    :nodes="nodes"
    :edges="edges"
    :layouts="layouts"
    :configs="configs"
    :layers="customLayers"
    :class="{ linkMode: isLinkMode, linking: linkModeState.linking }"
  >
    <!-- "linking" layer -->
    <template #linking="{ scale }">
      <!-- Link line in linking -->
      <line
        v-if="temporaryLinkLinePos"
        v-bind="temporaryLinkLinePos"
        :stroke="
          linkModeState.linking && linkModeState.to ? '#4466cc' : 'hotpink'
        "
        :stroke-width="4 * scale"
      />
    </template>
    <template #override-node="slotProps">
      <!-- v-shape: Internal component that draws a node shape -->
      <v-shape v-bind="{ ...slotProps, ...nodeHandlers(slotProps.nodeId) }" />
    </template>
  </v-network-graph>
</template>

<style scoped>
.linkMode::v-deep(.v-ng-node *),
.linkMode.linking {
  cursor: crosshair !important;
}

.controlBtn {
  background-color: brown;
}
</style>
