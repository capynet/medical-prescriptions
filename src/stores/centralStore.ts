import {ref} from 'vue'
import {defineStore} from 'pinia'
import type PrescriptionMedicine from '@/models/PrescriptionMedicine'
import type Patient from '@/models/Patient'
import type Medicine from '@/models/Medicine'
import type Prescription from '@/models/Prescription'
import type AffiliationProvider from "@/models/AffiliationProvider";
import useSupabase from "@/composables/useSupabase";

const {supabase} = useSupabase()

export const useCentralStore = defineStore('centralStore', {
    state: () => {
        return {
            vademecum: ref<Medicine[]>([]),
            selectedMedicines: ref<PrescriptionMedicine[]>([]),
            patients: ref<Patient[]>([]),
            selectedPatient: ref<Patient>(),
            commonInstructions: ref<Record<string, string>[]>([]),
            autocompleteSelectedItemText: ref(''),
            prescriptions: ref<Prescription[]>([]),
            diagnosis: ref<Record<string, string>[]>([]),
            selectedDiagnosis: ref(''),
            dialogMedicineAddFormVisible: ref(false),
            currentEditedPatient: ref<Patient>(),
            currentEditedMedicine: ref<Medicine>(),
            currentPDFInfo: ref<Prescription>(),
            currentPDFReportInfo: ref<{ affiliationProvider: AffiliationProvider, items: any[] }>(),
        }
    },

    actions: {
        async getDiagnosis() {
            if (this.diagnosis.length === 0) {
                const res = await supabase.from('diagnosis').select('*')
                this.diagnosis = res.data as Record<any, any>[]
            }

            return this.diagnosis
        },
    },
})

