import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/service/auth-service';
import { IUser } from '../../../core/models/user';
import { IDoctor } from '../../../core/models/doctor';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { NotificationService } from '../../../core/service/notification-service';
import { INotification } from '../../../core/models/inotification';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  notifications: INotification[] = [];
  unreadCount = 0;
  isClinicOpen = false;
  role?: string;
  isLogin: boolean = false
  isDarkMode: boolean = false;

  constructor(public authService: AuthService,
    private router: Router,
    private notifService: NotificationService) { }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user && user.id) {
        this.notifService.loadNotifications(user.id);
        this.role = user.role;
        this.isLogin = true
      }
      else
        this.isLogin = false
      this.notifService.notifications$.subscribe(list => {
        console.log('Notifications loaded for this user:', list);
        this.notifications = list;
        this.unreadCount = list.filter(n => n.status === 'unread').length;
      });
    });

    const savedTheme = localStorage.getItem('theme') || 'light';
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme(savedTheme);
  }

  toggleClinic() {
    this.isClinicOpen = !this.isClinicOpen;
  }


  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  clearAll() {
    this.authService.user$.subscribe(user => {
      if (user && user.id) {
        if (confirm('Are you sure you want to clear your notifications?')) {
          this.notifService.clearAll(user.id);
        }
      }
    });
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
