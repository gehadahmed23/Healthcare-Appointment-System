import { Prescription } from "./prescription";

export interface MedicalRecord {

  id: string;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  diagnosis: string;
  prescription?: Prescription;
  notes: string;
  date: string;
}
