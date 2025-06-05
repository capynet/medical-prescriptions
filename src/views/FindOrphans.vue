<script lang="ts" setup>
import usePatientDB from '@/composables/usePatientDB'
import {ref} from 'vue';
import type Patient from "@/models/Patient";

const {getBatch: getBatchPatients} = usePatientDB()
const collectedPatients = ref<Patient[]>([])
const status = ref("Esperando")
let currCycle = 0

const batchSize = 10000

/**
 * Goes through all stored docs and returns only the ones that are going to be updated.
 * @param batchSize
 * @param lastVisible
 */
async function processBatchPatients(batchSize: number, lastVisible: any = null) {
  console.log(`Ciclo actual: ${currCycle}`);

  let batch

  if (lastVisible !== null) {
    batch = await getBatchPatients(batchSize, lastVisible)
  } else {
    batch = await getBatchPatients(batchSize)
  }

  batch.items.forEach((item: any) => {
    collectedPatients.value.push(item)
  })

  // 4 cycles of 10k (max) each to cover all records.
  if (currCycle < 4) {
    currCycle++
    await processBatchPatients(batchSize, batch.lastVisible)
  }

}

const doRun = async (e: Event) => {
  e.preventDefault()
  console.clear()
  status.value = 'Procesando pacientes...'

  console.time("Procesado");
  await processBatchPatients(batchSize)

  const orphans = []

  for (const doc of collectedPatients.value) {
    const haveUserId = 'userId' in doc;
    const userIdIsEmpty = doc.userId === '';

    const haveAffiliationProvider = 'affiliationProvider' in doc;
    const affiliationProviderIsEmpty = doc.userId === '';

    const haveAffiliationId = 'affiliationId' in doc;
    const affiliationIdIsEmpty = doc.userId === '';


    console.log(
      !haveUserId,
      userIdIsEmpty,
      !haveAffiliationProvider,
      affiliationProviderIsEmpty,
      !haveAffiliationId,
      affiliationIdIsEmpty
    );
    if (
      // !haveUserId ||
      // userIdIsEmpty ||
      // !haveAffiliationProvider ||
      // affiliationProviderIsEmpty ||
      // !haveAffiliationId ||
      // affiliationIdIsEmpty ||
      true
    ) {

      if (!haveUserId) {
        console.log(doc)
        console.log('sin haveUserId')
      }
      if (userIdIsEmpty) {
        console.log(doc)
        console.log('sin userIdIsEmpty')
      }
      if (!haveAffiliationProvider) {
        console.log(doc)
        console.log('sin haveAffiliationProvider')
      }
      if (affiliationProviderIsEmpty) {
        console.log(doc)
        console.log('sin affiliationProviderIsEmpty')
      }
      if (!haveAffiliationId) {
        console.log(doc)
        console.log('sin haveAffiliationId')
      }
      if (affiliationIdIsEmpty) {
        console.log(doc)
        console.log('sin affiliationIdIsEmpty')
      }

      //orphans.push(doc)
    }

    // console.log(doc);
  }
  console.timeEnd("Procesado");

  status.value = `Econtrados ${orphans.length} pacientes con el criterio de filtrado.`

}
</script>

<template>
  <h1>Busqueda de pacientes rotos.</h1>
  <a href="@" @click.prevent="doRun">Actualizar</a>

  <h3>{{ status }}</h3>
</template>