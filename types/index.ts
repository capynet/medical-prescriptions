// Types for the application based on Prisma models

export interface User {
  id: string
  created: Date
  name: string
  surname: string
}

export interface Provider {
  id: string
  created: Date
  name: string
  machineName: string
  plans?: ProviderPlan[]
}

export interface ProviderPlan {
  id: string
  providerId: string
  name: string
  machineName: string
  provider?: Provider
}

export interface Patient {
  id: string
  created: Date
  updated: Date
  fullName: string
  userId: string // DNI
  affiliationId: string
  affiliationPlan: string
  affiliationProvider: string
  author: string
  // Populated relations
  authorUser?: User
  provider?: Provider
  plan?: ProviderPlan
}

export interface Medicine {
  id: string
  createdAt: Date
  tradeName: string
  activeSubstance: string
  author: string
  // Populated relations
  authorUser?: User
}

export interface Diagnosis {
  id: string
  name: string
  machineName: string
}

export interface Prescription {
  id: string
  createdAt: Date
  author: string
  diagnosis: string
  patientId: string
  // Populated relations
  authorUser?: User
  diagnosisInfo?: Diagnosis
  patient?: Patient
  medicines?: PrescriptionMedicine[]
}

export interface PrescriptionMedicine {
  id: string
  prescriptionId: string
  medicineId: string
  qty: number
  instructions: string
  // Populated relations
  medicine?: Medicine
  prescription?: Prescription
}

// Form types
export interface PatientForm {
  fullName: string
  userId: string
  affiliationId: string
  affiliationProvider: string
  affiliationPlan: string
}

export interface MedicineForm {
  tradeName: string
  activeSubstance: string
}

export interface PrescriptionForm {
  patientId: string
  diagnosis: string
  medicines: {
    medicineId: string
    qty: number
    instructions: string
  }[]
}

// Filter types
export interface PrescriptionFilters {
  dateFrom?: Date
  dateTo?: Date
  patientName?: string
  userId?: string
  affiliationId?: string
  author?: string
  affiliationProvider?: string
  affiliationPlans?: string[]
  page?: number
  limit?: number
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
