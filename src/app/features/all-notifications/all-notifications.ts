import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { INotification } from '../../core/models/inotification';
import { NotificationService } from '../../core/service/notification-service';
import { AuthService } from '../../core/service/auth-service';
import { ConfirmDialogService } from '../../core/service/confirm-dialog-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-notifications',
  imports: [CommonModule],
  templateUrl: './all-notifications.html',
  styleUrl: './all-notifications.css',
})
export class AllNotifications implements OnInit {
  notifications: INotification[] = [];

  constructor(
    private notifService: NotificationService,
    private authService: AuthService,
    private confirmService: ConfirmDialogService,
    private Toast: ToastrService
  ) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.notifService.loadNotifications(user.id);
      }
    });

    this.notifService.notifications$.subscribe(list => {
      this.notifications = list;
    });
  }
  async clearAll() {
    const confirmed = await this.confirmService.confirm(
      'Delete All Notifications',
      'Are you sure you want to clear all your notifications? This action cannot be undone.'
    );
    if (confirmed) {
      this.authService.user$.subscribe({
        next: (user) => {
          if (user && user.id) {
            console.log('confirm = ', confirm);
            if (confirmed) {
              this.notifService.clearAll(user.id);
              this.notifService.loadNotifications(user.id);
            }
          }
        },
        error: (err) => {
          this.Toast.error("Faild To Confirm Delete")
        }
      });
    }
  }
}
