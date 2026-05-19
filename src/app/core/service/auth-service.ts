import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { IUser } from '../models/user';
import { IDoctor } from '../models/doctor';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { NotificationService } from './notification-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<IUser | IDoctor | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUser();
  }

  login(email: string, password: string): Observable<boolean> {

    return this.http.get<IUser[]>(`${environment.baseUrl}/users?email=${email}`).pipe(
      map((users: IUser[]) => {
        if (users.length > 0) {
          const user = users.find(u => u.password === password);
          if (user) {
            const token = "mock-jwt-token-" + btoa(user.email);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            this.userSubject.next(user);
            return true;
          }
          return false;
        }
        return false;
      })
    );

  }
  private loadUser() {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        this.userSubject.next(JSON.parse(savedUser));
      } catch (e) {
        this.logout();
      }
    }
  }

  getToken() { return localStorage.getItem('token'); }

  getRole() { return this.userSubject.value?.role; }

  isAuthenticated(): boolean { return !!this.getToken(); }

  logout() {
    localStorage.clear();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isDarkMode: boolean = false;

  ngOnInit(): void {

    const savedTheme = localStorage.getItem('theme') || 'light';
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme(savedTheme);
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const newTheme = this.isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    this.applyTheme(newTheme);
  }

  private applyTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
