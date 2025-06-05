<script lang="ts" setup>
import {Delete, Edit} from '@element-plus/icons-vue'
import {ElMessage} from 'element-plus'
import type Medicine from '@/models/Medicine';
import useMedicineDB from '@/composables/useMedicineDB';
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
import {reactive, type Ref, ref} from "vue";
import {useDebounceFn} from '@vueuse/core'
import VademecumAddForm from "@/components/vademecum/VademecumAddForm.vue";


const isEditing = ref(false)
const {del, textSearch} = useMedicineDB()
const searchInput = ref()
const results: Ref<Medicine[]> = ref([])
const currentSearchString = ref('')
let editedMedicine = reactive<Record<string, any>>({
  id: null,
  activeSubstance: '',
  tradeName: ''
})

const editMedicine = (medicine: Medicine) => {
  editedMedicine.id = medicine.id
  editedMedicine.activeSubstance = medicine.activeSubstance
  editedMedicine.tradeName = medicine.tradeName
  isEditing.value = true
}

const doSearch = useDebounceFn(async () => {
  results.value = await textSearch(currentSearchString.value)
}, 300)


const deleteMedicine = async (medicine: Medicine) => {
  await del(medicine)
  ElMessage({message: 'Medicamento eliminado.', type: 'success'})
}

const confirmDeletion = (item: Medicine) => {
  const msg = "¿Eliminar medicina?"

  if (confirm(msg)) {
    deleteMedicine(item)
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
    title="Edición de medicamento"
  >
    <VademecumAddForm :data-form="editedMedicine" @saved="onSavedEditing"/>

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
      <p class="text-xs m-0 text-slate-600">Nombre del medicamento / Principio activo</p>
    </div>

    <div v-if="results.length">Resultados: {{ results.length }}</div>
  </div>

  <h3 class="border border-gray-500 border-solid p-4 text-center" v-if="!results.length">Escribe el nombre de algun <span class="text-blue-600">medicamento</span> o <span class="text-blue-600">principio activo</span> para ver resultados.</h3>

  <el-table
    v-if="results.length"
    :data="results"
    :border="true"
    style="width: 100%"
  >

    <el-table-column
      label="Nombre"
      prop="tradeName"
    />

    <el-table-column
      label="Principio activo"
      prop="activeSubstance"
    />


    <el-table-column label="Acciones">

      <template #default="scope">

        <el-button
          type="primary"
          :icon="Edit"
          @click.prevent="editMedicine(scope.row)"
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
