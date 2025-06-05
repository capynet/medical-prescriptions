<script lang="ts" setup>
import {reactive, ref, watch} from 'vue'
import useSearchEngine from "@/composables/useSearchEngine"
import useUtils from '@/composables/useUtils'
import dayjs from 'dayjs'
import type PrescriptionMedicine from '@/models/PrescriptionMedicine'
import useGenPDF from "@/composables/useGenPDF"
import useProvider from "@/composables/useProvider"

const {getByMachineName: getProviderByMachineName} = useProvider()
const {genReportPDF} = useGenPDF()
const {doSearchPrescriptions, searchParams} = useSearchEngine()
const {obrasSociales} = useUtils()
const providerPlans = ref()
let lastKnowProvider = ''

let filterData: {
  createdDate: string | Date[],
  patientSearchableProps: string,
  userId: string,
  affiliationId: string,
  author: string,
  affiliationProvider: string,
  providerPlan: string[],
  medicines: PrescriptionMedicine[],
} = reactive({
  createdDate: ref(''),
  patientSearchableProps: '',
  userId: '',
  affiliationId: '',
  author: '',
  affiliationProvider: '',
  providerPlan: [],
  medicines: [],
})

watch(filterData, async (data) => {

  const searchParams: { filters: Record<any, any> } = {
    filters: {},
  }

  if (data.patientSearchableProps !== '') {
    searchParams.filters.search = data.patientSearchableProps
  }

  if (data.userId !== '') {
    searchParams.filters.userId = data.userId
  }

  if (data.affiliationId !== '') {
    searchParams.filters.affiliationId = data.affiliationId
  }

  if (data.createdDate.length) {
    const fromDate = data.createdDate[0] as Date
    const from = dayjs.utc(fromDate).tz().toISOString()

    const toDate = data.createdDate[1] as Date
    const to = dayjs.utc(toDate).tz().toISOString()

    searchParams.filters.from = from
    searchParams.filters.to = to
  }

  if (data.author !== '') {
    searchParams.filters.author = data.author
  }

  if (data.affiliationProvider !== '') {
    searchParams.filters.affiliationProvider = data.affiliationProvider

    // We already have a provider.
    // It will reach this code all the time while a provided
    // filter is applied so just lets call a new plans list if provider changed.
    if (lastKnowProvider !== data.affiliationProvider) {
      lastKnowProvider = data.affiliationProvider
      const affiliationProvider = await getProviderByMachineName(data.affiliationProvider)
      providerPlans.value = affiliationProvider?.plans
      data.providerPlan = []
    }

  }

  if (data.providerPlan.length !== 0) {
    searchParams.filters.providerPlan = data.providerPlan
  }

  if (data.medicines.length) {
    /* const searchIds: string[] = []

    data.medicines.forEach((medicineItem: PrescriptionMedicine) => {
        searchIds.push(`medicines.id = ${medicineItem.medicineId}`)
    })


    console.log(searchIds) */

    //searchParams.filters.push(`medicines.id = ${medicineItem.medicineId}`)
  }

  doSearchPrescriptions(searchParams)


})


const shortcuts = [
  {
    text: 'Ùltima semana',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: 'Ùltimo mes',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: 'Ùltimos 3 meses',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

const resetForm = () => {
  searchParams.page = 1
  filterData.createdDate = []
  filterData.patientSearchableProps = ''
  filterData.author = ''
  filterData.affiliationProvider = ''
  filterData.providerPlan = []
}

const defaultTime = ref<[Date, Date]>([
  new Date(2000, 1, 1, 0, 0, 0),
  new Date(2000, 2, 1, 23, 59, 59),
])

</script>

<template>
  <el-form
    :inline="true"
    size="large"
  >

    <el-form-item label="Creado">
      <el-date-picker
        v-model="filterData.createdDate"
        :default-time="defaultTime"
        type="daterange"
        unlink-panels
        range-separator="a"
        start-placeholder="Desde"
        end-placeholder="Hasta"
        :shortcuts="shortcuts"
        format="DD/MM/YYYY"
      />
    </el-form-item>

    <el-form-item label="Autor">
      <el-select v-model="filterData.author">
        <el-option
          label="- Seleccionar -"
          value=""
        />
        <el-option
          label="Fernando Cardoso"
          value="4"
        />
        <el-option
          label="Juan Ignacio Romero"
          value="2"
        />
        <el-option
          label="Lara Rocio Espinosa"
          value="5"
        />
        <el-option
          label="Nadia Pelliza"
          value="6"
        />
      </el-select>

    </el-form-item>

    <el-form-item label="Nombre">
      <el-input v-model="filterData.patientSearchableProps"/>
    </el-form-item>

    <el-form-item label="DNI">
      <el-input v-model="filterData.userId"/>
    </el-form-item>

    <el-form-item label="Nº afiliado">
      <el-input v-model="filterData.affiliationId"/>
    </el-form-item>

    <el-form-item label="Obra social">
      <el-select v-model="filterData.affiliationProvider">
        <el-option
          label="- Seleccionar -"
          value=""
        />

        <el-option
          v-for="item in obrasSociales"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

    </el-form-item>

    <el-form-item label="Plan">
      <el-select
        multiple
        v-model="filterData.providerPlan"
        no-data-text="Selecciona una obra social"
      >

        <el-option
          v-for="item in providerPlans"
          :key="item.machineName"
          :label="item.name"
          :value="item.name"
        />
      </el-select>

    </el-form-item>

    <!-- <el-form-item label="Medicamentos">

        <el-autocomplete
            class="w-full"
            v-model="filterData.medicines"
            :fetch-suggestions="querySearchVademecum"
            placeholder="Nombre"
            @select="handleSelect"
            value-key="tradeName"
        >

            <template #default="{ item }">
                <span>
                    {{ item.tradeName }} <strong>({{ item.activeSubstance }})</strong>
                </span>
            </template>

        </el-autocomplete>

    </el-form-item> -->

    <el-form-item>
      <el-button @click="resetForm">Quitar filtros</el-button>
      <el-button type="success" v-if="filterData.affiliationProvider" @click="genReportPDF(filterData)">Generar reporte con estos resultados</el-button>
    </el-form-item>

  </el-form>
</template>
