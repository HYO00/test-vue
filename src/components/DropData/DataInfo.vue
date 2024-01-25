<script setup lang="ts">
import { toRefs, ref, computed } from 'vue';
import { useDataStore } from '../../stores/nodeData';
import { useTableStore } from '../../stores/table';

const dataStore = useDataStore();
const tableStore = useTableStore();

const { nodeDataInfo : textData} = toRefs(dataStore);
const { sourceData, targetData } = toRefs(tableStore);

const inputData = ref('');

// Create a reactive reference for textData
// const textData = ref(nodeDataInfo.value);

const computedData = computed(() =>{
  return JSON.stringify( textData.value ||{})
});

// Subscribe to changes in the store and update textData
// dataStore.$subscribe((mutation, state) => {
//   textData.value = 
// });

// Ensure that the textData is updated when the component is mounted
// onMounted(() => {
//   textData.value = textData.value;
// });

const addNodeData = () => {
  const inputValue = inputData.value;
  console.log('Input Value:', inputValue, textData.value);
  textData.value.info = inputValue;
};
</script>

<template>
  <v-container>
    <v-textarea
      bg-color="light-blue"
      color="black"
      label="Data Info"
      :model-value="computedData"
    >
    </v-textarea>
    <v-textarea
      v-model="inputData"
      bg-color="grey-lighten-2"
      color="cyan"
      label="Input"
    >
    </v-textarea>
    <v-btn variant="outlined" style="margin-bottom: 15px;" @click="addNodeData">add data</v-btn>
    <v-textarea
      v-model="sourceData"
      bg-color="grey-lighten-2"
      color="cyan"
      label="Source"
    >
    </v-textarea>
    <v-textarea
      v-model="targetData"
      bg-color="grey-lighten-2"
      color="cyan"
      label="Target"
    >
    </v-textarea>
  </v-container>
</template>

