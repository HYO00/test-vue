<template>
    <div id="mynetwork"
        ref="network"
        @drop.prevent="onDrop($event, idx)"
         @dragenter.prevent
         @dragover.prevent
    ></div>
    <v-btn @click="addNode"></v-btn>

</template>
  
  <script>
   import  * as vis from 'vis-network'
  export default {
    name: "EditCanvasArea",
    methods: {
        onDrop(event, idx){
            console.log(event, idx, "ondrop") 
            const selectedItem = event.dataTransfer.getData("selectedItem");
            // Perform actions with the dropped item on the canvas
            console.log("Dropped item:", selectedItem);
            const newNode = {
                id: new Date().getTime(), // 간단한 방법으로 고유 ID 생성
                label: selectedItem,
                shape: 'box',
                x: event.screenX,  // 드롭된 위치를 기준으로 노드의 초기 위치 설정
                y: event.screenY
            };
          //  console.log(this, this.nodes,   this.network , this.network.canvas)
            this.nodes.push(newNode)

          
        },
        addNode(){
            // try {
            //     // 새로운 노드 추가
            //     const newNode = { id: this.nodes.length + 1, label: `Node ${this.nodes.length + 1}` };
            //     this.nodes.push(newNode);
            //     this.network.setData({ nodes: this.nodes, edges: this.edges });
            // } catch (error) {
            //     console.error('Error in addNode:', error);
            // }
            this.network.on('click',function(params){
    if((params.nodes.length == 0) && (params.edges.length == 0)) {
        var updatedIds = this.nodes.add([{
            label:'new',
            x:params.pointer.canvas.x,
            y:params.pointer.canvas.y
        }]);
        network.selectNodes([updatedIds[0]]);
        network.editNode();
    }
})
        }
    }
    ,
    data() {
      return {
        network: null,
        data: null,
        nodes: null,
        edges: null,
        container: null, 
        options: {
            width: '100%', // 캔버스의 가로 크기
            height: '100%', // 캔버스의 세로 크기
            nodes: {
                shape: "box",
                margin: 10,
            },
            physics: false,     
            manipulation: {
                addEdge: function (data, callback) {
                    if (data.from == data.to) {
                    var r = confirm("Do you want to connect the node to itself?");
                    if (r == true) {
                        callback(data);
                    }
                    } else {
                    callback(data);
                    }
            },
    }
        },
        
       
      };
    },
    mounted() {
  
      this.nodes = [
        {
          id: 1,
          label: "Node 1",
          widthConstraint: { minimum: 120 },
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

      ]
  
      this.edges =[
        { from: 1, to: 3 },
        { from: 1, to: 2 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },

      ];
  
      this.container = document.getElementById("mynetwork");
  
      this.data = {
        nodes: this.nodes, 
        edges: this.edges,
      };
      console.log( this.container, this.data, this.options, "eeeenett")
      this.network = new vis.Network(this.container, this.data, this.options);


    },
  };
  </script>
  
  
  <style scoped>
  #mynetwork {
    width: 600px;
    height: 400px;
    border: 1px solid lightgray;
  }
  </style>
  