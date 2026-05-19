import { Routes } from "@angular/router";
import { Dashboard } from "./dashboard/dashboard";
import { Prescriptions } from "./prescriptions/prescriptions";
import { Appointments } from "./appointments/appointments";
import { Main } from "./main/main";
import { DoctorList } from "../doctor-listing/doctor-list/doctor-list";
import { DoctorDetail } from "../doctor-listing/doctor-detail/doctor-detail";
import { PatientProfile } from "./profile/patient-profile/patient-profile";
import { AppointmentForm } from "./appointment-form/appointment-form";
import { PrescriptionDetails } from "./prescription-details/prescription-details";
import { MedicalRecordList } from "./medical-record-list/medical-record-list";
import { AllNotifications } from "../all-notifications/all-notifications";
import { EditProfile } from "./edit-profile/edit-profile";

export const PATIENT_ROUTES: Routes = [
  {
    path: '',
    component: Main,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'appointments', component: Appointments },
      { path: 'prescriptions', component: Prescriptions },
      { path: 'medicalRecords', component: MedicalRecordList },
      { path: 'doctors', component: DoctorList },
      { path: 'doctor/:id', component: DoctorDetail },
      { path: 'prescriptions/:id', component: PrescriptionDetails },
      { path: 'details/:id', component: PatientProfile },
      { path: 'appointmentForm/:id', component: AppointmentForm },
      { path: 'all-notifications', component: AllNotifications },
      { path: 'EditProfile/:id', component: EditProfile }

    ]
  }
];
