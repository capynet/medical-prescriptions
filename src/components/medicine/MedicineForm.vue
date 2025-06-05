<script lang="ts" setup>
import type Medicine from '@/models/Medicine';
import type PrescriptionMedicine from '@/models/PrescriptionMedicine';
import { useCentralStore } from '@/stores/centralStore';
import type { FormInstance, FormRules } from 'element-plus'
import { ref, reactive } from 'vue'
import {useDebounceFn, useMediaQuery} from '@vueuse/core'
import { ElMessage } from 'element-plus'
import 'element-plus/es/components/message/style/css';
import 'element-plus/es/components/message-box/style/css';
import useSupabase from "@/composables/useSupabase";

const store = useCentralStore()
const formElement = ref<FormInstance>()
const isLargeScreen = useMediaQuery('(min-width: 1024px)')

const {supabase} = useSupabase()

const dataForm = reactive<PrescriptionMedicine>({
    tradeName: '',
    activeSubstance: '',
    medicineId: '',
    qty: 1,
    instructions: '',
})

const rules = reactive<FormRules>({
    tradeName: [
        { required: true, message: 'Selecciona un medicamento', trigger: 'change' },
    ],
})


const doSearch = useDebounceFn(async (q: string) => {
  let processedStr = "'" + q.split(' ').join("' & '") + "'"
  const res = await supabase
    .from('vademecum')
    .select()
    .textSearch('fts', `${processedStr}`)
    .limit(20)

  return res.data as Medicine[]
}, 500)

// Vademecum autocomplete.
// ---------------------------------------------------
const querySearchVademecum = (queryString: string, cb: (arg: any) => void) => {
    (async () => {
        const results = queryString ? await doSearch(queryString) : []
        cb(results)
    })()
}

const handleSelect = (medicine: Record<string, any>) => {
    dataForm.tradeName = medicine.tradeName
    dataForm.medicineId = medicine.id
    dataForm.activeSubstance = medicine.activeSubstance
}

// Instructions autocomplete.
// ---------------------------------------------------
const querySearchInstructions = (queryString: string, cb: Function) => {
    const results = queryString
        ? store.commonInstructions.filter(filterInstructions(queryString))
        : store.commonInstructions

    // call callback function to return suggestion objects
    cb(results)
}

const filterInstructions = (queryString: string) => {
    return (instruction: Record<string, string>) => {
        return (
            instruction.label.toLowerCase().search(queryString.toLowerCase()) !== -1
        )
    }
}

const handleSelectInstructions = (instruction: Record<string, string>) => {
    dataForm.instructions = instruction.label
}

const onSubmit = (formEl: FormInstance | undefined) => {
    if (!formEl) return

    if (store.selectedMedicines.length < 2) {
        formEl.validate((valid) => {
            if (valid) {
                store.selectedMedicines.unshift({ ...dataForm })
                formEl.resetFields()
            } else {
                console.log('error submit!')
                return false
            }
        })
    } else {
        ElMessage({
            message: 'No puedes añadir mas de dos medicamentos. Elimina alguno para poder añadir nuevos.',
            type: 'error',
        })

    }
}
</script>

<template>
    <el-form
        :inline="isLargeScreen"
        :label-position="isLargeScreen ? 'left' : 'top'"
        :model="dataForm"
        ref="formElement"
        :rules="rules"
        size="large"
    >

        <el-form-item
            label="Medicamento"
            prop="tradeName"
        >

            <el-autocomplete
                class="w-full"
                v-model="dataForm.tradeName"
                :fetch-suggestions="querySearchVademecum"
                placeholder="Nombre"
                @select="handleSelect"
                value-key="tradeName"
            >

                <template #default="{ item }">
                    <span>
                        {{ item.tradeName }} <strong class="block sm:inline">({{ item.activeSubstance }})</strong>
                    </span>
                </template>

            </el-autocomplete>

        </el-form-item>

        <el-form-item
            label="Cantidad"
            prop="qty"
        >
            <el-input-number
                v-model="dataForm.qty"
                :min="1"
                :max="100"
            />
        </el-form-item>

        <el-form-item
            label="Indicaciones"
            prop="instructions"
        >
            <el-autocomplete
                class="w-full"
                v-model="dataForm.instructions"
                :fetch-suggestions="querySearchInstructions"
                popper-class="my-autocomplete"
                placeholder="Indicaciones"
                @select="handleSelectInstructions"
                value-key="label"
            >
            </el-autocomplete>
        </el-form-item>

        <el-form-item>
            <el-button
                type="primary"
                @click="onSubmit(formElement)"
            >Añadir</el-button>
        </el-form-item>

    </el-form>
</template>
