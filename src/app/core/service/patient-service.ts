import { IUser } from './../models/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class PatientService {

  private Patients = new BehaviorSubject<number>(0);
  Patients$ = this.Patients.asObservable();

  constructor(private http: HttpClient) { }

  private updateCount(count: number) {
    this.Patients.next(count);
  }
  getAll(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${environment.baseUrl}/users?role=patient`);
  }

  getById(id: string): Observable<IUser> {
    return this.http.get<IUser>(`${environment.baseUrl}/users/${id}`);
  }
  Add(patient: IUser): Observable<IUser> {
    patient.role = "patient";
    patient.isActive = true;
    return this.http.post<IUser>(`${environment.baseUrl}/users`, patient);
  }

  isEmailExists(email: string): Observable<boolean> {
    return this.http.get<IUser[]>(`${environment.baseUrl}/users`).pipe(
      map(users =>
        users.some(user => user.email.toLowerCase() === email.toLowerCase())
      )
    );
  }

  signup(user: IUser): Observable<IUser | null> {
    return this.isEmailExists(user.email).pipe(
      map(exists => {
        if (exists) {
          return null;
        }
        this.Add(user).subscribe();
        return user;
      })
    );
  }
  delete(id: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/users/${id}`);
  }
  deactivate(id: string): Observable<IUser> {
    return this.http.patch<IUser>(`${environment.baseUrl}/users/${id}`, { isActive: false });
  }

  activate(id: string): Observable<IUser> {
    return this.http.patch<IUser>(`${environment.baseUrl}/users/${id}`, { isActive: true });
  }

  getDeactivePatients(): Observable<IUser[]> {
    return this.http.get<IUser[]>(`${environment.baseUrl}/users?isActive=false`);
  }
  update(patient: Partial<IUser>): Observable<IUser> {
    return this.http.patch<IUser>(
      `${environment.baseUrl}/users/${patient.id}`,
      patient
    );
  }

  getNumberOfPatientInLastMonth(patient: IUser[]): IUser[] {
    const today = new Date();
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(today.getDate() - 30);

    return patient.filter(user => {
      const userDate = new Date(user.createdAt);
      return userDate >= thirtyDaysAgo && userDate <= today;
    });
  }

}
