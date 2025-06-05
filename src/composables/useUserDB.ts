import type User from '@/models/User'
import { doc, getDoc, getDocs } from '@firebase/firestore'
import { ref } from 'vue'
import { userCol as coll } from './firestoreModels'

export default function useUserDB() {
  const users = ref<User[]>([])
  
  const getById = async (id: string) => {
    const docRef = doc(coll, id)
    const elDoc = await getDoc(docRef)
    const data = elDoc.data()
    return { id, ...data }
  }

  const get = async <T>() => {
    const docs = await getDocs(coll)
    const items: T[] = []

    docs.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as unknown as T)
    })

    return items
  }

  const getUserFullName = async (id: string): Promise<string> => {
    // Ensure we have data.
    (users.value.length === 0) && (users.value = await get())

    for (const user of users.value) {
      if (user.id === id) {
        return `${user.name} ${user.surname}`
      }
    }

    return 'Desconocido'
  }

  return {
    get,
    getById,
    getUserFullName,
    users
  }
}