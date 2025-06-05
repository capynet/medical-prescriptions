<script setup lang="ts">
import {useCentralStore} from '@/stores/centralStore';
import {ElMessage} from 'element-plus'
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
import {ref, watch} from 'vue';
import {useMagicKeys} from '@vueuse/core'
import type Prescription from "@/models/Prescription"
import usePrescriptionDB from '@/composables/usePrescriptionDB';
import useGenPDF from '@/composables/useGenPDF';
import useSupabase from "@/composables/useSupabase";

const {supabase} = useSupabase()
const {getById, insert} = usePrescriptionDB()
const {genPDF} = useGenPDF()
const store = useCentralStore()
const keys = useMagicKeys()
const keyShortcutSave = keys['Ctrl+S']
const saving = ref(false)

const onSaveAndDownload = async () => {
  const prescription = await save()

  if (prescription !== false) {
    genPDF(prescription as Prescription)
  }
}

const onSave = () => {
  save()
}

const save = async () => {
  if (store.selectedPatient === undefined) {
    ElMessage({message: 'No se ha seleccionado el paciente.', type: 'error'})
    return false
  }

  if (store.selectedMedicines.length === 0) {
    ElMessage({message: 'Añade por lo menos un medicamento.', type: 'error'})
    return false
  }

  ElMessage({message: 'Guardando...', type: 'warning'})

  saving.value = true

  const created = new Date().toISOString().toLocaleString()

  const newPrescription = await insert({
    created_at: created,
    author: 5,
    diagnosis: store.selectedDiagnosis,
    patient: store.selectedPatient.id,
    medicines: store.selectedMedicines
  })

  store.selectedMedicines = []
  store.selectedPatient = undefined
  store.autocompleteSelectedItemText = ''
  store.selectedDiagnosis = ''

  ElMessage({message: 'Receta guardada.', type: 'success'})

  saving.value = false

  // Let's return a full prescription for allowing other tools to react like pdf generation.
  return newPrescription
}

watch(keyShortcutSave, (v) => {
  if (v)
    save()
})
</script>

<template>

  <h1>Crear receta</h1>

  <div class="mb-10">

    <Suspense>
      <PatientsComponent/>

      <template #fallback>
        Loading...
      </template>
    </Suspense>


  </div>

  <div class="mb-10">

    <el-card class="mb-10">

      <div class="mb-4">
        <MedicineForm/>
      </div>

      <MedicinesList/>
    </el-card>

  </div>

  <div class="flex justify-end">
    <el-button
      type="success"
      size="large"
      @click="onSaveAndDownload"
      :disabled="saving"
    >
      Guardar y descargar
    </el-button>

    <el-button
      type="success"
      size="large"
      @click="onSave"
    >
      Guardar
    </el-button>
  </div>

</template>