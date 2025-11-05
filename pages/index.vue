<template>
  <div class="px-4 py-6 space-y-6">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold mb-6">Nueva Receta</h2>

      <!-- Patient Selection -->
      <div class="space-y-4 mb-6">
        <h3 class="text-lg font-semibold">Paciente</h3>
        <AutoComplete
          v-model="selectedPatient"
          :suggestions="patientSuggestions"
          @complete="searchPatients"
          option-label="fullName"
          placeholder="Buscar paciente por nombre, DNI o afiliación"
          class="w-full"
          :pt="{
            input: { class: 'w-full' }
          }"
        >
          <template #option="{ option }">
            <div>
              <div class="font-semibold">{{ option.fullName }}</div>
              <div class="text-sm text-gray-600">
                DNI: {{ option.userId }} | Afiliación: {{ option.affiliationId }}
              </div>
            </div>
          </template>
        </AutoComplete>

        <div v-if="selectedPatient" class="bg-gray-50 p-4 rounded">
          <p><strong>Nombre:</strong> {{ selectedPatient.fullName }}</p>
          <p><strong>DNI:</strong> {{ selectedPatient.userId }}</p>
          <p><strong>Afiliación:</strong> {{ selectedPatient.affiliationId }}</p>
          <p><strong>Obra Social:</strong> {{ selectedPatient.provider?.name }}</p>
        </div>
      </div>

      <!-- Diagnosis Selection -->
      <div class="space-y-4 mb-6">
        <h3 class="text-lg font-semibold">Diagnóstico</h3>
        <Dropdown
          v-model="selectedDiagnosis"
          :options="diagnoses"
          option-label="name"
          option-value="id"
          placeholder="Seleccionar diagnóstico"
          class="w-full"
        />
      </div>

      <!-- Medicine Selection -->
      <div class="space-y-4 mb-6">
        <h3 class="text-lg font-semibold">Medicamentos</h3>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <AutoComplete
            v-model="selectedMedicine"
            :suggestions="medicineSuggestions"
            @complete="searchMedicinesHandler"
            option-label="tradeName"
            placeholder="Buscar medicamento"
            class="md:col-span-1"
          >
            <template #option="{ option }">
              <div>
                <div class="font-semibold">{{ option.tradeName }}</div>
                <div class="text-sm text-gray-600">{{ option.activeSubstance }}</div>
              </div>
            </template>
          </AutoComplete>

          <InputNumber
            v-model="medicineQty"
            placeholder="Cantidad"
            :min="1"
            class="md:col-span-1"
          />

          <AutoComplete
            v-model="medicineInstructions"
            :suggestions="instructionSuggestions"
            @complete="searchInstructions"
            placeholder="Instrucciones"
            class="md:col-span-1"
          />

          <Button
            label="Agregar"
            icon="pi pi-plus"
            @click="addMedicine"
            :disabled="!selectedMedicine || !medicineQty || !medicineInstructions"
          />
        </div>

        <!-- Selected Medicines List -->
        <DataTable
          v-if="selectedMedicines.length > 0"
          :value="selectedMedicines"
          class="mt-4"
        >
          <Column field="medicine.tradeName" header="Nombre Comercial" />
          <Column field="medicine.activeSubstance" header="Droga" />
          <Column field="qty" header="Cantidad" />
          <Column field="instructions" header="Instrucciones" />
          <Column header="Acciones">
            <template #body="{ index }">
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                @click="removeMedicine(index)"
              />
            </template>
          </Column>
        </DataTable>
      </div>

      <!-- Submit Button -->
      <div class="flex justify-end space-x-4">
        <Button
          label="Crear Receta"
          icon="pi pi-save"
          :loading="saving"
          :disabled="!canSave"
          @click="savePrescription"
          size="large"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Patient, Medicine, Diagnosis } from '~/types'

definePageMeta({
  auth: true,
})

const toast = useToast()

// State
const selectedPatient = ref<Patient | null>(null)
const selectedDiagnosis = ref<string>('')
const selectedMedicine = ref<Medicine | null>(null)
const medicineQty = ref<number>(1)
const medicineInstructions = ref<string>('')
const selectedMedicines = ref<Array<{ medicine: Medicine; qty: number; instructions: string }>>([])
const patientSuggestions = ref<Patient[]>([])
const medicineSuggestions = ref<Medicine[]>([])
const instructionSuggestions = ref<string[]>([])
const diagnoses = ref<Diagnosis[]>([])
const saving = ref(false)

// Composables
const { searchPatients: searchPatientsAPI } = usePatients()
const { searchMedicines } = useMedicines()
const { getDiagnoses } = useDiagnosis()
const { createPrescription } = usePrescriptions()

// Common instructions
const commonInstructions = [
  'Tomar 1 cada 8 horas',
  'Tomar 1 cada 12 horas',
  'Tomar 1 cada 24 horas',
  'Tomar 1 comprimido por día',
  'Tomar 2 comprimidos por día',
  'Aplicar cada 12 horas',
  'Aplicar 1 vez al día',
  'Tomar en ayunas',
  'Tomar con las comidas',
]

// Computed
const canSave = computed(() => {
  return selectedPatient.value && selectedDiagnosis.value && selectedMedicines.value.length > 0
})

// Methods
const searchPatients = async (event: any) => {
  const result = await searchPatientsAPI(event.query)
  patientSuggestions.value = result?.data || []
}

const searchMedicinesHandler = async (event: any) => {
  const result = await searchMedicines(event.query)
  medicineSuggestions.value = result?.data || []
}

const searchInstructions = (event: any) => {
  const query = event.query.toLowerCase()
  instructionSuggestions.value = commonInstructions.filter(inst =>
    inst.toLowerCase().includes(query)
  )
}

const addMedicine = () => {
  if (!selectedMedicine.value) return

  selectedMedicines.value.push({
    medicine: { ...selectedMedicine.value },
    qty: medicineQty.value,
    instructions: medicineInstructions.value,
  })

  // Reset form
  selectedMedicine.value = null
  medicineQty.value = 1
  medicineInstructions.value = ''
}

const removeMedicine = (index: number) => {
  selectedMedicines.value.splice(index, 1)
}

const savePrescription = async () => {
  if (!canSave.value) return

  saving.value = true

  try {
    const prescriptionData = {
      patientId: selectedPatient.value!.id,
      diagnosis: selectedDiagnosis.value,
      medicines: selectedMedicines.value.map(m => ({
        medicineId: m.medicine.id,
        qty: m.qty,
        instructions: m.instructions,
      })),
    }

    const result = await createPrescription(prescriptionData)

    toast.add({
      severity: 'success',
      summary: 'Receta creada',
      detail: 'La receta se ha creado exitosamente',
      life: 3000,
    })

    // Reset form
    selectedPatient.value = null
    selectedDiagnosis.value = ''
    selectedMedicines.value = []

    // Navigate to prescription history
    navigateTo('/prescriptions')
  } catch (error) {
    console.error('Error saving prescription:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo crear la receta',
      life: 3000,
    })
  } finally {
    saving.value = false
  }
}

// Load diagnoses on mount
onMounted(async () => {
  diagnoses.value = await getDiagnoses()
})
</script>
