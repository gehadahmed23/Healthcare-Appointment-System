import { PrescriptionService } from './../../../core/service/prescription-service';
import { Appointment } from './../../admin/appointment/appointment';
import { PatientService } from './../../../core/service/patient-service';
import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../../core/service/doctor-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth-service';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppointmentService } from '../../../core/service/appointment-service';
import { IAppointment } from '../../../core/models/appointment';
import { CommonModule, JsonPipe } from '@angular/common';
import { Prescription } from '../../../core/models/prescription';

@Component({
  selector: 'app-prescription-form',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './prescription-form.html',
  styleUrl: './prescription-form.css',
})
export class PrescriptionForm implements OnInit {

  appointment!: IAppointment

  prescriptionForm: FormGroup;


  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private toast: ToastrService,
    private fb: FormBuilder,
    public router: Router,
    private appointmentService: AppointmentService,
    private PrescriptionService:PrescriptionService)
  {
     this.prescriptionForm = this.fb.group({
        diagnosis: ['',[Validators.required]],
        medications: this.fb.array([
          this.fb.group({
            name: ['', Validators.required],
            dosage: ['', Validators.required],
            frequency: ['', Validators.required],
            duration: ['', Validators.required]
          })
        ]),
        notes: [''],
      });
  }
  ngOnInit(): void {
    const appointmentId = this.route.snapshot.paramMap.get('id');
    if(appointmentId)
    {
      this.appointmentService.getById(appointmentId).subscribe({
       next: (data) => {
          this.appointment = data;
      },
      error:(err)=>{
        console.log("error fetching appointment", err)
      }
      })
    }
  }

  get diagnosis() {
    return this.prescriptionForm.get('diagnosis');
  }

  get notes() {
    return this.prescriptionForm.get('notes');
  }


  get medications(): FormArray {
    return this.prescriptionForm.get('medications') as FormArray;
  }
  addMedication() {
    this.medications.push(
      this.fb.group({
        name: [''],
        dosage: [''],
        frequency: [''],
        duration: ['']
      })
    );
  }

  removeMedication(index: number) {
  if (this.medications.length > 1) {
    this.medications.removeAt(index);
  }
}
  submit() {

    const prescription : Prescription = {
      appointmentId: this.appointment.id!,
      patientId: this.appointment.patientId,
      doctorId: this.appointment.doctorId,
      diagnosis: this.prescriptionForm.value.diagnosis,
      notes: this.prescriptionForm.value.notes,
      medications: this.prescriptionForm.value.medications,
      createdAt: new Date().toISOString().split('T')[0],
      id: '0'
    };

    console.log(prescription);

      if (prescription) {
        this.PrescriptionService.add(prescription).subscribe({
        next: (res) => {
          this.toast.success('Prescription added successfully');

          this.router.navigate(['/doctor/appointments']);
        },
        error: (err) => {
          console.log(err);
          this.toast.error('Something went wrong');
        }
      });
    }
  }
}
