import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Prescription } from '../models/prescription';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionService {
  private prescriptionsCount = new BehaviorSubject<number>(0);
  prescriptionsCount$ = this.prescriptionsCount.asObservable();

  constructor(private http: HttpClient) { }

  private updateCount(count: number) {
    this.prescriptionsCount.next(count);
  }

  getAll(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${environment.baseUrl}/prescriptions`);
  }
  getAllByPatientId(patientId: string): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${environment.baseUrl}/prescriptions`).pipe(
      map(prescriptions =>
        prescriptions.filter(app => String(app.patientId) === String(patientId))
      )
    );
  }

  getById(id: string): Observable<Prescription> {
    return this.http.get<Prescription>(`${environment.baseUrl}/prescriptions/${id}`);
  }

  add(prescription: Prescription): Observable<Prescription> {
    return this.http.post<Prescription>(`${environment.baseUrl}/prescriptions`, prescription);
  }

  update(prescription: Prescription): Observable<Prescription> {
    return this.http.put<Prescription>(`${environment.baseUrl}/prescriptions/${prescription.id}`, prescription);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/prescriptions/${id}`);
  }
}
