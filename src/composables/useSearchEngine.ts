import {useCentralStore} from '@/stores/centralStore';
import type Prescription from "@/models/Prescription";
import {isDebug} from '@/composables/useUtils'
import {reactive, ref} from "vue";
import useSupabase from "@/composables/useSupabase";
import type PrescriptionMedicine from "@/models/PrescriptionMedicine";


const {supabase} = useSupabase()

const currentAppliedFilters = ref<Record<any, any>>({})

// @todo I could pick current results information instead having my own object.
const prescriptionSearchState = reactive({
    totalHits: 0,
})

let searchParams = reactive<Record<any, any>>({
    page: 1,
    hitsPerPage: 50,
    filters: {}
})

export default function useSearchEngine() {
    const store = useCentralStore()

    const calcPagination = (page: number, qty: number) => {
        if (page === 1) return {from: 0, to: qty - 1}

        return {
            from: page * qty - qty,
            to: page * qty - 1
        }
    };

    const doSearchPrescriptions = async (options?: Record<any, any>, returnResults: boolean = false) => {
        let searchParamsFull: Record<any, any> = {}

        if (options !== null && !returnResults) {
            searchParams = {...searchParams, ...options}
            searchParamsFull = searchParams
        } else {
            searchParamsFull = {...searchParams, ...options}
        }

        const {from, to} = calcPagination(searchParamsFull.page, searchParamsFull.hitsPerPage);

        const sqlQuery = `
            *, 
            author(*), 
            prescription_medicines(
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

        const supabaseQuery = supabase
            .from('prescription')
            .select(sqlQuery, {count: 'exact'})
            .order('created_at', {ascending: false})
            .range(from, to)

        if (searchParamsFull.filters.from !== undefined) {
            supabaseQuery
                .gt('created_at', searchParamsFull.filters.from)
                .lt('created_at', searchParamsFull.filters.to)
        }

        if (searchParamsFull.filters.affiliationProvider !== undefined) {
            supabaseQuery
                .eq('patient.affiliationProvider.machineName', searchParamsFull.filters.affiliationProvider)
        }


        if (searchParamsFull.filters.author !== undefined) {
            supabaseQuery
                .eq('author', searchParamsFull.filters.author)
        }

        if (searchParamsFull.filters.providerPlan !== undefined && searchParamsFull.filters.providerPlan.length !== 0) {
            supabaseQuery
                .in('patient.affiliationPlan', searchParamsFull.filters.providerPlan)
        }

        if (searchParamsFull.filters.search !== undefined && searchParamsFull.filters.search !== '') {
            const rawValue = searchParamsFull.filters.search
            const processedStr = "'" + rawValue.split(' ').join("' & '") + "'"
            supabaseQuery.textSearch('patient.fullName', `${processedStr}`)
        }

        if (searchParamsFull.filters.userId !== undefined && searchParamsFull.filters.userId !== '') {
            supabaseQuery
                .eq('patient.userId', searchParamsFull.filters.userId)
        }

        if (searchParamsFull.filters.affiliationId !== undefined && searchParamsFull.filters.affiliationId !== '') {
            supabaseQuery
                .eq('patient.affiliationId', searchParamsFull.filters.affiliationId)
        }

        const resRaw = await supabaseQuery

        const res = resRaw.data?.map((item) => {
            item.prescribedMedicines = item.prescription_medicines.map((med: PrescriptionMedicine) => med)
            return item
        })

        if (isDebug) {
            // console.group("Search params");
            // console.log(`Paging from ${from} to ${to}`);
            // console.log(`Current page: ${searchParamsFull.page}`);
            // console.log(`Items per page ${searchParamsFull.hitsPerPage}`);
            // console.log(`Count ${resRaw.count}`);
            // console.log(searchParamsFull);
            // console.groupEnd();
        }

        // If caller did not specified for a raw result lets update global status.
        if (!returnResults) {
            store.prescriptions = res as Prescription[]
            prescriptionSearchState.totalHits = resRaw.count as number
            currentAppliedFilters.value = searchParamsFull
            // @todo Creo que return res no sirve para nada.
            return res
        }

        return res as Prescription[]
    }


    return {
        doSearchPrescriptions,
        prescriptionSearchState,
        searchParams,
        currentAppliedFilters
    }
}