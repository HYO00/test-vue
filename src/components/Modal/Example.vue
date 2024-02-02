<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="auto"
    >
    <v-card>
        <v-card-title style="background-color: orange;">
          <span class="text-h5">Node Name : {{ name }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Query*"
                  required
                  v-model="query"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="description"
                  label="Description*"
                  required
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-select
                  v-model="select"
                  :items="['0-17', '18-29', '30-54', '54+']"
                  label="Select"
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-autocomplete
                  v-model="interests"
                  :items="['Skiing', 'Ice hockey', 'Soccer', 'Basketball', 'Hockey', 'Reading', 'Writing', 'Coding', 'Basejump']"
                  label="Interests"
                  multiple
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="closeModal"
          >
            Close
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="saveModal"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { toRefs, ref, computed } from 'vue';
import { useCommonStore } from "../../stores/nodeModal"

const modalStore = useCommonStore();
const { isModal, name, id } = toRefs(modalStore.nodeModal);
// const { query, description, select, interests} = toRefs(modalStore.nodeItemInfo);
import { useDataStore } from '../../stores/nodeData';

const dataStore = useDataStore();
const { nodeDataInfo : textData} = toRefs(dataStore);

const computedData = computed(() =>{
  console.log(textData.value)
  return JSON.stringify(textData.value||{})
})

// console.log(computedData)

console.log(textData.value, "textData", computedData)
let dialog = isModal;

let query = ref("") || textData.value.info.query;
let description = ref("") || textData.value.info.description;
let select = ref("") || textData.value.info.select;
let interests = ref<string[]>([])  || textData.value.info.interests;
//let info: any

const closeModal = () => {
  modalStore.setNodeModal({
    flag: false,
    id: null,
    name: null
  })
  query = ref("");
  description = ref("");
  select = ref("");
  interests = ref<string[]>([]);
};

const saveModal = () => {
  let info = {
    query: query.value,
    description: description.value,
    select: select.value,
    interests: interests.value
  }

  textData.value.info = info;
  closeModal()
};

</script>