import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppointmentCard } from '../appointment-card/appointment-card';
import { AppointmentService } from '../../../core/service/appointment-service';
import { IAppointment } from '../../../core/models/appointment';
import { AuthService } from '../../../core/service/auth-service';
import { IUser } from '../../../core/models/user';
import { IDoctor } from '../../../core/models/doctor';
import { DoctorService } from '../../../core/service/doctor-service';
import { ConfirmDialogService } from '../../../core/service/confirm-dialog-service';

@Component({
  selector: 'app-appointments',
  imports: [CommonModule, AppointmentCard],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments implements OnInit {
  appointments: IAppointment[] | null = null
  user?: IUser;
  doctors?: IDoctor[];
  selectedAppointmentId: string | null = null;


  constructor(private appointmentService: AppointmentService,
    private authService: AuthService,
    private doctorService: DoctorService,
    private confirmService: ConfirmDialogService
  ) {
  }
  ngOnInit(): void {
    this.ReloadData();
  }
  ReloadData() {
    this.authService.user$.subscribe({
      next: (user) => {
        if (user) {
          this.user = user as IUser;
          this.appointmentService.getAllByPatientId(this.user.id).subscribe({
            next: (data) => {
              this.appointments = data;
            }
          });
        }
      }
    })
  }

  prepareDelete(id: string) {
    this.selectedAppointmentId = id;
  }



}
