// import { Component, inject, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { SidebarComponent } from '../sidebar/sidebar.component';
// import { ToastService } from '../../../services/toast.service';

// @Component({
//   selector: 'app-layout',
//   template: `
//     <app-sidebar></app-sidebar>
//     <div class="content">
//       <router-outlet></router-outlet>
//     </div>
//   `,
//   styleUrls: ['./layout.component.css'],
//   standalone: true,
//   imports: [],
// })
// export class LayoutComponent implements OnInit {
//   router = inject(Router);

//   constructor(private toastService: ToastService) {}

//   ngOnInit(): void {}

//   showToast(type: 'success' | 'error' | 'warning' | 'info') {
//     this.toastService.addToast(
//       type,
//       type.charAt(0).toUpperCase() + type.slice(1),
//       `This is a ${type} toast.`
//     );
//   }
//   logout() {
//     localStorage.clear();
//   }
// }

import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterModule, TopbarComponent],
})
export class LayoutComponent {
  isSidebarExpanded = true;

  adjustContent(isExpanded: boolean) {
    this.isSidebarExpanded = isExpanded;
  }
}
