import type { Provider } from '~/types'

export const useProviders = () => {
  const getProviders = async () => {
    const { data, error } = await useFetch('/api/providers')

    if (error.value) {
      throw error.value
    }

    return data.value?.data || []
  }

  const getProvider = async (id: string) => {
    const { data, error } = await useFetch(`/api/providers/${id}`)

    if (error.value) {
      throw error.value
    }

    return data.value?.data
  }

  return {
    getProviders,
    getProvider,
  }
}
