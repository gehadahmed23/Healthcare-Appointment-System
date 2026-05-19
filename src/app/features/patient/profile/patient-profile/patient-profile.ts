import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { IUser } from './../../../../core/models/user';
import { PatientService } from './../../../../core/service/patient-service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../core/service/auth-service';

@Component({
  selector: 'app-patient-profile',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './patient-profile.html',
  styleUrl: './patient-profile.css',
})

export class PatientProfile implements OnInit {

  patient: IUser | null = null;
  isAdmin: boolean = false

  isDoctor: boolean = false

  role: string = '';

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {

    const idFromRoute = this.route.snapshot.paramMap.get('id');

    this.authService.user$.subscribe({
      next: (user) => {
        if (!user) return;
        this.role = user.role;
        const isAdminOrDoctor =
          user.role === 'admin' || user.role === 'doctor';
        if (user.role == 'admin')
          this.isAdmin = true

        if (user.role == 'doctor')
          this.isDoctor = true

        if (idFromRoute && isAdminOrDoctor) {
          this.patientService.getById(idFromRoute).subscribe({
            next: (data) => {
              this.patient = data;
            }
          });
        }
        else {
          this.patient = user as IUser;

          this.patientService.getById(this.patient.id).subscribe({
            next: (data) => {
              this.patient = data;
            }
          });
        }
      }
    });
  }
  deactivatePatient(id: string) {
    if (!this.patient) return;

    const updatedPatient = {
      ...this.patient,
      isActive: false
    };

    this.patientService.update(updatedPatient).subscribe({
      next: (data) => {
        this.patient = data;
      }
    });
  }
  activatePatient(id: string) {
    if (!this.patient) return;

    const updatedPatient = {
      ...this.patient,
      isActive: true
    };

    this.patientService.update(updatedPatient).subscribe({
      next: (data) => {
        this.patient = data;
      }
    });
  }
}


