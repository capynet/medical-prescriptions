<script lang="ts" setup>
import type {FormInstance, FormRules} from 'element-plus';
import {ref, reactive, watch} from 'vue'
import useMedicineDB from '@/composables/useMedicineDB';
import type Medicine from "@/models/Medicine";

export interface Props {
  dataForm?: any
}

const props = withDefaults(defineProps<Props>(), {
  dataForm: null
})

const emit = defineEmits(['saved'])

const dataForm = reactive({
  tradeName: props.dataForm?.tradeName ?? '',
  activeSubstance: props.dataForm?.activeSubstance ?? ''
})

watch(props, () => {
  dataForm.tradeName = props.dataForm?.tradeName
  dataForm.activeSubstance = props.dataForm?.activeSubstance
});

const {add, put} = useMedicineDB()
const formElement = ref<FormInstance>()


const rules = reactive<FormRules>({
  tradeName: [
    {required: true, message: 'El nombre comercial es requerido.'},
  ],
  activeSubstance: [
    {required: true, message: 'El principio activo es requerido.'},
  ]
})


const onSubmit = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid) => {
    if (valid) {

      const medicineObj: Medicine = {...dataForm, ...{author: 4}}

      if (props.dataForm?.id) {
        medicineObj.id = props.dataForm.id
        await put(medicineObj)
      } else {
        await add(medicineObj)
      }

      formEl.resetFields()
      emit('saved')
    } else {
      console.log('error submit!')
      return false
    }
  })
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
      label="Nombre comercial"
      prop="tradeName"
    >
      <el-input v-model="dataForm.tradeName"/>
    </el-form-item>

    <el-form-item
      label="Principio activo"
      prop="activeSubstance"
    >
      <el-input v-model="dataForm.activeSubstance"/>
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
