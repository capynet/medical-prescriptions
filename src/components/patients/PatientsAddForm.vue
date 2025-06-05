<script lang="ts" setup>
import type {FormInstance, FormRules} from 'element-plus'
import {ref, reactive, watch} from 'vue'
import usePatientDB from '@/composables/usePatientDB'
import type AffiliationProvider from "@/models/AffiliationProvider"
import type Patient from "@/models/Patient"
import useProvider from "@/composables/useProvider"
import type AffiliationPlan from "@/models/AffiliationPlan"

export interface Props {
  dataForm?: any
}

const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['saved'])

const {add: patientAdd, put: patientPut} = usePatientDB()
const {getById: getProvidersById, get: getProviders} = useProvider()

const formElement = ref<FormInstance>()
const obrasSociales = ref<AffiliationProvider[]>([])
const affiliationPlans = ref<Record<any, any>[]>([])

const dataForm = reactive({
  fullName: props.dataForm?.fullName ?? '',
  userId: props.dataForm?.userId ?? '',
  affiliationId: props.dataForm?.affiliationId ?? '',
  affiliationProvider: props.dataForm?.affiliationProvider ?? null,
  affiliationPlan: props.dataForm?.affiliationPlan ?? '',
})

watch(props, () => {
  dataForm.fullName = props.dataForm.fullName
  dataForm.userId = props.dataForm.userId
  dataForm.affiliationId = props.dataForm.affiliationId
  dataForm.affiliationProvider = props.dataForm.affiliationProvider
  dataForm.affiliationPlan = props.dataForm.affiliationPlan

  // If we got a provider from props, we need to get all plans.
  if (dataForm.affiliationProvider !== null) {
    getProvidersById(dataForm.affiliationProvider).then(provider => {
      affiliationPlans.value = provider?.plans as AffiliationPlan[]
    })
  }

})

getProviders().then(r => obrasSociales.value = r as AffiliationProvider[])

// If we got a provider from props, we need to get all plans.
if (dataForm.affiliationProvider !== null) {
  getProvidersById(dataForm.affiliationProvider).then(provider => {
    affiliationPlans.value = provider?.plans as AffiliationPlan[]
  })
}


const rules = reactive<FormRules>({
  userId: [
    {required: true, message: 'El DNI es requerido.'},
  ],
  fullName: [
    {required: true, message: 'El nombre completo del paciente es requerido.'},
  ],
  affiliationId: [
    {required: true, message: 'El identificador de la obra social del paciente es requerido.'},
  ],
  affiliationProvider: [
    {required: true, message: 'Selecciona la obra social.'},
  ],
  affiliationPlan: [
    {required: true, message: 'Indica un plan.'},
  ],
})

const onSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid) => {
    if (valid) {

      const patientObj: Patient = {...dataForm, ...{author: 4, affiliationProvider: dataForm.affiliationProvider as unknown as number}}

      if (props.dataForm?.id) {
        patientObj.id = props.dataForm.id
        await patientPut(patientObj)
      } else {
        await patientAdd(patientObj)
      }

      formEl.resetFields()
      emit('saved')
    } else {
      console.log('error submit!')
      return false
    }
  })
}

const updatePlansList = async (affiliationProvidedId: number) => {
  const provider = await getProvidersById(affiliationProvidedId)
  affiliationPlans.value = provider?.plans as AffiliationPlan[]
  dataForm.affiliationPlan = []
}

</script>

<template>
  <el-form
    ref="formElement"
    :inline="true"
    label-position="top"
    size="large"
    :model="dataForm"
    :rules="rules"
  >

    <el-form-item
      label="Nombre completo"
      prop="fullName"
    >
      <el-input v-model="dataForm.fullName"/>
    </el-form-item>

    <el-form-item
      label="DNI"
      prop="userId"
    >
      <el-input v-model="dataForm.userId"/>
    </el-form-item>

    <el-form-item
      label="Nº afiliado"
      prop="affiliationId"
    >
      <el-input v-model="dataForm.affiliationId"/>
    </el-form-item>

    <el-form-item
      label="Obra social"
      prop="affiliationProvider"
    >
      <el-select
        @change="updatePlansList"
        v-model="dataForm.affiliationProvider"
        placeholder="- Obra social -"
      >

        <el-option
          v-for="item in obrasSociales"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>

    </el-form-item>

    <el-form-item
      label="Plan"
      prop="affiliationPlan"
    >

      <el-select
        v-model="dataForm.affiliationPlan"
        placeholder="- Selecciona plan -"
        no-data-text="Selecciona una obra social"
      >

        <el-option
          v-for="item in affiliationPlans"
          :key="item.id"
          :label="item.name"
          :value="item.machineName"
        />
      </el-select>

    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        @click="onSubmit(formElement)"
      >Guardar
      </el-button>
    </el-form-item>

  </el-form>
</template>
