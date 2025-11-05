import type { Patient, PatientForm } from '~/types'

export const usePatients = () => {
  const searchPatients = async (search = '', limit = 50, offset = 0) => {
    const { data, error } = await useFetch('/api/patients', {
      query: { search, limit, offset },
    })

    if (error.value) {
      throw error.value
    }

    return data.value
  }

  const createPatient = async (patientData: PatientForm) => {
    const { data, error } = await useFetch('/api/patients', {
      method: 'POST',
      body: patientData,
    })

    if (error.value) {
      throw error.value
    }

    return data.value?.data
  }

  const updatePatient = async (id: string, patientData: PatientForm) => {
    const { data, error } = await useFetch(`/api/patients/${id}`, {
      method: 'PUT',
      body: patientData,
    })

    if (error.value) {
      throw error.value
    }

    return data.value?.data
  }

  const deletePatient = async (id: string) => {
    const { data, error } = await useFetch(`/api/patients/${id}`, {
      method: 'DELETE',
    })

    if (error.value) {
      throw error.value
    }

    return data.value
  }

  return {
    searchPatients,
    createPatient,
    updatePatient,
    deletePatient,
  }
}
