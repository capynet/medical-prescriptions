<script lang="ts" setup>
import {Avatar as avatarIcon} from '@element-plus/icons-vue'
import type Patient from '@/models/Patient';
import {useCentralStore} from '@/stores/centralStore';
import {useDebounceFn} from "@vueuse/core";
import useSupabase from "@/composables/useSupabase";

const store = useCentralStore()
const {supabase} = useSupabase()

const doSearch = useDebounceFn(async (q: string) => {
  let processedStr = "'" + q.split(' ').join("' & '") + "'"
  const res = await supabase
    .from('patient')
    .select(`*, author(*), affiliationProvider(*)`)
    .textSearch('fts', `${processedStr}`)
    .limit(20)

  return res.data as Patient[]
}, 500)

const querySearch = (queryString: string, cb: (arg: any) => void) => {
  (async () => {
    const results = queryString ? await doSearch(queryString) : []
    cb(results)
  })()
}

const handleSelect = (patient: Record<string, any>) => {
  store.selectedPatient = patient as Patient
  store.autocompleteSelectedItemText = store.selectedPatient.fullName
}

const diagnosis =  await store.getDiagnosis()
</script>

<template>

  <el-card class="mb-10">

    <template #header>

      <div class="card-header">

        <el-form-item label="Paciente" class="form-item">
          <el-autocomplete
            class="w-full sm:w-96"
            v-model="store.autocompleteSelectedItemText"
            :fetch-suggestions="querySearch"
            placeholder="Nombre del paciente"
            @select="handleSelect"
            size="large"
          >

            <template #default="{ item }">
              <p>
                <el-icon :size="20">
                  <avatarIcon/>
                </el-icon>

                {{ item.fullName }}
              </p>

              <div class="details text-xs">
                <p>
                  <strong>DNI:</strong> {{ item.userId }} / <strong>Afiliado:</strong>
                  {{ item.affiliationId }}
                  ({{ item.affiliationProvider.name }})
                </p>
              </div>
            </template>
          </el-autocomplete>
        </el-form-item>

        <el-form-item label="Diagnostico" class="form-item">
          <el-select
            v-model="store.selectedDiagnosis"
            filterable
            placeholder="- Diagnostico -"
            size="large"
          >
            <el-option
              v-for="item in diagnosis"
              :key="item.machineName"
              :label="item.name"
              :value="item.machineName"
            />
          </el-select>
        </el-form-item>

      </div>
    </template>

    <div>
      <p class="mt-0 mb-1 text-sm">Nombrea: <strong>{{ store.selectedPatient?.fullName }}</strong></p>
      <p class="mt-0 mb-1 text-sm">DNI: <strong>{{ store.selectedPatient?.userId }}</strong></p>
      <p class="mt-0 mb-1 text-sm">Nro de afiliado: <strong>{{ store.selectedPatient?.affiliationId }}</strong>
      </p>
      <p class="mt-0 mb-1 text-sm">Obra social:
        <strong>{{ store.selectedPatient?.affiliationProvider.name }}</strong>
      </p>
    </div>

  </el-card>

</template>

