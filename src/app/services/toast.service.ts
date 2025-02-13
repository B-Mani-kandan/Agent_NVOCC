import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface Toast {
  type: 'success' | 'error' | 'warning' | 'info';
  icon: string;
  title: string;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toastSubject.asObservable();

  addToast(type: Toast['type'], title: string, text: string) {
    const icons = {
      success: 'fa-solid fa-circle-check',
      error: 'fa-solid fa-circle-exclamation',
      warning: 'fa-solid fa-triangle-exclamation',
      info: 'fa-solid fa-circle-info',
    };

    const newToast: Toast = {
      type,
      icon: icons[type],
      title,
      text,
    };

    const currentToasts = this.toastSubject.getValue();
    this.toastSubject.next([...currentToasts, newToast]);

    setTimeout(() => {
      this.removeToast(newToast);
    }, 5000);
  }

  removeToast(toastToRemove: Toast) {
    this.toastSubject.next(
      this.toastSubject.getValue().filter((t) => t !== toastToRemove)
    );
  }
}
