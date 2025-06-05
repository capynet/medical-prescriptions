<script lang="ts" setup>
import {ref} from 'vue';
import useSupabase from "@/composables/useSupabase";
import usePrescriptionDB from "@/composables/usePrescriptionDB";

const {get} = usePrescriptionDB()
const collected = ref<any[]>([])
const status = ref("Esperando")
const {supabase} = useSupabase()



const runBulkUpdate = async (e: Event) => {
  e.preventDefault()
  console.clear()
  status.value = 'Procesando...'

  // const patientDbRecords = await supabase.from('patient').select(`*`)
  // const medicineDbRecords = await supabase.from('vademecum').select(`id`)
  //
  // const searchPatient = (match: Record<any, any>) => {
  //   for (const patient of patientDbRecords.data as any) {
  //     if (match.affiliationId === patient.affiliationId && match.userId === patient.userId) {
  //       return patient
  //     }
  //   }
  // }
  //
  // const searchMedicine = (match: Record<any, any>) => {
  //   for (const medicine of medicineDbRecords.data as any) {
  //     if (match.activeSubstance === medicine.activeSubstance && match.tradeName === medicine.tradeName) {
  //       return medicine
  //     }
  //   }
  // }

  collected.value = await get()

  for (const doc of collected.value) {
    const medicineIds = []

    for (const medicine of doc.medicines) {
      const medicineDbItem = await supabase
        .from('vademecum')
        .select(`id`)
        .match({
          activeSubstance: medicine.activeSubstance,
          tradeName: medicine.tradeName
        })


      for (const medicineDbItemElement of medicineDbItem.data as any) {
        medicineIds.push({
          id: medicineDbItemElement.id,
          qty: medicine.qty,
          instructions: medicine.instructions
        })
      }

    }

    const patientDbItem = await supabase
      .from('patient')
      .select(`*`)
      .match({
        affiliationId: doc.patient.affiliationId,
        userId: doc.patient.userId,
      })
      .limit(1)
      .single()

    const created = new Date((doc.created as { seconds: number, nanoseconds: number }).seconds * 1000).toISOString().toLocaleString('es-ES')

    if (patientDbItem.data !== null && ("id" in patientDbItem.data)) {


      // First the medicine.
      const newPrescription = await supabase.from('prescription').insert({
        created_at: created,
        author: 5,
        diagnosis: doc.diagnosis,
        patient: patientDbItem.data.id
      })
        // .returns<Prescription>()
        .select()

      // Now the  related medicines.
      for (const medicineId of medicineIds) {
        await supabase.from('prescription_medicines').insert({
          prescription_id: newPrescription.data[0].id,
          medicine_id: medicineId.id,
          qty: medicineId.qty,
          instructions: medicineId.instructions
        })
      }
    }

  }


  status.value = `${collected.value.length} creados.`

}
</script>

<template>
  <h1>Migracion prescripciones</h1>
  <a href="@" @click.prevent="runBulkUpdate">Crear</a>

  <h3>{{ status }}</h3>
</template>