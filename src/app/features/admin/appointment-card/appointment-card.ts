import { Component, Input, OnInit } from '@angular/core';
import { IAppointment } from '../../../core/models/appointment';
import { IDoctor } from '../../../core/models/doctor';
import { IUser } from '../../../core/models/user';
import { AppointmentService } from '../../../core/service/appointment-service';
import { PatientService } from '../../../core/service/patient-service';
import { DoctorService } from '../../../core/service/doctor-service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-appointment-card',
  imports: [CommonModule,RouterLink, RouterModule,],
  templateUrl: './appointment-card.html',
  styleUrl: './appointment-card.css',
})
export class AppointmentCard implements OnInit {
  @Input() appointment!: IAppointment;
  doctor:IDoctor|null=null;
  patient:IUser|null=null;
  doctorId: string |null=null;
  patientId: string |null=null;

  constructor(private appointmentService: AppointmentService, private patientService :PatientService, private doctorService: DoctorService) {

  }
  ngOnInit(): void {

    const AppointmentId = this.appointment.id;
    if (AppointmentId !=null)
    {
       this.appointmentService.getById(AppointmentId).subscribe({
        next: (data) => {
          this.appointment = data
          this.doctorId =data.doctorId
          this.patientId=data.patientId
           if (this.doctorId){
       this.doctorService.getDoctorById(this.doctorId).subscribe({
        next: (data) => {

          this.doctor =data

        },
        error: (err) => console.error('Error fetching doctor', err)
    });
  }

     if (this.patientId){
       this.patientService.getById(this.patientId).subscribe({
          next: (data) => {
            this.patient =data
          },
          error: (err) => console.error('Error fetching patient', err)
        });

      }
        },
        error: (err) => console.error('Error fetching appointment', err)
    });
    }
  }

}
