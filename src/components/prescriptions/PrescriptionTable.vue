<script lang="ts" setup>
import {useCentralStore} from '@/stores/centralStore';
import {DocumentChecked} from '@element-plus/icons-vue'
import useGenPDF from "@/composables/useGenPDF"
import dayjs from "dayjs";

const {genPDF} = useGenPDF()
const store = useCentralStore()

const cleanCreatedAt = (created_at: string) => {
  const createdAt = dayjs.utc(created_at)
  const createdAtFormattedH = createdAt.format('DD/MM/YYYY')
  const createdAtFormattedM = createdAt.format('HH:mm')
  return {
    createdAtFormattedH,
    createdAtFormattedM
  }
}
</script>
<template>
  <el-table
    :data="store.prescriptions"
    :border="true"
    style="width: 100%"
  >
    <el-table-column type="expand">

      <template #default="props">

        <div class="p-4">
          <h3 class="mt-0">Receta</h3>
          <el-table
            :data="props.row.prescribedMedicines"
            :border="true"
          >
            <el-table-column
              prop="medicine.tradeName"
              label="Medicamento"
            />

            <el-table-column
              prop="medicine.activeSubstance"
              label="Principio activo"
            />
            <el-table-column
              prop="qty"
              label="Cantidad"
            />
            <el-table-column
              prop="instructions"
              label="Instrucciones"
            />
          </el-table>

        </div>
      </template>
    </el-table-column>

    <el-table-column label="Fecha">
      <template #default="scope">
        <p class="m-0">{{ cleanCreatedAt(scope.row.created_at).createdAtFormattedH }}</p>
        <span class="text-xs">{{ cleanCreatedAt(scope.row.created_at).createdAtFormattedM }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="Diagnostico"
      prop="diagnosis"
    />

    <el-table-column
      label="Paciente"
      prop="patient.fullName"
    />

    <el-table-column
      label="Obra social"
      prop="patient.affiliationProvider.name"
    />

    <el-table-column
      label="Nº afiliado"
      prop="patient.affiliationId"
    />

    <el-table-column
      label="DNI"
      prop="patient.userId"
    />

    <el-table-column
      label="Autor"
      prop="author.name"
    />

    <el-table-column label="Acciones">

      <template #default="scope">

        <el-button
          type="success"
          :icon="DocumentChecked"
          @click="genPDF(scope.row)"
        >
          PDF
        </el-button>

      </template>
    </el-table-column>

  </el-table>
</template>
  