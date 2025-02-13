import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastComponent } from '../toast/toast.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [ToastComponent], // ✅ Ensure ToastComponent is imported correctly
})
export class LayoutComponent implements OnInit {
  router = inject(Router);

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {}

  showToast(type: 'success' | 'error' | 'warning' | 'info') {
    this.toastService.addToast(
      type,
      type.charAt(0).toUpperCase() + type.slice(1),
      `This is a ${type} toast.`
    );
  }
}
