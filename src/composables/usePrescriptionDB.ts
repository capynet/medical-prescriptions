import type Prescription from '@/models/Prescription'
import useSupabase from "@/composables/useSupabase";

const {supabase} = useSupabase()
export default function usePrescriptionDB() {

    const getById = async (id: number | string): Promise<Prescription | null> => {
        const sqlQuery = `
            *, 
            author(*), 
            prescribedMedicines:prescription_medicines(
                id,
                instructions,
                qty,
                medicine:medicine_id(*),
                prescription:prescription_id(*)
            ), 
            patient!inner(
                *, 
                affiliationProvider!inner(*)
            )`


        const supabaseQuery = await supabase
            .from('prescription')
            .select(sqlQuery)
            .eq('id', id)
            .single<Prescription>()

        return supabaseQuery.data
    }

    const insert = async (item: Record<any, any>): Promise<Prescription | null> => {
        const medicines = item.medicines
        delete item.medicines

        const newPrescription = await supabase
            .from('prescription')
            .insert(item)
            .select()
            .single<Prescription>()

        // Now the  related medicines.
        for (const medicine of medicines) {
            await supabase
                .from('prescription_medicines')
                .insert({
                    prescription_id: newPrescription.data?.id,
                    medicine_id: medicine.medicineId,
                    qty: medicine.qty,
                    instructions: medicine.instructions
                })
        }

        return newPrescription.data?.id ? await getById(newPrescription.data?.id) as Prescription : null
    }

    // const put = async (item: Model) => {
    //
    // }
    //
    // const del = async (item: Model) => {
    //
    // }

    return {
        insert,
        getById,
    }
}