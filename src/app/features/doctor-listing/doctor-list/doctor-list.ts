import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { DoctorService } from '../../../core/service/doctor-service';
import { IDoctor } from '../../../core/models/doctor';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/auth-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-doctor-list',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './doctor-list.html',
  styleUrl: './doctor-list.css',
})
export class DoctorList implements OnInit {

  doctors: IDoctor[] = [];
  doctorsCount = 0;
  role?: string;

  private fb = inject(FormBuilder);
  filterForm: FormGroup = this.fb.group({
    fullName: [''],
    spec: [''],
    maxPrice: [null as number | null],
    day: ['']
  });

  constructor(private _DoctorService: DoctorService, private router: Router,
    public authService: AuthService,
    private Toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadAllDoctors();
    this._DoctorService.Doctors$.subscribe(count => this.doctorsCount = count);
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });

    if (this.authService.isAuthenticated()) {
      this.role = this.authService.getRole();
    }
    else {
      this.role = '';
    }
    console.log(`Role = ${this.role}`)
  }

  loadAllDoctors() {
    this._DoctorService.getAllDoctors().subscribe(data => this.doctors = data);
  }

  applyFilters() {
    const { fullName, spec, maxPrice, day } = this.filterForm.value;

    this._DoctorService.getDoctorsByFilters('', {
      fullName: fullName || undefined,
      spec: spec || undefined,
      maxPrice: maxPrice || undefined,
      day: day || undefined
    }).subscribe(data => this.doctors = data);
  }

  resetFilters() {
    this.filterForm.reset();
    this.loadAllDoctors();
  }

  onDelete(id: string) {
    this._DoctorService.deleteDoctor(id).subscribe({
      next: () => {
        this.Toast.success('Doctor Remove successfully')
        this.loadAllDoctors();
      },
      error: () => {
        this.Toast.error('Failed to delete appointment');
      }
    })

  }
}
