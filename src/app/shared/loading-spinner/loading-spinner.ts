import { AsyncPipe, CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SpinnerService } from '../../core/service/spinner-service';

@Component({
  selector: 'app-loading-spinner',
  imports: [CommonModule, AsyncPipe],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.css',
})
export class LoadingSpinner {

  constructor(public spinnerService: SpinnerService) { }
}
