<script lang="ts">
import 'vis-network/styles/vis-network.css';
import { Network } from 'vis-network';
import vis from 'vis-network/declarations/index-legacy-bundle';

export default {
  data() {
    return {
      network: null,
    };
  },
  mounted() {
    // 네트워크 데이터 설정
    const nodes = new vis.DataSet([
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
    ]);

    const edges = new vis.DataSet([
      { from: 1, to: 2 },
      { from: 1, to: 3 },
    ]);

    const data = { nodes, edges };

    // 네트워크 생성
    const container = document.getElementById("network")!;
    const network = new Network(container, data);
  },
};
</script>


<template>
    <div>
      <div id="network" style="height: 400px;"></div>
    </div>
  </template>