import { PrescriptionService } from './../../../core/service/prescription-service';
import { Component, OnInit } from '@angular/core';
import { Prescription } from '../../../core/models/prescription';
import { IUser } from '../../../core/models/user';
import { IDoctor } from '../../../core/models/doctor';
import { AuthService } from '../../../core/service/auth-service';
import { DoctorService } from '../../../core/service/doctor-service';
import { PrescriptionCard } from "../prescription-card/prescription-card";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prescriptions',
  imports: [CommonModule,PrescriptionCard],
  templateUrl: './prescriptions.html',
  styleUrl: './prescriptions.css',
})
export class Prescriptions implements OnInit {
  prescriptions: Prescription[] | null = null
  user?: IUser;
  doctors?: IDoctor[];


  constructor(private PrescriptionService: PrescriptionService,
    private authService: AuthService,
    private doctorService: DoctorService
  ) {
  }
  ngOnInit(): void {
    this.authService.user$.subscribe({
      next: (user) => {
        if (user) {
          this.user = user as IUser;
          this.PrescriptionService.getAllByPatientId(this.user.id).subscribe({
            next: (data) => {
              this.prescriptions = data;
            }
          });
        }
      }
    })
  }
}
