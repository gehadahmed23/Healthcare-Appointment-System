import { Routes } from "@angular/router";
import { Dashboard } from "./dashboard/dashboard";
import { Schedule } from "./schedule/schedule";
import { Appointments } from "./appointments/appointments";
import { Main } from "./main/main";
import { DoctorDetail } from "../doctor-listing/doctor-detail/doctor-detail";
import { PatientProfile } from "../patient/profile/patient-profile/patient-profile";
import { PrescriptionForm } from "./prescription-form/prescription-form";
import { MedicalRecordList } from "../patient/medical-record-list/medical-record-list";
import { AllNotifications } from "../all-notifications/all-notifications";
import { DoctorForm } from "./doctor-form/doctor-form";
import { AppointmentForm } from "../patient/appointment-form/appointment-form";

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    component: Main,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'appointments', component: Appointments },
      { path: 'schedule/:id', component: Schedule },
      { path: 'medicalRecords/:id', component: MedicalRecordList },
      { path: 'details/:id', component: DoctorDetail },
      { path: 'patient/:id', component: PatientProfile },
      { path: 'prescriptionForm/:id', component: PrescriptionForm },
      { path: 'all-notifications', component: AllNotifications },
      { path: 'doctorform/:id', component: DoctorForm },
      { path: 'doctor/:id', component: DoctorDetail },
      { path: 'appointmentForm/:id', component: AppointmentForm },

    ]
  }
];
