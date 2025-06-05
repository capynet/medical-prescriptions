import type AffiliationProvider from "@/models/AffiliationProvider";

export default interface AffiliationPlan {
    id?: string;
    provider: AffiliationProvider
    name: string
    machineName: string
}