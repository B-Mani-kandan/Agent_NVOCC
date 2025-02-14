import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import {
  faCircleExclamation,
  faTriangleExclamation,
  faCircleInfo,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

interface Toast {
  type: 'success' | 'error' | 'warning' | 'info';
  icon: IconDefinition;
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
    const icons: Record<Toast['type'], IconDefinition> = {
      success: faThumbsUp,
      error: faCircleExclamation,
      warning: faTriangleExclamation,
      info: faCircleInfo,
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
