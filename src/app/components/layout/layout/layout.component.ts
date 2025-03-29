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
