<script setup lang="ts">
    const itemArr = ["Mapping", "Custom Query", "Select Query", "Insert Query", "Update Query", "Delete Query", "Text", "Json"]
</script>

<template>
    <div >
        <li v-for="(item, idx) in itemArr" :key="idx" class="rounded-box" 
            @dragstart="startDrag($event, item, idx)"
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
}
</style>