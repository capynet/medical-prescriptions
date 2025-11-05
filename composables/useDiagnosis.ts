import type { Diagnosis } from '~/types'

export const useDiagnosis = () => {
  const getDiagnoses = async () => {
    const { data, error } = await useFetch('/api/diagnosis')

    if (error.value) {
      throw error.value
    }

    return data.value?.data || []
  }

  return {
    getDiagnoses,
  }
}
