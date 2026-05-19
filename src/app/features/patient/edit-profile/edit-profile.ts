import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/auth-service';
import { PatientService } from '../../../core/service/patient-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-profile',
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile implements OnInit {
  patientForm!: FormGroup;
  imagePreview: string | null = null;
  userId: string | null = null;

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  passwordPattern = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$";
  phonePattern = "^01[0125][0-9]{8}$";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private patientService: PatientService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userId = user.id;
        this.patientForm.patchValue({
          name: user.name,
          email: user.email,
          password: user.password,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
          isActive: user.isActive
        });
        if (user.avatar) {
          this.imagePreview = user.avatar;
        }
      }
    });
  }

  initForm() {
    this.patientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      phone: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      avatar: [null],
      role: ['patient'],
      isActive: [true]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.patientForm.patchValue({ avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.patientForm.invalid || !this.userId) {
      this.toastr.warning('Form is invalid or User ID not found');
      return;
    }

    const updatedData = { ...this.patientForm.value, id: this.userId };

    this.patientService.update(updatedData).subscribe({
      next: () => {
        this.toastr.success('Profile updated successfully!');
      },
      error: () => {
        this.toastr.error('Failed to update profile');
      }
    });
  }
}
