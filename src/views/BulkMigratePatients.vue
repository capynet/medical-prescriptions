<script lang="ts" setup>
import usePatientDB from '@/composables/usePatientDB'
import {ref} from 'vue';
import type Patient from "@/models/Patient";
import useSupabase from "@/composables/useSupabase";
import useMedicineDB from "@/composables/useMedicineDB";
import type Medicine from "@/models/Medicine";

const {getBatch} = usePatientDB()
const collected = ref<Patient[]>([])
const status = ref("Esperando")
let currCycle = 0

const batchSize = 10000
const {supabase} = useSupabase()

/**
 * Goes through all stored docs and returns only the ones that are going to be updated.
 * @param batchSize
 * @param lastVisible
 */
async function getAllDocs(batchSize: number, lastVisible: any = null) {
  console.log(`Ciclo actual: ${currCycle}`);

  let batch

  if (lastVisible !== null) {
    batch = await getBatch(batchSize, lastVisible)
  } else {
    batch = await getBatch(batchSize)
  }

  batch.items.forEach((item: any) => {
    collected.value.push(item)
  })

  // 4 cycles of 10k (max) each to cover all records.
  if (currCycle < 4) {
    currCycle++
    await getAllDocs(batchSize, batch.lastVisible)
  }

}

const authorsMap = {
  '2rcjkv057bCnJ2UXaKTj': 2,
  '5N6p2XeidSSLTwAm4CnKbO3hlfJ2': 4,
  'IgEXxspXaoe3EHXbtLf0TvP4Nf62': 5,
  've6ED8VLnEhEPRWc3DYQL7wWk0s2': 1,
}

const affiliationProviderMap: Record<string, number> = {
  'ossurrbac': 2,
  'ospjtap': 4,
  'ospevic': 5,
  'osplyfc': 6,
}

const runBulkUpdate = async (e: Event) => {
  e.preventDefault()
  console.clear()
  status.value = 'Procesando...'

  console.time("Procesado");
  await getAllDocs(batchSize)
  const newRecords = []

  for (const doc of collected.value) {

    newRecords.push({
      affiliationId: doc.affiliationId,
      affiliationPlan: doc.affiliationPlan || doc.affiliationProvider,
      affiliationProvider: affiliationProviderMap[doc.affiliationProvider],
      author: 4,
      fullName: doc.fullName,
      userId: doc.userId,
    })


  }

  const res = await supabase.from('patient').insert(newRecords)

  console.log(res);

  console.timeEnd("Procesado");

  status.value = `${collected.value.length} creados.`

}
</script>

<template>
  <h1>Migracion pacientes</h1>
  <a href="@" @click.prevent="runBulkUpdate">Crear</a>

  <h3>{{ status }}</h3>
</template>