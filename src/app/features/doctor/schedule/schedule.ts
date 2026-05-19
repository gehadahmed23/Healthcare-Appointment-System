import { Component } from '@angular/core';
import { DoctorService } from '../../../core/service/doctor-service';
import { ToastrService } from 'ngx-toastr';
import { IDoctor, TimeSlot } from '../../../core/models/doctor';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/service/auth-service';

@Component({
  selector: 'app-schedule',
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule.html',
  styleUrl: './schedule.css',
})
export class Schedule {
  doctor?: IDoctor;
  activeDay: string = 'Monday';
  weekDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  newSlot = { session: 'Morning', from: '09:00', to: '10:00' };

  constructor(private doctorService: DoctorService, private toast: ToastrService,
    private authService: AuthService) { }

  ngOnInit() {
    this.loadDoctorData();
  }

  loadDoctorData() {
    this.authService.user$.subscribe({
      next: (user) => {
        this.doctorService.getDoctorById(user?.id!).subscribe(data => {
          this.doctor = data;
        });
      }
    })

  }

  getSlotsByDay(day: string) {
    return this.doctor?.availableSlots?.filter((s: TimeSlot) => s.day === day) || [];
  }

  addNewSlot() {
    if (!this.newSlot.from || !this.newSlot.to) return;

    const slot = {
      day: this.activeDay,
      startTime: this.newSlot.from,
      endTime: this.newSlot.to,
      session: this.newSlot.session,
      isBooked: false
    };

    this.doctor!.availableSlots.push(slot);
    this.toast.info('Slot added to list (unsaved)');
  }

  deleteSlot(slotToDelete: TimeSlot) {
    this.doctor!.availableSlots = this.doctor!.availableSlots.filter((s: TimeSlot) => s !== slotToDelete);
  }

  saveSchedule() {
    this.doctorService.updateDoctor(this.doctor!.id, this.doctor!).subscribe({
      next: () => {
        this.toast.success('Schedule saved to your profile!');

      },
      error: () => this.toast.error('Failed to update schedule')
    });
  }
}
