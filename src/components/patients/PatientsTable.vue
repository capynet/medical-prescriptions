<script lang="ts" setup>
import {Delete, Edit} from '@element-plus/icons-vue'
import usePatientDB from '@/composables/usePatientDB'
import {ElMessage} from 'element-plus'
import type Patient from '@/models/Patient';
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
import {useDebounceFn} from "@vueuse/core";
import {reactive, type Ref, ref} from "vue";
import PatientsAddForm from "@/components/patients/PatientsAddForm.vue";
import type AffiliationProvider from "@/models/AffiliationProvider";

const isEditing = ref(false)
const searchInput = ref()
const results: Ref<Patient[]> = ref([])
const currentSearchString = ref('')
const {del, textSearch} = usePatientDB()
let editedPatient = null

const editPatient = (patient: Patient) => {
  editedPatient = reactive({
    id: patient.id,
    fullName: patient.fullName,
    userId: patient.userId,
    affiliationId: patient.affiliationId,
    affiliationProvider: (patient.affiliationProvider as AffiliationProvider).id,
    affiliationPlan: patient.affiliationPlan,
  })

  isEditing.value = true
}

const doSearch = useDebounceFn(async () => {
  results.value = await textSearch(currentSearchString.value)
}, 300)

const deletePatient = async (patient: Patient) => {
  del(patient)
  ElMessage({message: 'Paciente eliminado.', type: 'success'})
}

const confirmDeletion = (item: Patient) => {
  const msg = "¿Eliminar paciente?"

  if (confirm(msg)) {
    deletePatient(item)
    results.value = []
    doSearch()
  }
}


const onSavedEditing = () => {
  isEditing.value = false
  results.value = []
  doSearch()
}

defineExpose({doSearch})
</script>


<template>


  <el-dialog
    v-model="isEditing"
    title="Edición de paciente"
  >
    <PatientsAddForm :data-form="editedPatient" @saved="onSavedEditing"/>

    <template #footer>
      <span class="dialog-footer W-">
        <el-button @click="isEditing = false">Cancelar</el-button>
      </span>
    </template>
  </el-dialog>

  <div class="mb-6">
    <div class="mb-3">
      <h4 class="m-0">Filtrar</h4>
      <input ref="searchInput" type="text" @keyup="doSearch" class="p-2" v-model="currentSearchString">
      <p class="text-xs m-0 text-slate-600">Nombre del paciente / DNI / Nº de afiliado</p>
    </div>

    <div v-if="results.length">Resultados: {{ results.length }}</div>
  </div>

  <h3 class="border border-gray-500 border-solid p-4 text-center" v-if="!results.length">Escribe el <span class="text-blue-600">nombre del paciente</span>, <span class="text-blue-600">DNI</span> o <span class="text-blue-600">Nº de afiliado</span> para ver resultados.</h3>

  <el-table
    v-if="results.length"
    :data="results"
    :border="true"
    style="width: 100%"
  >

    <el-table-column
      label="Nombre"
      prop="fullName"
    />

    <el-table-column
      label="DNI"
      prop="userId"
    />

    <el-table-column
      label="Obra social"
      prop="affiliationProvider.name"
    />

    <el-table-column
      label="Nº afiliado"
      prop="affiliationId"
    />

    <el-table-column label="Acciones">

      <template #default="scope">

        <el-button
          type="primary"
          :icon="Edit"
          @click.prevent="editPatient(scope.row)"
        >
          Editar
        </el-button>

        <el-button
          type="danger"
          :icon="Delete"
          @click.prevent="confirmDeletion(scope.row)"
        >
          Eliminar
        </el-button>

      </template>
    </el-table-column>

  </el-table>
</template>
