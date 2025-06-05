<script lang="ts" setup>
import usePatientDB from '@/composables/usePatientDB'
import {ref} from 'vue';
import type Patient from "@/models/Patient";
import useSupabase from "@/composables/useSupabase";
import useMedicineDB from "@/composables/useMedicineDB";
import type Medicine from "@/models/Medicine";

const {getBatch} = useMedicineDB()
const collected = ref<Medicine[]>([])
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
  if (currCycle < 3) {
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

const runBulkUpdate = async (e: Event) => {
  e.preventDefault()
  console.clear()
  status.value = 'Procesando pacientes...'

  console.time("Procesado");
  await getAllDocs(batchSize)
  const newRecords = []

  const uniques: Record<string, boolean> = {}

  for (const doc of collected.value) {
    const hash = doc.tradeName + doc.activeSubstance

    if (!uniques[hash]) {
      newRecords.push({
        tradeName: doc.tradeName,
        activeSubstance: doc.activeSubstance,
        author: 4,
      })

      uniques[hash] = true
    }


  }

  const res = await supabase.from('vademecum').insert(newRecords)

  console.log(res);

  console.timeEnd("Procesado");

  status.value = `${newRecords.length} creados.`

}
</script>

<template>
  <h1>Creacion vademecum</h1>
  <a href="@" @click.prevent="runBulkUpdate">Crear</a>

  <h3>{{ status }}</h3>
</template>