import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './main.html',
  styleUrl: './main.css',
})
export class Main {
  isDoctorsOpen = false;
  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const menu = document.getElementById('adminSidebar');
      if (menu && menu.classList.contains('show')) {
        menu.classList.remove('show');
      }
    });
  }
  toggleDoctors() {
    this.isDoctorsOpen = !this.isDoctorsOpen;
  }
}
