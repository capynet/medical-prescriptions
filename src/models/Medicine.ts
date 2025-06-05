import type User from "@/models/User";

export default interface Medicine {
    id?: string | number;
    created_at?: Date
    tradeName: string
    activeSubstance: string
    author: User | number
}
