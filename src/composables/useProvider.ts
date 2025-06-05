import useSupabase from "@/composables/useSupabase";
import type AffiliationProvider from "@/models/AffiliationProvider";

const {supabase} = useSupabase()
export default function useProvider() {

    const get = async (): Promise<AffiliationProvider[] | null> => {

        const supabaseQuery = await supabase
            .from('provider')
            .select(`*, provider_plans!inner(*)`)
            .returns<AffiliationProvider[]>()

        return supabaseQuery.data
    }

    const getById = async (id: number): Promise<AffiliationProvider | null> => {

        const supabaseQuery = await supabase
            .from('provider')
            .select(`*, plans:provider_plans!inner(*, provider:provider_id(*))`)
            .eq('id', id)
            .single<AffiliationProvider>()

        return supabaseQuery.data
    }

    const getByMachineName = async (id: string): Promise<AffiliationProvider | null> => {

        const supabaseQuery = await supabase
            .from('provider')
            .select(`*, plans:provider_plans!inner(*, provider:provider_id(*))`)
            .eq('machineName', id)
            .single<AffiliationProvider>()

        return supabaseQuery.data
    }

    return {
        get,
        getById,
        getByMachineName
    }
}