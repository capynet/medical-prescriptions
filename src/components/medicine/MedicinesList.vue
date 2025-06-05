<script lang="ts" setup>
import { useCentralStore } from '@/stores/centralStore';
const store = useCentralStore()

const deleteRow = (index: number) => {
    store.selectedMedicines.splice(index, 1)
}
</script>
  

<template>
    <el-table
        :data="store.selectedMedicines"
        class="w-full"
        size="large"
        empty-text="No hay medicamentos en la lista"
    >
        <el-table-column
            prop="tradeName"
            label="Nombre"
            min-width="200"
        />
        
        <el-table-column
            prop="activeSubstance"
            label="Substancia activa"
            min-width="200"
        />
        <el-table-column
            prop="qty"
            label="Cantidad"
            min-width="100"
        />
        <el-table-column
            prop="instructions"
            label="Indicaciones"
            min-width="300"
        />
        <el-table-column
            fixed="right"
            label="Acciones"
            min-width="95"
        >

            <template #default="scope">
                <el-button
                    type="danger"
                    size="small"
                    @click.prevent="deleteRow(scope.$index)"
                >
                    Borrar
                </el-button>

            </template>
        </el-table-column>
    </el-table>

</template>
  