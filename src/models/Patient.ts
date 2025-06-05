import type User from "@/models/User";
import type AffiliationProvider from "@/models/AffiliationProvider";

export default interface Patient {
    id?: string | number;
    created?: Date
    updated?: Date
    affiliationId: string;
    affiliationPlan: string;
    affiliationProvider: AffiliationProvider | number;
    author: User | number
    fullName: string;
    userId: string;
}