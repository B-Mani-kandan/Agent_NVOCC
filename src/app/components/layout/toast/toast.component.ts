import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastService } from '../../../services/toast.service';
import { CommonModule } from '@angular/common';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
})
export class ToastComponent {
  faCancel = faXmark;
  constructor(public toastService: ToastService) {}
}
