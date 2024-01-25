<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import axios from 'axios';

const { isPending, isError, data, error } = useQuery({
  queryKey: ['test'],
  queryFn:  async () => {
    const response = await axios.get(`/api/test/`);
    console.log(response, "here list" )
    return response.data;
  }
})

console.log(isPending, isError,data,  data.value, data.value?.data, error,  "in useQuery")

//const itemArr =  data.value?.data;//["Mapping", "Custom Query", "Select Query", "Insert Query", "Update Query", "Delete Query", "Text", "Json"];

const startDrag = (event: any, item: string) => {
  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("selectedItem", JSON.stringify(item));
};
</script>

<template>
  <div>
    <span v-if="isPending">Loading...</span>
    <span v-else-if="isError">Error: {{ error?.message }}</span>
    <ul v-else>
      <li  v-for="(item) in data" :key="item.id" class="rounded-box"
          @dragstart="startDrag($event, item)"
          draggable="true"
      >
        {{ item.name }}
      </li>
    </ul>
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