import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { IDoctor } from '../models/doctor';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {

  private Doctors = new BehaviorSubject<number>(0);
  Doctors$ = this.Doctors.asObservable();

  constructor(private http: HttpClient) { }

  private updateCount(count: number) {
    this.Doctors.next(count);
  }
  getAllDoctors(): Observable<IDoctor[]> {
    return this.http.get<IDoctor[]>(`${environment.baseUrl}/users?role=doctor`).pipe(
      map(doctors => {
        this.updateCount(doctors.length);
        return doctors;
      })
    );
  }

  getDoctorById(id: string): Observable<IDoctor> {
    return this.http.get<IDoctor>(`${environment.baseUrl}/users/${id}`);
  }

  addDoctor(doctor: IDoctor): Observable<IDoctor> {
    return this.http.post<IDoctor>(`${environment.baseUrl}/users`, doctor)
  }

  updateDoctor(id: string, newData: Partial<IDoctor>): Observable<IDoctor> {
    return this.http.patch<IDoctor>(`${environment.baseUrl}/users/${id}`, newData);
  }

  deleteDoctor(id: string): Observable<IDoctor> {
    return this.http.delete<IDoctor>(`${environment.baseUrl}/users/${id}`).pipe(
      map(deletedDoc => {
        const currentCount = this.Doctors.value;
        this.updateCount(currentCount > 0 ? currentCount - 1 : 0);
        return deletedDoc;
      })
    );
  }

  getDoctorsByFilters(term: string, filters: {
    fullName?: string,
    spec?: string,
    maxPrice?: number,
    day?: string
  }): Observable<IDoctor[]> {

    let url = `${environment.baseUrl}/users?role=doctor`;
    if (term) {
      url += `&name_contains=${term}`;
    }
    if (filters.fullName) {
      url += `&name_contains=${filters.fullName}`;
    }
    if (filters.spec) {
      url += `&specialization=${filters.spec}`;
    }
    if (filters.maxPrice) {
      url += `&price_lte=${filters.maxPrice}`;
    }

    return this.http.get<IDoctor[]>(url).pipe(
      map(doctors => {
        let filtered = doctors;
        if (filters.day) {
          filtered = doctors.filter(doc =>
            doc.availableSlots?.some(slot => slot.day === filters.day && !slot.isBooked)
          );
        }
        this.updateCount(filtered.length);
        return filtered;
      })
    );
  }

  getDoctorBySpecialization(specialization: string): Observable<IDoctor[]> {
    return this.http.get<IDoctor[]>(`${environment.baseUrl}/users/role=doctor&specialization=${specialization}`);
  }

  getNumberOfDoctorInLastMonth(doctors: IDoctor[]): IDoctor[] {
    const today = new Date();
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(today.getDate() - 30);

    return doctors.filter(doc => {
      const docDate = new Date(doc.createdAt);
      return docDate >= thirtyDaysAgo && docDate <= today;
    });
  }
}
