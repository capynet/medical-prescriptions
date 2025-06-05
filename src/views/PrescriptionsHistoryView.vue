<script lang="ts" setup>
import PrescriptionTable from '@/components/prescriptions/PrescriptionTable.vue';
import PrescriptionTableFilters from '@/components/prescriptions/PrescriptionTableFilters.vue';
import useSearchEngine from "@/composables/useSearchEngine"
import { onMounted } from 'vue';

const { doSearchPrescriptions, prescriptionSearchState, searchParams } = useSearchEngine()

onMounted(() => {
    doSearchPrescriptions()
})

function handleCurrentChange(page: number) {
    searchParams.page = page
    doSearchPrescriptions( searchParams)
}

</script>

<template>
    <h1>Histórico de recetas</h1>
    <PrescriptionTableFilters />

    <div class="flex flex-col sm:flex-row justify-center mb-4 bg-slate-300 p-2 items-center">

        <div class="mb-2 sm:mb-0 mr-6">Total: {{ prescriptionSearchState.totalHits }}</div>
        <el-pagination
            background
            layout="prev, pager, next"
            :page-size="searchParams.hitsPerPage"
            :total="prescriptionSearchState.totalHits"
            @current-change="handleCurrentChange"
        />
    </div>
    <PrescriptionTable />

</template>
