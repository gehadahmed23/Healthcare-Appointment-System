import { Routes } from "@angular/router";
import { DoctorDetail } from "../doctor-listing/doctor-detail/doctor-detail";
import { DoctorList } from "../doctor-listing/doctor-list/doctor-list";
import { Dashboard } from "./dashboard/dashboard";
import { Appointment } from "./appointment/appointment";
import { Main } from "./main/main";
import { PatientsList } from "../patient/patients-list/patients-list";
import { PatientProfile } from "../patient/profile/patient-profile/patient-profile";
import { AllNotifications } from "../all-notifications/all-notifications";
import { DoctorForm } from "../doctor/doctor-form/doctor-form";
import { AppointmentForm } from "../patient/appointment-form/appointment-form";

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: Main,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'doctors', component: DoctorList },
      { path: 'patients', component: PatientsList },
      { path: 'doctor/:id', component: DoctorDetail },
      { path: 'appointments', component: Appointment },
      { path: 'patients/:id', component: PatientProfile },
      { path: 'all-notifications', component: AllNotifications },
      { path: 'doctorform', component: DoctorForm },
      { path: 'doctorform/:id', component: DoctorForm },
      { path: 'appointmentForm/:id', component: AppointmentForm },
    ]
  }
];
