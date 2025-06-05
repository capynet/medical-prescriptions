import type AffiliationPlan from "@/models/AffiliationPlan";

export default interface AffiliationProvider {
    id?: string;
    created?: Date
    name: string
    machineName: string
    plans: AffiliationPlan[]
}