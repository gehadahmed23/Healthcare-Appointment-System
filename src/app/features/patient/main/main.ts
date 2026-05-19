import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/service/auth-service';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
   constructor(private router: Router,
      public authService: AuthService
    ) {
    this.router.events.subscribe(() => {
      const menu = document.getElementById('patientSidebar');
      if (menu && menu.classList.contains('show')) {
        menu.classList.remove('show');
      }
    });
  }
}
