<template>
  <div id="mynetwork1"></div>
</template>

<script>
 import  * as vis from 'vis-network'
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      data: null,
      nodes: null,
      edges: null,
      container: null, 
      options: {},
    };
  },
  mounted() {

console.log(vis)

    this.nodes = [
      {
        id: 1,
        label: "Node 1",
        color: {
          background: "#A2CAB8",
          border: "#0BEC8A",
          hover: {
            border: "#FFEBD2",
            background: "#0BEC8A",
          },
          highlight: {
            border: "#F009F3",
            background: "#CAA2CA",
          },
        },
      },
      { id: 2, label: "Node 2" },
      { id: 3, label: "Node 3" },
      { id: 4, label: "Node 4" },
      { id: 5, label: "Node 5" },
    ]

    this.edges =[
      { from: 1, to: 3 },
      { from: 1, to: 2 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 3 },
    ];

    this.container = document.getElementById("mynetwork1");

    this.data = {
      nodes: this.nodes, 
      edges: this.edges,
    };

    // 初始化关系图
    var network = new vis.Network(this.container, this.data, this.options);
    console.log(network, "eeeenett")
  },
};
</script>


<style scoped>
#mynetwork1 {
  width: 600px;
  height: 400px;
  border: 1px solid lightgray;
}
</style>
