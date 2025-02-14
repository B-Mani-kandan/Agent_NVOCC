import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [],
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
  logout() {
    localStorage.clear();
  }
}
