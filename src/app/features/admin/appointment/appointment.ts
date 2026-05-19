import { DoctorService } from './../../../core/service/doctor-service';
import { PatientService } from './../../../core/service/patient-service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../../core/service/appointment-service';
import { ActivatedRoute } from '@angular/router';
import { IAppointment } from '../../../core/models/appointment';
import { IDoctor } from '../../../core/models/doctor';
import { IUser } from '../../../core/models/user';
import { AppointmentCard } from "../appointment-card/appointment-card";

@Component({
  selector: 'app-appointment',
  imports: [CommonModule, AppointmentCard],
  templateUrl: './appointment.html',
  styleUrl: './appointment.css',
})
export class Appointment implements OnInit {
  appointments: IAppointment[]|null=null


  constructor(private appointmentService: AppointmentService) {
  }
  ngOnInit(): void {
    this.appointmentService.getAll().subscribe({
        next: (data) => {
          this.appointments = data
        },
        error: (err) => console.error('Error fetching appointments', err)
    });

   }


}
