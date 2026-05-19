import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IDoctor } from '../../../core/models/doctor';
import { DoctorService } from '../../../core/service/doctor-service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/service/auth-service';

@Component({
  selector: 'app-doctor-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './doctor-detail.html',
  styleUrl: './doctor-detail.css',
})
export class DoctorDetail implements OnInit {
  doctor?: IDoctor;
  id: string = '';
  userRating: number = 0;
  role?: string;
  constructor(private doctorService: DoctorService,
    private activateRoute: ActivatedRoute,
    private toast: ToastrService,
    public authService: AuthService
  ) { }
  ngOnInit(): void {
    this.loaddoctor()
  }
  private loaddoctor() {
    this.id = this.activateRoute.snapshot.paramMap.get('id') || '';
    this.doctorService.getDoctorById(this.id).subscribe({
      next: (data) => {
        this.doctor = data;
      },
      error: (err) => {
        this.toast.error('Failed to load Doctor details. Please try again later.', 'Access Denied')
      }
    });

    if (this.authService.isAuthenticated()) {
      this.role = this.authService.getRole();
    }
    else {
      this.role = '';
    }
  }
  rateDoctor(stars: number): void {
    if (!this.doctor) return;

    const currentCount = this.doctor.reviewCount || 0;
    const currentRating = this.doctor.rating || 0;
    this.userRating = stars;

    const newCount = currentCount + 1;
    const newRating = ((currentRating * currentCount) + stars) / newCount;

    this.doctor.rating = parseFloat(newRating.toFixed(1));
    this.doctor.reviewCount = newCount;

    this.doctorService.updateDoctor(this.id, { rating: this.doctor.rating, reviewCount: this.doctor.reviewCount }).subscribe({
      next: () => {
        this.loaddoctor();
        this.toast.success('Thank you for your rating!', 'Success');
      },
      error: () => {
        this.toast.error('Could not save your rating.', 'Error');
      }
    });
  }
}
