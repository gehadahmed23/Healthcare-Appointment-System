import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { IAppointment } from '../models/appointment';
import { NotificationService } from './notification-service';
import { PatientService } from './patient-service';
import { DoctorService } from './doctor-service';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {


  private appointmentsCount = new BehaviorSubject<number>(0);
  appointmentsCount$ = this.appointmentsCount.asObservable();

  constructor(private http: HttpClient,
    private notifService: NotificationService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private authService: AuthService
  ) { }

  private updateCount(count: number) {
    this.appointmentsCount.next(count);
  }

  getAll(): Observable<IAppointment[]> {
    return this.http.get<IAppointment[]>(`${environment.baseUrl}/appointments`);
  }

  getAllByPatientId(patientId: string): Observable<IAppointment[]> {
    return this.http.get<IAppointment[]>(`${environment.baseUrl}/appointments`).pipe(
      map(appointments =>
        appointments.filter(app => String(app.patientId) === String(patientId))
      )
    );
  }

  getAllByDoctorId(doctorId: string): Observable<IAppointment[]> {
    return this.http.get<IAppointment[]>(`${environment.baseUrl}/appointments`).pipe(
      map(appointments =>
        appointments.filter(app => String(app.doctorId) === String(doctorId))
      )
    );
  }

  getById(id: string): Observable<IAppointment> {
    return this.http.get<IAppointment>(`${environment.baseUrl}/appointments/${id}`);
  }

  add(appointment: IAppointment): Observable<IAppointment> {
    return this.http.post<IAppointment>(`${environment.baseUrl}/appointments`, appointment).pipe(
      tap((newApp) => {
        forkJoin({
          patient: this.patientService.getById(newApp.patientId),
          doctor: this.doctorService.getDoctorById(newApp.doctorId)
        }).subscribe(res => {
          this.notifService.notifyBooking(newApp, res.patient.name, res.doctor.name);
        });
      })
    );
  }

  update(appointment: IAppointment): Observable<IAppointment> {
    return this.http.put<IAppointment>(`${environment.baseUrl}/appointments/${appointment.id}`, appointment).pipe(
      tap((updatedApp) => {
        const currentRole = this.authService.getRole()!;
        forkJoin({
          patient: this.patientService.getById(updatedApp.patientId),
          doctor: this.doctorService.getDoctorById(updatedApp.doctorId)
        }).subscribe(res => {
          this.notifService.notifyUpdate(updatedApp, res.patient.name, res.doctor.name, currentRole);
        });
      })
    );
  }

  delete(id?: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/appointments/${id}`);
  }


  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getDay() === date2.getDay() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  getPastAppointments(appointments: IAppointment[]): IAppointment[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments.filter(app => {
      const appDate = new Date(app.date);
      appDate.setHours(0, 0, 0, 0);

      return appDate < today;
    });
  }

  getUpcomingAppointments(appointments: IAppointment[]): IAppointment[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments.filter(app => {
      const appDate = new Date(app.date);
      appDate.setHours(0, 0, 0, 0);

      return appDate > today;
    });
  }

  getTodayAppointments(appointments: IAppointment[]): IAppointment[] {
    const today = new Date();

    return appointments.filter(app =>
      this.isSameDay(new Date(app.date), today)
    );
  }


  getNumberOfAppointmentInLastMonth(appointment: IAppointment[]): IAppointment[] {
    const today = new Date();
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(today.getDate() - 30);

    return appointment.filter(app => {
      const appDate = new Date(app.createdAt);
      return appDate >= thirtyDaysAgo && appDate <= today;
    });
  }
}
