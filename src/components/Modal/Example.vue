<template>
  <div class="text-center">
    <!-- <v-btn
      color="primary"
      @click="dialog = true"
    >
      Open Dialog
    </v-btn> -->

    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card>
        <v-card-text>
          {{id, name}}
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="closeModal">Close Dialog</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import { useCommonStore } from "../../stores/nodeModal"

const modalStore = useCommonStore();
const { isModal, name, id } = toRefs(modalStore.nodeModal);

let dialog = isModal;

console.log("expapmlelelelele",  isModal, name, id)

const closeModal = () => {
  modalStore.setNodeModal(false)
};

</script>