import { PatientService } from './../../../core/service/patient-service';
import { Component, Input } from '@angular/core';
import { MedicalRecord } from '../../../core/models/medical-record';
import { IDoctor } from '../../../core/models/doctor';
import { DoctorService } from '../../../core/service/doctor-service';
import { IUser } from '../../../core/models/user';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-medical-record-card',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './medical-record-card.html',
  styleUrl: './medical-record-card.css',
})
export class MedicalRecordCard {

  @Input() medicalCard!: MedicalRecord;
   doctor: IDoctor | null = null;
   patient! :IUser

    constructor(private doctorService: DoctorService,private PatientService: PatientService) { }
    ngOnInit(): void {

      if (this.medicalCard && this.medicalCard.doctorId && this.medicalCard.patientId) {
        this.doctorService.getDoctorById(this.medicalCard.doctorId).subscribe({
          next: (data) => {
            this.doctor = data;
          },
          error: (err) => console.error('Error fetching doctor details', err)
        });
      }
    }

}
