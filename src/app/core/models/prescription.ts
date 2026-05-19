import { Medication } from "./medication";

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  medications: Medication[];
  diagnosis: string;
  notes?: string;
  createdAt: string;
}
