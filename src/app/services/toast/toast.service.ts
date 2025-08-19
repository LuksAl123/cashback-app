import { Injectable } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class ToastService {

  private toastState = new BehaviorSubject<{message: string, type: string, visible: boolean}>({message: '', type: 'info', visible: false});

  toast$ = this.toastState.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 2500) {
    this.toastState.next({ message, type, visible: true });
    timer(duration).subscribe(() => this.toastState.next({ ...this.toastState.value, visible: false }));
  }
}