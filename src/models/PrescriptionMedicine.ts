import type Prescription from "@/models/Prescription";
import type Medicine from "@/models/Medicine";

export default interface PrescriptionMedicine {
    id?: number;
    prescription: Prescription;
    medicine: Medicine;
    qty: number;
    instructions: string;
}