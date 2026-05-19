import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MedicalRecord } from '../models/medical-record';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MedicalRecordService {

  private recordsCount = new BehaviorSubject<number>(0);
  recordsCount$ = this.recordsCount.asObservable();

  constructor(private http: HttpClient) { }

  private updateCount(count: number) {
    this.recordsCount.next(count);
  }

  getAll(): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${environment.baseUrl}/medicalRecords`);
  }


  getAllByPatientId(patientId: string): Observable<MedicalRecord[]> {
    return this.http.get<MedicalRecord[]>(`${environment.baseUrl}/medicalRecords`).pipe(
      map(medicalRecords =>
        medicalRecords.filter(app => String(app.patientId) === String(patientId))
      )
    );
  }

  getById(id: string): Observable<MedicalRecord> {
    return this.http.get<MedicalRecord>(`${environment.baseUrl}/medicalRecords/${id}`);
  }

  add(record: MedicalRecord): Observable<MedicalRecord> {
    return this.http.post<MedicalRecord>(`${environment.baseUrl}/medicalRecords`, record);
  }

  update(record: MedicalRecord): Observable<MedicalRecord> {
    return this.http.put<MedicalRecord>(`${environment.baseUrl}/medicalRecords/${record.id}`, record);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/medicalRecords/${id}`);
  }

}
