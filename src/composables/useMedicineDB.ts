import {doc, getDoc, addDoc, deleteDoc, getDocs, updateDoc, query, limit as limitResults, orderBy, startAfter} from '@firebase/firestore'
import { medicineCol as coll } from './firestoreModels'
import type Medicine from '@/models/Medicine'
import useSupabase from "@/composables/useSupabase";
type Model = Medicine
const {supabase} = useSupabase()

export default function useMedicineDB() {

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

  const getBatch = async <T>(limit: number = 100, lastDoc: any = null) => {
    let q = query(coll, limitResults(limit), orderBy("tradeName"));

    if (lastDoc !== null) {
      q = query(coll, limitResults(limit), orderBy("tradeName"), startAfter(lastDoc),);
    }

    const docs = await getDocs(q)
    const items: T[] = []

    docs.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as unknown as T)
    })

    const lastVisible = docs.docs[docs.docs.length - 1];

    return { items, lastVisible }
  }

  const add = async (item: Model) => {
    return await supabase.from('vademecum').upsert(item)
  }

  const put = async (item: Model) => {
    return await supabase.from('vademecum').upsert(item)
  }

  const del = async (item: Model) => {
    return await supabase.from('vademecum').delete().eq('id', item.id)
  }

    const textSearch = async (str: string) => {
        let processedStr = str

        if (str !== '' && str.search(/\s/)) {
            processedStr = "'" + str.split(' ').join("' & '") + "'"
        }


        const res = await supabase
            .from('vademecum')
            .select()
            .textSearch('fts', `${processedStr}`)
            .limit(500)

        return res.data as Medicine[]
    }


  return {
    textSearch,
    add,
    get,
    getById,
    del,
    put,
    getBatch
  }
}