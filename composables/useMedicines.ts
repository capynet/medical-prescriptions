import type { Medicine, MedicineForm } from '~/types'

export const useMedicines = () => {
  const searchMedicines = async (search = '', limit = 50, offset = 0) => {
    const { data, error } = await useFetch('/api/medicines', {
      query: { search, limit, offset },
    })

    if (error.value) {
      throw error.value
    }

    return data.value
  }

  const createMedicine = async (medicineData: MedicineForm) => {
    const { data, error } = await useFetch('/api/medicines', {
      method: 'POST',
      body: medicineData,
    })

    if (error.value) {
      throw error.value
    }

    return data.value?.data
  }

  const updateMedicine = async (id: string, medicineData: MedicineForm) => {
    const { data, error } = await useFetch(`/api/medicines/${id}`, {
      method: 'PUT',
      body: medicineData,
    })

    if (error.value) {
      throw error.value
    }

    return data.value?.data
  }

  const deleteMedicine = async (id: string) => {
    const { data, error } = await useFetch(`/api/medicines/${id}`, {
      method: 'DELETE',
    })

    if (error.value) {
      throw error.value
    }

    return data.value
  }

  return {
    searchMedicines,
    createMedicine,
    updateMedicine,
    deleteMedicine,
  }
}
