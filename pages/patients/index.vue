<template>
  <div class="px-4 py-6">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">Gestión de Pacientes</h2>
          <Button
            label="Nuevo Paciente"
            icon="pi pi-plus"
            @click="openNewPatientDialog"
          />
        </div>
      </div>

      <div class="p-6">
        <!-- Search -->
        <div class="mb-4">
          <InputText
            v-model="searchQuery"
            placeholder="Buscar por nombre, DNI o afiliación..."
            class="w-full"
            @input="debouncedSearch"
          >
            <template #prepend>
              <i class="pi pi-search" />
            </template>
          </InputText>
        </div>

        <!-- Patients Table -->
        <DataTable
          :value="patients"
          :loading="loading"
          paginator
          :rows="20"
          :total-records="totalRecords"
          lazy
          @page="onPage"
        >
          <Column field="fullName" header="Nombre Completo" sortable />
          <Column field="userId" header="DNI" sortable />
          <Column field="affiliationId" header="Nº Afiliación" sortable />
          <Column field="provider.name" header="Obra Social" sortable />
          <Column field="plan.name" header="Plan" sortable />
          <Column header="Acciones">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button
                  icon="pi pi-pencil"
                  severity="secondary"
                  text
                  @click="editPatient(data)"
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  @click="confirmDeletePatient(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Patient Dialog -->
    <Dialog
      v-model:visible="showDialog"
      :header="editingPatient ? 'Editar Paciente' : 'Nuevo Paciente'"
      modal
      :style="{ width: '500px' }"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Nombre Completo</label>
          <InputText v-model="patientForm.fullName" class="w-full" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">DNI</label>
          <InputText v-model="patientForm.userId" class="w-full" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Nº Afiliación</label>
          <InputText v-model="patientForm.affiliationId" class="w-full" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Obra Social</label>
          <Dropdown
            v-model="patientForm.affiliationProvider"
            :options="providers"
            option-label="name"
            option-value="id"
            placeholder="Seleccionar obra social"
            class="w-full"
            @change="onProviderChange"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Plan</label>
          <Dropdown
            v-model="patientForm.affiliationPlan"
            :options="availablePlans"
            option-label="name"
            option-value="id"
            placeholder="Seleccionar plan"
            class="w-full"
            :disabled="!patientForm.affiliationProvider"
          />
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" severity="secondary" @click="closeDialog" />
        <Button
          :label="editingPatient ? 'Actualizar' : 'Crear'"
          :loading="savingPatient"
          @click="savePatient"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { Patient, Provider, PatientForm } from '~/types'

definePageMeta({
  auth: true,
})

const toast = useToast()
const confirm = useConfirm()

// State
const patients = ref<Patient[]>([])
const loading = ref(false)
const searchQuery = ref('')
const totalRecords = ref(0)
const currentPage = ref(0)
const showDialog = ref(false)
const editingPatient = ref<Patient | null>(null)
const savingPatient = ref(false)
const providers = ref<Provider[]>([])
const patientForm = ref<PatientForm>({
  fullName: '',
  userId: '',
  affiliationId: '',
  affiliationProvider: '',
  affiliationPlan: '',
})

// Composables
const { searchPatients, createPatient, updatePatient, deletePatient } = usePatients()
const { getProviders } = useProviders()

// Computed
const availablePlans = computed(() => {
  if (!patientForm.value.affiliationProvider) return []
  const provider = providers.value.find(p => p.id === patientForm.value.affiliationProvider)
  return provider?.plans || []
})

// Methods
const loadPatients = async () => {
  loading.value = true
  try {
    const result = await searchPatients(searchQuery.value, 20, currentPage.value * 20)
    patients.value = result?.data || []
    totalRecords.value = result?.total || 0
  } catch (error) {
    console.error('Error loading patients:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los pacientes',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

let searchTimeout: NodeJS.Timeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 0
    loadPatients()
  }, 300)
}

const onPage = (event: any) => {
  currentPage.value = event.page
  loadPatients()
}

const openNewPatientDialog = () => {
  editingPatient.value = null
  patientForm.value = {
    fullName: '',
    userId: '',
    affiliationId: '',
    affiliationProvider: '',
    affiliationPlan: '',
  }
  showDialog.value = true
}

const editPatient = (patient: Patient) => {
  editingPatient.value = patient
  patientForm.value = {
    fullName: patient.fullName,
    userId: patient.userId,
    affiliationId: patient.affiliationId,
    affiliationProvider: patient.affiliationProvider,
    affiliationPlan: patient.affiliationPlan,
  }
  showDialog.value = true
}

const onProviderChange = () => {
  patientForm.value.affiliationPlan = ''
}

const savePatient = async () => {
  savingPatient.value = true
  try {
    if (editingPatient.value) {
      await updatePatient(editingPatient.value.id, patientForm.value)
      toast.add({
        severity: 'success',
        summary: 'Paciente actualizado',
        detail: 'El paciente se ha actualizado exitosamente',
        life: 3000,
      })
    } else {
      await createPatient(patientForm.value)
      toast.add({
        severity: 'success',
        summary: 'Paciente creado',
        detail: 'El paciente se ha creado exitosamente',
        life: 3000,
      })
    }
    closeDialog()
    loadPatients()
  } catch (error) {
    console.error('Error saving patient:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo guardar el paciente',
      life: 3000,
    })
  } finally {
    savingPatient.value = false
  }
}

const confirmDeletePatient = (patient: Patient) => {
  confirm.require({
    message: `¿Está seguro de eliminar al paciente ${patient.fullName}?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await deletePatient(patient.id)
        toast.add({
          severity: 'success',
          summary: 'Paciente eliminado',
          detail: 'El paciente se ha eliminado exitosamente',
          life: 3000,
        })
        loadPatients()
      } catch (error) {
        console.error('Error deleting patient:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el paciente',
          life: 3000,
        })
      }
    },
  })
}

const closeDialog = () => {
  showDialog.value = false
  editingPatient.value = null
}

// Load data on mount
onMounted(async () => {
  loadPatients()
  providers.value = await getProviders()
})
</script>
