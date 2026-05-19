import { Component, Input, OnInit } from '@angular/core';
import { Prescription } from '../../../core/models/prescription';
import { IDoctor } from '../../../core/models/doctor';
import { DoctorService } from '../../../core/service/doctor-service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-prescription-card',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './prescription-card.html',
  styleUrl: './prescription-card.css',
})
export class PrescriptionCard implements OnInit {
  @Input() prescription!: Prescription;
  doctor: IDoctor | null = null;

  constructor(private doctorService: DoctorService) { }
  ngOnInit(): void {

    if (this.prescription && this.prescription.doctorId) {
      this.doctorService.getDoctorById(this.prescription.doctorId).subscribe({
        next: (data) => {
          this.doctor = data;
        },
        error: (err) => console.error('Error fetching doctor details', err)
      });
    }
  }

}
