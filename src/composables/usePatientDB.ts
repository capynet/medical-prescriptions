import {doc, getDoc, addDoc, deleteDoc, getDocs, updateDoc, query, where, limit as limitResults, orderBy, startAfter, DocumentReference} from '@firebase/firestore'
import {patientCol as coll} from './firestoreModels'
import type Patient from '@/models/Patient'
import useSupabase from "@/composables/useSupabase";
import {useDebounceFn} from "@vueuse/core";

type Model = Patient
const {supabase} = useSupabase()

export default function usePatientDB() {

    const getById = async (id: string) => {
        const docRef = doc(coll, id)
        const elDoc = await getDoc(docRef)
        const data = elDoc.data()
        return {id, ...data}
    }

    const get = async <T>(limit: number = 100) => {
        const q = query(coll, limitResults(limit));

        const docs = await getDocs(q)
        const items: T[] = []

        docs.forEach((doc) => {
            items.push({id: doc.id, ...doc.data()} as unknown as T)
        })

        return items
    }

    const getBatch = async <T>(limit: number = 100, lastDoc: any = null) => {
        let q = query(coll, limitResults(limit), orderBy("affiliationId"));

        if (lastDoc !== null) {
            q = query(coll, limitResults(limit), orderBy("affiliationId"), startAfter(lastDoc),);
        }

        const docs = await getDocs(q)
        const items: T[] = []

        docs.forEach((doc) => {
            items.push({id: doc.id, ...doc.data()} as unknown as T)
        })

        const lastVisible = docs.docs[docs.docs.length - 1];

        return {items, lastVisible}
    }

    const putAtomic = async (id: string, partial: any) => {
        const docRef = doc(coll, id)
        return await updateDoc(docRef, partial);
    };

    const add = async (item: Model) => {
        return await supabase.from('patient').upsert(item)
    }

    const put = async (item: Model) => {
        return await supabase.from('patient').upsert(item)
    }

    const del = async (item: Model) => {
        return supabase.from('patient').delete().eq('id', item.id)
    }

    const textSearch = async (str: string) => {
        let processedStr = str

        if (str !== '' && str.search(/\s/)) {
            processedStr = "'" + str.split(' ').join("' & '") + "'"
        }

        const res = await supabase
            .from('patient')
            .select(`*, author(*), affiliationProvider(*)`)
            .textSearch('fts', `${processedStr}`)
            .limit(500)

        return res.data as Patient[]
    }

    return {
        textSearch,
        add,
        get,
        getBatch,
        getById,
        del,
        put,
        putAtomic
    }
}