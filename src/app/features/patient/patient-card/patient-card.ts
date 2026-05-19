import { Component, Input, OnInit } from '@angular/core';
import { IUser } from '../../../core/models/user';
import { PatientService } from '../../../core/service/patient-service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from "@angular/router";

@Component({
  selector: 'app-patient-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './patient-card.html',
  styleUrl: './patient-card.css',
})
export class PatientCard implements OnInit {
  @Input() patient!: IUser;
  constructor(private patientService :PatientService,private route: ActivatedRoute) {
  }

  ngOnInit(): void {
  }
}
