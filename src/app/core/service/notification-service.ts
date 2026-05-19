import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { INotification } from '../models/inotification';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { IUser } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { IAppointment } from '../models/appointment';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private baseUrl = `${environment.baseUrl}/notifications`;
  private userUrl = `${environment.baseUrl}/users`;

  private notificationsSubject = new BehaviorSubject<INotification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient,
    private toast: ToastrService
  ) { }

  private getAdmins(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${this.userUrl}?role=admin`);
  }

  sendCustomNotification(recipientId: string, message: string, type: string, appId: string): Observable<INotification> {
    const notif: Partial<INotification> = {
      recipientId,
      message,
      type: type as any,
      appointmentId: appId,
      status: 'unread',
      createdAt: new Date().toISOString()
    };
    return this.http.post<INotification>(this.baseUrl, notif);
  }

  notifyBooking(appointment: IAppointment, patientName: string, doctorName: string): void {
    const appId = appointment.id!;

    const doctorMsg = `Patient ${patientName} has booked an appointment with you on ${appointment.date}.`;
    this.sendCustomNotification(appointment.doctorId, doctorMsg, 'appointment_booked', appId).subscribe();

    const adminMsg = `New booking: Patient ${patientName} has booked an appointment with ${doctorName} on ${appointment.date}.`;
    this.getAdmins().subscribe(admins => {
      admins.forEach(admin => {
        this.sendCustomNotification(admin.id, adminMsg, 'appointment_booked', appId).subscribe();
      });
    });
  }
  notifyUpdate(appointment: IAppointment, patientName: string, doctorName: string, updaterRole: string): void {
    const appId = appointment.id!;

    if (updaterRole === 'doctor' || updaterRole === 'admin') {
      const msg = `Your appointment status with ${doctorName} has been updated to ${appointment.status}.`;
      this.sendCustomNotification(appointment.patientId, msg, 'status_changed', appId).subscribe();
    }

    if (updaterRole === 'patient' || updaterRole === 'admin') {
      const msg = `Patient ${patientName} has updated the appointment date/time to ${appointment.date} at ${appointment.timeSlot}.`;
      this.sendCustomNotification(appointment.doctorId, msg, 'appointment_updated', appId).subscribe();
    }

    const adminMsg = `Appointment Update: Patient ${patientName} & ${doctorName}. Updated by: ${updaterRole}. Status: ${appointment.status}.`;
    this.getAdmins().subscribe(admins => {
      admins.forEach(admin => this.sendCustomNotification(admin.id, adminMsg, 'appointment_updated', appId).subscribe());
    });
  }

  loadNotifications(userId: string): void {
    const id = String(userId);
    this.http.get<INotification[]>(this.baseUrl).subscribe({
      next: (allNotifications) => {
        const userNotifs = allNotifications.filter(n => String(n.recipientId) === id);

        console.log('Filtered Notifications for user:', id, userNotifs);
        this.notificationsSubject.next(userNotifs.reverse());
      },
      error: (err) => console.error('Error fetching all notifications:', err)
    });
  }

  clearAll(userId: string | number): void {
    const currentUserId = String(userId);

    const currentNotifs = this.notificationsSubject.value;

    const userNotifs = currentNotifs.filter(n => String(n.recipientId) === currentUserId);

    if (userNotifs.length === 0) return;

    const deleteRequests = userNotifs.map(n =>
      this.http.delete(`${this.baseUrl}/${n.id}`)
    );

    forkJoin(deleteRequests).subscribe({
      next: () => {
        const remainingNotifs = currentNotifs.filter(n => String(n.recipientId) !== currentUserId);
        this.notificationsSubject.next(remainingNotifs);

        this.toast.success('Your notifications cleared successfully');
      },
      error: (err) => {
        console.error(err);
        this.toast.error('Failed to clear notifications');
      }
    });
  }
}
