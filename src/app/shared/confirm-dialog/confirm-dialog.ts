import { Component, inject } from '@angular/core';
import { ConfirmDialogService } from '../../core/service/confirm-dialog-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  private dialogService = inject(ConfirmDialogService);
  config: any = null;

  constructor() {
    this.dialogService.confirm$.subscribe(c => this.config = c);
  }

  onAction(status: boolean) {
    this.config.callback(status);
    this.config = null;
  }
}
