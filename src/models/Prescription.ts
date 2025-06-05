import type PrescriptionMedicine from "@/models/PrescriptionMedicine";
import type Patient from "@/models/Patient";
import type User from "@/models/User";

export default interface Prescription {
    id?: string;
    created_at: Date
    author: User
    diagnosis: string
    patient: Patient
    prescribedMedicines: PrescriptionMedicine[]
}