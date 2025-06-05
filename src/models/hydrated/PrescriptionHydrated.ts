import type { Ref } from "vue";
import type Prescription from "@/models/Prescription";

export default interface PrescriptionHydrated extends Prescription {
    authorLabel: Ref,
    diagnosisLabel: string
}