import { PatientService } from './../../../core/service/patient-service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DoctorService } from '../../../core/service/doctor-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IDoctor } from '../../../core/models/doctor';
import { AuthService } from '../../../core/service/auth-service';
import { IUser } from '../../../core/models/user';
import { IAppointment } from '../../../core/models/appointment';
import { AppointmentService } from '../../../core/service/appointment-service';

@Component({
  selector: 'app-appointment-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.css',
})
export class AppointmentForm {
  // doctor?: IDoctor;
  // id: string = '';
  // patient?: IUser;
  // appointmentForm: FormGroup;


  constructor(private doctorService: DoctorService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private toast: ToastrService,
    private fb: FormBuilder,
    public router: Router,
    private appointmentService: AppointmentService,
    private PatientService: PatientService
  ) { }

  appointmentForm!: FormGroup;
  isEditMode = false;
  selectedDoctor: IDoctor | null = null;
  currentUserId?: string = '';
  isDeactive: boolean = false
  today: string = new Date().toISOString().split('T')[0];
  filteredSlots: any[] = [];
  user!: IUser;
  role?: string

  ngOnInit(): void {
    this.authService.user$.subscribe({
      next: (user) => {
        this.currentUserId = user?.id
        if (user) {
          this.PatientService.getById(user?.id).subscribe({
            next: (user) => {
              if (user?.isActive == false) {
                this.isDeactive = true;
              }
              else
                this.isDeactive = false
            }

          })
        }
        console.log(user?.isActive, this.user, user?.id)
      }
    });

    this.initForm();

    const idFromUrl = this.route.snapshot.paramMap.get('id');

    if (idFromUrl) {
      this.checkIfEditOrAdd(idFromUrl);
    }
  }

  initForm() {
    this.appointmentForm = this.fb.group({
      date: ['', [Validators.required]],
      timeSlot: ['', [Validators.required]],
    });

    this.appointmentForm.get('date')?.valueChanges.subscribe(value => {
      this.filterSlotsByDate(value);
    });
  }
  getAvailableDaysNames(): string[] {
    if (!this.selectedDoctor) return [];
    return [...new Set(this.selectedDoctor.availableSlots.filter(s => s.isBooked === false).map(s => s.day))];
  }
  filterSlotsByDate(dateString: string) {
    if (!dateString || !this.selectedDoctor) {
      this.filteredSlots = [];
      return;
    }

    const selectedDate = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[selectedDate.getDay()];

    this.filteredSlots = this.selectedDoctor.availableSlots.filter(slot =>
      slot.day === dayName && slot.isBooked === false
    );

    this.appointmentForm.get('timeSlot')?.setValue('');
  }
  checkIfEditOrAdd(id: string) {
    this.appointmentService.getById(id).subscribe({
      next: (appointment) => {
        this.isEditMode = true;
        this.appointmentForm.patchValue(appointment);
        this.loadDoctorInfo(appointment.doctorId);
      },
      error: () => {
        this.isEditMode = false;
        this.loadDoctorInfo(id);
      }
    });
  }

  loadDoctorInfo(doctorId: string) {
    this.doctorService.getDoctorById(doctorId).subscribe({
      next: (doc) => {
        this.selectedDoctor = doc;
        this.appointmentForm.patchValue({ doctorId: doc.id });
        const currentDate = this.appointmentForm.get('date')?.value;
        if (currentDate) {
          this.filterSlotsByDate(currentDate);
        }
      }
    });
  }

  onSubmit() {
    if (this.appointmentForm.invalid || !this.selectedDoctor || !this.currentUserId) {
      this.toast.warning('Please complete the form and ensure you are logged in.');
      return;
    }

    const formData = this.appointmentForm.value;
    const selectedSlotValue = formData.timeSlot;

    const selectedDate = new Date(formData.date);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const selectedDayName = days[selectedDate.getDay()];

    if (!this.isEditMode) {
      const appointmentData: IAppointment = {
        ...formData,
        patientId: this.currentUserId,
        doctorId: this.selectedDoctor.id,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      this.appointmentService.add(appointmentData).subscribe({
        next: () => {
          const updatedSlots = this.selectedDoctor!.availableSlots.map(slot => {
            const slotRange = `${slot.startTime} - ${slot.endTime}`;
            if (slotRange === selectedSlotValue && slot.day === selectedDayName) return { ...slot, isBooked: true };
            return slot;
          });
          this.updateDoctorSlots(updatedSlots, 'Appointment booked successfully!');
        }
      });
    }
    else {
      const id = this.route.snapshot.paramMap.get('id')!;
      this.appointmentService.getById(id).subscribe((oldApp) => {
        const oldDate = new Date(oldApp.date);
        const oldDayName = days[oldDate.getDay()];
        const appointmentData: IAppointment = {
          ...oldApp,
          ...formData
        };

        this.appointmentService.update(appointmentData).subscribe({
          next: () => {
            const updatedSlots = this.selectedDoctor!.availableSlots.map(slot => {
              const slotRange = `${slot.startTime} - ${slot.endTime}`;
              if (slotRange === selectedSlotValue && slot.day === selectedDayName) return { ...slot, isBooked: true };
              if (slotRange === oldApp.timeSlot && slot.day === oldDayName) {
                if (selectedSlotValue !== oldApp.timeSlot || selectedDayName !== oldDayName) {
                  return { ...slot, isBooked: false };
                }
              }
              return slot;
            });
            this.updateDoctorSlots(updatedSlots, 'Appointment updated successfully!');
          }
        });
      });
    }
  }

  private updateDoctorSlots(updatedSlots: any[], successMessage: string) {
    this.doctorService.updateDoctor(this.selectedDoctor!.id, { availableSlots: updatedSlots }).subscribe({
      next: () => {
        this.toast.success(successMessage);
        this.appointmentForm.reset();
        this.router.navigateByUrl(`/patient/appointments`);
      },
      error: () => {
        this.toast.warning('Process completed, but doctor schedule update failed.');
        this.router.navigateByUrl(`/patient/appointments`);
      }
    });
  }

}
