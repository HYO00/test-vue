import { Ref, computed, ref, watch } from "vue";
import * as vNG from "v-network-graph";

type LinkingState =
  | {
      linking: false;
    }
  | {
      linking: true;
      from: string;
      to?: string;
      pos: { x: number; y: number };
    };

export function useLinkMode(
  graph: Ref<vNG.Instance | undefined>,
  isLinkMode: Ref<boolean>,
  edges: vNG.Edges,
  layouts: vNG.Layouts,
  generateEdgeId: (source: string, target: string) => string
) {
  const state = ref<LinkingState>({
    linking: false,
  });

  function start(nodeId: string, event: PointerEvent) {
    if (!graph.value || !isLinkMode.value) return;
    if (state.value.linking) return;
    event.stopPropagation();
    document.addEventListener("pointerup", cancel);
    document.addEventListener("pointermove", move);

    // translate coordinates: DOM -> SVG
    const point = { x: event.offsetX, y: event.offsetY };
    const pos = graph.value.translateFromDomToSvgCoordinates(point);
    state.value = {
      linking: true,
      from: nodeId,
      pos,
    };
  }

  function cancel(event?: PointerEvent) {
    if (!state.value.linking) return;
    event?.stopPropagation();
    document.removeEventListener("pointerup", cancel);
    document.removeEventListener("pointermove", move);
    state.value = { linking: false };
  }

  function move(event: PointerEvent) {
    if (!graph.value) return;
    if (!state.value.linking) return;
    if (state.value.to) return;
    console.log("move");
    const element = graph.value.$el as HTMLElement;
    const rect = element.getBoundingClientRect();
    // translate coordinates: DOM -> SVG
    const point = { x: event.pageX - rect.left, y: event.pageY - rect.top };
    state.value = {
      ...state.value,
      pos: graph.value.translateFromDomToSvgCoordinates(point),
    };
  }

  function enterNode(nodeId: string) {
    if (!state.value.linking) return;
    state.value = {
      ...state.value,
      to: nodeId,
    };
  }

  function leaveNode(nodeId: string) {
    if (!state.value.linking) return;
    if (state.value.to !== nodeId) return;
    state.value = {
      ...state.value,
      to: undefined,
    };
  }

  function end(nodeId: string, event: PointerEvent) {
    if (!state.value.linking) return;
    event.stopPropagation();
    document.removeEventListener("pointerup", cancel);
    document.removeEventListener("pointermove", move);

    // Add edge
    if (state.value.from !== nodeId) {
      const source = state.value.from;
      const target = nodeId;
      edges[generateEdgeId(source, target)] = { source, target };
    }
    state.value = { linking: false };
  }

  const temporaryLinkLinePos = computed(() => {
    if (state.value.linking) {
      const n1 = layouts.nodes[state.value.from] ?? { x: 0, y: 0 };
      if (state.value.to) {
        const n2 = layouts.nodes[state.value.to] ?? { x: 0, y: 0 };
        return {
          x1: n1.x,
          y1: n1.y,
          x2: n2.x,
          y2: n2.y,
        };
      } else {
        return {
          x1: n1.x,
          y1: n1.y,
          x2: state.value.pos.x,
          y2: state.value.pos.y,
        };
      }
    } else {
      return null;
    }
  });

  watch(isLinkMode, (linkMode) => {
    if (!linkMode && state.value.linking) {
      cancel();
    }
  });

  function nodeHandlers(nodeId: string) {
    return {
      onpointerdown: ($event: PointerEvent) => start(nodeId, $event),
      onpointerup: ($event: PointerEvent) => end(nodeId, $event),
      onpointerenter: () => enterNode(nodeId),
      onpointerleave: () => leaveNode(nodeId),
    };
  }

  return {
    nodeHandlers,
    linkModeState: state,
    temporaryLinkLinePos,
  };
}
