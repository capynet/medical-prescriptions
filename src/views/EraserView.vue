<script lang="ts" setup>
import usePatientDB from '@/composables/usePatientDB'
import { ref } from 'vue';

const { getBatch, del } = usePatientDB()
const docs = ref<any>([])
/* 
const all = await get(10)
console.log(all);
 */

const status = ref("Solicitando...")

let currCycle = 0

async function processBatch(batchSize: number, lastVisible: any = null) {
  console.log(`Ciclo actual: ${currCycle}`);

  let batch

  if (lastVisible !== null) {
    batch = await getBatch(batchSize, lastVisible)
  } else {
    batch = await getBatch(batchSize)
  }


  batch.items.forEach((item: any) => {
    if (!("affiliationProvider" in item)) {
      docs.value.push(item)
    }
  })

  if (currCycle < 4) {
    currCycle++
    processBatch(10000, batch.lastVisible)
  }

}


processBatch(10000)


const borrar = (e: Event) => {
  e.preventDefault()

  for (const doc of docs.value) {
    console.log(doc.fullName);
    del(doc)
  }

}


</script>

<template>
  <a
    href="@"
    @click.prevent="borrar"
  >Borrar</a>

  <pre>
  {{ docs }}
 </pre>

</template>
  
