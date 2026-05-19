import { PatientService } from './../../../core/service/patient-service';
import { Component, OnInit } from '@angular/core';
import { IUser } from '../../../core/models/user';
import { CommonModule } from '@angular/common';
import { PatientCard } from "../patient-card/patient-card";

@Component({
  selector: 'app-patients-list',
  imports: [CommonModule, PatientCard],
  templateUrl: './patients-list.html',
  styleUrl: './patients-list.css',
})
export class PatientsList implements OnInit {

  patients!:IUser[];
  constructor(private PatientService:PatientService ) {
  }
  ngOnInit(): void {
     this.PatientService.getAll().subscribe({
        next: (data) => {
          this.patients = data
        },
        error: (err) => console.error('Error fetching patients', err)
    });
  }

}
