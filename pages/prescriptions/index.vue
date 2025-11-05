<template>
  <div class="px-4 py-6">
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b">
        <h2 class="text-2xl font-bold">Histórico de Recetas</h2>
      </div>

      <!-- Filters -->
      <div class="p-6 border-b bg-gray-50">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-2">Fecha Desde</label>
            <Calendar
              v-model="filters.dateFrom"
              date-format="dd/mm/yy"
              placeholder="Seleccionar fecha"
              class="w-full"
              @update:model-value="applyFilters"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Fecha Hasta</label>
            <Calendar
              v-model="filters.dateTo"
              date-format="dd/mm/yy"
              placeholder="Seleccionar fecha"
              class="w-full"
              @update:model-value="applyFilters"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Nombre del Paciente</label>
            <InputText
              v-model="filters.patientName"
              placeholder="Buscar por nombre"
              class="w-full"
              @input="debouncedSearch"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">DNI</label>
            <InputText
              v-model="filters.userId"
              placeholder="DNI del paciente"
              class="w-full"
              @input="debouncedSearch"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Nº Afiliación</label>
            <InputText
              v-model="filters.affiliationId"
              placeholder="Número de afiliación"
              class="w-full"
              @input="debouncedSearch"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Obra Social</label>
            <Dropdown
              v-model="filters.affiliationProvider"
              :options="providers"
              option-label="name"
              option-value="id"
              placeholder="Todas"
              class="w-full"
              show-clear
              @change="applyFilters"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Autor</label>
            <Dropdown
              v-model="filters.author"
              :options="users"
              option-label="name"
              option-value="id"
              placeholder="Todos"
              class="w-full"
              show-clear
              @change="applyFilters"
            >
              <template #option="{ option }">
                {{ option.name }} {{ option.surname }}
              </template>
            </Dropdown>
          </div>

          <div class="flex items-end">
            <Button
              label="Limpiar Filtros"
              icon="pi pi-filter-slash"
              severity="secondary"
              outlined
              @click="clearFilters"
              class="w-full"
            />
          </div>
        </div>
      </div>

      <div class="p-6">
        <div class="mb-4 text-sm text-gray-600">
          Total de recetas: {{ totalRecords }}
        </div>

        <!-- Prescriptions Table -->
        <DataTable
          :value="prescriptions"
          :loading="loading"
          paginator
          :rows="20"
          :total-records="totalRecords"
          lazy
          @page="onPage"
          :expandedRows="expandedRows"
          @row-expand="onRowExpand"
        >
          <Column expander style="width: 3rem" />

          <Column field="createdAt" header="Fecha" sortable>
            <template #body="{ data }">
              {{ formatDate(data.createdAt) }}
            </template>
          </Column>

          <Column field="patient.fullName" header="Paciente" sortable />

          <Column field="patient.userId" header="DNI" sortable />

          <Column field="diagnosisInfo.name" header="Diagnóstico" sortable />

          <Column field="patient.provider.name" header="Obra Social" sortable />

          <Column field="authorUser" header="Autor">
            <template #body="{ data }">
              {{ data.authorUser?.name }} {{ data.authorUser?.surname }}
            </template>
          </Column>

          <Column header="Acciones">
            <template #body="{ data }">
              <Button
                icon="pi pi-file-pdf"
                label="PDF"
                severity="secondary"
                text
                @click="downloadPDF(data)"
              />
            </template>
          </Column>

          <template #expansion="{ data }">
            <div class="p-4">
              <h4 class="font-semibold mb-3">Medicamentos Prescritos</h4>
              <DataTable :value="data.medicines">
                <Column field="medicine.tradeName" header="Nombre Comercial" />
                <Column field="medicine.activeSubstance" header="Droga" />
                <Column field="qty" header="Cantidad" />
                <Column field="instructions" header="Instrucciones" />
              </DataTable>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Prescription, Provider, User, PrescriptionFilters } from '~/types'
import dayjs from 'dayjs'

definePageMeta({
  auth: true,
})

const toast = useToast()

// State
const prescriptions = ref<Prescription[]>([])
const loading = ref(false)
const totalRecords = ref(0)
const currentPage = ref(1)
const expandedRows = ref([])
const providers = ref<Provider[]>([])
const users = ref<User[]>([])
const filters = ref<PrescriptionFilters>({
  dateFrom: undefined,
  dateTo: undefined,
  patientName: '',
  userId: '',
  affiliationId: '',
  author: undefined,
  affiliationProvider: undefined,
  page: 1,
  limit: 20,
})

// Composables
const { searchPrescriptions } = usePrescriptions()
const { getProviders } = useProviders()

// Methods
const formatDate = (date: Date | string) => {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const loadPrescriptions = async () => {
  loading.value = true
  try {
    const result = await searchPrescriptions({
      ...filters.value,
      page: currentPage.value,
    })
    prescriptions.value = result?.data || []
    totalRecords.value = result?.total || 0
  } catch (error) {
    console.error('Error loading prescriptions:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar las recetas',
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
    currentPage.value = 1
    loadPrescriptions()
  }, 500)
}

const applyFilters = () => {
  currentPage.value = 1
  loadPrescriptions()
}

const clearFilters = () => {
  filters.value = {
    dateFrom: undefined,
    dateTo: undefined,
    patientName: '',
    userId: '',
    affiliationId: '',
    author: undefined,
    affiliationProvider: undefined,
    page: 1,
    limit: 20,
  }
  loadPrescriptions()
}

const onPage = (event: any) => {
  currentPage.value = event.page + 1
  loadPrescriptions()
}

const onRowExpand = (event: any) => {
  // Handle row expansion if needed
}

const { generatePrescriptionPDF } = usePDF()

const downloadPDF = async (prescription: Prescription) => {
  try {
    generatePrescriptionPDF(prescription)
    toast.add({
      severity: 'success',
      summary: 'PDF Generado',
      detail: 'El PDF se ha descargado exitosamente',
      life: 3000,
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo generar el PDF',
      life: 3000,
    })
  }
}

const loadUsers = async () => {
  try {
    const { data } = await useFetch('/api/users')
    users.value = data.value?.data || []
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

// Load data on mount
onMounted(async () => {
  loadPrescriptions()
  providers.value = await getProviders()
  await loadUsers()
})
</script>
