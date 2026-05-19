import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DoctorService } from '../../../core/service/doctor-service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/service/auth-service';

@Component({
  selector: 'app-doctor-form',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './doctor-form.html',
  styleUrl: './doctor-form.css',
})
export class DoctorForm implements OnInit {
  doctorForm!: FormGroup;
  isEditMode = false;
  doctorId: string | null = null;
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  imagePreview: string | null = null;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  passwordPattern = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$";
  role?: string;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    public authService: AuthService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.doctorId = this.route.snapshot.paramMap.get('id');
    if (this.doctorId) {
      this.isEditMode = true;
      this.loadDoctorData(this.doctorId);
    }
  }

  initForm() {
    this.doctorForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      specialization: ['', Validators.required],
      experience: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      bio: ['', [Validators.required, Validators.maxLength(500)]],
      avatar: [null],
      role: ['doctor'],
      rating: [0],
      reviewCount: [0],
      createdAt: [new Date()],
      availableSlots: this.fb.array([])
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.doctorForm.patchValue({ avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  get availableSlots() {
    return this.doctorForm.get('availableSlots') as FormArray;
  }

  addSlot() {
    const slotGroup = this.fb.group({
      day: ['Monday', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      isBooked: [false]
    });
    this.availableSlots.push(slotGroup);
  }

  removeSlot(index: number) {
    this.availableSlots.removeAt(index);
  }

  loadDoctorData(id: string) {
    this.doctorService.getDoctorById(id).subscribe({
      next: (doctor) => {
        this.doctorForm.patchValue(doctor);
        if (doctor.avatar) {
          this.imagePreview = doctor.avatar;
        }
        if (doctor.availableSlots) {
          this.availableSlots.clear();
          doctor.availableSlots.forEach((slot: any) => {
            this.availableSlots.push(this.fb.group(slot));
          });
        }
      },
      error: () => this.toastr.error('Failed to load doctor data')
    });

    if (this.authService.getToken!) {
      this.role = this.authService.getRole();
      if (this.role === 'doctor') {
        this.role = ''
      }
    }
    else {
      this.role = '';
    }
  }

  onSubmit() {
    if (this.doctorForm.invalid) {
      this.toastr.warning('Please fill all required fields correctly');
      return;
    }

    const doctorData = this.doctorForm.value;

    if (this.isEditMode && this.doctorId) {
      this.doctorService.updateDoctor(this.doctorId, doctorData).subscribe({
        next: () => {
          this.role = this.authService.getRole();
          console.log('Current Role:', this.role);
          this.toastr.success('Doctor updated successfully');
          if (this.role === 'admin') {
            this.router.navigate(['/admin/doctors']);
          }
          else if (this.role === 'doctor') {
            this.router.navigateByUrl('/doctor/details/' + this.doctorId);
          }

        },
        error: () => this.toastr.error('Update failed')
      });
    } else {
      this.doctorService.addDoctor(doctorData).subscribe({
        next: () => {
          this.toastr.success('Doctor added successfully');
          //this.router.navigate([`${this.role}/dashboard`]);
        },
        error: () => this.toastr.error('Add Doctor failed')
      });
    }
  }
}
