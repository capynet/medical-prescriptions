<script lang="ts" setup>
import {ref} from "vue";
import VademecumAddForm from "@/components/vademecum/VademecumAddForm.vue";
import VademecumTable from "@/components/vademecum/VademecumTable.vue";

const isEditing = ref(false)
const vademecumTableRef = ref(null)

const addMedicine = () => {
  isEditing.value = true
}

const onSavedEditing = () => {
  isEditing.value = false
  // @ts-ignore
  vademecumTableRef.value!.doSearch()
}

</script>

<template>
  <h1>

    <span class="mr-2">Vademecum</span>

    <el-button
      type="primary"
      @click.prevent="addMedicine"
    >
      Añadir medicamento
    </el-button>
  </h1>

  <VademecumTable ref="vademecumTableRef"/>

  <el-dialog
    v-model="isEditing"
    title="Añadir medicamento"
  >
    <VademecumAddForm @saved="onSavedEditing"/>

    <template #footer>
      <span class="dialog-footer W-">
        <el-button @click="isEditing = false">Cancelar</el-button>
      </span>
    </template>
  </el-dialog>

</template>