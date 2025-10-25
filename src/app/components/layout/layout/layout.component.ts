import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  standalone: true,
  imports: [CommonModule, SidebarComponent, RouterModule, TopbarComponent],
})
export class LayoutComponent implements OnInit {
  isSidebarExpanded = true;
  showSidebar = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.showSidebar = params['noSidebar'] !== 'true';
    });
  }

  adjustContent(isExpanded: boolean) {
    this.isSidebarExpanded = isExpanded;
  }
}
