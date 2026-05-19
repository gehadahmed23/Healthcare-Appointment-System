import { Routes } from "@angular/router";
import { DoctorList } from "./doctor-list/doctor-list";
import { DoctorDetail } from "./doctor-detail/doctor-detail";

export const DOCTOR_LIST_ROUTES: Routes = [
  {
    path: '',
    component: DoctorList
  },
  {
    path: 'details/:id',
    component: DoctorDetail
  }
];
