import { Component, OnInit } from '@angular/core';
import { IAppointment } from '../../../core/models/appointment';
import { IUser } from '../../../core/models/user';
import { IDoctor } from '../../../core/models/doctor';
import { AppointmentService } from '../../../core/service/appointment-service';
import { AuthService } from '../../../core/service/auth-service';
import { DoctorService } from '../../../core/service/doctor-service';
import { AppointmentCard } from "../appointment-card/appointment-card";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-appointments',
  imports: [AppointmentCard, CommonModule],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments implements OnInit {
  appointments: IAppointment[] | null = null
  user?: IDoctor;
  selectedAppointmentId: string | null = null;


  constructor(private appointmentService: AppointmentService,
    private authService: AuthService,
  ) {
  }
  ngOnInit(): void {
    this.ReloadData();
  }

  ReloadData() {
    this.authService.user$.subscribe({
      next: (user) => {
        if (user) {
          this.user = user as IDoctor;
          this.appointmentService.getAllByDoctorId(this.user.id).subscribe({
            next: (data) => {
              this.appointments = data;
            }
          });
        }
      }
    });
  }


}
