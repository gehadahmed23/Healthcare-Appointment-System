import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';
import { LoadingSpinner } from "./shared/loading-spinner/loading-spinner";
import { ConfirmDialog } from "./shared/confirm-dialog/confirm-dialog";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Navbar, Footer, LoadingSpinner, ConfirmDialog],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Healthcare-Appointment-System');
}
