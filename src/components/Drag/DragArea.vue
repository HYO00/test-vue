<script setup lang="ts">
// import draggable from 'vuedraggable';

const itemArr = ["Mapping", "Custom Query", "Select Query", "Insert Query", "Update Query", "Delete Query", "Text", "Json"];

const startDrag = (event: any, item: string) => {
    console.log("start", event, item)
  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("selectedItem", item);
};
</script>

<template>
  <div>

      <li v-for="(item, idx) in itemArr" :key="idx" class="rounded-box"
          @dragstart="startDrag($event, item)"
          draggable="true"
      >
        {{ item }}
      </li>

  </div>
</template>


<style>
    .rounded-box {
  border: 1px solid #ccc;
  border-radius: 10px; /* 둥근 모서리 스타일 적용 */
  padding: 10px;
  margin: 5px;
  cursor: grab; /* 드래그 커서 설정 */
  list-style: none;
}
</style>