import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/auth-service';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from '../../../core/service/patient-service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private UserService:PatientService
  ) {}

  ngOnInit(): void {

    if (this.authService.isAuthenticated()) {
      const role = this.authService.getRole();
      this.router.navigate([`/${role}`]);
    }
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
  if (this.registerForm.invalid) {
    this.registerForm.markAllAsTouched();
    return;
  }

  const registrationData = {
    id: '',
    name: this.registerForm.value.fullName,
    email: this.registerForm.value.email,
    password: this.registerForm.value.password,
    phone: '',
    role: 'patient' as const,
    createdAt: new Date().toISOString(),
    isActive: true
  };

  this.UserService.isEmailExists(registrationData.email).subscribe({
    next: (exists) => {
      if (exists) {
        this.toastr.error('Email already exists!', 'Error');
        return;
      }else{
        this.UserService.Add(registrationData).subscribe({
          next: () => {
            this.toastr.success('Welcome! Your account has been created.', 'Success');
            this.router.navigateByUrl('/login');
          },
          error: () => {
            this.toastr.error('Something went wrong!', 'Error');
          }
        });
      }
    },
    error: () => {
      this.toastr.error('Error checking email!', 'Error');
    }
  });
}
}
