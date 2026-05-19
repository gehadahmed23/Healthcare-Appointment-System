import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IAppointment } from '../../../core/models/appointment';
import { IDoctor } from '../../../core/models/doctor';
import { IUser } from '../../../core/models/user';
import { AppointmentService } from '../../../core/service/appointment-service';
import { PatientService } from '../../../core/service/patient-service';
import { DoctorService } from '../../../core/service/doctor-service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogService } from '../../../core/service/confirm-dialog-service';

@Component({
  selector: 'app-appointment-card',
  imports: [CommonModule, RouterLink, RouterModule,],
  templateUrl: './appointment-card.html',
  styleUrl: './appointment-card.css',
})
export class AppointmentCard implements OnInit {
  @Input() appointment!: IAppointment;
  @Output() OnDelete = new EventEmitter()
  @Output() delete = new EventEmitter<string>();
  doctor: IDoctor | null = null;
  appointmentIdToDelete: string | null = null;

  constructor(private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private Toast: ToastrService,
    private route: Router,
    private confirmService: ConfirmDialogService
  ) { }
  ngOnInit(): void {

    if (this.appointment && this.appointment.doctorId) {
      this.doctorService.getDoctorById(this.appointment.doctorId).subscribe({
        next: (data) => {
          this.doctor = data;
        },
        error: (err) => console.error('Error fetching doctor details', err)
      });
    }
  }

  onEdit(id?: string) {
    this.route.navigate(['/patient/appointmentForm', id]);
  }

  private updateDoctorAvailability() {
    if (!this.doctor || !this.doctor.availableSlots) {
      this.OnDelete.emit();
      return;
    }

    const updatedDoctor = { ...this.doctor };

    const [appStart, appEnd] = this.appointment.timeSlot.split(' - ');

    const appointmentDate = new Date(this.appointment.date);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const appointmentDay = days[appointmentDate.getDay()];

    const slotIndex = updatedDoctor.availableSlots.findIndex((s: any) =>
      s.day === appointmentDay &&
      s.startTime === appStart &&
      s.endTime === appEnd
    );

    if (slotIndex > -1) {
      updatedDoctor.availableSlots[slotIndex].isBooked = false;

      this.doctorService.updateDoctor(updatedDoctor.id, updatedDoctor).subscribe({
        next: () => {
          this.Toast.success('Appointment cancelled and slot is free now');
          this.OnDelete.emit();
        },
        error: (err) => {
          console.error('Error updating doctor slot:', err);
          this.OnDelete.emit();
        }
      });
    } else {
      console.warn('Matching slot not found for day/time comparison');
      this.OnDelete.emit();
    }
  }

  async confirmDelete() {
    const confirmed = await this.confirmService.confirm(
      'Cancel appointment',
      'Are you sure you want to Cancel this appointment'
    );
    if (confirmed) {
      this.appointmentService.delete(this.appointment.id).subscribe({
        next: () => {
          this.updateDoctorAvailability();
        },
        error: (err) => {
          this.Toast.error("Faild To Confirm Delete")
        }
      });
    }
  }

}
