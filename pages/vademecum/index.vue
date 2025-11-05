<template>
  <div class="px-4 py-6">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b">
        <div class="flex justify-between items-center">
          <h2 class="text-2xl font-bold">Vademécum</h2>
          <Button
            label="Nuevo Medicamento"
            icon="pi pi-plus"
            @click="openNewMedicineDialog"
          />
        </div>
      </div>

      <div class="p-6">
        <!-- Search -->
        <div class="mb-4">
          <InputText
            v-model="searchQuery"
            placeholder="Buscar por nombre comercial o droga..."
            class="w-full"
            @input="debouncedSearch"
          >
            <template #prepend>
              <i class="pi pi-search" />
            </template>
          </InputText>
        </div>

        <!-- Medicines Table -->
        <DataTable
          :value="medicines"
          :loading="loading"
          paginator
          :rows="20"
          :total-records="totalRecords"
          lazy
          @page="onPage"
        >
          <Column field="tradeName" header="Nombre Comercial" sortable />
          <Column field="activeSubstance" header="Droga" sortable />
          <Column field="authorUser.name" header="Autor">
            <template #body="{ data }">
              {{ data.authorUser?.name }} {{ data.authorUser?.surname }}
            </template>
          </Column>
          <Column header="Acciones">
            <template #body="{ data }">
              <div class="flex gap-2">
                <Button
                  icon="pi pi-pencil"
                  severity="secondary"
                  text
                  @click="editMedicine(data)"
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  text
                  @click="confirmDeleteMedicine(data)"
                />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>
    </div>

    <!-- Medicine Dialog -->
    <Dialog
      v-model:visible="showDialog"
      :header="editingMedicine ? 'Editar Medicamento' : 'Nuevo Medicamento'"
      modal
      :style="{ width: '500px' }"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Nombre Comercial</label>
          <InputText v-model="medicineForm.tradeName" class="w-full" />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2">Droga (Principio Activo)</label>
          <InputText v-model="medicineForm.activeSubstance" class="w-full" />
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" severity="secondary" @click="closeDialog" />
        <Button
          :label="editingMedicine ? 'Actualizar' : 'Crear'"
          :loading="savingMedicine"
          @click="saveMedicine"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import type { Medicine, MedicineForm } from '~/types'

definePageMeta({
  auth: true,
})

const toast = useToast()
const confirm = useConfirm()

// State
const medicines = ref<Medicine[]>([])
const loading = ref(false)
const searchQuery = ref('')
const totalRecords = ref(0)
const currentPage = ref(0)
const showDialog = ref(false)
const editingMedicine = ref<Medicine | null>(null)
const savingMedicine = ref(false)
const medicineForm = ref<MedicineForm>({
  tradeName: '',
  activeSubstance: '',
})

// Composables
const { searchMedicines, createMedicine, updateMedicine, deleteMedicine } = useMedicines()

// Methods
const loadMedicines = async () => {
  loading.value = true
  try {
    const result = await searchMedicines(searchQuery.value, 20, currentPage.value * 20)
    medicines.value = result?.data || []
    totalRecords.value = result?.total || 0
  } catch (error) {
    console.error('Error loading medicines:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los medicamentos',
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
    loadMedicines()
  }, 300)
}

const onPage = (event: any) => {
  currentPage.value = event.page
  loadMedicines()
}

const openNewMedicineDialog = () => {
  editingMedicine.value = null
  medicineForm.value = {
    tradeName: '',
    activeSubstance: '',
  }
  showDialog.value = true
}

const editMedicine = (medicine: Medicine) => {
  editingMedicine.value = medicine
  medicineForm.value = {
    tradeName: medicine.tradeName,
    activeSubstance: medicine.activeSubstance,
  }
  showDialog.value = true
}

const saveMedicine = async () => {
  savingMedicine.value = true
  try {
    if (editingMedicine.value) {
      await updateMedicine(editingMedicine.value.id, medicineForm.value)
      toast.add({
        severity: 'success',
        summary: 'Medicamento actualizado',
        detail: 'El medicamento se ha actualizado exitosamente',
        life: 3000,
      })
    } else {
      await createMedicine(medicineForm.value)
      toast.add({
        severity: 'success',
        summary: 'Medicamento creado',
        detail: 'El medicamento se ha creado exitosamente',
        life: 3000,
      })
    }
    closeDialog()
    loadMedicines()
  } catch (error) {
    console.error('Error saving medicine:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo guardar el medicamento',
      life: 3000,
    })
  } finally {
    savingMedicine.value = false
  }
}

const confirmDeleteMedicine = (medicine: Medicine) => {
  confirm.require({
    message: `¿Está seguro de eliminar el medicamento ${medicine.tradeName}?`,
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await deleteMedicine(medicine.id)
        toast.add({
          severity: 'success',
          summary: 'Medicamento eliminado',
          detail: 'El medicamento se ha eliminado exitosamente',
          life: 3000,
        })
        loadMedicines()
      } catch (error) {
        console.error('Error deleting medicine:', error)
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el medicamento',
          life: 3000,
        })
      }
    },
  })
}

const closeDialog = () => {
  showDialog.value = false
  editingMedicine.value = null
}

// Load data on mount
onMounted(() => {
  loadMedicines()
})
</script>
