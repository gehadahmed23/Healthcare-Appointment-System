import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private confirmSubject = new Subject<{ title: string, message: string, callback: (res: boolean) => void }>();
  confirm$ = this.confirmSubject.asObservable();
  confirm(title: string, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmSubject.next({
        title,
        message,
        callback: (res: boolean) => resolve(res)
      });
    });
  }
}
