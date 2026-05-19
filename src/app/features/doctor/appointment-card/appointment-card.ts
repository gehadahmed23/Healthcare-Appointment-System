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

  CanAddPrescription: boolean = false;
  @Output() delete = new EventEmitter<string>();

  @Input() appointment!: IAppointment;
  @Output() OnDelete = new EventEmitter()
  patient: IUser | null = null;
  appointmentIdToDelete: string | null = null;
  doctor: IDoctor | null = null;

  constructor(private patientService: PatientService,
    private appointmentService: AppointmentService,
    private Toast: ToastrService,
    private route: Router,
    private confirmService: ConfirmDialogService,
    private doctorService: DoctorService
  ) { }


  ngOnInit(): void {

    this.loading();

  }

  private loading() {
    if (this.appointment && this.appointment.patientId) {
      this.patientService.getById(this.appointment.patientId).subscribe({
        next: (data) => {
          this.patient = data;

        },
        error: (err) => console.error('Error fetching doctor details', err)
      });

      this.doctorService.getDoctorById(this.appointment.doctorId).subscribe({
        next: (data) => {
          this.doctor = data;
        },
        error: (err) => console.error('Error fetching doctor details', err)
      });
    }
    const selectedDate = new Date(this.appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    if ((this.appointment.status === 'completed' || this.appointment.status === 'confirmed') && selectedDate <= today) {
      this.CanAddPrescription = true
    }
    else
      this.CanAddPrescription = false

    console.log(`this.CanAddPrescription${this.CanAddPrescription}, ${this.appointment.status}`)
  }

  onEdit(id?: string) {
    this.route.navigate(['/patient/appointmentForm', id]);
  }
  AddPrescription(id?: string) {
    this.route.navigate(['/doctor/prescriptionForm', id]);
  }

  updateStatus(newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') {
    if (!this.appointment.id) return;

    const updatedAppointment: IAppointment = { ...this.appointment, status: newStatus };

    this.appointmentService.update(updatedAppointment).subscribe({
      next: () => {
        this.appointment.status = newStatus;
        this.Toast.success(`Appointment marked as ${newStatus}`);
      },
      error: (err) => {
        console.error(err);
        this.Toast.error('Failed to update status');
      }
    });
    this.loading();
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
      'Delete Doctor',
      'Are you sure you want to remove this doctor from the system?'
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
