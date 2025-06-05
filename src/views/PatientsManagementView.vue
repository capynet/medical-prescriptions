<script lang="ts" setup>
import PatientsTable from '@/components/patients/PatientsTable.vue';
import PatientsAddForm from "@/components/patients/PatientsAddForm.vue";
import {ref} from "vue";

const isEditing = ref(false)
const patientTableRef = ref(null)

const addPatient = () => {
  isEditing.value = true
}

const onSavedEditing = () => {
  isEditing.value = false
  // @ts-ignore
  patientTableRef.value!.doSearch()
}

</script>

<template>
  <h1>

    <span class="mr-2">Gestión de pacientes </span>

    <el-button
      type="primary"
      @click.prevent="addPatient"
    >
      Añadir paciente
    </el-button>
  </h1>

  <PatientsTable ref="patientTableRef"/>

  <el-dialog
    v-model="isEditing"
    title="Añadir paciente"
  >
    <PatientsAddForm @saved="onSavedEditing"/>

    <template #footer>
      <span class="dialog-footer W-">
        <el-button @click="isEditing = false">Cancelar</el-button>
      </span>
    </template>
  </el-dialog>

</template>
  
