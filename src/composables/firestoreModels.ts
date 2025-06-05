import { getFirestore, CollectionReference, collection, type DocumentData } from 'firebase/firestore'
import type User from '@/models/User'
import type Medicine from '@/models/Medicine'
import type Patient from '@/models/Patient'
import type Prescription from '@/models/Prescription'

export const firestoreDb = getFirestore()

// This is just a helper to add the type to the db responses
const createCollection = <T = DocumentData>(collectionName: string) => {
    return collection(firestoreDb, collectionName) as CollectionReference<T>
}

// Export all your collections
export const patientCol = createCollection<Patient>('patient')
export const medicineCol = createCollection<Medicine>('vademecum')
export const prescriptionCol = createCollection<Prescription>('prescription')
export const userCol = createCollection<User>('user')
