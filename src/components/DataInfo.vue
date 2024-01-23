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
        bg-color="grey-lighten-2"
        color="cyan"
        label="Input"
        ></v-textarea>
        <v-btn bg-color="light-blue">add data</v-btn>
       
        <v-textarea
        bg-color="amber-lighten-4"
        color="orange orange-darken-4"
        label="Label">
        </v-textarea>
  </v-container>
</template>

<script setup lang="ts">
import { toRefs, ref, onMounted, computed } from 'vue';
import { useDataStore } from '../stores/nodeData';

const dataStore = useDataStore();
const { nodeDataInfo : textData} = toRefs(dataStore);

// Create a reactive reference for textData
// const textData = ref(nodeDataInfo.value);

const computedData = computed(() =>{
  return JSON.stringify(textData.value||{})
})
// Subscribe to changes in the store and update textData
// dataStore.$subscribe((mutation, state) => {
//   textData.value = 
// });

// Ensure that the textData is updated when the component is mounted
// onMounted(() => {
//   textData.value = textData.value;
// });



</script>