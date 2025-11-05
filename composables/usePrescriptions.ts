import type { Prescription, PrescriptionForm, PrescriptionFilters } from '~/types'

export const usePrescriptions = () => {
  const searchPrescriptions = async (filters: PrescriptionFilters = {}) => {
    const { data, error } = await useFetch('/api/prescriptions', {
      query: filters,
    })

    if (error.value) {
      throw error.value
    }

    return data.value
  }

  const getPrescription = async (id: string) => {
    const { data, error } = await useFetch(`/api/prescriptions/${id}`)

    if (error.value) {
      throw error.value
    }

    return data.value?.data
  }

  const createPrescription = async (prescriptionData: PrescriptionForm) => {
    const { data, error } = await useFetch('/api/prescriptions', {
      method: 'POST',
      body: prescriptionData,
    })

    if (error.value) {
      throw error.value
    }

    return data.value?.data
  }

  return {
    searchPrescriptions,
    getPrescription,
    createPrescription,
  }
}
